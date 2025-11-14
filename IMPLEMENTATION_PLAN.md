# Claude Nexus: Implementation Plan
## *From Vision to Reality*

---

## Overview

This document provides a detailed, week-by-week implementation plan for building Claude Nexus, the intelligence core of the NAVA OPS restaurant SaaS platform.

**Timeline**: 10 weeks (2.5 months)
**Team Size**: Assumed 1-2 developers
**Approach**: Iterative, test-driven, user-centric

---

## Phase 1: Conversational Foundation
### **Weeks 1-2 | Sprint 1**

#### **Goals**
- Integrate Claude API
- Build conversational UI
- Implement natural language query understanding
- Create business context builder

---

### **Week 1: API Integration & Core Services**

#### **Day 1-2: Environment Setup**
```bash
# Install dependencies
npm install @anthropic-ai/sdk
npm install @supabase/supabase-js@latest

# Environment configuration
echo "VITE_ANTHROPIC_API_KEY=your_key_here" >> .env
```

**Tasks:**
- [ ] Create Anthropic account and get API key
- [ ] Add Anthropic SDK to package.json
- [ ] Create environment variable configuration
- [ ] Test API connectivity

**Deliverable:** Working Anthropic API connection

---

#### **Day 3-4: Claude Nexus Service Layer**

**File:** `src/services/claudeNexusAPI.js`

```javascript
/**
 * Claude Nexus API Service
 * Handles all interactions with Claude AI for business intelligence
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabaseClient';
import { logger } from '@/utils/logger';

class ClaudeNexusService {
  constructor() {
    this.client = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
    });

    this.conversationHistory = new Map(); // userId -> messages[]
    this.contextCache = new Map(); // userId -> businessContext
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Main chat interface
   * @param {string} userId - Current user ID
   * @param {string} message - User's question/request
   * @param {Object} options - Branch IDs, context preferences, etc.
   * @returns {Object} AI response with narrative, visualizations, actions
   */
  async chat(userId, message, options = {}) {
    try {
      logger.info('Claude Nexus chat request', { userId, message });

      // Get or build business context
      const context = await this.getBusinessContext(userId, options.branchIds);

      // Retrieve conversation history
      const history = this.conversationHistory.get(userId) || [];

      // Create system prompt
      const systemPrompt = this.buildSystemPrompt(context);

      // Call Claude API
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          ...history.slice(-10), // Keep last 10 messages for context
          {
            role: 'user',
            content: message
          }
        ]
      });

      const assistantMessage = response.content[0].text;

      // Update conversation history
      history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      );
      this.conversationHistory.set(userId, history);

      // Parse and structure response
      const structured = await this.parseResponse(assistantMessage, context);

      logger.info('Claude Nexus response generated', { userId, tokens: response.usage });

      return structured;
    } catch (error) {
      logger.error('Claude Nexus chat error', error);
      throw error;
    }
  }

  /**
   * Build comprehensive business context for AI
   */
  async getBusinessContext(userId, branchIds) {
    const cacheKey = `${userId}-${branchIds?.join(',')}`;

    // Check cache
    const cached = this.contextCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.context;
    }

    // Fetch fresh context
    const context = await this.buildBusinessContext(branchIds);

    // Cache it
    this.contextCache.set(cacheKey, {
      context,
      timestamp: Date.now()
    });

    return context;
  }

  /**
   * Gather all relevant business data
   */
  async buildBusinessContext(branchIds) {
    const now = new Date();
    const lastWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Parallel data fetching
    const [branches, weekMetrics, monthMetrics, insights, topProducts] = await Promise.all([
      this.getBranches(branchIds),
      this.getMetrics(branchIds, lastWeek, now),
      this.getMetrics(branchIds, lastMonth, now),
      this.getActiveInsights(branchIds),
      this.getTopProducts(branchIds, lastWeek, now)
    ]);

    return {
      currentDate: now.toISOString(),
      branches,
      performance: {
        lastWeek: this.summarizeMetrics(weekMetrics),
        lastMonth: this.summarizeMetrics(monthMetrics),
        trends: this.calculateTrends(weekMetrics, monthMetrics)
      },
      insights: insights.map(i => ({
        type: i.type,
        message: i.message,
        severity: i.severity,
        confidence: i.confidence
      })),
      topProducts: topProducts.slice(0, 10),
      industryBenchmarks: await this.getIndustryBenchmarks()
    };
  }

  /**
   * Build system prompt with business context
   */
  buildSystemPrompt(context) {
    return `You are Claude Nexus, the AI intelligence core of NAVA OPS, a restaurant analytics platform.

