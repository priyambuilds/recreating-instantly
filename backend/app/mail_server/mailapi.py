

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db.database_async import get_async_db as db
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, ARRAY

from app.core.db.base import Base

mail_apis_router = APIRouter(prefix="/mailserver/email", tags=["Mock Mail APIs"])


class MailAnalytics(Base):
    __tablename__ = "mail_analytics"
    id = Column(Integer, primary_key=True, index=True)
    draft = Column(Integer, default=0)
    sent = Column(Integer, default=0)
    soft_bounce = Column(Integer, default=0)
    hard_bounce = Column(Integer, default=0)
    received = Column(Integer, default=0)
    success = Column(Integer, default=0)
    # Store last 20 success values for analytics
    success_values = Column(ARRAY(Integer), default=[])

async def get_or_create_mail_analytics(db: AsyncSession):
    result = await db.execute(select(MailAnalytics).where(MailAnalytics.id == 1))
    analytics = result.scalar_one_or_none()
    if not analytics:
        analytics = MailAnalytics(id=1)
        db.add(analytics)
        await db.commit()
        await db.refresh(analytics)
    return analytics

class EmailSuccessInput(BaseModel):
    value: int

@mail_apis_router.get("/draft")
async def email_draft(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    analytics.draft += 1
    await db.commit()
    return {"status": "draft", "count": analytics.draft}

@mail_apis_router.get("/sent")
async def email_sent(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    analytics.sent += 1
    await db.commit()
    return {"status": "sent", "count": analytics.sent}

@mail_apis_router.get("/soft-bounce")
async def email_soft_bounce(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    analytics.soft_bounce += 1
    await db.commit()
    return {"status": "soft_bounce", "count": analytics.soft_bounce}

@mail_apis_router.get("/hard-bounce")
async def email_hard_bounce(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    analytics.hard_bounce += 1
    await db.commit()
    return {"status": "hard_bounce", "count": analytics.hard_bounce}

@mail_apis_router.get("/received")
async def email_received(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    analytics.received += 1
    await db.commit()
    return {"status": "received", "count": analytics.received}

@mail_apis_router.post("/success")
async def email_success(input: EmailSuccessInput, db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    analytics.success += 1
    # Keep only last 20 values
    vals = (analytics.success_values or []) + [input.value]
    analytics.success_values = vals[-20:]
    await db.commit()
    return {"status": "success", "count": analytics.success, "input_value": input.value}

@mail_apis_router.get("/analytics")
async def get_mail_analytics(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_mail_analytics(db)
    return {
        "draft": analytics.draft,
        "sent": analytics.sent,
        "soft_bounce": analytics.soft_bounce,
        "hard_bounce": analytics.hard_bounce,
        "received": analytics.received,
        "success": analytics.success,
        "success_values": analytics.success_values or []
    }
