// NAVA OPS - Widget Registry
// Catalog of all available dashboard widgets

import {
  DollarSign,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Bell,
  Target,
  Package,
  Clock
} from 'lucide-react';

// Widget categories for organization
export const WIDGET_CATEGORIES = {
  METRICS: 'metrics',
  CHARTS: 'charts',
  FEEDS: 'feeds',
  ANALYTICS: 'analytics',
  OPERATIONS: 'operations'
};

// Widget sizes (grid units)
export const WIDGET_SIZES = {
  SMALL: { w: 1, h: 1, minW: 1, minH: 1 },      // 1x1 - Single metric
  MEDIUM: { w: 2, h: 1, minW: 2, minH: 1 },     // 2x1 - Chart or metrics pair
  LARGE: { w: 2, h: 2, minW: 2, minH: 2 },      // 2x2 - Detailed charts
  WIDE: { w: 4, h: 1, minW: 2, minH: 1 },       // 4x1 - Full-width chart
  TALL: { w: 1, h: 2, minW: 1, minH: 2 }        // 1x2 - Activity feed
};

// Available widget types
export const WIDGET_TYPES = {
  // === METRICS WIDGETS ===
  REVENUE_METRIC: {
    id: 'revenue_metric',
    name: 'Revenue',
    description: 'Total revenue with trend',
    category: WIDGET_CATEGORIES.METRICS,
    icon: DollarSign,
    defaultSize: WIDGET_SIZES.SMALL,
    component: 'MetricWidget',
    config: {
      metric: 'revenue',
      format: 'currency',
      showTrend: true,
      showSparkline: true,
      color: 'green'
    }
  },

  ORDERS_METRIC: {
    id: 'orders_metric',
    name: 'Orders',
    description: 'Total orders with trend',
    category: WIDGET_CATEGORIES.METRICS,
    icon: ShoppingCart,
    defaultSize: WIDGET_SIZES.SMALL,
    component: 'MetricWidget',
    config: {
      metric: 'orders',
      format: 'number',
      showTrend: true,
      showSparkline: true,
      color: 'blue'
    }
  },

  BRANCHES_METRIC: {
    id: 'branches_metric',
    name: 'Active Branches',
    description: 'Number of active locations',
    category: WIDGET_CATEGORIES.METRICS,
    icon: Store,
    defaultSize: WIDGET_SIZES.SMALL,
    component: 'MetricWidget',
    config: {
      metric: 'activeBranches',
      format: 'number',
      showTrend: false,
      color: 'purple'
    }
  },

  AVG_ORDER_VALUE: {
    id: 'avg_order_value',
    name: 'Avg Order Value',
    description: 'Average transaction value',
    category: WIDGET_CATEGORIES.METRICS,
    icon: TrendingUp,
    defaultSize: WIDGET_SIZES.SMALL,
    component: 'MetricWidget',
    config: {
      metric: 'averageOrderValue',
      format: 'currency',
      showTrend: true,
      showSparkline: true,
      color: 'orange'
    }
  },

  CUSTOMERS_METRIC: {
    id: 'customers_metric',
    name: 'Active Customers',
    description: 'Total active customers',
    category: WIDGET_CATEGORIES.METRICS,
    icon: Users,
    defaultSize: WIDGET_SIZES.SMALL,
    component: 'MetricWidget',
    config: {
      metric: 'activeCustomers',
      format: 'number',
      showTrend: true,
      color: 'indigo'
    }
  },

  // === CHART WIDGETS ===
  REVENUE_TREND: {
    id: 'revenue_trend',
    name: 'Revenue Trend',
    description: 'Revenue over time',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: BarChart3,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'ChartWidget',
    config: {
      chartType: 'line',
      metric: 'revenue',
      period: 'last_30_days'
    }
  },

  ORDERS_CHART: {
    id: 'orders_chart',
    name: 'Orders Chart',
    description: 'Orders over time',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: BarChart3,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'ChartWidget',
    config: {
      chartType: 'bar',
      metric: 'orders',
      period: 'last_30_days'
    }
  },

  BRANCH_COMPARISON: {
    id: 'branch_comparison',
    name: 'Branch Performance',
    description: 'Compare branch metrics',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: Store,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'BranchComparisonWidget',
    config: {
      metric: 'revenue',
      limit: 5
    }
  },

  CATEGORY_DISTRIBUTION: {
    id: 'category_distribution',
    name: 'Category Mix',
    description: 'Revenue by category',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: PieChart,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'ChartWidget',
    config: {
      chartType: 'pie',
      metric: 'categoryRevenue'
    }
  },

  // === FEED WIDGETS ===
  ACTIVITY_FEED: {
    id: 'activity_feed',
    name: 'Recent Activity',
    description: 'Latest system events',
    category: WIDGET_CATEGORIES.FEEDS,
    icon: Activity,
    defaultSize: WIDGET_SIZES.TALL,
    component: 'ActivityFeedWidget',
    config: {
      limit: 10,
      types: ['orders', 'reports', 'alerts', 'team']
    }
  },

  INSIGHTS_FEED: {
    id: 'insights_feed',
    name: 'AI Insights',
    description: 'Smart recommendations',
    category: WIDGET_CATEGORIES.FEEDS,
    icon: Zap,
    defaultSize: WIDGET_SIZES.LARGE,
    component: 'InsightsFeedWidget',
    config: {
      limit: 5,
      severity: ['critical', 'warning', 'info']
    }
  },

  NOTIFICATIONS_FEED: {
    id: 'notifications_feed',
    name: 'Notifications',
    description: 'Alerts and updates',
    category: WIDGET_CATEGORIES.FEEDS,
    icon: Bell,
    defaultSize: WIDGET_SIZES.TALL,
    component: 'NotificationsFeedWidget',
    config: {
      limit: 10,
      unreadOnly: false
    }
  },

  // === ANALYTICS WIDGETS ===
  HEALTH_SCORE: {
    id: 'health_score',
    name: 'Business Health',
    description: 'Overall health score',
    category: WIDGET_CATEGORIES.ANALYTICS,
    icon: Target,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'HealthScoreWidget',
    config: {
      showBreakdown: true
    }
  },

  TOP_PRODUCTS: {
    id: 'top_products',
    name: 'Top Products',
    description: 'Best selling items',
    category: WIDGET_CATEGORIES.ANALYTICS,
    icon: Package,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'TopProductsWidget',
    config: {
      limit: 5,
      metric: 'revenue'
    }
  },

  PEAK_HOURS: {
    id: 'peak_hours',
    name: 'Peak Hours',
    description: 'Busiest times of day',
    category: WIDGET_CATEGORIES.ANALYTICS,
    icon: Clock,
    defaultSize: WIDGET_SIZES.MEDIUM,
    component: 'PeakHoursWidget',
    config: {
      metric: 'orders'
    }
  }
};

