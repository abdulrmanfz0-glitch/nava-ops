// src/components/UI/AdvancedSearch.jsx
/**
 * Advanced Search Component with Filters, Sorting, and Export
 * Enterprise-grade search functionality
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, X, Download, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { exportUtils } from '@/utils/exportUtils';
import logger from '@/lib/logger';

const AdvancedSearch = ({
  data = [],
  onSearch,
  filters = [],
  exportFilename = 'export',
  placeholder = 'Search...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Search logic
  const performSearch = useCallback((term, filters, data) => {
    let results = [...data];

    // Apply text search
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        results = results.filter(item => {
          const itemValue = item[key];

          // Handle different filter types
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }

          if (typeof value === 'object' && value.min !== undefined) {
            // Range filter
            return itemValue >= value.min && itemValue <= value.max;
          }

          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      results.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === 'string') {
          return sortOrder === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return results;
  }, [sortBy, sortOrder]);

  // Memoized results
  const searchResults = useMemo(() => {
    return performSearch(searchTerm, activeFilters, data);
  }, [searchTerm, activeFilters, data, performSearch]);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (onSearch) {
      onSearch(value, activeFilters);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value
    };

    setActiveFilters(newFilters);

    if (onSearch) {
      onSearch(searchTerm, newFilters);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});

    if (onSearch) {
      onSearch('', {});
    }
  };

  // Export results
  const handleExport = (format) => {
    try {
      const dataToExport = searchResults.length > 0 ? searchResults : data;

      switch (format) {
        case 'csv':
          exportUtils.exportToCSV(dataToExport, exportFilename);
          break;
        case 'json':
          exportUtils.exportToJSON(dataToExport, exportFilename);
          break;
        default:
          logger.warn('Unsupported export format', { format });
      }
    } catch (error) {
      logger.error('Export failed', { error: error.message });
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== 'all').length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-200"
            aria-label="Search"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Export Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Export options"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Export Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <button
              onClick={() => handleExport('csv')}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300
                       first:rounded-t-lg transition-colors duration-200"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300
                       last:rounded-b-lg transition-colors duration-200"
            >
              Export as JSON
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || activeFilterCount > 0) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                     transition-colors duration-200"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700
                      animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {filter.label}
                </label>

                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || 'all'}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="all">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'checkbox' && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key]?.includes(option.value) || false}
                          onChange={(e) => {
                            const currentValues = activeFilters[filter.key] || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option.value]
                              : currentValues.filter(v => v !== option.value);
                            handleFilterChange(filter.key, newValues);
                          }}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min}
                      max={filter.max}
                      value={activeFilters[filter.key] || filter.min}
                      onChange={(e) => handleFilterChange(filter.key, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{filter.min}</span>
                      <span>{activeFilters[filter.key] || filter.min}</span>
                      <span>{filter.max}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {searchResults.length} of {data.length} results
        </span>
      </div>
    </div>
  );
};

export default AdvancedSearch;
