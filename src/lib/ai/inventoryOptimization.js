// src/lib/ai/inventoryOptimization.js
/**
 * AI-Powered Inventory Optimization System
 * Predicts stock-outs and overstock situations, suggests optimal reorder points
 */

import { logger } from '../logger';

export class InventoryOptimizer {
  constructor() {
    this.safetyStockMultiplier = 1.5;
    this.leadTimeDays = 3; // Default supplier lead time
  }

  /**
   * Analyze inventory and generate optimization recommendations
   */
  analyzeInventory(inventoryItems, salesHistory, seasonalityData = null) {
    try {
      logger.info('Running inventory optimization analysis');

      const analysis = inventoryItems.map(item => {
        const itemSales = salesHistory.filter(s => s.itemId === item.id);
        return this.analyzeItem(item, itemSales, seasonalityData);
      });

      // Sort by urgency
      analysis.sort((a, b) => {
        const priorityMap = { critical: 3, high: 2, medium: 1, low: 0 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      });

      return {
        timestamp: new Date().toISOString(),
        totalItems: inventoryItems.length,
        criticalItems: analysis.filter(a => a.priority === 'critical').length,
        highPriorityItems: analysis.filter(a => a.priority === 'high').length,
        totalEstimatedCost: analysis.reduce((sum, a) => sum + a.reorderCost, 0),
        potentialSavings: analysis.reduce((sum, a) => sum + (a.overstockCost || 0), 0),
        analysis,
        summary: this.generateSummary(analysis)
      };

    } catch (error) {
      logger.error('Error in inventory optimization:', error);
      throw error;
    }
  }

  /**
   * Analyze individual inventory item
   */
  analyzeItem(item, salesHistory, seasonalityData) {
    const demandForecast = this.forecastDemand(salesHistory, seasonalityData);
    const currentStock = item.quantity || 0;
    const reorderPoint = this.calculateReorderPoint(demandForecast);
    const optimalOrderQuantity = this.calculateEOQ(demandForecast, item);

    const stockStatus = this.determineStockStatus(currentStock, reorderPoint, demandForecast);
    const daysOfStock = this.calculateDaysOfStock(currentStock, demandForecast.dailyAvg);

    return {
      itemId: item.id,
      itemName: item.name,
      currentStock,
      reorderPoint,
      optimalOrderQuantity,
      forecastedDemand: demandForecast,
      stockStatus,
      daysOfStock,
      priority: this.determinePriority(stockStatus, daysOfStock),
      recommendations: this.generateRecommendations(item, currentStock, reorderPoint, optimalOrderQuantity, stockStatus),
      reorderCost: optimalOrderQuantity * (item.unitCost || 0),
      overstockCost: this.calculateOverstockCost(currentStock, demandForecast.dailyAvg, item),
      confidence: demandForecast.confidence
    };
  }

  /**
   * Forecast demand using historical sales data
   */
  forecastDemand(salesHistory, seasonalityData) {
    if (salesHistory.length === 0) {
      return {
        dailyAvg: 0,
        weeklyAvg: 0,
        monthlyAvg: 0,
        trend: 'unknown',
        volatility: 0,
        confidence: 0.5
      };
    }

    // Calculate daily average demand
    const dailySales = this.aggregateDailySales(salesHistory);
    const dailyAvg = dailySales.reduce((sum, d) => sum + d, 0) / dailySales.length;

    // Calculate trend
    const trend = this.calculateTrend(dailySales);

    // Calculate volatility (standard deviation)
    const mean = dailyAvg;
    const variance = dailySales.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / dailySales.length;
    const volatility = Math.sqrt(variance);

    // Apply seasonality adjustments if available
    let adjustedDailyAvg = dailyAvg;
    if (seasonalityData) {
      adjustedDailyAvg = dailyAvg * (seasonalityData.multiplier || 1);
    }

    // Confidence based on data quantity and consistency
    const confidence = this.calculateForecastConfidence(dailySales.length, volatility, mean);

    return {
      dailyAvg: adjustedDailyAvg,
      weeklyAvg: adjustedDailyAvg * 7,
      monthlyAvg: adjustedDailyAvg * 30,
      trend,
      volatility,
      confidence
    };
  }

  aggregateDailySales(salesHistory) {
    const dailyMap = {};

    salesHistory.forEach(sale => {
      const date = new Date(sale.date).toISOString().split('T')[0];
      if (!dailyMap[date]) dailyMap[date] = 0;
      dailyMap[date] += sale.quantity || 0;
    });

    return Object.values(dailyMap);
  }

  calculateTrend(data) {
    if (data.length < 3) return 'stable';

    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);

    const firstAvg = firstHalf.reduce((sum, d) => sum + d, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change > 0.15) return 'increasing';
    if (change < -0.15) return 'decreasing';
    return 'stable';
  }

  calculateForecastConfidence(dataPoints, volatility, mean) {
    // More data = higher confidence
    let confidence = Math.min(dataPoints / 30, 1) * 0.5;

    // Lower volatility = higher confidence
    const cv = mean > 0 ? volatility / mean : 0; // Coefficient of variation
    confidence += (1 - Math.min(cv, 1)) * 0.5;

    return Math.max(0.3, Math.min(0.95, confidence));
  }

