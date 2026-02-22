export interface LimitationEntry {
  caseType: string;
  description: string;
  period: string;
  section: string;
  article: string;
  startDate: string;
  notes?: string;
}

export const limitationPeriods: LimitationEntry[] = [
  // ── Appeals ──
  { caseType: "Appeal", description: "Appeal to High Court from decree of District Court (civil)", period: "30 days", section: "Section 96 CPC", article: "Art. 116", startDate: "Date of decree", notes: "Excludes time for obtaining certified copy" },
  { caseType: "Appeal", description: "Appeal to Supreme Court from High Court judgment", period: "90 days", section: "Article 136 Constitution", article: "Art. 117", startDate: "Date of judgment/order", notes: "Special Leave Petition" },
  { caseType: "Appeal", description: "First appeal from original decree (civil)", period: "30 days", section: "Section 96 CPC", article: "Art. 116", startDate: "Date of decree" },
  { caseType: "Appeal", description: "Appeal against acquittal (criminal)", period: "90 days", section: "Section 417 CrPC / Section 419 BNSS", article: "—", startDate: "Date of acquittal order" },
  { caseType: "Appeal", description: "Criminal appeal against conviction", period: "30 days", section: "Section 374 CrPC / Section 399 BNSS", article: "—", startDate: "Date of sentence" },
  { caseType: "Appeal", description: "Appeal under Motor Vehicles Act", period: "90 days", section: "Section 173 MV Act", article: "—", startDate: "Date of award" },

  // ── Revision ──
  { caseType: "Revision", description: "Revision petition to High Court (civil)", period: "90 days", section: "Section 115 CPC", article: "Art. 131", startDate: "Date of order" },
  { caseType: "Revision", description: "Criminal revision petition", period: "90 days", section: "Section 397 CrPC / Section 421 BNSS", article: "—", startDate: "Date of order" },

  // ── Civil Suits ──
  { caseType: "Civil", description: "Suit for recovery of money (simple contract)", period: "3 years", section: "—", article: "Art. 36", startDate: "When the debt becomes due" },
  { caseType: "Civil", description: "Suit for recovery of money (promissory note)", period: "3 years", section: "—", article: "Art. 22", startDate: "When the note falls due" },
  { caseType: "Civil", description: "Suit on a registered bond", period: "12 years", section: "—", article: "Art. 23", startDate: "When the money becomes due" },
  { caseType: "Civil", description: "Suit for specific performance of contract", period: "3 years", section: "—", article: "Art. 54", startDate: "Date fixed for performance / refusal" },
  { caseType: "Civil", description: "Suit for compensation for breach of contract", period: "3 years", section: "—", article: "Art. 55", startDate: "Date of breach" },
  { caseType: "Civil", description: "Suit for possession of immovable property", period: "12 years", section: "—", article: "Art. 65", startDate: "Date of dispossession" },
  { caseType: "Civil", description: "Suit for partition", period: "12 years", section: "—", article: "Art. 110", startDate: "When exclusion from joint possession occurs" },
  { caseType: "Civil", description: "Suit for declaration and injunction", period: "3 years", section: "—", article: "Art. 58", startDate: "When right to sue first accrues" },
  { caseType: "Civil", description: "Suit for recovery of rent", period: "3 years", section: "—", article: "Art. 52", startDate: "When the arrears become due" },
  { caseType: "Civil", description: "Suit for damages for tort/negligence", period: "1 year", section: "—", article: "Art. 72", startDate: "Date of wrong" },

  // ── Family ──
  { caseType: "Family", description: "Suit for divorce (Hindu Marriage Act)", period: "No limitation", section: "Section 13 HMA", article: "—", startDate: "—", notes: "No specific limitation but grounds must be established" },
  { caseType: "Family", description: "Petition for maintenance under CrPC 125", period: "No limitation", section: "Section 125 CrPC / Section 144 BNSS", article: "—", startDate: "—", notes: "Can be filed anytime during subsistence of marriage" },
  { caseType: "Family", description: "Application for custody of minor child", period: "No limitation", section: "Guardians & Wards Act", article: "—", startDate: "—" },
  { caseType: "Family", description: "Succession certificate application", period: "No limitation", section: "Section 372 Indian Succession Act", article: "—", startDate: "—" },

  // ── Property ──
  { caseType: "Property", description: "Suit against government for land acquisition compensation", period: "1 year", section: "Section 64 RFCTLARR Act 2013", article: "—", startDate: "Date of award" },
  { caseType: "Property", description: "Suit for cancellation of instrument", period: "3 years", section: "—", article: "Art. 59", startDate: "When facts entitling plaintiff become known" },
  { caseType: "Property", description: "Suit for pre-emption", period: "1 year", section: "—", article: "Art. 97", startDate: "Date of sale / registration" },

  // ── Criminal Complaints ──
  { caseType: "Criminal", description: "Complaint under Section 138 NI Act (cheque bounce)", period: "30 days", section: "Section 142 NI Act", article: "—", startDate: "After expiry of 15-day notice period", notes: "Notice must be sent within 30 days of cheque return" },
  { caseType: "Criminal", description: "Private complaint (magistrate court)", period: "3 years", section: "Section 468 CrPC / Section 512 BNSS", article: "—", startDate: "Date of offence", notes: "For offences punishable up to 3 years" },
  { caseType: "Criminal", description: "FIR / complaint (offences > 3 years punishment)", period: "No limitation", section: "Section 468 CrPC / Section 512 BNSS", article: "—", startDate: "—", notes: "No limitation for serious offences" },

  // ── Consumer ──
  { caseType: "Consumer", description: "Consumer complaint (District/State/National)", period: "2 years", section: "Section 69 Consumer Protection Act 2019", article: "—", startDate: "Date of cause of action", notes: "Condonation possible if sufficient cause shown" },

  // ── Labour ──
  { caseType: "Labour", description: "Claim under Industrial Disputes Act", period: "3 years", section: "Section 10 ID Act", article: "—", startDate: "Date of dispute" },
  { caseType: "Labour", description: "Claim under Payment of Wages Act", period: "12 months", section: "Section 15(2)", article: "—", startDate: "Date of deduction / delay" },

  // ── Execution ──
  { caseType: "Execution", description: "Execution of decree", period: "12 years", section: "Order 21 CPC", article: "Art. 136", startDate: "Date of decree or last payment" },

  // ── Writ ──
  { caseType: "Writ", description: "Writ petition under Article 226", period: "No fixed limitation", section: "Article 226 Constitution", article: "—", startDate: "—", notes: "Should be filed without unreasonable delay. Generally within 6 months to 1 year is acceptable. Delay must be explained." },

  // ── Tax ──
  { caseType: "Tax", description: "Appeal to Commissioner of Income Tax (Appeals)", period: "30 days", section: "Section 246A IT Act", article: "—", startDate: "Date of assessment order" },
  { caseType: "Tax", description: "Appeal to ITAT", period: "60 days", section: "Section 253 IT Act", article: "—", startDate: "Date of CIT(A) order" },
];

export function searchLimitation(query: string): LimitationEntry[] {
  const lower = query.toLowerCase();
  return limitationPeriods.filter(
    (e) =>
      e.caseType.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.section.toLowerCase().includes(lower) ||
      e.period.toLowerCase().includes(lower)
  );
}

export function getLimitationByType(caseType: string): LimitationEntry[] {
  const lower = caseType.toLowerCase();
  return limitationPeriods.filter((e) => e.caseType.toLowerCase() === lower);
}

export function getAllLimitationTypes(): string[] {
  return [...new Set(limitationPeriods.map((e) => e.caseType))];
}

export function getLimitationSummary(): string {
  return limitationPeriods
    .map((e) => `- ${e.description}: ${e.period} (${e.article !== "—" ? e.article : e.section})`)
    .join("\n");
}
