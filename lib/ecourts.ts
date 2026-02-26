// eCourts India integration utilities
// CNR Number format: SSDDCCNNNNNNNNYYYY (SS=state, DD=district, CC=court, NNNNNNNN=serial, YYYY=year)

import type { CourtDataCache } from "./types/firm";

export interface KeralaDistrict {
  name: string;
  code: string;
}

export const KERALA_STATE_CODE = "KL";

export const keralaDistricts: KeralaDistrict[] = [
  { name: "Thiruvananthapuram", code: "TV" },
  { name: "Kollam", code: "KO" },
  { name: "Pathanamthitta", code: "PT" },
  { name: "Alappuzha", code: "AL" },
  { name: "Kottayam", code: "KT" },
  { name: "Idukki", code: "ID" },
  { name: "Ernakulam", code: "ER" },
  { name: "Thrissur", code: "TS" },
  { name: "Palakkad", code: "PK" },
  { name: "Malappuram", code: "MP" },
  { name: "Kozhikode", code: "KK" },
  { name: "Wayanad", code: "WY" },
  { name: "Kannur", code: "KN" },
  { name: "Kasaragod", code: "KS" },
];

/**
 * Generate eCourts case status URL for CNR number lookup
 */
export function getECourtsStatusUrl(cnrNumber: string): string {
  return `https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&cnr_number=${encodeURIComponent(cnrNumber)}`;
}

/**
 * Generate eCourts case number search URL (district courts)
 */
export function getECourtsCaseSearchUrl(): string {
  return "https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index";
}

/**
 * Generate Kerala High Court case search URL
 */
export function getKeralaHCUrl(): string {
  return "https://hcservices.ecourts.gov.in/ecourtindiaHC/cases/case_no_qry.php?state_cd=13&dist_cd=1&court_code=1";
}

/**
 * Validate CNR number format (basic check)
 * Format: 16 characters - SSDDCCNNNNNNNNYYYY
 */
export function isValidCNR(cnr: string): boolean {
  const cleaned = cnr.replace(/\s/g, "").toUpperCase();
  return /^[A-Z]{4}\d{12}$/.test(cleaned);
}

/**
 * Format CNR number for display
 */
export function formatCNR(cnr: string): string {
  const cleaned = cnr.replace(/\s/g, "").toUpperCase();
  if (cleaned.length !== 16) return cnr;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
}

/**
 * Get eCourts district court services URL for Kerala
 */
export function getDistrictCourtUrl(districtName: string): string {
  const slug = districtName.toLowerCase().replace(/\s+/g, "");
  return `https://districts.ecourts.gov.in/kerala/${slug}`;
}

/**
 * Get the number of cases linked to eCourts (have CNR numbers)
 */
export function countLinkedCases(cases: { cnrNumber: string }[]): number {
  return cases.filter((c) => c.cnrNumber && c.cnrNumber.trim().length > 0).length;
}

/**
 * Check if a case's cached data is from today
 */
export function isCacheFresh(cache: CourtDataCache | null | undefined): boolean {
  if (!cache?.lastSynced) return false;
  const today = new Date().toISOString().split("T")[0];
  return cache.lastSynced.startsWith(today);
}

/**
 * Fetch court data from our server-side proxy
 * Returns normalized court data or throws an error
 */
export async function fetchCourtData(cnrNumber: string): Promise<{
  success: boolean;
  data?: CourtDataCache;
  error?: string;
}> {
  try {
    const res = await fetch("/api/ecourts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cnrNumber }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || `API error ${res.status}`,
      };
    }

    const d = json.data;
    const cache: CourtDataCache = {
      lastSynced: new Date().toISOString(),
      caseStatus: String(d.caseStatus || ""),
      nextHearingDate: String(d.nextHearingDate || ""),
      courtAndJudge: String(d.courtAndJudge || ""),
      petitioners: String(d.petitioners || ""),
      respondents: String(d.respondents || ""),
      filingDate: String(d.filingDate || ""),
      registrationNumber: String(d.registrationNumber || ""),
      registrationDate: String(d.registrationDate || ""),
      firstHearingDate: String(d.firstHearingDate || ""),
      caseHistory: Array.isArray(d.caseHistory) ? d.caseHistory : [],
      orders: Array.isArray(d.orders) ? d.orders : [],
    };

    return { success: true, data: cache };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Get cases that need syncing today (have CNR but no fresh cache)
 * Sorted by next hearing date (most urgent first)
 */
export function getCasesNeedingSync(
  cases: { cnrNumber: string; nextHearingDate: string; courtDataCache?: CourtDataCache | null }[]
): number[] {
  const indices: { index: number; urgency: number }[] = [];
  const now = Date.now();

  cases.forEach((c, i) => {
    if (!c.cnrNumber || c.cnrNumber.trim().length === 0) return;
    if (isCacheFresh(c.courtDataCache)) return;

    const hearingTime = c.nextHearingDate ? new Date(c.nextHearingDate).getTime() : now + 365 * 86400000;
    indices.push({ index: i, urgency: hearingTime - now });
  });

  // Sort by urgency — most urgent (soonest hearing) first
  indices.sort((a, b) => a.urgency - b.urgency);
  return indices.map((x) => x.index);
}
