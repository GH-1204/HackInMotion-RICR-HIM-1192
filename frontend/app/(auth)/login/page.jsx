"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Eye,
  EyeOff,
  MapPin,
  Activity,
  ShieldCheck,
  AlertCircle,
  User,
  Shield,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [mode, setMode] = useState("CITIZEN"); // "CITIZEN" | "ADMIN"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleNotice, setGoogleNotice] = useState(null);

  const { login, logout } = useAuth();
  const router = useRouter();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError(null);
    setGoogleNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setGoogleNotice(null);
    setIsLoading(true);

    try {
      // Authenticate using the existing backend login mechanism
      const user = await login(email, password);

      // Enforce role consistency with the user's selected mode
      if (mode === "CITIZEN" && user.role !== "CITIZEN") {
        logout();
        setError("These credentials belong to an administrator. Please use Administrator Login.");
        setIsLoading(false);
        return;
      }

      if (mode === "ADMIN" && user.role !== "ADMIN") {
        logout();
        setError("These credentials belong to a citizen. Please use Citizen Login.");
        setIsLoading(false);
        return;
      }

      // Role matches selected mode -> redirect to corresponding dashboard
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/citizen/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };


  const handleGooglePlaceholderClick = () => {
    setGoogleNotice(
      "Google Sign-In is not implemented yet. Please use email and password to log in."
    );
  };

  const fillAdminDemo = () => {
    setEmail("admin@cityseva.org");
    setPassword("AdminPassword@123");
    setError(null);
    setGoogleNotice(null);
  };

  return (
    <div className="flex flex-1 w-full flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Left Column: Branding / Civic Platform Showcase */}
      <div className="relative hidden lg:flex w-full lg:w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px"
          }}
        />

        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
              CS
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              CitySeva
            </span>
          </Link>
          <div className="mt-20 max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-50 leading-[1.1]">
              Make Your City Better.<br />
              <span className="text-blue-400">One Issue at a Time.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Report civic issues, track progress, and stay informed from report to resolution. Empowering transparent and responsive urban infrastructure.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid gap-6 sm:grid-cols-2 mt-12">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Report in minutes</h3>
              <p className="mt-1 text-sm text-slate-400">Pinpoint locations accurately with coordinates.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Track every update</h3>
              <p className="mt-1 text-sm text-slate-400">Real-time status transparency.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Role-Based Portals</h3>
              <p className="mt-1 text-sm text-slate-400">Dedicated citizen reporting and administrator municipal management.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dual Login Interface */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-white dark:bg-slate-950">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                CS
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                CitySeva
              </span>
            </Link>
          </div>

          {/* Dual Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handleModeChange("CITIZEN")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                mode === "CITIZEN"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              Citizen Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("ADMIN")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                mode === "ADMIN"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              {mode === "CITIZEN" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <User className="w-3 h-3" /> Citizen Portal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Shield className="w-3 h-3" /> Administrator Portal
                </span>
              )}
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {mode === "CITIZEN" ? "Citizen Sign In" : "Administrator Sign In"}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {mode === "CITIZEN"
                ? "Sign in to report civic issues and track resolutions in real time."
                : "Sign in with authorized municipal credentials to manage civic operations."}
            </p>
          </div>

          {/* Admin Demo Helper */}
          {mode === "ADMIN" && (
            <div className="mt-4 p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                  Test Admin Credentials:
                </span>
                <button
                  type="button"
                  onClick={fillAdminDemo}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer transition-colors shadow-xs"
                >
                  Autofill Admin
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Notice Banner */}
          {googleNotice && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-sm text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{googleNotice}</span>
            </div>
          )}

          {/* Form */}
          <div className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-200"
                >
                  {mode === "CITIZEN" ? "Email address" : "Admin Email"}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "CITIZEN" ? "name@example.com" : "admin@cityseva.org"}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-200"
                >
                  {mode === "CITIZEN" ? "Password" : "Admin Password"}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-11 text-base text-white shadow-sm font-medium transition-colors ${
                  mode === "CITIZEN"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : mode === "CITIZEN" ? (
                  "Citizen Login"
                ) : (
                  "Admin Login"
                )}
              </Button>
            </form>

            {/* Citizen Google Login Placeholder */}
            {mode === "CITIZEN" && (
              <div className="mt-4">
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-950 px-2 text-slate-500 dark:text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGooglePlaceholderClick}
                  className="w-full h-11 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium flex items-center justify-center gap-2.5"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    Soon
                  </span>
                </Button>
              </div>
            )}

            {/* Bottom Footer Links */}
            <div className="mt-6 text-center text-sm">
              {mode === "CITIZEN" ? (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                  </span>
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Register as Citizen
                  </Link>
                </div>
              ) : (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Need citizen access?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleModeChange("CITIZEN")}
                    className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 cursor-pointer"
                  >
                    Switch to Citizen Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
