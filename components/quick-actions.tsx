"use client";

import { quickActionConfigs, type QuickActionFormConfig } from "@/lib/quick-action-forms";

interface QuickActionsProps {
  onAction: (text: string) => void;
  onFormOpen: (config: QuickActionFormConfig) => void;
  isLoading: boolean;
}

export default function QuickActions({ onAction, onFormOpen, isLoading }: QuickActionsProps) {
  return (
    <div className="px-3 py-2 bg-[#f0f0f0] border-b border-gray-200">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {quickActionConfigs.map((action) => (
          <button
            key={action.label}
            onClick={() =>
              action.form ? onFormOpen(action.form) : onAction(action.prompt)
            }
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
