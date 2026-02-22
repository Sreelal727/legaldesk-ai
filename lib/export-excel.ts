import * as XLSX from "xlsx";

export function exportAsExcel(content: string, filename: string = "data") {
  const rows = parseContentToRows(content);

  if (rows.length === 0) {
    // Fallback: export raw content as single-column
    const lines = content
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => [stripMarkdown(l)]);
    const ws = XLSX.utils.aoa_to_sheet([["Content"], ...lines]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Auto-size columns
  const colWidths = rows[0].map((_, colIdx) => {
    const maxLen = Math.max(
      ...rows.map((row) => (row[colIdx] || "").toString().length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 50) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

function parseContentToRows(content: string): string[][] {
  // Strategy 1: Detect markdown tables (| col1 | col2 | col3 |)
  const tableRows = parseMarkdownTable(content);
  if (tableRows.length > 0) return tableRows;

  // Strategy 2: Detect structured bullet/numbered lists with " — " separators
  const listRows = parseStructuredList(content);
  if (listRows.length > 0) return listRows;

  return [];
}

function parseMarkdownTable(content: string): string[][] {
  const lines = content.split("\n");
  const rows: string[][] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this line is a markdown table row: starts and ends with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Skip separator rows like | --- | --- | --- |
      if (trimmed.match(/^\|[\s-:]+(\|[\s-:]+)+\|$/)) {
        inTable = true;
        continue;
      }

      // Parse table cells
      const cells = trimmed
        .split("|")
        .slice(1, -1) // Remove empty first/last from leading/trailing |
        .map((cell) => stripMarkdown(cell.trim()));

      if (cells.length > 0) {
        rows.push(cells);
        inTable = true;
      }
    } else if (inTable && trimmed === "") {
      // End of table on empty line after we started
      continue;
    } else if (inTable && !trimmed.startsWith("|")) {
      // Non-table line after table started — table is done
      // Don't break, there might be another table
      inTable = false;
    }
  }

  // Only return if we found a header + at least 1 data row
  return rows.length >= 2 ? rows : [];
}

function parseStructuredList(content: string): string[][] {
  const lines = content.split("\n").filter((l) => l.trim());
  const rows: string[][] = [];

  // Find bullet/numbered lines with " — " separators
  const bulletLines = lines.filter(
    (l) => l.match(/^[\s]*[-•*]\s/) || l.match(/^[\s]*\d+[.)]\s/)
  );

  if (bulletLines.length < 2) return [];

  const hasDashSep = bulletLines.some((l) => l.includes(" — "));
  if (!hasDashSep) return [];

  // Parse structured list items
  rows.push(["#", "Date", "Client", "Case Number", "Court", "Status"]);

  bulletLines.forEach((line, idx) => {
    const clean = stripMarkdown(line.replace(/^[\s]*[-•*\d.)]+\s*/, ""));
    const parts = clean.split(" — ").map((s) => s.trim());

    if (parts.length >= 3) {
      const date = parts[0] || "";
      const caseMatch = parts[1]?.match(
        /^(.+?)\s*\((.+?)\)\s*(?:at\s+)?(.*)$/
      );
      if (caseMatch) {
        rows.push([
          String(idx + 1),
          date,
          caseMatch[1].trim(),
          caseMatch[2].trim(),
          caseMatch[3].trim(),
          parts.slice(2).join(" — "),
        ]);
      } else {
        rows.push([
          String(idx + 1),
          date,
          parts[1] || "",
          "",
          "",
          parts.slice(2).join(" — "),
        ]);
      }
    } else {
      rows.push([String(idx + 1), clean, "", "", "", ""]);
    }
  });

  return rows.length > 1 ? rows : [];
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1");
}
