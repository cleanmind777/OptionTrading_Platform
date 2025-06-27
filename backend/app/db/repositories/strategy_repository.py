from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.strategy import Strategy
from app.schemas.strategy import StrategyCreate

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