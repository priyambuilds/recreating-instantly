from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Annotated
from datetime import datetime, timedelta
import jwt

from app.core.db.database_async import get_async_db as db
from app.core.utils.hash import hash, verify
from app.core.configs import settings
from app.schemas.users import UserPublicSchema, UserPrivateSchema, UserCreateSchema, UserUpdateSchema, UserReadInDBSchema, UserDeleteSchema
from app.models.users import UserBase
from app.core.security import create_access_token, get_current_user, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme


users_router = APIRouter(
    prefix="/user",
    tags=["users"],
    dependencies=[Depends(db)]
)




async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    result = await db.execute(select(UserBase).where(UserBase.username == username))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user


## CURD Operations for User

    
@users_router.post("/signup", response_model=UserReadInDBSchema, status_code=201)
async def signup(
    request: Request, user: UserCreateSchema, db: AsyncSession = Depends(db)
) -> UserReadInDBSchema:
    
    # Type Checkings
    email_result = await db.execute(select(UserBase).where(UserBase.email == user.email))
    email_check = email_result.scalar_one_or_none()
    if email_check:
        raise DuplicateValueException("Email is already registered")

    username_result = await db.execute(select(UserBase).where(UserBase.username == user.username))
    username_check = username_result.scalar_one_or_none()
    if username_check:
        raise DuplicateValueException("username is already taken")

    phone_result = await db.execute(select(UserBase).where(UserBase.phone == user.phone))
    phone_check = phone_result.scalar_one_or_none()
    if phone_check:
        raise DuplicateValueException("Phone Number already exists")

    same_password = user.password == user.fullname or user.password == user.username
    if same_password:
        raise HTTPException("Password cannot contain values from username or fullname")

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
        email_verified=True,
        phone_verified=True,
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
    return user_signup


# Update user
@users_router.put("/update", response_model=UserReadInDBSchema)
async def update_user(confirmation: str, user_update: UserUpdateSchema, db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    verify_confirmation = confirmation == user.email
    if not verify_confirmation:
        return {"Email does not match"}
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user

# Update password
@users_router.put("/update-password/{email}")
async def update_password(email: str, password: str, db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    result = await db.execute(select(UserBase).where(UserBase.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = hash(password)
    await db.commit()
    return {"msg": "Password updated"}

# Read current user
@users_router.get("/me", response_model=UserReadInDBSchema)
async def read_current_user(current_user: UserBase = Depends(get_current_user)):
    return current_user

# Read user by email
@users_router.get("/read/{email}", response_model=UserReadInDBSchema)
async def read_user(email: str, db: AsyncSession = Depends(db)):
    result = await db.execute(select(UserBase).where(UserBase.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Delete user
class DeleteUserConfirmSchema(BaseModel):
    password: str

@users_router.delete("/delete/me")
async def delete_user(
    confirm: DeleteUserConfirmSchema,
    db: AsyncSession = Depends(db),
    current_user: UserBase = Depends(get_current_user)
):
    # Verify password
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
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

# Logout (stateless JWT, so just client-side token removal)
@users_router.post("/logout")
async def logout():
    return {"msg": "Logout successful. Please remove your token on the client."}

# Read all users (admin/internal)
@users_router.get("/read-internal", response_model=list[UserReadInDBSchema])
async def read_all_users(db: Annotated[AsyncSession, Depends(db)], current_user: UserBase = Depends(get_current_user)):
    result = await db.execute(select(UserBase))
    users = result.scalars().all()
    return users




# - Rate limit login attempts and use CAPTCHA after several failures.
# - Store and check login IP history, and require re-authentication if location changes.
# - Use JWT with short expiry and refresh tokens for session management.
# 2FA