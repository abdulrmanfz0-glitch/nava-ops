/**
 * Professional Report AI Insights Generator
 * Specialized AI module for revenue growth, cost optimization, and commission impact analysis
 */

/**
 * Generate revenue growth insights
 * @param {Object} reportData - Report data with trends and orders
 * @returns {Array} Array of revenue growth insights
 */
export const analyzeRevenueGrowth = (reportData) => {
  const insights = [];

  if (!reportData || !reportData.trends || reportData.trends.length < 2) {
    return insights;
  }

  const trends = reportData.trends;
  const revenueData = trends.map(t => t.revenue);

  // Calculate growth rate
  const firstWeek = revenueData.slice(0, Math.floor(revenueData.length / 2));
  const secondWeek = revenueData.slice(Math.floor(revenueData.length / 2));

  const avgFirstHalf = firstWeek.reduce((a, b) => a + b, 0) / firstWeek.length;
  const avgSecondHalf = secondWeek.reduce((a, b) => a + b, 0) / secondWeek.length;

  const growthRate = ((avgSecondHalf - avgFirstHalf) / avgFirstHalf * 100).toFixed(1);
  const growthTrend = growthRate > 0 ? 'positive' : 'negative';

  insights.push({
    type: 'growth_analysis',
    severity: growthRate > 10 ? 'info' : growthRate > -5 ? 'medium' : 'high',
    title: `Revenue Growth: ${growthRate}%`,
    description: `Your business is ${growthTrend} with a ${Math.abs(growthRate)}% ${growthRate > 0 ? 'increase' : 'decrease'} in average daily revenue compared to the first half of the period.`,
    metric: `${growthRate}%`,
    confidence: 'high',
    icon: 'TrendingUp',
    recommendation: growthRate < 0 ? 'Focus on marketing initiatives and customer acquisition to reverse the trend.' : 'Maintain current strategies while exploring expansion opportunities.'
  });

  // Peak period analysis
  const maxRevenue = Math.max(...revenueData);
  const minRevenue = Math.min(...revenueData);
  const variability = ((maxRevenue - minRevenue) / (maxRevenue + minRevenue) * 2 * 100).toFixed(1);

  insights.push({
    type: 'revenue_volatility',
    severity: variability > 40 ? 'warning' : 'info',
    title: `Revenue Variability: ${variability}%`,
    description: `Your daily revenue fluctuates by ${variability}% between peak and low days. Consider implementing retention strategies to stabilize revenue.`,
    metric: `${variability}% variance`,
    confidence: 'high',
    icon: 'AlertTriangle'
  });

  // Growth opportunity identification
  if (growthRate > 5) {
    insights.push({
      type: 'growth_opportunity',
      severity: 'info',
      title: 'Strong Growth Momentum',
      description: `With ${growthRate}% growth, you\'re in a strong position. Capitalize on this momentum by expanding product lines, increasing marketing spend, or opening new locations.`,
      metric: `Growth momentum: Strong`,
      confidence: 'high',
      icon: 'Rocket'
    });
  }

  return insights;
};

/**
 * Generate cost optimization insights
 * @param {Object} reportData - Report data with expenses and metrics
 * @returns {Array} Array of cost optimization insights
 */
