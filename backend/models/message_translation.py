import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, UniqueConstraint
from core.database import Base


class MessageTranslation(Base):
    __tablename__ = "message_translations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(
        String,
        ForeignKey("messages.id", ondelete="CASCADE"),
        nullable=False
    )
    target_language = Column(String(10), nullable=False)
    translated_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("message_id", "target_language"),
    )
