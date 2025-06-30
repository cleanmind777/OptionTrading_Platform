from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from datetime import timedelta
from app.models.bot import Bot
from uuid import UUID
from app.services.bot_service import create_bot
from app.schemas.bot import BotCreate, BotInfo
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/create", response_model=BotInfo, status_code=status.HTTP_201_CREATED)
def create_Bot(bot_create: BotCreate, db: Session = Depends(get_db)):
    db_user = db.query(Bot).filter(Bot.name == bot_create.name).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bot that has same name, already registered")
    return create_bot(db, bot_create)

