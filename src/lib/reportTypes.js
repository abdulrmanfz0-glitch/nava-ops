// NAVA OPS - Enterprise Report Type Definitions
// Comprehensive type system for all report types

/**
 * Report Categories
 */
export const REPORT_CATEGORIES = {
  FINANCIAL: 'financial',
  OPERATIONAL: 'operational',
  PERFORMANCE: 'performance',
  CUSTOMER: 'customer',
  INVENTORY: 'inventory',
  STAFF: 'staff',
  COMPARATIVE: 'comparative',
  ANOMALY: 'anomaly',
  EXECUTIVE: 'executive',
  CUSTOM: 'custom'
};

/**
 * Report Types with detailed configurations
 */
export const REPORT_TYPES = {
  // Financial Reports
  FINANCIAL_OVERVIEW: {
    id: 'financial_overview',
    category: REPORT_CATEGORIES.FINANCIAL,
    name: 'Financial Overview',
    description: 'Comprehensive financial analysis including P&L, revenue, expenses',
    icon: 'DollarSign',
    color: 'green',
    metrics: ['revenue', 'expenses', 'profit', 'margin', 'cash_flow'],
    charts: ['revenue_trend', 'expense_breakdown', 'profit_margin'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel', 'csv']
  },
  PROFIT_LOSS: {
    id: 'profit_loss',
    category: REPORT_CATEGORIES.FINANCIAL,
    name: 'Profit & Loss Statement',
    description: 'Detailed P&L statement with revenue, COGS, expenses',
    icon: 'TrendingUp',
    color: 'blue',
    metrics: ['gross_revenue', 'cogs', 'gross_profit', 'operating_expenses', 'net_profit'],
    charts: ['waterfall_chart', 'expense_categories'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },
  CASH_FLOW: {
    id: 'cash_flow',
    category: REPORT_CATEGORIES.FINANCIAL,
    name: 'Cash Flow Analysis',
    description: 'Cash flow statement and liquidity analysis',
    icon: 'Wallet',
    color: 'purple',
    metrics: ['cash_in', 'cash_out', 'net_cash', 'cash_balance'],
    charts: ['cash_flow_timeline', 'cash_sources'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },

  // Operational Reports
  SALES_PERFORMANCE: {
    id: 'sales_performance',
    category: REPORT_CATEGORIES.OPERATIONAL,
    name: 'Sales Performance',
    description: 'Sales metrics, trends, and channel analysis',
    icon: 'ShoppingCart',
    color: 'orange',
    metrics: ['total_sales', 'order_count', 'avg_order_value', 'conversion_rate'],
    charts: ['sales_trend', 'channel_breakdown', 'hourly_sales'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel', 'csv']
  },
  MENU_ENGINEERING: {
    id: 'menu_engineering',
    category: REPORT_CATEGORIES.OPERATIONAL,
    name: 'Menu Engineering',
    description: 'Menu item performance using BCG matrix analysis',
    icon: 'UtensilsCrossed',
    color: 'red',
    metrics: ['item_sales', 'item_profit', 'item_popularity', 'contribution_margin'],
    charts: ['bcg_matrix', 'top_items', 'item_trends'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },
  CHANNEL_PERFORMANCE: {
    id: 'channel_performance',
    category: REPORT_CATEGORIES.OPERATIONAL,
    name: 'Channel Performance',
    description: 'Analysis across dine-in, takeout, delivery channels',
    icon: 'Layers',
    color: 'indigo',
    metrics: ['channel_revenue', 'channel_orders', 'channel_growth'],
    charts: ['channel_comparison', 'channel_trends'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel', 'csv']
  },

  // Performance Reports
  BRANCH_PERFORMANCE: {
    id: 'branch_performance',
    category: REPORT_CATEGORIES.PERFORMANCE,
    name: 'Branch Performance',
    description: 'Individual branch metrics and KPIs',
    icon: 'Building',
    color: 'cyan',
    metrics: ['branch_revenue', 'branch_orders', 'staff_efficiency', 'customer_satisfaction'],
    charts: ['branch_comparison', 'performance_scorecard'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },
  STAFF_PRODUCTIVITY: {
    id: 'staff_productivity',
    category: REPORT_CATEGORIES.PERFORMANCE,
    name: 'Staff Productivity',
    description: 'Staff performance, efficiency, and scheduling analysis',
    icon: 'Users',
    color: 'teal',
    metrics: ['orders_per_staff', 'revenue_per_staff', 'shift_efficiency'],
    charts: ['staff_comparison', 'shift_analysis'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },

  // Customer Reports
  CUSTOMER_INSIGHTS: {
    id: 'customer_insights',
    category: REPORT_CATEGORIES.CUSTOMER,
    name: 'Customer Insights',
    description: 'Customer behavior, preferences, and satisfaction',
    icon: 'UserCheck',
    color: 'pink',
    metrics: ['customer_count', 'repeat_rate', 'avg_lifetime_value', 'satisfaction_score'],
    charts: ['customer_segments', 'behavior_patterns', 'satisfaction_trends'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },
  LOYALTY_ANALYSIS: {
    id: 'loyalty_analysis',
    category: REPORT_CATEGORIES.CUSTOMER,
    name: 'Loyalty Analysis',
    description: 'Customer retention and loyalty program performance',
    icon: 'Award',
    color: 'yellow',
    metrics: ['retention_rate', 'churn_rate', 'loyalty_members', 'redemption_rate'],
    charts: ['retention_cohorts', 'loyalty_trends'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },

  // Comparative Reports
  BRANCH_COMPARISON: {
    id: 'branch_comparison',
    category: REPORT_CATEGORIES.COMPARATIVE,
    name: 'Branch-to-Branch Comparison',
    description: 'Side-by-side comparison of branch performance',
    icon: 'GitCompare',
    color: 'violet',
    metrics: ['comparative_revenue', 'comparative_efficiency', 'ranking'],
    charts: ['comparison_table', 'ranking_chart', 'gap_analysis'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },
  PERIOD_COMPARISON: {
    id: 'period_comparison',
    category: REPORT_CATEGORIES.COMPARATIVE,
    name: 'Period Comparison',
    description: 'Compare performance across different time periods',
    icon: 'Calendar',
    color: 'lime',
    metrics: ['period_revenue', 'period_growth', 'yoy_comparison'],
    charts: ['period_bars', 'growth_trends'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel', 'csv']
  },

  // Anomaly Reports
  ANOMALY_DETECTION: {
    id: 'anomaly_detection',
    category: REPORT_CATEGORIES.ANOMALY,
    name: 'Anomaly Detection',
    description: 'Automatic detection of unusual patterns and outliers',
    icon: 'AlertTriangle',
    color: 'red',
    metrics: ['anomaly_count', 'severity_distribution', 'impact_analysis'],
    charts: ['anomaly_timeline', 'severity_chart'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },
  VARIANCE_ANALYSIS: {
    id: 'variance_analysis',
    category: REPORT_CATEGORIES.ANOMALY,
    name: 'Variance Analysis',
    description: 'Budget vs actual variance analysis',
    icon: 'Target',
    color: 'orange',
    metrics: ['budget_variance', 'forecast_accuracy'],
    charts: ['variance_waterfall', 'accuracy_chart'],
    aiInsights: true,
    exportFormats: ['pdf', 'excel']
  },

  // Executive Reports
  EXECUTIVE_SUMMARY: {
    id: 'executive_summary',
    category: REPORT_CATEGORIES.EXECUTIVE,
    name: 'Executive Summary',
    description: 'High-level overview with key metrics and insights',
    icon: 'Crown',
    color: 'gold',
    metrics: ['all_kpis'],
    charts: ['kpi_dashboard', 'executive_scorecard'],
    aiInsights: true,
    exportFormats: ['pdf']
  },
  BOARD_REPORT: {
    id: 'board_report',
    category: REPORT_CATEGORIES.EXECUTIVE,
    name: 'Board Report',
    description: 'Comprehensive report for board meetings',
    icon: 'FileText',
    color: 'gray',
    metrics: ['strategic_kpis', 'growth_metrics', 'risk_indicators'],
    charts: ['strategic_dashboard', 'growth_chart'],
    aiInsights: true,
    exportFormats: ['pdf']
  }
};

/**
 * Report Time Periods
 */
export const TIME_PERIODS = {
  TODAY: { id: 'today', label: 'Today', days: 1 },
  YESTERDAY: { id: 'yesterday', label: 'Yesterday', days: 1, offset: 1 },
  LAST_7_DAYS: { id: 'last_7', label: 'Last 7 Days', days: 7 },
  LAST_30_DAYS: { id: 'last_30', label: 'Last 30 Days', days: 30 },
  THIS_WEEK: { id: 'this_week', label: 'This Week', type: 'week' },
  LAST_WEEK: { id: 'last_week', label: 'Last Week', type: 'week', offset: 1 },
  THIS_MONTH: { id: 'this_month', label: 'This Month', type: 'month' },
  LAST_MONTH: { id: 'last_month', label: 'Last Month', type: 'month', offset: 1 },
  THIS_QUARTER: { id: 'this_quarter', label: 'This Quarter', type: 'quarter' },
  LAST_QUARTER: { id: 'last_quarter', label: 'Last Quarter', type: 'quarter', offset: 1 },
  THIS_YEAR: { id: 'this_year', label: 'This Year', type: 'year' },
  LAST_YEAR: { id: 'last_year', label: 'Last Year', type: 'year', offset: 1 },
  CUSTOM: { id: 'custom', label: 'Custom Range', type: 'custom' }
};

/**
 * Export Formats
 */
export const EXPORT_FORMATS = {
  PDF: { id: 'pdf', label: 'PDF', icon: 'FileText', mime: 'application/pdf' },
  EXCEL: { id: 'excel', label: 'Excel', icon: 'FileSpreadsheet', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  CSV: { id: 'csv', label: 'CSV', icon: 'Table', mime: 'text/csv' },
  JSON: { id: 'json', label: 'JSON', icon: 'Code', mime: 'application/json' }
};

/**
 * Report Status
 */
export const REPORT_STATUS = {
  DRAFT: 'draft',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SCHEDULED: 'scheduled'
};

/**
 * Report Filters
 */
export const FILTER_TYPES = {
  BRANCH: 'branch',
  DATE_RANGE: 'date_range',
  CATEGORY: 'category',
  METRIC: 'metric',
  COMPARISON: 'comparison'
};

/**
 * Get report type by ID
 */
export const getReportType = (id) => {
  return Object.values(REPORT_TYPES).find(type => type.id === id);
};

/**
 * Get reports by category
 */
export const getReportsByCategory = (category) => {
  return Object.values(REPORT_TYPES).filter(type => type.category === category);
};

/**
 * Calculate date range from period
 */
export const calculateDateRange = (period) => {
  const now = new Date();
  let startDate, endDate = new Date();

  const periodConfig = TIME_PERIODS[period.toUpperCase()] || TIME_PERIODS.LAST_30_DAYS;

  if (periodConfig.days) {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - periodConfig.days - (periodConfig.offset || 0));
    if (periodConfig.offset) {
      endDate.setDate(endDate.getDate() - periodConfig.offset);
    }
  } else if (periodConfig.type === 'week') {
    const offset = periodConfig.offset || 0;
    startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() - (offset * 7));
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
  } else if (periodConfig.type === 'month') {
    const offset = periodConfig.offset || 0;
    startDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    endDate = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0);
  } else if (periodConfig.type === 'quarter') {
    const offset = periodConfig.offset || 0;
    const quarter = Math.floor(now.getMonth() / 3) - offset;
    startDate = new Date(now.getFullYear(), quarter * 3, 1);
    endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
  } else if (periodConfig.type === 'year') {
    const offset = periodConfig.offset || 0;
    startDate = new Date(now.getFullYear() - offset, 0, 1);
    endDate = new Date(now.getFullYear() - offset, 11, 31);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

export default {
  REPORT_CATEGORIES,
  REPORT_TYPES,
  TIME_PERIODS,
  EXPORT_FORMATS,
  REPORT_STATUS,
  FILTER_TYPES,
  getReportType,
  getReportsByCategory,
  calculateDateRange
};
