import React from "react";
import { PRIORITY_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function PriorityBadge({ priority, className }) {
  const config = PRIORITY_MAP[priority] || {
    label: priority || "Medium",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  );
}
