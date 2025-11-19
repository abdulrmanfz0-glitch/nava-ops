/**
 * Navigation Configuration for Smart Sidebar
 * Defines all modules, navigation items, and their properties
 */

export const MODULES = {
  COMMAND_CENTER: 'command-center',
  INTELLIGENCE_HUB: 'intelligence-hub',
  STAFF_COMMAND: 'staff-command',
  FINANCIALS: 'financials',
  SETTINGS: 'settings'
};

/**
 * Navigation structure for Smart Sidebar
 * Each module contains navigation items organized by category
 */
export const navigationConfig = [
  {
    id: MODULES.COMMAND_CENTER,
    title: 'Command Center',
    icon: 'Command',
    gradient: 'from-blue-600 to-blue-800',
    badgeColor: 'bg-blue-500',
    defaultExpanded: true,
    description: 'Real-time operational overview and insights',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        path: '/',
        icon: 'LayoutDashboard',
        description: 'Main KPIs, AI insights, and top performers',
        keywords: ['overview', 'kpi', 'metrics', 'insights', 'home'],
        badge: null,
        exact: true
      },
      {
        id: 'live-operations',
        title: 'Live Operations',
        path: '/live-operations',
        icon: 'Activity',
        description: 'Real-time order tracking and kitchen status',
        keywords: ['live', 'orders', 'kitchen', 'real-time', 'active'],
        badge: { type: 'pulse', color: 'bg-green-500' },
        comingSoon: true
      },
      {
        id: 'quick-stats',
        title: 'Quick Stats',
        path: '/quick-stats',
        icon: 'Zap',
        description: 'At-a-glance performance metrics',
        keywords: ['stats', 'quick', 'summary', 'snapshot'],
        badge: null,
        comingSoon: true
      }
    ]
  },
  {
    id: MODULES.INTELLIGENCE_HUB,
    title: 'Intelligence Hub',
    icon: 'Brain',
    gradient: 'from-purple-600 to-purple-800',
    badgeColor: 'bg-purple-500',
    defaultExpanded: false,
    description: 'Data analytics and business intelligence',
    items: [
      {
        id: 'menu-performance',
        title: 'Menu Performance',
        path: '/data-intelligence',
        icon: 'TrendingUp',
        description: 'BCG matrix, item analytics, and trends',
        keywords: ['menu', 'performance', 'analytics', 'bcg', 'items', 'trends'],
        badge: { type: 'count', value: 'insights' }
      },
      {
        id: 'sales-analytics',
        title: 'Sales Analytics',
        path: '/sales-analytics',
        icon: 'LineChart',
        description: 'Revenue trends and forecasting',
        keywords: ['sales', 'revenue', 'forecast', 'trends', 'growth'],
        badge: null,
        comingSoon: true
      },
      {
        id: 'customer-insights',
        title: 'Customer Insights',
        path: '/customer-insights',
        icon: 'Users2',
        description: 'Ratings, preferences, and feedback',
        keywords: ['customer', 'ratings', 'reviews', 'feedback', 'satisfaction'],
        badge: null,
        comingSoon: true
      },
      {
        id: 'reports-analytics',
        title: 'Report Hub',
        path: '/reports',
        icon: 'Crown',
        description: 'Premium professional reports with AI insights, anomaly detection, and actionable recommendations',
        keywords: ['report', 'hub', 'premium', 'professional', 'analytics', 'export', 'pdf', 'insights', 'ai', 'recommendations'],
        badge: { type: 'badge', value: 'Premium' }
      },
      {
        id: 'smart-features',
        title: 'Smart Features',
        path: '/smart-features',
        icon: 'Sparkles',
        description: 'AI-powered insights, predictive analytics, and performance scoring dashboard',
        keywords: ['smart', 'ai', 'insights', 'predictions', 'scoring', 'analytics', 'performance', 'intelligent'],
        badge: { type: 'badge', value: 'AI' }
      }
    ]
  },
  {
    id: MODULES.STAFF_COMMAND,
    title: 'Staff Command',
    icon: 'Users',
    gradient: 'from-emerald-600 to-emerald-800',
    badgeColor: 'bg-emerald-500',
    defaultExpanded: false,
    description: 'Team and resource management',
    items: [
      {
        id: 'team-management',
        title: 'Team Management',
        path: '/team',
        icon: 'UserCog',
        description: 'Staff, roles, and permissions',
        keywords: ['team', 'staff', 'employees', 'roles', 'permissions'],
        badge: { type: 'count', value: 'activeStaff' }
      },
      {
        id: 'menu-management',
        title: 'Menu Management',
        path: '/data-management',
        icon: 'UtensilsCrossed',
        description: 'CRUD operations for menu items',
        keywords: ['menu', 'items', 'management', 'crud', 'edit', 'add'],
        badge: null
      },
      {
        id: 'branch-management',
        title: 'Branch Management',
        path: '/branches',
        icon: 'Building2',
        description: 'Multi-location oversight',
        keywords: ['branches', 'locations', 'multi-location', 'outlets'],
        badge: { type: 'count', value: 'activeBranches' }
      },
      {
        id: 'schedule-shifts',
        title: 'Schedule & Shifts',
        path: '/schedule',
        icon: 'Calendar',
        description: 'Staff scheduling and shift management',
        keywords: ['schedule', 'shifts', 'roster', 'calendar', 'planning'],
        badge: null,
        comingSoon: true
      }
    ]
  },
  {
    id: MODULES.FINANCIALS,
    title: 'Financials',
    icon: 'DollarSign',
    gradient: 'from-amber-600 to-amber-800',
    badgeColor: 'bg-amber-500',
    defaultExpanded: false,
    description: 'Financial reporting and cost management',
    items: [
      {
        id: 'financial-reports',
        title: 'Financial Reports',
        path: '/financial',
        icon: 'Receipt',
        description: 'P&L, EBITDA, and profit margins',
        keywords: ['financial', 'reports', 'profit', 'loss', 'ebitda', 'margins'],
        badge: { type: 'trend', value: 'profit' }
      },
      {
        id: 'revenue-analysis',
        title: 'Revenue Analysis',
        path: '/revenue-analysis',
        icon: 'TrendingUp',
        description: 'Revenue streams and trends',
        keywords: ['revenue', 'income', 'streams', 'analysis', 'trends'],
        badge: null,
        comingSoon: true
      },
      {
        id: 'cost-management',
        title: 'Cost Management',
        path: '/cost-management',
        icon: 'Calculator',
        description: 'COGS, labor, and overhead tracking',
        keywords: ['cost', 'expenses', 'cogs', 'labor', 'overhead'],
        badge: null,
        comingSoon: true
      },
      {
        id: 'budget-planning',
        title: 'Budget Planning',
        path: '/budget-planning',
        icon: 'PiggyBank',
        description: 'Forecasting and budget targets',
        keywords: ['budget', 'planning', 'forecast', 'targets', 'goals'],
        badge: null,
        comingSoon: true
      }
    ]
  },
  {
    id: MODULES.SETTINGS,
    title: 'Settings & Tools',
    icon: 'Settings',
    gradient: 'from-slate-600 to-slate-800',
    badgeColor: 'bg-slate-500',
    defaultExpanded: false,
    description: 'System configuration and utilities',
    items: [
      {
        id: 'profile-settings',
        title: 'Profile Settings',
        path: '/settings/profile',
        icon: 'User',
        description: 'Personal preferences and profile',
        keywords: ['profile', 'settings', 'preferences', 'account'],
        badge: null
      },
      {
        id: 'system-settings',
        title: 'System Settings',
        path: '/settings/system',
        icon: 'Sliders',
        description: 'Application configuration',
        keywords: ['system', 'settings', 'config', 'configuration'],
        badge: null
      },
      {
        id: 'notifications',
        title: 'Notifications',
        path: '/settings/notifications',
        icon: 'Bell',
        description: 'Alert preferences and history',
        keywords: ['notifications', 'alerts', 'preferences'],
        badge: { type: 'count', value: 'unreadNotifications' }
      },
      {
        id: 'data-export',
        title: 'Data Export',
        path: '/settings/export',
        icon: 'Download',
        description: 'Export reports and backups',
        keywords: ['export', 'download', 'backup', 'data'],
        badge: null
      },
      {
        id: 'help-support',
        title: 'Help & Support',
        path: '/settings/help',
        icon: 'HelpCircle',
        description: 'Documentation and contact',
        keywords: ['help', 'support', 'docs', 'documentation', 'contact'],
        badge: null
      }
    ]
  }
];

