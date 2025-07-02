from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.bot_repository import user_create_bot, user_get_bots, user_get_bot, user_edit_bot, user_get_setting_history
from app.schemas.bot import BotCreate, BotFilter, BotEdit
from app.schemas.bots_setting_history import BotSettingHistoryFilter
from app.models.bot import Bot
import json
from uuid import UUID

def create_bot(db: Session, bot_create: BotCreate) -> Bot:
    return user_create_bot(db, bot_create)

def edit_bot(db: Session, bot_edit: BotEdit) -> Bot:
    return user_edit_bot(db, bot_edit)

async def get_bots(db: Session, bot_filters: BotFilter):
    return await user_get_bots(db, bot_filters)

async def get_bot(db: Session, id: UUID):
    return await user_get_bot(db, id)

async def get_setting_history(db: Session, filter: BotSettingHistoryFilter):
    return await user_get_setting_history(db, filter)