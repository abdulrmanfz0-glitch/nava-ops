// src/lib/aiInsightsGenerator.js - AI-Powered Business Insights
/**
 * Advanced AI system that analyzes restaurant performance data
 * and generates actionable insights with prioritized recommendations
 *
 * Based on Restalyze v11.0.0 Platinum Edition AI Engine
 */

import { formatCurrency, formatPercentage } from '../utils/formatters';
import { calculatePlatformStatistics, getBestPerformingPlatform } from '../config/platforms';
import logger from './logger';

/**
 * Insight severity levels
 */
export const INSIGHT_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
  CRITICAL: 'critical'
};

/**
 * Impact levels for prioritization
 */
export const IMPACT_LEVELS = {
  CRITICAL: 'critical', // Immediate action required
  HIGH: 'high',         // Action needed soon
  MEDIUM: 'medium',     // Should be addressed
  LOW: 'low'            // Nice to have
};

/**
 * Industry benchmarks for comparison
 */
const INDUSTRY_BENCHMARKS = {
  profitMargin: {
    excellent: 20,
    good: 15,
    average: 10,
    poor: 5
  },
  revenueGrowth: {
    excellent: 20,
    good: 15,
    average: 10,
    poor: 5
  },
  orderGrowth: {
    excellent: 15,
    good: 10,
    average: 5,
    poor: 0
  },
  avgOrderValue: {
    premium: 75,
    high: 50,
    medium: 35,
    low: 20
  },
  customerSatisfaction: {
    excellent: 4.5,
    good: 4.0,
    average: 3.5,
    poor: 3.0
  }
};

/**
 * Generate comprehensive AI insights from restaurant data
 * @param {object} restaurantData - Restaurant profile and metadata
 * @param {object} performanceData - Performance metrics
 * @param {object} options - Configuration options
 * @returns {Array<object>} Array of insights with recommendations
 */
export const generateAIInsights = (restaurantData, performanceData, options = {}) => {
  const {
    maxInsights = 10,
    minImpact = 'low',
    includeActions = true
  } = options;

  const insights = [];

  try {
    // 1. Revenue Growth Analysis
    if (performanceData.revenueGrowth !== undefined) {
      insights.push(...analyzeRevenueGrowth(performanceData.revenueGrowth));
    }

    // 2. Profit Margin Analysis
    if (performanceData.profitMargin !== undefined) {
      insights.push(...analyzeProfitMargin(performanceData.profitMargin, performanceData.revenue));
    }

    // 3. Order Volume Analysis
    if (performanceData.orderGrowth !== undefined) {
      insights.push(...analyzeOrderGrowth(performanceData.orderGrowth, performanceData.totalOrders));
    }

    // 4. Customer Behavior Analysis
    if (performanceData.avgOrderValue !== undefined) {
      insights.push(...analyzeCustomerBehavior(performanceData.avgOrderValue));
    }

    // 5. Platform Performance Analysis
    if (performanceData.platforms && performanceData.platforms.length > 0) {
      insights.push(...analyzePlatformPerformance(performanceData.platforms));
    }

    // 6. Customer Satisfaction Analysis
    if (performanceData.customerSatisfaction !== undefined) {
      insights.push(...analyzeCustomerSatisfaction(performanceData.customerSatisfaction));
    }

    // 7. Operational Efficiency Analysis
    if (performanceData.operationalEfficiency !== undefined) {
      insights.push(...analyzeOperationalEfficiency(performanceData.operationalEfficiency));
    }

    // 8. Cost Analysis
    if (performanceData.expenses && performanceData.revenue) {
      insights.push(...analyzeCosts(performanceData.expenses, performanceData.revenue));
    }

    // 9. Menu Performance Analysis
    if (performanceData.menuItems && performanceData.menuItems.length > 0) {
      insights.push(...analyzeMenuPerformance(performanceData.menuItems));
    }

    // 10. Competitive Position Analysis
    if (performanceData.marketShare !== undefined) {
      insights.push(...analyzeCompetitivePosition(performanceData.marketShare));
    }

    // Sort by impact (critical first) and filter
    const filteredInsights = insights
      .filter(insight => shouldIncludeInsight(insight, minImpact))
      .sort(compareInsightPriority)
      .slice(0, maxInsights);

    logger.debug('AI Insights generated', {
      totalGenerated: insights.length,
      filtered: filteredInsights.length,
      minImpact
    });

    return filteredInsights;
  } catch (error) {
    logger.error('Error generating AI insights', { error: error.message });
    return [];
  }
};

