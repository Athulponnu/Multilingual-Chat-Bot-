import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome 👋</h2>
        <p style={styles.subtitle}>What would you like to do?</p>

        <button
          style={{ ...styles.button, ...styles.primary }}
          onClick={() => navigate("/rooms?create=true")}
        >
          ➕ Create Room
        </button>

        <button
          style={{ ...styles.button, ...styles.secondary }}
          onClick={() => navigate("/rooms")}
        >
          ➡️ Join Room
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
  },
  card: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "8px",
    fontSize: "22px",
    fontWeight: 600,
  },
  subtitle: {
    marginBottom: "24px",
    color: "#6b7280",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginBottom: "12px",
  },
  primary: {
    background: "#2563eb",
    color: "#ffffff",
  },
  secondary: {
    background: "#e5e7eb",
    color: "#111827",
  },
};
