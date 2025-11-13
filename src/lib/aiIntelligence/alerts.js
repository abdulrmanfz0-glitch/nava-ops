/**
 * AI Intelligence Layer - Smart Alerts System
 * Monitors data for unusual patterns and generates intelligent alerts
 */

/**
 * Alert severity levels
 */
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info'
};

/**
 * Alert categories
 */
export const ALERT_CATEGORY = {
  REVENUE: 'revenue',
  PERFORMANCE: 'performance',
  ANOMALY: 'anomaly',
  TREND: 'trend',
  THRESHOLD: 'threshold',
  PREDICTION: 'prediction'
};

/**
 * Check for revenue alerts
 */
export function checkRevenueAlerts(revenueData, thresholds = {}) {
  const alerts = [];

  if (!revenueData || revenueData.length < 2) {
    return alerts;
  }

  const {
    criticalDropPercent = 20,
    warningDropPercent = 10,
    lowRevenueThreshold = 100
  } = thresholds;

  const current = revenueData[revenueData.length - 1];
  const previous = revenueData[revenueData.length - 2];
  const currentRevenue = current.revenue || 0;
  const previousRevenue = previous.revenue || 0;

  // Sudden revenue drop
  if (previousRevenue > 0) {
    const dropPercent = ((previousRevenue - currentRevenue) / previousRevenue) * 100;

    if (dropPercent >= criticalDropPercent) {
      alerts.push({
        id: `revenue_drop_critical_${Date.now()}`,
        severity: ALERT_SEVERITY.CRITICAL,
        category: ALERT_CATEGORY.REVENUE,
        title: 'Critical Revenue Drop Detected',
        message: `Revenue dropped ${dropPercent.toFixed(1)}% from $${previousRevenue.toFixed(2)} to $${currentRevenue.toFixed(2)}`,
        timestamp: new Date().toISOString(),
        data: { current: currentRevenue, previous: previousRevenue, dropPercent },
        actions: [
          'Investigate operational issues immediately',
          'Check for system or technical problems',
          'Review recent changes that may have impacted sales'
        ]
      });
    } else if (dropPercent >= warningDropPercent) {
      alerts.push({
        id: `revenue_drop_warning_${Date.now()}`,
        severity: ALERT_SEVERITY.HIGH,
        category: ALERT_CATEGORY.REVENUE,
        title: 'Revenue Decline Alert',
        message: `Revenue decreased ${dropPercent.toFixed(1)}% to $${currentRevenue.toFixed(2)}`,
        timestamp: new Date().toISOString(),
        data: { current: currentRevenue, previous: previousRevenue, dropPercent },
        actions: [
          'Monitor closely for continued decline',
          'Review marketing and promotional activities',
          'Analyze competitor actions'
        ]
      });
    }
  }

  // Low revenue threshold
  if (currentRevenue < lowRevenueThreshold && currentRevenue > 0) {
    alerts.push({
      id: `low_revenue_${Date.now()}`,
      severity: ALERT_SEVERITY.MEDIUM,
      category: ALERT_CATEGORY.THRESHOLD,
      title: 'Low Revenue Warning',
      message: `Revenue of $${currentRevenue.toFixed(2)} is below threshold of $${lowRevenueThreshold}`,
      timestamp: new Date().toISOString(),
      data: { current: currentRevenue, threshold: lowRevenueThreshold },
      actions: [
        'Review daily operations',
        'Consider promotional activities',
        'Check for external factors affecting sales'
      ]
    });
  }

  // Multi-day declining trend
  if (revenueData.length >= 3) {
    const lastThree = revenueData.slice(-3).map(d => d.revenue || 0);
    const isDecreasingTrend = lastThree[2] < lastThree[1] && lastThree[1] < lastThree[0];

    if (isDecreasingTrend) {
      const totalDrop = ((lastThree[0] - lastThree[2]) / lastThree[0]) * 100;

      alerts.push({
        id: `revenue_trend_${Date.now()}`,
        severity: ALERT_SEVERITY.HIGH,
        category: ALERT_CATEGORY.TREND,
        title: 'Declining Revenue Trend',
        message: `Revenue has decreased for 3 consecutive periods (${totalDrop.toFixed(1)}% total decline)`,
        timestamp: new Date().toISOString(),
        data: { trend: lastThree, totalDrop },
        actions: [
          'Conduct comprehensive performance review',
          'Implement corrective measures',
          'Engage with customers for feedback'
        ]
      });
    }
  }

  return alerts;
}

