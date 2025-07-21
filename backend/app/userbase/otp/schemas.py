from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional

class OTPBaseSchema(BaseModel):
    id: int
    email: EmailStr = Field(..., examples=["user@gmail.com"])
    otp_sent: constr(min_length=4, max_length=8, pattern=r"^\d{4,8}$") = Field(..., examples=["123456"])
    otp_verified: bool

    class Config:
        orm_mode = True

class OTPCreateSchema(BaseModel):
    email: EmailStr
    otp_sent: constr(min_length=4, max_length=8, pattern=r"^\d{4,8}$")

class OTPVerifySchema(BaseModel):
    email: EmailStr
    otp_sent: constr(min_length=4, max_length=8, pattern=r"^\d{4,8}$")
