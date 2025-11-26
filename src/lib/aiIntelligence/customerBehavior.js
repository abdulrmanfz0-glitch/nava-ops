/**
 * Customer Behavior Intelligence Analyzer
 * DeliveryOps MAX AI - Customer profiling and behavior analysis
 */

/**
 * Analyzes customer behavior and provides intelligence
 * @param {Object} customerData - Customer behavior data
 * @param {Array} refunds - Customer's refund history
 * @param {Array} orders - Customer's order history
 * @returns {Object} Customer intelligence profile
 */
export function analyzeCustomerBehavior(customerData, refunds = [], orders = []) {
  const profile = {
    customerId: customerData.customer_id,
    customerName: customerData.customer_name,
    customerType: 'normal',
    behaviorScore: 0,
    trustScore: 100,
    lifetimeValue: 0,
    riskLevel: 'low',
    traits: [],
    recommendations: {
      shouldApprove: null,
      objectionLevel: 'moderate',
      communicationTone: 'professional',
      specialHandling: []
    },
    insights: []
  };

  // Calculate behavior metrics
  const metrics = calculateBehaviorMetrics(customerData, refunds, orders);

  // Classify customer type
  profile.customerType = classifyCustomerType(metrics);

  // Calculate behavior score
  profile.behaviorScore = calculateBehaviorScore(metrics);

  // Calculate trust score
  profile.trustScore = calculateCustomerTrustScore(metrics);

  // Determine risk level
  profile.riskLevel = determineCustomerRiskLevel(metrics, profile.behaviorScore);

  // Identify traits
  profile.traits = identifyCustomerTraits(metrics, refunds, orders);

  // Calculate lifetime value
  profile.lifetimeValue = calculateLifetimeValue(orders, refunds);

  // Generate recommendations
  profile.recommendations = generateCustomerRecommendations(profile, metrics);

  // Generate insights
  profile.insights = generateCustomerInsights(profile, metrics, refunds);

  return profile;
}

/**
 * Calculate comprehensive behavior metrics
 */
function calculateBehaviorMetrics(customerData, refunds, orders) {
  const metrics = {
    totalOrders: customerData.total_orders || orders.length,
    totalRefunds: customerData.total_refund_requests || refunds.length,
    approvedRefunds: customerData.approved_refunds || refunds.filter(r => r.status === 'approved').length,
    rejectedRefunds: customerData.rejected_refunds || refunds.filter(r => r.status === 'rejected').length,
    disputedRefunds: customerData.disputed_refunds || refunds.filter(r => r.status === 'disputed').length,
    refundRate: 0,
    approvalRate: 0,
    totalSpent: customerData.total_spent || orders.reduce((sum, o) => sum + (o.total || 0), 0),
    totalRefunded: customerData.total_refunded || refunds.reduce((sum, r) => sum + r.refund_amount, 0),
    averageOrderValue: customerData.average_order_value || 0,
    refundFrequencyDays: customerData.refund_frequency_days || null,
    orderFrequency: 0,
    accountAge: 0,
    mostCommonRefundReason: customerData.most_common_refund_reason || '',
    platformCount: 0
  };

  // Calculate rates
  if (metrics.totalOrders > 0) {
    metrics.refundRate = (metrics.totalRefunds / metrics.totalOrders) * 100;
    metrics.averageOrderValue = metrics.totalSpent / metrics.totalOrders;
  }

  if (metrics.totalRefunds > 0) {
    metrics.approvalRate = (metrics.approvedRefunds / metrics.totalRefunds) * 100;
  }

  // Calculate order frequency
  if (orders.length >= 2) {
    const sortedOrders = orders.sort((a, b) => new Date(a.order_time) - new Date(b.order_time));
    const firstOrder = new Date(sortedOrders[0].order_time);
    const lastOrder = new Date(sortedOrders[sortedOrders.length - 1].order_time);
    const daysBetween = (lastOrder - firstOrder) / (1000 * 60 * 60 * 24);

    metrics.orderFrequency = daysBetween > 0 ? orders.length / daysBetween : 0;
    metrics.accountAge = daysBetween;
  }

  // Calculate refund frequency
  if (refunds.length >= 2) {
    const sortedRefunds = refunds.sort((a, b) =>
      new Date(a.refund_request_time) - new Date(b.refund_request_time)
    );

    const firstRefund = new Date(sortedRefunds[0].refund_request_time);
    const lastRefund = new Date(sortedRefunds[sortedRefunds.length - 1].refund_request_time);
    const daysBetween = (lastRefund - firstRefund) / (1000 * 60 * 60 * 24);

    metrics.refundFrequencyDays = daysBetween / (refunds.length - 1);
  }

  // Count platforms
  if (refunds.length > 0) {
    metrics.platformCount = new Set(refunds.map(r => r.platform_name)).size;
  }

  // Find most common refund reason
  if (refunds.length > 0) {
    const reasonCounts = {};
    refunds.forEach(r => {
      const reason = r.refund_reason || 'unknown';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });

    metrics.mostCommonRefundReason = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  }

  return metrics;
}

