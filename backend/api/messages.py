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
    return (
        db.query(Message)
        .filter(Message.room_id == room_id)
        .order_by(Message.created_at)
        .all()
    )
