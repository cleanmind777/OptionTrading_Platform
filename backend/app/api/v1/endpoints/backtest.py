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
router = APIRouter()

@router.post("/start", status_code=status.HTTP_201_CREATED)
async def start_backtest(backtest_task: BacktestTask, background_task: BackgroundTasks, db: Session = Depends(get_db)):
    token = await create_backtest(db, backtest_task)
    id = token.id
    background_task.add_task(backtest, id, db)
    return {"token": token}


# @router.get('/get-result/{token}')
# async def get_result(token: str):
#     result = get_backtest(token)
#     if not result:
#         return {"status": "not found"}
#     return result


