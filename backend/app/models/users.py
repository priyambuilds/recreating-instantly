from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, ForeignKey

class Base(DeclarativeBase):
    pass

class UserBase(Base):
    __tablename__ = "userbase"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, nullable=False, autoincrement=True)
    email: Mapped[str] = mapped_column(String, index=True, nullable=False)
    fullname: Mapped[str] = mapped_column(String, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String, index=True, nullable=True)  # Optional phone number
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    
    # User verification
    user_created_at: Mapped[str] = mapped_column(String, nullable=False)  # ISO format date string
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Subscription
    subscription: Mapped[str] = mapped_column(String, default="FreeTier" nullable=False)  # 'free', 'pro', etc.
    sub_started_at: Mapped[str] = mapped_column(String, nullable=False)  # ISO format date string
    sub_ends_at: Mapped[str] = mapped_column(String, nullable=False)  # ISO format date string
    
    # Additional fields for user tracking and analytics
    last_login: Mapped[str | None] = mapped_column(String, nullable=True)  # ISO format date string
    os_info: Mapped[str | None] = mapped_column(String, nullable=True)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # Relationship to OTPs
    otpdb: Mapped[list["OTPs"]] = relationship("OTPs", back_populates="user_relation", cascade="all, delete-orphan")