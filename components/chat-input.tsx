"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useVoiceInput, isVoiceSupported } from "@/lib/use-voice-input";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect voice support only on the client after hydration
  const [voiceSupported, setVoiceSupported] = useState(false);
  useEffect(() => {
    setVoiceSupported(isVoiceSupported());
  }, []);

  const handleTranscript = useCallback(
    (text: string) => {
      setInput(text);
    },
    [setInput]
  );

  const handleInterim = useCallback(
    (text: string) => {
      setInput(text);
    },
    [setInput]
  );

  const {
    status: voiceStatus,
    language,
    setLanguage,
    toggleListening,
    isSupported,
  } = useVoiceInput({
    onTranscript: handleTranscript,
    onInterim: handleInterim,
    autoSendDelay: 2000,
  });

  const isListening = voiceStatus === "listening";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  const showMic = voiceSupported;

  return (
    <div className="flex items-end gap-2 px-3 py-2 bg-[#f0f0f0]">
      {/* Language toggle — only visible when listening */}
      {showMic && isListening && (
        <div className="voice-lang-toggle flex items-center bg-white rounded-full shadow-sm overflow-hidden shrink-0 self-center">
          <button
            type="button"
            onClick={() => setLanguage("en-IN")}
            className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${language === "en-IN"
              ? "bg-[#075e54] text-white"
              : "text-[#667781] hover:bg-gray-100"
              }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ml-IN")}
            className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${language === "ml-IN"
              ? "bg-[#075e54] text-white"
              : "text-[#667781] hover:bg-gray-100"
              }`}
          >
            മല
          </button>
        </div>
      )}

      {/* Text input area */}
      <div className="flex-1 bg-white rounded-3xl px-4 py-2 flex items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            isListening
              ? language === "ml-IN"
                ? "സംസാരിക്കൂ..."
                : "Listening..."
              : "Type a message..."
          }
          rows={1}
          className={`flex-1 resize-none outline-none text-[15px] placeholder-[#667781] bg-transparent leading-snug max-h-[120px] ${isListening ? "text-[#075e54]" : "text-[#111b21]"
            }`}
        />
      </div>

      {/* Mic button */}
      {showMic && (
        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading}
          title={isListening ? "Stop listening" : "Voice input"}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isListening
            ? "bg-[#eb3b5a] text-white voice-pulse"
            : "bg-white text-[#667781] hover:text-[#075e54] hover:bg-gray-50 shadow-sm"
            }`}
        >
          {isListening ? (
            /* Waveform bars when listening */
            <div className="flex items-center gap-[3px] h-5">
              <span className="voice-bar w-[3px] rounded-full bg-white" />
              <span className="voice-bar w-[3px] rounded-full bg-white" style={{ animationDelay: "0.15s" }} />
              <span className="voice-bar w-[3px] rounded-full bg-white" style={{ animationDelay: "0.3s" }} />
              <span className="voice-bar w-[3px] rounded-full bg-white" style={{ animationDelay: "0.45s" }} />
            </div>
          ) : (
            /* Mic icon when idle */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          )}
        </button>
      )}

      {/* Send button */}
      <button
        type="button"
        onClick={() => onSend(input)}
        disabled={!input.trim() || isLoading}
        className="w-11 h-11 rounded-full bg-[#075e54] text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#064e46] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
}
