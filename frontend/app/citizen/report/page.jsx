"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  ArrowLeft, 
  Info 
} from "lucide-react";

export default function CitizenReportPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "ROADS",
    latitude: "19.0760",
    longitude: "72.8777",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newIssueId, setNewIssueId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}. Please enter coordinates manually.`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validations matching backend constraints
    if (formData.title.trim().length < 5) {
      setError("Title must be at least 5 characters long.");
      return;
    }
    if (formData.title.trim().length > 150) {
      setError("Title cannot exceed 150 characters.");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }
    if (formData.description.trim().length > 2000) {
      setError("Description cannot exceed 2000 characters.");
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError("Latitude must be a valid number between -90 and 90.");
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError("Longitude must be a valid number between -180 and 180.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      location: {
        latitude: lat,
        longitude: lng,
        address: formData.address.trim() || undefined,
      },
    };

    setIsLoading(true);

    try {
      const res = await api.issues.create(payload);
      if (res?.success && res.issue?._id) {
        setSuccess(true);
        setNewIssueId(res.issue._id);
        setTimeout(() => {
          router.push(`/citizen/issues/${res.issue._id}`);
        }, 1500);
      } else {
        throw new Error(res?.message || "Failed to create issue");
      }
    } catch (err) {
      setError(err.message || "Failed to submit issue report");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Back button & Page title */}
      <div className="flex items-center gap-3">
        <Link href="/citizen/dashboard" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Report a Civic Issue
          </h1>
          <p className="text-sm text-slate-500">
            Submit a problem in your neighborhood for municipal resolution
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <div>
            <h4 className="font-semibold">Issue Reported Successfully!</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your grievance has been logged with status <strong>REPORTED</strong>. Redirecting to issue details...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-start gap-3 text-red-800 dark:text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
          <div>
            <h4 className="font-semibold">Submission Failed</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Issue Information
          </CardTitle>
          <CardDescription>
            Provide accurate details so city administrators can process and assign your report.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Deep pothole causing traffic jam on MG Road"
                value={formData.title}
                onChange={handleInputChange}
                className="h-11"
                disabled={isLoading || success}
                minLength={5}
                maxLength={150}
              />
              <p className="text-xs text-slate-500">
                Between 5 and 150 characters. Be concise and descriptive.
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Civic Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoading || success}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                placeholder="Provide specific details about the issue, nearby landmarks, hazards, or urgency..."
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading || success}
                minLength={10}
                maxLength={2000}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
              <p className="text-xs text-slate-500">
                Minimum 10 characters ({formData.description.length}/2000)
              </p>
            </div>

            {/* Location Section */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Location Coordinates & Address
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetLocation}
                  disabled={geoLoading || isLoading || success}
                  className="h-8 text-xs font-medium border-blue-200 text-blue-700 dark:text-blue-400 hover:bg-blue-50"
                >
                  <Compass className={`w-3.5 h-3.5 mr-1.5 ${geoLoading ? "animate-spin" : ""}`} />
                  {geoLoading ? "Locating..." : "Use Current GPS"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="latitude" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Latitude (-90 to 90) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={handleInputChange}
                    disabled={isLoading || success}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="longitude" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Longitude (-180 to 180) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={handleInputChange}
                    disabled={isLoading || success}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Street Address / Landmark (Optional)
                </label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="e.g. Near Community Center, Sector 4"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading || success}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            {/* Note regarding photo upload */}
            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>Note:</strong> Photo attachment and map pin dragging are planned for a future update. All reports currently initialize with status <strong>REPORTED</strong> and priority <strong>MEDIUM</strong>.
              </span>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/citizen/dashboard">
                <Button variant="outline" type="button" disabled={isLoading || success}>
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isLoading || success}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium min-w-[140px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
