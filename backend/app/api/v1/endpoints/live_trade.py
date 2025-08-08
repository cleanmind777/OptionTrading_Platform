from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, date
from typing import Optional
from celery.result import AsyncResult
from celery.contrib.abortable import AbortableAsyncResult
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from celery_app import celery_app
from app.services.trading_task_serivce import create_trading_task, get_trading_task_status, stop_trading_task, add_celery_id_to_trading_task
router = APIRouter()

@router.post("/start-trading/")
def start_task(bot_id: str, db: Session = Depends(get_db)):
    task = create_trading_task(db, bot_id)
    trading_task = celery_app.send_task("app.tasks.live_trade.trading", args=[bot_id, task.id])
    celery_id = trading_task.id
    return add_celery_id_to_trading_task(db, task.id, celery_id)

@router.get("/trading-status/{trading_task_id}")
def get_status(trading_task_id: str, db: Session = Depends(get_db)):
    trading_task = get_trading_task_status(db, trading_task_id)
    print(trading_task)
    trading_task_result = AsyncResult(trading_task.celery_id, app=celery_app)
    return {
        "task_id": trading_task_result.id,
        "status": trading_task_result.status,
        "result": trading_task_result.result if trading_task_result.ready() else None
    }
    
@router.post("/stop-trading/")
def start_task(trading_task_id: str, db: Session = Depends(get_db)):
    trading_task = get_trading_task_status(db, trading_task_id)
    # result = AbortableAsyncResult(trading_task.celery_id)
    # result.abort()
    celery_app.control.revoke(trading_task.celery_id, terminate=True, signal='SIGKILL')
    return stop_trading_task(db, trading_task_id)