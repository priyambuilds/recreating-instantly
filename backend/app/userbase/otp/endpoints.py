from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.userbase.otp.smtp import generate_otp, send_otp_email, store_otp, verify_otp, resend_otp


from app.core.configs import settings
from app.userbase.otp.schemas import OTPBaseSchema
from app.userbase.otp.models import OTPs as db

otp_router = APIRouter(prefix="/user/otp", tags=["otp"])


@router.post("/send")
async def send_otp(data: OTPRequest):
    otp = generate_otp()
    store_otp(data.email, otp, data.purpose)
    send_otp_email(data.email, otp)
    return {"message": "OTP sent"}

@router.post("/resend")
async def resend_otp_endpoint(data: OTPRequest):
    otp = resend_otp(data.email, data.purpose)
    return {"message": "OTP resent"}

@router.post("/verify")
async def verify_otp_endpoint(data: OTPVerifyRequest):
    valid, msg = verify_otp(data.email, data.otp, data.purpose)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)
    return {"message": msg}
