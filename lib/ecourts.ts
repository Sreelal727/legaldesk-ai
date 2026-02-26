// eCourts India integration utilities
// CNR Number format: SSDDCCNNNNNNNNYYYY (SS=state, DD=district, CC=court, NNNNNNNN=serial, YYYY=year)

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
  // KLЕР020012342025 → KLER-02-0012342025
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
