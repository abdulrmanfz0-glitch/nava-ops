/**
 * Response Generator for AI Q&A System
 * Formats analysis results into user-friendly, insightful responses
 */

import { formatCurrency, getTrendIndicator } from './dataAnalyzer';

/**
 * Generate a formatted response from analysis results
 * @param {Object} analysisResult - Result from data analyzer
 * @param {Object} processedQuery - Original processed query
 * @returns {Object} - Formatted response for UI
 */
export function generateResponse(analysisResult, processedQuery) {
  const { type } = analysisResult;

  switch (type) {
    case 'items':
      return formatItemsResponse(analysisResult, processedQuery);

    case 'financial':
      return formatFinancialResponse(analysisResult, processedQuery);

    case 'branches':
      return formatBranchesResponse(analysisResult, processedQuery);

    case 'category':
      return formatCategoryResponse(analysisResult, processedQuery);

    case 'trends':
      return formatTrendsResponse(analysisResult, processedQuery);

    case 'comparison':
      return formatComparisonResponse(analysisResult, processedQuery);

    case 'recommendations':
      return formatRecommendationsResponse(analysisResult, processedQuery);

    case 'error':
      return formatErrorResponse(analysisResult, processedQuery);

    default:
      return formatGeneralResponse(analysisResult, processedQuery);
  }
}

/**
 * Format items query response
 */
function formatItemsResponse(result, query) {
  const { items, statistics, metric, comparison } = result;

  if (items.length === 0) {
    return {
      text: "I couldn't find any items matching your criteria.",
      data: null,
      insights: ["Try adjusting your search criteria or ask about a different metric."],
      type: 'text'
    };
  }

  const item = items[0];
  const revenue = (item.price || 0) * (item.sold || 0);
  const profit = ((item.price || 0) - (item.cost || 0)) * (item.sold || 0);
  const profitMargin = item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(2) : 0;

  // Build response text
  let text = `📊 **${comparison === 'highest' ? 'Best' : 'Lowest'} ${metric === 'sold' ? 'Selling' : metric.charAt(0).toUpperCase() + metric.slice(1)} Item**\n\n`;
  text += `**${item.name}**\n\n`;

  // Add metrics
  const metrics = [
    `• **Sold:** ${item.sold || 0} units`,
    `• **Revenue:** ${formatCurrency(revenue)}`,
    `• **Price:** ${formatCurrency(item.price || 0)}`,
    `• **Rating:** ${item.rating || 'N/A'}/5.0 ${item.rating >= 4.5 ? '⭐' : ''}`,
  ];

  if (item.category) {
    metrics.push(`• **Category:** ${item.category}`);
  }

  text += metrics.join('\n');

  // Generate insights
  const insights = [];

  // Sales percentage
  if (statistics.totalSold > 0) {
    const salesPercentage = ((item.sold / statistics.totalSold) * 100).toFixed(1);
    insights.push(`This item represents ${salesPercentage}% of total sales`);
  }

  // Profit margin insight
  if (profitMargin > 60) {
    insights.push(`Excellent profit margin of ${profitMargin}% - highly profitable item`);
  } else if (profitMargin < 30) {
    insights.push(`Low profit margin of ${profitMargin}% - consider price adjustment`);
  }

  // Rating insight
  if (item.rating >= 4.5) {
    insights.push('Customer favorite with exceptional ratings - perfect for promotion');
  } else if (item.rating < 3.5) {
    insights.push('Below-average rating - consider recipe improvements or customer feedback');
  }

  // Popularity insight
  if (item.popularity > 70) {
    insights.push('Currently trending upward - great time to feature in marketing');
  } else if (item.popularity < 30) {
    insights.push('Sales declining - may need strategic intervention');
  }

  return {
    text,
    data: {
      primary: item,
      all: items,
      statistics
    },
    insights,
    type: 'item',
    visualization: items.length > 1 ? {
      type: 'bar',
      data: items.slice(0, 5).map(i => ({
        name: i.name,
        value: i[metric] || 0
      }))
    } : null
  };
}

