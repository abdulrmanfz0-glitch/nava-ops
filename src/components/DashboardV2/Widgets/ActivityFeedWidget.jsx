// NAVA OPS - Activity Feed Widget
// Real-time activity stream with smart filtering

import React, { useState, useEffect } from 'react';
import BaseWidget from '../Widget/BaseWidget';
import { ShoppingCart, Download, AlertCircle, Users, Settings, TrendingUp, FileText, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import api from '../../../services/api';
import logger from '../../../lib/logger';

export default function ActivityFeedWidget({
  widgetId,
  config = {},
  onRemove,
  onConfigure,
  dragHandleProps
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    limit = 10,
    types = ['orders', 'reports', 'alerts', 'team']
  } = config;

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch activities from API (when available)
      // For now, using mock data
      const mockActivities = generateMockActivities(limit, types);
      setActivities(mockActivities);
    } catch (err) {
      logger.error('Failed to fetch activities', { error: err.message });
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchActivities();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [limit, types]);

  return (
    <BaseWidget
      id={widgetId}
      title="Recent Activity"
      subtitle="Live system events"
      icon={Activity}
      loading={loading}
      error={error}
      onRefresh={fetchActivities}
      onRemove={onRemove}
      onConfigure={onConfigure}
      dragHandleProps={dragHandleProps}
      refreshable
    >
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              index={index}
            />
          ))}
        </AnimatePresence>

        {activities.length === 0 && !loading && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}

// Activity Item Component
function ActivityItem({ activity, index }) {
  const { type, action, details, time, branch, icon: IconName, color } = activity;

  // Icon mapping
  const iconMap = {
    ShoppingCart,
    Download,
    AlertCircle,
    Users,
    Settings,
    TrendingUp,
    FileText,
    Bell
  };

  const Icon = iconMap[IconName] || Activity;

  // Color classes
  const colorClasses = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400' },
    green: { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400' },
    red: { bg: 'bg-red-100 dark:bg-red-900/20', icon: 'text-red-600 dark:text-red-400' },
    gray: { bg: 'bg-gray-100 dark:bg-gray-800', icon: 'text-gray-600 dark:text-gray-400' }
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50
               transition-all duration-200 group cursor-pointer"
    >
      {/* Icon */}
      <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-4 h-4 ${colors.icon}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {action}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {details}
        </p>
        {branch && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {branch}
          </p>
        )}
      </div>

      {/* Time */}
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
        {formatDistanceToNow(new Date(time), { addSuffix: true })}
      </span>
    </motion.div>
  );
}

// Helper: Generate mock activities (replace with real API call)
function generateMockActivities(limit, types) {
  const activities = [
    {
      id: '1',
      type: 'orders',
      action: 'New order received',
      details: 'Order #1234 - SAR 450',
      branch: 'Downtown Branch',
      time: new Date(Date.now() - 2 * 60 * 1000),
      icon: 'ShoppingCart',
      color: 'blue'
    },
    {
      id: '2',
      type: 'orders',
      action: 'Large order completed',
      details: 'Order #1233 - SAR 1,250',
      branch: 'Westside Branch',
      time: new Date(Date.now() - 15 * 60 * 1000),
      icon: 'ShoppingCart',
      color: 'green'
    },
    {
      id: '3',
      type: 'reports',
      action: 'Monthly report generated',
      details: 'Financial Overview - March 2024',
      branch: 'All Branches',
      time: new Date(Date.now() - 1 * 60 * 60 * 1000),
      icon: 'Download',
      color: 'green'
    },
    {
      id: '4',
      type: 'alerts',
      action: 'Inventory alert',
      details: 'Low stock: Chicken Wings',
      branch: 'Westside Branch',
      time: new Date(Date.now() - 3 * 60 * 60 * 1000),
      icon: 'AlertCircle',
      color: 'orange'
    },
    {
      id: '5',
      type: 'team',
      action: 'Team member joined',
      details: 'Ahmed Hassan - Kitchen Staff',
      branch: 'Downtown Branch',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: 'Users',
      color: 'purple'
    },
    {
      id: '6',
      type: 'orders',
      action: 'Delivery order placed',
      details: 'Order #1232 - SAR 320',
      branch: 'Eastside Branch',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000),
      icon: 'ShoppingCart',
      color: 'blue'
    },
    {
      id: '7',
      type: 'reports',
      action: 'Weekly performance report',
      details: 'Branch Comparison Analysis',
      branch: 'All Branches',
      time: new Date(Date.now() - 8 * 60 * 60 * 1000),
      icon: 'FileText',
      color: 'green'
    },
    {
      id: '8',
      type: 'alerts',
      action: 'Revenue milestone',
      details: 'Daily target achieved: SAR 25,000',
      branch: 'All Branches',
      time: new Date(Date.now() - 10 * 60 * 60 * 1000),
      icon: 'TrendingUp',
      color: 'green'
    },
    {
      id: '9',
      type: 'team',
      action: 'Shift change',
      details: 'Evening shift started',
      branch: 'Downtown Branch',
      time: new Date(Date.now() - 12 * 60 * 60 * 1000),
      icon: 'Users',
      color: 'purple'
    },
    {
      id: '10',
      type: 'alerts',
      action: 'System notification',
      details: 'Backup completed successfully',
      branch: 'System',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: 'Settings',
      color: 'gray'
    }
  ];

  // Filter by types and limit
  return activities
    .filter(activity => types.includes(activity.type))
    .slice(0, limit);
}
