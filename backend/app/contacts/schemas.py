from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ContactUsPageSchema(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., max_length=100)
    email: EmailStr
    subject: str = Field(..., max_length=255)
    message: str
    social_links: Optional[str] = None

    class Config:
        from_attributes = True
