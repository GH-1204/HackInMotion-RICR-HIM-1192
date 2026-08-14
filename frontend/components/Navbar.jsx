"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "./ui/button";
import { 
  Building, 
  PlusCircle, 
  ListFilter, 
  LayoutDashboard, 
  LogOut, 
  ShieldAlert, 
  User, 
  Menu, 
  X 
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-bold text-lg">
              CS
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              City<span className="text-blue-600">Seva</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    pathname === "/"
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/citizen/report"
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors"
                >
                  Report Issue
                </Link>
              </>
            ) : role === "ADMIN" ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive("/admin/dashboard")
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/admin/issues"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive("/admin/issues")
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  All Issues
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/citizen/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive("/citizen/dashboard")
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/citizen/report"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive("/citizen/report")
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Issue
                </Link>
                <Link
                  href="/citizen/issues"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    isActive("/citizen/issues")
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  My Issues
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-slate-700 dark:text-slate-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* User profile pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                {role === "ADMIN" ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <User className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[140px] truncate">
                  {user?.name || user?.email || "User"}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider ${
                    role === "ADMIN"
                      ? "bg-indigo-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {role}
                </span>
              </div>

              {/* Logout button */}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 hover:border-red-200 dark:hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          {isAuthenticated && (
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 text-sm">
                  {(user?.name || user?.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{user?.name || "User"}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700">
                {role}
              </span>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Citizen Account
                </Link>
              </>
            ) : role === "ADMIN" ? (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/admin/issues"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  Manage All Issues
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/citizen/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/citizen/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  Report an Issue
                </Link>
                <Link
                  href="/citizen/issues"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                >
                  My Issues
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
