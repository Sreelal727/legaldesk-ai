"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import ChatWindow from "@/components/chat-window";
import ChatInput from "@/components/chat-input";
import QuickActions from "@/components/quick-actions";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();

  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-[#ece5dd]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shrink-0 shadow-md z-10">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold leading-tight">
            LegalDesk AI
          </h1>
          <p className="text-xs text-white/70 leading-tight">
            Nair &amp; Associates
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#25d366]" />
          <span className="text-xs text-white/70">Online</span>
        </div>
      </header>

      {/* Chat Messages */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Quick Actions */}
      <QuickActions onAction={handleSend} isLoading={isLoading} />

      {/* Input Bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
