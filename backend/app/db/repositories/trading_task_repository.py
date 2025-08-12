from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.bot import Bot
from app.models.strategy import Strategy
from app.models.trading_task import TradingTask
from uuid import UUID

def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val

def user_create_trading_task(db: Session, bot_id: UUID):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if bot.is_active:
        return False
    strategy = db.query(Strategy).filter(Strategy.id == bot.strategy_id).first()
    db_trading_task = TradingTask (
        user_id = bot.user_id,
        trading_account_id = safe_uuid(bot.trading_account_id),
        bot_id = bot_id,
        symbol = strategy.symbol,
        is_active = True,
        start_time = func.now(),
    )
    db.add(db_trading_task)
    db.commit()
    db.refresh(db_trading_task)
    bot.is_active = True
    bot.current_trading_task_id = db_trading_task.id
    db.commit()
    db.refresh(bot)
    return db_trading_task

def user_get_trading_task_status(db: Session, trading_task_id: str):
    trading_task = db.query(TradingTask).filter(TradingTask.id == trading_task_id).first()
    return trading_task

def user_stop_trading_task(db: Session, trading_task_id: str):
    trading_task = db.query(TradingTask).filter(TradingTask.id == trading_task_id).first()
    trading_task.is_active = False
    trading_task.end_time = func.now()
    db.commit()
    db.refresh(trading_task)
    bot = db.query(Bot).filter(Bot.current_trading_task_id == trading_task_id).first()
    bot.is_active = False
    db.commit()
    db.refresh(bot)
    x = trading_task
    return x

def user_add_celery_id_to_trading_task(db: Session, trading_task_id: str, celery_id: str):
    trading_task = db.query(TradingTask).filter(TradingTask.id == trading_task_id).first()
    trading_task.celery_id = celery_id
    db.commit()
    db.refresh(trading_task)
    return trading_task

def user_add_win_trade(db: Session, trading_task_id: str):
    trading_task = db.query(TradingTask).filter(TradingTask.id == trading_task_id).first()
    trading_task.win_trades_count += 1
    db.commit()
    db.refresh(trading_task)
    return trading_task

def user_get_active_trading_tasks(db: Session, user_id: UUID):
    trading_tasks = db.query(TradingTask).filter(TradingTask.user_id == user_id).filter(TradingTask.is_active == True).all()
    return trading_tasks
