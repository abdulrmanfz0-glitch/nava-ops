// src/components/ActivityLog/ActivityLogViewer.jsx
/**
 * Activity Log Viewer Component
 * Displays user activities with filtering and search
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Filter,
  Search,
  Download,
  Calendar,
  User,
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatDateTime } from '@/utils/exportUtils';

const ACTIVITY_TYPES = {
  create: { label: 'Created', color: 'text-green-600 bg-green-50 dark:bg-green-900/20', icon: '✨' },
  update: { label: 'Updated', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', icon: '✏️' },
  delete: { label: 'Deleted', color: 'text-red-600 bg-red-50 dark:bg-red-900/20', icon: '🗑️' },
  login: { label: 'Logged in', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', icon: '🔑' },
  logout: { label: 'Logged out', color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20', icon: '👋' },
  export: { label: 'Exported', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20', icon: '📥' },
  import: { label: 'Imported', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20', icon: '📤' },
  view: { label: 'Viewed', color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20', icon: '👁️' }
};

const ActivityLogViewer = ({ activities = [], onExport, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          activity.description?.toLowerCase().includes(searchLower) ||
          activity.user_name?.toLowerCase().includes(searchLower) ||
          activity.resource?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && activity.action !== typeFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const activityDate = new Date(activity.created_at);
        const now = new Date();

        switch (dateFilter) {
          case 'today':
            return activityDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return activityDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return activityDate >= monthAgo;
          default:
            return true;
        }
      }

      return true;
    });
  }, [activities, searchTerm, typeFilter, dateFilter]);

  // Group by date
  const groupedActivities = useMemo(() => {
    const groups = {};

    filteredActivities.forEach(activity => {
      const date = new Date(activity.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(activity);
    });

    return groups;
  }, [filteredActivities]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Activity Log
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track all actions and changes
            </p>
          </div>

          {onExport && (
            <button
              onClick={() => onExport(filteredActivities)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700
                       text-white rounded-lg transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600
                       rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-all duration-200"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600
                       rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-all duration-200"
            >
              <option value="all">All Types</option>
              {Object.entries(ACTIVITY_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600
                       rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-all duration-200"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-6">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <Activity className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Activities Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || typeFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Activities will appear here as actions are performed'}
            </p>
          </div>
        ) : (
          Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {/* Date Header */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {date}
                </h3>
              </div>

              {/* Activities List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dateActivities.map((activity) => {
                  const typeConfig = ACTIVITY_TYPES[activity.action] || ACTIVITY_TYPES.view;

                  return (
                    <div
                      key={activity.id}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig.color}`}>
                          <span className="text-xl">{typeConfig.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {activity.description || `${typeConfig.label} ${activity.resource}`}
                              </p>

                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {activity.user_name || 'Unknown User'}
                                </span>

                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(activity.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>

                                {activity.ip_address && (
                                  <span className="flex items-center gap-1">
                                    📍 {activity.ip_address}
                                  </span>
                                )}
                              </div>
                            </div>

                            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          </div>

                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSelectedActivity(null)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Activity Details
                </h3>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Action</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedActivity.action}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedActivity.description}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">User</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{selectedActivity.user_name}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(selectedActivity.created_at).toLocaleString()}
                    </dd>
                  </div>

                  {selectedActivity.metadata && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Metadata</dt>
                      <dd className="mt-1">
                        <pre className="text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(selectedActivity.metadata, null, 2)}
                        </pre>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                           text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogViewer;
