from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func

class Group(Base):
    __tablename__ = 'groups'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_name = Column(String, unique=True, index=True, nullable=False)
    img_url = Column(String, nullable=True)
    admin_email = Column(String, nullable=False)
    notification_email = Column(String, nullable=False)
    total_users = Column(Integer, nullable=False, default=1)
    shared_bots = Column(Integer, nullable=False, default=0)