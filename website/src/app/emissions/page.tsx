"use client";
import React, { useEffect, useState } from "react";
import { listEmissions, recomputeEmissions } from "@/lib/emissions/api";
import { fetchFacilities } from "@/lib/tenants/api";
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';
import type { Emission } from "@/types/emission/emissiontypes";
import type { Facility } from "@/types/tenants/tenantstypes";
import {
  Search,
  Filter,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calculator,
  Activity,
  TrendingUp,
  Building,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function EmissionsPage() {
  const [items, setItems] = useState<Emission[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [recomputing, setRecomputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recalcResult, setRecalcResult] = useState<number | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    category: '',
    scope: '',
    facilityId: ''
  });

  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 50;

  // Sorting
  const [sortField, setSortField] = useState<string>('occurred_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  const scopes = ['scope1', 'scope2', 'scope3'];
  const categories = [
    'Electricity', 'Natural Gas', 'Diesel', 'Petrol', 'Air Travel',
    'Water', 'Waste', 'Coal', 'Heating Oil', 'Propane'
  ];

  async function loadFacilities() {
    try {
      const res = await fetchFacilities();
      setFacilities(res);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    }
  }

  async function loadEmissions() {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };

      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await listEmissions(params);
      setItems(res);
      setTotalItems(res.length); // Note: API doesn't return total count, this is approximate
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onRecompute(e: React.FormEvent) {
    e.preventDefault();
    setRecomputing(true);
    setError(null);
    try {
      const resp = await recomputeEmissions({
        since: filters.from || undefined,
        until: filters.to || undefined
      });
      setRecalcResult(resp.recalculated_events);
      await loadEmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRecomputing(false);
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facilities.find(f => f.id === item.event_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesScope = !filters.scope || item.scope === filters.scope;

    return matchesSearch && matchesCategory && matchesScope;
  }).sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];

    // Handle date sorting
    if (sortField === 'occurred_at') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ from: '', to: '', category: '', scope: '', facilityId: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    loadEmissions();
  }, [filters, currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCO2 = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}t`;
    }
    return `${value.toFixed(2)}kg`;
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'scope1': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'scope2': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'scope3': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout 
        title="Emissions History"
        description="View and manage your carbon emissions data"
        icon={Calculator}
        actions={
          <>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={loadEmissions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </>
        }
      >

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Date From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.from}
                      onChange={(e) => handleFilterChange('from', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.to}
                      onChange={(e) => handleFilterChange('to', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Scope */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Scope
                    </label>
                    <select
                      value={filters.scope}
                      onChange={(e) => handleFilterChange('scope', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">All Scopes</option>
                      {scopes.map(scope => (
                        <option key={scope} value={scope}>{scope.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search emissions..."
                        className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>

                  {/* Recompute Form */}
                  <form onSubmit={onRecompute} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      Recompute Emissions
                    </div>
                    <input
                      type="date"
                      value={filters.from}
                      onChange={(e) => handleFilterChange('from', e.target.value)}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={filters.to}
                      onChange={(e) => handleFilterChange('to', e.target.value)}
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="To"
                    />
                    <button
                      type="submit"
                      disabled={recomputing}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                    >
                      {recomputing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Calculator className="w-4 h-4" />
                      )}
                      {recomputing ? 'Recomputing...' : 'Recompute'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-400">
                Showing {filteredItems.length} of {totalItems} emissions
              </div>
              {recalcResult !== null && (
                <div className="text-emerald-400 text-sm">
                  ✓ Recalculated {recalcResult} events
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-red-400 font-medium">Error</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Emissions Table */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gray-800/50">
                      <th
                        className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('occurred_at')}
                      >
                        <div className="flex items-center gap-2">
                          Date & Time
                          {sortField === 'occurred_at' && (
                            sortDirection === 'asc' ?
                              <ChevronUp className="w-4 h-4" /> :
                              <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center gap-2">
                          Category
                          {sortField === 'category' && (
                            sortDirection === 'asc' ?
                              <ChevronUp className="w-4 h-4" /> :
                              <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('scope')}
                      >
                        <div className="flex items-center gap-2">
                          Scope
                          {sortField === 'scope' && (
                            sortDirection === 'asc' ?
                              <ChevronUp className="w-4 h-4" /> :
                              <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th
                        className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('co2e_kg')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          CO₂e
                          {sortField === 'co2e_kg' && (
                            sortDirection === 'asc' ?
                              <ChevronUp className="w-4 h-4" /> :
                              <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Event ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex items-center justify-center gap-3 text-gray-400">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            Loading emissions data...
                          </div>
                        </td>
                      </tr>
                    ) : filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          {searchQuery || Object.values(filters).some(v => v) ?
                            "No emissions found matching your filters." :
                            "No emissions data available. Start by ingesting some events."}
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors ${
                            index === filteredItems.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-emerald-400" />
                              <div>
                                <div className="text-white font-medium">
                                  {formatDate(item.occurred_at)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-400" />
                              <span className="text-white">{item.category}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getScopeColor(item.scope)}`}>
                              {item.scope.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-emerald-400 font-semibold">
                              {formatCO2(item.co2e_kg)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400">
                            #{item.event_id}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-gray-800/50 rounded text-white text-sm">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
      </PageLayout>
    </ProtectedRoute>
  );
}
