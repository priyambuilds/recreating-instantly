from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime

class OTPBaseSchema(BaseModel):
    id: int
    email: EmailStr = Field(..., examples=["user@gmail.com"])
    otp_code: int = Field(..., ge=1000, le=9999)
    otp_expires_at: datetime
    otp_sent: constr(min_length=4, max_length=8, pattern=r"^\d{4,8}$") = Field(..., examples=["123456"])
    otp_verified: bool

    class Config:
        orm_mode = True


