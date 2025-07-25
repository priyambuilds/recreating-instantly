
import asyncio
from app.core.db.database_async import engine
from app.core.db.base import Base

from app.contacts.models import ContactUsPage
from app.subscription.models import Subscriptions, UserSubscription
from app.userbase.users.models import UserBase
from app.userbase.sso.models import SSOUserBase
from app.userbase.otp.models import OTPs


async def create_all_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_all_tables())