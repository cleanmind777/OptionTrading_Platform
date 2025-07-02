from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
import json

class BotSettingHistoryCreate(BaseModel):
    user_id: UUID
    bot_id: UUID
    change_info: Optional[Dict[str, Any]] = None
    

class BotSettingHistoryInfo(BotSettingHistoryCreate):
    id: UUID
    changed_at: Optional[datetime] = None
    
class BotSettingHistoryFilter(BaseModel):
    user_id: UUID
    bot_id: Optional[UUID] = None
    from_time: Optional[datetime] = None
    to_time: Optional[datetime] = None