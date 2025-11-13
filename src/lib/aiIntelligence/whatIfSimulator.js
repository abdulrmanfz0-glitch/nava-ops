/**
 * AI Intelligence Layer - What-If Simulator
 * Simulates business scenarios and their potential impacts
 */

/**
 * Simulate price change impact
 */
export function simulatePriceChange(currentData, priceChangePercent) {
  const {
    currentPrice = 0,
    currentOrders = 0,
    currentRevenue = 0,
    priceElasticity = -0.5 // Default elasticity: -0.5 (typical for food service)
  } = currentData;

  const newPrice = currentPrice * (1 + priceChangePercent / 100);
  const priceChange = priceChangePercent;

  // Calculate demand change using elasticity
  const demandChangePercent = priceElasticity * priceChange;
  const newOrders = currentOrders * (1 + demandChangePercent / 100);

  const newRevenue = newPrice * newOrders;
  const revenueChange = newRevenue - currentRevenue;
  const revenueChangePercent = currentRevenue > 0 ? (revenueChange / currentRevenue) * 100 : 0;

  return {
    scenario: 'price_change',
    input: {
      priceChange: priceChangePercent,
      currentPrice,
      newPrice
    },
    results: {
      currentOrders,
      projectedOrders: newOrders,
      orderChange: newOrders - currentOrders,
      orderChangePercent: demandChangePercent,
      currentRevenue,
      projectedRevenue: newRevenue,
      revenueChange,
      revenueChangePercent
    },
    insights: generatePriceChangeInsights(priceChangePercent, revenueChangePercent, demandChangePercent),
    recommendation: getPriceChangeRecommendation(priceChangePercent, revenueChangePercent)
  };
}

/**
 * Generate insights for price change simulation
 */
function generatePriceChangeInsights(priceChange, revenueChange, demandChange) {
  const insights = [];

  if (priceChange > 0) {
    insights.push({
      type: 'info',
      message: `A ${priceChange.toFixed(1)}% price increase is projected to decrease demand by ${Math.abs(demandChange).toFixed(1)}%`
    });

    if (revenueChange > 0) {
      insights.push({
        type: 'success',
        message: `Despite lower volume, revenue is expected to increase by ${revenueChange.toFixed(1)}%`
      });
    } else {
      insights.push({
        type: 'warning',
        message: `Revenue projected to decrease by ${Math.abs(revenueChange).toFixed(1)}% due to reduced demand`
      });
    }
  } else {
    insights.push({
      type: 'info',
      message: `A ${Math.abs(priceChange).toFixed(1)}% price decrease is projected to increase demand by ${demandChange.toFixed(1)}%`
    });

    if (revenueChange > 0) {
      insights.push({
        type: 'success',
        message: `Higher volume is expected to increase revenue by ${revenueChange.toFixed(1)}%`
      });
    }
  }

  return insights;
}

/**
 * Get recommendation for price change
 */
function getPriceChangeRecommendation(priceChange, revenueChange) {
  if (revenueChange > 5) {
    return {
      action: 'recommended',
      reason: 'Positive revenue impact projected',
      confidence: 75
    };
  } else if (revenueChange > 0) {
    return {
      action: 'consider',
      reason: 'Marginal revenue improvement expected',
      confidence: 60
    };
  } else if (revenueChange > -5) {
    return {
      action: 'neutral',
      reason: 'Minimal revenue impact',
      confidence: 65
    };
  } else {
    return {
      action: 'not_recommended',
      reason: 'Negative revenue impact projected',
      confidence: 70
    };
  }
}

/**
 * Simulate marketing campaign impact
 */