/**
 * Analyze revenue growth trends
 */
function analyzeRevenueGrowth(revenueGrowth) {
  const insights = [];

  if (revenueGrowth >= INDUSTRY_BENCHMARKS.revenueGrowth.excellent) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '🚀 Exceptional Revenue Growth',
      message: `Your restaurant is experiencing outstanding growth at ${formatPercentage(revenueGrowth)}! This momentum indicates strong market demand and customer satisfaction.`,
      impact: IMPACT_LEVELS.HIGH,
      action: 'Consider scaling operations, expanding menu offerings, or opening new locations to capitalize on this growth trajectory.',
      metrics: {
        currentGrowth: revenueGrowth,
        benchmark: INDUSTRY_BENCHMARKS.revenueGrowth.excellent,
        performance: 'Excellent'
      },
      category: 'revenue',
      priority: 1
    });
  } else if (revenueGrowth >= INDUSTRY_BENCHMARKS.revenueGrowth.good) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '📈 Strong Revenue Performance',
      message: `Revenue growing at ${formatPercentage(revenueGrowth)} - above industry average. Maintain this positive trend.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Focus on customer retention strategies and explore opportunities to accelerate growth through targeted marketing.',
      metrics: {
        currentGrowth: revenueGrowth,
        benchmark: INDUSTRY_BENCHMARKS.revenueGrowth.good,
        performance: 'Good'
      },
      category: 'revenue',
      priority: 3
    });
  } else if (revenueGrowth >= INDUSTRY_BENCHMARKS.revenueGrowth.average) {
    insights.push({
      type: INSIGHT_TYPES.INFO,
      title: '📊 Average Revenue Growth',
      message: `Revenue growth of ${formatPercentage(revenueGrowth)} is on par with industry standards. Room for improvement exists.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Analyze top-performing competitors and implement proven strategies to accelerate growth above market average.',
      metrics: {
        currentGrowth: revenueGrowth,
        benchmark: INDUSTRY_BENCHMARKS.revenueGrowth.average,
        performance: 'Average'
      },
      category: 'revenue',
      priority: 4
    });
  } else if (revenueGrowth < 0) {
    insights.push({
      type: INSIGHT_TYPES.CRITICAL,
      title: '⚠️ Revenue Decline Detected',
      message: `Critical: Revenue declining at ${formatPercentage(Math.abs(revenueGrowth))}. Immediate intervention required.`,
      impact: IMPACT_LEVELS.CRITICAL,
      action: 'Conduct urgent analysis of customer feedback, pricing strategy, and competitive positioning. Consider promotional campaigns and menu optimization.',
      metrics: {
        currentGrowth: revenueGrowth,
        benchmark: 0,
        performance: 'Critical'
      },
      category: 'revenue',
      priority: 0
    });
  } else {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: '⚡ Slow Revenue Growth',
      message: `Revenue growth of ${formatPercentage(revenueGrowth)} is below industry expectations. Action needed.`,
      impact: IMPACT_LEVELS.HIGH,
      action: 'Review pricing strategy, enhance marketing efforts, and improve customer experience to boost revenue.',
      metrics: {
        currentGrowth: revenueGrowth,
        benchmark: INDUSTRY_BENCHMARKS.revenueGrowth.poor,
        performance: 'Below Average'
      },
      category: 'revenue',
      priority: 2
    });
  }

  return insights;
}

/**
 * Analyze profit margin
 */
