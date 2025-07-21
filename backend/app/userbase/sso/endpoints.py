from fastapi import FastAPI, Request, APIRouter, HTTPException, Depends
from fastapi_sso.sso.discord import DiscordSSO
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.configs import settings
from app.core.db.database_async import get_async_db as db
from app.userbase.sso.models import SSOUserBase
from app.userbase.sso.schemas import UserDiscordSSOSchema


sso_router = APIRouter(
    prefix="/user/sso",
    tags=["sso"],
)


discord_sso = DiscordSSO(
    client_id=settings.DISCORD_CLIENT_ID,
    client_secret=settings.DISCORD_CLIENT_SECRET,
    redirect_uri=settings.DISCORD_REDIRECT_URI,
    allow_insecure_http=True,
)


@sso_router.get("/discord/login")
async def discord_init():
    
    with discord_sso:
        return await discord_sso.get_login_redirect()


@sso_router.get("/discord/callback")
async def discord_callback(request: Request, db: AsyncSession = Depends(db)):
    """Handle Discord callback and process user data"""
    async with discord_sso:
        user = await discord_sso.verify_and_process(request)
        if not user:
            raise HTTPException(status_code=401, detail="SSO failed")

        # Get OS info and location from request headers
        user_agent = request.headers.get("user-agent", "unknown")
        x_forwarded_for = request.headers.get("x-forwarded-for")
        ip = x_forwarded_for.split(",")[0].strip() if x_forwarded_for else request.client.host
        location = ip  # Replace with actual location later

        user_save = SSOUserBase(
            email=user.email,
            username=user.display_name,
            fullname=user.display_name,
            hashed_password="sso_login",
            user_created_at=datetime.utcnow(),
            is_active=True,
            email_verified=True,
            phone_verified=False,
            subscription="FreeTier",
            sub_started_at=datetime.utcnow(),
            sub_ends_at=datetime.utcnow() + timedelta(days=30),
            last_login=datetime.utcnow(),
            os_info=user_agent,
            location=location
        )
        db.add(user_save)
        await db.commit()
        await db.refresh(user_save)

        # Issue JWT token for SSO user
        access_token = create_access_token(
            data={"sub": user_save.username},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user_save.email,
                "username": user_save.username,
                "fullname": user_save.fullname,
                "phone": user_save.phone,
                "user_created_at": user_save.user_created_at,
                "is_active": user_save.is_active,
                "email_verified": user_save.email_verified,
                "phone_verified": user_save.phone_verified,
                "subscription": user_save.subscription,
                "sub_started_at": user_save.sub_started_at,
                "sub_ends_at": user_save.sub_ends_at,
                "last_login": user_save.last_login,
                "os_info": user_save.os_info,
                "location": user_save.location
            }
        }