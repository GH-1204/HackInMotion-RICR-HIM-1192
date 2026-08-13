import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
              CitySeva
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/citizen/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
            Dashboard
          </Link>
          <Link href="/citizen/report" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
            Report Issue
          </Link>
          <Link href="/citizen/issues" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
            Public Issues
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
            Login
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
