"use client";

import { ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/Header';
import { ToastProvider } from '../ui/Toast';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950">
        <DashboardHeader />

        {/* Main Content */}
        <div className="w-full">
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