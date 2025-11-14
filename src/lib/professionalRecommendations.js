/**
 * Professional Recommendations Engine
 * Generates AI-powered recommendations for revenue growth, cost optimization, and branch performance
 */

import logger from './logger';

/**
 * Generate revenue growth recommendations
 * @param {Object} reportData - Report data containing revenue, orders, menu, customer data
 * @param {Array} trends - Historical revenue trends
 */
export const generateRevenueGrowthRecommendations = (reportData, trends = []) => {
  const recommendations = [];

  try {
    const { orderStats, analytics, orders } = reportData;

    if (!orderStats) {
      return recommendations;
    }

    const { totalRevenue, totalOrders, averageOrderValue, completedOrders } = orderStats;
    const ordersPerDay = totalOrders / (trends.length || 30);
    const conversionRate = completedOrders / totalOrders;

    // 1. Average Order Value Optimization
    if (averageOrderValue < 75) {
      recommendations.push({
        id: 'rev_aov_001',
        category: 'Revenue Growth',
        subcategory: 'Average Order Value',
        priority: 'high',
        title: 'Increase Average Order Value',
        description: `Current AOV (SAR ${averageOrderValue.toFixed(2)}) is below target. Implement strategic pricing and bundling to increase customer spend.`,
        impact: {
          metric: 'AOV',
          current: averageOrderValue,
          target: averageOrderValue * 1.15,
          potentialIncrease: (averageOrderValue * 0.15).toFixed(2),
          expectedRevenue: (totalRevenue * 1.15).toFixed(0)
        },
        actions: [
          'Create combo meal bundles with 10-15% margin premium',
          'Implement smart upselling at point of sale (drinks, desserts)',
          'Introduce minimum order values for discounts',
          'A/B test dynamic pricing strategies',
          'Feature high-margin items in menu placement'
        ],
        timeline: '4-6 weeks',
        difficulty: 'medium',
        confidence: 'high',
        relatedMetrics: ['Total Revenue', 'Order Value Distribution', 'Menu Performance']
      });
    }

    // 2. Order Volume Growth
    if (ordersPerDay < 50) {
      recommendations.push({
        id: 'rev_volume_001',
        category: 'Revenue Growth',
        subcategory: 'Order Volume',
        priority: 'high',
        title: 'Boost Order Volume & Customer Acquisition',
        description: `Current order volume (${ordersPerDay.toFixed(0)} orders/day) has growth potential. Focus on customer acquisition and repeat orders.`,
        impact: {
          metric: 'Daily Orders',
          current: ordersPerDay,
          target: ordersPerDay * 1.30,
          potentialIncrease: (ordersPerDay * 0.30).toFixed(0),
          expectedRevenue: (totalRevenue * 1.30).toFixed(0)
        },
        actions: [
          'Launch targeted digital marketing campaigns',
          'Implement loyalty program with 10-20% rewards',
          'Increase social media presence and engagement',
          'Partner with delivery platforms for visibility',
          'Run flash sales and limited-time offers on slow days',
          'Implement referral program (incentivize word-of-mouth)'
        ],
        timeline: '6-8 weeks',
        difficulty: 'medium',
        confidence: 'high',
        relatedMetrics: ['Order Count', 'Customer Acquisition Cost', 'Marketing ROI']
      });
    }

    // 3. Peak Hours Optimization
    if (analytics?.peakHours && analytics.peakHours.length > 0) {
      const peakHourRevenue = analytics.peakHours.reduce((sum, h) => sum + (h.revenue || 0), 0);
      const offPeakRevenue = totalRevenue - peakHourRevenue;

      if (offPeakRevenue / totalRevenue < 0.40) {
        recommendations.push({
          id: 'rev_offpeak_001',
          category: 'Revenue Growth',
          subcategory: 'Off-Peak Hours',
          priority: 'medium',
          title: 'Maximize Off-Peak Hours Revenue',
          description: `Off-peak hours contribute only ${(offPeakRevenue / totalRevenue * 100).toFixed(1)}% of revenue. Implement strategies to drive traffic during slower periods.`,
          impact: {
            metric: 'Off-Peak Revenue',
            current: offPeakRevenue,
            target: totalRevenue * 0.50,
            potentialIncrease: (totalRevenue * 0.10).toFixed(2),
            expectedRevenue: (totalRevenue * 1.10).toFixed(0)
          },
          actions: [
            'Offer lunch specials and breakfast promotions',
            'Implement early-bird discounts (before peak hours)',
            'Create corporate catering packages for lunch',
            'Host special events or theme nights',
            'Introduce happy hour deals and twilight specials',
            'Partner with nearby offices for corporate orders'
          ],
          timeline: '4-6 weeks',
          difficulty: 'medium',
          confidence: 'medium',
          relatedMetrics: ['Hourly Revenue Distribution', 'Peak Hour Analysis']
        });
      }
    }

    // 4. Customer Lifetime Value
    if (analytics?.customerData) {
      const repeatRate = analytics.customerData.repeatCustomerPercentage || 0;
      if (repeatRate < 0.35) {
        recommendations.push({
          id: 'rev_clv_001',
          category: 'Revenue Growth',
          subcategory: 'Customer Retention',
          priority: 'high',
          title: 'Increase Customer Lifetime Value',
          description: `Repeat customer rate is ${(repeatRate * 100).toFixed(1)}%. Focus on retention to increase CLV.`,
          impact: {
            metric: 'Repeat Customer Rate',
            current: `${(repeatRate * 100).toFixed(1)}%`,
            target: '50%',
            potentialIncrease: 'Up to 40% revenue increase',
            expectedRevenue: (totalRevenue * 1.40).toFixed(0)
          },
          actions: [
            'Build customer loyalty program with tiered rewards',
            'Personalized email/SMS marketing campaigns',
            'Birthday and anniversary special offers',
            'Collect customer feedback and act on it',
            'Implement customer win-back campaigns',
            'Create VIP experiences for high-value customers'
          ],
          timeline: '8-12 weeks',
          difficulty: 'high',
          confidence: 'high',
          relatedMetrics: ['Customer Retention Rate', 'Repeat Purchase Rate', 'Customer Satisfaction']
        });
      }
    }

    logger.info('Revenue growth recommendations generated', { count: recommendations.length });
    return recommendations;
  } catch (error) {
    logger.error('Failed to generate revenue growth recommendations', { error: error.message });
    return recommendations;
  }
};

