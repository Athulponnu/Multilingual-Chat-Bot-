from datetime import datetime
from pydantic import BaseModel


class MessageOut(BaseModel):
    id: str
    sender: str
    content: str
    language: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
