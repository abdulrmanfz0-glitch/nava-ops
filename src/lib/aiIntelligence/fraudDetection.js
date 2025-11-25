/**
 * Fraud & Abuse Detection System
 * DeliveryOps MAX AI - Advanced fraud detection and risk scoring
 */

/**
 * Comprehensive fraud analysis for a refund request
 * @param {Object} refund - Refund request data
 * @param {Object} customerBehavior - Customer behavior data
 * @param {Array} historicalRefunds - Historical refunds
 * @param {Array} allCustomerOrders - All customer orders
 * @returns {Object} Fraud analysis with score and indicators
 */
export function analyzeFraud(refund, customerBehavior, historicalRefunds = [], allCustomerOrders = []) {
  const analysis = {
    fraudScore: 0,
    riskLevel: 'low',
    fraudIndicators: [],
    suspiciousPatterns: [],
    recommendation: '',
    confidence: 0,
    evidenceStrength: 0,
    customerTrustScore: 100,
    notes: []
  };

  // Calculate fraud score using multiple detection methods
  const scores = {
    customerPatternScore: calculateCustomerPatternScore(customerBehavior, historicalRefunds),
    timingScore: calculateTimingScore(refund),
    amountScore: calculateAmountScore(refund, allCustomerOrders),
    frequencyScore: calculateFrequencyScore(historicalRefunds, refund),
    behaviorScore: calculateBehaviorScore(refund, customerBehavior),
    claimQualityScore: calculateClaimQualityScore(refund)
  };

  // Weighted fraud score calculation
  analysis.fraudScore = Math.round(
    scores.customerPatternScore * 0.25 +
    scores.timingScore * 0.15 +
    scores.amountScore * 0.15 +
    scores.frequencyScore * 0.25 +
    scores.behaviorScore * 0.15 +
    scores.claimQualityScore * 0.05
  );

  // Determine risk level
  analysis.riskLevel = determineRiskLevel(analysis.fraudScore, refund.refund_amount);

  // Identify fraud indicators
  analysis.fraudIndicators = identifyFraudIndicators(refund, customerBehavior, historicalRefunds, scores);

  // Detect suspicious patterns
  analysis.suspiciousPatterns = detectSuspiciousPatterns(refund, historicalRefunds, customerBehavior);

  // Calculate customer trust score
  analysis.customerTrustScore = calculateTrustScore(customerBehavior, analysis.fraudScore);

  // Calculate evidence strength
  analysis.evidenceStrength = calculateEvidenceStrength(refund, analysis.fraudIndicators);

  // Generate recommendation
  analysis.recommendation = generateFraudRecommendation(analysis, refund);

  // Generate notes
  analysis.notes = generateFraudNotes(analysis, refund, customerBehavior);

  // Confidence in fraud detection
  analysis.confidence = calculateDetectionConfidence(analysis, scores);

  return analysis;
}

/**
 * Calculate customer pattern score (0-100)
 */
function calculateCustomerPatternScore(customerBehavior, historicalRefunds) {
  if (!customerBehavior) return 0;

  let score = 0;

  // Refund rate scoring (0-40 points)
  const refundRate = customerBehavior.refund_rate || 0;
  if (refundRate > 60) score += 40;
  else if (refundRate > 40) score += 32;
  else if (refundRate > 25) score += 24;
  else if (refundRate > 15) score += 16;
  else if (refundRate > 8) score += 8;

  // Total refunds (0-30 points)
  const totalRefunds = customerBehavior.total_refund_requests || 0;
  if (totalRefunds > 20) score += 30;
  else if (totalRefunds > 10) score += 20;
  else if (totalRefunds > 5) score += 10;
  else if (totalRefunds > 2) score += 5;

  // Refund frequency (0-30 points)
  const frequency = customerBehavior.refund_frequency_days || Infinity;
  if (frequency < 2) score += 30;
  else if (frequency < 4) score += 25;
  else if (frequency < 7) score += 20;
  else if (frequency < 14) score += 10;

  return Math.min(score, 100);
}

