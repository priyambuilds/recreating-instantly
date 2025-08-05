from pydantic import BaseModel, Field
from typing import Optional, Dict

class SubscriptionSchema(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    currency: str
    features: Dict[str, Optional[str]]
    billing_cycle: str
    tier_level: int
    email_limit: int
    rate_limit: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True

class UserSubscriptionSchema(BaseModel):
    id: Optional[int] = None
    user_id: int
    subscription_id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True