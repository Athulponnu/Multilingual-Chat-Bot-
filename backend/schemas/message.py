from pydantic import BaseModel

class MessageOut(BaseModel):
    id: int
    room_id: str   # ✅ MUST be str
    sender: str
    content: str

    class Config:
        from_attributes = True
