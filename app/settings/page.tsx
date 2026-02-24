"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { loadFirmData, saveFirmData, exportFirmData, importFirmData } from "@/lib/firm-store";
import type { FirmData } from "@/lib/types/firm";
import FirmProfileForm from "@/components/settings/firm-profile-form";
import CasesManager from "@/components/settings/cases-manager";
import AIInstructionsForm from "@/components/settings/ai-instructions-form";
import TemplatesManager from "@/components/settings/templates-manager";

type Tab = "profile" | "cases" | "templates" | "ai";

export default function SettingsPage() {
  const [firmData, setFirmData] = useState<FirmData>(() => loadFirmData());
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save on changes
  useEffect(() => {
    saveFirmData(firmData);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [firmData]);

  const handleExport = () => {
    const json = exportFirmData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legaldesk-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = importFirmData(ev.target?.result as string);
        setFirmData(data);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Firm Profile" },
    { key: "cases", label: "Cases" },
    { key: "templates", label: "Templates" },
    { key: "ai", label: "AI Instructions" },
  ];

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-[#ece5dd]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shrink-0 shadow-md z-10">
        <Link
          href="/chat"
          className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold leading-tight">Settings</h1>
          <p className="text-xs text-white/70 leading-tight">
            {firmData.profile.firmName}
          </p>
        </div>
        {saved && (
          <span className="text-xs text-[#25d366] font-medium animate-pulse">
            Saved
          </span>
        )}
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "text-[#075e54] border-b-2 border-[#075e54]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {activeTab === "profile" && (
            <FirmProfileForm
              profile={firmData.profile}
              onChange={(profile) => setFirmData((prev) => ({ ...prev, profile }))}
            />
          )}
          {activeTab === "cases" && (
            <CasesManager
              cases={firmData.cases}
              onChange={(cases) => setFirmData((prev) => ({ ...prev, cases }))}
            />
          )}
          {activeTab === "templates" && (
            <TemplatesManager
              templates={firmData.opinionTemplates}
              onChange={(opinionTemplates) =>
                setFirmData((prev) => ({ ...prev, opinionTemplates }))
              }
            />
          )}
          {activeTab === "ai" && (
            <AIInstructionsForm
              instructions={firmData.customInstructions}
              onChange={(customInstructions) =>
                setFirmData((prev) => ({ ...prev, customInstructions }))
              }
            />
          )}
        </div>

        {/* Export / Import */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={handleImport}
            className="flex-1 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
