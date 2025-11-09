import UploadSidebar from '@/components/upload/SideBar';
import UploadActivityContent from '@/components/upload/UploadActivities';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UploadActivityPage() {
  return (
    <ProtectedRoute requiredRole="analyst">
      <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
          <UploadSidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <span>Data Management</span>
              <span>/</span>
              <span className="text-white">Upload Activities</span>
            </div>

            <UploadActivityContent />
          </div>
        </main>
        </div>
    </ProtectedRoute>
  );
}