**Your Role:**
You are an expert restaurant consultant with deep knowledge of:
- Restaurant operations and management
- Financial analysis and accounting
- Data science and predictive analytics
- Customer behavior and marketing
- Multi-location business optimization

**Your Personality:**
- Professional yet conversational
- Data-driven but humanistic
- Proactive and insightful
- Action-oriented
- Optimistic but realistic

**Current Business Context:**
${JSON.stringify(context, null, 2)}

**Guidelines:**
1. Always ground insights in the actual data provided
2. Use specific numbers, dates, and percentages
3. Compare to historical performance when relevant
4. Provide actionable recommendations, not just observations
5. Explain "why" things are happening, not just "what"
6. Use restaurant industry terminology correctly
7. Consider multiple branches when analyzing performance
8. Think about both immediate and long-term impacts
9. Acknowledge uncertainty when forecasting
10. End with follow-up questions to deepen analysis

**Response Format:**
When answering questions, structure your responses as:
1. **Direct Answer** - Answer the question clearly
2. **Context & Analysis** - Explain the underlying patterns
3. **Actionable Insights** - What should be done
4. **Impact Projection** - Expected outcomes
5. **Follow-up Questions** - Deepen the conversation

**Example Response:**
"Revenue last week was $52,400, down 8% from the previous week. This decline was primarily driven by Branch C ($18,200, -15%) while Branch A actually grew 5% to $28,800.

The drop at Branch C correlates with kitchen staff turnover (3 departures) and increased ticket times (avg 28min vs target 18min). Customer reviews mention 'slow service' 23 times in the past week.

Recommended immediate actions:
1. Deploy experienced staff from Branch A to Branch C for next 2 weeks
2. Simplify Branch C menu temporarily to reduce kitchen complexity
3. Implement expeditor role during peak hours

If implemented this week, we project 60-75% recovery of lost revenue based on similar interventions in March 2024.

