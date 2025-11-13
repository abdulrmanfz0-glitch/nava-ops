/**
 * AI Intelligence Layer - Performance Explanations Generator
 * Generates human-readable explanations for performance changes
 */

/**
 * Analyze revenue changes and generate explanation
 */
export function explainRevenueChange(currentData, previousData, context = {}) {
  const current = currentData.revenue || 0;
  const previous = previousData.revenue || 0;
  const change = current - previous;
  const changePercent = previous > 0 ? (change / previous) * 100 : 0;

  const explanation = {
    metric: 'revenue',
    change,
    changePercent,
    direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable',
    severity: Math.abs(changePercent) > 20 ? 'high' : Math.abs(changePercent) > 10 ? 'medium' : 'low',
    summary: '',
    factors: [],
    recommendations: []
  };

  // Build summary
  if (Math.abs(changePercent) < 2) {
    explanation.summary = `Revenue remained stable at $${current.toFixed(2)}, showing consistent performance.`;
  } else if (change > 0) {
    explanation.summary = `Revenue increased by $${change.toFixed(2)} (${changePercent.toFixed(1)}%), a ${explanation.severity === 'high' ? 'significant' : 'notable'} improvement.`;
  } else {
    explanation.summary = `Revenue decreased by $${Math.abs(change).toFixed(2)} (${Math.abs(changePercent).toFixed(1)}%), requiring attention.`;
  }

  // Analyze contributing factors
  const factors = [];

  // Order volume impact
  if (currentData.orders && previousData.orders) {
    const orderChange = ((currentData.orders - previousData.orders) / previousData.orders) * 100;
    if (Math.abs(orderChange) > 5) {
      factors.push({
        factor: 'Order Volume',
        impact: orderChange > 0 ? 'positive' : 'negative',
        description: `Orders ${orderChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(orderChange).toFixed(1)}%`,
        contribution: Math.abs(orderChange) / Math.abs(changePercent) * 100
      });
    }
  }

  // Average order value impact
  if (currentData.avgOrderValue && previousData.avgOrderValue) {
    const aovChange = ((currentData.avgOrderValue - previousData.avgOrderValue) / previousData.avgOrderValue) * 100;
    if (Math.abs(aovChange) > 5) {
      factors.push({
        factor: 'Average Order Value',
        impact: aovChange > 0 ? 'positive' : 'negative',
        description: `Average order value ${aovChange > 0 ? 'increased' : 'decreased'} to $${currentData.avgOrderValue.toFixed(2)}`,
        contribution: Math.abs(aovChange) / Math.abs(changePercent) * 100
      });
    }
  }

  // Customer count impact
  if (currentData.customers && previousData.customers) {
    const customerChange = ((currentData.customers - previousData.customers) / previousData.customers) * 100;
    if (Math.abs(customerChange) > 5) {
      factors.push({
        factor: 'Customer Count',
        impact: customerChange > 0 ? 'positive' : 'negative',
        description: `Customer count ${customerChange > 0 ? 'grew' : 'declined'} by ${Math.abs(customerChange).toFixed(1)}%`,
        contribution: Math.abs(customerChange) / Math.abs(changePercent) * 100
      });
    }
  }

  // Day of week impact (if context provided)
  if (context.dayOfWeek) {
    const weekendDays = [0, 6]; // Sunday, Saturday
    if (weekendDays.includes(context.dayOfWeek)) {
      factors.push({
        factor: 'Weekend Pattern',
        impact: 'neutral',
        description: 'Weekend performance typically differs from weekdays',
        contribution: 10
      });
    }
  }

  explanation.factors = factors.sort((a, b) => b.contribution - a.contribution);

  // Generate recommendations
  if (change < 0) {
    explanation.recommendations = [
      'Analyze the decline in detail to identify root causes',
      'Review recent operational changes or external factors',
      'Consider promotional campaigns to boost sales',
      'Engage with customers to understand their needs'
    ];
  } else if (change > 0) {
    explanation.recommendations = [
      'Document what drove this success for future reference',
      'Consider scaling successful strategies',
      'Maintain momentum with continued customer engagement'
    ];
  }

  return explanation;
}

/**
 * Explain performance trends over time
 */
