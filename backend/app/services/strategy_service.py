from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.strategy_repository import (
    user_create_strategy,
    user_get_all_strategies,
    user_get_strategy,
    user_edit_strategy,
    user_update_balance_of_strategy,
)
from app.schemas.strategy import StrategyCreate, StrategyInfo, StrategyPerformance
from app.models.strategy import Strategy
import json
from uuid import UUID


def create_strategy(db: Session, strategy_create: StrategyCreate) -> Strategy:
    return user_create_strategy(db, strategy_create)


def edit_strategy(db: Session, strategy_edit: StrategyInfo) -> Strategy:
    return user_edit_strategy(db, strategy_edit)


def get_all_strategies(db: Session, user_id: str) -> list[Strategy]:
    return user_get_all_strategies(db, user_id)


def get_strategy(db: Session, strategy_id: str) -> Strategy:
    return user_get_strategy(db, strategy_id)


def update_balance_of_strategy(
    db: Session, strategy_id: UUID, profit: float
) -> StrategyPerformance:
    return user_update_balance_of_strategy(db, strategy_id, profit)