function analyzeProfitMargin(profitMargin, revenue = 0) {
  const insights = [];

  if (profitMargin >= INDUSTRY_BENCHMARKS.profitMargin.excellent) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '💎 Exceptional Profit Margins',
      message: `Outstanding profit margin of ${formatPercentage(profitMargin)} significantly exceeds industry standards.`,
      impact: IMPACT_LEVELS.LOW,
      action: 'Maintain current cost management practices and consider reinvesting excess profits in growth initiatives.',
      metrics: {
        currentMargin: profitMargin,
        benchmark: INDUSTRY_BENCHMARKS.profitMargin.excellent,
        performance: 'Excellent'
      },
      category: 'profitability',
      priority: 5
    });
  } else if (profitMargin >= INDUSTRY_BENCHMARKS.profitMargin.good) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '✅ Healthy Profit Margins',
      message: `Profit margin of ${formatPercentage(profitMargin)} indicates strong financial health.`,
      impact: IMPACT_LEVELS.LOW,
      action: 'Continue current practices while exploring opportunities for incremental margin improvement.',
      metrics: {
        currentMargin: profitMargin,
        benchmark: INDUSTRY_BENCHMARKS.profitMargin.good,
        performance: 'Good'
      },
      category: 'profitability',
      priority: 6
    });
  } else if (profitMargin < INDUSTRY_BENCHMARKS.profitMargin.poor) {
    insights.push({
      type: INSIGHT_TYPES.CRITICAL,
      title: '🔴 Critical: Low Profit Margin',
      message: `Profit margin of ${formatPercentage(profitMargin)} is dangerously low and threatens sustainability.`,
      impact: IMPACT_LEVELS.CRITICAL,
      action: 'Urgent: Review all costs, renegotiate supplier contracts, optimize menu pricing, and reduce waste. Consider eliminating unprofitable menu items.',
      metrics: {
        currentMargin: profitMargin,
        benchmark: INDUSTRY_BENCHMARKS.profitMargin.poor,
        performance: 'Critical',
        potentialRevenueLoss: revenue * (INDUSTRY_BENCHMARKS.profitMargin.poor - profitMargin) / 100
      },
      category: 'profitability',
      priority: 0
    });
  } else {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: '⚠️ Below-Average Profit Margin',
      message: `Current margin of ${formatPercentage(profitMargin)} is below industry average of ${INDUSTRY_BENCHMARKS.profitMargin.average}%.`,
      impact: IMPACT_LEVELS.HIGH,
      action: 'Analyze cost structure, optimize menu pricing, reduce platform commissions by diversifying channels, and improve operational efficiency.',
      metrics: {
        currentMargin: profitMargin,
        benchmark: INDUSTRY_BENCHMARKS.profitMargin.average,
        performance: 'Below Average',
        improvementOpportunity: revenue * (INDUSTRY_BENCHMARKS.profitMargin.average - profitMargin) / 100
      },
      category: 'profitability',
      priority: 1
    });
  }

  return insights;
}

/**
 * Analyze order growth
 */
function analyzeOrderGrowth(orderGrowth, totalOrders = 0) {
  const insights = [];

  if (orderGrowth >= INDUSTRY_BENCHMARKS.orderGrowth.excellent) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '🎯 Exceptional Order Volume Growth',
      message: `Order volume surging at ${formatPercentage(orderGrowth)} - significantly outpacing market.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Ensure kitchen capacity can handle increased demand. Consider hiring additional staff or optimizing workflows.',
      metrics: {
        currentGrowth: orderGrowth,
        totalOrders,
        benchmark: INDUSTRY_BENCHMARKS.orderGrowth.excellent,
        performance: 'Excellent'
      },
      category: 'orders',
      priority: 3
    });
  } else if (orderGrowth < 0) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: '📉 Declining Order Volume',
      message: `Order volume declining at ${formatPercentage(Math.abs(orderGrowth))}. Customer acquisition needs attention.`,
      impact: IMPACT_LEVELS.HIGH,
      action: 'Launch marketing campaigns, introduce special offers, improve delivery times, and enhance menu appeal.',
      metrics: {
        currentGrowth: orderGrowth,
        totalOrders,
        benchmark: 0,
        performance: 'Declining'
      },
      category: 'orders',
      priority: 2
    });
  }

  return insights;
}

/**
 * Analyze customer behavior based on average order value
 */
function analyzeCustomerBehavior(avgOrderValue) {
  const insights = [];

  if (avgOrderValue >= INDUSTRY_BENCHMARKS.avgOrderValue.premium) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '👑 Premium Customer Base',
      message: `Exceptional average order value of ${formatCurrency(avgOrderValue)} indicates premium market positioning.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Maintain quality standards, introduce premium menu items, and implement loyalty programs for high-value customers.',
      metrics: {
        currentAOV: avgOrderValue,
        benchmark: INDUSTRY_BENCHMARKS.avgOrderValue.premium,
        customerSegment: 'Premium'
      },
      category: 'customer',
      priority: 4
    });
  } else if (avgOrderValue < INDUSTRY_BENCHMARKS.avgOrderValue.low) {
    insights.push({
      type: INSIGHT_TYPES.INFO,
      title: '💡 Opportunity: Increase Order Value',
      message: `Average order value of ${formatCurrency(avgOrderValue)} suggests upselling potential.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Implement combo deals, meal bundles, and strategic upselling techniques. Train staff on add-on suggestions.',
      metrics: {
        currentAOV: avgOrderValue,
        benchmark: INDUSTRY_BENCHMARKS.avgOrderValue.medium,
        upliftPotential: INDUSTRY_BENCHMARKS.avgOrderValue.medium - avgOrderValue
      },
      category: 'customer',
      priority: 4
    });
  }

  return insights;
}

/**
 * Analyze platform performance
 */
function analyzePlatformPerformance(platforms) {
  const insights = [];

  if (!platforms || platforms.length === 0) return insights;

  // Find best and worst performing platforms
  const sortedByMargin = [...platforms].sort((a, b) => b.profitMargin - a.profitMargin);
  const bestPlatform = sortedByMargin[0];
  const worstPlatform = sortedByMargin[sortedByMargin.length - 1];

  if (bestPlatform && bestPlatform.profitMargin > 15) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: `🏆 ${bestPlatform.name} - Top Performer`,
      message: `${bestPlatform.name} delivering exceptional ${formatPercentage(bestPlatform.profitMargin)} profit margin.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: `Allocate more marketing budget to ${bestPlatform.name} and optimize menu specifically for this platform.`,
      metrics: {
        platformName: bestPlatform.name,
        profitMargin: bestPlatform.profitMargin,
        revenue: bestPlatform.revenue
      },
      category: 'platform',
      priority: 3
    });
  }

  if (worstPlatform && worstPlatform.profitMargin < 5) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: `⚠️ ${worstPlatform.name} - Underperforming`,
      message: `${worstPlatform.name} generating only ${formatPercentage(worstPlatform.profitMargin)} profit margin.`,
      impact: IMPACT_LEVELS.HIGH,
      action: `Consider renegotiating commission rates with ${worstPlatform.name} or reducing presence on this platform. Focus on higher-margin alternatives.`,
      metrics: {
        platformName: worstPlatform.name,
        profitMargin: worstPlatform.profitMargin,
        revenue: worstPlatform.revenue
      },
      category: 'platform',
      priority: 2
    });
  }

  return insights;
}

