/**
 * TEST DATA GENERATORS FOR AI SYSTEM SIMULATIONS
 * Generates realistic test data for inventory, churn, and marketing scenarios
 *
 * Usage:
 *   node test-data-generators.js --scenario inventory --profile critical
 *   node test-data-generators.js --scenario churn --profile high-risk
 *   node test-data-generators.js --scenario marketing --profile engaged
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

class DataGenerator {
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min, max, decimals = 2) {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
  }

  static randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  static randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// ============================================================================
// INVENTORY DATA GENERATOR
// ============================================================================

class InventoryDataGenerator extends DataGenerator {
  static PRODUCT_NAMES = [
    'Premium Olive Oil', 'Fresh Mozzarella', 'Organic Tomatoes',
    'Pasta Shells', 'Parmesan Cheese', 'Basil Leaves',
    'Ground Beef', 'Chicken Breast', 'Salmon Fillet',
    'Pizza Dough', 'Garlic Cloves', 'Red Wine',
    'Coffee Beans', 'Milk', 'Eggs'
  ];

  static SUPPLIERS = [
    'SUPP-001', 'SUPP-002', 'SUPP-003', 'SUPP-004', 'SUPP-005'
  ];

  /**
   * Generate inventory items with specified profile
   * @param {string} profile - 'critical', 'low', 'healthy', 'overstock', 'mixed'
   * @param {number} count - Number of items to generate
   */
  static generateInventoryItems(profile = 'mixed', count = 10) {
    const items = [];

    for (let i = 0; i < count; i++) {
      const baseStock = this.getBaseStockForProfile(profile, i);
      const item = {
        id: this.generateId('PROD'),
        name: this.randomChoice(this.PRODUCT_NAMES) + ` ${i + 1}`,
        quantity: baseStock.quantity,
        unitCost: this.randomFloat(10, 100, 2),
        orderingCost: this.randomFloat(30, 80, 2),
        supplierId: this.randomChoice(this.SUPPLIERS),
        category: this.randomChoice(['Produce', 'Dairy', 'Meat', 'Dry Goods', 'Beverages']),
        minStockLevel: baseStock.minStockLevel,
        maxStockLevel: baseStock.maxStockLevel
      };
      items.push(item);
    }

    return items;
  }

  static getBaseStockForProfile(profile, index) {
    const profiles = {
      critical: { quantity: this.randomInt(5, 15), minStockLevel: 30, maxStockLevel: 200 },
      low: { quantity: this.randomInt(20, 40), minStockLevel: 50, maxStockLevel: 250 },
      healthy: { quantity: this.randomInt(80, 150), minStockLevel: 50, maxStockLevel: 300 },
      overstock: { quantity: this.randomInt(400, 600), minStockLevel: 50, maxStockLevel: 300 },
      mixed: index % 4 === 0
        ? { quantity: this.randomInt(5, 15), minStockLevel: 30, maxStockLevel: 200 }
        : index % 4 === 1
        ? { quantity: this.randomInt(20, 40), minStockLevel: 50, maxStockLevel: 250 }
        : index % 4 === 2
        ? { quantity: this.randomInt(80, 150), minStockLevel: 50, maxStockLevel: 300 }
        : { quantity: this.randomInt(400, 600), minStockLevel: 50, maxStockLevel: 300 }
    };

    return profiles[profile] || profiles.mixed;
  }

  /**
   * Generate sales history for inventory items
   * @param {Array} items - Inventory items
   * @param {number} days - Number of days of history
   * @param {string} trend - 'increasing', 'decreasing', 'stable', 'volatile'
   */
  static generateSalesHistory(items, days = 90, trend = 'stable') {
    const salesHistory = [];
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    items.forEach(item => {
      const baseDemand = this.randomFloat(5, 20, 1);

      for (let d = 0; d < days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);

        // Apply trend
        let demand = baseDemand;
        const trendFactor = d / days; // 0 to 1

        switch (trend) {
          case 'increasing':
            demand = baseDemand * (1 + trendFactor * 0.5);
            break;
          case 'decreasing':
            demand = baseDemand * (1 - trendFactor * 0.4);
            break;
          case 'stable':
            demand = baseDemand;
            break;
          case 'volatile':
            demand = baseDemand * this.randomFloat(0.5, 1.5, 2);
            break;
        }

        // Add daily variance
        demand = demand * this.randomFloat(0.8, 1.2, 2);

        // Weekend effect (20% lower on weekends)
        if (date.getDay() === 0 || date.getDay() === 6) {
          demand *= 0.8;
        }

        salesHistory.push({
          itemId: item.id,
          date: date.toISOString(),
          quantity: Math.max(0, Math.floor(demand)),
          revenue: Math.floor(demand) * item.unitCost * 1.5 // 50% markup
        });
      }
    });

    return salesHistory;
  }

  /**
   * Generate seasonality data
   */
  static generateSeasonalityData(seasonality = 'moderate') {
    const multipliers = {
      none: 1.0,
      low: this.randomFloat(0.95, 1.05, 2),
      moderate: this.randomFloat(0.85, 1.15, 2),
      high: this.randomFloat(0.7, 1.3, 2)
    };

    return {
      multiplier: multipliers[seasonality] || 1.0,
      season: this.randomChoice(['spring', 'summer', 'fall', 'winter']),
      confidence: this.randomFloat(0.7, 0.95, 2)
    };
  }
}

