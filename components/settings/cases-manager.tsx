"use client";

import { useState } from "react";
import type { Case } from "@/lib/mock-cases";
import { mockCases } from "@/lib/mock-cases";
import CaseFormModal from "./case-form-modal";

interface CasesManagerProps {
  cases: Case[];
  onChange: (cases: Case[]) => void;
}

export default function CasesManager({ cases, onChange }: CasesManagerProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (index: number) => {
    onChange(cases.filter((_, i) => i !== index));
  };

  const handleSaveEdit = (c: Case) => {
    if (editIndex === null) return;
    const updated = [...cases];
    updated[editIndex] = c;
    onChange(updated);
    setEditIndex(null);
  };

  const handleAdd = (c: Case) => {
    onChange([...cases, c]);
    setShowAdd(false);
  };

  const handleResetDemo = () => {
    onChange([...mockCases]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{cases.length} case{cases.length !== 1 ? "s" : ""}</p>
        <div className="flex gap-2">
          <button
            onClick={handleResetDemo}
            className="text-xs font-medium text-orange-600 hover:underline"
          >
            Reset to Demo Data
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs font-medium text-[#075e54] bg-[#075e54]/10 px-3 py-1 rounded-full hover:bg-[#075e54]/20"
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {cases.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {c.clientName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {c.caseNumber} &middot; {c.court}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setEditIndex(i)}
                className="p-1.5 text-gray-400 hover:text-[#075e54] rounded"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editIndex !== null && (
        <CaseFormModal
          initialCase={cases[editIndex]}
          onSave={handleSaveEdit}
          onClose={() => setEditIndex(null)}
        />
      )}

      {showAdd && (
        <CaseFormModal
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
