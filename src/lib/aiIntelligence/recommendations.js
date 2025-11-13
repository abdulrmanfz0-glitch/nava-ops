/**
 * AI Intelligence Layer - Recommendation Engine
 * Generates actionable recommendations based on data analysis
 */

/**
 * Priority levels for recommendations
 */
const PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

/**
 * Recommendation categories
 */
const CATEGORY = {
  REVENUE: 'revenue',
  COST: 'cost',
  PERFORMANCE: 'performance',
  CUSTOMER: 'customer',
  OPERATIONS: 'operations',
  MARKETING: 'marketing'
};

/**
 * Generate revenue optimization recommendations
 */
export function generateRevenueRecommendations(revenueData, categoryData) {
  const recommendations = [];

  if (!revenueData || revenueData.length < 7) {
    return recommendations;
  }

  // Calculate revenue trend
  const recentRevenue = revenueData.slice(-7).map(d => d.revenue || 0);
  const previousRevenue = revenueData.slice(-14, -7).map(d => d.revenue || 0);
  const recentAvg = recentRevenue.reduce((sum, r) => sum + r, 0) / 7;
  const previousAvg = previousRevenue.reduce((sum, r) => sum + r, 0) / 7;
  const trendChange = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

  // Declining revenue recommendation
  if (trendChange < -10) {
    recommendations.push({
      id: 'rev_decline_' + Date.now(),
      category: CATEGORY.REVENUE,
      priority: PRIORITY.CRITICAL,
      title: 'Revenue Decline Detected',
      description: `Revenue has decreased by ${Math.abs(trendChange).toFixed(1)}% in the last week.`,
      actions: [
        'Review pricing strategy and consider promotions',
        'Analyze top-performing categories and increase their visibility',
        'Reach out to inactive customers with special offers',
        'Audit menu items for outdated or underperforming products'
      ],
      potentialImpact: `Recovering 50% of the decline could add $${(Math.abs(recentAvg - previousAvg) * 0.5).toFixed(0)} weekly`,
      confidence: 85
    });
  }

  // Low weekend revenue
  const weekendRevenue = revenueData.filter(d => {
    const day = new Date(d.date).getDay();
    return day === 0 || day === 6;
  });
  const weekdayRevenue = revenueData.filter(d => {
    const day = new Date(d.date).getDay();
    return day > 0 && day < 6;
  });

  if (weekendRevenue.length > 0 && weekdayRevenue.length > 0) {
    const weekendAvg = weekendRevenue.reduce((sum, r) => sum + (r.revenue || 0), 0) / weekendRevenue.length;
    const weekdayAvg = weekdayRevenue.reduce((sum, r) => sum + (r.revenue || 0), 0) / weekdayRevenue.length;

    if (weekendAvg < weekdayAvg * 0.7) {
      recommendations.push({
        id: 'weekend_boost_' + Date.now(),
        category: CATEGORY.MARKETING,
        priority: PRIORITY.HIGH,
        title: 'Boost Weekend Performance',
        description: 'Weekend revenue is 30% lower than weekdays.',
        actions: [
          'Launch weekend-specific promotions or combo deals',
          'Extend operating hours on weekends',
          'Create family-friendly offers for weekend crowds',
          'Increase marketing spend on Friday-Saturday'
        ],
        potentialImpact: `Increasing weekend revenue by 20% could add $${((weekdayAvg - weekendAvg) * 0.2 * 8).toFixed(0)} monthly`,
        confidence: 78
      });
    }
  }

  // Category-based recommendations
  if (categoryData && categoryData.length > 0) {
    const topCategory = categoryData.reduce((max, cat) =>
      (cat.revenue || 0) > (max.revenue || 0) ? cat : max
    , categoryData[0]);

    const lowPerformers = categoryData.filter(cat =>
      (cat.revenue || 0) < (topCategory.revenue || 0) * 0.3 && (cat.revenue || 0) > 0
    );

    if (lowPerformers.length > 0) {
      recommendations.push({
        id: 'category_optimize_' + Date.now(),
        category: CATEGORY.PERFORMANCE,
        priority: PRIORITY.MEDIUM,
        title: 'Optimize Underperforming Categories',
        description: `${lowPerformers.length} categories are underperforming compared to top performers.`,
        actions: [
          `Focus marketing on "${topCategory.name}" (top performer)`,
          `Review and refresh menu items in low-performing categories`,
          `Consider bundling popular items with underperformers`,
          `Analyze if underperforming categories match customer preferences`
        ],
        potentialImpact: 'Could increase overall revenue by 8-12%',
        confidence: 72
      });
    }
  }

  return recommendations;
}

/**
 * Generate cost optimization recommendations
 */
