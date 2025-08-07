from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class TradingLog(Base):
    __tablename__ = "trading_logs"
    # __table_args__ = {'extend_existing': True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    trading_account_id = Column(UUID(as_uuid=True), ForeignKey('trading_accounts.id'), nullable=True)
    bot_id = Column(UUID(as_uuid=True), ForeignKey('bots.id'), nullable=False)
    trading_task_id = Column(UUID(as_uuid=True), ForeignKey('bots.id'), nullable=True)
    symbol = Column(String, nullable=True)
    win_loss = Column(Boolean, nullable=True)
    profit = Column(Float, nullable=True, default=0.0)
    time = Column(DateTime, nullable=True, server_default=func.now())
    
    user = relationship("User", back_populates="trading_logs")
    bot = relationship("Bot", back_populates="trading_logs")
    trading_account = relationship("TradingAccount", back_populates="trading_logs")
    trading_task = relationship("TradingTask", back_populates="trading_logs")
    
    