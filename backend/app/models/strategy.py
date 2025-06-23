from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
    
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
    leg1 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    leg2 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    leg3 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    leg4 = Column(JSON, nullable=True, default={
        "strike_target_type" : "",
        "strike_target_value" : [0.0, 0.0, 0.0], # value, min, max
        "option_type" : None,
        "long_or_short" : None,
        "size_ratio" : 1,
        "days_to_expiration_type" : "Exact",
        "days_to_expiration_value" : [0.0, 0.0, 0.0], #[Target, min, max]
        "conflict_resolution" : False,
        "conflict_resolution_value" : [0,0], #[Towards Underlying Mark, Away From Underlying Mark]
    })
    trade_entry = Column(JSON, nullable=True, default={
        "enter_by" : "BOT SETTINGS",
        "auto_size_down" : False,
        "entry_speed" : "NORMAL",
        "position_sizing" : "",
        "position_sizing_value" : 0.0,
        "include_credit" : False,
        "entry_time_window_start" : [0,0,0],
        "entry_time_window_end" : [0,0,0],
        "days_of_week_to_enter" : [True, True, True, True, True],
        "open_if_no_position_or_staggered_days" : "NO POSITION",
        "entry_day_literval" : 0,
        "sequential_entry_delay" : 60
    })
    