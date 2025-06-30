from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.bot_repository import user_create_bot, user_get_bots
from app.schemas.bot import BotCreate, BotFilter
from app.models.bot import Bot
import json

def create_bot(db: Session, bot_create: BotCreate) -> Bot:
    return user_create_bot(db, bot_create)

async def get_bots(db: Session, bot_filters: BotFilter):
    return await user_get_bots(db, bot_filters)