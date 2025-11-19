// src/lib/platformAnalytics.js - Platform Analytics Library
/**
 * Comprehensive Platform Analytics Library for Nava-Ops
 * Provides per-platform metrics calculation, performance tracking,
 * and comparative analysis across all delivery platforms
 *
 * Built on top of platform configuration from src/config/platforms.js
 * @module platformAnalytics
 */

import { logger } from './logger.js';
import {
  SUPPORTED_PLATFORMS,
  calculatePlatformCommission,
  calculatePlatformStatistics,
  getBestPerformingPlatform
} from '../config/platforms.js';
import { formatCurrency, formatPercentage, calculatePercentageChange } from '../utils/formatters.js';

/**
 * Calculate comprehensive platform metrics
 *
 * @param {Array<Object>} orders - Array of orders with platformId and amount
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeTrends - Include trend analysis (default: true)
 * @param {boolean} options.includeRankings - Include platform rankings (default: true)
 * @returns {Object} Comprehensive platform metrics
 *
 * @example
 * const metrics = calculatePlatformMetrics([
 *   { platformId: 'hungerstation', amount: 1000, date: '2024-01-01' },
 *   { platformId: 'jahez', amount: 1500, date: '2024-01-01' }
 * ]);
 */
export const calculatePlatformMetrics = (orders, options = {}) => {
  try {
    const {
      includeTrends = true,
      includeRankings = true
    } = options;

    // Validate input
    if (!orders || !Array.isArray(orders)) {
      logger.error('Invalid orders provided to calculatePlatformMetrics');
      return getEmptyMetrics();
    }

    if (orders.length === 0) {
      logger.warn('Empty orders array provided to calculatePlatformMetrics');
      return getEmptyMetrics();
    }

    // Use the base statistics calculator from platforms.js
    const baseStats = calculatePlatformStatistics(orders);

    // Enhance with additional analytics
    const enhancedStats = {};
    let totalGMV = 0;
    let totalCommission = 0;
    let totalNetRevenue = 0;
    let totalOrders = 0;

    // Calculate totals and enhance stats
    Object.entries(baseStats).forEach(([platformId, stats]) => {
      totalGMV += stats.totalGMV;
      totalCommission += stats.totalCommission;
      totalNetRevenue += stats.netRevenue;
      totalOrders += stats.orderCount;

      enhancedStats[platformId] = {
        ...stats,
        // Add formatted values
        formatted: {
          totalGMV: formatCurrency(stats.totalGMV),
          totalCommission: formatCurrency(stats.totalCommission),
          netRevenue: formatCurrency(stats.netRevenue),
          avgOrderValue: formatCurrency(stats.avgOrderValue),
          profitMargin: formatPercentage(stats.profitMargin),
          commissionRate: formatPercentage(stats.commissionRate * 100)
        },
        // Add performance indicators
        performance: {
          revenueScore: calculateRevenueScore(stats.totalGMV, totalGMV),
          efficiencyScore: calculateEfficiencyScore(stats.profitMargin),
          volumeScore: calculateVolumeScore(stats.orderCount, totalOrders)
        }
      };
    });

    // Calculate market share
    Object.keys(enhancedStats).forEach(platformId => {
      const stats = enhancedStats[platformId];
      stats.marketShare = {
        byRevenue: totalGMV > 0 ? (stats.totalGMV / totalGMV) * 100 : 0,
        byOrders: totalOrders > 0 ? (stats.orderCount / totalOrders) * 100 : 0,
        formatted: {
          byRevenue: formatPercentage(totalGMV > 0 ? (stats.totalGMV / totalGMV) * 100 : 0),
          byOrders: formatPercentage(totalOrders > 0 ? (stats.orderCount / totalOrders) * 100 : 0)
        }
      };
    });

    // Calculate rankings if requested
    let rankings = null;
    if (includeRankings) {
      rankings = calculatePlatformRankings(enhancedStats);
    }

    // Calculate trends if requested
    let trends = null;
    if (includeTrends) {
      trends = calculatePlatformTrends(orders);
    }

    const result = {
      platforms: enhancedStats,
      summary: {
        totalGMV,
        totalCommission,
        totalNetRevenue,
        totalOrders,
        averageCommissionRate: totalGMV > 0 ? (totalCommission / totalGMV) * 100 : 0,
        averageOrderValue: totalOrders > 0 ? totalGMV / totalOrders : 0,
        overallProfitMargin: totalGMV > 0 ? (totalNetRevenue / totalGMV) * 100 : 0,
        platformCount: Object.keys(enhancedStats).length,
        formatted: {
          totalGMV: formatCurrency(totalGMV),
          totalCommission: formatCurrency(totalCommission),
          totalNetRevenue: formatCurrency(totalNetRevenue),
          averageOrderValue: formatCurrency(totalOrders > 0 ? totalGMV / totalOrders : 0),
          averageCommissionRate: formatPercentage(totalGMV > 0 ? (totalCommission / totalGMV) * 100 : 0)
        }
      },
      rankings,
      trends,
      metadata: {
        orderCount: orders.length,
        calculatedAt: new Date().toISOString()
      }
    };

    logger.info('Platform metrics calculated', {
      platformCount: Object.keys(enhancedStats).length,
      totalOrders: orders.length,
      totalGMV
    });

    return result;
  } catch (error) {
    logger.error('Failed to calculate platform metrics', {
      error: error.message,
      stack: error.stack
    });
    return getEmptyMetrics();
  }
};

