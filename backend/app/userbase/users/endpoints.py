from app.core.security import create_access_token, get_current_user, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_DAYS, oauth2_scheme
from fastapi import APIRouter, Depends, Request, HTTPException, status, Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Annotated
from datetime import datetime, timedelta
from jose import jwt

from app.core.db.database_async import get_async_db as db
from app.core.utils.hash import hash, verify
from app.core.configs import settings
from app.core.exceptions.exception import DuplicateValueException
from app.userbase.users.schemas import UserPublicSchema, UserPrivateSchema, UserCreateSchema, UserUpdateSchema, UserReadInDBSchema, UserDeleteSchema
from app.userbase.users.models import UserBase
from app.userbase.sso.models import SSOUserBase
from app.userbase.otp.endpoints import create_and_send_otp


users_router = APIRouter(
    prefix="/user",
    tags=["users"]
)


def get_token_from_cookie(access_token: str = Cookie(None)):
    import logging
    logger = logging.getLogger("uvicorn.error")
    logger.info(f"Cookie access_token: {access_token}")
    if not access_token:
        logger.warning("No access_token cookie found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No cookies found, Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return access_token


async def get_current_user(token: str = Depends(get_token_from_cookie), db: AsyncSession = Depends(db), request: Request = None):
    import logging
    logger = logging.getLogger("uvicorn.error")
    logger.info(f"get_current_user received token: {token}")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials(get_current_user_exception)",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        logger.info(f"Decoded JWT, sub={username}")
        if username is None:
            logger.warning("JWT missing sub claim")
            raise credentials_exception
    except Exception as e:
        logger.error(f"JWT decode error: {e}")
        raise credentials_exception
    try:
        result = await db.execute(select(UserBase).where(UserBase.username == username))
        user = result.scalar_one_or_none()
    except Exception as e:
        if "MultipleResultsFound" in str(type(e)):
            logger.error("Multiple users found for the same username/email")
            raise HTTPException(status_code=400, detail="User/email already exists. Please contact support.")
        else:
            logger.error(f"UserBase query error: {e}")
            raise credentials_exception
    if user is None:
        try:
            result = await db.execute(select(SSOUserBase).where(SSOUserBase.username == username))
            user = result.scalar_one_or_none()
        except Exception as e:
            if "MultipleResultsFound" in str(type(e)):
                logger.error("Multiple SSO users found for the same username/email")
                raise HTTPException(status_code=400, detail="User/email already exists. Please contact support.")
            else:
                logger.error(f"SSOUserBase query error: {e}")
                raise credentials_exception
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


async def get_current_active_user(current_user: UserBase = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


## CURD Operations for User
    
@users_router.post("/signup", response_model=UserReadInDBSchema, status_code=201)
async def signup(
    request: Request, user: UserCreateSchema, db: AsyncSession = Depends(db)
) -> UserReadInDBSchema:
    
    # Type Checkings
    email_result = await db.execute(select(UserBase).where(UserBase.email == user.email))
    email_check = email_result.scalar_one_or_none()
    if email_check:
        raise HTTPException(status_code=400, detail="Email is already registered")

    username_result = await db.execute(select(UserBase).where(UserBase.username == user.username))
    username_check = username_result.scalar_one_or_none()
    if username_check:
        raise HTTPException(status_code=400, detail="username is already taken")

    phone_result = await db.execute(select(UserBase).where(UserBase.phone == user.phone))
    phone_check = phone_result.scalar_one_or_none()
    if phone_check:
        raise HTTPException(status_code=400, detail="Phone Number already exists")

    same_password = user.password == user.fullname or user.password == user.username
    if same_password:
        raise HTTPException(status_code=400, detail="Password cannot contain values from username or fullname")

    # Hash the password from the request
    hashed_password = hash(user.password)

    # Get OS info and location from request headers
    user_agent = request.headers.get("user-agent", "unknown")
    x_forwarded_for = request.headers.get("x-forwarded-for")
    ip = x_forwarded_for.split(",")[0].strip() if x_forwarded_for else request.client.host
    location = ip  # Replace with actual location later

    # Create the user instance (set only fields that exist in the model)
    user_signup = UserBase(
        email=user.email,
        username=user.username,
        fullname=user.fullname,
        phone=user.phone,
        hashed_password=hashed_password,
        user_created_at=datetime.utcnow(),
        is_active=True,
        email_verified=False,
        phone_verified=False,
        subscription="FreeTier",
        sub_started_at=datetime.utcnow(),
        sub_ends_at=datetime.utcnow() + timedelta(days=30),
        last_login=datetime.utcnow(),
        os_info=user_agent,
        location=location,
    )
    db.add(user_signup)
    await db.commit()
    await db.refresh(user_signup)


    # After creating the user and committing to db:
    await create_and_send_otp(user.email, db)

    return user_signup


# Update user
@users_router.put("/update", response_model=UserReadInDBSchema)
async def update_user(email_confirmation: str, user_update: UserUpdateSchema, db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    await get_current_active_user(current_user)
    verify_confirmation = email_confirmation == current_user.email
    if not verify_confirmation:
        return {"Email does not match"}
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user

# Update password
@users_router.put("/update-password/{email}")
async def update_password(email: str, old_password: str, new_password: str, db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    await get_current_active_user(current_user)
    result = await db.execute(select(UserBase).where(UserBase.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    password_check = verify(old_password, current_user.hashed_password)
    if not password_check:
        raise HTTPException(status_code=400, detail="Incorrect old password")
    user.hashed_password = hash(new_password)
    await db.commit()
    return {"msg": "Password updated"}

# Read current user
@users_router.get("/me", response_model=UserReadInDBSchema)
async def read_current_user(current_user: UserBase = Depends(get_current_user)):
    await get_current_active_user(current_user)
    return current_user

# Read user by username
@users_router.get("/read/{username}", response_model=UserReadInDBSchema)
async def read_user(username: str, db: AsyncSession = Depends(db)):
    result = await db.execute(select(UserBase).where(UserBase.username == username))
    user = result.scalar_one_or_none()
    await get_current_active_user(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Delete user
class DeleteUserConfirmSchema(BaseModel):
    password: str
    comfirm_password: str
    delete_account: bool

@users_router.delete("/delete/me")
async def delete_user(
    confirm: DeleteUserConfirmSchema,
    db: AsyncSession = Depends(db),
    current_user: UserBase = Depends(get_current_user)
):
    # Verify password
    if confirm.delete_account is not True:
        raise HTTPException(status_code=400, detail="Account deletion not confirmed")
    if confirm.password != confirm.comfirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not verify(confirm.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password for confirmation")
    # Delete user
    await db.delete(current_user)
    await db.commit()
    return {"msg": "User deleted"}

# Login
@users_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(db)):
    result = await db.execute(select(UserBase).where(UserBase.username == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    return {"access_token": access_token, "token_type": "bearer"}

# Logout (stateless JWT, so just client-side token removal)
@users_router.post("/logout")
async def logout():
    return {"msg": "Logout successful. Please remove your token on the client."}

# Disable
@users_router.post("/disable")
async def disable_user(password: str, db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    if not verify(password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    current_user.is_active = False
    await db.commit()
    return {"msg": "User account disabled"}

# Enable
@users_router.post("/enable")
async def enable_user(password: str, db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    if not verify(password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    current_user.is_active = True
    await db.commit()
    return {"msg": "User account Enabled"}





# - Rate limit login attempts and use CAPTCHA after several failures.
# - Store and check login IP history, and require re-authentication if location changes.
# - Use JWT with short expiry and refresh tokens for session management.
# 2FA
