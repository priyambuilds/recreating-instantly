from fastapi import FastAPI

from app.userbase.users.endpoints import users_router
from app.userbase.admin.endpoints import useradmin_router
from app.userbase.sso.google_sso import sso_router as google_sso_router
from app.userbase.sso.github_sso import sso_router as github_sso_router
from app.userbase.sso.discord_sso import sso_router as discord_sso_router
from app.userbase.sso.slack_sso import sso_router as slack_sso_router

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
app.include_router(google_sso_router)
app.include_router(github_sso_router)
app.include_router(discord_sso_router)
app.include_router(slack_sso_router)


@app.get("/health", tags=['health'])
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"Hello World"}


import asyncio
from app.core.db.database_async import engine
from app.userbase.users.models import Base as UsersBase
from app.userbase.sso.models import Base as SSOBase

async def create_all_tables():
    async with engine.begin() as conn:
        await conn.run_sync(UsersBase.metadata.create_all)
        await conn.run_sync(SSOBase.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_all_tables())