/**
 * Analyze customer satisfaction
 */
function analyzeCustomerSatisfaction(satisfaction) {
  const insights = [];

  if (satisfaction >= INDUSTRY_BENCHMARKS.customerSatisfaction.excellent) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '⭐ Exceptional Customer Satisfaction',
      message: `Outstanding rating of ${satisfaction}/5.0 - customers love your restaurant!`,
      impact: IMPACT_LEVELS.LOW,
      action: 'Leverage positive reviews in marketing. Request testimonials and showcase top ratings on social media.',
      metrics: {
        currentRating: satisfaction,
        benchmark: INDUSTRY_BENCHMARKS.customerSatisfaction.excellent
      },
      category: 'satisfaction',
      priority: 6
    });
  } else if (satisfaction < INDUSTRY_BENCHMARKS.customerSatisfaction.poor) {
    insights.push({
      type: INSIGHT_TYPES.CRITICAL,
      title: '🔴 Critical: Low Customer Satisfaction',
      message: `Rating of ${satisfaction}/5.0 is critically low and impacting business.`,
      impact: IMPACT_LEVELS.CRITICAL,
      action: 'Immediate action required: Review recent negative feedback, improve food quality, speed up delivery times, and enhance customer service training.',
      metrics: {
        currentRating: satisfaction,
        benchmark: INDUSTRY_BENCHMARKS.customerSatisfaction.poor
      },
      category: 'satisfaction',
      priority: 0
    });
  }

  return insights;
}

/**
 * Analyze operational efficiency
 */
