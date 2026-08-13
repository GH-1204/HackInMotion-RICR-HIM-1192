import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CitizenDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Citizen Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome to your CitySeva portal. View reported issues, submit new reports, and track status in real-time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-300">My Reported Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-300">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-500">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-300">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-500">0</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border-dashed border-2">
        <CardContent className="p-12 text-center text-slate-500">
          <p>Recent reports will appear here once you submit an issue.</p>
        </CardContent>
      </Card>
    </div>
  );
}