/**
 * Check for performance alerts
 */
export function checkPerformanceAlerts(performanceData, thresholds = {}) {
  const alerts = [];

  if (!performanceData || performanceData.length < 2) {
    return alerts;
  }

  const {
    lowOrderThreshold = 10,
    orderDropPercent = 15
  } = thresholds;

  const current = performanceData[performanceData.length - 1];
  const previous = performanceData[performanceData.length - 2];

  // Low order volume
  if (current.orders !== undefined && current.orders < lowOrderThreshold) {
    alerts.push({
      id: `low_orders_${Date.now()}`,
      severity: ALERT_SEVERITY.MEDIUM,
      category: ALERT_CATEGORY.PERFORMANCE,
      title: 'Low Order Volume',
      message: `Only ${current.orders} orders - below threshold of ${lowOrderThreshold}`,
      timestamp: new Date().toISOString(),
      data: { orders: current.orders, threshold: lowOrderThreshold },
      actions: [
        'Check operational status',
        'Verify ordering systems are functioning',
        'Consider promotional push'
      ]
    });
  }

  // Sudden order drop
  if (previous.orders > 0) {
    const dropPercent = ((previous.orders - current.orders) / previous.orders) * 100;

    if (dropPercent >= orderDropPercent) {
      alerts.push({
        id: `order_drop_${Date.now()}`,
        severity: ALERT_SEVERITY.HIGH,
        category: ALERT_CATEGORY.PERFORMANCE,
        title: 'Order Volume Drop',
        message: `Orders dropped ${dropPercent.toFixed(1)}% from ${previous.orders} to ${current.orders}`,
        timestamp: new Date().toISOString(),
        data: { current: current.orders, previous: previous.orders, dropPercent },
        actions: [
          'Investigate causes immediately',
          'Check customer feedback',
          'Review recent operational changes'
        ]
      });
    }
  }

  // Customer decline
  if (current.customers !== undefined && previous.customers !== undefined && previous.customers > 0) {
    const customerDropPercent = ((previous.customers - current.customers) / previous.customers) * 100;

    if (customerDropPercent >= 20) {
      alerts.push({
        id: `customer_drop_${Date.now()}`,
        severity: ALERT_SEVERITY.HIGH,
        category: ALERT_CATEGORY.PERFORMANCE,
        title: 'Customer Count Decline',
        message: `Customer count dropped ${customerDropPercent.toFixed(1)}% from ${previous.customers} to ${current.customers}`,
        timestamp: new Date().toISOString(),
        data: { current: current.customers, previous: previous.customers, dropPercent: customerDropPercent },
        actions: [
          'Analyze customer retention issues',
          'Review customer satisfaction scores',
          'Implement customer engagement campaigns'
        ]
      });
    }
  }

  return alerts;
}

/**
 * Check for anomaly alerts
 */
export function checkAnomalyAlerts(anomalies) {
  const alerts = [];

  if (!anomalies || !anomalies.anomalies || anomalies.anomalies.length === 0) {
    return alerts;
  }

  // Critical anomalies
  const criticalAnomalies = anomalies.anomalies.filter(a => a.severity === 'critical');
  if (criticalAnomalies.length > 0) {
    alerts.push({
      id: `critical_anomalies_${Date.now()}`,
      severity: ALERT_SEVERITY.CRITICAL,
      category: ALERT_CATEGORY.ANOMALY,
      title: 'Critical Anomalies Detected',
      message: `${criticalAnomalies.length} critical anomalies detected requiring immediate attention`,
      timestamp: new Date().toISOString(),
      data: { anomalies: criticalAnomalies },
      actions: [
        'Review each critical anomaly',
        'Investigate root causes',
        'Take corrective action immediately'
      ]
    });
  }

  // Multiple anomalies in short period
  if (anomalies.summary && anomalies.summary.total > 5) {
    alerts.push({
      id: `multiple_anomalies_${Date.now()}`,
      severity: ALERT_SEVERITY.HIGH,
      category: ALERT_CATEGORY.ANOMALY,
      title: 'Multiple Anomalies Detected',
      message: `${anomalies.summary.total} anomalies detected - system may be unstable`,
      timestamp: new Date().toISOString(),
      data: anomalies.summary,
      actions: [
        'Conduct system health check',
        'Review data quality',
        'Investigate underlying patterns'
      ]
    });
  }

  return alerts;
}