/**
 * Generate cost optimization recommendations
 * @param {Object} reportData - Report data containing expenses, operations, staffing data
 */
export const generateCostOptimizationRecommendations = (reportData) => {
  const recommendations = [];

  try {
    const { orderStats, analytics } = reportData;

    if (!orderStats) {
      return recommendations;
    }

    const totalRevenue = orderStats.totalRevenue;
    const estimatedCogs = totalRevenue * 0.35; // Typical food cost
    const estimatedLabor = totalRevenue * 0.28; // Typical labor cost

    // 1. Cost of Goods Sold Optimization
    recommendations.push({
      id: 'cost_cogs_001',
      category: 'Cost Optimization',
      subcategory: 'COGS Management',
      priority: 'high',
      title: 'Optimize Cost of Goods Sold (COGS)',
      description: `Current estimated COGS is 35% of revenue (SAR ${estimatedCogs.toFixed(0)}). Reduce through supplier optimization and waste management.`,
      impact: {
        metric: 'COGS Reduction',
        current: `35% (SAR ${estimatedCogs.toFixed(0)})`,
        target: '32%',
        potentialSavings: (estimatedCogs * 0.086).toFixed(0),
        increaseToBottom: (totalRevenue * 0.086).toFixed(0)
      },
      actions: [
        'Conduct supplier price negotiations quarterly',
        'Implement portion control and standardization',
        'Reduce food waste through better inventory management',
        'Track menu item costs and profitability',
        'Consider bulk purchasing for non-perishables',
        'Implement FIFO (First-In-First-Out) inventory system',
        'Analyze unpopular high-cost items for removal'
      ],
      timeline: '4-8 weeks',
      difficulty: 'medium',
      confidence: 'high',
      relatedMetrics: ['COGS Percentage', 'Waste Rate', 'Supplier Costs', 'Menu Profitability']
    });

    // 2. Labor Cost Optimization
    if (analytics?.staffingData) {
      recommendations.push({
        id: 'cost_labor_001',
        category: 'Cost Optimization',
        subcategory: 'Labor Costs',
        priority: 'high',
        title: 'Optimize Labor Costs & Staffing Efficiency',
        description: `Current estimated labor costs are 28% of revenue (SAR ${estimatedLabor.toFixed(0)}). Improve through scheduling optimization.`,
        impact: {
          metric: 'Labor Cost Reduction',
          current: `28% (SAR ${estimatedLabor.toFixed(0)})`,
          target: '24%',
          potentialSavings: (estimatedLabor * 0.143).toFixed(0),
          increaseToBottom: (totalRevenue * 0.040).toFixed(0)
        },
        actions: [
          'Implement AI-based schedule optimization matching demand',
          'Cross-train staff for multiple roles',
          'Reduce overtime hours through better scheduling',
          'Automate repetitive tasks (ordering, invoicing)',
          'Monitor productivity metrics per shift',
          'Implement performance-based incentives',
          'Review and optimize peak-hour staffing levels'
        ],
        timeline: '6-10 weeks',
        difficulty: 'high',
        confidence: 'high',
        relatedMetrics: ['Labor Cost Percentage', 'Productivity Per Staff', 'Overtime Hours', 'Staff Turnover']
      });
    }

    // 3. Operational Expense Reduction
    recommendations.push({
      id: 'cost_opex_001',
      category: 'Cost Optimization',
      subcategory: 'Operating Expenses',
      priority: 'medium',
      title: 'Reduce Operating Expenses',
      description: `Optimize utilities, rent, and administrative costs. Typical targets: utilities 3%, rent 8%, other 4%.`,
      impact: {
        metric: 'OpEx Reduction',
        current: `15% (SAR ${(totalRevenue * 0.15).toFixed(0)})`,
        target: '12%',
        potentialSavings: (totalRevenue * 0.03).toFixed(0),
        increaseToBottom: (totalRevenue * 0.03).toFixed(0)
      },
      actions: [
        'Renegotiate rent agreement during renewal',
        'Implement energy-efficient systems (LED, HVAC)',
        'Monitor and reduce utility usage',
        'Review and eliminate unnecessary subscriptions',
        'Consolidate suppliers for better rates',
        'Implement virtual management systems',
        'Reduce paper and digitize processes'
      ],
      timeline: '8-12 weeks',
      difficulty: 'medium',
      confidence: 'medium',
      relatedMetrics: ['Utility Costs', 'Rent as % Revenue', 'Administrative Costs']
    });

    // 4. Menu Engineering for Profitability
    recommendations.push({
      id: 'cost_menu_001',
      category: 'Cost Optimization',
      subcategory: 'Menu Optimization',
      priority: 'high',
      title: 'Optimize Menu for Maximum Profitability',
      description: 'Focus on high-profit items and eliminate low-margin products to improve overall menu profitability.',
      impact: {
        metric: 'Menu Profit Margin',
        current: '~35%',
        target: '40%',
        potentialSavings: (totalRevenue * 0.05).toFixed(0),
        increaseToBottom: (totalRevenue * 0.05).toFixed(0)
      },
      actions: [
        'Categorize menu items using BCG Matrix (Stars, Puzzles, Dogs, Plow Horses)',
        'Remove or reprice "Dogs" (low volume, low margin)',
        'Promote "Stars" through menu placement and descriptions',
        'Bundle "Puzzles" with "Stars" to increase sales',
        'Increase prices on high-demand "Plow Horses"',
        'Simplify menu to reduce operational complexity',
        'Introduce seasonal specials to reduce food waste'
      ],
      timeline: '4-6 weeks',
      difficulty: 'medium',
      confidence: 'high',
      relatedMetrics: ['Menu Item Profitability', 'Plate Cost', 'Item Popularity']
    });

    logger.info('Cost optimization recommendations generated', { count: recommendations.length });
    return recommendations;
  } catch (error) {
    logger.error('Failed to generate cost optimization recommendations', { error: error.message });
    return recommendations;
  }
};

