'use client';

import { Sun, Moon, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/auth/authSlice';
import { useTheme } from '@/lib/theme/ThemeContext';

export default function DashboardHeader() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  // Determine active tab based on current pathname
  const getActiveTab = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/facilities') return 'Facilities';
    if (path === '/users') return 'Users';
    if (path === '/factors') return 'Factors';
    if (path === '/ingest') return 'Ingest';
    if (path === '/analytics') return 'Analytics';
    if (path === '/reports') return 'Reports';
    return 'Dashboard'; // default fallback
  };

  const activeTab = getActiveTab(pathname);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Role-based navigation
  const tabs = ['Dashboard'];
  
  // Add tabs based on user role
  if (user?.role === 'admin') {
    tabs.push('Facilities', 'Users', 'Factors', 'Ingest', 'Analytics', 'Reports');
  } else if (user?.role === 'analyst') {
    tabs.push('Facilities', 'Factors', 'Ingest', 'Analytics', 'Reports');
  } else {
    // Viewer role
    tabs.push('Analytics', 'Reports');
  }

  const handleTabClick = (tab: string) => {
    // Navigate to appropriate routes
    const route = tab.toLowerCase().replace(' ', '-');
    if (route === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/${route}`);
    }
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-white/80" />
            </div>
            <span className="text-xl font-bold text-white">EcoTrack</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white bg-gray-800'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">{user?.email}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-white font-medium">{user?.email}</p>
                    <p className="text-gray-400 text-sm capitalize">{user?.role} • {user?.org?.name}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}