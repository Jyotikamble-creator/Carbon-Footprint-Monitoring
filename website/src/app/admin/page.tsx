import AdminSidebar from '@/components/admin/AdminSidebar';
import AddEmissionFactorForm from '@/components/admin/AddEmissionFactorForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/Header';

export default function AddEmissionFactorPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <DashboardHeader />
        <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
          <AdminSidebar />
        
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <span>Admin</span>
              <span>/</span>
              <span>Emission Factors</span>
              <span>/</span>
              <span className="text-white">Add New</span>
            </div>

            <AddEmissionFactorForm />
          </div>
        </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}