/**
 * Generate branch performance recommendations
 * @param {Array} branchData - Array of branch performance data
 * @param {Array} allBranchComparison - All branches comparison data
 */
export const generateBranchPerformanceRecommendations = (branchData = [], allBranchComparison = []) => {
  const recommendations = [];

  try {
    if (branchData.length === 0 && allBranchComparison.length === 0) {
      return recommendations;
    }

    const currentBranch = branchData[0] || {};
    const branches = allBranchComparison.length > 0 ? allBranchComparison : [currentBranch];

    // Sort by revenue to find top performers
    const sortedByRevenue = [...branches].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    const topBranch = sortedByRevenue[0];
    const currentBranchData = branches.find(b => b.id === currentBranch.id) || branches[branches.length - 1];

    // 1. Performance Gap Analysis
    if (topBranch && currentBranchData && topBranch.id !== currentBranchData.id) {
      const revenuGap = topBranch.revenue - currentBranchData.revenue;
      const gapPercentage = (revenuGap / topBranch.revenue * 100).toFixed(1);

      recommendations.push({
        id: 'branch_perf_001',
        category: 'Branch Performance',
        subcategory: 'Performance Gap',
        priority: 'high',
        title: `Close ${gapPercentage}% Performance Gap with Top Performer`,
        description: `${topBranch.name} generates SAR ${topBranch.revenue.toLocaleString()} vs your SAR ${currentBranchData.revenue.toLocaleString()}. Share best practices to improve performance.`,
        impact: {
          metric: 'Revenue Gap',
          current: currentBranchData.revenue,
          topPerformer: topBranch.revenue,
          gap: revenuGap,
          potentialIncrease: revenuGap.toFixed(0)
        },
        actions: [
          `Shadow management of ${topBranch.name} for 1-2 weeks`,
          'Compare operational procedures and training methods',
          'Analyze menu offerings and pricing strategies',
          'Study marketing and promotional activities',
          'Review staffing, scheduling, and shift patterns',
          'Implement best practices found at top location',
          'Create improvement timeline with measurable KPIs'
        ],
        timeline: '8-12 weeks',
        difficulty: 'high',
        confidence: 'high',
        relatedMetrics: ['Branch Revenue', 'Orders Per Day', 'Average Order Value', 'Customer Satisfaction']
      });
    }

    // 2. Operational Efficiency
    if (currentBranchData) {
      recommendations.push({
        id: 'branch_opex_001',
        category: 'Branch Performance',
        subcategory: 'Operational Efficiency',
        priority: 'medium',
        title: 'Improve Operational Efficiency & Metrics',
        description: 'Establish and monitor KPIs to measure and improve overall branch efficiency.',
        impact: {
          metric: 'Operational Efficiency Score',
          current: 'Baseline',
          target: '+20% improvement',
          potentialIncrease: 'Up to 15% margin improvement'
        },
        actions: [
          'Establish daily huddles to align team on goals',
          'Monitor key metrics: order accuracy, speed of service, waste %',
          'Implement mystery shopper program quarterly',
          'Create efficiency scoreboard visible to staff',
          'Reward top performers with incentives',
          'Conduct monthly training on weak areas',
          'Implement suggestion system for staff improvements'
        ],
        timeline: '4-6 weeks',
        difficulty: 'medium',
        confidence: 'high',
        relatedMetrics: ['Order Accuracy Rate', 'Avg Service Time', 'Customer Satisfaction', 'Food Waste %']
      });
    }

    // 3. Marketing & Customer Acquisition
    recommendations.push({
      id: 'branch_marketing_001',
      category: 'Branch Performance',
      subcategory: 'Marketing & Growth',
      priority: 'medium',
      title: 'Enhance Local Marketing & Community Presence',
      description: 'Increase brand awareness and customer acquisition through targeted local marketing initiatives.',
      impact: {
        metric: 'Customer Base Growth',
        current: 'Baseline',
        target: '+25% customer acquisition',
        potentialIncrease: 'Up to 25% revenue growth'
      },
      actions: [
        'Launch hyper-local social media campaigns',
        'Partner with local businesses for cross-promotion',
        'Host community events and sponsorships',
        'Implement location-based mobile offers',
        'Create referral incentives for existing customers',
        'Build local SEO (Google My Business, local directories)',
        'Leverage user-generated content on social media'
      ],
      timeline: '6-8 weeks',
      difficulty: 'medium',
      confidence: 'medium',
      relatedMetrics: ['New Customer Acquisition', 'Social Media Engagement', 'Foot Traffic']
    });

    // 4. Staff Training & Development
    recommendations.push({
      id: 'branch_staff_001',
      category: 'Branch Performance',
      subcategory: 'Staff Development',
      priority: 'high',
      title: 'Invest in Staff Training & Development',
      description: 'Well-trained staff directly impacts customer satisfaction, retention, and operational efficiency.',
      impact: {
        metric: 'Customer Satisfaction Score',
        current: 'Baseline',
        target: '+10-15% improvement',
        potentialIncrease: '5-10% revenue through better service'
      },
      actions: [
        'Develop comprehensive onboarding program (2-3 weeks)',
        'Create role-specific training modules',
        'Implement monthly skill development workshops',
        'Establish mentoring program (senior to junior staff)',
        'Provide customer service excellence training',
        'Recognize and reward top performers',
        'Conduct regular performance reviews'
      ],
      timeline: '8-12 weeks',
      difficulty: 'medium',
      confidence: 'high',
      relatedMetrics: ['Customer Satisfaction', 'Staff Turnover', 'Order Accuracy', 'Speed of Service']
    });

    logger.info('Branch performance recommendations generated', { count: recommendations.length });
    return recommendations;
  } catch (error) {
    logger.error('Failed to generate branch performance recommendations', { error: error.message });
    return recommendations;
  }
};

