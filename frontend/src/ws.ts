import { state } from "./state";

export function connectWS(
  roomId: string,
  onMessage: (msg: any) => void
) {
  const ws = new WebSocket(
    `ws://127.0.0.1:8000/ws/${roomId}?token=${state.token}`
  );

  ws.onmessage = (e) => {
    onMessage(JSON.parse(e.data)); // ✅ REQUIRED
  };

  return ws;
}
