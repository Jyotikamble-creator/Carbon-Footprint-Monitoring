import ReportsSidebar from '@/components/reports/ReportsSidebar';
import EmissionsActivityReport from '@/components/reports/EmissionsActivityReport';
import DashboardHeader from '@/components/dashboard/Header';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-800">
      <DashboardHeader />
      <div className="flex min-h-screen">
        <ReportsSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <EmissionsActivityReport />
          </div>
        </main>
      </div>
    </div>
  );
}