"use client";

import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Edit2, MoreHorizontal, X } from 'lucide-react';

interface BulkOperationsProps<T> {
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  onBulkDelete?: (items: T[]) => Promise<void>;
  onBulkEdit?: (items: T[]) => void;
  itemIdKey?: keyof T;
  className?: string;
  children: React.ReactNode;
}

export function BulkOperations<T extends Record<string, any>>({
  selectedItems,
  onSelectionChange,
  onBulkDelete,
  onBulkEdit,
  itemIdKey = 'id' as keyof T,
  className = '',
  children
}: BulkOperationsProps<T>) {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const isAllSelected = selectedItems.length > 0;
  const hasSelections = selectedItems.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // This would need to be implemented by parent component
      // For now, we'll just clear selections
      onSelectionChange([]);
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedItems.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBulkDeleting(true);
    try {
      await onBulkDelete(selectedItems);
      onSelectionChange([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete items. Please try again.');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleBulkEdit = () => {
    if (!onBulkEdit || selectedItems.length === 0) return;
    onBulkEdit(selectedItems);
    setShowBulkActions(false);
  };

  return (
    <div className={className}>
      {/* Bulk Actions Bar */}
      {hasSelections && (
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-blue-400">
              <CheckSquare className="w-5 h-5" />
              <span className="font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onBulkEdit && (
                <button
                  onClick={handleBulkEdit}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}

              {onBulkDelete && (
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {bulkDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="p-1.5 text-blue-400 hover:text-white transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showBulkActions && (
                  <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="text-xs text-gray-400 px-2 py-1">Bulk Actions</div>
                      {/* Additional bulk actions can be added here */}
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                        <CheckSquare className="w-4 h-4" />
                        Mark as Reviewed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectionChange([])}
            className="text-blue-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Table Header with Select All */}
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm text-gray-300">
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </span>
        </label>
      </div>

      {/* Table Content */}
      {children}
    </div>
  );
}

// Hook for managing bulk selections
export function useBulkSelection<T extends Record<string, any>>(itemIdKey: keyof T = 'id' as keyof T) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const toggleSelection = (item: T) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected[itemIdKey] === item[itemIdKey]);
      if (isSelected) {
        return prev.filter(selected => selected[itemIdKey] !== item[itemIdKey]);
      } else {
        return [...prev, item];
      }
    });
  };

  const selectAll = (items: T[]) => {
    setSelectedItems(items);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isSelected = (item: T) => {
    return selectedItems.some(selected => selected[itemIdKey] === item[itemIdKey]);
  };

  return {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    setSelectedItems
  };
}