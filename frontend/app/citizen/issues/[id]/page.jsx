export default async function CitizenIssueDetailPage({ params }) {
  const { id } = await params;
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Issue Details #{id}</h1>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 space-y-4">
        <p className="text-slate-600 dark:text-slate-400">
          Detailed information for civic issue ID: <span className="font-mono text-blue-600">{id}</span>
        </p>
      </div>
    </div>
  );
}
