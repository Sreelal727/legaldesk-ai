"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import MessageBubble, { TypingIndicator } from "./message-bubble";

interface ChatWindowProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 overflow-y-auto hide-scrollbar py-3"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8c8c8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: "#ece5dd",
      }}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="w-20 h-20 rounded-full bg-[#075e54] flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-10 h-10"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#111b21] mb-1">
            LegalDesk AI
          </h2>
          <p className="text-sm text-[#667781] max-w-xs">
            Your AI-powered legal assistant. Ask about case status, draft
            documents, check hearings, or ask in Malayalam.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