// ============================================================================
// CUSTOMER/CHURN DATA GENERATOR
// ============================================================================

class CustomerDataGenerator extends DataGenerator {
  static FIRST_NAMES = [
    'Ahmed', 'Fatima', 'Mohammed', 'Aisha', 'Ali', 'Mariam',
    'Omar', 'Layla', 'Hassan', 'Zainab', 'Khalid', 'Noor',
    'Youssef', 'Sara', 'Ibrahim', 'Hana'
  ];

  static LAST_NAMES = [
    'Al-Saud', 'Al-Rashid', 'Al-Zahrani', 'Al-Harbi', 'Al-Dosari',
    'Al-Ghamdi', 'Al-Qarni', 'Al-Mutairi', 'Al-Otaibi', 'Al-Shehri'
  ];

  /**
   * Generate customers with specified risk profile
   * @param {string} profile - 'high-risk', 'medium-risk', 'low-risk', 'healthy', 'mixed'
   * @param {number} count - Number of customers to generate
   */
  static generateCustomers(profile = 'mixed', count = 20) {
    const customers = [];

    for (let i = 0; i < count; i++) {
      const riskProfile = this.getRiskProfileSettings(profile, i);
      const firstName = this.randomChoice(this.FIRST_NAMES);
      const lastName = this.randomChoice(this.LAST_NAMES);

      const customer = {
        id: this.generateId('CUST'),
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+966-5${this.randomInt(10000000, 99999999)}`,
        joinedDate: this.randomDate(
          new Date(2023, 0, 1),
          new Date(2024, 11, 31)
        ).toISOString(),
        emailOpens: riskProfile.emailOpens,
        appLogins: riskProfile.appLogins,
        complaints: riskProfile.complaints,
        satisfactionScore: riskProfile.satisfactionScore,
        segment: riskProfile.segment,
        lifetimeValue: this.randomFloat(100, 5000, 2),
        averageOrderValue: this.randomFloat(50, 300, 2)
      };

      customers.push(customer);
    }

    return customers;
  }

  static getRiskProfileSettings(profile, index) {
    // Handle mixed profile first to avoid recursion
    if (profile === 'mixed') {
      const subProfile = index % 4 === 0 ? 'high-risk'
        : index % 4 === 1 ? 'medium-risk'
        : index % 4 === 2 ? 'low-risk'
        : 'healthy';
      return this.getRiskProfileSettings(subProfile, 0);
    }

    const profiles = {
      'high-risk': {
        emailOpens: this.randomInt(0, 2),
        appLogins: this.randomInt(0, 1),
        complaints: this.randomInt(1, 3),
        satisfactionScore: this.randomFloat(1.5, 2.9, 1),
        segment: 'at-risk'
      },
      'medium-risk': {
        emailOpens: this.randomInt(3, 7),
        appLogins: this.randomInt(2, 5),
        complaints: this.randomInt(0, 1),
        satisfactionScore: this.randomFloat(3.0, 3.8, 1),
        segment: 'regular'
      },
      'low-risk': {
        emailOpens: this.randomInt(8, 15),
        appLogins: this.randomInt(6, 12),
        complaints: 0,
        satisfactionScore: this.randomFloat(3.9, 4.5, 1),
        segment: 'regular'
      },
      'healthy': {
        emailOpens: this.randomInt(15, 30),
        appLogins: this.randomInt(12, 25),
        complaints: 0,
        satisfactionScore: this.randomFloat(4.5, 5.0, 1),
        segment: 'high-value'
      }
    };

    return profiles[profile] || profiles['healthy'];
  }

  /**
   * Generate order history for customers
   * @param {Array} customers - Customer objects
   * @param {string} pattern - 'declining', 'increasing', 'stable', 'sporadic'
   */
  static generateOrderHistory(customers, pattern = 'mixed') {
    const orderHistory = [];

    customers.forEach((customer, customerIndex) => {
      const orderPattern = pattern === 'mixed'
        ? this.randomChoice(['declining', 'increasing', 'stable', 'sporadic'])
        : pattern;

      const orderCount = this.getOrderCountForPattern(orderPattern);
      const baseOrderValue = customer.averageOrderValue;

      for (let i = 0; i < orderCount; i++) {
        const daysAgo = this.getDaysAgoForPattern(orderPattern, i, orderCount);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);

        const orderValue = this.getOrderValueForPattern(
          orderPattern,
          baseOrderValue,
          i,
          orderCount
        );

        orderHistory.push({
          orderId: this.generateId('ORD'),
          customerId: customer.id,
          date: orderDate.toISOString(),
          total: orderValue,
          items: this.randomInt(1, 8),
          status: 'completed'
        });
      }
    });

    return orderHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  static getOrderCountForPattern(pattern) {
    const counts = {
      declining: this.randomInt(8, 15),
      increasing: this.randomInt(10, 20),
      stable: this.randomInt(15, 25),
      sporadic: this.randomInt(5, 12)
    };
    return counts[pattern] || 10;
  }

  static getDaysAgoForPattern(pattern, orderIndex, totalOrders) {
    const progress = orderIndex / totalOrders;

    switch (pattern) {
      case 'declining':
        // Recent orders are sparse, old orders frequent
        return Math.floor(30 + progress * 400);

      case 'increasing':
        // Recent orders frequent, old orders sparse
        return Math.floor(400 - progress * 370);

      case 'stable':
        // Even distribution
        return Math.floor(30 + orderIndex * (360 / totalOrders));

      case 'sporadic':
        // Random gaps
        return this.randomInt(7, 90) + orderIndex * 15;

      default:
        return orderIndex * 30;
    }
  }

  static getOrderValueForPattern(pattern, baseValue, orderIndex, totalOrders) {
    const progress = orderIndex / totalOrders;

    switch (pattern) {
      case 'declining':
        // Decreasing value over time
        return baseValue * (1.5 - progress * 0.7);

      case 'increasing':
        // Increasing value over time
        return baseValue * (0.8 + progress * 0.7);

      case 'stable':
        // Consistent value with variance
        return baseValue * this.randomFloat(0.9, 1.1, 2);

      case 'sporadic':
        // High variance
        return baseValue * this.randomFloat(0.5, 1.8, 2);

      default:
        return baseValue;
    }
  }
}

// ============================================================================
// MARKETING CAMPAIGN DATA GENERATOR
// ============================================================================

class MarketingDataGenerator extends DataGenerator {
  static CAMPAIGN_TYPES = [
    'promotional', 'seasonal', 'new_product', 'win_back',
    'loyalty', 'exclusive', 'flash_sale', 'newsletter'
  ];

  static CAMPAIGN_NAMES = [
    'Weekend Special', 'Summer Sale', 'Flash Friday',
    'Loyalty Rewards', 'New Menu Launch', 'Welcome Back',
    'VIP Exclusive', 'Holiday Feast', 'Chef\'s Special'
  ];

  /**
   * Generate historical marketing campaigns
   * @param {string} profile - 'high-engagement', 'low-engagement', 'mixed'
   * @param {number} count - Number of campaigns to generate
   */
  static generateCampaigns(profile = 'mixed', count = 20) {
    const campaigns = [];
    const endDate = new Date();

    for (let i = 0; i < count; i++) {
      const daysAgo = this.randomInt(7, 180);
      const sentDate = new Date(endDate);
      sentDate.setDate(sentDate.getDate() - daysAgo);

      // Random hour (day of week is determined by daysAgo)
      sentDate.setHours(this.randomInt(6, 22));

      const engagement = this.getEngagementForProfile(profile, i);
      const sends = this.randomInt(500, 2000);

      const campaign = {
        campaignId: this.generateId('CAMP'),
        name: this.randomChoice(this.CAMPAIGN_NAMES) + ` ${i + 1}`,
        type: this.randomChoice(this.CAMPAIGN_TYPES),
        sentAt: sentDate.toISOString(),
        sends: sends,
        opens: Math.floor(sends * engagement.openRate),
        clicks: Math.floor(sends * engagement.openRate * engagement.clickThroughRate),
        conversions: Math.floor(sends * engagement.openRate * engagement.clickThroughRate * engagement.conversionRate),
        revenue: this.randomFloat(5000, 50000, 2),
        cost: this.randomFloat(200, 2000, 2)
      };

      // Calculate derived metrics
      campaign.openRate = ((campaign.opens / campaign.sends) * 100).toFixed(2) + '%';
      campaign.clickRate = ((campaign.clicks / campaign.opens) * 100).toFixed(2) + '%';
      campaign.conversionRate = ((campaign.conversions / campaign.clicks) * 100).toFixed(2) + '%';
      campaign.roi = ((campaign.revenue - campaign.cost) / campaign.cost * 100).toFixed(2) + '%';

      campaigns.push(campaign);
    }

    return campaigns.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  }

  static getEngagementForProfile(profile, index) {
    // Handle mixed profile first to avoid recursion
    if (profile === 'mixed') {
      const subProfile = index % 3 === 0 ? 'high-engagement'
        : index % 3 === 1 ? 'moderate-engagement'
        : 'low-engagement';
      return this.getEngagementForProfile(subProfile, 0);
    }

    const profiles = {
      'high-engagement': {
        openRate: this.randomFloat(0.30, 0.40, 3),
        clickThroughRate: this.randomFloat(0.25, 0.35, 3),
        conversionRate: this.randomFloat(0.15, 0.25, 3)
      },
      'low-engagement': {
        openRate: this.randomFloat(0.12, 0.18, 3),
        clickThroughRate: this.randomFloat(0.10, 0.18, 3),
        conversionRate: this.randomFloat(0.05, 0.12, 3)
      },
      'moderate-engagement': {
        openRate: this.randomFloat(0.20, 0.28, 3),
        clickThroughRate: this.randomFloat(0.18, 0.25, 3),
        conversionRate: this.randomFloat(0.10, 0.18, 3)
      }
    };

    return profiles[profile] || profiles['moderate-engagement'];
  }

  /**
   * Generate customer segments for marketing
   */
  static generateCustomerSegments(totalCustomers = 10000) {
    return {
      highValue: {
        count: Math.floor(totalCustomers * 0.15),
        avgOrderValue: this.randomFloat(200, 400, 2),
        frequency: 'high',
        engagementRate: this.randomFloat(0.35, 0.45, 2)
      },
      regular: {
        count: Math.floor(totalCustomers * 0.45),
        avgOrderValue: this.randomFloat(100, 200, 2),
        frequency: 'medium',
        engagementRate: this.randomFloat(0.22, 0.32, 2)
      },
      atRisk: {
        count: Math.floor(totalCustomers * 0.20),
        avgOrderValue: this.randomFloat(80, 150, 2),
        frequency: 'low',
        engagementRate: this.randomFloat(0.12, 0.20, 2)
      },
      dormant: {
        count: Math.floor(totalCustomers * 0.15),
        avgOrderValue: this.randomFloat(50, 120, 2),
        frequency: 'very-low',
        engagementRate: this.randomFloat(0.05, 0.12, 2)
      },
      new: {
        count: Math.floor(totalCustomers * 0.05),
        avgOrderValue: this.randomFloat(80, 180, 2),
        frequency: 'new',
        engagementRate: this.randomFloat(0.25, 0.35, 2)
      }
    };
  }
}

// ============================================================================
// MASTER DATA GENERATOR
// ============================================================================

class MasterDataGenerator {
  /**
   * Generate complete dataset for a scenario
   */
  static generateScenario(scenario, profile, options = {}) {
    const timestamp = new Date().toISOString();
    let data = {
      metadata: {
        scenario,
        profile,
        generatedAt: timestamp,
        generator: 'NAVA AI Test Data Generator v1.0'
      }
    };

    switch (scenario) {
      case 'inventory':
        const items = InventoryDataGenerator.generateInventoryItems(
          profile,
          options.itemCount || 10
        );
        data.inventoryItems = items;
        data.salesHistory = InventoryDataGenerator.generateSalesHistory(
          items,
          options.days || 90,
          options.trend || 'stable'
        );
        data.seasonalityData = InventoryDataGenerator.generateSeasonalityData(
          options.seasonality || 'moderate'
        );
        break;

      case 'churn':
        const customers = CustomerDataGenerator.generateCustomers(
          profile,
          options.customerCount || 20
        );
        data.customers = customers;
        data.orderHistory = CustomerDataGenerator.generateOrderHistory(
          customers,
          options.pattern || 'mixed'
        );
        break;

      case 'marketing':
        data.campaigns = MarketingDataGenerator.generateCampaigns(
          profile,
          options.campaignCount || 20
        );
        data.segments = MarketingDataGenerator.generateCustomerSegments(
          options.totalCustomers || 10000
        );
        break;

      case 'all':
        // Generate all scenarios
        const allItems = InventoryDataGenerator.generateInventoryItems('mixed', 10);
        const allCustomers = CustomerDataGenerator.generateCustomers('mixed', 20);

        data.inventory = {
          items: allItems,
          salesHistory: InventoryDataGenerator.generateSalesHistory(allItems, 90, 'stable'),
          seasonalityData: InventoryDataGenerator.generateSeasonalityData('moderate')
        };

        data.churn = {
          customers: allCustomers,
          orderHistory: CustomerDataGenerator.generateOrderHistory(allCustomers, 'mixed')
        };

        data.marketing = {
          campaigns: MarketingDataGenerator.generateCampaigns('mixed', 20),
          segments: MarketingDataGenerator.generateCustomerSegments(10000)
        };
        break;

      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }

    return data;
  }

  /**
   * Save data to file
   */
  static saveToFile(data, filename) {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filename, json, 'utf8');
    console.log(`✅ Data saved to: ${filename}`);
    console.log(`📊 File size: ${(json.length / 1024).toFixed(2)} KB`);
  }

  /**
   * Display data summary
   */
  static displaySummary(data) {
    console.log('\n📊 DATA GENERATION SUMMARY\n');
    console.log('='.repeat(60));

    console.log(`\n📅 Generated: ${data.metadata.generatedAt}`);
    console.log(`🎯 Scenario: ${data.metadata.scenario}`);
    console.log(`📌 Profile: ${data.metadata.profile}\n`);

    if (data.inventoryItems) {
      console.log(`📦 Inventory Items: ${data.inventoryItems.length}`);
      console.log(`📊 Sales Records: ${data.salesHistory.length}`);
      console.log(`   Date Range: ${data.salesHistory[0].date.split('T')[0]} to ${data.salesHistory[data.salesHistory.length - 1].date.split('T')[0]}`);
    }

    if (data.customers) {
      console.log(`👥 Customers: ${data.customers.length}`);
      console.log(`📋 Order Records: ${data.orderHistory.length}`);
      console.log(`   Date Range: ${data.orderHistory[0].date.split('T')[0]} to ${data.orderHistory[data.orderHistory.length - 1].date.split('T')[0]}`);

      const segments = {};
      data.customers.forEach(c => {
        segments[c.segment] = (segments[c.segment] || 0) + 1;
      });
      console.log(`   Segments:`, segments);
    }

    if (data.campaigns) {
      console.log(`📧 Marketing Campaigns: ${data.campaigns.length}`);
      console.log(`   Date Range: ${data.campaigns[0].sentAt.split('T')[0]} to ${data.campaigns[data.campaigns.length - 1].sentAt.split('T')[0]}`);
      const avgOpenRate = data.campaigns.reduce((sum, c) => sum + parseFloat(c.openRate), 0) / data.campaigns.length;
      console.log(`   Avg Open Rate: ${avgOpenRate.toFixed(2)}%`);
    }

    if (data.inventory || data.churn || data.marketing) {
      console.log(`\n🎯 Generated ALL scenarios:`);
      if (data.inventory) console.log(`   ✅ Inventory: ${data.inventory.items.length} items, ${data.inventory.salesHistory.length} sales`);
      if (data.churn) console.log(`   ✅ Churn: ${data.churn.customers.length} customers, ${data.churn.orderHistory.length} orders`);
      if (data.marketing) console.log(`   ✅ Marketing: ${data.marketing.campaigns.length} campaigns`);
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    scenario: 'inventory',
    profile: 'mixed',
    output: null,
    itemCount: 10,
    customerCount: 20,
    campaignCount: 20,
    days: 90,
    trend: 'stable',
    pattern: 'mixed',
    seasonality: 'moderate',
    totalCustomers: 10000
  };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];

    if (key in options) {
      // Convert numbers
      if (['itemCount', 'customerCount', 'campaignCount', 'days', 'totalCustomers'].includes(key)) {
        options[key] = parseInt(value);
      } else {
        options[key] = value;
      }
    }
  }

  return options;
}

function displayHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║          NAVA AI TEST DATA GENERATOR                                  ║
║          Generate realistic test data for AI simulations              ║
╚═══════════════════════════════════════════════════════════════════════╝

USAGE:
  node test-data-generators.js --scenario <scenario> --profile <profile> [options]

SCENARIOS:
  inventory   - Generate inventory items and sales history
  churn       - Generate customers and order history
  marketing   - Generate marketing campaigns
  all         - Generate all scenarios

PROFILES:

  Inventory Profiles:
    critical    - Items with critically low stock (5-15 units)
    low         - Items with low stock (20-40 units)
    healthy     - Items with healthy stock (80-150 units)
    overstock   - Items with excess stock (400-600 units)
    mixed       - Mix of all profiles (default)

  Churn Profiles:
    high-risk   - Customers likely to churn (low engagement, low satisfaction)
    medium-risk - Customers at moderate risk
    low-risk    - Customers unlikely to churn
    healthy     - Highly engaged customers
    mixed       - Mix of all profiles (default)

  Marketing Profiles:
    high-engagement    - Campaigns with high open/click rates (30-40%)
    moderate-engagement- Campaigns with moderate engagement (20-28%)
    low-engagement     - Campaigns with low engagement (12-18%)
    mixed              - Mix of all profiles (default)

OPTIONS:
  --output <file>          Output filename (auto-generated if not specified)
  --itemCount <n>          Number of inventory items (default: 10)
  --customerCount <n>      Number of customers (default: 20)
  --campaignCount <n>      Number of campaigns (default: 20)
  --days <n>               Days of sales history (default: 90)
  --trend <trend>          Sales trend: increasing, decreasing, stable, volatile
  --pattern <pattern>      Order pattern: declining, increasing, stable, sporadic
  --seasonality <level>    Seasonality: none, low, moderate, high
  --totalCustomers <n>     Total customers for segments (default: 10000)

EXAMPLES:

  # Generate critical inventory scenario
  node test-data-generators.js --scenario inventory --profile critical

  # Generate high-risk churn customers with declining orders
  node test-data-generators.js --scenario churn --profile high-risk --pattern declining

  # Generate high-engagement marketing campaigns
  node test-data-generators.js --scenario marketing --profile high-engagement --campaignCount 30

  # Generate all scenarios with mixed profiles
  node test-data-generators.js --scenario all --profile mixed

  # Generate with custom output file
  node test-data-generators.js --scenario inventory --profile critical --output my-data.json

  # Generate 6 months of volatile sales data
  node test-data-generators.js --scenario inventory --days 180 --trend volatile

OUTPUT:
  Data is saved to JSON files in the current directory:
    - inventory-<profile>-<timestamp>.json
    - churn-<profile>-<timestamp>.json
    - marketing-<profile>-<timestamp>.json
    - test-data-all-<timestamp>.json

  These files can be imported directly into the simulation scripts.
`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  // Check for help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    displayHelp();
    return;
  }

  console.log('\n🤖 NAVA AI TEST DATA GENERATOR\n');
  console.log('='.repeat(60) + '\n');

  const options = parseArgs();

  console.log(`📋 Configuration:`);
  console.log(`   Scenario: ${options.scenario}`);
  console.log(`   Profile: ${options.profile}`);
  console.log('');

  try {
    // Generate data
    console.log('🔄 Generating data...\n');
    const data = MasterDataGenerator.generateScenario(
      options.scenario,
      options.profile,
      options
    );

    // Display summary
    MasterDataGenerator.displaySummary(data);

    // Save to file
    const timestamp = Date.now();
    const filename = options.output || `test-data-${options.scenario}-${options.profile}-${timestamp}.json`;
    MasterDataGenerator.saveToFile(data, filename);

    console.log('\n✅ Data generation complete!\n');
    console.log(`💡 To use this data in simulations:`);
    console.log(`   const data = require('./${filename}');\n`);

  } catch (error) {
    console.error('\n❌ Error generating data:', error.message);
    console.log('\nRun with --help for usage information\n');
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main();
}

// Export for use in other scripts
export {
  InventoryDataGenerator,
  CustomerDataGenerator,
  MarketingDataGenerator,
  MasterDataGenerator
};
