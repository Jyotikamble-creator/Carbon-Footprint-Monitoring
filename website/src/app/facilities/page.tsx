import FacilitiesContent from '@/components/facilities/FacilitiesContent';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FacilitiesPage() {
  return (
    <ProtectedRoute requiredRole="viewer">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FacilitiesContent />
      </div>
    </ProtectedRoute>
  );
}