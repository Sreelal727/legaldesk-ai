export interface PendingTask {
  task: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

export interface Case {
  clientName: string;
  caseNumber: string;
  cnrNumber: string;
  court: string;
  caseType: string;
  status: string;
  nextHearingDate: string;
  opposingParty: string;
  advocate: string;
  description: string;
  pendingTasks: PendingTask[];
}

export const mockCases: Case[] = [
  {
    clientName: "Rajesh Kumar",
    caseNumber: "OS 1234/2025",
    cnrNumber: "KLER020012342025",
    court: "Kerala High Court, Ernakulam",
    caseType: "Civil — Property Dispute",
    status: "Hearing Scheduled",
    nextHearingDate: "2026-03-05",
    opposingParty: "Suresh Menon",
    advocate: "Adv. Priya Nair",
    description:
      "Dispute over ancestral property in Thrissur. Partition suit filed by client claiming 1/3rd share of family property. Respondent denies client's claim over the northern plot.",
    pendingTasks: [
      { task: "File written arguments before hearing", deadline: "2026-03-03", priority: "High" },
      { task: "Collect revenue records from Thrissur sub-registrar", deadline: "2026-03-01", priority: "High" },
      { task: "Follow up with surveyor for property measurement report", deadline: "2026-02-28", priority: "Medium" },
    ],
  },
  {
    clientName: "Meera Thomas",
    caseNumber: "Crl.A 567/2025",
    cnrNumber: "KLKT010005672025",
    court: "District Court, Kottayam",
    caseType: "Criminal — Cheque Bounce (NI Act 138)",
    status: "Awaiting Judgment",
    nextHearingDate: "2026-03-12",
    opposingParty: "Kerala State Financial Enterprises",
    advocate: "Adv. Priya Nair",
    description:
      "Client issued cheque of ₹5,00,000 which was dishonoured. Complaint filed by KSFE under Section 138 of NI Act. Arguments completed, judgment reserved.",
    pendingTasks: [
      { task: "Prepare for judgment — brief client on possible outcomes", deadline: "2026-03-10", priority: "High" },
      { task: "Draft settlement proposal in case of adverse judgment", deadline: "2026-03-11", priority: "Medium" },
    ],
  },
  {
    clientName: "Anil Krishnan",
    caseNumber: "MC 890/2025",
    cnrNumber: "",
    court: "Family Court, Thiruvananthapuram",
    caseType: "Family — Divorce Petition",
    status: "Mediation in Progress",
    nextHearingDate: "2026-03-08",
    opposingParty: "Lakshmi Krishnan",
    advocate: "Adv. Deepa Mohan",
    description:
      "Mutual consent divorce petition. Parties have agreed on alimony and child custody terms. Second motion hearing pending after 6-month cooling period.",
    pendingTasks: [
      { task: "Prepare second motion petition", deadline: "2026-03-05", priority: "High" },
      { task: "Get client signature on final alimony agreement", deadline: "2026-03-06", priority: "High" },
      { task: "Collect child custody consent affidavit from both parties", deadline: "2026-03-07", priority: "Medium" },
    ],
  },
  {
    clientName: "Fatima Begum",
    caseNumber: "WP(C) 2345/2025",
    cnrNumber: "KLER020023452025",
    court: "Kerala High Court, Ernakulam",
    caseType: "Civil — Writ Petition",
    status: "Filed — Admission Pending",
    nextHearingDate: "2026-04-01",
    opposingParty: "State of Kerala",
    advocate: "Adv. Priya Nair",
    description:
      "Writ petition challenging acquisition of client's commercial property in Kozhikode for road widening. Seeking fair market compensation under RFCTLARR Act.",
    pendingTasks: [
      { task: "File additional affidavit with property valuation report", deadline: "2026-03-25", priority: "High" },
      { task: "Obtain certified copy of acquisition notification from Collector's office", deadline: "2026-03-15", priority: "Medium" },
    ],
  },
  {
    clientName: "George Varghese",
    caseNumber: "CC 456/2024",
    cnrNumber: "KLAL010004562024",
    court: "Judicial First Class Magistrate Court, Alappuzha",
    caseType: "Criminal — Motor Vehicle Accident",
    status: "Evidence Stage",
    nextHearingDate: "2026-03-15",
    opposingParty: "State of Kerala",
    advocate: "Adv. Deepa Mohan",
    description:
      "Client charged under Section 279 and 338 IPC for rash driving causing grievous hurt. Accident occurred on NH-66 near Alappuzha. Three prosecution witnesses examined so far.",
    pendingTasks: [
      { task: "Prepare list of defence witnesses", deadline: "2026-03-10", priority: "High" },
      { task: "Collect medical records from Alappuzha General Hospital", deadline: "2026-03-08", priority: "Medium" },
      { task: "File application to recall prosecution witness for cross-examination", deadline: "2026-03-12", priority: "Medium" },
    ],
  },
  {
    clientName: "Sarita Devi",
    caseNumber: "EP 789/2025",
    cnrNumber: "",
    court: "District Court, Palakkad",
    caseType: "Civil — Execution Petition",
    status: "Decree Under Execution",
    nextHearingDate: "2026-03-20",
    opposingParty: "Mohan Lal",
    advocate: "Adv. Priya Nair",
    description:
      "Execution of money decree of ₹12,00,000 obtained against respondent. Attachment of respondent's property in Palakkad ordered. Respondent seeking time to pay.",
    pendingTasks: [
      { task: "File objection to respondent's application for time extension", deadline: "2026-03-18", priority: "High" },
      { task: "Follow up with court bailiff on property attachment status", deadline: "2026-03-15", priority: "Medium" },
    ],
  },
  {
    clientName: "Vineeth Menon",
    caseNumber: "OP 112/2026",
    cnrNumber: "",
    court: "Kerala High Court, Ernakulam",
    caseType: "Civil — Consumer Dispute",
    status: "Counter-affidavit Filed",
    nextHearingDate: "2026-03-25",
    opposingParty: "Skyline Builders Pvt Ltd",
    advocate: "Adv. Deepa Mohan",
    description:
      "Client booked a flat in Kochi for ₹85,00,000. Builder delayed possession by 2 years. Seeking compensation, interest, and possession. Builder's counter filed claiming force majeure.",
    pendingTasks: [
      { task: "File reply to builder's counter-affidavit", deadline: "2026-03-20", priority: "High" },
      { task: "Collect RERA registration documents", deadline: "2026-03-15", priority: "Medium" },
    ],
  },
  {
    clientName: "Amina Fathima",
    caseNumber: "RP 334/2025",
    cnrNumber: "KLKK010003342025",
    court: "Rent Control Court, Kozhikode",
    caseType: "Civil — Rent/Eviction",
    status: "Tenant's Reply Awaited",
    nextHearingDate: "2026-03-10",
    opposingParty: "Rashid Ali (Tenant)",
    advocate: "Adv. Priya Nair",
    description:
      "Eviction petition filed by landlord (client) against tenant for non-payment of rent for 8 months. Monthly rent ₹15,000. Total arrears ₹1,20,000. Tenant yet to file reply.",
    pendingTasks: [
      { task: "File application for interim rent deposit order", deadline: "2026-03-08", priority: "High" },
      { task: "Prepare evidence of rent demand notices sent to tenant", deadline: "2026-03-05", priority: "Medium" },
    ],
  },
];
