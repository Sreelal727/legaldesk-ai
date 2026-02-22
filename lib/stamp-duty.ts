export interface StampDutyEntry {
  documentType: string;
  stampDutyRate: string;
  registrationFee: string;
  notes?: string;
}

// Kerala Stamp Act & Registration Act rates
export const stampDutyRates: StampDutyEntry[] = [
  // ── Property Transactions ──
  { documentType: "Sale deed (residential property)", stampDutyRate: "8% of property value", registrationFee: "2% of property value", notes: "Total: 10% of property value. Applies to land and buildings." },
  { documentType: "Sale deed (commercial property)", stampDutyRate: "8% of property value", registrationFee: "2% of property value" },
  { documentType: "Sale deed (agricultural land)", stampDutyRate: "8% of property value", registrationFee: "2% of property value", notes: "Based on fair value fixed by government" },
  { documentType: "Gift deed (family members)", stampDutyRate: "5% of property value", registrationFee: "2% of property value", notes: "Reduced rate for transfers between family members (parents, children, spouse)" },
  { documentType: "Gift deed (others)", stampDutyRate: "8% of property value", registrationFee: "2% of property value" },
  { documentType: "Exchange deed", stampDutyRate: "8% of higher value property", registrationFee: "2% of higher value", notes: "Based on higher of the two property values" },
  { documentType: "Partition deed", stampDutyRate: "4% of separating share value", registrationFee: "2% of separating share", notes: "When partition is by court decree, different rates apply" },
  { documentType: "Settlement deed", stampDutyRate: "5% of property value", registrationFee: "2% of property value", notes: "For family settlements and property settlements" },
  { documentType: "Release deed", stampDutyRate: "5% of released share value", registrationFee: "2% of released share", notes: "Release of right/interest in property" },
  { documentType: "Mortgage deed (with possession)", stampDutyRate: "5% of loan amount", registrationFee: "2% of loan amount", notes: "English mortgage / usufructuary mortgage" },
  { documentType: "Mortgage deed (without possession)", stampDutyRate: "1% of loan amount (max ₹10,000)", registrationFee: "1% of loan amount (max ₹10,000)", notes: "Simple mortgage / equitable mortgage" },

  // ── Lease & Rent ──
  { documentType: "Lease deed (up to 1 year)", stampDutyRate: "₹100 (fixed)", registrationFee: "₹100 (fixed)", notes: "Registration optional but recommended" },
  { documentType: "Lease deed (1-5 years)", stampDutyRate: "1% of total rent for lease period", registrationFee: "1% (max ₹5,000)", notes: "Compulsory registration if term > 1 year" },
  { documentType: "Lease deed (5-10 years)", stampDutyRate: "2% of total rent for lease period", registrationFee: "1% (max ₹10,000)" },
  { documentType: "Lease deed (above 10 years)", stampDutyRate: "3% of total rent for lease period", registrationFee: "2% of total rent" },
  { documentType: "Rental agreement (11 months)", stampDutyRate: "₹200 (e-stamp)", registrationFee: "Not required", notes: "Standard 11-month rental agreement. Notarization recommended." },

  // ── Powers of Attorney ──
  { documentType: "General Power of Attorney (GPA)", stampDutyRate: "₹200 (fixed)", registrationFee: "₹200 (fixed)", notes: "If it involves immovable property transfer, same as sale deed" },
  { documentType: "GPA for property sale (irrevocable)", stampDutyRate: "8% of property value", registrationFee: "2% of property value", notes: "Treated as conveyance under Kerala HC rulings" },
  { documentType: "Special Power of Attorney", stampDutyRate: "₹100 (fixed)", registrationFee: "₹100 (fixed)" },

  // ── Agreements ──
  { documentType: "Agreement of sale (property)", stampDutyRate: "₹200 (e-stamp)", registrationFee: "₹100 (optional registration)", notes: "If possession is given, stamp duty as sale deed" },
  { documentType: "Partnership deed", stampDutyRate: "₹500 (fixed)", registrationFee: "₹500 (fixed)" },
  { documentType: "Dissolution of partnership", stampDutyRate: "₹200 (fixed)", registrationFee: "₹200 (fixed)" },

  // ── Affidavits & Misc ──
  { documentType: "Affidavit", stampDutyRate: "₹50 (e-stamp)", registrationFee: "Not required" },
  { documentType: "Adoption deed", stampDutyRate: "₹100 (fixed)", registrationFee: "₹100 (fixed)" },
  { documentType: "Will (registration)", stampDutyRate: "₹50 (fixed)", registrationFee: "₹50 (fixed)", notes: "Registration of will is optional but provides legal sanctity" },
  { documentType: "Cancellation deed", stampDutyRate: "₹100 (fixed)", registrationFee: "₹100 (fixed)" },
  { documentType: "Indemnity bond", stampDutyRate: "₹200 (fixed)", registrationFee: "Not required" },
];

