// NAVA OPS - Advanced Report Filters Component
// Comprehensive filtering UI for report generation

import React, { useState, useEffect } from 'react';
import { Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { TIME_PERIODS, REPORT_CATEGORIES } from '@/lib/reportTypes';
import api from '@/services/api';

export default function ReportFilters({ filters, onFilterChange, onApply }) {
  const [branches, setBranches] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters || {
    period: 'LAST_30_DAYS',
    branchId: null,
    category: null,
    comparison: false,
    customStartDate: '',
    customEndDate: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await api.branches.getAll();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    if (onFilterChange) {
      onFilterChange(updated);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(localFilters);
    }
  };

  const handleClear = () => {
    const cleared = {
      period: 'LAST_30_DAYS',
      branchId: null,
      category: null,
      comparison: false,
      customStartDate: '',
      customEndDate: ''
    };
    setLocalFilters(cleared);
    if (onFilterChange) {
      onFilterChange(cleared);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Filters</h3>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Period
          </label>
          <select
            value={localFilters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(TIME_PERIODS).map(([key, period]) => (
              <option key={key} value={key}>{period.label}</option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Branch
          </label>
          <select
            value={localFilters.branchId || ''}
            onChange={(e) => handleFilterChange('branchId', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.city}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {Object.entries(REPORT_CATEGORIES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Date Range */}
            {localFilters.period === 'CUSTOM' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={localFilters.customStartDate}
                    onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={localFilters.customEndDate}
                    onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Comparison Mode */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="comparison"
                checked={localFilters.comparison}
                onChange={(e) => handleFilterChange('comparison', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="comparison" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Period Comparison
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                   rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                   transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}
