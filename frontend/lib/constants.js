/**
 * CitySeva Constants & Enums matching backend definitions
 */

export const CATEGORIES = [
  { value: "ROADS", label: "Roads & Potholes", icon: "Car", color: "amber" },
  { value: "SANITATION", label: "Sanitation & Garbage", icon: "Trash2", color: "emerald" },
  { value: "ELECTRICITY", label: "Streetlight & Power", icon: "Zap", color: "yellow" },
  { value: "WATER", label: "Water Supply & Leakage", icon: "Droplets", color: "blue" },
  { value: "DRAINAGE", label: "Drainage & Sewage", icon: "Waves", color: "cyan" },
  { value: "PUBLIC_PROPERTY", label: "Public Property Damage", icon: "Building2", color: "purple" },
  { value: "OTHER", label: "Other Civic Issues", icon: "HelpCircle", color: "slate" },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.value] = cat;
  return acc;
}, {});

export const STATUSES = [
  { value: "REPORTED", label: "Reported", variant: "default", bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  { value: "ACKNOWLEDGED", label: "Acknowledged", variant: "secondary", bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  { value: "IN_PROGRESS", label: "In Progress", variant: "warning", bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  { value: "RESOLVED", label: "Resolved", variant: "success", bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  { value: "CLOSED", label: "Closed", variant: "outline", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
];

export const STATUS_MAP = STATUSES.reduce((acc, st) => {
  acc[st.value] = st;
  return acc;
}, {});

export const PRIORITIES = [
  { value: "LOW", label: "Low", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
  { value: "MEDIUM", label: "Medium", bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  { value: "HIGH", label: "High", bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  { value: "CRITICAL", label: "Critical", bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
];

export const PRIORITY_MAP = PRIORITIES.reduce((acc, prio) => {
  acc[prio.value] = prio;
  return acc;
}, {});
