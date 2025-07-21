from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.backtest_repository import user_create_backtest, user_finish_backtest
from app.schemas.bot import BotCreate, BotFilter, BotEdit, BotChange
from app.schemas.bots_setting_history import BotSettingHistoryFilter
from app.schemas.backtest import BacktestCreate, BacktestTask
from app.models.bot import Bot
import json
from uuid import UUID

async def create_backtest(db: Session, backtest_task: BacktestTask):
    return await user_create_backtest(db, backtest_task)

def finish_backtest(db: Session, id: UUID, result: json):
    return user_finish_backtest(db, id, result)

# def get_backtest(db: Session, token: UUID):
#     return user_get_backtest(db, token)

# def remove_bactest(db: Session, token: UUID):
#     return user_remove_backtest(db, token)