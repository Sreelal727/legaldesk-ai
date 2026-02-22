"use client";

import { useState, useRef, useEffect } from "react";
import type { QuickActionFormConfig, FormField } from "@/lib/quick-action-forms";

function SearchableDropdown({
  field,
  value,
  onChange,
  hasError,
}: {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
}) {
  const [search, setSearch] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = field.options ?? [];
  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={search}
        placeholder={field.placeholder}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54]/30 focus:border-[#075e54] ${
          hasError ? "border-red-400" : "border-gray-300"
        }`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSearch(option);
                onChange(option);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm hover:bg-[#075e54]/10 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FormFieldInput({
  field,
  value,
  onChange,
  hasError,
}: {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
}) {
  const baseClass = `w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54]/30 focus:border-[#075e54] ${
    hasError ? "border-red-400" : "border-gray-300"
  }`;

  switch (field.type) {
    case "searchable":
      return (
        <SearchableDropdown
          field={field}
          value={value}
          onChange={onChange}
          hasError={hasError}
        />
      );

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        >
          <option value="">Select...</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "textarea":
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseClass} resize-none`}
        />
      );

    case "number":
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ₹
          </span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${baseClass} pl-7`}
          />
        </div>
      );

    case "date":
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      );

    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClass}
        />
      );
  }
}

interface QuickActionFormProps {
  config: QuickActionFormConfig;
  onSubmit: (prompt: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function QuickActionForm({
  config,
  onSubmit,
  onClose,
  isLoading,
}: QuickActionFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setValue = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const hasError = (field: FormField): boolean =>
    submitted && !!field.required && !values[field.name]?.trim();

  const handleSubmit = () => {
    setSubmitted(true);
    const missing = config.fields.some(
      (f) => f.required && !values[f.name]?.trim()
    );
    if (missing) return;

    const prompt = config.buildPrompt(values);
    onSubmit(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 overlay-fade-in"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl bottom-sheet-slide-up max-h-[85vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {config.formTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
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

        {/* Form fields */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {config.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>
              <FormFieldInput
                field={field}
                value={values[field.name] ?? ""}
                onChange={(val) => setValue(field.name, val)}
                hasError={hasError(field)}
              />
              {hasError(field) && (
                <p className="text-xs text-red-500 mt-1">
                  This field is required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-[#075e54] text-white rounded-xl text-sm font-semibold hover:bg-[#064d44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
            Send to AI
          </button>
        </div>
      </div>
    </div>
  );
}