/**
 * Calculate revenue score (0-100)
 *
 * @param {number} platformRevenue - Platform revenue
 * @param {number} totalRevenue - Total revenue across all platforms
 * @returns {number} Score from 0-100
 */
const calculateRevenueScore = (platformRevenue, totalRevenue) => {
  if (totalRevenue === 0) return 0;
  const share = (platformRevenue / totalRevenue) * 100;
  return Math.min(100, Math.round(share * 2)); // Scale up to 100
};

/**
 * Calculate efficiency score based on profit margin
 *
 * @param {number} profitMargin - Profit margin percentage
 * @returns {number} Score from 0-100
 */
const calculateEfficiencyScore = (profitMargin) => {
  // Normalize profit margin to 0-100 scale (assume 25% margin is excellent)
  return Math.min(100, Math.round((profitMargin / 25) * 100));
};

/**
 * Calculate volume score (0-100)
 *
 * @param {number} platformOrders - Platform order count
 * @param {number} totalOrders - Total orders across all platforms
 * @returns {number} Score from 0-100
 */
const calculateVolumeScore = (platformOrders, totalOrders) => {
  if (totalOrders === 0) return 0;
  const share = (platformOrders / totalOrders) * 100;
  return Math.min(100, Math.round(share * 2)); // Scale up to 100
};

/**
 * Calculate platform rankings
 *
 * @param {Object} platformStats - Platform statistics object
 * @returns {Object} Platform rankings
 */
const calculatePlatformRankings = (platformStats) => {
  const platforms = Object.entries(platformStats).map(([id, stats]) => ({
    platformId: id,
    platformName: stats.platformName,
    ...stats
  }));

  // Sort by different metrics
  const byRevenue = [...platforms].sort((a, b) => b.totalGMV - a.totalGMV);
  const byOrders = [...platforms].sort((a, b) => b.orderCount - a.orderCount);
  const byProfitMargin = [...platforms].sort((a, b) => b.profitMargin - a.profitMargin);
  const byAvgOrderValue = [...platforms].sort((a, b) => b.avgOrderValue - a.avgOrderValue);

  return {
    byRevenue: byRevenue.map((p, index) => ({
      rank: index + 1,
      platformId: p.platformId,
      platformName: p.platformName,
      value: p.totalGMV,
      formatted: formatCurrency(p.totalGMV)
    })),
    byOrders: byOrders.map((p, index) => ({
      rank: index + 1,
      platformId: p.platformId,
      platformName: p.platformName,
      value: p.orderCount,
      formatted: p.orderCount.toLocaleString()
    })),
    byProfitMargin: byProfitMargin.map((p, index) => ({
      rank: index + 1,
      platformId: p.platformId,
      platformName: p.platformName,
      value: p.profitMargin,
      formatted: formatPercentage(p.profitMargin)
    })),
    byAvgOrderValue: byAvgOrderValue.map((p, index) => ({
      rank: index + 1,
      platformId: p.platformId,
      platformName: p.platformName,
      value: p.avgOrderValue,
      formatted: formatCurrency(p.avgOrderValue)
    })),
    best: {
      revenue: byRevenue[0]?.platformName || 'N/A',
      orders: byOrders[0]?.platformName || 'N/A',
      profitMargin: byProfitMargin[0]?.platformName || 'N/A',
      avgOrderValue: byAvgOrderValue[0]?.platformName || 'N/A'
    },
    worst: {
      revenue: byRevenue[byRevenue.length - 1]?.platformName || 'N/A',
      orders: byOrders[byOrders.length - 1]?.platformName || 'N/A',
      profitMargin: byProfitMargin[byProfitMargin.length - 1]?.platformName || 'N/A',
      avgOrderValue: byAvgOrderValue[byAvgOrderValue.length - 1]?.platformName || 'N/A'
    }
  };
};

