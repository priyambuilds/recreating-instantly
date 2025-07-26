from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db.database_async import get_async_db as db
from .models import Subscription
from .schemas import SubscriptionSchema

subscription_router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"])

@subscription_router.get("/pricing", response_model=list[SubscriptionSchema])
async def list_subscriptions(db: AsyncSession = Depends(db)):
    result = await db.execute(select(Subscription))
    subs = result.scalars().all()
    return [SubscriptionSchema.model_validate(sub, from_attributes=True) for sub in subs]

@subscription_router.get("/{sub_id}", response_model=SubscriptionSchema)
async def get_subscription(sub_id: int, db: AsyncSession = Depends(db)):
    sub = await db.get(Subscription, sub_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return SubscriptionSchema.model_validate(sub, from_attributes=True)

