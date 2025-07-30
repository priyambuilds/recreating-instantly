import os
import stripe
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from app.core.configs import settings

stripe_router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"])

# Set your Stripe secret key (use env var in production)
stripe.api_key = settings.STRIPE_SECRET_KEY

# Hardcoded Stripe price IDs for each plan (replace with your real IDs)
PLAN_IDS = {
    "Growth": "price_1RqiKUSIQooxSJH28B4VuMBx",
    "Hypergrowth": "price_1RqiWNSIQooxSJH2SuGcizsY",
    "Light Speed": "price_1RqiWtSIQooxSJH25HOM3SsG"
}

def get_plan_response(price_obj):
    product = stripe.Product.retrieve(price_obj.product)
    return {
        "id": price_obj.id,
        "name": product.name,
        "description": product.description,
        "unit_amount": price_obj.unit_amount,
        "currency": price_obj.currency,
        "interval": price_obj.recurring["interval"] if price_obj.recurring else None,
        "features": product.metadata.get("features", "")
    }

@stripe_router.get("/pricing/basic", summary="Get Basic Plan Pricing", tags=["subscriptions"])
async def get_basic_plan():
    try:
        price = stripe.Price.retrieve(PLAN_IDS["basic"])
        return get_plan_response(price)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Stripe error: {str(e)}")

@stripe_router.get("/pricing/pro", summary="Get Pro Plan Pricing", tags=["subscriptions"])
async def get_pro_plan():
    try:
        price = stripe.Price.retrieve(PLAN_IDS["pro"])
        return get_plan_response(price)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Stripe error: {str(e)}")

@stripe_router.get("/pricing/business", summary="Get Business Plan Pricing", tags=["subscriptions"])
async def get_business_plan():
    try:
        price = stripe.Price.retrieve(PLAN_IDS["business"])
        return get_plan_response(price)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Stripe error: {str(e)}")

@stripe_router.get("/pricing/enterprise", summary="Get Enterprise Plan Pricing", tags=["subscriptions"])
async def get_enterprise_plan():
    return RedirectResponse(
        url="http://localhost:8000/contact/lead")