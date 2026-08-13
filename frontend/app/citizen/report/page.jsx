export default function CitizenReportPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Report a Civic Issue</h1>
      <form className="space-y-4 rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g. Pothole on Main St."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800">
            <option>Roads & Infrastructure</option>
            <option>Sanitation & Waste</option>
            <option>Street Lighting</option>
            <option>Water Supply</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            placeholder="Provide details about the issue..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <button
          type="button"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 transition"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
