// NAVA OPS - Widget Marketplace
// Beautiful widget library with search, filter, and preview

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Plus,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart3,
  Activity,
  Sparkles,
  Calendar,
  MapPin,
  Package,
  AlertCircle,
  Target,
  PieChart
} from 'lucide-react';
import { dashboardTheme, getColorTheme } from '@/styles/dashboardTheme';

// Available widgets catalog
const WIDGET_CATALOG = [
  {
    id: 'revenue-metric',
    name: 'Total Revenue',
    description: 'Track your total revenue with trends and sparklines',
    icon: DollarSign,
    category: 'metrics',
    color: 'success',
    size: { w: 1, h: 1 },
    popular: true
  },
  {
    id: 'orders-metric',
    name: 'Total Orders',
    description: 'Monitor order volume and growth trends',
    icon: ShoppingCart,
    category: 'metrics',
    color: 'primary',
    size: { w: 1, h: 1 },
    popular: true
  },
  {
    id: 'customers-metric',
    name: 'Active Customers',
    description: 'See customer engagement and retention',
    icon: Users,
    category: 'metrics',
    color: 'purple',
    size: { w: 1, h: 1 },
    popular: true
  },
  {
    id: 'aov-metric',
    name: 'Avg Order Value',
    description: 'Track average transaction size',
    icon: TrendingUp,
    category: 'metrics',
    color: 'cyan',
    size: { w: 1, h: 1 },
    popular: false
  },
  {
    id: 'revenue-chart',
    name: 'Revenue Trends',
    description: 'Interactive revenue chart with daily/weekly/monthly views',
    icon: BarChart3,
    category: 'charts',
    color: 'primary',
    size: { w: 2, h: 1 },
    popular: true
  },
  {
    id: 'branch-comparison',
    name: 'Branch Performance',
    description: 'Compare performance across all locations',
    icon: MapPin,
    category: 'charts',
    color: 'warning',
    size: { w: 2, h: 1 },
    popular: true
  },
  {
    id: 'category-breakdown',
    name: 'Category Breakdown',
    description: 'Sales by product category with pie chart',
    icon: PieChart,
    category: 'charts',
    color: 'purple',
    size: { w: 1, h: 1 },
    popular: false
  },
  {
    id: 'smart-insights',
    name: 'Smart Insights',
    description: 'AI-powered recommendations and actionable insights',
    icon: Sparkles,
    category: 'analytics',
    color: 'purple',
    size: { w: 1, h: 2 },
    popular: true
  },
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    description: 'Real-time updates on orders and events',
    icon: Activity,
    category: 'feeds',
    color: 'cyan',
    size: { w: 1, h: 2 },
    popular: false
  },
  {
    id: 'top-products',
    name: 'Top Products',
    description: 'Best-selling items and inventory alerts',
    icon: Package,
    category: 'analytics',
    color: 'success',
    size: { w: 1, h: 1 },
    popular: false
  },
  {
    id: 'goals-tracker',
    name: 'Goals Tracker',
    description: 'Track progress towards business goals',
    icon: Target,
    category: 'analytics',
    color: 'primary',
    size: { w: 2, h: 1 },
    popular: false
  },
  {
    id: 'alerts-widget',
    name: 'Alerts & Notifications',
    description: 'Important alerts and system notifications',
    icon: AlertCircle,
    category: 'operations',
    color: 'danger',
    size: { w: 1, h: 1 },
    popular: false
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Widgets', icon: BarChart3 },
  { id: 'metrics', name: 'Metrics', icon: TrendingUp },
  { id: 'charts', name: 'Charts', icon: BarChart3 },
  { id: 'analytics', name: 'Analytics', icon: Sparkles },
  { id: 'feeds', name: 'Feeds', icon: Activity },
  { id: 'operations', name: 'Operations', icon: Target }
];

export default function WidgetMarketplace({ isOpen, onClose, onAddWidget }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Filter widgets
  const filteredWidgets = useMemo(() => {
    return WIDGET_CATALOG.filter(widget => {
      // Search filter
      const matchesSearch = widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           widget.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;

      // Popular filter
      const matchesPopular = !showPopularOnly || widget.popular;

      return matchesSearch && matchesCategory && matchesPopular;
    });
  }, [searchQuery, selectedCategory, showPopularOnly]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            w-full max-w-4xl max-h-[85vh] flex flex-col
            ${dashboardTheme.glass.combined}
            rounded-2xl shadow-2xl overflow-hidden
          `}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Widget Marketplace
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add widgets to customize your dashboard
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-colors"
                />
              </div>
              <button
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${showPopularOnly
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex gap-2">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 whitespace-nowrap
                      ${isSelected
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Widget Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredWidgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No widgets found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWidgets.map((widget, index) => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    index={index}
                    onAdd={() => {
                      onAddWidget(widget);
                      onClose();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Widget card component
function WidgetCard({ widget, index, onAdd }) {
  const Icon = widget.icon;
  const colorTheme = getColorTheme(widget.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`
        relative p-4 rounded-xl
        ${dashboardTheme.glass.combined}
        ${dashboardTheme.card.elevated}
        hover:shadow-xl transition-all duration-300
        group cursor-pointer
      `}
      onClick={onAdd}
    >
      {/* Popular badge */}
      {widget.popular && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold">
          ★ Popular
        </div>
      )}

      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-xl ${colorTheme.bg} ${colorTheme.border} border
        flex items-center justify-center mb-3
        group-hover:scale-110 transition-transform duration-300
      `}>
        <Icon className={`w-6 h-6 ${colorTheme.text}`} />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {widget.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {widget.description}
      </p>

      {/* Size indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Size: {widget.size.w}x{widget.size.h}
        </span>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg bg-primary-600 text-white
                   opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}
