"use client";

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
}

export function PageLayout({ children, title, description, icon: Icon, actions }: PageLayoutProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon className="w-8 h-8 text-emerald-400" />
            {title}
          </h1>
          <p className="text-gray-400">{description}</p>
        </div>

        {actions && (
          <div className="flex items-center gap-4">
            {actions}
          </div>
        )}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}