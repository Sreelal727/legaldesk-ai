"use client";

interface QuickActionsProps {
  onAction: (text: string) => void;
  isLoading: boolean;
}

const actions = [
  {
    label: "📋 Case Status",
    prompt: "Show me the status of all active cases",
  },
  {
    label: "📅 Hearings",
    prompt: "List all upcoming hearings sorted by date",
  },
  {
    label: "✅ Today's Tasks",
    prompt: "Show me today's pending tasks across all cases, sorted by priority",
  },
  {
    label: "🔄 IPC → BNS",
    prompt: "Convert these IPC sections to BNS: 302, 420, 376, 498A, 304A",
  },
  {
    label: "⚖️ Case Strength",
    prompt:
      "Analyze the strength of this case: My client was charged under IPC 420 for allegedly cheating a buyer in a property sale in Ernakulam. The sale deed was executed but the property had a prior encumbrance which was not disclosed. The buyer paid ₹45 lakhs. My client claims he was unaware of the encumbrance as it was created by his late father. We have the original sale deed, tax receipts, and two witnesses who can testify the client had no knowledge.",
  },
  {
    label: "⏰ Limitation",
    prompt: "What is the limitation period for filing a cheque bounce case under Section 138 NI Act? The cheque was returned on 15 January 2026.",
  },
  {
    label: "💰 Court Fee",
    prompt: "Calculate court fee for a property suit valued at ₹25,00,000 in Kerala District Court",
  },
  {
    label: "🏠 Stamp Duty",
    prompt: "Calculate stamp duty and registration fee for a property sale deed in Kerala for ₹50,00,000",
  },
  {
    label: "📝 Legal Notice",
    prompt: "Draft a legal notice for non-payment of rent by a tenant",
  },
  {
    label: "📄 Vakalatnama",
    prompt: "Draft a Vakalatnama for a new client",
  },
  {
    label: "⚖️ Bail Application",
    prompt: "Draft a bail application",
  },
  {
    label: "🏠 Rent Agreement",
    prompt: "Draft a rental agreement for a residential property in Kochi",
  },
  {
    label: "👤 New Client",
    prompt: "Generate a client intake questionnaire for a new property dispute case",
  },
  {
    label: "📨 Follow-up",
    prompt: "Draft a follow-up letter to client Rajesh Kumar asking him to submit the pending revenue records for his property case",
  },
  {
    label: "🧾 Fee Receipt",
    prompt: "Generate a fee receipt for ₹25,000 consultation fee received from Vineeth Menon for case OP 112/2026, paid via bank transfer",
  },
  {
    label: "📅 Court Holiday",
    prompt: "Is court working on March 14, 2026? Also show me the next 5 court holidays.",
  },
  {
    label: "🇮🇳 Malayalam",
    prompt: "എന്റെ എല്ലാ കേസുകളുടെയും സ്ഥിതി എന്താണ്?",
  },
];

export default function QuickActions({ onAction, isLoading }: QuickActionsProps) {
  return (
    <div className="px-3 py-2 bg-[#f0f0f0] border-b border-gray-200">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-[#075e54] border border-[#075e54]/20 hover:bg-[#075e54] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
