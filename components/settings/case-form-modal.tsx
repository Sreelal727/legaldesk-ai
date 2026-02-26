"use client";

import { useState } from "react";
import type { Case, PendingTask } from "@/lib/mock-cases";

interface CaseFormModalProps {
  initialCase?: Case;
  onSave: (c: Case) => void;
  onClose: () => void;
}

const emptyCase: Case = {
  clientName: "",
  caseNumber: "",
  cnrNumber: "",
  court: "",
  caseType: "",
  status: "",
  nextHearingDate: "",
  opposingParty: "",
  advocate: "",
  description: "",
  pendingTasks: [],
  courtDataCache: null,
};

const emptyTask: PendingTask = { task: "", deadline: "", priority: "Medium" };

export default function CaseFormModal({ initialCase, onSave, onClose }: CaseFormModalProps) {
  const [form, setForm] = useState<Case>(initialCase ?? emptyCase);

  const update = (field: keyof Case, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateTask = (index: number, field: keyof PendingTask, value: string) => {
    const tasks = [...form.pendingTasks];
    tasks[index] = { ...tasks[index], [field]: value } as PendingTask;
    setForm((prev) => ({ ...prev, pendingTasks: tasks }));
  };

  const addTask = () => {
    setForm((prev) => ({
      ...prev,
      pendingTasks: [...prev.pendingTasks, { ...emptyTask }],
    }));
  };

  const removeTask = (index: number) => {
    setForm((prev) => ({
      ...prev,
      pendingTasks: prev.pendingTasks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!form.clientName.trim() || !form.caseNumber.trim()) return;
    onSave(form);
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54]/30 focus:border-[#075e54]";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 overlay-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl bottom-sheet-slide-up max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {initialCase ? "Edit Case" : "Add New Case"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Client Name *</label>
              <input type="text" value={form.clientName} onChange={(e) => update("clientName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Case Number *</label>
              <input type="text" value={form.caseNumber} onChange={(e) => update("caseNumber", e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">CNR Number (eCourts)</label>
              <input
                type="text"
                value={form.cnrNumber}
                onChange={(e) => update("cnrNumber", e.target.value.toUpperCase())}
                placeholder="e.g. KLER020012342025"
                maxLength={16}
                className={inputClass}
              />
              <p className="text-[10px] text-gray-400 mt-0.5">16-char eCourts CNR for court status tracking</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Court</label>
              <input type="text" value={form.court} onChange={(e) => update("court", e.target.value)} placeholder="e.g. Kerala High Court" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Case Type</label>
              <input type="text" value={form.caseType} onChange={(e) => update("caseType", e.target.value)} placeholder="e.g. Civil — Property Dispute" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <input type="text" value={form.status} onChange={(e) => update("status", e.target.value)} placeholder="e.g. Hearing Scheduled" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Next Hearing Date</label>
              <input type="date" value={form.nextHearingDate} onChange={(e) => update("nextHearingDate", e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Opposing Party</label>
              <input type="text" value={form.opposingParty} onChange={(e) => update("opposingParty", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Advocate</label>
              <input type="text" value={form.advocate} onChange={(e) => update("advocate", e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Pending Tasks</h3>
              <button onClick={addTask} className="text-xs font-medium text-[#075e54] hover:underline">
                + Add Task
              </button>
            </div>
            {form.pendingTasks.map((task, i) => (
              <div key={i} className="flex items-start gap-2 mb-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={task.task}
                    onChange={(e) => updateTask(i, "task", e.target.value)}
                    placeholder="Task description"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={task.deadline}
                      onChange={(e) => updateTask(i, "deadline", e.target.value)}
                      className={inputClass}
                    />
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(i, "priority", e.target.value)}
                      className={inputClass}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => removeTask(i)} className="mt-2.5 p-1 text-red-400 hover:text-red-600" title="Remove">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#075e54] text-white rounded-xl text-sm font-semibold hover:bg-[#064d44] transition-colors"
          >
            {initialCase ? "Save Changes" : "Add Case"}
          </button>
        </div>
      </div>
    </div>
  );
}
