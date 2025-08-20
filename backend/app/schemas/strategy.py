from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
import json


class StrategyCreate(BaseModel):
    user_id: UUID
    name: str


class StrategyBase(StrategyCreate):
    id: Optional[UUID] = None
    description: Optional[str] = None


class Leg(BaseModel):
    strike_target_type: Optional[str] = None
    strike_target_value: Optional[List[Any]] = None
    option_type: Optional[str] = None
    long_or_short: Optional[str] = None
    size_ratio: Optional[Any] = None
    days_to_expiration_type: Optional[str] = None
    days_to_expiration_value: Optional[List[Any]] = None


class StrategyInfo(StrategyBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    symbol: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    trade_type: Optional[str] = None
    number_of_legs: Optional[int] = None
    skip_am_expirations: Optional[bool] = None
    sell_bidless_longs_on_trade_exit: Optional[bool] = None
    efficient_spreads: Optional[bool] = None
    legs: Optional[List[Dict]] = None
    is_active: bool


class StrategySimplePerformance(BaseModel):
    id: UUID
    name: Optional[str] = None
    pnl: Optional[float] = None
    win_rate: Optional[float] = None


class StrategyPerformance(BaseModel):
    strategy_id: UUID
    name: str
    symbol: str
    total_profit: Optional[float] = None
    total_loss: Optional[float] = None
    total_wins: Optional[int] = None
    total_losses: Optional[int] = None
    win_rate: Optional[float] = None
