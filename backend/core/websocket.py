from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List

from models.message import Message
from core.database import SessionLocal


class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.rooms.setdefault(room_id, []).append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)

    async def broadcast(self, room_id: str, message: str):
        for ws in self.rooms.get(room_id, []):
            await ws.send_text(message)


manager = ConnectionManager()


async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    user_id: str
):
    await manager.connect(room_id, websocket)

    db = SessionLocal()

    try:
        while True:
            text = await websocket.receive_text()

            # Save message
            msg = Message(
                room_id=room_id,
                sender=user_id,
                content=text
            )
            db.add(msg)
            db.commit()

            # Broadcast message
            await manager.broadcast(
                room_id,
                f"{user_id}: {text}"
            )

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)

    finally:
        db.close()
