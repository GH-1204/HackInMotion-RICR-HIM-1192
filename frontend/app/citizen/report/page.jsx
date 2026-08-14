"use client";

import { useState, useEffect } from "react";
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
  Info,
  Camera,
  Trash2
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Clean up object URL when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image MIME type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size cannot exceed 10MB.");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create object URL for preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary upload configuration missing. Please verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formDataUpload,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMsg =
        errorData?.error?.message ||
        `Cloudinary upload failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error("Invalid response received from image upload service.");
    }

    return {
      url: data.secure_url,
      publicId: data.public_id || undefined,
    };
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

    setIsLoading(true);

    // Upload photo to Cloudinary if selected
    let uploadedPhoto = undefined;
    if (selectedFile) {
      setUploadingPhoto(true);
      try {
        uploadedPhoto = await uploadToCloudinary(selectedFile);
      } catch (uploadErr) {
        setError(`Image Upload Failed: ${uploadErr.message}. Please retry or remove the photo.`);
        setIsLoading(false);
        setUploadingPhoto(false);
        return;
      }
      setUploadingPhoto(false);
    }

    // Assemble payload for backend
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      location: {
        latitude: lat,
        longitude: lng,
        address: formData.address.trim() || undefined,
      },
      ...(uploadedPhoto && { photo: uploadedPhoto }),
    };

    try {
      const res = await api.issues.create(payload);
      if (res?.success && res.issue?._id) {
        setSuccess(true);
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

            {/* Photo Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Evidence Photo <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </label>

              {!previewUrl ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                  <input
                    type="file"
                    id="photo-input"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    disabled={isLoading || success}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-input"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Take a photo or upload from device
                      </p>
                      <p className="text-xs text-slate-500">
                        JPG, PNG, WebP up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Selected evidence preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3">
                    <div className="text-white text-xs truncate max-w-[240px]">
                      <span className="font-medium block truncate">{selectedFile?.name}</span>
                      <span className="text-[10px] text-slate-300">
                        {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemovePhoto}
                      disabled={isLoading || success}
                      className="h-8 px-2.5 bg-red-600 hover:bg-red-700 text-white text-xs shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
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

            {/* Note regarding civic lifecycle */}
            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>Note:</strong> All new civic reports initialize with status <strong>REPORTED</strong> and priority <strong>MEDIUM</strong>. Attached photos are stored securely for municipal verification.
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
                    {uploadingPhoto ? "Uploading Photo..." : "Submitting Report..."}
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
