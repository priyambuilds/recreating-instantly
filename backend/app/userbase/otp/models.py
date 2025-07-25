from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, ForeignKey
from app.userbase.users.models import UserBase
from datetime import datetime

from app.core.db.base import Base

class OTPs(Base):
    __tablename__ = "otpdb"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, nullable=False, autoincrement=True)
    email: Mapped[str] = mapped_column(String, index=True, nullable=False)
    otp: Mapped[int] = mapped_column(Integer, nullable=False)
    otp_expires_at: Mapped[datetime] = mapped_column(nullable=False)
    
    