// src/lib/aiEngine.js
/**
 * AI-Powered Recommendations Engine
 * Provides intelligent insights, predictions, and recommendations
 */

import logger from './logger';

// ==================== PREDICTIVE ANALYTICS ====================

/**
 * Forecast revenue using linear regression
 * @param {Array} historicalData - Array of {date, revenue} objects
 * @param {number} daysToForecast - Number of days to predict
 */
export const forecastRevenue = (historicalData, daysToForecast = 7) => {
  try {
    if (!historicalData || historicalData.length < 7) {
      return { success: false, error: 'Insufficient data for forecasting' };
    }

    // Simple linear regression
    const n = historicalData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    historicalData.forEach((data, index) => {
      sumX += index;
      sumY += data.revenue || 0;
      sumXY += index * (data.revenue || 0);
      sumX2 += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate predictions
    const predictions = [];
    for (let i = 0; i < daysToForecast; i++) {
      const x = n + i;
      const predictedRevenue = slope * x + intercept;

      predictions.push({
        day: i + 1,
        predictedRevenue: Math.max(0, predictedRevenue),
        confidence: calculateConfidence(historicalData, i),
      });
    }

    logger.info('Revenue forecast generated', { daysToForecast, predictions: predictions.length });

    return {
      success: true,
      predictions,
      trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      confidence: calculateOverallConfidence(historicalData),
    };
  } catch (error) {
    logger.error('Revenue forecasting failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Calculate confidence level for prediction
 */
const calculateConfidence = (data, futureDay) => {
  // Confidence decreases with distance from training data
  const baseConfidence = 0.85;
  const decayRate = 0.05;
  return Math.max(0.3, baseConfidence - (futureDay * decayRate));
};

/**
 * Calculate overall confidence in the model
 */
const calculateOverallConfidence = (data) => {
  if (data.length < 14) return 'low';
  if (data.length < 30) return 'medium';
  return 'high';
};

// ==================== MENU OPTIMIZATION ====================

/**
 * Analyze menu performance and provide recommendations
 * @param {Array} menuItems - Array of menu items with sales and profit data
 */
export const analyzeMenuPerformance = (menuItems) => {
  try {
    if (!menuItems || menuItems.length === 0) {
      return { success: false, error: 'No menu items provided' };
    }

    // Calculate metrics
    const totalSales = menuItems.reduce((sum, item) => sum + (item.sales || 0), 0);
    const avgSales = totalSales / menuItems.length;
    const totalProfit = menuItems.reduce((sum, item) => sum + (item.profit || 0), 0);
    const avgProfit = totalProfit / menuItems.length;

    // Categorize items (BCG Matrix approach)
    const categorized = menuItems.map(item => {
      const highSales = (item.sales || 0) > avgSales;
      const highProfit = (item.profit || 0) > avgProfit;

      let category, recommendation;

      if (highSales && highProfit) {
        category = 'star';
        recommendation = 'Promote heavily - this is a winner!';
      } else if (highSales && !highProfit) {
        category = 'plow_horse';
        recommendation = 'Increase price or reduce cost to improve margins';
      } else if (!highSales && highProfit) {
        category = 'puzzle';
        recommendation = 'Increase visibility and marketing';
      } else {
        category = 'dog';
        recommendation = 'Consider removing or reimagining this item';
      }

      return {
        ...item,
        category,
        recommendation,
        salesRank: 0,
        profitRank: 0,
      };
    });

    // Add rankings
    const sortedBySales = [...categorized].sort((a, b) => (b.sales || 0) - (a.sales || 0));
    const sortedByProfit = [...categorized].sort((a, b) => (b.profit || 0) - (a.profit || 0));

    sortedBySales.forEach((item, index) => {
      const found = categorized.find(i => i.id === item.id);
      if (found) found.salesRank = index + 1;
    });

    sortedByProfit.forEach((item, index) => {
      const found = categorized.find(i => i.id === item.id);
      if (found) found.profitRank = index + 1;
    });

    logger.info('Menu analysis completed', { items: menuItems.length });

    return {
      success: true,
      items: categorized,
      summary: {
        totalItems: menuItems.length,
        stars: categorized.filter(i => i.category === 'star').length,
        puzzles: categorized.filter(i => i.category === 'puzzle').length,
        plowHorses: categorized.filter(i => i.category === 'plow_horse').length,
        dogs: categorized.filter(i => i.category === 'dog').length,
      },
    };
  } catch (error) {
    logger.error('Menu analysis failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== STAFF OPTIMIZATION ====================

/**
 * Recommend optimal staffing based on historical demand
 * @param {Array} demandData - Array of {hour, orders} objects
 * @param {Object} staffingRules - Staffing rules configuration
 */
export const recommendStaffing = (demandData, staffingRules = {}) => {
  try {
    const {
      ordersPerStaff = 10,
      minStaff = 2,
      maxStaff = 20,
    } = staffingRules;

    if (!demandData || demandData.length === 0) {
      return { success: false, error: 'No demand data provided' };
    }

    const recommendations = demandData.map(data => {
      const requiredStaff = Math.ceil((data.orders || 0) / ordersPerStaff);
      const recommendedStaff = Math.max(minStaff, Math.min(maxStaff, requiredStaff));

      let status;
      if (data.actualStaff) {
        if (data.actualStaff < recommendedStaff) {
          status = 'understaffed';
        } else if (data.actualStaff > recommendedStaff + 2) {
          status = 'overstaffed';
        } else {
          status = 'optimal';
        }
      } else {
        status = 'unknown';
      }

      return {
        ...data,
        recommendedStaff,
        status,
        savings: data.actualStaff ? (data.actualStaff - recommendedStaff) * 50 : 0, // Assume $50/hour per staff
      };
    });

    const totalSavings = recommendations.reduce((sum, r) => sum + (r.savings || 0), 0);

    logger.info('Staffing recommendations generated', { periods: recommendations.length });

    return {
      success: true,
      recommendations,
      totalSavings,
      insights: generateStaffingInsights(recommendations),
    };
  } catch (error) {
    logger.error('Staffing analysis failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Generate insights from staffing analysis
 */
const generateStaffingInsights = (recommendations) => {
  const insights = [];

  const understaffed = recommendations.filter(r => r.status === 'understaffed');
  const overstaffed = recommendations.filter(r => r.status === 'overstaffed');

  if (understaffed.length > 0) {
    insights.push({
      type: 'warning',
      message: `${understaffed.length} periods are understaffed. This may impact service quality.`,
      priority: 'high',
    });
  }

  if (overstaffed.length > 0) {
    const totalWaste = overstaffed.reduce((sum, r) => sum + Math.abs(r.savings || 0), 0);
    insights.push({
      type: 'info',
      message: `${overstaffed.length} periods are overstaffed. Potential savings: $${totalWaste.toFixed(2)}`,
      priority: 'medium',
    });
  }

  return insights;
};

// ==================== ANOMALY DETECTION ====================

/**
 * Detect anomalies in data using statistical methods
 * @param {Array} data - Array of numeric values
 * @param {number} threshold - Standard deviations for anomaly detection
 */
export const detectAnomalies = (data, threshold = 2) => {
  try {
    if (!data || data.length < 10) {
      return { success: false, error: 'Insufficient data for anomaly detection' };
    }

    // Calculate mean and standard deviation
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    // Find anomalies
    const anomalies = [];
    data.forEach((value, index) => {
      const zScore = (value - mean) / stdDev;

      if (Math.abs(zScore) > threshold) {
        anomalies.push({
          index,
          value,
          zScore,
          type: zScore > 0 ? 'high' : 'low',
          severity: Math.abs(zScore) > threshold * 1.5 ? 'severe' : 'moderate',
        });
      }
    });

    logger.info('Anomaly detection completed', { anomalies: anomalies.length });

    return {
      success: true,
      anomalies,
      stats: {
        mean,
        stdDev,
        threshold,
        totalDataPoints: data.length,
        anomalyPercentage: (anomalies.length / data.length * 100).toFixed(2),
      },
    };
  } catch (error) {
    logger.error('Anomaly detection failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== SMART ALERTS ====================

/**
 * Generate smart alerts based on business rules and AI insights
 * @param {Object} metrics - Current business metrics
 */
export const generateSmartAlerts = (metrics) => {
  const alerts = [];

  try {
    // Revenue alerts
    if (metrics.revenue && metrics.previousRevenue) {
      const revenueChange = ((metrics.revenue - metrics.previousRevenue) / metrics.previousRevenue) * 100;

      if (revenueChange < -10) {
        alerts.push({
          type: 'warning',
          category: 'revenue',
          title: 'Revenue Drop Detected',
          message: `Revenue has decreased by ${Math.abs(revenueChange).toFixed(1)}% compared to previous period`,
          priority: 'high',
          actionable: true,
          actions: [
            'Review menu pricing',
            'Check marketing campaigns',
            'Analyze customer feedback',
          ],
        });
      } else if (revenueChange > 20) {
        alerts.push({
          type: 'success',
          category: 'revenue',
          title: 'Exceptional Growth',
          message: `Revenue has increased by ${revenueChange.toFixed(1)}%! Identify and replicate successful strategies.`,
          priority: 'medium',
        });
      }
    }

    // Inventory alerts
    if (metrics.lowStockItems && metrics.lowStockItems.length > 0) {
      alerts.push({
        type: 'warning',
        category: 'inventory',
        title: 'Low Stock Alert',
        message: `${metrics.lowStockItems.length} items are running low on inventory`,
        priority: 'high',
        actionable: true,
        actions: ['Review and reorder stock'],
        items: metrics.lowStockItems,
      });
    }

    // Customer satisfaction
    if (metrics.customerSatisfaction && metrics.customerSatisfaction < 4.0) {
      alerts.push({
        type: 'warning',
        category: 'satisfaction',
        title: 'Low Customer Satisfaction',
        message: `Average rating is ${metrics.customerSatisfaction.toFixed(1)}/5.0`,
        priority: 'high',
        actionable: true,
        actions: [
          'Review recent negative feedback',
          'Check service quality',
          'Staff training may be needed',
        ],
      });
    }

    logger.info('Smart alerts generated', { alerts: alerts.length });

    return {
      success: true,
      alerts,
      summary: {
        total: alerts.length,
        high: alerts.filter(a => a.priority === 'high').length,
        medium: alerts.filter(a => a.priority === 'medium').length,
        low: alerts.filter(a => a.priority === 'low').length,
      },
    };
  } catch (error) {
    logger.error('Smart alerts generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

// ==================== EXPORT ====================

export default {
  forecastRevenue,
  analyzeMenuPerformance,
  recommendStaffing,
  detectAnomalies,
  generateSmartAlerts,
};