export function generateCostRecommendations(costData, performanceData) {
  const recommendations = [];

  if (!costData || costData.length < 7) {
    return recommendations;
  }

  const costs = costData.map(d => d.cost || d.value || 0);
  const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;
  const recentCost = costs.slice(-7).reduce((sum, c) => sum + c, 0) / 7;

  // Rising costs
  if (recentCost > avgCost * 1.1) {
    recommendations.push({
      id: 'cost_increase_' + Date.now(),
      category: CATEGORY.COST,
      priority: PRIORITY.HIGH,
      title: 'Rising Operational Costs',
      description: `Recent costs are ${(((recentCost - avgCost) / avgCost) * 100).toFixed(1)}% above average.`,
      actions: [
        'Review supplier contracts and negotiate better rates',
        'Audit inventory management to reduce waste',
        'Optimize staff scheduling during low-traffic hours',
        'Implement energy-saving measures in operations'
      ],
      potentialImpact: `Reducing costs by 10% could save $${(recentCost * 0.1 * 30).toFixed(0)} monthly`,
      confidence: 80
    });
  }

  // High cost-to-revenue ratio
  if (performanceData && performanceData.length > 0) {
    const revenues = performanceData.map(d => d.revenue || 0);
    const avgRevenue = revenues.reduce((sum, r) => sum + r, 0) / revenues.length;
    const costRatio = avgRevenue > 0 ? (avgCost / avgRevenue) * 100 : 0;

    if (costRatio > 35) {
      recommendations.push({
        id: 'cost_ratio_' + Date.now(),
        category: CATEGORY.COST,
        priority: PRIORITY.CRITICAL,
        title: 'High Cost-to-Revenue Ratio',
        description: `Operating costs are ${costRatio.toFixed(1)}% of revenue (target: <30%).`,
        actions: [
          'Conduct a comprehensive cost audit',
          'Identify and eliminate non-essential expenses',
          'Renegotiate vendor contracts',
          'Consider menu pricing adjustments'
        ],
        potentialImpact: 'Reducing ratio to 30% could improve profit margins by 15-20%',
        confidence: 88
      });
    }
  }

  return recommendations;
}

/**
 * Generate performance improvement recommendations
 */
export function generatePerformanceRecommendations(performanceData) {
  const recommendations = [];

  if (!performanceData || performanceData.length < 7) {
    return recommendations;
  }

  const orders = performanceData.map(d => d.orders || 0);
  const avgOrders = orders.reduce((sum, o) => sum + o, 0) / orders.length;
  const recentOrders = orders.slice(-3).reduce((sum, o) => sum + o, 0) / 3;

  // Declining order volume
  if (recentOrders < avgOrders * 0.85) {
    recommendations.push({
      id: 'order_decline_' + Date.now(),
      category: CATEGORY.PERFORMANCE,
      priority: PRIORITY.HIGH,
      title: 'Declining Order Volume',
      description: `Recent orders are ${(((avgOrders - recentOrders) / avgOrders) * 100).toFixed(1)}% below average.`,
      actions: [
        'Launch a limited-time promotion to drive orders',
        'Send targeted campaigns to dormant customers',
        'Improve online ordering experience',
        'Add popular items or seasonal specials'
      ],
      potentialImpact: `Recovering to average could add ${Math.round(avgOrders - recentOrders)} daily orders`,
      confidence: 82
    });
  }

  // Low customer retention
  if (performanceData[0].customers && performanceData.length >= 14) {
    const recentCustomers = performanceData.slice(-7).map(d => d.customers || 0);
    const previousCustomers = performanceData.slice(-14, -7).map(d => d.customers || 0);
    const recentAvg = recentCustomers.reduce((sum, c) => sum + c, 0) / 7;
    const previousAvg = previousCustomers.reduce((sum, c) => sum + c, 0) / 7;

    if (recentAvg < previousAvg * 0.9) {
      recommendations.push({
        id: 'customer_retention_' + Date.now(),
        category: CATEGORY.CUSTOMER,
        priority: PRIORITY.HIGH,
        title: 'Customer Retention Opportunity',
        description: 'Customer count has decreased, indicating retention issues.',
        actions: [
          'Implement a loyalty or rewards program',
          'Send personalized follow-up messages after orders',
          'Collect and act on customer feedback',
          'Offer exclusive deals to repeat customers'
        ],
        potentialImpact: 'Increasing retention by 10% could add 15-20% to lifetime value',
        confidence: 75
      });
    }
  }

  return recommendations;
}

/**
 * Generate customer engagement recommendations
 */
