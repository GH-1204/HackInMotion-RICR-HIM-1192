"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, MapPin, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Preserved attachment point for actual authentication logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-1 w-full flex-col lg:flex-row">
      {/* Left Column: Branding / Visual (Hidden on smaller screens) */}
      <div className="relative hidden lg:flex w-full lg:w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
        {/* Subtle CSS pattern background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px"
          }}
        />
        
        {/* Abstract gradient glowing orbs for modern civic-tech feel */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              CitySeva
            </span>
          </Link>
          <div className="mt-24 max-w-lg">
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
              <p className="mt-1 text-sm text-slate-400">Pinpoint locations accurately.</p>
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
              <h3 className="font-semibold text-slate-100">Connect with the right department</h3>
              <p className="mt-1 text-sm text-slate-400">Smart routing ensures your voice reaches the authorities who can fix it immediately.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-white dark:bg-slate-50">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Mobile branding header */}
          <div className="lg:hidden text-center mb-10">
             <Link href="/">
              <span className="text-3xl font-extrabold tracking-tight text-blue-600">
                CitySeva
              </span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to continue managing your civic issues.
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="h-11 bg-white"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="h-11 pr-10 bg-white"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
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
                className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">
                Don&apos;t have an account?{" "}
              </span>
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                Create a citizen account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
