"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from '@/components/dashboard/Header';
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
  TrendingDown, 
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

  async function loadAnalytics() {
    setLoading(true);
    setError(null);
    try {
      const [k, t, s] = await Promise.all([
        getKpis(dateRange.from, dateRange.to),
        getTrend(dateRange.from, dateRange.to, 'day'),
        getSummary()
      ]);
      setKpis(k);
      setTrend(t);
      setSummary(s);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [dateRange.from, dateRange.to]);

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

  const topCategoriesData = summary?.top_categories?.map(([category, value], index) => ({
    category: String(category).replace('_', ' ').toUpperCase(),
    value,
    color: CHART_COLORS[index % CHART_COLORS.length]
  })) || [];

  return (
    <ProtectedRoute requiredRole="viewer">
      <div>
        <DashboardHeader />
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-emerald-900">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-white">Analytics (placeholder)</h1>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
