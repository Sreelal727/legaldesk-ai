"use client";

import type { UIMessage } from "ai";
import ExportButtons from "./export-buttons";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getTextContent(message: UIMessage): string {
  if (message.parts?.length) {
    return message.parts
      .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
      .map((part) => part.text)
      .join("");
  }
  return "";
}

// Parse markdown table rows into structured data
function parseTable(lines: string[], startIndex: number): { headers: string[]; rows: string[][]; endIndex: number } | null {
  const headerLine = lines[startIndex];
  if (!headerLine || !headerLine.trim().startsWith("|")) return null;

  const nextLine = lines[startIndex + 1];
  if (!nextLine || !nextLine.match(/^\|[\s-:|]+\|$/)) return null;

  const parseCells = (line: string) =>
    line.split("|").slice(1, -1).map((c) => c.trim());

  const headers = parseCells(headerLine);
  const rows: string[][] = [];
  let i = startIndex + 2;

  while (i < lines.length && lines[i].trim().startsWith("|") && !lines[i].match(/^\|[\s-:|]+\|$/)) {
    rows.push(parseCells(lines[i]));
    i++;
  }

  return { headers, rows, endIndex: i };
}

function MarkdownTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-2 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#075e54] text-white">
            {headers.map((h, i) => (
              <th key={i} className="px-2.5 py-2 text-left font-semibold whitespace-nowrap">
                {processInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-2.5 py-1.5 border-t border-gray-100 whitespace-normal">
                  {processInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith("|") && i + 1 < lines.length && lines[i + 1]?.match(/^\|[\s-:|]+\|$/)) {
      const table = parseTable(lines, i);
      if (table) {
        elements.push(
          <MarkdownTable key={i} headers={table.headers} rows={table.rows} />
        );
        i = table.endIndex;
        continue;
      }
    }

    // Skip separator-only table rows that weren't caught
    if (line.match(/^\|[\s-:|]+\|$/)) {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="font-bold text-[13px] mt-3 mb-1.5 text-[#075e54] border-b border-[#075e54]/10 pb-1">
          {processInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="font-bold text-sm mt-3 mb-1.5 text-[#075e54] border-b border-[#075e54]/20 pb-1">
          {processInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="font-bold text-[15px] mt-3 mb-2 text-[#075e54]">
          {processInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}$/)) {
      elements.push(<hr key={i} className="my-2.5 border-gray-200" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.match(/^>\s/)) {
      elements.push(
        <div key={i} className="border-l-3 border-[#075e54]/40 pl-2.5 my-1.5 text-gray-600 italic text-[13px]">
          {processInline(line.replace(/^>\s/, ""))}
        </div>
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.match(/^[\s]*[-•*]\s/)) {
      const indent = line.match(/^(\s*)/)?.[1]?.length || 0;
      const ml = indent > 2 ? "ml-4" : "ml-1";
      elements.push(
        <div key={i} className={`flex gap-1.5 ${ml} py-0.5`}>
          <span className="text-[#075e54] shrink-0 mt-0.5 text-[10px]">●</span>
          <span className="leading-relaxed">{processInline(line.replace(/^[\s]*[-•*]\s/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^[\s]*(\d+)[.)]\s/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex gap-1.5 ml-1 py-0.5">
          <span className="text-[#075e54] font-semibold shrink-0 min-w-[18px]">{numMatch[1]}.</span>
          <span className="leading-relaxed">{processInline(line.replace(/^[\s]*\d+[.)]\s/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Warning/disclaimer (starts with ⚠️ or contains "Disclaimer")
    if (line.includes("⚠️") || (line.toLowerCase().includes("disclaimer") && line.startsWith("*"))) {
      elements.push(
        <div key={i} className="bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 my-2 text-[12px] text-amber-800 leading-relaxed">
          {processInline(line)}
        </div>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="leading-relaxed py-0.5">
        {processInline(line)}
      </p>
    );
    i++;
  }

  return <div className="message-content space-y-0.5">{elements}</div>;
}

function processInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="italic font-semibold text-[#075e54]">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-[#1a1a1a]">
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      parts.push(<em key={match.index} className="text-gray-700">{match[4]}</em>);
    } else if (match[5]) {
      parts.push(
        <code
          key={match.index}
          className="bg-[#075e54]/10 text-[#075e54] rounded px-1 py-0.5 text-[12px] font-mono"
        >
          {match[5]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const time = formatTime(new Date());
  const content = getTextContent(message);

  return (
    <div
      className={`message-animate flex ${isUser ? "justify-end" : "justify-start"} mb-2 px-3`}
    >
      <div
        className={`relative rounded-lg shadow-sm ${
          isUser
            ? "bg-[#dcf8c6] rounded-tr-none max-w-[80%] px-3 py-2"
            : "bg-white rounded-tl-none max-w-[92%] px-3.5 py-2.5"
        }`}
      >
        {!isUser && (
          <div className="text-[11px] font-bold text-[#075e54] mb-1 tracking-wide uppercase">
            LegalDesk AI
          </div>
        )}
        <div className={`text-[#111b21] ${isUser ? "text-[14px]" : "text-[13.5px]"}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          ) : (
            <SimpleMarkdown content={content} />
          )}
        </div>
        {!isUser && content.length > 100 && (
          <ExportButtons content={content} />
        )}
        <div className={`text-[10px] mt-1.5 text-right ${isUser ? "text-[#667781]" : "text-[#8696a0]"}`}>
          {time}
          {isUser && <span className="ml-1 text-[#53bdeb]">✓✓</span>}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="message-animate flex justify-start mb-2 px-3">
      <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center">
          <span className="typing-dot w-2 h-2 bg-[#075e54]/40 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-[#075e54]/40 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-[#075e54]/40 rounded-full inline-block" />
        </div>
      </div>
    </div>
  );
}
