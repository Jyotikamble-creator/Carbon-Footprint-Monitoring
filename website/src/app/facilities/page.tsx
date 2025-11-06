import DashboardHeader from '@/components/dashboard/Header';
import FacilitiesContent from '@/components/facilities/FacilitiesContent';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FacilitiesPage() {
  return (
    <ProtectedRoute requiredRole="viewer">
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
  <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <FacilitiesContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}