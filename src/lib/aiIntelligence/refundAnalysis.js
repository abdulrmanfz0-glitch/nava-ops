/**
 * Refund Analysis Intelligence Engine
 * DeliveryOps MAX AI - Core refund analysis and pattern detection
 */

/**
 * Analyzes a single refund request and provides comprehensive insights
 * @param {Object} refund - Refund data
 * @param {Array} historicalRefunds - Historical refunds for context
 * @param {Object} customerBehavior - Customer behavior data
 * @param {Object} branchData - Branch performance data
 * @returns {Object} Comprehensive refund analysis
 */
export function analyzeRefund(refund, historicalRefunds = [], customerBehavior = null, branchData = null) {
  const analysis = {
    summary: '',
    rootCause: '',
    financialImpact: {
      estimatedLoss: refund.refund_amount,
      futureRisk: 0,
      recoveryPotential: 0
    },
    correctiveAction: [],
    preventionStrategy: [],
    fraudScore: 0,
    riskLevel: 'low',
    responsibleDepartment: '',
    patterns: [],
    recommendation: ''
  };

  // 1. Determine root cause
  analysis.rootCause = determineRootCause(refund);

  // 2. Calculate fraud score
  analysis.fraudScore = calculateRefundFraudScore(refund, customerBehavior, historicalRefunds);

  // 3. Determine risk level
  analysis.riskLevel = determineRiskLevel(analysis.fraudScore, refund.refund_amount);

  // 4. Identify responsible department
  analysis.responsibleDepartment = identifyResponsibleDepartment(refund);

  // 5. Calculate financial impact
  analysis.financialImpact = calculateFinancialImpact(refund, historicalRefunds, customerBehavior);

  // 6. Detect patterns
  analysis.patterns = detectRefundPatterns(refund, historicalRefunds);

  // 7. Generate corrective actions
  analysis.correctiveAction = generateCorrectiveActions(refund, analysis.rootCause, analysis.responsibleDepartment);

  // 8. Generate prevention strategy
  analysis.preventionStrategy = generatePreventionStrategy(refund, analysis.patterns, analysis.rootCause);

  // 9. Generate summary
  analysis.summary = generateRefundSummary(refund, analysis);

  // 10. Executive recommendation
  analysis.recommendation = generateExecutiveRecommendation(analysis, refund, customerBehavior);

  return analysis;
}

/**
 * Determines the root cause of a refund request
 */
function determineRootCause(refund) {
  const reason = refund.refund_reason?.toLowerCase() || '';

  const causeMap = {
    'late_delivery': {
      cause: 'Delivery exceeded expected timeframe',
      details: `Order was ${refund.delivery_duration_minutes || 'significantly'} minutes late`
    },
    'wrong_order': {
      cause: 'Order fulfillment error - incorrect items sent',
      details: 'Kitchen or packaging team sent wrong items'
    },
    'missing_items': {
      cause: 'Incomplete order - items missing from delivery',
      details: 'Packaging verification failed or driver tampering'
    },
    'quality_issue': {
      cause: 'Food quality below acceptable standards',
      details: 'Kitchen preparation or temperature control issue'
    },
    'cold_food': {
      cause: 'Food temperature not maintained during delivery',
      details: 'Delivery time too long or packaging inadequate'
    },
    'damaged_packaging': {
      cause: 'Packaging damaged during delivery',
      details: 'Rough handling by driver or inadequate packaging materials'
    },
    'customer_unavailable': {
      cause: 'Customer not available at delivery location',
      details: 'Communication issue or customer changed mind'
    },
    'cancelled_by_restaurant': {
      cause: 'Restaurant cancelled order',
      details: 'Inventory shortage or operational capacity issue'
    }
  };

  const matchedCause = Object.keys(causeMap).find(key => reason.includes(key));

  if (matchedCause) {
    const mapped = causeMap[matchedCause];
    return `${mapped.cause}. ${mapped.details}`;
  }

  // Check for timing issues
  if (refund.preparation_duration_minutes > 45) {
    return 'Excessive preparation time caused customer dissatisfaction';
  }

  if (refund.delivery_duration_minutes > 60) {
    return 'Delivery time exceeded acceptable limits (>60 minutes)';
  }

  return `Refund requested for: ${refund.refund_reason}. Requires detailed investigation.`;
}

