"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { CATEGORIES, STATUSES, PRIORITIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/issues/StatusBadge";
import PriorityBadge from "@/components/issues/PriorityBadge";
import CategoryBadge from "@/components/issues/CategoryBadge";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  FileQuestion, 
  RefreshCw,
  Users,
  Building2,
  SlidersHorizontal
} from "lucide-react";

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchIssues = async () => {
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
      setError(err.message || "Failed to load admin issues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Status filter
      if (statusFilter !== "ALL" && issue.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "ALL" && issue.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "ALL" && issue.priority !== priorityFilter) {
        return false;
      }

      // Search query across title, description, address, citizen name, citizen email
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = issue.title?.toLowerCase().includes(q);
        const matchDesc = issue.description?.toLowerCase().includes(q);
        const matchAddr = issue.location?.address?.toLowerCase().includes(q);
        const matchCitizen = issue.citizen?.name?.toLowerCase().includes(q) || issue.citizen?.email?.toLowerCase().includes(q);
        const matchDept = issue.department?.name?.toLowerCase().includes(q) || issue.department?.code?.toLowerCase().includes(q);

        if (!matchTitle && !matchDesc && !matchAddr && !matchCitizen && !matchDept) {
          return false;
        }
      }

      return true;
    });
  }, [issues, statusFilter, categoryFilter, priorityFilter, searchQuery]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Issue Management
          </h1>
          <p className="text-sm text-slate-500">
            Comprehensive registry of all civic grievances reported across the municipality
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
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search title, citizen, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Count summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong>{filteredIssues.length}</strong> of <strong>{issues.length}</strong> total issues
          </span>
          {(statusFilter !== "ALL" || categoryFilter !== "ALL" || priorityFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
                setPriorityFilter("ALL");
                setSearchQuery("");
              }}
              className="text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Clear all filters
            </button>
          )}
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                No matching issues found
              </h3>
              <p className="text-xs text-slate-500">
                Adjust search keywords or filter criteria to see results.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredIssues.map((issue) => (
            <Link
              key={issue._id}
              href={`/admin/issues/${issue._id}`}
              className="group block p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left info block */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={issue.category} />
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-xs font-mono text-slate-400">
                      #{issue._id.slice(-6)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 pt-1">
                    {issue.citizen?.name && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Citizen: <strong>{issue.citizen.name}</strong> ({issue.citizen.email})
                      </span>
                    )}
                    {issue.department?.name && (
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <Building2 className="w-3.5 h-3.5" />
                        Dept: <strong>{issue.department.name}</strong>
                      </span>
                    )}
                    {issue.location?.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {issue.location.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(issue.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right action button */}
                <div className="flex items-center justify-end text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                  <span className="text-xs font-semibold mr-1.5">Review Issue</span>
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
