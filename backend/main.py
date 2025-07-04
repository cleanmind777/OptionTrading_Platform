from fastapi import FastAPI
from app.api.v1.routers import api_router
from app.db.session import engine
from app.models import base
import app.models
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env", encoding="utf-8-sig")

base.Base.metadata.create_all(bind=engine)

app = FastAPI(title="My FastAPI App")

origins = [
    "http://localhost:5173",  # Your frontend's URL
    # Add more origins if needed
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # Do NOT use ["*"] with credentials!
    allow_credentials=True,           # This must be True for cookies/auth
    allow_methods=["*"],              # Allow all HTTP methods
    allow_headers=["*"],              # Allow all headers
)

app.include_router(api_router, prefix="/api/v1")
