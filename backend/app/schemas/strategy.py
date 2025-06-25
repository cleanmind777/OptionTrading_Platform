from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
import json
class StrategyCreate(BaseModel):
    user_id: UUID
    name: str
    description: Optional[str] = None

class StrategyBase(StrategyCreate):
    id: Optional[UUID] = None

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
    leg1: Optional[Dict[str, Any]] = None
    leg2: Optional[Dict[str, Any]] = None
    leg3: Optional[Dict[str, Any]] = None
    leg4: Optional[Dict[str, Any]] = None