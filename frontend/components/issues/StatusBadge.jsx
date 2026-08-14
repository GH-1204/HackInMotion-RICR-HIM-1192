import React from "react";
import { STATUS_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status, className }) {
  const config = STATUS_MAP[status] || {
    label: status || "Unknown",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {config.label}
    </span>
  );
}
