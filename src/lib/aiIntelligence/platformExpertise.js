/**
 * Multi-Platform Expertise System
 * DeliveryOps MAX AI - Platform-specific intelligence for Jahez, HungerStation, Marsool, Talabat, Careem
 */

// Platform-specific intelligence data
const PLATFORM_INTELLIGENCE = {
  jahez: {
    name: 'Jahez',
    code: 'jahez',
    algorithmType: 'ai_assisted',
    fraudDetectionLevel: 'high',
    refundApprovalRate: 45, // Historical average
    avgResponseTimeHours: 24,
    disputeSuccessRate: 55,

    keyFactors: [
      'Photo evidence heavily weighted',
      'Response time matters - quick responses favored',
      'Customer history considered',
      'Pattern detection active',
      'Merchant reputation score affects decisions'
    ],

    objectionGuidelines: {
      tone: 'professional_and_factual',
      maxLength: 1000,
      requiredElements: ['timestamp', 'evidence', 'policy_reference'],
      effectiveStrategies: [
        'Lead with timestamps and documented facts',
        'Reference Jahez merchant policies specifically',
        'Include photographic evidence',
        'Highlight quality control processes',
        'Mention customer behavior patterns if relevant'
      ],
      avoidances: [
        'Emotional language',
        'Attacking the customer',
        'Vague statements without evidence',
        'Excessive length - be concise'
      ]
    },

    evidenceRequirements: {
      photos: 'highly_recommended',
      timestamps: 'required',
      driverStatement: 'helpful',
      qualityChecks: 'recommended'
    },

    languagePreferences: {
      primary: 'arabic',
      acceptsEnglish: true,
      formalityLevel: 'professional',
      culturalConsiderations: ['Respectful tone essential', 'Islamic greetings acceptable']
    },

    compensationPolicies: {
      fullRefundThreshold: 200,
      partialRefundCommon: true,
      voucherAlternatives: true,
      policyFlexibility: 'moderate'
    },

    commonFraudPatterns: [
      'Late delivery claims on time-delivered orders',
      'Missing items on verified complete orders',
      'Quality complaints without evidence',
      'Serial refunders across multiple restaurants'
    ],

    winningStrategies: [
      'Provide comprehensive timestamp documentation',
      'Include pre-delivery meal photos',
      'Reference specific Jahez policies',
      'Show pattern of good service',
      'Demonstrate quality control compliance'
    ],

    losingPatterns: [
      'Lack of documentation',
      'Late response to dispute',
      'Emotional or aggressive tone',
      'Insufficient evidence',
      'Ignoring customer claim details'
    ]
  },

  hungerstation: {
    name: 'HungerStation',
    code: 'hungerstation',
    algorithmType: 'ai_assisted',
    fraudDetectionLevel: 'very_high',
    refundApprovalRate: 40,
    avgResponseTimeHours: 12,
    disputeSuccessRate: 60,

    keyFactors: [
      'Very sophisticated fraud detection',
      'Customer lifetime value heavily weighted',
      'Response speed critical (faster than others)',
      'Evidence quality over quantity',
      'Strong merchant protection policies'
    ],

    objectionGuidelines: {
      tone: 'professional_evidence_based',
      maxLength: 800,
      requiredElements: ['specific_timestamps', 'evidence_links', 'policy_section'],
      effectiveStrategies: [
        'Lead with strongest evidence first',
        'Use HungerStation policy numbers/sections',
        'Emphasize fraud detection findings',
        'Keep it concise and fact-heavy',
        'Reference their merchant protection program'
      ],
      avoidances: [
        'Long explanations',
        'Generic statements',
        'Defensive tone',
        'Repetition'
      ]
    },

    evidenceRequirements: {
      photos: 'highly_recommended',
      timestamps: 'critical',
      driverStatement: 'helpful',
      qualityChecks: 'recommended',
      systemLogs: 'valued'
    },

    languagePreferences: {
      primary: 'arabic',
      acceptsEnglish: true,
      formalityLevel: 'very_professional',
      culturalConsiderations: ['Saudi cultural norms essential', 'Formal Arabic preferred']
    },

    compensationPolicies: {
      fullRefundThreshold: 150,
      partialRefundCommon: true,
      voucherAlternatives: true,
      policyFlexibility: 'low'
    },

    commonFraudPatterns: [
      'Account farming - new accounts for refunds',
      'Coordinated fraud rings',
      'Driver-customer collusion',
      'Fake missing items with quantity manipulation'
    ],

    winningStrategies: [
      'Fast response (within 6 hours ideal)',
      'Highlight fraud indicators in customer history',
      'Provide system-generated evidence',
      'Reference merchant protection policies',
      'Show compliance with quality standards'
    ],

    losingPatterns: [
      'Slow response',
      'Weak evidence',
      'Ignoring their fraud detection findings',
      'Generic objections',
      'No system data provided'
    ]
  },

  marsool: {
    name: 'Marsool',
    code: 'marsool',
    algorithmType: 'rule_based',
    fraudDetectionLevel: 'medium',
    refundApprovalRate: 55,
    avgResponseTimeHours: 48,
    disputeSuccessRate: 45,

    keyFactors: [
      'More rule-based, less AI',
      'Customer satisfaction prioritized',
      'Manual review common',
      'Less sophisticated fraud detection',
      'More flexible policies'
    ],

    objectionGuidelines: {
      tone: 'respectful_and_understanding',
      maxLength: 1200,
      requiredElements: ['explanation', 'evidence', 'customer_perspective'],
      effectiveStrategies: [
        'Acknowledge customer concern first',
        'Provide detailed explanation',
        'Show willingness to resolve',
        'Offer alternative solutions',
        'Be empathetic but factual'
      ],
      avoidances: [
        'Aggressive tone',
        'Dismissing customer',
        'Over-technical language',
        'Rigid stance'
      ]
    },

    evidenceRequirements: {
      photos: 'recommended',
      timestamps: 'helpful',
      driverStatement: 'valued',
      qualityChecks: 'optional'
    },

    languagePreferences: {
      primary: 'arabic',
      acceptsEnglish: true,
      formalityLevel: 'moderate',
      culturalConsiderations: ['Friendly professional tone', 'Customer-centric language']
    },

    compensationPolicies: {
      fullRefundThreshold: 250,
      partialRefundCommon: true,
      voucherAlternatives: true,
      policyFlexibility: 'high'
    },

    commonFraudPatterns: [
      'Opportunistic refund requests',
      'Exaggerated complaints',
      'Late delivery claims'
    ],

    winningStrategies: [
      'Show goodwill and flexibility',
      'Offer alternative compensation',
      'Provide clear explanations',
      'Maintain customer relationship focus',
      'Be willing to compromise'
    ],

    losingPatterns: [
      'Rigid refusal',
      'Lack of empathy',
      'No alternative offered',
      'Overly aggressive dispute'
    ]
  },

  talabat: {
    name: 'Talabat',
    code: 'talabat',
    algorithmType: 'ai_assisted',
    fraudDetectionLevel: 'high',
    refundApprovalRate: 42,
    avgResponseTimeHours: 18,
    disputeSuccessRate: 58,

    keyFactors: [
      'International standards (Delivery Hero group)',
      'Data-driven decision making',
      'Strong fraud detection',
      'Balanced approach',
      'Professional dispute process'
    ],

    objectionGuidelines: {
      tone: 'professional_international',
      maxLength: 1000,
      requiredElements: ['data', 'timestamps', 'evidence', 'policy'],
      effectiveStrategies: [
        'Use international professional standards',
        'Provide data-driven evidence',
        'Reference quality certifications',
        'Include comprehensive documentation',
        'Show systematic approach to quality'
      ],
      avoidances: [
        'Informal language',
        'Assumptions without data',
        'Cultural-specific arguments',
        'Emotional appeals'
      ]
    },

    evidenceRequirements: {
      photos: 'highly_recommended',
      timestamps: 'required',
      driverStatement: 'helpful',
      qualityChecks: 'recommended',
      certifications: 'valued'
    },

    languagePreferences: {
      primary: 'arabic',
      acceptsEnglish: true,
      formalityLevel: 'professional',
      culturalConsiderations: ['International professional standards', 'Both Arabic and English acceptable']
    },

    compensationPolicies: {
      fullRefundThreshold: 180,
      partialRefundCommon: true,
      voucherAlternatives: true,
      policyFlexibility: 'moderate'
    },

    commonFraudPatterns: [
      'Cross-platform fraud attempts',
      'Professional refund requesters',
      'Fake quality complaints',
      'Timing manipulation'
    ],

    winningStrategies: [
      'Professional documentation',
      'Data-driven objections',
      'Quality certifications',
      'Systematic process documentation',
      'International standards compliance'
    ],

    losingPatterns: [
      'Lack of professional documentation',
      'Emotional arguments',
      'Insufficient data',
      'Poor quality evidence'
    ]
  },

  careem: {
    name: 'Careem',
    code: 'careem',
    algorithmType: 'ai_assisted',
    fraudDetectionLevel: 'high',
    refundApprovalRate: 48,
    avgResponseTimeHours: 24,
    disputeSuccessRate: 52,

    keyFactors: [
      'Customer trust model - reputation matters',
      'Technology-forward approach',
      'Growing platform - policies evolving',
      'Strong app-based evidence system',
      'Customer service focused'
    ],

    objectionGuidelines: {
      tone: 'modern_professional',
      maxLength: 900,
      requiredElements: ['app_data', 'timestamps', 'evidence'],
      effectiveStrategies: [
        'Leverage app-based evidence',
        'Show technology compliance',
        'Provide digital trail',
        'Reference Careem specific features',
        'Emphasize customer experience focus'
      ],
      avoidances: [
        'Traditional/outdated arguments',
        'Lack of digital evidence',
        'Ignoring app data',
        'Generic disputes'
      ]
    },

    evidenceRequirements: {
      photos: 'recommended',
      timestamps: 'required',
      driverStatement: 'helpful',
      qualityChecks: 'recommended',
      appData: 'critical'
    },

    languagePreferences: {
      primary: 'arabic',
      acceptsEnglish: true,
      formalityLevel: 'modern_professional',
      culturalConsiderations: ['Tech-savvy audience', 'Modern Saudi culture', 'App-generation language']
    },

    compensationPolicies: {
      fullRefundThreshold: 200,
      partialRefundCommon: true,
      voucherAlternatives: true,
      policyFlexibility: 'moderate-high'
    },

    commonFraudPatterns: [
      'App manipulation attempts',
      'GPS spoofing',
      'Fake delivery confirmations',
      'Account sharing fraud'
    ],

    winningStrategies: [
      'Use Careem app data',
      'Show digital compliance',
      'Leverage GPS and tracking',
      'Reference in-app confirmations',
      'Demonstrate tech integration'
    ],

    losingPatterns: [
      'Ignoring app evidence',
      'No digital documentation',
      'Traditional evidence only',
      'Slow tech adoption'
    ]
  }
};

