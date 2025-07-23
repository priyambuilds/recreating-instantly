import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

from app.core.configs import settings
from app.userbase.otp.schemas import OTPBaseSchema
from app.userbase.otp.models import OTPs


SMTP_HOST = "smtp.yourprovider.com"  # Set in config
SMTP_PORT = 587
SMTP_USER = "your@email.com"  # Set in config
SMTP_PASS = "yourpassword"  # Set in config

def init_smtp_server():
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASS)
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

def store_otp(db_session, email, otp):
    otp_obj = OTPs(
        email=email,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db_session.add(otp_obj)
    db_session.commit()
    db_session.refresh(otp_obj)
    return otp_obj

def verify_otp(db_session, email, otp):
    entry = db_session.query(OTPs).filter_by(email=email, otp=otp).first()
    if not entry:
        return False, "OTP not found or invalid"
    if entry.expires_at < datetime.utcnow():
        return False, "OTP expired"
    db_session.delete(entry)
    db_session.commit()
    return True, "OTP verified"

def resend_otp(db_session, email):
    otp = generate_otp()
    store_otp(db_session, email, otp)
    send_otp_email(email, otp)
    return otp
