"use client";

import { useState } from "react";
import type { OpinionTemplate, OpinionTemplatePlaceholder } from "@/lib/types/firm";

interface TemplateEditModalProps {
  template: OpinionTemplate;
  onSave: (updated: OpinionTemplate) => void;
  onClose: () => void;
}

export default function TemplateEditModal({
  template,
  onSave,
  onClose,
}: TemplateEditModalProps) {
  const [name, setName] = useState(template.name);
  const [bankName, setBankName] = useState(template.bankName);
  const [notes, setNotes] = useState(template.notes);
  const [placeholders, setPlaceholders] = useState<OpinionTemplatePlaceholder[]>(
    template.placeholders
  );

  const updatePlaceholder = (
    index: number,
    field: "label" | "fieldType",
    value: string
  ) => {
    setPlaceholders((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...template,
      name: name.trim(),
      bankName: bankName.trim(),
      notes: notes.trim(),
      placeholders,
    });
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54]/30 focus:border-[#075e54]";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/50 overlay-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl bottom-sheet-slide-up max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Edit Template
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-500"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
              placeholder="Optional notes about this template"
            />
          </div>

          {placeholders.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Placeholders ({placeholders.length})
              </h3>
              <div className="space-y-3">
                {placeholders.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-mono mb-1 truncate">
                        {`{{${p.name}}}`}
                      </p>
                      <input
                        type="text"
                        value={p.label}
                        onChange={(e) =>
                          updatePlaceholder(i, "label", e.target.value)
                        }
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#075e54]/30"
                      />
                    </div>
                    <select
                      value={p.fieldType}
                      onChange={(e) =>
                        updatePlaceholder(i, "fieldType", e.target.value)
                      }
                      className="px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#075e54]/30"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="date">Date</option>
                      <option value="number">Number</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#075e54] text-white rounded-xl text-sm font-semibold hover:bg-[#064d44] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
