from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from core.database import Base, engine
from core.websocket import manager
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

# Include routers ONCE
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(rooms.router)      # rooms already has prefix
app.include_router(messages.router)   # messages already has prefix


@app.websocket("/ws/{room_id}/{user_id}/{lang}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    user_id: str,
    lang: str,
):
    await manager.connect(room_id, websocket)

    try:
        while True:
            text = await websocket.receive_text()
            await manager.broadcast(room_id, f"{user_id}: {text}")
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        print(f"WebSocket disconnected: {user_id} in room {room_id}")
