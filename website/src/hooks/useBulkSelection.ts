"use client";

import { useState, useCallback } from 'react';

export function useBulkSelection<T extends { id: number | string }>() {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const toggleSelection = useCallback((item: T) => {
    setSelectedItems(prev =>
      prev.some(selected => selected.id === item.id)
        ? prev.filter(selected => selected.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isSelected = useCallback((item: T) => {
    return selectedItems.some(selected => selected.id === item.id);
  }, [selectedItems]);

  return {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    setSelectedItems
  };
}