export function simulateMarketingCampaign(currentData, campaignData) {
  const {
    currentOrders = 0,
    currentRevenue = 0,
    avgOrderValue = 0
  } = currentData;

  const {
    budget = 0,
    expectedReach = 0,
    conversionRate = 2, // 2% default conversion
    duration = 7 // days
  } = campaignData;

  // Calculate expected new customers
  const expectedConversions = (expectedReach * conversionRate) / 100;

  // Calculate expected revenue from campaign
  const campaignRevenue = expectedConversions * avgOrderValue;

  // Calculate ROI
  const roi = budget > 0 ? ((campaignRevenue - budget) / budget) * 100 : 0;

  // Project total impact over duration
  const dailyNewOrders = expectedConversions / duration;
  const totalProjectedOrders = currentOrders * duration + expectedConversions;
  const totalProjectedRevenue = currentRevenue * duration + campaignRevenue;

  return {
    scenario: 'marketing_campaign',
    input: {
      budget,
      expectedReach,
      conversionRate,
      duration
    },
    results: {
      expectedConversions,
      campaignRevenue,
      roi,
      dailyNewOrders,
      totalProjectedOrders,
      totalProjectedRevenue,
      costPerAcquisition: expectedConversions > 0 ? budget / expectedConversions : 0
    },
    insights: generateMarketingInsights(roi, campaignRevenue, budget),
    recommendation: getMarketingRecommendation(roi, campaignRevenue)
  };
}

/**
 * Generate insights for marketing campaign
 */
function generateMarketingInsights(roi, revenue, budget) {
  const insights = [];

  if (roi > 100) {
    insights.push({
      type: 'success',
      message: `Excellent ROI of ${roi.toFixed(0)}% - campaign projected to generate ${(roi / 100 + 1).toFixed(1)}x return`
    });
  } else if (roi > 0) {
    insights.push({
      type: 'info',
      message: `Positive ROI of ${roi.toFixed(0)}% expected from campaign`
    });
  } else {
    insights.push({
      type: 'warning',
      message: `Negative ROI of ${roi.toFixed(0)}% - campaign may not cover costs`
    });
  }

  insights.push({
    type: 'info',
    message: `Expected to generate $${revenue.toFixed(2)} in revenue from $${budget.toFixed(2)} investment`
  });

  return insights;
}

/**
 * Get recommendation for marketing campaign
 */
function getMarketingRecommendation(roi, revenue) {
  if (roi > 100) {
    return {
      action: 'highly_recommended',
      reason: 'Strong ROI with excellent revenue potential',
      confidence: 85
    };
  } else if (roi > 50) {
    return {
      action: 'recommended',
      reason: 'Good ROI expected',
      confidence: 75
    };
  } else if (roi > 0) {
    return {
      action: 'consider',
      reason: 'Positive but modest ROI',
      confidence: 60
    };
  } else {
    return {
      action: 'not_recommended',
      reason: 'Negative ROI - costs exceed expected revenue',
      confidence: 70
    };
  }
}

/**
 * Simulate cost reduction impact
 */
export function simulateCostReduction(currentData, costReductionData) {
  const {
    currentCosts = 0,
    currentRevenue = 0
  } = currentData;

  const {
    reductionPercent = 0,
    affectedCategory = 'operational' // operational, inventory, labor, etc.
  } = costReductionData;

  const costSavings = currentCosts * (reductionPercent / 100);
  const newCosts = currentCosts - costSavings;

  const currentProfit = currentRevenue - currentCosts;
  const newProfit = currentRevenue - newCosts;
  const profitIncrease = newProfit - currentProfit;

  const currentMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;
  const newMargin = currentRevenue > 0 ? (newProfit / currentRevenue) * 100 : 0;

  return {
    scenario: 'cost_reduction',
    input: {
      reductionPercent,
      affectedCategory
    },
    results: {
      currentCosts,
      newCosts,
      costSavings,
      currentProfit,
      newProfit,
      profitIncrease,
      currentMargin,
      newMargin,
      marginImprovement: newMargin - currentMargin
    },
    insights: generateCostReductionInsights(costSavings, profitIncrease, newMargin),
    recommendation: {
      action: 'recommended',
      reason: 'Cost reduction improves profitability',
      confidence: 90
    }
  };
}

