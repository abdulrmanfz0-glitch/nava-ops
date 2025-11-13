/**
 * AI Intelligence Layer - Data Scoring and Benchmarking
 * Scores and benchmarks business performance against industry standards
 */

/**
 * Industry benchmarks (can be customized or fetched from external sources)
 */
const INDUSTRY_BENCHMARKS = {
  restaurant: {
    avgOrderValue: 35,
    repeatCustomerRate: 35,
    profitMargin: 15,
    costToRevenueRatio: 30,
    customerSatisfaction: 4.2,
    orderFulfillmentRate: 95,
    revenueGrowthRate: 10
  },
  retail: {
    avgOrderValue: 50,
    repeatCustomerRate: 40,
    profitMargin: 20,
    costToRevenueRatio: 25,
    customerSatisfaction: 4.0,
    orderFulfillmentRate: 98,
    revenueGrowthRate: 12
  },
  default: {
    avgOrderValue: 40,
    repeatCustomerRate: 35,
    profitMargin: 18,
    costToRevenueRatio: 28,
    customerSatisfaction: 4.1,
    orderFulfillmentRate: 96,
    revenueGrowthRate: 11
  }
};

/**
 * Calculate performance score (0-100)
 */
function calculateScore(actual, benchmark, higherIsBetter = true) {
  if (benchmark === 0) return 50;

  const ratio = actual / benchmark;

  if (higherIsBetter) {
    // For metrics where higher is better
    if (ratio >= 1.2) return 100; // 20% above benchmark
    if (ratio >= 1.0) return 80 + (ratio - 1.0) * 100; // 80-100
    if (ratio >= 0.8) return 60 + (ratio - 0.8) * 100; // 60-80
    if (ratio >= 0.6) return 40 + (ratio - 0.6) * 100; // 40-60
    return Math.max(0, ratio * 66.67); // 0-40
  } else {
    // For metrics where lower is better (e.g., costs)
    if (ratio <= 0.8) return 100; // 20% below benchmark
    if (ratio <= 1.0) return 80 + (1.0 - ratio) * 100; // 80-100
    if (ratio <= 1.2) return 60 + (1.2 - ratio) * 100; // 60-80
    if (ratio <= 1.4) return 40 + (1.4 - ratio) * 100; // 40-60
    return Math.max(0, (2.0 - ratio) * 40); // 0-40
  }
}

/**
 * Score revenue performance
 */
export function scoreRevenuePerformance(data, industry = 'default') {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default;

  if (!data || !data.history || data.history.length < 7) {
    return {
      score: 0,
      grade: 'N/A',
      metrics: {},
      insights: ['Insufficient data for revenue scoring']
    };
  }

  const recent = data.history.slice(-7);
  const previous = data.history.slice(-14, -7);

  const recentRevenue = recent.reduce((sum, d) => sum + (d.revenue || 0), 0) / 7;
  const previousRevenue = previous.length > 0
    ? previous.reduce((sum, d) => sum + (d.revenue || 0), 0) / previous.length
    : recentRevenue;

  const growthRate = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Calculate component scores
  const growthScore = calculateScore(growthRate, benchmark.revenueGrowthRate, true);

  const metrics = {
    revenueGrowth: {
      value: growthRate,
      benchmark: benchmark.revenueGrowthRate,
      score: growthScore,
      status: growthScore >= 70 ? 'good' : growthScore >= 50 ? 'fair' : 'poor'
    }
  };

  const overallScore = growthScore;

  return {
    score: Math.round(overallScore),
    grade: getGrade(overallScore),
    metrics,
    insights: generateRevenueInsights(metrics, benchmark)
  };
}

/**
 * Score operational performance
 */
