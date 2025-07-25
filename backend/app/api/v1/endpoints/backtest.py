from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from datetime import timedelta
from app.models.strategy import Strategy
from app.models.user import User
from uuid import UUID
from app.services.backtest_service import create_backtest, get_backtest, get_backtests, get_tearsheet_html, get_trades_html, get_indicators_html
from app.schemas.backtest import BacktestCreate, BacktestTask
from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.utils.backtest import backtest
from app.utils.parameter import convert_params
import os
from datetime import datetime, date
from multiprocessing import Process
from app.services.bot_service import create_bot, get_bots, get_bot, edit_bot, get_setting_history
from app.services.strategy_service import create_strategy, get_all_strategies, get_strategy, edit_strategy
# from app.utils.backtest import add
router = APIRouter()

@router.post("/start", status_code=status.HTTP_201_CREATED)
async def start_backtest(backtest_task: BacktestTask, db: Session = Depends(get_db)):
    user_id: UUID
    print(backtest_task.user_id)
    print(backtest_task.bot_id)
    print(backtest_task.user_id)
    print(backtest_task.strategy_id)
    token = await create_backtest(db, backtest_task)
    id = token.id
    bot = await get_bot(db, backtest_task.bot_id)
    strategy = get_strategy(db, backtest_task.strategy_id)
    params = convert_params(bot, strategy)
    strategy_parameters  = {
            "symbol": strategy.symbol,
            "profit_target_type": "percent",      # Uses Percent Profit Target logic
            "profit_target_value": 0.80,          # 80 % profit
            "investment_pct": 0.10,
            "days_before_exit": 5,
            "legs": [
                {
                    "option_type": "call",
                    "long_short": "long",
                    "strike_price": None,      # pick via delta
                    "target_delta": 0.25,
                    "size_ratio": 1,
                    "dte_type": "Target",
                    "dte_value": 30,
                    "dte_min": 25,
                    "dte_max": 40
                }
            ]
        }
    # start_date = backtest_task.start_date  # Keep within last 2yrs for Polygon
    # end_date = backtest_task.end_date
    start_date = datetime.combine(backtest_task.start_date, datetime.min.time())
    end_date = datetime.combine(backtest_task.end_date, datetime.min.time())
    # end_date = datetime.strptime(backtest_task.end_date, "%Y-%m-%d").date()
    print("ID: ", id)
    p = Process(target=backtest, args=(params, start_date, end_date, id))
    p.start()
    # background_task.add_task(backtest)
    return {"token": token}


@router.get('/get-result/{token}')
def get_result(token: str, db: Session = Depends(get_db)):
    result = get_backtest(token, db)
    if not result:
        return {"status": "not found"}
    return result

@router.get('/get-all-results')
def get_all_results(user_id: UUID, db: Session = Depends(get_db)):
    result = get_backtests(user_id, db)
    if not result:
        return {"status": "not found"}
    return result


@router.get('/get-tearsheet-html')
def get_Tearsheet_html(backtest_id: UUID):
    result = get_tearsheet_html(backtest_id)
    if not result:
        return {"status": "not found"}
    return result

@router.get('/get-trades-html')
def get_Trades_html(backtest_id: UUID):
    result = get_trades_html(backtest_id)
    if not result:
        return {"status": "not found"}
    return result

@router.get('/get-indicators-html')
def get_Indicators_html(backtest_id: UUID):
    result = get_indicators_html(backtest_id)
    if not result:
        return {"status": "not found"}
    return result