/**
 * Calculates fraud score for a refund (0-100)
 */
function calculateRefundFraudScore(refund, customerBehavior, historicalRefunds) {
  let score = 0;

  // Customer behavior scoring (0-40 points)
  if (customerBehavior) {
    const refundRate = customerBehavior.refund_rate || 0;

    if (refundRate > 50) score += 40;
    else if (refundRate > 30) score += 30;
    else if (refundRate > 15) score += 20;
    else if (refundRate > 5) score += 10;

    // Frequent refunds indicator
    if (customerBehavior.refund_frequency_days < 3) score += 15;
    else if (customerBehavior.refund_frequency_days < 7) score += 10;
  }

  // Pattern-based scoring (0-30 points)
  const recentRefunds = historicalRefunds.filter(r =>
    r.customer_id === refund.customer_id &&
    new Date(r.refund_request_time) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  if (recentRefunds.length > 5) score += 30;
  else if (recentRefunds.length > 3) score += 20;
  else if (recentRefunds.length > 1) score += 10;

  // Refund timing patterns (0-15 points)
  const orderTime = new Date(refund.order_time);
  const refundTime = new Date(refund.refund_request_time);
  const timeDiffMinutes = (refundTime - orderTime) / (1000 * 60);

  // Very quick refund request (suspicious)
  if (timeDiffMinutes < 5) score += 15;
  else if (timeDiffMinutes < 15) score += 10;

  // High value refunds with vague reasons (0-15 points)
  if (refund.refund_amount > 200 && (!refund.refund_reason || refund.refund_reason.length < 20)) {
    score += 15;
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Determines risk level based on fraud score and amount
 */
function determineRiskLevel(fraudScore, amount) {
  if (fraudScore >= 80 || amount > 500) return 'critical';
  if (fraudScore >= 60 || amount > 300) return 'high';
  if (fraudScore >= 40 || amount > 150) return 'medium';
  return 'low';
}

/**
 * Identifies the department responsible for the issue
 */
function identifyResponsibleDepartment(refund) {
  const reason = refund.refund_reason?.toLowerCase() || '';

  if (reason.includes('late') || reason.includes('delay')) {
    if (refund.preparation_duration_minutes > 30) {
      return 'kitchen';
    }
    return 'delivery';
  }

  if (reason.includes('wrong') || reason.includes('missing') || reason.includes('incorrect')) {
    return 'packaging';
  }

  if (reason.includes('quality') || reason.includes('cold') || reason.includes('burnt') || reason.includes('raw')) {
    return 'kitchen';
  }

  if (reason.includes('damaged') || reason.includes('spilled') || reason.includes('driver')) {
    return 'delivery';
  }

  if (reason.includes('cancel') || reason.includes('unavailable')) {
    return 'operations';
  }

  if (reason.includes('app') || reason.includes('system') || reason.includes('payment')) {
    return 'platform';
  }

  return 'operations';
}

/**
 * Calculates comprehensive financial impact
 */
function calculateFinancialImpact(refund, historicalRefunds, customerBehavior) {
  const estimatedLoss = refund.refund_amount;

  // Calculate future risk based on patterns
  let futureRisk = 0;

  if (customerBehavior) {
    const refundRate = customerBehavior.refund_rate || 0;
    const avgOrderValue = customerBehavior.average_order_value || 0;

    // Predict future refunds from this customer
    if (refundRate > 30) {
      futureRisk = avgOrderValue * 3; // High risk customer
    } else if (refundRate > 15) {
      futureRisk = avgOrderValue * 1.5;
    }
  }

  // Calculate recovery potential based on fraud score
  const fraudScore = calculateRefundFraudScore(refund, customerBehavior, historicalRefunds);
  let recoveryPotential = 0;

  if (fraudScore > 70) {
    recoveryPotential = estimatedLoss * 0.8; // High chance of successful dispute
  } else if (fraudScore > 50) {
    recoveryPotential = estimatedLoss * 0.5;
  } else if (fraudScore > 30) {
    recoveryPotential = estimatedLoss * 0.3;
  }

  return {
    estimatedLoss: parseFloat(estimatedLoss.toFixed(2)),
    futureRisk: parseFloat(futureRisk.toFixed(2)),
    recoveryPotential: parseFloat(recoveryPotential.toFixed(2)),
    totalImpact: parseFloat((estimatedLoss + futureRisk).toFixed(2))
  };
}

/**
 * Detects patterns in refund data
 */
function detectRefundPatterns(refund, historicalRefunds) {
  const patterns = [];

  // Same customer pattern
  const customerRefunds = historicalRefunds.filter(r => r.customer_id === refund.customer_id);
  if (customerRefunds.length > 3) {
    patterns.push({
      type: 'repeat_customer',
      severity: customerRefunds.length > 5 ? 'high' : 'medium',
      description: `Customer has ${customerRefunds.length} previous refund requests`,
      action: 'Investigate customer history for fraud patterns'
    });
  }

  // Same item pattern
  if (refund.refunded_items && refund.refunded_items.length > 0) {
    const itemNames = refund.refunded_items.map(item => item.name || item.item_name);

    itemNames.forEach(itemName => {
      const itemRefunds = historicalRefunds.filter(r =>
        r.refunded_items?.some(i =>
          (i.name || i.item_name) === itemName
        )
      );

      if (itemRefunds.length > 5) {
        patterns.push({
          type: 'high_refund_item',
          severity: 'high',
          description: `Item "${itemName}" has ${itemRefunds.length} refund requests`,
          action: 'Review recipe, quality control, and preparation process'
        });
      }
    });
  }

  // Time pattern - peak refund hours
  if (refund.order_time) {
    const hour = new Date(refund.order_time).getHours();
    const sameHourRefunds = historicalRefunds.filter(r => {
      const refundHour = new Date(r.order_time).getHours();
      return Math.abs(refundHour - hour) <= 1;
    });

    if (sameHourRefunds.length > 10) {
      patterns.push({
        type: 'peak_time_issue',
        severity: 'medium',
        description: `High refund rate during ${hour}:00 - ${hour + 2}:00`,
        action: 'Increase staff or reduce order acceptance during peak hours'
      });
    }
  }

  // Driver pattern
  if (refund.driver_id) {
    const driverRefunds = historicalRefunds.filter(r => r.driver_id === refund.driver_id);

    if (driverRefunds.length > 5) {
      patterns.push({
        type: 'problematic_driver',
        severity: 'high',
        description: `Driver "${refund.driver_name || refund.driver_id}" associated with ${driverRefunds.length} refunds`,
        action: 'Review driver performance and provide training or replacement'
      });
    }
  }

  // Branch pattern
  if (refund.branch_id) {
    const branchRefunds = historicalRefunds.filter(r => r.branch_id === refund.branch_id);
    const recentBranchRefunds = branchRefunds.filter(r =>
      new Date(r.refund_request_time) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentBranchRefunds.length > 15) {
      patterns.push({
        type: 'branch_issue',
        severity: 'critical',
        description: `Branch has ${recentBranchRefunds.length} refunds in the last 7 days`,
        action: 'Immediate operational review required'
      });
    }
  }

  // Platform pattern
  const platformRefunds = historicalRefunds.filter(r => r.platform_name === refund.platform_name);
  const refundRate = historicalRefunds.length > 0 ? (platformRefunds.length / historicalRefunds.length) * 100 : 0;

  if (refundRate > 40) {
    patterns.push({
      type: 'platform_specific',
      severity: 'medium',
      description: `${refund.platform_name} accounts for ${refundRate.toFixed(1)}% of refunds`,
      action: 'Review platform-specific processes and customer expectations'
    });
  }

  return patterns;
}

/**
 * Generates step-by-step corrective actions
 */
function generateCorrectiveActions(refund, rootCause, department) {
  const actions = [];

  // Department-specific immediate actions
  switch (department) {
    case 'kitchen':
      actions.push({
        step: 1,
        action: 'Review preparation process for this order',
        responsible: 'Kitchen Manager',
        timeline: 'Immediate'
      });
      actions.push({
        step: 2,
        action: 'Check ingredient quality and storage conditions',
        responsible: 'Kitchen Manager',
        timeline: 'Today'
      });
      if (refund.preparation_duration_minutes > 30) {
        actions.push({
          step: 3,
          action: 'Analyze workflow bottlenecks during peak hours',
          responsible: 'Operations Manager',
          timeline: 'This week'
        });
      }
      break;

    case 'packaging':
      actions.push({
        step: 1,
        action: 'Implement double-check system for order verification',
        responsible: 'Packaging Team Lead',
        timeline: 'Immediate'
      });
      actions.push({
        step: 2,
        action: 'Review and update order checklist procedures',
        responsible: 'Operations Manager',
        timeline: 'This week'
      });
      break;

    case 'delivery':
      actions.push({
        step: 1,
        action: 'Contact driver for incident report',
        responsible: 'Delivery Manager',
        timeline: 'Immediate'
      });
      actions.push({
        step: 2,
        action: 'Review driver performance and delivery routes',
        responsible: 'Delivery Manager',
        timeline: 'Today'
      });
      if (refund.delivery_duration_minutes > 45) {
        actions.push({
          step: 3,
          action: 'Optimize delivery zone assignments',
          responsible: 'Operations Manager',
          timeline: 'This week'
        });
      }
      break;

    case 'operations':
      actions.push({
        step: 1,
        action: 'Review capacity management during order time',
        responsible: 'Operations Manager',
        timeline: 'Today'
      });
      actions.push({
        step: 2,
        action: 'Update order acceptance thresholds if needed',
        responsible: 'Operations Manager',
        timeline: 'This week'
      });
      break;

    case 'platform':
      actions.push({
        step: 1,
        action: 'Contact platform support to report technical issue',
        responsible: 'IT/Admin',
        timeline: 'Immediate'
      });
      actions.push({
        step: 2,
        action: 'Document issue for platform performance review',
        responsible: 'Operations Manager',
        timeline: 'Today'
      });
      break;
  }

  // Add customer communication action
  actions.push({
    step: actions.length + 1,
    action: 'Contact customer with resolution and goodwill gesture',
    responsible: 'Customer Service',
    timeline: 'Within 24 hours'
  });

  return actions;
}

/**
 * Generates prevention strategies
 */
function generatePreventionStrategy(refund, patterns, rootCause) {
  const strategies = [];

  // Operational improvements
  strategies.push({
    category: 'Operational',
    strategy: 'Implement real-time quality checkpoints',
    description: 'Add verification steps at kitchen exit and before delivery',
    expectedImprovement: '30-40%',
    riskIfIgnored: 'Continued refund losses and reputation damage'
  });

  // Technical improvements
  if (refund.preparation_duration_minutes > 30 || refund.delivery_duration_minutes > 45) {
    strategies.push({
      category: 'Technical',
      strategy: 'Deploy order tracking and time alerts',
      description: 'Automated alerts when orders exceed time thresholds',
      expectedImprovement: '25-35%',
      riskIfIgnored: 'Continued late deliveries and customer dissatisfaction'
    });
  }

  // Training improvements
  const department = identifyResponsibleDepartment(refund);
  strategies.push({
    category: 'Training',
    strategy: `Enhanced training for ${department} team`,
    description: `Focus on quality standards and error prevention`,
    expectedImprovement: '20-30%',
    riskIfIgnored: 'Recurring errors from same team'
  });

  // Pattern-based strategies
  patterns.forEach(pattern => {
    if (pattern.type === 'high_refund_item') {
      strategies.push({
        category: 'Product Quality',
        strategy: 'Menu item quality review',
        description: pattern.action,
        expectedImprovement: '40-50%',
        riskIfIgnored: 'Continued losses on specific items'
      });
    }

    if (pattern.type === 'peak_time_issue') {
      strategies.push({
        category: 'Capacity Planning',
        strategy: 'Peak hour staffing optimization',
        description: pattern.action,
        expectedImprovement: '30-40%',
        riskIfIgnored: 'Continued peak hour failures'
      });
    }

    if (pattern.type === 'problematic_driver') {
      strategies.push({
        category: 'Delivery Management',
        strategy: 'Driver performance intervention',
        description: pattern.action,
        expectedImprovement: '50-60%',
        riskIfIgnored: 'Continued driver-related refunds'
      });
    }
  });

  // Customer communication improvement
  strategies.push({
    category: 'Customer Experience',
    strategy: 'Proactive communication system',
    description: 'Notify customers of delays before they complain',
    expectedImprovement: '15-25%',
    riskIfIgnored: 'Customers feel ignored and request refunds'
  });

  return strategies;
}

/**
 * Generates executive summary
 */
function generateRefundSummary(refund, analysis) {
  const customerInfo = refund.customer_name ? ` from ${refund.customer_name}` : '';
  const platformInfo = refund.platform_name || 'delivery platform';

  return `${refund.refund_type} refund of ${refund.refund_amount.toFixed(2)} SAR requested${customerInfo} via ${platformInfo} due to ${refund.refund_reason}. Fraud score: ${analysis.fraudScore}/100 (${analysis.riskLevel} risk). ${analysis.responsibleDepartment} department responsible.`;
}

/**
 * Generates executive recommendation
 */
function generateExecutiveRecommendation(analysis, refund, customerBehavior) {
  const { fraudScore, riskLevel, financialImpact } = analysis;

  // High fraud score - recommend dispute
  if (fraudScore >= 70) {
    return {
      decision: 'DISPUTE',
      confidence: 'HIGH',
      reasoning: `Fraud score of ${fraudScore}/100 indicates suspicious pattern. Recovery potential: ${financialImpact.recoveryPotential.toFixed(2)} SAR`,
      nextSteps: [
        'Generate strong objection using AI',
        'Gather all evidence (timestamps, photos)',
        'Submit dispute to platform immediately'
      ]
    };
  }

  // Medium-high fraud with significant amount - investigate
  if (fraudScore >= 50 || refund.refund_amount > 200) {
    return {
      decision: 'INVESTIGATE',
      confidence: 'MEDIUM',
      reasoning: `Fraud score of ${fraudScore}/100 or high amount requires investigation before decision`,
      nextSteps: [
        'Review order details and evidence',
        'Check camera footage if available',
        'Contact driver for statement',
        'Review customer history',
        'Decide on approval or dispute'
      ]
    };
  }

  // Low fraud, reasonable amount - approve with note
  if (fraudScore < 30 && refund.refund_amount < 100) {
    return {
      decision: 'APPROVE',
      confidence: 'MEDIUM',
      reasoning: `Low fraud score (${fraudScore}/100) and reasonable amount. Maintain customer satisfaction`,
      nextSteps: [
        'Approve refund request',
        'Implement prevention strategy',
        'Monitor for pattern recurrence'
      ]
    };
  }

  // Default - reject politely
  return {
    decision: 'REJECT',
    confidence: 'MEDIUM',
    reasoning: `Insufficient evidence to support refund. Fraud score: ${fraudScore}/100`,
    nextSteps: [
      'Generate polite rejection message',
      'Offer alternative compensation if appropriate',
      'Monitor customer response'
    ]
  };
}

/**
 * Analyzes refund trends over time
 */
export function analyzeRefundTrends(refunds, timeframe = 30) {
  const now = new Date();
  const startDate = new Date(now.getTime() - timeframe * 24 * 60 * 60 * 1000);

  const recentRefunds = refunds.filter(r =>
    new Date(r.refund_request_time) >= startDate
  );

  const trends = {
    totalRefunds: recentRefunds.length,
    totalAmount: recentRefunds.reduce((sum, r) => sum + r.refund_amount, 0),
    averageAmount: 0,
    refundRate: 0,
    topReasons: [],
    topItems: [],
    peakHours: [],
    platformBreakdown: {},
    weekdayBreakdown: {},
    trend: 'stable'
  };

  if (trends.totalRefunds > 0) {
    trends.averageAmount = trends.totalAmount / trends.totalRefunds;

    // Top reasons
    const reasonCounts = {};
    recentRefunds.forEach(r => {
      reasonCounts[r.refund_reason] = (reasonCounts[r.refund_reason] || 0) + 1;
    });
    trends.topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count, percentage: (count / trends.totalRefunds * 100).toFixed(1) }));

    // Platform breakdown
    const platformCounts = {};
    recentRefunds.forEach(r => {
      platformCounts[r.platform_name] = (platformCounts[r.platform_name] || 0) + 1;
    });
    trends.platformBreakdown = platformCounts;

    // Peak hours
    const hourCounts = {};
    recentRefunds.forEach(r => {
      const hour = new Date(r.order_time).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    trends.peakHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));

    // Calculate trend direction
    const halfwayPoint = Math.floor(recentRefunds.length / 2);
    const firstHalf = recentRefunds.slice(0, halfwayPoint);
    const secondHalf = recentRefunds.slice(halfwayPoint);

    const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, r) => sum + r.refund_amount, 0) / firstHalf.length : 0;
    const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, r) => sum + r.refund_amount, 0) / secondHalf.length : 0;

    if (secondHalfAvg > firstHalfAvg * 1.2) {
      trends.trend = 'increasing';
    } else if (secondHalfAvg < firstHalfAvg * 0.8) {
      trends.trend = 'decreasing';
    }
  }

  return trends;
}

