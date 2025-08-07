from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, date
from typing import Optional
from celery.result import AsyncResult
from celery_app import celery_app

router = APIRouter()

@router.post("/start-trading/")
def start_task(bot_id: str):
    trading = celery_app.send_task("app.tasks.live_trade.trading", args=[bot_id])
    return {"task_id": trading.id}

@router.get("/trading-status/{trading_id}")
def get_status(trading_id: str):
    trading_result = AsyncResult(trading_id, app=celery_app)
    return {
        "task_id": trading_result.id,
        "status": trading_result.status,
        "result": trading_result.result if trading_result.ready() else None
    }