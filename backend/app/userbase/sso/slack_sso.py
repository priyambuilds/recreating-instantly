import httpx
from fastapi import Request, APIRouter, HTTPException, Depends, status, Cookie
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta

from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_DAYS, SECRET_KEY, ALGORITHM
from app.core.configs import settings
from app.core.db.database_async import get_async_db as db
from app.userbase.sso.models import SSOUserBase
from app.userbase.users.models import UserBase

sso_router = APIRouter(
    prefix="/user/sso",
    tags=["sso"],
)

SLACK_CLIENT_ID = settings.SLACK_CLIENT_ID
SLACK_CLIENT_SECRET = settings.SLACK_CLIENT_SECRET
SLACK_REDIRECT_URI = settings.SLACK_REDIRECT_URI
SLACK_AUTH_URL = settings.SLACK_AUTH_URL
SLACK_TOKEN_URL = settings.SLACK_TOKEN_URL
SLACK_USERINFO_URL = settings.SLACK_USERINFO_URL

def get_token_from_cookie(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No cookies found, Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return access_token

async def get_current_user(token: str = Depends(get_token_from_cookie), db: AsyncSession = Depends(db), request: Request = None):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials(get_current_user_exception)",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        import jwt
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    result = await db.execute(select(UserBase).where(UserBase.username == username))
    user = result.scalars().first()
    if user is None:
        result = await db.execute(select(SSOUserBase).where(SSOUserBase.username == username))
        user = result.scalars().first()
    if user is None:
        raise credentials_exception

    SESSION_TTL_DAYS = settings.SESSION_TTL_DAYS
    if user.last_login and (datetime.utcnow() - user.last_login) > timedelta(days=SESSION_TTL_DAYS):
        raise HTTPException(status_code=401, detail="7 Days of inactivity, please login again.")

    user.last_login = datetime.utcnow()
    await db.commit()

    if request:
        x_forwarded_for = request.headers.get("x-forwarded-for")
        current_ip = x_forwarded_for.split(",")[0].strip() if x_forwarded_for else request.client.host
        if user.location and user.location != current_ip:
            raise HTTPException(status_code=401, detail="Location changed, please login again.")

    return user

@sso_router.get("/slack/login")
async def slack_login():
    url = (
        f"{SLACK_AUTH_URL}?client_id={SLACK_CLIENT_ID}"
        f"&scope=identity.basic,identity.email"
        f"&redirect_uri={SLACK_REDIRECT_URI}"
    )
    return RedirectResponse(url)

@sso_router.get("/slack/callback")
async def slack_callback(request: Request, db: AsyncSession = Depends(db)):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    data = {
        "client_id": SLACK_CLIENT_ID,
        "client_secret": SLACK_CLIENT_SECRET,
        "code": code,
        "redirect_uri": SLACK_REDIRECT_URI
    }
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(SLACK_TOKEN_URL, data=data)
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Slack token exchange failed")
        token_json = token_resp.json()
        access_token = token_json.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access_token returned by Slack")

        user_headers = {"Authorization": f"Bearer {access_token}"}
        user_resp = await client.get(SLACK_USERINFO_URL, headers=user_headers)
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Slack user info")
        user_json = user_resp.json().get("user", {})

        os_info = request.headers.get("user-agent", "unknown")
        location_ip = request.headers.get("x-forwarded-for")
        if location_ip:
            location_ip = location_ip.split(",")[0].strip()
        else:
            location_ip = request.client.host

        email = user_json.get("email")
        username = email.split("@")[0] if email else None
        existing_sso = await db.execute(select(SSOUserBase).where((SSOUserBase.email == email) | (SSOUserBase.username == username)))
        sso_user = existing_sso.scalar_one_or_none()
        existing_user = await db.execute(select(UserBase).where((UserBase.email == email) | (UserBase.username == username)))
        userbase_user = existing_user.scalar_one_or_none()
        if sso_user or userbase_user:
            user_obj = sso_user if sso_user else userbase_user
            user_obj.last_login = datetime.utcnow()
            await db.commit()
            jwt_token = create_access_token(data={"sub": user_obj.username}, expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
            response = RedirectResponse(url="http://localhost:8000/docs")
            response.set_cookie(
                key="access_token",
                value=jwt_token,
                httponly=True,
                secure=True,
                samesite="lax",
                max_age=settings.ACCESS_TOKEN_MAX_AGE
            )
            return response
        user_save = SSOUserBase(
            email=email,
            username=username,
            fullname=user_json.get("name") or username,
            user_created_at=datetime.utcnow(),
            is_active=True,
            email_verified=True,
            phone_verified=False,
            subscription="FreeTier",
            sub_started_at=datetime.utcnow(),
            sub_ends_at=datetime.utcnow() + timedelta(days=30),
            login_type="Slack SSO",
            last_login=datetime.utcnow(),
            os_info=os_info,
            location=location_ip
        )
        db.add(user_save)
        await db.commit()
        await db.refresh(user_save)

        jwt_token = create_access_token(data={"sub": user_save.username}, expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
        response = RedirectResponse(url="http://localhost:8000/docs")
        response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_MAX_AGE
        )
        return response