/**
 * Identifies high-risk items based on refund patterns
 */
export function identifyHighRiskItems(refunds) {
  const itemStats = {};

  refunds.forEach(refund => {
    if (refund.refunded_items && Array.isArray(refund.refunded_items)) {
      refund.refunded_items.forEach(item => {
        const itemName = item.name || item.item_name || 'Unknown';

        if (!itemStats[itemName]) {
          itemStats[itemName] = {
            name: itemName,
            refundCount: 0,
            totalAmount: 0,
            reasons: {}
          };
        }

        itemStats[itemName].refundCount++;
        itemStats[itemName].totalAmount += item.price || 0;

        const reason = refund.refund_reason || 'unknown';
        itemStats[itemName].reasons[reason] = (itemStats[itemName].reasons[reason] || 0) + 1;
      });
    }
  });

  // Convert to array and calculate risk scores
  const items = Object.values(itemStats).map(item => {
    const riskScore = Math.min(100, item.refundCount * 10 + (item.totalAmount / 100));
    const topReason = Object.entries(item.reasons)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      ...item,
      riskScore,
      topReason: topReason ? topReason[0] : 'unknown',
      topReasonCount: topReason ? topReason[1] : 0,
      averageRefundAmount: item.totalAmount / item.refundCount
    };
  });

  // Sort by risk score
  return items
    .sort((a, b) => b.riskScore - a.riskScore)
    .filter(item => item.refundCount >= 3); // Only items with 3+ refunds
}

