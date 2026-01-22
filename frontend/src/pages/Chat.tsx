import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { state } from "../state";
import { connectWS } from "../ws";

type Message = {
  senderId: string;
  senderName: string;
  content: string;
};

export default function Chat() {
  const { roomId } = useParams<{ roomId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /**
   * 1️⃣ Load message history when room opens
   */
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://127.0.0.1:8000/messages/${roomId}`, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        setMessages(
          data.map((m: any) => ({
            senderId: m.sender_id,
            senderName: m.sender_name ?? m.sender_id,
            content: m.original_text,
          }))
        );
      })
      .catch(console.error);
  }, [roomId]);

  /**
   * 2️⃣ Connect WebSocket AFTER history loads
   */
  useEffect(() => {
    if (!roomId || !state.userId) return;

    wsRef.current = connectWS(roomId, (data: any) => {
      if (data.type !== "message") return;

      setMessages((prev) => [
        ...prev,
        {
          senderId: data.sender_id,
          senderName: data.sender_name ?? data.sender_id,
          content: data.text,
        },
      ]);
    });

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [roomId]);

  /**
   * 3️⃣ Auto-scroll
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * 4️⃣ Send message
   */
  function send() {
    if (!text.trim()) return;
    wsRef.current?.send(text);
    setText("");
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>Room: {roomId}</div>

      {/* MESSAGES */}
      <div style={styles.messages}>
        {messages.map((m, i) => {
          const isMe = m.senderId === state.userId;

          return (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#DCF8C6" : "#FFFFFF",
              }}
            >
              <strong>{m.senderName}</strong>: {m.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button style={styles.sendBtn} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#f4f6f8",
  },
  header: {
    padding: "12px",
    background: "#1f2937",
    color: "white",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    wordBreak: "break-word",
  },
  inputBar: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  sendBtn: {
    marginLeft: "8px",
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
};
