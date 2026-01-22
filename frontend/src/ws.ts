import { state } from "./state";

export function connectWS(
  roomId: string,
  language:string,
  onMessage: (msg: any) => void
) {
  const ws = new WebSocket(
    `ws://127.0.0.1:8000/ws/${roomId}?token=${state.token}&lang=${language}`
  );

  ws.onopen = () => {
    console.log("WS connected");
  };

  ws.onclose = () => {
    console.log("WS closed");
  };

  ws.onerror = () => {
    console.log("WS error");
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    onMessage(data);
  };

  return ws;
}