/**
 * Get platform-specific intelligence
 */
export function getPlatformIntelligence(platformCode) {
  const code = platformCode?.toLowerCase();
  return PLATFORM_INTELLIGENCE[code] || null;
}

/**
 * Get all platforms
 */
export function getAllPlatforms() {
  return Object.values(PLATFORM_INTELLIGENCE);
}

/**
 * Optimize dispute for specific platform
 */
export function optimizeDisputeForPlatform(dispute, platformCode) {
  const platform = getPlatformIntelligence(platformCode);

  if (!platform) {
    return dispute;
  }

  const optimized = { ...dispute };

  // Adjust tone
  optimized.tone = platform.objectionGuidelines.tone;

  // Adjust length if needed
  if (dispute.objectionText.length > platform.objectionGuidelines.maxLength) {
    optimized.warning = `Objection exceeds ${platform.name} preferred length (${platform.objectionGuidelines.maxLength} chars)`;
  }

  // Add platform-specific recommendations
  optimized.platformRecommendations = {
    responseTimeTarget: `${platform.avgResponseTimeHours} hours`,
    successRate: `${platform.disputeSuccessRate}%`,
    keyStrategies: platform.winningStrategies.slice(0, 3),
    avoid: platform.losingPatterns.slice(0, 2)
  };

  // Evidence recommendations
  optimized.evidenceRecommendations = platform.evidenceRequirements;

  return optimized;
}

