import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function register() {
    setError("");

    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

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
    <div style={styles.container}>
      <h2>Register</h2>

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={register}>Register</button>

      <p>
        Already have an account? <b onClick={() => navigate("/login")}>Login</b>
      </p>
    </div>
  );
}

const styles: any = {
  container: {
    maxWidth: 320,
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
};
