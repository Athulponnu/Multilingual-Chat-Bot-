import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { state } from "../state";

type Room = {
  id: string;   // 🔧 FIX: room id is UUID string, not number
  name: string;
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [manualRoomId, setManualRoomId] = useState(""); // ✅ NEW
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const isCreate = params.get("create") === "true";

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    const res = await fetch("http://127.0.0.1:8000/rooms", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    const data = await res.json();
    setRooms(data);
  }

  async function createRoom() {
    if (!roomName.trim()) return;

    const res = await fetch("http://127.0.0.1:8000/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ name: roomName }),
    });

    const room = await res.json();
    navigate(`/chat/${room.id}`);
  }

  // ✅ NEW: manual join (for testing / second user)
  function joinByRoomId() {
    if (!manualRoomId.trim()) return;
    navigate(`/chat/${manualRoomId.trim()}`);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Rooms</h2>

      {isCreate && (
        <>
          <h3>Create Room</h3>
          <input
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button onClick={createRoom}>Create</button>
          <hr />
        </>
      )}

      {/* ✅ NEW SECTION (does not affect existing UI) */}
      <h3>Join by Room ID</h3>
      <input
        placeholder="Paste Room ID"
        value={manualRoomId}
        onChange={(e) => setManualRoomId(e.target.value)}
      />
      <button onClick={joinByRoomId}>Join</button>

      <hr />

      <h3>Available Rooms</h3>

      {rooms.length === 0 && <p>No rooms available</p>}

      {rooms.map((room) => (
        <div key={room.id}>
          {room.name}
          <button onClick={() => navigate(`/chat/${room.id}`)}>
            Join
          </button>
        </div>
      ))}
    </div>
  );
}