/**
 * Generate platform-specific objection template
 */
export function generatePlatformObjectionTemplate(platformCode, refund, evidence) {
  const platform = getPlatformIntelligence(platformCode);

  if (!platform) {
    return null;
  }

  const template = {
    greeting: getPlatformGreeting(platform),
    structure: getPlatformStructure(platform),
    evidenceSection: getEvidenceSection(platform, evidence),
    policySection: getPolicySection(platform),
    closing: getPlatformClosing(platform),
    tips: platform.objectionGuidelines.effectiveStrategies
  };

  return template;
}

function getPlatformGreeting(platform) {
  switch (platform.code) {
    case 'jahez':
      return 'السلام عليكم ورحمة الله وبركاته\nDear Jahez Support Team,';
    case 'hungerstation':
      return 'To HungerStation Merchant Support,';
    case 'marsool':
      return 'Dear Marsool Team,';
    case 'talabat':
      return 'Dear Talabat Support Team,';
    case 'careem':
      return 'Dear Careem NOW Support,';
    default:
      return 'Dear Support Team,';
  }
}

function getPlatformStructure(platform) {
  switch (platform.code) {
    case 'jahez':
      return ['Order Details', 'Evidence Documentation', 'Policy Compliance', 'Request'];
    case 'hungerstation':
      return ['Case Summary', 'Evidence Package', 'Fraud Analysis', 'Merchant Position'];
    case 'marsool':
      return ['Customer Concern', 'Our Investigation', 'Resolution Offer', 'Request'];
    case 'talabat':
      return ['Case Information', 'Documented Evidence', 'Quality Standards', 'Position'];
    case 'careem':
      return ['Order Information', 'Digital Evidence', 'App Data', 'Request'];
    default:
      return ['Summary', 'Evidence', 'Request'];
  }
}

