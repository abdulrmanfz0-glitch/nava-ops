/**
 * DeliveryOps MAX AI - API Service
 * Complete API layer for Refund & Dispute Intelligence Engine
 */

import { supabase } from '../lib/supabase';
import { analyzeRefund, analyzeRefundTrends, identifyHighRiskItems, analyzeBranchRefundPerformance } from '../lib/aiIntelligence/refundAnalysis';
import { generateDispute } from '../lib/aiIntelligence/disputeWriting';
import { analyzeFraud, detectDriverCollusion, detectQuantityManipulation, generateCustomerFraudReport } from '../lib/aiIntelligence/fraudDetection';
import { analyzeCustomerBehavior, benchmarkCustomer, predictCustomerBehavior } from '../lib/aiIntelligence/customerBehavior';
import { getPlatformIntelligence, getAllPlatforms, optimizeDisputeForPlatform, analyzePlatformPerformance, getPlatformBestPractices } from '../lib/aiIntelligence/platformExpertise';
import { generateReductionStrategy } from '../lib/aiIntelligence/refundReduction';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REFUNDS API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const refundsAPI = {
  /**
   * Get all refunds for user
   */
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from('refunds')
        .select('*, branches(name), delivery_platforms(platform_name)')
        .order('refund_request_time', { ascending: false });

      if (filters.branchId) {
        query = query.eq('branch_id', filters.branchId);
      }

      if (filters.platformId) {
        query = query.eq('platform_id', filters.platformId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.riskLevel) {
        query = query.eq('risk_level', filters.riskLevel);
      }

      if (filters.startDate) {
        query = query.gte('refund_request_time', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('refund_request_time', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching refunds:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get single refund by ID
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('*, branches(name), delivery_platforms(platform_name)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching refund:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create new refund
   */
  async create(refundData) {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .insert(refundData)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating refund:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update refund
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating refund:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete refund
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('refunds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting refund:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Analyze refund with AI
   */
  async analyze(refundId) {
    try {
      // Get refund data
      const refundResult = await this.getById(refundId);
      if (!refundResult.success) throw new Error(refundResult.error);

      const refund = refundResult.data;

      // Get historical refunds for context
      const historicalResult = await this.getAll({ branchId: refund.branch_id });
      const historicalRefunds = historicalResult.success ? historicalResult.data : [];

      // Get customer behavior
      const customerResult = await customerBehaviorAPI.getByCustomer(refund.customer_id, refund.platform_name);
      const customerBehavior = customerResult.success ? customerResult.data : null;

      // Analyze refund
      const analysis = analyzeRefund(refund, historicalRefunds, customerBehavior);

      // Update refund with analysis
      await this.update(refundId, {
        fraud_score: analysis.fraudScore,
        risk_level: analysis.riskLevel,
        root_cause: analysis.rootCause,
        responsible_department: analysis.responsibleDepartment,
        estimated_loss: analysis.financialImpact.estimatedLoss,
        recovery_potential: analysis.financialImpact.recoveryPotential
      });

      return { success: true, data: analysis };
    } catch (error) {
      console.error('Error analyzing refund:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get refund statistics
   */
  async getStatistics(filters = {}) {
    try {
      const result = await this.getAll(filters);
      if (!result.success) throw new Error(result.error);

      const refunds = result.data;

      const stats = {
        totalRefunds: refunds.length,
        totalAmount: refunds.reduce((sum, r) => sum + r.refund_amount, 0),
        averageAmount: 0,
        byStatus: {
          pending: refunds.filter(r => r.status === 'pending').length,
          approved: refunds.filter(r => r.status === 'approved').length,
          rejected: refunds.filter(r => r.status === 'rejected').length,
          disputed: refunds.filter(r => r.status === 'disputed').length
        },
        byRiskLevel: {
          low: refunds.filter(r => r.risk_level === 'low').length,
          medium: refunds.filter(r => r.risk_level === 'medium').length,
          high: refunds.filter(r => r.risk_level === 'high').length,
          critical: refunds.filter(r => r.risk_level === 'critical').length
        },
        trends: analyzeRefundTrends(refunds),
        highRiskItems: identifyHighRiskItems(refunds)
      };

      if (stats.totalRefunds > 0) {
        stats.averageAmount = stats.totalAmount / stats.totalRefunds;
      }

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting refund statistics:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DISPUTES API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const disputesAPI = {
  /**
   * Get all disputes
   */
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from('disputes')
        .select('*, refunds(*)')
        .order('created_at', { ascending: false });

      if (filters.refundId) {
        query = query.eq('refund_id', filters.refundId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.level) {
        query = query.eq('dispute_level', filters.level);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching disputes:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get single dispute
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select('*, refunds(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching dispute:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate dispute objection using AI
   */
  async generate(refundId, level = 'auto', evidence = {}) {
    try {
      // Get refund data
      const refundResult = await refundsAPI.getById(refundId);
      if (!refundResult.success) throw new Error(refundResult.error);

      const refund = refundResult.data;

      // Analyze refund first
      const analysisResult = await refundsAPI.analyze(refundId);
      if (!analysisResult.success) throw new Error(analysisResult.error);

      const analysis = analysisResult.data;

      // Get customer behavior
      const customerResult = await customerBehaviorAPI.getByCustomer(refund.customer_id, refund.platform_name);
      const customerBehavior = customerResult.success ? customerResult.data : null;

      // Generate dispute
      const dispute = generateDispute(refund, analysis, customerBehavior, evidence, level, refund.platform_name);

      // Optimize for platform
      const optimized = optimizeDisputeForPlatform(dispute, refund.platform_name);

      return { success: true, data: optimized };
    } catch (error) {
      console.error('Error generating dispute:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create dispute
   */
  async create(disputeData) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .insert(disputeData)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating dispute:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update dispute
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating dispute:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Submit dispute to platform
   */
  async submit(id) {
    try {
      const updates = {
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };

      const result = await this.update(id, updates);

      return result;
    } catch (error) {
      console.error('Error submitting dispute:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOMER BEHAVIOR API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const customerBehaviorAPI = {
  /**
   * Get all customer behavior records
   */
  async getAll(filters = {}) {
    try {
      let query = supabase
        .from('customer_behavior')
        .select('*')
        .order('fraud_score', { ascending: false });

      if (filters.customerType) {
        query = query.eq('customer_type', filters.customerType);
      }

      if (filters.minFraudScore) {
        query = query.gte('fraud_score', filters.minFraudScore);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching customer behavior:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get customer behavior by customer ID
   */
  async getByCustomer(customerId, platformName) {
    try {
      const { data, error } = await supabase
        .from('customer_behavior')
        .select('*')
        .eq('customer_id', customerId)
        .eq('platform_name', platformName)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found

      return { success: true, data: data || null };
    } catch (error) {
      console.error('Error fetching customer behavior:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Analyze customer behavior
   */
  async analyze(customerId, platformName) {
    try {
      // Get or create customer behavior record
      const behaviorResult = await this.getByCustomer(customerId, platformName);
      let customerData = behaviorResult.data;

      // Get customer's refunds
      const refundsResult = await refundsAPI.getAll({ customerId });
      const refunds = refundsResult.success ? refundsResult.data.filter(r => r.customer_id === customerId) : [];

      // Get customer's orders (if available)
      const orders = []; // TODO: Get from orders table when available

      // Analyze behavior
      const profile = analyzeCustomerBehavior(customerData || { customer_id: customerId }, refunds, orders);

      // Update or create customer behavior record
      const behaviorRecord = {
        customer_id: customerId,
        platform_name: platformName,
        customer_type: profile.customerType,
        fraud_score: profile.behaviorScore,
        trust_score: profile.trustScore,
        recommended_action: profile.recommendations.shouldApprove,
        recommended_objection_level: profile.recommendations.objectionLevel
      };

      if (customerData) {
        await this.update(customerData.id, behaviorRecord);
      } else {
        await this.create(behaviorRecord);
      }

      return { success: true, data: profile };
    } catch (error) {
      console.error('Error analyzing customer behavior:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create customer behavior record
   */
  async create(data) {
    try {
      const { data: result, error } = await supabase
        .from('customer_behavior')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating customer behavior:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update customer behavior record
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('customer_behavior')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating customer behavior:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FRAUD DETECTION API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const fraudDetectionAPI = {
  /**
   * Analyze fraud for a refund
   */
  async analyzeRefund(refundId) {
    try {
      const refundResult = await refundsAPI.getById(refundId);
      if (!refundResult.success) throw new Error(refundResult.error);

      const refund = refundResult.data;

      const customerResult = await customerBehaviorAPI.getByCustomer(refund.customer_id, refund.platform_name);
      const customerBehavior = customerResult.data;

      const historicalResult = await refundsAPI.getAll({ customerId: refund.customer_id });
      const historicalRefunds = historicalResult.success ? historicalResult.data : [];

      const analysis = analyzeFraud(refund, customerBehavior, historicalRefunds);

      return { success: true, data: analysis };
    } catch (error) {
      console.error('Error analyzing fraud:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Detect driver-customer collusion
   */
  async detectCollusion() {
    try {
      const refundsResult = await refundsAPI.getAll();
      if (!refundsResult.success) throw new Error(refundsResult.error);

      const risks = detectDriverCollusion(refundsResult.data);

      return { success: true, data: risks };
    } catch (error) {
      console.error('Error detecting collusion:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate customer fraud report
   */
  async generateCustomerReport(customerId) {
    try {
      const refundsResult = await refundsAPI.getAll();
      const refunds = refundsResult.success ? refundsResult.data : [];

      const orders = []; // TODO: Get from orders table

      const report = generateCustomerFraudReport(customerId, refunds, orders);

      return { success: true, data: report };
    } catch (error) {
      console.error('Error generating fraud report:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLATFORM INTELLIGENCE API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const platformAPI = {
  /**
   * Get platform intelligence
   */
  getIntelligence(platformCode) {
    return getPlatformIntelligence(platformCode);
  },

  /**
   * Get all platforms
   */
  getAll() {
    return getAllPlatforms();
  },

  /**
   * Get best practices for platform
   */
  getBestPractices(platformCode) {
    return getPlatformBestPractices(platformCode);
  },

  /**
   * Analyze platform performance
   */
  async analyzePerformance(platformCode) {
    try {
      const refundsResult = await refundsAPI.getAll();
      const refunds = refundsResult.success ? refundsResult.data : [];

      const disputesResult = await disputesAPI.getAll();
      const disputes = disputesResult.success ? disputesResult.data : [];

      const analysis = analyzePlatformPerformance(refunds, disputes, platformCode);

      return { success: true, data: analysis };
    } catch (error) {
      console.error('Error analyzing platform performance:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REFUND REDUCTION STRATEGY API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const strategyAPI = {
  /**
   * Generate refund reduction strategy
   */
  async generate(filters = {}) {
    try {
      const refundsResult = await refundsAPI.getAll(filters);
      if (!refundsResult.success) throw new Error(refundsResult.error);

      const refunds = refundsResult.data;

      const patternsResult = await this.getPatterns(filters);
      const patterns = patternsResult.success ? patternsResult.data : [];

      const strategy = generateReductionStrategy(refunds, [], patterns);

      return { success: true, data: strategy };
    } catch (error) {
      console.error('Error generating strategy:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get refund patterns
   */
  async getPatterns(filters = {}) {
    try {
      let query = supabase
        .from('refund_patterns')
        .select('*')
        .order('detection_date', { ascending: false });

      if (filters.branchId) {
        query = query.eq('branch_id', filters.branchId);
      }

      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching patterns:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DELIVERY PLATFORMS API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const deliveryPlatformsAPI = {
  /**
   * Get all delivery platforms
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('delivery_platforms')
        .select('*')
        .order('platform_name');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching delivery platforms:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create delivery platform connection
   */
  async create(platformData) {
    try {
      const { data, error } = await supabase
        .from('delivery_platforms')
        .insert(platformData)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating delivery platform:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update delivery platform
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('delivery_platforms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating delivery platform:', error);
      return { success: false, error: error.message };
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD API - Combined Data for Dashboard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const dashboardAPI = {
  /**
   * Get complete dashboard data
   */
  async getDashboardData(filters = {}) {
    try {
      const [refundsResult, disputesResult, patternsResult, platformsResult] = await Promise.all([
        refundsAPI.getAll(filters),
        disputesAPI.getAll(filters),
        strategyAPI.getPatterns(filters),
        deliveryPlatformsAPI.getAll()
      ]);

      const refunds = refundsResult.success ? refundsResult.data : [];
      const disputes = disputesResult.success ? disputesResult.data : [];
      const patterns = patternsResult.success ? patternsResult.data : [];
      const platforms = platformsResult.success ? platformsResult.data : [];

      // Calculate key metrics
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
        success: true,
        data: {
          metrics,
          refunds: refunds.slice(0, 10), // Latest 10
          disputes: disputes.slice(0, 5), // Latest 5
          patterns: patterns.slice(0, 5), // Latest 5
          platforms
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return { success: false, error: error.message };
    }
  }
};

export default {
  refunds: refundsAPI,
  disputes: disputesAPI,
  customerBehavior: customerBehaviorAPI,
  fraud: fraudDetectionAPI,
  platform: platformAPI,
  strategy: strategyAPI,
  deliveryPlatforms: deliveryPlatformsAPI,
  dashboard: dashboardAPI
};
