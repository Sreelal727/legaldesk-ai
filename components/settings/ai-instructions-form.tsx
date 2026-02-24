"use client";

interface AIInstructionsFormProps {
  instructions: string;
  onChange: (instructions: string) => void;
}

export default function AIInstructionsForm({ instructions, onChange }: AIInstructionsFormProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Add custom instructions for the AI assistant. These will be included in every conversation.
      </p>
      <textarea
        value={instructions}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder={`Examples:\n- Always cite Kerala HC precedents first\n- Draft all notices in formal English\n- When calculating fees, always mention GST\n- Prefer mediation-oriented advice for family disputes`}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54]/30 focus:border-[#075e54] resize-none"
      />
      <p className="text-xs text-gray-400 text-right">
        {instructions.length} characters
      </p>
    </div>
  );
}
