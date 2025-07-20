from fastapi import FastAPI

from app.users.endpoints import users_router
from app.admin.endpoints import useradmin_router

from app.core.configs import settings
from app.core.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
)

app.include_router(users_router)
app.include_router(useradmin_router)


@app.get("/health", tags=['health'])
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"Hello World"}


import asyncio
from app.core.db.database_async import engine
async def create_all_tables():
    from app.models.users import Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_all_tables())