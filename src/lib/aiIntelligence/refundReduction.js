/**
 * Refund Reduction Strategy Engine
 * DeliveryOps MAX AI - Strategic recommendations to reduce refund losses
 */

/**
 * Generate comprehensive refund reduction strategy
 * @param {Array} refunds - Historical refund data
 * @param {Array} branches - Branch data
 * @param {Array} patterns - Detected refund patterns
 * @returns {Object} Reduction strategy with actionable recommendations
 */
export function generateReductionStrategy(refunds, branches = [], patterns = []) {
  const strategy = {
    overview: {
      totalRefunds: refunds.length,
      totalLoss: refunds.reduce((sum, r) => sum + r.refund_amount, 0),
      estimatedRecoveryPotential: 0,
      priorityActions: []
    },
    departmentActions: {
      kitchen: [],
      packaging: [],
      delivery: [],
      operations: [],
      management: []
    },
    quickWins: [], // Easy to implement, high impact
    strategicInitiatives: [], // Longer term, transformational
    preventionMeasures: [],
    expectedImpact: {
      shortTerm: { reduction: 0, timeframe: '30 days' },
      mediumTerm: { reduction: 0, timeframe: '90 days' },
      longTerm: { reduction: 0, timeframe: '180 days' }
    },
    riskIfIgnored: [],
    implementation: {
      immediate: [],
      thisWeek: [],
      thisMonth: [],
      ongoing: []
    }
  };

  // Analyze refund root causes
  const rootCauses = analyzeRootCauses(refunds);

  // Generate department-specific actions
  strategy.departmentActions = generateDepartmentActions(rootCauses, refunds);

  // Identify quick wins
  strategy.quickWins = identifyQuickWins(rootCauses, refunds);

  // Generate strategic initiatives
  strategy.strategicInitiatives = generateStrategicInitiatives(rootCauses, patterns, refunds);

  // Generate prevention measures
  strategy.preventionMeasures = generatePreventionMeasures(rootCauses, refunds);

  // Calculate expected impact
  strategy.expectedImpact = calculateExpectedImpact(strategy, refunds);

  // Identify risks if ignored
  strategy.riskIfIgnored = identifyRisks(rootCauses, refunds);

  // Create implementation timeline
  strategy.implementation = createImplementationTimeline(strategy);

  // Calculate recovery potential
  strategy.overview.estimatedRecoveryPotential = calculateRecoveryPotential(refunds, strategy);

  // Generate priority actions
  strategy.overview.priorityActions = generatePriorityActions(strategy);

  return strategy;
}

/**
 * Analyze root causes of refunds
 */
function analyzeRootCauses(refunds) {
  const causes = {
    lateDelivery: { count: 0, amount: 0, percentage: 0 },
    wrongOrder: { count: 0, amount: 0, percentage: 0 },
    missingItems: { count: 0, amount: 0, percentage: 0 },
    qualityIssue: { count: 0, amount: 0, percentage: 0 },
    coldFood: { count: 0, amount: 0, percentage: 0 },
    packaging: { count: 0, amount: 0, percentage: 0 },
    other: { count: 0, amount: 0, percentage: 0 }
  };

  refunds.forEach(refund => {
    const reason = refund.refund_reason?.toLowerCase() || '';
    const amount = refund.refund_amount;

    if (reason.includes('late') || reason.includes('delay')) {
      causes.lateDelivery.count++;
      causes.lateDelivery.amount += amount;
    } else if (reason.includes('wrong') || reason.includes('incorrect')) {
      causes.wrongOrder.count++;
      causes.wrongOrder.amount += amount;
    } else if (reason.includes('missing')) {
      causes.missingItems.count++;
      causes.missingItems.amount += amount;
    } else if (reason.includes('quality') || reason.includes('bad') || reason.includes('burnt') || reason.includes('raw')) {
      causes.qualityIssue.count++;
      causes.qualityIssue.amount += amount;
    } else if (reason.includes('cold') || reason.includes('temperature')) {
      causes.coldFood.count++;
      causes.coldFood.amount += amount;
    } else if (reason.includes('packaging') || reason.includes('damaged') || reason.includes('spilled')) {
      causes.packaging.count++;
      causes.packaging.amount += amount;
    } else {
      causes.other.count++;
      causes.other.amount += amount;
    }
  });

  // Calculate percentages
  Object.keys(causes).forEach(key => {
    causes[key].percentage = refunds.length > 0 ?
      ((causes[key].count / refunds.length) * 100).toFixed(1) : 0;
  });

  return causes;
}