function getEvidenceSection(platform, evidence) {
  const section = {
    priority: [],
    optional: []
  };

  Object.entries(platform.evidenceRequirements).forEach(([type, importance]) => {
    if (importance === 'critical' || importance === 'required' || importance === 'highly_recommended') {
      section.priority.push(type);
    } else {
      section.optional.push(type);
    }
  });

  return section;
}

function getPolicySection(platform) {
  return {
    reference: `${platform.name} Merchant Agreement`,
    keyPolicies: [
      'Service standards compliance',
      'Quality assurance requirements',
      'Dispute resolution process',
      'Evidence-based decision making'
    ]
  };
}

function getPlatformClosing(platform) {
  switch (platform.code) {
    case 'jahez':
      return 'We appreciate your fair consideration and partnership with Jahez.\n\nBest regards,\nRestaurant Management';
    case 'hungerstation':
      return 'We trust in HungerStation\'s evidence-based approach to dispute resolution.\n\nRespectfully,\nMerchant Operations';
    case 'marsool':
      return 'Thank you for your understanding and partnership.\n\nWarm regards,\nRestaurant Team';
    case 'talabat':
      return 'We appreciate Talabat\'s professional approach to dispute resolution.\n\nBest regards,\nRestaurant Management';
    case 'careem':
      return 'Thank you for your partnership with Careem NOW.\n\nBest regards,\nRestaurant Operations';
    default:
      return 'Best regards,\nRestaurant Management';
  }
}

