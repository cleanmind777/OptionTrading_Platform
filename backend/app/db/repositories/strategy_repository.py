from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.strategy import Strategy
from app.schemas.strategy import StrategyCreate, StrategyInfo

def user_edit_strategy(db: Session, strategy_edit: StrategyInfo):
    db_strategy = db.query(Strategy).filter(Strategy.id == strategy_edit.id).first()
    db_strategy.description = strategy_edit.description
    db_strategy.updated_at = func.now()
    db_strategy.symbol = strategy_edit.symbol
    db_strategy.parameters = strategy_edit.parameters
    db_strategy.trade_type = strategy_edit.trade_type
    db_strategy.number_of_legs = strategy_edit.number_of_legs
    db_strategy.skip_am_expirations = strategy_edit.skip_am_expirations
    db_strategy.sell_bidless_longs_on_trade_exit = strategy_edit.sell_bidless_longs_on_trade_exit
    db_strategy.efficient_spreads = strategy_edit.efficient_spreads
    db_strategy.legs = strategy_edit.legs
    db.commit()
    db.refresh(db_strategy)
    db_strategies = db.query(Strategy).filter(Strategy.user_id == strategy_edit.user_id).all()
    return db_strategies

def user_create_strategy(db: Session, strategy_create: StrategyCreate):
    db_strategy = Strategy(
        user_id=strategy_create.user_id,
        name=strategy_create.name,
        created_at = func.now(),
        updated_at = func.now(),
    )
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    db_strategies = db.query(Strategy).filter(Strategy.user_id == strategy_create.user_id).all()
    return db_strategies

def user_get_all_strategies(db: Session, user_id: str):
    db_strategies = db.query(Strategy).filter(Strategy.user_id == user_id).all()
    return db_strategies

def user_get_strategy(db: Session, strategy_id: str):
    db_strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    return db_strategy