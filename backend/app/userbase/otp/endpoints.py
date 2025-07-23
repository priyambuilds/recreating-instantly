from fastapi import APIRouter, Depends, Request, HTTPException, status, Cookie
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Annotated
from datetime import datetime, timedelta
import smtplib
import random
import string

from app.core.db.database_async import get_async_db as db
from app.core.configs import settings
from app.userbase.otp.senders import send_otp_email
from app.userbase.otp.models import OTPs
from app.userbase.otp.schemas import OTPBaseSchema 


otp_router = APIRouter(
    prefix="/user/otp",
    tags=["otp"]
    )



async def generate_otp(length=4):
    return ''.join(random.choices(string.digits, k=length))

# Send OTP to email
# Resend OTP to email
#verify OTP

@otp_router.post("/send", response_model=OTPBaseSchema)
async def send_otp(request: Request, data: OTPBaseSchema, db: AsyncSession = Depends(db)):
    otp = int(await generate_otp())
    otp_expires_at = datetime.utcnow() + timedelta(minutes=10)

    new_otp = OTPs(
        email=data.email,
        otp=otp,
        otp_expires_at=otp_expires_at
    )

    send_otp_email(data.email, otp, otp_expires_at)
    
    db.add(new_otp)
    await db.commit()
    await db.refresh(new_otp)

    # Send OTP via email

    # Here you would typically send the OTP via email or SMS
    # For this example, we will just return the OTP details
    return new_otp

@otp_router.post("/resend", response_model=OTPBaseSchema)
async def resend_otp(request: Request, data: OTPBaseSchema, db: AsyncSession = Depends(db)):
    otp_code = int(await generate_otp())
    otp_expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Check if an OTP already exists for the email
    existing_otp = await db.execute(
        select(OTPs).where(OTPs.email == data.email).order_by(OTPs.otp_expires_at.desc())
    )
    existing_otp = existing_otp.scalars().first()

    if existing_otp:
        # Update the existing OTP
        existing_otp.otp = otp_code
        existing_otp.otp_expires_at = otp_expires_at
        await db.commit()
        await db.refresh(existing_otp)
        return existing_otp

    # Create a new OTP if none exists
    new_otp = OTPs(
        email=data.email,
        otp=otp_code,
        otp_expires_at=otp_expires_at
    )

    send_otp_email(data.email, otp_code, otp_expires_at)

    db.add(new_otp)
    await db.commit()
    await db.refresh(new_otp)

    # Here you would typically send the OTP via email or SMS
    return new_otp