Would you like me to analyze Branch C's staffing patterns in detail, or shall we explore Branch A's growth drivers to replicate elsewhere?"`;
  }

  /**
   * Parse Claude's response into structured data
   */
  async parseResponse(text, context) {
    // Extract insights
    const insights = this.extractInsights(text);

    // Identify suggested visualizations
    const visualizations = this.suggestVisualizations(text, context);

    // Extract action items
    const actions = this.extractActionItems(text);

    // Generate follow-up questions
    const followUps = this.generateFollowUps(text, context);

    return {
      narrative: text,
      insights,
      visualizations,
      actions,
      followUps
    };
  }

  // Additional helper methods...
  async getBranches(branchIds) {
    const { data } = await supabase
      .from('branches')
      .select('*')
      .in('id', branchIds);
    return data;
  }

  async getMetrics(branchIds, startDate, endDate) {
    const { data } = await supabase
      .from('performance_entries')
      .select('*')
      .in('branch_id', branchIds)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());
    return data;
  }

  summarizeMetrics(metrics) {
    return {
      revenue: metrics.reduce((sum, m) => sum + (m.revenue || 0), 0),
      orders: metrics.reduce((sum, m) => sum + (m.orders || 0), 0),
      customers: metrics.reduce((sum, m) => sum + (m.customers || 0), 0),
      aov: metrics.reduce((sum, m) => sum + (m.revenue || 0), 0) /
           metrics.reduce((sum, m) => sum + (m.orders || 0), 0)
    };
  }

  calculateTrends(recent, older) {
    const recentSum = this.summarizeMetrics(recent);
    const olderSum = this.summarizeMetrics(older);

    return {
      revenue: ((recentSum.revenue - olderSum.revenue) / olderSum.revenue) * 100,
      orders: ((recentSum.orders - olderSum.orders) / olderSum.orders) * 100,
      aov: ((recentSum.aov - olderSum.aov) / olderSum.aov) * 100
    };
  }

  extractInsights(text) {
    // Simple regex-based extraction (can be enhanced with ML)
    const patterns = [
      /(?:insight|finding|notable):\s*([^.!?]+[.!?])/gi,
      /(?:importantly|significantly|critically),?\s*([^.!?]+[.!?])/gi
    ];

    const insights = [];
    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        insights.push(match[1].trim());
      }
    });

    return insights;
  }

  extractActionItems(text) {
    // Extract numbered recommendations or action items
    const actionPattern = /(?:recommend|suggest|should|action)(?:ed)?:?\s*([^.!?]+[.!?])/gi;
    const numberedPattern = /^\s*\d+\.\s+(.+)$/gm;

    const actions = [];

    // Extract from recommendation sentences
    const matches = text.matchAll(actionPattern);
    for (const match of matches) {
      actions.push({
        text: match[1].trim(),
        priority: 'medium'
      });
    }

    // Extract numbered lists
    const numberedMatches = text.matchAll(numberedPattern);
    for (const match of numberedMatches) {
      actions.push({
        text: match[1].trim(),
        priority: 'high'
      });
    }

    return actions.slice(0, 5); // Top 5 actions
  }

  suggestVisualizations(text, context) {
    const visualizations = [];

    // Revenue trend mentioned
    if (/revenue.*trend|trend.*revenue/i.test(text)) {
      visualizations.push({
        type: 'line',
        title: 'Revenue Trend',
        dataKey: 'revenue',
        timeRange: 'last30days'
      });
    }

    // Branch comparison mentioned
    if (/branch.*compar|compar.*branch/i.test(text)) {
      visualizations.push({
        type: 'bar',
        title: 'Branch Performance Comparison',
        dataKey: 'revenue',
        groupBy: 'branch'
      });
    }

    // Product/menu mentioned
    if (/product|menu|item/i.test(text)) {
      visualizations.push({
        type: 'pie',
        title: 'Top Products',
        dataKey: 'quantity',
        groupBy: 'product'
      });
    }

    return visualizations;
  }

  generateFollowUps(text, context) {
    // Context-aware follow-up questions
    const followUps = [];

    if (context.performance.trends.revenue < -5) {
      followUps.push("What's causing the revenue decline?");
      followUps.push("Which specific menu items are underperforming?");
    }

    if (context.performance.trends.revenue > 10) {
      followUps.push("What's driving this growth?");
      followUps.push("Can we replicate this success at other branches?");
    }

    if (context.branches.length > 1) {
      followUps.push("How do branches compare to each other?");
      followUps.push("Which branch has the most improvement potential?");
    }

    return followUps.slice(0, 3);
  }

  async getActiveInsights(branchIds) {
    const { data } = await supabase
      .from('insights')
      .select('*')
      .in('branch_id', branchIds)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10);
    return data || [];
  }

  async getTopProducts(branchIds, startDate, endDate) {
    const { data } = await supabase
      .from('order_items')
      .select(`
        product_id,
        products (name),
        quantity,
        unit_price
      `)
      .in('branch_id', branchIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Aggregate by product
    const productMap = new Map();
    data?.forEach(item => {
      const key = item.product_id;
      if (!productMap.has(key)) {
        productMap.set(key, {
          name: item.products.name,
          quantity: 0,
          revenue: 0
        });
      }
      const product = productMap.get(key);
      product.quantity += item.quantity;
      product.revenue += item.quantity * item.unit_price;
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getIndustryBenchmarks() {
    // Industry standard benchmarks for restaurants
    return {
      foodCostPercentage: { min: 28, max: 35, ideal: 30 },
      laborCostPercentage: { min: 25, max: 35, ideal: 28 },
      profitMargin: { min: 10, max: 15, ideal: 12 },
      tableT turnover: { casual: 1.5, fineDining: 1.0, fastCasual: 2.5 },
      averageOrderValue: { min: 25, max: 45, median: 35 }
    };
  }

  /**
   * Clear conversation history for a user
   */
  clearHistory(userId) {
    this.conversationHistory.delete(userId);
    logger.info('Conversation history cleared', { userId });
  }

  /**
   * Analyze data without conversation context
   * Used for batch processing, reports, etc.
   */
  async analyze(prompt, context = {}) {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return response.content[0].text;
    } catch (error) {
      logger.error('Claude Nexus analysis error', error);
      throw error;
    }
  }
}

// Singleton instance
export const claudeNexus = new ClaudeNexusService();
export default claudeNexus;
```

**Tasks:**
- [ ] Implement ClaudeNexusService class
- [ ] Build business context aggregation
- [ ] Create response parsing logic
- [ ] Add conversation memory management
- [ ] Write unit tests

**Test Plan:**
```javascript
// Test cases
describe('ClaudeNexusService', () => {
  it('should build business context with all data sources', async () => {
    const context = await claudeNexus.buildBusinessContext([1, 2, 3]);
    expect(context).toHaveProperty('branches');
    expect(context).toHaveProperty('performance');
    expect(context).toHaveProperty('insights');
  });

  it('should maintain conversation history', async () => {
    await claudeNexus.chat('user1', 'Hello');
    await claudeNexus.chat('user1', 'How are sales?');
    const history = claudeNexus.conversationHistory.get('user1');
    expect(history).toHaveLength(4); // 2 user + 2 assistant
  });

  it('should extract action items from response', () => {
    const text = 'I recommend: 1. Increase prices 2. Train staff';
    const actions = claudeNexus.extractActionItems(text);
    expect(actions).toHaveLength(2);
  });
});
```

**Deliverable:** Fully functional Claude Nexus API service

---

#### **Day 5: Testing & Refinement**

- [ ] Test API integration end-to-end
- [ ] Validate context building with real data
- [ ] Test conversation memory
- [ ] Performance profiling
- [ ] Error handling improvements

---

### **Week 2: Conversational UI**

#### **Day 1-2: Chat Component**

**File:** `src/components/Intelligence/ClaudeNexusChat.jsx`

See architecture doc for implementation details.

**Tasks:**
- [ ] Create chat UI component
- [ ] Implement message rendering
- [ ] Add typing indicator
- [ ] Handle user input
- [ ] Display suggestions
- [ ] Add message actions (copy, regenerate)

---

#### **Day 3-4: Visualization Integration**

**File:** `src/components/Intelligence/InsightVisualizations.jsx`

```javascript
/**
 * Dynamic visualization component
 * Renders charts based on AI suggestions
 */

import { LineChart, BarChart, PieChart } from 'recharts';
import { useEffect, useState } from 'react';

export default function InsightVisualizations({ suggestions, branchIds }) {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Fetch data for each suggested visualization
    suggestions.forEach(async (viz) => {
      const data = await fetchChartData(viz, branchIds);
      setChartData(prev => ({ ...prev, [viz.title]: data }));
    });
  }, [suggestions, branchIds]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {suggestions.map((viz, idx) => (
        <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="font-semibold mb-3">{viz.title}</h4>
          {renderChart(viz, chartData[viz.title])}
        </div>
      ))}
    </div>
  );
}
```

**Tasks:**
- [ ] Create visualization component
- [ ] Implement dynamic chart rendering
- [ ] Add data fetching logic
- [ ] Style charts to match design system
- [ ] Add interactivity (tooltips, clicks)

---

#### **Day 5: Integration & Testing**

- [ ] Integrate chat into dashboard
- [ ] Add to navigation/sidebar
- [ ] Test full user flow
- [ ] Performance optimization
- [ ] User acceptance testing

---

### **Week 2 Deliverables:**
✅ Functional conversational AI interface
✅ Natural language query support
✅ Dynamic visualization generation
✅ Conversation memory and context
✅ User-tested and polished

---

## Phase 2: Real-time Intelligence
### **Weeks 3-4 | Sprint 2**

#### **Goals**
- Implement Supabase realtime subscriptions
- Build event stream processing
- Create real-time anomaly detection
- Develop notification system

---

### **Week 3: Event Streaming**

#### **Day 1-2: Supabase Realtime Setup**

**File:** `src/services/realtimeIntelligence.js`

See architecture doc for implementation.

**Tasks:**
- [ ] Set up Supabase realtime channels
- [ ] Configure PostgreSQL triggers
- [ ] Create event handlers
- [ ] Build event buffer system
- [ ] Implement batch processing

---

#### **Day 3-5: Anomaly Detection**

**File:** `src/lib/realtimeAnomalyDetection.js`

```javascript
/**
 * Real-time anomaly detection
 * Identifies unusual patterns as they occur
 */

