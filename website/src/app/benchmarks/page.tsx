"use client";

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Award, Users, Building, Target, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';

interface BenchmarkData {
  industry: string;
  companyEmission: number;
  industryAverage: number;
  industryBest: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
  peers: Array<{
    name: string;
    emission: number;
    isCurrentCompany: boolean;
  }>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

function MetricCard({ title, value, subtitle, icon, trend, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/20',
    red: 'text-red-400 bg-red-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20'
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-400' :
            trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
             trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
             <div className="w-4 h-4" />}
            <span>{trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-300 mb-1">{title}</div>
        <div className="text-xs text-gray-400">{subtitle}</div>
      </div>
    </div>
  );
}

interface BenchmarkChartProps {
  data: BenchmarkData;
}

function BenchmarkChart({ data }: BenchmarkChartProps) {
  const maxValue = Math.max(data.companyEmission, data.industryAverage, data.industryBest) * 1.2;

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Industry Comparison</h3>

      <div className="space-y-4">
        <div className="flex items-end gap-8">
          <div className="flex-1">
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm text-gray-400">Your Company</span>
              <span className="text-sm font-medium text-white">
                {data.companyEmission.toLocaleString()} tCO₂e
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 relative">
              <div
                className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(data.companyEmission / maxValue) * 100}%` }}
              >
                <span className="text-xs font-medium text-white">
                  {data.percentile}th percentile
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-8">
          <div className="flex-1">
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm text-gray-400">Industry Average</span>
              <span className="text-sm font-medium text-white">
                {data.industryAverage.toLocaleString()} tCO₂e
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 relative">
              <div
                className="bg-gray-500 h-8 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(data.industryAverage / maxValue) * 100}%` }}
              >
                <span className="text-xs font-medium text-white">Average</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-8">
          <div className="flex-1">
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm text-gray-400">Industry Best</span>
              <span className="text-sm font-medium text-white">
                {data.industryBest.toLocaleString()} tCO₂e
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 relative">
              <div
                className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(data.industryBest / maxValue) * 100}%` }}
              >
                <span className="text-xs font-medium text-white">Best</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Performance Summary</span>
        </div>
        <p className="text-gray-300 text-sm">
          Your company ranks in the {data.percentile}th percentile for {data.industry} industry emissions.
          {data.percentile > 75 ? ' Excellent performance! You\'re among the top performers.' :
           data.percentile > 50 ? ' Good performance. Room for improvement to reach top quartile.' :
           data.percentile > 25 ? ' Average performance. Consider implementing reduction strategies.' :
           ' Below average performance. Immediate action recommended to improve sustainability.'}
        </p>
      </div>
    </div>
  );
}

interface PeerComparisonProps {
  peers: BenchmarkData['peers'];
}

function PeerComparison({ peers }: PeerComparisonProps) {
  const sortedPeers = [...peers].sort((a, b) => a.emission - b.emission);

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Peer Comparison</h3>

      <div className="space-y-3">
        {sortedPeers.map((peer, index) => (
          <div
            key={peer.name}
            className={`flex items-center justify-between p-3 rounded-lg ${
              peer.isCurrentCompany ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-gray-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                peer.isCurrentCompany ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className={`font-medium ${peer.isCurrentCompany ? 'text-blue-400' : 'text-white'}`}>
                  {peer.name} {peer.isCurrentCompany && '(You)'}
                </div>
                <div className="text-sm text-gray-400">
                  {peer.emission.toLocaleString()} tCO₂e
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                index === 0 ? 'text-green-400' :
                index < sortedPeers.length * 0.25 ? 'text-emerald-400' :
                index < sortedPeers.length * 0.5 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {index === 0 ? 'Best' :
                 index < sortedPeers.length * 0.25 ? 'Top 25%' :
                 index < sortedPeers.length * 0.5 ? 'Top 50%' :
                 'Bottom 50%'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BenchmarksPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('Technology');
  const [dateRange, setDateRange] = useState(() => {
    // Default to last 12 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    return {
      from: startDate.toISOString().split('T')[0],
      to: endDate.toISOString().split('T')[0]
    };
  });
  const [grain, setGrain] = useState<'month' | 'quarter'>('month');
  const [showComparison, setShowComparison] = useState(false);

  // TODO: Replace with API call to fetch benchmark data
  const benchmarkData: BenchmarkData = {
    industry: selectedIndustry,
    companyEmission: 0,
    industryAverage: 0,
    industryBest: 0,
    percentile: 0,
    trend: 'stable',
    peers: []
  };

  const industries = [
    'Technology', 'Manufacturing', 'Energy', 'Transportation',
    'Agriculture', 'Construction', 'Retail', 'Healthcare'
  ];

  return (
    <ProtectedRoute>
      <PageLayout
        title="Industry Benchmarks"
        description="Compare your carbon performance against industry standards"
        icon={BarChart3}
        actions={
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        }
      >

        {/* Controls Header */}
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
            <span className="text-white font-medium">Analysis Grain:</span>
            <select
              value={grain}
              onChange={(e) => setGrain(e.target.value as 'month' | 'quarter')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
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

        {/* Key Metrics */}
        {benchmarkData.peers.length === 0 ? (
          <div className="text-center py-12 mb-8">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Benchmark Data Available</h3>
            <p className="text-gray-500">Industry benchmark data will be available soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Your Emissions"
              value={`${benchmarkData.companyEmission.toLocaleString()} tCO₂e`}
              subtitle="Total annual emissions"
              icon={<Building className="w-6 h-6" />}
              color="blue"
            />
            <MetricCard
              title="Industry Average"
              value={`${benchmarkData.industryAverage.toLocaleString()} tCO₂e`}
              subtitle="Sector-wide average"
              icon={<Users className="w-6 h-6" />}
              color="blue"
            />
            <MetricCard
              title="Industry Best"
              value={`${benchmarkData.industryBest.toLocaleString()} tCO₂e`}
              subtitle="Top performer in sector"
              icon={<Award className="w-6 h-6" />}
              color="green"
            />
            <MetricCard
              title="Your Ranking"
              value={`${benchmarkData.percentile}th percentile`}
              subtitle={`vs ${benchmarkData.peers.length} peers`}
              icon={<Target className="w-6 h-6" />}
              trend={benchmarkData.trend === 'improving' ? 'up' : benchmarkData.trend === 'declining' ? 'down' : 'neutral'}
              color={benchmarkData.percentile > 75 ? 'green' : benchmarkData.percentile > 50 ? 'yellow' : 'red'}
            />
          </div>
        )}

        {/* Charts */}
        {benchmarkData.peers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BenchmarkChart data={benchmarkData} />
            <PeerComparison peers={benchmarkData.peers} />
          </div>
        )}

        {/* Recommendations */}
        {benchmarkData.peers.length > 0 && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Improvement Recommendations</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-sm">💡</span>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Implement Renewable Energy</h4>
                  <p className="text-emerald-300 text-sm">
                    Transition to renewable energy sources could reduce your emissions by up to 40%.
                    Top performers in your industry have achieved this through solar and wind power procurement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm">🎯</span>
                </div>
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Optimize Supply Chain</h4>
                  <p className="text-blue-300 text-sm">
                    Work with suppliers to reduce Scope 3 emissions. Industry leaders have reduced supply chain emissions by 25% through vendor assessments and collaboration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-purple-400 text-sm">📊</span>
                </div>
                <div>
                  <h4 className="text-purple-400 font-medium mb-1">Enhance Monitoring</h4>
                  <p className="text-purple-300 text-sm">
                    Implement real-time monitoring and automated reporting to identify emission reduction opportunities. Leading companies use AI-driven analytics for continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </ProtectedRoute>
  );
}