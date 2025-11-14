/**
 * Data Analyzer for AI Q&A System
 * Computes metrics, analyzes trends, and generates insights from restaurant data
 */

import { INTENTS } from './intentDetector';

/**
 * Analyze data based on processed query
 * @param {Object} processedQuery - Query with intent and entities
 * @param {Object} data - Available data sources (menuItems, branches, etc.)
 * @returns {Object} - Analysis results
 */
export function analyzeData(processedQuery, data) {
  const { intent, entities } = processedQuery;

  switch (intent) {
    case INTENTS.ITEM_QUERY:
      return analyzeItems(entities, data.menuItems);

    case INTENTS.FINANCIAL_QUERY:
      return analyzeFinancials(entities, data.menuItems, data.branches);

    case INTENTS.BRANCH_QUERY:
      return analyzeBranches(entities, data.branches);

    case INTENTS.CATEGORY_QUERY:
      return analyzeCategory(entities, data.menuItems);

    case INTENTS.TREND_QUERY:
      return analyzeTrends(entities, data.menuItems);

    case INTENTS.COMPARISON_QUERY:
      return analyzeComparison(entities, data);

    case INTENTS.RECOMMENDATION_QUERY:
      return generateRecommendations(entities, data);

    default:
      return {
        type: 'general',
        data: null,
        message: "I can help you with menu items, financials, branches, and more. What would you like to know?"
      };
  }
}

/**
 * Analyze menu items based on query
 */
function analyzeItems(entities, menuItems) {
  if (!menuItems || menuItems.length === 0) {
    return {
      type: 'error',
      message: 'No menu items data available'
    };
  }

  let items = [...menuItems];
  const { metric = 'sold', comparison = 'highest', limit = 1, category } = entities;

  // Filter by category if specified
  if (category) {
    items = items.filter(item =>
      item.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // Sort based on metric and comparison
  items.sort((a, b) => {
    const aValue = a[metric] || 0;
    const bValue = b[metric] || 0;

    if (comparison === 'highest' || comparison === 'top') {
      return bValue - aValue;
    } else {
      return aValue - bValue;
    }
  });

  // Get top/bottom items
  const resultItems = items.slice(0, limit);

  // Calculate statistics
  const totalSold = items.reduce((sum, item) => sum + (item.sold || 0), 0);
  const totalRevenue = items.reduce((sum, item) => sum + ((item.price || 0) * (item.sold || 0)), 0);
  const avgRating = items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length;

  return {
    type: 'items',
    items: resultItems,
    statistics: {
      total: items.length,
      totalSold,
      totalRevenue,
      avgRating: avgRating.toFixed(2)
    },
    metric,
    comparison
  };
}

/**
 * Analyze financial metrics
 */
function analyzeFinancials(entities, menuItems, branches) {
  if (!menuItems || menuItems.length === 0) {
    return {
      type: 'error',
      message: 'No financial data available'
    };
  }

  const { metric = 'revenue', timePeriod = 'total' } = entities;

  // Calculate financial metrics
  const totalRevenue = menuItems.reduce((sum, item) => {
    return sum + ((item.price || 0) * (item.sold || 0));
  }, 0);

  const totalCost = menuItems.reduce((sum, item) => {
    return sum + ((item.cost || 0) * (item.sold || 0));
  }, 0);

  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0;

  const totalItemsSold = menuItems.reduce((sum, item) => sum + (item.sold || 0), 0);
  const avgOrderValue = totalItemsSold > 0 ? (totalRevenue / totalItemsSold).toFixed(2) : 0;

  // Revenue breakdown by category
  const revenueByCategory = {};
  menuItems.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!revenueByCategory[category]) {
      revenueByCategory[category] = 0;
    }
    revenueByCategory[category] += (item.price || 0) * (item.sold || 0);
  });

  return {
    type: 'financial',
    metrics: {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: parseFloat(profitMargin),
      avgOrderValue: parseFloat(avgOrderValue),
      totalItemsSold
    },
    breakdown: {
      byCategory: revenueByCategory
    },
    timePeriod
  };
}

/**
 * Analyze branch performance
 */
function analyzeBranches(entities, branches) {
  if (!branches || branches.length === 0) {
    return {
      type: 'error',
      message: 'No branch data available'
    };
  }

  const { comparison = 'highest', limit = 1 } = entities;

  let branchList = [...branches];

  // Sort by performance
  branchList.sort((a, b) => {
    const aPerf = a.performance || 0;
    const bPerf = b.performance || 0;

    if (comparison === 'highest' || comparison === 'top') {
      return bPerf - aPerf;
    } else {
      return aPerf - bPerf;
    }
  });

  const resultBranches = branchList.slice(0, limit);

  // Calculate statistics
  const avgPerformance = branchList.reduce((sum, b) => sum + (b.performance || 0), 0) / branchList.length;
  const activeBranches = branchList.filter(b => b.active).length;

  return {
    type: 'branches',
    branches: resultBranches,
    statistics: {
      total: branchList.length,
      active: activeBranches,
      avgPerformance: avgPerformance.toFixed(2)
    },
    comparison
  };
}

/**
 * Analyze specific category performance
 */
