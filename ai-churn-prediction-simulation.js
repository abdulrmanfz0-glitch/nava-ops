/**
 * CHURN PREDICTION SIMULATION
 * Demonstrates AI-powered customer churn prediction and automated retention campaigns
 * Based on Commit 54a06c0 - AI Ecosystem Relaunch
 */

// ============================================================================
// MOCK LOGGER (Node.js compatible)
// ============================================================================
class MockLogger {
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const emoji = { info: '📘', warn: '⚠️', error: '❌', debug: '🔍' }[level] || '📝';
    console.log(`${emoji} [${timestamp}] [${level.toUpperCase()}] ${message}`);
    if (Object.keys(data).length > 0) {
      console.log('   Data:', JSON.stringify(data, null, 2));
    }
  }
  info(msg, data) { this.log('info', msg, data); }
  warn(msg, data) { this.log('warn', msg, data); }
  error(msg, data) { this.log('error', msg, data); }
  debug(msg, data) { this.log('debug', msg, data); }
}

const logger = new MockLogger();

// ============================================================================
// CHURN PREDICTOR (Simplified for simulation)
// ============================================================================
class ChurnPredictor {
  constructor() {
    this.riskThresholds = { high: 0.7, medium: 0.4, low: 0.2 };
  }

  predictChurnRisk(customer, orderHistory = []) {
    logger.debug(`Analyzing churn risk for customer ${customer.id}`);

    const features = this.extractFeatures(customer, orderHistory);
    const riskScore = this.calculateRiskScore(features);
    const riskLevel = this.determineRiskLevel(riskScore);
    const churnFactors = this.identifyChurnFactors(features);
    const recommendations = this.generateRetentionRecommendations(riskLevel, churnFactors);

    return {
      customerId: customer.id,
      customerName: customer.name,
      riskScore,
      riskLevel,
      churnProbability: `${(riskScore * 100).toFixed(1)}%`,
      daysUntilChurn: this.estimateDaysUntilChurn(riskScore, features),
      churnFactors,
      recommendations,
      analyzed: new Date().toISOString()
    };
  }

  extractFeatures(customer, orderHistory) {
    const now = new Date();
    const recentOrders = orderHistory.filter(o => {
      const orderDate = new Date(o.date);
      const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 90;
    });

    const lastOrderDate = orderHistory.length > 0
      ? new Date(Math.max(...orderHistory.map(o => new Date(o.date))))
      : null;
    const recency = lastOrderDate ? (now - lastOrderDate) / (1000 * 60 * 60 * 24) : 999;

    const frequency = recentOrders.length / 3;
    const monetary = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = monetary / (recentOrders.length || 1);
    const engagementScore = this.calculateEngagementScore(customer, orderHistory);
    const orderTrend = this.calculateOrderTrend(orderHistory);

    return {
      recency,
      frequency,
      monetary,
      avgOrderValue,
      engagementScore,
      orderTrend,
      totalOrders: orderHistory.length,
      customerTenure: customer.joinedDate
        ? (now - new Date(customer.joinedDate)) / (1000 * 60 * 60 * 24)
        : 30,
      complaintsCount: customer.complaints || 0,
      satisfactionScore: customer.satisfactionScore || 3.5
    };
  }

  calculateRiskScore(features) {
    const recencyRisk = this.normalizeRecency(features.recency);
    const frequencyRisk = this.normalizeFrequency(features.frequency);
    const monetaryRisk = 1 - this.normalizeMonetary(features.monetary);
    const engagementRisk = 1 - features.engagementScore;
    const trendRisk = features.orderTrend < 0 ? 0.8 : 0.2;
    const satisfactionRisk = 1 - (features.satisfactionScore / 5);

    const riskScore = (
      recencyRisk * 0.30 +
      frequencyRisk * 0.25 +
      monetaryRisk * 0.15 +
      engagementRisk * 0.15 +
      trendRisk * 0.10 +
      satisfactionRisk * 0.05
    );

    return Math.max(0, Math.min(1, riskScore));
  }

