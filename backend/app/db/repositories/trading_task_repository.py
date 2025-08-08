from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.bot import Bot
from app.models.trading_task import TradingTask
from uuid import UUID

def safe_uuid(val):
    if not val or str(val).strip() == "":
        return None
    return val

def user_create_trading_task(db: Session, bot_id: UUID, trading_task_id: str):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    db_trading_task = TradingTask (
        id = trading_task_id,
        user_id = bot.user_id,
        trading_account_id = safe_uuid(bot.trading_account_id),
        bot_id = bot_id,
        is_active = True,
        start_time = func.now(),
    )
    db.add(db_trading_task)
    db.commit()
    db.refresh(db_trading_task)
    return db_trading_task

