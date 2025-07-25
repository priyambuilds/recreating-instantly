from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, ForeignKey, DateTime
from datetime import datetime

from app.core.db.base import Base

class SSOUserBase(Base):
    __tablename__ = "SSOUserBase"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, nullable=False, autoincrement=True)
    email: Mapped[str] = mapped_column(String, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, index=True, nullable=False)
    fullname: Mapped[str] = mapped_column(String, index=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, index=True, nullable=True)  # Optional phone number
    
    # User verification
    user_created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Subscription
    subscription: Mapped[str] = mapped_column(String, default="FreeTier", nullable=False)  # 'free', 'pro', etc.
    sub_started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)  # ISO format date string
    sub_ends_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)  # ISO format date string
    
    # Additional fields for user tracking and analytics
    login_type: Mapped[str] = mapped_column(String, nullable=False)  # 'sso', 'email', etc.
    last_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=False)
    os_info: Mapped[str | None] = mapped_column(String, nullable=True)
    location: Mapped[str | None] = mapped_column(String, nullable=True)

