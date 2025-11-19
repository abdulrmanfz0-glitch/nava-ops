// src/lib/performanceScoring.js - Performance Scoring System
/**
 * Comprehensive Performance Scoring System for Nava-Ops
 * Calculates 0-100 performance scores based on multiple business metrics
 * with weighted scoring across 5 key dimensions
 *
 * Extracted from Restalyze v11.0.0 Platinum Edition
 * @module performanceScoring
 */

import { logger } from './logger.js';
import { clamp } from '../utils/formatters.js';

/**
 * Score weight configuration
 * Total: 100 points
 */
export const SCORE_WEIGHTS = {
  revenueGrowth: 30,      // 0-30 points
  profitMargin: 25,       // 0-25 points
  orderVolume: 20,        // 0-20 points
  customerSatisfaction: 15, // 0-15 points
  operationalEfficiency: 10 // 0-10 points
};

/**
 * Grade thresholds
 */
export const GRADE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0
};

/**
 * Calculate comprehensive performance score
 *
 * @param {Object} metrics - Business performance metrics
 * @param {number} metrics.revenueGrowth - Revenue growth percentage
 * @param {number} metrics.profitMargin - Profit margin percentage
 * @param {number} metrics.orderGrowth - Order volume growth percentage
 * @param {number} metrics.customerSatisfaction - Customer satisfaction rating (0-5)
 * @param {number} metrics.operationalEfficiency - Operational efficiency percentage (0-100)
 * @returns {Object} Performance score object with grade and breakdown
 *
 * @example
 * const score = calculatePerformanceScore({
 *   revenueGrowth: 15,
 *   profitMargin: 18,
 *   orderGrowth: 12,
 *   customerSatisfaction: 4.3,
 *   operationalEfficiency: 85
 * });
 * // Returns: { score: 85, grade: 'B', breakdown: {...}, details: {...} }
 */
export const calculatePerformanceScore = (metrics) => {
  try {
    // Validate input
    if (!metrics || typeof metrics !== 'object') {
      logger.error('Invalid metrics provided to calculatePerformanceScore');
      return getDefaultScore();
    }

    let score = 0;
    let maxScore = 0;
    const breakdown = {};
    const details = {};

    // Revenue Growth (0-30 points)
    const revenueGrowth = metrics.revenueGrowth || 0;
    let revenuePoints = 0;

    if (revenueGrowth >= 20) {
      revenuePoints = 30;
    } else if (revenueGrowth >= 10) {
      revenuePoints = 20;
    } else if (revenueGrowth >= 5) {
      revenuePoints = 10;
    } else if (revenueGrowth >= 0) {
      revenuePoints = 5;
    }

    score += revenuePoints;
    maxScore += SCORE_WEIGHTS.revenueGrowth;
    breakdown.revenueGrowth = revenuePoints;
    details.revenueGrowth = {
      value: revenueGrowth,
      points: revenuePoints,
      maxPoints: SCORE_WEIGHTS.revenueGrowth,
      percentage: (revenuePoints / SCORE_WEIGHTS.revenueGrowth) * 100
    };

    // Profit Margin (0-25 points)
    const profitMargin = metrics.profitMargin || 0;
    let profitPoints = 0;

    if (profitMargin >= 20) {
      profitPoints = 25;
    } else if (profitMargin >= 15) {
      profitPoints = 20;
    } else if (profitMargin >= 10) {
      profitPoints = 15;
    } else if (profitMargin >= 5) {
      profitPoints = 10;
    }

    score += profitPoints;
    maxScore += SCORE_WEIGHTS.profitMargin;
    breakdown.profitMargin = profitPoints;
    details.profitMargin = {
      value: profitMargin,
      points: profitPoints,
      maxPoints: SCORE_WEIGHTS.profitMargin,
      percentage: (profitPoints / SCORE_WEIGHTS.profitMargin) * 100
    };

    // Order Volume (0-20 points)
    const orderGrowth = metrics.orderGrowth || 0;
    let orderPoints = 0;

    if (orderGrowth >= 15) {
      orderPoints = 20;
    } else if (orderGrowth >= 10) {
      orderPoints = 15;
    } else if (orderGrowth >= 5) {
      orderPoints = 10;
    } else if (orderGrowth >= 0) {
      orderPoints = 5;
    }

    score += orderPoints;
    maxScore += SCORE_WEIGHTS.orderVolume;
    breakdown.orderGrowth = orderPoints;
    details.orderGrowth = {
      value: orderGrowth,
      points: orderPoints,
      maxPoints: SCORE_WEIGHTS.orderVolume,
      percentage: (orderPoints / SCORE_WEIGHTS.orderVolume) * 100
    };

    // Customer Satisfaction (0-15 points)
    const customerSatisfaction = metrics.customerSatisfaction || 0;
    let satisfactionPoints = 0;

    if (customerSatisfaction >= 4.5) {
      satisfactionPoints = 15;
    } else if (customerSatisfaction >= 4.0) {
      satisfactionPoints = 10;
    } else if (customerSatisfaction >= 3.5) {
      satisfactionPoints = 5;
    }

    score += satisfactionPoints;
    maxScore += SCORE_WEIGHTS.customerSatisfaction;
    breakdown.customerSatisfaction = satisfactionPoints;
    details.customerSatisfaction = {
      value: customerSatisfaction,
      points: satisfactionPoints,
      maxPoints: SCORE_WEIGHTS.customerSatisfaction,
      percentage: (satisfactionPoints / SCORE_WEIGHTS.customerSatisfaction) * 100
    };

    // Operational Efficiency (0-10 points)
    const operationalEfficiency = metrics.operationalEfficiency || 0;
    let efficiencyPoints = 0;

    if (operationalEfficiency >= 90) {
      efficiencyPoints = 10;
    } else if (operationalEfficiency >= 80) {
      efficiencyPoints = 7;
    } else if (operationalEfficiency >= 70) {
      efficiencyPoints = 5;
    }

    score += efficiencyPoints;
    maxScore += SCORE_WEIGHTS.operationalEfficiency;
    breakdown.operationalEfficiency = efficiencyPoints;
    details.operationalEfficiency = {
      value: operationalEfficiency,
      points: efficiencyPoints,
      maxPoints: SCORE_WEIGHTS.operationalEfficiency,
      percentage: (efficiencyPoints / SCORE_WEIGHTS.operationalEfficiency) * 100
    };

    // Calculate final percentage
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const finalScore = Math.round(clamp(percentage, 0, 100));

    // Determine grade
    const grade = getGrade(finalScore);

    // Get performance level
    const performanceLevel = getPerformanceLevel(finalScore);

    const result = {
      score: finalScore,
      grade,
      performanceLevel,
      breakdown,
      details,
      metadata: {
        totalPoints: score,
        maxPoints: maxScore,
        calculatedAt: new Date().toISOString()
      }
    };

    logger.info('Performance score calculated', {
      score: finalScore,
      grade,
      level: performanceLevel
    });

    return result;
  } catch (error) {
    logger.error('Failed to calculate performance score', {
      error: error.message,
      stack: error.stack
    });
    return getDefaultScore();
  }
};