/**
 * Check for prediction-based alerts
 */
export function checkPredictionAlerts(predictions, thresholds = {}) {
  const alerts = [];

  if (!predictions) {
    return alerts;
  }

  const { negativeGrowthThreshold = -10 } = thresholds;

  // Revenue prediction alerts
  if (predictions.revenue && predictions.revenue.changePercent < negativeGrowthThreshold) {
    alerts.push({
      id: `revenue_forecast_warning_${Date.now()}`,
      severity: ALERT_SEVERITY.HIGH,
      category: ALERT_CATEGORY.PREDICTION,
      title: 'Negative Revenue Forecast',
      message: `Revenue predicted to decline ${Math.abs(predictions.revenue.changePercent).toFixed(1)}% over next 30 days`,
      timestamp: new Date().toISOString(),
      data: predictions.revenue,
      actions: [
        'Develop revenue recovery plan',
        'Implement proactive marketing campaigns',
        'Review and adjust business strategy'
      ]
    });
  }

  // Cost prediction alerts
  if (predictions.costs && predictions.costs.trend === 'increasing') {
    const increase = predictions.costs.projectedCost - predictions.costs.currentCost;
    if (increase > predictions.costs.currentCost * 0.15) {
      alerts.push({
        id: `cost_increase_forecast_${Date.now()}`,
        severity: ALERT_SEVERITY.MEDIUM,
        category: ALERT_CATEGORY.PREDICTION,
        title: 'Rising Costs Forecast',
        message: `Costs projected to increase by $${increase.toFixed(2)} (${((increase / predictions.costs.currentCost) * 100).toFixed(1)}%)`,
        timestamp: new Date().toISOString(),
        data: predictions.costs,
        actions: [
          'Review cost structure',
          'Negotiate with suppliers',
          'Implement cost control measures'
        ]
      });
    }
  }

  return alerts;
}

/**
 * Check for threshold-based alerts
 */
export function checkThresholdAlerts(metrics, thresholds) {
  const alerts = [];

  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = metrics[metric];

    if (value !== undefined && value !== null) {
      if (threshold.max !== undefined && value > threshold.max) {
        alerts.push({
          id: `threshold_max_${metric}_${Date.now()}`,
          severity: threshold.severity || ALERT_SEVERITY.MEDIUM,
          category: ALERT_CATEGORY.THRESHOLD,
          title: `${metric} Exceeded Maximum`,
          message: `${metric} (${value}) exceeded maximum threshold of ${threshold.max}`,
          timestamp: new Date().toISOString(),
          data: { metric, value, threshold: threshold.max },
          actions: threshold.actions || ['Review and take corrective action']
        });
      }

      if (threshold.min !== undefined && value < threshold.min) {
        alerts.push({
          id: `threshold_min_${metric}_${Date.now()}`,
          severity: threshold.severity || ALERT_SEVERITY.MEDIUM,
          category: ALERT_CATEGORY.THRESHOLD,
          title: `${metric} Below Minimum`,
          message: `${metric} (${value}) fell below minimum threshold of ${threshold.min}`,
          timestamp: new Date().toISOString(),
          data: { metric, value, threshold: threshold.min },
          actions: threshold.actions || ['Review and take corrective action']
        });
      }
    }
  });

  return alerts;
}

/**
 * Check for branch-specific alerts
 */
