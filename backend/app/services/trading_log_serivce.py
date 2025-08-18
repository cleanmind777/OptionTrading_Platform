from sqlalchemy.orm import Session
from app.db.repositories.trading_log_repository import (
    user_create_trading_log,
    user_get_trading_log,
    user_get_trading_logs,
)
from app.services.bot_service import get_bots, get_bot, update_bot_balance
from app.services.strategy_service import get_strategy
from app.services.trading_account_service import (
    get_trading_account,
    get_total_balance,
    update_balance,
)
from app.services.user_service import update_trades
from app.schemas.trading_log import (
    TradingLogFilter,
    TradingLogCreate,
    TradingLogCreateLowData,
)
from app.schemas.trading_account import BalanceUpdate
from app.schemas.user import UpdateTrades
from uuid import UUID


async def create_trading_log(
    db: Session, trading_log_create_low_data: TradingLogCreateLowData
):
    bot = await update_bot_balance(db, trading_log_create_low_data)
    trading_account = get_trading_account(db, bot.trading_account_id)
    strategy = get_strategy(db, bot.strategy_id)
    update_balance_data = BalanceUpdate(
        trading_account_id=trading_account.id, profit=trading_log_create_low_data.profit
    )
    updated_trading_account = update_balance(db, update_balance_data)
    total_balance = get_total_balance(db, bot.user_id)
    update_trades_data = UpdateTrades(
        user_id=bot.user_id,
        profit=trading_log_create_low_data.profit,
        total_balance=total_balance,
    )
    user = update_trades(db, update_trades_data)
    trading_log_create = TradingLogCreate(
        user_id=bot.user_id,
        bot_id=bot.id,
        trading_account_id=bot.trading_account_id,
        symbol=strategy.symbol,
        profit=trading_log_create_low_data.profit,
        win_loss=trading_log_create_low_data.profit >= 0,
        current_account_balance=updated_trading_account.current_balance,
        current_total_balance=total_balance,
        current_win_rate=bot.win_rate,
        current_total_profit=bot.total_profit,
        current_total_loss=bot.total_loss,
        current_total_wins=bot.win_trades_count,
        current_total_losses=bot.loss_trades_count,
        current_win_rate_for_user=user.win_rate,
        current_total_profit_for_user=user.total_profit,
        current_total_loss_for_user=user.total_loss,
        current_total_wins_for_user=user.total_wins,
        current_total_losses_for_user=user.total_losses,
        current_win_rate_for_account=updated_trading_account.win_rate,
        current_total_profit_for_account=updated_trading_account.total_profit,
        current_total_loss_for_account=updated_trading_account.total_loss,
        current_total_wins_for_account=updated_trading_account.total_wins,
        current_total_losses_for_account=updated_trading_account.total_losses,
    )
    return user_create_trading_log(db, trading_log_create)


def get_trading_log(db: Session, trading_log_id: UUID):
    return user_get_trading_log(db, trading_log_id)


def get_trading_logs(db: Session, trading_log_filter: TradingLogFilter):
    return user_get_trading_logs(db, trading_log_filter)
