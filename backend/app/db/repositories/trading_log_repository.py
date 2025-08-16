from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy import cast, JSON
from sqlalchemy.future import select
from uuid import UUID

from app.models.trading_log import TradingLog
from app.schemas.trading_log import TradingLogFilter, TradingLogCreate


def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val


def user_create_trading_log(db: Session, trading_log_create: TradingLogCreate):
    db_trading_log = TradingLog(
        user_id=trading_log_create.user_id,
        trading_account_id=trading_log_create.trading_account_id,
        bot_id=trading_log_create.bot_id,
        trading_task_id=trading_log_create.trading_task_id,
        symbol=trading_log_create.symbol,
        win_loss=trading_log_create.win_loss,
        profit=trading_log_create.profit,
        time=func.now(),
        current_total_balance=trading_log_create.current_account_balance,
        current_account_balance=trading_log_create.current_account_balance,
    )
    db.add(db_trading_log)
    db.commit()
    db.refresh(db_trading_log)
    return db_trading_log


def user_get_trading_logs(db: Session, trading_log_filter: TradingLogFilter):
    query = db.query(TradingLog).filter(
        TradingLog.user_id == trading_log_filter.user_id
    )

    if trading_log_filter.bot_id:
        query = query.filter(TradingLog.bot_id == trading_log_filter.bot_id)

    if trading_log_filter.trading_account_id:
        query = query.filter(
            TradingLog.trading_account_id == trading_log_filter.trading_account_id
        )

    if trading_log_filter.trading_task_id:
        query = query.filter(
            TradingLog.trading_task_id == trading_log_filter.trading_task_id
        )

    if trading_log_filter.symbol:
        query = query.filter(TradingLog.symbol == trading_log_filter.symbol)

    if trading_log_filter.win_loss != None:
        query = query.filter(TradingLog.win_loss == trading_log_filter.win_loss)

    results = query.all()
    return results


def user_get_trading_log(db, trading_log_id: UUID):
    db_trading_log = (
        db.query(TradingLog).filter(TradingLog.id == trading_log_id).first()
    )
    return db_trading_log
