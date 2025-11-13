/**
 * AI Intelligence Layer - Predictions Engine
 * Handles trend analysis, revenue forecasting, performance predictions, and cost predictions
 */

/**
 * Calculate linear regression for trend analysis
 */
function linearRegression(data) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = data.reduce((sum, val, i) => sum + i * val, 0);
  const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);
  const sumY2 = data.reduce((sum, val) => sum + val * val, 0);

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
 * Calculate exponential smoothing for more recent data emphasis
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
 * Calculate moving average
 */
function movingAverage(data, window = 7) {
  if (data.length < window) return data;

  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((sum, val) => sum + val, 0) / subset.length;
    result.push(avg);
  }
  return result;
}

/**
 * Detect seasonality patterns
 */
function detectSeasonality(data, period = 7) {
  if (data.length < period * 2) return null;

  const seasonalFactors = [];
  for (let i = 0; i < period; i++) {
    const values = [];
    for (let j = i; j < data.length; j += period) {
      values.push(data[j]);
    }
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    seasonalFactors.push(avg);
  }

  const overallAvg = seasonalFactors.reduce((sum, val) => sum + val, 0) / seasonalFactors.length;
  return seasonalFactors.map(factor => factor / overallAvg);
}

/**
 * Predict revenue trends with confidence intervals
 */
export function predictRevenueTrend(historicalData, daysAhead = 30) {
  if (!historicalData || historicalData.length < 7) {
    return {
      predictions: [],
      trend: 'insufficient_data',
      confidence: 0,
      changePercent: 0
    };
  }

  const values = historicalData.map(d => d.revenue || d.value || 0);
  const regression = linearRegression(values);
  const smoothed = exponentialSmoothing(values);
  const seasonal = detectSeasonality(values, 7);

  const predictions = [];
  const currentValue = values[values.length - 1];
  const baseIndex = values.length;

  for (let i = 1; i <= daysAhead; i++) {
    const trendValue = regression.slope * (baseIndex + i) + regression.intercept;
    const seasonalIndex = seasonal ? seasonal[(baseIndex + i) % seasonal.length] : 1;
    const predicted = trendValue * seasonalIndex;

    // Add confidence interval based on R-squared
    const variance = Math.abs(predicted * (1 - regression.r2) * 0.2);

    predictions.push({
      day: i,
      value: Math.max(0, predicted),
      upperBound: predicted + variance,
      lowerBound: Math.max(0, predicted - variance),
      confidence: regression.r2 * 100
    });
  }

  const predictedAvg = predictions.slice(0, 7).reduce((sum, p) => sum + p.value, 0) / 7;
  const changePercent = currentValue > 0 ? ((predictedAvg - currentValue) / currentValue) * 100 : 0;

  let trend = 'stable';
  if (changePercent > 5) trend = 'increasing';
  else if (changePercent < -5) trend = 'decreasing';

  return {
    predictions,
    trend,
    confidence: regression.r2 * 100,
    changePercent,
    currentValue,
    predictedValue: predictedAvg
  };
}

/**
 * Predict performance metrics (orders, customers, etc.)
 */
export function predictPerformance(historicalData, metric = 'orders', daysAhead = 30) {
  if (!historicalData || historicalData.length < 7) {
    return {
      predictions: [],
      trend: 'insufficient_data',
      confidence: 0
    };
  }

  const values = historicalData.map(d => d[metric] || 0);
  const regression = linearRegression(values);
  const ma = movingAverage(values, 7);

  const predictions = [];
  const baseIndex = values.length;

  for (let i = 1; i <= daysAhead; i++) {
    const trendValue = regression.slope * (baseIndex + i) + regression.intercept;
    const predicted = Math.max(0, trendValue);

    predictions.push({
      day: i,
      value: Math.round(predicted),
      trend: regression.slope > 0 ? 'up' : regression.slope < 0 ? 'down' : 'stable'
    });
  }

  return {
    predictions,
    trend: regression.slope > 0 ? 'increasing' : regression.slope < 0 ? 'decreasing' : 'stable',
    confidence: regression.r2 * 100,
    slope: regression.slope,
    movingAverage: ma[ma.length - 1]
  };
}

