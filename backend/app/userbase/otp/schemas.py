from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime

class OTPBaseSchema(BaseModel):
    id: int
    email: EmailStr = Field(..., examples=["user@gmail.com"])
    otp: int = Field(..., ge=1000, le=9999)
    otp_expires_at: datetime
    email_verified: bool = Field(default=False)

    class Config:
        orm_mode = True


