"use client";

import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("inline-flex gap-1 rounded-lg bg-white dark:bg-[#1a2035] p-1 border border-border shadow-sm", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer min-h-[36px]",
            value === tab.value
              ? "[background:linear-gradient(135deg,#001c64,#003087)] text-white font-semibold shadow-md"
              : "text-[#1e3251] dark:text-[#94a3b8] hover:text-[#001c64] dark:hover:text-white hover:bg-[#f3f3f6] dark:hover:bg-[#449afb10]"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                value === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-[#e2e2e2] dark:bg-[#1e293b] text-[#555] dark:text-[#94a3b8]"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
