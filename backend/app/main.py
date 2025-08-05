from fastapi import FastAPI

from app.userbase.users.endpoints import users_router
from app.userbase.admin.endpoints import useradmin_router
from app.userbase.sso.google_sso import sso_router as google_sso_router
from app.userbase.sso.github_sso import sso_router as github_sso_router
from app.userbase.sso.discord_sso import sso_router as discord_sso_router
from app.userbase.sso.slack_sso import sso_router as slack_sso_router
from app.userbase.sso.x_sso import sso_router as x_sso_router
from app.userbase.otp.endpoints import otp_router
from app.contacts.endpoints import contactpage_router

from app.subscription.stripe import stripe_subscription_router

from app.mail_server.mailapi import mail_apis_router
from app.mail_server.contacts import contacts_router
from app.mail_server.finance import finance_router

from app.analytics.email_analytics import email_analytics_router
from app.analytics.contact_analytics import contact_analytics_router
from app.analytics.finance_analytics import finance_analytics_router


from app.core.configs import settings
from app.core.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
)

app.include_router(users_router)
app.include_router(useradmin_router)
app.include_router(google_sso_router)
app.include_router(github_sso_router)
app.include_router(discord_sso_router)
app.include_router(slack_sso_router)
app.include_router(x_sso_router)
app.include_router(otp_router)
app.include_router(contactpage_router)

app.include_router(stripe_subscription_router)

app.include_router(mail_apis_router)
app.include_router(contacts_router)
app.include_router(finance_router)

app.include_router(email_analytics_router)
app.include_router(contact_analytics_router)
app.include_router(finance_analytics_router)


@app.get("/health", tags=['health'])
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"Hello World"}


