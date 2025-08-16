from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
import json
from app.models.enums import TradingAccountTypeEnum


class TradingAccountFilter(BaseModel):
    user_id: UUID
    name: Optional[str] = None
    type: Optional[TradingAccountTypeEnum] = None


class TradingAccountUpdate(BaseModel):
    trading_account_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    current_balance: Optional[float] = None


class BalanceUpdate(BaseModel):
    trading_account_id: UUID
    profit: float
