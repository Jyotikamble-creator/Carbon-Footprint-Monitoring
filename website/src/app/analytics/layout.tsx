"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Brain } from 'lucide-react';

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Dashboard', href: '/analytics', icon: BarChart3 },
    { name: 'AI Suggestions', href: '/analytics/suggestions', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-emerald-900">
      <div className="container mx-auto px-6 py-8">
        {/* Analytics Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Comprehensive emissions analytics and AI-powered insights</p>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}