export default function AdminAnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Analytics & Performance</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Metrics on issue response times, resolution rates, and departmental efficiency.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center justify-center text-slate-500">
          Response Time Chart Placeholder
        </div>
        <div className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center justify-center text-slate-500">
          Category Distribution Chart Placeholder
        </div>
      </div>
    </div>
  );
}
