// src/lib/ai/churnPrediction.js
/**
 * Customer Churn Prediction System
 * Identifies at-risk customers using behavioral analysis and predictive modeling
 */

import { logger } from '../logger';

export class ChurnPredictor {
  constructor() {
    this.riskThresholds = {
      high: 0.7,
      medium: 0.4,
      low: 0.2
    };
  }

  /**
   * Analyze customer churn risk
   * @param {Object} customer - Customer data
   * @param {Array} orderHistory - Historical order data
   * @returns {Object} Churn prediction with risk score and factors
   */
  predictChurnRisk(customer, orderHistory = []) {
    try {
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

    } catch (error) {
      logger.error('Error predicting churn risk:', error);
      return null;
    }
  }

  /**
   * Extract behavioral features from customer data
   */
  extractFeatures(customer, orderHistory) {
    const now = new Date();
    const recentOrders = orderHistory.filter(o => {
      const orderDate = new Date(o.date);
      const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 90;
    });

    // Calculate recency (days since last order)
    const lastOrderDate = orderHistory.length > 0
      ? new Date(Math.max(...orderHistory.map(o => new Date(o.date))))
      : null;
    const recency = lastOrderDate
      ? (now - lastOrderDate) / (1000 * 60 * 60 * 24)
      : 999;

    // Calculate frequency (orders per month)
    const frequency = recentOrders.length / 3; // Last 3 months

    // Calculate monetary value
    const monetary = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = monetary / (recentOrders.length || 1);

    // Engagement metrics
    const engagementScore = this.calculateEngagementScore(customer, orderHistory);

    // Order trend
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

  /**
   * Calculate overall risk score
   */
  calculateRiskScore(features) {
    // Weighted risk factors
    const recencyRisk = this.normalizeRecency(features.recency);
    const frequencyRisk = this.normalizeFrequency(features.frequency);
    const monetaryRisk = 1 - this.normalizeMonetary(features.monetary);
    const engagementRisk = 1 - features.engagementScore;
    const trendRisk = features.orderTrend < 0 ? 0.8 : 0.2;
    const satisfactionRisk = 1 - (features.satisfactionScore / 5);

    // Weighted combination
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
    // More days = higher risk
    if (recency > 60) return 1.0;
    if (recency > 30) return 0.7;
    if (recency > 14) return 0.4;
    return 0.1;
  }

  normalizeFrequency(frequency) {
    // Fewer orders = higher risk
    if (frequency < 0.5) return 1.0;
    if (frequency < 1) return 0.7;
    if (frequency < 2) return 0.4;
    return 0.1;
  }

  normalizeMonetary(monetary) {
    // Lower spending = higher risk
    if (monetary < 100) return 0.1;
    if (monetary < 500) return 0.4;
    if (monetary < 1000) return 0.7;
    return 1.0;
  }

  calculateEngagementScore(customer, orderHistory) {
    let score = 0.5; // Base score

    // Email opened
    if (customer.emailOpens > 0) score += 0.1;

    // App usage
    if (customer.appLogins > 5) score += 0.2;

    // Order consistency
    if (orderHistory.length > 10) score += 0.1;

    // Recent activity
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

    // Estimate based on current recency and risk
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

    // Factor-specific recommendations
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

      if (factor.factor === 'Poor Engagement') {
        recommendations.push({
          priority: 'medium',
          action: 'engagement_boost',
          title: 'Gamification & Loyalty Points',
          description: 'Award bonus points and exclusive perks',
          expectedImpact: 'medium',
          estimatedCost: 'SAR 10-20',
          successRate: '30%'
        });
      }
    });

    return recommendations.slice(0, 3); // Top 3 recommendations
  }

  /**
   * Analyze cohort churn patterns
   */
  analyzeCohortChurn(customers, orderHistory) {
    const cohorts = this.groupByCohort(customers);
    const analysis = {};

    for (const [cohortKey, cohortCustomers] of Object.entries(cohorts)) {
      const churnPredictions = cohortCustomers.map(customer => {
        const customerOrders = orderHistory.filter(o => o.customerId === customer.id);
        return this.predictChurnRisk(customer, customerOrders);
      }).filter(p => p !== null);

      const highRiskCount = churnPredictions.filter(p => p.riskLevel === 'high').length;
      const mediumRiskCount = churnPredictions.filter(p => p.riskLevel === 'medium').length;
      const avgRiskScore = churnPredictions.reduce((sum, p) => sum + p.riskScore, 0) / churnPredictions.length;

      analysis[cohortKey] = {
        totalCustomers: cohortCustomers.length,
        highRisk: highRiskCount,
        mediumRisk: mediumRiskCount,
        lowRisk: cohortCustomers.length - highRiskCount - mediumRiskCount,
        avgRiskScore: avgRiskScore.toFixed(3),
        churnRate: `${(avgRiskScore * 100).toFixed(1)}%`,
        topFactors: this.aggregateTopFactors(churnPredictions)
      };
    }

    return analysis;
  }

  groupByCohort(customers) {
    const cohorts = {};

    customers.forEach(customer => {
      const joinDate = new Date(customer.joinedDate || new Date());
      const cohortKey = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`;

      if (!cohorts[cohortKey]) cohorts[cohortKey] = [];
      cohorts[cohortKey].push(customer);
    });

    return cohorts;
  }

  aggregateTopFactors(predictions) {
    const factorCounts = {};

    predictions.forEach(pred => {
      pred.churnFactors.forEach(factor => {
        if (!factorCounts[factor.factor]) {
          factorCounts[factor.factor] = 0;
        }
        factorCounts[factor.factor]++;
      });
    });

    return Object.entries(factorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([factor, count]) => ({ factor, count }));
  }
}

export default ChurnPredictor;
