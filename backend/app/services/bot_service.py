from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.bot_repository import user_create_bot
from app.schemas.bot import BotCreate
from app.models.bot import Bot
import json

def create_bot(db: Session, bot_create: BotCreate) -> Bot:
    return user_create_bot(db, bot_create)