import EmissionsSidebar from '@/components/emissions/EmissionsSidebar';
import ComputedEmissionsContent from '@/components/emissions/ComputedEmissionsContent';
import DashboardHeader from '@/components/dashboard/Header';

export default function ComputedEmissionsPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <EmissionsSidebar />
        
        <main className="flex-1 p-8">
          <ComputedEmissionsContent />
        </main>
      </div>
    </div>
  );
}