export function connectWS(
  roomId: string,
  userId: string,
  lang: string,
  onMessage: (msg: any) => void
) {
  const ws = new WebSocket(
    `ws://localhost:8000/ws/${roomId}/${userId}/${lang}`
  );

  ws.onmessage = (e) => onMessage(JSON.parse(e.data));
  return ws;
}
