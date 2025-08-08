from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.trading_task_repository import user_create_trading_task, user_get_trading_task_status, user_stop_trading_task, user_add_celery_id_to_trading_task
import json
from uuid import UUID

def create_trading_task(db: Session, bot_id: UUID):
    return user_create_trading_task(db, bot_id)

def get_trading_task_status(db: Session, trading_task_id: str):
    return user_get_trading_task_status(db, trading_task_id)

def stop_trading_task(db: Session, trading_task_id: str):
    return user_stop_trading_task(db, trading_task_id)

def add_celery_id_to_trading_task(db: Session, trading_task_id: str, celery_id: str):
    return user_add_celery_id_to_trading_task(db, trading_task_id, celery_id)
