from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.strategy_repository import user_create_strategy, user_get_all_strategies, user_get_strategy
from app.schemas.strategy import StrategyCreate
from app.models.strategy import Strategy
import json

def create_strategy(db: Session, strategy_create: StrategyCreate) -> Strategy:
    return user_create_strategy(db, strategy_create)

def get_all_strategies(db: Session, user_id: str):
    return user_get_all_strategies(db, user_id)

def get_strategy(db: Session, strategy_id: str) -> Strategy:
    return user_get_strategy(db, strategy_id)