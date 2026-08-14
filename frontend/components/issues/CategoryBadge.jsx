import React from "react";
import { CATEGORY_MAP } from "@/lib/constants";
import { 
  Car, 
  Trash2, 
  Zap, 
  Droplets, 
  Waves, 
  Building2, 
  HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  ROADS: Car,
  SANITATION: Trash2,
  ELECTRICITY: Zap,
  WATER: Droplets,
  DRAINAGE: Waves,
  PUBLIC_PROPERTY: Building2,
  OTHER: HelpCircle,
};

export default function CategoryBadge({ category, showIcon = true, className }) {
  const config = CATEGORY_MAP[category] || {
    label: category || "Other",
  };
  const IconComponent = ICONS[category] || HelpCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 opacity-70" />}
      <span>{config.label}</span>
    </span>
  );
}
