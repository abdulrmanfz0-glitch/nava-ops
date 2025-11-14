// NAVA OPS - Base Widget Component
// Foundation for all dashboard widgets with drag-drop, resize, and customization

import React, { useState } from 'react';
import { GripVertical, Maximize2, Minimize2, RefreshCw, Settings, X } from 'lucide-react';

export default function BaseWidget({
  id,
  title,
  subtitle,
  icon: Icon,
  children,
  loading = false,
  error = null,
  onRefresh,
  onRemove,
  onConfigure,
  className = '',
  headerActions,
  size = 'default', // 'small' | 'default' | 'large'
  variant = 'card', // 'card' | 'flat' | 'bordered'
  collapsible = false,
  refreshable = true,
  removable = true,
  configurable = false,
  dragHandleProps, // For drag-drop libraries
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'min-h-[200px]',
    default: 'min-h-[300px]',
    large: 'min-h-[400px]'
  };

  // Variant classes
  const variantClasses = {
    card: 'bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800',
    flat: 'bg-transparent',
    bordered: 'bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700'
  };

  return (
    <div
      className={`
        group relative overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-md
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Drag Handle */}
          {dragHandleProps && (
            <button
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100
                       transition-opacity duration-200 text-gray-400 hover:text-gray-600
                       dark:hover:text-gray-300"
              aria-label="Drag widget"
            >
              <GripVertical className="w-5 h-5" />
            </button>
          )}

          {/* Icon */}
          {Icon && (
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/30">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {headerActions}

          {/* Refresh Button */}
          {refreshable && onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       dark:hover:text-gray-300 dark:hover:bg-gray-800
                       transition-all duration-200 disabled:opacity-50"
              aria-label="Refresh widget"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Collapse Button */}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       dark:hover:text-gray-300 dark:hover:bg-gray-800
                       transition-all duration-200"
              aria-label={isCollapsed ? 'Expand widget' : 'Collapse widget'}
            >
              {isCollapsed ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Configure Button */}
          {configurable && onConfigure && (
            <button
              onClick={onConfigure}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       dark:hover:text-gray-300 dark:hover:bg-gray-800
                       transition-all duration-200"
              aria-label="Configure widget"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Remove Button */}
          {removable && onRemove && (
            <button
              onClick={onRemove}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50
                       dark:hover:text-red-400 dark:hover:bg-red-900/20
                       transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Remove widget"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      {!isCollapsed && (
        <div className="p-4">
          {loading ? (
            <WidgetLoading />
          ) : error ? (
            <WidgetError error={error} onRetry={onRefresh} />
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}

// Loading State
function WidgetLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500
                     rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Error State
function WidgetError({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 bg-error-100 dark:bg-error-900/20 rounded-full
                     flex items-center justify-center mx-auto mb-3">
          <X className="w-6 h-6 text-error-600 dark:text-error-400" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Failed to load widget
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {error?.message || 'An error occurred'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white
                     rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