export function explainPerformanceTrend(historicalData, metric = 'revenue') {
  if (!historicalData || historicalData.length < 7) {
    return {
      trend: 'insufficient_data',
      summary: 'Not enough data to analyze trends',
      patterns: []
    };
  }

  const values = historicalData.map(d => d[metric] || 0);
  const recent = values.slice(-7);
  const previous = values.slice(-14, -7);

  const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
  const previousAvg = previous.length > 0 ? previous.reduce((sum, v) => sum + v, 0) / previous.length : recentAvg;

  const trendChange = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

  const explanation = {
    metric,
    trend: trendChange > 5 ? 'increasing' : trendChange < -5 ? 'decreasing' : 'stable',
    trendStrength: Math.abs(trendChange),
    summary: '',
    patterns: [],
    forecast: ''
  };

  // Build summary
  if (explanation.trend === 'increasing') {
    explanation.summary = `${metric.charAt(0).toUpperCase() + metric.slice(1)} shows a positive trend with ${trendChange.toFixed(1)}% growth over the last 7 days.`;
    explanation.forecast = 'If this trend continues, expect further improvements in the coming weeks.';
  } else if (explanation.trend === 'decreasing') {
    explanation.summary = `${metric.charAt(0).toUpperCase() + metric.slice(1)} shows a concerning downward trend with ${Math.abs(trendChange).toFixed(1)}% decline.`;
    explanation.forecast = 'Immediate action is needed to reverse this trend.';
  } else {
    explanation.summary = `${metric.charAt(0).toUpperCase() + metric.slice(1)} remains stable with minimal variation.`;
    explanation.forecast = 'Expect continued stability in the near term.';
  }

  // Detect patterns
  const patterns = [];

  // Volatility pattern
  const stdDev = Math.sqrt(recent.reduce((sum, v) => sum + Math.pow(v - recentAvg, 2), 0) / recent.length);
  const cv = recentAvg > 0 ? (stdDev / recentAvg) * 100 : 0;

  if (cv > 30) {
    patterns.push({
      type: 'high_volatility',
      description: 'High day-to-day variation indicates inconsistent performance',
      recommendation: 'Investigate causes of volatility and work to stabilize operations'
    });
  } else if (cv < 10) {
    patterns.push({
      type: 'consistency',
      description: 'Very consistent performance with minimal variation',
      recommendation: 'Maintain current operational standards'
    });
  }

  // Weekly pattern detection
  if (historicalData.length >= 14) {
    const weekdayValues = [];
    const weekendValues = [];

    historicalData.slice(-14).forEach(d => {
      const date = new Date(d.date);
      const day = date.getDay();
      if (day === 0 || day === 6) {
        weekendValues.push(d[metric] || 0);
      } else {
        weekdayValues.push(d[metric] || 0);
      }
    });

    if (weekdayValues.length > 0 && weekendValues.length > 0) {
      const weekdayAvg = weekdayValues.reduce((sum, v) => sum + v, 0) / weekdayValues.length;
      const weekendAvg = weekendValues.reduce((sum, v) => sum + v, 0) / weekendValues.length;

      if (weekendAvg > weekdayAvg * 1.2) {
        patterns.push({
          type: 'weekend_peak',
          description: 'Weekend performance is significantly higher than weekdays',
          recommendation: 'Optimize weekend operations and consider extending hours'
        });
      } else if (weekdayAvg > weekendAvg * 1.2) {
        patterns.push({
          type: 'weekday_peak',
          description: 'Weekday performance is significantly higher than weekends',
          recommendation: 'Focus on weekend promotions to balance weekly performance'
        });
      }
    }
  }

  // Momentum pattern
  const lastThree = values.slice(-3);
  const allIncreasing = lastThree.every((v, i) => i === 0 || v > lastThree[i - 1]);
  const allDecreasing = lastThree.every((v, i) => i === 0 || v < lastThree[i - 1]);

  if (allIncreasing) {
    patterns.push({
      type: 'positive_momentum',
      description: 'Consistent upward movement over the last 3 days',
      recommendation: 'Capitalize on this momentum with targeted campaigns'
    });
  } else if (allDecreasing) {
    patterns.push({
      type: 'negative_momentum',
      description: 'Consistent downward movement over the last 3 days',
      recommendation: 'Take immediate action to stop the decline'
    });
  }

  explanation.patterns = patterns;

  return explanation;
}

/**
 * Explain anomalies in data
 */
