/**
 * AI Intelligence Layer - Main Export
 * Complete AI-powered analytics and intelligence system
 */

// Predictions
export {
  predictRevenueTrend,
  predictPerformance,
  predictCostTrend,
  predictCategoryPerformance,
  predictBranchPerformance,
  generatePredictionSummary
} from './predictions.js';

// Anomaly Detection
export {
  detectRevenueAnomalies,
  detectPerformanceAnomalies,
  detectActivityAnomalies,
  detectCategoryAnomalies,
  detectBranchAnomalies,
  detectAllAnomalies
} from './anomalyDetection.js';

// Recommendations
export {
  generateAllRecommendations,
  getTopRecommendations
} from './recommendations.js';

// Health Score
export {
  calculateBranchHealthScore,
  calculateMultipleBranchScores,
  getBranchHealthSummary
} from './healthScore.js';

// Clustering
export {
  clusterCategories,
  clusterBranches,
  clusterCustomers
} from './clustering.js';

// Explanations
export {
  explainRevenueChange,
  explainPerformanceTrend,
  explainAnomaly,
  explainBranchComparison,
  generatePerformanceExplanation
} from './explanations.js';

// Forecasting
export {
  generateForecast,
  generateMultiPeriodForecast,
  generateRevenueForecast,
  generateOrdersForecast,
  generateCustomerForecast,
  generateForecastSummary,
  compareForecastToActual
} from './forecasting.js';

// What-If Simulator
export {
  simulatePriceChange,
  simulateMarketingCampaign,
  simulateCostReduction,
  simulateNewBranch,
  simulateStaffOptimization,
  compareScenarios
} from './whatIfSimulator.js';

// Alerts
export {
  ALERT_SEVERITY,
  ALERT_CATEGORY,
  checkRevenueAlerts,
  checkPerformanceAlerts,
  checkAnomalyAlerts,
  checkPredictionAlerts,
  checkThresholdAlerts,
  checkBranchAlerts,
  generateAllAlerts,
  filterAlertsBySeverity,
  getActiveAlerts
} from './alerts.js';

// Benchmarking
export {
  scoreRevenuePerformance,
  scoreOperationalPerformance,
  scoreFinancialPerformance,
  scoreCustomerSatisfaction,
  generatePerformanceScore,
  benchmarkAgainstPeers,
  getIndustryBenchmarks
} from './benchmarking.js';

// Professional Report Insights
export {
  analyzeRevenueGrowth,
  analyzeCostOptimization,
  analyzeCommissionImpact,
  generateProfitabilityRecommendations,
  generateExecutiveSummary as generateProfessionalReportSummary
} from './professionalInsights.js';

/**
 * Comprehensive AI Intelligence Analysis
 * Run all analyses and return complete insights
 */
export function runComprehensiveAnalysis(data, options = {}) {
  const {
    industry = 'default',
    enablePredictions = true,
    enableAnomalies = true,
    enableRecommendations = true,
    enableForecasts = true,
    enableAlerts = true,
    enableScoring = true
  } = options;

  const results = {
    timestamp: new Date().toISOString(),
    predictions: null,
    anomalies: null,
    recommendations: null,
    forecasts: null,
    alerts: null,
    scores: null,
    healthScores: null,
    clusters: null
  };

  // Predictions
  if (enablePredictions && data) {
    try {
      const { generatePredictionSummary } = require('./predictions.js');
      results.predictions = generatePredictionSummary(data);
    } catch (error) {
      console.error('Prediction analysis failed:', error);
    }
  }

  // Anomaly Detection
  if (enableAnomalies && data) {
    try {
      const { detectAllAnomalies } = require('./anomalyDetection.js');
      results.anomalies = detectAllAnomalies(data);
    } catch (error) {
      console.error('Anomaly detection failed:', error);
    }
  }

  // Recommendations
  if (enableRecommendations && data) {
    try {
      const { generateAllRecommendations } = require('./recommendations.js');
      results.recommendations = generateAllRecommendations(data);
    } catch (error) {
      console.error('Recommendation generation failed:', error);
    }
  }

  // Forecasts
  if (enableForecasts && data) {
    try {
      const { generateForecastSummary } = require('./forecasting.js');
      results.forecasts = generateForecastSummary(data);
    } catch (error) {
      console.error('Forecast generation failed:', error);
    }
  }

  // Alerts
  if (enableAlerts && data) {
    try {
      const { generateAllAlerts } = require('./alerts.js');
      results.alerts = generateAllAlerts(data);
    } catch (error) {
      console.error('Alert generation failed:', error);
    }
  }

  // Performance Scoring
  if (enableScoring && data) {
    try {
      const { generatePerformanceScore } = require('./benchmarking.js');
      results.scores = generatePerformanceScore(data, industry);
    } catch (error) {
      console.error('Performance scoring failed:', error);
    }
  }

  // Branch Health Scores
  if (data.branches) {
    try {
      const { getBranchHealthSummary } = require('./healthScore.js');
      results.healthScores = getBranchHealthSummary(data.branches);
    } catch (error) {
      console.error('Health score calculation failed:', error);
    }
  }

  // Category Clustering
  if (data.categories) {
    try {
      const { clusterCategories } = require('./clustering.js');
      results.clusters = clusterCategories(data.categories);
    } catch (error) {
      console.error('Clustering failed:', error);
    }
  }

  return results;
}

/**
 * Get AI Insights Summary
 * Quick overview of key insights
 */
export function getAIInsightsSummary(data) {
  const summary = {
    keyInsights: [],
    criticalAlerts: 0,
    topRecommendations: [],
    overallHealth: 'unknown',
    trendDirection: 'stable'
  };

  try {
    // Get predictions
    const { generatePredictionSummary } = require('./predictions.js');
    const predictions = generatePredictionSummary(data);

    if (predictions.revenue) {
      summary.trendDirection = predictions.revenue.trend;
      summary.keyInsights.push({
        type: 'trend',
        message: `Revenue trend: ${predictions.revenue.trend} (${predictions.revenue.changePercent.toFixed(1)}%)`
      });
    }

    // Get alerts
    const { generateAllAlerts } = require('./alerts.js');
    const alerts = generateAllAlerts(data);
    summary.criticalAlerts = alerts.summary.critical + alerts.summary.high;

    // Get recommendations
    const { getTopRecommendations } = require('./recommendations.js');
    const recommendations = getTopRecommendations(data, 3);
    summary.topRecommendations = recommendations.recommendations;

    // Overall health
    if (summary.criticalAlerts > 3) {
      summary.overallHealth = 'critical';
    } else if (summary.criticalAlerts > 0) {
      summary.overallHealth = 'needs_attention';
    } else if (summary.trendDirection === 'increasing') {
      summary.overallHealth = 'excellent';
    } else {
      summary.overallHealth = 'good';
    }
  } catch (error) {
    console.error('Failed to generate AI insights summary:', error);
  }

  return summary;
}