/**
 * Calculate timing anomaly score (0-100)
 */
function calculateTimingScore(refund) {
  let score = 0;

  if (!refund.order_time || !refund.refund_request_time) return 0;

  const orderTime = new Date(refund.order_time);
  const refundTime = new Date(refund.refund_request_time);
  const deliveryTime = refund.delivery_time ? new Date(refund.delivery_time) : null;

  // Time between order and refund request
  const minutesToRefund = (refundTime - orderTime) / (1000 * 60);

  // Very quick refund request (suspicious)
  if (minutesToRefund < 5) score += 40;
  else if (minutesToRefund < 10) score += 30;
  else if (minutesToRefund < 15) score += 20;

  // If delivered, check time after delivery
  if (deliveryTime) {
    const minutesAfterDelivery = (refundTime - deliveryTime) / (1000 * 60);

    // Immediate refund request after delivery (very suspicious)
    if (minutesAfterDelivery < 2) score += 40;
    else if (minutesAfterDelivery < 5) score += 30;
    else if (minutesAfterDelivery < 10) score += 20;
    else if (minutesAfterDelivery > 120) score += 10; // Very late complaint also suspicious
  }

  // Order time patterns (late night orders have higher fraud)
  const hour = orderTime.getHours();
  if (hour >= 23 || hour < 5) score += 10; // Late night/early morning

  return Math.min(score, 100);
}

/**
 * Calculate amount anomaly score (0-100)
 */
function calculateAmountScore(refund, allCustomerOrders) {
  let score = 0;

  const amount = refund.refund_amount;
  const originalAmount = refund.original_order_amount || amount;

  // High value claims need more scrutiny
  if (amount > 500) score += 30;
  else if (amount > 300) score += 20;
  else if (amount > 200) score += 10;

  // Full refund requests are more suspicious than partial
  const refundPercentage = (amount / originalAmount) * 100;
  if (refundPercentage === 100) score += 15;
  else if (refundPercentage > 80) score += 10;

  // Compare to customer's average order value
  if (allCustomerOrders && allCustomerOrders.length > 0) {
    const avgOrderValue = allCustomerOrders.reduce((sum, order) => sum + (order.total || 0), 0) / allCustomerOrders.length;

    // Refund amount significantly higher than usual
    if (amount > avgOrderValue * 2) score += 25;
    else if (amount > avgOrderValue * 1.5) score += 15;
  }

  return Math.min(score, 100);
}

/**
 * Calculate frequency anomaly score (0-100)
 */
