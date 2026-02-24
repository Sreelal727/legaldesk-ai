"use client";

import { useState } from "react";
import type { OpinionTemplate } from "@/lib/types/firm";
import { fillAndDownloadTemplate } from "@/lib/fill-docx-template";

interface OpinionGeneratorProps {
  templates: OpinionTemplate[];
  onClose: () => void;
  onAIFill: (prompt: string) => void;
}

export default function OpinionGenerator({
  templates,
  onClose,
  onAIFill,
}: OpinionGeneratorProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("English");
  const [generating, setGenerating] = useState(false);

  const selected = templates.find((t) => t.id === selectedId);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.bankName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = (id: string) => {
    setSelectedId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) {
      const init: Record<string, string> = {};
      for (const p of tpl.placeholders) {
        init[p.name] = "";
      }
      setValues(init);
      setStep(2);
    }
  };

  const handleGenerate = async () => {
    if (!selected) return;
    setGenerating(true);
    try {
      const filename = `${selected.bankName || selected.name} - Legal Opinion`;
      await fillAndDownloadTemplate(selected.id, values, filename);
    } catch (err) {
      alert(
        `Failed to generate: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleAIFill = () => {
    if (!selected) return;
    const placeholderList = selected.placeholders
      .map((p) => `"${p.name}"`)
      .join(", ");
    const langInstruction = language.startsWith("Malayalam")
      ? " Please provide ALL values in Malayalam (മലയാളം) using proper Malayalam legal terminology."
      : "";
    const prompt = `I need to fill the "${selected.name}" bank legal opinion template (${selected.bankName || "bank not specified"}). The template has these placeholders: ${placeholderList}. Please provide the values for all these placeholders as a JSON object with the placeholder names as keys and the filled values as string values.${langInstruction} Ask me for any case details you need.`;
    onAIFill(prompt);
    onClose();
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
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <h2 className="text-base font-semibold text-gray-900">
              {step === 1 ? "Select Template" : selected?.name}
            </h2>
          </div>
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

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && (
            <div className="space-y-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className={inputClass}
              />
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">
                  No templates found
                </p>
              ) : (
                filtered.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className="w-full text-left border border-gray-200 rounded-xl p-4 hover:border-[#075e54] hover:bg-[#075e54]/5 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {tpl.name}
                    </p>
                    {tpl.bankName && (
                      <p className="text-xs text-[#075e54] font-medium mt-0.5">
                        {tpl.bankName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {tpl.placeholders.length} fields to fill
                    </p>
                  </button>
                ))
              )}
            </div>
          )}

          {step === 2 && selected && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Language / ഭാഷ
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputClass}
                >
                  <option value="English">English</option>
                  <option value="Malayalam (മലയാളം)">Malayalam (മലയാളം)</option>
                </select>
              </div>
              {selected.placeholders.map((p) => (
                <div key={p.name}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {p.label}
                  </label>
                  {p.fieldType === "textarea" ? (
                    <textarea
                      value={values[p.name] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [p.name]: e.target.value,
                        }))
                      }
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <input
                      type={
                        p.fieldType === "date"
                          ? "date"
                          : p.fieldType === "number"
                            ? "number"
                            : "text"
                      }
                      value={values[p.name] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [p.name]: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {step === 2 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-[#075e54] text-white rounded-xl text-sm font-semibold hover:bg-[#064d44] transition-colors disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate DOCX"}
            </button>
            <button
              onClick={handleAIFill}
              className="w-full py-3 bg-white border border-[#075e54] text-[#075e54] rounded-xl text-sm font-semibold hover:bg-[#075e54]/5 transition-colors"
            >
              Fill with AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
