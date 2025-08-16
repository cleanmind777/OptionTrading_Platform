from sqlalchemy.orm import Session
from app.db.repositories.trading_log_repository import (
    user_create_trading_log,
    user_get_trading_log,
    user_get_trading_logs,
)
from app.schemas.trading_log import TradingLogFilter, TradingLogCreate
from uuid import UUID


def create_trading_log(db: Session, trading_log_create: TradingLogCreate):
    return user_create_trading_log(db, trading_log_create)


def get_trading_log(db: Session, trading_log_id: UUID):
    return user_get_trading_log(db, trading_log_id)


def get_trading_logs(db: Session, trading_log_filter: TradingLogFilter):
    return user_get_trading_logs(db, trading_log_filter)
