"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type ChatResponse = {
  answer?: string;
  error?: string;
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hola, soy Astrid. Puedo ayudarte a explorar la carta, comparar opciones y elegir según tus gustos o presupuesto. ¿Qué te provoca hoy?",
};

const QUICK_QUESTIONS = [
  "Quiero algo ligero",
  "¿Qué opciones tienen carne?",
  "Busco una opción sin mariscos",
];

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AstridChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener("open-astrid-chat", openChat);
    return () => window.removeEventListener("open-astrid-chat", openChat);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("astrid-chat-open", isOpen);

    if (isOpen) {
      window.setTimeout(() => textareaRef.current?.focus(), 100);
    }

    return () => document.documentElement.classList.remove("astrid-chat-open");
  }, [isOpen]);

  useEffect(() => {
    function closeWithEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  async function sendMessage(rawMessage: string) {
    const text = rawMessage.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: createId(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "No se recibió una respuesta válida.");
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: data.answer as string,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function resetConversation() {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  }

  return (
    <>
      {isOpen && (
        <div className="chat-layer">
          <button
            type="button"
            className="chat-backdrop"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chat con Astrid"
          />

          <section className="chat-panel" aria-label="Chat con Astrid" aria-modal="true">
            <header className="chat-header">
              <div className="chat-identity">
                <span className="chat-avatar" aria-hidden="true">
                  A
                </span>
                <div>
                  <p className="chat-eyebrow">Asistente gastronómica</p>
                  <h2>Astrid</h2>
                  <span className="chat-status">● Disponible ahora</span>
                </div>
              </div>

              <div className="chat-header-actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={resetConversation}
                  aria-label="Reiniciar conversación"
                  title="Reiniciar conversación"
                >
                  ↻
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar chat"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="chat-notice">
              Propuesta conceptual no oficial · Confirma alergias con el personal
            </div>

            <div className="chat-messages" aria-live="polite">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`message ${
                    message.role === "user" ? "message-user" : "message-assistant"
                  }`}
                >
                  {message.role === "assistant" && (
                    <span className="message-avatar" aria-hidden="true">
                      A
                    </span>
                  )}
                  <p>{message.content}</p>
                </article>
              ))}

              {messages.length === 1 && (
                <div className="quick-questions">
                  {QUICK_QUESTIONS.map((question) => (
                    <button key={question} type="button" onClick={() => void sendMessage(question)}>
                      {question}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="typing" aria-label="Astrid está escribiendo">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="astrid-message">
                Escribe tu consulta
              </label>
              <textarea
                ref={textareaRef}
                id="astrid-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregúntale a Astrid sobre la carta…"
                maxLength={500}
                rows={1}
                autoComplete="off"
                disabled={isLoading}
              />
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Enviar mensaje">
                ↑
              </button>
            </form>
          </section>
        </div>
      )}

    </>
  );
}
