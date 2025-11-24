// src/lib/ai/marketingOptimization.js
/**
 * Marketing Optimization AI Engine
 * Determines optimal send times, segments customers, and predicts campaign success
 */

import { logger } from '../logger';

export class MarketingOptimizer {
  constructor() {
    this.timeZone = 'Asia/Riyadh';
  }

  /**
   * Determine optimal send times for marketing campaigns
   */
  optimizeSendTimes(customerData, historicalCampaigns = []) {
    try {
      logger.info('Optimizing marketing send times');

      const engagementByHour = this.analyzeEngagementPatterns(historicalCampaigns);
      const engagementByDay = this.analyzeEngagementByDay(historicalCampaigns);
      const optimalTimes = this.calculateOptimalTimes(engagementByHour, engagementByDay);

      return {
        timestamp: new Date().toISOString(),
        optimalTimes,
        engagementPatterns: {
          byHour: engagementByHour,
          byDay: engagementByDay
        },
        recommendations: this.generateSendTimeRecommendations(optimalTimes),
        confidence: this.calculateConfidence(historicalCampaigns.length)
      };

    } catch (error) {
      logger.error('Error optimizing send times:', error);
      throw error;
    }
  }

  analyzeEngagementPatterns(campaigns) {
    const hourlyEngagement = Array(24).fill(0).map(() => ({
      sends: 0,
      opens: 0,
      clicks: 0,
      conversions: 0
    }));

    campaigns.forEach(campaign => {
      const hour = new Date(campaign.sentAt).getHours();

      hourlyEngagement[hour].sends += campaign.sends || 0;
      hourlyEngagement[hour].opens += campaign.opens || 0;
      hourlyEngagement[hour].clicks += campaign.clicks || 0;
      hourlyEngagement[hour].conversions += campaign.conversions || 0;
    });

    return hourlyEngagement.map((data, hour) => ({
      hour,
      openRate: data.sends > 0 ? (data.opens / data.sends) * 100 : 0,
      clickRate: data.opens > 0 ? (data.clicks / data.opens) * 100 : 0,
      conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0,
      engagementScore: this.calculateEngagementScore(data)
    }));
  }

  analyzeEngagementByDay(campaigns) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyEngagement = Array(7).fill(0).map((_, day) => ({
      day: dayNames[day],
      sends: 0,
      opens: 0,
      clicks: 0,
      conversions: 0
    }));

    campaigns.forEach(campaign => {
      const day = new Date(campaign.sentAt).getDay();

      dailyEngagement[day].sends += campaign.sends || 0;
      dailyEngagement[day].opens += campaign.opens || 0;
      dailyEngagement[day].clicks += campaign.clicks || 0;
      dailyEngagement[day].conversions += campaign.conversions || 0;
    });

