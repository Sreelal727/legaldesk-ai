"use client";

import { useState } from "react";
import type { Case } from "@/lib/mock-cases";
import {
  getECourtsStatusUrl,
  getECourtsCaseSearchUrl,
  formatCNR,
  countLinkedCases,
} from "@/lib/ecourts";

interface CourtStatusTrackerProps {
  cases: Case[];
  onClose: () => void;
}

export default function CourtStatusTracker({ cases, onClose }: CourtStatusTrackerProps) {
  const [filter, setFilter] = useState<"all" | "linked" | "unlinked">("all");

  const linkedCount = countLinkedCases(cases);
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
              {linkedCount}/{cases.length} cases linked to eCourts
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

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

          {filteredCases.map((c, i) => {
            const days = getDaysUntilHearing(c.nextHearingDate);
            const hasLink = c.cnrNumber && c.cnrNumber.trim().length > 0;

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {c.clientName}
                      </p>
                      {hasLink && (
                        <span className="shrink-0 px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded">
                          eCourts
                        </span>
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

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                    {c.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {c.caseType}
                  </span>
                  <div className="flex-1" />

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
                      Check eCourts
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
                      Search eCourts
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with eCourts link */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <a
              href="https://services.ecourts.gov.in/ecourtindia_v6/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Open eCourts Portal
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
            Add CNR numbers in Settings &rarr; Cases to enable direct eCourts linking
          </p>
        </div>
      </div>
    </div>
  );
}
