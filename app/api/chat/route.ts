import { streamText } from "ai";
import { model } from "@/lib/gemini";
import { buildSystemPrompt } from "@/lib/build-system-prompt";
import { getDefaultFirmData } from "@/lib/firm-store";
import type { FirmData } from "@/lib/types/firm";
import {
  lookupByIPC,
  lookupByBNS,
  searchByKeyword,
  getNewBNSSections,
  getRepealedSections,
} from "@/lib/bns-lookup";

interface UIMessagePart {
  type: string;
  text?: string;
}

interface UIMessage {
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: UIMessagePart[];
}

function getMessageText(msg: UIMessage): string {
  if (msg.content) return msg.content;
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("");
  }
  return "";
}

function toModelMessages(messages: UIMessage[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content: getMessageText(msg) || "",
  }));
}

// Detect if user is asking about IPC/BNS and inject lookup data
function detectAndInjectBNSData(userText: string): string {
  const text = userText.toLowerCase();
  const isIPCQuery =
    text.includes("ipc") ||
    text.includes("bns") ||
    text.includes("bharatiya nyaya") ||
    text.includes("penal code") ||
    text.includes("section") && (text.includes("convert") || text.includes("map") || text.includes("equivalent") || text.includes("new law"));

  if (!isIPCQuery) return "";

  const parts: string[] = [];

  // Extract section numbers from the text
  const sectionMatches = userText.match(/\b(\d+[A-Za-z]*)\b/g);
  if (sectionMatches) {
    for (const sec of sectionMatches) {
      // Skip numbers that are clearly not section numbers (years, amounts)
      if (parseInt(sec) > 600 || sec.length > 5) continue;

      const ipcResults = lookupByIPC(sec);
      if (ipcResults.length > 0) {
        parts.push(
          `\n[DATABASE LOOKUP - IPC ${sec}]:\n${JSON.stringify(ipcResults, null, 2)}`
        );
      }

      const bnsResults = lookupByBNS(sec);
      if (bnsResults.length > 0 && ipcResults.length === 0) {
        parts.push(
          `\n[DATABASE LOOKUP - BNS ${sec}]:\n${JSON.stringify(bnsResults, null, 2)}`
        );
      }
    }
  }

  // Check for keyword-based searches
  const keywords = ["murder", "theft", "rape", "cheating", "forgery", "dowry", "hurt", "robbery", "dacoity", "kidnap", "defamation", "trespass", "extortion", "stalking", "sedition", "terrorist", "organised crime", "mob lynching"];
  for (const kw of keywords) {
    if (text.includes(kw)) {
      const results = searchByKeyword(kw).slice(0, 10);
      if (results.length > 0) {
        parts.push(
          `\n[DATABASE SEARCH - "${kw}"]:\n${JSON.stringify(results, null, 2)}`
        );
      }
      break;
    }
  }

  // Check for "new offences" or "repealed"
  if (text.includes("new offence") || text.includes("new crime") || text.includes("new in bns") || text.includes("newly added")) {
    const results = getNewBNSSections();
    parts.push(`\n[NEW BNS OFFENCES]:\n${JSON.stringify(results, null, 2)}`);
  }

  if (text.includes("repeal") || text.includes("removed") || text.includes("deleted") || text.includes("abolished")) {
    const results = getRepealedSections();
    parts.push(`\n[REPEALED IPC SECTIONS]:\n${JSON.stringify(results, null, 2)}`);
  }

  if (parts.length === 0 && isIPCQuery) {
    // Generic IPC/BNS query without specific sections — provide a hint
    return "\n\n[SYSTEM NOTE: The user is asking about IPC/BNS sections. You have access to a database of 443 IPC→BNS mappings. Ask the user for specific section numbers or topics to provide accurate mappings.]";
  }

  return parts.length > 0
    ? `\n\n[IPC/BNS DATABASE RESULTS - Use this data to answer the user's query accurately. Present in the formatted table structure as instructed.]\n${parts.join("\n")}`
    : "";
}

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, firmData: rawFirmData } = await req.json();
  const firmData: FirmData = rawFirmData ?? getDefaultFirmData();
  const modelMessages = toModelMessages(messages);

  // Get the last user message and inject BNS data if relevant
  const lastUserMsg = modelMessages.filter((m) => m.role === "user").pop();
  const bnsData = lastUserMsg ? detectAndInjectBNSData(lastUserMsg.content) : "";

  // Append lookup data to the system prompt
  const systemPrompt = buildSystemPrompt(firmData) + bnsData;

  const result = streamText({
    model,
    system: {
      role: "system",
      content: systemPrompt,
      providerOptions: {
        anthropic: { cacheControl: { type: "ephemeral" } },
      },
    },
    messages: modelMessages,
    maxOutputTokens: 8192,
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse();
}
