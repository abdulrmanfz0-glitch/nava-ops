/**
 * AI Intelligence Layer - Branch Health Score Calculator
 * Calculates comprehensive health scores for branches
 */

/**
 * Calculate revenue health score (0-100)
 */
function calculateRevenueScore(branchData, industryBenchmark = null) {
  if (!branchData || !branchData.history || branchData.history.length < 7) {
    return { score: 50, factors: [] };
  }

  const history = branchData.history;
  const revenues = history.map(h => h.revenue || 0);
  const recentRevenue = revenues.slice(-7);
  const previousRevenue = revenues.slice(-14, -7);

  const recentAvg = recentRevenue.reduce((sum, r) => sum + r, 0) / 7;
  const previousAvg = previousRevenue.length > 0
    ? previousRevenue.reduce((sum, r) => sum + r, 0) / previousRevenue.length
    : recentAvg;

  const factors = [];
  let score = 50; // Base score

  // Growth trend (+/-20 points)
  const growthRate = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
  if (growthRate > 10) {
    score += 20;
    factors.push({ factor: 'Strong revenue growth', impact: '+20', value: `${growthRate.toFixed(1)}%` });
  } else if (growthRate > 0) {
    score += 10;
    factors.push({ factor: 'Positive revenue trend', impact: '+10', value: `${growthRate.toFixed(1)}%` });
  } else if (growthRate < -10) {
    score -= 20;
    factors.push({ factor: 'Revenue decline', impact: '-20', value: `${growthRate.toFixed(1)}%` });
  } else if (growthRate < 0) {
    score -= 10;
    factors.push({ factor: 'Negative revenue trend', impact: '-10', value: `${growthRate.toFixed(1)}%` });
  }

  // Revenue consistency (+/-15 points)
  const stdDev = Math.sqrt(
    recentRevenue.reduce((sum, r) => sum + Math.pow(r - recentAvg, 2), 0) / 7
  );
  const coefficientOfVariation = recentAvg > 0 ? (stdDev / recentAvg) * 100 : 0;

  if (coefficientOfVariation < 15) {
    score += 15;
    factors.push({ factor: 'Very consistent revenue', impact: '+15', value: `${coefficientOfVariation.toFixed(1)}% CV` });
  } else if (coefficientOfVariation < 30) {
    score += 8;
    factors.push({ factor: 'Good revenue consistency', impact: '+8', value: `${coefficientOfVariation.toFixed(1)}% CV` });
  } else if (coefficientOfVariation > 50) {
    score -= 15;
    factors.push({ factor: 'High revenue volatility', impact: '-15', value: `${coefficientOfVariation.toFixed(1)}% CV` });
  }

  // Benchmark comparison (+/-15 points)
  if (industryBenchmark && industryBenchmark.avgRevenue) {
    const benchmarkRatio = (recentAvg / industryBenchmark.avgRevenue) * 100;
    if (benchmarkRatio > 120) {
      score += 15;
      factors.push({ factor: 'Above industry benchmark', impact: '+15', value: `${benchmarkRatio.toFixed(0)}%` });
    } else if (benchmarkRatio > 100) {
      score += 8;
      factors.push({ factor: 'Meeting industry benchmark', impact: '+8', value: `${benchmarkRatio.toFixed(0)}%` });
    } else if (benchmarkRatio < 80) {
      score -= 15;
      factors.push({ factor: 'Below industry benchmark', impact: '-15', value: `${benchmarkRatio.toFixed(0)}%` });
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    metrics: { growthRate, consistency: coefficientOfVariation, avgRevenue: recentAvg }
  };
}

/**
 * Calculate operational efficiency score (0-100)
 */
function calculateOperationalScore(branchData) {
  if (!branchData || !branchData.history || branchData.history.length < 7) {
    return { score: 50, factors: [] };
  }

  const history = branchData.history;
  const factors = [];
  let score = 50;

  // Order fulfillment rate (+/-20 points)
  const recentOrders = history.slice(-7);
  const totalOrders = recentOrders.reduce((sum, h) => sum + (h.orders || 0), 0);
  const completedOrders = recentOrders.reduce((sum, h) => sum + (h.completedOrders || h.orders || 0), 0);
  const fulfillmentRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 100;

  if (fulfillmentRate > 95) {
    score += 20;
    factors.push({ factor: 'Excellent order fulfillment', impact: '+20', value: `${fulfillmentRate.toFixed(1)}%` });
  } else if (fulfillmentRate > 85) {
    score += 10;
    factors.push({ factor: 'Good order fulfillment', impact: '+10', value: `${fulfillmentRate.toFixed(1)}%` });
  } else if (fulfillmentRate < 75) {
    score -= 20;
    factors.push({ factor: 'Poor order fulfillment', impact: '-20', value: `${fulfillmentRate.toFixed(1)}%` });
  }

  // Order volume trend (+/-15 points)
  const orders = history.map(h => h.orders || 0);
  const recentOrderAvg = orders.slice(-7).reduce((sum, o) => sum + o, 0) / 7;
  const previousOrderAvg = orders.slice(-14, -7).length > 0
    ? orders.slice(-14, -7).reduce((sum, o) => sum + o, 0) / 7
    : recentOrderAvg;
  const orderGrowth = previousOrderAvg > 0 ? ((recentOrderAvg - previousOrderAvg) / previousOrderAvg) * 100 : 0;

  if (orderGrowth > 5) {
    score += 15;
    factors.push({ factor: 'Growing order volume', impact: '+15', value: `+${orderGrowth.toFixed(1)}%` });
  } else if (orderGrowth < -5) {
    score -= 15;
    factors.push({ factor: 'Declining order volume', impact: '-15', value: `${orderGrowth.toFixed(1)}%` });
  }

  // Average order value (+/-10 points)
  const avgOrderValue = recentOrderAvg > 0 && totalOrders > 0
    ? recentOrders.reduce((sum, h) => sum + (h.revenue || 0), 0) / totalOrders
    : 0;

  if (avgOrderValue > 50) {
    score += 10;
    factors.push({ factor: 'High average order value', impact: '+10', value: `$${avgOrderValue.toFixed(2)}` });
  } else if (avgOrderValue < 25 && avgOrderValue > 0) {
    score -= 10;
    factors.push({ factor: 'Low average order value', impact: '-10', value: `$${avgOrderValue.toFixed(2)}` });
  }

  // Operating consistency (+/-5 points)
  const dailyOrders = orders.slice(-7);
  const hasConsistentOperations = dailyOrders.filter(o => o > 0).length >= 6;

  if (hasConsistentOperations) {
    score += 5;
    factors.push({ factor: 'Consistent daily operations', impact: '+5', value: '6/7 days active' });
  } else if (dailyOrders.filter(o => o > 0).length < 4) {
    score -= 5;
    factors.push({ factor: 'Inconsistent operations', impact: '-5', value: 'Multiple inactive days' });
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    metrics: { fulfillmentRate, orderGrowth, avgOrderValue }
  };
}

/**
 * Calculate customer satisfaction score (0-100)
 */
function calculateCustomerScore(branchData) {
  if (!branchData) {
    return { score: 50, factors: [] };
  }

  const factors = [];
  let score = 50;

  // Customer ratings (+/-25 points)
  if (branchData.rating !== undefined && branchData.rating !== null) {
    const rating = branchData.rating;
    if (rating >= 4.5) {
      score += 25;
      factors.push({ factor: 'Excellent customer ratings', impact: '+25', value: `${rating.toFixed(1)}/5` });
    } else if (rating >= 4.0) {
      score += 15;
      factors.push({ factor: 'Good customer ratings', impact: '+15', value: `${rating.toFixed(1)}/5` });
    } else if (rating >= 3.5) {
      score += 5;
      factors.push({ factor: 'Average customer ratings', impact: '+5', value: `${rating.toFixed(1)}/5` });
    } else if (rating < 3.0) {
      score -= 25;
      factors.push({ factor: 'Poor customer ratings', impact: '-25', value: `${rating.toFixed(1)}/5` });
    }
  }

  // Repeat customer rate (+/-15 points)
  if (branchData.repeatCustomerRate !== undefined) {
    const repeatRate = branchData.repeatCustomerRate;
    if (repeatRate > 40) {
      score += 15;
      factors.push({ factor: 'Strong customer loyalty', impact: '+15', value: `${repeatRate.toFixed(0)}% repeat` });
    } else if (repeatRate > 25) {
      score += 8;
      factors.push({ factor: 'Good customer retention', impact: '+8', value: `${repeatRate.toFixed(0)}% repeat` });
    } else if (repeatRate < 15) {
      score -= 15;
      factors.push({ factor: 'Low customer retention', impact: '-15', value: `${repeatRate.toFixed(0)}% repeat` });
    }
  }

  // Response to feedback (+/-10 points)
  if (branchData.feedbackResponseRate !== undefined) {
    const responseRate = branchData.feedbackResponseRate;
    if (responseRate > 80) {
      score += 10;
      factors.push({ factor: 'Excellent feedback engagement', impact: '+10', value: `${responseRate.toFixed(0)}%` });
    } else if (responseRate < 30) {
      score -= 10;
      factors.push({ factor: 'Poor feedback engagement', impact: '-10', value: `${responseRate.toFixed(0)}%` });
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors
  };
}

/**
 * Calculate financial health score (0-100)
 */
function calculateFinancialScore(branchData) {
  if (!branchData || !branchData.history || branchData.history.length < 7) {
    return { score: 50, factors: [] };
  }

  const history = branchData.history;
  const factors = [];
  let score = 50;

  // Profit margin (+/-20 points)
  const recentData = history.slice(-7);
  const totalRevenue = recentData.reduce((sum, h) => sum + (h.revenue || 0), 0);
  const totalCosts = recentData.reduce((sum, h) => sum + (h.costs || 0), 0);
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;

  if (profitMargin > 25) {
    score += 20;
    factors.push({ factor: 'Excellent profit margin', impact: '+20', value: `${profitMargin.toFixed(1)}%` });
  } else if (profitMargin > 15) {
    score += 10;
    factors.push({ factor: 'Good profit margin', impact: '+10', value: `${profitMargin.toFixed(1)}%` });
  } else if (profitMargin < 5) {
    score -= 20;
    factors.push({ factor: 'Low profit margin', impact: '-20', value: `${profitMargin.toFixed(1)}%` });
  }

  // Cost efficiency (+/-15 points)
  const costToRevenueRatio = totalRevenue > 0 ? (totalCosts / totalRevenue) * 100 : 0;

  if (costToRevenueRatio < 25) {
    score += 15;
    factors.push({ factor: 'Very efficient operations', impact: '+15', value: `${costToRevenueRatio.toFixed(1)}% cost ratio` });
  } else if (costToRevenueRatio < 35) {
    score += 8;
    factors.push({ factor: 'Good cost efficiency', impact: '+8', value: `${costToRevenueRatio.toFixed(1)}% cost ratio` });
  } else if (costToRevenueRatio > 50) {
    score -= 15;
    factors.push({ factor: 'High operational costs', impact: '-15', value: `${costToRevenueRatio.toFixed(1)}% cost ratio` });
  }

  // Revenue per customer (+/-10 points)
  const customers = recentData.reduce((sum, h) => sum + (h.customers || 0), 0);
  const revenuePerCustomer = customers > 0 ? totalRevenue / customers : 0;

  if (revenuePerCustomer > 100) {
    score += 10;
    factors.push({ factor: 'High customer value', impact: '+10', value: `$${revenuePerCustomer.toFixed(2)}/customer` });
  } else if (revenuePerCustomer < 30 && revenuePerCustomer > 0) {
    score -= 10;
    factors.push({ factor: 'Low customer value', impact: '-10', value: `$${revenuePerCustomer.toFixed(2)}/customer` });
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    metrics: { profitMargin, costToRevenueRatio, revenuePerCustomer }
  };
}

/**
 * Calculate overall branch health score
 */
export function calculateBranchHealthScore(branchData, options = {}) {
  const { industryBenchmark = null, weights = null } = options;

  // Default weights
  const defaultWeights = {
    revenue: 0.30,
    operational: 0.25,
    customer: 0.25,
    financial: 0.20
  };

  const w = weights || defaultWeights;

  // Calculate component scores
  const revenueHealth = calculateRevenueScore(branchData, industryBenchmark);
  const operationalHealth = calculateOperationalScore(branchData);
  const customerHealth = calculateCustomerScore(branchData);
  const financialHealth = calculateFinancialScore(branchData);

  // Calculate weighted overall score
  const overallScore = Math.round(
    revenueHealth.score * w.revenue +
    operationalHealth.score * w.operational +
    customerHealth.score * w.customer +
    financialHealth.score * w.financial
  );

  // Determine health status
  let status = 'needs_attention';
  let statusColor = 'red';
  if (overallScore >= 80) {
    status = 'excellent';
    statusColor = 'green';
  } else if (overallScore >= 65) {
    status = 'good';
    statusColor = 'blue';
  } else if (overallScore >= 50) {
    status = 'fair';
    statusColor = 'yellow';
  }

  return {
    branchId: branchData.id,
    branchName: branchData.name,
    overallScore,
    status,
    statusColor,
    components: {
      revenue: revenueHealth,
      operational: operationalHealth,
      customer: customerHealth,
      financial: financialHealth
    },
    topStrengths: getAllFactors([revenueHealth, operationalHealth, customerHealth, financialHealth])
      .filter(f => f.impact.startsWith('+'))
      .sort((a, b) => parseInt(b.impact) - parseInt(a.impact))
      .slice(0, 3),
    topWeaknesses: getAllFactors([revenueHealth, operationalHealth, customerHealth, financialHealth])
      .filter(f => f.impact.startsWith('-'))
      .sort((a, b) => parseInt(a.impact) - parseInt(b.impact))
      .slice(0, 3),
    timestamp: new Date().toISOString()
  };
}

/**
 * Helper to get all factors from multiple health scores
 */
function getAllFactors(healthScores) {
  return healthScores.reduce((all, score) => {
    return all.concat(score.factors || []);
  }, []);
}

/**
 * Calculate health scores for multiple branches
 */
export function calculateMultipleBranchScores(branches, options = {}) {
  if (!branches || branches.length === 0) {
    return [];
  }

  const scores = branches.map(branch => calculateBranchHealthScore(branch, options));

  // Add rankings
  const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);
  scores.forEach(score => {
    score.rank = sorted.findIndex(s => s.branchId === score.branchId) + 1;
    score.totalBranches = branches.length;
  });

  return scores;
}

/**
 * Get health score summary for all branches
 */
export function getBranchHealthSummary(branches, options = {}) {
  const scores = calculateMultipleBranchScores(branches, options);

  const avgScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;

  return {
    averageScore: Math.round(avgScore),
    totalBranches: scores.length,
    excellent: scores.filter(s => s.status === 'excellent').length,
    good: scores.filter(s => s.status === 'good').length,
    fair: scores.filter(s => s.status === 'fair').length,
    needsAttention: scores.filter(s => s.status === 'needs_attention').length,
    topPerformer: scores[0],
    needsImprovement: scores.filter(s => s.overallScore < 50),
    scores
  };
}
