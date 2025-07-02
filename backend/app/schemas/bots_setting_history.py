from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
import json

class BotSettingHistoryCreate(BaseModel):
    user_id: UUID
    bot_id: UUID
    change_info: Optional[List[Dict[str, Any]]] = None
    
class BotSettingHistoryInfo(BotSettingHistoryCreate):
    id: UUID
    changed_at: Optional[datetime] = None
    
class BotSettingHistoryFilter(BaseModel):
    user_id: str
    bot_id: Optional[str] = None
    from_time: Optional[datetime] = None
    to_time: Optional[datetime] = None
    
class BotSettingHistoryResponse(BotSettingHistoryInfo):
    bot_name: str  # This will be populated from the Bot relationship

    class Config:
        from_attributes = True