

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db.database_async import get_async_db as db
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer
from app.core.db.base import Base

contacts_router = APIRouter(prefix="/mailserver/contacts", tags=["Mock Contacts APIs"])


class ContactsAnalytics(Base):
    __tablename__ = "contacts_analytics"
    id = Column(Integer, primary_key=True, index=True)
    total = Column(Integer, default=1234)
    lists = Column(Integer, default=12)
    emailed = Column(Integer, default=900)
    replied = Column(Integer, default=150)
    blocked = Column(Integer, default=20)
    active = Column(Integer, default=800)
    inactive = Column(Integer, default=434)

async def get_or_create_contacts_analytics(db: AsyncSession):
    result = await db.execute(select(ContactsAnalytics).where(ContactsAnalytics.id == 1))
    analytics = result.scalar_one_or_none()
    if not analytics:
        analytics = ContactsAnalytics(id=1)
        db.add(analytics)
        await db.commit()
        await db.refresh(analytics)
    return analytics

@contacts_router.get("/total")
async def total_contacts(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.total += 1
    await db.commit()
    return {"total_contacts": analytics.total}

@contacts_router.get("/lists")
async def contact_lists(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.lists += 1
    await db.commit()
    return {"contact_lists": analytics.lists}

@contacts_router.get("/emailed")
async def contacts_emailed(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.emailed += 1
    await db.commit()
    return {"contacts_emailed": analytics.emailed}

@contacts_router.get("/replied")
async def contacts_replied(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.replied += 1
    await db.commit()
    return {"contacts_replied": analytics.replied}

@contacts_router.get("/blocked")
async def contacts_blocked(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.blocked += 1
    await db.commit()
    return {"contacts_blocked": analytics.blocked}

@contacts_router.get("/active")
async def contacts_active(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.active += 1
    await db.commit()
    return {"active_contacts": analytics.active}

@contacts_router.get("/inactive")
async def contacts_inactive(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    analytics.inactive += 1
    await db.commit()
    return {"inactive_contacts": analytics.inactive}

@contacts_router.get("/analytics")
async def get_contacts_analytics(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_contacts_analytics(db)
    return {
        "total": analytics.total,
        "lists": analytics.lists,
        "emailed": analytics.emailed,
        "replied": analytics.replied,
        "blocked": analytics.blocked,
        "active": analytics.active,
        "inactive": analytics.inactive
    }
