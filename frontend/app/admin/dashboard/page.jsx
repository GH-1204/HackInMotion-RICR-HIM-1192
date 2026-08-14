"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/issues/StatusBadge";
import PriorityBadge from "@/components/issues/PriorityBadge";
import CategoryBadge from "@/components/issues/CategoryBadge";
import { 
  ShieldAlert, 
  ListFilter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ArrowRight, 
  AlertCircle,
  FileText,
  Building2,
  BarChart3,
  MapPin,
  RefreshCw,
  Zap,
  Users
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.admin.getAllIssues();
      if (res?.success && Array.isArray(res.issues)) {
        setIssues(res.issues);
      } else {
        setIssues([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load admin issues data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminIssues();
  }, []);

  // Compute operational distributions from real issues data
  const totalCount = issues.length;
  const reportedCount = issues.filter((i) => i.status === "REPORTED").length;
  const acknowledgedCount = issues.filter((i) => i.status === "ACKNOWLEDGED").length;
  const inProgressCount = issues.filter((i) => i.status === "IN_PROGRESS").length;
  const resolvedCount = issues.filter((i) => i.status === "RESOLVED" || i.status === "CLOSED").length;
  const criticalCount = issues.filter((i) => i.priority === "CRITICAL" || i.priority === "HIGH").length;

  // Category counts
  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: issues.filter((i) => i.category === cat.value).length,
  }));

  // Department counts from populated department reference
  const assignedCount = issues.filter((i) => i.department).length;
  const unassignedCount = totalCount - assignedCount;

  const recentIssues = issues.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/40 border border-indigo-400/30 text-indigo-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Operations Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            City Civic Overview
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Real-time municipal grievance stream with live MongoDB-backed issue tracking and citizen coordination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchAdminIssues}
            disabled={isLoading}
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white h-11"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Feed
          </Button>

          <Link href="/admin/issues">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 px-5">
              <ListFilter className="w-4 h-4 mr-2" />
              Manage All Issues ({totalCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              Total Grievances
            </CardTitle>
            <FileText className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              {isLoading ? "-" : totalCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              Newly Reported
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {isLoading ? "-" : reportedCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              In Progress
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-amber-500">
              {isLoading ? "-" : inProgressCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">Under field repair</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              Resolved & Closed
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {isLoading ? "-" : resolvedCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              High / Critical
            </CardTitle>
            <Zap className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-red-600">
              {isLoading ? "-" : criticalCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">High priority issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchAdminIssues} className="border-red-200">
            Retry
          </Button>
        </div>
      )}

      {/* Derived Distributions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category Breakdown (Derived from live API) */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Category Distribution</CardTitle>
              <CardDescription>Derived directly from live issue documents</CardDescription>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Live API Data
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryCounts.map((cat) => {
                const percentage = totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0;
                return (
                  <div key={cat.value} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {cat.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Future Modules / Department Overview */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Department Assignment</CardTitle>
              <CardDescription>Current workforce routing status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Assigned</span>
                <span className="text-sm font-bold text-emerald-600">{assignedCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Pending Assignment</span>
                <span className="text-sm font-bold text-amber-600">{unassignedCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming System Modules Card */}
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Future Platform Extensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Dedicated Analytics & SLAs</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Coming Soon
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Automated Status Routing</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Coming Soon
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600 dark:text-slate-400">Geospatial Hotspot Map</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Coming Soon
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Issues Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Recent Issue Inflow
            </h2>
            <p className="text-sm text-slate-500">
              Latest grievances submitted by citizens across the city
            </p>
          </div>

          {issues.length > 0 && (
            <Link href="/admin/issues" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All Issues <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800">
            <CardContent className="p-12 text-center text-slate-500">
              <p>No civic issues have been reported in the system yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {recentIssues.map((issue) => (
              <Link
                key={issue._id}
                href={`/admin/issues/${issue._id}`}
                className="group block p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={issue.category} />
                      <StatusBadge status={issue.status} />
                      <PriorityBadge priority={issue.priority} />
                      {issue.citizen?.name && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Users className="w-3 h-3 text-slate-400" />
                          {issue.citizen.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate">
                      {issue.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {issue.location?.address && (
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          {issue.location.address}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        {formatDate(issue.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <span className="text-xs font-semibold mr-1.5">Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
