import Sidebar from '@/components/activities/SideBar';
import AddActivityForm from '@/components/activities/AddActivityForm';

export default function AddActivityPage() {
  return (
  <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Log New Activity
            </h1>
            <p className="text-gray-400">
              Fill in the details below to manually record an emission-related activity.
            </p>
          </div>

          <AddActivityForm />
        </div>
      </main>
    </div>
  );
}