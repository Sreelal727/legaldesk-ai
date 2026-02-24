import type { Case } from "./mock-cases";
import type { OpinionTemplate } from "./types/firm";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "searchable";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface QuickActionFormConfig {
  formTitle: string;
  fields: FormField[];
  buildPrompt: (values: Record<string, string>) => string;
}

export interface QuickActionConfig {
  label: string;
  prompt: string;
  form: QuickActionFormConfig | null;
  isOpinionAction?: boolean;
}

const languageField: FormField = {
  name: "language",
  label: "Language / ഭാഷ",
  type: "select",
  options: ["English", "Malayalam (മലയാളം)"],
  required: true,
};

function withLang(prompt: string, lang: string): string {
  if (lang && lang.startsWith("Malayalam")) {
    return prompt + "\n\nIMPORTANT: Draft the entire document in Malayalam (മലയാളം). Use proper Malayalam legal terminology.";
  }
  return prompt;
}

export function getQuickActionConfigs(
  cases: Case[],
  opinionTemplates?: OpinionTemplate[]
): QuickActionConfig[] {
  const caseOptions = [
    "All Cases",
    ...cases.map((c) => `${c.clientName} — ${c.caseNumber}`),
  ];

  const caseOptionsNoAll = cases.map(
    (c) => `${c.clientName} — ${c.caseNumber}`
  );

  const actions: QuickActionConfig[] = [
    ...(opinionTemplates && opinionTemplates.length > 0
      ? [
          {
            label: "🏦 Legal Opinion",
            prompt: "",
            form: null,
            isOpinionAction: true,
          } as QuickActionConfig,
        ]
      : []),
    {
      label: "📋 Case Status",
      prompt: "Show me the status of all active cases",
      form: {
        formTitle: "Case Status",
        fields: [
          {
            name: "case",
            label: "Select Case",
            type: "searchable",
            options: caseOptions,
            placeholder: "Search by client name or case number...",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          v.case === "All Cases"
            ? "Show me the status of all active cases"
            : `Show me the detailed status of the case: ${v.case}`,
      },
    },
    {
      label: "📅 Hearings",
      prompt: "List all upcoming hearings sorted by date",
      form: null,
    },
    {
      label: "✅ Today's Tasks",
      prompt: "Show me today's pending tasks across all cases, sorted by priority",
      form: null,
    },
    {
      label: "🔄 IPC → BNS",
      prompt: "Convert these IPC sections to BNS: 302, 420, 376, 498A, 304A",
      form: {
        formTitle: "IPC to BNS Conversion",
        fields: [
          {
            name: "sections",
            label: "IPC Sections / Keywords",
            type: "text",
            placeholder: "e.g. 302, 420, 376, 498A",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          `Convert these IPC sections to BNS: ${v.sections}`,
      },
    },
    {
      label: "⚖️ Case Strength",
      prompt: "Analyze the strength of this case",
      form: {
        formTitle: "Case Strength Analysis",
        fields: [
          {
            name: "caseType",
            label: "Case Type",
            type: "select",
            options: [
              "Criminal",
              "Civil — Property",
              "Civil — Contract",
              "Family",
              "Consumer",
              "Motor Accident",
              "Labour",
              "Writ Petition",
            ],
            required: true,
          },
          {
            name: "charges",
            label: "Charges / Sections",
            type: "text",
            placeholder: "e.g. IPC 420, BNS 318",
            required: true,
          },
          {
            name: "facts",
            label: "Brief Facts",
            type: "textarea",
            placeholder: "Describe the key facts of the case...",
            required: true,
          },
          {
            name: "evidence",
            label: "Available Evidence",
            type: "textarea",
            placeholder: "List the evidence you have...",
          },
          {
            name: "jurisdiction",
            label: "Jurisdiction / Court",
            type: "text",
            placeholder: "e.g. Kerala High Court, Ernakulam",
          },
        ],
        buildPrompt: (v) => {
          let prompt = `Analyze the strength of this ${v.caseType} case.\n\nCharges/Sections: ${v.charges}\n\nFacts: ${v.facts}`;
          if (v.evidence) prompt += `\n\nAvailable Evidence: ${v.evidence}`;
          if (v.jurisdiction) prompt += `\n\nJurisdiction: ${v.jurisdiction}`;
          return prompt;
        },
      },
    },
    {
      label: "⏰ Limitation",
      prompt: "What is the limitation period for filing a cheque bounce case under Section 138 NI Act?",
      form: {
        formTitle: "Limitation Period",
        fields: [
          {
            name: "caseType",
            label: "Case Type",
            type: "select",
            options: [
              "Cheque Bounce (NI Act 138)",
              "Civil Suit — Property",
              "Civil Suit — Recovery of Money",
              "Civil Suit — Contract",
              "Criminal Complaint",
              "Motor Accident Claim",
              "Consumer Complaint",
              "Labour Dispute",
              "Writ Petition",
              "Appeal — Civil",
              "Appeal — Criminal",
            ],
            required: true,
          },
          {
            name: "description",
            label: "Brief Description",
            type: "textarea",
            placeholder: "Describe the situation briefly...",
          },
          {
            name: "date",
            label: "Date of Cause of Action",
            type: "date",
          },
        ],
        buildPrompt: (v) => {
          let prompt = `What is the limitation period for filing a ${v.caseType} case?`;
          if (v.description) prompt += ` ${v.description}`;
          if (v.date) prompt += ` The cause of action arose on ${v.date}.`;
          return prompt;
        },
      },
    },
    {
      label: "💰 Court Fee",
      prompt: "Calculate court fee for a property suit in Kerala District Court",
      form: {
        formTitle: "Court Fee Calculator",
        fields: [
          {
            name: "courtType",
            label: "Court",
            type: "select",
            options: [
              "District Court",
              "Kerala High Court",
              "Munsiff Court",
              "Family Court",
              "Consumer Forum — District",
              "Consumer Forum — State",
              "Rent Control Court",
            ],
            required: true,
          },
          {
            name: "suitType",
            label: "Type of Suit / Petition",
            type: "text",
            placeholder: "e.g. Property suit, Recovery suit",
            required: true,
          },
          {
            name: "suitValue",
            label: "Suit Value (₹)",
            type: "number",
            placeholder: "e.g. 2500000",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          `Calculate court fee for a ${v.suitType} valued at ₹${Number(v.suitValue).toLocaleString("en-IN")} in Kerala ${v.courtType}`,
      },
    },
    {
      label: "🏠 Stamp Duty",
      prompt: "Calculate stamp duty and registration fee for a property sale deed in Kerala",
      form: {
        formTitle: "Stamp Duty Calculator",
        fields: [
          {
            name: "documentType",
            label: "Document Type",
            type: "select",
            options: [
              "Sale Deed",
              "Gift Deed",
              "Mortgage Deed",
              "Lease Deed",
              "Partition Deed",
              "Release Deed",
              "Settlement Deed",
              "Exchange Deed",
              "Power of Attorney — General",
              "Power of Attorney — Special",
              "Agreement of Sale",
              "Rental Agreement",
              "Will",
            ],
            required: true,
          },
          {
            name: "propertyValue",
            label: "Property / Transaction Value (₹)",
            type: "number",
            placeholder: "e.g. 5000000",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          `Calculate stamp duty and registration fee for a ${v.documentType} in Kerala for ₹${Number(v.propertyValue).toLocaleString("en-IN")}`,
      },
    },
    {
      label: "📝 Legal Notice",
      prompt: "Draft a legal notice",
      form: {
        formTitle: "Draft Legal Notice",
        fields: [
          languageField,
          {
            name: "noticeType",
            label: "Notice Type",
            type: "select",
            options: [
              "Non-payment of Rent",
              "Non-payment of Dues",
              "Cheque Bounce",
              "Property Dispute",
              "Breach of Contract",
              "Defamation",
              "Employment / Termination",
            ],
            required: true,
          },
          {
            name: "recipientName",
            label: "Recipient Name",
            type: "text",
            placeholder: "Name of the person/entity to be notified",
            required: true,
          },
          {
            name: "reason",
            label: "Reason / Facts",
            type: "textarea",
            placeholder: "Describe the reason for the notice...",
            required: true,
          },
          {
            name: "amount",
            label: "Amount Claimed (₹)",
            type: "number",
            placeholder: "e.g. 500000 (if applicable)",
          },
        ],
        buildPrompt: (v) => {
          let prompt = `Draft a legal notice for ${v.noticeType} to ${v.recipientName}. Reason: ${v.reason}`;
          if (v.amount)
            prompt += `. Amount claimed: ₹${Number(v.amount).toLocaleString("en-IN")}`;
          return withLang(prompt, v.language);
        },
      },
    },
    {
      label: "📄 Vakalatnama",
      prompt: "Draft a Vakalatnama for a new client",
      form: {
        formTitle: "Draft Vakalatnama",
        fields: [
          languageField,
          {
            name: "case",
            label: "Select Existing Case (optional)",
            type: "searchable",
            options: ["— New Client —", ...caseOptionsNoAll],
            placeholder: "Search case or select New Client...",
          },
          {
            name: "clientName",
            label: "Client Name",
            type: "text",
            placeholder: "Name of the client (if new)",
          },
          {
            name: "court",
            label: "Court",
            type: "text",
            placeholder: "e.g. Kerala High Court, Ernakulam",
          },
        ],
        buildPrompt: (v) => {
          if (v.case && v.case !== "— New Client —") {
            return withLang(`Draft a Vakalatnama for the case: ${v.case}`, v.language);
          }
          let prompt = "Draft a Vakalatnama";
          if (v.clientName) prompt += ` for client ${v.clientName}`;
          if (v.court) prompt += ` in ${v.court}`;
          return withLang(prompt, v.language);
        },
      },
    },
    {
      label: "⚖️ Bail Application",
      prompt: "Draft a bail application",
      form: {
        formTitle: "Draft Bail Application",
        fields: [
          languageField,
          {
            name: "accusedName",
            label: "Accused Name",
            type: "text",
            placeholder: "Name of the accused",
            required: true,
          },
          {
            name: "crimeNumber",
            label: "Crime Number",
            type: "text",
            placeholder: "e.g. Crime No. 123/2026",
            required: true,
          },
          {
            name: "sections",
            label: "Sections Charged",
            type: "text",
            placeholder: "e.g. IPC 302, 120B",
            required: true,
          },
          {
            name: "court",
            label: "Court",
            type: "text",
            placeholder: "e.g. Sessions Court, Ernakulam",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          withLang(`Draft a bail application for ${v.accusedName}, Crime No. ${v.crimeNumber}, charged under sections ${v.sections}, to be filed in ${v.court}`, v.language),
      },
    },
    {
      label: "🏠 Rent Agreement",
      prompt: "Draft a rental agreement for a residential property in Kochi",
      form: {
        formTitle: "Draft Rent Agreement",
        fields: [
          languageField,
          {
            name: "landlord",
            label: "Landlord Name",
            type: "text",
            placeholder: "Name of the landlord",
            required: true,
          },
          {
            name: "tenant",
            label: "Tenant Name",
            type: "text",
            placeholder: "Name of the tenant",
            required: true,
          },
          {
            name: "address",
            label: "Property Address",
            type: "textarea",
            placeholder: "Full address of the property",
            required: true,
          },
          {
            name: "rent",
            label: "Monthly Rent (₹)",
            type: "number",
            placeholder: "e.g. 15000",
            required: true,
          },
          {
            name: "duration",
            label: "Duration (months)",
            type: "number",
            placeholder: "e.g. 11",
            required: true,
          },
          {
            name: "city",
            label: "City",
            type: "text",
            placeholder: "e.g. Kochi",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          withLang(`Draft a rental agreement for a residential property.\n\nLandlord: ${v.landlord}\nTenant: ${v.tenant}\nProperty Address: ${v.address}\nMonthly Rent: ₹${Number(v.rent).toLocaleString("en-IN")}\nDuration: ${v.duration} months\nCity: ${v.city}`, v.language),
      },
    },
    {
      label: "👤 New Client",
      prompt: "Generate a client intake questionnaire",
      form: {
        formTitle: "New Client Intake",
        fields: [
          languageField,
          {
            name: "caseType",
            label: "Case Type",
            type: "select",
            options: [
              "Property Dispute",
              "Criminal Defence",
              "Family / Divorce",
              "Consumer Complaint",
              "Motor Accident",
              "Labour / Employment",
            ],
            required: true,
          },
        ],
        buildPrompt: (v) =>
          withLang(`Generate a client intake questionnaire for a new ${v.caseType} case`, v.language),
      },
    },
    {
      label: "📨 Follow-up",
      prompt: "Draft a follow-up letter to client",
      form: {
        formTitle: "Draft Follow-up",
        fields: [
          languageField,
          {
            name: "case",
            label: "Select Case",
            type: "searchable",
            options: caseOptionsNoAll,
            placeholder: "Search by client name or case number...",
            required: true,
          },
          {
            name: "purpose",
            label: "Purpose / Instructions",
            type: "textarea",
            placeholder: "What should the follow-up be about?",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          withLang(`Draft a follow-up letter to the client in case ${v.case}. Purpose: ${v.purpose}`, v.language),
      },
    },
    {
      label: "🧾 Fee Receipt",
      prompt: "Generate a fee receipt",
      form: {
        formTitle: "Generate Fee Receipt",
        fields: [
          languageField,
          {
            name: "case",
            label: "Select Case",
            type: "searchable",
            options: caseOptionsNoAll,
            placeholder: "Search by client name or case number...",
            required: true,
          },
          {
            name: "amount",
            label: "Amount (₹)",
            type: "number",
            placeholder: "e.g. 25000",
            required: true,
          },
          {
            name: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: [
              "Bank Transfer",
              "UPI",
              "Cash",
              "Cheque",
              "Demand Draft",
            ],
            required: true,
          },
          {
            name: "serviceDescription",
            label: "Service Description",
            type: "text",
            placeholder: "e.g. Consultation fee, Filing charges",
          },
        ],
        buildPrompt: (v) => {
          let prompt = `Generate a fee receipt for ₹${Number(v.amount).toLocaleString("en-IN")} received for case ${v.case}, paid via ${v.paymentMode}`;
          if (v.serviceDescription)
            prompt += `. Service: ${v.serviceDescription}`;
          return withLang(prompt, v.language);
        },
      },
    },
    {
      label: "📅 Court Holiday",
      prompt: "Is court working on March 14, 2026? Also show me the next 5 court holidays.",
      form: {
        formTitle: "Court Holiday Check",
        fields: [
          {
            name: "date",
            label: "Date to Check",
            type: "date",
            required: true,
          },
        ],
        buildPrompt: (v) =>
          `Is court working on ${v.date}? Also show me the next 5 court holidays from that date.`,
      },
    },
    {
      label: "🇮🇳 Malayalam",
      prompt: "എന്റെ എല്ലാ കേസുകളുടെയും സ്ഥിതി എന്താണ്?",
      form: {
        formTitle: "Malayalam Query",
        fields: [
          {
            name: "query",
            label: "നിങ്ങളുടെ ചോദ്യം / Your Question",
            type: "textarea",
            placeholder: "മലയാളത്തിൽ ചോദ്യം ടൈപ്പ് ചെയ്യുക...",
            required: true,
          },
        ],
        buildPrompt: (v) => v.query,
      },
    },
  ];

  return actions;
}
