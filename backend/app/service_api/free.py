from fastapi import APIRouter

free_router = APIRouter(prefix="/free", tags=["free"])

@free_router.get("/hello")
async def free_hello():
    return {"message": "Hello from free API!"}

@free_router.get("/data")
async def free_data():
    return {"data": [1, 2, 3, "free"]}