    return dailyEngagement.map(data => ({
      ...data,
      openRate: data.sends > 0 ? (data.opens / data.sends) * 100 : 0,
      clickRate: data.opens > 0 ? (data.clicks / data.opens) * 100 : 0,
      conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0,
      engagementScore: this.calculateEngagementScore(data)
    }));
  }

  calculateEngagementScore(data) {
    if (data.sends === 0) return 0;

    const openScore = data.sends > 0 ? (data.opens / data.sends) * 40 : 0;
    const clickScore = data.opens > 0 ? (data.clicks / data.opens) * 35 : 0;
    const conversionScore = data.clicks > 0 ? (data.conversions / data.clicks) * 25 : 0;

    return openScore + clickScore + conversionScore;
  }

  calculateOptimalTimes(hourlyEngagement, dailyEngagement) {
    // Find top 3 hours
    const topHours = [...hourlyEngagement]
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 3);

    // Find top 2 days
    const topDays = [...dailyEngagement]
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 2);

    return {
      bestHours: topHours.map(h => ({
        hour: h.hour,
        displayTime: this.formatHour(h.hour),
        score: h.engagementScore.toFixed(2),
        openRate: `${h.openRate.toFixed(1)}%`,
        clickRate: `${h.clickRate.toFixed(1)}%`
      })),
      bestDays: topDays.map(d => ({
        day: d.day,
        score: d.engagementScore.toFixed(2),
        openRate: `${d.openRate.toFixed(1)}%`,
        clickRate: `${d.clickRate.toFixed(1)}%`
      })),
      optimalWindow: {
        day: topDays[0]?.day || 'Tuesday',
        time: this.formatHour(topHours[0]?.hour || 10),
        expectedOpenRate: `${topHours[0]?.openRate.toFixed(1) || '25.0'}%`,
        expectedClickRate: `${topHours[0]?.clickRate.toFixed(1) || '8.0'}%`
      }
    };
  }

  formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  generateSendTimeRecommendations(optimalTimes) {
    return [
      {
        priority: 'highest',
        title: 'Prime Time Send',
        timeSlot: `${optimalTimes.optimalWindow.day} at ${optimalTimes.optimalWindow.time}`,
        expectedPerformance: {
          openRate: optimalTimes.optimalWindow.expectedOpenRate,
          clickRate: optimalTimes.optimalWindow.expectedClickRate
        },
        reasoning: 'Historical data shows highest engagement during this window'
      },
      {
        priority: 'high',
        title: 'Secondary Window',
        timeSlot: `${optimalTimes.bestDays[1]?.day || 'Thursday'} at ${optimalTimes.bestHours[1]?.displayTime || '2:00 PM'}`,
        expectedPerformance: {
          openRate: optimalTimes.bestHours[1]?.openRate || '22.0%',
          clickRate: optimalTimes.bestHours[1]?.clickRate || '7.0%'
        },
        reasoning: 'Second-best engagement window for backup campaigns'
      },
      {
        priority: 'avoid',
        title: 'Low Engagement Periods',
        timeSlots: ['Late night (11 PM - 5 AM)', 'Early morning (5 AM - 8 AM)'],
        reasoning: 'Historically low open and click rates'
      }
    ];
  }

  calculateConfidence(campaignCount) {
    if (campaignCount >= 50) return 0.95;
    if (campaignCount >= 20) return 0.80;
    if (campaignCount >= 10) return 0.65;
    return 0.50;
  }

  /**
   * Segment customers for targeted campaigns
   */
  segmentCustomers(customers, orderHistory) {
    logger.info('Segmenting customers for targeted campaigns');

    const segments = {
      highValue: [],
      regular: [],
      atRisk: [],
      dormant: [],
      new: []
    };

    customers.forEach(customer => {
      const customerOrders = orderHistory.filter(o => o.customerId === customer.id);
      const segment = this.determineSegment(customer, customerOrders);
      segments[segment].push({
        ...customer,
        orderCount: customerOrders.length,
        totalSpent: customerOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      });
    });

    return {
      timestamp: new Date().toISOString(),
      totalCustomers: customers.length,
      segments: Object.entries(segments).map(([name, customers]) => ({
        name,
        count: customers.length,
        percentage: `${((customers.length / customers.length) * 100).toFixed(1)}%`,
        avgOrderValue: this.calculateAvgOrderValue(customers),
        campaignRecommendations: this.getCampaignRecommendations(name, customers)
      }))
    };
  }

  determineSegment(customer, orders) {
    const daysSinceJoin = customer.joinedDate
      ? (new Date() - new Date(customer.joinedDate)) / (1000 * 60 * 60 * 24)
      : 0;

    const daysSinceLastOrder = orders.length > 0
      ? (new Date() - new Date(orders[orders.length - 1].date)) / (1000 * 60 * 60 * 24)
      : 999;

    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // New customers (joined within 30 days)
    if (daysSinceJoin <= 30) return 'new';

    // Dormant (no orders in 60+ days)
    if (daysSinceLastOrder > 60) return 'dormant';

    // High value (spent > 2000 SAR)
    if (totalSpent > 2000) return 'highValue';

    // At risk (30-60 days since last order)
    if (daysSinceLastOrder > 30) return 'atRisk';

    // Regular customers
    return 'regular';
  }

  calculateAvgOrderValue(customers) {
    if (customers.length === 0) return 0;
    const total = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const orders = customers.reduce((sum, c) => sum + (c.orderCount || 0), 0);
    return orders > 0 ? total / orders : 0;
  }

  getCampaignRecommendations(segment, customers) {
    const recommendations = {
      highValue: [
        {
          type: 'exclusive_vip',
          title: 'VIP Exclusive Offers',
          description: 'Premium early access and exclusive discounts',
          expectedRoi: '4.5x'
        },
        {
          type: 'loyalty_rewards',
          title: 'Loyalty Point Bonuses',
          description: 'Double points on next 3 orders',
          expectedRoi: '3.2x'
        }
      ],
      regular: [
        {
          type: 'upsell',
          title: 'Product Recommendations',
          description: 'Personalized suggestions based on order history',
          expectedRoi: '2.8x'
        }
      ],
      atRisk: [
        {
          type: 'win_back',
          title: 'We Miss You Campaign',
          description: '20% discount to bring customers back',
          expectedRoi: '2.1x'
        }
      ],
      dormant: [
        {
          type: 'reactivation',
          title: 'Comeback Special',
          description: 'Aggressive discount + free delivery',
          expectedRoi: '1.8x'
        }
      ],
      new: [
        {
          type: 'onboarding',
          title: 'Welcome Series',
          description: 'Educational emails + first purchase bonus',
          expectedRoi: '3.5x'
        }
      ]
    };

    return recommendations[segment] || [];
  }

  /**
   * Predict campaign success
   */
  predictCampaignSuccess(campaignDetails, targetSegment, historicalPerformance) {
    const baseSuccessRate = this.getBaseSuccessRate(targetSegment);
    const contentScore = this.scoreCampaignContent(campaignDetails);
    const timingScore = this.scoreTimingStrategy(campaignDetails);
    const audienceScore = this.scoreAudienceMatch(targetSegment, campaignDetails);

    const predictedSuccessRate = baseSuccessRate * contentScore * timingScore * audienceScore;

    return {
      predictedOpenRate: `${(predictedSuccessRate * 0.3).toFixed(1)}%`,
      predictedClickRate: `${(predictedSuccessRate * 0.08).toFixed(1)}%`,
      predictedConversionRate: `${(predictedSuccessRate * 0.02).toFixed(1)}%`,
      estimatedRevenue: this.estimateRevenue(campaignDetails, predictedSuccessRate),
      confidenceLevel: this.determineConfidenceLevel(historicalPerformance.length),
      recommendations: this.generateCampaignImprovements(contentScore, timingScore, audienceScore)
    };
  }

  getBaseSuccessRate(segment) {
    const rates = {
      highValue: 0.85,
      regular: 0.70,
      atRisk: 0.50,
      dormant: 0.30,
      new: 0.75
    };
    return rates[segment] || 0.60;
  }

  scoreCampaignContent(campaign) {
    let score = 0.5; // Base score

    if (campaign.hasPersonalization) score += 0.2;
    if (campaign.hasCallToAction) score += 0.15;
    if (campaign.hasImages) score += 0.1;
    if (campaign.hasUrgency) score += 0.05;

    return Math.min(1, score);
  }

  scoreTimingStrategy(campaign) {
    // Assume optimal timing adds value
    return campaign.scheduledAtOptimalTime ? 1.2 : 0.8;
  }

  scoreAudienceMatch(segment, campaign) {
    // Check if campaign type matches segment
    const matchScore = {
      highValue: campaign.type === 'exclusive' ? 1.3 : 0.9,
      regular: campaign.type === 'promotional' ? 1.2 : 0.9,
      atRisk: campaign.type === 'win_back' ? 1.4 : 0.8,
      dormant: campaign.type === 'reactivation' ? 1.5 : 0.7,
      new: campaign.type === 'onboarding' ? 1.3 : 0.9
    };
    return matchScore[segment] || 1.0;
  }

  estimateRevenue(campaign, successRate) {
    const estimatedConversions = (campaign.targetAudience || 1000) * successRate * 0.02;
    const avgOrderValue = campaign.avgOrderValue || 150;
    return `SAR ${(estimatedConversions * avgOrderValue).toLocaleString()}`;
  }

  determineConfidenceLevel(dataPoints) {
    if (dataPoints >= 50) return 'high';
    if (dataPoints >= 20) return 'medium';
    return 'low';
  }

  generateCampaignImprovements(contentScore, timingScore, audienceScore) {
    const improvements = [];

    if (contentScore < 0.7) {
      improvements.push('Add personalization elements to improve engagement');
    }
    if (timingScore < 1.0) {
      improvements.push('Schedule during optimal engagement windows');
    }
    if (audienceScore < 1.0) {
      improvements.push('Better align campaign type with target segment');
    }

    return improvements.length > 0 ? improvements : ['Campaign is well-optimized'];
  }
}

export default MarketingOptimizer;