// Get widgets by category
export function getWidgetsByCategory(category) {
  return Object.values(WIDGET_TYPES).filter(
    widget => widget.category === category
  );
}

// Get widget by ID
export function getWidgetById(id) {
  return Object.values(WIDGET_TYPES).find(widget => widget.id === id);
}

// Default dashboard layouts by role
export const DEFAULT_LAYOUTS = {
  owner: [
    { i: 'revenue_metric', x: 0, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'orders_metric', x: 1, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'avg_order_value', x: 2, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'branches_metric', x: 3, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'revenue_trend', x: 0, y: 1, ...WIDGET_SIZES.MEDIUM },
    { i: 'branch_comparison', x: 2, y: 1, ...WIDGET_SIZES.MEDIUM },
    { i: 'insights_feed', x: 0, y: 2, ...WIDGET_SIZES.LARGE },
    { i: 'activity_feed', x: 2, y: 2, ...WIDGET_SIZES.TALL }
  ],

  manager: [
    { i: 'revenue_metric', x: 0, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'orders_metric', x: 1, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'avg_order_value', x: 2, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'revenue_trend', x: 0, y: 1, ...WIDGET_SIZES.MEDIUM },
    { i: 'orders_chart', x: 2, y: 1, ...WIDGET_SIZES.MEDIUM },
    { i: 'activity_feed', x: 0, y: 2, ...WIDGET_SIZES.TALL },
    { i: 'top_products', x: 1, y: 2, ...WIDGET_SIZES.MEDIUM }
  ],

  analyst: [
    { i: 'revenue_metric', x: 0, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'orders_metric', x: 1, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'customers_metric', x: 2, y: 0, ...WIDGET_SIZES.SMALL },
    { i: 'health_score', x: 0, y: 1, ...WIDGET_SIZES.MEDIUM },
    { i: 'category_distribution', x: 2, y: 1, ...WIDGET_SIZES.MEDIUM },
    { i: 'revenue_trend', x: 0, y: 2, ...WIDGET_SIZES.WIDE },
    { i: 'insights_feed', x: 0, y: 3, ...WIDGET_SIZES.LARGE }
  ]
};

// Get default layout for user role
export function getDefaultLayout(role = 'manager') {
  return DEFAULT_LAYOUTS[role] || DEFAULT_LAYOUTS.manager;
}
