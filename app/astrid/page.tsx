"use client";


import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  FormEvent,
  KeyboardEvent,
} from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  reply?: string;
  message?: string;
  text?: string;
  output?: string;
  error?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Hola, soy Astrid. Puedo ayudarte a elegir platos según tus gustos, presupuesto o restricciones alimentarias. ¿Qué te provoca hoy?",
  },
];

export default function AstridPage() {
  const [messages, setMessages] =
    useState<Message[]>(INITIAL_MESSAGES);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    const cleanInput = input.trim();

    if (!cleanInput || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: cleanInput,
    };

    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation,
        }),
      });

      const responseText = await response.text();

      let data: ChatResponse = {};

      try {
        data = responseText
          ? (JSON.parse(responseText) as ChatResponse)
          : {};
      } catch {
        data = {
          error: responseText || "Respuesta inválida del servidor.",
        };
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Error del servidor: ${response.status}`,
        );
      }

      const assistantText =
        data.reply ||
        data.message ||
        data.text ||
        data.output;

      if (!assistantText) {
        throw new Error(
          "El servidor respondió, pero no devolvió un mensaje.",
        );
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantText,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al consultar a Astrid.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: `No pude responder en este momento. ${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setMessages([...INITIAL_MESSAGES]);
    setInput("");
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      void sendMessage();
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.chat}>
        <header style={styles.header}>
          <Link href="/" style={styles.backButton}>
            Volver
          </Link>

          <div style={styles.identity}>
            <div style={styles.avatar}>A</div>

            <div style={styles.identityText}>
              <p style={styles.eyebrow}>
                Asistente gastronómica
              </p>

              <h1 style={styles.title}>Astrid</h1>

              <p style={styles.status}>
                <span style={styles.statusDot} />
                Disponible ahora
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetConversation}
            style={styles.resetButton}
            aria-label="Reiniciar conversación"
            title="Reiniciar conversación"
          >
            ↻
          </button>
        </header>

        <div style={styles.notice}>
          Propuesta conceptual no oficial · Carta gastronómica
        </div>

        <section
          style={styles.messages}
          aria-live="polite"
          aria-label="Conversación con Astrid"
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                style={{
                  ...styles.messageRow,
                  justifyContent: isUser
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                {!isUser && (
                  <div style={styles.smallAvatar}>A</div>
                )}

                <div
                  style={
                    isUser
                      ? styles.userBubble
                      : styles.assistantBubble
                  }
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={styles.messageRow}>
              <div style={styles.smallAvatar}>A</div>

              <div style={styles.assistantBubble}>
                <span style={styles.loadingText}>
                  Astrid está revisando la carta
                  <span style={styles.loadingDots}>…</span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <form onSubmit={sendMessage} style={styles.form}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ejemplo: quiero algo ligero y sin pescado"
            style={styles.input}
            disabled={loading}
            rows={1}
            aria-label="Escribe tu consulta"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              ...styles.sendButton,
              opacity:
                loading || !input.trim() ? 0.5 : 1,
              cursor:
                loading || !input.trim()
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Enviar
          </button>
        </form>

        <p style={styles.disclaimer}>
          Confirma alergias, ingredientes y disponibilidad con el
          personal del restaurante.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: "100%",
    minHeight: "100svh",
    padding: "16px",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(circle at top, #4a271d 0%, #21100d 45%, #140a08 100%)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  chat: {
    width: "min(100%, 680px)",
    height: "calc(100svh - 32px)",
    maxHeight: "920px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "28px",
    background: "#fffaf2",
    boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
  },

  header: {
    minHeight: "96px",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "14px",
    padding: "16px 18px",
    background: "#541426",
    color: "#ffffff",
  },

  backButton: {
    minHeight: "42px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 13px",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "999px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "center",
  },

  identity: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "11px",
  },

  identityText: {
    minWidth: 0,
  },

  avatar: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.45)",
    borderRadius: "50%",
    fontFamily: "Georgia, serif",
    fontSize: "27px",
  },

  eyebrow: {
    margin: 0,
    overflow: "hidden",
    color: "#f8e9e0",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.13em",
    textOverflow: "ellipsis",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  title: {
    margin: "2px 0",
    fontFamily: "Georgia, serif",
    fontSize: "28px",
    fontWeight: 500,
    lineHeight: 1,
  },

  status: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#d8eed9",
    fontSize: "11px",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    display: "inline-block",
    borderRadius: "50%",
    background: "#5dbb72",
    boxShadow: "0 0 0 4px rgba(93,187,114,0.18)",
  },

  resetButton: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "50%",
    background: "transparent",
    color: "#ffffff",
    fontSize: "22px",
    cursor: "pointer",
  },

  notice: {
    padding: "9px 16px",
    borderBottom: "1px solid #ded2c4",
    background: "#f3eadf",
    color: "#785b4e",
    textAlign: "center",
    fontSize: "11px",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: "22px 18px",
    WebkitOverflowScrolling: "touch",
  },

  messageRow: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    gap: "9px",
    marginBottom: "16px",
  },

  smallAvatar: {
    width: "36px",
    height: "36px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background: "#7b2038",
    color: "#ffffff",
    fontFamily: "Georgia, serif",
  },

  assistantBubble: {
    maxWidth: "82%",
    padding: "14px 16px",
    border: "1px solid #dfd7cf",
    borderRadius: "20px 20px 20px 5px",
    background: "#ffffff",
    color: "#281b17",
    fontSize: "15px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    boxShadow: "0 8px 25px rgba(61,30,20,0.06)",
  },

  userBubble: {
    maxWidth: "82%",
    padding: "14px 16px",
    borderRadius: "20px 20px 5px 20px",
    background: "#7b2038",
    color: "#ffffff",
    fontSize: "15px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },

  loadingText: {
    color: "#67574f",
  },

  loadingDots: {
    display: "inline-block",
    minWidth: "16px",
  },

  form: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    padding: "14px 16px 10px",
    borderTop: "1px solid #e3d8cc",
    background: "#fffaf2",
  },

  input: {
    minWidth: 0,
    minHeight: "52px",
    maxHeight: "120px",
    flex: 1,
    resize: "none",
    padding: "14px 17px",
    border: "1px solid #d5c7bb",
    borderRadius: "24px",
    background: "#f8f1e8",
    color: "#2c1c17",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    fontSize: "16px",
    lineHeight: 1.4,
    outline: "none",
  },

  sendButton: {
    minWidth: "88px",
    minHeight: "52px",
    flexShrink: 0,
    border: 0,
    borderRadius: "999px",
    background: "#7b2038",
    color: "#ffffff",
    fontWeight: 700,
  },

  disclaimer: {
    margin: 0,
    padding: "0 16px 12px",
    background: "#fffaf2",
    color: "#806e64",
    textAlign: "center",
    fontSize: "10px",
    lineHeight: 1.4,
  },
};