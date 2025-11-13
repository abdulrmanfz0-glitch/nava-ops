/**
 * AI Intelligence Layer - Anomaly Detection System
 * Detects unusual patterns in data using statistical methods
 */

/**
 * Calculate statistical measures
 */
function calculateStats(data) {
  if (!data || data.length === 0) {
    return { mean: 0, stdDev: 0, median: 0, q1: 0, q3: 0 };
  }

  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;

  // Mean
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;

  // Standard deviation
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Median
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];

  // Quartiles
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];

  return { mean, stdDev, median, q1, q3, min: sorted[0], max: sorted[n - 1] };
}

/**
 * Detect outliers using IQR method
 */
function detectOutliersIQR(data, multiplier = 1.5) {
  const stats = calculateStats(data);
  const iqr = stats.q3 - stats.q1;
  const lowerBound = stats.q1 - multiplier * iqr;
  const upperBound = stats.q3 + multiplier * iqr;

  return data.map((value, index) => ({
    index,
    value,
    isOutlier: value < lowerBound || value > upperBound,
    severity: Math.abs(value - stats.median) / (stats.stdDev || 1)
  }));
}

/**
 * Detect outliers using Z-score method
 */
function detectOutliersZScore(data, threshold = 2.5) {
  const stats = calculateStats(data);

  return data.map((value, index) => {
    const zScore = stats.stdDev > 0 ? Math.abs(value - stats.mean) / stats.stdDev : 0;
    return {
      index,
      value,
      zScore,
      isOutlier: zScore > threshold,
      severity: zScore
    };
  });
}

/**
 * Detect revenue anomalies
 */
export function detectRevenueAnomalies(revenueData, options = {}) {
  const { threshold = 2.5, method = 'zscore' } = options;

  if (!revenueData || revenueData.length < 7) {
    return {
      anomalies: [],
      summary: { total: 0, critical: 0, warning: 0 }
    };
  }

  const values = revenueData.map(d => d.revenue || d.value || 0);
  const outliers = method === 'iqr'
    ? detectOutliersIQR(values)
    : detectOutliersZScore(values, threshold);

  const anomalies = outliers
    .filter(o => o.isOutlier)
    .map(o => ({
      date: revenueData[o.index]?.date,
      value: o.value,
      expected: calculateStats(values).mean,
      deviation: o.severity,
      severity: o.severity > 3 ? 'critical' : o.severity > 2 ? 'warning' : 'info',
      type: o.value > calculateStats(values).mean ? 'spike' : 'drop',
      confidence: Math.min(100, o.severity * 30)
    }));

  return {
    anomalies,
    summary: {
      total: anomalies.length,
      critical: anomalies.filter(a => a.severity === 'critical').length,
      warning: anomalies.filter(a => a.severity === 'warning').length
    },
    stats: calculateStats(values)
  };
}

/**
 * Detect performance anomalies (orders, customers, etc.)
 */
export function detectPerformanceAnomalies(performanceData, metric = 'orders') {
  if (!performanceData || performanceData.length < 7) {
    return { anomalies: [], summary: { total: 0 } };
  }

  const values = performanceData.map(d => d[metric] || 0);
  const stats = calculateStats(values);
  const outliers = detectOutliersZScore(values, 2.0);

  const anomalies = outliers
    .filter(o => o.isOutlier)
    .map(o => ({
      date: performanceData[o.index]?.date,
      metric,
      value: o.value,
      expected: stats.mean,
      deviation: ((o.value - stats.mean) / stats.mean) * 100,
      type: o.value > stats.mean ? 'unusually_high' : 'unusually_low',
      severity: o.severity > 3 ? 'critical' : 'warning'
    }));

  return {
    anomalies,
    summary: {
      total: anomalies.length,
      avgDeviation: anomalies.reduce((sum, a) => sum + Math.abs(a.deviation), 0) / (anomalies.length || 1)
    }
  };
}

/**
 * Detect activity anomalies (unusual patterns in daily operations)
 */
export function detectActivityAnomalies(activityData) {
  if (!activityData || activityData.length < 14) {
    return { anomalies: [], patterns: [] };
  }

  const anomalies = [];
  const patterns = [];

  // Check for unusual time gaps
  for (let i = 1; i < activityData.length; i++) {
    const current = new Date(activityData[i].timestamp);
    const previous = new Date(activityData[i - 1].timestamp);
    const hoursDiff = (current - previous) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      anomalies.push({
        type: 'inactivity_gap',
        startDate: activityData[i - 1].timestamp,
        endDate: activityData[i].timestamp,
        duration: hoursDiff,
        severity: hoursDiff > 72 ? 'critical' : 'warning'
      });
    }
  }

  // Detect unusual activity volume patterns
  const dailyVolumes = {};
  activityData.forEach(activity => {
    const date = new Date(activity.timestamp).toDateString();
    dailyVolumes[date] = (dailyVolumes[date] || 0) + 1;
  });

  const volumes = Object.values(dailyVolumes);
  const stats = calculateStats(volumes);

  Object.entries(dailyVolumes).forEach(([date, volume]) => {
    if (volume > stats.mean + stats.stdDev * 2) {
      anomalies.push({
        type: 'high_activity',
        date,
        volume,
        expected: stats.mean,
        severity: 'info'
      });
    } else if (volume < stats.mean - stats.stdDev * 2 && volume > 0) {
      anomalies.push({
        type: 'low_activity',
        date,
        volume,
        expected: stats.mean,
        severity: 'warning'
      });
    }
  });

  // Detect day-of-week patterns
  const dayOfWeekVolumes = Array(7).fill(0);
  activityData.forEach(activity => {
    const day = new Date(activity.timestamp).getDay();
    dayOfWeekVolumes[day]++;
  });

  const avgVolume = dayOfWeekVolumes.reduce((sum, v) => sum + v, 0) / 7;
  dayOfWeekVolumes.forEach((volume, day) => {
    if (volume < avgVolume * 0.5) {
      patterns.push({
        type: 'low_day_pattern',
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
        volume,
        avgVolume
      });
    }
  });

  return { anomalies, patterns };
}

