/**
 * Pricing Calculator
 * Simplified pricing model: $299 per brand + $99 per additional branch
 */

// Pricing constants
export const PRICING_CONFIG = {
  BRAND_BASE_PRICE: 299,
  BRANCH_ADDITIONAL_PRICE: 99,
  CURRENCY: 'USD',
  ANNUAL_DISCOUNT: 0.17, // 17% discount for annual billing
};

/**
 * Calculate monthly price for a subscription
 * @param {number} numberOfBranches - Total number of branches (including the primary one)
 * @param {boolean} isAnnualBilling - Whether billing is annual (applies 17% discount)
 * @returns {Object} Pricing breakdown {basePrice, branchPrice, subtotal, discount, totalPrice}
 */
export const calculateMonthlyPrice = (numberOfBranches = 1, isAnnualBilling = false) => {
  if (numberOfBranches < 1) {
    throw new Error('At least 1 branch (the primary one) is required');
  }

  // Base price for the brand
  const basePrice = PRICING_CONFIG.BRAND_BASE_PRICE;

  // Additional branch pricing (branches beyond the first one)
  const additionalBranches = Math.max(0, numberOfBranches - 1);
  const branchPrice = additionalBranches * PRICING_CONFIG.BRANCH_ADDITIONAL_PRICE;

  // Subtotal (before discount)
  const subtotal = basePrice + branchPrice;

  // Apply annual discount if applicable
  const discount = isAnnualBilling ? subtotal * PRICING_CONFIG.ANNUAL_DISCOUNT : 0;
  const totalPrice = subtotal - discount;

  return {
    basePrice,
    branchPrice,
    additionalBranches,
    subtotal,
    discount,
    totalPrice,
    numberOfBranches,
    isAnnualBilling,
    currency: PRICING_CONFIG.CURRENCY,
  };
};

/**
 * Calculate annual price for a subscription
 * @param {number} numberOfBranches - Total number of branches (including the primary one)
 * @returns {Object} Annual pricing breakdown
 */
export const calculateAnnualPrice = (numberOfBranches = 1) => {
  return calculateMonthlyPrice(numberOfBranches, true);
};

/**
 * Compare monthly vs annual pricing
 * @param {number} numberOfBranches - Total number of branches
 * @returns {Object} Comparison with savings information
 */
export const comparePricingCycles = (numberOfBranches = 1) => {
  const monthly = calculateMonthlyPrice(numberOfBranches, false);
  const annual = calculateMonthlyPrice(numberOfBranches, true);

  // Annual savings (total discount when paying annually)
  const annualSavings = monthly.subtotal * PRICING_CONFIG.ANNUAL_DISCOUNT;

  // Monthly savings (monthly equivalent when paying annually)
  const monthlySavingsAmount = (monthly.totalPrice - annual.totalPrice) / 12;

  return {
    monthly: {
      ...monthly,
      monthlyPrice: monthly.totalPrice,
      annualPrice: monthly.totalPrice * 12,
    },
    annual: {
      ...annual,
      monthlyPrice: annual.totalPrice / 12,
      annualPrice: annual.totalPrice,
    },
    comparison: {
      monthlyPaymentMonthly: monthly.totalPrice,
      monthlyPaymentAnnual: annual.totalPrice / 12,
      annualPaymentMonthly: monthly.totalPrice * 12,
      annualPaymentAnnual: annual.totalPrice,
      totalAnnualSavings: annualSavings,
      monthlySavingsAmount,
      savingsPercentage: PRICING_CONFIG.ANNUAL_DISCOUNT * 100,
    },
  };
};

/**
 * Get pricing breakdown for display
 * @param {number} numberOfBranches - Total number of branches
 * @param {string} billingCycle - 'monthly' or 'annual'
 * @returns {Object} User-friendly pricing breakdown
 */
export const getPricingBreakdown = (numberOfBranches = 1, billingCycle = 'monthly') => {
  const pricing = calculateMonthlyPrice(numberOfBranches, billingCycle === 'annual');

  return {
    numberOfBranches,
    billingCycle,
    items: [
      {
        label: 'Brand Base Price',
        amount: PRICING_CONFIG.BRAND_BASE_PRICE,
        description: 'One brand per account',
      },
      ...(pricing.additionalBranches > 0
        ? [
            {
              label: `Additional Branches (${pricing.additionalBranches})`,
              amount: pricing.branchPrice,
              description: `${pricing.additionalBranches} × $${PRICING_CONFIG.BRANCH_ADDITIONAL_PRICE}`,
              quantity: pricing.additionalBranches,
              unitPrice: PRICING_CONFIG.BRANCH_ADDITIONAL_PRICE,
            },
          ]
        : []),
    ],
    subtotal: pricing.subtotal,
    discountPercentage: billingCycle === 'annual' ? PRICING_CONFIG.ANNUAL_DISCOUNT * 100 : 0,
    discountAmount: pricing.discount,
    total: pricing.totalPrice,
    currency: PRICING_CONFIG.CURRENCY,
    billingPeriod: billingCycle === 'annual' ? 'per year' : 'per month',
  };
};

/**
 * Calculate price per branch
 * @param {number} numberOfBranches - Total number of branches
 * @returns {number} Average price per branch (including base cost distributed)
 */
export const calculatePricePerBranch = (numberOfBranches = 1) => {
  const pricing = calculateMonthlyPrice(numberOfBranches, false);
  return (pricing.totalPrice / numberOfBranches).toFixed(2);
};

