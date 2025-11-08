'use client';

import {
  LayoutDashboard,
  Activity,
  FileText,
  Settings,
  Plus,
  Building2,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ReportsSidebar() {
  const [activeItem, setActiveItem] = useState('Reports');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', color: 'text-blue-400', hoverColor: 'hover:bg-blue-500/20' },
    { name: 'Activities', icon: Activity, href: '/activities', color: 'text-emerald-400', hoverColor: 'hover:bg-emerald-500/20' },
    { name: 'Reports', icon: FileText, href: '/reports', color: 'text-purple-400', hoverColor: 'hover:bg-purple-500/20' },
    { name: 'Settings', icon: Settings, href: '/settings', color: 'text-orange-400', hoverColor: 'hover:bg-orange-500/20' },
  ];

  return (
    <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl">
      {/* Company Profile */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-lg">EcoTrack Inc.</div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-400 text-sm">Admin Role</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
            Navigation
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setActiveItem(item.name)}
                    className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/10 border border-emerald-400/30'
                        : `text-gray-400 ${item.hoverColor} hover:text-white hover:shadow-lg`
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/30'
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-300' : item.color}`} />
                    </div>
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Log New Activity Button */}
      <div className="p-6 border-t border-white/10">
        <button className="w-full group relative overflow-hidden px-6 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25">
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <div className="relative flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" />
            <span>Log New Activity</span>
          </div>
        </button>
      </div>
    </aside>
  );
}