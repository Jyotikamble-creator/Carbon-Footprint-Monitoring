"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Save, Bookmark, Calendar, ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: Date;
}

interface AdvancedSearchProps {
  filters: FilterOption[];
  onFiltersChange: (filters: Record<string, any>) => void;
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, filters: Record<string, any>) => void;
  onLoadFilter?: (filter: SavedFilter) => void;
  onDeleteFilter?: (filterId: string) => void;
  className?: string;
}

export function AdvancedSearch({
  filters,
  onFiltersChange,
  onSearch,
  searchPlaceholder = "Search...",
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  className = ""
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Update parent when filters change
  useEffect(() => {
    onFiltersChange(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length + (searchQuery ? 1 : 0);
  };

  const handleSaveFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), activeFilters);
      setSaveFilterName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setActiveFilters(filter.filters);
    setShowSavedFilters(false);
    onLoadFilter?.(filter);
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = activeFilters[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">{`All ${filter.label}`}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = value || [];
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const dropdown = document.getElementById(`dropdown-${filter.key}`);
                dropdown?.classList.toggle('hidden');
              }}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex items-center justify-between"
            >
              <span className="truncate">
                {selectedValues.length === 0
                  ? `Select ${filter.label}`
                  : `${selectedValues.length} selected`
                }
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div
              id={`dropdown-${filter.key}`}
              className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg hidden max-h-48 overflow-y-auto"
            >
              {filter.options?.map(option => (
                <label
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v: string) => v !== option.value);
                      handleFilterChange(filter.key, newValues);
                    }}
                    className="mr-2"
                  />
                  <span className="text-white">{option.label}</span>
                  {selectedValues.includes(option.value) && (
                    <Check className="w-4 h-4 ml-auto text-emerald-400" />
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        );

      case 'daterange':
        const [startDate, endDate] = value || ['', ''];
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange(filter.key, [e.target.value, endDate])}
              className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Start date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange(filter.key, [startDate, e.target.value])}
              className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="End date"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value ? Number(e.target.value) : '')}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <select
            value={value === undefined ? '' : value.toString()}
            onChange={(e) => handleFilterChange(filter.key, e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/40 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              showFilters || getActiveFilterCount() > 0
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800/60 border border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {savedFilters.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowSavedFilters(!showSavedFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                Saved
              </button>

              {showSavedFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="text-white font-medium">Saved Filters</h3>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {savedFilters.map(filter => (
                      <div
                        key={filter.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleLoadFilter(filter)}
                      >
                        <div>
                          <div className="text-white text-sm">{filter.name}</div>
                          <div className="text-gray-400 text-xs">
                            {filter.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                        {onDeleteFilter && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFilter(filter.id);
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {onSaveFilter && getActiveFilterCount() > 0 && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {searchQuery && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-emerald-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key);
            if (!filter) return null;

            let displayValue = '';
            if (filter.type === 'multiselect' && Array.isArray(value)) {
              displayValue = `${value.length} selected`;
            } else if (filter.type === 'daterange' && Array.isArray(value)) {
              displayValue = `${value[0] || '...'} to ${value[1] || '...'}`;
            } else if (filter.type === 'boolean') {
              displayValue = value ? 'Yes' : 'No';
            } else if (filter.type === 'select') {
              const option = filter.options?.find(opt => opt.value === value);
              displayValue = option?.label || value;
            } else {
              displayValue = String(value);
            }

            return (
              <span
                key={key}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
              >
                {filter.label}: {displayValue}
                <button
                  onClick={() => clearFilter(key)}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(filter => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Save Filter</h2>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter Name
                </label>
                <input
                  type="text"
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  placeholder="Enter a name for this filter"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFilter}
                  disabled={!saveFilterName.trim()}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-gray-900 rounded-lg hover:bg-emerald-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;