export class RealtimeAnomalyDetector {
  constructor() {
    this.baseline = new Map(); // branch -> baseline metrics
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
  }

  async initialize(branchIds) {
    // Build baseline from historical data
    for (const branchId of branchIds) {
      const baseline = await this.buildBaseline(branchId);
      this.baseline.set(branchId, baseline);
    }
  }

  async buildBaseline(branchId) {
    // Get last 30 days of data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data } = await supabase
      .from('performance_entries')
      .select('*')
      .eq('branch_id', branchId)
      .gte('date', thirtyDaysAgo.toISOString());

    // Calculate statistical baseline
    return {
      hourlyRevenue: this.calculateHourlyBaseline(data),
      orderVolume: this.calculateOrderBaseline(data),
      aov: this.calculateAOVBaseline(data)
    };
  }

  detectAnomaly(event, branchId) {
    const baseline = this.baseline.get(branchId);
    if (!baseline) return null;

    const hour = new Date(event.timestamp).getHours();
    const dayOfWeek = new Date(event.timestamp).getDay();

    // Check revenue anomaly
    const expectedRevenue = baseline.hourlyRevenue[dayOfWeek][hour];
    const actualRevenue = event.revenue;
    const revenueDeviation = Math.abs(actualRevenue - expectedRevenue.mean) /
                              expectedRevenue.stdDev;

    if (revenueDeviation > 2.5) { // 2.5 standard deviations
      return {
        type: 'revenue_anomaly',
        severity: revenueDeviation > 3 ? 'critical' : 'warning',
        metric: 'revenue',
        expected: expectedRevenue.mean,
        actual: actualRevenue,
        deviation: revenueDeviation,
        timestamp: event.timestamp
      };
    }

    return null;
  }
}
```

---

### **Week 4: Notification & UI**

#### **Day 1-3: Real-time Notification System**

- [ ] Create notification service
- [ ] Implement toast notifications
- [ ] Add notification center
- [ ] Configure notification preferences
- [ ] Add sound/vibration alerts

---

#### **Day 4-5: Dashboard Integration**

- [ ] Add real-time insight widgets
- [ ] Implement live metric updates
- [ ] Create alert banners
- [ ] Test websocket stability
- [ ] Performance optimization

---

## Phase 3: Delivery App Integrations
### **Weeks 5-6 | Sprint 3**

#### **Goals**
- Integrate DoorDash API
- Integrate Uber Eats API
- Build unified delivery dashboard
- Create channel performance analytics

---

### **Week 5: DoorDash Integration**

See architecture doc for detailed implementation.

**Tasks:**
- [ ] DoorDash API authentication
- [ ] Order sync service
- [ ] Webhook handlers
- [ ] Data normalization
- [ ] Error handling & retries
- [ ] Rate limiting

---

### **Week 6: Uber Eats & Dashboard**

**Tasks:**
- [ ] Uber Eats API integration
- [ ] Unified delivery dashboard
- [ ] Channel comparison analytics
- [ ] Commission tracking
- [ ] Performance insights
- [ ] Platform recommendations

---

## Phase 4: Living Reports
### **Weeks 7-8 | Sprint 4**

See architecture doc for detailed implementation.

**Tasks:**
- [ ] AI narrative generation
- [ ] PDF report builder
- [ ] Chart generation
- [ ] Automated scheduling
- [ ] Email delivery
- [ ] Report library UI

---

## Phase 5: Polish & Launch
### **Weeks 9-10 | Sprint 5**

**Tasks:**
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing (10+ users)
- [ ] Documentation (user guides)
- [ ] API documentation
- [ ] Launch marketing materials
- [ ] Monitoring & analytics setup
- [ ] Launch 🚀

---

## Development Workflow

### **Daily Standup (Async)**
- What did I accomplish yesterday?
- What will I work on today?
- Any blockers?

### **Weekly Review**
- Demo working features
- Review metrics (velocity, quality)
- Plan next week
- Adjust roadmap if needed

### **Testing Strategy**
- Unit tests for all services
- Integration tests for API flows
- E2E tests for critical user journeys
- Manual testing for UX
- Performance testing for real-time features

### **Code Quality**
- ESLint for code consistency
- Prettier for formatting
- Code review (if team)
- Documentation for complex logic

---

## Success Criteria

### **Sprint 1:**
✅ Can ask Claude Nexus a question and get intelligent response
✅ Context includes real business data
✅ Conversation memory works
✅ UI is polished and performant

### **Sprint 2:**
✅ Real-time events trigger insights within 30 seconds
✅ Anomalies detected accurately (>85% precision)
✅ Notifications are actionable
✅ System handles 1000+ events/hour

### **Sprint 3:**
✅ DoorDash orders sync automatically
✅ Uber Eats integration working
✅ Unified dashboard shows all channels
✅ Commission calculations accurate

### **Sprint 4:**
✅ AI reports read like human-written narratives
✅ PDFs are professional and branded
✅ Automated report scheduling works
✅ Reports generate in <30 seconds

### **Sprint 5:**
✅ No critical bugs
✅ Performance meets targets
✅ 10+ users have tested successfully
✅ Documentation complete
✅ Ready for production launch

---

## Risk Mitigation

### **Risk:** Claude API rate limits
**Mitigation:**
- Implement request queuing
- Add caching layer
- Use streaming for long responses
- Monitor usage proactively

### **Risk:** Supabase realtime instability
**Mitigation:**
- Implement reconnection logic
- Add fallback polling
- Buffer events locally
- Monitor connection health

### **Risk:** Delivery API changes
**Mitigation:**
- Version adapter interfaces
- Abstract platform specifics
- Monitor API changelogs
- Build error recovery

### **Risk:** Report generation performance
**Mitigation:**
- Generate reports async
- Cache chart data
- Optimize queries
- Use worker threads

---

**This is not just an implementation plan. It's a commitment to excellence.**

Let's build Claude Nexus. Let's build the future of restaurant intelligence.
