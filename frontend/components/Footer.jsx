import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            CitySeva
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Empowering citizens for a smarter city.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
            Contact
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} CitySeva. All rights reserved.
      </div>
    </footer>
  );
}