/**
 * Get all navigation items (flat list)
 */
export const getAllNavigationItems = () => {
  return navigationConfig.flatMap(module =>
    module.items.map(item => ({
      ...item,
      module: {
        id: module.id,
        title: module.title,
        icon: module.icon
      }
    }))
  );
};

/**
 * Search navigation items by query
 * @param {string} query - Search query
 * @param {Array} items - Items to search (defaults to all items)
 * @returns {Array} - Matching items with relevance score
 */
export const searchNavigationItems = (query, items = null) => {
  if (!query || query.trim().length === 0) return [];

  const searchItems = items || getAllNavigationItems();
  const lowerQuery = query.toLowerCase().trim();

  return searchItems
    .map(item => {
      let score = 0;

      // Exact title match (highest priority)
      if (item.title.toLowerCase() === lowerQuery) {
        score += 100;
      }

      // Title starts with query
      if (item.title.toLowerCase().startsWith(lowerQuery)) {
        score += 50;
      }

      // Title includes query
      if (item.title.toLowerCase().includes(lowerQuery)) {
        score += 30;
      }

      // Description includes query
      if (item.description?.toLowerCase().includes(lowerQuery)) {
        score += 20;
      }

      // Keywords match
      const keywordMatches = item.keywords?.filter(keyword =>
        keyword.toLowerCase().includes(lowerQuery)
      ).length || 0;
      score += keywordMatches * 15;

      // Module title match
      if (item.module?.title.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      return { ...item, relevance: score };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
};

/**
 * Get module by ID
 */
export const getModuleById = (moduleId) => {
  return navigationConfig.find(module => module.id === moduleId);
};

/**
 * Get navigation item by path
 */
export const getNavigationItemByPath = (path) => {
  return getAllNavigationItems().find(item => item.path === path);
};

/**
 * Get breadcrumb trail for a path
 */
export const getBreadcrumbs = (path) => {
  const item = getNavigationItemByPath(path);
  if (!item) return [];

  const breadcrumbs = [
    { title: 'Home', path: '/' }
  ];

  // Add module
  if (item.module) {
    breadcrumbs.push({
      title: item.module.title,
      path: null // Modules don't have paths
    });
  }

  // Add current page (if not home)
  if (path !== '/') {
    breadcrumbs.push({
      title: item.title,
      path: item.path
    });
  }

  return breadcrumbs;
};

/**
 * Get keyboard shortcuts configuration
 */
export const keyboardShortcuts = {
  global: [
    { keys: ['Ctrl', 'K'], description: 'Open search', action: 'search' },
    { keys: ['Ctrl', 'B'], description: 'Toggle sidebar', action: 'toggleSidebar' },
    { keys: ['Ctrl', '/'], description: 'Show shortcuts', action: 'showShortcuts' },
    { keys: ['Esc'], description: 'Close modals/search', action: 'escape' }
  ],
  navigation: [
    { keys: ['Alt', '1'], description: 'Command Center', action: 'goToModule', module: MODULES.COMMAND_CENTER },
    { keys: ['Alt', '2'], description: 'Intelligence Hub', action: 'goToModule', module: MODULES.INTELLIGENCE_HUB },
    { keys: ['Alt', '3'], description: 'Staff Command', action: 'goToModule', module: MODULES.STAFF_COMMAND },
    { keys: ['Alt', '4'], description: 'Financials', action: 'goToModule', module: MODULES.FINANCIALS },
    { keys: ['Alt', '5'], description: 'Settings', action: 'goToModule', module: MODULES.SETTINGS }
  ],
  quickGo: [
    { keys: ['G', 'D'], description: 'Go to Dashboard', action: 'goToPage', path: '/' },
    { keys: ['G', 'M'], description: 'Go to Menu Management', action: 'goToPage', path: '/data-management' },
    { keys: ['G', 'F'], description: 'Go to Financials', action: 'goToPage', path: '/financial' },
    { keys: ['G', 'T'], description: 'Go to Team', action: 'goToPage', path: '/team' }
  ]
};

/**
 * Badge value resolvers
 * Functions to get dynamic badge values
 */
export const badgeResolvers = {
  insights: (context) => {
    // Return number of AI insights
    return context?.insights?.length || 0;
  },
  activeStaff: (context) => {
    // Return number of active staff members
    return context?.staff?.filter(s => s.active).length || 0;
  },
  activeBranches: (context) => {
    // Return number of active branches
    return context?.branches?.filter(b => b.active).length || 0;
  },
  profit: (context) => {
    // Return profit trend indicator
    const trend = context?.profitTrend || 0;
    if (trend > 5) return '↑';
    if (trend < -5) return '↓';
    return '→';
  },
  unreadNotifications: (context) => {
    // Return number of unread notifications
    return context?.notifications?.filter(n => !n.read).length || 0;
  }
};

export default navigationConfig;
