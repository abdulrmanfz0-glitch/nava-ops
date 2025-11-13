/**
 * AI Intelligence Layer - Forecasting System
 * Generates forecasts for 30/60/90 days using time series analysis
 */

/**
 * Calculate linear regression parameters
 */
function linearRegression(data) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = data.reduce((sum, val, i) => sum + i * val, 0);
  const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = data.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssResidual = data.reduce((sum, val, i) => {
    const predicted = slope * i + intercept;
    return sum + Math.pow(val - predicted, 2);
  }, 0);
  const r2 = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  return { slope, intercept, r2: Math.max(0, r2) };
}

/**
 * Calculate exponential smoothing
 */
function exponentialSmoothing(data, alpha = 0.3) {
  if (data.length === 0) return [];

  const smoothed = [data[0]];
  for (let i = 1; i < data.length; i++) {
    smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
  }
  return smoothed;
}

/**
 * Detect and calculate seasonal patterns
 */
function calculateSeasonality(data, period = 7) {
  if (data.length < period * 2) {
    return Array(period).fill(1);
  }

  const seasonalFactors = [];
  for (let i = 0; i < period; i++) {
    const values = [];
    for (let j = i; j < data.length; j += period) {
      if (data[j] !== undefined && data[j] !== null) {
        values.push(data[j]);
      }
    }
    const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 1;
    seasonalFactors.push(avg);
  }

  const overallAvg = seasonalFactors.reduce((sum, val) => sum + val, 0) / seasonalFactors.length;
  return seasonalFactors.map(factor => overallAvg > 0 ? factor / overallAvg : 1);
}

/**
 * Generate forecast for specified number of days
 */
export function generateForecast(historicalData, metric = 'revenue', options = {}) {
  const {
    days = 30,
    includeSeasonality = true,
    confidenceLevel = 0.95
  } = options;

  if (!historicalData || historicalData.length < 14) {
    return {
      forecast: [],
      confidence: 0,
      method: 'insufficient_data',
      summary: {
        totalProjected: 0,
        averageDaily: 0,
        trend: 'unknown'
      }
    };
  }

  const values = historicalData.map(d => d[metric] || 0);
  const regression = linearRegression(values);
  const smoothed = exponentialSmoothing(values, 0.3);
  const seasonal = includeSeasonality ? calculateSeasonality(values, 7) : null;

  const forecast = [];
  const baseIndex = values.length;
  const lastValue = values[values.length - 1];

  // Calculate standard error for confidence intervals
  const predictions = values.map((_, i) => regression.slope * i + regression.intercept);
  const errors = values.map((val, i) => val - predictions[i]);
  const mse = errors.reduce((sum, err) => sum + err * err, 0) / values.length;
  const standardError = Math.sqrt(mse);

  for (let i = 1; i <= days; i++) {
    const index = baseIndex + i;

    // Base trend prediction
    const trendValue = regression.slope * index + regression.intercept;

    // Apply exponential smoothing influence
    const smoothedValue = smoothed[smoothed.length - 1] + regression.slope * i;

    // Combine trend and smoothing
    let predicted = (trendValue * 0.6 + smoothedValue * 0.4);

    // Apply seasonality
    if (seasonal) {
      const seasonalIndex = index % seasonal.length;
      predicted *= seasonal[seasonalIndex];
    }

    // Ensure non-negative
    predicted = Math.max(0, predicted);

    // Calculate confidence intervals (using t-distribution approximation)
    const marginOfError = 1.96 * standardError * Math.sqrt(1 + 1/values.length); // 95% CI
    const upperBound = predicted + marginOfError;
    const lowerBound = Math.max(0, predicted - marginOfError);

    forecast.push({
      day: i,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: predicted,
      upperBound,
      lowerBound,
      confidence: regression.r2 * 100
    });
  }

  const totalProjected = forecast.reduce((sum, f) => sum + f.value, 0);
  const averageDaily = totalProjected / days;

  return {
    forecast,
    confidence: regression.r2 * 100,
    method: seasonal ? 'trend_seasonal' : 'trend_only',
    summary: {
      totalProjected,
      averageDaily,
      trend: regression.slope > 0 ? 'increasing' : regression.slope < 0 ? 'decreasing' : 'stable',
      growthRate: lastValue > 0 ? ((averageDaily - lastValue) / lastValue) * 100 : 0
    }
  };
}

/**
 * Generate multi-period forecast (30/60/90 days)
 */
export function generateMultiPeriodForecast(historicalData, metric = 'revenue') {
  const periods = [
    { days: 30, label: '30-Day Forecast' },
    { days: 60, label: '60-Day Forecast' },
    { days: 90, label: '90-Day Forecast' }
  ];

  const forecasts = {};

  periods.forEach(period => {
    const forecast = generateForecast(historicalData, metric, { days: period.days });

    forecasts[`period_${period.days}`] = {
      label: period.label,
      days: period.days,
      ...forecast,
      milestones: generateMilestones(forecast.forecast, period.days)
    };
  });

  return {
    forecasts,
    metric,
    generatedAt: new Date().toISOString(),
    dataPoints: historicalData.length
  };
}

/**
 * Generate milestones for forecast period
 */
