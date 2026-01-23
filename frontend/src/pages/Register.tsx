import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function register() {
    setError("");
    setLoading(true);

    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(
        res.status === 409
          ? "User already exists. Please login."
          : data.detail || "Registration failed"
      );
      return;
    }

    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.subtitle}>Join and start chatting</p>

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
          onClick={register}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footer}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
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
    background: "#10b981",
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
