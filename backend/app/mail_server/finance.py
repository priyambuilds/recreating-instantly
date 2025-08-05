
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.core.db.database_async import get_async_db as db
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, Float
from app.core.db.base import Base


finance_router = APIRouter(prefix="/mailserver/finance", tags=["Mock Finance APIs"])


class FinanceAnalytics(Base):
    __tablename__ = "finance_analytics"
    id = Column(Integer, primary_key=True, index=True)
    money_spent = Column(Integer, default=10000)
    money_received = Column(Integer, default=25000)
    roi = Column(Float, default=1.5)
    mmr = Column(Integer, default=2000)

# Helper to get or create the singleton row
async def get_or_create_analytics(db: AsyncSession):
    result = await db.execute(select(FinanceAnalytics).where(FinanceAnalytics.id == 1))
    analytics = result.scalar_one_or_none()
    if not analytics:
        analytics = FinanceAnalytics(id=1)
        db.add(analytics)
        await db.commit()
        await db.refresh(analytics)
    return analytics

@finance_router.get("/spent")
async def money_spent(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_analytics(db)
    analytics.money_spent += 100
    await db.commit()
    return {"money_spent": analytics.money_spent}

@finance_router.get("/received")
async def money_received(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_analytics(db)
    analytics.money_received += 200
    await db.commit()
    return {"money_received": analytics.money_received}

@finance_router.get("/roi")
async def roi(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_analytics(db)
    analytics.roi += 0.01
    await db.commit()
    return {"roi": round(analytics.roi, 2)}

@finance_router.get("/mmr")
async def mmr(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_analytics(db)
    analytics.mmr += 10
    await db.commit()
    return {"mmr": analytics.mmr}

@finance_router.get("/analytics")
async def get_finance_analytics(db: AsyncSession = Depends(db)):
    analytics = await get_or_create_analytics(db)
    return {
        "money_spent": analytics.money_spent,
        "money_received": analytics.money_received,
        "roi": round(analytics.roi, 2),
        "mmr": analytics.mmr
    }