export function scoreOperationalPerformance(data, industry = 'default') {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default;

  if (!data) {
    return {
      score: 0,
      grade: 'N/A',
      metrics: {},
      insights: ['Insufficient data for operational scoring']
    };
  }

  const metrics = {};
  const scores = [];

  // Average Order Value
  if (data.avgOrderValue !== undefined) {
    const aovScore = calculateScore(data.avgOrderValue, benchmark.avgOrderValue, true);
    metrics.avgOrderValue = {
      value: data.avgOrderValue,
      benchmark: benchmark.avgOrderValue,
      score: aovScore,
      status: aovScore >= 70 ? 'good' : aovScore >= 50 ? 'fair' : 'poor'
    };
    scores.push(aovScore);
  }

  // Order Fulfillment Rate
  if (data.orderFulfillmentRate !== undefined) {
    const fulfillmentScore = calculateScore(data.orderFulfillmentRate, benchmark.orderFulfillmentRate, true);
    metrics.orderFulfillment = {
      value: data.orderFulfillmentRate,
      benchmark: benchmark.orderFulfillmentRate,
      score: fulfillmentScore,
      status: fulfillmentScore >= 70 ? 'good' : fulfillmentScore >= 50 ? 'fair' : 'poor'
    };
    scores.push(fulfillmentScore);
  }

  // Repeat Customer Rate
  if (data.repeatCustomerRate !== undefined) {
    const repeatScore = calculateScore(data.repeatCustomerRate, benchmark.repeatCustomerRate, true);
    metrics.repeatCustomerRate = {
      value: data.repeatCustomerRate,
      benchmark: benchmark.repeatCustomerRate,
      score: repeatScore,
      status: repeatScore >= 70 ? 'good' : repeatScore >= 50 ? 'fair' : 'poor'
    };
    scores.push(repeatScore);
  }

  const overallScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

  return {
    score: Math.round(overallScore),
    grade: getGrade(overallScore),
    metrics,
    insights: generateOperationalInsights(metrics, benchmark)
  };
}

/**
 * Score financial performance
 */
export function scoreFinancialPerformance(data, industry = 'default') {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default;

  if (!data) {
    return {
      score: 0,
      grade: 'N/A',
      metrics: {},
      insights: ['Insufficient data for financial scoring']
    };
  }

  const metrics = {};
  const scores = [];

  // Profit Margin
  if (data.profitMargin !== undefined) {
    const marginScore = calculateScore(data.profitMargin, benchmark.profitMargin, true);
    metrics.profitMargin = {
      value: data.profitMargin,
      benchmark: benchmark.profitMargin,
      score: marginScore,
      status: marginScore >= 70 ? 'good' : marginScore >= 50 ? 'fair' : 'poor'
    };
    scores.push(marginScore);
  }

  // Cost to Revenue Ratio
  if (data.costToRevenueRatio !== undefined) {
    const costScore = calculateScore(data.costToRevenueRatio, benchmark.costToRevenueRatio, false);
    metrics.costToRevenueRatio = {
      value: data.costToRevenueRatio,
      benchmark: benchmark.costToRevenueRatio,
      score: costScore,
      status: costScore >= 70 ? 'good' : costScore >= 50 ? 'fair' : 'poor'
    };
    scores.push(costScore);
  }

  const overallScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

  return {
    score: Math.round(overallScore),
    grade: getGrade(overallScore),
    metrics,
    insights: generateFinancialInsights(metrics, benchmark)
  };
}

/**
 * Score customer satisfaction
 */
export function scoreCustomerSatisfaction(data, industry = 'default') {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default;

  if (!data || data.rating === undefined) {
    return {
      score: 0,
      grade: 'N/A',
      metrics: {},
      insights: ['Insufficient data for customer satisfaction scoring']
    };
  }

  const ratingScore = calculateScore(data.rating, benchmark.customerSatisfaction, true);

  const metrics = {
    customerRating: {
      value: data.rating,
      benchmark: benchmark.customerSatisfaction,
      score: ratingScore,
      status: ratingScore >= 70 ? 'good' : ratingScore >= 50 ? 'fair' : 'poor'
    }
  };

  return {
    score: Math.round(ratingScore),
    grade: getGrade(ratingScore),
    metrics,
    insights: generateCustomerInsights(metrics, benchmark)
  };
}