function generateMilestones(forecast, days) {
  const milestones = [];

  // Weekly milestones
  for (let week = 1; week <= Math.floor(days / 7); week++) {
    const weekEnd = Math.min(week * 7, days);
    const weekStart = (week - 1) * 7 + 1;
    const weekData = forecast.slice(weekStart - 1, weekEnd);
    const weekTotal = weekData.reduce((sum, f) => sum + f.value, 0);

    milestones.push({
      type: 'week',
      period: week,
      label: `Week ${week}`,
      endDay: weekEnd,
      total: weekTotal,
      average: weekTotal / weekData.length
    });
  }

  // Monthly milestones
  if (days >= 30) {
    const monthlyMilestones = [30, 60, 90].filter(d => d <= days);
    monthlyMilestones.forEach(day => {
      const monthData = forecast.slice(0, day);
      const monthTotal = monthData.reduce((sum, f) => sum + f.value, 0);

      milestones.push({
        type: 'month',
        period: day / 30,
        label: `${day} Days`,
        endDay: day,
        total: monthTotal,
        average: monthTotal / day
      });
    });
  }

  return milestones;
}

/**
 * Generate revenue forecast with breakdown
 */
export function generateRevenueForecast(historicalData, options = {}) {
  const forecast = generateMultiPeriodForecast(historicalData, 'revenue');

  // Add additional revenue-specific insights
  const currentRevenue = historicalData[historicalData.length - 1]?.revenue || 0;

  Object.values(forecast.forecasts).forEach(period => {
    const projectedRevenue = period.summary.totalProjected;
    const currentPeriodRevenue = currentRevenue * period.days;

    period.comparison = {
      currentRate: currentRevenue,
      projectedTotal: projectedRevenue,
      currentRateTotal: currentPeriodRevenue,
      difference: projectedRevenue - currentPeriodRevenue,
      differencePercent: currentPeriodRevenue > 0
        ? ((projectedRevenue - currentPeriodRevenue) / currentPeriodRevenue) * 100
        : 0
    };
  });

  return forecast;
}

/**
 * Generate order volume forecast
 */
export function generateOrdersForecast(historicalData, options = {}) {
  return generateMultiPeriodForecast(historicalData, 'orders');
}

/**
 * Generate customer forecast
 */
export function generateCustomerForecast(historicalData, options = {}) {
  return generateMultiPeriodForecast(historicalData, 'customers');
}

/**
 * Generate comprehensive forecast summary
 */
export function generateForecastSummary(historicalData) {
  const summary = {
    revenue: null,
    orders: null,
    customers: null,
    insights: [],
    timestamp: new Date().toISOString()
  };

  // Revenue forecast
  if (historicalData.revenue) {
    summary.revenue = generateRevenueForecast(historicalData.revenue);

    const revenue30 = summary.revenue.forecasts.period_30;
    if (revenue30.summary.growthRate > 10) {
      summary.insights.push({
        type: 'opportunity',
        message: `Revenue projected to grow ${revenue30.summary.growthRate.toFixed(1)}% over next 30 days`,
        impact: 'high'
      });
    } else if (revenue30.summary.growthRate < -10) {
      summary.insights.push({
        type: 'warning',
        message: `Revenue projected to decline ${Math.abs(revenue30.summary.growthRate).toFixed(1)}% over next 30 days`,
        impact: 'high'
      });
    }
  }

  // Orders forecast
  if (historicalData.orders) {
    summary.orders = generateOrdersForecast(historicalData.orders);
  }

  // Customers forecast
  if (historicalData.customers) {
    summary.customers = generateCustomerForecast(historicalData.customers);
  }

  return summary;
}

/**
 * Generate forecast comparison (actual vs forecast)
 */
export function compareForecastToActual(forecastData, actualData) {
  if (!forecastData || !actualData || actualData.length === 0) {
    return { accuracy: 0, insights: [] };
  }

  const comparisons = [];
  let totalError = 0;

  actualData.forEach((actual, index) => {
    if (index < forecastData.length) {
      const forecast = forecastData[index];
      const error = Math.abs(actual.value - forecast.value);
      const percentError = actual.value > 0 ? (error / actual.value) * 100 : 0;

      comparisons.push({
        day: index + 1,
        actual: actual.value,
        forecast: forecast.value,
        error,
        percentError,
        withinConfidence: actual.value >= forecast.lowerBound && actual.value <= forecast.upperBound
      });

      totalError += percentError;
    }
  });

  const avgPercentError = comparisons.length > 0 ? totalError / comparisons.length : 0;
  const accuracy = Math.max(0, 100 - avgPercentError);
  const withinConfidenceCount = comparisons.filter(c => c.withinConfidence).length;
  const confidenceAccuracy = comparisons.length > 0
    ? (withinConfidenceCount / comparisons.length) * 100
    : 0;

  return {
    accuracy,
    confidenceAccuracy,
    avgPercentError,
    comparisons,
    insights: [
      {
        type: accuracy > 80 ? 'success' : accuracy > 60 ? 'info' : 'warning',
        message: `Forecast accuracy: ${accuracy.toFixed(1)}%`
      },
      {
        type: 'info',
        message: `${withinConfidenceCount} of ${comparisons.length} actual values within confidence intervals`
      }
    ]
  };
}
