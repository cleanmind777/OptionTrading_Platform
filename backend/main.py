from fastapi import FastAPI
from app.api.v1.routers import api_router
from app.db.session import engine
from app.models import base
from fastapi.middleware.cors import CORSMiddleware

base.Base.metadata.create_all(bind=engine)

app = FastAPI(title="My FastAPI App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # or ["*"] to allow all origins (not recommended for production)
    allow_credentials=False,
    allow_methods=["*"],            # Allow all HTTP methods
    allow_headers=["*"],            # Allow all headers
)

app.include_router(api_router, prefix="/api/v1")
