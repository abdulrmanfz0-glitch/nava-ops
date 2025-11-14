// src/lib/intelligenceEngine.js
/**
 * NAVA OPS Intelligence Engine
 * Next-generation AI-powered business intelligence system
 * Provides predictive analytics, insights, recommendations, and automated decision support
 */

import logger from './logger';

// ==================== CONSTANTS ====================

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  MEDIUM: 0.70,
  LOW: 0.50,
};

const ALERT_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

const INSIGHT_TYPES = {
  OPPORTUNITY: 'opportunity',
  WARNING: 'warning',
  TREND: 'trend',
  PREDICTION: 'prediction',
  ANOMALY: 'anomaly',
  RECOMMENDATION: 'recommendation',
};

// ==================== PREDICTIVE ANALYTICS ====================

/**
 * Advanced revenue forecasting with multiple models
 * Uses ensemble approach combining linear regression, moving averages, and seasonality
 */
export const advancedRevenueForecast = (historicalData, options = {}) => {
  try {
    const {
      daysToForecast = 30,
      includeSeasonality = true,
      confidenceInterval = 0.95,
    } = options;

    if (!historicalData || historicalData.length < 14) {
      return {
        success: false,
        error: 'Insufficient data. Need at least 14 days of historical data.'
      };
    }

    // Prepare data
    const data = historicalData.map(d => ({
      date: new Date(d.date),
      revenue: parseFloat(d.revenue) || 0,
      orders: parseInt(d.orders) || 0,
    })).sort((a, b) => a.date - b.date);

    // Model 1: Linear Regression with time decay (recent data weighted more)
    const linearPredictions = linearRegressionForecast(data, daysToForecast, true);

    // Model 2: Moving Average (smooths out noise)
    const maPredictions = movingAverageForecast(data, daysToForecast, 7);

    // Model 3: Exponential Smoothing (captures trends)
    const esPredictions = exponentialSmoothingForecast(data, daysToForecast, 0.3);

    // Model 4: Seasonality Adjustment (day-of-week patterns)
    const seasonalityFactors = includeSeasonality ? calculateSeasonality(data) : null;

    // Ensemble: Combine models with weighted average
    const predictions = [];
    const lastDate = data[data.length - 1].date;

    for (let i = 0; i < daysToForecast; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i + 1);

      // Weighted ensemble (40% linear, 30% MA, 30% ES)
      let predictedRevenue =
        linearPredictions[i] * 0.40 +
        maPredictions[i] * 0.30 +
        esPredictions[i] * 0.30;

      // Apply seasonality adjustment
      if (seasonalityFactors) {
        const dayOfWeek = forecastDate.getDay();
        predictedRevenue *= seasonalityFactors[dayOfWeek];
      }

      // Calculate confidence (decreases with forecast horizon)
      const confidence = Math.max(
        0.50,
        CONFIDENCE_THRESHOLDS.HIGH - (i / daysToForecast) * 0.35
      );

      // Calculate prediction interval
      const stdDev = calculateStandardDeviation(data.map(d => d.revenue));
      const marginOfError = 1.96 * stdDev * Math.sqrt(1 + i / data.length); // 95% CI

      predictions.push({
        date: forecastDate.toISOString().split('T')[0],
        predictedRevenue: Math.max(0, predictedRevenue),
        lowerBound: Math.max(0, predictedRevenue - marginOfError),
        upperBound: predictedRevenue + marginOfError,
        confidence,
        confidenceLevel: getConfidenceLevel(confidence),
      });
    }

    // Analyze trend
    const recentTrend = analyzeTrend(data.slice(-14));
    const forecastTrend = analyzeTrend(predictions.map(p => ({ revenue: p.predictedRevenue })));

    // Generate insights
    const insights = generateForecastInsights(data, predictions, recentTrend, forecastTrend);

    logger.info('Advanced revenue forecast generated', {
      daysToForecast,
      dataPoints: data.length,
      insights: insights.length,
    });

    return {
      success: true,
      predictions,
      trends: {
        historical: recentTrend,
        forecast: forecastTrend,
      },
      seasonality: seasonalityFactors,
      insights,
      metadata: {
        modelType: 'ensemble',
        dataPoints: data.length,
        forecastHorizon: daysToForecast,
        confidenceInterval,
      },
    };
  } catch (error) {
    logger.error('Advanced revenue forecasting failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Linear regression with optional time decay weighting
 */
const linearRegressionForecast = (data, horizon, weighted = false) => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumW = 0;

  data.forEach((d, index) => {
    const weight = weighted ? Math.exp((index - n) / n) : 1; // Exponential decay
    sumX += index * weight;
    sumY += d.revenue * weight;
    sumXY += index * d.revenue * weight;
    sumX2 += index * index * weight;
    sumW += weight;
  });

  const slope = (sumW * sumXY - sumX * sumY) / (sumW * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / sumW;

  const predictions = [];
  for (let i = 0; i < horizon; i++) {
    predictions.push(Math.max(0, slope * (n + i) + intercept));
  }

  return predictions;
};

/**
 * Moving average forecast
 */
const movingAverageForecast = (data, horizon, window = 7) => {
  const recentData = data.slice(-window);
  const avg = recentData.reduce((sum, d) => sum + d.revenue, 0) / recentData.length;
  return Array(horizon).fill(avg);
};

/**
 * Exponential smoothing forecast
 */
const exponentialSmoothingForecast = (data, horizon, alpha = 0.3) => {
  let level = data[0].revenue;

  // Calculate smoothed values
  data.forEach(d => {
    level = alpha * d.revenue + (1 - alpha) * level;
  });

  return Array(horizon).fill(level);
};

/**
 * Calculate day-of-week seasonality factors
 */
const calculateSeasonality = (data) => {
  const dayTotals = Array(7).fill(0);
  const dayCounts = Array(7).fill(0);

  data.forEach(d => {
    const dayOfWeek = d.date.getDay();
    dayTotals[dayOfWeek] += d.revenue;
    dayCounts[dayOfWeek]++;
  });

  const dayAverages = dayTotals.map((total, i) => total / (dayCounts[i] || 1));
  const overallAverage = dayAverages.reduce((a, b) => a + b, 0) / 7;

  // Return seasonality factors (ratio to average)
  return dayAverages.map(avg => avg / overallAverage);
};

/**
 * Analyze trend direction and strength
 */
const analyzeTrend = (data) => {
  if (data.length < 2) return { direction: 'stable', strength: 0, slope: 0 };

  const revenues = data.map(d => d.revenue || d.predictedRevenue || 0);
  const n = revenues.length;

  // Simple linear regression for trend
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  revenues.forEach((rev, i) => {
    sumX += i;
    sumY += rev;
    sumXY += i * rev;
    sumX2 += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const avgRevenue = sumY / n;
  const percentChange = (slope * n / avgRevenue) * 100;

  let direction = 'stable';
  if (percentChange > 5) direction = 'increasing';
  else if (percentChange < -5) direction = 'decreasing';

  const strength = Math.min(100, Math.abs(percentChange));

  return {
    direction,
    strength,
    slope,
    percentChange: percentChange.toFixed(2),
  };
};

/**
 * Generate insights from forecast
 */
const generateForecastInsights = (historical, predictions, histTrend, forecastTrend) => {
  const insights = [];

  const avgHistorical = historical.reduce((sum, d) => sum + d.revenue, 0) / historical.length;
  const avgForecast = predictions.reduce((sum, p) => sum + p.predictedRevenue, 0) / predictions.length;
  const growthRate = ((avgForecast - avgHistorical) / avgHistorical) * 100;

  if (growthRate > 10) {
    insights.push({
      type: INSIGHT_TYPES.OPPORTUNITY,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Strong Growth Predicted',
      message: `Revenue is forecasted to grow by ${growthRate.toFixed(1)}% over the next period. Consider expanding capacity and inventory.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      actionable: true,
      actions: [
        'Increase inventory levels',
        'Prepare for higher demand',
        'Consider staffing adjustments',
      ],
    });
  } else if (growthRate < -10) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Revenue Decline Expected',
      message: `Revenue is forecasted to decline by ${Math.abs(growthRate).toFixed(1)}%. Immediate action recommended.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      actionable: true,
      actions: [
        'Review marketing strategy',
        'Analyze competitor activity',
        'Consider promotional campaigns',
        'Review pricing strategy',
      ],
    });
  }

  if (forecastTrend.direction !== histTrend.direction) {
    insights.push({
      type: INSIGHT_TYPES.TREND,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Trend Reversal Detected',
      message: `Historical trend was ${histTrend.direction}, but forecast shows ${forecastTrend.direction} trend.`,
      confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
    });
  }

  return insights;
};

// ==================== ANOMALY DETECTION ====================

/**
 * Advanced anomaly detection using multiple methods
 */
export const detectAdvancedAnomalies = (data, options = {}) => {
  try {
    const {
      sensitivity = 'medium', // low, medium, high
      methods = ['zscore', 'iqr', 'isolation'],
    } = options;

    if (!data || data.length < 10) {
      return { success: false, error: 'Insufficient data for anomaly detection' };
    }

    const thresholds = {
      low: 3.0,
      medium: 2.5,
      high: 2.0,
    };
    const threshold = thresholds[sensitivity] || 2.5;

    const anomalies = [];
    const allScores = [];

    // Method 1: Z-Score (statistical)
    if (methods.includes('zscore')) {
      const zScoreAnomalies = detectZScoreAnomalies(data, threshold);
      anomalies.push(...zScoreAnomalies);
    }

    // Method 2: IQR (robust to outliers)
    if (methods.includes('iqr')) {
      const iqrAnomalies = detectIQRAnomalies(data);
      anomalies.push(...iqrAnomalies);
    }

    // Method 3: Moving Average Deviation
    if (methods.includes('isolation')) {
      const maAnomalies = detectMovingAverageAnomalies(data, threshold);
      anomalies.push(...maAnomalies);
    }

    // Deduplicate and score anomalies
    const uniqueAnomalies = deduplicateAnomalies(anomalies);

    // Generate insights from anomalies
    const insights = generateAnomalyInsights(uniqueAnomalies, data);

    logger.info('Advanced anomaly detection completed', {
      anomalies: uniqueAnomalies.length,
      sensitivity,
    });

    return {
      success: true,
      anomalies: uniqueAnomalies,
      insights,
      summary: {
        total: uniqueAnomalies.length,
        severe: uniqueAnomalies.filter(a => a.severity === 'severe').length,
        moderate: uniqueAnomalies.filter(a => a.severity === 'moderate').length,
        mild: uniqueAnomalies.filter(a => a.severity === 'mild').length,
      },
    };
  } catch (error) {
    logger.error('Advanced anomaly detection failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

const detectZScoreAnomalies = (data, threshold) => {
  const mean = data.reduce((sum, val) => sum + val.value, 0) / data.length;
  const stdDev = calculateStandardDeviation(data.map(d => d.value));

  return data.map((item, index) => {
    const zScore = (item.value - mean) / stdDev;
    if (Math.abs(zScore) > threshold) {
      return {
        index,
        timestamp: item.timestamp || item.date,
        value: item.value,
        expected: mean,
        deviation: item.value - mean,
        zScore,
        method: 'zscore',
        type: zScore > 0 ? 'spike' : 'drop',
        severity: Math.abs(zScore) > threshold * 1.5 ? 'severe' :
                  Math.abs(zScore) > threshold ? 'moderate' : 'mild',
      };
    }
    return null;
  }).filter(Boolean);
};

const detectIQRAnomalies = (data) => {
  const values = data.map(d => d.value).sort((a, b) => a - b);
  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return data.map((item, index) => {
    if (item.value < lowerBound || item.value > upperBound) {
      return {
        index,
        timestamp: item.timestamp || item.date,
        value: item.value,
        expected: (q1 + q3) / 2,
        deviation: item.value < lowerBound ? item.value - lowerBound : item.value - upperBound,
        method: 'iqr',
        type: item.value > upperBound ? 'spike' : 'drop',
        severity: 'moderate',
        bounds: { lower: lowerBound, upper: upperBound },
      };
    }
    return null;
  }).filter(Boolean);
};

const detectMovingAverageAnomalies = (data, threshold) => {
  const windowSize = Math.min(7, Math.floor(data.length / 3));
  const anomalies = [];

  for (let i = windowSize; i < data.length; i++) {
    const window = data.slice(i - windowSize, i);
    const ma = window.reduce((sum, d) => sum + d.value, 0) / windowSize;
    const std = calculateStandardDeviation(window.map(d => d.value));

    const deviation = Math.abs(data[i].value - ma) / std;

    if (deviation > threshold) {
      anomalies.push({
        index: i,
        timestamp: data[i].timestamp || data[i].date,
        value: data[i].value,
        expected: ma,
        deviation: data[i].value - ma,
        method: 'moving_average',
        type: data[i].value > ma ? 'spike' : 'drop',
        severity: deviation > threshold * 1.5 ? 'severe' : 'moderate',
      });
    }
  }

  return anomalies;
};

const deduplicateAnomalies = (anomalies) => {
  const seen = new Set();
  const unique = [];

  anomalies.forEach(anomaly => {
    const key = `${anomaly.index}-${anomaly.timestamp}`;
    if (!seen.has(key)) {
      seen.add(key);

      // Count detections across methods
      const detectionCount = anomalies.filter(
        a => a.index === anomaly.index
      ).length;

      unique.push({
        ...anomaly,
        detectionCount,
        confidence: Math.min(1.0, detectionCount * 0.4),
      });
    }
  });

  return unique.sort((a, b) => b.confidence - a.confidence);
};

const generateAnomalyInsights = (anomalies, data) => {
  const insights = [];

  if (anomalies.length === 0) {
    insights.push({
      type: INSIGHT_TYPES.TREND,
      priority: ALERT_PRIORITIES.INFO,
      title: 'No Anomalies Detected',
      message: 'All metrics are within expected ranges. Operations are stable.',
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
    });
    return insights;
  }

  const severeAnomalies = anomalies.filter(a => a.severity === 'severe');
  if (severeAnomalies.length > 0) {
    insights.push({
      type: INSIGHT_TYPES.ANOMALY,
      priority: ALERT_PRIORITIES.CRITICAL,
      title: 'Critical Anomalies Detected',
      message: `${severeAnomalies.length} severe anomalies require immediate attention.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      actionable: true,
      actions: [
        'Investigate root cause immediately',
        'Check data integrity',
        'Review operational changes',
      ],
      details: severeAnomalies.slice(0, 3),
    });
  }

  // Pattern detection
  const spikes = anomalies.filter(a => a.type === 'spike');
  const drops = anomalies.filter(a => a.type === 'drop');

  if (spikes.length > drops.length * 2) {
    insights.push({
      type: INSIGHT_TYPES.TREND,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Frequent Spikes Detected',
      message: `System is experiencing more upward spikes than drops. This could indicate irregular demand patterns or data quality issues.`,
      confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
    });
  }

  return insights;
};

// ==================== BUSINESS INTELLIGENCE ====================

/**
 * Auto-generate comprehensive business insights
 */
export const generateBusinessInsights = (metrics, historical = []) => {
  try {
    const insights = [];

    // Revenue insights
    if (metrics.revenue) {
      insights.push(...analyzeRevenuePerformance(metrics, historical));
    }

    // Profitability insights
    if (metrics.profit || (metrics.revenue && metrics.costs)) {
      insights.push(...analyzeProfitability(metrics, historical));
    }

    // Customer insights
    if (metrics.customers || metrics.orders) {
      insights.push(...analyzeCustomerBehavior(metrics, historical));
    }

    // Operational insights
    if (metrics.orderVolume || metrics.averageOrderValue) {
      insights.push(...analyzeOperationalEfficiency(metrics, historical));
    }

    // Growth insights
    if (historical.length >= 7) {
      insights.push(...analyzeGrowthTrends(metrics, historical));
    }

    // Competitive position (if benchmark data available)
    if (metrics.benchmarks) {
      insights.push(...analyzeCompetitivePosition(metrics));
    }

    // Sort by priority
    insights.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    logger.info('Business insights generated', { count: insights.length });

    return {
      success: true,
      insights,
      summary: {
        total: insights.length,
        opportunities: insights.filter(i => i.type === INSIGHT_TYPES.OPPORTUNITY).length,
        warnings: insights.filter(i => i.type === INSIGHT_TYPES.WARNING).length,
        trends: insights.filter(i => i.type === INSIGHT_TYPES.TREND).length,
      },
    };
  } catch (error) {
    logger.error('Business insights generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

const analyzeRevenuePerformance = (current, historical) => {
  const insights = [];

  if (historical.length > 0) {
    const previous = historical[historical.length - 1];
    const change = ((current.revenue - previous.revenue) / previous.revenue) * 100;

    if (change > 15) {
      insights.push({
        type: INSIGHT_TYPES.OPPORTUNITY,
        priority: ALERT_PRIORITIES.HIGH,
        title: 'Exceptional Revenue Growth',
        message: `Revenue increased by ${change.toFixed(1)}%! Identify and scale successful strategies.`,
        confidence: CONFIDENCE_THRESHOLDS.HIGH,
        impact: 'high',
        metric: 'revenue',
        value: current.revenue,
        change: `+${change.toFixed(1)}%`,
      });
    } else if (change < -10) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.CRITICAL,
        title: 'Revenue Decline Alert',
        message: `Revenue dropped by ${Math.abs(change).toFixed(1)}%. Immediate action required.`,
        confidence: CONFIDENCE_THRESHOLDS.HIGH,
        impact: 'high',
        actionable: true,
        actions: [
          'Review recent operational changes',
          'Analyze customer feedback',
          'Evaluate competitive landscape',
          'Consider promotional offers',
        ],
        metric: 'revenue',
        value: current.revenue,
        change: `${change.toFixed(1)}%`,
      });
    }
  }

  // Revenue concentration analysis
  if (current.topProductsRevenue && current.revenue) {
    const concentration = (current.topProductsRevenue / current.revenue) * 100;
    if (concentration > 70) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.MEDIUM,
        title: 'High Revenue Concentration',
        message: `${concentration.toFixed(0)}% of revenue comes from top products. Diversification recommended to reduce risk.`,
        confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
        actionable: true,
        actions: [
          'Develop new product offerings',
          'Promote underperforming items',
          'Conduct market research for expansion',
        ],
      });
    }
  }

  return insights;
};

const analyzeProfitability = (current, historical) => {
  const insights = [];

  const profit = current.profit || (current.revenue - current.costs);
  const margin = (profit / current.revenue) * 100;

  if (margin < 10) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Low Profit Margin',
      message: `Profit margin is ${margin.toFixed(1)}%, below healthy threshold of 15-20%.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      actionable: true,
      actions: [
        'Review and optimize cost structure',
        'Evaluate pricing strategy',
        'Identify and eliminate waste',
        'Negotiate better supplier terms',
      ],
      metric: 'profit_margin',
      value: margin,
    });
  } else if (margin > 30) {
    insights.push({
      type: INSIGHT_TYPES.OPPORTUNITY,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Excellent Profit Margins',
      message: `Profit margin of ${margin.toFixed(1)}% is exceptional. Consider strategic investments for growth.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      metric: 'profit_margin',
      value: margin,
    });
  }

  // Cost efficiency
  if (historical.length >= 3) {
    const avgHistoricalCosts = historical.reduce((sum, h) => sum + h.costs, 0) / historical.length;
    const costChange = ((current.costs - avgHistoricalCosts) / avgHistoricalCosts) * 100;

    if (costChange > 15) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.HIGH,
        title: 'Rising Costs Detected',
        message: `Operating costs increased by ${costChange.toFixed(1)}%. Review cost management strategies.`,
        confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
        actionable: true,
        actions: [
          'Audit all expense categories',
          'Renegotiate vendor contracts',
          'Implement cost control measures',
        ],
      });
    }
  }

  return insights;
};

const analyzeCustomerBehavior = (current, historical) => {
  const insights = [];

  // Customer retention
  if (current.newCustomers && current.returningCustomers) {
    const retentionRate = (current.returningCustomers / (current.newCustomers + current.returningCustomers)) * 100;

    if (retentionRate < 30) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.HIGH,
        title: 'Low Customer Retention',
        message: `Only ${retentionRate.toFixed(1)}% of customers are returning. Focus on retention strategies.`,
        confidence: CONFIDENCE_THRESHOLDS.HIGH,
        actionable: true,
        actions: [
          'Implement loyalty program',
          'Improve customer service',
          'Gather and act on feedback',
          'Personalize customer experience',
        ],
        metric: 'retention_rate',
        value: retentionRate,
      });
    } else if (retentionRate > 70) {
      insights.push({
        type: INSIGHT_TYPES.OPPORTUNITY,
        priority: ALERT_PRIORITIES.MEDIUM,
        title: 'Strong Customer Loyalty',
        message: `${retentionRate.toFixed(1)}% customer retention rate is excellent. Leverage for referrals.`,
        confidence: CONFIDENCE_THRESHOLDS.HIGH,
        metric: 'retention_rate',
        value: retentionRate,
      });
    }
  }

  // Average order value
  if (current.averageOrderValue && historical.length > 0) {
    const avgHistoricalAOV = historical.reduce((sum, h) => sum + (h.averageOrderValue || 0), 0) / historical.length;
    const aovChange = ((current.averageOrderValue - avgHistoricalAOV) / avgHistoricalAOV) * 100;

    if (aovChange < -10) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.MEDIUM,
        title: 'Declining Order Value',
        message: `Average order value decreased by ${Math.abs(aovChange).toFixed(1)}%. Implement upselling strategies.`,
        confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
        actionable: true,
        actions: [
          'Train staff on upselling techniques',
          'Create combo deals and bundles',
          'Recommend complementary products',
          'Implement minimum order incentives',
        ],
        metric: 'average_order_value',
        value: current.averageOrderValue,
      });
    }
  }

  return insights;
};

const analyzeOperationalEfficiency = (current, historical) => {
  const insights = [];

  // Order fulfillment rate
  if (current.completedOrders && current.totalOrders) {
    const fulfillmentRate = (current.completedOrders / current.totalOrders) * 100;

    if (fulfillmentRate < 95) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.HIGH,
        title: 'Order Fulfillment Issues',
        message: `Only ${fulfillmentRate.toFixed(1)}% of orders are being completed. Address operational bottlenecks.`,
        confidence: CONFIDENCE_THRESHOLDS.HIGH,
        actionable: true,
        actions: [
          'Investigate order cancellation reasons',
          'Review kitchen/preparation capacity',
          'Optimize workflow processes',
          'Check inventory availability',
        ],
        metric: 'fulfillment_rate',
        value: fulfillmentRate,
      });
    }
  }

  // Peak hour performance
  if (current.peakHourRevenue && current.revenue) {
    const peakContribution = (current.peakHourRevenue / current.revenue) * 100;

    if (peakContribution > 40) {
      insights.push({
        type: INSIGHT_TYPES.RECOMMENDATION,
        priority: ALERT_PRIORITIES.MEDIUM,
        title: 'Peak Hour Dependency',
        message: `${peakContribution.toFixed(1)}% of revenue comes from peak hours. Consider strategies to boost off-peak sales.`,
        confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
        actionable: true,
        actions: [
          'Offer off-peak discounts',
          'Create lunch/breakfast specials',
          'Implement happy hour promotions',
          'Target different customer segments',
        ],
      });
    }
  }

  return insights;
};

const analyzeGrowthTrends = (current, historical) => {
  const insights = [];

  // Week-over-week growth
  const revenueData = historical.map(h => h.revenue).concat(current.revenue);
  const growthRates = [];

  for (let i = 1; i < revenueData.length; i++) {
    growthRates.push(((revenueData[i] - revenueData[i-1]) / revenueData[i-1]) * 100);
  }

  const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
  const growthVolatility = calculateStandardDeviation(growthRates);

  if (avgGrowthRate > 5) {
    insights.push({
      type: INSIGHT_TYPES.TREND,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Consistent Growth Pattern',
      message: `Averaging ${avgGrowthRate.toFixed(1)}% growth. Continue successful strategies and prepare for scaling.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      metric: 'growth_rate',
      value: avgGrowthRate,
    });
  } else if (avgGrowthRate < -2) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Negative Growth Trend',
      message: `Business is contracting at ${Math.abs(avgGrowthRate).toFixed(1)}% rate. Strategic intervention needed.`,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
      actionable: true,
      actions: [
        'Conduct comprehensive business review',
        'Analyze market conditions',
        'Revise business strategy',
        'Consider pivoting or new offerings',
      ],
    });
  }

  if (growthVolatility > 20) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Volatile Performance',
      message: `High variance in growth rates suggests instability. Focus on consistency.`,
      confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
      actionable: true,
      actions: [
        'Identify sources of volatility',
        'Stabilize operations',
        'Diversify revenue streams',
        'Improve demand forecasting',
      ],
    });
  }

  return insights;
};

const analyzeCompetitivePosition = (metrics) => {
  const insights = [];

  if (!metrics.benchmarks) return insights;

  const { revenue, averageOrderValue, customerSatisfaction } = metrics;
  const { industry } = metrics.benchmarks;

  if (revenue && industry.averageRevenue) {
    const position = (revenue / industry.averageRevenue) * 100;

    if (position > 120) {
      insights.push({
        type: INSIGHT_TYPES.OPPORTUNITY,
        priority: ALERT_PRIORITIES.MEDIUM,
        title: 'Above Industry Average',
        message: `Performing ${position.toFixed(0)}% above industry average. Strong competitive position.`,
        confidence: CONFIDENCE_THRESHOLDS.HIGH,
      });
    } else if (position < 80) {
      insights.push({
        type: INSIGHT_TYPES.WARNING,
        priority: ALERT_PRIORITIES.MEDIUM,
        title: 'Below Industry Average',
        message: `Performance is ${(100 - position).toFixed(0)}% below industry average. Review competitive strategy.`,
        confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
        actionable: true,
        actions: [
          'Benchmark against top performers',
          'Identify competitive advantages',
          'Invest in differentiators',
        ],
      });
    }
  }

  return insights;
};

// ==================== RECOMMENDATION ENGINE ====================

/**
 * Generate smart, context-aware recommendations
 */
export const generateRecommendations = (context) => {
  try {
    const recommendations = [];
    const { metrics, goals, historical, branches } = context;

    // Menu optimization recommendations
    if (metrics.menuPerformance) {
      recommendations.push(...generateMenuRecommendations(metrics.menuPerformance));
    }

    // Pricing recommendations
    if (metrics.products) {
      recommendations.push(...generatePricingRecommendations(metrics.products, historical));
    }

    // Staffing recommendations
    if (metrics.staffing) {
      recommendations.push(...generateStaffingRecommendations(metrics.staffing));
    }

    // Marketing recommendations
    if (metrics.customerSegments) {
      recommendations.push(...generateMarketingRecommendations(metrics.customerSegments));
    }

    // Inventory recommendations
    if (metrics.inventory) {
      recommendations.push(...generateInventoryRecommendations(metrics.inventory));
    }

    // Growth recommendations
    if (goals && historical) {
      recommendations.push(...generateGrowthRecommendations(metrics, goals, historical));
    }

    // Branch-specific recommendations
    if (branches) {
      recommendations.push(...generateBranchRecommendations(branches));
    }

    // Sort by expected impact
    recommendations.sort((a, b) => {
      const impactOrder = { high: 0, medium: 1, low: 2 };
      return impactOrder[a.expectedImpact] - impactOrder[b.expectedImpact];
    });

    logger.info('Recommendations generated', { count: recommendations.length });

    return {
      success: true,
      recommendations,
      summary: {
        total: recommendations.length,
        highImpact: recommendations.filter(r => r.expectedImpact === 'high').length,
        mediumImpact: recommendations.filter(r => r.expectedImpact === 'medium').length,
        quickWins: recommendations.filter(r => r.implementationTime === 'quick').length,
      },
    };
  } catch (error) {
    logger.error('Recommendations generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

const generateMenuRecommendations = (menuData) => {
  const recommendations = [];

  const stars = menuData.filter(item => item.category === 'star');
  const dogs = menuData.filter(item => item.category === 'dog');
  const puzzles = menuData.filter(item => item.category === 'puzzle');

  if (stars.length > 0) {
    recommendations.push({
      type: 'menu_optimization',
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Promote Top Performers',
      description: `You have ${stars.length} star items. Feature these prominently to maximize revenue.`,
      expectedImpact: 'high',
      implementationTime: 'quick',
      estimatedRevenueLift: '15-25%',
      actions: [
        'Add to featured section',
        'Train staff to recommend',
        'Create combo deals around these items',
        'Highlight in marketing materials',
      ],
      items: stars.slice(0, 3).map(s => s.name),
    });
  }

  if (dogs.length > 3) {
    recommendations.push({
      type: 'menu_optimization',
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Menu Simplification',
      description: `${dogs.length} underperforming items are cluttering your menu and increasing operational complexity.`,
      expectedImpact: 'medium',
      implementationTime: 'medium',
      estimatedCostSavings: '10-15%',
      actions: [
        'Remove bottom performers',
        'Reduce SKU complexity',
        'Simplify kitchen operations',
        'Focus on profitable items',
      ],
      items: dogs.slice(0, 5).map(d => d.name),
    });
  }

  if (puzzles.length > 0) {
    recommendations.push({
      type: 'menu_optimization',
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Boost Hidden Gems',
      description: `${puzzles.length} high-margin items have low sales. Increase visibility to boost profitability.`,
      expectedImpact: 'high',
      implementationTime: 'quick',
      estimatedProfitIncrease: '20-30%',
      actions: [
        'Improve menu placement',
        'Add appetizing descriptions',
        'Include photos',
        'Staff recommendations',
        'Social media campaigns',
      ],
      items: puzzles.slice(0, 3).map(p => p.name),
    });
  }

  return recommendations;
};

const generatePricingRecommendations = (products, historical) => {
  const recommendations = [];

  // Price elasticity analysis
  products.forEach(product => {
    if (product.demandElasticity) {
      if (product.demandElasticity < 0.5 && product.margin < 40) {
        // Inelastic demand + low margin = price increase opportunity
        recommendations.push({
          type: 'pricing',
          priority: ALERT_PRIORITIES.HIGH,
          title: `Price Increase Opportunity: ${product.name}`,
          description: `Low price sensitivity detected. A 10% price increase could boost profit by ${(10 * (1 - product.demandElasticity * 0.1)).toFixed(0)}% with minimal volume impact.`,
          expectedImpact: 'high',
          implementationTime: 'quick',
          estimatedRevenueLift: '8-12%',
          actions: [
            'Test 5-10% price increase',
            'Monitor sales volume closely',
            'Adjust based on customer response',
          ],
          confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
        });
      }
    }
  });

  // Competitive pricing
  const overpriced = products.filter(p => p.competitivePosition === 'expensive');
  if (overpriced.length > 0) {
    recommendations.push({
      type: 'pricing',
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Competitive Pricing Adjustment',
      description: `${overpriced.length} items are priced above market. Consider tactical price reductions to drive volume.`,
      expectedImpact: 'medium',
      implementationTime: 'quick',
      actions: [
        'Review competitor pricing',
        'Adjust to match or justify premium',
        'Emphasize value proposition',
      ],
      items: overpriced.slice(0, 3).map(p => p.name),
    });
  }

  return recommendations;
};

const generateStaffingRecommendations = (staffingData) => {
  const recommendations = [];

  const inefficientPeriods = staffingData.filter(s =>
    s.status === 'overstaffed' || s.status === 'understaffed'
  );

  if (inefficientPeriods.length > 0) {
    const potentialSavings = inefficientPeriods
      .filter(p => p.status === 'overstaffed')
      .reduce((sum, p) => sum + Math.abs(p.savings || 0), 0);

    recommendations.push({
      type: 'staffing',
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Optimize Staff Scheduling',
      description: `${inefficientPeriods.length} time periods have suboptimal staffing levels.`,
      expectedImpact: 'high',
      implementationTime: 'medium',
      estimatedCostSavings: `$${potentialSavings.toFixed(0)}/week`,
      actions: [
        'Implement demand-based scheduling',
        'Use part-time staff for peak hours',
        'Cross-train employees for flexibility',
        'Review and adjust staffing rules',
      ],
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
    });
  }

  return recommendations;
};

const generateMarketingRecommendations = (segments) => {
  const recommendations = [];

  // High-value segment targeting
  const highValue = segments.filter(s => s.lifetimeValue > s.averageLifetimeValue * 1.5);
  if (highValue.length > 0) {
    recommendations.push({
      type: 'marketing',
      priority: ALERT_PRIORITIES.HIGH,
      title: 'VIP Customer Program',
      description: `${highValue.length} customer segments show high lifetime value. Create targeted retention programs.`,
      expectedImpact: 'high',
      implementationTime: 'medium',
      estimatedRevenueLift: '25-35%',
      actions: [
        'Launch VIP loyalty program',
        'Personalized offers and communications',
        'Exclusive perks and early access',
        'Regular engagement campaigns',
      ],
      segments: highValue.map(s => s.name),
    });
  }

  // At-risk customers
  const atRisk = segments.filter(s => s.churnRisk > 0.7);
  if (atRisk.length > 0) {
    recommendations.push({
      type: 'marketing',
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Win-Back Campaign',
      description: `${atRisk.length} customer segments show high churn risk. Launch retention campaign immediately.`,
      expectedImpact: 'high',
      implementationTime: 'quick',
      actions: [
        'Send personalized win-back offers',
        'Gather feedback on dissatisfaction',
        'Offer special incentives to return',
        'Improve onboarding for new customers',
      ],
      urgency: 'immediate',
    });
  }

  return recommendations;
};

const generateInventoryRecommendations = (inventory) => {
  const recommendations = [];

  const overstocked = inventory.filter(i => i.turnoverRate < 2);
  const understocked = inventory.filter(i => i.stockoutRate > 0.1);

  if (overstocked.length > 0) {
    const tiedCapital = overstocked.reduce((sum, i) => sum + (i.value || 0), 0);

    recommendations.push({
      type: 'inventory',
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Reduce Excess Inventory',
      description: `${overstocked.length} items have slow turnover, tying up $${tiedCapital.toFixed(0)} in capital.`,
      expectedImpact: 'medium',
      implementationTime: 'medium',
      estimatedCostSavings: `$${(tiedCapital * 0.15).toFixed(0)}`,
      actions: [
        'Run clearance promotions',
        'Bundle slow-moving items',
        'Adjust reorder quantities',
        'Improve demand forecasting',
      ],
      items: overstocked.slice(0, 5).map(i => i.name),
    });
  }

  if (understocked.length > 0) {
    recommendations.push({
      type: 'inventory',
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Address Stock-Outs',
      description: `${understocked.length} items frequently run out of stock, causing lost sales.`,
      expectedImpact: 'high',
      implementationTime: 'quick',
      estimatedRevenueLift: '10-15%',
      actions: [
        'Increase safety stock levels',
        'Implement auto-reordering',
        'Find backup suppliers',
        'Improve inventory tracking',
      ],
      items: understocked.slice(0, 5).map(i => i.name),
      urgency: 'immediate',
    });
  }

  return recommendations;
};

const generateGrowthRecommendations = (metrics, goals, historical) => {
  const recommendations = [];

  // Goal gap analysis
  if (goals.revenue && metrics.revenue) {
    const currentTrajectory = calculateGrowthTrajectory(historical);
    const requiredGrowth = ((goals.revenue - metrics.revenue) / metrics.revenue) * 100;
    const gap = requiredGrowth - currentTrajectory;

    if (gap > 10) {
      recommendations.push({
        type: 'growth',
        priority: ALERT_PRIORITIES.CRITICAL,
        title: 'Revenue Goal At Risk',
        description: `Current trajectory will fall short of revenue goal by ${gap.toFixed(0)}%. Aggressive action needed.`,
        expectedImpact: 'high',
        implementationTime: 'immediate',
        actions: [
          'Launch promotional campaigns',
          'Expand to new customer segments',
          'Introduce new products/services',
          'Increase marketing spend',
          'Explore strategic partnerships',
        ],
        gap: `${gap.toFixed(0)}%`,
        required: `${requiredGrowth.toFixed(0)}%`,
        current: `${currentTrajectory.toFixed(0)}%`,
      });
    }
  }

  return recommendations;
};

const generateBranchRecommendations = (branches) => {
  const recommendations = [];

  // Performance comparison
  const avgRevenue = branches.reduce((sum, b) => sum + b.revenue, 0) / branches.length;
  const topPerformers = branches.filter(b => b.revenue > avgRevenue * 1.2);
  const underperformers = branches.filter(b => b.revenue < avgRevenue * 0.8);

  if (topPerformers.length > 0 && underperformers.length > 0) {
    recommendations.push({
      type: 'operations',
      priority: ALERT_PRIORITIES.HIGH,
      title: 'Replicate Best Practices',
      description: `Top branches outperform by ${((topPerformers[0].revenue / avgRevenue - 1) * 100).toFixed(0)}%. Apply their strategies to underperforming locations.`,
      expectedImpact: 'high',
      implementationTime: 'medium',
      actions: [
        'Conduct best practice analysis',
        'Document successful processes',
        'Train underperforming branch staff',
        'Implement standardized procedures',
      ],
      topPerformers: topPerformers.map(b => b.name),
      underperformers: underperformers.map(b => b.name),
    });
  }

  return recommendations;
};

// ==================== CLUSTERING & SEGMENTATION ====================

/**
 * Cluster products and categories for intelligent grouping
 */
export const performProductClustering = (products) => {
  try {
    if (!products || products.length < 5) {
      return { success: false, error: 'Insufficient products for clustering' };
    }

    // K-means clustering based on multiple features
    const features = products.map(p => ({
      id: p.id,
      name: p.name,
      price: normalizeValue(p.price, products.map(x => x.price)),
      sales: normalizeValue(p.sales, products.map(x => x.sales)),
      profit: normalizeValue(p.profit, products.map(x => x.profit)),
      popularity: normalizeValue(p.views || 0, products.map(x => x.views || 0)),
    }));

    // Determine optimal number of clusters (3-6)
    const k = Math.min(6, Math.max(3, Math.floor(products.length / 5)));

    const clusters = kMeansClustering(features, k);

    // Assign cluster characteristics
    const enrichedClusters = clusters.map((cluster, index) => {
      const clusterProducts = cluster.members;
      const avgPrice = average(clusterProducts.map(p =>
        products.find(x => x.id === p.id).price
      ));
      const avgSales = average(clusterProducts.map(p =>
        products.find(x => x.id === p.id).sales
      ));
      const avgProfit = average(clusterProducts.map(p =>
        products.find(x => x.id === p.id).profit
      ));

      // Assign personality to cluster
      let personality, strategy;
      if (avgPrice > 15 && avgProfit > avgSales * 0.3) {
        personality = 'Premium';
        strategy = 'Maintain quality, emphasize exclusivity';
      } else if (avgSales > avgPrice * 10) {
        personality = 'Volume Driver';
        strategy = 'Keep prices competitive, focus on availability';
      } else if (avgProfit / avgSales > 0.5) {
        personality = 'Cash Cow';
        strategy = 'Maximize visibility, promote heavily';
      } else {
        personality = 'Standard';
        strategy = 'Optimize pricing and promotion';
      }

      return {
        id: index,
        name: `Cluster ${index + 1}: ${personality}`,
        personality,
        strategy,
        memberCount: clusterProducts.length,
        members: clusterProducts,
        characteristics: {
          avgPrice,
          avgSales,
          avgProfit,
          profitMargin: (avgProfit / avgSales) * 100,
        },
      };
    });

    logger.info('Product clustering completed', { clusters: k });

    return {
      success: true,
      clusters: enrichedClusters,
      insights: generateClusteringInsights(enrichedClusters),
    };
  } catch (error) {
    logger.error('Product clustering failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Simple k-means clustering implementation
 */
const kMeansClustering = (data, k, maxIterations = 50) => {
  // Initialize centroids randomly
  let centroids = [];
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  for (let i = 0; i < k; i++) {
    centroids.push({ ...shuffled[i] });
  }

  let clusters = [];
  let iterations = 0;

  while (iterations < maxIterations) {
    // Assign points to nearest centroid
    clusters = Array(k).fill(null).map(() => ({ members: [] }));

    data.forEach(point => {
      let minDist = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, i) => {
        const dist = euclideanDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });

      clusters[clusterIndex].members.push(point);
    });

    // Recalculate centroids
    const newCentroids = clusters.map(cluster => {
      if (cluster.members.length === 0) return centroids[0]; // Handle empty cluster

      return {
        price: average(cluster.members.map(m => m.price)),
        sales: average(cluster.members.map(m => m.sales)),
        profit: average(cluster.members.map(m => m.profit)),
        popularity: average(cluster.members.map(m => m.popularity)),
      };
    });

    // Check convergence
    const converged = centroids.every((c, i) =>
      euclideanDistance(c, newCentroids[i]) < 0.001
    );

    if (converged) break;

    centroids = newCentroids;
    iterations++;
  }

  return clusters;
};

const euclideanDistance = (a, b) => {
  const keys = ['price', 'sales', 'profit', 'popularity'];
  return Math.sqrt(
    keys.reduce((sum, key) => sum + Math.pow((a[key] || 0) - (b[key] || 0), 2), 0)
  );
};

const generateClusteringInsights = (clusters) => {
  const insights = [];

  const premiumClusters = clusters.filter(c => c.personality === 'Premium');
  const volumeClusters = clusters.filter(c => c.personality === 'Volume Driver');

  if (premiumClusters.length > 0) {
    insights.push({
      type: INSIGHT_TYPES.OPPORTUNITY,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Premium Product Opportunity',
      message: `${premiumClusters[0].memberCount} premium products identified. Focus on upscale marketing.`,
      confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
    });
  }

  if (volumeClusters.length > 0) {
    insights.push({
      type: INSIGHT_TYPES.RECOMMENDATION,
      priority: ALERT_PRIORITIES.MEDIUM,
      title: 'Volume Strategy',
      message: `${volumeClusters[0].memberCount} products drive volume. Ensure consistent availability.`,
      confidence: CONFIDENCE_THRESHOLDS.MEDIUM,
    });
  }

  return insights;
};

// ==================== SCENARIO SIMULATION ====================

/**
 * What-if scenario simulation engine
 */
export const runScenarioSimulation = (baseMetrics, scenarios) => {
  try {
    const results = scenarios.map(scenario => {
      const { name, changes } = scenario;
      const simulated = { ...baseMetrics };

      // Apply changes
      if (changes.revenueChange) {
        simulated.revenue = baseMetrics.revenue * (1 + changes.revenueChange / 100);
      }
      if (changes.costsChange) {
        simulated.costs = baseMetrics.costs * (1 + changes.costsChange / 100);
      }
      if (changes.priceChange) {
        // Apply price elasticity
        const elasticity = changes.elasticity || -1.2;
        const volumeChange = changes.priceChange * elasticity;
        simulated.volume = baseMetrics.volume * (1 + volumeChange / 100);
        simulated.revenue = baseMetrics.revenue * (1 + changes.priceChange / 100) * (1 + volumeChange / 100);
      }
      if (changes.staffingChange) {
        simulated.staffCosts = baseMetrics.staffCosts * (1 + changes.staffingChange / 100);
        simulated.costs = baseMetrics.costs + (simulated.staffCosts - baseMetrics.staffCosts);
      }

      // Calculate derived metrics
      simulated.profit = simulated.revenue - simulated.costs;
      simulated.profitMargin = (simulated.profit / simulated.revenue) * 100;

      // Calculate impact
      const impact = {
        revenueDelta: simulated.revenue - baseMetrics.revenue,
        profitDelta: simulated.profit - baseMetrics.profit,
        marginDelta: simulated.profitMargin - baseMetrics.profitMargin,
      };

      return {
        scenario: name,
        changes,
        results: simulated,
        impact,
        recommendation: evaluateScenario(impact),
      };
    });

    // Rank scenarios by profit impact
    results.sort((a, b) => b.impact.profitDelta - a.impact.profitDelta);

    logger.info('Scenario simulation completed', { scenarios: results.length });

    return {
      success: true,
      baseCase: baseMetrics,
      scenarios: results,
      bestScenario: results[0],
    };
  } catch (error) {
    logger.error('Scenario simulation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

const evaluateScenario = (impact) => {
  if (impact.profitDelta > 0 && impact.marginDelta > 0) {
    return 'Highly recommended - improves both profit and margin';
  } else if (impact.profitDelta > 0) {
    return 'Recommended - increases total profit';
  } else if (impact.marginDelta > 0) {
    return 'Consider - improves efficiency but may reduce scale';
  } else {
    return 'Not recommended - negative impact on profitability';
  }
};

// ==================== HEALTH SCORING ====================

/**
 * Calculate comprehensive business health score
 */
export const calculateHealthScore = (metrics, historical = []) => {
  try {
    const scores = {
      revenue: scoreRevenue(metrics, historical),
      profitability: scoreProfitability(metrics),
      growth: scoreGrowth(historical),
      efficiency: scoreEfficiency(metrics),
      customerHealth: scoreCustomerHealth(metrics),
      operationalHealth: scoreOperationalHealth(metrics),
    };

    // Weighted average
    const weights = {
      revenue: 0.20,
      profitability: 0.25,
      growth: 0.20,
      efficiency: 0.15,
      customerHealth: 0.10,
      operationalHealth: 0.10,
    };

    const overallScore = Object.keys(scores).reduce((sum, key) => {
      return sum + scores[key].score * weights[key];
    }, 0);

    const grade = getGrade(overallScore);
    const status = getHealthStatus(overallScore);

    logger.info('Health score calculated', { overallScore, grade });

    return {
      success: true,
      overallScore: Math.round(overallScore),
      grade,
      status,
      scores,
      insights: generateHealthInsights(scores, overallScore),
      recommendations: generateHealthRecommendations(scores),
    };
  } catch (error) {
    logger.error('Health score calculation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

const scoreRevenue = (metrics, historical) => {
  let score = 50; // Base score

  // Revenue stability
  if (historical.length >= 7) {
    const revenues = historical.map(h => h.revenue);
    const volatility = calculateStandardDeviation(revenues) / average(revenues);
    score += volatility < 0.15 ? 20 : volatility < 0.30 ? 10 : 0;
  }

  // Revenue growth
  if (historical.length >= 2) {
    const recentGrowth = ((metrics.revenue - historical[historical.length - 1].revenue) /
                          historical[historical.length - 1].revenue) * 100;
    score += recentGrowth > 10 ? 20 : recentGrowth > 0 ? 10 : -10;
  }

  // Revenue target achievement
  if (metrics.revenueTarget) {
    const achievement = (metrics.revenue / metrics.revenueTarget) * 100;
    score += achievement >= 100 ? 10 : achievement >= 90 ? 5 : 0;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: 'Revenue Health',
    factors: ['stability', 'growth', 'target_achievement'],
  };
};

const scoreProfitability = (metrics) => {
  let score = 50;

  const profit = metrics.profit || (metrics.revenue - metrics.costs);
  const margin = (profit / metrics.revenue) * 100;

  // Profit margin scoring
  if (margin >= 25) score += 30;
  else if (margin >= 15) score += 20;
  else if (margin >= 10) score += 10;
  else if (margin < 5) score -= 20;

  // Cost efficiency
  if (metrics.costPerOrder) {
    const efficiency = metrics.revenue / metrics.costs;
    if (efficiency > 1.5) score += 20;
    else if (efficiency > 1.2) score += 10;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: 'Profitability',
    margin,
  };
};

const scoreGrowth = (historical) => {
  if (historical.length < 7) return { score: 50, label: 'Growth', note: 'Insufficient data' };

  const revenues = historical.map(h => h.revenue);
  const growthRates = [];

  for (let i = 1; i < revenues.length; i++) {
    growthRates.push(((revenues[i] - revenues[i-1]) / revenues[i-1]) * 100);
  }

  const avgGrowth = average(growthRates);
  const consistency = 100 - calculateStandardDeviation(growthRates);

  let score = 50;
  if (avgGrowth > 10) score += 30;
  else if (avgGrowth > 5) score += 20;
  else if (avgGrowth > 0) score += 10;
  else score -= 20;

  score += Math.min(20, consistency * 0.2);

  return {
    score: Math.max(0, Math.min(100, score)),
    label: 'Growth Trajectory',
    avgGrowth: avgGrowth.toFixed(2),
  };
};

const scoreEfficiency = (metrics) => {
  let score = 50;

  // Order fulfillment
  if (metrics.completedOrders && metrics.totalOrders) {
    const fulfillmentRate = (metrics.completedOrders / metrics.totalOrders) * 100;
    if (fulfillmentRate >= 98) score += 25;
    else if (fulfillmentRate >= 95) score += 15;
    else if (fulfillmentRate < 90) score -= 15;
  }

  // Staff productivity
  if (metrics.revenuePerStaff) {
    if (metrics.revenuePerStaff > 5000) score += 25;
    else if (metrics.revenuePerStaff > 3000) score += 15;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: 'Operational Efficiency',
  };
};

const scoreCustomerHealth = (metrics) => {
  let score = 50;

  // Customer satisfaction
  if (metrics.customerSatisfaction) {
    if (metrics.customerSatisfaction >= 4.5) score += 30;
    else if (metrics.customerSatisfaction >= 4.0) score += 20;
    else if (metrics.customerSatisfaction < 3.5) score -= 20;
  }

  // Retention rate
  if (metrics.returningCustomers && metrics.newCustomers) {
    const retentionRate = (metrics.returningCustomers /
                          (metrics.returningCustomers + metrics.newCustomers)) * 100;
    if (retentionRate > 60) score += 20;
    else if (retentionRate > 40) score += 10;
    else score -= 10;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: 'Customer Health',
  };
};

const scoreOperationalHealth = (metrics) => {
  let score = 50;

  // Inventory management
  if (metrics.inventoryTurnover) {
    if (metrics.inventoryTurnover > 10) score += 25;
    else if (metrics.inventoryTurnover > 5) score += 15;
  }

  // Stock-out rate
  if (metrics.stockoutRate !== undefined) {
    if (metrics.stockoutRate < 0.05) score += 25;
    else if (metrics.stockoutRate < 0.10) score += 15;
    else score -= 15;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: 'Operational Health',
  };
};

const getGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  return 'D';
};

const getHealthStatus = (score) => {
  if (score >= 85) return { status: 'Excellent', color: 'green', icon: '🟢' };
  if (score >= 70) return { status: 'Good', color: 'blue', icon: '🔵' };
  if (score >= 55) return { status: 'Fair', color: 'yellow', icon: '🟡' };
  if (score >= 40) return { status: 'Poor', color: 'orange', icon: '🟠' };
  return { status: 'Critical', color: 'red', icon: '🔴' };
};

const generateHealthInsights = (scores, overall) => {
  const insights = [];

  // Identify strengths
  const strengths = Object.entries(scores)
    .filter(([_, data]) => data.score >= 75)
    .map(([key, _]) => key);

  if (strengths.length > 0) {
    insights.push({
      type: INSIGHT_TYPES.OPPORTUNITY,
      title: 'Business Strengths',
      message: `Strong performance in: ${strengths.join(', ')}. Leverage these for competitive advantage.`,
    });
  }

  // Identify weaknesses
  const weaknesses = Object.entries(scores)
    .filter(([_, data]) => data.score < 50)
    .map(([key, _]) => key);

  if (weaknesses.length > 0) {
    insights.push({
      type: INSIGHT_TYPES.WARNING,
      title: 'Areas Needing Attention',
      message: `Focus improvement efforts on: ${weaknesses.join(', ')}`,
      priority: ALERT_PRIORITIES.HIGH,
    });
  }

  return insights;
};

const generateHealthRecommendations = (scores) => {
  const recommendations = [];

  Object.entries(scores).forEach(([category, data]) => {
    if (data.score < 60) {
      recommendations.push({
        category,
        priority: ALERT_PRIORITIES.HIGH,
        message: `${data.label} score is below target. Immediate improvement needed.`,
        actions: getImprovementActions(category),
      });
    }
  });

  return recommendations;
};

const getImprovementActions = (category) => {
  const actionMap = {
    revenue: ['Expand marketing reach', 'Launch new products', 'Optimize pricing'],
    profitability: ['Reduce costs', 'Improve pricing', 'Eliminate waste'],
    growth: ['Accelerate customer acquisition', 'Enter new markets', 'Increase marketing'],
    efficiency: ['Streamline operations', 'Automate processes', 'Optimize staffing'],
    customerHealth: ['Improve service quality', 'Launch loyalty program', 'Gather feedback'],
    operationalHealth: ['Optimize inventory', 'Improve supply chain', 'Reduce waste'],
  };

  return actionMap[category] || ['Analyze and improve'];
};

// ==================== EXECUTIVE SUMMARY ====================

/**
 * Auto-generate executive summary
 */
export const generateExecutiveSummary = (data) => {
  try {
    const { metrics, historical, insights, recommendations, healthScore } = data;

    // Key metrics summary
    const keyMetrics = extractKeyMetrics(metrics, historical);

    // Top insights (max 5)
    const topInsights = insights
      ?.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 5) || [];

    // Top recommendations (max 3)
    const topRecommendations = recommendations
      ?.filter(r => r.expectedImpact === 'high')
      .slice(0, 3) || [];

    // Performance summary
    const performance = summarizePerformance(metrics, historical);

    // Risk assessment
    const risks = assessRisks(metrics, insights);

    // Opportunities
    const opportunities = identifyOpportunities(insights, recommendations);

    const summary = {
      generatedAt: new Date().toISOString(),
      period: determinePeriod(historical),

      headline: generateHeadline(performance, healthScore),

      keyMetrics,
      performance,
      healthScore: healthScore?.overallScore || 'N/A',

      criticalInsights: topInsights,
      priorityActions: topRecommendations,

      risks: risks.slice(0, 3),
      opportunities: opportunities.slice(0, 3),

      outlook: generateOutlook(performance, healthScore, insights),

      nextSteps: generateNextSteps(topInsights, topRecommendations),
    };

    logger.info('Executive summary generated');

    return {
      success: true,
      summary,
    };
  } catch (error) {
    logger.error('Executive summary generation failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

const extractKeyMetrics = (current, historical) => {
  const previous = historical?.[historical.length - 1];

  return {
    revenue: {
      current: current.revenue,
      change: previous ? ((current.revenue - previous.revenue) / previous.revenue * 100).toFixed(1) : 'N/A',
      trend: previous ? (current.revenue > previous.revenue ? 'up' : 'down') : 'stable',
    },
    profit: {
      current: current.profit,
      margin: ((current.profit / current.revenue) * 100).toFixed(1),
    },
    orders: {
      current: current.orders,
      change: previous ? ((current.orders - previous.orders) / previous.orders * 100).toFixed(1) : 'N/A',
    },
    customers: {
      current: current.customers,
      change: previous ? ((current.customers - previous.customers) / previous.customers * 100).toFixed(1) : 'N/A',
    },
  };
};

const summarizePerformance = (current, historical) => {
  if (!historical || historical.length < 2) {
    return { status: 'stable', description: 'Insufficient historical data for trend analysis' };
  }

  const revenueChange = ((current.revenue - historical[historical.length - 1].revenue) /
                         historical[historical.length - 1].revenue) * 100;

  if (revenueChange > 10) {
    return { status: 'strong_growth', description: 'Business is experiencing strong growth' };
  } else if (revenueChange > 0) {
    return { status: 'moderate_growth', description: 'Business is growing steadily' };
  } else if (revenueChange > -5) {
    return { status: 'stable', description: 'Business performance is stable' };
  } else {
    return { status: 'declining', description: 'Business is facing challenges' };
  }
};

const assessRisks = (metrics, insights) => {
  const risks = [];

  insights?.filter(i => i.type === INSIGHT_TYPES.WARNING || i.priority === ALERT_PRIORITIES.CRITICAL)
    .forEach(insight => {
      risks.push({
        title: insight.title,
        severity: insight.priority,
        description: insight.message,
      });
    });

  return risks;
};

const identifyOpportunities = (insights, recommendations) => {
  const opportunities = [];

  insights?.filter(i => i.type === INSIGHT_TYPES.OPPORTUNITY)
    .forEach(insight => {
      opportunities.push({
        title: insight.title,
        potential: insight.impact || 'high',
        description: insight.message,
      });
    });

  recommendations?.filter(r => r.expectedImpact === 'high')
    .forEach(rec => {
      opportunities.push({
        title: rec.title,
        potential: rec.expectedImpact,
        description: rec.description,
        estimatedImpact: rec.estimatedRevenueLift || rec.estimatedCostSavings,
      });
    });

  return opportunities;
};

const generateHeadline = (performance, healthScore) => {
  const score = healthScore?.overallScore || 70;
  const status = performance.status;

  if (score >= 85 && status === 'strong_growth') {
    return 'Exceptional Performance - Business is Thriving';
  } else if (score >= 70 && (status === 'strong_growth' || status === 'moderate_growth')) {
    return 'Strong Performance - Positive Growth Trajectory';
  } else if (score >= 55) {
    return 'Stable Performance - Opportunity for Improvement';
  } else {
    return 'Performance Below Target - Action Required';
  }
};

const generateOutlook = (performance, healthScore, insights) => {
  const score = healthScore?.overallScore || 70;
  const warnings = insights?.filter(i => i.type === INSIGHT_TYPES.WARNING).length || 0;
  const opportunities = insights?.filter(i => i.type === INSIGHT_TYPES.OPPORTUNITY).length || 0;

  if (score >= 80 && warnings < 2) {
    return 'Positive - Strong fundamentals with clear growth path ahead';
  } else if (score >= 65 && opportunities > warnings) {
    return 'Optimistic - Several opportunities identified for improvement';
  } else if (warnings > opportunities) {
    return 'Cautious - Address current challenges before pursuing growth';
  } else {
    return 'Stable - Focus on execution and incremental improvements';
  }
};

const generateNextSteps = (insights, recommendations) => {
  const steps = [];

  // From critical insights
  insights
    ?.filter(i => i.priority === ALERT_PRIORITIES.CRITICAL || i.priority === ALERT_PRIORITIES.HIGH)
    .slice(0, 2)
    .forEach(insight => {
      if (insight.actions && insight.actions.length > 0) {
        steps.push({
          action: insight.actions[0],
          reason: insight.title,
          priority: 'immediate',
        });
      }
    });

  // From top recommendations
  recommendations
    ?.slice(0, 2)
    .forEach(rec => {
      if (rec.actions && rec.actions.length > 0) {
        steps.push({
          action: rec.actions[0],
          reason: rec.title,
          priority: rec.implementationTime || 'high',
          expectedImpact: rec.expectedImpact,
        });
      }
    });

  return steps;
};

const determinePeriod = (historical) => {
  if (!historical || historical.length === 0) return 'Current';

  const days = historical.length;
  if (days <= 7) return 'Last 7 days';
  if (days <= 30) return 'Last 30 days';
  if (days <= 90) return 'Last quarter';
  return 'Last year';
};

// ==================== UTILITY FUNCTIONS ====================

const calculateStandardDeviation = (values) => {
  const avg = average(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

const average = (values) => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const normalizeValue = (value, allValues) => {
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  return max === min ? 0.5 : (value - min) / (max - min);
};

const getConfidenceLevel = (confidence) => {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) return 'high';
  if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
};

const calculateGrowthTrajectory = (historical) => {
  if (historical.length < 2) return 0;

  const revenues = historical.map(h => h.revenue);
  const growthRates = [];

  for (let i = 1; i < revenues.length; i++) {
    growthRates.push(((revenues[i] - revenues[i-1]) / revenues[i-1]) * 100);
  }

  return average(growthRates);
};

// ==================== EXPORTS ====================

export default {
  // Predictive Analytics
  advancedRevenueForecast,

  // Anomaly Detection
  detectAdvancedAnomalies,

  // Business Intelligence
  generateBusinessInsights,

  // Recommendations
  generateRecommendations,

  // Clustering
  performProductClustering,

  // Scenario Simulation
  runScenarioSimulation,

  // Health Scoring
  calculateHealthScore,

  // Executive Summary
  generateExecutiveSummary,

  // Constants
  INSIGHT_TYPES,
  ALERT_PRIORITIES,
  CONFIDENCE_THRESHOLDS,
};
