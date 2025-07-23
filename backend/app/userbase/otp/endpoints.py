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
from app.userbase.users.models import UserBase 


otp_router = APIRouter(
    prefix="/user/otp",
    tags=["otp"]
    )




async def generate_otp(length=4):
    return ''.join(random.choices(string.digits, k=length))

# --- Reusable OTP creation and sending logic ---
async def create_and_send_otp(email: str, db: AsyncSession) -> OTPs:
    otp = int(await generate_otp())
    otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    new_otp = OTPs(
        email=email,
        otp=otp,
        otp_expires_at=otp_expires_at
    )
    send_otp_email(email, otp, otp_expires_at)
    db.add(new_otp)
    await db.commit()
    await db.refresh(new_otp)
    return new_otp

# Send OTP to email
# Resend OTP to email
#verify OTP

@otp_router.post("/send", response_model=OTPBaseSchema)
async def send_otp(request: Request, data: OTPBaseSchema, db: AsyncSession = Depends(db)):
    new_otp = await create_and_send_otp(data.email, db)
    return new_otp


@otp_router.post("/resend", response_model=OTPBaseSchema)
async def resend_otp(request: Request, data: OTPBaseSchema, db: AsyncSession = Depends(db)):
    # Remove any existing OTPs for this email
    existing_otps = await db.execute(
        select(OTPs).where(OTPs.email == data.email)
    )
    for otp_obj in existing_otps.scalars().all():
        await db.delete(otp_obj)
    await db.commit()

    # Create and send a new OTP
    new_otp = await create_and_send_otp(data.email, db)
    return new_otp



@otp_router.post("/verify")
async def verify_otp(request: Request, data: OTPBaseSchema, db: AsyncSession = Depends(db)):
    # Fetch the latest OTP for the email
    otp_record = await db.execute(
        select(OTPs).where(OTPs.email == data.email).order_by(OTPs.otp_expires_at.desc())
    )
    otp_record = otp_record.scalars().first()

    if not otp_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OTP not found")

    if otp_record.otp != data.otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    if otp_record.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")

    user_result = await db.execute(select(UserBase).where(UserBase.email == data.email))
    user = user_result.scalar_one_or_none()
    if user:
        user.email_verified = True
        await db.commit()
        await db.refresh(user)


    db.delete(otp_record)
    await db.commit()   
    # OTP is valid, you can proceed with the user's request
    return {"message": "OTP verified successfully"}