/**
 * Generate department-specific actions
 */
function generateDepartmentActions(rootCauses, refunds) {
  const actions = {
    kitchen: [],
    packaging: [],
    delivery: [],
    operations: [],
    management: []
  };

  // Kitchen actions
  if (rootCauses.qualityIssue.count > 0 || rootCauses.coldFood.count > 0) {
    actions.kitchen.push({
      priority: 'high',
      action: 'Implement real-time quality checkpoints',
      description: 'Add mandatory quality verification before dispatch',
      expectedImprovement: '35-45%',
      department: 'Kitchen',
      responsible: 'Kitchen Manager',
      timeline: 'This week',
      cost: 'Low',
      effort: 'Medium'
    });

    actions.kitchen.push({
      priority: 'high',
      action: 'Enhanced food temperature monitoring',
      description: 'Use infrared thermometers to verify food temperature before packaging',
      expectedImprovement: '40-50%',
      department: 'Kitchen',
      responsible: 'Kitchen Manager',
      timeline: 'Immediate',
      cost: 'Low (100-200 SAR for thermometer)',
      effort: 'Low'
    });

    actions.kitchen.push({
      priority: 'medium',
      action: 'Recipe and preparation training',
      description: 'Retrain staff on recipes and cooking standards',
      expectedImprovement: '25-35%',
      department: 'Kitchen',
      responsible: 'Head Chef',
      timeline: 'This month',
      cost: 'Medium',
      effort: 'High'
    });
  }

  if (rootCauses.lateDelivery.count > 0) {
    actions.kitchen.push({
      priority: 'high',
      action: 'Optimize preparation workflow',
      description: 'Streamline kitchen processes to reduce prep time',
      expectedImprovement: '30-40%',
      department: 'Kitchen',
      responsible: 'Kitchen Manager',
      timeline: 'This week',
      cost: 'Low',
      effort: 'Medium'
    });
  }

  // Packaging actions
  if (rootCauses.wrongOrder.count > 0 || rootCauses.missingItems.count > 0) {
    actions.packaging.push({
      priority: 'critical',
      action: 'Double-check system implementation',
      description: 'Require two-person verification for all orders',
      expectedImprovement: '50-60%',
      department: 'Packaging',
      responsible: 'Packaging Supervisor',
      timeline: 'Immediate',
      cost: 'Low',
      effort: 'Low'
    });

    actions.packaging.push({
      priority: 'high',
      action: 'Digital checklist system',
      description: 'Implement tablet-based order verification checklist',
      expectedImprovement: '45-55%',
      department: 'Packaging',
      responsible: 'Operations Manager',
      timeline: 'This month',
      cost: 'Medium (500-1000 SAR)',
      effort: 'Medium'
    });
  }

  if (rootCauses.packaging.count > 0) {
    actions.packaging.push({
      priority: 'high',
      action: 'Upgrade packaging materials',
      description: 'Use higher quality, leak-proof containers',
      expectedImprovement: '60-70%',
      department: 'Packaging',
      responsible: 'Operations Manager',
      timeline: 'This week',
      cost: 'Medium',
      effort: 'Low'
    });

    actions.packaging.push({
      priority: 'medium',
      action: 'Packaging technique training',
      description: 'Train staff on proper food packaging methods',
      expectedImprovement: '30-40%',
      department: 'Packaging',
      responsible: 'Packaging Supervisor',
      timeline: 'This week',
      cost: 'Low',
      effort: 'Medium'
    });
  }

  // Delivery actions
  if (rootCauses.lateDelivery.count > 0 || rootCauses.coldFood.count > 0) {
    actions.delivery.push({
      priority: 'high',
      action: 'Optimize delivery zone assignments',
      description: 'Reduce delivery distances and optimize routes',
      expectedImprovement: '35-45%',
      department: 'Delivery',
      responsible: 'Delivery Manager',
      timeline: 'This week',
      cost: 'Low',
      effort: 'Medium'
    });

    actions.delivery.push({
      priority: 'high',
      action: 'Thermal bag quality upgrade',
      description: 'Invest in high-quality insulated delivery bags',
      expectedImprovement: '40-50%',
      department: 'Delivery',
      responsible: 'Operations Manager',
      timeline: 'This week',
      cost: 'Medium (200-400 SAR per bag)',
      effort: 'Low'
    });

    actions.delivery.push({
      priority: 'medium',
      action: 'Driver performance monitoring',
      description: 'Track and improve driver efficiency',
      expectedImprovement: '25-35%',
      department: 'Delivery',
      responsible: 'Delivery Manager',
      timeline: 'This month',
      cost: 'Low',
      effort: 'Medium'
    });
  }

  // Operations actions
  actions.operations.push({
    priority: 'high',
    action: 'Real-time order tracking alerts',
    description: 'Implement automated alerts for time threshold violations',
    expectedImprovement: '30-40%',
    department: 'Operations',
    responsible: 'Operations Manager',
    timeline: 'This month',
    cost: 'Low (software integration)',
    effort: 'Medium'
  });

  actions.operations.push({
    priority: 'medium',
    action: 'Peak hour capacity planning',
    description: 'Adjust staffing based on demand patterns',
    expectedImprovement: '25-35%',
    department: 'Operations',
    responsible: 'Operations Manager',
    timeline: 'This week',
    cost: 'Variable',
    effort: 'High'
  });

  actions.operations.push({
    priority: 'medium',
    action: 'Order acceptance threshold management',
    description: 'Limit concurrent orders during peak to maintain quality',
    expectedImprovement: '30-40%',
    department: 'Operations',
    responsible: 'Operations Manager',
    timeline: 'Immediate',
    cost: 'Zero (revenue vs quality trade-off)',
    effort: 'Low'
  });

  // Management actions
  actions.management.push({
    priority: 'critical',
    action: 'Weekly refund review meetings',
    description: 'Analyze refund patterns and adjust strategies weekly',
    expectedImprovement: '20-30%',
    department: 'Management',
    responsible: 'General Manager',
    timeline: 'Immediate',
    cost: 'Low (staff time)',
    effort: 'Medium'
  });

  actions.management.push({
    priority: 'high',
    action: 'Staff incentive program for low refund rates',
    description: 'Reward teams with low refund rates',
    expectedImprovement: '25-35%',
    department: 'Management',
    responsible: 'General Manager',
    timeline: 'This month',
    cost: 'Medium',
    effort: 'Medium'
  });

  return actions;
}

