from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import SessionLocal
from models.room import Room
from schemas.room import RoomCreate

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def list_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    return [{"id": r.id, "name": r.name} for r in rooms]


@router.post("/")
def create_room(data: RoomCreate, db: Session = Depends(get_db)):
    room = Room(name=data.name)
    db.add(room)
    db.commit()
    db.refresh(room)
    return {"id": room.id, "name": room.name}
