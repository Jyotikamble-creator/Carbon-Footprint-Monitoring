 'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useKpis } from '@/lib/analytics/hooks';
import type { KpisResponse } from '@/types/analytics/analyticstypes';

interface ScopeData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number; // Add index signature for recharts compatibility
}

export default function EmissionsByScope() {
  const to = useMemo(() => new Date().toISOString().split('T')[0], []);
  const from = useMemo(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], []);

  const { data: kpis, isLoading: loading, isError, error } = useKpis(from, to);

  if (loading) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="mb-6">
          <div className="h-6 bg-gray-700 rounded mb-2 w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-64 h-64 bg-gray-700/30 rounded-full animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !kpis || kpis.total_co2e_kg === 0) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-1">
            Emissions by Scope
          </h3>
          <p className="text-sm text-gray-400">Scope breakdown</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No scope data available</p>
        </div>
      </div>
    );
  }

  const data: ScopeData[] = [
    {
      name: 'Scope 1',
      value: kpis.scope1_kg / 1000, // Convert to tonnes
      percentage: (kpis.scope1_kg / kpis.total_co2e_kg) * 100,
      color: '#3B82F6'
    },
    {
      name: 'Scope 2',
      value: kpis.scope2_kg / 1000, // Convert to tonnes  
      percentage: (kpis.scope2_kg / kpis.total_co2e_kg) * 100,
      color: '#10B981'
    },
    {
      name: 'Scope 3',
      value: kpis.scope3_kg / 1000, // Convert to tonnes
      percentage: (kpis.scope3_kg / kpis.total_co2e_kg) * 100,
      color: '#F59E0B'
    },
  ].filter(scope => scope.value > 0); // Only show scopes with data

  const totalTonnes = kpis.total_co2e_kg / 1000;

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">
          Emissions by Scope
        </h3>
        <p className="text-sm text-gray-400">Current totals</p>
      </div>

      <div className="flex items-center justify-between">
        {/* Donut Chart */}
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="percentage"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white">{totalTonnes.toFixed(1)}</div>
            <div className="text-sm text-gray-400">tCO₂e</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 text-sm">{item.name}</span>
              </div>
              <span className="text-white font-semibold">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}