/**
 * Predict cost trends and identify potential savings
 */
export function predictCostTrend(historicalCosts, daysAhead = 30) {
  if (!historicalCosts || historicalCosts.length < 7) {
    return {
      predictions: [],
      trend: 'insufficient_data',
      potentialSavings: 0
    };
  }

  const values = historicalCosts.map(d => d.cost || d.value || 0);
  const regression = linearRegression(values);

  const predictions = [];
  const baseIndex = values.length;
  const currentCost = values[values.length - 1];

  for (let i = 1; i <= daysAhead; i++) {
    const predicted = regression.slope * (baseIndex + i) + regression.intercept;
    predictions.push({
      day: i,
      value: Math.max(0, predicted),
      variance: Math.abs(predicted * 0.1)
    });
  }

  const projectedCost = predictions[predictions.length - 1].value;
  const costIncrease = projectedCost - currentCost;

  // Calculate potential savings based on efficiency improvements
  const potentialSavings = costIncrease > 0 ? costIncrease * 0.15 : currentCost * 0.05;

  return {
    predictions,
    trend: regression.slope > 0 ? 'increasing' : regression.slope < 0 ? 'decreasing' : 'stable',
    currentCost,
    projectedCost,
    potentialSavings,
    confidence: regression.r2 * 100
  };
}

/**
 * Predict category performance
 */
export function predictCategoryPerformance(categoryData, daysAhead = 30) {
  if (!categoryData || categoryData.length === 0) {
    return [];
  }

  return categoryData.map(category => {
    const historicalSales = category.history || [];
    const values = historicalSales.map(h => h.sales || 0);

    if (values.length < 3) {
      return {
        ...category,
        prediction: {
          trend: 'insufficient_data',
          confidence: 0
        }
      };
    }

    const regression = linearRegression(values);
    const currentSales = values[values.length - 1];
    const predictedSales = regression.slope * (values.length + daysAhead) + regression.intercept;
    const change = currentSales > 0 ? ((predictedSales - currentSales) / currentSales) * 100 : 0;

    return {
      ...category,
      prediction: {
        trend: regression.slope > 0 ? 'growing' : regression.slope < 0 ? 'declining' : 'stable',
        currentSales,
        predictedSales: Math.max(0, predictedSales),
        changePercent: change,
        confidence: regression.r2 * 100
      }
    };
  });
}

/**
 * Predict branch-specific performance
 */
export function predictBranchPerformance(branchData, daysAhead = 30) {
  if (!branchData) return null;

  const metrics = ['revenue', 'orders', 'customers'];
  const predictions = {};

  metrics.forEach(metric => {
    const history = branchData.history || [];
    const values = history.map(h => h[metric] || 0);

    if (values.length >= 7) {
      const regression = linearRegression(values);
      const baseIndex = values.length;
      const predicted = regression.slope * (baseIndex + daysAhead) + regression.intercept;

      predictions[metric] = {
        current: values[values.length - 1],
        predicted: Math.max(0, predicted),
        trend: regression.slope > 0 ? 'up' : regression.slope < 0 ? 'down' : 'stable',
        confidence: regression.r2 * 100
      };
    }
  });

  return {
    branchId: branchData.id,
    branchName: branchData.name,
    predictions,
    overallTrend: predictions.revenue?.trend || 'stable'
  };
}

/**
 * Generate comprehensive prediction summary
 */
export function generatePredictionSummary(allData) {
  const summary = {
    revenue: null,
    performance: null,
    costs: null,
    categories: null,
    timestamp: new Date().toISOString()
  };

  if (allData.revenue) {
    summary.revenue = predictRevenueTrend(allData.revenue, 30);
  }

  if (allData.orders) {
    summary.performance = predictPerformance(allData.orders, 'orders', 30);
  }

  if (allData.costs) {
    summary.costs = predictCostTrend(allData.costs, 30);
  }

  if (allData.categories) {
    summary.categories = predictCategoryPerformance(allData.categories, 30);
  }

  return summary;
}
