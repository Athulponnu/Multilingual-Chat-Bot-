from sqlalchemy import Column, String, Text
from core.database import Base
import uuid

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = Column(String)
    sender_id = Column(String)
    original_text = Column(Text)
    original_language = Column(String)
