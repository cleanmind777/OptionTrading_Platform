from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Float, ARRAY
from typing import List, Dict
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import json
legssample = [{
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    }]

class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    symbol = Column(String, nullable=True)
    parameters = Column(JSON, nullable=True)
    trade_type = Column(String, nullable=True)
    number_of_legs = Column(Integer, nullable=True)
    skip_am_expirations = Column(Boolean, default=False)
    sell_bidless_longs_on_trade_exit = Column(Boolean, default=False)
    efficient_spreads = Column(Boolean, default=False)
    legs = Column(JSON, nullable=True, default=legssample)
    user = relationship("User", back_populates="strategies")
    bots = relationship("Bot", back_populates="strategy")
    