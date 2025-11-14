/**
 * Multi-Location Pricing Service
 * Handles dynamic pricing calculations, KPI tracking, and multi-branch management
 * Pricing Model: $299 per brand + $99 per additional branch
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import {
  MULTI_LOCATION_PRICING,
  calculateMultiLocationPrice,
  BRANCH_KPI_DEFINITIONS,
  BRANCH_KPI_CATEGORIES
} from '@/utils/subscriptionPlans';

const USE_MOCK_DATA = import.meta.env.DEV && !isSupabaseConfigured;

// ============================================================================
// PRICING API
// ============================================================================

export const multiLocationPricingAPI = {
  /**
   * Calculate current pricing based on active branches
   */
  async calculateCurrentPricing(userId, billingCycle = 'monthly') {
    try {
      if (USE_MOCK_DATA) {
        return calculateMultiLocationPrice(3, billingCycle);
      }

      // Count active branches
      const { data: branches, error: branchError } = await supabase
        .from('branches')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (branchError) throw branchError;

      const branchCount = branches?.length || 1;
      const pricing = calculateMultiLocationPrice(branchCount, billingCycle);

      return {
        ...pricing,
        activeBranches: branchCount,
        lastCalculatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[MultiLocationPricingAPI] Failed to calculate pricing', error);
      throw error;
    }
  },

  /**
   * Get or create multi-location pricing record
   */
  async getOrCreatePricing(userId, subscriptionId) {
    try {
      if (USE_MOCK_DATA) {
        return {
          id: 'mock-pricing-id',
          user_id: userId,
          subscription_id: subscriptionId,
          base_brand_price: MULTI_LOCATION_PRICING.baseBrandPrice,
          per_branch_price: MULTI_LOCATION_PRICING.perBranchPrice,
          active_branches_count: 3,
          total_monthly_price: 497,
          total_yearly_price: 5470.08,
          billing_cycle: 'monthly',
          is_active: true
        };
      }

      // Try to get existing pricing
      const { data: existingPricing, error: fetchError } = await supabase
        .from('multi_location_pricing')
        .select('*')
        .eq('user_id', userId)
        .eq('subscription_id', subscriptionId)
        .eq('is_active', true)
        .single();

      if (existingPricing) {
        return existingPricing;
      }

      // Create new pricing record
      const pricing = await this.calculateCurrentPricing(userId);

      const { data: newPricing, error: createError } = await supabase
        .from('multi_location_pricing')
        .insert([
          {
            user_id: userId,
            subscription_id: subscriptionId,
            base_brand_price: MULTI_LOCATION_PRICING.baseBrandPrice,
            per_branch_price: MULTI_LOCATION_PRICING.perBranchPrice,
            active_branches_count: pricing.branchCount,
            total_monthly_price: pricing.pricing.monthly,
            total_yearly_price: pricing.pricing.yearly,
            billing_cycle: 'monthly',
            is_active: true
          }
        ])
        .select()
        .single();

      if (createError) throw createError;
      return newPricing;
    } catch (error) {
      logger.error('[MultiLocationPricingAPI] Failed to get or create pricing', error);
      throw error;
    }
  },

  /**
   * Update pricing when branch count changes
   */
  async updatePricingForBranchChange(userId, subscriptionId) {
    try {
      const pricing = await this.calculateCurrentPricing(userId);

      if (USE_MOCK_DATA) {
        return pricing;
      }

      const { data: updated, error } = await supabase
        .from('multi_location_pricing')
        .update({
          active_branches_count: pricing.branchCount,
          total_monthly_price: pricing.pricing.monthly,
          total_yearly_price: pricing.pricing.yearly,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('subscription_id', subscriptionId)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } catch (error) {
      logger.error('[MultiLocationPricingAPI] Failed to update pricing', error);
      throw error;
    }
  },

  /**
   * Get pricing tier comparison (for display)
   */
  async getPricingComparison(maxBranches = 10) {
    try {
      const tiers = [];
      for (let i = 1; i <= maxBranches; i++) {
        const pricing = calculateMultiLocationPrice(i, 'monthly');
        tiers.push({
          branches: i,
          monthlyPrice: pricing.pricing.monthly,
          yearlyPrice: pricing.pricing.yearly,
          breakdown: pricing.breakdown
        });
      }
      return tiers;
    } catch (error) {
      logger.error('[MultiLocationPricingAPI] Failed to get pricing comparison', error);
      throw error;
    }
  }
};

// ============================================================================
// BRANCH KPIs API
// ============================================================================

export const branchKPIsAPI = {
  /**
   * Record KPI data for a branch
   */
  async recordBranchKPI(branchId, userId, kpiData, periodDate, periodType = 'daily') {
    try {
      if (USE_MOCK_DATA) {
        return { id: 'mock-kpi-id', branch_id: branchId, ...kpiData };
      }

      const { data, error } = await supabase
        .from('branch_kpis')
        .insert([
          {
            branch_id: branchId,
            user_id: userId,
            period_date: periodDate,
            period_type: periodType,
            total_revenue: kpiData.total_revenue || 0,
            total_orders: kpiData.total_orders || 0,
            average_order_value: kpiData.average_order_value || 0,
            unique_customers: kpiData.unique_customers || 0,
            returning_customers: kpiData.returning_customers || 0,
            customer_retention_rate: kpiData.customer_retention_rate || 0,
            items_sold: kpiData.items_sold || 0,
            top_product_name: kpiData.top_product_name || null,
            top_product_revenue: kpiData.top_product_revenue || 0,
            peak_hour: kpiData.peak_hour || null,
            peak_hour_revenue: kpiData.peak_hour_revenue || 0,
            avg_transaction_time: kpiData.avg_transaction_time || 0,
            inventory_turnover: kpiData.inventory_turnover || 0,
            stock_out_incidents: kpiData.stock_out_incidents || 0,
            product_variety_sold: kpiData.product_variety_sold || 0,
            total_cost: kpiData.total_cost || 0,
            gross_profit: (kpiData.total_revenue || 0) - (kpiData.total_cost || 0),
            gross_profit_margin: kpiData.gross_profit_margin || 0,
            revenue_growth_percent: kpiData.revenue_growth_percent || 0,
            order_growth_percent: kpiData.order_growth_percent || 0,
            customer_growth_percent: kpiData.customer_growth_percent || 0,
            metadata: kpiData.metadata || {}
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('[BranchKPIsAPI] Failed to record KPI', error);
      throw error;
    }
  },

  /**
   * Get KPI summary for a branch
   */
  async getBranchKPISummary(branchId, periodType = 'monthly', limit = 1) {
    try {
      if (USE_MOCK_DATA) {
        return [
          {
            id: 'mock-kpi-summary',
            branch_id: branchId,
            total_revenue: 15000,
            total_orders: 150,
            average_order_value: 100,
            gross_profit_margin: 35,
            revenue_growth_percent: 12.5,
            order_growth_percent: 8.3,
            customer_retention_rate: 65
          }
        ];
      }

      const { data, error } = await supabase
        .from('branch_kpis')
        .select(
          'id, branch_id, period_date, total_revenue, total_orders, average_order_value, unique_customers, returning_customers, customer_retention_rate, gross_profit, gross_profit_margin, revenue_growth_percent, order_growth_percent, customer_growth_percent'
        )
        .eq('branch_id', branchId)
        .eq('period_type', periodType)
        .order('period_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('[BranchKPIsAPI] Failed to get KPI summary', error);
      throw error;
    }
  },

  /**
   * Get KPI targets for a branch
   */
  async getBranchKPITargets(branchId, fiscalYear) {
    try {
      if (USE_MOCK_DATA) {
        return [
          {
            id: 'mock-target',
            branch_id: branchId,
            fiscal_year: fiscalYear,
            target_revenue: 200000,
            target_orders: 2000,
            target_gross_profit_margin: 35
          }
        ];
      }

      const { data, error } = await supabase
        .from('branch_kpi_targets')
        .select('*')
        .eq('branch_id', branchId)
        .eq('fiscal_year', fiscalYear)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('[BranchKPIsAPI] Failed to get KPI targets', error);
      throw error;
    }
  },

  /**
   * Set or update KPI targets for a branch
   */
  async setKPITargets(branchId, userId, targetData) {
    try {
      if (USE_MOCK_DATA) {
        return { id: 'mock-target-id', branch_id: branchId, ...targetData };
      }

      const { data, error } = await supabase
        .from('branch_kpi_targets')
        .insert([
          {
            branch_id: branchId,
            user_id: userId,
            fiscal_year: targetData.fiscal_year,
            fiscal_quarter: targetData.fiscal_quarter || null,
            target_revenue: targetData.target_revenue || null,
            target_orders: targetData.target_orders || null,
            target_avg_order_value: targetData.target_avg_order_value || null,
            target_unique_customers: targetData.target_unique_customers || null,
            target_retention_rate: targetData.target_retention_rate || null,
            target_gross_profit_margin: targetData.target_gross_profit_margin || null,
            target_items_sold: targetData.target_items_sold || null,
            target_revenue_growth_percent: targetData.target_revenue_growth_percent || null,
            target_order_growth_percent: targetData.target_order_growth_percent || null,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('[BranchKPIsAPI] Failed to set KPI targets', error);
      throw error;
    }
  },

  /**
   * Compare KPIs across multiple branches
   */
  async compareBranchKPIs(branchIds, periodDate, periodType = 'monthly') {
    try {
      if (USE_MOCK_DATA) {
        return {
          id: 'mock-comparison',
          branch_ids: branchIds,
          total_revenue_all_branches: 45000,
          avg_revenue_per_branch: 15000,
          total_orders_all_branches: 450,
          avg_orders_per_branch: 150
        };
      }

      const { data, error } = await supabase
        .from('branch_kpis')
        .select('*')
        .in('branch_id', branchIds)
        .eq('period_date', periodDate)
        .eq('period_type', periodType);

      if (error) throw error;

      // Calculate comparison metrics
      if (!data || data.length === 0) return null;

      const totalRevenue = data.reduce((sum, kpi) => sum + (kpi.total_revenue || 0), 0);
      const totalOrders = data.reduce((sum, kpi) => sum + (kpi.total_orders || 0), 0);
      const totalCustomers = data.reduce((sum, kpi) => sum + (kpi.unique_customers || 0), 0);
      const avgRevenue = totalRevenue / data.length;
      const avgOrders = totalOrders / data.length;
      const avgCustomers = totalCustomers / data.length;

      // Find best and worst performers
      const sortedByRevenue = [...data].sort((a, b) => b.total_revenue - a.total_revenue);
      const highestRevenueBranch = sortedByRevenue[0];
      const lowestRevenueBranch = sortedByRevenue[sortedByRevenue.length - 1];

      return {
        period_date: periodDate,
        period_type: periodType,
        branch_count: branchIds.length,
        total_revenue_all_branches: totalRevenue,
        avg_revenue_per_branch: avgRevenue,
        highest_revenue_branch: highestRevenueBranch,
        lowest_revenue_branch: lowestRevenueBranch,
        total_orders_all_branches: totalOrders,
        avg_orders_per_branch: avgOrders,
        total_customers_all_branches: totalCustomers,
        avg_customers_per_branch: avgCustomers,
        all_branch_kpis: data
      };
    } catch (error) {
      logger.error('[BranchKPIsAPI] Failed to compare branch KPIs', error);
      throw error;
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all available KPI definitions
 */
export const getKPIDefinitions = () => BRANCH_KPI_DEFINITIONS;

/**
 * Get KPI definitions for a specific category
 */
export const getKPIsByCategory = (category) => {
  return BRANCH_KPI_DEFINITIONS[category] || null;
};

/**
 * Get all KPI categories
 */
export const getKPICategories = () => BRANCH_KPI_CATEGORIES;

/**
 * Calculate gross profit margin
 */
export const calculateGrossProfitMargin = (revenue, totalCost) => {
  if (revenue === 0) return 0;
  return ((revenue - totalCost) / revenue) * 100;
};

/**
 * Calculate growth percentage
 */
export const calculateGrowthPercent = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

/**
 * Calculate average order value
 */
export const calculateAOV = (totalRevenue, totalOrders) => {
  if (totalOrders === 0) return 0;
  return totalRevenue / totalOrders;
};

/**
 * Calculate customer retention rate
 */
export const calculateRetentionRate = (returningCustomers, totalCustomers) => {
  if (totalCustomers === 0) return 0;
  return (returningCustomers / totalCustomers) * 100;
};

export default {
  multiLocationPricingAPI,
  branchKPIsAPI,
  getKPIDefinitions,
  getKPIsByCategory,
  getKPICategories,
  calculateGrossProfitMargin,
  calculateGrowthPercent,
  calculateAOV,
  calculateRetentionRate
};
