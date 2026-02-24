"use client";

import { getQuickActionConfigs, type QuickActionFormConfig } from "@/lib/quick-action-forms";
import type { Case } from "@/lib/mock-cases";
import type { OpinionTemplate } from "@/lib/types/firm";

interface QuickActionsProps {
  onAction: (text: string) => void;
  onFormOpen: (config: QuickActionFormConfig) => void;
  onOpinionOpen: () => void;
  isLoading: boolean;
  cases: Case[];
  opinionTemplates: OpinionTemplate[];
}

export default function QuickActions({
  onAction,
  onFormOpen,
  onOpinionOpen,
  isLoading,
  cases,
  opinionTemplates,
}: QuickActionsProps) {
  const configs = getQuickActionConfigs(cases, opinionTemplates);

  const handleClick = (action: (typeof configs)[number]) => {
    if (action.isOpinionAction) {
      onOpinionOpen();
    } else if (action.form) {
      onFormOpen(action.form);
    } else {
      onAction(action.prompt);
    }
  };

  return (
    <div className="px-3 py-2 bg-[#f0f0f0] border-b border-gray-200">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {configs.map((action) => (
          <button
            key={action.label}
            onClick={() => handleClick(action)}
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