/**
 * Get grade letter based on score
 *
 * @param {number} score - Performance score (0-100)
 * @returns {string} Grade letter (A, B, C, D, F)
 */
export const getGrade = (score) => {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  if (score >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
};

/**
 * Get performance level description
 *
 * @param {number} score - Performance score (0-100)
 * @returns {string} Performance level
 */
export const getPerformanceLevel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Average';
  if (score >= 60) return 'Below Average';
  return 'Poor';
};

/**
 * Get color class based on grade
 *
 * @param {string} grade - Grade letter
 * @returns {string} Tailwind color class
 */
export const getGradeColor = (grade) => {
  const colors = {
    A: 'text-emerald-600 dark:text-emerald-400',
    B: 'text-blue-600 dark:text-blue-400',
    C: 'text-yellow-600 dark:text-yellow-400',
    D: 'text-orange-600 dark:text-orange-400',
    F: 'text-red-600 dark:text-red-400'
  };
  return colors[grade] || colors.F;
};

/**
 * Get background color based on grade
 *
 * @param {string} grade - Grade letter
 * @returns {string} Tailwind background color class
 */
export const getGradeBgColor = (grade) => {
  const colors = {
    A: 'bg-emerald-100 dark:bg-emerald-900/30',
    B: 'bg-blue-100 dark:bg-blue-900/30',
    C: 'bg-yellow-100 dark:bg-yellow-900/30',
    D: 'bg-orange-100 dark:bg-orange-900/30',
    F: 'bg-red-100 dark:bg-red-900/30'
  };
  return colors[grade] || colors.F;
};

/**
 * Get recommendations based on score breakdown
 *
 * @param {Object} scoreResult - Result from calculatePerformanceScore
 * @returns {Array<Object>} Array of recommendations
 */