/**
 * Identify quick wins - easy to implement, high impact
 */
function identifyQuickWins(rootCauses, refunds) {
  const quickWins = [];

  // Quick win 1: Double-check system
  if (rootCauses.wrongOrder.count > 0 || rootCauses.missingItems.count > 0) {
    quickWins.push({
      title: 'Implement Double-Check System',
      description: 'Require two people to verify every order before dispatch',
      impact: 'high',
      effort: 'low',
      cost: 'zero',
      timeToImplement: '1 day',
      expectedReduction: '50-60%',
      affectedRefunds: rootCauses.wrongOrder.count + rootCauses.missingItems.count,
      savingsPotential: rootCauses.wrongOrder.amount + rootCauses.missingItems.amount
    });
  }

  // Quick win 2: Temperature checks
  if (rootCauses.coldFood.count > 0) {
    quickWins.push({
      title: 'Mandatory Temperature Verification',
      description: 'Check food temperature with thermometer before packaging',
      impact: 'high',
      effort: 'low',
      cost: '100-200 SAR',
      timeToImplement: '1 day',
      expectedReduction: '40-50%',
      affectedRefunds: rootCauses.coldFood.count,
      savingsPotential: rootCauses.coldFood.amount
    });
  }

  // Quick win 3: Order acceptance limits
  if (rootCauses.lateDelivery.count > 0) {
    quickWins.push({
      title: 'Peak Hour Order Limits',
      description: 'Reduce order acceptance during peak hours to maintain quality',
      impact: 'medium',
      effort: 'low',
      cost: 'zero',
      timeToImplement: 'immediate',
      expectedReduction: '30-40%',
      affectedRefunds: rootCauses.lateDelivery.count,
      savingsPotential: rootCauses.lateDelivery.amount
    });
  }

  // Quick win 4: Better packaging materials
  if (rootCauses.packaging.count > 0) {
    quickWins.push({
      title: 'Upgrade Packaging Quality',
      description: 'Switch to leak-proof, secure containers',
      impact: 'high',
      effort: 'low',
      cost: 'medium',
      timeToImplement: '2-3 days',
      expectedReduction: '60-70%',
      affectedRefunds: rootCauses.packaging.count,
      savingsPotential: rootCauses.packaging.amount
    });
  }

  // Quick win 5: Proactive customer communication
  quickWins.push({
    title: 'Proactive Delay Notifications',
    description: 'Notify customers immediately when delays occur',
    impact: 'medium',
    effort: 'low',
    cost: 'zero',
    timeToImplement: 'immediate',
    expectedReduction: '20-30%',
    affectedRefunds: Math.floor(refunds.length * 0.3),
    savingsPotential: refunds.reduce((sum, r) => sum + r.refund_amount, 0) * 0.2
  });

  return quickWins.sort((a, b) =>
    (b.savingsPotential / (b.cost === 'zero' ? 1 : 1000)) -
    (a.savingsPotential / (a.cost === 'zero' ? 1 : 1000))
  );
}