/**
 * Get top priority recommendations across all categories
 */
export const getPriorityRecommendations = (allRecommendations, limit = 5) => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  return allRecommendations
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, limit);
};

/**
 * Calculate potential impact of recommendations
 */
export const calculateTotalImpact = (recommendations) => {
  let totalSavings = 0;
  let totalRevenueBenefit = 0;
  let totalIncreaseToBottom = 0;

  recommendations.forEach(rec => {
    if (rec.impact.potentialSavings) {
      totalSavings += parseFloat(rec.impact.potentialSavings) || 0;
    }
    if (rec.impact.expectedRevenue) {
      totalRevenueBenefit += parseFloat(rec.impact.expectedRevenue) || 0;
    }
    if (rec.impact.increaseToBottom) {
      totalIncreaseToBottom += parseFloat(rec.impact.increaseToBottom) || 0;
    }
  });

  return {
    totalSavings: totalSavings.toFixed(0),
    totalRevenueBenefit: totalRevenueBenefit.toFixed(0),
    totalIncreaseToBottom: totalIncreaseToBottom.toFixed(0),
    recommendationCount: recommendations.length
  };
};

export default {
  generateRevenueGrowthRecommendations,
  generateCostOptimizationRecommendations,
  generateBranchPerformanceRecommendations,
  getPriorityRecommendations,
  calculateTotalImpact
};
