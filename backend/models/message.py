from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from core.database import Base
import uuid

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    sender_id = Column(String)
    original_text = Column(Text)
    original_language = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    