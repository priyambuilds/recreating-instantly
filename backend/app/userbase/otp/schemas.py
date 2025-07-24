from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime

class OTPBaseSchema(BaseModel):
    id: int
    email: EmailStr = Field(..., examples=["user@gmail.com"])
    otp: int = Field(..., ge=1000, le=9999)
    otp_expires_at: datetime

    class Config:
        from_attributes = True


