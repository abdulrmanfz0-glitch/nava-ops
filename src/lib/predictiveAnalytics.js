// src/lib/predictiveAnalytics.js - Predictive Analytics Engine
/**
 * Advanced Predictive Analytics Engine for Nava-Ops
 * Provides revenue forecasting, trend analysis, and confidence scoring
 * using linear regression and statistical analysis
 *
 * Extracted from Restalyze v11.0.0 Platinum Edition
 * @module predictiveAnalytics
 */

import { logger } from './logger.js';
import { clamp } from '../utils/formatters.js';

/**
 * Generate predictions using linear regression
 *
 * @param {Array<Object>} historicalData - Array of historical data points with revenue
 * @param {Object} options - Configuration options
 * @param {number} options.minDataPoints - Minimum data points required (default: 3)
 * @param {number} options.minConfidence - Minimum confidence threshold (default: 0.7)
 * @param {number} options.maxConfidence - Maximum confidence threshold (default: 0.95)
 * @returns {Object|null} Prediction object or null if insufficient data
 *
 * @example
 * const predictions = generatePredictions([
 *   { revenue: 10000, date: '2024-01-01' },
 *   { revenue: 12000, date: '2024-01-02' },
 *   { revenue: 11500, date: '2024-01-03' }
 * ]);
 * // Returns: { nextPeriodRevenue: 13000, confidence: 0.85, trend: 'up', growthRate: 5.2 }
 */
export const generatePredictions = (historicalData, options = {}) => {
  try {
    const {
      minDataPoints = 3,
      minConfidence = 0.7,
      maxConfidence = 0.95
    } = options;

    // Validate input
    if (!historicalData || !Array.isArray(historicalData)) {
      logger.warn('Invalid historical data provided to generatePredictions', { historicalData });
      return null;
    }

    if (historicalData.length < minDataPoints) {
      logger.warn('Insufficient data for predictions', {
        provided: historicalData.length,
        required: minDataPoints
      });
      return null;
    }

    // Simple linear regression for prediction
    const n = historicalData.length;
    const x = historicalData.map((_, i) => i);
    const y = historicalData.map(d => d.revenue);

    // Validate revenue data
    if (y.some(val => typeof val !== 'number' || isNaN(val))) {
      logger.error('Invalid revenue values in historical data');
      return null;
    }

    // Calculate linear regression parameters
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    // Calculate slope and intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Prevent division by zero or invalid calculations
    if (!isFinite(slope) || !isFinite(intercept)) {
      logger.error('Invalid regression calculation', { slope, intercept });
      return null;
    }

    // Predict next period revenue
    const nextRevenue = slope * n + intercept;

    // Calculate confidence score (higher slope variance = lower confidence)
    const confidence = Math.max(minConfidence, 1 - Math.abs(slope) / 1000);

    // Determine trend direction
    const trend = slope > 0 ? 'up' : slope < 0 ? 'down' : 'stable';

    // Calculate growth rate percentage
    const lastRevenue = y[y.length - 1];
    const growthRate = lastRevenue !== 0 ? (slope / lastRevenue) * 100 : 0;

    const prediction = {
      nextPeriodRevenue: Math.max(0, nextRevenue),
      confidence: clamp(confidence, minConfidence, maxConfidence),
      trend,
      growthRate,
      metadata: {
        dataPoints: n,
        slope,
        intercept,
        lastRevenue,
        generatedAt: new Date().toISOString()
      }
    };

    logger.info('Prediction generated successfully', {
      trend: prediction.trend,
      confidence: prediction.confidence,
      growthRate: prediction.growthRate
    });

    return prediction;
  } catch (error) {
    logger.error('Failed to generate predictions', { error: error.message, stack: error.stack });
    return null;
  }
};

/**
 * Generate multi-period forecasts
 *
 * @param {Array<Object>} historicalData - Historical data points
 * @param {number} periods - Number of future periods to forecast (default: 3)
 * @returns {Array<Object>} Array of forecast objects
 *
 * @example
 * const forecasts = generateMultiPeriodForecast(historicalData, 5);
 * // Returns array of 5 forecast objects
 */
export const generateMultiPeriodForecast = (historicalData, periods = 3) => {
  try {
    if (!historicalData || historicalData.length < 3) {
      logger.warn('Insufficient data for multi-period forecast');
      return [];
    }

    const forecasts = [];
    const n = historicalData.length;
    const x = historicalData.map((_, i) => i);
    const y = historicalData.map(d => d.revenue);

    // Calculate regression parameters
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecasts for multiple periods
    for (let i = 1; i <= periods; i++) {
      const forecastedRevenue = slope * (n + i - 1) + intercept;
      const confidenceDecay = 1 - (i * 0.05); // Confidence decreases with distance

      forecasts.push({
        period: i,
        revenue: Math.max(0, forecastedRevenue),
        confidence: clamp(0.7 * confidenceDecay, 0.5, 0.95),
        periodLabel: `Period +${i}`
      });
    }

    logger.info('Multi-period forecast generated', { periods, forecastCount: forecasts.length });

    return forecasts;
  } catch (error) {
    logger.error('Failed to generate multi-period forecast', { error: error.message });
    return [];
  }
};