/**
 * Classify customer type based on behavior
 */
function classifyCustomerType(metrics) {
  // Fraud suspect - Very high refund rate with suspicious patterns
  if (metrics.refundRate > 50 || (metrics.refundRate > 30 && metrics.totalRefunds > 10)) {
    return 'fraud_suspect';
  }

  // Repeat offender - High refund rate
  if (metrics.refundRate > 25 || metrics.totalRefunds > 8) {
    return 'repeat_offender';
  }

  // High value customer - High spending, low refund rate
  if (metrics.totalSpent > 3000 && metrics.refundRate < 10) {
    return 'high_value';
  }

  // Sensitive customer - Moderate refunds but high spending
  if (metrics.totalSpent > 1500 && metrics.refundRate > 10 && metrics.refundRate < 20) {
    return 'sensitive';
  }

  // Angry customer - High rejection rate
  if (metrics.rejectedRefunds > metrics.approvedRefunds && metrics.totalRefunds >= 3) {
    return 'angry';
  }

  // New customer - Few orders
  if (metrics.totalOrders < 3) {
    return 'new';
  }

  // Normal customer
  return 'normal';
}

/**
 * Calculate behavior score (0-100, higher is better)
 */
function calculateBehaviorScore(metrics) {
  let score = 50; // Start at neutral

  // Positive factors
  if (metrics.totalOrders > 20) score += 20;
  else if (metrics.totalOrders > 10) score += 15;
  else if (metrics.totalOrders > 5) score += 10;

  if (metrics.refundRate < 5) score += 20;
  else if (metrics.refundRate < 10) score += 10;
  else if (metrics.refundRate < 15) score += 5;

  if (metrics.totalSpent > 3000) score += 15;
  else if (metrics.totalSpent > 1500) score += 10;
  else if (metrics.totalSpent > 500) score += 5;

  // Negative factors
  if (metrics.refundRate > 50) score -= 40;
  else if (metrics.refundRate > 30) score -= 30;
  else if (metrics.refundRate > 20) score -= 20;
  else if (metrics.refundRate > 15) score -= 10;

  if (metrics.refundFrequencyDays && metrics.refundFrequencyDays < 3) score -= 20;
  else if (metrics.refundFrequencyDays && metrics.refundFrequencyDays < 7) score -= 10;

  if (metrics.totalRefunds > 10) score -= 15;
  else if (metrics.totalRefunds > 5) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate trust score
 */
function calculateCustomerTrustScore(metrics) {
  let trustScore = 100;

  // Reduce trust based on refund rate
  if (metrics.refundRate > 50) trustScore -= 60;
  else if (metrics.refundRate > 30) trustScore -= 40;
  else if (metrics.refundRate > 20) trustScore -= 25;
  else if (metrics.refundRate > 10) trustScore -= 15;

  // Reduce trust based on total refunds
  if (metrics.totalRefunds > 15) trustScore -= 30;
  else if (metrics.totalRefunds > 10) trustScore -= 20;
  else if (metrics.totalRefunds > 5) trustScore -= 10;

  // Increase trust for good history
  if (metrics.totalOrders > 50 && metrics.refundRate < 5) trustScore += 20;
  else if (metrics.totalOrders > 20 && metrics.refundRate < 10) trustScore += 10;

  // Increase trust for high lifetime value
  if (metrics.totalSpent > 5000) trustScore += 15;
  else if (metrics.totalSpent > 2000) trustScore += 10;

  // Long-term customer bonus
  if (metrics.accountAge > 365) trustScore += 10;
  else if (metrics.accountAge > 180) trustScore += 5;

  return Math.max(0, Math.min(100, Math.round(trustScore)));
}

/**
 * Determine risk level
 */
function determineCustomerRiskLevel(metrics, behaviorScore) {
  if (metrics.refundRate > 50 || behaviorScore < 20) return 'critical';
  if (metrics.refundRate > 30 || behaviorScore < 40) return 'high';
  if (metrics.refundRate > 15 || behaviorScore < 60) return 'medium';
  return 'low';
}

/**
 * Identify customer traits
 */
function identifyCustomerTraits(metrics, refunds, orders) {
  const traits = [];

  // Spending traits
  if (metrics.totalSpent > 5000) {
    traits.push({ trait: 'big_spender', description: 'High lifetime value customer', impact: 'positive' });
  } else if (metrics.totalSpent < 200 && metrics.totalOrders > 5) {
    traits.push({ trait: 'budget_conscious', description: 'Low average order value', impact: 'neutral' });
  }

  // Frequency traits
  if (metrics.orderFrequency > 1) {
    traits.push({ trait: 'frequent_orderer', description: 'Orders regularly (multiple times per week)', impact: 'positive' });
  } else if (metrics.orderFrequency < 0.1 && metrics.totalOrders >= 3) {
    traits.push({ trait: 'occasional', description: 'Infrequent orders', impact: 'neutral' });
  }

  // Refund behavior traits
  if (metrics.refundRate > 40) {
    traits.push({ trait: 'serial_refunder', description: 'Excessive refund requests', impact: 'negative' });
  } else if (metrics.refundRate > 20) {
    traits.push({ trait: 'complaint_prone', description: 'Above-average refund requests', impact: 'negative' });
  } else if (metrics.refundRate === 0 && metrics.totalOrders > 5) {
    traits.push({ trait: 'zero_complaints', description: 'No refund history', impact: 'very_positive' });
  }

  // Pattern traits
  if (metrics.refundFrequencyDays && metrics.refundFrequencyDays < 5) {
    traits.push({ trait: 'rapid_complainer', description: 'Very frequent refund requests', impact: 'negative' });
  }

  // Loyalty traits
  if (metrics.accountAge > 365 && metrics.totalOrders > 20) {
    traits.push({ trait: 'loyal_customer', description: 'Long-term customer with consistent orders', impact: 'positive' });
  } else if (metrics.totalOrders < 3 && metrics.totalRefunds >= 1) {
    traits.push({ trait: 'early_complainer', description: 'Refund request within first few orders', impact: 'negative' });
  }

  // Approval traits
  if (metrics.totalRefunds > 0) {
    if (metrics.approvalRate > 80) {
      traits.push({ trait: 'often_approved', description: 'Most refund requests are approved', impact: 'neutral' });
    } else if (metrics.approvalRate < 30 && metrics.totalRefunds >= 3) {
      traits.push({ trait: 'often_rejected', description: 'Refunds frequently rejected - may be frustrated', impact: 'neutral' });
    }
  }

  // Multi-platform trait
  if (metrics.platformCount >= 3) {
    traits.push({ trait: 'platform_hopper', description: 'Orders from multiple platforms', impact: 'neutral' });
  }

  return traits;
}

/**
 * Calculate lifetime value
 */
function calculateLifetimeValue(orders, refunds) {
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRefunded = refunds.reduce((sum, r) => sum + r.refund_amount, 0);

  return Math.max(0, totalSpent - totalRefunded);
}

/**
 * Generate recommendations for handling this customer
 */
function generateCustomerRecommendations(profile, metrics) {
  const recommendations = {
    shouldApprove: null,
    objectionLevel: 'moderate',
    communicationTone: 'professional',
    specialHandling: [],
    reasoning: ''
  };

  // Determine approval recommendation
  if (profile.customerType === 'fraud_suspect') {
    recommendations.shouldApprove = false;
    recommendations.objectionLevel = 'aggressive';
    recommendations.communicationTone = 'firm';
    recommendations.specialHandling.push('Require comprehensive evidence');
    recommendations.specialHandling.push('Flag for fraud investigation');
    recommendations.specialHandling.push('Consider account suspension');
    recommendations.reasoning = 'High fraud risk - protect merchant interests';
  } else if (profile.customerType === 'repeat_offender') {
    recommendations.shouldApprove = false;
    recommendations.objectionLevel = 'hard';
    recommendations.communicationTone = 'firm_but_professional';
    recommendations.specialHandling.push('Request strong evidence');
    recommendations.specialHandling.push('Review entire history');
    recommendations.reasoning = 'Pattern of excessive refunds';
  } else if (profile.customerType === 'high_value') {
    recommendations.shouldApprove = true;
    recommendations.objectionLevel = 'light';
    recommendations.communicationTone = 'apologetic_and_accommodating';
    recommendations.specialHandling.push('Priority handling');
    recommendations.specialHandling.push('Offer compensation/goodwill gesture');
    recommendations.specialHandling.push('Personal follow-up');
    recommendations.reasoning = 'High lifetime value - maintain relationship';
  } else if (profile.customerType === 'sensitive') {
    recommendations.shouldApprove = 'review_carefully';
    recommendations.objectionLevel = 'moderate';
    recommendations.communicationTone = 'understanding_and_professional';
    recommendations.specialHandling.push('Careful review required');
    recommendations.specialHandling.push('Consider offering alternative resolution');
    recommendations.reasoning = 'Valuable customer with moderate concerns';
  } else if (profile.customerType === 'angry') {
    recommendations.shouldApprove = 'de_escalate';
    recommendations.objectionLevel = 'moderate';
    recommendations.communicationTone = 'calm_and_understanding';
    recommendations.specialHandling.push('Focus on de-escalation');
    recommendations.specialHandling.push('Offer to discuss concerns');
    recommendations.specialHandling.push('Consider partial compensation');
    recommendations.reasoning = 'Frustrated customer - avoid further escalation';
  } else if (profile.customerType === 'new') {
    recommendations.shouldApprove = 'review_carefully';
    recommendations.objectionLevel = 'light';
    recommendations.communicationTone = 'welcoming_and_professional';
    recommendations.specialHandling.push('First impression critical');
    recommendations.specialHandling.push('Explain policies clearly');
    recommendations.reasoning = 'New customer - balance policy enforcement with retention';
  } else {
    recommendations.shouldApprove = 'standard_review';
    recommendations.objectionLevel = 'moderate';
    recommendations.communicationTone = 'professional';
    recommendations.reasoning = 'Normal customer - standard handling';
  }

  return recommendations;
}

/**
 * Generate customer insights
 */
function generateCustomerInsights(profile, metrics, refunds) {
  const insights = [];

  // Overall assessment
  insights.push({
    category: 'overview',
    insight: `Customer Type: ${profile.customerType}`,
    priority: 'high'
  });

  insights.push({
    category: 'overview',
    insight: `Behavior Score: ${profile.behaviorScore}/100 (${getBehaviorRating(profile.behaviorScore)})`,
    priority: 'high'
  });

  insights.push({
    category: 'overview',
    insight: `Trust Score: ${profile.trustScore}/100`,
    priority: 'high'
  });

  // Spending insights
  if (metrics.totalSpent > 2000) {
    insights.push({
      category: 'financial',
      insight: `High-value customer with ${metrics.totalSpent.toFixed(2)} SAR lifetime spend`,
      priority: 'high'
    });
  }

  // Refund pattern insights
  if (metrics.refundRate > 30) {
    insights.push({
      category: 'behavior',
      insight: `⚠️ Very high refund rate (${metrics.refundRate.toFixed(1)}%) - significantly above normal`,
      priority: 'critical'
    });
  } else if (metrics.refundRate > 15) {
    insights.push({
      category: 'behavior',
      insight: `⚠️ Above-average refund rate (${metrics.refundRate.toFixed(1)}%)`,
      priority: 'medium'
    });
  } else if (metrics.refundRate === 0 && metrics.totalOrders >= 5) {
    insights.push({
      category: 'behavior',
      insight: `✓ Perfect record - no refund requests in ${metrics.totalOrders} orders`,
      priority: 'positive'
    });
  }

  // Frequency insights
  if (metrics.refundFrequencyDays && metrics.refundFrequencyDays < 5) {
    insights.push({
      category: 'pattern',
      insight: `🚩 Refunds every ${metrics.refundFrequencyDays.toFixed(1)} days - suspicious pattern`,
      priority: 'critical'
    });
  }

  // Loyalty insights
  if (metrics.accountAge > 365) {
    insights.push({
      category: 'loyalty',
      insight: `Long-term customer (${Math.round(metrics.accountAge)} days)`,
      priority: 'medium'
    });
  }

  // Platform insights
  if (metrics.platformCount >= 3) {
    insights.push({
      category: 'behavior',
      insight: `Orders across ${metrics.platformCount} platforms`,
      priority: 'low'
    });
  }

  // Recommendation insight
  insights.push({
    category: 'recommendation',
    insight: `Recommended approach: ${profile.recommendations.reasoning}`,
    priority: 'high'
  });

  return insights;
}

/**
 * Get behavior rating label
 */
function getBehaviorRating(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Very Poor';
}

/**
 * Compare customer against platform benchmarks
 */
export function benchmarkCustomer(customerMetrics, platformBenchmarks) {
  const comparison = {
    refundRate: {
      customer: customerMetrics.refundRate,
      platformAverage: platformBenchmarks.averageRefundRate || 3,
      deviation: 0,
      rating: 'normal'
    },
    orderFrequency: {
      customer: customerMetrics.orderFrequency,
      platformAverage: platformBenchmarks.averageOrderFrequency || 0.5,
      deviation: 0,
      rating: 'normal'
    },
    averageOrderValue: {
      customer: customerMetrics.averageOrderValue,
      platformAverage: platformBenchmarks.averageOrderValue || 100,
      deviation: 0,
      rating: 'normal'
    }
  };

  // Calculate deviations
  comparison.refundRate.deviation = customerMetrics.refundRate - comparison.refundRate.platformAverage;
  comparison.refundRate.rating = comparison.refundRate.deviation > 15 ? 'concerning' :
    comparison.refundRate.deviation > 5 ? 'above_average' :
    comparison.refundRate.deviation < -2 ? 'excellent' : 'normal';

  comparison.orderFrequency.deviation = customerMetrics.orderFrequency - comparison.orderFrequency.platformAverage;
  comparison.orderFrequency.rating = comparison.orderFrequency.deviation > 1 ? 'very_frequent' :
    comparison.orderFrequency.deviation > 0.3 ? 'frequent' :
    comparison.orderFrequency.deviation < -0.2 ? 'infrequent' : 'normal';

  comparison.averageOrderValue.deviation = customerMetrics.averageOrderValue - comparison.averageOrderValue.platformAverage;
  comparison.averageOrderValue.rating = comparison.averageOrderValue.deviation > 100 ? 'high_value' :
    comparison.averageOrderValue.deviation > 50 ? 'above_average' :
    comparison.averageOrderValue.deviation < -50 ? 'below_average' : 'normal';

  return comparison;
}

/**
 * Predict customer future behavior
 */
export function predictCustomerBehavior(customerMetrics, refunds, orders) {
  const prediction = {
    likelyToRefundAgain: 0, // Probability 0-100
    estimatedTimeToNextRefund: null, // Days
    estimatedNextRefundAmount: 0,
    retentionRisk: 'low', // low, medium, high
    recommendations: []
  };

  // Calculate probability of future refund
  if (customerMetrics.refundRate > 40) {
    prediction.likelyToRefundAgain = 90;
  } else if (customerMetrics.refundRate > 25) {
    prediction.likelyToRefundAgain = 70;
  } else if (customerMetrics.refundRate > 15) {
    prediction.likelyToRefundAgain = 50;
  } else if (customerMetrics.refundRate > 5) {
    prediction.likelyToRefundAgain = 30;
  } else {
    prediction.likelyToRefundAgain = 10;
  }

  // Estimate time to next refund
  if (customerMetrics.refundFrequencyDays) {
    prediction.estimatedTimeToNextRefund = Math.round(customerMetrics.refundFrequencyDays);
  }

  // Estimate amount
  if (refunds.length > 0) {
    const recentRefunds = refunds.slice(-3);
    prediction.estimatedNextRefundAmount = recentRefunds.reduce((sum, r) => sum + r.refund_amount, 0) / recentRefunds.length;
  }

  // Retention risk
  if (customerMetrics.rejectedRefunds > customerMetrics.approvedRefunds && customerMetrics.totalRefunds >= 2) {
    prediction.retentionRisk = 'high';
    prediction.recommendations.push('Customer may leave due to rejected refunds');
  } else if (customerMetrics.refundRate > 25) {
    prediction.retentionRisk = 'medium';
    prediction.recommendations.push('High refund rate may indicate dissatisfaction');
  }

  // Generate recommendations
  if (prediction.likelyToRefundAgain > 70) {
    prediction.recommendations.push('Consider proactive quality measures for this customer');
    prediction.recommendations.push('Add special monitoring to orders');
  }

  if (customerMetrics.totalSpent > 2000 && prediction.retentionRisk !== 'low') {
    prediction.recommendations.push('High-value customer at risk - consider retention offer');
  }

  return prediction;
}

export default {
  analyzeCustomerBehavior,
  benchmarkCustomer,
  predictCustomerBehavior
};