/**
 * Generate comprehensive performance score
 */
export function generatePerformanceScore(data, industry = 'default') {
  const revenueScore = scoreRevenuePerformance(data.revenue, industry);
  const operationalScore = scoreOperationalPerformance(data.operational, industry);
  const financialScore = scoreFinancialPerformance(data.financial, industry);
  const customerScore = scoreCustomerSatisfaction(data.customer, industry);

  // Weighted overall score
  const weights = {
    revenue: 0.30,
    operational: 0.25,
    financial: 0.25,
    customer: 0.20
  };

  const overallScore = Math.round(
    revenueScore.score * weights.revenue +
    operationalScore.score * weights.operational +
    financialScore.score * weights.financial +
    customerScore.score * weights.customer
  );

  return {
    overallScore,
    grade: getGrade(overallScore),
    industry,
    components: {
      revenue: revenueScore,
      operational: operationalScore,
      financial: financialScore,
      customer: customerScore
    },
    strengths: identifyStrengths({ revenue: revenueScore, operational: operationalScore, financial: financialScore, customer: customerScore }),
    weaknesses: identifyWeaknesses({ revenue: revenueScore, operational: operationalScore, financial: financialScore, customer: customerScore }),
    timestamp: new Date().toISOString()
  };
}

/**
 * Compare performance against competitors/peers
 */
export function benchmarkAgainstPeers(myData, peerData) {
  if (!peerData || peerData.length === 0) {
    return {
      ranking: 'N/A',
      percentile: 0,
      comparison: {}
    };
  }

  const metrics = ['revenue', 'orders', 'customers', 'rating'];
  const comparison = {};
  const rankings = {};

  metrics.forEach(metric => {
    if (myData[metric] !== undefined) {
      const peerValues = peerData.map(p => p[metric] || 0).filter(v => v > 0);

      if (peerValues.length > 0) {
        const avg = peerValues.reduce((sum, v) => sum + v, 0) / peerValues.length;
        const myValue = myData[metric];

        // Calculate percentile
        const betterThan = peerValues.filter(v => myValue > v).length;
        const percentile = (betterThan / peerValues.length) * 100;

        comparison[metric] = {
          myValue,
          peerAverage: avg,
          difference: myValue - avg,
          differencePercent: avg > 0 ? ((myValue - avg) / avg) * 100 : 0,
          percentile,
          status: percentile >= 75 ? 'excellent' : percentile >= 50 ? 'good' : percentile >= 25 ? 'fair' : 'poor'
        };

        rankings[metric] = percentile;
      }
    }
  });

  // Overall ranking
  const avgPercentile = Object.values(rankings).length > 0
    ? Object.values(rankings).reduce((sum, p) => sum + p, 0) / Object.values(rankings).length
    : 0;

  return {
    ranking: avgPercentile >= 75 ? 'top_quartile' : avgPercentile >= 50 ? 'above_average' : avgPercentile >= 25 ? 'below_average' : 'bottom_quartile',
    percentile: Math.round(avgPercentile),
    comparison,
    insights: generatePeerComparisonInsights(comparison)
  };
}

/**
 * Generate grade from score
 */
function getGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 45) return 'D';
  return 'F';
}

/**
 * Identify strengths from scores
 */
function identifyStrengths(scores) {
  const strengths = [];

  Object.entries(scores).forEach(([category, scoreData]) => {
    if (scoreData.score >= 80) {
      strengths.push({
        category,
        score: scoreData.score,
        grade: scoreData.grade
      });
    }

    // Check individual metrics
    if (scoreData.metrics) {
      Object.entries(scoreData.metrics).forEach(([metric, metricData]) => {
        if (metricData.score >= 80) {
          strengths.push({
            category,
            metric,
            score: metricData.score,
            value: metricData.value,
            benchmark: metricData.benchmark
          });
        }
      });
    }
  });

  return strengths.slice(0, 5); // Top 5 strengths
}

