"use client";
import React, { useEffect, useState } from "react";
import { getActivities } from "@/lib/activities/api";
import { fetchFacilities } from "@/lib/tenants/api";
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';
import Link from 'next/link';
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
import AdvancedSearch, { FilterOption, SavedFilter } from '@/components/advanced/AdvancedSearch';
import { useSavedFilters } from '@/hooks/useSavedFilters';
import { ExportButton } from '@/components/advanced/ExportButton';
import { ExportColumn } from '@/lib/export';
import { BulkOperations } from '@/components/advanced/BulkOperations';
import { useBulkSelection } from '@/hooks/useBulkSelection';

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced search and filtering
    const { savedFilters, saveFilter, loadFilter: loadSavedFilter, deleteFilter } = useSavedFilters('activities');

  const handleLoadFilter = (filter: SavedFilter) => {
    // Load the filter using the hook
    const loadedFilter = loadSavedFilter(filter as any);
    // Apply the filters to the component state
    setAdvancedFilters(loadedFilter.filters);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

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

  // Filter options for advanced search
  const filterOptions: FilterOption[] = [
    {
      key: 'from',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'to',
      label: 'To Date',
      type: 'date'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: categories.map(cat => ({ value: cat, label: cat }))
    },
    {
      key: 'facility_id',
      label: 'Facility',
      type: 'select',
      options: facilities.map(facility => ({ value: facility.id.toString(), label: facility.name }))
    },
    {
      key: 'value_numeric_min',
      label: 'Min Value',
      type: 'number',
      placeholder: 'Minimum value'
    },
    {
      key: 'value_numeric_max',
      label: 'Max Value',
      type: 'number',
      placeholder: 'Maximum value'
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      placeholder: 'e.g., kWh, kg'
    }
  ];

  // Export columns configuration
  const exportColumns: ExportColumn[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'occurred_at',
      label: 'Date & Time',
      format: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'category',
      label: 'Category'
    },
    {
      key: 'subcategory',
      label: 'Subcategory'
    },
    {
      key: 'value_numeric',
      label: 'Value'
    },
    {
      key: 'unit',
      label: 'Unit'
    },
    {
      key: 'facility_id',
      label: 'Facility ID'
    },
    {
      key: 'source_id',
      label: 'Source'
    }
  ];

  // Bulk operations
  const {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    setSelectedItems
  } = useBulkSelection<Activity>();

  const handleBulkDelete = async (items: Activity[]) => {
    // Implement bulk delete logic here
    console.log('Bulk delete items:', items);
    // For now, just show a message
    alert(`Bulk delete not implemented yet. Would delete ${items.length} items.`);
  };

  const handleBulkEdit = (items: Activity[]) => {
    // Implement bulk edit logic here
    console.log('Bulk edit items:', items);
    // For now, just show a message
    alert(`Bulk edit not implemented yet. Would edit ${items.length} items.`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 50;

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

      if (advancedFilters.from) params.from = advancedFilters.from;
      if (advancedFilters.to) params.to = advancedFilters.to;
      if (advancedFilters.category) params.category = advancedFilters.category;
      if (advancedFilters.facility_id) params.facility_id = parseInt(advancedFilters.facility_id);
      if (advancedFilters.value_numeric_min) params.value_min = advancedFilters.value_numeric_min;
      if (advancedFilters.value_numeric_max) params.value_max = advancedFilters.value_numeric_max;
      if (advancedFilters.unit) params.unit = advancedFilters.unit;

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

    const matchesCategory = !advancedFilters.category || item.category.includes(advancedFilters.category);
    const matchesFacility = !advancedFilters.facility_id || item.facility_id?.toString() === advancedFilters.facility_id;
    const matchesMinValue = !advancedFilters.value_numeric_min || item.value_numeric >= advancedFilters.value_numeric_min;
    const matchesMaxValue = !advancedFilters.value_numeric_max || item.value_numeric <= advancedFilters.value_numeric_max;
    const matchesUnit = !advancedFilters.unit || item.unit.toLowerCase().includes(advancedFilters.unit.toLowerCase());

    return matchesSearch && matchesCategory && matchesFacility && matchesMinValue && matchesMaxValue && matchesUnit;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [advancedFilters, currentPage]);

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
      <PageLayout 
        title="Activity History"
        description="View and manage your activity data"
        icon={ActivityIcon}
        actions={
          <>
            <Link
              href="/activities/new"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </Link>
            <ExportButton
              data={filteredItems}
              columns={exportColumns}
              filename={`activities_${new Date().toISOString().split('T')[0]}`}
            />
            <button
              onClick={loadActivities}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </>
        }
      >

            <AdvancedSearch
              filters={filterOptions}
              onFiltersChange={setAdvancedFilters}
              onSearch={setSearchQuery}
              searchPlaceholder="Search activities by category, unit, facility..."
              savedFilters={savedFilters}
              onSaveFilter={saveFilter}
              onLoadFilter={handleLoadFilter}
              onDeleteFilter={deleteFilter}
            />

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
            <BulkOperations
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              onBulkDelete={handleBulkDelete}
              onBulkEdit={handleBulkEdit}
            >
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700/50 bg-gray-800/50">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                selectAll(filteredItems);
                              } else {
                                clearSelection();
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </th>
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
                          <td colSpan={7} className="py-12 text-center">
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                              <RefreshCw className="w-6 h-6 animate-spin" />
                              Loading activities data...
                            </div>
                          </td>
                        </tr>
                      ) : filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-400">
                            {searchQuery || Object.values(advancedFilters).some(v => v) ?
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
                              <input
                                type="checkbox"
                                checked={isSelected(item)}
                                onChange={() => toggleSelection(item)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </td>
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
            </BulkOperations>

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