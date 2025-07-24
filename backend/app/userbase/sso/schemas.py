from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime


class UserPublicSchema(BaseModel):
    id: int
    email: str
    username: str
    fullname: constr(min_length=1, max_length=100)
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class UserPrivateSchema(UserPublicSchema): 
    user_created_at: datetime
    is_active: bool
    email_verified: bool
    phone_verified: bool
    subscription: constr(min_length=2, max_length=20, pattern=r"^[A-Za-z]+$")
    sub_started_at: datetime
    sub_ends_at: datetime
    login_type: str
    last_login: Optional[datetime]
    os_info: Optional[str]
    location: Optional[str]



class UserDiscordSSOSchema(BaseModel):
    email: EmailStr
    username: str
    fullname: constr(min_length=1, max_length=100)
    phone: Optional[str] = None
    user_created_at: datetime
    is_active: bool
    email_verified: bool
    phone_verified: bool
    subscription: constr(min_length=2, max_length=20, pattern=r"^[A-Za-z]+$")
    sub_started_at: datetime
    sub_ends_at: datetime
    login_type: str
    last_login: Optional[datetime] = None
    os_info: Optional[str] = None
    location: Optional[str] = None

    class Config:
        from_attributes = True