export const getRecommendations = (scoreResult) => {
  const recommendations = [];

  if (!scoreResult || !scoreResult.details) {
    return recommendations;
  }

  const { details } = scoreResult;

  // Revenue Growth recommendations
  if (details.revenueGrowth.percentage < 50) {
    recommendations.push({
      category: 'Revenue Growth',
      priority: 'high',
      message: 'Revenue growth is below target. Consider expanding marketing efforts or introducing new menu items.',
      impact: 'Revenue increase of 10-15%'
    });
  }

  // Profit Margin recommendations
  if (details.profitMargin.percentage < 60) {
    recommendations.push({
      category: 'Profit Margin',
      priority: 'high',
      message: 'Profit margins need improvement. Review supplier costs and optimize pricing strategy.',
      impact: 'Margin improvement of 3-5%'
    });
  }

  // Order Volume recommendations
  if (details.orderGrowth.percentage < 50) {
    recommendations.push({
      category: 'Order Volume',
      priority: 'medium',
      message: 'Order volume growth is sluggish. Focus on customer retention and acquisition campaigns.',
      impact: 'Order increase of 15-20%'
    });
  }

  // Customer Satisfaction recommendations
  if (details.customerSatisfaction.percentage < 70) {
    recommendations.push({
      category: 'Customer Satisfaction',
      priority: 'high',
      message: 'Customer satisfaction needs attention. Review feedback and improve service quality.',
      impact: 'Rating increase of 0.5-1.0 stars'
    });
  }

  // Operational Efficiency recommendations
  if (details.operationalEfficiency.percentage < 70) {
    recommendations.push({
      category: 'Operational Efficiency',
      priority: 'medium',
      message: 'Operations can be optimized. Review workflows and consider automation tools.',
      impact: 'Efficiency gain of 10-15%'
    });
  }

  return recommendations;
};

/**
 * Compare performance scores over time
 *
 * @param {Object} currentScore - Current performance score
 * @param {Object} previousScore - Previous performance score
 * @returns {Object} Comparison results
 */
export const comparePerformance = (currentScore, previousScore) => {
  try {
    if (!currentScore || !previousScore) {
      return { change: 0, trend: 'stable', improved: false };
    }

    const change = currentScore.score - previousScore.score;
    const changePercentage = previousScore.score !== 0
      ? (change / previousScore.score) * 100
      : 0;

    const trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable';
    const improved = change > 0;

    const gradeChanged = currentScore.grade !== previousScore.grade;
    const gradeDirection = gradeChanged
      ? (currentScore.score > previousScore.score ? 'upgraded' : 'downgraded')
      : 'same';

    return {
      change: Math.round(change),
      changePercentage: Math.round(changePercentage * 10) / 10,
      trend,
      improved,
      previousGrade: previousScore.grade,
      currentGrade: currentScore.grade,
      gradeChanged,
      gradeDirection
    };
  } catch (error) {
    logger.error('Failed to compare performance', { error: error.message });
    return { change: 0, trend: 'stable', improved: false };
  }
};

/**
 * Get default score object (used on errors)
 *
 * @returns {Object} Default score object
 */
const getDefaultScore = () => {
  return {
    score: 0,
    grade: 'F',
    performanceLevel: 'Poor',
    breakdown: {
      revenueGrowth: 0,
      profitMargin: 0,
      orderGrowth: 0,
      customerSatisfaction: 0,
      operationalEfficiency: 0
    },
    details: {},
    metadata: {
      totalPoints: 0,
      maxPoints: 100,
      calculatedAt: new Date().toISOString(),
      error: true
    }
  };
};

/**
 * Calculate benchmark comparison
 *
 * @param {Object} score - Current performance score
 * @param {Object} benchmark - Industry benchmark data
 * @returns {Object} Benchmark comparison
 */
export const compareToBenchmark = (score, benchmark) => {
  try {
    if (!score || !benchmark) {
      return { percentile: 0, comparison: 'unknown' };
    }

    const percentile = score.score >= benchmark.excellent ? 95
      : score.score >= benchmark.good ? 75
      : score.score >= benchmark.average ? 50
      : score.score >= benchmark.belowAverage ? 25
      : 10;

    const comparison = score.score >= benchmark.excellent ? 'excellent'
      : score.score >= benchmark.good ? 'above average'
      : score.score >= benchmark.average ? 'average'
      : score.score >= benchmark.belowAverage ? 'below average'
      : 'needs improvement';

    return {
      percentile,
      comparison,
      industryAverage: benchmark.average,
      difference: score.score - benchmark.average
    };
  } catch (error) {
    logger.error('Failed to compare to benchmark', { error: error.message });
    return { percentile: 0, comparison: 'unknown' };
  }
};

// Export default object with all functions
export default {
  calculatePerformanceScore,
  getGrade,
  getPerformanceLevel,
  getGradeColor,
  getGradeBgColor,
  getRecommendations,
  comparePerformance,
  compareToBenchmark,
  SCORE_WEIGHTS,
  GRADE_THRESHOLDS
};