/**
 * Format financial query response
 */
function formatFinancialResponse(result, query) {
  const { metrics, breakdown, timePeriod } = result;

  let text = `💰 **Financial Overview**${timePeriod !== 'total' ? ` (${timePeriod})` : ''}\n\n`;

  const financialMetrics = [
    `• **Total Revenue:** ${formatCurrency(metrics.totalRevenue)}`,
    `• **Total Cost:** ${formatCurrency(metrics.totalCost)}`,
    `• **Total Profit:** ${formatCurrency(metrics.totalProfit)} 💚`,
    `• **Profit Margin:** ${metrics.profitMargin}%`,
    `• **Items Sold:** ${metrics.totalItemsSold.toLocaleString()}`,
    `• **Avg Order Value:** ${formatCurrency(metrics.avgOrderValue)}`,
  ];

  text += financialMetrics.join('\n');

  // Add category breakdown if available
  if (breakdown?.byCategory) {
    text += '\n\n**Revenue by Category:**\n';
    const sortedCategories = Object.entries(breakdown.byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    sortedCategories.forEach(([category, revenue]) => {
      const percentage = ((revenue / metrics.totalRevenue) * 100).toFixed(1);
      text += `• ${category}: ${formatCurrency(revenue)} (${percentage}%)\n`;
    });
  }

  // Generate insights
  const insights = [];

  if (metrics.profitMargin > 50) {
    insights.push('Excellent profit margins - strong financial health');
  } else if (metrics.profitMargin < 30) {
    insights.push('Profit margins below industry average - review pricing strategy');
  }

  if (metrics.avgOrderValue > 100) {
    insights.push('High average order value indicates successful upselling');
  }

  const topCategory = breakdown?.byCategory
    ? Object.entries(breakdown.byCategory).sort(([, a], [, b]) => b - a)[0]
    : null;

  if (topCategory) {
    const [categoryName, categoryRevenue] = topCategory;
    const percentage = ((categoryRevenue / metrics.totalRevenue) * 100).toFixed(1);
    insights.push(`${categoryName} is your top revenue driver at ${percentage}% of total sales`);
  }

  return {
    text,
    data: {
      metrics,
      breakdown
    },
    insights,
    type: 'financial',
    visualization: breakdown?.byCategory ? {
      type: 'pie',
      data: Object.entries(breakdown.byCategory).map(([name, value]) => ({
        name,
        value
      }))
    } : null
  };
}

/**
 * Format branches query response
 */
function formatBranchesResponse(result, query) {
  const { branches, statistics, comparison } = result;

  if (branches.length === 0) {
    return {
      text: "No branch data available.",
      data: null,
      insights: [],
      type: 'text'
    };
  }

  const branch = branches[0];

  let text = `🏢 **${comparison === 'highest' ? 'Best' : 'Lowest'} Performing Branch**\n\n`;
  text += `**${branch.name}**\n\n`;

  const branchMetrics = [
    `• **Performance Score:** ${branch.performance || 0}%`,
    `• **Status:** ${branch.active ? '🟢 Active' : '🔴 Inactive'}`,
  ];

  if (branch.region) {
    branchMetrics.push(`• **Region:** ${branch.region}`);
  }

  text += branchMetrics.join('\n');

  // Generate insights
  const insights = [];

  if (branch.performance > 90) {
    insights.push('Outstanding performance - use as benchmark for other locations');
  } else if (branch.performance < 50) {
    insights.push('Performance below expectations - requires immediate attention');
  }

  const performanceDiff = branch.performance - parseFloat(statistics.avgPerformance);
  if (Math.abs(performanceDiff) > 10) {
    const direction = performanceDiff > 0 ? 'above' : 'below';
    insights.push(`Performance is ${Math.abs(performanceDiff).toFixed(1)}% ${direction} average`);
  }

  return {
    text,
    data: {
      primary: branch,
      all: branches,
      statistics
    },
    insights,
    type: 'branch',
    visualization: branches.length > 1 ? {
      type: 'bar',
      data: branches.map(b => ({
        name: b.name,
        value: b.performance || 0
      }))
    } : null
  };
}

/**
 * Format category analysis response
 */
function formatCategoryResponse(result, query) {
  const { category, items, topItems, metrics } = result;

  let text = `🍽️ **${category.charAt(0).toUpperCase() + category.slice(1)} Category Performance**\n\n`;

  text += '**Overall Metrics:**\n';
  const categoryMetrics = [
    `• **Total Items:** ${metrics.totalItems}`,
    `• **Total Revenue:** ${formatCurrency(metrics.totalRevenue)}`,
    `• **Total Profit:** ${formatCurrency(metrics.totalProfit)}`,
    `• **Profit Margin:** ${metrics.profitMargin}%`,
    `• **Avg Rating:** ${metrics.avgRating}/5.0`,
  ];

  text += categoryMetrics.join('\n');

  // Add top items
  if (topItems && topItems.length > 0) {
    text += '\n\n**Top Performers:**\n';
    topItems.forEach((item, index) => {
      const revenue = (item.price || 0) * (item.sold || 0);
      text += `${index + 1}. **${item.name}** (${item.sold || 0} sold, ${formatCurrency(revenue)})\n`;
    });
  }

  // Generate insights
  const insights = [];

  if (metrics.profitMargin > 60) {
    insights.push(`${category} category has exceptional profit margins - consider expanding offerings`);
  }

  if (metrics.avgRating >= 4.5) {
    insights.push('Category is highly rated by customers - maintain quality standards');
  } else if (metrics.avgRating < 3.5) {
    insights.push('Category ratings need improvement - review customer feedback');
  }

  const topItem = topItems[0];
  if (topItem) {
    const topItemRevenue = (topItem.price || 0) * (topItem.sold || 0);
    const percentage = ((topItemRevenue / metrics.totalRevenue) * 100).toFixed(1);
    insights.push(`${topItem.name} drives ${percentage}% of category revenue`);
  }

  return {
    text,
    data: {
      category,
      items,
      topItems,
      metrics
    },
    insights,
    type: 'category'
  };
}

/**
 * Format trends analysis response
 */
function formatTrendsResponse(result, query) {
  const { trending, declining, summary } = result;

  let text = `📊 **Trend Analysis**\n\n`;

  if (trending.length > 0) {
    text += '**📈 Trending Items (Rising Sales):**\n';
    trending.slice(0, 3).forEach((item, index) => {
      text += `${index + 1}. **${item.name}** - ${item.sold || 0} sold, ${item.popularity}% popularity\n`;
    });
    text += '\n';
  }

  if (declining.length > 0) {
    text += '**📉 Declining Items (Needs Attention):**\n';
    declining.slice(0, 3).forEach((item, index) => {
      text += `${index + 1}. **${item.name}** - ${item.sold || 0} sold, ${item.popularity}% popularity\n`;
    });
  }

  // Generate insights
  const insights = [];

  if (trending.length > 0) {
    insights.push(`${trending.length} items are trending upward - great opportunity for promotion`);
  }

  if (declining.length > 0) {
    insights.push(`${declining.length} items showing decline - may need recipe updates or marketing support`);
  }

  if (summary.stableCount > summary.trendingCount + summary.decliningCount) {
    insights.push('Most items have stable performance - focus on optimizing high-potential items');
  }

  return {
    text,
    data: {
      trending,
      declining,
      summary
    },
    insights,
    type: 'trends'
  };
}

/**
 * Format comparison response
 */
function formatComparisonResponse(result, query) {
  const { subtype, items, comparisonMetric } = result;

  if (items.length < 2) {
    return {
      text: "Not enough items to compare.",
      data: null,
      insights: [],
      type: 'text'
    };
  }

  const [item1, item2] = items;

  let text = `⚖️ **Comparison**\n\n`;

  if (subtype === 'branches') {
    text += `**${item1.name} vs ${item2.name}**\n\n`;
    text += `**${item1.name}:**\n`;
    text += `• Performance: ${item1.performance || 0}%\n`;
    text += `• Status: ${item1.active ? '🟢 Active' : '🔴 Inactive'}\n\n`;

    text += `**${item2.name}:**\n`;
    text += `• Performance: ${item2.performance || 0}%\n`;
    text += `• Status: ${item2.active ? '🟢 Active' : '🔴 Inactive'}\n\n`;

    const diff = Math.abs((item1.performance || 0) - (item2.performance || 0));
    const winner = (item1.performance || 0) > (item2.performance || 0) ? item1.name : item2.name;

    text += `🏆 **Winner:** ${winner} (+${diff.toFixed(1)}% performance)`;
  } else {
    text += `**${item1.name} vs ${item2.name}**\n\n`;
    text += `**${item1.name}:**\n`;
    text += `• Sold: ${item1.sold || 0} units\n`;
    text += `• Price: ${formatCurrency(item1.price || 0)}\n`;
    text += `• Rating: ${item1.rating || 'N/A'}/5.0\n\n`;

    text += `**${item2.name}:**\n`;
    text += `• Sold: ${item2.sold || 0} units\n`;
    text += `• Price: ${formatCurrency(item2.price || 0)}\n`;
    text += `• Rating: ${item2.rating || 'N/A'}/5.0\n\n`;

    const soldDiff = Math.abs((item1.sold || 0) - (item2.sold || 0));
    const winner = (item1.sold || 0) > (item2.sold || 0) ? item1.name : item2.name;

    text += `🏆 **Winner (Sales):** ${winner} (+${soldDiff} units)`;
  }

  const insights = [
    'Both items have unique strengths - consider highlighting in different contexts',
    'Review pricing and positioning strategies for optimization'
  ];

  return {
    text,
    data: { items, comparisonMetric },
    insights,
    type: 'comparison'
  };
}

/**
 * Format recommendations response
 */
function formatRecommendationsResponse(result, query) {
  const { recommendations, summary } = result;

  if (recommendations.length === 0) {
    return {
      text: "No specific recommendations at this time. Your menu is performing well!",
      data: null,
      insights: [],
      type: 'text'
    };
  }

  let text = `🎯 **Strategic Recommendations**\n\n`;

  recommendations.forEach((rec, index) => {
    const priorityEmoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';

    text += `**${index + 1}. ${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}** ${priorityEmoji}\n`;
    text += `**Priority:** ${rec.priority.toUpperCase()}\n\n`;

    if (rec.items && rec.items.length > 0) {
      text += '**Items:**\n';
      rec.items.forEach(item => {
        text += `• ${item.name}\n`;
      });
      text += '\n';
    }

    text += `💡 **Why:** ${rec.reason}\n`;
    text += `✅ **Action:** ${rec.action}\n\n`;
  });

  const insights = [
    `${recommendations.length} strategic opportunities identified`,
    'Focus on high-priority items for maximum impact',
    'Review recommendations monthly to track progress'
  ];

  return {
    text,
    data: { recommendations },
    insights,
    type: 'recommendations'
  };
}

/**
 * Format error response
 */
function formatErrorResponse(result, query) {
  return {
    text: `⚠️ ${result.message}`,
    data: null,
    insights: [
      'Try rephrasing your question',
      'Ask about available metrics like revenue, sales, or ratings',
      'Use the quick suggestions below for examples'
    ],
    type: 'error'
  };
}

/**
 * Format general response
 */
function formatGeneralResponse(result, query) {
  return {
    text: result.message || "I'm here to help! Ask me about menu items, sales, financials, or trends.",
    data: null,
    insights: [
      'Try: "What\'s our best-selling item?"',
      'Try: "Show me revenue for this week"',
      'Try: "Which items need improvement?"'
    ],
    type: 'general'
  };
}

export default {
  generateResponse
};