function analyzeCategory(entities, menuItems) {
  const { category } = entities;

  if (!category) {
    return {
      type: 'error',
      message: 'Please specify a category to analyze'
    };
  }

  const categoryItems = menuItems.filter(item =>
    item.category?.toLowerCase() === category.toLowerCase()
  );

  if (categoryItems.length === 0) {
    return {
      type: 'error',
      message: `No items found in category: ${category}`
    };
  }

  // Calculate category metrics
  const totalRevenue = categoryItems.reduce((sum, item) => {
    return sum + ((item.price || 0) * (item.sold || 0));
  }, 0);

  const totalCost = categoryItems.reduce((sum, item) => {
    return sum + ((item.cost || 0) * (item.sold || 0));
  }, 0);

  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0;

  const avgRating = categoryItems.reduce((sum, item) => sum + (item.rating || 0), 0) / categoryItems.length;

  // Top 3 items in category
  const topItems = [...categoryItems]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 3);

  return {
    type: 'category',
    category,
    items: categoryItems,
    topItems,
    metrics: {
      totalItems: categoryItems.length,
      totalRevenue,
      totalProfit,
      profitMargin: parseFloat(profitMargin),
      avgRating: avgRating.toFixed(2)
    }
  };
}

/**
 * Analyze trends and patterns
 */
function analyzeTrends(entities, menuItems) {
  // Simple trend detection based on popularity
  const trendingItems = menuItems.filter(item => {
    const popularity = item.popularity || 0;
    return popularity > 70; // Threshold for trending
  });

  const decliningItems = menuItems.filter(item => {
    const popularity = item.popularity || 0;
    return popularity < 30; // Threshold for declining
  });

  return {
    type: 'trends',
    trending: trendingItems.slice(0, 5),
    declining: decliningItems.slice(0, 5),
    summary: {
      trendingCount: trendingItems.length,
      decliningCount: decliningItems.length,
      stableCount: menuItems.length - trendingItems.length - decliningItems.length
    }
  };
}

/**
 * Compare items, branches, or categories
 */
function analyzeComparison(entities, data) {
  // This is a simplified comparison - can be expanded based on entities
  const { menuItems, branches } = data;

  if (branches && branches.length >= 2) {
    // Compare top 2 branches
    const sortedBranches = [...branches].sort((a, b) =>
      (b.performance || 0) - (a.performance || 0)
    );

    return {
      type: 'comparison',
      subtype: 'branches',
      items: sortedBranches.slice(0, 2),
      comparisonMetric: 'performance'
    };
  }

  if (menuItems && menuItems.length >= 2) {
    // Compare top 2 items
    const sortedItems = [...menuItems].sort((a, b) =>
      (b.sold || 0) - (a.sold || 0)
    );

    return {
      type: 'comparison',
      subtype: 'items',
      items: sortedItems.slice(0, 2),
      comparisonMetric: 'sold'
    };
  }

  return {
    type: 'error',
    message: 'Not enough data to perform comparison'
  };
}

/**
 * Generate strategic recommendations
 */
function generateRecommendations(entities, data) {
  const { menuItems } = data;

  if (!menuItems || menuItems.length === 0) {
    return {
      type: 'error',
      message: 'No data available for recommendations'
    };
  }

  const recommendations = [];

  // Calculate profit margins
  const itemsWithMargins = menuItems.map(item => ({
    ...item,
    profitMargin: item.price > 0 ? ((item.price - item.cost) / item.price) * 100 : 0
  }));

  // High margin items with good ratings (promote these)
  const highValueItems = itemsWithMargins.filter(item =>
    item.profitMargin > 50 && (item.rating || 0) >= 4.0
  ).slice(0, 3);

  if (highValueItems.length > 0) {
    recommendations.push({
      type: 'promote',
      priority: 'high',
      items: highValueItems,
      reason: 'High profit margin with excellent ratings',
      action: 'Feature in marketing campaigns'
    });
  }

  // Hidden gems (high rating, low sales)
  const hiddenGems = menuItems.filter(item =>
    (item.rating || 0) >= 4.5 && (item.sold || 0) < 50
  ).slice(0, 2);

  if (hiddenGems.length > 0) {
    recommendations.push({
      type: 'visibility',
      priority: 'medium',
      items: hiddenGems,
      reason: 'Excellent quality but low visibility',
      action: 'Add to "Chef\'s Specials" section'
    });
  }

  // Low performers (low rating or declining sales)
  const lowPerformers = menuItems.filter(item =>
    (item.rating || 0) < 3.5 || (item.popularity || 50) < 30
  ).slice(0, 2);

  if (lowPerformers.length > 0) {
    recommendations.push({
      type: 'review',
      priority: 'low',
      items: lowPerformers,
      reason: 'Poor performance or declining trend',
      action: 'Consider recipe update or removal'
    });
  }

  return {
    type: 'recommendations',
    recommendations,
    summary: `Found ${recommendations.length} strategic recommendations`
  };
}

/**
 * Calculate percentage change
 */
export function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'SAR') {
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Get trend indicator
 */
export function getTrendIndicator(value, threshold = 0) {
  if (value > threshold) return { icon: '📈', direction: 'up', color: 'green' };
  if (value < -threshold) return { icon: '📉', direction: 'down', color: 'red' };
  return { icon: '→', direction: 'stable', color: 'gray' };
}

/**
 * Calculate statistics for a dataset
 */
export function calculateStatistics(values) {
  if (!values || values.length === 0) {
    return { min: 0, max: 0, avg: 0, sum: 0, count: 0 };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    min,
    max,
    avg: parseFloat(avg.toFixed(2)),
    sum,
    count: values.length
  };
}

export default {
  analyzeData,
  calculateChange,
  formatCurrency,
  getTrendIndicator,
  calculateStatistics
};
