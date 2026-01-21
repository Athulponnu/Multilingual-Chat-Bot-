from fastapi import APIRouter
from core.database import SessionLocal
from models.user import User

router = APIRouter()

@router.get("/")
def list_users():
    db = SessionLocal()
    return db.query(User).all()
