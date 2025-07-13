from fastapi import FastAPI
#from app.api import 
from app.configs import settings
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

#app.include_router()


@app.get("/health", tags=['health'])
def health():
    return {"status": "ok"}


