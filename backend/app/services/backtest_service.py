from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.backtest_repository import user_create_backtest, user_finish_backtest, user_get_backtest, user_get_backtests, user_get_tearsheet_html, user_get_trades_html, user_get_indicators_html
from app.schemas.bots_setting_history import BotSettingHistoryFilter
from app.schemas.backtest import BacktestCreate, BacktestTask
import json
from uuid import UUID

async def create_backtest(db: Session, backtest_task: BacktestTask):
    return await user_create_backtest(db, backtest_task)

def finish_backtest(db: Session, id: UUID, result: json):
    return user_finish_backtest(db, id, result)

def get_backtest(token: UUID, db: Session):
    return user_get_backtest(token, db)

def get_backtests(user_id: UUID, db: Session):
    return user_get_backtests(user_id, db)

def get_tearsheet_html(backtest_id: UUID):
    return user_get_tearsheet_html(backtest_id)

def get_trades_html(backtest_id: UUID):
    return user_get_trades_html(backtest_id)

def get_indicators_html(backtest_id: UUID):
    return user_get_indicators_html(backtest_id)