  /**
   * Calculate reorder point (when to reorder)
   */
  calculateReorderPoint(demandForecast) {
    // Reorder Point = (Average Daily Demand × Lead Time) + Safety Stock
    const leadTimeDemand = demandForecast.dailyAvg * this.leadTimeDays;
    const safetyStock = demandForecast.volatility * this.safetyStockMultiplier;

    return Math.ceil(leadTimeDemand + safetyStock);
  }

  /**
   * Calculate Economic Order Quantity (EOQ)
   */
  calculateEOQ(demandForecast, item) {
    const annualDemand = demandForecast.dailyAvg * 365;
    const orderingCost = item.orderingCost || 50; // Default ordering cost
    const holdingCost = (item.unitCost || 10) * 0.25; // 25% of unit cost annually

    if (holdingCost === 0) return Math.ceil(demandForecast.weeklyAvg * 2);

    // EOQ = sqrt((2 * D * S) / H)
    const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);

    return Math.ceil(eoq);
  }

  determineStockStatus(currentStock, reorderPoint, demandForecast) {
    if (currentStock === 0) return 'stockout';
    if (currentStock <= reorderPoint * 0.5) return 'critical';
    if (currentStock <= reorderPoint) return 'low';
    if (currentStock > demandForecast.monthlyAvg * 2) return 'overstock';
    return 'healthy';
  }

  calculateDaysOfStock(currentStock, dailyAvg) {
    if (dailyAvg === 0) return 999;
    return Math.floor(currentStock / dailyAvg);
  }

  determinePriority(stockStatus, daysOfStock) {
    if (stockStatus === 'stockout' || stockStatus === 'critical') return 'critical';
    if (stockStatus === 'low' || daysOfStock < 7) return 'high';
    if (stockStatus === 'overstock') return 'medium';
    return 'low';
  }

  generateRecommendations(item, currentStock, reorderPoint, optimalOrderQuantity, stockStatus) {
    const recommendations = [];

    if (stockStatus === 'stockout') {
      recommendations.push({
        action: 'emergency_order',
        title: 'Emergency Stock Replenishment',
        description: `Item is out of stock. Place emergency order for ${optimalOrderQuantity} units immediately.`,
        urgency: 'critical',
        impact: 'Prevent lost sales and customer dissatisfaction'
      });
    }

    if (stockStatus === 'critical' || stockStatus === 'low') {
      recommendations.push({
        action: 'place_order',
        title: 'Replenish Stock',
        description: `Current stock (${currentStock}) is below reorder point (${reorderPoint}). Order ${optimalOrderQuantity} units.`,
        urgency: 'high',
        impact: 'Maintain service levels and prevent stockouts'
      });
    }

    if (stockStatus === 'overstock') {
      const excessUnits = currentStock - (reorderPoint * 2);
      recommendations.push({
        action: 'reduce_stock',
        title: 'Reduce Excess Inventory',
        description: `${excessUnits} excess units detected. Consider promotions or reduced ordering.`,
        urgency: 'medium',
        impact: `Save SAR ${(excessUnits * (item.unitCost || 0) * 0.25).toFixed(2)} in holding costs`
      });
    }

    if (stockStatus === 'healthy') {
      recommendations.push({
        action: 'maintain',
        title: 'Stock Levels Optimal',
        description: 'Current inventory levels are within optimal range.',
        urgency: 'low',
        impact: 'Continue monitoring'
      });
    }

    return recommendations;
  }

  calculateOverstockCost(currentStock, dailyAvg, item) {
    const optimalStock = dailyAvg * 30; // One month supply
    if (currentStock <= optimalStock) return 0;

    const excessUnits = currentStock - optimalStock;
    const unitCost = item.unitCost || 0;
    const annualHoldingCostRate = 0.25; // 25% of unit cost per year

    return (excessUnits * unitCost * annualHoldingCostRate) / 365 * 30; // Monthly cost
  }

  generateSummary(analysis) {
    const criticalItems = analysis.filter(a => a.priority === 'critical');
    const lowStockItems = analysis.filter(a => a.stockStatus === 'low' || a.stockStatus === 'critical');
    const overstockItems = analysis.filter(a => a.stockStatus === 'overstock');

    const totalReorderCost = lowStockItems.reduce((sum, a) => sum + a.reorderCost, 0);
    const potentialSavings = overstockItems.reduce((sum, a) => sum + (a.overstockCost || 0), 0);

    return {
      criticalItemsCount: criticalItems.length,
      lowStockItemsCount: lowStockItems.length,
      overstockItemsCount: overstockItems.length,
      immediateActionsRequired: lowStockItems.length,
      estimatedReorderCost: `SAR ${totalReorderCost.toLocaleString()}`,
      potentialMonthlySavings: `SAR ${potentialSavings.toLocaleString()}`,
      topPriorityItems: analysis.slice(0, 5).map(a => ({
        name: a.itemName,
        status: a.stockStatus,
        action: a.recommendations[0]?.action
      }))
    };
  }
}

export default InventoryOptimizer;
