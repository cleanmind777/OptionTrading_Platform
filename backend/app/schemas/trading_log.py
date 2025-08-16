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