export const analyzeCostOptimization = (reportData) => {
  const insights = [];

  if (!reportData || !reportData.orderStats) {
    return insights;
  }

  const { totalRevenue, totalOrders } = reportData.orderStats;

  // Estimate operational costs (typically 30-35% of revenue in F&B)
  const estimatedOperationalCost = totalRevenue * 0.32;
  const estimatedCOGS = totalRevenue * 0.28;

  // Cost per order analysis
  const costPerOrder = estimatedOperationalCost / Math.max(totalOrders, 1);
  const revenuePerOrder = totalRevenue / Math.max(totalOrders, 1);

  insights.push({
    type: 'cost_per_order',
    severity: costPerOrder > revenuePerOrder * 0.4 ? 'warning' : 'info',
    title: `Cost Per Order: SAR ${costPerOrder.toFixed(2)}`,
    description: `Your operational cost per order is SAR ${costPerOrder.toFixed(2)} against revenue per order of SAR ${revenuePerOrder.toFixed(2)}. Margin: ${(((revenuePerOrder - costPerOrder) / revenuePerOrder) * 100).toFixed(1)}%`,
    metric: `SAR ${costPerOrder.toFixed(2)}`,
    confidence: 'high',
    icon: 'DollarSign'
  });

  // Labor efficiency analysis
  if (reportData.trends && reportData.trends.length > 7) {
    const avgDailyRevenue = totalRevenue / reportData.trends.length;
    const estimatedDailyLabor = avgDailyRevenue * 0.25; // 25% labor cost benchmark

    insights.push({
      type: 'labor_efficiency',
      severity: estimatedDailyLabor > avgDailyRevenue * 0.3 ? 'warning' : 'info',
      title: `Labor Cost Efficiency: ${(estimatedDailyLabor / avgDailyRevenue * 100).toFixed(1)}%`,
      description: `Estimated labor costs at ${(estimatedDailyLabor / avgDailyRevenue * 100).toFixed(1)}% of daily revenue. Industry benchmark is 25-30%. ${estimatedDailyLabor > avgDailyRevenue * 0.3 ? 'Consider optimizing scheduling and staff levels.' : 'Your labor efficiency is within optimal range.'}`,
      metric: `${(estimatedDailyLabor / avgDailyRevenue * 100).toFixed(1)}%`,
      confidence: 'medium',
      icon: 'Users',
      recommendation: estimatedDailyLabor > avgDailyRevenue * 0.3 ? 'Review staff scheduling, implement time tracking, and optimize shift allocations.' : 'Maintain current labor management practices.'
    });
  }

  // Overhead optimization
  const estimatedOverhead = totalRevenue * 0.15; // 15% overhead estimate
  const overheadPerOrder = estimatedOverhead / Math.max(totalOrders, 1);

  insights.push({
    type: 'overhead_analysis',
    severity: overheadPerOrder > revenuePerOrder * 0.15 ? 'warning' : 'info',
    title: `Overhead Cost Analysis`,
    description: `Estimated overhead costs (rent, utilities, insurance) at SAR ${estimatedOverhead.toFixed(0)}. This is ${(estimatedOverhead / totalRevenue * 100).toFixed(1)}% of revenue.`,
    metric: `SAR ${estimatedOverhead.toFixed(0)}`,
    confidence: 'medium',
    icon: 'Building'
  });

  // Cost savings opportunities
  const potentialSavings = estimatedOperationalCost * 0.1; // 10% potential savings

  insights.push({
    type: 'savings_opportunity',
    severity: 'info',
    title: `Potential Cost Savings: SAR ${potentialSavings.toFixed(0)}`,
    description: `Through optimization initiatives (waste reduction, vendor negotiation, energy efficiency), you could save approximately SAR ${potentialSavings.toFixed(0)} (10% of operational costs). This would increase profit margin by ${(potentialSavings / totalRevenue * 100).toFixed(1)}%.`,
    metric: `SAR ${potentialSavings.toFixed(0)} (10% potential)`,
    confidence: 'medium',
    icon: 'TrendingDown',
    recommendation: 'Implement inventory management system, negotiate supplier contracts, and monitor energy consumption.'
  });

  return insights;
};

/**
 * Generate commission impact analysis
 * @param {Object} reportData - Report data with orders and metrics
 * @returns {Array} Array of commission impact insights
 */
