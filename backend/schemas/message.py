from datetime import datetime
from pydantic import BaseModel


class MessageOut(BaseModel):
    sender_id: str
    sender_name: str | None = None
    original_text: str
    original_language: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
