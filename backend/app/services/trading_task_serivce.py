from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.trading_task_repository import user_create_trading_task
import json
from uuid import UUID

def create_trading_task(db: Session, bot_id: UUID, trading_task_id: str):
    return user_create_trading_task(db, bot_id, trading_task_id)