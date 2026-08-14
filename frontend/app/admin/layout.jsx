"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles="ADMIN">
      <div className="flex-1 bg-slate-50/50 dark:bg-slate-950">
        {children}
      </div>
    </ProtectedRoute>
  );
}