/**
 * Generate strategic initiatives
 */
function generateStrategicInitiatives(rootCauses, patterns, refunds) {
  const initiatives = [];

  // Initiative 1: AI-powered quality control
  initiatives.push({
    title: 'AI-Powered Quality Monitoring System',
    description: 'Implement computer vision for automated meal quality verification',
    businessCase: 'Eliminate human error in quality control',
    impact: 'transformational',
    effort: 'high',
    cost: 'high (5,000-10,000 SAR)',
    timeframe: '2-3 months',
    expectedReduction: '60-70%',
    roi: 'High - payback in 3-6 months',
    requirements: ['Camera system', 'AI software', 'Training']
  });

  // Initiative 2: Integrated operations dashboard
  initiatives.push({
    title: 'Real-Time Operations Dashboard',
    description: 'Centralized monitoring of all orders with predictive alerts',
    businessCase: 'Catch issues before they become refunds',
    impact: 'high',
    effort: 'medium',
    cost: 'medium (2,000-5,000 SAR)',
    timeframe: '1-2 months',
    expectedReduction: '40-50%',
    roi: 'High - payback in 2-4 months',
    requirements: ['Software development', 'Integration', 'Staff training']
  });

  // Initiative 3: Customer feedback loop
  initiatives.push({
    title: 'Proactive Customer Feedback System',
    description: 'Contact customers immediately after delivery to address concerns',
    businessCase: 'Resolve issues before refund requests',
    impact: 'medium',
    effort: 'medium',
    cost: 'low (staff time)',
    timeframe: '2-4 weeks',
    expectedReduction: '25-35%',
    roi: 'Very High - immediate savings',
    requirements: ['Staff allocation', 'Communication scripts', 'CRM system']
  });

  // Initiative 4: Staff certification program
  initiatives.push({
    title: 'Quality Excellence Certification Program',
    description: 'Comprehensive training and certification for all staff',
    businessCase: 'Build culture of quality and accountability',
    impact: 'high',
    effort: 'high',
    cost: 'medium (1,000-3,000 SAR)',
    timeframe: '1-2 months',
    expectedReduction: '35-45%',
    roi: 'Medium - payback in 4-8 months',
    requirements: ['Training materials', 'Certification system', 'Ongoing assessment']
  });

  // Initiative 5: Predictive analytics system
  initiatives.push({
    title: 'Refund Prevention AI',
    description: 'Use AI to predict and prevent refund-prone orders',
    businessCase: 'Identify high-risk orders before dispatch',
    impact: 'transformational',
    effort: 'high',
    cost: 'high (implement NAVA DeliveryOps MAX AI)',
    timeframe: '1 month (already built!)',
    expectedReduction: '50-70%',
    roi: 'Very High - immediate impact',
    requirements: ['DeliveryOps MAX AI module', 'Data integration', 'Staff training']
  });

  return initiatives;
}

