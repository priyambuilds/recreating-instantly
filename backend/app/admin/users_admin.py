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
    except jwt.PyJWTError:
        raise credentials_exception
    result = await db.execute(select(UserBase).where(UserBase.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user




@users_router.get("/readall", response_model=UserPublicSchema)
def read_all_users(db: AsyncSession = Depends(db), current_user: UserBase = Depends(get_current_user)):
    result = db.execute(select(UserBase))
    users = result.scalars().all()
    return users

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


'''
# Login
@users_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(db)):
    result = await db.execute(select(UserBase).where(UserBase.email == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
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

'''


# - Rate limit login attempts and use CAPTCHA after several failures.
# - Store and check login IP history, and require re-authentication if location changes.
# - Use JWT with short expiry and refresh tokens for session management.
# 2FA