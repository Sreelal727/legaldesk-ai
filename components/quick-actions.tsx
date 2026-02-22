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
    label: "📅 Upcoming Hearings",
    prompt: "List all upcoming hearings sorted by date",
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
    label: "📝 Draft Legal Notice",
    prompt: "Draft a legal notice for non-payment of rent by a tenant",
  },
  {
    label: "📄 Draft Vakalatnama",
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