/**
 * Calculate platform trends over time
 *
 * @param {Array<Object>} orders - Orders with date information
 * @returns {Object} Trend analysis
 */
const calculatePlatformTrends = (orders) => {
  try {
    // Group orders by date and platform
    const ordersByDate = {};

    orders.forEach(order => {
      if (!order.date) return;

      const date = new Date(order.date).toISOString().split('T')[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = {};
      }
      if (!ordersByDate[date][order.platformId]) {
        ordersByDate[date][order.platformId] = { revenue: 0, orders: 0 };
      }

      ordersByDate[date][order.platformId].revenue += order.amount || 0;
      ordersByDate[date][order.platformId].orders += 1;
    });

    // Calculate growth rates
    const dates = Object.keys(ordersByDate).sort();
    if (dates.length < 2) {
      return { available: false, message: 'Insufficient date range for trends' };
    }

    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    const platformTrends = {};

    SUPPORTED_PLATFORMS.forEach(platform => {
      const firstPeriod = ordersByDate[firstDate]?.[platform.id] || { revenue: 0, orders: 0 };
      const lastPeriod = ordersByDate[lastDate]?.[platform.id] || { revenue: 0, orders: 0 };

      const revenueGrowth = calculatePercentageChange(firstPeriod.revenue, lastPeriod.revenue);
      const orderGrowth = calculatePercentageChange(firstPeriod.orders, lastPeriod.orders);

      platformTrends[platform.id] = {
        platformName: platform.name,
        revenueGrowth,
        orderGrowth,
        trend: revenueGrowth > 0 ? 'up' : revenueGrowth < 0 ? 'down' : 'stable',
        formatted: {
          revenueGrowth: formatPercentage(revenueGrowth),
          orderGrowth: formatPercentage(orderGrowth)
        }
      };
    });

    return {
      available: true,
      dateRange: { from: firstDate, to: lastDate },
      platforms: platformTrends
    };
  } catch (error) {
    logger.error('Failed to calculate platform trends', { error: error.message });
    return { available: false, message: 'Error calculating trends' };
  }
};

/**
 * Compare two platforms
 *
 * @param {string} platformId1 - First platform ID
 * @param {string} platformId2 - Second platform ID
 * @param {Array<Object>} orders - Orders array
 * @returns {Object} Comparison results
 */
export const comparePlatforms = (platformId1, platformId2, orders) => {
  try {
    const metrics = calculatePlatformMetrics(orders, {
      includeTrends: false,
      includeRankings: false
    });

    const platform1 = metrics.platforms[platformId1];
    const platform2 = metrics.platforms[platformId2];

    if (!platform1 || !platform2) {
      logger.warn('One or both platforms not found in comparison', { platformId1, platformId2 });
      return null;
    }

    return {
      platform1: {
        id: platformId1,
        name: platform1.platformName,
        metrics: platform1
      },
      platform2: {
        id: platformId2,
        name: platform2.platformName,
        metrics: platform2
      },
      comparison: {
        revenue: {
          difference: platform1.totalGMV - platform2.totalGMV,
          percentageDiff: calculatePercentageChange(platform2.totalGMV, platform1.totalGMV),
          winner: platform1.totalGMV > platform2.totalGMV ? platformId1 : platformId2
        },
        orders: {
          difference: platform1.orderCount - platform2.orderCount,
          percentageDiff: calculatePercentageChange(platform2.orderCount, platform1.orderCount),
          winner: platform1.orderCount > platform2.orderCount ? platformId1 : platformId2
        },
        profitMargin: {
          difference: platform1.profitMargin - platform2.profitMargin,
          winner: platform1.profitMargin > platform2.profitMargin ? platformId1 : platformId2
        },
        avgOrderValue: {
          difference: platform1.avgOrderValue - platform2.avgOrderValue,
          percentageDiff: calculatePercentageChange(platform2.avgOrderValue, platform1.avgOrderValue),
          winner: platform1.avgOrderValue > platform2.avgOrderValue ? platformId1 : platformId2
        }
      }
    };
  } catch (error) {
    logger.error('Failed to compare platforms', { error: error.message });
    return null;
  }
};

