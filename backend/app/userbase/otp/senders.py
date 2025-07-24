
from datetime import datetime
from app.core.configs import settings
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import logging

# Brevo (Sendinblue) API config
BREVO_API_KEY = settings.BREVO_API_KEY # Should be your Brevo v3 API key
SENDER_EMAIL = settings.SENDER_EMAIL  # The sender email registered in Brevo

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = BREVO_API_KEY

def send_otp_email(email: str, otp: int, otp_expires_at: datetime):
    subject = "Your OTP Code"
    body = f"Your OTP code is {otp}. It will expire at {otp_expires_at.strftime('%Y-%m-%d %H:%M:%S')}."

    sender = {"email": SENDER_EMAIL}
    to = [{"email": email}]

    email_obj = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=f"<html><body><p>{body}</p></body></html>"
    )

    try:
        api_client = sib_api_v3_sdk.ApiClient(configuration)
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(api_client)
        response = api_instance.send_transac_email(email_obj)
        logging.info(f"Brevo email sent: {response}")
    except ApiException as e:
        logging.error(f"Brevo API Exception: {e}")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

