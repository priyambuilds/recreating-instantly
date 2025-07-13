from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime


class UserPublicSchema(BaseModel):
    id: int
    fullname: constr(max_length=40, pattern=r"^[A-Za-z\s]+$") = Field(..., examples=["Walter Heartwell White"])
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$") = Field(..., examples=["user@gmail.com"])
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")] = Field(None, examples=["+1234567890"])

    class Config:
        orm_mode = True


class UserPrivateSchema(UserPublicSchema): 
    hashed_password: str
    user_created_at: datetime
    is_active: bool
    email_verified: bool
    phone_verified: bool
    subscription: constr(min_length=2, max_length=20, pattern=r"^[A-Za-z]+$")
    sub_started_at: datetime
    sub_ends_at: datetime
    last_login: Optional[datetime]
    os_info: Optional[str]
    location: Optional[str]



# User Login Schema
class UserLoginSchema(BaseModel):
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    password: constr(min_length=8, max_length=128)


# CRUD Schemas for user

class UserCreateSchema(BaseModel):
    fullname: constr(min_length=2, max_length=50, pattern=r"^[A-Za-z\s]+$")
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]
    password: constr(min_length=8, max_length=128)
    user_created_at: datetime
    is_active: bool
    email_verified: bool
    phone_verified: bool
    subscription: constr(min_length=2, max_length=20, pattern=r"^[A-Za-z]+$")
    last_login: Optional[datetime]
    os_info: Optional[str]
    location: Optional[str]

class UserUpdateSchema(BaseModel):
    fullname: Optional[constr(min_length=2, max_length=50, pattern=r"^[A-Za-z\s]+$")]
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]
    password: Optional[constr(min_length=8, max_length=128)]
    # You can add more fields as needed for update

class UserReadInDBSchema(BaseModel):
    id: int
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    fullname: constr(min_length=2, max_length=50, pattern=r"^[A-Za-z\s]+$")
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]
    hashed_password: str
    user_created_at: datetime
    is_active: bool
    email_verified: bool
    phone_verified: bool
    subscription: constr(min_length=2, max_length=20, pattern=r"^[A-Za-z]+$")
    sub_started_at: datetime
    sub_ends_at: datetime
    last_login: Optional[datetime]
    os_info: Optional[str]
    location: Optional[str]

    class Config:
        orm_mode = True

class UserDeleteSchema(BaseModel):
    id: int
    fullname: constr(max_length=40, pattern=r"^[A-Za-z\s]+$")
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]

    class Config:
        orm_mode = True

