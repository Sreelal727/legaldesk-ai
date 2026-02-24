"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ChatWindow from "@/components/chat-window";
import ChatInput from "@/components/chat-input";
import QuickActions from "@/components/quick-actions";
import QuickActionForm from "@/components/quick-action-form";
import type { QuickActionFormConfig } from "@/lib/quick-action-forms";
import OpinionGenerator from "@/components/opinion-generator";
import { loadFirmData } from "@/lib/firm-store";
import Link from "next/link";

const STORAGE_KEY = "legaldesk-chat-messages";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as UIMessage[];
  } catch {
    return [];
  }
}

function saveMessages(messages: UIMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export default function ChatPage() {
  const [firmData] = useState(() => loadFirmData());
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ firmData: loadFirmData() }),
      })
  );
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  });

  // Save messages to localStorage whenever they change
  const prevLenRef = useRef(messages.length);
  useEffect(() => {
    // Only save when message count changes or streaming finishes
    if (messages.length !== prevLenRef.current || status === "ready") {
      saveMessages(messages);
      prevLenRef.current = messages.length;
    }
  }, [messages, status]);

  const [input, setInput] = useState("");
  const [activeForm, setActiveForm] = useState<QuickActionFormConfig | null>(null);
  const [showOpinionGenerator, setShowOpinionGenerator] = useState(false);
  const isLoading = status === "streaming" || status === "submitted";

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  const handleFormOpen = (config: QuickActionFormConfig) => {
    setActiveForm(config);
  };

  const handleFormSubmit = (prompt: string) => {
    setActiveForm(null);
    handleSend(prompt);
  };

  const handleFormClose = () => {
    setActiveForm(null);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
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
            {firmData.profile.firmName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#25d366]" />
            <span className="text-xs text-white/70">Online</span>
          </div>
          <Link
            href="/settings"
            title="Settings"
            className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </Link>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              disabled={isLoading}
              title="Clear chat"
              className="p-1.5 rounded-full hover:bg-white/15 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Chat Messages */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Quick Actions */}
      <QuickActions
        onAction={handleSend}
        onFormOpen={handleFormOpen}
        onOpinionOpen={() => setShowOpinionGenerator(true)}
        isLoading={isLoading}
        cases={firmData.cases}
        opinionTemplates={firmData.opinionTemplates}
      />

      {/* Input Bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />

      {/* Quick Action Form Modal */}
      {activeForm && (
        <QuickActionForm
          config={activeForm}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          isLoading={isLoading}
        />
      )}

      {/* Opinion Generator Modal */}
      {showOpinionGenerator && (
        <OpinionGenerator
          templates={firmData.opinionTemplates}
          onClose={() => setShowOpinionGenerator(false)}
          onAIFill={(prompt) => {
            setShowOpinionGenerator(false);
            handleSend(prompt);
          }}
        />
      )}
    </div>
  );
}
