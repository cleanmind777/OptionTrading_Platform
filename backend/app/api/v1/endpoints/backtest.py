from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from datetime import timedelta
from app.models.strategy import Strategy
from app.models.user import User
from uuid import UUID
from app.services.backtest_service import create_backtest
from app.schemas.backtest import BacktestCreate, BacktestTask
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.utils.backtest import backtest
import os
from datetime import datetime
from multiprocessing import Process
# from app.utils.backtest import add
router = APIRouter()

# @router.get("/add")
# def enqueue_add(x: int, y: int, db: Session = Depends(get_db)):
#     try:
#         res = add(x, y, db)  # 非同期でタスクがキューに登録される
#         return {"task_id": res.id, "status": "queued"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@router.post("/start", status_code=status.HTTP_201_CREATED)
async def start_backtest(backtest_task: BacktestTask, background_task: BackgroundTasks, db: Session = Depends(get_db)):
    token = await create_backtest(db, backtest_task)
    id = token.id
    strategy_parameters = {
        # Example overrides:
        "underlying_symbol": "AAPL",
        "option_type": "put",
        "long_short": "long",
        "target_delta": 0.25,
        "days_to_expiry": 30,
        "days_before_exit": 7,
        "investment_pct": 0.20,
    }
    start_date = datetime(2025, 5, 3)  # Keep within last 2yrs for Polygon
    end_date = datetime(2025, 6, 29)
    print("ID: ", id)
    p = Process(target=backtest, args=(strategy_parameters, start_date, end_date, id))
    p.start()
    # background_task.add_task(backtest)
    return {"token": token}


# @router.get('/get-result/{token}')
# async def get_result(token: str):
#     result = get_backtest(token)
#     if not result:
#         return {"status": "not found"}
#     return result


