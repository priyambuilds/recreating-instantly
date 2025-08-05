from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.db.database_async import get_async_db as db
from app.core.db.base import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timedelta, timezone

contact_analytics_router = APIRouter(prefix="/analytics/contacts", tags=["Contact Analytics"])

class ContactAnalyticsEvent(Base):
    __tablename__ = "contact_analytics_event"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True)  # e.g., total, lists, emailed, etc.
    value = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

class ContactAnalyticsIn(BaseModel):
    event_type: str
    value: int | None = None

@contact_analytics_router.post("/event")
async def record_contact_event(event: ContactAnalyticsIn, db: AsyncSession = Depends(db)):
    db_event = ContactAnalyticsEvent(event_type=event.event_type, value=event.value)
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return {"status": "ok", "id": db_event.id}

def get_time_range(period: str):
    now = datetime.now(timezone.utc)
    if period == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif period == "yesterday":
        start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1)
    elif period == "weekly":
        start = now - timedelta(days=now.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif period == "biweekly":
        start = now - timedelta(days=now.weekday() + 7)
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif period == "monthly":
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif period == "6months":
        month = (now.month - 6) % 12 or 12
        year = now.year if now.month > 6 else now.year - 1
        start = now.replace(year=year, month=month, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif period == "yearly":
        start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now
    else:
        raise ValueError("Invalid period")
    return start, end

@contact_analytics_router.get("/summary")
async def contact_analytics_summary(
    period: str = Query("today", enum=["today", "yesterday", "weekly", "biweekly", "monthly", "6months", "yearly"]),
    db: AsyncSession = Depends(db)
):
    start, end = get_time_range(period)
    stmt = select(ContactAnalyticsEvent.event_type, func.count(ContactAnalyticsEvent.id)).where(
        ContactAnalyticsEvent.created_at >= start,
        ContactAnalyticsEvent.created_at < end
    ).group_by(ContactAnalyticsEvent.event_type)
    result = await db.execute(stmt)
    summary = {row[0]: row[1] for row in result.all()}
    return {"period": period, "start": start, "end": end, "summary": summary}