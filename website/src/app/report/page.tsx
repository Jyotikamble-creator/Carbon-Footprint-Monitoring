import ReportsSidebar from '@/components/reports/ReportsSidebar';
import EmissionsActivityReport from '@/components/reports/EmissionsActivityReport';
import DashboardHeader from '@/components/dashboard/Header';

export default function ReportsPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <ReportsSidebar />

        <main className="flex-1 p-8">
          <EmissionsActivityReport />
        </main>
      </div>
    </div>
  );
}