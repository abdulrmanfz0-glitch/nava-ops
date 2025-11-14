/**
 * Tests for Pricing Calculator
 * Brand + Branch pricing model: $299 base + $99 per additional branch
 */

import {
  calculateMonthlyPrice,
  calculateAnnualPrice,
  comparePricingCycles,
  getPricingBreakdown,
  calculateProration,
  formatPrice,
  PRICING_CONFIG,
} from '../pricingCalculator';

describe('Pricing Calculator - Brand + Branch Model', () => {
  describe('PRICING_CONFIG', () => {
    test('should have correct base prices', () => {
      expect(PRICING_CONFIG.BRAND_BASE_PRICE).toBe(299);
      expect(PRICING_CONFIG.BRANCH_ADDITIONAL_PRICE).toBe(99);
      expect(PRICING_CONFIG.ANNUAL_DISCOUNT).toBe(0.17);
    });
  });

  describe('calculateMonthlyPrice', () => {
    test('should calculate base price for 1 branch (no additional branches)', () => {
      const result = calculateMonthlyPrice(1, false);
      expect(result.numberOfBranches).toBe(1);
      expect(result.basePrice).toBe(299);
      expect(result.additionalBranches).toBe(0);
      expect(result.branchPrice).toBe(0);
      expect(result.subtotal).toBe(299);
      expect(result.discount).toBe(0);
      expect(result.totalPrice).toBe(299);
    });

    test('should calculate price for multiple branches', () => {
      const result = calculateMonthlyPrice(3, false);
      expect(result.numberOfBranches).toBe(3);
      expect(result.basePrice).toBe(299);
      expect(result.additionalBranches).toBe(2);
      expect(result.branchPrice).toBe(198); // 2 * 99
      expect(result.subtotal).toBe(497); // 299 + 198
      expect(result.discount).toBe(0);
      expect(result.totalPrice).toBe(497);
    });

    test('should apply 17% discount for annual billing', () => {
      const result = calculateMonthlyPrice(1, true);
      expect(result.numberOfBranches).toBe(1);
      expect(result.subtotal).toBe(299);
      expect(result.discount).toBeCloseTo(50.83, 1); // 299 * 0.17
      expect(result.totalPrice).toBeCloseTo(248.17, 1); // 299 - 50.83
    });

    test('should calculate annual price with discount for multiple branches', () => {
      const result = calculateMonthlyPrice(5, true);
      expect(result.numberOfBranches).toBe(5);
      expect(result.additionalBranches).toBe(4);
      expect(result.branchPrice).toBe(396); // 4 * 99
      expect(result.subtotal).toBe(695); // 299 + 396
      const expectedDiscount = 695 * 0.17;
      expect(result.discount).toBeCloseTo(expectedDiscount, 1);
      expect(result.totalPrice).toBeCloseTo(695 - expectedDiscount, 1);
    });

    test('should throw error for 0 branches', () => {
      expect(() => calculateMonthlyPrice(0)).toThrow('At least 1 branch');
    });

    test('should throw error for negative branches', () => {
      expect(() => calculateMonthlyPrice(-1)).toThrow('At least 1 branch');
    });
  });

  describe('calculateAnnualPrice', () => {
    test('should calculate annual price with discount', () => {
      const result = calculateAnnualPrice(1);
      expect(result.isAnnualBilling).toBe(true);
      expect(result.subtotal).toBe(299);
      expect(result.discount).toBeCloseTo(50.83, 1);
      expect(result.totalPrice).toBeCloseTo(248.17, 1);
    });

    test('should match calculateMonthlyPrice with annual flag', () => {
      const annual = calculateAnnualPrice(3);
      const monthlyAnnual = calculateMonthlyPrice(3, true);
      expect(annual.totalPrice).toBe(monthlyAnnual.totalPrice);
      expect(annual.discount).toBe(monthlyAnnual.discount);
    });
  });

  describe('comparePricingCycles', () => {
    test('should compare monthly vs annual pricing', () => {
      const result = comparePricingCycles(2);
      expect(result.monthly).toBeDefined();
      expect(result.annual).toBeDefined();
      expect(result.comparison).toBeDefined();
    });

    test('should show savings for annual billing', () => {
      const result = comparePricingCycles(1);
      expect(result.comparison.totalAnnualSavings).toBeGreaterThan(0);
      expect(result.comparison.savingsPercentage).toBe(17);
      expect(result.annual.annualPrice).toBeLessThan(result.monthly.annualPrice);
    });

    test('should calculate monthly equivalent of annual pricing', () => {
      const result = comparePricingCycles(1);
      const monthlyOfAnnual = result.annual.annualPrice / 12;
      expect(result.annual.monthlyPrice).toBeCloseTo(monthlyOfAnnual, 1);
    });
  });

  describe('getPricingBreakdown', () => {
    test('should return formatted pricing breakdown for monthly', () => {
      const result = getPricingBreakdown(1, 'monthly');
      expect(result.numberOfBranches).toBe(1);
      expect(result.billingCycle).toBe('monthly');
      expect(result.billingPeriod).toBe('per month');
      expect(result.items).toHaveLength(1); // Only base price, no branches
      expect(result.total).toBe(299);
    });

    test('should include branch items in breakdown', () => {
      const result = getPricingBreakdown(3, 'monthly');
      expect(result.numberOfBranches).toBe(3);
      expect(result.items).toHaveLength(2); // Base + branches
      expect(result.items[1].quantity).toBe(2);
      expect(result.items[1].unitPrice).toBe(99);
      expect(result.total).toBe(497);
    });

    test('should apply discount for annual billing', () => {
      const result = getPricingBreakdown(1, 'annual');
      expect(result.discountPercentage).toBe(17);
      expect(result.discountAmount).toBeGreaterThan(0);
      expect(result.total).toBeLessThan(299);
      expect(result.billingPeriod).toBe('per year');
    });
  });

  describe('calculateProration', () => {
    test('should calculate proration for mid-cycle upgrade', () => {
      const now = new Date();
      const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const result = calculateProration(1, 2, nextBilling, false);
      expect(result.currentBranches).toBe(1);
      expect(result.newBranches).toBe(2);
      expect(result.adjustment).toBeGreaterThan(0); // Should charge for new branch
    });

    test('should handle prorated charges correctly', () => {
      const result = calculateProration(2, 4, null, false);
      expect(result.currentPrice).toBe(497); // $299 + 2*$99
      expect(result.newPrice).toBe(695); // $299 + 4*$99
      expect(result.adjustment).toBeGreaterThan(0);
    });

    test('should provide clear description', () => {
      const result = calculateProration(1, 2, null, false);
      expect(result.description).toContain('Charge');
      expect(result.description).toContain('additional branches');
    });
  });

  describe('formatPrice', () => {
    test('should format price with currency', () => {
      expect(formatPrice(299)).toBe('$299.00');
      expect(formatPrice(99.5)).toBe('$99.50');
    });

    test('should format price without currency', () => {
      expect(formatPrice(299, false)).toBe('299.00');
      expect(formatPrice(99.5, false)).toBe('99.50');
    });
  });

  describe('Real-world scenarios', () => {
    test('Scenario 1: Single brand, no branches', () => {
      const pricing = calculateMonthlyPrice(1, false);
      expect(pricing.totalPrice).toBe(299);
    });

    test('Scenario 2: Single brand, 2 additional branches, monthly', () => {
      const pricing = calculateMonthlyPrice(3, false);
      expect(pricing.totalPrice).toBe(497); // 299 + 2*99
    });

    test('Scenario 3: Single brand, 2 additional branches, annual', () => {
      const pricing = calculateMonthlyPrice(3, true);
      const expectedSubtotal = 497;
      const expectedDiscount = expectedSubtotal * 0.17;
      expect(pricing.totalPrice).toBeCloseTo(expectedSubtotal - expectedDiscount, 1);
    });

    test('Scenario 4: Growing from 1 to 5 branches', () => {
      const current = calculateMonthlyPrice(1, false);
      const future = calculateMonthlyPrice(5, false);
      const increase = future.totalPrice - current.totalPrice;
      expect(increase).toBe(396); // 4 additional branches * 99
    });

    test('Scenario 5: Annual savings calculator', () => {
      const comparison = comparePricingCycles(1);
      const monthlyAnnualCost = comparison.monthly.annualPrice;
      const annualCost = comparison.annual.annualPrice;
      const savings = monthlyAnnualCost - annualCost;
      expect(savings).toBeGreaterThan(0);
      expect(savings).toBeCloseTo(comparison.comparison.totalAnnualSavings, 1);
    });
  });
});
