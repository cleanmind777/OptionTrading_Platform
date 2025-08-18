from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.trading_account import TradingAccount
from app.models.enums import TradingAccountTypeEnum
from app.schemas.demo import DemoTradingAccountCreate
from app.schemas.trading_account import TradingAccountFilter
from app.schemas.bot import BotFilter
from app.db.repositories.demo_repository import (
    user_create_demo_trading_account,
    user_add_demo_trading_account_to_bot,
    user_delete_demo_at_bot,
    user_delete_demo_at_user,
)
from app.schemas.trading_log import (
    TradingLogFilter,
    TradingLogCreate,
    TradingLogCreateLowData,
)
from app.schemas.trading_account import BalanceUpdate
from app.db.repositories.trading_account_repository import user_get_trading_accounts
from app.services.bot_service import get_bots, get_bot
from app.services.strategy_service import get_strategy
from app.services.trading_account_service import (
    get_trading_accounts,
    get_trading_account,
    get_total_balance,
    get_current_balance_of_trading_account,
    update_balance,
    delete_trading_accounts,
)
from app.services.trading_log_serivce import (
    create_trading_log,
    get_trading_log,
    get_trading_logs,
    delete_trading_logs,
)
import json, random
from uuid import UUID


def create_demo_accounts(db: Session, user_id: UUID):
    accounts_data = [
        ("Demo Schwab", TradingAccountTypeEnum.SCHWAB),
        ("Demo Tradier", TradingAccountTypeEnum.TRADIER),
        ("Demo TastyTrader", TradingAccountTypeEnum.TASTYTRADER),
    ]

    for name, account_type in accounts_data:
        demo_account = DemoTradingAccountCreate(
            user_id=user_id,
            name=name,
            type=account_type,
            current_balance=round(random.uniform(10_000.0, 1_000_000.0), 2),
        )
        user_create_demo_trading_account(db, demo_account)

    trading_account_filter = TradingAccountFilter(user_id=user_id)
    return user_get_trading_accounts(db, trading_account_filter)


async def create_demo_trading_logs_for_bot(db: Session, bot_id: UUID):
    bot = await get_bot(db, bot_id)
    for i in range(0, 30):
        profit = random.uniform(-1000.0, 1000.0)
        trading_log_create_low_data = TradingLogCreateLowData(
            bot_id=bot_id, profit=profit
        )
        await create_trading_log(db, trading_log_create_low_data)

    trading_log_filter = TradingLogFilter(user_id=bot.user_id, bot_id=bot_id)
    return get_trading_logs(db, trading_log_filter)


async def create_demo_trading_logs(db: Session, user_id: UUID):
    bot_filters = BotFilter(
        user_id=user_id,
        entryDay="Any",
        is_active="All",
        name="",
        strategy="All",
        symbol="All",
        trading_account="All",
        webhookPartial="No",
    )
    bots = await get_bots(db, bot_filters)
    for bot in bots:
        await create_demo_trading_logs_for_bot(db, bot.id)

    trading_log_filter = TradingLogFilter(user_id=user_id)
    return get_trading_logs(db, trading_log_filter)


async def add_demo_trading_account_to_bots(db: Session, user_id: UUID):
    bot_filters = BotFilter(
        user_id=user_id,
        entryDay="Any",
        is_active="All",
        name="",
        strategy="All",
        symbol="All",
        trading_account="All",
        webhookPartial="No",
    )
    bots = await get_bots(db, bot_filters)
    if not bots:
        return None

    trading_account_filter = TradingAccountFilter(user_id=user_id)
    trading_accounts = get_trading_accounts(db, trading_account_filter)

    if not trading_accounts:
        trading_accounts = create_demo_accounts(db, user_id)

    for bot in bots:
        assigned_account = random.choice(trading_accounts)
        user_add_demo_trading_account_to_bot(db, bot.id, assigned_account.id)

    return get_bots(db, bot_filters)


async def create_demo(db: Session, user_id: UUID):
    bots = await add_demo_trading_account_to_bots(db, user_id)
    if not bots:
        return None
    return await create_demo_trading_logs(db, user_id)


async def delete_demo(db: Session, user_id: UUID):
    trading_log_filter = TradingLogFilter(user_id=user_id)
    await delete_trading_logs(db, trading_log_filter)
    trading_account_filter = TradingAccountFilter(user_id=user_id)
    await delete_trading_accounts(db, trading_account_filter)
    await user_delete_demo_at_user(db, user_id)
    await user_delete_demo_at_bot(db, user_id)
    return True
