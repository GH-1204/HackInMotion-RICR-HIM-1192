"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
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
  Users,
  Building2,
  ArrowRight,
  History,
  Check
} from "lucide-react";

export default function AdminIssueDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [issue, setIssue] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Status update state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showResolveForm, setShowResolveForm] = useState(false);

  const fetchIssueDetail = async () => {
    try {
      const res = await api.admin.getIssueById(id);
      if (res?.success && res.issue) {
        setIssue(res.issue);
        setHistory(Array.isArray(res.history) ? res.history : []);
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
    let isMounted = true;
    if (!id) return;

    api.admin.getIssueById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && res.issue) {
          setIssue(res.issue);
          setHistory(Array.isArray(res.history) ? res.history : []);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.status === 404 || err.status === 400) {
          setNotFound(true);
        } else {
          setError(err.message || "Failed to load issue details");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle standard transitions: REPORTED -> ACKNOWLEDGED, ACKNOWLEDGED -> IN_PROGRESS, RESOLVED -> CLOSED
  const handleTransition = async (nextStatus) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await api.admin.updateStatus(id, {
        status: nextStatus,
        note: statusNote.trim() || undefined
      });

      if (res?.success && res.issue) {
        setIssue(res.issue);
        setActionSuccess(`Issue status successfully updated to ${nextStatus}`);
        setStatusNote("");
        // Refresh detail to capture latest history
        const detailRes = await api.admin.getIssueById(id);
        if (detailRes?.success) {
          setIssue(detailRes.issue);
          setHistory(detailRes.history || []);
        }
      }
    } catch (err) {
      setActionError(err.message || `Failed to update status to ${nextStatus}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle resolve transition: IN_PROGRESS -> RESOLVED
  const handleResolve = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      setActionError("Resolution notes are required to resolve an issue.");
      return;
    }

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await api.admin.resolveIssue(id, {
        notes: resolutionNotes.trim()
      });

      if (res?.success && res.issue) {
        setIssue(res.issue);
        setActionSuccess("Issue successfully marked as RESOLVED!");
        setResolutionNotes("");
        setShowResolveForm(false);
        // Refresh detail to get latest history and resolution timestamps
        const detailRes = await api.admin.getIssueById(id);
        if (detailRes?.success) {
          setIssue(detailRes.issue);
          setHistory(detailRes.history || []);
        }
      }
    } catch (err) {
      setActionError(err.message || "Failed to resolve issue");
    } finally {
      setActionLoading(false);
    }
  };

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
        
        {/* Left 2 columns: Workflow control, Description, Photo, Resolution, History */}
        <div className="md:col-span-2 space-y-6">

          {/* Action alerts */}
          {actionSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-800 dark:text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Interactive Workflow & Status Transition Card */}
          <Card className="border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Status Lifecycle Control
                </span>
                <span className="text-xs font-normal text-slate-500">
                  Current: <strong className="text-slate-800 dark:text-slate-200">{issue.status}</strong>
                </span>
              </CardTitle>
              <CardDescription>
                Progress this issue through the municipal resolution lifecycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Transitions */}
              {issue.status === "REPORTED" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Acknowledge this report to confirm receipt and begin municipal routing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Optional acknowledgment note..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      disabled={actionLoading}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <Button
                      onClick={() => handleTransition("ACKNOWLEDGED")}
                      disabled={actionLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-9 px-4 shrink-0"
                    >
                      {actionLoading ? "Updating..." : "Acknowledge Issue"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {issue.status === "ACKNOWLEDGED" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Dispatch field workers or begin repair operations on this issue.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Optional progress note (e.g. Field crew dispatched)..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      disabled={actionLoading}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <Button
                      onClick={() => handleTransition("IN_PROGRESS")}
                      disabled={actionLoading}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-9 px-4 shrink-0"
                    >
                      {actionLoading ? "Updating..." : "Start In Progress"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {issue.status === "IN_PROGRESS" && (
                <div className="space-y-3">
                  {!showResolveForm ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                      <div className="text-xs text-amber-800 dark:text-amber-300">
                        Work is currently ongoing. Click below to enter resolution details when completed.
                      </div>
                      <Button
                        onClick={() => setShowResolveForm(true)}
                        disabled={actionLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 shrink-0 ml-3"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Resolve Issue
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleResolve} className="space-y-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                          Complete Issue Resolution
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowResolveForm(false)}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Provide details on how the issue was fixed (e.g. Pothole asphalt repaired and verified)..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        disabled={actionLoading}
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <Button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9"
                      >
                        {actionLoading ? "Submitting Resolution..." : "Confirm & Mark as Resolved"}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {issue.status === "RESOLVED" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    This issue has been resolved. Close the issue to finalize the full lifecycle.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Optional closing note..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      disabled={actionLoading}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <Button
                      onClick={() => handleTransition("CLOSED")}
                      disabled={actionLoading}
                      variant="outline"
                      className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold h-9 px-4 shrink-0"
                    >
                      {actionLoading ? "Updating..." : "Finalize & Close Issue"}
                    </Button>
                  </div>
                </div>
              )}

              {issue.status === "CLOSED" && (
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>This issue is <strong>CLOSED</strong>. The full resolution lifecycle is complete.</span>
                </div>
              )}

            </CardContent>
          </Card>
          
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

          {/* Evidence Photo if present */}
          {issue.photo?.url && (
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Citizen Evidence Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.photo.url}
                    alt="Citizen submitted evidence"
                    className="w-full max-h-80 object-contain mx-auto"
                  />
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Status History Audit Trail */}
          {history.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  Lifecycle History & Audit Trail ({history.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                  {history.map((record, index) => (
                    <div key={record._id || index} className="relative space-y-1 text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {record.previousStatus} &rarr; {record.newStatus}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>
                      {record.note && (
                        <p className="text-slate-600 dark:text-slate-400 italic">
                          &ldquo;{record.note}&rdquo;
                        </p>
                      )}
                      {record.changedBy && (
                        <span className="text-[10px] text-slate-400">
                          By: {record.changedBy.name || record.changedBy.email || "Admin"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
