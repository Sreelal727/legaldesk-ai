"use client";

import { useState, useRef } from "react";
import type { OpinionTemplate } from "@/lib/types/firm";
import { extractPlaceholders } from "@/lib/docx-template-utils";
import {
  saveTemplateFile,
  deleteTemplateFile,
} from "@/lib/template-store";
import TemplateEditModal from "./template-edit-modal";

interface TemplatesManagerProps {
  templates: OpinionTemplate[];
  onChange: (templates: OpinionTemplate[]) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TemplatesManager({
  templates,
  onChange,
}: TemplatesManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editTemplate, setEditTemplate] = useState<OpinionTemplate | null>(
    null
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const buffer = await file.arrayBuffer();
      const placeholders = extractPlaceholders(buffer);
      const id = `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await saveTemplateFile(id, buffer);

      const newTemplate: OpinionTemplate = {
        id,
        name: file.name.replace(/\.docx$/i, ""),
        bankName: "",
        notes: "",
        placeholders,
        fileSizeBytes: file.size,
        originalFileName: file.name,
        createdAt: new Date().toISOString(),
      };

      onChange([...templates, newTemplate]);
    } catch (err) {
      alert(
        `Failed to process DOCX: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await deleteTemplateFile(id);
    onChange(templates.filter((t) => t.id !== id));
  };

  const handleEditSave = (updated: OpinionTemplate) => {
    onChange(templates.map((t) => (t.id === updated.id ? updated : t)));
    setEditTemplate(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">
          DOCX Templates
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-[#075e54] text-white rounded-lg text-xs font-medium hover:bg-[#064d44] transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "+ Upload .docx"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No templates uploaded yet</p>
          <p className="text-xs mt-1">
            Upload a DOCX file with {"{{placeholder}}"} markers
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {tpl.name}
                  </h4>
                  {tpl.bankName && (
                    <p className="text-xs text-[#075e54] font-medium mt-0.5">
                      {tpl.bankName}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{tpl.placeholders.length} placeholders</span>
                    <span>{formatBytes(tpl.fileSizeBytes)}</span>
                    <span>{tpl.originalFileName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditTemplate(tpl)}
                    className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-1.5 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editTemplate && (
        <TemplateEditModal
          template={editTemplate}
          onSave={handleEditSave}
          onClose={() => setEditTemplate(null)}
        />
      )}
    </div>
  );
}