/**
 * Analyze platform-specific success factors
 */
export function analyzePlatformPerformance(refunds, disputes, platformCode) {
  const platformRefunds = refunds.filter(r =>
    r.platform_name?.toLowerCase() === platformCode?.toLowerCase()
  );

  const platformDisputes = disputes.filter(d => {
    const refund = refunds.find(r => r.id === d.refund_id);
    return refund && refund.platform_name?.toLowerCase() === platformCode?.toLowerCase();
  });

  const analysis = {
    platformCode,
    platformName: getPlatformIntelligence(platformCode)?.name || platformCode,
    totalRefunds: platformRefunds.length,
    totalDisputes: platformDisputes.length,
    disputeRate: platformRefunds.length > 0 ? (platformDisputes.length / platformRefunds.length * 100).toFixed(1) : 0,
    approvedRefunds: platformRefunds.filter(r => r.status === 'approved').length,
    rejectedRefunds: platformRefunds.filter(r => r.status === 'rejected').length,
    disputedRefunds: platformRefunds.filter(r => r.status === 'disputed').length,
    successfulDisputes: platformDisputes.filter(d => d.status === 'accepted').length,
    failedDisputes: platformDisputes.filter(d => d.status === 'rejected').length,
    disputeSuccessRate: 0,
    totalRefundAmount: platformRefunds.reduce((sum, r) => sum + r.refund_amount, 0),
    averageRefundAmount: 0,
    topRefundReasons: [],
    recommendations: []
  };

  if (platformRefunds.length > 0) {
    analysis.averageRefundAmount = analysis.totalRefundAmount / platformRefunds.length;
  }

  if (platformDisputes.length > 0) {
    analysis.disputeSuccessRate = (analysis.successfulDisputes / platformDisputes.length * 100).toFixed(1);
  }

  // Top refund reasons
  const reasonCounts = {};
  platformRefunds.forEach(r => {
    const reason = r.refund_reason || 'unknown';
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  analysis.topRefundReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason, count]) => ({ reason, count }));

  // Generate recommendations
  const platform = getPlatformIntelligence(platformCode);
  if (platform) {
    if (analysis.disputeSuccessRate < platform.disputeSuccessRate) {
      analysis.recommendations.push(`Dispute success rate (${analysis.disputeSuccessRate}%) below platform average (${platform.disputeSuccessRate}%) - review dispute strategies`);
    }

    if (analysis.averageRefundAmount > platform.compensationPolicies.fullRefundThreshold) {
      analysis.recommendations.push(`Average refund amount (${analysis.averageRefundAmount.toFixed(2)} SAR) exceeds typical threshold - focus on partial refund negotiations`);
    }

    analysis.recommendations.push(`Key success factors for ${platform.name}: ${platform.winningStrategies.slice(0, 2).join(', ')}`);
  }

  return analysis;
}

/**
 * Get best practices for platform
 */
export function getPlatformBestPractices(platformCode) {
  const platform = getPlatformIntelligence(platformCode);

  if (!platform) {
    return null;
  }

  return {
    platform: platform.name,
    responseTime: `Respond within ${platform.avgResponseTimeHours} hours`,
    evidencePriority: Object.entries(platform.evidenceRequirements)
      .filter(([_, importance]) => importance === 'critical' || importance === 'required')
      .map(([type]) => type),
    toneGuidelines: platform.objectionGuidelines.tone,
    mustInclude: platform.objectionGuidelines.requiredElements,
    strategies: platform.winningStrategies,
    avoid: platform.losingPatterns,
    languagePreference: platform.languagePreferences.primary,
    culturalNotes: platform.languagePreferences.culturalConsiderations
  };
}

export default {
  getPlatformIntelligence,
  getAllPlatforms,
  optimizeDisputeForPlatform,
  generatePlatformObjectionTemplate,
  analyzePlatformPerformance,
  getPlatformBestPractices
};
