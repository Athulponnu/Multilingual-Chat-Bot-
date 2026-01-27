import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { state } from "../state";
import { login as loginApi } from "../api";
import bg from "../assets/df.png";
import video from "../assets/test.mp4";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      setError("");
      setLoading(true);

      const data = await loginApi(email, password);

      state.token = data.access_token;
      state.userId = data.user_id;

      localStorage.setItem("token", data.access_token);
      
      navigate("/home");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  /* ===== Floating background animation ===== */
  const bgAnimation = `
    @keyframes floatingBg {
      0%   { background-position: 50% 50%; }
      50%  { background-position: 53% 47%; }
      100% { background-position: 50% 50%; }
    }
  `;

  return (
    <>
      <style>{bgAnimation}</style>

      <div style={styles.page}>
        <div style={styles.card}>
          {/* LEFT: Video */}
          <div style={styles.videoWrapper}>
            <video
              style={styles.video}
              src={video}
              autoPlay
              muted
              loop
              playsInline
            />
            <div style={styles.videoOverlay} />
            <div style={styles.videoText}>
              <h2 style={styles.videoTitle}>Welcome To Chatzy</h2>
              <p style={styles.videoSubtitle}>
                Chat as you like, Chat at your comfort.
              </p>
            </div>
          </div>

          {/* RIGHT: Login form */}
          <div style={styles.form}>
            <h2 style={styles.title}>Sign in</h2>
            <p style={styles.subtitle}>Enter your credentials</p>

            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {error && <p style={styles.error}>{error}</p>}

            <p style={styles.footer}>
              New user?{" "}
              <span style={styles.link} onClick={() => navigate("/register")}>
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Styles ===== */
const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "110%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    animation: "floatingBg 25s ease-in-out infinite",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 720,
    display: "flex",
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.45)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
  },

  videoWrapper: {
    position: "relative",
    width: "45%",
    background: "#000",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  videoOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
  },

  videoText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    color: "#ffffff",
  },

  videoTitle: {
    fontSize: 35,
    fontWeight: 600,
  },

  videoSubtitle: {
    fontSize: 24,
  },

  form: {
    width: "55%",
    padding: 32,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    marginBottom: 4,
    fontSize: 22,
  },

  subtitle: {
    marginBottom: 24,
    color: "#6b7280",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    marginTop: 4,
  },

  error: {
    marginTop: 12,
    color: "#dc2626",
    textAlign: "center",
  },

  footer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 500,
  },
};
