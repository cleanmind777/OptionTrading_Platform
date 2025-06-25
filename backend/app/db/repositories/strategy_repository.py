from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.strategy import Strategy
from app.schemas.strategy import StrategyCreate

def user_create_strategy(db: Session, strategy_create: StrategyCreate):
    db_strategy = Strategy(
        user_id=strategy_create.user_id,
        name=strategy_create.name,
        description=strategy_create.description,
        created_at = func.now(),
        updated_at = func.now(),
    )
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    return db_strategy

def user_get_all_strategies(db: Session, account_id: str):
    db_strategies = db.query(Strategy).filter(Strategy.user_id == account_id).all()
    return db_strategies