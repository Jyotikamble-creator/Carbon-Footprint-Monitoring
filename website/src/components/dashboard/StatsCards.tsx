'use client';

import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { getKpis } from '@/lib/analytics/api';
import type { KpisResponse } from '@/types/analytics/analyticstypes';

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export default function StatsCards() {
  const [kpis, setKpis] = useState<KpisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setLoading(true);
        // Use a default date range for now - last 30 days
        const to = new Date().toISOString().split('T')[0];
        const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const data = await getKpis(from, to);
        setKpis(data);
      } catch (err) {
        console.error('Failed to fetch KPIs - Full error details:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          status: (err as any)?.status,
          response: (err as any)?.response,
          config: (err as any)?.config
        });
        setError(`Failed to load KPIs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-700 rounded mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-xl p-6">
        <p className="text-red-400">Failed to load dashboard stats</p>
      </div>
    );
  }

  const stats: StatCard[] = [
    {
      title: 'Total CO2e',
      value: `${(kpis.total_co2e_kg / 1000).toFixed(1)} t`,
      change: 'Current period',
      isPositive: false,
    },
    {
      title: 'Scope 1',
      value: `${(kpis.scope1_kg / 1000).toFixed(1)} t`,
      change: `${((kpis.scope1_kg / kpis.total_co2e_kg) * 100).toFixed(1)}% of total`,
      isPositive: true,
    },
    {
      title: 'Scope 2',
      value: `${(kpis.scope2_kg / 1000).toFixed(1)} t`,
      change: `${((kpis.scope2_kg / kpis.total_co2e_kg) * 100).toFixed(1)}% of total`,
      isPositive: true,
    },
    {
      title: 'Scope 3',
      value: `${(kpis.scope3_kg / 1000).toFixed(1)} t`,
      change: `${((kpis.scope3_kg / kpis.total_co2e_kg) * 100).toFixed(1)}% of total`,
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all"
        >
          <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
          <div className="text-3xl font-bold text-white mb-3">
            {stat.value}
          </div>
          <div
            className={`flex items-center gap-1 text-sm ${
              stat.isPositive ? 'text-emerald-400' : 'text-gray-400'
            }`}
          >
            {index === 0 && <TrendingDown className="w-4 h-4" />}
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}