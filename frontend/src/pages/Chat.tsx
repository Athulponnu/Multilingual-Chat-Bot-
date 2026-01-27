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

  // ✅ ADDED
  const [wsReady, setWsReady] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* 1️⃣ Load message history */
  useEffect(() => {
    if (!roomId) return;

    console.log("📥 Loading history for room:", roomId, "lang:", targetLanguage);

    fetch(`http://127.0.0.1:8001/messages/${roomId}?lang=${targetLanguage}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📜 History response:", data);

        if (!Array.isArray(data)) return;

        setMessages(
          data.map((m: any) => ({
            senderId: m.sender_id ?? m.sender,
            senderName: m.sender_name ?? m.sender_id ?? "Unknown",
            content: m.translated_text ?? m.original_text ?? m.content,
          }))
        );
      })
      .catch((err) => {
        console.error("❌ History load failed:", err);
      });
  }, [roomId, targetLanguage]);

  /* 2️⃣ WebSocket connection */
  useEffect(() => {
    if (!roomId || !state.userId) return;

    console.log("🔌 Connecting WS for room:", roomId, "lang:", targetLanguage);

    wsRef.current?.close();
    setWsReady(false);

    wsRef.current = connectWS(roomId, targetLanguage, (data: any) => {
      console.log("📩 WS raw message:", data);

      if (!data || data.type !== "message") return;

      const msg: Message = {
        senderId: data.sender_id,
        senderName: data.sender_name ?? data.sender_id,
        content: data.translated_text ?? data.original_text ?? data.text,
      };

      console.log("🟢 WS message parsed:", msg);

      setMessages((prev) => [...prev, msg]);
    });

    // ✅ ADDED
    wsRef.current.onopen = () => {
      console.log("🟢 WS OPEN — ready to send");
      setWsReady(true);
    };

    wsRef.current.onclose = () => {
      console.log("🔴 WS CLOSED");
      setWsReady(false);
    };

    wsRef.current.onerror = () => {
      console.error("❌ WS ERROR");
      setWsReady(false);
    };

    return () => {
      console.log("🔌 Closing WS");
      wsRef.current?.close();
      wsRef.current = null;
      setWsReady(false);
    };
  }, [roomId, targetLanguage]);

  /* 3️⃣ Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 4️⃣ Send message */
  function send() {
    if (!text.trim()) return;

    // ✅ FIXED
    if (!wsReady || !wsRef.current) {
      console.warn("⚠️ WS not ready, cannot send");
      return;
    }

    console.log("📤 Sending message:", text);
    wsRef.current.send(text);
    setText("");
  }

  return (
    <div style={styles.page}>
      {/* ===== HEADER ===== */}
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

      {/* ===== MESSAGES ===== */}
      <div style={styles.messages}>
        {messages.map((m, i) => {
          const isMe = m.senderId === state.userId;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.message,
                  background: isMe ? "#2563eb" : "#ffffff",
                  color: isMe ? "#ffffff" : "#111827",
                  borderTopRightRadius: isMe ? 4 : 14,
                  borderTopLeftRadius: isMe ? 14 : 4,
                  textAlign: isMe ? "right" : "left",
                }}
              >
                <div
                  style={{
                    ...styles.sender,
                    textAlign: isMe ? "right" : "left",
                  }}
                >
                  {m.senderName}
                </div>
                <div>{m.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ===== INPUT ===== */}
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

/* ===== Styles (UNCHANGED) ===== */
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
  roomLabel: { fontSize: 12, color: "#9ca3af" },
  roomId: { fontSize: 14, fontWeight: 600 },
  languageSelect: {
    padding: "6px 8px",
    borderRadius: 6,
    border: "none",
    fontSize: 13,
  },
  messages: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },
  message: {
    maxWidth: "72%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.4,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
    padding: 12,
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
