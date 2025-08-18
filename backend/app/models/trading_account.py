from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    JSON,
    DateTime,
    ForeignKey,
    Float,
)
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class TradingAccount(Base):
    __tablename__ = "trading_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(String, nullable=True)
    api_key = Column(String, nullable=True)
    api_secret = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    access_token = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    current_balance = Column(Float, nullable=True, default=1000000.0)
    total_profit = Column(Float, nullable=True, default=0.0)
    total_loss = Column(Float, nullable=True, default=0.0)
    total_wins = Column(Integer, nullable=True, default=0.0)
    total_losses = Column(Integer, nullable=True, default=0.0)
    win_rate = Column(Float, nullable=False, default=1)

    user = relationship("User", back_populates="trading_accounts")
    # bots = relationship("Bot", back_populates="trading_account")
    trading_tasks = relationship("TradingTask", back_populates="trading_account")
    trading_logs = relationship("TradingLog", back_populates="trading_account")