/**
 * Generate insights for cost reduction
 */
function generateCostReductionInsights(savings, profitIncrease, newMargin) {
  return [
    {
      type: 'success',
      message: `Projected savings of $${savings.toFixed(2)} will increase profit by $${profitIncrease.toFixed(2)}`
    },
    {
      type: 'info',
      message: `Profit margin will improve to ${newMargin.toFixed(1)}%`
    },
    {
      type: 'warning',
      message: 'Ensure cost reductions do not compromise quality or service'
    }
  ];
}

/**
 * Simulate new branch opening
 */
export function simulateNewBranch(existingBranchesData, newBranchData) {
  const {
    estimatedInitialCost = 0,
    expectedMonthlyRevenue = 0,
    expectedMonthlyCosts = 0,
    rampUpMonths = 6 // Time to reach full capacity
  } = newBranchData;

  // Calculate breakeven
  const monthlyProfit = expectedMonthlyRevenue - expectedMonthlyCosts;
  const breakEvenMonths = monthlyProfit > 0 ? Math.ceil(estimatedInitialCost / monthlyProfit) : Infinity;

  // Project first year performance with ramp-up
  const monthlyProjections = [];
  let cumulativeProfit = -estimatedInitialCost;

  for (let month = 1; month <= 12; month++) {
    const rampUpFactor = Math.min(1, month / rampUpMonths);
    const monthRevenue = expectedMonthlyRevenue * rampUpFactor;
    const monthCosts = expectedMonthlyCosts * rampUpFactor;
    const monthProfit = monthRevenue - monthCosts;

    cumulativeProfit += monthProfit;

    monthlyProjections.push({
      month,
      revenue: monthRevenue,
      costs: monthCosts,
      profit: monthProfit,
      cumulativeProfit
    });
  }

  const firstYearRevenue = monthlyProjections.reduce((sum, m) => sum + m.revenue, 0);
  const firstYearProfit = monthlyProjections.reduce((sum, m) => sum + m.profit, 0);

  return {
    scenario: 'new_branch',
    input: newBranchData,
    results: {
      breakEvenMonths,
      breakEvenDate: breakEvenMonths !== Infinity
        ? new Date(Date.now() + breakEvenMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : 'Not achievable with current projections',
      firstYearRevenue,
      firstYearProfit,
      firstYearROI: estimatedInitialCost > 0 ? (firstYearProfit / estimatedInitialCost) * 100 : 0,
      monthlyProjections
    },
    insights: generateNewBranchInsights(breakEvenMonths, firstYearProfit, firstYearRevenue),
    recommendation: getNewBranchRecommendation(breakEvenMonths, monthlyProfit)
  };
}

/**
 * Generate insights for new branch
 */
function generateNewBranchInsights(breakEven, firstYearProfit, firstYearRevenue) {
  const insights = [];

  if (breakEven !== Infinity && breakEven <= 12) {
    insights.push({
      type: 'success',
      message: `Projected to break even in ${breakEven} months`
    });
  } else if (breakEven !== Infinity && breakEven <= 24) {
    insights.push({
      type: 'info',
      message: `Break-even expected in ${breakEven} months - longer than ideal`
    });
  } else {
    insights.push({
      type: 'warning',
      message: 'Break-even timeline extends beyond 2 years or not achievable'
    });
  }

  if (firstYearProfit > 0) {
    insights.push({
      type: 'success',
      message: `Projected first-year profit: $${firstYearProfit.toFixed(2)}`
    });
  } else {
    insights.push({
      type: 'warning',
      message: `First year expected to show loss of $${Math.abs(firstYearProfit).toFixed(2)}`
    });
  }

  return insights;
}

/**
 * Get recommendation for new branch
 */
function getNewBranchRecommendation(breakEven, monthlyProfit) {
  if (breakEven <= 12 && monthlyProfit > 0) {
    return {
      action: 'recommended',
      reason: 'Fast break-even with strong profit potential',
      confidence: 80
    };
  } else if (breakEven <= 18) {
    return {
      action: 'consider',
      reason: 'Moderate break-even timeline',
      confidence: 65
    };
  } else {
    return {
      action: 'review',
      reason: 'Long break-even period - review projections',
      confidence: 50
    };
  }
}

/**
 * Simulate staff optimization
 */
export function simulateStaffOptimization(currentData, optimizationData) {
  const {
    currentStaffCost = 0,
    currentRevenue = 0,
    currentOrders = 0
  } = currentData;

  const {
    staffChangePercent = 0,
    expectedEfficiencyGain = 0 // Percent improvement in service
  } = optimizationData;

  const newStaffCost = currentStaffCost * (1 + staffChangePercent / 100);
  const staffCostChange = newStaffCost - currentStaffCost;

  // Efficiency gain affects order capacity and customer satisfaction
  const orderCapacityChange = expectedEfficiencyGain;
  const newOrders = currentOrders * (1 + orderCapacityChange / 100);

  const avgOrderValue = currentOrders > 0 ? currentRevenue / currentOrders : 0;
  const newRevenue = newOrders * avgOrderValue;

  const currentProfit = currentRevenue - currentStaffCost;
  const newProfit = newRevenue - newStaffCost;

  return {
    scenario: 'staff_optimization',
    input: optimizationData,
    results: {
      currentStaffCost,
      newStaffCost,
      staffCostChange,
      currentOrders,
      newOrders,
      orderIncrease: newOrders - currentOrders,
      currentRevenue,
      newRevenue,
      revenueChange: newRevenue - currentRevenue,
      currentProfit,
      newProfit,
      profitChange: newProfit - currentProfit
    },
    insights: generateStaffOptimizationInsights(staffCostChange, newProfit - currentProfit),
    recommendation: getStaffOptimizationRecommendation(newProfit - currentProfit)
  };
}

/**
 * Generate insights for staff optimization
 */
function generateStaffOptimizationInsights(costChange, profitChange) {
  const insights = [];

  if (costChange > 0) {
    insights.push({
      type: 'info',
      message: `Staff costs will increase by $${costChange.toFixed(2)}`
    });
  } else if (costChange < 0) {
    insights.push({
      type: 'success',
      message: `Staff costs will decrease by $${Math.abs(costChange).toFixed(2)}`
    });
  }

  if (profitChange > 0) {
    insights.push({
      type: 'success',
      message: `Net profit improvement of $${profitChange.toFixed(2)} expected`
    });
  } else {
    insights.push({
      type: 'warning',
      message: `Profit may decrease by $${Math.abs(profitChange).toFixed(2)}`
    });
  }

  return insights;
}

/**
 * Get recommendation for staff optimization
 */
function getStaffOptimizationRecommendation(profitChange) {
  if (profitChange > 0) {
    return {
      action: 'recommended',
      reason: 'Improves profitability',
      confidence: 75
    };
  } else {
    return {
      action: 'not_recommended',
      reason: 'May reduce profitability',
      confidence: 70
    };
  }
}

/**
 * Run multiple scenarios and compare
 */
export function compareScenarios(scenarios) {
  const comparisons = scenarios.map(scenario => ({
    name: scenario.name,
    scenario: scenario.scenario,
    revenueImpact: scenario.results.revenueChange || scenario.results.projectedRevenue || 0,
    profitImpact: scenario.results.profitChange || scenario.results.newProfit || 0,
    roi: scenario.results.roi || 0,
    recommendation: scenario.recommendation
  }));

  // Rank by profit impact
  const ranked = [...comparisons].sort((a, b) => b.profitImpact - a.profitImpact);

  return {
    comparisons,
    ranked,
    topScenario: ranked[0],
    summary: `Best scenario: ${ranked[0].name} with ${ranked[0].profitImpact.toFixed(2)} profit impact`
  };
}
