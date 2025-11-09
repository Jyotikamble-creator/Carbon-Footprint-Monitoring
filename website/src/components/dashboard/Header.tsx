'use client';

import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/auth/authSlice';

export default function DashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  // Determine active tab based on current pathname
  const getActiveTab = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/activities') return 'Activities';
    if (path === '/emissions') return 'Emissions';
    if (path === '/facilities') return 'Facilities';
    if (path === '/users') return 'Users';
    if (path === '/factors') return 'Factors';
    if (path === '/ingest' || path === '/upload') return 'Ingest';
    if (path === '/analytics') return 'Analytics';
    if (path === '/reports' || path === '/report') return 'Reports';
    if (path === '/goals') return 'Goals';
    if (path === '/offsets') return 'Offsets';
    if (path === '/benchmarks') return 'Benchmarks';
    if (path === '/collaborate') return 'Collaborate';
    if (path === '/profile') return 'Profile';
    if (path === '/userManagement') return 'User Management';
    if (path === '/health') return 'Health';
    return 'Dashboard'; // default fallback
  };

  const activeTab = getActiveTab(pathname);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Role-based navigation
  const getTabsForRole = (role?: string) => {
    const baseTabs = ['Dashboard'];
    
    if (role === 'admin') {
      return [...baseTabs, 'Activities', 'Emissions', 'Facilities', 'Users', 'Factors', 'Ingest', 'Analytics', 'Reports', 'Goals', 'Offsets', 'Benchmarks', 'Collaborate', 'Health', 'Profile'];
    } else if (role === 'analyst') {
      return [...baseTabs, 'Activities', 'Emissions', 'Facilities', 'Factors', 'Ingest', 'Analytics', 'Reports', 'Goals', 'Offsets', 'Benchmarks', 'Collaborate', 'Health', 'Profile'];
    } else {
      // Viewer role or default
      return [...baseTabs, 'Activities', 'Emissions', 'Analytics', 'Reports', 'Goals', 'Offsets', 'Benchmarks', 'Collaborate', 'Profile'];
    }
  };

  const tabs = getTabsForRole(user?.role);

  const handleTabClick = (tab: string) => {
    // Navigate to appropriate routes
    const routeMap: Record<string, string> = {
      'Dashboard': '/dashboard',
      'Activities': '/activities',
      'Emissions': '/emissions',
      'Facilities': '/facilities',
      'Users': '/users',
      'Factors': '/factors',
      'Ingest': '/upload',
      'Analytics': '/analytics',
      'Reports': '/reports',
      'Goals': '/goals',
      'Offsets': '/offsets',
      'Benchmarks': '/benchmarks',
      'Collaborate': '/collaborate',
      'Health': '/health',
      'Profile': '/profile',
      'User Management': '/userManagement'
    };

    const route = routeMap[tab];
    if (route) {
      router.push(route);
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
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-white bg-gray-800'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation Menu */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => handleTabClick(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab} className="bg-gray-800">
                  {tab}
                </option>
              ))}
            </select>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
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