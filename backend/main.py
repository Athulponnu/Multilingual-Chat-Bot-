from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
from core.database import SessionLocal
from core.database import Base, engine
from core.websocket import manager
from core.security import decode_token
from models.message import Message
from api import auth, users, rooms, messages
# from api import translations

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Multilingual Chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(rooms.router)
app.include_router(messages.router)
# app.include_router(translations.router)

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()  # ✅ ACCEPT FIRST

    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    payload = decode_token(token)
    if not payload or "sub" not in payload:
        await websocket.close(code=1008)
        return

    user_id = payload["sub"]
    lang = websocket.query_params.get("lang", "en")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        sender_name = user.email if user else user_id

        manager.rooms.setdefault(room_id, []).append(websocket)

        while True:
            text = await websocket.receive_text()

            msg = Message(
                room_id=room_id,
                sender_id=user_id,
                original_text=text,
                original_language=lang,
            )
            db.add(msg)
            db.commit()

            await manager.broadcast(
                room_id,
                {
                    "type": "message",
                    "sender_id": user_id,
                    "sender_name": sender_name,
                    "text": text,
                    "room_id": room_id,
                }
            )

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)

    finally:
        db.close()
