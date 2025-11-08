import { useState, useEffect } from 'react';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: Date;
  page: string; // Which page this filter belongs to
}

const STORAGE_KEY = 'ecotrack_saved_filters';

export function useSavedFilters(page: string) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allFilters: SavedFilter[] = JSON.parse(stored).map((filter: any) => ({
          ...filter,
          createdAt: new Date(filter.createdAt)
        }));
        // Filter by page
        setSavedFilters(allFilters.filter(f => f.page === page));
      }
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
  }, [page]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allFilters: SavedFilter[] = stored ? JSON.parse(stored) : [];

      // Remove existing filters for this page
      const otherFilters = allFilters.filter(f => f.page !== page);

      // Add current page filters
      const updatedFilters = [...otherFilters, ...savedFilters];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters));
    } catch (error) {
      console.error('Failed to save filters:', error);
    }
  }, [savedFilters, page]);

  const saveFilter = (name: string, filters: Record<string, any>) => {
    const newFilter: SavedFilter = {
      id: `${page}_${Date.now()}_${Math.random()}`,
      name,
      filters,
      createdAt: new Date(),
      page
    };

    setSavedFilters(prev => [...prev, newFilter]);
  };

  const deleteFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const loadFilter = (filter: SavedFilter) => {
    // This is handled by the component, just return the filter
    return filter;
  };

  return {
    savedFilters,
    saveFilter,
    deleteFilter,
    loadFilter
  };
}