export function explainAnomaly(anomaly, historicalData) {
  const explanation = {
    type: anomaly.type,
    date: anomaly.date,
    severity: anomaly.severity,
    summary: '',
    possibleCauses: [],
    impact: '',
    recommendations: []
  };

  const values = historicalData.map(d => d.value || d.revenue || 0);
  const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length;

  if (anomaly.type === 'spike') {
    explanation.summary = `Unusual spike detected: value was ${anomaly.value.toFixed(2)}, which is ${((anomaly.value / avgValue - 1) * 100).toFixed(1)}% above normal.`;
    explanation.possibleCauses = [
      'Successful promotional campaign or special event',
      'Seasonal spike or holiday impact',
      'One-time large order or bulk purchase',
      'Data entry error (verify accuracy)'
    ];
    explanation.impact = 'Positive if driven by genuine business growth; investigate if unexpected.';
    explanation.recommendations = [
      'Verify data accuracy to rule out errors',
      'Identify what drove the spike to replicate success',
      'Monitor if this becomes a sustained trend'
    ];
  } else if (anomaly.type === 'drop') {
    explanation.summary = `Unusual drop detected: value was ${anomaly.value.toFixed(2)}, which is ${((1 - anomaly.value / avgValue) * 100).toFixed(1)}% below normal.`;
    explanation.possibleCauses = [
      'Operational issues or temporary closure',
      'Technical problems with ordering system',
      'Competitive pressure or market changes',
      'Seasonal low or external events affecting traffic'
    ];
    explanation.impact = 'Negative impact on revenue and performance metrics.';
    explanation.recommendations = [
      'Investigate operational issues immediately',
      'Check for system or technical problems',
      'Review competitive landscape and market conditions',
      'Implement recovery plan if trend continues'
    ];
  }

  return explanation;
}

/**
 * Explain branch performance comparison
 */
export function explainBranchComparison(branch, allBranches) {
  const avgRevenue = allBranches.reduce((sum, b) => sum + (b.revenue || 0), 0) / allBranches.length;
  const branchRevenue = branch.revenue || 0;
  const deviation = branchRevenue - avgRevenue;
  const deviationPercent = avgRevenue > 0 ? (deviation / avgRevenue) * 100 : 0;

  const rank = allBranches
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .findIndex(b => b.id === branch.id) + 1;

  const explanation = {
    branchName: branch.name,
    rank,
    totalBranches: allBranches.length,
    performance: deviationPercent > 10 ? 'above_average' : deviationPercent < -10 ? 'below_average' : 'average',
    summary: '',
    strengths: [],
    weaknesses: [],
    recommendations: []
  };

  if (explanation.performance === 'above_average') {
    explanation.summary = `${branch.name} ranks #${rank} out of ${allBranches.length} branches, performing ${deviationPercent.toFixed(1)}% above average.`;
    explanation.strengths = [
      'Higher than average revenue generation',
      'Effective operational execution',
      'Strong local market presence'
    ];
    explanation.recommendations = [
      'Document best practices for other branches',
      'Share successful strategies across the organization',
      'Maintain current performance standards'
    ];
  } else if (explanation.performance === 'below_average') {
    explanation.summary = `${branch.name} ranks #${rank} out of ${allBranches.length} branches, performing ${Math.abs(deviationPercent).toFixed(1)}% below average.`;
    explanation.weaknesses = [
      'Lower than average revenue generation',
      'Potential operational challenges',
      'May need additional support and resources'
    ];
    explanation.recommendations = [
      'Conduct detailed operational review',
      'Provide additional training and support',
      'Analyze successful branches for improvement strategies',
      'Consider local market factors and adjust approach'
    ];
  } else {
    explanation.summary = `${branch.name} ranks #${rank} out of ${allBranches.length} branches with average performance.`;
    explanation.recommendations = [
      'Identify opportunities for improvement',
      'Learn from top-performing branches',
      'Maintain consistency while seeking growth'
    ];
  }

  return explanation;
}

/**
 * Generate comprehensive performance explanation
 */
export function generatePerformanceExplanation(currentPeriod, previousPeriod, options = {}) {
  const { metric = 'revenue', context = {} } = options;

  const revenueExplanation = currentPeriod.revenue && previousPeriod.revenue
    ? explainRevenueChange(currentPeriod, previousPeriod, context)
    : null;

  const explanation = {
    period: {
      current: currentPeriod.date || 'Current',
      previous: previousPeriod.date || 'Previous'
    },
    revenueExplanation,
    summary: '',
    keyInsights: [],
    actionItems: []
  };

  // Build overall summary
  if (revenueExplanation) {
    explanation.summary = revenueExplanation.summary;

    // Extract key insights
    revenueExplanation.factors.slice(0, 3).forEach(factor => {
      explanation.keyInsights.push({
        type: factor.impact === 'positive' ? 'success' : 'concern',
        message: factor.description
      });
    });

    // Add action items
    explanation.actionItems = revenueExplanation.recommendations;
  }

  return explanation;
}
