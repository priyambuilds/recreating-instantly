from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy import Boolean, String, Integer, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from typing import Optional

from app.core.db.base import Base
from app.userbase.users.models import UserBase



class Subscriptions(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False)
    features: Mapped[dict] = mapped_column(JSON, nullable=False)      
    billing_cycle: Mapped[str] = mapped_column(String(20), nullable=False)
    tier_level: Mapped[int] = mapped_column(Integer, nullable=False)
    email_limit: Mapped[int] = mapped_column(Integer, nullable=False)
    rate_limit: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[str] = mapped_column(DateTime(timezone=True), onupdate=func.now())

class UserSubscription(Base):
    __tablename__ = "user_subscription"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("userbase.id"), nullable=False)
    subscription_id: Mapped[int] = mapped_column(Integer, ForeignKey("subscriptions.id"), nullable=False)
    start_date: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now())
    end_date: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)