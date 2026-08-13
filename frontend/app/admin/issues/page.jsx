export default function AdminIssuesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Issue Management</h1>
      <p className="text-slate-600 dark:text-slate-400">Manage and assign citizen issues to relevant departments.</p>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center bg-white dark:bg-slate-900 text-slate-500">
        No issues pending management.
      </div>
    </div>
  );
}
