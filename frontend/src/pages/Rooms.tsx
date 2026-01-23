import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { state } from "../state";

type Room = {
  id: string;
  name: string;
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [manualRoomId, setManualRoomId] = useState("");
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

  function joinByRoomId() {
    if (!manualRoomId.trim()) return;
    navigate(`/chat/${manualRoomId.trim()}`);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Rooms</h2>

        {/* ================= CREATE MODE ================= */}
        {isCreate && (
          <>
            <h3>Create Room</h3>

            <input
              style={styles.input}
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <button style={styles.primaryBtn} onClick={createRoom}>
              Create Room
            </button>

            <hr style={styles.divider} />

            <h3>Available Rooms</h3>

            {rooms.length === 0 && <p>No rooms available</p>}

            {rooms.map((room) => (
              <div key={room.id} style={styles.roomRow}>
                <span>{room.name}</span>
                <button
                  style={styles.joinBtn}
                  onClick={() => navigate(`/chat/${room.id}`)}
                >
                  Join
                </button>
              </div>
            ))}
          </>
        )}

        {/* ================= JOIN MODE ================= */}
        {!isCreate && (
          <>
            <h3>Join by Room ID</h3>

            <input
              style={styles.input}
              placeholder="Paste Room ID"
              value={manualRoomId}
              onChange={(e) => setManualRoomId(e.target.value)}
            />

            <button style={styles.secondaryBtn} onClick={joinByRoomId}>
              Join Room
            </button>

            {rooms.length > 0 && (
              <>
                <hr style={styles.divider} />
                <h3>Your Joined Rooms</h3>

                {rooms.map((room) => (
                  <div key={room.id} style={styles.roomRow}>
                    <span>{room.name}</span>
                    <button
                      style={styles.joinBtn}
                      onClick={() => navigate(`/chat/${room.id}`)}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    paddingTop: 60,
  },
  card: {
    width: 420,
    background: "#fff",
    padding: 32,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  primaryBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  secondaryBtn: {
    width: "100%",
    padding: 12,
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  divider: {
    margin: "20px 0",
  },
  roomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  joinBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#e5e7eb",
    cursor: "pointer",
  },
};
