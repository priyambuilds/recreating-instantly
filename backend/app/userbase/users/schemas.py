from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime


class UserPublicSchema(BaseModel):
    id: int
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$") = Field(..., examples=["user@gmail.com"])
    username: constr(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$") = Field(..., example="Heisenburg_801")
    fullname: constr(max_length=100) = Field(..., examples=["Walter Heartwell White"])
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")] = Field(None, examples=["+1234567890"])

    class Config:
        orm_mode = True


class UserPrivateSchema(UserPublicSchema): 
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

class UserHashedPassword(UserPublicSchema):
    hashed_password: str

# User Login Schema
class UserLoginSchema(BaseModel):
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    username: constr(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$") = Field(..., example="Heisenburg_801")
    password: constr(min_length=8, max_length=128)


# CRUD Schemas for user

class UserCreateSchema(BaseModel):
    email: constr(min_length=6, max_length=64, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$") = Field(..., examples=["heisenburg@gmail.com"])
    username: constr(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$") = Field(..., example="Heisenburg_801")
    fullname: constr(min_length=2, max_length=100) = Field(None, examples=["Walter Heartwell White"])
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]= Field(None, examples=["+919988776655"])
    password: constr(min_length=8, max_length=64, pattern=r"^[^\s]+$")= Field(..., examples=["VeryStrongPassword"])

    @classmethod
    def validate_fullname(cls, value):
        if len(value.split()) > 5:
            raise ValueError("Fullname is too long or contains too many words.")
        return value


class UserUpdateSchema(BaseModel):
    username: constr(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$") = Field(..., example="Heisenburg_801")
    fullname: Optional[constr(min_length=2, max_length=100)]
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]


class UserReadInDBSchema(BaseModel):
    id: int
    email: constr(min_length=6, max_length=100, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    username: constr(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$") = Field(..., example="Heisenburg_801")
    fullname: constr(min_length=2, max_length=100)
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]
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
    email: constr(min_length=6, max_length=254, pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    username: constr(min_length=3, max_length=100) = Field(..., example="Heisenburg_801 ")
    fullname: constr(max_length=40, pattern=r"^[A-Za-z\s]+$")
    phone: Optional[constr(min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")]

    class Config:
        orm_mode = True

