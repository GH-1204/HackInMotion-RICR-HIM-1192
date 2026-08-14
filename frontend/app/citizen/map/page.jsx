"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenMapPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/citizen/dashboard" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Interactive City Map
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Interactive map exploration of neighborhood issues is planned for an upcoming release.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Map Feature Under Development
        </h3>
        <p className="text-xs text-slate-500 max-w-md">
          You can track all your reported issues directly via the My Issues dashboard.
        </p>
        <Link href="/citizen/issues" className="pt-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            View My Issues
          </Button>
        </Link>
      </div>
    </div>
  );
}
