import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import type { OpinionTemplatePlaceholder } from "./types/firm";

function guessFieldType(
  name: string
): OpinionTemplatePlaceholder["fieldType"] {
  const lower = name.toLowerCase();
  if (lower.includes("date") || lower.includes("dated")) return "date";
  if (lower.includes("amount") || lower.includes("value") || lower.includes("price"))
    return "number";
  if (
    lower.includes("description") ||
    lower.includes("details") ||
    lower.includes("address") ||
    lower.includes("remarks") ||
    lower.includes("note")
  )
    return "textarea";
  return "text";
}

function nameToLabel(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function extractPlaceholders(
  docxBuffer: ArrayBuffer
): OpinionTemplatePlaceholder[] {
  const zip = new PizZip(docxBuffer);
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
    paragraphLoop: true,
    linebreaks: true,
  });

  const tags = doc.getFullText();
  const tagRegex = /\{\{([^}]+)\}\}/g;
  const seen = new Set<string>();
  const placeholders: OpinionTemplatePlaceholder[] = [];

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(tags)) !== null) {
    const name = match[1].trim();
    if (name && !seen.has(name) && !name.startsWith("#") && !name.startsWith("/")) {
      seen.add(name);
      placeholders.push({
        name,
        label: nameToLabel(name),
        fieldType: guessFieldType(name),
      });
    }
  }

  // Also scan raw XML for placeholders that may be split across runs
  const xmlFiles = [
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/header3.xml",
    "word/footer1.xml",
    "word/footer2.xml",
    "word/footer3.xml",
  ];

  for (const f of xmlFiles) {
    try {
      const xml = zip.file(f)?.asText();
      if (!xml) continue;
      let m: RegExpExecArray | null;
      while ((m = tagRegex.exec(xml)) !== null) {
        const name = m[1].trim();
        if (name && !seen.has(name) && !name.startsWith("#") && !name.startsWith("/")) {
          seen.add(name);
          placeholders.push({
            name,
            label: nameToLabel(name),
            fieldType: guessFieldType(name),
          });
        }
      }
    } catch {
      // file doesn't exist in the zip — skip
    }
  }

  return placeholders;
}
