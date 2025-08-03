import os
import stripe
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from app.core.configs import settings

upi_subscription_router = APIRouter(
    prefix="/subscriptions/upi",
    tags=["UPI Subscriptions"]
)



# Demo plan prices (replace with your real prices)
PLAN_PRICES = {
    "growth": 199,
    "hypergrowth": 499,
    "lightspeed": 999
}

# UPI VPA (change to your business VPA)
UPI_VPA = "shreyakri192@okhdfcbank"
UPI_PN = "Gpay"

# One-time payment endpoints
@upi_subscription_router.get("/pay/growth", summary="One-time UPI payment for Growth plan")
async def pay_growth():
    upi_link = f"upi://pay?pa={UPI_VPA}&pn={UPI_PN}&am={PLAN_PRICES['growth']}&cu=INR"
    return {"plan": "growth", "amount": PLAN_PRICES['growth'], "upi_link": upi_link}

@upi_subscription_router.get("/pay/hypergrowth", summary="One-time UPI payment for Hypergrowth plan")
async def pay_hypergrowth():
    upi_link = f"upi://pay?pa={UPI_VPA}&pn={UPI_PN}&am={PLAN_PRICES['hypergrowth']}&cu=INR"
    return {"plan": "hypergrowth", "amount": PLAN_PRICES['hypergrowth'], "upi_link": upi_link}

@upi_subscription_router.get("/pay/lightspeed", summary="One-time UPI payment for Light Speed plan")
async def pay_lightspeed():
    upi_link = f"upi://pay?pa={UPI_VPA}&pn={UPI_PN}&am={PLAN_PRICES['lightspeed']}&cu=INR"
    return {"plan": "lightspeed", "amount": PLAN_PRICES['lightspeed'], "upi_link": upi_link}

# Autopay endpoints (demo: show instructions, real autopay needs gateway)
@upi_subscription_router.get("/autopay/growth", summary="UPI Autopay for Growth plan (info)")
async def autopay_growth():
    return {"plan": "growth", "amount": PLAN_PRICES['growth'], "autopay": "UPI Autopay requires a payment gateway (e-mandate). Please use Razorpay, Cashfree, or Paytm for production autopay."}

@upi_subscription_router.get("/autopay/hypergrowth", summary="UPI Autopay for Hypergrowth plan (info)")
async def autopay_hypergrowth():
    return {"plan": "hypergrowth", "amount": PLAN_PRICES['hypergrowth'], "autopay": "UPI Autopay requires a payment gateway (e-mandate). Please use Razorpay, Cashfree, or Paytm for production autopay."}

@upi_subscription_router.get("/autopay/lightspeed", summary="UPI Autopay for Light Speed plan (info)")
async def autopay_lightspeed():
    return {"plan": "lightspeed", "amount": PLAN_PRICES['lightspeed'], "autopay": "UPI Autopay requires a payment gateway (e-mandate). Please use Razorpay, Cashfree, or Paytm for production autopay."}



