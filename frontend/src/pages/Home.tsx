import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h2>Welcome</h2>
      <p>What would you like to do?</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/rooms/create")}>
          ➕ Create Room
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate("/rooms")}>
          ➡️ Join Room
        </button>
      </div>
    </div>
  );
}
