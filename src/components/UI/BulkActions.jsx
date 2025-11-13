// src/components/UI/BulkActions.jsx
/**
 * Bulk Actions Component for Tables
 * Enables multi-select and batch operations
 */

import React, { useState, useCallback } from 'react';
import {
  Check,
  Trash2,
  Edit,
  Download,
  Mail,
  Archive,
  MoreHorizontal,
  X
} from 'lucide-react';
import logger from '@/lib/logger';

const BulkActions = ({
  selectedItems = [],
  totalItems = 0,
  onSelectAll,
  onDeselectAll,
  actions = [],
  className = ''
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const selectedCount = selectedItems.length;
  const allSelected = selectedCount === totalItems && totalItems > 0;

  // Handle select all toggle
  const handleSelectAllToggle = useCallback(() => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  }, [allSelected, onSelectAll, onDeselectAll]);

  // Handle action execution
  const handleAction = useCallback(async (action) => {
    try {
      logger.info('Executing bulk action', {
        action: action.id,
        itemCount: selectedCount
      });

      await action.handler(selectedItems);

      setShowActionsMenu(false);
    } catch (error) {
      logger.error('Bulk action failed', {
        action: action.id,
        error: error.message
      });
    }
  }, [selectedItems, selectedCount]);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp ${className}`}>
      <div className="bg-primary-600 text-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <div className="bg-primary-700 rounded-lg p-2">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-primary-200">
              {allSelected ? 'All items selected' : `${selectedCount} of ${totalItems}`}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-primary-500"></div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {actions.slice(0, 3).map((action) => {
            const Icon = action.icon || MoreHorizontal;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800
                         rounded-lg transition-colors duration-200"
                title={action.label}
                disabled={action.disabled}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}

          {/* More Actions Dropdown */}
          {actions.length > 3 && (
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800
                         rounded-lg transition-colors duration-200"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">More</span>
              </button>

              {showActionsMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowActionsMenu(false)}
                  />

                  {/* Menu */}
                  <div className="absolute bottom-full mb-2 right-0 w-56 bg-white dark:bg-gray-800
                                rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50
                                max-h-64 overflow-y-auto">
                    {actions.slice(3).map((action, index) => {
                      const Icon = action.icon || MoreHorizontal;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleAction(action)}
                          disabled={action.disabled}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left
                                   hover:bg-gray-50 dark:hover:bg-gray-700
                                   text-gray-700 dark:text-gray-300
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-colors duration-200
                                   first:rounded-t-lg last:rounded-b-lg"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-primary-500"></div>

        {/* Select All Toggle */}
        <button
          onClick={handleSelectAllToggle}
          className="flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800
                   rounded-lg transition-colors duration-200"
        >
          {allSelected ? (
            <>
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Deselect All</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Select All</span>
            </>
          )}
        </button>

        {/* Clear Selection */}
        <button
          onClick={onDeselectAll}
          className="p-2 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          title="Clear selection"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Checkbox component for individual items
export const BulkActionCheckbox = ({ checked, onChange, id, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600
                 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 dark:bg-gray-700 dark:focus:ring-offset-gray-800
                 cursor-pointer transition-colors duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent row click
      />
      <label htmlFor={id} className="sr-only">
        Select item
      </label>
    </div>
  );
};

// Hook for managing bulk selection
export const useBulkSelection = (items = []) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleItem = useCallback((id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const getSelectedItems = useCallback(() => {
    return items.filter(item => selectedIds.has(item.id));
  }, [items, selectedIds]);

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount: selectedIds.size,
    isSelected,
    toggleItem,
    selectAll,
    deselectAll,
    getSelectedItems
  };
};

export default BulkActions;
