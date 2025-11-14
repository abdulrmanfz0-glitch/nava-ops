/**
 * Channel Performance Service
 * Handles all channel performance calculations, aggregations, and commission tracking
 */

import { logger } from '@/lib/logger';

// Channel definitions
export const CHANNELS = {
  DINE_IN: { id: 'dine_in', name: 'Dine-In', color: '#0088FF', icon: 'Store' },
  TAKEOUT: { id: 'takeout', name: 'Takeout', color: '#10B981', icon: 'Package' },
  DELIVERY: { id: 'delivery', name: 'Delivery', color: '#F59E0B', icon: 'Truck' }
};

// Commission structure by channel (in percentage)
export const COMMISSION_STRUCTURE = {
  dine_in: {
    base: 0,
    description: 'No commission on dine-in orders'
  },
  takeout: {
    base: 3,
    description: 'Fixed 3% platform commission'
  },
  delivery: {
    base: 25,
    description: 'Fixed 25% delivery platform commission'
  }
};

/**
 * Calculate channel metrics from orders
 * @param {Array} orders - Array of order objects
 * @param {string} channelId - Channel ID to filter
 * @returns {Object} Channel metrics
 */
export function calculateChannelMetrics(orders, channelId) {
  const channelOrders = orders.filter(o => o.channel === channelId && o.status === 'completed');

  if (channelOrders.length === 0) {
    return {
      channel: channelId,
      revenue: 0,
      orders: 0,
      avgOrderValue: 0,
      commission: 0,
      profit: 0,
      growth: 0,
      customerSatisfaction: 0,
      peakHours: 'N/A'
    };
  }

  const totalRevenue = channelOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = channelOrders.length;
  const avgOrderValue = totalRevenue / totalOrders;
  const commissionRate = COMMISSION_STRUCTURE[channelId]?.base || 0;
  const totalCommission = (totalRevenue * commissionRate) / 100;
  const profit = totalRevenue - totalCommission;

  // Calculate satisfaction average
  const avgSatisfaction = channelOrders.reduce((sum, o) => sum + (o.satisfaction_score || 4.5), 0) / totalOrders;

  // Identify peak hours
  const hours = {};
  channelOrders.forEach(o => {
    if (o.order_time) {
      const hour = parseInt(o.order_time.split(':')[0]);
      hours[hour] = (hours[hour] || 0) + 1;
    }
  });
  const peakHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
  const peakHours = peakHour ? `${peakHour[0]}:00 - ${(parseInt(peakHour[0]) + 1) % 24}:00` : 'N/A';

  return {
    channel: channelId,
    revenue: Math.round(totalRevenue * 100) / 100,
    orders: totalOrders,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    commission: Math.round(totalCommission * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitMargin: Math.round((profit / totalRevenue) * 10000) / 100,
    growth: 0, // Will be calculated from trends
    customerSatisfaction: Math.round(avgSatisfaction * 10) / 10,
    peakHours
  };
}

/**
 * Aggregate all channel metrics
 * @param {Array} orders - Array of orders
 * @returns {Array} Array of channel metrics
 */
export function aggregateChannelMetrics(orders) {
  const channels = Object.keys(CHANNELS);
  return channels.map(channelId => calculateChannelMetrics(orders, channelId));
}

/**
 * Calculate commission impact for a channel
 * @param {number} revenue - Total revenue
 * @param {string} channelId - Channel ID
 * @returns {Object} Commission details
 */
export function calculateCommission(revenue, channelId) {
  const rate = COMMISSION_STRUCTURE[channelId]?.base || 0;
  const commission = (revenue * rate) / 100;
  const netRevenue = revenue - commission;
  const margin = rate > 0 ? Math.round((commission / revenue) * 10000) / 100 : 0;

  return {
    gross: Math.round(revenue * 100) / 100,
    rate,
    commission: Math.round(commission * 100) / 100,
    net: Math.round(netRevenue * 100) / 100,
    margin
  };
}

/**
 * Calculate growth rate between two periods
 * @param {Array} ordersCurrentPeriod - Orders from current period
 * @param {Array} ordersPreviousPeriod - Orders from previous period
 * @param {string} channelId - Channel ID
 * @returns {number} Growth percentage
 */
export function calculateGrowthRate(ordersCurrentPeriod, ordersPreviousPeriod, channelId) {
  const currentRevenue = ordersCurrentPeriod
    .filter(o => o.channel === channelId && o.status === 'completed')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const previousRevenue = ordersPreviousPeriod
    .filter(o => o.channel === channelId && o.status === 'completed')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  if (previousRevenue === 0) return 0;
  return Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 10000) / 100;
}

/**
 * Get channel recommendations based on metrics
 * @param {Array} metrics - Channel metrics array
 * @returns {Array} Array of recommendations
 */
