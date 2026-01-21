import { useEffect, useRef, useState } from "react";
import { state } from "../state";
import { connectWS } from "../ws";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Connect WebSocket on mount
  useEffect(() => {
    wsRef.current = connectWS(
      state.roomId,
      state.userId,
      state.receiveLanguage,
      (msg) => {
        setMessages((prev) => [...prev, msg]);
      }
    );

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message (NO optimistic append)
  function send() {
    if (!text.trim()) return;

    wsRef.current?.send(text);
    setText("");
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        Room: {state.roomId.slice(0, 8)} | Language: {state.receiveLanguage}
      </div>

      {/* MESSAGES */}
      <div style={styles.messages}>
        {messages.map((m, i) => {
          const isMe = m.startsWith(state.userId);
          return (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#DCF8C6" : "#FFFFFF"
              }}
            >
              {m}
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

const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#f4f6f8"
  },
  header: {
    padding: "12px",
    background: "#1f2937",
    color: "white",
    fontWeight: "bold"
  },
  messages: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto"
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    wordBreak: "break-word"
  },
  inputBar: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    background: "#fff"
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  sendBtn: {
    marginLeft: "8px",
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px"
  }
};
