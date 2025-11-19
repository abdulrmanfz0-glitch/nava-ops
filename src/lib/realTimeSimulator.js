// src/lib/realTimeSimulator.js - Real-time Data Simulator
/**
 * Real-time Data Simulation Engine for Nava-Ops
 * Simulates realistic business data with peak hour detection,
 * dynamic multipliers, and random fluctuations for testing and demos
 *
 * Extracted from Restalyze v11.0.0 Platinum Edition
 * @module realTimeSimulator
 */

import { logger } from './logger.js';
import { clamp, deepClone } from '../utils/formatters.js';

/**
 * Peak hours configuration
 * Based on typical restaurant traffic patterns
 */
export const PEAK_HOURS = {
  lunch: { start: 11, end: 14 },    // 11 AM - 2 PM
  dinner: { start: 18, end: 21 }    // 6 PM - 9 PM
};

/**
 * Multiplier configuration
 */
export const MULTIPLIERS = {
  peak: 1.5,        // Peak hours multiplier
  normal: 0.8,      // Normal hours multiplier
  randomMin: 0.9,   // Minimum random factor
  randomMax: 1.1    // Maximum random factor
};

/**
 * Simulate real-time data with peak hour detection
 *
 * @param {Array<Object>} baseData - Base data to simulate from
 * @param {Object} options - Configuration options
 * @param {Date} options.currentTime - Current time (default: now)
 * @param {boolean} options.addTimestamp - Add timestamp to each item (default: true)
 * @param {boolean} options.addFluctuations - Add random fluctuations (default: true)
 * @param {number} options.peakMultiplier - Peak hours multiplier (default: 1.5)
 * @param {number} options.normalMultiplier - Normal hours multiplier (default: 0.8)
 * @returns {Array<Object>} Simulated data
 *
 * @example
 * const simulatedData = simulateRealTimeData([
 *   { orders: 100, revenue: 5000 },
 *   { orders: 150, revenue: 7500 }
 * ]);
 * // Returns data with peak hour adjustments and random fluctuations
 */
export const simulateRealTimeData = (baseData, options = {}) => {
  try {
    // Validate input
    if (!baseData || !Array.isArray(baseData)) {
      logger.error('Invalid baseData provided to simulateRealTimeData');
      return [];
    }

    if (baseData.length === 0) {
      logger.warn('Empty baseData provided to simulateRealTimeData');
      return [];
    }

    const {
      currentTime = new Date(),
      addTimestamp = true,
      addFluctuations = true,
      peakMultiplier = MULTIPLIERS.peak,
      normalMultiplier = MULTIPLIERS.normal
    } = options;

    const currentHour = currentTime.getHours();
    const isPeakHour = isPeakTime(currentHour);

    // Determine multiplier based on time
    const timeMultiplier = isPeakHour ? peakMultiplier : normalMultiplier;

    // Generate random factor for realistic fluctuations
    const randomFactor = addFluctuations
      ? MULTIPLIERS.randomMin + Math.random() * (MULTIPLIERS.randomMax - MULTIPLIERS.randomMin)
      : 1.0;

    const finalMultiplier = timeMultiplier * randomFactor;

    // Apply simulation to each data item
    const simulatedData = baseData.map(item => {
      const simulated = deepClone(item);

      // Apply multipliers to numeric fields
      if (typeof item.orders === 'number') {
        simulated.orders = Math.floor(item.orders * finalMultiplier);
      }

      if (typeof item.revenue === 'number') {
        simulated.revenue = Math.floor(item.revenue * finalMultiplier);
      }

      if (typeof item.sales === 'number') {
        simulated.sales = Math.floor(item.sales * finalMultiplier);
      }

      if (typeof item.customers === 'number') {
        simulated.customers = Math.floor(item.customers * finalMultiplier);
      }

      // Add metadata
      if (addTimestamp) {
        simulated.timestamp = currentTime.toISOString();
        simulated.simulatedAt = Date.now();
      }

      simulated.isPeakHour = isPeakHour;
      simulated.multiplier = Math.round(finalMultiplier * 100) / 100;

      return simulated;
    });

    logger.info('Real-time data simulated', {
      itemCount: simulatedData.length,
      isPeakHour,
      multiplier: finalMultiplier,
      hour: currentHour
    });

    return simulatedData;
  } catch (error) {
    logger.error('Failed to simulate real-time data', {
      error: error.message,
      stack: error.stack
    });
    return baseData; // Return original data on error
  }
};

/**
 * Check if current hour is peak time
 *
 * @param {number} hour - Hour of the day (0-23)
 * @returns {boolean} True if peak hour
 */
