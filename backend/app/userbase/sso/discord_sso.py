import httpx
from fastapi import FastAPI, Cookie, Request, APIRouter, HTTPException, Depends, status

from fastapi.responses import RedirectResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta

from app.core.security import create_access_token, oauth2_scheme, ACCESS_TOKEN_EXPIRE_DAYS, SECRET_KEY, ALGORITHM
from app.core.configs import settings
from app.core.db.database_async import get_async_db as db
from app.userbase.sso.models import SSOUserBase
from app.userbase.users.models import UserBase
from app.userbase.sso.schemas import UserDiscordSSOSchema


sso_router = APIRouter(
    prefix="/user/sso",
    tags=["sso"],
)


DISCORD_CLIENT_ID = settings.DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET = settings.DISCORD_CLIENT_SECRET
DISCORD_REDIRECT_URI=settings.DISCORD_REDIRECT_URI
DISCORD_USER_URL = settings.DISCORD_USER_URL
DISCORD_TOKEN_URL = settings.DISCORD_TOKEN_URL
DISCORD_AUTH_URL = settings.DISCORD_AUTH_URL



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
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception as e:
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

    # Update last active
    user.last_login = datetime.utcnow()
    await db.commit()

    # IP/location check
    if request:
        x_forwarded_for = request.headers.get("x-forwarded-for")
        current_ip = x_forwarded_for.split(",")[0].strip() if x_forwarded_for else request.client.host
        if user.location and user.location != current_ip:
            raise HTTPException(status_code=401, detail="Location changed, please login again.")

    return user



@sso_router.get("/discord/login")
async def discord_login():
    try:
        url = (
            f"{DISCORD_AUTH_URL}?response_type=code"
            f"&client_id={DISCORD_CLIENT_ID}"
            f"&scope=identify%20email"
            f"&redirect_uri={DISCORD_REDIRECT_URI}"
            f"&prompt=consent"
        )
    except:
        raise HTTPException(status_code=500, detail="Error generating Discord login URL")
    return RedirectResponse(url)



@sso_router.get("/discord/callback")
async def discord_callback(request: Request, db: AsyncSession = Depends(db)):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    # Exchange code for access token
    data = {
        "client_id": DISCORD_CLIENT_ID,
        "client_secret": DISCORD_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": DISCORD_REDIRECT_URI,
        "scope": "identify email"
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(DISCORD_TOKEN_URL, data=data, headers=headers)
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Discord token exchange failed")
        token_json = token_resp.json()
        access_token = token_json["access_token"]

        # Get user info from Discord
        user_headers = {"Authorization": f"Bearer {access_token}"}
        user_resp = await client.get(DISCORD_USER_URL, headers=user_headers)
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Discord user info")
        user_json = user_resp.json()


        # Try to get os_info and location from user_json, fallback to request headers and client IP
        os_info = user_json.get("os_info") or request.headers.get("user-agent", "unknown")
        location_ip = user_json.get("location") or request.headers.get("x-forwarded-for")
        if location_ip:
            location_ip = location_ip.split(",")[0].strip()
        else:
            location_ip = request.client.host

        # Check for existing user by email or username in SSOUserBase or UserBase
        email = user_json.get("email")
        username = user_json.get("username")
        existing_sso = await db.execute(select(SSOUserBase).where((SSOUserBase.email == email) | (SSOUserBase.username == username)))
        sso_user = existing_sso.scalar_one_or_none()
        existing_user = await db.execute(select(UserBase).where((UserBase.email == email) | (UserBase.username == username)))
        userbase_user = existing_user.scalar_one_or_none()
        if sso_user or userbase_user:
            # Update last_login for existing user
            user_obj = sso_user if sso_user else userbase_user
            user_obj.last_login = datetime.utcnow()
            await db.commit()
            jwt_token = create_access_token(data={"sub": user_obj.username}, expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
            response = RedirectResponse(url="http://localhost:8000/docs")
            response.set_cookie(
                key="access_token",
                value=jwt_token,
                httponly=True,
                secure=True,  # Set to True in production
                samesite="lax",
                max_age=settings.ACCESS_TOKEN_MAX_AGE

            )
            return response
        # Create new SSO user
        user_save = SSOUserBase(
            email=email,
            username=username,
            fullname=user_json.get("global_name") or username,
            user_created_at=datetime.utcnow(),
            is_active=True,
            email_verified=True,
            phone_verified=False,
            subscription="FreeTier",
            sub_started_at=datetime.utcnow(),
            sub_ends_at=datetime.utcnow() + timedelta(days=30),
            login_type="Discord SSO",
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
            secure=True,  # Set to True in production
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_MAX_AGE
        )
        return response