/**
 * Get platform performance summary
 *
 * @param {string} platformId - Platform ID
 * @param {Array<Object>} orders - Orders array
 * @returns {Object} Platform performance summary
 */
export const getPlatformSummary = (platformId, orders) => {
  try {
    const metrics = calculatePlatformMetrics(orders);
    const platformData = metrics.platforms[platformId];

    if (!platformData) {
      logger.warn('Platform not found', { platformId });
      return null;
    }

    // Get ranking information
    const revenueRank = metrics.rankings?.byRevenue.find(r => r.platformId === platformId)?.rank || 0;
    const ordersRank = metrics.rankings?.byOrders.find(r => r.platformId === platformId)?.rank || 0;

    return {
      platformId,
      platformName: platformData.platformName,
      metrics: {
        totalGMV: platformData.totalGMV,
        totalCommission: platformData.totalCommission,
        netRevenue: platformData.netRevenue,
        orderCount: platformData.orderCount,
        avgOrderValue: platformData.avgOrderValue,
        profitMargin: platformData.profitMargin,
        commissionRate: platformData.commissionRate
      },
      formatted: platformData.formatted,
      marketShare: platformData.marketShare,
      performance: platformData.performance,
      rankings: {
        byRevenue: revenueRank,
        byOrders: ordersRank
      },
      trend: metrics.trends?.platforms?.[platformId] || null
    };
  } catch (error) {
    logger.error('Failed to get platform summary', { error: error.message });
    return null;
  }
};

/**
 * Get empty metrics object (used on errors)
 *
 * @returns {Object} Empty metrics object
 */
const getEmptyMetrics = () => {
  return {
    platforms: {},
    summary: {
      totalGMV: 0,
      totalCommission: 0,
      totalNetRevenue: 0,
      totalOrders: 0,
      averageCommissionRate: 0,
      averageOrderValue: 0,
      overallProfitMargin: 0,
      platformCount: 0,
      formatted: {
        totalGMV: formatCurrency(0),
        totalCommission: formatCurrency(0),
        totalNetRevenue: formatCurrency(0),
        averageOrderValue: formatCurrency(0),
        averageCommissionRate: formatPercentage(0)
      }
    },
    rankings: null,
    trends: null,
    metadata: {
      orderCount: 0,
      calculatedAt: new Date().toISOString(),
      error: true
    }
  };
};

/**
 * Calculate commission savings analysis
 *
 * @param {Array<Object>} orders - Orders array
 * @returns {Object} Commission savings analysis
 */
export const analyzeCommissionSavings = (orders) => {
  try {
    const metrics = calculatePlatformMetrics(orders);

    // Find platform with lowest commission
    const platformsArray = Object.entries(metrics.platforms).map(([id, stats]) => ({
      id,
      ...stats
    }));

    const lowestCommissionPlatform = platformsArray.reduce((min, p) =>
      p.commissionRate < min.commissionRate ? p : min
    );

    // Calculate potential savings if all orders were on lowest commission platform
    const totalGMV = metrics.summary.totalGMV;
    const currentCommission = metrics.summary.totalCommission;
    const potentialCommission = totalGMV * lowestCommissionPlatform.commissionRate;
    const potentialSavings = currentCommission - potentialCommission;

    return {
      currentCommission,
      potentialCommission,
      potentialSavings,
      savingsPercentage: currentCommission > 0 ? (potentialSavings / currentCommission) * 100 : 0,
      lowestCommissionPlatform: {
        id: lowestCommissionPlatform.id,
        name: lowestCommissionPlatform.platformName,
        rate: lowestCommissionPlatform.commissionRate
      },
      formatted: {
        currentCommission: formatCurrency(currentCommission),
        potentialCommission: formatCurrency(potentialCommission),
        potentialSavings: formatCurrency(potentialSavings),
        savingsPercentage: formatPercentage(currentCommission > 0 ? (potentialSavings / currentCommission) * 100 : 0)
      }
    };
  } catch (error) {
    logger.error('Failed to analyze commission savings', { error: error.message });
    return null;
  }
};

// Export default object with all functions
export default {
  calculatePlatformMetrics,
  comparePlatforms,
  getPlatformSummary,
  analyzeCommissionSavings
};
