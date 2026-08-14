"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/issues/StatusBadge";
import PriorityBadge from "@/components/issues/PriorityBadge";
import CategoryBadge from "@/components/issues/CategoryBadge";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Info,
  History,
  Building2
} from "lucide-react";

export default function CitizenIssueDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [issue, setIssue] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchIssueDetail = async () => {
    try {
      const res = await api.issues.getById(id);
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

    api.issues.getById(id)
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

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
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
          The requested issue either does not exist or does not belong to your citizen account.
        </p>
        <div className="pt-2">
          <Link href="/citizen/issues">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to My Issues
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
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Back link */}
      <div>
        <Link
          href="/citizen/issues"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to My Issues
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
              <span>Reported: <strong>{formatDate(issue.createdAt)}</strong></span>
            </div>
            {issue.updatedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Last Updated: <strong>{formatDate(issue.updatedAt)}</strong></span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Description, Photo, Resolution, History (Left 2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Description */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Detailed Description
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
                  Uploaded Evidence Photo
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

          {/* Resolution Details if present */}
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

          {/* Status History Timeline */}
          {history.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  Status Updates & History ({history.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                  {history.map((record, index) => (
                    <div key={record._id || index} className="relative space-y-1 text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status lifecycle info */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <Info className="w-4 h-4" /> Current Status: {issue.status}
            </div>
            <p className="text-blue-700 dark:text-blue-300">
              Municipal authorities process reports through defined lifecycle stages. Real-time updates and resolution notes are shown above.
            </p>
          </div>
        </div>

        {/* Location & Metadata (Right 1 col) */}
        <div className="space-y-6">
          
          {/* Assigned Department */}
          {issue.department && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Assigned Department
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {issue.department.name}
                </p>
                <p className="text-slate-500 font-mono">Code: {issue.department.code}</p>
              </CardContent>
            </Card>
          )}

          {/* Location */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Location
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
                <p className="text-xs text-slate-400">No street address specified</p>
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
