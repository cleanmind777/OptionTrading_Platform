from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.strategy_repository import user_create_strategy, user_get_all_strategies
from app.schemas.strategy import StrategyCreate
from app.models.strategy import Strategy
import json

def create_strategy(db: Session, strategy_create: StrategyCreate) -> Strategy:
    return user_create_strategy(db, strategy_create)

def get_all_strategies(db: Session, account_id: str) -> Strategy:
    return user_get_all_strategies(db, account_id)