/**
 * Identify weaknesses from scores
 */
function identifyWeaknesses(scores) {
  const weaknesses = [];

  Object.entries(scores).forEach(([category, scoreData]) => {
    if (scoreData.score < 60) {
      weaknesses.push({
        category,
        score: scoreData.score,
        grade: scoreData.grade
      });
    }

    // Check individual metrics
    if (scoreData.metrics) {
      Object.entries(scoreData.metrics).forEach(([metric, metricData]) => {
        if (metricData.score < 60) {
          weaknesses.push({
            category,
            metric,
            score: metricData.score,
            value: metricData.value,
            benchmark: metricData.benchmark,
            gap: metricData.benchmark - metricData.value
          });
        }
      });
    }
  });

  return weaknesses.slice(0, 5); // Top 5 weaknesses
}

/**
 * Generate insights for revenue metrics
 */
function generateRevenueInsights(metrics, benchmark) {
  const insights = [];

  if (metrics.revenueGrowth) {
    const { value, benchmark: bench, status } = metrics.revenueGrowth;

    if (status === 'good') {
      insights.push(`Revenue growth of ${value.toFixed(1)}% exceeds industry benchmark of ${bench}%`);
    } else if (status === 'poor') {
      insights.push(`Revenue growth of ${value.toFixed(1)}% is below industry benchmark of ${bench}%`);
      insights.push('Consider implementing growth strategies to improve performance');
    }
  }

  return insights;
}

/**
 * Generate insights for operational metrics
 */
function generateOperationalInsights(metrics, benchmark) {
  const insights = [];

  Object.entries(metrics).forEach(([metric, data]) => {
    if (data.status === 'poor') {
      insights.push(`${metric} needs improvement: ${data.value.toFixed(1)} vs benchmark ${data.benchmark.toFixed(1)}`);
    }
  });

  return insights;
}

/**
 * Generate insights for financial metrics
 */
function generateFinancialInsights(metrics, benchmark) {
  const insights = [];

  if (metrics.profitMargin && metrics.profitMargin.status === 'good') {
    insights.push(`Strong profit margin of ${metrics.profitMargin.value.toFixed(1)}%`);
  }

  if (metrics.costToRevenueRatio && metrics.costToRevenueRatio.status === 'poor') {
    insights.push(`Cost ratio of ${metrics.costToRevenueRatio.value.toFixed(1)}% exceeds benchmark - focus on cost optimization`);
  }

  return insights;
}

/**
 * Generate insights for customer metrics
 */
function generateCustomerInsights(metrics, benchmark) {
  const insights = [];

  if (metrics.customerRating) {
    const { value, benchmark: bench, status } = metrics.customerRating;

    if (status === 'good') {
      insights.push(`Excellent customer rating of ${value.toFixed(1)}/5`);
    } else if (status === 'poor') {
      insights.push(`Customer rating of ${value.toFixed(1)}/5 needs improvement (benchmark: ${bench.toFixed(1)})`);
    }
  }

  return insights;
}

/**
 * Generate insights for peer comparison
 */
function generatePeerComparisonInsights(comparison) {
  const insights = [];

  Object.entries(comparison).forEach(([metric, data]) => {
    if (data.status === 'excellent') {
      insights.push({
        type: 'strength',
        message: `${metric} is in top 25% among peers`
      });
    } else if (data.status === 'poor') {
      insights.push({
        type: 'weakness',
        message: `${metric} is in bottom 25% among peers`
      });
    }
  });

  return insights;
}

/**
 * Get industry benchmarks
 */
export function getIndustryBenchmarks(industry = 'default') {
  return INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default;
}