/**
 * Detect category anomalies
 */
export function detectCategoryAnomalies(categoryData) {
  if (!categoryData || categoryData.length === 0) {
    return { anomalies: [], insights: [] };
  }

  const anomalies = [];
  const insights = [];

  // Check for categories with unusual performance
  const revenues = categoryData.map(c => c.revenue || 0).filter(r => r > 0);
  const stats = calculateStats(revenues);

  categoryData.forEach(category => {
    const revenue = category.revenue || 0;

    if (revenue > stats.mean + stats.stdDev * 2) {
      anomalies.push({
        categoryId: category.id,
        categoryName: category.name,
        type: 'outperforming',
        revenue,
        expected: stats.mean,
        deviation: ((revenue - stats.mean) / stats.mean) * 100,
        severity: 'positive'
      });
    } else if (revenue > 0 && revenue < stats.mean - stats.stdDev * 2) {
      anomalies.push({
        categoryId: category.id,
        categoryName: category.name,
        type: 'underperforming',
        revenue,
        expected: stats.mean,
        deviation: ((revenue - stats.mean) / stats.mean) * 100,
        severity: 'warning'
      });
    }

    // Check for conversion rate anomalies
    if (category.views > 0) {
      const conversionRate = ((category.orders || 0) / category.views) * 100;
      if (conversionRate < 1 && category.views > 100) {
        insights.push({
          categoryId: category.id,
          categoryName: category.name,
          type: 'low_conversion',
          conversionRate,
          views: category.views,
          orders: category.orders || 0
        });
      }
    }
  });

  return { anomalies, insights };
}

/**
 * Detect branch-specific anomalies
 */
export function detectBranchAnomalies(branchData) {
  if (!branchData || !branchData.history || branchData.history.length < 7) {
    return { anomalies: [], score: 100 };
  }

  const anomalies = [];
  const history = branchData.history;

  // Revenue anomalies
  const revenues = history.map(h => h.revenue || 0);
  const revenueOutliers = detectOutliersZScore(revenues, 2.0);

  revenueOutliers.forEach((outlier, index) => {
    if (outlier.isOutlier) {
      anomalies.push({
        type: 'revenue',
        date: history[index]?.date,
        value: outlier.value,
        severity: outlier.severity > 3 ? 'critical' : 'warning',
        impact: 'high'
      });
    }
  });

  // Order pattern anomalies
  const orders = history.map(h => h.orders || 0);
  const orderStats = calculateStats(orders);

  history.forEach((day, index) => {
    if (day.orders < orderStats.mean * 0.5 && orderStats.mean > 10) {
      anomalies.push({
        type: 'low_orders',
        date: day.date,
        value: day.orders,
        expected: orderStats.mean,
        severity: 'warning',
        impact: 'medium'
      });
    }
  });

  // Calculate anomaly score (100 = perfect, 0 = many anomalies)
  const anomalyScore = Math.max(0, 100 - anomalies.length * 10);

  return {
    anomalies,
    score: anomalyScore,
    totalAnomalies: anomalies.length
  };
}

/**
 * Comprehensive anomaly detection across all data
 */
export function detectAllAnomalies(allData) {
  const results = {
    revenue: null,
    performance: null,
    activity: null,
    categories: null,
    branches: null,
    summary: { total: 0, critical: 0, warning: 0 },
    timestamp: new Date().toISOString()
  };

  if (allData.revenue) {
    results.revenue = detectRevenueAnomalies(allData.revenue);
    results.summary.total += results.revenue.summary.total;
    results.summary.critical += results.revenue.summary.critical;
    results.summary.warning += results.revenue.summary.warning;
  }

  if (allData.orders) {
    results.performance = detectPerformanceAnomalies(allData.orders, 'orders');
    results.summary.total += results.performance.summary.total;
  }

  if (allData.activity) {
    results.activity = detectActivityAnomalies(allData.activity);
    results.summary.total += results.activity.anomalies.length;
  }

  if (allData.categories) {
    results.categories = detectCategoryAnomalies(allData.categories);
    results.summary.total += results.categories.anomalies.length;
  }

  if (allData.branches) {
    results.branches = allData.branches.map(branch => detectBranchAnomalies(branch));
    results.branches.forEach(b => {
      results.summary.total += b.totalAnomalies;
    });
  }

  return results;
}
