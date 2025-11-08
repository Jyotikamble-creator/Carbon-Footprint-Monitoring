"use client";

import { useState, ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/Header';
import { ToastProvider } from '../ui/Toast';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950">
        

        {/* Main Content */}
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

// Layout for pages that don't need the sidebar (like login)
interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}