export const isPeakTime = (hour) => {
  const isLunch = hour >= PEAK_HOURS.lunch.start && hour <= PEAK_HOURS.lunch.end;
  const isDinner = hour >= PEAK_HOURS.dinner.start && hour <= PEAK_HOURS.dinner.end;
  return isLunch || isDinner;
};

/**
 * Get peak period name
 *
 * @param {number} hour - Hour of the day (0-23)
 * @returns {string} Peak period name or 'off-peak'
 */
export const getPeakPeriod = (hour) => {
  if (hour >= PEAK_HOURS.lunch.start && hour <= PEAK_HOURS.lunch.end) {
    return 'lunch';
  }
  if (hour >= PEAK_HOURS.dinner.start && hour <= PEAK_HOURS.dinner.end) {
    return 'dinner';
  }
  return 'off-peak';
};

/**
 * Calculate day part (breakfast, lunch, dinner, late night)
 *
 * @param {number} hour - Hour of the day (0-23)
 * @returns {Object} Day part information
 */
export const getDayPart = (hour) => {
  if (hour >= 6 && hour < 11) {
    return { name: 'breakfast', multiplier: 1.0, isPeak: false };
  }
  if (hour >= 11 && hour <= 14) {
    return { name: 'lunch', multiplier: MULTIPLIERS.peak, isPeak: true };
  }
  if (hour > 14 && hour < 18) {
    return { name: 'afternoon', multiplier: 0.6, isPeak: false };
  }
  if (hour >= 18 && hour <= 21) {
    return { name: 'dinner', multiplier: MULTIPLIERS.peak, isPeak: true };
  }
  if (hour > 21 || hour < 6) {
    return { name: 'late-night', multiplier: 0.5, isPeak: false };
  }
  return { name: 'unknown', multiplier: MULTIPLIERS.normal, isPeak: false };
};

/**
 * Simulate fluctuating metric over time
 *
 * @param {number} baseValue - Base value to fluctuate
 * @param {Object} options - Configuration options
 * @param {number} options.variance - Variance percentage (default: 20)
 * @param {number} options.trend - Trend direction (-1, 0, 1) (default: 0)
 * @param {number} options.trendStrength - Trend strength percentage (default: 5)
 * @returns {number} Fluctuated value
 */
export const simulateFluctuation = (baseValue, options = {}) => {
  try {
    const {
      variance = 20,
      trend = 0,
      trendStrength = 5
    } = options;

    // Apply random variance
    const varianceMultiplier = 1 + ((Math.random() * variance * 2 - variance) / 100);

    // Apply trend
    const trendMultiplier = 1 + ((trend * trendStrength) / 100);

    const fluctuatedValue = baseValue * varianceMultiplier * trendMultiplier;

    return Math.max(0, Math.round(fluctuatedValue));
  } catch (error) {
    logger.error('Failed to simulate fluctuation', { error: error.message });
    return baseValue;
  }
};

/**
 * Generate simulated order data
 *
 * @param {number} count - Number of orders to generate
 * @param {Object} options - Configuration options
 * @returns {Array<Object>} Array of simulated orders
 */
export const generateSimulatedOrders = (count, options = {}) => {
  try {
    const {
      averageValue = 75,
      platformIds = ['hungerstation', 'jahez', 'talabat'],
      startTime = new Date()
    } = options;

    const orders = [];
    const currentHour = startTime.getHours();
    const dayPart = getDayPart(currentHour);

    for (let i = 0; i < count; i++) {
      // Random platform
      const platformId = platformIds[Math.floor(Math.random() * platformIds.length)];

      // Random order value with variance
      const orderValue = simulateFluctuation(averageValue, { variance: 30 });

      // Random time within current hour
      const orderTime = new Date(startTime);
      orderTime.setMinutes(Math.floor(Math.random() * 60));
      orderTime.setSeconds(Math.floor(Math.random() * 60));

      orders.push({
        id: `SIM-${Date.now()}-${i}`,
        platformId,
        amount: orderValue,
        status: Math.random() > 0.1 ? 'completed' : 'pending',
        timestamp: orderTime.toISOString(),
        dayPart: dayPart.name,
        isPeakHour: dayPart.isPeak,
        simulated: true
      });
    }

    logger.info('Generated simulated orders', {
      count: orders.length,
      dayPart: dayPart.name,
      isPeak: dayPart.isPeak
    });

    return orders;
  } catch (error) {
    logger.error('Failed to generate simulated orders', { error: error.message });
    return [];
  }
};

/**
 * Simulate live metrics stream
 *
 * @param {Object} baseMetrics - Base metrics object
 * @param {number} intervalMs - Update interval in milliseconds (default: 5000)
 * @param {Function} callback - Callback function for each update
 * @returns {Function} Stop function to cancel the stream
 */