/**
 * Calculate prediction accuracy by comparing predictions with actual results
 *
 * @param {Array<Object>} predictions - Previous predictions
 * @param {Array<Object>} actuals - Actual results
 * @returns {Object} Accuracy metrics
 */
export const calculatePredictionAccuracy = (predictions, actuals) => {
  try {
    if (!predictions || !actuals || predictions.length === 0 || actuals.length === 0) {
      return { accuracy: 0, averageError: 0, errorRate: 0 };
    }

    const errors = [];
    const minLength = Math.min(predictions.length, actuals.length);

    for (let i = 0; i < minLength; i++) {
      const predicted = predictions[i].nextPeriodRevenue || predictions[i].revenue;
      const actual = actuals[i].revenue;

      if (typeof predicted === 'number' && typeof actual === 'number' && actual !== 0) {
        const error = Math.abs(predicted - actual) / actual;
        errors.push(error);
      }
    }

    if (errors.length === 0) {
      return { accuracy: 0, averageError: 0, errorRate: 0 };
    }

    const averageError = errors.reduce((a, b) => a + b, 0) / errors.length;
    const accuracy = Math.max(0, 1 - averageError);
    const errorRate = averageError * 100;

    return {
      accuracy: clamp(accuracy, 0, 1),
      averageError,
      errorRate,
      sampleSize: errors.length
    };
  } catch (error) {
    logger.error('Failed to calculate prediction accuracy', { error: error.message });
    return { accuracy: 0, averageError: 0, errorRate: 0 };
  }
};

/**
 * Analyze revenue trends over time
 *
 * @param {Array<Object>} data - Revenue data points
 * @returns {Object} Trend analysis results
 */
export const analyzeTrends = (data) => {
  try {
    if (!data || data.length < 2) {
      return { trend: 'stable', strength: 0, volatility: 0 };
    }

    const revenues = data.map(d => d.revenue);
    const n = revenues.length;

    // Calculate average
    const average = revenues.reduce((a, b) => a + b, 0) / n;

    // Calculate variance and standard deviation
    const variance = revenues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const volatility = average !== 0 ? (stdDev / average) * 100 : 0;

    // Calculate trend strength using correlation coefficient
    const x = data.map((_, i) => i);
    const y = revenues;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    const sumYY = y.reduce((a, b) => a + b * b, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    const correlation = denominator !== 0 ? numerator / denominator : 0;
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    const trend = slope > 0 ? 'up' : slope < 0 ? 'down' : 'stable';
    const strength = Math.abs(correlation);

    return {
      trend,
      strength: clamp(strength, 0, 1),
      volatility: clamp(volatility, 0, 100),
      correlation,
      average,
      stdDev
    };
  } catch (error) {
    logger.error('Failed to analyze trends', { error: error.message });
    return { trend: 'stable', strength: 0, volatility: 0 };
  }
};

/**
 * Detect anomalies in revenue data using standard deviation
 *
 * @param {Array<Object>} data - Revenue data points
 * @param {number} threshold - Standard deviation threshold (default: 2)
 * @returns {Array<Object>} Detected anomalies
 */
export const detectAnomalies = (data, threshold = 2) => {
  try {
    if (!data || data.length < 3) {
      return [];
    }

    const revenues = data.map(d => d.revenue);
    const n = revenues.length;

    // Calculate mean and standard deviation
    const mean = revenues.reduce((a, b) => a + b, 0) / n;
    const variance = revenues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Find anomalies
    const anomalies = [];
    data.forEach((point, index) => {
      const zScore = stdDev !== 0 ? Math.abs((point.revenue - mean) / stdDev) : 0;

      if (zScore > threshold) {
        anomalies.push({
          index,
          revenue: point.revenue,
          zScore,
          deviation: point.revenue - mean,
          date: point.date,
          severity: zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low'
        });
      }
    });

    logger.info('Anomaly detection completed', { anomaliesFound: anomalies.length });

    return anomalies;
  } catch (error) {
    logger.error('Failed to detect anomalies', { error: error.message });
    return [];
  }
};

// Export default object with all functions
export default {
  generatePredictions,
  generateMultiPeriodForecast,
  calculatePredictionAccuracy,
  analyzeTrends,
  detectAnomalies
};