export function generateCustomerRecommendations(customerData) {
  const recommendations = [];

  if (!customerData || customerData.length === 0) {
    return recommendations;
  }

  // Low repeat customer rate
  const totalCustomers = customerData.length;
  const repeatCustomers = customerData.filter(c => (c.orderCount || 0) > 1).length;
  const repeatRate = (repeatCustomers / totalCustomers) * 100;

  if (repeatRate < 40) {
    recommendations.push({
      id: 'repeat_rate_' + Date.now(),
      category: CATEGORY.CUSTOMER,
      priority: PRIORITY.HIGH,
      title: 'Low Repeat Customer Rate',
      description: `Only ${repeatRate.toFixed(1)}% of customers return for additional orders.`,
      actions: [
        'Create a points-based loyalty program',
        'Send automated "we miss you" campaigns after 14 days',
        'Offer first-time repeat customer discount',
        'Improve customer experience based on feedback'
      ],
      potentialImpact: 'Increasing repeat rate to 50% could boost revenue by 25%',
      confidence: 85
    });
  }

  // High-value customer opportunities
  const revenues = customerData.map(c => c.totalSpent || 0).filter(r => r > 0);
  if (revenues.length > 0) {
    const avgSpent = revenues.reduce((sum, r) => sum + r, 0) / revenues.length;
    const highValueCustomers = customerData.filter(c => (c.totalSpent || 0) > avgSpent * 2);

    if (highValueCustomers.length > 0 && highValueCustomers.length / totalCustomers < 0.1) {
      recommendations.push({
        id: 'vip_program_' + Date.now(),
        category: CATEGORY.CUSTOMER,
        priority: PRIORITY.MEDIUM,
        title: 'VIP Customer Program Opportunity',
        description: `${highValueCustomers.length} high-value customers represent significant revenue.`,
        actions: [
          'Create exclusive VIP tier with special perks',
          'Offer early access to new menu items',
          'Provide personalized service and birthday rewards',
          'Send monthly "thank you" exclusive offers'
        ],
        potentialImpact: 'Retaining VIP customers can preserve 30-40% of revenue',
        confidence: 90
      });
    }
  }

  return recommendations;
}

/**
 * Generate operational recommendations
 */
export function generateOperationalRecommendations(branchData) {
  const recommendations = [];

  if (!branchData || branchData.length === 0) {
    return recommendations;
  }

  branchData.forEach(branch => {
    // Low branch performance
    const avgRevenue = branchData.reduce((sum, b) => sum + (b.revenue || 0), 0) / branchData.length;
    const branchRevenue = branch.revenue || 0;

    if (branchRevenue < avgRevenue * 0.7) {
      recommendations.push({
        id: `branch_underperform_${branch.id}`,
        category: CATEGORY.OPERATIONS,
        priority: PRIORITY.MEDIUM,
        title: `Improve ${branch.name} Performance`,
        description: `This branch is performing ${(((avgRevenue - branchRevenue) / avgRevenue) * 100).toFixed(1)}% below average.`,
        actions: [
          'Conduct staff training and performance review',
          'Analyze local competition and adjust strategy',
          'Review operating hours to match customer traffic',
          'Increase local marketing efforts'
        ],
        potentialImpact: `Reaching average performance could add $${(avgRevenue - branchRevenue).toFixed(0)} daily`,
        confidence: 70,
        branchId: branch.id
      });
    }
  });

  return recommendations;
}

/**
 * Generate comprehensive recommendations
 */
export function generateAllRecommendations(allData) {
  const recommendations = [];

  if (allData.revenue && allData.categories) {
    recommendations.push(...generateRevenueRecommendations(allData.revenue, allData.categories));
  }

  if (allData.costs && allData.performance) {
    recommendations.push(...generateCostRecommendations(allData.costs, allData.performance));
  }

  if (allData.performance) {
    recommendations.push(...generatePerformanceRecommendations(allData.performance));
  }

  if (allData.customers) {
    recommendations.push(...generateCustomerRecommendations(allData.customers));
  }

  if (allData.branches) {
    recommendations.push(...generateOperationalRecommendations(allData.branches));
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    recommendations,
    summary: {
      total: recommendations.length,
      critical: recommendations.filter(r => r.priority === PRIORITY.CRITICAL).length,
      high: recommendations.filter(r => r.priority === PRIORITY.HIGH).length,
      medium: recommendations.filter(r => r.priority === PRIORITY.MEDIUM).length,
      low: recommendations.filter(r => r.priority === PRIORITY.LOW).length
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Get top N recommendations
 */
export function getTopRecommendations(allData, limit = 5) {
  const allRecommendations = generateAllRecommendations(allData);
  return {
    recommendations: allRecommendations.recommendations.slice(0, limit),
    total: allRecommendations.recommendations.length
  };
}
