from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class TradingLogFilter(BaseModel):
    user_id: UUID
    bot_id: Optional[UUID] = None
    trading_task_id: Optional[UUID] = None
    trading_account_id: Optional[UUID] = None
    symbol: Optional[str] = None
    win_loss: Optional[bool] = None


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
