from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date


class TradingLogFilter(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    bot_id: Optional[UUID] = None
    strategy_id: Optional[UUID] = None
    trading_task_id: Optional[UUID] = None
    trading_account_id: Optional[UUID] = None
    symbol: Optional[str] = None
    win_loss: Optional[bool] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    limit: Optional[int] = None


class TradingLogCreate(TradingLogFilter):
    profit: Optional[float] = None
    current_total_balance: Optional[float] = None
    current_account_balance: Optional[float] = None
    current_win_rate: Optional[float] = None
    current_total_profit: Optional[float] = None
    current_total_loss: Optional[float] = None
    current_total_wins: Optional[int] = None
    current_total_losses: Optional[int] = None
    current_win_rate_for_user: Optional[float] = None
    current_total_profit_for_user: Optional[float] = None
    current_total_loss_for_user: Optional[float] = None
    current_total_wins_for_user: Optional[int] = None
    current_total_losses_for_user: Optional[int] = None
    current_win_rate_for_account: Optional[float] = None
    current_total_profit_for_account: Optional[float] = None
    current_total_loss_for_account: Optional[float] = None
    current_total_wins_for_account: Optional[int] = None
    current_total_losses_for_account: Optional[int] = None


class TradingLogCreateLowData(BaseModel):
    bot_id: UUID
    profit: float


class LogSimple(BaseModel):
    value: float
    time: datetime


class RecenTrade(BaseModel):
    time: Optional[datetime] = None
    # closed_time: Optional[datetime] = None
    symbol: Optional[str] = None
    bot: Optional[str] = None
    strategy: Optional[str] = None
    pnl: Optional[float] = None
    # status: Optional[str] = None
