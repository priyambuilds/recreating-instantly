from typing import Annotated
from datetime import datetime, timedelta
import smtplib
from app.core.configs import settings


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

async def send_otp_email(email: str, otp_code: int, otp_expires_at: datetime):
    server = init_smtp_server()
    subject = "Your OTP Code"
    body = f"Your OTP code is {otp_code}. It will expire at {otp_expires_at.strftime('%Y-%m-%d %H:%M:%S')}."
    message = f"Subject: {subject}\n\n{body}"
    
    try:
        server.sendmail(SMTP_USER, email, message)
    except Exception as e:
        print(f"Failed to send email: {e}")
    finally:
        server.quit()

