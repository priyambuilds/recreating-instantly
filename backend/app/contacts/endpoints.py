from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert
from app.core.db.database_async import get_async_db as db
from app.contacts.models import ContactUsPage
from app.contacts.schemas import ContactUsPageSchema
from app.contacts.googlesheets import append_to_sheet


contactpage_router = APIRouter(prefix="/contact", tags=["contact"])

@contactpage_router.post("/lead", response_model=ContactUsPageSchema, status_code=201)
async def create_lead(data: ContactUsPageSchema, db: AsyncSession = Depends(db)):
    obj = ContactUsPage(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
        social_links=data.social_links
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)

    append_to_sheet([
        data.name,
        data.email,
        data.subject,
        data.message,
        data.social_links or ""
    ])

    return ContactUsPageSchema.model_validate(obj, from_attributes=True)