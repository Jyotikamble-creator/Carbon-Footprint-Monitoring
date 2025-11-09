'use client';

import { Sun, Moon, LogOut, User, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/auth/authSlice';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useNotifications } from '@/components/NotificationCenter';

export default function DashboardHeader() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, removeNotification, clearAll } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

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
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                            !notification.read ? 'bg-gray-700/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'error' ? 'bg-red-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                              <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                              <p className="text-gray-500 text-xs mt-2">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                              {notification.action && (
                                <button
                                  onClick={() => {
                                    notification.action?.onClick();
                                    setShowNotifications(false);
                                  }}
                                  className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-white transition-colors shrink-0"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
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