export const simulateLiveStream = (baseMetrics, intervalMs = 5000, callback) => {
  try {
    if (typeof callback !== 'function') {
      logger.error('Callback must be a function for simulateLiveStream');
      return () => {};
    }

    const interval = setInterval(() => {
      const currentTime = new Date();
      const simulatedMetrics = simulateRealTimeData([baseMetrics], {
        currentTime,
        addTimestamp: true,
        addFluctuations: true
      })[0];

      callback(simulatedMetrics);
    }, intervalMs);

    logger.info('Live stream simulation started', { intervalMs });

    // Return stop function
    return () => {
      clearInterval(interval);
      logger.info('Live stream simulation stopped');
    };
  } catch (error) {
    logger.error('Failed to start live stream simulation', { error: error.message });
    return () => {};
  }
};

/**
 * Simulate day's worth of data
 *
 * @param {Object} baseMetrics - Base metrics for one hour
 * @param {Object} options - Configuration options
 * @returns {Array<Object>} Array of hourly data for 24 hours
 */
export const simulateDayData = (baseMetrics, options = {}) => {
  try {
    const {
      startDate = new Date(),
      includeVariance = true
    } = options;

    const dayData = [];
    const baseDate = new Date(startDate);
    baseDate.setHours(0, 0, 0, 0);

    for (let hour = 0; hour < 24; hour++) {
      const hourDate = new Date(baseDate);
      hourDate.setHours(hour);

      const dayPart = getDayPart(hour);

      // Calculate hour-specific multiplier
      const hourMultiplier = dayPart.multiplier;
      const variance = includeVariance ? (0.9 + Math.random() * 0.2) : 1.0;
      const finalMultiplier = hourMultiplier * variance;

      // Generate hourly data
      const hourData = {
        hour,
        hourLabel: `${hour.toString().padStart(2, '0')}:00`,
        date: hourDate.toISOString(),
        dayPart: dayPart.name,
        isPeakHour: dayPart.isPeak,
        orders: Math.floor(baseMetrics.orders * finalMultiplier),
        revenue: Math.floor(baseMetrics.revenue * finalMultiplier),
        customers: Math.floor((baseMetrics.customers || baseMetrics.orders) * finalMultiplier),
        multiplier: Math.round(finalMultiplier * 100) / 100
      };

      dayData.push(hourData);
    }

    logger.info('Day data simulated', { hours: 24, startDate: baseDate.toISOString() });

    return dayData;
  } catch (error) {
    logger.error('Failed to simulate day data', { error: error.message });
    return [];
  }
};

/**
 * Simulate week's worth of data
 *
 * @param {Object} baseDayMetrics - Base metrics for one day
 * @param {Object} options - Configuration options
 * @returns {Array<Object>} Array of daily data for 7 days
 */
export const simulateWeekData = (baseDayMetrics, options = {}) => {
  try {
    const {
      startDate = new Date(),
      includeWeekendVariation = true
    } = options;

    const weekData = [];
    const baseDate = new Date(startDate);
    baseDate.setHours(0, 0, 0, 0);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let day = 0; day < 7; day++) {
      const dayDate = new Date(baseDate);
      dayDate.setDate(baseDate.getDate() + day);

      const dayOfWeek = dayDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Weekend multiplier (usually higher for restaurants)
      const weekendMultiplier = includeWeekendVariation && isWeekend ? 1.3 : 1.0;
      const variance = 0.9 + Math.random() * 0.2;
      const finalMultiplier = weekendMultiplier * variance;

      weekData.push({
        day,
        dayOfWeek,
        dayName: dayNames[dayOfWeek],
        date: dayDate.toISOString(),
        isWeekend,
        orders: Math.floor(baseDayMetrics.orders * finalMultiplier),
        revenue: Math.floor(baseDayMetrics.revenue * finalMultiplier),
        customers: Math.floor((baseDayMetrics.customers || baseDayMetrics.orders) * finalMultiplier),
        multiplier: Math.round(finalMultiplier * 100) / 100
      });
    }

    logger.info('Week data simulated', { days: 7, startDate: baseDate.toISOString() });

    return weekData;
  } catch (error) {
    logger.error('Failed to simulate week data', { error: error.message });
    return [];
  }
};

// Export default object with all functions
export default {
  simulateRealTimeData,
  isPeakTime,
  getPeakPeriod,
  getDayPart,
  simulateFluctuation,
  generateSimulatedOrders,
  simulateLiveStream,
  simulateDayData,
  simulateWeekData,
  PEAK_HOURS,
  MULTIPLIERS
};