/**
 * Analyzes branch refund performance
 */
export function analyzeBranchRefundPerformance(refunds, branchId) {
  const branchRefunds = refunds.filter(r => r.branch_id === branchId);

  if (branchRefunds.length === 0) {
    return {
      branchId,
      totalRefunds: 0,
      performance: 'No data',
      grade: 'N/A'
    };
  }

  const stats = {
    branchId,
    totalRefunds: branchRefunds.length,
    totalAmount: branchRefunds.reduce((sum, r) => sum + r.refund_amount, 0),
    averageAmount: 0,
    highRiskCount: branchRefunds.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length,
    approvedCount: branchRefunds.filter(r => r.status === 'approved').length,
    disputedCount: branchRefunds.filter(r => r.status === 'disputed').length,
    mainIssue: '',
    performance: '',
    grade: '',
    recommendations: []
  };

  stats.averageAmount = stats.totalAmount / stats.totalRefunds;

  // Identify main issue
  const reasonCounts = {};
  branchRefunds.forEach(r => {
    reasonCounts[r.refund_reason] = (reasonCounts[r.refund_reason] || 0) + 1;
  });
  const topReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];
  stats.mainIssue = topReason ? topReason[0] : 'various';

  // Calculate performance grade
  const refundRate = stats.totalRefunds; // Would need total orders to calculate proper rate
  if (refundRate < 5) {
    stats.grade = 'A';
    stats.performance = 'Excellent';
  } else if (refundRate < 10) {
    stats.grade = 'B';
    stats.performance = 'Good';
  } else if (refundRate < 20) {
    stats.grade = 'C';
    stats.performance = 'Needs Improvement';
  } else {
    stats.grade = 'D';
    stats.performance = 'Critical - Immediate Action Required';
  }

  // Generate recommendations
  if (stats.highRiskCount > stats.totalRefunds * 0.3) {
    stats.recommendations.push('High fraud risk detected - implement stricter verification');
  }

  if (stats.mainIssue.includes('late') || stats.mainIssue.includes('delay')) {
    stats.recommendations.push('Focus on reducing preparation and delivery times');
  }

  if (stats.mainIssue.includes('quality') || stats.mainIssue.includes('cold')) {
    stats.recommendations.push('Improve kitchen quality control and food temperature management');
  }

  return stats;
}
