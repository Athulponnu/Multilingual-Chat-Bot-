import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import birdGif from "../assets/bird.gif";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  /* ===== SIMPLE LOADING SCREEN ===== */
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loader} />
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  /* ===== MAIN PAGE ===== */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* LEFT: Action Card */}
        <div style={styles.card}>
          {/* 🐦 Bird with rounded corners */}
          <div style={styles.birdWrapper}>
            <img src={birdGif} alt="Bird" style={styles.bird} />
          </div>

          <p style={styles.birdText}>Let conversations fly</p>

          {/* ⬅️➡️ Buttons */}
          <div style={styles.buttonRow}>
            <button
              style={{ ...styles.button, ...styles.primary }}
              onClick={() => navigate("/rooms?create=true")}
            >
              Create Room
            </button>

            <button
              style={{ ...styles.button, ...styles.secondary }}
              onClick={() => navigate("/rooms")}
            >
              Join Room
            </button>
          </div>
        </div>

        {/* RIGHT: Info Card */}
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>How this works</h3>
          <ul style={styles.infoList}>
            <li>🌐 Create or join a chat room</li>
            <li>💬 Chat in your own language</li>
            <li>🔁 Messages auto-translate in real time</li>
            <li>🔐 Secure & private conversations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ===== Styles ===== */
const styles: Record<string, any> = {
  /* ===== Loading ===== */
  loadingPage: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  },

  loader: {
    width: 42,
    height: 42,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },

  /* ===== Page ===== */
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #fbffdb, #8bbbfa)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    display: "flex",
    gap: 48,
    alignItems: "center",
  },

  /* ===== Main Card ===== */
  card: {
    background: "#a7d8fd",
    padding: 48,
    borderRadius: 20,
    width: 420,
    boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  /* 🐦 Bird wrapper (CRITICAL) */
  birdWrapper: {
    width: 350,
    borderRadius: 12,
    overflow: "hidden", // 🔑 forces rounding
    margin: "0 auto 8px",
  },

  bird: {
    width: "100%",
    display: "block",
  },

  birdText: {
    marginBottom: 28,
    fontSize: 22,
    color: "#000000",
    fontStyle: "italic",
  },

  /* ⬅️➡️ Buttons */
  buttonRow: {
    display: "flex",
    gap: 16,
  },

  button: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
  },

  primary: {
    background: "#6366f1",
    color: "#ffffff",
  },

  secondary: {
    background: "#eef2ff",
    color: "#001eff",
  },

  /* ===== Info Card ===== */
  infoCard: {
    width: 340,
    background: "rgba(247, 255, 103, 0.75)",
    backdropFilter: "blur(8px)",
    padding: 36,
    borderRadius: 20,
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },

  infoTitle: {
    marginBottom: 5,
    fontSize: 25,
    fontWeight: 600,
  },

  infoList: {
    paddingLeft: 38,
    color: "#000000",
    fontSize: 16,
    lineHeight: 1.5,
  },
};
  