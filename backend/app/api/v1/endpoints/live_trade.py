from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from datetime import datetime, date
from typing import Optional
import json, asyncio
from uuid import UUID
from celery.result import AsyncResult
from celery.contrib.abortable import AbortableAsyncResult
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from celery_app import celery_app
from app.services.bot_service import get_bot
from app.services.trading_task_serivce import create_trading_task, get_trading_task_status, stop_trading_task, add_celery_id_to_trading_task, get_active_trading_tasks
router = APIRouter()

@router.get("/start-trading/")
def start_task(bot_id: str, db: Session = Depends(get_db)):
    try:
        task = create_trading_task(db, bot_id)
        if not task:
            raise HTTPException(status_code=400, detail="Bot is already running!")  
        trading_task = celery_app.send_task("app.tasks.live_trade.trading", args=[bot_id, task.id])
        celery_id = trading_task.id
        return add_celery_id_to_trading_task(db, task.id, celery_id)
    except:
        raise HTTPException(status_code=400, detail="Server can't find bot")

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

@router.get("/stop-trading-bot-id/")
async def stop_task(bot_id: str, db: Session = Depends(get_db)):
    bot = await get_bot(db, bot_id)
    if not bot.is_active:
        raise HTTPException(status_code=400, detail="Bot was Stopped")
    trading_task_id = bot.current_trading_task_id
    trading_task = get_trading_task_status(db, trading_task_id)
    celery_app.control.revoke(trading_task.celery_id, terminate=True, signal='SIGKILL')
    return stop_trading_task(db, trading_task_id)

@router.get("/stop-trading-trading-task-id/")
def stop_task(trading_task_id: str, db: Session = Depends(get_db)):
    trading_task = get_trading_task_status(db, trading_task_id)
    # result = AbortableAsyncResult(trading_task.celery_id)
    # result.abort()
    celery_app.control.revoke(trading_task.celery_id, terminate=True, signal='SIGKILL')
    return stop_trading_task(db, trading_task_id)

@router.get("/stop-all-trading/")
def stop_all_tasks(user_id: UUID, db: Session = Depends(get_db)):
    active_trading_tasks = get_active_trading_tasks(db, user_id)
    # result = AbortableAsyncResult(trading_task.celery_id)
    # result.abort()
    for task in active_trading_tasks:
        celery_app.control.revoke(task.celery_id, terminate=True, signal='SIGKILL')
        stop_trading_task(db, task.id)
    return "Success"

@router.get("/stream/{trading_task_id}")
async def stream_task(trading_task_id: str):
    async def event_stream():
        while True:
            trading_task_result = AsyncResult(trading_task_id, app=celery_app)
            if trading_task_result.state == 'PROGRESS':
                data = trading_task_result.info  # intermediate data
                yield f"data: {json.dumps(data)}\n\n"
            elif trading_task_result.state in ['SUCCESS', 'FAILURE', 'REVOKED']:
                yield f"data: {json.dumps({'state': trading_task_result.state, 'result': trading_task_result.result})}\n\n"
                break
            await asyncio.sleep(1)
    return StreamingResponse(event_stream(), media_type="text/event-stream")