export const analyzeCommissionImpact = (reportData) => {
  const insights = [];

  if (!reportData || !reportData.orderStats) {
    return insights;
  }

  const { totalRevenue, totalOrders, averageOrderValue } = reportData.orderStats;

  // Delivery commission analysis (typically 20-30% for delivery platforms)
  const deliveryRate = 0.25; // 25% commission for delivery
  const estimatedDeliveryOrders = totalOrders * 0.35; // Estimate 35% are delivery
  const deliveryCommission = estimatedDeliveryOrders * averageOrderValue * deliveryRate;

  insights.push({
    type: 'delivery_commission',
    severity: deliveryCommission > totalRevenue * 0.1 ? 'warning' : 'info',
    title: `Delivery Commission Impact: SAR ${deliveryCommission.toFixed(0)}`,
    description: `Estimated delivery platform commissions: SAR ${deliveryCommission.toFixed(0)} (${(deliveryCommission / totalRevenue * 100).toFixed(1)}% of revenue). For ${estimatedDeliveryOrders.toFixed(0)} estimated delivery orders.`,
    metric: `SAR ${deliveryCommission.toFixed(0)}`,
    confidence: 'medium',
    icon: 'Truck',
    recommendation: deliveryCommission > totalRevenue * 0.12 ? 'Negotiate better rates with delivery platforms or increase minimum order values.' : 'Current commission rates are manageable.'
  });

  // Revenue impact after commissions
  const netRevenue = totalRevenue - deliveryCommission;
  const netMargin = (netRevenue / totalRevenue * 100).toFixed(1);

  insights.push({
    type: 'net_revenue_impact',
    severity: 'info',
    title: `Net Revenue After Commissions: SAR ${netRevenue.toFixed(0)}`,
    description: `After accounting for platform commissions (${(deliveryCommission / totalRevenue * 100).toFixed(1)}%), your net revenue is SAR ${netRevenue.toFixed(0)}. This affects profitability planning.`,
    metric: `SAR ${netRevenue.toFixed(0)} (${netMargin}%)`,
    confidence: 'high',
    icon: 'DollarSign'
  });

  // Channel profitability
  const dineinOrders = totalOrders * 0.4; // 40% dine-in (no commission)
  const takeoutOrders = totalOrders * 0.25; // 25% takeout (no commission)
  const onlineOrders = totalOrders * 0.35; // 35% online (25% commission)

  const dineinRevenue = dineinOrders * averageOrderValue;
  const takeoutRevenue = takeoutOrders * averageOrderValue;
  const onlineRevenue = onlineOrders * averageOrderValue * (1 - deliveryRate);

  insights.push({
    type: 'channel_profitability',
    severity: 'info',
    title: 'Channel Profitability Comparison',
    description: `Dine-in (${(dineinOrders / totalOrders * 100).toFixed(0)}% orders, SAR ${dineinRevenue.toFixed(0)}) and Takeout (${(takeoutOrders / totalOrders * 100).toFixed(0)}% orders, SAR ${takeoutRevenue.toFixed(0)}) generate 100% margin, while Online (${(onlineOrders / totalOrders * 100).toFixed(0)}% orders, SAR ${onlineRevenue.toFixed(0)} after commission) generate ${((1 - deliveryRate) * 100).toFixed(0)}% margin.`,
    metric: 'Multi-channel analysis',
    confidence: 'high',
    icon: 'GitCompare',
    recommendation: 'Incentivize direct orders and dine-in to maximize profit margins.'
  });

  // Commission efficiency score
  const commissionEfficiency = (netRevenue / totalRevenue * 100).toFixed(1);
  const efficiencyTrend = commissionEfficiency > 85 ? 'excellent' : commissionEfficiency > 75 ? 'good' : 'needs improvement';

  insights.push({
    type: 'commission_efficiency',
    severity: commissionEfficiency > 85 ? 'info' : 'warning',
    title: `Commission Efficiency Score: ${commissionEfficiency}%`,
    description: `Your net revenue retention after commissions is ${commissionEfficiency}%, rated as ${efficiencyTrend}. Aim for >90% to maintain healthy margins.`,
    metric: `${commissionEfficiency}%`,
    confidence: 'high',
    icon: 'Award'
  });

  return insights;
};

/**
 * Generate comprehensive profitability recommendations
 * @param {Object} reportData - Report data
 * @returns {Array} Array of profitability recommendations
 */