export function getChannelRecommendations(metrics) {
  const recommendations = [];
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);

  metrics.forEach(metric => {
    const revenueShare = (metric.revenue / totalRevenue) * 100;

    if (metric.growth > 20) {
      recommendations.push({
        channel: metric.channel,
        title: `${CHANNELS[metric.channel]?.name} is your growth engine`,
        description: `Growing at ${metric.growth}% and generating ${Math.round(revenueShare)}% of revenue. Continue optimizing this channel.`,
        severity: 'success',
        action: 'Expand'
      });
    }

    if (metric.growth < 5 && revenueShare > 15) {
      recommendations.push({
        channel: metric.channel,
        title: `Optimize ${CHANNELS[metric.channel]?.name} channel`,
        description: `Low growth rate (${metric.growth}%) despite ${Math.round(revenueShare)}% revenue share. Implement promotional campaigns.`,
        severity: 'warning',
        action: 'Improve'
      });
    }

    if (metric.customerSatisfaction < 4.0) {
      recommendations.push({
        channel: metric.channel,
        title: `Customer satisfaction alert for ${CHANNELS[metric.channel]?.name}`,
        description: `Satisfaction score of ${metric.customerSatisfaction}/5. Focus on service quality improvements.`,
        severity: 'warning',
        action: 'Improve'
      });
    }

    if (metric.profitMargin < -10) {
      recommendations.push({
        channel: metric.channel,
        title: `Profitability concern: ${CHANNELS[metric.channel]?.name}`,
        description: `Negative profit margin of ${metric.profitMargin}%. Review pricing and operational costs.`,
        severity: 'error',
        action: 'Urgent'
      });
    }
  });

  return recommendations;
}

/**
 * Compare channels across metrics
 * @param {Array} metrics - Channel metrics array
 * @returns {Object} Comparison data
 */
export function compareChannels(metrics) {
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const avgOrderValue = metrics.reduce((sum, m) => sum + m.avgOrderValue, 0) / metrics.length;
  const avgSatisfaction = metrics.reduce((sum, m) => sum + m.customerSatisfaction, 0) / metrics.length;
  const avgProfitMargin = metrics.reduce((sum, m) => sum + m.profitMargin, 0) / metrics.length;

  return {
    bestChannel: {
      byRevenue: metrics.reduce((max, m) => m.revenue > max.revenue ? m : max),
      byProfit: metrics.reduce((max, m) => m.profit > max.profit ? m : max),
      byGrowth: metrics.reduce((max, m) => m.growth > max.growth ? m : max),
      bySatisfaction: metrics.reduce((max, m) => m.customerSatisfaction > max.customerSatisfaction ? m : max)
    },
    averages: {
      revenue: totalRevenue / metrics.length,
      orderValue: avgOrderValue,
      satisfaction: avgSatisfaction,
      profitMargin: avgProfitMargin
    },
    totals: {
      revenue: totalRevenue,
      orders: metrics.reduce((sum, m) => sum + m.orders, 0),
      commission: metrics.reduce((sum, m) => sum + m.commission, 0),
      profit: metrics.reduce((sum, m) => sum + m.profit, 0)
    }
  };
}

/**
 * Generate trend data for channels over time
 * @param {Array} orders - Array of orders
 * @param {number} days - Number of days to analyze
 * @returns {Array} Trend data
 */
export function generateChannelTrends(orders, days = 30) {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const trends = {};
  const channelList = Object.keys(CHANNELS);

  // Initialize trend data
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    trends[dateStr] = {};
    channelList.forEach(ch => {
      trends[dateStr][ch] = { revenue: 0, orders: 0 };
    });
  }

  // Aggregate orders by date and channel
  orders.forEach(order => {
    if (order.status === 'completed') {
      const dateStr = order.order_date;
      const channel = order.channel;
      if (trends[dateStr] && trends[dateStr][channel]) {
        trends[dateStr][channel].revenue += order.total || 0;
        trends[dateStr][channel].orders += 1;
      }
    }
  });

  // Convert to array format
  return Object.entries(trends).map(([date, data]) => ({
    date,
    ...data
  }));
}

/**
 * Format channel name for display
 * @param {string} channelId - Channel ID
 * @returns {string} Formatted channel name
 */
export function getChannelName(channelId) {
  return CHANNELS[channelId]?.name || channelId;
}

/**
 * Get channel color for visualization
 * @param {string} channelId - Channel ID
 * @returns {string} Color hex code
 */
export function getChannelColor(channelId) {
  return CHANNELS[channelId]?.color || '#6B7280';
}

logger.debug('[ChannelPerformanceService] Initialized');

export default {
  CHANNELS,
  COMMISSION_STRUCTURE,
  calculateChannelMetrics,
  aggregateChannelMetrics,
  calculateCommission,
  calculateGrowthRate,
  getChannelRecommendations,
  compareChannels,
  generateChannelTrends,
  getChannelName,
  getChannelColor
};