function analyzeOperationalEfficiency(efficiency) {
  const insights = [];

  if (efficiency >= 90) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '⚡ Optimal Operational Efficiency',
      message: `Efficiency score of ${efficiency}% demonstrates excellent operations management.`,
      impact: IMPACT_LEVELS.LOW,
      action: 'Document current processes as best practices and consider sharing knowledge with other branches.',
      metrics: {
        currentEfficiency: efficiency,
        benchmark: 90
      },
      category: 'operations',
      priority: 7
    });
  } else if (efficiency < 70) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: '⚠️ Operational Inefficiency Detected',
      message: `Efficiency score of ${efficiency}% indicates process optimization opportunities.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Analyze workflows, reduce waste, optimize staff scheduling, and implement kitchen automation where possible.',
      metrics: {
        currentEfficiency: efficiency,
        benchmark: 80,
        improvementPotential: 80 - efficiency
      },
      category: 'operations',
      priority: 3
    });
  }

  return insights;
}

/**
 * Analyze costs
 */
function analyzeCosts(expenses, revenue) {
  const insights = [];
  const costRatio = (expenses / revenue) * 100;

  if (costRatio > 70) {
    insights.push({
      type: INSIGHT_TYPES.CRITICAL,
      title: '🔴 Excessive Operating Costs',
      message: `Operating costs at ${formatPercentage(costRatio)} of revenue - unsustainable level.`,
      impact: IMPACT_LEVELS.CRITICAL,
      action: 'Urgent cost reduction required: Renegotiate supplier contracts, reduce waste, optimize inventory, and review staffing levels.',
      metrics: {
        costRatio,
        expenses: formatCurrency(expenses),
        revenue: formatCurrency(revenue),
        benchmark: 60
      },
      category: 'costs',
      priority: 0
    });
  } else if (costRatio < 50) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '💰 Excellent Cost Management',
      message: `Operating costs at ${formatPercentage(costRatio)} of revenue - very healthy ratio.`,
      impact: IMPACT_LEVELS.LOW,
      action: 'Maintain current cost discipline while ensuring quality standards remain high.',
      metrics: {
        costRatio,
        expenses: formatCurrency(expenses),
        revenue: formatCurrency(revenue),
        benchmark: 60
      },
      category: 'costs',
      priority: 7
    });
  }

  return insights;
}

/**
 * Analyze menu performance
 */
function analyzeMenuPerformance(menuItems) {
  const insights = [];

  if (!menuItems || menuItems.length === 0) return insights;

  const topPerformers = menuItems
    .filter(item => item.popularity > 80 && item.profitMargin > 20)
    .length;

  const underperformers = menuItems
    .filter(item => item.popularity < 20 || item.profitMargin < 5)
    .length;

  if (topPerformers > 0) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: `🌟 ${topPerformers} Star Menu Items`,
      message: `You have ${topPerformers} menu items that are both popular and profitable.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Feature these items prominently in marketing and ensure consistent availability.',
      metrics: {
        starItems: topPerformers,
        totalItems: menuItems.length
      },
      category: 'menu',
      priority: 4
    });
  }

  if (underperformers > 0) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: `⚠️ ${underperformers} Underperforming Items`,
      message: `${underperformers} menu items have low sales or poor profitability.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Consider removing or reformulating underperforming items. Analyze why they fail to attract customers.',
      metrics: {
        underperformingItems: underperformers,
        totalItems: menuItems.length
      },
      category: 'menu',
      priority: 3
    });
  }

  return insights;
}

/**
 * Analyze competitive position
 */
function analyzeCompetitivePosition(marketShare) {
  const insights = [];

  if (marketShare >= 25) {
    insights.push({
      type: INSIGHT_TYPES.SUCCESS,
      title: '🏆 Market Leader Position',
      message: `Commanding ${formatPercentage(marketShare)} market share - dominant position.`,
      impact: IMPACT_LEVELS.HIGH,
      action: 'Defend market position through innovation, customer loyalty programs, and strategic partnerships.',
      metrics: {
        marketShare,
        position: 'Leader'
      },
      category: 'competitive',
      priority: 2
    });
  } else if (marketShare < 5) {
    insights.push({
      type: INSIGHT_TYPES.INFO,
      title: '📊 Growth Opportunity',
      message: `Market share of ${formatPercentage(marketShare)} indicates significant expansion potential.`,
      impact: IMPACT_LEVELS.MEDIUM,
      action: 'Aggressive marketing, competitive pricing, and unique value proposition needed to capture market share.',
      metrics: {
        marketShare,
        position: 'Challenger',
        growthPotential: 15 - marketShare
      },
      category: 'competitive',
      priority: 4
    });
  }

  return insights;
}

/**
 * Filter insights based on minimum impact level
 */
function shouldIncludeInsight(insight, minImpact) {
  const impactOrder = ['low', 'medium', 'high', 'critical'];
  const insightImpactIndex = impactOrder.indexOf(insight.impact);
  const minImpactIndex = impactOrder.indexOf(minImpact);
  return insightImpactIndex >= minImpactIndex;
}

/**
 * Compare insights for sorting by priority
 */
function compareInsightPriority(a, b) {
  // First by priority (lower number = higher priority)
  if (a.priority !== b.priority) {
    return a.priority - b.priority;
  }

  // Then by impact level
  const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return impactOrder[a.impact] - impactOrder[b.impact];
}

export default {
  generateAIInsights,
  INSIGHT_TYPES,
  IMPACT_LEVELS,
  INDUSTRY_BENCHMARKS
};
