"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceLanguage = "en-IN" | "ml-IN";
export type VoiceStatus = "idle" | "listening" | "processing";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isVoiceSupported(): boolean {
  return getSpeechRecognition() !== null;
}

interface UseVoiceInputOptions {
  onTranscript?: (text: string) => void;
  onInterim?: (text: string) => void;
  autoSendDelay?: number; // ms to wait after silence before auto-completing
}

interface UseVoiceInputReturn {
  status: VoiceStatus;
  language: VoiceLanguage;
  setLanguage: (lang: VoiceLanguage) => void;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  interimText: string;
  finalText: string;
}

export function useVoiceInput(
  options: UseVoiceInputOptions = {}
): UseVoiceInputReturn {
  const { onTranscript, onInterim, autoSendDelay = 1500 } = options;

  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [language, setLanguage] = useState<VoiceLanguage>("en-IN");
  const [isSupported] = useState(() => isVoiceSupported());
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTextRef = useRef("");
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStoppingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
      if (autoStopTimerRef.current) {
        clearTimeout(autoStopTimerRef.current);
      }
    };
  }, []);

  const clearAutoStopTimer = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const startAutoStopTimer = useCallback(() => {
    clearAutoStopTimer();
    autoStopTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && !isStoppingRef.current) {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
      }
    }, autoSendDelay);
  }, [autoSendDelay, clearAutoStopTimer]);

  const stopListening = useCallback(() => {
    clearAutoStopTimer();
    if (recognitionRef.current && !isStoppingRef.current) {
      isStoppingRef.current = true;
      recognitionRef.current.stop();
    }
  }, [clearAutoStopTimer]);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    isStoppingRef.current = false;
    finalTextRef.current = "";
    setFinalText("");
    setInterimText("");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (final) {
        finalTextRef.current = final.trim();
        setFinalText(finalTextRef.current);
        onInterim?.(finalTextRef.current + (interim ? " " + interim : ""));
      }

      if (interim) {
        const combined = finalTextRef.current
          ? finalTextRef.current + " " + interim
          : interim;
        setInterimText(interim);
        onInterim?.(combined);
      } else {
        setInterimText("");
        if (finalTextRef.current) {
          onInterim?.(finalTextRef.current);
        }
      }

      // Reset the auto-stop timer on each new result
      if (autoSendDelay > 0) {
        startAutoStopTimer();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "aborted" and "no-speech" are normal — don't treat as errors
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      console.warn("Speech recognition error:", event.error);
      setStatus("idle");
      setInterimText("");
      isStoppingRef.current = false;
    };

    recognition.onend = () => {
      clearAutoStopTimer();
      const text = finalTextRef.current;

      setStatus("idle");
      setInterimText("");
      isStoppingRef.current = false;

      if (text.trim()) {
        setFinalText(text.trim());
        onTranscript?.(text.trim());
      }

      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      setStatus("idle");
      recognitionRef.current = null;
    }
  }, [language, onTranscript, onInterim, autoSendDelay, startAutoStopTimer, clearAutoStopTimer]);

  const toggleListening = useCallback(() => {
    if (status === "listening") {
      stopListening();
    } else {
      startListening();
    }
  }, [status, startListening, stopListening]);

  return {
    status,
    language,
    setLanguage,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    interimText,
    finalText,
  };
}
