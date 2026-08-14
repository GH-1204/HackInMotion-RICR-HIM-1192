"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  LayoutDashboard, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Zap, 
  Droplets, 
  Car,
  Trash2
} from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated, role } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      
      {/* Hero Section */}
      <div className="max-w-4xl space-y-6 py-16 sm:py-24">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Smart City Issue Reporting & Resolution
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1]">
          Aapki Shikayat, Shehar ka Samadhan with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            CitySeva
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Empowering citizens and municipal authorities to collaborate for a cleaner, safer, and smarter city. Report problems, track resolutions, and help administrators manage issues efficiently.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          {!isAuthenticated ? (
            <>
              <Link href="/citizen/report">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base h-12 px-8 font-semibold shadow-md">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Report an Issue
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-base h-12 px-8 font-medium">
                  Sign In
                </Button>
              </Link>
            </>
          ) : role === "ADMIN" ? (
            <>
              <Link href="/admin/dashboard">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-base h-12 px-8 font-semibold shadow-md">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Go to Admin Dashboard
                </Button>
              </Link>
              <Link href="/admin/issues">
                <Button size="lg" variant="outline" className="text-base h-12 px-8 font-medium">
                  Manage All Issues
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/citizen/report">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base h-12 px-8 font-semibold shadow-md">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Report New Issue
                </Button>
              </Link>
              <Link href="/citizen/dashboard">
                <Button size="lg" variant="outline" className="text-base h-12 px-8 font-medium">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  My Dashboard
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full py-8 text-left">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 mb-4">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-50">
            Report Problems
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Citizens can easily report civic issues like potholes, broken streetlights, water leakages, or waste management hazards.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-50">
            Track Resolution
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Stay updated in real-time on the status of your reported grievances from REPORTED to IN_PROGRESS and RESOLVED.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-50">
            Manage Efficiently
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            City administrators get a powerful command center to oversee civic issues, inspect locations, and coordinate resolution.
          </p>
        </div>
      </div>

      {/* Category Ticker Showcase */}
      <div className="max-w-5xl w-full py-8 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Supported Civic Categories
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { name: "Roads & Potholes", icon: Car },
            { name: "Sanitation & Waste", icon: Trash2 },
            { name: "Electricity & Lights", icon: Zap },
            { name: "Water Supply", icon: Droplets },
            { name: "Drainage & Sewage", icon: Building2 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <item.icon className="w-3.5 h-3.5 text-blue-600 opacity-80" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
