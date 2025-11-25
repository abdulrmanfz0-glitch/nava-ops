/**
 * Mock Data Generator for DeliveryOps MAX AI
 * Generates realistic test data for refunds, disputes, and customer behavior
 */

export const generateMockRefunds = (count = 20) => {
  const platforms = ['Jahez', 'HungerStation', 'Marsool', 'Talabat', 'Careem'];
  const reasons = [
    'late_delivery',
    'wrong_order',
    'missing_items',
    'quality_issue',
    'cold_food',
    'damaged_packaging',
    'cancelled_by_restaurant'
  ];
  const statuses = ['pending', 'approved', 'rejected', 'disputed'];
  const riskLevels = ['low', 'medium', 'high', 'critical'];

  const refunds = [];

  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const amount = Math.floor(Math.random() * 300) + 50;
    const fraudScore = Math.floor(Math.random() * 100);

    let riskLevel;
    if (fraudScore >= 80) riskLevel = 'critical';
    else if (fraudScore >= 60) riskLevel = 'high';
    else if (fraudScore >= 40) riskLevel = 'medium';
    else riskLevel = 'low';

    const daysAgo = Math.floor(Math.random() * 30);
    const orderTime = new Date();
    orderTime.setDate(orderTime.getDate() - daysAgo);
    orderTime.setHours(Math.floor(Math.random() * 24));

    refunds.push({
      id: `ref_${Date.now()}_${i}`,
      platform_order_id: `ORD-${platform.substring(0, 3).toUpperCase()}-${10000 + i}`,
      platform_name: platform,
      refund_type: Math.random() > 0.3 ? 'full' : 'partial',
      refund_reason: reason,
      refund_amount: amount,
      original_order_amount: amount + Math.floor(Math.random() * 50),
      customer_id: `CUST-${Math.floor(Math.random() * 500) + 1000}`,
      customer_name: generateCustomerName(),
      driver_id: `DRV-${Math.floor(Math.random() * 100) + 100}`,
      driver_name: generateDriverName(),
      order_time: orderTime.toISOString(),
      delivery_time: new Date(orderTime.getTime() + (30 + Math.random() * 60) * 60000).toISOString(),
      refund_request_time: new Date(orderTime.getTime() + (60 + Math.random() * 120) * 60000).toISOString(),
      preparation_duration_minutes: Math.floor(15 + Math.random() * 30),
      delivery_duration_minutes: Math.floor(20 + Math.random() * 40),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      fraud_score: fraudScore,
      risk_level: riskLevel,
      root_cause: generateRootCause(reason),
      responsible_department: getDepartment(reason),
      estimated_loss: amount,
      recovery_potential: Math.floor(amount * (fraudScore / 100)),
      refunded_items: generateRefundedItems(),
      created_at: orderTime.toISOString(),
      updated_at: orderTime.toISOString()
    });
  }

  return refunds.sort((a, b) => new Date(b.refund_request_time) - new Date(a.refund_request_time));
};

