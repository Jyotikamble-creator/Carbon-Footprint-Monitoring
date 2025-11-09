"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLayout } from '@/components/layout/PageLayout';
import { getKpis, getTrend, getSummary } from "@/lib/analytics/api";
import type { KpisResponse, TrendPoint, SummaryResponse } from "@/types/analytics/analyticstypes";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Calendar,
  Factory,
  Leaf,
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const SCOPE_COLORS = {
  scope1: '#ef4444', // red-500
  scope2: '#f97316', // orange-500  
  scope3: '#eab308', // yellow-500
};

const CHART_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<KpisResponse | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0] // today
  });
  const [grain, setGrain] = useState<'day' | 'month'>('day');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonTrend, setComparisonTrend] = useState<TrendPoint[]>([]);
  const [comparisonKpis, setComparisonKpis] = useState<KpisResponse | null>(null);

  async function loadAnalytics() {
    setLoading(true);
    setError(null);
    try {
      const promises = [
        getKpis(dateRange.from, dateRange.to),
        getTrend(dateRange.from, dateRange.to, grain),
        getSummary()
      ];

      // Add comparison data if enabled
      if (showComparison) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        const periodDiff = toDate.getTime() - fromDate.getTime();
        
        const prevFrom = new Date(fromDate.getTime() - periodDiff).toISOString().split('T')[0];
        const prevTo = fromDate.toISOString().split('T')[0];
        
        promises.push(getKpis(prevFrom, prevTo));
        promises.push(getTrend(prevFrom, prevTo, grain));
      }

      const results = await Promise.all(promises);
      
      setKpis(results[0] as KpisResponse);
      setTrend(results[1] as TrendPoint[]);
      setSummary(results[2] as SummaryResponse);
      
      if (showComparison) {
        setComparisonKpis(results[3] as KpisResponse);
        setComparisonTrend(results[4] as TrendPoint[]);
      } else {
        setComparisonKpis(null);
        setComparisonTrend([]);
      }
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [dateRange.from, dateRange.to, grain, showComparison]);

  const formatCO2 = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}t`;
    }
    return `${value.toFixed(1)}kg`;
  };

  const scopeChartData = kpis ? [
    { name: 'Scope 1', value: kpis.scope1_kg, color: SCOPE_COLORS.scope1 },
    { name: 'Scope 2', value: kpis.scope2_kg, color: SCOPE_COLORS.scope2 },
    { name: 'Scope 3', value: kpis.scope3_kg, color: SCOPE_COLORS.scope3 },
  ].filter(item => item.value > 0) : [];

  const topCategoriesData = summary?.top_categories?.map((item, index) => ({
    category: String(item.category || '').replace('_', ' ').toUpperCase(),
    value: item.co2e_kg || 0,
    color: CHART_COLORS[index % CHART_COLORS.length]
  })) || [];

  return (
    <ProtectedRoute requiredRole="viewer">
      <PageLayout
        title="Analytics Dashboard"
        description="Comprehensive emissions analytics and insights"
        icon={TrendingUp}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Date Range:</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ colorScheme: 'dark' }}
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-white font-medium">Trend Grain:</span>
            <select
              value={grain}
              onChange={(e) => setGrain(e.target.value as 'day' | 'month')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="day">Daily</option>
              <option value="month">Monthly</option>
            </select>

            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
              />
              Compare with previous period
            </label>
          </div>
        </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-center gap-3 mb-8">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* KPI Cards */}
              {kpis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <Leaf className="w-8 h-8 text-emerald-400" />
                      <span className="text-sm text-gray-400">TOTAL</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCO2(kpis.total_co2e_kg)}
                    </div>
                    <p className="text-gray-400 text-sm">CO₂ Equivalent</p>
                    {showComparison && comparisonKpis && (
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${kpis.total_co2e_kg < comparisonKpis.total_co2e_kg ? 'text-green-400' : 'text-red-400'}`}>
                          {kpis.total_co2e_kg < comparisonKpis.total_co2e_kg ? '↓' : '↑'} 
                          {Math.abs(((kpis.total_co2e_kg - comparisonKpis.total_co2e_kg) / comparisonKpis.total_co2e_kg) * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 ml-1">vs previous</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-400">SCOPE 1</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCO2(kpis.scope1_kg)}
                    </div>
                    <p className="text-gray-400 text-sm">Direct Emissions</p>
                    {showComparison && comparisonKpis && (
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${kpis.scope1_kg < comparisonKpis.scope1_kg ? 'text-green-400' : 'text-red-400'}`}>
                          {kpis.scope1_kg < comparisonKpis.scope1_kg ? '↓' : '↑'} 
                          {Math.abs(((kpis.scope1_kg - comparisonKpis.scope1_kg) / comparisonKpis.scope1_kg) * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 ml-1">vs previous</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-sm text-gray-400">SCOPE 2</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCO2(kpis.scope2_kg)}
                    </div>
                    <p className="text-gray-400 text-sm">Indirect Energy</p>
                    {showComparison && comparisonKpis && (
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${kpis.scope2_kg < comparisonKpis.scope2_kg ? 'text-green-400' : 'text-red-400'}`}>
                          {kpis.scope2_kg < comparisonKpis.scope2_kg ? '↓' : '↑'} 
                          {Math.abs(((kpis.scope2_kg - comparisonKpis.scope2_kg) / comparisonKpis.scope2_kg) * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 ml-1">vs previous</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-400">SCOPE 3</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCO2(kpis.scope3_kg)}
                    </div>
                    <p className="text-gray-400 text-sm">Other Indirect</p>
                    {showComparison && comparisonKpis && (
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${kpis.scope3_kg < comparisonKpis.scope3_kg ? 'text-green-400' : 'text-red-400'}`}>
                          {kpis.scope3_kg < comparisonKpis.scope3_kg ? '↓' : '↑'} 
                          {Math.abs(((kpis.scope3_kg - comparisonKpis.scope3_kg) / comparisonKpis.scope3_kg) * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 ml-1">vs previous</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Emissions Trend */}
                {trend.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Emissions Trend {showComparison && '(Current vs Previous Period)'}
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="period" 
                            stroke="#9ca3af"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            fontSize={12}
                            tickFormatter={formatCO2}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value: number, name: string) => [formatCO2(value), name]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="co2e_kg" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            name="Current Period"
                          />
                          {showComparison && comparisonTrend.length > 0 && (
                            <Line 
                              type="monotone" 
                              dataKey="co2e_kg" 
                              data={comparisonTrend}
                              stroke="#ef4444" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                              name="Previous Period"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Scope Breakdown */}
                {scopeChartData.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Scope Breakdown
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={scopeChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {scopeChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value: number) => [formatCO2(value), 'CO₂e']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary and Top Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Summary Stats */}
                {summary && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Factory className="w-5 h-5 text-emerald-400" />
                      Summary Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Total Emissions</span>
                        <span className="text-white font-semibold">{formatCO2(summary.total_co2e_kg)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Active Facilities</span>
                        <span className="text-white font-semibold">{summary.facilities_count}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Last Activity</span>
                        <span className="text-white font-semibold">
                          {summary.last_event_at 
                            ? new Date(summary.last_event_at).toLocaleDateString()
                            : 'No data'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Categories */}
                {topCategoriesData.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Top Emission Categories</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCategoriesData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            type="number"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickFormatter={formatCO2}
                          />
                          <YAxis 
                            type="category"
                            dataKey="category"
                            stroke="#9ca3af"
                            fontSize={12}
                            width={80}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value: number) => [formatCO2(value), 'CO₂e']}
                          />
                          <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </PageLayout>
    </ProtectedRoute>
  );
}
