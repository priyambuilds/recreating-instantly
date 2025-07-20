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
from app.userbase.users.schemas import UserPublicSchema, UserPrivateSchema, UserCreateSchema, UserUpdateSchema, UserReadInDBSchema, UserDeleteSchema
from app.userbase.users.models import UserBase
from app.core.security import create_access_token, get_current_user, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme


useradmin_router = APIRouter(
    prefix="/admin/users",
    tags=["Users Admin"],
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
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    result = await db.execute(select(UserBase).where(UserBase.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user




@useradmin_router.get("/readall", response_model=list[UserPublicSchema])
async def read_all_users(db: AsyncSession = Depends(db)):
    result = await db.execute(select(UserBase))
    users = result.scalars().all()
    return users

# Delete user

class DeleteUserConfirmSchema(BaseModel):
    delete: bool


@useradmin_router.delete("/delete/me")
async def delete_user(
    confirm: DeleteUserConfirmSchema,
    email: str,
    db: AsyncSession = Depends(db),
):
    # Delete confirmations
    if not confirm.delete:
        raise HTTPException(status_code=400, detail="Deletion cancelled")
    result = await db.execute(select(UserBase).where(UserBase.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="email not found")
    # Delete user
    await db.delete(user)
    await db.commit()
    return {"msg": "User deleted"}




# - Rate limit login attempts and use CAPTCHA after several failures.
# - Store and check login IP history, and require re-authentication if location changes.
# - Use JWT with short expiry and refresh tokens for session management.
# 2FA