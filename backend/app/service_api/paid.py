from fastapi import APIRouter

paid_router = APIRouter(prefix="/paid", tags=["paid"])

@paid_router.get("/hello")
async def paid_hello():
    return {"message": "Hello from paid API!"}

@paid_router.get("/data")
async def paid_data():
    return {"data": [42, "premium", "pro"]}