export function calculateStampDuty(propertyValue: number, documentType: string = "sale"): { stampDuty: number; registrationFee: number; total: number; breakdown: string } {
  const lower = documentType.toLowerCase();

  if (lower.includes("sale")) {
    const sd = Math.round(propertyValue * 0.08);
    const rf = Math.round(propertyValue * 0.02);
    return {
      stampDuty: sd,
      registrationFee: rf,
      total: sd + rf,
      breakdown: `Stamp Duty (8%): ₹${sd.toLocaleString("en-IN")}\nRegistration Fee (2%): ₹${rf.toLocaleString("en-IN")}\nTotal: ₹${(sd + rf).toLocaleString("en-IN")}`,
    };
  }

  if (lower.includes("gift") && (lower.includes("family") || lower.includes("relative"))) {
    const sd = Math.round(propertyValue * 0.05);
    const rf = Math.round(propertyValue * 0.02);
    return {
      stampDuty: sd,
      registrationFee: rf,
      total: sd + rf,
      breakdown: `Stamp Duty (5%): ₹${sd.toLocaleString("en-IN")}\nRegistration Fee (2%): ₹${rf.toLocaleString("en-IN")}\nTotal: ₹${(sd + rf).toLocaleString("en-IN")}`,
    };
  }

  if (lower.includes("partition")) {
    const sd = Math.round(propertyValue * 0.04);
    const rf = Math.round(propertyValue * 0.02);
    return {
      stampDuty: sd,
      registrationFee: rf,
      total: sd + rf,
      breakdown: `Stamp Duty (4%): ₹${sd.toLocaleString("en-IN")}\nRegistration Fee (2%): ₹${rf.toLocaleString("en-IN")}\nTotal: ₹${(sd + rf).toLocaleString("en-IN")}`,
    };
  }

  if (lower.includes("mortgage")) {
    const sd = Math.round(propertyValue * 0.05);
    const rf = Math.round(propertyValue * 0.02);
    return {
      stampDuty: sd,
      registrationFee: rf,
      total: sd + rf,
      breakdown: `Stamp Duty (5%): ₹${sd.toLocaleString("en-IN")}\nRegistration Fee (2%): ₹${rf.toLocaleString("en-IN")}\nTotal: ₹${(sd + rf).toLocaleString("en-IN")}`,
    };
  }

  // Default: sale deed rates
  const sd = Math.round(propertyValue * 0.08);
  const rf = Math.round(propertyValue * 0.02);
  return {
    stampDuty: sd,
    registrationFee: rf,
    total: sd + rf,
    breakdown: `Stamp Duty (8%): ₹${sd.toLocaleString("en-IN")}\nRegistration Fee (2%): ₹${rf.toLocaleString("en-IN")}\nTotal: ₹${(sd + rf).toLocaleString("en-IN")}`,
  };
}

export function searchStampDuty(query: string): StampDutyEntry[] {
  const lower = query.toLowerCase();
  return stampDutyRates.filter(
    (e) =>
      e.documentType.toLowerCase().includes(lower) ||
      e.stampDutyRate.toLowerCase().includes(lower) ||
      (e.notes && e.notes.toLowerCase().includes(lower))
  );
}

export function getStampDutySummary(): string {
  return stampDutyRates
    .map((e) => `- ${e.documentType}: SD ${e.stampDutyRate}, Reg ${e.registrationFee}${e.notes ? ` (${e.notes})` : ""}`)
    .join("\n");
}
