from fastapi import APIRouter
from schemas.message import MessageCreate
from services.chat_service import handle_message

router = APIRouter()

@router.post("/")
def send_message(data: MessageCreate):
    return handle_message(data.room_id, data.text)
    