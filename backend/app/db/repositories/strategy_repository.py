from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.strategy import Strategy
from app.schemas.strategy import StrategyCreate, StrategyInfo
from uuid import UUID
from app.schemas.strategy import StrategyPerformance


def user_edit_strategy(db: Session, strategy_edit: StrategyInfo):
    db_strategy = db.query(Strategy).filter(Strategy.id == strategy_edit.id).first()
    strategy_change_info = []
    if db_strategy.description != strategy_edit.description:
        strategy_change_info.append(
            {"description": [db_strategy.description, strategy_edit.description]}
        )
        db_strategy.description = strategy_edit.description

    db_strategy.updated_at = func.now()

    if db_strategy.symbol != strategy_edit.symbol:
        strategy_change_info.append(
            {"Symbol": [db_strategy.symbol, strategy_edit.symbol]}
        )
        db_strategy.symbol = strategy_edit.symbol
    if db_strategy.parameters != strategy_edit.parameters:
        strategy_change_info.append(
            {"Parameters": [db_strategy.parameters, strategy_edit.parameters]}
        )
        db_strategy.parameters = strategy_edit.parameters
    if db_strategy.trade_type != strategy_edit.trade_type:
        strategy_change_info.append(
            {"Trade Type": [db_strategy.trade_type, strategy_edit.trade_type]}
        )
        db_strategy.trade_type = strategy_edit.trade_type
    if db_strategy.number_of_legs != strategy_edit.number_of_legs:
        strategy_change_info.append(
            {
                "Number of Legs": [
                    db_strategy.number_of_legs,
                    strategy_edit.number_of_legs,
                ]
            }
        )
        db_strategy.number_of_legs = strategy_edit.number_of_legs
    if db_strategy.skip_am_expirations != strategy_edit.skip_am_expirations:
        strategy_change_info.append(
            {
                "Skip Am Expirations": [
                    db_strategy.skip_am_expirations,
                    strategy_edit.skip_am_expirations,
                ]
            }
        )
        db_strategy.skip_am_expirations = strategy_edit.skip_am_expirations
    if (
        db_strategy.sell_bidless_longs_on_trade_exit
        != strategy_edit.sell_bidless_longs_on_trade_exit
    ):
        strategy_change_info.append(
            {
                "Sell Bidless Longs on Trade Exit": [
                    db_strategy.sell_bidless_longs_on_trade_exit,
                    strategy_edit.sell_bidless_longs_on_trade_exit,
                ]
            }
        )
        db_strategy.sell_bidless_longs_on_trade_exit = (
            strategy_edit.sell_bidless_longs_on_trade_exit
        )
    if db_strategy.efficient_spreads != strategy_edit.efficient_spreads:
        strategy_change_info.append(
            {
                "Efficient Spreads": [
                    db_strategy.efficient_spreads,
                    strategy_edit.efficient_spreads,
                ]
            }
        )
        db_strategy.efficient_spreads = strategy_edit.efficient_spreads
    if db_strategy.legs != strategy_edit.legs:
        strategy_change_info.append({"Legs": [db_strategy.legs, strategy_edit.legs]})
        db_strategy.legs = strategy_edit.legs
    db.commit()
    db.refresh(db_strategy)
    db_strategies = (
        db.query(Strategy).filter(Strategy.user_id == strategy_edit.user_id).all()
    )
    return {"strategies": db_strategies, "change_info": strategy_change_info}


def user_create_strategy(db: Session, strategy_create: StrategyCreate):
    db_strategy = Strategy(
        user_id=strategy_create.user_id,
        name=strategy_create.name,
        created_at=func.now(),
        updated_at=func.now(),
    )
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    db_strategies = (
        db.query(Strategy).filter(Strategy.user_id == strategy_create.user_id).all()
    )
    return db_strategies


def user_get_all_strategies(db: Session, user_id: str) -> list[Strategy]:
    db_strategies = db.query(Strategy).filter(Strategy.user_id == user_id).all()
    return db_strategies


def user_get_strategy(db: Session, strategy_id: str):
    db_strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    return db_strategy


def user_update_balance_of_strategy(
    db: Session, strategy_id: UUID, profit: float
) -> StrategyPerformance:
    db_strategy = db.query(Strategy).filter(Strategy.id == strategy_id).first()
    if profit >= 0:
        db_strategy.total_profit += profit
        db_strategy.total_wins += 1
    else:
        db_strategy.total_loss += profit
        db_strategy.total_losses += 1
    db.commit()
    db.refresh(db_strategy)
    updated_strategy_performance = StrategyPerformance(
        strategy_id=db_strategy.id,
        name=db_strategy.name,
        symbol=db_strategy.symbol,
        total_profit=db_strategy.total_profit,
        total_loss=db_strategy.total_loss,
        total_wins=db_strategy.total_wins,
        total_losses=db_strategy.total_losses,
        win_rate=(
            db_strategy.total_wins / (db_strategy.total_wins + db_strategy.total_losses)
        ),
    )
    return updated_strategy_performance
