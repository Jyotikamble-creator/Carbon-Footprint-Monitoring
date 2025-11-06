 'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrend } from '@/lib/analytics/hooks';
import type { TrendPoint } from '@/types/analytics/analyticstypes';

export default function EmissionsTrend() {
  const to = useMemo(() => new Date().toISOString().split('T')[0], []);
  const from = useMemo(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], []);

  const { data: trendData = [], isLoading: loading, isError, error } = useTrend(from, to, 'day');

  if (loading) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="mb-6">
          <div className="h-6 bg-gray-700 rounded mb-2 w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="h-[300px] bg-gray-700/30 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || trendData.length === 0) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-1">
            Total Emissions Trend
          </h3>
          <p className="text-sm text-gray-400">Trend data</p>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No trend data available</p>
        </div>
      </div>
    );
  }

  // Convert kg to tonnes for display
  const chartData = trendData.map(point => ({
    name: point.period,
    value: Math.round(point.co2e_kg / 1000 * 10) / 10, // Convert to tonnes with 1 decimal
  }));

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">
          Total Emissions Trend
        </h3>
        <p className="text-sm text-gray-400">Emissions over time (tonnes CO2e)</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
            formatter={(value: number) => [`${value} t`, 'CO2e']}
          />
          <Bar 
            dataKey="value" 
            fill="#10B981" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}