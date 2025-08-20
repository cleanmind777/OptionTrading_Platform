from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.repositories.user_repository import (
    user_update_preferences,
    user_update_discord,
    user_update_first_name,
    get_user_by_id,
    get_user_by_email,
    create_user,
    user_update_last_login_time,
    user_update_phone_number,
    user_update_email_preferences,
    user_update_account_access_settings,
    user_update_social_account,
    user_update_user_preferences,
    user_update_bot_preferences,
    user_update_email,
    user_update_password,
    user_update_trades,
    user_change_to_demo,
)
from app.services.trading_log_service import get_trading_logs
from app.services.strategy_service import get_strategy, get_all_strategies
from app.services.bot_service import get_bot, get_bots
from app.core.security import verify_password
from app.core.security import hash_password
from app.schemas.user import UserCreate, UpdateTrades, AccountInsights
from app.schemas.trading_log import TradingLogFilter, LogSimple, RecenTrade
from app.schemas.strategy import StrategyPerformance, StrategySimplePerformance
from app.schemas.bot import BotFilter
from app.models.user import User
import json
from uuid import UUID
from datetime import datetime, date, time


async def get_account_insights(db: Session, user_id: UUID) -> AccountInsights:
    user = get_user_by_id(db, user_id)
    # Get today's date
    today = date.today()

    # Start of today (midnight)
    start_of_day = datetime.combine(today, time.min)

    # End of today (just before midnight tomorrow)
    end_of_day = datetime.combine(today, time.max)
    trading_log_filter_for_today = TradingLogFilter(
        user_id=user_id, start_time=start_of_day, end_time=end_of_day
    )

    today_trades = get_trading_logs(db, trading_log_filter_for_today)
    today_pnl = 0
    for trade in today_trades:
        today_pnl += trade.profit
    trading_log_filter_for_recent = TradingLogFilter(user_id=user_id, limit=5)
    recent_trades = get_trading_logs(db, trading_log_filter_for_recent)
    changed_recent_trades: list[RecenTrade] = []
    for trade in recent_trades:
        changed_recent_trade: RecenTrade = {}
        changed_recent_trade["symbol"] = trade.symbol
        changed_recent_trade["time"] = trade.time
        changed_recent_trade["pnl"] = trade.profit
        bot = await get_bot(db, trade.bot_id)
        changed_recent_trade["bot"] = bot.name
        strategy = get_strategy(db, trade.strategy_id)
        changed_recent_trade["strategy"] = strategy.name
        changed_recent_trades.append(changed_recent_trade)

    trading_log_filter_for_user_pnl_logs = TradingLogFilter(user_id=user_id, limit=30)
    user_pnl_logs = get_trading_logs(db, trading_log_filter_for_user_pnl_logs)
    changed_user_pnl_logs: list[LogSimple] = []
    for log in user_pnl_logs:
        changed_user_pnl_log: LogSimple = {}
        changed_user_pnl_log["value"] = (
            log.current_total_profit + log.current_total_loss
        )
        changed_user_pnl_log["time"] = log.time
        changed_user_pnl_logs.append(changed_user_pnl_log)
    active_bots_filter = BotFilter(user_id=user_id, is_actuve="Enabled")
    active_bots = await get_bots(db, active_bots_filter)
    strategies = get_all_strategies(db, user_id)
    changed_strategies: list[StrategySimplePerformance] = []
    for strategy in strategies:
        changed_strategy: StrategySimplePerformance = {}
        changed_strategy["name"] = strategy.name
        changed_strategy["pnl"] = strategy.total_profit + strategy.total_loss
        changed_strategy["win_rate"] = (
            strategy.total_wins / (strategy.total_wins + strategy.total_losses)
            if strategy.total_wins + strategy.total_losses > 0
            else 0
        )
        changed_strategies.append(changed_strategy)
    account_insights = AccountInsights(
        total_balance=user.total_balance,
        today_pnl=today_pnl,
        total_pnl=user.total_profit - user.total_loss,
        active_bots=len(active_bots),
        win_rate=user.win_rate,
        total_trades=user.total_wins + user.total_losses,
        user_pnl_logs=changed_user_pnl_logs,
        strategies=changed_strategies,
        average_win=user.total_profit / user.total_wins if user.total_wins > 0 else 0,
        average_loss=(
            user.total_losses / user.total_losses if user.total_losses > 0 else 0
        ),
        risk_reward_ratio=round(
            user.total_profit / user.total_loss if user.total_losses > 0 else 0, 2
        ),
        recent_trades=changed_recent_trades,
    )
    return account_insights


def get_user_info(db: Session, user_id) -> User:
    return get_user_by_id(db, user_id)


def register_user(db: Session, user_create: UserCreate) -> User:
    return create_user(db, user_create)


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    print("DB Password:", user.hashed_password)
    print("Input Password:", hash_password(password))
    if not user or not verify_password(password, user.hashed_password):
        return None
    else:
        user_update_last_login_time(db, email)
    return user


def get_account_id(db: Session, email: str) -> str:
    user = get_user_by_email(db, email)
    print(user.id)
    return user.id


def update_phone_number(db: Session, email: str, new_phone_number: str) -> User:
    return user_update_phone_number(db, email, new_phone_number)


def update_email_preferences(db: Session, email: str, email_preferences: json) -> User:
    return user_update_email_preferences(db, email, email_preferences)


def update_account_access_settings(
    db: Session, email: str, account_access_settings: json
) -> User:
    return user_update_account_access_settings(db, email, account_access_settings)


def update_social_account(db: Session, email: str, social_account: json) -> User:
    return user_update_social_account(db, email, social_account)


def update_user_preferences(db: Session, email: str, user_preferences: json) -> User:
    return user_update_user_preferences(db, email, user_preferences)


def update_bot_preferences(db: Session, email: str, bot_preferences: json) -> User:
    return user_update_bot_preferences(db, email, bot_preferences)


def update_preferences(
    db: Session, email: str, user_preferences: json, bot_preferences: json
) -> User:
    return user_update_preferences(db, email, user_preferences, bot_preferences)


def update_email(db: Session, current_email: str, new_email: str):
    return user_update_email(db, current_email, new_email)


def update_password(db: Session, email: str, password: str):
    return user_update_password(db, email, password)


def update_first_name(db: Session, email: str, new_first_name: str):
    return user_update_first_name(db, email, new_first_name)


def update_discord(db: Session, email: str, new_discord: str):
    return user_update_discord(db, email, new_discord)


def update_trades(db: Session, update_trades_data: UpdateTrades) -> User:
    return user_update_trades(db, update_trades_data)


def change_to_demo(db: Session, user_id: UUID) -> bool:
    return user_change_to_demo(db, user_id)