function calculateFrequencyScore(historicalRefunds, currentRefund) {
  let score = 0;

  // Recent refunds from same customer
  const customerRefunds = historicalRefunds.filter(r => r.customer_id === currentRefund.customer_id);

  // Last 7 days
  const recentRefunds7d = customerRefunds.filter(r =>
    new Date(r.refund_request_time) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  if (recentRefunds7d.length >= 3) score += 40;
  else if (recentRefunds7d.length >= 2) score += 25;

  // Last 30 days
  const recentRefunds30d = customerRefunds.filter(r =>
    new Date(r.refund_request_time) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  if (recentRefunds30d.length >= 10) score += 40;
  else if (recentRefunds30d.length >= 5) score += 25;
  else if (recentRefunds30d.length >= 3) score += 15;

  // Escalating refund amounts over time
  if (customerRefunds.length >= 3) {
    const amounts = customerRefunds.map(r => r.refund_amount).sort((a, b) => a - b);
    const isEscalating = amounts[amounts.length - 1] > amounts[0] * 1.5;

    if (isEscalating) score += 20;
  }

  return Math.min(score, 100);
}

/**
 * Calculate behavior anomaly score (0-100)
 */
function calculateBehaviorScore(refund, customerBehavior) {
  let score = 0;

  // Lack of evidence from customer
  if (!refund.customer_photos || refund.customer_photos.length === 0) {
    score += 15;
  }

  // Vague or generic complaint
  const reason = refund.refund_reason?.toLowerCase() || '';
  if (reason.length < 20) score += 15;

  // Generic complaints with no specifics
  if (reason.includes('bad') || reason.includes('not good') || reason.includes('terrible')) {
    if (!reason.includes('cold') && !reason.includes('late') && !reason.includes('missing')) {
      score += 10;
    }
  }

  // New customer with immediate refund request (suspicious)
  if (customerBehavior && customerBehavior.total_orders <= 2 && customerBehavior.total_refund_requests >= 1) {
    score += 25;
  }

  // Customer type indicators
  if (customerBehavior) {
    if (customerBehavior.customer_type === 'fraud_suspect') score += 40;
    else if (customerBehavior.customer_type === 'repeat_offender') score += 30;
    else if (customerBehavior.customer_type === 'angry') score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Calculate claim quality score (0-100)
 * Lower quality claims get higher scores
 */
function calculateClaimQualityScore(refund) {
  let score = 0;

  const reason = refund.refund_reason?.toLowerCase() || '';

  // Extremely vague reasons
  const vagueReasons = ['bad', 'not good', 'terrible', 'poor', 'unsatisfied'];
  if (vagueReasons.some(vague => reason === vague || reason === `${vague} quality`)) {
    score += 40;
  }

  // No detailed description
  if (reason.length < 15) score += 20;

  // No customer evidence provided
  if (!refund.customer_photos && !refund.customer_notes) {
    score += 20;
  }

  // Inconsistent claims
  if (reason.includes('cold') && reason.includes('burnt')) score += 20; // Contradictory
  if (reason.includes('missing') && refund.refund_type === 'full') score += 15; // Why full refund for missing item?

  return Math.min(score, 100);
}

/**
 * Determine risk level based on fraud score and amount
 */
function determineRiskLevel(fraudScore, amount) {
  if (fraudScore >= 85 || (fraudScore >= 70 && amount > 400)) return 'critical';
  if (fraudScore >= 70 || (fraudScore >= 50 && amount > 300)) return 'high';
  if (fraudScore >= 50 || (fraudScore >= 30 && amount > 200)) return 'medium';
  return 'low';
}

/**
 * Identify specific fraud indicators
 */
function identifyFraudIndicators(refund, customerBehavior, historicalRefunds, scores) {
  const indicators = [];

  // Customer pattern indicators
  if (scores.customerPatternScore >= 60) {
    indicators.push({
      type: 'customer_pattern',
      severity: 'high',
      indicator: 'Abnormal refund frequency',
      description: `Customer has ${customerBehavior?.total_refund_requests || 'multiple'} refund requests with ${customerBehavior?.refund_rate || 'high'}% refund rate`,
      score: scores.customerPatternScore
    });
  }

  // Timing indicators
  if (scores.timingScore >= 50) {
    indicators.push({
      type: 'timing',
      severity: 'medium',
      indicator: 'Suspicious timing pattern',
      description: 'Refund requested unusually quickly after order/delivery',
      score: scores.timingScore
    });
  }

  // Amount indicators
  if (scores.amountScore >= 40) {
    indicators.push({
      type: 'amount',
      severity: 'medium',
      indicator: 'Unusual refund amount',
      description: `High value refund (${refund.refund_amount} SAR) relative to customer history`,
      score: scores.amountScore
    });
  }

  // Frequency indicators
  if (scores.frequencyScore >= 50) {
    indicators.push({
      type: 'frequency',
      severity: 'high',
      indicator: 'High refund frequency',
      description: 'Multiple refund requests in short time period',
      score: scores.frequencyScore
    });
  }

  // Behavior indicators
  if (scores.behaviorScore >= 40) {
    indicators.push({
      type: 'behavior',
      severity: 'medium',
      indicator: 'Suspicious customer behavior',
      description: 'Behavioral patterns consistent with refund abuse',
      score: scores.behaviorScore
    });
  }

  // Lack of evidence
  if (!refund.customer_photos || refund.customer_photos.length === 0) {
    indicators.push({
      type: 'evidence',
      severity: 'low',
      indicator: 'No photographic evidence',
      description: 'Customer did not provide photos to support claim',
      score: 20
    });
  }

  // Vague complaint
  const reason = refund.refund_reason?.toLowerCase() || '';
  if (reason.length < 20) {
    indicators.push({
      type: 'claim_quality',
      severity: 'low',
      indicator: 'Vague complaint',
      description: 'Refund reason lacks specific details',
      score: 15
    });
  }

  return indicators;
}

/**
 * Detect suspicious patterns
 */
function detectSuspiciousPatterns(refund, historicalRefunds, customerBehavior) {
  const patterns = [];

  const customerRefunds = historicalRefunds.filter(r => r.customer_id === refund.customer_id);

  // Serial refunder pattern
  if (customerRefunds.length >= 5) {
    patterns.push({
      pattern: 'serial_refunder',
      severity: 'high',
      description: `Customer has requested ${customerRefunds.length} refunds`,
      confidence: 90
    });
  }

  // Same excuse pattern
  const reasonCounts = {};
  customerRefunds.forEach(r => {
    const reason = r.refund_reason || 'unknown';
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  const maxReasonCount = Math.max(...Object.values(reasonCounts), 0);
  if (maxReasonCount >= 3) {
    const topReason = Object.entries(reasonCounts).find(([_, count]) => count === maxReasonCount)?.[0];
    patterns.push({
      pattern: 'repeated_excuse',
      severity: 'medium',
      description: `Customer repeatedly uses same excuse: "${topReason}" (${maxReasonCount} times)`,
      confidence: 75
    });
  }

  // Time-based pattern (always orders/refunds at certain times)
  const hours = customerRefunds.map(r => new Date(r.order_time).getHours());
  const hourCounts = {};
  hours.forEach(h => hourCounts[h] = (hourCounts[h] || 0) + 1);

  const maxHourCount = Math.max(...Object.values(hourCounts), 0);
  if (maxHourCount >= 4) {
    patterns.push({
      pattern: 'time_based',
      severity: 'low',
      description: 'Customer orders/refunds predominantly at specific times',
      confidence: 60
    });
  }

  // Escalating amounts pattern
  if (customerRefunds.length >= 3) {
    const sortedByDate = [...customerRefunds].sort((a, b) =>
      new Date(a.refund_request_time) - new Date(b.refund_request_time)
    );

    const amounts = sortedByDate.map(r => r.refund_amount);
    let isEscalating = true;

    for (let i = 1; i < Math.min(amounts.length, 5); i++) {
      if (amounts[i] < amounts[i - 1]) {
        isEscalating = false;
        break;
      }
    }

    if (isEscalating && amounts.length >= 3) {
      patterns.push({
        pattern: 'escalating_amounts',
        severity: 'high',
        description: 'Refund amounts increasing over time (testing limits)',
        confidence: 85
      });
    }
  }

  // Platform hopping (if data available across platforms)
  const platforms = [...new Set(customerRefunds.map(r => r.platform_name))];
  if (platforms.length >= 3) {
    patterns.push({
      pattern: 'platform_hopping',
      severity: 'medium',
      description: `Customer operates across ${platforms.length} platforms`,
      confidence: 70
    });
  }

  // Quick succession pattern
  const last24hRefunds = customerRefunds.filter(r =>
    new Date(r.refund_request_time) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  if (last24hRefunds.length >= 2) {
    patterns.push({
      pattern: 'rapid_succession',
      severity: 'high',
      description: `${last24hRefunds.length} refund requests in last 24 hours`,
      confidence: 90
    });
  }

  // Driver collusion pattern
  if (refund.driver_id) {
    const sameDriverRefunds = customerRefunds.filter(r => r.driver_id === refund.driver_id);

    if (sameDriverRefunds.length >= 3) {
      patterns.push({
        pattern: 'potential_collusion',
        severity: 'critical',
        description: `Multiple refunds with same driver "${refund.driver_name || refund.driver_id}" - possible collusion`,
        confidence: 85
      });
    }
  }

  return patterns;
}

/**
 * Calculate trust score (inverse of fraud score)
 */
function calculateTrustScore(customerBehavior, fraudScore) {
  let trustScore = 100 - fraudScore;

  // Adjust based on customer history
  if (customerBehavior) {
    const totalOrders = customerBehavior.total_orders || 0;
    const totalRefunds = customerBehavior.total_refund_requests || 0;

    // Good history bonus
    if (totalOrders > 20 && totalRefunds === 0) {
      trustScore = Math.min(100, trustScore + 20);
    } else if (totalOrders > 10 && totalRefunds <= 1) {
      trustScore = Math.min(100, trustScore + 10);
    }

    // High-value customer bonus
    const lifetimeValue = customerBehavior.total_spent || 0;
    if (lifetimeValue > 5000) {
      trustScore = Math.min(100, trustScore + 10);
    } else if (lifetimeValue > 2000) {
      trustScore = Math.min(100, trustScore + 5);
    }
  }

  return Math.max(0, Math.min(100, Math.round(trustScore)));
}

/**
 * Calculate evidence strength (how strong is our case?)
 */
function calculateEvidenceStrength(refund, fraudIndicators) {
  let strength = 0;

  // Number of fraud indicators
  strength += Math.min(fraudIndicators.length * 10, 40);

  // Severity of indicators
  const highSeverity = fraudIndicators.filter(i => i.severity === 'high' || i.severity === 'critical').length;
  strength += highSeverity * 15;

  // Our documentation
  if (refund.preparation_duration_minutes !== undefined) strength += 10;
  if (refund.delivery_duration_minutes !== undefined) strength += 10;
  if (refund.delivery_time) strength += 10;

  // Within acceptable service times
  if (refund.preparation_duration_minutes < 30) strength += 10;
  if (refund.delivery_duration_minutes < 60) strength += 10;

  return Math.min(100, Math.round(strength));
}

/**
 * Generate fraud recommendation
 */
function generateFraudRecommendation(analysis, refund) {
  const { fraudScore, riskLevel, fraudIndicators } = analysis;

  if (fraudScore >= 85) {
    return {
      action: 'REJECT_AND_INVESTIGATE',
      reasoning: `Critical fraud risk (${fraudScore}/100). Immediate investigation required.`,
      disputeLevel: 'aggressive',
      additionalActions: [
        'File dispute immediately',
        'Request customer account review',
        'Flag for platform fraud team',
        'Consider blocking customer'
      ]
    };
  }

  if (fraudScore >= 70) {
    return {
      action: 'DISPUTE',
      reasoning: `High fraud risk (${fraudScore}/100). Strong evidence warrants aggressive dispute.`,
      disputeLevel: 'hard',
      additionalActions: [
        'Generate hard objection',
        'Attach all evidence',
        'Request platform investigation',
        'Monitor customer closely'
      ]
    };
  }

  if (fraudScore >= 50) {
    return {
      action: 'DISPUTE',
      reasoning: `Moderate fraud risk (${fraudScore}/100). Evidence supports dispute.`,
      disputeLevel: 'strong',
      additionalActions: [
        'Generate strong objection',
        'Include detailed evidence',
        'Request thorough review'
      ]
    };
  }

  if (fraudScore >= 30) {
    return {
      action: 'REVIEW_CAREFULLY',
      reasoning: `Low-moderate fraud risk (${fraudScore}/100). Requires careful review.`,
      disputeLevel: 'moderate',
      additionalActions: [
        'Review all evidence',
        'Generate moderate objection if justified',
        'Consider customer history'
      ]
    };
  }

  return {
    action: 'STANDARD_REVIEW',
    reasoning: `Low fraud risk (${fraudScore}/100). Handle as standard case.`,
    disputeLevel: 'light',
    additionalActions: [
      'Review legitimacy of claim',
      'Respond professionally',
      'Maintain customer relationship if appropriate'
    ]
  };
}

/**
 * Generate fraud analysis notes
 */
function generateFraudNotes(analysis, refund, customerBehavior) {
  const notes = [];

  // Overall assessment
  notes.push(`Fraud Risk: ${analysis.riskLevel.toUpperCase()} (Score: ${analysis.fraudScore}/100)`);
  notes.push(`Trust Score: ${analysis.customerTrustScore}/100`);
  notes.push(`Evidence Strength: ${analysis.evidenceStrength}/100`);

  // Key findings
  if (analysis.fraudIndicators.length > 0) {
    notes.push(`\nKey Fraud Indicators (${analysis.fraudIndicators.length}):`);
    analysis.fraudIndicators.forEach((indicator, index) => {
      notes.push(`  ${index + 1}. ${indicator.indicator}: ${indicator.description}`);
    });
  }

  // Suspicious patterns
  if (analysis.suspiciousPatterns.length > 0) {
    notes.push(`\nSuspicious Patterns Detected (${analysis.suspiciousPatterns.length}):`);
    analysis.suspiciousPatterns.forEach((pattern, index) => {
      notes.push(`  ${index + 1}. ${pattern.pattern}: ${pattern.description} (Confidence: ${pattern.confidence}%)`);
    });
  }

  // Customer profile
  if (customerBehavior) {
    notes.push(`\nCustomer Profile:`);
    notes.push(`  - Total Orders: ${customerBehavior.total_orders || 0}`);
    notes.push(`  - Total Refunds: ${customerBehavior.total_refund_requests || 0}`);
    notes.push(`  - Refund Rate: ${customerBehavior.refund_rate || 0}%`);
    notes.push(`  - Customer Type: ${customerBehavior.customer_type || 'normal'}`);
    notes.push(`  - Lifetime Value: ${customerBehavior.total_spent || 0} SAR`);
  }

  // Recommendation
  notes.push(`\nRecommended Action: ${analysis.recommendation.action}`);
  notes.push(`Recommended Dispute Level: ${analysis.recommendation.disputeLevel}`);

  return notes;
}

/**
 * Calculate detection confidence
 */
function calculateDetectionConfidence(analysis, scores) {
  let confidence = 50; // Base confidence

  // Multiple indicators increase confidence
  if (analysis.fraudIndicators.length >= 4) confidence += 30;
  else if (analysis.fraudIndicators.length >= 2) confidence += 15;

  // High severity indicators increase confidence
  const highSeverity = analysis.fraudIndicators.filter(i =>
    i.severity === 'high' || i.severity === 'critical'
  ).length;

  confidence += highSeverity * 10;

  // Detected patterns increase confidence
  confidence += Math.min(analysis.suspiciousPatterns.length * 5, 20);

  // Consistent scores across methods increase confidence
  const scoreValues = Object.values(scores);
  const avgScore = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
  const variance = scoreValues.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scoreValues.length;

  if (variance < 100) confidence += 10; // Low variance = consistent detection

  return Math.min(100, Math.round(confidence));
}

/**
 * Detect driver-customer collusion
 */
export function detectDriverCollusion(refunds) {
  const collisionRisks = [];
  const driverCustomerPairs = {};

  refunds.forEach(refund => {
    if (refund.driver_id && refund.customer_id) {
      const pairKey = `${refund.driver_id}_${refund.customer_id}`;

      if (!driverCustomerPairs[pairKey]) {
        driverCustomerPairs[pairKey] = {
          driverId: refund.driver_id,
          driverName: refund.driver_name,
          customerId: refund.customer_id,
          customerName: refund.customer_name,
          refunds: [],
          totalAmount: 0
        };
      }

      driverCustomerPairs[pairKey].refunds.push(refund);
      driverCustomerPairs[pairKey].totalAmount += refund.refund_amount;
    }
  });

  // Identify suspicious pairs
  Object.values(driverCustomerPairs).forEach(pair => {
    if (pair.refunds.length >= 3) {
      collisionRisks.push({
        driver: {
          id: pair.driverId,
          name: pair.driverName
        },
        customer: {
          id: pair.customerId,
          name: pair.customerName
        },
        refundCount: pair.refunds.length,
        totalAmount: pair.totalAmount,
        riskScore: Math.min(100, pair.refunds.length * 25),
        severity: pair.refunds.length >= 5 ? 'critical' : 'high',
        recommendation: 'Investigate potential collusion between driver and customer'
      });
    }
  });

  return collisionRisks.sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Analyze quantity manipulation fraud
 */
export function detectQuantityManipulation(refund, orderData) {
  const indicators = [];

  if (refund.refunded_items && Array.isArray(refund.refunded_items)) {
    refund.refunded_items.forEach(item => {
      const claimedQuantity = item.quantity || 1;
      const itemName = item.name || item.item_name;

      // Unusually high quantities are suspicious
      if (claimedQuantity > 10) {
        indicators.push({
          type: 'high_quantity',
          item: itemName,
          quantity: claimedQuantity,
          suspicionLevel: 'high',
          note: 'Unusually high quantity claim'
        });
      }

      // Check if claimed quantity matches order (if order data available)
      if (orderData && orderData.items) {
        const originalItem = orderData.items.find(i =>
          (i.name || i.item_name) === itemName
        );

        if (originalItem && originalItem.quantity < claimedQuantity) {
          indicators.push({
            type: 'quantity_mismatch',
            item: itemName,
            claimed: claimedQuantity,
            actual: originalItem.quantity,
            suspicionLevel: 'critical',
            note: 'Claimed quantity exceeds order quantity - clear fraud attempt'
          });
        }
      }
    });
  }

  return {
    hasSuspiciousActivity: indicators.length > 0,
    indicators,
    riskLevel: indicators.some(i => i.suspicionLevel === 'critical') ? 'critical' : 'high'
  };
}

/**
 * Generate fraud report for customer
 */
export function generateCustomerFraudReport(customerId, allRefunds, allOrders) {
  const customerRefunds = allRefunds.filter(r => r.customer_id === customerId);
  const customerOrders = allOrders.filter(o => o.customer_id === customerId);

  const report = {
    customerId,
    analysisDate: new Date().toISOString(),
    metrics: {
      totalOrders: customerOrders.length,
      totalRefunds: customerRefunds.length,
      refundRate: customerOrders.length > 0 ? (customerRefunds.length / customerOrders.length * 100).toFixed(2) : 0,
      totalRefundAmount: customerRefunds.reduce((sum, r) => sum + r.refund_amount, 0),
      totalOrderAmount: customerOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      averageRefundAmount: customerRefunds.length > 0 ? (customerRefunds.reduce((sum, r) => sum + r.refund_amount, 0) / customerRefunds.length).toFixed(2) : 0
    },
    timeline: {
      firstOrder: customerOrders.length > 0 ? customerOrders[0].order_time : null,
      lastOrder: customerOrders.length > 0 ? customerOrders[customerOrders.length - 1].order_time : null,
      firstRefund: customerRefunds.length > 0 ? customerRefunds[0].refund_request_time : null,
      lastRefund: customerRefunds.length > 0 ? customerRefunds[customerRefunds.length - 1].refund_request_time : null
    },
    patterns: detectSuspiciousPatterns({ customer_id: customerId }, customerRefunds, null),
    riskAssessment: {
      fraudScore: 0,
      riskLevel: 'low',
      trustScore: 100,
      recommendation: ''
    }
  };

  // Calculate overall fraud score for customer
  if (customerRefunds.length > 0) {
    const latestAnalysis = analyzeFraud(
      customerRefunds[customerRefunds.length - 1],
      {
        total_orders: report.metrics.totalOrders,
        total_refund_requests: report.metrics.totalRefunds,
        refund_rate: parseFloat(report.metrics.refundRate),
        total_spent: report.metrics.totalOrderAmount
      },
      customerRefunds,
      customerOrders
    );

    report.riskAssessment = {
      fraudScore: latestAnalysis.fraudScore,
      riskLevel: latestAnalysis.riskLevel,
      trustScore: latestAnalysis.customerTrustScore,
      recommendation: latestAnalysis.recommendation.action
    };
  }

  return report;
}

export default {
  analyzeFraud,
  detectDriverCollusion,
  detectQuantityManipulation,
  generateCustomerFraudReport
};
