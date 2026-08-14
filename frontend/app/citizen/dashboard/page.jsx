"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/issues/StatusBadge";
import PriorityBadge from "@/components/issues/PriorityBadge";
import CategoryBadge from "@/components/issues/CategoryBadge";
import { 
  PlusCircle, 
  ListFilter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ArrowRight, 
  AlertCircle,
  FileText,
  MapPin
} from "lucide-react";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadIssues = async () => {
      try {
        const res = await api.issues.getMyIssues();
        if (isMounted) {
          if (res?.success && Array.isArray(res.issues)) {
            setIssues(res.issues);
          } else {
            setIssues([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to fetch your reported issues");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadIssues();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.issues.getMyIssues();
      if (res?.success && Array.isArray(res.issues)) {
        setIssues(res.issues);
      } else {
        setIssues([]);
      }
    } catch (err) {
      setError(err.message || "Unable to fetch your reported issues");
    } finally {
      setIsLoading(false);
    }
  };


  // Compute metrics from real issues
  const totalCount = issues.length;
  const reportedCount = issues.filter(
    (i) => i.status === "REPORTED" || i.status === "ACKNOWLEDGED"
  ).length;
  const inProgressCount = issues.filter(
    (i) => i.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = issues.filter(
    (i) => i.status === "RESOLVED" || i.status === "CLOSED"
  ).length;

  const recentIssues = issues.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="space-y-1.5">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white mb-1">
            Citizen Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || "Citizen"}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Track civic grievances, report new neighborhood issues, and follow progress directly with municipal authorities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/citizen/report">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm h-11 px-5">
              <PlusCircle className="w-4 h-4 mr-2" />
              Report New Issue
            </Button>
          </Link>
          <Link href="/citizen/issues">
            <Button
              variant="outline"
              className="bg-white/15 text-white border-white/30 hover:bg-white/25 hover:text-white backdrop-blur-xs font-semibold h-11 px-5 shadow-xs"
            >
              <ListFilter className="w-4 h-4 mr-2" />
              My Reports ({totalCount})
            </Button>
          </Link>
        </div>

      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              Total Reported
            </CardTitle>
            <FileText className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              {isLoading ? "-" : totalCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">All issues submitted by you</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500">
              Pending / Acknowledged
            </CardTitle>
            <Clock className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {isLoading ? "-" : reportedCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting municipal action</p>
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
            <p className="text-xs text-slate-500 mt-1">Currently being resolved</p>
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
            <p className="text-xs text-slate-500 mt-1">Completed civic actions</p>
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
          <Button size="sm" variant="outline" onClick={fetchIssues} className="border-red-200">
            Retry
          </Button>
        </div>
      )}

      {/* Recent Issues Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Recent Issues
            </h2>
            <p className="text-sm text-slate-500">
              Latest civic grievances submitted from your account
            </p>
          </div>

          {issues.length > 0 && (
            <Link href="/citizen/issues" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
                <PlusCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  No issues reported yet
                </h3>
                <p className="text-sm text-slate-500">
                  Notice a pothole, leaking pipe, or dark street? Report it directly to CitySeva and get it fixed.
                </p>
              </div>
              <Link href="/citizen/report">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Report Your First Issue
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Issues List */
          <div className="grid gap-3">
            {recentIssues.map((issue) => (
              <Link
                key={issue._id}
                href={`/citizen/issues/${issue._id}`}
                className="group block p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={issue.category} />
                      <StatusBadge status={issue.status} />
                      <PriorityBadge priority={issue.priority} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">
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

                  <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span className="text-xs font-medium mr-1 hidden sm:inline">Details</span>
                    <ChevronRight className="w-5 h-5" />
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