export function checkBranchAlerts(branchData, allBranches) {
  const alerts = [];

  if (!branchData || !allBranches || allBranches.length === 0) {
    return alerts;
  }

  const avgRevenue = allBranches.reduce((sum, b) => sum + (b.revenue || 0), 0) / allBranches.length;
  const branchRevenue = branchData.revenue || 0;

  // Branch significantly underperforming
  if (branchRevenue < avgRevenue * 0.5 && avgRevenue > 0) {
    alerts.push({
      id: `branch_underperform_${branchData.id}_${Date.now()}`,
      severity: ALERT_SEVERITY.HIGH,
      category: ALERT_CATEGORY.PERFORMANCE,
      title: `${branchData.name} Underperforming`,
      message: `Branch revenue ($${branchRevenue.toFixed(2)}) is 50% below average ($${avgRevenue.toFixed(2)})`,
      timestamp: new Date().toISOString(),
      data: { branchId: branchData.id, revenue: branchRevenue, avgRevenue },
      actions: [
        'Conduct branch audit',
        'Provide management support',
        'Review local market conditions'
      ]
    });
  }

  // Low branch health score
  if (branchData.healthScore !== undefined && branchData.healthScore < 50) {
    alerts.push({
      id: `branch_health_${branchData.id}_${Date.now()}`,
      severity: ALERT_SEVERITY.HIGH,
      category: ALERT_CATEGORY.PERFORMANCE,
      title: `${branchData.name} Health Score Critical`,
      message: `Branch health score of ${branchData.healthScore} indicates serious issues`,
      timestamp: new Date().toISOString(),
      data: { branchId: branchData.id, healthScore: branchData.healthScore },
      actions: [
        'Review branch performance metrics',
        'Implement improvement plan',
        'Increase monitoring frequency'
      ]
    });
  }

  return alerts;
}

/**
 * Generate all alerts for current data
 */
export function generateAllAlerts(data, config = {}) {
  const alerts = [];

  const {
    revenueThresholds = {},
    performanceThresholds = {},
    customThresholds = {},
    enabledCategories = Object.values(ALERT_CATEGORY)
  } = config;

  // Revenue alerts
  if (enabledCategories.includes(ALERT_CATEGORY.REVENUE) && data.revenue) {
    alerts.push(...checkRevenueAlerts(data.revenue, revenueThresholds));
  }

  // Performance alerts
  if (enabledCategories.includes(ALERT_CATEGORY.PERFORMANCE) && data.performance) {
    alerts.push(...checkPerformanceAlerts(data.performance, performanceThresholds));
  }

  // Anomaly alerts
  if (enabledCategories.includes(ALERT_CATEGORY.ANOMALY) && data.anomalies) {
    alerts.push(...checkAnomalyAlerts(data.anomalies));
  }

  // Prediction alerts
  if (enabledCategories.includes(ALERT_CATEGORY.PREDICTION) && data.predictions) {
    alerts.push(...checkPredictionAlerts(data.predictions));
  }

  // Threshold alerts
  if (enabledCategories.includes(ALERT_CATEGORY.THRESHOLD) && data.metrics && Object.keys(customThresholds).length > 0) {
    alerts.push(...checkThresholdAlerts(data.metrics, customThresholds));
  }

  // Branch alerts
  if (data.branch && data.allBranches) {
    alerts.push(...checkBranchAlerts(data.branch, data.allBranches));
  }

  // Sort by severity
  const severityOrder = {
    [ALERT_SEVERITY.CRITICAL]: 0,
    [ALERT_SEVERITY.HIGH]: 1,
    [ALERT_SEVERITY.MEDIUM]: 2,
    [ALERT_SEVERITY.LOW]: 3,
    [ALERT_SEVERITY.INFO]: 4
  };

  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    alerts,
    summary: {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === ALERT_SEVERITY.CRITICAL).length,
      high: alerts.filter(a => a.severity === ALERT_SEVERITY.HIGH).length,
      medium: alerts.filter(a => a.severity === ALERT_SEVERITY.MEDIUM).length,
      low: alerts.filter(a => a.severity === ALERT_SEVERITY.LOW).length,
      info: alerts.filter(a => a.severity === ALERT_SEVERITY.INFO).length
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Filter alerts by severity
 */
export function filterAlertsBySeverity(alerts, minSeverity = ALERT_SEVERITY.LOW) {
  const severityLevels = [
    ALERT_SEVERITY.CRITICAL,
    ALERT_SEVERITY.HIGH,
    ALERT_SEVERITY.MEDIUM,
    ALERT_SEVERITY.LOW,
    ALERT_SEVERITY.INFO
  ];

  const minIndex = severityLevels.indexOf(minSeverity);
  const allowedSeverities = severityLevels.slice(0, minIndex + 1);

  return alerts.filter(alert => allowedSeverities.includes(alert.severity));
}

/**
 * Get active alerts (unresolved)
 */
export function getActiveAlerts(allAlerts, resolvedAlertIds = []) {
  return allAlerts.filter(alert => !resolvedAlertIds.includes(alert.id));
}
