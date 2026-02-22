export interface Case {
  clientName: string;
  caseNumber: string;
  court: string;
  caseType: string;
  status: string;
  nextHearingDate: string;
  opposingParty: string;
  advocate: string;
  description: string;
}

export const mockCases: Case[] = [
  {
    clientName: "Rajesh Kumar",
    caseNumber: "OS 1234/2025",
    court: "Kerala High Court, Ernakulam",
    caseType: "Civil — Property Dispute",
    status: "Hearing Scheduled",
    nextHearingDate: "2026-03-05",
    opposingParty: "Suresh Menon",
    advocate: "Adv. Priya Nair",
    description:
      "Dispute over ancestral property in Thrissur. Partition suit filed by client claiming 1/3rd share of family property. Respondent denies client's claim over the northern plot.",
  },
  {
    clientName: "Meera Thomas",
    caseNumber: "Crl.A 567/2025",
    court: "District Court, Kottayam",
    caseType: "Criminal — Cheque Bounce (NI Act 138)",
    status: "Awaiting Judgment",
    nextHearingDate: "2026-03-12",
    opposingParty: "Kerala State Financial Enterprises",
    advocate: "Adv. Priya Nair",
    description:
      "Client issued cheque of ₹5,00,000 which was dishonoured. Complaint filed by KSFE under Section 138 of NI Act. Arguments completed, judgment reserved.",
  },
  {
    clientName: "Anil Krishnan",
    caseNumber: "MC 890/2025",
    court: "Family Court, Thiruvananthapuram",
    caseType: "Family — Divorce Petition",
    status: "Mediation in Progress",
    nextHearingDate: "2026-03-08",
    opposingParty: "Lakshmi Krishnan",
    advocate: "Adv. Deepa Mohan",
    description:
      "Mutual consent divorce petition. Parties have agreed on alimony and child custody terms. Second motion hearing pending after 6-month cooling period.",
  },
  {
    clientName: "Fatima Begum",
    caseNumber: "WP(C) 2345/2025",
    court: "Kerala High Court, Ernakulam",
    caseType: "Civil — Writ Petition",
    status: "Filed — Admission Pending",
    nextHearingDate: "2026-04-01",
    opposingParty: "State of Kerala",
    advocate: "Adv. Priya Nair",
    description:
      "Writ petition challenging acquisition of client's commercial property in Kozhikode for road widening. Seeking fair market compensation under RFCTLARR Act.",
  },
  {
    clientName: "George Varghese",
    caseNumber: "CC 456/2024",
    court: "Judicial First Class Magistrate Court, Alappuzha",
    caseType: "Criminal — Motor Vehicle Accident",
    status: "Evidence Stage",
    nextHearingDate: "2026-03-15",
    opposingParty: "State of Kerala",
    advocate: "Adv. Deepa Mohan",
    description:
      "Client charged under Section 279 and 338 IPC for rash driving causing grievous hurt. Accident occurred on NH-66 near Alappuzha. Three prosecution witnesses examined so far.",
  },
  {
    clientName: "Sarita Devi",
    caseNumber: "EP 789/2025",
    court: "District Court, Palakkad",
    caseType: "Civil — Execution Petition",
    status: "Decree Under Execution",
    nextHearingDate: "2026-03-20",
    opposingParty: "Mohan Lal",
    advocate: "Adv. Priya Nair",
    description:
      "Execution of money decree of ₹12,00,000 obtained against respondent. Attachment of respondent's property in Palakkad ordered. Respondent seeking time to pay.",
  },
  {
    clientName: "Vineeth Menon",
    caseNumber: "OP 112/2026",
    court: "Kerala High Court, Ernakulam",
    caseType: "Civil — Consumer Dispute",
    status: "Counter-affidavit Filed",
    nextHearingDate: "2026-03-25",
    opposingParty: "Skyline Builders Pvt Ltd",
    advocate: "Adv. Deepa Mohan",
    description:
      "Client booked a flat in Kochi for ₹85,00,000. Builder delayed possession by 2 years. Seeking compensation, interest, and possession. Builder's counter filed claiming force majeure.",
  },
  {
    clientName: "Amina Fathima",
    caseNumber: "RP 334/2025",
    court: "Rent Control Court, Kozhikode",
    caseType: "Civil — Rent/Eviction",
    status: "Tenant's Reply Awaited",
    nextHearingDate: "2026-03-10",
    opposingParty: "Rashid Ali (Tenant)",
    advocate: "Adv. Priya Nair",
    description:
      "Eviction petition filed by landlord (client) against tenant for non-payment of rent for 8 months. Monthly rent ₹15,000. Total arrears ₹1,20,000. Tenant yet to file reply.",
  },
];

export function getCaseSummaries(): string {
  return mockCases
    .map(
      (c, i) =>
        `${i + 1}. **${c.clientName}** — Case No: ${c.caseNumber}
   Court: ${c.court}
   Type: ${c.caseType}
   Status: ${c.status}
   Next Hearing: ${c.nextHearingDate}
   Opposing Party: ${c.opposingParty}
   Advocate: ${c.advocate}
   Details: ${c.description}`
    )
    .join("\n\n");
}

export function getUpcomingHearings(): string {
  const sorted = [...mockCases]
    .filter((c) => c.nextHearingDate)
    .sort(
      (a, b) =>
        new Date(a.nextHearingDate).getTime() -
        new Date(b.nextHearingDate).getTime()
    );

  return sorted
    .map(
      (c) =>
        `• **${c.nextHearingDate}** — ${c.clientName} (${c.caseNumber}) at ${c.court} — ${c.status}`
    )
    .join("\n");
}
