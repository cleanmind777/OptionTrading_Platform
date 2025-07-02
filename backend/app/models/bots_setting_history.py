from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID as SQLAlchemyUUID
from sqlalchemy.orm import relationship
from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.bot import Bot 
import uuid
from sqlalchemy.sql import func

class BotsSettingHistory(Base):
    __tablename__ = "bots_setting_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bot_id = Column(UUID(as_uuid=True), ForeignKey("bots.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    change_info = Column(JSON, nullable=False)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    bot = relationship("Bot", back_populates="bot_setting_history")
    user = relationship('User', back_populates='bot_setting_history')
