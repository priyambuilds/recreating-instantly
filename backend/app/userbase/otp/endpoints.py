import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.configs import settings
from app.userbase.otp.models import OTPs

otp_router = APIRouter(prefix="/user/otp", tags=["otp"])

# SMTP/Brevo config
SMTP_HOST = settings.SMTP_HOST
SMTP_PORT = settings.SMTP_PORT
SMTP_USER = settings.SMTP_USER
SMTP_KEY = settings.SMTP_KEY

def init_smtp_server():
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USER, SMTP_KEY)
    return server

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(to_email, otp):
    subject = "Your OTP Code"
    body = f"Your OTP code is: {otp}"
    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    server = init_smtp_server()
    server.sendmail(SMTP_USER, to_email, msg.as_string())
    server.quit()


async def verify_otp(db: AsyncSession, email: str, otp: str):
    result = await db.execute(
        OTPs.__table__.select().where(OTPs.email == email, OTPs.otp == otp)
    )
    entry = result.first()
    if not entry:
        return False, "OTP not found or invalid"
    expires_at = entry[0]['otp_expires_at']
    if expires_at < datetime.utcnow():
        return False, "OTP expired"
    await db.execute(OTPs.__table__.delete().where(OTPs.email == email, OTPs.otp == otp))
    await db.commit()
    return True, "OTP verified"




@otp_router.post("/send")
async def send_otp_endpoint(data: OTPRequest, db: AsyncSession = Depends()):
    otp = generate_otp()
    await store_otp(db, data.email, otp)
    send_otp_email(data.email, otp)
    otp_obj = OTPs(
        email=email,
        otp=otp,
        otp_expires_at=datetime.utcnow() + timedelta(minutes=10),
        otp_sent=datetime.utcnow(),
        otp_verified=False
    )
    db.add(otp_obj)
    await db.commit()
    await db.refresh(otp_obj)
    return {"message": "OTP sent"}

@otp_router.post("/resend")
async def resend_otp_endpoint(data: OTPRequest, db: AsyncSession = Depends()):
    otp = await resend_otp(db, data.email)
    return {"message": "OTP resent"}

@otp_router.post("/verify")
async def verify_otp_endpoint(data: OTPVerifyRequest, db: AsyncSession = Depends()):
    valid, msg = await verify_otp(db, data.email, data.otp)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)
    return {"message": msg}