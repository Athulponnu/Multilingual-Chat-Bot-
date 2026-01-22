from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.message import Message
from schemas.message import MessageOut

router = APIRouter(prefix="/messages", tags=["Messages"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{room_id}", response_model=list[MessageOut])
def get_room_messages(room_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(Message)
        .filter(Message.room_id == room_id)
        .order_by(Message.created_at)
        .all()
    )

    return [
        {
            "sender_id": m.sender_id,
            "sender_name": m.sender_id,  # TEMP: email / uuid
            "original_text": m.original_text,
            "original_language": m.original_language,
            "created_at": m.created_at,
        }
        for m in messages
    ]