export const generateMockDisputes = (count = 10) => {
  const levels = ['light', 'moderate', 'strong', 'hard', 'aggressive'];
  const statuses = ['draft', 'submitted', 'under_review', 'accepted', 'rejected'];

  const disputes = [];

  for (let i = 0; i < count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 20);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    disputes.push({
      id: `disp_${Date.now()}_${i}`,
      refund_id: `ref_${Date.now()}_${i}`,
      dispute_level: level,
      objection_text: generateDisputeText(level),
      generated_by_ai: true,
      ai_confidence: Math.floor(60 + Math.random() * 35),
      status: status,
      submitted_at: status !== 'draft' ? createdAt.toISOString() : null,
      resolved_at: status === 'accepted' || status === 'rejected' ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() : null,
      created_at: createdAt.toISOString(),
      updated_at: createdAt.toISOString(),
      refunds: {
        platform_order_id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
        platform_name: ['Jahez', 'HungerStation', 'Marsool'][Math.floor(Math.random() * 3)],
        refund_amount: Math.floor(Math.random() * 300) + 50
      }
    });
  }

  return disputes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const generateMockCustomers = (count = 50) => {
  const customerTypes = ['normal', 'high_value', 'fraud_suspect', 'repeat_offender', 'sensitive', 'angry'];
  const platforms = ['Jahez', 'HungerStation', 'Marsool', 'Talabat', 'Careem'];

  const customers = [];

  for (let i = 0; i < count; i++) {
    const totalOrders = Math.floor(Math.random() * 100) + 5;
    const totalRefunds = Math.floor(Math.random() * totalOrders * 0.4);
    const refundRate = (totalRefunds / totalOrders * 100).toFixed(1);
    const fraudScore = parseFloat(refundRate) > 30 ? Math.floor(60 + Math.random() * 40) : Math.floor(Math.random() * 60);
    const trustScore = 100 - fraudScore;

    let customerType;
    if (fraudScore >= 80) customerType = 'fraud_suspect';
    else if (fraudScore >= 60) customerType = 'repeat_offender';
    else if (totalOrders > 50 && fraudScore < 20) customerType = 'high_value';
    else if (fraudScore > 30 && fraudScore < 50) customerType = 'sensitive';
    else customerType = 'normal';

    customers.push({
      id: `cust_behavior_${i}`,
      customer_id: `CUST-${1000 + i}`,
      customer_name: generateCustomerName(),
      platform_name: platforms[Math.floor(Math.random() * platforms.length)],
      customer_type: customerType,
      total_orders: totalOrders,
      total_refund_requests: totalRefunds,
      approved_refunds: Math.floor(totalRefunds * 0.6),
      rejected_refunds: Math.floor(totalRefunds * 0.25),
      disputed_refunds: Math.floor(totalRefunds * 0.15),
      refund_rate: parseFloat(refundRate),
      total_spent: totalOrders * (80 + Math.random() * 120),
      total_refunded: totalRefunds * (70 + Math.random() * 100),
      average_order_value: 80 + Math.random() * 120,
      fraud_score: fraudScore,
      trust_score: trustScore,
      refund_frequency_days: totalRefunds > 1 ? (365 / totalRefunds).toFixed(1) : null,
      most_common_refund_reason: ['late_delivery', 'quality_issue', 'missing_items'][Math.floor(Math.random() * 3)],
      lifetime_value_score: totalOrders * (80 + Math.random() * 120) - totalRefunds * 70,
      recommended_action: fraudScore > 70 ? 'reject' : fraudScore > 50 ? 'investigate' : 'standard_review',
      recommended_objection_level: fraudScore > 70 ? 'hard' : fraudScore > 50 ? 'strong' : 'moderate',
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return customers.sort((a, b) => b.fraud_score - a.fraud_score);
};

export const generateMockPatterns = (count = 8) => {
  const patternTypes = [
    'peak_time',
    'high_refund_item',
    'problematic_driver',
    'packaging_issue',
    'branch_issue',
    'platform_specific'
  ];
  const severities = ['low', 'medium', 'high', 'critical'];

  const patterns = [];

  for (let i = 0; i < count; i++) {
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    const occurrenceCount = Math.floor(5 + Math.random() * 30);
    const totalLoss = occurrenceCount * (50 + Math.random() * 200);

    let severity;
    if (totalLoss > 3000 || occurrenceCount > 25) severity = 'critical';
    else if (totalLoss > 1500 || occurrenceCount > 15) severity = 'high';
    else if (totalLoss > 500 || occurrenceCount > 8) severity = 'medium';
    else severity = 'low';

    patterns.push({
      id: `pattern_${i}`,
      pattern_type: patternType,
      pattern_name: getPatternName(patternType),
      pattern_description: getPatternDescription(patternType, occurrenceCount),
      detection_date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      occurrence_count: occurrenceCount,
      affected_orders: Math.floor(occurrenceCount * 1.2),
      total_loss: totalLoss,
      severity: severity,
      status: Math.random() > 0.3 ? 'active' : 'monitoring',
      root_cause: getRootCauseForPattern(patternType),
      responsible_department: getDepartmentForPattern(patternType),
      expected_improvement_percentage: Math.floor(30 + Math.random() * 40),
      priority_score: severity === 'critical' ? 90 + Math.floor(Math.random() * 10) :
                      severity === 'high' ? 70 + Math.floor(Math.random() * 20) :
                      severity === 'medium' ? 40 + Math.floor(Math.random() * 30) :
                      Math.floor(Math.random() * 40)
    });
  }

  return patterns.sort((a, b) => b.priority_score - a.priority_score);
};

// Helper functions
function generateCustomerName() {
  const firstNames = ['Ahmed', 'Mohammed', 'Fatima', 'Sarah', 'Ali', 'Omar', 'Nora', 'Layla', 'Khalid', 'Rania'];
  const lastNames = ['Al-Rashid', 'Al-Harbi', 'Al-Otaibi', 'Al-Maliki', 'Al-Shahrani', 'Al-Qahtani', 'Al-Ghamdi'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateDriverName() {
  const names = ['Abdullah', 'Hassan', 'Youssef', 'Tariq', 'Samir', 'Faisal', 'Waleed', 'Rashid', 'Salem', 'Majid'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateRootCause(reason) {
  const causes = {
    late_delivery: 'Delivery exceeded expected timeframe due to high order volume',
    wrong_order: 'Order fulfillment error - incorrect items sent to customer',
    missing_items: 'Incomplete order - items missing from delivery',
    quality_issue: 'Food quality below acceptable standards',
    cold_food: 'Food temperature not maintained during delivery',
    damaged_packaging: 'Packaging damaged during delivery process',
    cancelled_by_restaurant: 'Restaurant cancelled order due to capacity issues'
  };
  return causes[reason] || 'Issue requires detailed investigation';
}

function getDepartment(reason) {
  const departments = {
    late_delivery: 'delivery',
    wrong_order: 'packaging',
    missing_items: 'packaging',
    quality_issue: 'kitchen',
    cold_food: 'kitchen',
    damaged_packaging: 'packaging',
    cancelled_by_restaurant: 'operations'
  };
  return departments[reason] || 'operations';
}

function generateRefundedItems() {
  const items = [
    { name: 'Grilled Chicken Meal', quantity: 1, price: 45 },
    { name: 'Beef Burger Combo', quantity: 1, price: 38 },
    { name: 'Margherita Pizza', quantity: 1, price: 52 },
    { name: 'Caesar Salad', quantity: 1, price: 28 },
    { name: 'Pasta Alfredo', quantity: 1, price: 42 }
  ];

  const count = Math.floor(Math.random() * 3) + 1;
  const selectedItems = [];

  for (let i = 0; i < count; i++) {
    selectedItems.push(items[Math.floor(Math.random() * items.length)]);
  }

  return selectedItems;
}

function generateDisputeText(level) {
  const texts = {
    light: 'We respectfully request a review of this refund claim...',
    moderate: 'Based on documented evidence, we dispute this refund request...',
    strong: 'We formally object to this refund claim with substantial evidence...',
    hard: 'URGENT: This claim exhibits suspicious patterns requiring immediate investigation...',
    aggressive: '🚨 FRAUD ALERT: Confirmed fraudulent activity detected...'
  };
  return texts[level] || 'Dispute objection generated by AI';
}

function getPatternName(type) {
  const names = {
    peak_time: 'Peak Hour Refund Surge',
    high_refund_item: 'High-Risk Menu Item',
    problematic_driver: 'Driver Performance Issue',
    packaging_issue: 'Packaging Quality Problem',
    branch_issue: 'Branch Operational Issue',
    platform_specific: 'Platform-Specific Pattern'
  };
  return names[type] || 'Detected Pattern';
}

function getPatternDescription(type, count) {
  const descriptions = {
    peak_time: `${count} refunds concentrated during 7-9 PM peak hours`,
    high_refund_item: `${count} refunds for the same menu item`,
    problematic_driver: `${count} refunds associated with specific driver`,
    packaging_issue: `${count} refunds due to damaged or leaking packaging`,
    branch_issue: `${count} refunds from single branch location`,
    platform_specific: `${count} refunds from specific delivery platform`
  };
  return descriptions[type] || `${count} occurrences detected`;
}

function getRootCauseForPattern(type) {
  const causes = {
    peak_time: 'Kitchen overwhelmed during peak hours, quality suffers',
    high_refund_item: 'Recipe or preparation issue with specific menu item',
    problematic_driver: 'Driver requires training or performance review',
    packaging_issue: 'Inadequate packaging materials or technique',
    branch_issue: 'Branch-specific operational problems',
    platform_specific: 'Platform algorithm or customer behavior pattern'
  };
  return causes[type] || 'Requires investigation';
}

function getDepartmentForPattern(type) {
  const departments = {
    peak_time: 'operations',
    high_refund_item: 'kitchen',
    problematic_driver: 'delivery',
    packaging_issue: 'packaging',
    branch_issue: 'management',
    platform_specific: 'operations'
  };
  return departments[type] || 'operations';
}

export const getMockDashboardData = () => {
  const refunds = generateMockRefunds(20);
  const disputes = generateMockDisputes(10);
  const patterns = generateMockPatterns(8);
  const customers = generateMockCustomers(50);

  const metrics = {
    totalRefunds: refunds.length,
    totalAmount: refunds.reduce((sum, r) => sum + r.refund_amount, 0),
    averageAmount: refunds.length > 0 ? refunds.reduce((sum, r) => sum + r.refund_amount, 0) / refunds.length : 0,
    pendingRefunds: refunds.filter(r => r.status === 'pending').length,
    highRiskRefunds: refunds.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length,
    activeDisputes: disputes.filter(d => d.status === 'submitted' || d.status === 'under_review').length,
    disputeSuccessRate: disputes.length > 0 ? (disputes.filter(d => d.status === 'accepted').length / disputes.length * 100).toFixed(1) : 0,
    criticalPatterns: patterns.filter(p => p.severity === 'critical').length
  };

  return {
    metrics,
    refunds: refunds.slice(0, 10),
    disputes: disputes.slice(0, 5),
    patterns: patterns.slice(0, 5),
    customers: customers.slice(0, 20),
    platforms: [
      { id: 1, platform_name: 'Jahez', platform_code: 'jahez', is_active: true },
      { id: 2, platform_name: 'HungerStation', platform_code: 'hungerstation', is_active: true },
      { id: 3, platform_name: 'Marsool', platform_code: 'marsool', is_active: true },
      { id: 4, platform_name: 'Talabat', platform_code: 'talabat', is_active: false },
      { id: 5, platform_name: 'Careem', platform_code: 'careem', is_active: true }
    ]
  };
};

export default {
  generateMockRefunds,
  generateMockDisputes,
  generateMockCustomers,
  generateMockPatterns,
  getMockDashboardData
};
