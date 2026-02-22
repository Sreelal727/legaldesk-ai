"use client";

import { useState } from "react";

interface ExportButtonsProps {
  content: string;
}

export default function ExportButtons({ content }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: "docx" | "pdf" | "excel") => {
    setExporting(type);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `legaldesk-${timestamp}`;

      if (type === "docx") {
        const { exportAsDocx } = await import("@/lib/export-docx");
        await exportAsDocx(content, filename);
      } else if (type === "pdf") {
        const { exportAsPdf } = await import("@/lib/export-pdf");
        exportAsPdf(content, filename);
      } else if (type === "excel") {
        const { exportAsExcel } = await import("@/lib/export-excel");
        exportAsExcel(content, filename);
      }
    } catch (err) {
      console.error(`Export ${type} failed:`, err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex gap-1.5 mt-2 pt-2 border-t border-gray-100">
      <ExportBtn
        onClick={() => handleExport("pdf")}
        loading={exporting === "pdf"}
        icon={
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        }
        label="PDF"
        color="text-red-600 border-red-200 hover:bg-red-50"
      />
      <ExportBtn
        onClick={() => handleExport("docx")}
        loading={exporting === "docx"}
        icon={
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        }
        label="DOCX"
        color="text-blue-600 border-blue-200 hover:bg-blue-50"
      />
      <ExportBtn
        onClick={() => handleExport("excel")}
        loading={exporting === "excel"}
        icon={
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        }
        label="Excel"
        color="text-green-600 border-green-200 hover:bg-green-50"
      />
    </div>
  );
}

function ExportBtn({
  onClick,
  loading,
  icon,
  label,
  color,
}: {
  onClick: () => void;
  loading: boolean;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors disabled:opacity-50 ${color}`}
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
