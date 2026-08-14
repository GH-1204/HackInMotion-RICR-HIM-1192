"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/issues/StatusBadge";
import PriorityBadge from "@/components/issues/PriorityBadge";
import CategoryBadge from "@/components/issues/CategoryBadge";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  FileQuestion,
  RefreshCw
} from "lucide-react";

export default function CitizenMyIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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
      setError(err.message || "Failed to load your issues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filtered issues list
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Status filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "ACTIVE") {
          if (issue.status === "RESOLVED" || issue.status === "CLOSED") return false;
        } else if (statusFilter === "RESOLVED") {
          if (issue.status !== "RESOLVED" && issue.status !== "CLOSED") return false;
        } else if (issue.status !== statusFilter) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== "ALL" && issue.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = issue.title?.toLowerCase().includes(query);
        const matchDesc = issue.description?.toLowerCase().includes(query);
        const matchAddress = issue.location?.address?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchAddress) return false;
      }

      return true;
    });
  }, [issues, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            My Reported Issues
          </h1>
          <p className="text-sm text-slate-500">
            Track and monitor resolution progress for all problems you have submitted
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchIssues}
            disabled={isLoading}
            className="h-10"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Link href="/citizen/report">
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs">
              <PlusCircle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by title, description or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="w-full md:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            { label: "All", value: "ALL" },
            { label: "Reported", value: "REPORTED" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Resolved", value: "RESOLVED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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

      {/* Issues List */}
      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {issues.length === 0 ? "You haven't reported any issues yet" : "No issues match your filter criteria"}
              </h3>
              <p className="text-xs text-slate-500">
                {issues.length === 0 
                  ? "Report a problem in your neighborhood to initiate municipal action."
                  : "Try clearing your filters or search keywords to view other reports."}
              </p>
            </div>
            {issues.length === 0 ? (
              <Link href="/citizen/report">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm">
                  Report an Issue
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredIssues.map((issue) => (
            <Link
              key={issue._id}
              href={`/citizen/issues/${issue._id}`}
              className="group block p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={issue.category} />
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    {issue.location?.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {issue.location.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Reported: {formatDate(issue.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 transition-colors pt-2 sm:pt-0">
                  <span className="text-xs font-semibold mr-1.5">View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