/**
 * Generate prevention measures
 */
function generatePreventionMeasures(rootCauses, refunds) {
  const measures = [];

  measures.push({
    category: 'Quality Control',
    measure: 'Multi-point quality checkpoints',
    description: 'Verify quality at prep, packaging, and dispatch stages',
    preventedIssues: ['quality', 'wrong items', 'missing items'],
    implementationCost: 'Low',
    ongoingCost: 'Very Low'
  });

  measures.push({
    category: 'Time Management',
    measure: 'Automated time alerts',
    description: 'Alert staff when orders exceed time thresholds',
    preventedIssues: ['late delivery', 'cold food'],
    implementationCost: 'Low',
    ongoingCost: 'Zero'
  });

  measures.push({
    category: 'Communication',
    measure: 'Proactive customer updates',
    description: 'Notify customers of status changes and delays',
    preventedIssues: ['late delivery complaints', 'customer frustration'],
    implementationCost: 'Zero',
    ongoingCost: 'Low (staff time)'
  });

  measures.push({
    category: 'Process',
    measure: 'Digital order tracking',
    description: 'Track every order through each stage digitally',
    preventedIssues: ['wrong orders', 'missing items', 'delays'],
    implementationCost: 'Medium',
    ongoingCost: 'Low'
  });

  measures.push({
    category: 'Monitoring',
    measure: 'Real-time performance dashboards',
    description: 'Monitor KPIs in real-time to catch issues early',
    preventedIssues: ['all types'],
    implementationCost: 'Medium',
    ongoingCost: 'Low'
  });

  return measures;
}

/**
 * Calculate expected impact
 */
function calculateExpectedImpact(strategy, refunds) {
  const totalLoss = refunds.reduce((sum, r) => sum + r.refund_amount, 0);

  return {
    shortTerm: {
      reduction: Math.round(totalLoss * 0.25), // 25% reduction in 30 days
      percentage: 25,
      timeframe: '30 days',
      actions: 'Quick wins + immediate department actions'
    },
    mediumTerm: {
      reduction: Math.round(totalLoss * 0.50), // 50% reduction in 90 days
      percentage: 50,
      timeframe: '90 days',
      actions: 'All department actions + strategic initiatives'
    },
    longTerm: {
      reduction: Math.round(totalLoss * 0.70), // 70% reduction in 180 days
      percentage: 70,
      timeframe: '180 days',
      actions: 'Full implementation + continuous improvement'
    }
  };
}

/**
 * Identify risks if strategies ignored
 */
