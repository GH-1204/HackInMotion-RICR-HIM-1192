/**
 * CitySeva Central API Client
 * Connects frontend to Express REST APIs.
 */

import { getToken, clearAuth } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Base HTTP request wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new Error(err.message || "Network connection error. Is the backend server running?");
  }

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    // 401 Unauthorized handling
    if (response.status === 401 && typeof window !== "undefined") {
      // Clear token if expired or invalid
      if (endpoint !== "/api/auth/login" && endpoint !== "/api/auth/register") {
        clearAuth();
      }
    }

    const errorMessage =
      data?.message ||
      (data?.errors && data.errors.map((e) => e.message).join(", ")) ||
      `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication APIs
  auth: {
    register: (payload) =>
      request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    login: (payload) =>
      request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getMe: () =>
      request("/api/auth/me", {
        method: "GET",
      }),
  },

  // Citizen Issue APIs
  issues: {
    create: (payload) =>
      request("/api/issues", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getMyIssues: () =>
      request("/api/issues/my", {
        method: "GET",
      }),
    getById: (id) =>
      request(`/api/issues/${id}`, {
        method: "GET",
      }),
  },

  // Admin APIs
  admin: {
    getAllIssues: () =>
      request("/api/admin/issues", {
        method: "GET",
      }),
    getIssueById: (id) =>
      request(`/api/admin/issues/${id}`, {
        method: "GET",
      }),
    updateStatus: (id, payload) =>
      request(`/api/admin/issues/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    resolveIssue: (id, payload) =>
      request(`/api/admin/issues/${id}/resolve`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },
};

export default api;

