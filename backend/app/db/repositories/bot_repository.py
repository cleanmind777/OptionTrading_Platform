from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.bot import Bot
from app.schemas.bot import BotCreate

def user_create_bot(db: Session, bot_create: BotCreate):
    db_strategy = Bot(
        user_id = bot_create.user_id,
        name = bot_create.name,
        description = bot_create.description,
        trading_account = bot_create.trading_account,
        is_active = bot_create.is_active,
        created_at = func.now(),
        updated_at = func.now(),
        strategy_id = bot_create.strategy_id,
        # symbol = bot_create.symbol,
        # parameters = bot_create.parameters,
        # trade_type = bot_create.trade_type,
        trade_entry = bot_create.trade_entry,
        trade_exit = bot_create.trade_exit,
        trade_stop = bot_create.trade_stop,
        trade_condition = bot_create.trade_condition,
        bot_dependencies = bot_create.bot_dependencies,
    )
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    return db_strategy
