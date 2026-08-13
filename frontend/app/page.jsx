import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8 py-20">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-slate-50">
          Aapki Shikayat, Shehar ka Samadhan with <span className="text-blue-600">CitySeva</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Empowering citizens and municipal authorities to collaborate for a cleaner, safer, and smarter city. Report problems, track resolutions, and help administrators manage issues efficiently.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Link href="/citizen/report">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-12 px-8">
              Report an Issue
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg h-12 px-8">
              Login
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full py-12 text-left">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">Report Problems</h3>
          <p className="text-slate-600 dark:text-slate-400">Citizens can easily capture and report civic issues like potholes, broken streetlights, or waste management problems.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">Track Resolution</h3>
          <p className="text-slate-600 dark:text-slate-400">Stay updated on the status of your reported issues as municipal authorities assign and resolve them.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">Manage Efficiently</h3>
          <p className="text-slate-600 dark:text-slate-400">City administrators get a powerful dashboard to prioritize, assign, and track the resolution of all reported civic issues.</p>
        </div>
      </div>
    </div>
  );
}
