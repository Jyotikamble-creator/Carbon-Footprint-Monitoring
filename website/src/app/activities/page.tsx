"use client";
import React, { useEffect, useState } from "react";
import { getActivities } from "@/lib/activities/api";
import { fetchFacilities } from "@/lib/tenants/api";
import DashboardHeader from '@/components/dashboard/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { Activity } from "@/types/activities/activitytypes";
import type { Facility } from "@/types/tenants/tenantstypes";
import {
  Search,
  Filter,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Activity as ActivityIcon,
  Building,
  Hash,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    category: '',
    facility_id: ''
  });

  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 50;

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Scope 1 - Direct Emissions',
    'Scope 2 - Indirect Emissions (Energy)',
    'Scope 3 - Other Indirect Emissions',
    'Electricity',
    'Natural Gas',
    'Diesel',
    'Petrol',
    'Air Travel',
    'Water',
    'Waste',
    'Coal',
    'Heating Oil',
    'Propane'
  ];

  async function loadFacilities() {
    try {
      const res = await fetchFacilities();
      setFacilities(res);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    }
  }

  async function loadActivities() {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };

      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.category) params.category = filters.category;
      if (filters.facility_id) params.facility_id = parseInt(filters.facility_id);

      const res = await getActivities(params);
      setItems(res);
      setTotalItems(res.length); // Note: API doesn't return total count, this is approximate
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facilities.find(f => f.id === item.facility_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !filters.category || item.category.includes(filters.category);
    const matchesFacility = !filters.facility_id || item.facility_id?.toString() === filters.facility_id;

    return matchesSearch && matchesCategory && matchesFacility;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ from: '', to: '', category: '', facility_id: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    loadActivities();
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

  const formatValue = (value: number, unit: string) => {
    return `${value.toLocaleString()} ${unit}`;
  };

  const getFacilityName = (facilityId?: number) => {
    if (!facilityId) return 'N/A';
    const facility = facilities.find(f => f.id === facilityId);
    return facility ? facility.name : `Facility #${facilityId}`;
  };

  return (
    <ProtectedRoute>
      <div>
        <DashboardHeader />
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
          <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <ActivityIcon className="w-8 h-8 text-emerald-400" />
                  Activity History
                </h1>
                <p className="text-gray-400">View and manage your activity data</p>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/activities/new"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </Link>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button
                  onClick={loadActivities}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

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

                  {/* Facility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Facility
                    </label>
                    <select
                      value={filters.facility_id}
                      onChange={(e) => handleFilterChange('facility_id', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">All Facilities</option>
                      {facilities.map(facility => (
                        <option key={facility.id} value={facility.id}>{facility.name}</option>
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
                        placeholder="Search activities..."
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
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-400">
                Showing {filteredItems.length} of {totalItems} activities
              </div>
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

            {/* Activities Table */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gray-800/50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Value & Unit
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Facility
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex items-center justify-center gap-3 text-gray-400">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            Loading activities data...
                          </div>
                        </td>
                      </tr>
                    ) : filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          {searchQuery || Object.values(filters).some(v => v) ?
                            "No activities found matching your filters." :
                            "No activity data available. Start by adding some activities."}
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
                              <ActivityIcon className="w-4 h-4 text-blue-400" />
                              <div>
                                <span className="text-white font-medium">{item.category}</span>
                                {item.subcategory && (
                                  <div className="text-gray-400 text-sm">{item.subcategory}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-emerald-400 font-semibold">
                              {formatValue(item.value_numeric, item.unit)}
                            </span>
                            {item.currency && item.spend_value && (
                              <div className="text-gray-400 text-sm">
                                {item.currency} {item.spend_value.toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-purple-400" />
                              <span className="text-white">{getFacilityName(item.facility_id)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">
                            {item.source_id || 'Manual'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">#{item.id}</span>
                            </div>
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}