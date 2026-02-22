export interface CourtFeeEntry {
  courtType: string;
  suitType: string;
  feeStructure: string;
  notes?: string;
}

// Kerala Court Fees and Suits Valuation Act, 1959 (as amended)
export const courtFeeSchedule: CourtFeeEntry[] = [
  // ── District Court / Munsiff Court ──
  { courtType: "District Court", suitType: "Money suit (recovery of debt/damages)", feeStructure: "Ad valorem: 7.5% of suit value (minimum ₹100)", notes: "For suits above ₹20,000" },
  { courtType: "District Court", suitType: "Suit for possession of immovable property", feeStructure: "Ad valorem: 7.5% of property value as per market value", notes: "Based on fair market value" },
  { courtType: "District Court", suitType: "Suit for partition", feeStructure: "Ad valorem: 7.5% of plaintiff's share value", notes: "Valued at plaintiff's share of property" },
  { courtType: "District Court", suitType: "Suit for injunction (with consequential relief)", feeStructure: "Ad valorem: 7.5% of property/subject value", notes: "If injunction relates to property" },
  { courtType: "District Court", suitType: "Suit for injunction (without property)", feeStructure: "Fixed: ₹200 to ₹1,000", notes: "Bare injunction suits" },
  { courtType: "District Court", suitType: "Suit for declaration (with consequential relief)", feeStructure: "Ad valorem: 7.5% of subject value" },
  { courtType: "District Court", suitType: "Suit for declaration (without consequential relief)", feeStructure: "Fixed: ₹200 to ₹500" },
  { courtType: "District Court", suitType: "Suit for specific performance", feeStructure: "Ad valorem: 7.5% of contract value" },
  { courtType: "District Court", suitType: "Interlocutory applications (IA)", feeStructure: "₹50 to ₹200 per application" },
  { courtType: "District Court", suitType: "Execution petition", feeStructure: "Ad valorem: 2.5% of decree amount" },

  // ── High Court of Kerala ──
  { courtType: "High Court", suitType: "Original Suit (OS)", feeStructure: "Ad valorem: 10% of suit value", notes: "High Court original jurisdiction" },
  { courtType: "High Court", suitType: "Regular First Appeal (RFA)", feeStructure: "Same court fee as paid in trial court", notes: "Refundable if appeal succeeds" },
  { courtType: "High Court", suitType: "Second Appeal (SA)", feeStructure: "Same court fee as first appeal" },
  { courtType: "High Court", suitType: "Writ Petition (Civil)", feeStructure: "₹500 (fixed)" },
  { courtType: "High Court", suitType: "Writ Petition (Criminal)", feeStructure: "₹200 (fixed)" },
  { courtType: "High Court", suitType: "Criminal Appeal", feeStructure: "₹200 (fixed)" },
  { courtType: "High Court", suitType: "Criminal Revision", feeStructure: "₹200 (fixed)" },
  { courtType: "High Court", suitType: "Civil Revision Petition (CRP)", feeStructure: "₹500 (fixed)" },
  { courtType: "High Court", suitType: "Matrimonial Appeal", feeStructure: "₹200 to ₹500" },
  { courtType: "High Court", suitType: "Bail Application", feeStructure: "₹100 to ₹200" },

  // ── Family Court ──
  { courtType: "Family Court", suitType: "Petition for divorce", feeStructure: "₹100 to ₹500", notes: "Kerala Family Courts" },
  { courtType: "Family Court", suitType: "Petition for maintenance", feeStructure: "₹100 (fixed)" },
  { courtType: "Family Court", suitType: "Petition for custody of children", feeStructure: "₹100 (fixed)" },
  { courtType: "Family Court", suitType: "Petition for restitution of conjugal rights", feeStructure: "₹100 to ₹200" },

  // ── Rent Control Court ──
  { courtType: "Rent Control Court", suitType: "Eviction petition", feeStructure: "₹200 (fixed)", notes: "Under Kerala Buildings (Lease & Rent Control) Act" },
  { courtType: "Rent Control Court", suitType: "Fair rent fixation", feeStructure: "₹100 (fixed)" },

  // ── Consumer Forum ──
  { courtType: "Consumer Forum", suitType: "Complaint up to ₹5 lakh", feeStructure: "₹100" },
  { courtType: "Consumer Forum", suitType: "Complaint ₹5 lakh to ₹10 lakh", feeStructure: "₹200" },
  { courtType: "Consumer Forum", suitType: "Complaint ₹10 lakh to ₹20 lakh", feeStructure: "₹300" },
  { courtType: "Consumer Forum", suitType: "Complaint ₹20 lakh to ₹50 lakh", feeStructure: "₹500" },
  { courtType: "Consumer Forum", suitType: "Complaint ₹50 lakh to ₹1 crore", feeStructure: "₹2,000" },
  { courtType: "Consumer Forum", suitType: "Complaint above ₹1 crore (State Commission)", feeStructure: "₹5,000" },

  // ── Motor Accident Claims Tribunal ──
  { courtType: "MACT", suitType: "Motor accident claim petition", feeStructure: "No court fee", notes: "Free of court fee under Section 170 MV Act" },

  // ── Labour Court / Industrial Tribunal ──
  { courtType: "Labour Court", suitType: "Industrial dispute claim", feeStructure: "No court fee", notes: "No fee for workmen" },
];

export function calculateCourtFee(suitValue: number, courtType: string = "District Court"): string {
  const lower = courtType.toLowerCase();

  if (lower.includes("district") || lower.includes("munsiff")) {
    if (suitValue <= 0) return "₹100 (minimum court fee)";
    const fee = Math.max(100, Math.round(suitValue * 0.075));
    return `₹${fee.toLocaleString("en-IN")} (7.5% of ₹${suitValue.toLocaleString("en-IN")})`;
  }

  if (lower.includes("high court") || lower.includes("hc")) {
    if (suitValue <= 0) return "₹500 (fixed fee for petitions)";
    const fee = Math.round(suitValue * 0.10);
    return `₹${fee.toLocaleString("en-IN")} (10% of ₹${suitValue.toLocaleString("en-IN")})`;
  }

  return "See schedule for specific court type";
}

export function searchCourtFees(query: string): CourtFeeEntry[] {
  const lower = query.toLowerCase();
  return courtFeeSchedule.filter(
    (e) =>
      e.courtType.toLowerCase().includes(lower) ||
      e.suitType.toLowerCase().includes(lower) ||
      (e.notes && e.notes.toLowerCase().includes(lower))
  );
}

export function getCourtFeeSummary(): string {
  const grouped: Record<string, CourtFeeEntry[]> = {};
  for (const e of courtFeeSchedule) {
    if (!grouped[e.courtType]) grouped[e.courtType] = [];
    grouped[e.courtType].push(e);
  }
  return Object.entries(grouped)
    .map(([court, entries]) =>
      `**${court}:**\n${entries.map((e) => `  - ${e.suitType}: ${e.feeStructure}`).join("\n")}`
    )
    .join("\n\n");
}
