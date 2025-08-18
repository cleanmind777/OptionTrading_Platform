from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.models.trading_account import TradingAccount
from app.schemas.trading_account import (
    TradingAccountFilter,
    TradingAccountUpdate,
    BalanceUpdate,
)


def safe_uuid(val: str | None) -> UUID | None:
    if not val or str(val).strip() == "":
        return None
    return UUID(val) if not isinstance(val, UUID) else val


def user_get_trading_accounts(
    db: Session, trading_account_filter: TradingAccountFilter
) -> list[TradingAccount]:
    query = db.query(TradingAccount).filter(
        TradingAccount.user_id == trading_account_filter.user_id
    )

    if trading_account_filter.name:
        query = query.filter(
            TradingAccount.name.ilike(f"%{trading_account_filter.name}%")
        )  # case-insensitive partial match

    if trading_account_filter.type:
        query = query.filter(TradingAccount.type == trading_account_filter.type)

    print(query.all())
    return query.all()


def user_get_trading_account(
    db: Session, trading_account_id: UUID
) -> TradingAccount | None:
    return (
        db.query(TradingAccount).filter(TradingAccount.id == trading_account_id).first()
    )


def user_get_current_balance_of_trading_account(
    db: Session, trading_account_id: UUID
) -> float | None:
    trading_account = user_get_trading_account(db, trading_account_id)
    if trading_account:
        return trading_account.current_balance
    return None


def user_get_total_balance(db: Session, user_id: UUID) -> float:
    total_balance = (
        db.query(func.coalesce(func.sum(TradingAccount.current_balance), 0.0))
        .filter(TradingAccount.user_id == user_id)
        .scalar()
    )
    return total_balance


def user_update_trading_account(
    db: Session, update: TradingAccountUpdate
) -> TradingAccount | None:
    db_trading_account = (
        db.query(TradingAccount)
        .filter(TradingAccount.id == update.trading_account_id)
        .first()
    )
    if not db_trading_account:
        return None

    # Update only provided fields
    update_data = update.dict(exclude={"trading_account_id"}, exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_trading_account, field, value)

    db.commit()
    db.refresh(db_trading_account)
    return db_trading_account


def user_update_balance(
    db: Session, update_balance: BalanceUpdate
) -> TradingAccount | None:
    db_trading_account = (
        db.query(TradingAccount)
        .filter(TradingAccount.id == update_balance.trading_account_id)
        .first()
    )
    if not db_trading_account:
        return None

    db_trading_account.current_balance += update_balance.profit
    if update_balance.profit >= 0:
        db_trading_account.total_profit += update_balance.profit
        db_trading_account.total_wins += 1
    else:
        db_trading_account.total_loss += update_balance.profit
        db_trading_account.total_losses += 1
    db_trading_account.win_rate = db_trading_account.total_wins / (
        db_trading_account.total_wins + db_trading_account.total_losses
    )
    db.commit()
    db.refresh(db_trading_account)
    return db_trading_account
