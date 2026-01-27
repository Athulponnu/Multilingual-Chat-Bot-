const API = "http://localhost:8001";

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// ---------- AUTH ----------

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

// ---------- ROOMS ----------

export async function getRooms() {
  const res = await fetch(`${API}/rooms`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Fetch rooms failed");
  return res.json();
}

export async function createRoom(name: string) {
  const res = await fetch(`${API}/rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Create room failed");
  return res.json();
}
