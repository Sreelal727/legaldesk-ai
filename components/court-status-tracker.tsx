"use client";

import { useState, useCallback } from "react";
import type { Case } from "@/lib/mock-cases";
import {
  getECourtsStatusUrl,
  getECourtsCaseSearchUrl,
  formatCNR,
  countLinkedCases,
  isCacheFresh,
  fetchCourtData,
  getCasesNeedingSync,
} from "@/lib/ecourts";

interface CourtStatusTrackerProps {
  cases: Case[];
  onCasesUpdate: (cases: Case[]) => void;
  onClose: () => void;
}

type SyncStatus = "idle" | "syncing" | "done" | "error";

export default function CourtStatusTracker({ cases, onCasesUpdate, onClose }: CourtStatusTrackerProps) {
  const [filter, setFilter] = useState<"all" | "linked" | "unlinked">("all");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [syncError, setSyncError] = useState("");
  const [syncingIndex, setSyncingIndex] = useState<number | null>(null);

  const linkedCount = countLinkedCases(cases);
  const needsSyncCount = getCasesNeedingSync(cases).length;

  const filteredCases = cases.filter((c) => {
    if (filter === "linked") return c.cnrNumber && c.cnrNumber.trim().length > 0;
    if (filter === "unlinked") return !c.cnrNumber || c.cnrNumber.trim().length === 0;
    return true;
  });

  const getDaysUntilHearing = (dateStr: string): number | null => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hearing = new Date(dateStr);
    hearing.setHours(0, 0, 0, 0);
    return Math.ceil((hearing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (days: number | null): string => {
    if (days === null) return "text-gray-400";
    if (days < 0) return "text-red-600";
    if (days <= 3) return "text-red-500";
    if (days <= 7) return "text-orange-500";
    if (days <= 14) return "text-yellow-600";
    return "text-green-600";
  };

  const getUrgencyLabel = (days: number | null): string => {
    if (days === null) return "No date";
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "TODAY";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  // Sync a single case
  const syncSingleCase = useCallback(async (caseIndex: number) => {
    const c = cases[caseIndex];
    if (!c.cnrNumber) return;

    setSyncingIndex(caseIndex);
    const result = await fetchCourtData(c.cnrNumber);

    if (result.success && result.data) {
      const updated = [...cases];
      updated[caseIndex] = {
        ...updated[caseIndex],
        courtDataCache: result.data,
        // Auto-update case status and next hearing from eCourts if available
        ...(result.data.caseStatus ? { status: result.data.caseStatus } : {}),
        ...(result.data.nextHearingDate ? { nextHearingDate: result.data.nextHearingDate } : {}),
      };
      onCasesUpdate(updated);
    }

    setSyncingIndex(null);
    return result;
  }, [cases, onCasesUpdate]);

  // Sync all cases that need it (daily sync)
  const syncAll = useCallback(async () => {
    const toSync = getCasesNeedingSync(cases);
    if (toSync.length === 0) {
      setSyncStatus("done");
      return;
    }

    setSyncStatus("syncing");
    setSyncProgress({ current: 0, total: toSync.length });
    setSyncError("");

    let updatedCases = [...cases];
    let errors = 0;

    for (let i = 0; i < toSync.length; i++) {
      const idx = toSync[i];
      setSyncProgress({ current: i + 1, total: toSync.length });
      setSyncingIndex(idx);

      const result = await fetchCourtData(updatedCases[idx].cnrNumber);

      if (result.success && result.data) {
        updatedCases[idx] = {
          ...updatedCases[idx],
          courtDataCache: result.data,
          ...(result.data.caseStatus ? { status: result.data.caseStatus } : {}),
          ...(result.data.nextHearingDate ? { nextHearingDate: result.data.nextHearingDate } : {}),
        };
      } else {
        errors++;
        if (result.error?.includes("ECOURTS_API_KEY not configured")) {
          setSyncError("API key not configured. Add ECOURTS_API_KEY in Vercel settings.");
          setSyncStatus("error");
          setSyncingIndex(null);
          return;
        }
      }

      // Small delay between requests to be respectful
      if (i < toSync.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    onCasesUpdate(updatedCases);
    setSyncingIndex(null);

    if (errors > 0 && errors < toSync.length) {
      setSyncError(`Synced ${toSync.length - errors}/${toSync.length} cases. ${errors} failed.`);
    }

    setSyncStatus(errors === toSync.length ? "error" : "done");
  }, [cases, onCasesUpdate]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 overlay-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl bottom-sheet-slide-up max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Court Status Tracker</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {linkedCount}/{cases.length} linked &middot; {needsSyncCount > 0 ? `${needsSyncCount} need sync` : "All synced today"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sync All Button */}
            <button
              onClick={syncAll}
              disabled={syncStatus === "syncing" || needsSyncCount === 0}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                syncStatus === "syncing"
                  ? "bg-gray-100 text-gray-400 cursor-wait"
                  : needsSyncCount === 0
                  ? "bg-green-50 text-green-600 cursor-default"
                  : "bg-[#075e54] text-white hover:bg-[#064d44]"
              }`}
            >
              {syncStatus === "syncing" ? (
                <>
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {syncProgress.current}/{syncProgress.total}
                </>
              ) : needsSyncCount === 0 ? (
                "Synced"
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.681.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-.908l.84.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44.908l-.84-.84v1.36a.75.75 0 0 1-1.5 0V9.246a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.681.75.75 0 0 1 1.025-.274Z" clipRule="evenodd" />
                  </svg>
                  Sync ({needsSyncCount})
                </>
              )}
            </button>

            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sync error/status banner */}
        {syncError && (
          <div className={`mx-5 mt-2 px-3 py-2 rounded-lg text-xs ${
            syncStatus === "error" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
          }`}>
            {syncError}
          </div>
        )}

        {syncStatus === "done" && !syncError && (
          <div className="mx-5 mt-2 px-3 py-2 rounded-lg text-xs bg-green-50 text-green-700">
            All linked cases synced successfully.
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 px-5 py-2 border-b border-gray-50">
          {(["all", "linked", "unlinked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[#075e54] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? `All (${cases.length})` : f === "linked" ? `Linked (${linkedCount})` : `Unlinked (${cases.length - linkedCount})`}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {filteredCases.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No cases found</p>
          )}

          {filteredCases.map((c, filteredIdx) => {
            const realIndex = cases.indexOf(c);
            const days = getDaysUntilHearing(c.nextHearingDate);
            const hasLink = c.cnrNumber && c.cnrNumber.trim().length > 0;
            const hasFreshCache = isCacheFresh(c.courtDataCache);
            const isSyncing = syncingIndex === realIndex;

            return (
              <div
                key={filteredIdx}
                className={`border rounded-lg p-3 bg-white transition-colors ${
                  isSyncing ? "border-blue-300 bg-blue-50/30" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {c.clientName}
                      </p>
                      {hasLink && (
                        <span className={`shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded ${
                          hasFreshCache
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }`}>
                          {hasFreshCache ? "Synced" : "eCourts"}
                        </span>
                      )}
                      {isSyncing && (
                        <svg className="w-3 h-3 animate-spin text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.caseNumber} &middot; {c.court}
                    </p>
                    {hasLink && (
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        CNR: {formatCNR(c.cnrNumber)}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-xs font-semibold ${getUrgencyColor(days)}`}>
                      {getUrgencyLabel(days)}
                    </p>
                    {c.nextHearingDate && (
                      <p className="text-[10px] text-gray-400">{c.nextHearingDate}</p>
                    )}
                  </div>
                </div>

                {/* Cached court data summary */}
                {hasFreshCache && c.courtDataCache && (
                  <div className="mt-2 pt-2 border-t border-gray-50 space-y-1">
                    {c.courtDataCache.courtAndJudge && (
                      <p className="text-[11px] text-gray-600">
                        <span className="text-gray-400">Judge:</span> {c.courtDataCache.courtAndJudge}
                      </p>
                    )}
                    {c.courtDataCache.caseHistory.length > 0 && (
                      <p className="text-[11px] text-gray-600">
                        <span className="text-gray-400">Last hearing:</span>{" "}
                        {c.courtDataCache.caseHistory[c.courtDataCache.caseHistory.length - 1]?.date} —{" "}
                        {c.courtDataCache.caseHistory[c.courtDataCache.caseHistory.length - 1]?.purpose}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400">
                      Synced: {new Date(c.courtDataCache.lastSynced).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                    {c.status}
                  </span>
                  <div className="flex-1" />

                  {hasLink && (
                    <button
                      onClick={() => syncSingleCase(realIndex)}
                      disabled={isSyncing || syncStatus === "syncing"}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      title="Sync this case"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
                        <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.681.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-.908l.84.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44.908l-.84-.84v1.36a.75.75 0 0 1-1.5 0V9.246a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.681.75.75 0 0 1 1.025-.274Z" clipRule="evenodd" />
                      </svg>
                      Sync
                    </button>
                  )}

                  {hasLink ? (
                    <a
                      href={getECourtsStatusUrl(c.cnrNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#075e54] text-white text-xs font-medium rounded-lg hover:bg-[#064d44] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" />
                        <path d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" />
                      </svg>
                      eCourts
                    </a>
                  ) : (
                    <a
                      href={getECourtsCaseSearchUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                      </svg>
                      Search
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <a
              href="https://services.ecourts.gov.in/ecourtindia_v6/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              eCourts Portal
            </a>
            <a
              href="https://districts.ecourts.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              District Courts
            </a>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Add ECOURTS_API_KEY in Vercel env vars &middot; CNR numbers in Settings &rarr; Cases
          </p>
        </div>
      </div>
    </div>
  );
}