export const generateProfitabilityRecommendations = (reportData) => {
  const recommendations = [];

  if (!reportData || !reportData.orderStats) {
    return recommendations;
  }

  const { totalRevenue, totalOrders, averageOrderValue } = reportData.orderStats;

  // Priority 1: Revenue growth
  recommendations.push({
    priority: 'high',
    category: 'Revenue Growth',
    action: 'Implement targeted marketing campaigns for high-margin items',
    impact: `Potential 5-15% revenue increase (SAR ${(totalRevenue * 0.05).toFixed(0)} - SAR ${(totalRevenue * 0.15).toFixed(0)})`,
    timeframe: '1-3 months',
    effort: 'Medium'
  });

  // Priority 2: AOV optimization
  recommendations.push({
    priority: 'high',
    category: 'Average Order Value',
    action: 'Create upsell strategies: combo meals, premium items, seasonal specials',
    impact: `${((averageOrderValue * 0.15) / totalOrders).toFixed(1)} average order value increase, ${((totalRevenue * 0.15) / totalOrders).toFixed(0)} total revenue impact`,
    timeframe: '2-4 weeks',
    effort: 'Low'
  });

  // Priority 3: Cost optimization
  recommendations.push({
    priority: 'high',
    category: 'Cost Optimization',
    action: 'Negotiate supplier contracts, reduce food waste, optimize inventory',
    impact: `SAR ${(totalRevenue * 0.1 * 0.28).toFixed(0)} in COGS savings`,
    timeframe: '1-2 months',
    effort: 'High'
  });

  // Priority 4: Channel optimization
  recommendations.push({
    priority: 'medium',
    category: 'Channel Strategy',
    action: 'Promote dine-in and takeout orders over commission-heavy delivery',
    impact: `Improve net margin by ${((0.25 * 0.35) * 100).toFixed(1)}% on 35% of orders`,
    timeframe: 'Ongoing',
    effort: 'Low'
  });

  // Priority 5: Labor efficiency
  recommendations.push({
    priority: 'medium',
    category: 'Labor Efficiency',
    action: 'Implement dynamic scheduling based on demand patterns',
    impact: `2-5% labor cost reduction (SAR ${(totalRevenue * 0.02).toFixed(0)} - SAR ${(totalRevenue * 0.05).toFixed(0)})`,
    timeframe: '1 month',
    effort: 'Medium'
  });

  // Priority 6: Customer retention
  recommendations.push({
    priority: 'medium',
    category: 'Customer Retention',
    action: 'Launch loyalty program to increase repeat orders by 20-30%',
    impact: `${(totalOrders * 0.25).toFixed(0)} additional orders, SAR ${(totalRevenue * 0.25).toFixed(0)} revenue increase`,
    timeframe: '1-3 months',
    effort: 'Medium'
  });

  return recommendations;
};

/**
 * Generate executive summary for professional report
 * @param {Object} reportData - Report data
 * @returns {String} Executive summary text
 */
export const generateExecutiveSummary = (reportData) => {
  if (!reportData || !reportData.orderStats) {
    return 'Insufficient data for analysis.';
  }

  const { totalRevenue, totalOrders, averageOrderValue } = reportData.orderStats;
  const revenueTrend = reportData.trends && reportData.trends.length > 7
    ? reportData.trends[reportData.trends.length - 1].revenue > reportData.trends[0].revenue ? 'upward' : 'downward'
    : 'stable';

  return `This Professional Report analyzes your business performance across three critical dimensions: Revenue Growth, Cost Optimization, and Commission Impact. With total revenue of SAR ${totalRevenue.toLocaleString()} from ${totalOrders} orders (average order value: SAR ${averageOrderValue.toFixed(2)}), your business shows a ${revenueTrend} trend. AI-powered insights highlight opportunities to grow revenue through improved marketing and channel optimization, reduce costs through operational efficiency, and maximize profitability by strategically managing commission expenses. Implementing the recommended actions could increase net profitability by 15-25% over the next quarter.`;
};

export default {
  analyzeRevenueGrowth,
  analyzeCostOptimization,
  analyzeCommissionImpact,
  generateProfitabilityRecommendations,
  generateExecutiveSummary
};
