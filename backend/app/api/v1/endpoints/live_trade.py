from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, date
from typing import Optional
from celery.result import AsyncResult
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from celery_app import celery_app
from app.services.trading_task_serivce import create_trading_task
router = APIRouter()

@router.post("/start-trading/")
def start_task(bot_id: str, db: Session = Depends(get_db)):
    trading_task = celery_app.send_task("app.tasks.live_trade.trading", args=[bot_id])
    return create_trading_task(db, bot_id, trading_task.id)

@router.get("/trading-status/{trading_task_id}")
def get_status(trading_task_id: str):
    trading_task_result = AsyncResult(trading_task_id, app=celery_app)
    return {
        "task_id": trading_task_result.id,
        "status": trading_task_result.status,
        "result": trading_task_result.result if trading_task_result.ready() else None
    }