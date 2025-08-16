from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.trading_account_repository import (
    user_get_trading_accounts,
    user_get_trading_account,
    user_get_current_balance_of_trading_account,
    user_get_total_balance,
    user_update_trading_account,
    user_update_balance,
)
from app.schemas.trading_account import (
    TradingAccountFilter,
    TradingAccountUpdate,
    BalanceUpdate,
)
from uuid import UUID


def get_trading_accounts(db: Session, trading_account_filters: TradingAccountFilter):
    return user_get_trading_accounts(db, trading_account_filters)


def get_trading_account(db: Session, trading_account_id: UUID):
    return user_get_trading_account(db, trading_account_id)


def get_current_balance_of_trading_account(db: Session, trading_account_id: UUID):
    return user_get_current_balance_of_trading_account(db, trading_account_id)


def get_total_balance(db: Session, user_id: UUID):
    return user_get_total_balance(db, user_id)


def update_trading_account(db: Session, update: TradingAccountUpdate):
    return user_update_trading_account(db, update)


def update_balance(db: Session, update_balance: BalanceUpdate):
    return user_update_balance(db, update_balance)
