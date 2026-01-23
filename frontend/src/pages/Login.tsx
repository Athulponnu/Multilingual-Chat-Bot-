import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { state } from "../state";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login() {
    setError("");
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Invalid email or password");
      return;
    }

    const data = await res.json();

    // ✅ persist auth
    state.token = data.access_token;
    state.userId = email;

    navigate("/home");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

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
          onClick={login}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {/* ✅ NEW REGISTER OPTION */}
        <p style={styles.footer}>
          New user?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
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
    alignItems: "center",
  },
  card: {
    width: 380,
    background: "#ffffff",
    padding: 32,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: 4,
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
