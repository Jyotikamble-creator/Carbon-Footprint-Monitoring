import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import EmissionsTrend from '@/components/dashboard/EmissionTrend';
import EmissionsByScope from '@/components/dashboard/EmissionByScope';

// Temporary debug component
function AuthDebug() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  return (
    <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-4">
      <h3 className="text-blue-400 font-semibold mb-2">Debug Info:</h3>
      <p className="text-blue-300 text-sm">Token exists: {token ? 'Yes' : 'No'}</p>
      {token && <p className="text-blue-300 text-sm">Token preview: {token.substring(0, 20)}...</p>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
  <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Temporary Debug Info */}
          <AuthDebug />
          
          {/* Page Title and Filter */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">Emissions Dashboard</h1>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Current Period
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <EmissionsTrend />
            <EmissionsByScope />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}