function identifyRisks(rootCauses, refunds) {
  const risks = [];
  const totalLoss = refunds.reduce((sum, r) => sum + r.refund_amount, 0);

  risks.push({
    risk: 'Financial Losses Will Escalate',
    impact: 'critical',
    projection: `Current monthly loss: ${(totalLoss / 12).toFixed(2)} SAR. Without action: ${(totalLoss * 1.5 / 12).toFixed(2)} SAR/month (50% increase)`,
    timeline: '3-6 months'
  });

  risks.push({
    risk: 'Platform Reputation Damage',
    impact: 'high',
    projection: 'High refund rates trigger platform penalties and reduced visibility',
    timeline: '1-3 months'
  });

  risks.push({
    risk: 'Customer Trust Erosion',
    impact: 'high',
    projection: 'Quality issues lead to negative reviews and lost customers',
    timeline: 'Immediate and ongoing'
  });

  risks.push({
    risk: 'Staff Morale Decline',
    impact: 'medium',
    projection: 'Constant complaints demoralize team, increase turnover',
    timeline: '2-4 months'
  });

  risks.push({
    risk: 'Competitive Disadvantage',
    impact: 'high',
    projection: 'Competitors with better quality capture market share',
    timeline: 'Ongoing'
  });

  return risks;
}

/**
 * Create implementation timeline
 */
function createImplementationTimeline(strategy) {
  const timeline = {
    immediate: [],
    thisWeek: [],
    thisMonth: [],
    ongoing: []
  };

  // Add quick wins to immediate
  strategy.quickWins.forEach(qw => {
    if (qw.timeToImplement === 'immediate' || qw.timeToImplement === '1 day') {
      timeline.immediate.push({
        action: qw.title,
        effort: qw.effort,
        cost: qw.cost
      });
    }
  });

  // Add department actions based on timeline
  Object.values(strategy.departmentActions).forEach(deptActions => {
    deptActions.forEach(action => {
      if (action.timeline === 'Immediate') {
        timeline.immediate.push({
          action: action.action,
          effort: action.effort,
          cost: action.cost,
          department: action.department
        });
      } else if (action.timeline === 'This week') {
        timeline.thisWeek.push({
          action: action.action,
          effort: action.effort,
          cost: action.cost,
          department: action.department
        });
      } else if (action.timeline === 'This month') {
        timeline.thisMonth.push({
          action: action.action,
          effort: action.effort,
          cost: action.cost,
          department: action.department
        });
      }
    });
  });

  // Ongoing actions
  timeline.ongoing.push({
    action: 'Monitor refund trends',
    frequency: 'Daily'
  });

  timeline.ongoing.push({
    action: 'Review and adjust strategies',
    frequency: 'Weekly'
  });

  timeline.ongoing.push({
    action: 'Staff training and development',
    frequency: 'Monthly'
  });

  return timeline;
}

/**
 * Calculate recovery potential
 */
function calculateRecoveryPotential(refunds, strategy) {
  const totalLoss = refunds.reduce((sum, r) => sum + r.refund_amount, 0);

  // Quick wins potential
  const quickWinsPotential = strategy.quickWins.reduce((sum, qw) => sum + (qw.savingsPotential || 0), 0);

  // Medium term from all actions (50% reduction)
  const mediumTermPotential = totalLoss * 0.5;

  return Math.round(Math.min(quickWinsPotential, mediumTermPotential));
}

/**
 * Generate priority actions
 */
function generatePriorityActions(strategy) {
  const priorities = [];

  // Top 3 quick wins
  strategy.quickWins.slice(0, 3).forEach((qw, index) => {
    priorities.push({
      rank: index + 1,
      action: qw.title,
      rationale: `${qw.impact} impact, ${qw.effort} effort, saves ${qw.savingsPotential.toFixed(2)} SAR`,
      implement: qw.timeToImplement
    });
  });

  return priorities;
}

export default {
  generateReductionStrategy
};
