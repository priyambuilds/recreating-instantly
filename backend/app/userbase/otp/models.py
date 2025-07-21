from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, ForeignKey
from app.userbase.users.models import UserBase

class Base(DeclarativeBase):
    pass

class OTPs(Base):
    __tablename__ = "otpdb"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, nullable=False, autoincrement=True)
    email: Mapped[str] = mapped_column(String, ForeignKey("userbase.email"), index=True, nullable=False)
    otp_sent: Mapped[str] = mapped_column(String, nullable=False)
    otp_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationship to UserBase
    user_relation: Mapped["UserBase"] = relationship("UserBase", back_populates="otpdb")