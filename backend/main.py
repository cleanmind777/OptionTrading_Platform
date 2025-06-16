from fastapi import FastAPI
from app.api.v1.routers import api_router
from app.db.session import engine
from app.models import base

base.Base.metadata.create_all(bind=engine)

app = FastAPI(title="My FastAPI App")

app.include_router(api_router, prefix="/api/v1")