  normalizeRecency(recency) {
    if (recency > 60) return 1.0;
    if (recency > 30) return 0.7;
    if (recency > 14) return 0.4;
    return 0.1;
  }

  normalizeFrequency(frequency) {
    if (frequency < 0.5) return 1.0;
    if (frequency < 1) return 0.7;
    if (frequency < 2) return 0.4;
    return 0.1;
  }

  normalizeMonetary(monetary) {
    if (monetary < 100) return 0.1;
    if (monetary < 500) return 0.4;
    if (monetary < 1000) return 0.7;
    return 1.0;
  }

  calculateEngagementScore(customer, orderHistory) {
    let score = 0.5;
    if (customer.emailOpens > 0) score += 0.1;
    if (customer.appLogins > 5) score += 0.2;
    if (orderHistory.length > 10) score += 0.1;
    const recentActivity = orderHistory.filter(o => {
      const daysDiff = (new Date() - new Date(o.date)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    if (recentActivity.length > 0) score += 0.1;
    return Math.min(1, score);
  }

  calculateOrderTrend(orderHistory) {
    if (orderHistory.length < 4) return 0;
    const recentOrders = orderHistory.slice(-6);
    const firstHalf = recentOrders.slice(0, 3);
    const secondHalf = recentOrders.slice(3);
    const firstAvg = firstHalf.reduce((sum, o) => sum + (o.total || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, o) => sum + (o.total || 0), 0) / secondHalf.length;
    return secondAvg > firstAvg ? 1 : -1;
  }

  determineRiskLevel(riskScore) {
    if (riskScore >= this.riskThresholds.high) return 'high';
    if (riskScore >= this.riskThresholds.medium) return 'medium';
    return 'low';
  }

  identifyChurnFactors(features) {
    const factors = [];

    if (features.recency > 30) {
      factors.push({
        factor: 'Inactive Customer',
        severity: 'high',
        description: `No orders in ${Math.floor(features.recency)} days`,
        impact: 0.9
      });
    }

    if (features.frequency < 1) {
      factors.push({
        factor: 'Low Order Frequency',
        severity: 'high',
        description: 'Less than 1 order per month',
        impact: 0.8
      });
    }

    if (features.orderTrend < 0) {
      factors.push({
        factor: 'Declining Orders',
        severity: 'medium',
        description: 'Order volume trending downward',
        impact: 0.7
      });
    }

    if (features.satisfactionScore < 3) {
      factors.push({
        factor: 'Low Satisfaction',
        severity: 'high',
        description: `Satisfaction score: ${features.satisfactionScore}/5`,
        impact: 0.85
      });
    }

    if (features.engagementScore < 0.3) {
      factors.push({
        factor: 'Poor Engagement',
        severity: 'medium',
        description: 'Minimal interaction with platform',
        impact: 0.6
      });
    }

    return factors.sort((a, b) => b.impact - a.impact);
  }

  estimateDaysUntilChurn(riskScore, features) {
    if (riskScore < this.riskThresholds.medium) return null;
    const daysRemaining = Math.floor((1 - riskScore) * 60);
    return Math.max(1, daysRemaining);
  }

  generateRetentionRecommendations(riskLevel, churnFactors) {
    const recommendations = [];

    if (riskLevel === 'high') {
      recommendations.push({
        priority: 'urgent',
        action: 'immediate_intervention',
        title: 'Immediate Re-engagement Campaign',
        description: 'Deploy personalized win-back offer within 24 hours',
        expectedImpact: 'high',
        estimatedCost: 'SAR 50-100 per customer',
        successRate: '35%'
      });
    }

    churnFactors.forEach(factor => {
      if (factor.factor === 'Inactive Customer') {
        recommendations.push({
          priority: 'high',
          action: 'reactivation_campaign',
          title: 'Send Exclusive Comeback Offer',
          description: '20% discount on next order + free delivery',
          expectedImpact: 'high',
          estimatedCost: 'SAR 30-50',
          successRate: '40%'
        });
      }

      if (factor.factor === 'Low Satisfaction') {
        recommendations.push({
          priority: 'high',
          action: 'service_recovery',
          title: 'Personal Outreach from Manager',
          description: 'Address concerns and offer compensation',
          expectedImpact: 'medium',
          estimatedCost: 'SAR 20-40',
          successRate: '50%'
        });
      }
    });

    return recommendations.slice(0, 3);
  }
}

// ============================================================================
// ACT NOW AUTOMATION ENGINE (Churn Prevention Actions)
// ============================================================================
class ActNowAutomationEngine {
  constructor() {
    this.actionHistory = [];
  }

  async executeRetentionAction(churnPrediction, recommendation) {
    logger.info(`⚡ Executing retention action: ${recommendation.action}`);

    const result = await this.sendRetentionOffer({
      customerId: churnPrediction.customerId,
      customerName: churnPrediction.customerName,
      offerType: recommendation.action,
      riskLevel: churnPrediction.riskLevel
    });

    this.actionHistory.push({
      customerId: churnPrediction.customerId,
      action: recommendation.action,
      result,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      status: 'executed',
      result,
      message: `Retention action '${recommendation.action}' executed successfully`
    };
  }

  async sendRetentionOffer(params) {
    const { customerId, customerName, offerType, riskLevel } = params;
    logger.info(`💌 Sending retention offer to ${customerName} (ID: ${customerId})`);

    const offers = {
      immediate_intervention: { discount: 25, freeDelivery: true, bonus: '100 loyalty points' },
      reactivation_campaign: { discount: 20, freeDelivery: true, bonus: '50 loyalty points' },
      service_recovery: { discount: 15, freeDelivery: true, bonus: 'Personal call from manager' }
    };

    const offer = offers[offerType] || offers.reactivation_campaign;

    return {
      offerId: `OFFER-${Date.now()}`,
      customerId,
      customerName,
      offerType,
      discount: `${offer.discount}%`,
      freeDelivery: offer.freeDelivery,
      bonus: offer.bonus,
      validUntil: this.calculateOfferExpiry(7),
      deliveryChannel: 'email + SMS',
      sent: true,
      estimatedValue: `SAR ${offer.discount * 10}`
    };
  }

  calculateOfferExpiry(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}

// ============================================================================
// MOCK CHAT SERVICE
// ============================================================================
class MockChatService {
  constructor() {
    this.conversationMemory = [];
  }

  async sendMessage(userMessage, context = {}) {
    logger.info(`💬 User: ${userMessage}`);
    this.conversationMemory.push({ role: 'user', content: userMessage });

    const response = this.generateResponse(userMessage, context);
    this.conversationMemory.push({ role: 'assistant', content: response });

    logger.info(`🤖 NAVA AI: ${response}`);
    return { success: true, message: response };
  }

  generateResponse(userMessage, context) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('why') && lowerMessage.includes('risk')) {
      return `I identified **${context.customerName}** as a **${context.riskLevel.toUpperCase()} RISK** customer for churn based on advanced behavioral analysis:

**Churn Risk Assessment:**
- 🎯 Churn Probability: **${context.churnProbability}**
- ⏱️ Estimated days until churn: **${context.daysUntilChurn} days**
- 📊 Risk Score: **${(context.riskScore * 100).toFixed(1)}/100**

**Key Risk Factors Detected:**
${context.churnFactors.map((f, i) => `${i + 1}. **${f.factor}** (${f.severity} severity)
   - ${f.description}
   - Impact: ${(f.impact * 100).toFixed(0)}%`).join('\n')}

**Predictive Model Used:**
- RFM Analysis (Recency, Frequency, Monetary)
- Engagement Score: ${(context.engagementScore * 100).toFixed(0)}%
- Order Trend: ${context.orderTrend > 0 ? 'Increasing ↑' : 'Declining ↓'}
- Customer Tenure: ${Math.floor(context.customerTenure)} days

This multi-factor analysis allows us to intervene proactively before the customer churns.`;
    }

    if (lowerMessage.includes('what') && lowerMessage.includes('action')) {
      return `I automatically triggered a **${context.actionType}** through the Act Now automation system:

**Action Details:**
- 📧 Offer ID: ${context.offerId}
- 🎁 Discount: ${context.discount}
- 🚚 Free Delivery: ${context.freeDelivery ? 'YES' : 'NO'}
- 🎉 Bonus: ${context.bonus}
- ⏰ Valid Until: ${new Date(context.validUntil).toLocaleDateString()}
- 📱 Delivery: ${context.deliveryChannel}

**Expected Outcome:**
- Success Rate: ${context.successRate}
- Estimated Value: ${context.estimatedValue}
- Impact: ${context.expectedImpact.toUpperCase()}

**Why This Action?**
The retention algorithm selected this specific offer based on:
1. Customer's historical spending patterns
2. Risk level (${context.riskLevel.toUpperCase()})
3. Proven success rates with similar customer profiles
4. Cost-benefit optimization

This automated intervention significantly increases the probability of retention!`;
    }

    if (lowerMessage.includes('roi') || lowerMessage.includes('worth')) {
      return `Excellent question! Let me break down the ROI analysis:

**Customer Lifetime Value (CLV):**
- Average order value: SAR ${context.avgOrderValue.toFixed(2)}
- Order frequency: ${context.frequency.toFixed(1)} orders/month
- Expected lifetime: 24 months
- **Total CLV: SAR ${(context.avgOrderValue * context.frequency * 24).toFixed(2)}**

**Retention Investment:**
- Discount cost: SAR ${context.estimatedValue}
- Delivery cost: SAR 20
- Marketing cost: SAR 10
- **Total investment: SAR ${parseInt(context.estimatedValue.replace(/[^0-9]/g, '')) + 30}**

**ROI Calculation:**
- Success rate: ${context.successRate}
- Expected recovery: SAR ${((context.avgOrderValue * context.frequency * 24) * 0.35).toFixed(2)}
- **ROI: ${(((context.avgOrderValue * context.frequency * 24) * 0.35) / (parseInt(context.estimatedValue.replace(/[^0-9]/g, '')) + 30) * 100).toFixed(0)}%**

**Without Intervention:**
- 100% chance of losing SAR ${(context.avgOrderValue * context.frequency * 24).toFixed(2)}
- Acquisition cost for replacement customer: SAR 150-200

**Conclusion:** This retention campaign delivers a strong positive ROI and is significantly more cost-effective than customer acquisition!`;
    }

    return `I'm analyzing customer churn patterns for your restaurant. Based on my predictive models, I've identified at-risk customers and automatically triggered retention campaigns.

Key points about ${context.customerName}:
- Risk Level: ${context.riskLevel.toUpperCase()}
- Churn Probability: ${context.churnProbability}
- Days Until Churn: ${context.daysUntilChurn} days

Ask me:
- "Why is this customer at risk?"
- "What action did you take?"
- "Is this retention effort worth the investment?"`;
  }
}

// ============================================================================
// MAIN SIMULATION
// ============================================================================
async function runChurnPredictionSimulation() {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 CHURN PREDICTION & RETENTION AUTOMATION SIMULATION');
  console.log('   Based on Commit 54a06c0: AI Ecosystem Relaunch');
  console.log('='.repeat(80) + '\n');

  // -------------------------------------------------------------------------
  // PART 1: CUSTOMER CHURN PREDICTION
  // -------------------------------------------------------------------------
  console.log('📊 PART 1: PREDICTIVE CHURN ANALYSIS\n');

  const churnPredictor = new ChurnPredictor();

  // High-risk customer data
  const customer = {
    id: 'CUST-12345',
    name: 'Ahmed Al-Saud',
    email: 'ahmed@example.com',
    joinedDate: '2024-03-15',
    emailOpens: 2,
    appLogins: 1,
    complaints: 1,
    satisfactionScore: 2.8
  };

  // Order history showing declining engagement
  const orderHistory = [
    { customerId: 'CUST-12345', date: '2024-04-10', total: 280 },
    { customerId: 'CUST-12345', date: '2024-05-15', total: 320 },
    { customerId: 'CUST-12345', date: '2024-06-20', total: 150 },
    { customerId: 'CUST-12345', date: '2024-07-05', total: 120 },
    { customerId: 'CUST-12345', date: '2024-08-12', total: 90 },
    // Last order was 3.5 months ago (high-risk!)
    { customerId: 'CUST-12345', date: '2024-08-15', total: 75 }
  ];

  logger.info(`🔍 Analyzing churn risk for customer: ${customer.name}`);
  logger.info(`📊 Order history: ${orderHistory.length} orders`);

  const churnPrediction = churnPredictor.predictChurnRisk(customer, orderHistory);

  console.log('\n📋 CHURN PREDICTION RESULTS:\n');
  console.log(`   Customer: ${churnPrediction.customerName} (${churnPrediction.customerId})`);
  console.log(`   Risk Level: ${churnPrediction.riskLevel.toUpperCase()}`);
  console.log(`   Churn Probability: ${churnPrediction.churnProbability}`);
  console.log(`   Risk Score: ${(churnPrediction.riskScore * 100).toFixed(1)}/100`);
  console.log(`   Days Until Churn: ${churnPrediction.daysUntilChurn || 'N/A'} days\n`);

  console.log('   ⚠️ CHURN RISK FACTORS:\n');
  churnPrediction.churnFactors.forEach((factor, index) => {
    console.log(`   ${index + 1}. ${factor.factor} (${factor.severity.toUpperCase()} severity)`);
    console.log(`      - ${factor.description}`);
    console.log(`      - Impact: ${(factor.impact * 100).toFixed(0)}%\n`);
  });

  // -------------------------------------------------------------------------
  // PART 2: AUTOMATED RETENTION CAMPAIGN
  // -------------------------------------------------------------------------
  console.log('⚡ PART 2: ACT NOW - AUTOMATED RETENTION\n');

  const automationEngine = new ActNowAutomationEngine();
  let automationResult;

  if (churnPrediction.recommendations.length > 0) {
    const topRecommendation = churnPrediction.recommendations[0];

    console.log('   💡 TOP RETENTION RECOMMENDATION:\n');
    console.log(`   Priority: ${topRecommendation.priority.toUpperCase()}`);
    console.log(`   Action: ${topRecommendation.action}`);
    console.log(`   Title: ${topRecommendation.title}`);
    console.log(`   Description: ${topRecommendation.description}`);
    console.log(`   Expected Impact: ${topRecommendation.expectedImpact.toUpperCase()}`);
    console.log(`   Estimated Cost: ${topRecommendation.estimatedCost}`);
    console.log(`   Success Rate: ${topRecommendation.successRate}\n`);

    logger.info('⚡ Triggering automated retention campaign...');
    automationResult = await automationEngine.executeRetentionAction(
      churnPrediction,
      topRecommendation
    );

    console.log('\n✅ AUTOMATION EXECUTION RESULT:\n');
    console.log(`   Status: ${automationResult.status.toUpperCase()}`);
    console.log(`   Success: ${automationResult.success}`);
    console.log(`   Message: ${automationResult.message}\n`);

    if (automationResult.result) {
      const offer = automationResult.result;
      console.log('   💌 RETENTION OFFER SENT:\n');
      console.log(`   Offer ID: ${offer.offerId}`);
      console.log(`   Customer: ${offer.customerName}`);
      console.log(`   Discount: ${offer.discount}`);
      console.log(`   Free Delivery: ${offer.freeDelivery ? 'YES' : 'NO'}`);
      console.log(`   Bonus: ${offer.bonus}`);
      console.log(`   Valid Until: ${new Date(offer.validUntil).toLocaleDateString()}`);
      console.log(`   Delivery Channel: ${offer.deliveryChannel}`);
      console.log(`   Estimated Value: ${offer.estimatedValue}\n`);
    }
  }

  // -------------------------------------------------------------------------
  // PART 3: CONVERSATIONAL INTELLIGENCE
  // -------------------------------------------------------------------------
  console.log('💬 PART 3: AI-POWERED CONVERSATION\n');

  const chatService = new MockChatService();

  const features = churnPredictor.extractFeatures(customer, orderHistory);
  const conversationContext = {
    customerName: churnPrediction.customerName,
    riskLevel: churnPrediction.riskLevel,
    churnProbability: churnPrediction.churnProbability,
    daysUntilChurn: churnPrediction.daysUntilChurn,
    riskScore: churnPrediction.riskScore,
    churnFactors: churnPrediction.churnFactors,
    engagementScore: features.engagementScore,
    orderTrend: features.orderTrend,
    customerTenure: features.customerTenure,
    offerId: automationResult.result.offerId,
    actionType: churnPrediction.recommendations[0].title,
    discount: automationResult.result.discount,
    freeDelivery: automationResult.result.freeDelivery,
    bonus: automationResult.result.bonus,
    validUntil: automationResult.result.validUntil,
    deliveryChannel: automationResult.result.deliveryChannel,
    successRate: churnPrediction.recommendations[0].successRate,
    estimatedValue: automationResult.result.estimatedValue,
    expectedImpact: churnPrediction.recommendations[0].expectedImpact,
    avgOrderValue: features.avgOrderValue,
    frequency: features.frequency
  };

  console.log('-'.repeat(80) + '\n');
  await chatService.sendMessage(
    `Why is ${customer.name} at high risk for churning?`,
    conversationContext
  );

  console.log('\n' + '-'.repeat(80) + '\n');
  await chatService.sendMessage(
    'What action did the system take automatically?',
    conversationContext
  );

  console.log('\n' + '-'.repeat(80) + '\n');
  await chatService.sendMessage(
    'Is this retention effort worth the investment? Show me the ROI.',
    conversationContext
  );

  console.log('\n' + '-'.repeat(80) + '\n');

  // -------------------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(80));
  console.log('✅ CHURN PREDICTION SIMULATION COMPLETE');
  console.log('='.repeat(80) + '\n');

  console.log('📊 SUMMARY:\n');
  console.log('✅ CHURN PREDICTION:');
  console.log(`   - Customer analyzed: ${churnPrediction.customerName}`);
  console.log(`   - Risk level: ${churnPrediction.riskLevel.toUpperCase()}`);
  console.log(`   - Churn probability: ${churnPrediction.churnProbability}`);
  console.log(`   - Risk factors identified: ${churnPrediction.churnFactors.length}`);
  console.log(`   - Days until churn: ${churnPrediction.daysUntilChurn} days\n`);

  console.log('✅ AUTOMATED RETENTION:');
  console.log(`   - Retention offer sent: ${automationResult.result.offerId}`);
  console.log(`   - Discount provided: ${automationResult.result.discount}`);
  console.log(`   - Expected success rate: ${churnPrediction.recommendations[0].successRate}`);
  console.log(`   - Estimated cost: ${churnPrediction.recommendations[0].estimatedCost}\n`);

  console.log('✅ CONVERSATIONAL AI:');
  console.log(`   - Conversations: ${chatService.conversationMemory.length / 2} turns`);
  console.log(`   - Context maintained: YES`);
  console.log(`   - ROI analysis provided: YES\n`);

  console.log('🎯 KEY CAPABILITIES DEMONSTRATED:');
  console.log('   1. ✅ RFM-based churn risk prediction');
  console.log('   2. ✅ Multi-factor behavioral analysis');
  console.log('   3. ✅ Automated retention campaign execution');
  console.log('   4. ✅ Intelligent offer personalization');
  console.log('   5. ✅ ROI-based decision making\n');

  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// RUN THE SIMULATION
// ============================================================================
runChurnPredictionSimulation().catch(error => {
  console.error('❌ Simulation error:', error);
  process.exit(1);
});