/**
 * Check if adding a new branch would exceed a budget
 * @param {number} currentBranches - Current number of branches
 * @param {number} budget - Maximum monthly budget
 * @returns {Object} Can afford new branch and new total price
 */
export const canAffordNewBranch = (currentBranches = 1, budget = 0) => {
  const currentPrice = calculateMonthlyPrice(currentBranches, false);
  const newPrice = calculateMonthlyPrice(currentBranches + 1, false);
  const additionalCost = newPrice.totalPrice - currentPrice.totalPrice;

  return {
    currentBranches,
    newBranches: currentBranches + 1,
    currentPrice: currentPrice.totalPrice,
    newPrice: newPrice.totalPrice,
    additionalCost,
    canAfford: newPrice.totalPrice <= budget,
    budget,
  };
};

/**
 * Get next billing details based on current subscription
 * @param {number} numberOfBranches - Current number of branches
 * @param {boolean} isAnnualBilling - Current billing cycle
 * @param {Date} nextBillingDate - When the next billing occurs
 * @returns {Object} Next billing details
 */
export const getNextBillingDetails = (numberOfBranches = 1, isAnnualBilling = false, nextBillingDate = null) => {
  const pricing = calculateMonthlyPrice(numberOfBranches, isAnnualBilling);

  return {
    numberOfBranches,
    isAnnualBilling,
    billingCycle: isAnnualBilling ? 'annual' : 'monthly',
    nextBillingDate: nextBillingDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
    amount: pricing.totalPrice,
    basePrice: pricing.basePrice,
    branchPrice: pricing.branchPrice,
    discount: pricing.discount,
    currency: PRICING_CONFIG.CURRENCY,
  };
};

/**
 * Prorate pricing for mid-cycle changes
 * @param {number} currentBranches - Current branches
 * @param {number} newBranches - New branches
 * @param {Date} nextBillingDate - When next billing occurs
 * @param {boolean} isAnnualBilling - Current billing cycle
 * @returns {Object} Prorated pricing details
 */
export const calculateProration = (currentBranches = 1, newBranches = 1, nextBillingDate = null, isAnnualBilling = false) => {
  const currentPrice = calculateMonthlyPrice(currentBranches, isAnnualBilling);
  const newPrice = calculateMonthlyPrice(newBranches, isAnnualBilling);

  const now = new Date();
  const billingDate = nextBillingDate || new Date(new Date().setMonth(new Date().getMonth() + 1));

  // Calculate days remaining in the current period
  const daysInPeriod = isAnnualBilling ? 365 : 30;
  const daysRemaining = Math.ceil((billingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate daily rate and proration
  const dailyRate = currentPrice.totalPrice / daysInPeriod;
  const proratedCredit = dailyRate * daysRemaining;

  const newDailyRate = newPrice.totalPrice / daysInPeriod;
  const proratedCharge = newDailyRate * daysRemaining;

  const adjustment = proratedCharge - proratedCredit;

  return {
    currentBranches,
    newBranches,
    currentPrice: currentPrice.totalPrice,
    newPrice: newPrice.totalPrice,
    billingCycle: isAnnualBilling ? 'annual' : 'monthly',
    daysInPeriod,
    daysRemaining,
    proratedCredit: Math.max(0, proratedCredit),
    proratedCharge: Math.max(0, proratedCharge),
    adjustment: adjustment > 0 ? adjustment : 0, // Positive = customer is charged, negative = customer gets credit
    nextBillingDate: billingDate,
    description: adjustment > 0
      ? `Charge of $${Math.abs(adjustment).toFixed(2)} for additional branches`
      : adjustment < 0
      ? `Credit of $${Math.abs(adjustment).toFixed(2)} for removed branches`
      : 'No adjustment needed',
  };
};

/**
 * Format price for display
 * @param {number} price - Price amount
 * @param {boolean} showCurrency - Whether to show currency symbol
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, showCurrency = true) => {
  const formatted = price.toFixed(2);
  if (showCurrency) {
    return `$${formatted}`;
  }
  return formatted;
};

/**
 * Get pricing tier information for comparison
 * @returns {Array} Array of pricing tiers
 */
export const getPricingTiers = () => {
  return [
    {
      name: 'Starter',
      branches: 1,
      monthlyPrice: 299,
      annualPrice: 2491.17, // $299 * 12 * 0.83 (17% discount)
      description: '1 brand, no branches',
      features: ['Single brand', 'No additional branches'],
    },
    {
      name: 'Growth',
      branches: 3,
      monthlyPrice: 497,
      annualPrice: 4127.67, // ($299 + $99*2) * 12 * 0.83
      description: '1 brand, 2 additional branches',
      features: ['Single brand', 'Up to 2 additional branches'],
    },
    {
      name: 'Scale',
      branches: 5,
      monthlyPrice: 695,
      annualPrice: 5779.17, // ($299 + $99*4) * 12 * 0.83
      description: '1 brand, 4 additional branches',
      features: ['Single brand', 'Up to 4 additional branches'],
    },
    {
      name: 'Enterprise',
      branches: 10,
      monthlyPrice: 1189,
      annualPrice: 9878.97, // ($299 + $99*9) * 12 * 0.83
      description: '1 brand, 9 additional branches',
      features: ['Single brand', 'Up to 9 additional branches', 'Custom pricing available'],
    },
  ];
};

export default {
  calculateMonthlyPrice,
  calculateAnnualPrice,
  comparePricingCycles,
  getPricingBreakdown,
  calculatePricePerBranch,
  canAffordNewBranch,
  getNextBillingDetails,
  calculateProration,
  formatPrice,
  getPricingTiers,
  PRICING_CONFIG,
};
