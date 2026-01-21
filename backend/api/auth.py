from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import SessionLocal
from core.security import hash_password, verify_password, create_access_token
from models.user import User
from schemas.auth import RegisterRequest, LoginRequest

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail="User already exists")

    user = User(
        email=data.email,
        password=hash_password(data.password),
    )
    db.add(user)
    db.commit()

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "user_id": user.email}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "user_id": user.email}
