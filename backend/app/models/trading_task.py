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
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class TradingTask(Base):
    __tablename__ = "trading_tasks"
    # __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    celery_id = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    # trading_account_id = Column(
    #     UUID, ForeignKey("trading_accounts.id", ondelete="CASCADE"), nullable=True
    # )
    trading_account_id = Column(String, nullable=True)
    bot_id = Column(UUID(as_uuid=True), ForeignKey("bots.id"), nullable=False)
    is_active = Column(Boolean, nullable=True, default=True)
    symbol = Column(String, nullable=True)
    total_profit = Column(Float, nullable=True, default=0.0)
    win_trades_count = Column(Integer, nullable=True, default=0)
    loss_trades_count = Column(Integer, nullable=True, default=0)
    average_win = Column(Float, nullable=True, default=0.0)
    average_loss = Column(Float, nullable=True, default=0.0)
    start_time = Column(DateTime, nullable=True, server_default=func.now())
    end_time = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="trading_tasks")
    bot = relationship("Bot", back_populates="trading_tasks")
    # trading_account = relationship("TradingAccount", back_populates="trading_tasks")
    trading_logs = relationship("TradingLog", back_populates="trading_task")
