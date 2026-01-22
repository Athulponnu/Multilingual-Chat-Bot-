from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
from core.database import SessionLocal
from core.database import Base, engine
from core.websocket import manager
from core.security import decode_token
from models.message import Message
from api import auth, users, rooms, messages

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


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    payload = decode_token(token)

    user_id = payload["sub"]
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    sender_name = user.email if user else user_id

    lang = payload.get("lang", "en")

    await manager.connect(room_id, websocket)
    db = SessionLocal()

    try:
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
        print(f"WebSocket disconnected: {user_id} in room {room_id}")

    finally:
        db.close()
