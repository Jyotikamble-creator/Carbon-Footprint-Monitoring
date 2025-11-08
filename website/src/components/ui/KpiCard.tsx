"use client";

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'emerald';
  loading?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'blue',
  loading = false,
  className = ''
}: KpiCardProps) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500/50',
    green: 'text-green-400 bg-green-500/20 border-green-500/50',
    red: 'text-red-400 bg-red-500/20 border-red-500/50',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
    purple: 'text-purple-400 bg-purple-500/20 border-purple-500/50',
    emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50'
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
        </div>
        <div className="w-20 h-8 bg-gray-700 rounded mb-3"></div>
        <div className="w-24 h-4 bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-400' :
            trend === 'down' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {trendIcons[trend]}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-white mb-1">
        {value}
      </div>

      <div className="text-sm font-medium text-gray-300 mb-1">
        {title}
      </div>

      {subtitle && (
        <div className="text-xs text-gray-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}