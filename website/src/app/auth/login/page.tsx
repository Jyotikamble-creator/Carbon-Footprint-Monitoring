import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
  <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Intelligent Emissions Management.
          </h1>
          <p className="text-gray-300 text-lg">
            Unlock efficiency and sustainability with precise emissions tracking and management.
          </p>
        </div>
      </div>

      {/* Right Panel */}
  <div className="w-full lg:w-1/2 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}