/**
 * AI Client Service
 * Unified API wrapper for AI functionality
 * Supports both demo mode and real API integration
 */

import { claudeNexus } from './claudeNexusAPI';
import { aiIntelligenceAPI } from './aiIntelligence';

class AIClient {
  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    this.isDemoMode = !this.apiKey || this.apiKey === 'your-anthropic-api-key';
    this.conversationHistory = new Map();
    this.responseDelay = 800; // Simulated delay for demo mode
  }

  /**
   * Check if real API is available
   */
  isAPIConfigured() {
    return !this.isDemoMode;
  }

  /**
   * Main chat interface
   * Routes to real API or demo responses based on configuration
   */
  async chat({ message, sessionId, context = {}, history = [], userId = 'default' }) {
    try {
      if (this.isAPIConfigured()) {
        // Use real Claude API
        return await this.chatWithClaude(message, sessionId, context, userId);
      } else {
        // Use intelligent demo mode
        return await this.chatDemo(message, context, history);
      }
    } catch (error) {
      console.error('AI Client Error:', error);
      throw error;
    }
  }

  /**
   * Chat with real Claude API
   */
  async chatWithClaude(message, sessionId, context, userId) {
    const response = await claudeNexus.chat(userId, message, {
      branchIds: context.currentBranch ? [context.currentBranch] : undefined,
      language: context.language || 'en',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to get response from AI');
    }

    return {
      content: response.narrative,
      source: 'claude',
      confidence: 0.95,
      insights: response.insights || [],
      actions: response.actions || [],
      followUps: response.followUps || [],
      visualizations: response.visualizations || [],
      usage: response.usage,
    };
  }

  /**
   * Intelligent demo mode with context-aware responses
   */
  async chatDemo(message, context, history) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.responseDelay));

    const query = message.toLowerCase();
    const language = context.language || 'en';
    let response = this.generateIntelligentResponse(query, context, language);

    return {
      content: response.content,
      source: 'demo',
      confidence: response.confidence || 0.85,
      insights: response.insights || [],
      actions: response.actions || [],
      followUps: response.followUps || [],
      visualizations: response.visualizations || [],
    };
  }

  /**
   * Generate intelligent context-aware responses
   */
  generateIntelligentResponse(query, context, language = 'en') {
    // Arabic query detection - Check for Arabic educational queries
    if (language === 'ar' || this.matchesIntent(query, ['وش', 'كيف', 'ليش', 'شرح', 'معنى', 'يعني'])) {
      return this.generateArabicResponse(query, context);
    }

    // Educational queries - "What is/does..." questions
    if (this.matchesIntent(query, ['what is', 'what does', 'explain', 'define', 'meaning of'])) {
      if (this.matchesIntent(query, ['revenue', 'sales'])) {
        return this.explainRevenue();
      }
      if (this.matchesIntent(query, ['profit', 'net profit'])) {
        return this.explainProfit();
      }
      if (this.matchesIntent(query, ['margin', 'profit margin'])) {
        return this.explainMargin();
      }
      if (this.matchesIntent(query, ['refund', 'return'])) {
        return this.explainRefunds();
      }
      if (this.matchesIntent(query, ['cost', 'expense'])) {
        return this.explainCosts();
      }
    }

    // "Why" questions - Understanding changes
    if (this.matchesIntent(query, ['why did', 'why is', 'why are'])) {
      if (this.matchesIntent(query, ['drop', 'decrease', 'down', 'lower', 'fell'])) {
        return this.explainSalesDropResponse();
      }
      if (this.matchesIntent(query, ['increase', 'up', 'higher', 'rise', 'spike'])) {
        return this.explainSalesIncreaseResponse();
      }
    }

    // Refund impact queries
    if (this.matchesIntent(query, ['refund', 'return']) &&
        this.matchesIntent(query, ['affect', 'impact', 'influence', 'hurt', 'reduce'])) {
      return this.explainRefundImpact();
    }

    // Revenue and financial queries
    if (this.matchesIntent(query, ['revenue', 'sales', 'income', 'money', 'earnings'])) {
      if (this.matchesIntent(query, ['forecast', 'predict', 'future', 'next'])) {
        return this.getRevenueForecastResponse();
      }
      if (this.matchesIntent(query, ['today', 'current', 'now'])) {
        return this.getCurrentRevenueResponse();
      }
      return this.getRevenueOverviewResponse();
    }

    // Performance queries
    if (this.matchesIntent(query, ['performance', 'performing', 'doing', 'how is', 'status'])) {
      return this.getPerformanceResponse();
    }

    // Recommendations
    if (this.matchesIntent(query, ['recommend', 'suggestion', 'improve', 'better', 'optimize', 'advice'])) {
      return this.getRecommendationsResponse();
    }

    // Anomalies and issues
    if (this.matchesIntent(query, ['anomal', 'unusual', 'strange', 'issue', 'problem', 'wrong'])) {
      return this.getAnomaliesResponse();
    }

    // Branch comparison
    if (this.matchesIntent(query, ['branch', 'location', 'store', 'compare', 'comparison'])) {
      return this.getBranchComparisonResponse();
    }

    // Trends
    if (this.matchesIntent(query, ['trend', 'pattern', 'over time', 'history', 'historical'])) {
      return this.getTrendsResponse();
    }

    // Menu/products
    if (this.matchesIntent(query, ['menu', 'item', 'product', 'dish', 'food', 'selling'])) {
      return this.getMenuInsightsResponse();
    }

    // Customer queries
    if (this.matchesIntent(query, ['customer', 'client', 'guest', 'visitor', 'retention'])) {
      return this.getCustomerInsightsResponse();
    }

    // Help queries
    if (this.matchesIntent(query, ['help', 'what can', 'how do', 'guide', 'assist'])) {
      return this.getHelpResponse();
    }

    // Default intelligent response
    return this.getDefaultResponse(query);
  }

  /**
   * Check if query matches any of the keywords
   */
  matchesIntent(query, keywords) {
    return keywords.some(keyword => query.includes(keyword));
  }

  // ============================================================================
  // Educational Response Generators (Senior Advisor)
  // ============================================================================

  explainRevenue() {
    return {
      content: `Revenue is simply **all the money your restaurant earns from sales** - every burger, drink, and dessert sold. Think of it as all the money flowing into your cash register before paying any expenses.

📊 **Your Revenue Example:**
Looking at your recent data:
- **Yesterday:** $5,200 from 187 orders
- **This week:** $36,400 (averaging $5,200/day)
- **This month:** $98,500 total

**Why Revenue Matters:**
Revenue shows how much business you're doing - it's your "top line" number. A healthy revenue trend means customers are buying from you consistently.

**Important Distinction:**
Revenue ≠ Profit
- **Revenue:** All money coming in ($5,200)
- **Profit:** Money left after expenses ($1,300 after paying for food, staff, rent, etc.)

So you might have $5,200 revenue, but only keep $1,300 as profit after all costs.

**Types of Revenue:**
- **Gross Revenue:** All sales before anything is subtracted
- **Net Revenue:** Revenue after refunds and discounts
- **Operating Revenue:** Regular sales (not including one-time items)

Would you like me to explain:
• How to increase your revenue?
• The difference between revenue and profit?
• How refunds affect your revenue?`,
      confidence: 1.0,
      insights: [
        'Revenue is all money from sales before expenses',
        'Your current monthly revenue: $98,500',
        'Revenue is different from profit',
      ],
      followUps: [
        'What is the difference between revenue and profit?',
        'How can I increase my revenue?',
        'How do refunds affect my revenue?',
      ],
    };
  }

  explainProfit() {
    return {
      content: `Profit is **the money you actually get to keep** after paying all your business expenses. It's what's left over after paying for food, staff wages, rent, utilities, and everything else.

💰 **Simple Formula:**
**Profit = Revenue - All Expenses**

📊 **Your Profit Example:**
Let's break down a typical day at your restaurant:

**Revenue:** $5,200 (all sales)

**Minus Expenses:**
- Food & ingredients: $1,560 (30%)
- Staff wages: $1,560 (30%)
- Rent & utilities: $780 (15%)
- Other costs: $520 (10%)

**= Profit: $780** (15% profit margin)

**What This Means:**
Out of every $100 in sales:
- $30 goes to food costs
- $30 goes to staff
- $15 goes to rent/utilities
- $10 goes to other expenses
- **$15 is your profit**

**Types of Profit:**
1. **Gross Profit:** Revenue minus cost of goods (food/ingredients)
2. **Operating Profit:** After paying operating expenses (staff, rent, utilities)
3. **Net Profit:** Final profit after everything including taxes

**Your Current Numbers:**
- Monthly revenue: $98,500
- Estimated monthly profit: $14,775 (15% margin)
- Annual profit projection: $177,300

**Why Profit Matters:**
Profit is what grows your business, pays you as the owner, and provides a cushion for tough times. High revenue means nothing if your expenses eat it all up!

Would you like me to help you:
• Increase your profit margin?
• Find ways to reduce costs?
• Understand where your money is going?`,
      confidence: 1.0,
      insights: [
        'Profit = Revenue minus all expenses',
        'Your estimated profit margin: 15%',
        'You keep $15 of every $100 in sales',
      ],
      followUps: [
        'How can I increase my profit?',
        'Where is most of my money going?',
        'What is a good profit margin for restaurants?',
      ],
    };
  }

  explainMargin() {
    return {
      content: `Profit margin is **the percentage of each sale that becomes profit**. It tells you how much of every dollar you keep after paying expenses.

📊 **Simple Formula:**
**Profit Margin = (Profit ÷ Revenue) × 100**

💡 **Real Example from Your Restaurant:**
- You make a burger for $12
- Ingredients cost you $3.60 (30%)
- Labor/overhead: $6.00 (50%)
- Other costs: $1.20 (10%)
- **Your profit: $1.20 (10% margin)**

**Your Overall Margins:**
- **Gross Margin:** 70% (after food costs)
- **Operating Margin:** 20% (after food + labor)
- **Net Profit Margin:** 15% (your take-home)

**What This Means:**
For every $100 in sales:
- $30 goes to food
- $50 goes to labor & overhead
- $5 goes to other expenses
- **$15 is your profit** ✅

**Industry Benchmarks:**
- Excellent: 15-20% net margin 🌟
- Good: 10-15% net margin ✅ (You're here!)
- Average: 5-10% net margin
- Struggling: Below 5%

**Margins by Item Type:**
- **Beverages:** 68% margin (highest)
- **Appetizers:** 45% margin
- **Main courses:** 35% margin
- **Desserts:** 50% margin

**How to Improve Margins:**
1. **Reduce food costs** - Better supplier deals, less waste
2. **Increase prices** - Small 5% increase = big margin boost
3. **Optimize labor** - Smart scheduling reduces costs
4. **Focus on high-margin items** - Push beverages and desserts

Would you like me to:
• Show you which menu items have the best margins?
• Explain how to increase your margins?
• Analyze your cost breakdown?`,
      confidence: 1.0,
      insights: [
        'Your profit margin: 15% (Good)',
        'You keep $15 from every $100 in sales',
        'Beverages have your highest margins at 68%',
      ],
      followUps: [
        'How can I improve my profit margin?',
        'Which items have the best margins?',
        'What is eating into my margins?',
      ],
    };
  }

  explainRefunds() {
    return {
      content: `Refunds are **money you give back to customers** when something goes wrong - wrong order, quality issue, late delivery, or customer dissatisfaction.

📉 **How Refunds Impact Your Business:**

**Your Refund Numbers:**
- This month: $2,100 in refunds
- That's 2.1% of your revenue
- Industry average: 1.5%

**The Real Cost:**
When you refund $100:
- You lose the $100 revenue
- But you already spent ~$85 on food, labor, and overhead
- **Total loss: ~$85** (not just the $100 refund)

**Your Monthly Impact:**
- Revenue lost to refunds: $2,100
- Actual cost (including expenses): ~$2,500
- **Extra profit you'd have without refunds: $2,500**

**Why Refunds Happen:**
Based on typical restaurant data:
1. **Wrong orders:** 45% - Kitchen or cashier mistakes
2. **Quality issues:** 30% - Food not up to standard
3. **Late delivery:** 25% - Timing problems

**How to Reduce Refunds:**

🎯 **Quick Win - Wrong Orders (45% of refunds)**
- **Action:** Implement order confirmation system
- **Impact:** Reduce wrong orders by 50%
- **Savings:** $945/month
- **Difficulty:** Easy

🎯 **Quality Control (30% of refunds)**
- **Action:** Kitchen quality checks before serving
- **Impact:** Reduce quality issues by 50%
- **Savings:** $630/month
- **Difficulty:** Medium

🎯 **Delivery Times (25% of refunds)**
- **Action:** Better time estimates & communication
- **Impact:** Reduce late delivery complaints by 50%
- **Savings:** $525/month
- **Difficulty:** Easy

**Total Potential Savings: $2,100/month**

This would bring your refund rate to 1.0% (below industry average) and add $2,100 to your monthly profit!

Would you like me to:
• Help you design a plan to reduce wrong orders?
• Show you how to track refund reasons?
• Explain how to handle customer complaints?`,
      confidence: 1.0,
      insights: [
        'Your refunds: $2,100/month (2.1% of revenue)',
        'Real cost with expenses: ~$2,500/month',
        'Reducing refunds could add $2,100/month profit',
      ],
      followUps: [
        'How do I reduce wrong orders?',
        'What is a good refund rate?',
        'How do I track why refunds happen?',
      ],
    };
  }

  explainCosts() {
    return {
      content: `Costs (or expenses) are **all the money you spend to run your restaurant**. These are the bills you pay before you can pocket any profit.

💸 **Your Cost Breakdown:**
Monthly revenue: $98,500

**Major Cost Categories:**

1. **Cost of Goods Sold (COGS): $29,550 (30%)**
   - Food ingredients
   - Beverages
   - Packaging materials
   - Target: 28-32% ✅

2. **Labor Costs: $29,550 (30%)**
   - Staff wages
   - Payroll taxes
   - Benefits
   - Target: 25-35% ✅

3. **Occupancy Costs: $14,775 (15%)**
   - Rent
   - Utilities (electric, gas, water)
   - Insurance
   - Target: 10-15% ✅

4. **Operating Expenses: $9,850 (10%)**
   - Marketing
   - Supplies
   - Maintenance
   - Software & tech
   - Target: 8-12% ✅

**Total Costs: $83,725 (85%)**
**Your Profit: $14,775 (15%)**

**Cost Types Explained:**

**Fixed Costs** (stay the same each month):
- Rent: $8,000/month
- Insurance: $1,200/month
- Software subscriptions: $300/month
- **Total Fixed: ~$9,500/month**

**Variable Costs** (change with sales):
- Food (30% of each sale)
- Hourly staff wages
- Packaging materials
- These go up when sales go up ↗️

**Semi-Variable Costs:**
- Utilities (base fee + usage)
- Salaried staff (fixed) + overtime (variable)

**Where Your Money Goes:**
For every $100 in sales:
- $30 → Food & ingredients
- $30 → Staff wages
- $15 → Rent & utilities
- $10 → Operating expenses
- **$15 → Your profit** ✅

**Cost Control Opportunities:**

🎯 **Quick Win - Reduce Food Waste**
- Current waste: ~4% of food costs
- Potential savings: $1,100/month
- **Action:** Better inventory management

🎯 **Labor Optimization**
- Peak hour analysis
- Smart scheduling
- Potential savings: $2,000/month

🎯 **Negotiate Supplier Contracts**
- Annual review of suppliers
- Bulk ordering discounts
- Potential savings: $800/month

Would you like me to:
• Show you where to cut costs?
• Analyze your biggest expenses?
• Compare your costs to industry benchmarks?`,
      confidence: 1.0,
      insights: [
        'Your total costs: 85% of revenue',
        'Biggest expenses: Food (30%) and Labor (30%)',
        'Potential savings: $3,900/month identified',
      ],
      followUps: [
        'Where can I cut costs?',
        'How do I reduce food waste?',
        'What are my biggest expenses?',
      ],
    };
  }

  explainSalesDropResponse() {
    return {
      content: `Let me help you understand why your sales dropped. Looking at your recent data:

📉 **Sales Drop Analysis:**
- **Yesterday:** Revenue was $4,100
- **Day before:** Revenue was $5,000
- **Drop:** 18% decrease ($900 less)

**Main Reasons Sales Drop:**

🌧️ **1. Weather (Most Common)**
- Rainy or extreme weather reduces foot traffic by 15-20%
- Yesterday was rainy in your area
- This affected your Downtown location most (-25%)

🎯 **2. Competitor Activity**
- A nearby competitor ran a "Buy One Get One" promotion
- Temporary loss of customers to competitor deals
- Usually recovers within 1-2 days

📅 **3. Day of Week Patterns**
- Some days naturally have lower sales
- Monday/Tuesday typically slower than Friday/Saturday
- Your Tuesday average: $4,200 (yesterday was close to normal for Tuesday)

**What This Means:**
✅ **This appears to be temporary**, not a long-term trend
- Your sales today are already recovering (+12% so far)
- Mall location stayed stable (not affected by weather/competition)
- No issues with quality or operations

**When to Worry vs. When It's Normal:**

**Normal (Don't worry):**
- One-day drops due to weather
- Competitor promotions (temporary)
- Holiday slowdowns
- End-of-month customer budget constraints

**Needs Attention (Investigate):**
- 3+ consecutive days of drops
- Drop across ALL locations
- Negative customer reviews appearing
- Staff turnover or service issues

**What You Can Do:**

🎯 **Quick Response (Today):**
- Run a "Rainy Day Special" for future bad weather
- Track competitor promotions and counter them
- Estimated impact: +$300-500 on bad weather days

📊 **Track the Pattern:**
- Monitor sales for next 3 days
- Compare to same day last week
- If recovered → It was temporary ✅
- If continues → Deeper investigation needed ⚠️

**Your Action Plan:**
1. **Don't panic** - Single-day drops are normal
2. **Watch the trend** - 3-day pattern shows the real story
3. **Have counter-promotions ready** for competitor activity
4. **Weather-proof your business** with delivery/takeout focus

Is this a one-time drop you wanted to understand, or have you noticed a pattern over several days?`,
      confidence: 0.90,
      insights: [
        'Sales dropped 18% yesterday due to weather + competition',
        'This appears temporary - already recovering today',
        'Watch for 3-day patterns to identify real trends',
      ],
      followUps: [
        'How do I compete with competitor promotions?',
        'What is a normal sales fluctuation?',
        'How do I track sales trends?',
      ],
    };
  }

  explainSalesIncreaseResponse() {
    return {
      content: `Great news! Let me explain why your sales increased:

📈 **Sales Increase Analysis:**
- **Yesterday:** Revenue was $6,200
- **Day before:** Revenue was $5,000
- **Increase:** 24% jump ($1,200 more)

**Main Reasons Sales Increase:**

🌟 **1. Positive Events or Promotions**
- Local event nearby increased foot traffic
- Your promotion or special offer worked well
- Social media mention or positive review went viral

☀️ **2. Weather & Timing**
- Beautiful weather brings more customers
- Weekend or payday effect
- End of month (people have budget left)

🎯 **3. Operational Excellence**
- Excellent service created word-of-mouth
- New menu items performing well
- Staff working efficiently during rush

📱 **4. Marketing Success**
- Social media campaign reached target audience
- Email promotion drove orders
- Online ads converting well

**What Caused YOUR Increase:**
Looking at the data:
- **Primary driver:** Local community event nearby (+30% foot traffic)
- **Secondary:** Positive social media mention (viral post)
- **Supporting factor:** Great weather (sunny day)

**Branch Performance:**
- Downtown: +35% (event was nearby)
- Mall: +18% (spillover effect)
- Airport: +10% (normal variation)

**How to Capitalize on This:**

🎯 **Replicate the Success:**
1. **Partner with local events** - Become official food vendor
2. **Encourage social media** - Photo contests, Instagram-worthy presentations
3. **Track what worked** - Which items sold most? What time was busiest?

📊 **Turn One-Time Spike into Long-Term Growth:**
- **Capture new customers** - Loyalty program sign-ups
- **Follow up** - Email marketing to yesterday's new customers
- **Analyze the pattern** - What made yesterday special?

**Expected Follow-Through:**
- Today: Should maintain +10-15% (spillover effect)
- Next 3 days: Return to normal baseline
- **New customers gained:** ~40-50 people who might return

**Action Items:**

🎯 **Immediate (Today):**
- Thank customers on social media who posted about you
- Offer "Come back" discount to yesterday's new customers
- Estimated impact: +15% customer return rate

🎯 **This Week:**
- Contact event organizers for future partnerships
- Create event marketing plan
- Estimated impact: +$2,500/month from event partnerships

🎯 **Long-Term:**
- Build event calendar for your area
- Develop "event day" operational plan
- Train staff for high-volume days

**The Big Picture:**
Yesterday shows your **capacity for growth**. You handled 24% more volume successfully, which means:
- ✅ Your kitchen can handle higher demand
- ✅ Your staff performed well under pressure
- ✅ Your operations scale effectively

**This proves you can sustain higher revenue if you:**
1. Generate consistent traffic (marketing, partnerships)
2. Maintain service quality at higher volumes
3. Capture and retain new customers

Would you like me to help you:
• Design an event partnership strategy?
• Create a customer retention plan?
• Analyze your capacity for growth?`,
      confidence: 0.90,
      insights: [
        'Sales increased 24% due to local event + social media',
        'You successfully handled higher volume',
        'Opportunity for event partnerships worth +$2,500/month',
      ],
      followUps: [
        'How do I partner with local events?',
        'How do I retain these new customers?',
        'What is my maximum capacity?',
      ],
    };
  }

  explainRefundImpact() {
    return {
      content: `Great question! Let me break down exactly how refunds affect your profit:

💰 **The Double Hit of Refunds:**

Refunds hurt twice - you lose the sale AND you already spent money on it.

**Example:**
Customer orders $50 worth of food, then requests a refund:

**Direct Loss:**
- Revenue: -$50 (money you give back)

**Hidden Loss (Already Spent):**
- Food ingredients: $15 (30% of order)
- Labor to prepare: $15 (30% of order)
- Overhead (rent, utilities): $7.50 (15% of order)
- **Total already spent: $37.50**

**Real Cost of $50 Refund: ~$87.50**
- You give back $50
- Plus you wasted $37.50 in resources
- **Total loss: $87.50**

**Your Current Refund Impact:**

📊 **This Month's Numbers:**
- **Gross Revenue:** $98,500 (all sales)
- **Refunds:** $2,100 (2.1% of sales)
- **Net Revenue:** $96,400 (what you kept)

**Real Financial Impact:**
- Money refunded: $2,100
- Wasted resources (food + labor + overhead): ~$1,785
- **Total impact on profit: ~$3,885**

**What This Means:**
Without refunds, you'd have an extra **$3,885 in profit this month**. That's 26% more profit just by reducing refunds!

**Your Refund Rate: 2.1%**
- Industry average: 1.5%
- Top performers: Under 1.0%
- **Your opportunity:** Reduce by 1.0% = +$2,000/month profit

**Where Refunds Come From:**

**Wrong Orders (45%):** $945/month
- Kitchen mistakes
- Cashier errors
- Miscommunication
- **Solution:** Order confirmation system → Save $472/month

**Quality Issues (30%):** $630/month
- Food not up to standard
- Temperature problems
- Presentation issues
- **Solution:** Quality checks → Save $315/month

**Late Delivery (25%):** $525/month
- Poor time estimates
- Delivery delays
- Staffing issues
- **Solution:** Better timing & communication → Save $262/month

**Action Plan to Reduce Refunds:**

🎯 **Phase 1: Quick Wins (This Week)**
**Target wrong orders** - Biggest impact area

**Action Steps:**
1. Implement verbal order confirmation
2. Kitchen display screen for accuracy
3. "Read back" policy for phone orders

**Expected Impact:**
- Reduce wrong orders by 50%
- Save $472/month
- Implementation: 2-3 days
- Difficulty: Easy ✅

🎯 **Phase 2: Quality Control (Next 2 Weeks)**
**Kitchen quality checks**

**Action Steps:**
1. Final inspection before serving
2. Temperature checks for hot items
3. Presentation standards checklist

**Expected Impact:**
- Reduce quality refunds by 50%
- Save $315/month
- Implementation: 1 week
- Difficulty: Medium

🎯 **Phase 3: Delivery Optimization (This Month)**
**Better time management**

**Action Steps:**
1. Accurate prep time estimates
2. Proactive customer updates
3. Buffer time during rush hours

**Expected Impact:**
- Reduce late delivery refunds by 50%
- Save $262/month
- Implementation: 2 weeks
- Difficulty: Easy

**Total Potential Savings: $1,049/month** (50% reduction in refunds)

**Year 1 Impact:**
- Monthly profit increase: $1,049
- Annual profit increase: $12,588
- **ROI:** Huge (minimal implementation cost)

**Tracking Your Progress:**

Create a simple refund log:
| Date | Amount | Reason | Branch | Action Taken |
|------|--------|--------|--------|--------------|
| Today | $35 | Wrong order | Downtown | Order system fix |

**Monitor weekly:**
- Refund rate (target: Under 1.5%)
- Most common reasons
- Which branch needs help
- Improvement trend

**The Bottom Line:**
Every 1% reduction in refunds = +$985/month profit

Your goal: Reduce refunds from 2.1% to 1.0%
**Result: +$2,170/month in profit** 🎯

Want me to help you:
• Design the order confirmation system?
• Create a quality control checklist?
• Set up refund tracking?`,
      confidence: 0.95,
      insights: [
        'Refunds cost you $3,885/month in lost profit',
        'Real cost is 1.85x the refund amount (includes wasted resources)',
        'Reducing refunds to 1.0% would add $2,170/month profit',
      ],
      followUps: [
        'How do I reduce wrong orders?',
        'How do I track refund reasons?',
        'What is a good refund rate for my industry?',
      ],
    };
  }

  // ============================================================================
  // Arabic Response Generators
  // ============================================================================

  generateArabicResponse(query, context) {
    // Educational queries - "وش يعني..." or "شرح..."
    if (this.matchesIntent(query, ['وش يعني', 'وش معنى', 'شرح لي', 'ايش يعني'])) {
      if (this.matchesIntent(query, ['إيرادات', 'ايرادات', 'المبيعات', 'دخل'])) {
        return this.explainRevenueArabic();
      }
      if (this.matchesIntent(query, ['ربح', 'الربح', 'صافي'])) {
        return this.explainProfitArabic();
      }
      if (this.matchesIntent(query, ['هامش', 'الهامش'])) {
        return this.explainMarginArabic();
      }
    }

    // "How to calculate" queries
    if (this.matchesIntent(query, ['كيف أحسب', 'كيف احسب', 'طريقة حساب'])) {
      if (this.matchesIntent(query, ['صافي', 'الصافي', 'نت'])) {
        return this.explainNetCalculationArabic();
      }
      if (this.matchesIntent(query, ['ربح', 'الربح'])) {
        return this.explainProfitArabic();
      }
    }

    // "Why" questions - Understanding changes
    if (this.matchesIntent(query, ['ليش', 'لماذا', 'ليه'])) {
      if (this.matchesIntent(query, ['نزل', 'انخفض', 'قل'])) {
        return this.explainSalesDropArabic();
      }
      if (this.matchesIntent(query, ['زاد', 'ارتفع', 'طلع'])) {
        return this.explainSalesIncreaseArabic();
      }
    }

    // Refund impact queries
    if (this.matchesIntent(query, ['ريفند', 'استرجاع', 'مرتجع']) &&
        this.matchesIntent(query, ['يأثر', 'يؤثر', 'تأثير', 'يضر'])) {
      return this.explainRefundImpactArabic();
    }

    // Performance queries
    if (this.matchesIntent(query, ['وضع', 'حالة', 'أداء', 'شلون'])) {
      return this.getPerformanceResponseArabic();
    }

    // Help queries
    if (this.matchesIntent(query, ['مساعدة', 'ساعدني', 'وش تقدر', 'ايش تقدر'])) {
      return this.getHelpResponseArabic();
    }

    // Default Arabic response
    return this.getDefaultArabicResponse(query);
  }

  explainRevenueArabic() {
    return {
      content: `الإيرادات ببساطة هي **كل الفلوس اللي يكسبها مطعمك من المبيعات** - كل برجر ومشروب وحلى تبيعه. فكر فيها كل الفلوس اللي تدخل الكاشير قبل ما تدفع أي مصاريف.

📊 **مثال من إيراداتك:**
بالنظر لبياناتك الأخيرة:
- **أمس:** 19,500 ريال من 187 طلب
- **هالأسبوع:** 136,500 ريال (متوسط 19,500 ريال/يوم)
- **هالشهر:** 369,375 ريال إجمالي

**ليش الإيرادات مهمة:**
الإيرادات توضح قد ايش شغلك ماشي - هذا رقمك "الأعلى". اتجاه إيرادات صحي يعني الزبائن يشترون منك باستمرار.

**فرق مهم:**
الإيرادات ≠ الربح
- **الإيرادات:** كل الفلوس اللي تدخل (19,500 ريال)
- **الربح:** الفلوس اللي تبقى بعد المصاريف (4,875 ريال بعد ما تدفع أكل، موظفين، إيجار، إلخ)

يعني ممكن يكون عندك إيرادات 19,500 ريال، بس تحتفظ بـ 4,875 ريال ربح بعد كل التكاليف.

**أنواع الإيرادات:**
- **إجمالي الإيرادات:** كل المبيعات قبل أي شي ينطرح
- **صافي الإيرادات:** الإيرادات بعد الاسترجاعات والخصومات
- **الإيرادات التشغيلية:** المبيعات العادية (مو شاملة الأشياء لمرة واحدة)

تبي أشرح لك:
• كيف تزيد إيراداتك؟
• الفرق بين الإيرادات والربح؟
• كيف الاسترجاعات تأثر على إيراداتك؟`,
      confidence: 1.0,
      insights: [
        'الإيرادات هي كل الفلوس من المبيعات قبل المصاريف',
        'إيراداتك الشهرية الحالية: 369,375 ريال',
        'الإيرادات تختلف عن الربح',
      ],
      followUps: [
        'وش الفرق بين الإيرادات والربح؟',
        'كيف أزيد إيراداتي؟',
        'كيف الاسترجاعات تأثر على إيراداتي؟',
      ],
    };
  }

  explainProfitArabic() {
    return {
      content: `الربح هو **الفلوس اللي فعلياً تحتفظ فيها** بعد ما تدفع كل مصاريف مطعمك. هو اللي يبقى بعد ما تدفع الأكل، رواتب الموظفين، الإيجار، الكهرب، وكل شي ثاني.

💰 **المعادلة البسيطة:**
**الربح = الإيرادات - كل المصاريف**

📊 **مثال من ربحك:**
خلينا نفصل يوم عادي في مطعمك:

**الإيرادات:** 19,500 ريال (كل المبيعات)

**ناقص المصاريف:**
- أكل ومكونات: 5,850 ريال (30%)
- رواتب موظفين: 5,850 ريال (30%)
- إيجار وفواتير: 2,925 ريال (15%)
- تكاليف ثانية: 1,950 ريال (10%)

**= الربح: 2,925 ريال** (15% هامش ربح)

**وش يعني هذا:**
من كل 100 ريال مبيعات:
- 30 ريال تروح للأكل
- 30 ريال تروح للموظفين
- 15 ريال تروح للإيجار/الفواتير
- 10 ريال تروح لمصاريف ثانية
- **15 ريال هو ربحك** ✅

**أنواع الربح:**
1. **إجمالي الربح:** الإيرادات ناقص تكلفة البضاعة (الأكل/المكونات)
2. **الربح التشغيلي:** بعد دفع المصاريف التشغيلية (موظفين، إيجار، فواتير)
3. **صافي الربح:** الربح النهائي بعد كل شي شامل الضرائب

**أرقامك الحالية:**
- الإيرادات الشهرية: 369,375 ريال
- الربح الشهري المتوقع: 55,406 ريال (15% هامش)
- توقعات الربح السنوي: 664,875 ريال

**ليش الربح مهم:**
الربح هو اللي ينمي مطعمك، يدفعك كمالك، ويوفر لك احتياطي للأوقات الصعبة. إيرادات عالية ما تعني شي إذا المصاريف تاكل كل شي!

تبي أساعدك:
• تزيد هامش ربحك؟
• تلاقي طرق تقلل التكاليف؟
• تفهم وين تروح فلوسك؟`,
      confidence: 1.0,
      insights: [
        'الربح = الإيرادات ناقص كل المصاريف',
        'هامش ربحك المتوقع: 15%',
        'تحتفظ بـ 15 ريال من كل 100 ريال مبيعات',
      ],
      followUps: [
        'كيف أزيد ربحي؟',
        'وين تروح أغلب فلوسي؟',
        'كم هامش ربح كويس للمطاعم؟',
      ],
    };
  }

  explainMarginArabic() {
    return {
      content: `هامش الربح هو **النسبة المئوية من كل عملية بيع تصير ربح**. يوضح لك قد ايش من كل ريال تحتفظ فيه بعد دفع المصاريف.

📊 **المعادلة البسيطة:**
**هامش الربح = (الربح ÷ الإيرادات) × 100**

💡 **مثال حقيقي من مطعمك:**
- تسوي برجر بـ 45 ريال
- المكونات تكلفك 13.50 ريال (30%)
- العمالة/التكاليف العامة: 22.50 ريال (50%)
- تكاليف ثانية: 4.50 ريال (10%)
- **ربحك: 4.50 ريال (10% هامش)**

**هوامشك الإجمالية:**
- **الهامش الإجمالي:** 70% (بعد تكلفة الأكل)
- **هامش التشغيل:** 20% (بعد الأكل + العمالة)
- **هامش صافي الربح:** 15% (اللي تاخذه أنت)

**وش يعني هذا:**
من كل 100 ريال مبيعات:
- 30 ريال تروح للأكل
- 50 ريال تروح للعمالة والتكاليف العامة
- 5 ريال تروح لمصاريف ثانية
- **15 ريال هو ربحك** ✅

**معايير الصناعة:**
- ممتاز: 15-20% هامش صافي 🌟
- كويس: 10-15% هامش صافي ✅ (أنت هنا!)
- متوسط: 5-10% هامش صافي
- يحتاج تحسين: أقل من 5%

**الهوامش حسب نوع الصنف:**
- **المشروبات:** 68% هامش (الأعلى)
- **المقبلات:** 45% هامش
- **الأطباق الرئيسية:** 35% هامش
- **الحلويات:** 50% هامش

**كيف تحسن الهوامش:**
1. **قلل تكلفة الأكل** - صفقات موردين أفضل، تقليل الهدر
2. **زيد الأسعار** - زيادة بسيطة 5% = تعزيز كبير للهامش
3. **حسّن العمالة** - جدولة ذكية تقلل التكاليف
4. **ركز على أصناف الهامش العالي** - ادفع المشروبات والحلويات

تبي:
• أوريك أي أصناف عندها أحسن هوامش؟
• أشرح لك كيف تزيد هوامشك؟
• أحلل تفصيل تكاليفك؟`,
      confidence: 1.0,
      insights: [
        'هامش ربحك: 15% (كويس)',
        'تحتفظ بـ 15 ريال من كل 100 ريال مبيعات',
        'المشروبات عندها أعلى هوامش بنسبة 68%',
      ],
      followUps: [
        'كيف أحسن هامش ربحي؟',
        'أي أصناف عندها أحسن هوامش؟',
        'وش اللي يضر هوامشي؟',
      ],
    };
  }

  explainNetCalculationArabic() {
    return {
      content: `صافي الربح (Net Profit) هو الربح الحقيقي اللي يبقى لك بعد كل المصاريف. خليني أوريك كيف تحسبه:

📊 **معادلة صافي الربح:**

**الخطوة 1: ابدأ بالإيرادات**
إجمالي الإيرادات (كل المبيعات) = 369,375 ريال

**الخطوة 2: اطرح تكلفة البضاعة المباعة (COGS)**
- تكلفة الأكل والمكونات: 110,812 ريال (30%)
= **إجمالي الربح: 258,563 ريال** (70%)

**الخطوة 3: اطرح مصاريف التشغيل**
- رواتب الموظفين: 110,812 ريال (30%)
- الإيجار والفواتير: 55,406 ريال (15%)
- مصاريف تشغيلية أخرى: 36,937 ريال (10%)
- **إجمالي مصاريف التشغيل: 203,155 ريال**

= **صافي الربح: 55,408 ريال** (15%)

📝 **المعادلة المختصرة:**
**صافي الربح = الإيرادات - تكلفة البضاعة - مصاريف التشغيل**

أو ببساطة:
**صافي الربح = إجمالي الإيرادات - كل المصاريف**

**مثال يومي:**
إيرادات يوم: 19,500 ريال
- ناقص تكلفة أكل: 5,850 ريال
- ناقص رواتب: 5,850 ريال
- ناقص إيجار/فواتير: 2,925 ريال
- ناقص مصاريف ثانية: 1,950 ريال
= **صافي ربح يومي: 2,925 ريال**

**هامش صافي الربح:**
(2,925 ÷ 19,500) × 100 = **15%**

يعني من كل 100 ريال تبيعها، 15 ريال صافي ربح لك ✅

**نصائح مهمة:**
1. **تابع يومياً** - احسب الصافي كل يوم عشان تعرف وضعك
2. **راقب المصاريف** - أي زيادة في التكاليف تأكل من الصافي
3. **حسّن الهوامش** - كل 1% تحسين = +3,694 ريال/شهر

تبي:
• أساعدك تتابع صافي ربحك يومياً؟
• أوريك وين تقدر تقلل المصاريف؟
• نحسب صافي ربح لفرع معين؟`,
      confidence: 1.0,
      insights: [
        'صافي ربحك الشهري: 55,408 ريال (15%)',
        'هامش صافي ربح كويس للمطاعم',
        'كل 1% تحسين = +3,694 ريال/شهر إضافية',
      ],
      followUps: [
        'كيف أزيد صافي ربحي؟',
        'وش أكبر مصاريفي؟',
        'كيف أتابع الربح يومياً؟',
      ],
    };
  }

  explainRefundImpactArabic() {
    return {
      content: `سؤال ممتاز! الاسترجاعات تضرب ضربتين - تخسر البيعة وكمان أنت خلاص صرفت فلوس عليها.

💰 **الضربة المزدوجة للاسترجاعات:**

**مثال:**
زبون يطلب أكل بـ 187 ريال، بعدين يطلب استرجاع:

**الخسارة المباشرة:**
- الإيرادات: -187 ريال (الفلوس اللي ترجعها)

**الخسارة المخفية (خلاص صرفتها):**
- مكونات الأكل: 56 ريال (30% من الطلب)
- عمالة للتحضير: 56 ريال (30% من الطلب)
- تكاليف عامة (إيجار، فواتير): 28 ريال (15% من الطلب)
- **إجمالي اللي خلاص صرفته: 140 ريال**

**التكلفة الحقيقية لاسترجاع 187 ريال: ~327 ريال**
- ترجع 187 ريال
- زائد ضيعت 140 ريال من الموارد
- **إجمالي الخسارة: 327 ريال**

**أثر الاسترجاعات عندك حالياً:**

📊 **أرقام هالشهر:**
- **إجمالي الإيرادات:** 369,375 ريال (كل المبيعات)
- **الاسترجاعات:** 7,875 ريال (2.1% من المبيعات)
- **صافي الإيرادات:** 361,500 ريال (اللي احتفظت فيه)

**الأثر المالي الحقيقي:**
- فلوس مسترجعة: 7,875 ريال
- موارد مهدورة (أكل + عمالة + تكاليف عامة): ~6,694 ريال
- **إجمالي الأثر على الربح: ~14,569 ريال**

**وش يعني هذا:**
بدون الاسترجاعات، كان عندك **14,569 ريال زيادة في الربح هالشهر**. هذا 26% ربح أكثر بس بتقليل الاسترجاعات!

**نسبة الاسترجاع عندك: 2.1%**
- متوسط الصناعة: 1.5%
- الأفضل: أقل من 1.0%
- **فرصتك:** تقلل بـ 1.0% = +7,500 ريال/شهر ربح

**من وين تجي الاسترجاعات:**

**طلبات غلط (45%):** 3,543 ريال/شهر
- أغلاط مطبخ
- أغلاط كاشير
- سوء تواصل
- **الحل:** نظام تأكيد الطلب → توفير 1,771 ريال/شهر

**مشاكل جودة (30%):** 2,362 ريال/شهر
- أكل مو بالمستوى المطلوب
- مشاكل حرارة
- مشاكل تقديم
- **الحل:** فحوصات جودة → توفير 1,181 ريال/شهر

**تأخير توصيل (25%):** 1,968 ريال/شهر
- توقيت وقت سيء
- تأخيرات توصيل
- مشاكل موظفين
- **الحل:** توقيت أحسن وتواصل → توفير 984 ريال/شهر

**خطة العمل لتقليل الاسترجاعات:**

🎯 **المرحلة 1: مكاسب سريعة (هالأسبوع)**
**استهدف الطلبات الغلط** - أكبر منطقة أثر

**خطوات العمل:**
1. نفذ تأكيد شفهي للطلب
2. شاشة عرض مطبخ للدقة
3. سياسة "إعادة القراءة" لطلبات التليفون

**الأثر المتوقع:**
- قلل الطلبات الغلط بـ 50%
- وفر 1,771 ريال/شهر
- التنفيذ: 2-3 أيام
- الصعوبة: سهل ✅

🎯 **المرحلة 2: مراقبة الجودة (أسبوعين جايين)**
**فحوصات جودة المطبخ**

**خطوات العمل:**
1. فحص نهائي قبل التقديم
2. فحوصات حرارة للأصناف الحارة
3. قائمة معايير التقديم

**الأثر المتوقع:**
- قلل استرجاعات الجودة بـ 50%
- وفر 1,181 ريال/شهر
- التنفيذ: أسبوع
- الصعوبة: متوسط

🎯 **المرحلة 3: تحسين التوصيل (هالشهر)**
**إدارة وقت أفضل**

**خطوات العمل:**
1. توقيتات تحضير دقيقة
2. تحديثات استباقية للزبائن
3. وقت احتياطي أثناء الذروة

**الأثر المتوقع:**
- قلل استرجاعات التوصيل المتأخر بـ 50%
- وفر 984 ريال/شهر
- التنفيذ: أسبوعين
- الصعوبة: سهل

**إجمالي التوفير المحتمل: 3,936 ريال/شهر** (تقليل 50% في الاسترجاعات)

**أثر السنة الأولى:**
- زيادة ربح شهرية: 3,936 ريال
- زيادة ربح سنوية: 47,232 ريال
- **العائد على الاستثمار:** ضخم (تكلفة تنفيذ قليلة)

**متابعة تقدمك:**

سوِّ سجل استرجاعات بسيط:
| التاريخ | المبلغ | السبب | الفرع | الإجراء المتخذ |
|---------|--------|-------|-------|----------------|
| اليوم | 131 ريال | طلب غلط | وسط البلد | تحسين نظام الطلب |

**راقب أسبوعياً:**
- نسبة الاسترجاع (الهدف: أقل من 1.5%)
- الأسباب الأكثر شيوعاً
- أي فرع يحتاج مساعدة
- اتجاه التحسين

**الخلاصة:**
كل 1% تقليل في الاسترجاعات = +3,694 ريال/شهر ربح

هدفك: قلل الاسترجاعات من 2.1% لـ 1.0%
**النتيجة: +8,138 ريال/شهر في الربح** 🎯

تبي أساعدك:
• تصمم نظام تأكيد الطلب؟
• تسوي قائمة فحص مراقبة الجودة؟
• تنصب متابعة الاسترجاعات؟`,
      confidence: 0.95,
      insights: [
        'الاسترجاعات تكلفك 14,569 ريال/شهر في الربح الضايع',
        'التكلفة الحقيقية 1.85 مرة مبلغ الاسترجاع (شاملة الموارد المهدورة)',
        'تقليل الاسترجاعات لـ 1.0% سيضيف 8,138 ريال/شهر للربح',
      ],
      followUps: [
        'كيف أقلل الطلبات الغلط؟',
        'كيف أتابع أسباب الاسترجاعات؟',
        'كم نسبة استرجاع كويسة لصناعتي؟',
      ],
    };
  }

  explainSalesDropArabic() {
    return {
      content: `خليني أساعدك تفهم ليش المبيعات نزلت. بالنظر لبياناتك الأخيرة:

📉 **تحليل انخفاض المبيعات:**
- **أمس:** الإيرادات كانت 15,400 ريال
- **قبلها:** الإيرادات كانت 18,750 ريال
- **الانخفاض:** 18% نقص (3,350 ريال أقل)

**الأسباب الرئيسية لانخفاض المبيعات:**

🌧️ **1. الطقس (الأكثر شيوعاً)**
- مطر أو طقس قاسي يقلل حركة الزبائن بنسبة 15-20%
- أمس كان الجو ممطر في منطقتك
- هذا أثر على فرعك وسط البلد أكثر (-25%)

🎯 **2. نشاط المنافسين**
- منافس قريب سوى عرض "اشتري واحد واحصل على ثاني"
- خسارة مؤقتة للزبائن لصفقات المنافسين
- عادة يتعافى خلال 1-2 يوم

📅 **3. أنماط أيام الأسبوع**
- بعض الأيام طبيعي عندها مبيعات أقل
- الاثنين/الثلاثاء عادةً أبطأ من الجمعة/السبت
- متوسط الثلاثاء عندك: 15,750 ريال (أمس كان قريب من العادي للثلاثاء)

**وش يعني هذا:**
✅ **يبدو أن هذا مؤقت**، مو اتجاه طويل الأمد
- مبيعاتك اليوم تتعافى خلاص (+12% حتى الآن)
- فرع المول بقي ثابت (ما تأثر بالطقس/المنافسة)
- ما في مشاكل بالجودة أو العمليات

**متى تقلق ومتى هو طبيعي:**

**طبيعي (لا تقلق):**
- انخفاضات يوم واحد بسبب الطقس
- عروض المنافسين الترويجية (مؤقتة)
- بطء الإجازات
- نهاية الشهر (قيود ميزانية الزبون)

**يحتاج انتباه (تحقق أكثر):**
- 3+ أيام متتالية من الانخفاضات
- انخفاض في كل الفروع
- تعليقات زبائن سلبية تظهر
- دوران موظفين أو مشاكل خدمة

**وش تقدر تسويه:**

🎯 **رد سريع (اليوم):**
- سوِّ "عرض يوم المطر خاص" للأيام الممطرة القادمة
- تابع عروض المنافسين وردّ عليهم
- الأثر المتوقع: +1,125-1,875 ريال في أيام الطقس السيء

📊 **تابع النمط:**
- راقب المبيعات لـ 3 أيام جاية
- قارن بنفس اليوم الأسبوع الماضي
- إذا تعافى → كان مؤقت ✅
- إذا استمر → يحتاج تحقيق أعمق ⚠️

**خطة عملك:**
1. **لا تهلع** - انخفاضات يوم واحد طبيعية
2. **شوف الاتجاه** - نمط 3 أيام يوضح القصة الحقيقية
3. **خلِّ عروض مضادة جاهزة** لنشاط المنافسين
4. **عزز مطعمك ضد الطقس** بالتركيز على التوصيل/الطلبات الخارجية

هل هذا انخفاض لمرة واحدة تبي تفهمه، أو تشوف نمط على عدة أيام؟`,
      confidence: 0.90,
      insights: [
        'المبيعات نزلت 18% أمس بسبب طقس + منافس',
        'يبدو مؤقت - تتعافى اليوم خلاص',
        'شوف أنماط 3 أيام عشان تعرف الاتجاهات الحقيقية',
      ],
      followUps: [
        'كيف أنافس عروض المنافسين الترويجية؟',
        'كم تقلب مبيعات عادي؟',
        'كيف أتابع اتجاهات المبيعات؟',
      ],
    };
  }

  getPerformanceResponseArabic() {
    return {
      content: `هذا **تقرير صحة عملك**:

🏆 **درجة الصحة الإجمالية: 82/100** (ممتاز)

**مقاييس الأداء:**
| المقياس | الحالي | الهدف | الحالة |
|---------|--------|--------|--------|
| الإيرادات | 369,375 ريال | 450,000 ريال | 82% ✅ |
| الطلبات | 2,890 | 3,000 | 96% ✅ |
| متوسط الطلب | 127.87 ريال | 120 ريال | 107% ⭐ |
| رضا الزبون | 4.4/5 | 4.2/5 | 105% ⭐ |

**نقاط القوة:**
✅ رضا الزبون فوق الهدف
✅ متوسط قيمة الطلب يتجاوز الأهداف
✅ تنفيذ الطلب عند 97%
✅ إنتاجية الموظفين زادت 8%

**مناطق التحسين:**
⚠️ أوقات الانتظار في الذروة (متوسط 12 دقيقة مقابل هدف 8 دقائق)
⚠️ هدر المخزون مرتفع قليلاً (4.2% مقابل هدف 3%)
⚠️ ورديةالمساء نقص موظفين يوم الجمعة

**الاتجاه:** يتحسن باستمرار خلال 4 أسابيع ماضية

أنت تؤدي في **أفضل 20%** من المطاعم المشابهة في منطقتك. استمر في الشغل الرائع!

تبي أساعدك:
• تزيد هامش ربحك؟
• تحلل فرع معين؟
• تقلل أوقات الانتظار في الذروة؟`,
      confidence: 0.90,
      insights: [
        'درجة الصحة: 82/100 (ممتاز)',
        'رضا الزبون يتجاوز الأهداف',
        'أوقات الانتظار تحتاج انتباه',
      ],
      followUps: [
        'كيف أحسن أوقات الانتظار؟',
        'وش أفضل فرع عندي؟',
        'كيف أقلل هدر المخزون؟',
      ],
    };
  }

  getHelpResponseArabic() {
    return {
      content: `أنا **المستشار الأول لـ NAVA**، مساعدك الذكي لعمليات مطعمك. هذا اللي أقدر أساعدك فيه:

## 📊 التحليلات والرؤى
- تحليل الإيرادات والتفصيلات
- مقاييس الأداء ومؤشرات الأداء الرئيسية
- تحديد الاتجاهات والأنماط
- المقارنة بالمنافسين

## 🔮 التنبؤ والتوقعات
- توقع الإيرادات (30/60/90 يوم)
- توقع الطلب
- تحليل الاتجاهات الموسمية
- توقعات النمو

## 🎯 التوصيات
- تحسين القائمة
- استراتيجيات التسعير
- توصيات التوظيف
- اقتراحات التسويق
- فرص تقليل التكاليف

## 🔍 كشف الشذوذات
- شذوذات الإيرادات
- مشاكل المخزون
- قيم الأداء الشاذة
- أنماط غير عادية

## 📍 ذكاء الفروع
- مقارنات متعددة المواقع
- تحديد أفضل الممارسات
- معايير الأداء
- توزيع الموارد

## 👥 رؤى الزبائن
- تحليل التقسيم
- مقاييس الاحتفاظ
- أنماط السلوك
- توقع الانقطاع

**إجراءات سريعة:**
• "وش توقع إيراداتي؟"
• "كيف شغلي ماشي؟"
• "وش أقدر أحسن؟"
• "قارن فروعي"
• "في أي شذوذات لازم أتعامل معها؟"

اسألني أي شي عن مطعمك!`,
      confidence: 1.0,
      followUps: [
        'وش توقع إيراداتي',
        'كيف شغلي ماشي؟',
        'وش أهم توصياتك؟',
      ],
    };
  }

  getDefaultArabicResponse(query) {
    return {
      content: `أفهم أنك تسأل عن "${query}".

بناءً على بيانات عملك الحالية، هذا اللي أقدر أقوله لك:

📊 **إحصائيات سريعة:**
• الإيرادات هالشهر: 369,375 ريال (+15%)
• درجة الصحة: 82/100 (ممتاز)
• التوصيات النشطة: 6 إجراءات عالية الأثر

أقدر أوفر رؤى مفصلة عن:
• **الأداء المالي** - الإيرادات، التكاليف، الهوامش
• **العمليات** - الطلبات، التنفيذ، الكفاءة
• **الزبائن** - الشرائح، الاحتفاظ، السلوك
• **القائمة** - الأداء، التحسين، الاتجاهات
• **الفروع** - المقارنات، المعايير

**جرب تسألني:**
• "وش توقع إيراداتي؟"
• "كيف أقدر أحسن الأداء؟"
• "ورّني الشذوذات"
• "قارن فروعي"

أو اكتب سؤالك المحدد، وأنا أساعدك بأفضل طريقة!`,
      confidence: 0.75,
      followUps: [
        'وش توقع الإيرادات',
        'وش أقدر أحسن؟',
        'كيف شغلي ماشي؟',
      ],
    };
  }

  explainSalesIncreaseArabic() {
    return {
      content: `أخبار رائعة! خليني أشرح لك ليش مبيعاتك زادت:

📈 **تحليل زيادة المبيعات:**
- **أمس:** الإيرادات كانت 23,250 ريال
- **قبلها:** الإيرادات كانت 18,750 ريال
- **الزيادة:** 24% قفزة (4,500 ريال أكثر)

**الأسباب الرئيسية لزيادة المبيعات:**

🌟 **1. فعاليات أو عروض ترويجية إيجابية**
- فعالية محلية قريبة زادت حركة الناس
- عرضك الترويجي أو العرض الخاص اشتغل زين
- ذكر على السوشيال ميديا أو تعليق إيجابي انتشر

☀️ **2. الطقس والتوقيت**
- طقس جميل يجيب زبائن أكثر
- تأثير نهاية الأسبوع أو يوم الراتب
- نهاية الشهر (الناس عندها ميزانية متبقية)

🎯 **3. التميز التشغيلي**
- خدمة ممتازة خلقت سمعة طيبة
- أصناف قائمة جديدة تؤدي زين
- الموظفين يشتغلون بكفاءة أثناء الذروة

📱 **4. نجاح التسويق**
- حملة السوشيال ميديا وصلت للجمهور المستهدف
- عرض الإيميل حرك الطلبات
- الإعلانات الإلكترونية تحول زين

**وش سبب زيادتك:**
بالنظر للبيانات:
- **السبب الأساسي:** فعالية مجتمعية قريبة (+30% حركة أقدام)
- **السبب الثانوي:** ذكر إيجابي على السوشيال ميديا (منشور انتشر)
- **عامل داعم:** طقس رائع (يوم مشمس)

**أداء الفروع:**
- وسط البلد: +35% (الفعالية كانت قريبة)
- المول: +18% (تأثير منسكب)
- المطار: +10% (تغيير عادي)

**كيف تستفيد من هذا:**

🎯 **كرر النجاح:**
1. **شارك مع الفعاليات المحلية** - صير الموزع الرسمي للأكل
2. **شجع السوشيال ميديا** - مسابقات صور، عروض تستحق الإنستجرام
3. **تابع وش اشتغل** - أي أصناف باعت أكثر؟ أي وقت كان الأكثر ازدحاماً؟

📊 **حول القفزة المؤقتة لنمو طويل الأمد:**
- **اجذب زبائن جدد** - اشتراكات برنامج الولاء
- **تابع** - تسويق بالإيميل لزبائن أمس الجدد
- **حلل النمط** - وش خلى أمس مميز؟

**المتابعة المتوقعة:**
- اليوم: لازم تحافظ على +10-15% (تأثير منسكب)
- 3 أيام جاية: رجوع للمستوى الطبيعي
- **زبائن جدد مكتسبين:** ~40-50 شخص ممكن يرجعون

**بنود العمل:**

🎯 **فوري (اليوم):**
- اشكر الزبائن على السوشيال ميديا اللي نشروا عنك
- قدم خصم "ارجع" لزبائن أمس الجدد
- الأثر المتوقع: +15% معدل رجوع الزبائن

🎯 **هالأسبوع:**
- تواصل مع منظمي الفعاليات للشراكات المستقبلية
- سوِّ خطة تسويق للفعاليات
- الأثر المتوقع: +9,375 ريال/شهر من شراكات الفعاليات

🎯 **طويل الأمد:**
- ابنِ تقويم فعاليات لمنطقتك
- طور خطة تشغيلية ليوم الفعالية
- درب الموظفين على أيام الحجم العالي

**الصورة الكبيرة:**
أمس يوضح **قدرتك على النمو**. تعاملت مع 24% حجم أكثر بنجاح، يعني:
- ✅ مطبخك يقدر يتعامل مع طلب أعلى
- ✅ موظفينك أدوا زين تحت الضغط
- ✅ عملياتك تتوسع بفعالية

**هذا يثبت أنك تقدر تحافظ على إيرادات أعلى إذا:**
1. تولد حركة ثابتة (تسويق، شراكات)
2. تحافظ على جودة الخدمة في الأحجام العالية
3. تجذب وتحتفظ بالزبائن الجدد

تبي أساعدك:
• تصمم استراتيجية شراكة فعاليات؟
• تسوي خطة احتفاظ بالزبائن؟
• تحلل قدرتك على النمو؟`,
      confidence: 0.90,
      insights: [
        'المبيعات زادت 24% بسبب فعالية محلية + سوشيال ميديا',
        'تعاملت مع الحجم العالي بنجاح',
        'فرصة لشراكات فعاليات بقيمة +9,375 ريال/شهر',
      ],
      followUps: [
        'كيف أشارك مع الفعاليات المحلية؟',
        'كيف أحتفظ بهالزبائن الجدد؟',
        'كم أقصى قدرتي؟',
      ],
    };
  }

  // Response generators
  getRevenueForecastResponse() {
    return {
      content: `Based on historical data and current trends, here's your **30-day revenue forecast**:

**Projected Revenue: $152,400** (confidence: 87%)

📈 **Key Predictions:**
• Week 1: $35,200 (+8% vs last week)
• Week 2: $38,100 (+12% - weekend surge expected)
• Week 3: $36,800 (stable)
• Week 4: $42,300 (+15% - end of month uptick)

**Factors Influencing Forecast:**
1. Seasonal trend showing upward momentum
2. Recent marketing campaign gaining traction
3. Customer retention improving by 5%
4. New menu items performing above expectations

**Recommendations:**
• Prepare inventory for 15% increase in demand
• Schedule additional staff for weekend peaks
• Monitor Week 2 promotions closely

Would you like me to break down the forecast by branch or category?`,
      confidence: 0.87,
      insights: [
        'Revenue trending 12% above last month',
        'Weekend performance exceptionally strong',
        'New menu items driving growth',
      ],
      followUps: [
        'Show forecast by branch',
        'What factors could improve this forecast?',
        'Compare to last year\'s performance',
      ],
      visualizations: [
        { type: 'line', title: 'Revenue Forecast', metric: 'revenue' },
      ],
    };
  }

  getCurrentRevenueResponse() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return {
      content: `Here's your **real-time revenue snapshot** for ${today}:

💰 **Today's Revenue: $4,850**
📊 **vs Yesterday:** +12% ($4,330)
📈 **vs Same Day Last Week:** +8% ($4,490)

**Hourly Breakdown:**
• Morning (6-11am): $1,200 (25%)
• Lunch (11am-2pm): $1,850 (38%) ⭐ Peak
• Afternoon (2-5pm): $800 (16%)
• Evening (5-9pm): $1,000 (21%) - In progress

**Top Performers Today:**
1. Branch Downtown: $2,100 (43%)
2. Branch Mall: $1,600 (33%)
3. Branch Airport: $1,150 (24%)

**Notable Observations:**
• Lunch rush 15% higher than average
• Online orders up 22%
• Average ticket size: $28.50 (+$2.30)

You're on track to exceed your daily target of $5,500!`,
      confidence: 0.92,
      insights: [
        'Lunch period outperforming expectations',
        'Online orders showing strong growth',
        'Average ticket size increased',
      ],
    };
  }

  getRevenueOverviewResponse() {
    return {
      content: `Here's your **Revenue Overview** for this month:

💰 **Total Revenue: $98,500**
📊 **Target Progress:** 82% of $120,000 goal
📈 **Growth Rate:** +15% vs last month

**Revenue by Channel:**
• Dine-in: $52,800 (54%)
• Delivery: $28,400 (29%)
• Takeout: $17,300 (17%)

**Revenue by Day:**
• Weekdays: $62,100 (avg $3,100/day)
• Weekends: $36,400 (avg $4,550/day) ⭐

**Key Insights:**
1. Weekend performance is your strongest driver
2. Delivery growing faster than other channels (+22%)
3. Average order value increased to $34.20

**Recommendations:**
• Focus marketing on weekday lunch to boost mid-week sales
• Expand delivery coverage area
• Introduce weekday promotions to balance revenue

Would you like a detailed breakdown by branch or category?`,
      confidence: 0.88,
      insights: [
        'Revenue 15% above last month',
        'Weekend performance strongest',
        'Delivery channel growing rapidly',
      ],
    };
  }

  getPerformanceResponse() {
    return {
      content: `Here's your **Business Health Report**:

🏆 **Overall Health Score: 82/100** (Excellent)

**Performance Metrics:**
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Revenue | $98,500 | $120K | 82% ✅ |
| Orders | 2,890 | 3,000 | 96% ✅ |
| Avg Ticket | $34.10 | $32 | 107% ⭐ |
| Customer Sat | 4.4/5 | 4.2/5 | 105% ⭐ |

**Strengths:**
✅ Customer satisfaction above target
✅ Average ticket size exceeding goals
✅ Order fulfillment at 97%
✅ Staff productivity up 8%

**Areas for Improvement:**
⚠️ Peak hour wait times (avg 12 min vs 8 min target)
⚠️ Inventory waste slightly elevated (4.2% vs 3% target)
⚠️ Evening shift understaffed on Fridays

**Trend:** Improving steadily over past 4 weeks

You're performing in the **top 20%** of similar restaurants in your region. Keep up the great work!`,
      confidence: 0.90,
      insights: [
        'Health score: 82/100 (Excellent)',
        'Customer satisfaction exceeding targets',
        'Wait times need attention',
      ],
      actions: [
        { text: 'Address peak hour staffing', priority: 'high' },
        { text: 'Review inventory management', priority: 'medium' },
      ],
    };
  }

  getRecommendationsResponse() {
    return {
      content: `Here are my **Top Recommendations** to improve your business:

## 1. 🎯 Optimize Peak Hour Staffing (High Impact)
**Expected Impact:** +$4,200/month revenue
- Current wait time at peak: 12 minutes
- Add 1 staff member during 12-2pm rush
- Estimated cost: $1,800/month
- **Net benefit: $2,400/month**

## 2. 📋 Menu Optimization (High Impact)
**Expected Impact:** +15% profit margin
- 6 items underperforming (bottom 10% sales)
- 3 items have <10% margin
- **Action:** Remove or reprice these items
- **Estimated annual savings: $8,500**

## 3. 🚀 Expand Delivery Radius (Medium Impact)
**Expected Impact:** +22% delivery orders
- Current radius: 3 miles
- Expand to 5 miles
- Competitor analysis shows demand
- **Projected additional revenue: $3,800/month**

## 4. 💳 Loyalty Program Launch (Medium Impact)
**Expected Impact:** +18% repeat customers
- 62% of customers are one-time visitors
- Industry benchmark: 45%
- **Projected lifetime value increase: 35%**

## 5. ⏰ Happy Hour Promotion (Quick Win)
**Expected Impact:** +$1,200/week
- 3-5pm currently slowest period
- 25% discount on select items
- Targets office worker segment

**Priority Order:** 1 → 2 → 5 → 3 → 4

Would you like detailed implementation steps for any of these?`,
      confidence: 0.85,
      insights: [
        '6 high-impact opportunities identified',
        'Total potential monthly impact: $12,000+',
        'Quick wins available immediately',
      ],
      actions: [
        { text: 'Optimize peak staffing', priority: 'high' },
        { text: 'Review underperforming menu items', priority: 'high' },
        { text: 'Implement happy hour promotion', priority: 'medium' },
      ],
      followUps: [
        'How do I implement the staffing changes?',
        'Which menu items should I remove?',
        'Tell me more about the loyalty program',
      ],
    };
  }

  getAnomaliesResponse() {
    return {
      content: `I've detected **4 anomalies** worth investigating:

## 🔴 Critical - Revenue Drop (March 18)
- Revenue decreased 32% vs expected
- Affected: All branches
- Correlation: Competitor launched major promotion
- **Action Required:** Review competitive positioning

## 🟡 Warning - Inventory Spike (Category: Beverages)
- Waste rate: 8.2% (normal: 3%)
- Root cause: Overordering for expected event
- Event was cancelled
- **Action:** Adjust ordering algorithm
- **Potential savings if fixed: $450/week**

## 🟡 Warning - Staff Overtime Surge (Branch: Downtown)
- Overtime hours: +45% this week
- Cause: 2 staff on unplanned leave
- **Action:** Review contingency staffing plan

## 🟢 Positive - Revenue Spike (March 15)
- Revenue 48% above normal
- Cause: Local event + social media mention
- **Opportunity:** Replicate success factors
- Consider event partnerships

**Summary:**
- 1 critical issue requiring immediate attention
- 2 warnings to address this week
- 1 positive anomaly to learn from

Would you like detailed analysis on any of these?`,
      confidence: 0.88,
      insights: [
        '1 critical anomaly detected',
        'Potential savings: $450/week from inventory fix',
        'Positive anomaly shows growth opportunity',
      ],
    };
  }

  getBranchComparisonResponse() {
    return {
      content: `Here's your **Branch Performance Comparison**:

| Branch | Revenue | Orders | Avg Ticket | Health |
|--------|---------|--------|------------|--------|
| Downtown | $42,300 ⭐ | 1,180 | $35.80 | 88/100 |
| Mall | $31,200 | 890 | $35.00 | 82/100 |
| Airport | $25,000 | 820 | $30.50 | 76/100 |

## 🏆 Top Performer: Downtown
**Success Factors:**
- Prime location with high foot traffic
- Strong lunch rush (45% of daily revenue)
- Experienced team (avg tenure: 2.3 years)
- Best customer reviews (4.6/5)

## 📈 Most Improved: Mall (+18% vs last month)
**Growth Drivers:**
- New marketing partnership
- Extended evening hours
- Menu refresh boosted sales

## ⚠️ Needs Attention: Airport
**Challenges:**
- Lower ticket size (-15% vs average)
- Peak hours don't align with flights
- Staff turnover higher than others

**Recommendations:**
1. Transfer best practices from Downtown to Airport
2. Adjust Airport hours to match flight schedules
3. Implement grab-and-go options at Airport
4. Cross-train Mall staff to Downtown standards

Would you like a deeper dive into any branch?`,
      confidence: 0.90,
      insights: [
        'Downtown is top performer',
        'Airport needs strategic attention',
        'Mall showing strong improvement',
      ],
      visualizations: [
        { type: 'bar', title: 'Branch Revenue Comparison', groupBy: 'branch' },
      ],
    };
  }

  getTrendsResponse() {
    return {
      content: `Here are the **Key Trends** I've identified:

## 📈 Revenue Trend: Upward
- **30-day trend:** +12% growth
- **90-day trend:** +28% growth
- **YoY comparison:** +35% vs same period

## 🍽️ Order Patterns
- **Peak days:** Friday (+25%), Saturday (+30%)
- **Peak hours:** 12-2pm, 6-8pm
- **Growing:** Online orders (+22% MoM)
- **Declining:** Walk-in lunch (-5%)

## 👥 Customer Behavior
- **New customers:** +15% this month
- **Repeat rate:** 38% (up from 32%)
- **Avg visits/customer:** 2.3 per month
- **Top segment:** Office workers (42%)

## 🍕 Menu Trends
- **Rising stars:** New seasonal items (+45% sales)
- **Declining:** Traditional items (-12%)
- **Highest margin:** Beverages (68%)
- **Fastest growing:** Combo meals (+35%)

## 💡 Opportunities Identified
1. Double down on online ordering growth
2. Revitalize walk-in lunch with promotions
3. Expand seasonal menu success
4. Target office worker segment more

**Confidence Level:** 89%

Would you like trend analysis for a specific metric?`,
      confidence: 0.89,
      insights: [
        'Strong upward revenue trend',
        'Online orders growing significantly',
        'Customer retention improving',
      ],
    };
  }

  getMenuInsightsResponse() {
    return {
      content: `Here's your **Menu Intelligence Report**:

## 🌟 Top Performers
| Item | Sales | Margin | Trend |
|------|-------|--------|-------|
| Signature Burger | $12,400 | 45% | ↗️ +18% |
| Grilled Chicken | $9,800 | 52% | ↗️ +12% |
| Caesar Salad | $7,200 | 58% | → Stable |
| Fish & Chips | $6,900 | 42% | ↗️ +8% |

## ⚠️ Underperformers (Consider Removing)
| Item | Sales | Margin | Action |
|------|-------|--------|--------|
| Veggie Wrap | $890 | 22% | Remove |
| Soup of Day | $1,200 | 18% | Reprice |
| Kids Pasta | $1,100 | 15% | Revamp |

## 📊 Category Analysis
- **Best category:** Main Courses (48% of revenue)
- **Highest margin:** Beverages (68%)
- **Most orders:** Appetizers (32% of orders)
- **Growth leader:** Desserts (+25% MoM)

## 💡 Menu Optimization Opportunities
1. **Bundle Signature Burger + Beverage** → Est. +$1,200/week
2. **Remove bottom 5 items** → Simplify operations, save $800/month
3. **Introduce premium upcharge** → +$2.50 avg ticket
4. **Seasonal LTO launch** → Drives 15% traffic increase

**Estimated Impact:** +$4,500/month profit

Want me to generate a detailed optimization plan?`,
      confidence: 0.87,
      insights: [
        '4 items ready for removal',
        'Beverages have highest margins',
        'Desserts showing strong growth',
      ],
    };
  }

  getCustomerInsightsResponse() {
    return {
      content: `Here's your **Customer Intelligence Report**:

## 👥 Customer Overview
- **Total active customers:** 4,280
- **New this month:** 640 (+15%)
- **Churned this month:** 180 (-12% vs last month ✅)
- **Net growth:** +460 customers

## 🎯 Customer Segments
| Segment | Count | Avg Spend | Visit Freq |
|---------|-------|-----------|------------|
| Loyalists | 890 (21%) | $48 | 4.2x/mo ⭐ |
| Regulars | 1,450 (34%) | $38 | 2.1x/mo |
| Occasionals | 1,240 (29%) | $32 | 0.8x/mo |
| At-Risk | 700 (16%) | $28 | 0.3x/mo ⚠️ |

## 📈 Retention Metrics
- **Overall retention:** 72% (industry avg: 65%)
- **First to second visit:** 45%
- **Loyalist conversion:** 21%
- **Lifetime value:** $420

## 🔥 At-Risk Customers Alert
- **700 customers** haven't visited in 30+ days
- **Estimated loss if churned:** $19,600/month
- **Win-back opportunity:** 40% respond to offers

## 💡 Recommendations
1. **Launch win-back campaign** for 700 at-risk customers
2. **Loyalty program** to convert Regulars → Loyalists
3. **First-visit follow-up** to improve 45% return rate
4. **VIP perks** for top 100 customers

Would you like me to help design a retention campaign?`,
      confidence: 0.86,
      insights: [
        '700 customers at risk of churning',
        'Retention above industry average',
        'Win-back campaign recommended',
      ],
    };
  }

  getHelpResponse() {
    return {
      content: `I'm **NAVA AI**, your intelligent restaurant operations co-pilot. Here's what I can help you with:

## 📊 Analytics & Insights
- Revenue analysis and breakdowns
- Performance metrics and KPIs
- Trend identification and patterns
- Competitive benchmarking

## 🔮 Forecasting & Predictions
- Revenue forecasting (30/60/90 days)
- Demand prediction
- Seasonal trend analysis
- Growth projections

## 🎯 Recommendations
- Menu optimization
- Pricing strategies
- Staffing recommendations
- Marketing suggestions
- Cost reduction opportunities

## 🔍 Anomaly Detection
- Revenue anomalies
- Inventory issues
- Performance outliers
- Unusual patterns

## 📍 Branch Intelligence
- Multi-location comparisons
- Best practice identification
- Performance benchmarking
- Resource allocation

## 👥 Customer Insights
- Segmentation analysis
- Retention metrics
- Behavior patterns
- Churn prediction

**Quick Actions:**
• "Show my revenue forecast"
• "How is my business performing?"
• "What should I improve?"
• "Compare my branches"
• "Any anomalies to address?"

Just ask me anything about your business!`,
      confidence: 1.0,
      followUps: [
        'Show my revenue forecast',
        'How is my business performing?',
        'What are your top recommendations?',
      ],
    };
  }

  getDefaultResponse(query) {
    return {
      content: `I understand you're asking about "${query}".

Based on your current business data, here's what I can tell you:

📊 **Quick Stats:**
• Revenue this month: $98,500 (+15%)
• Health score: 82/100 (Excellent)
• Active recommendations: 6 high-impact actions

I can provide detailed insights on:
• **Financial performance** - Revenue, costs, margins
• **Operations** - Orders, fulfillment, efficiency
• **Customers** - Segments, retention, behavior
• **Menu** - Performance, optimization, trends
• **Branches** - Comparisons, benchmarks

**Try asking me:**
• "What's my revenue forecast?"
• "How can I improve performance?"
• "Show me anomalies"
• "Compare my branches"

Or type your specific question, and I'll do my best to help!`,
      confidence: 0.75,
      followUps: [
        'Show revenue forecast',
        'What should I improve?',
        'How is my business doing?',
      ],
    };
  }

  /**
   * Get quick insights without full conversation
   */
  async getQuickInsights(type = 'summary') {
    try {
      if (this.isAPIConfigured()) {
        // Use AI intelligence API
        return await aiIntelligenceAPI.getInsightsSummary({});
      } else {
        // Return demo insights
        return {
          healthScore: 82,
          revenue: { current: 98500, trend: 15, forecast: 152400 },
          alerts: 3,
          recommendations: 6,
          topInsight: 'Revenue trending 15% above last month',
        };
      }
    } catch (error) {
      console.error('Quick insights error:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

// Export singleton instance
export const aiClient = new AIClient();
export default aiClient;
