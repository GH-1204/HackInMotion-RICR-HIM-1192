"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/issues/StatusBadge";
import PriorityBadge from "@/components/issues/PriorityBadge";
import CategoryBadge from "@/components/issues/CategoryBadge";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Info,
  Users,
  Building2,
  Lock
} from "lucide-react";

export default function AdminIssueDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchIssueDetail = async () => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const res = await api.admin.getIssueById(id);
      if (res?.success && res.issue) {
        setIssue(res.issue);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      if (err.status === 404 || err.status === 400) {
        setNotFound(true);
      } else {
        setError(err.message || "Failed to load issue details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssueDetail();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4 pt-16">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Issue Not Found
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The requested issue ID does not exist in the CitySeva database or the ID format is invalid.
        </p>
        <div className="pt-2">
          <Link href="/admin/issues">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Issue Management
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4 pt-16">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center mx-auto text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Error Loading Issue
        </h1>
        <p className="text-sm text-red-600">{error}</p>
        <div className="pt-2">
          <Button onClick={fetchIssueDetail} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          href="/admin/issues"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to All Issues
        </Link>
      </div>

      {/* Main Issue Header Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
            <span className="text-xs font-mono text-slate-400 ml-auto">
              ID: {issue._id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Created: <strong>{formatDate(issue.createdAt)}</strong></span>
            </div>
            {issue.updatedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Updated: <strong>{formatDate(issue.updatedAt)}</strong></span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: 2 columns left, 1 column right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 columns: Description & Status Notice */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Description */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Citizen Grievance Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {issue.description}
              </p>
            </CardContent>
          </Card>

          {/* Resolution info if present */}
          {issue.resolution && (issue.resolution.notes || issue.resolution.resolvedAt) && (
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Resolution Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {issue.resolution.resolvedAt && (
                  <div className="text-xs text-emerald-700 dark:text-emerald-300">
                    Resolved on: <strong>{formatDate(issue.resolution.resolvedAt)}</strong>
                  </div>
                )}
                {issue.resolution.notes && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                    {issue.resolution.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Management Notice (Strictly complying with instruction not to build status update form) */}
          <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Lock className="w-4 h-4 text-slate-400" />
                Status Transition & Workflow Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-500">
              <p>
                Current Status: <strong className="text-slate-800 dark:text-slate-200">{issue.status}</strong> (Read-only)
              </p>
              <div className="p-3 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                Status transitions, workflow history, and automatic department dispatch APIs are scheduled in the next platform release.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 column: Citizen, Department, Location */}
        <div className="space-y-6">
          
          {/* Citizen Details */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Citizen Reporter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {issue.citizen ? (
                <>
                  <div>
                    <span className="text-slate-400 font-medium">Name:</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {issue.citizen.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Email:</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {issue.citizen.email || "N/A"}
                    </p>
                  </div>
                  <div className="pt-1 text-[11px] font-mono text-slate-400">
                    ID: {issue.citizen._id}
                  </div>
                </>
              ) : (
                <p className="text-slate-400">Citizen reference not found</p>
              )}
            </CardContent>
          </Card>

          {/* Department Assignment */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Assigned Department
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {issue.department ? (
                <>
                  <div>
                    <span className="text-slate-400 font-medium">Department Name:</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {issue.department.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-slate-400 font-medium">Code:</span>
                      <p className="font-mono text-slate-700 dark:text-slate-300">{issue.department.code}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Category:</span>
                      <p className="text-slate-700 dark:text-slate-300">{issue.department.category}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 italic">No department assigned yet</p>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Location Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {issue.location?.address ? (
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Address
                  </span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {issue.location.address}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No street address provided</p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Coordinates
                </span>
                <div className="flex items-center justify-between text-xs font-mono bg-slate-50 dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                  <span>Lat: {issue.location?.latitude ?? "N/A"}</span>
                  <span>Lng: {issue.location?.longitude ?? "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
