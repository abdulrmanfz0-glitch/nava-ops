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
    let response = this.generateIntelligentResponse(query, context);

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
  generateIntelligentResponse(query, context) {
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
