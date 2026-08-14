"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, setToken, getUser, setUser, clearAuth } from "@/lib/auth";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth on client mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken) {
        setTokenState(storedToken);
        if (storedUser) {
          setUserState(storedUser);
        }

        // Verify/refresh user from backend
        try {
          const res = await api.auth.getMe();
          if (res?.success && res.user) {
            const updatedUser = {
              ...storedUser,
              ...res.user,
            };
            setUserState(updatedUser);
            setUser(updatedUser);
          }
        } catch {
          // Token is invalid/expired - clear stale auth
          clearAuth();
          setTokenState(null);
          setUserState(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res?.success && res.token) {
      setToken(res.token);
      setTokenState(res.token);

      const userProfile = res.user || { email, role: "CITIZEN" };
      setUser(userProfile);
      setUserState(userProfile);

      return userProfile;
    }
    throw new Error(res?.message || "Login failed");
  };

  const register = async (name, email, password) => {
    const res = await api.auth.register({ name, email, password });
    return res;
  };

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
    router.push("/login");
  }, [router]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
