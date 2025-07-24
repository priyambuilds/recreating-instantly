from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from sqlalchemy import String, Integer, Text
from typing import Optional

Base = declarative_base()

class ContactUsPage(Base):
    __tablename__ = "Contactus"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    social_links: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)