import { state } from "./state";

export function connectWS(
  roomId: string,
  language: string,
  onMessage: (msg: any) => void
) {
  const url = `ws://localhost:8001/ws/${roomId}?token=${state.token}&lang=${language}`;

  console.log("🔌 Connecting WS:", url);

  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("✅ WS connected");
  };

  ws.onclose = (e) => {
    console.log("❌ WS closed", e.code, e.reason);
  };

  ws.onerror = (e) => {
    console.error("🚨 WS error", e);
  };

  ws.onmessage = (e) => {
    console.log("📩 WS raw message:", e.data);

    try {
      const parsed = JSON.parse(e.data);
      console.log("📦 WS parsed message:", parsed);
      onMessage(parsed);
    } catch (err) {
      console.error("❌ WS JSON parse failed", err);
    }
  };

  return ws;
}
