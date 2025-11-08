"use client";

import { ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

interface EmissionChartProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function EmissionChart({
  title,
  subtitle,
  children,
  height = 300,
  loading = false,
  error = null,
  className = ''
}: EmissionChartProps) {
  if (loading) {
    return (
      <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
        <div className="mb-6">
          <div className="h-6 bg-gray-700 rounded mb-2 w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className={`h-[${height}px] bg-gray-700/30 rounded animate-pulse`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <div className={`h-[${height}px] flex items-center justify-center`}>
          <div className="text-center">
            <p className="text-red-400 mb-2">Failed to load chart data</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}