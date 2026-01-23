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
  const [targetLanguage, setTargetLanguage] = useState("en");

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* 1️⃣ Load history */
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://127.0.0.1:8000/messages/${roomId}?lang=${targetLanguage}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        setMessages(
          data.map((m: any) => ({
            senderId: m.sender,
            senderName: m.sender_name ?? m.sender,
            content: m.content,
          }))
        );
      })
      .catch(console.error);
  }, [roomId, targetLanguage]);

  /* 2️⃣ WebSocket (🔥 FIXED) */
  useEffect(() => {
    if (!roomId || !state.userId) return;

    // 🔥 close existing socket before reconnect
    wsRef.current?.close();

    wsRef.current = connectWS(roomId, targetLanguage, (data: any) => {
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
  }, [roomId, targetLanguage]); // 🔥 language-aware socket

  /* 3️⃣ Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 4️⃣ Send */
  function send() {
    if (!text.trim()) return;
    wsRef.current?.send(text);
    setText("");
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.roomLabel}>Room</div>
          <div style={styles.roomId}>{roomId}</div>
        </div>

        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          style={styles.languageSelect}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ml">Malayalam</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
        </select>
      </div>

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
                background: isMe ? "#2563eb" : "#ffffff",
                color: isMe ? "#ffffff" : "#111827",
              }}
            >
              <div style={styles.sender}>{m.senderName}</div>
              <div>{m.content}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Type a message…"
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
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#f4f6f8",
  },
  header: {
    padding: "14px 18px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  roomId: {
    fontSize: 14,
    fontWeight: 600,
  },
  languageSelect: {
    padding: "6px 8px",
    borderRadius: 6,
    border: "none",
    fontSize: 13,
  },
  messages: {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },
  message: {
    maxWidth: "72%",
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    wordBreak: "break-word",
  },
  sender: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
    opacity: 0.8,
  },
  inputBar: {
    display: "flex",
    padding: "12px",
    background: "#ffffff",
    borderTop: "1px solid #e5e7eb",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 20,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  sendBtn: {
    marginLeft: 10,
    padding: "10px 18px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 20,
    fontSize: 14,
    cursor: "pointer",
  },
};
