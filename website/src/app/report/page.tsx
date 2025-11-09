import ReportsSidebar from '@/components/reports/ReportsSidebar';
import EmissionsActivityReport from '@/components/reports/EmissionsActivityReport';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <ReportsSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <EmissionsActivityReport />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}