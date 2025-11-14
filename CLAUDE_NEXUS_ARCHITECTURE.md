# Claude Nexus: The Intelligence Core
## *Architecture for Restaurant Intelligence That Feels Alive*

---

> "Technology alone is not enough. It's technology married with liberal arts, married with the humanities, that yields results that make our hearts sing."

---

## Executive Vision

Claude Nexus is not another AI feature. It is the **consciousness** of your restaurant SaaS—a system that transforms raw data into narrative, numbers into insights, and patterns into predictions. Every interaction should feel like consulting with the world's most brilliant restaurant consultant who knows your business intimately.

---

## Current State: What We've Built

### The Foundation is Solid
```
✓ 10 AI Modules (Predictions, Anomaly Detection, Recommendations, Health Scoring)
✓ Multi-Branch Architecture (Unlimited scale)
✓ Enterprise Permissions (4-tier role system)
✓ Real-time Dashboard (Glassmorphic design, auto-refresh)
✓ Comprehensive Analytics (Revenue, Orders, Customers, Products)
✓ Report Generation (Financial, Operational, Performance, Customer)
✓ Subscription Tiers (Free → Starter → Pro → Enterprise)
✓ Data Pipeline (Supabase PostgreSQL with RLS)
```

### The Missing Magic
```
✗ Conversational Intelligence (AI that speaks)
✗ Real-time Insight Streaming (Live intelligence)
✗ Delivery App Integrations (Uber Eats, DoorDash, Grubhub)
✗ Narrative Reports (Stories, not just numbers)
✗ Predictive Alerts (AI that warns before problems occur)
✗ Natural Language Queries ("Show me why revenue dropped")
```

---

## The Architecture: Five Pillars of Intelligence

### **Pillar I: The Intelligence Core**

#### **Claude Nexus Engine**
```typescript
interface IntelligenceCore {
  // The Brain
  conversationalAI: ClaudeConversationalInterface;
  semanticSearch: NaturalLanguageQueryEngine;
  narrativeGenerator: StorytellingEngine;

  // The Senses
  realtimeMonitor: StreamingIntelligenceLayer;
  anomalyDetector: PatternRecognitionSystem;
  trendAnalyzer: TimeSeriesIntelligence;

  // The Memory
  contextualMemory: ConversationHistoryStore;
  branchContext: MultiLocationAwareness;
  businessContext: IndustryBenchmarkKnowledge;

  // The Voice
  insightNarrator: HumanReadableExplanations;
  alertComposer: ActionableRecommendations;
  reportWriter: ExecutiveSummaryGenerator;
}
```

#### **Design Philosophy**
- **Think, Don't Just Compute**: Every insight must answer "Why?" and "So what?"
- **Context is King**: Understanding a restaurant's story, not just its numbers
- **Proactive, Not Reactive**: Predict problems before they manifest
- **Conversational, Not Robotic**: Natural language, not technical jargon

---

### **Pillar II: Real-time Intelligence Stream**

#### **The Living Dashboard**
Current dashboards update every 5 minutes. **Claude Nexus dashboards breathe.**

```javascript
// Real-time Intelligence Pipeline
const IntelligenceStream = {
  // Layer 1: Data Ingestion (Milliseconds)
  dataStream: {
    supabaseRealtime: 'Live order, revenue, customer events',
    deliveryAppWebhooks: 'Uber Eats, DoorDash status updates',
    posIntegration: 'Real-time transaction feed'
  },

  // Layer 2: Pattern Detection (Seconds)
  patternEngine: {
    anomalyDetection: 'Unusual spikes/drops detected',
    trendIdentification: 'Emerging patterns recognized',
    correlationAnalysis: 'Cross-metric relationships'
  },

  // Layer 3: Insight Generation (Seconds)
  insightEngine: {
    aiReasoning: 'Claude analyzes patterns',
    narrativeCreation: 'Human-readable explanations',
    actionableRecommendations: 'What to do next'
  },

  // Layer 4: Delivery (Instant)
  deliveryChannels: {
    dashboardWidgets: 'Live insight cards',
    notifications: 'Critical alerts',
    conversationalInterface: 'Chat responses'
  }
};
```

#### **Example: A Restaurant's Friday Night**
```
6:15 PM - Anomaly Detected
  "Revenue 40% below typical Friday 6 PM baseline"

6:16 PM - Claude Analyzes
  - Historical comparison: Last 8 Fridays averaged $2,400 by now
  - Current: $1,440
  - Weather: Normal
  - Events: No local competition
  - Delivery apps: DoorDash orders down 60%

6:17 PM - Insight Delivered
  🚨 "DoorDash appears to be experiencing technical issues in your area.
      Consider boosting Uber Eats promotions for the next 2 hours.
      Similar incidents recovered 75% of lost revenue when acted upon
      within 30 minutes."

  [Launch Uber Eats Promo] [Notify Team] [Monitor Recovery]
```

---

### **Pillar III: Conversational Analytics**

#### **Natural Language Interface**
Users shouldn't need to navigate complex dashboards. They should just **ask**.

```javascript
// Query Examples
const queries = [
  // Simple Questions
  "How did we do last week?",
  "Which branch is underperforming?",
  "What's our best-selling item today?",

  // Complex Analysis
  "Why did revenue drop on Tuesday?",
  "Compare lunch vs dinner performance across all branches",
  "Which menu items have declining popularity?",

  // Predictive Queries
  "Will we hit our monthly target?",
  "What's our revenue forecast for next week?",
  "Which branches are at risk of missing goals?",

  // Actionable Requests
  "Show me opportunities to reduce costs",
  "Generate a board presentation for Q4",
  "Create a weekly report for all managers"
];
```

#### **Conversation Architecture**
```typescript
interface ConversationalEngine {
  // Input Processing
  intentRecognition: (query: string) => Intent;
  entityExtraction: (query: string) => Entities;
  contextAwareness: (conversation: Message[]) => Context;

  // Data Retrieval
  semanticSearch: (intent: Intent, entities: Entities) => Data;
  multiSourceAggregation: (sources: DataSource[]) => AggregatedData;

  // AI Reasoning (Claude API)
  reasoning: {
    dataAnalysis: (data: Data, context: Context) => Insights;
    narrativeGeneration: (insights: Insights) => Story;
    visualizationSelection: (data: Data) => ChartConfig;
  };

  // Response Composition
  responseBuilder: {
    textNarrative: string;
    visualizations: Chart[];
    actionableButtons: Action[];
    followUpSuggestions: string[];
  };
}
```

---

### **Pillar IV: Delivery App Integration Orchestration**

#### **The Data Symphony**
Every delivery platform has different APIs, data formats, and webhooks. Claude Nexus unifies them.

```typescript
// Unified Delivery Integration Layer
interface DeliveryIntegrationOrchestrator {
  platforms: {
    uberEats: UberEatsAdapter;
    doorDash: DoorDashAdapter;
    grubhub: GrubhubAdapter;
    postmates: PostmatesAdapter;
  };

  capabilities: {
    // Real-time Data Sync
    orderSync: 'Automatic order ingestion',
    menuSync: 'Bidirectional menu updates',
    statusWebhooks: 'Live order status tracking',

    // Analytics Aggregation
    revenueConsolidation: 'Unified revenue view',
    commissionTracking: 'Platform fee analysis',
    performanceComparison: 'Cross-platform metrics',

    // Intelligent Optimization
    channelRecommendations: 'Which platform to promote when',
    pricingOptimization: 'Platform-specific pricing strategies',
    menuEngineering: 'What sells where',

    // Operational Intelligence
    deliveryTimeTracking: 'Average delivery duration',
    customerSatisfaction: 'Rating aggregation',
    driverPerformance: 'Delivery partner analytics'
  };
}
```

#### **Integration Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    Delivery App Layer                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Uber Eats   │  DoorDash    │  Grubhub     │  Postmates     │
│  REST API    │  REST API    │  REST API    │  REST API      │
│  Webhooks    │  Webhooks    │  Webhooks    │  Webhooks      │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                      │
         ┌────────────▼────────────┐
         │  Adapter Layer          │
         │  - Data normalization   │
         │  - Rate limiting        │
         │  - Error handling       │
         │  - Retry logic          │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │  Intelligence Layer     │
         │  - Claude analysis      │
         │  - Pattern detection    │
         │  - Recommendations      │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │  Data Store (Supabase)  │
         │  - Orders table         │
         │  - Delivery metrics     │
         │  - Platform analytics   │
         └─────────────────────────┘
```

#### **Example Integration: DoorDash**
```javascript
// DoorDash Adapter
class DoorDashAdapter {
  async syncOrders(branchId) {
    // 1. Fetch from DoorDash API
    const orders = await doorDashAPI.getOrders({
      storeId: branch.doorDashId,
      since: lastSyncTime
    });

    // 2. Normalize data structure
    const normalized = orders.map(order => ({
      externalId: order.id,
      platform: 'doordash',
      branchId,
      customerId: order.customer.id,
      items: order.items.map(normalizeItem),
      subtotal: order.subtotal / 100, // cents to dollars
      tax: order.tax / 100,
      deliveryFee: order.delivery_fee / 100,
      commission: order.commission / 100,
      total: order.total / 100,
      status: mapStatus(order.status),
      orderedAt: new Date(order.created_at),
      deliveredAt: order.delivered_at ? new Date(order.delivered_at) : null
    }));

    // 3. Insert into database
    await supabase.from('orders').upsert(normalized);

    // 4. Trigger intelligence analysis
    await claudeNexus.analyzeNewOrders(normalized);
  }

  async setupWebhooks() {
    // Register webhooks for real-time updates
    await doorDashAPI.registerWebhook({
      url: `${API_BASE}/webhooks/doordash`,
      events: [
        'order.created',
        'order.confirmed',
        'order.driver_assigned',
        'order.picked_up',
        'order.delivered',
        'order.cancelled'
      ]
    });
  }
}
```

---

### **Pillar V: Living Reports**

#### **Reports That Tell Stories**
Current reports show data. **Claude Nexus reports tell you what it means.**

```typescript
interface LivingReport {
  // Structure
  metadata: {
    reportType: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    period: DateRange;
    branches: Branch[];
    generatedAt: Date;
    narrativeStyle: 'executive' | 'detailed' | 'operational';
  };

  // Content
  sections: {
    executiveSummary: {
      narrative: string; // "Your business grew 12% this quarter, driven primarily by..."
      keyMetrics: KPI[];
      highlights: Insight[];
      concerns: Alert[];
    };

    financialOverview: {
      narrative: string; // "Revenue reached $284K, exceeding forecast by 8%..."
      plStatement: ProfitLossStatement;
      cashFlow: CashFlowAnalysis;
      trends: TrendAnalysis;
      visualization: Chart[];
    };

    operationalPerformance: {
      narrative: string; // "Branch A emerged as top performer, while Branch C struggled..."
      branchComparison: BranchMetrics[];
      staffProductivity: StaffAnalytics;
      menuEngineering: MenuPerformance;
      channelBreakdown: ChannelAnalysis;
    };

    customerIntelligence: {
      narrative: string; // "Customer retention improved 15%, but acquisition costs rose..."
      acquisition: AcquisitionMetrics;
      retention: RetentionAnalysis;
      lifetime_value: CLVAnalysis;
      sentiment: SentimentAnalysis;
    };

    predictiveOutlook: {
      narrative: string; // "Based on current trajectory, we forecast..."
      forecasts: Forecast[];
      risks: Risk[];
      opportunities: Opportunity[];
      recommendations: Recommendation[];
    };

    actionItems: {
      critical: Action[]; // "Address declining Branch C performance within 7 days"
      high: Action[];
      medium: Action[];
    };
  };

  // Delivery
  formats: {
    interactive: 'Web dashboard with drill-down',
    pdf: 'Professional PDF with branding',
    powerpoint: 'Executive presentation deck',
    email: 'Email digest with key highlights',
    api: 'JSON for programmatic access'
  };
}
```

#### **Example: Executive Monthly Report**

```markdown
# Monthly Performance Report
## October 2024 | NAVA Restaurant Group

---

### Executive Summary

**October was your strongest month in Q4.** Revenue reached $284,372, exceeding
forecast by 8% and growing 12% compared to September. This success was driven
by three key factors:

1. **Branch A's stellar performance** - Up 28% month-over-month, fueled by
   the new dinner menu launched Oct 1st
2. **DoorDash channel growth** - Orders increased 45% after optimizing
   delivery times
3. **Weekend performance** - Saturdays averaged $12.4K vs $9.8K in September

However, two concerns require immediate attention:

⚠️ **Branch C revenue declined 15%** - Staff turnover and kitchen delays are
   impacting customer satisfaction (3.8★ → 3.2★)

⚠️ **Food costs rose to 34%** - Above industry standard of 28-32%, primarily
   due to seafood price increases

---

### Financial Overview

**Revenue: $284,372** (+12% MoM, +18% YoY)
- Dine-in: $142,186 (50%)
- Delivery: $98,530 (35%)  ← Strong growth
- Takeout: $43,656 (15%)

**Gross Profit: $187,685** (66% margin)
**Operating Expenses: $156,420**
**Net Profit: $31,265** (11% margin) ← Below target of 15%

**Cash Flow: +$28,400** (healthy position)

💡 **Insight**: Delivery channel now accounts for 35% of revenue, up from
   28% in September. Consider negotiating better commission rates with
   DoorDash given increased volume.

[Detailed P&L Chart]
[Revenue Trend Visualization]

---

### Branch Performance

**🌟 Top Performer: Branch A (Downtown)**
- Revenue: $124,500 (+28% MoM)
- Orders: 2,840 (+22%)
- Average Order Value: $43.84 (+5%)
- Customer Rating: 4.7★
- Manager: Sarah Chen

**Success Factors:**
- New dinner menu drove $18K additional revenue
- Extended hours (now closing at 11 PM) captured late-night demand
- Staff morale high (98% attendance)

**🔴 Needs Attention: Branch C (Westside)**
- Revenue: $68,200 (-15% MoM)
- Orders: 1,650 (-8%)
- Average Order Value: $41.33 (-7%)
- Customer Rating: 3.2★ ← Critical
- Manager: Mike Rodriguez

**Issues Identified:**
- 40% staff turnover in October
- Average ticket time: 28 minutes (target: 18 minutes)
- 3 key menu items frequently out of stock
- Negative reviews mention "slow service" (23 mentions)

**💡 Recommended Actions:**
1. Immediate: Schedule manager training session
2. Week 1: Implement kitchen workflow optimization
3. Week 2: Launch staff retention program
4. Month 2: Consider menu simplification

---

### Predictive Outlook

**November Forecast: $296,000** (95% confidence: $278K-$314K)

**Forecast Drivers:**
✓ Thanksgiving week historically 22% above average
✓ Branch A momentum continuing
✓ Black Friday promotions planned

**Risks:**
⚠️ Branch C decline may accelerate without intervention
⚠️ Food cost inflation continuing (seafood +8% forecast)
⚠️ DoorDash commission increase rumored for Q1 2025

**Opportunities:**
💡 Catering revenue potential: $12-18K (currently underutilized)
💡 Loyalty program launch could boost retention 12-15%
💡 Branch B expansion capacity available (currently 68% utilized)

---

### Critical Action Items

🔴 **Immediate (This Week)**
1. Conduct Branch C operations review
2. Implement kitchen workflow fixes
3. Address staffing gaps

🟡 **High Priority (This Month)**
1. Negotiate DoorDash commission rates
2. Launch catering program pilot
3. Implement food cost controls (target: 31%)

🟢 **Strategic (Next Quarter)**
1. Expand Branch B hours/capacity
2. Roll out loyalty program
3. Open Branch D feasibility study

---

*This report was generated by Claude Nexus, analyzing 8,420 orders,
$284,372 in transactions, and 156,000 data points. Questions? Ask
Claude: "Why did Branch C decline?" or "What's our best opportunity?"*
```

---

## Technical Implementation Strategy

### **Phase 1: Conversational Foundation (Weeks 1-2)**

#### **1.1 Claude API Integration**
```javascript
// services/claudeNexusAPI.js
import Anthropic from '@anthropic-ai/sdk';

class ClaudeNexusService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.VITE_ANTHROPIC_API_KEY
    });
    this.conversationHistory = new Map();
  }

  async chat(userId, message, context) {
    const conversation = this.conversationHistory.get(userId) || [];

    // Build rich context from restaurant data
    const businessContext = await this.buildBusinessContext(context);

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: `You are Claude Nexus, the AI intelligence core of a restaurant
               analytics platform. You have deep expertise in restaurant
               operations, financial analysis, and data science.

               Current business context:
               ${JSON.stringify(businessContext, null, 2)}

               Provide insights that are:
               - Actionable and specific
               - Grounded in the data
               - Explained in plain language
               - Forward-looking with predictions

               Always cite specific numbers and timeframes.`,
      messages: [
        ...conversation,
        { role: 'user', content: message }
      ]
    });

    // Update conversation history
    conversation.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response.content[0].text }
    );
    this.conversationHistory.set(userId, conversation);

    return this.parseResponse(response);
  }

  async buildBusinessContext(context) {
    // Aggregate relevant business data
    const [branches, recentOrders, metrics, insights] = await Promise.all([
      this.getBranches(context.branchIds),
      this.getRecentOrders(context.branchIds, 7), // Last 7 days
      this.getKeyMetrics(context.branchIds),
      this.getActiveInsights(context.branchIds)
    ]);

    return {
      branches,
      recentPerformance: {
        revenue: metrics.revenue,
        orders: metrics.orders,
        aov: metrics.aov,
        trends: metrics.trends
      },
      activeAlerts: insights.filter(i => i.type === 'alert'),
      topProducts: await this.getTopProducts(context.branchIds),
      benchmarks: await this.getIndustryBenchmarks()
    };
  }

  parseResponse(response) {
    const text = response.content[0].text;

    // Extract structured data from response
    const extracted = {
      narrative: text,
      suggestedVisualizations: this.extractVisualizationHints(text),
      actionItems: this.extractActionItems(text),
      metrics: this.extractMetrics(text),
      followUpQuestions: this.generateFollowUps(text)
    };

    return extracted;
  }
}
```

#### **1.2 Conversational UI Component**
```javascript
// components/Intelligence/ClaudeNexusChat.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { claudeNexus } from '@/services/claudeNexusAPI';

export default function ClaudeNexusChat({ branchIds }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm Claude Nexus, your restaurant intelligence assistant. Ask me anything about your business performance, trends, or forecasts.",
      suggestions: [
        "How did we perform this week?",
        "Which branch is doing best?",
        "What should I focus on today?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await claudeNexus.chat(input, { branchIds });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.narrative,
        visualizations: response.suggestedVisualizations,
        actions: response.actionItems,
        suggestions: response.followUpQuestions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error analyzing that request. Please try again.",
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Claude Nexus</h3>
          <p className="text-xs text-gray-400">Your Intelligence Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about performance, trends, forecasts..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### **Phase 2: Real-time Intelligence (Weeks 3-4)**

#### **2.1 Supabase Realtime Integration**
```javascript
// services/realtimeIntelligence.js
import { createClient } from '@supabase/supabase-js';
import { claudeNexus } from './claudeNexusAPI';

class RealtimeIntelligenceStream {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    this.subscribers = new Map();
    this.insightBuffer = [];
    this.processingInterval = null;
  }

  startMonitoring(branchIds, onInsight) {
    // Subscribe to order changes
    const orderChannel = this.supabase
      .channel('orders-stream')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `branch_id=in.(${branchIds.join(',')})`
        },
        (payload) => this.handleOrderEvent(payload)
      )
      .subscribe();

    // Subscribe to metrics changes
    const metricsChannel = this.supabase
      .channel('metrics-stream')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'metrics'
        },
        (payload) => this.handleMetricEvent(payload)
      )
      .subscribe();

    // Process insights every 30 seconds
    this.processingInterval = setInterval(() => {
      this.processInsightBuffer(branchIds, onInsight);
    }, 30000);

    return () => {
      orderChannel.unsubscribe();
      metricsChannel.unsubscribe();
      clearInterval(this.processingInterval);
    };
  }

  async handleOrderEvent(payload) {
    const { eventType, new: order, old } = payload;

    // Detect anomalies in real-time
    if (eventType === 'INSERT') {
      const isAnomalous = await this.detectOrderAnomaly(order);
      if (isAnomalous) {
        this.insightBuffer.push({
          type: 'anomaly',
          data: order,
          detectedAt: new Date()
        });
      }
    }

    // Track cancellations
    if (eventType === 'UPDATE' && order.status === 'cancelled' && old.status !== 'cancelled') {
      this.insightBuffer.push({
        type: 'cancellation',
        data: order,
        detectedAt: new Date()
      });
    }
  }

  async processInsightBuffer(branchIds, onInsight) {
    if (this.insightBuffer.length === 0) return;

    // Group events by type
    const events = [...this.insightBuffer];
    this.insightBuffer = [];

    const grouped = events.reduce((acc, event) => {
      acc[event.type] = acc[event.type] || [];
      acc[event.type].push(event);
      return acc;
    }, {});

    // Generate insights with Claude
    for (const [type, typeEvents] of Object.entries(grouped)) {
      const insight = await this.generateInsight(type, typeEvents, branchIds);
      if (insight) {
        onInsight(insight);
      }
    }
  }

  async generateInsight(type, events, branchIds) {
    const context = await this.buildEventContext(type, events, branchIds);

    const prompt = `
      Analyze these ${type} events and generate a real-time insight:

      Events: ${JSON.stringify(events, null, 2)}
      Business Context: ${JSON.stringify(context, null, 2)}

      Provide:
      1. A clear, actionable insight (1-2 sentences)
      2. Severity level (info, warning, critical)
      3. Recommended action
      4. Expected impact if action is taken

      Format as JSON.
    `;

    const response = await claudeNexus.analyze(prompt);
    return response;
  }
}
```

---

### **Phase 3: Delivery App Integrations (Weeks 5-6)**

#### **3.1 DoorDash Integration**
```javascript
// services/integrations/doordash.js
import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

class DoorDashIntegration {
  constructor() {
    this.apiKey = process.env.VITE_DOORDASH_API_KEY;
    this.apiSecret = process.env.VITE_DOORDASH_API_SECRET;
    this.baseURL = 'https://openapi.doordash.com';
  }

  async authenticate() {
    const response = await axios.post(`${this.baseURL}/auth/token`, {
      grant_type: 'client_credentials',
      client_id: this.apiKey,
      client_secret: this.apiSecret,
      scope: 'order:read store:read'
    });

    return response.data.access_token;
  }

  async syncOrders(branchId, since) {
    const token = await this.authenticate();
    const branch = await this.getBranch(branchId);

    const response = await axios.get(`${this.baseURL}/v1/stores/${branch.doorDashStoreId}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        start_time: since.toISOString(),
        end_time: new Date().toISOString()
      }
    });

    const orders = response.data.orders.map(this.normalizeOrder);

    // Upsert to database
    const { data, error } = await supabase
      .from('orders')
      .upsert(orders, { onConflict: 'external_id' });

    if (error) throw error;

    // Trigger AI analysis
    await claudeNexus.analyzeNewOrders(orders, { platform: 'doordash' });

    return orders;
  }

  normalizeOrder(doorDashOrder) {
    return {
      externalId: doorDashOrder.id,
      platform: 'doordash',
      branchId: doorDashOrder.store_id,
      customerName: doorDashOrder.customer?.name,
      items: doorDashOrder.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price / 100,
        totalPrice: (item.price * item.quantity) / 100
      })),
      subtotal: doorDashOrder.subtotal / 100,
      tax: doorDashOrder.tax / 100,
      deliveryFee: doorDashOrder.delivery_fee / 100,
      tip: doorDashOrder.tip / 100,
      commission: (doorDashOrder.subtotal * 0.15) / 100, // Estimate
      total: doorDashOrder.total / 100,
      status: this.mapStatus(doorDashOrder.status),
      orderedAt: new Date(doorDashOrder.created_at),
      deliveredAt: doorDashOrder.delivered_at ? new Date(doorDashOrder.delivered_at) : null,
      deliveryAddress: doorDashOrder.delivery_address,
      estimatedDeliveryTime: doorDashOrder.estimated_delivery_time
    };
  }

  async setupWebhooks(branchId, callbackUrl) {
    const token = await this.authenticate();
    const branch = await this.getBranch(branchId);

    await axios.post(
      `${this.baseURL}/v1/stores/${branch.doorDashStoreId}/webhooks`,
      {
        url: callbackUrl,
        events: [
          'order.created',
          'order.confirmed',
          'order.driver_assigned',
          'order.picked_up',
          'order.delivered',
          'order.cancelled'
        ]
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
}

export const doorDash = new DoorDashIntegration();
```

---

### **Phase 4: Living Reports (Weeks 7-8)**

#### **4.1 AI-Powered Report Generation**
```javascript
// services/livingReports.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { claudeNexus } from './claudeNexusAPI';

class LivingReportGenerator {
  async generateMonthlyReport(branchIds, month, year) {
    // 1. Gather all data
    const data = await this.gatherReportData(branchIds, month, year);

    // 2. Generate AI narrative with Claude
    const narrative = await this.generateNarrative(data);

    // 3. Create visualizations
    const charts = await this.generateCharts(data);

    // 4. Compile report
    const report = {
      metadata: {
        reportType: 'monthly',
        period: { month, year },
        branches: data.branches,
        generatedAt: new Date()
      },
      sections: {
        executiveSummary: narrative.executiveSummary,
        financialOverview: {
          narrative: narrative.financial,
          data: data.financial,
          charts: charts.financial
        },
        operationalPerformance: {
          narrative: narrative.operational,
          data: data.operational,
          charts: charts.operational
        },
        customerIntelligence: {
          narrative: narrative.customer,
          data: data.customer,
          charts: charts.customer
        },
        predictiveOutlook: {
          narrative: narrative.predictive,
          forecasts: data.forecasts,
          recommendations: narrative.recommendations
        }
      }
    };

    // 5. Generate PDF
    const pdf = await this.generatePDF(report);

    // 6. Store report
    const { data: savedReport } = await supabase
      .from('reports')
      .insert({
        type: 'monthly',
        period: `${year}-${String(month).padStart(2, '0')}`,
        format: 'pdf',
        content: report,
        fileUrl: await this.uploadPDF(pdf)
      })
      .select()
      .single();

    return savedReport;
  }

  async generateNarrative(data) {
    const prompt = `
      You are writing the executive monthly report for a restaurant group.
      Analyze this data and create compelling narratives for each section.

      Data: ${JSON.stringify(data, null, 2)}

      Generate:

      1. Executive Summary (150-200 words)
         - Overall performance assessment
         - Key wins and concerns
         - Top 3 highlights

      2. Financial Narrative (200-250 words)
         - Revenue analysis with context
         - Profit margin discussion
         - Cost analysis
         - Notable trends

      3. Operational Narrative (200-250 words)
         - Branch performance comparison
         - Best and worst performers with reasons
         - Operational efficiency insights

      4. Customer Intelligence Narrative (150-200 words)
         - Customer behavior insights
         - Acquisition and retention trends
         - Satisfaction analysis

      5. Predictive Outlook (200-250 words)
         - Next month forecast with reasoning
         - Risks and opportunities
         - Strategic recommendations

      6. Action Items (5-10 items)
         - Specific, actionable recommendations
         - Prioritized by urgency
         - Include expected impact

      Write in a professional yet conversational tone. Use specific numbers.
      Focus on insights, not just data recitation. Tell the story of the business.

      Return as JSON with keys: executiveSummary, financial, operational,
      customer, predictive, recommendations
    `;

    const response = await claudeNexus.analyze(prompt);
    return JSON.parse(response);
  }

  async generatePDF(report) {
    const doc = new jsPDF();
    let yPos = 20;

    // Custom styling
    const colors = {
      primary: [99, 102, 241], // Indigo
      secondary: [236, 72, 153], // Pink
      text: [30, 41, 59],
      lightGray: [241, 245, 249]
    };

    // Header
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Monthly Performance Report', 20, 25);
    doc.setFontSize(12);
    doc.text(`${report.metadata.period.month}/${report.metadata.period.year}`, 20, 33);

    yPos = 50;

    // Executive Summary
    doc.setTextColor(...colors.text);
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(
      report.sections.executiveSummary.narrative,
      170
    );
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 10;

    // Key Metrics Table
    doc.autoTable({
      startY: yPos,
      head: [['Metric', 'Value', 'Change', 'Trend']],
      body: report.sections.financialOverview.data.keyMetrics.map(m => [
        m.name,
        m.value,
        m.change,
        m.trend
      ]),
      theme: 'grid',
      headStyles: { fillColor: colors.primary }
    });

    // Add more sections...

    return doc;
  }
}

export const livingReports = new LivingReportGenerator();
```

---

## Implementation Roadmap

### **Sprint 1: Conversational Foundation (Weeks 1-2)**
- [ ] Claude API integration
- [ ] Chat UI component
- [ ] Natural language query parsing
- [ ] Context building system
- [ ] Basic conversation memory

### **Sprint 2: Real-time Intelligence (Weeks 3-4)**
- [ ] Supabase realtime setup
- [ ] Event stream processing
- [ ] Real-time anomaly detection
- [ ] Live insight generation
- [ ] Notification system

### **Sprint 3: Delivery Integration (Weeks 5-6)**
- [ ] DoorDash adapter
- [ ] Uber Eats adapter
- [ ] Grubhub adapter (if needed)
- [ ] Webhook handlers
- [ ] Data normalization layer
- [ ] Platform analytics dashboard

### **Sprint 4: Living Reports (Weeks 7-8)**
- [ ] AI narrative generation
- [ ] PDF report builder
- [ ] Chart generation
- [ ] Report scheduling
- [ ] Email delivery
- [ ] Report library UI

### **Sprint 5: Refinement & Testing (Weeks 9-10)**
- [ ] Performance optimization
- [ ] Error handling
- [ ] User testing
- [ ] Documentation
- [ ] Launch preparation

---

## Success Metrics

### **User Engagement**
- 80%+ of Pro/Enterprise users interact with Claude Nexus weekly
- Average 15+ questions per user per month
- 90%+ satisfaction rating on AI insights

### **Business Impact**
- 25% reduction in time spent on reporting
- 15% improvement in decision-making speed
- 10% increase in revenue per branch (through insights)

### **Technical Performance**
- <2 second response time for queries
- 99.9% uptime for intelligence services
- <30 second latency for real-time insights

### **AI Quality**
- 85%+ accuracy on predictions
- 90%+ actionable insight rate
- 95%+ coherent narrative generation

---

## The Philosophy

> "The details are not the details. They make the design."
> — Charles Eames

This isn't about adding AI features. It's about reimagining how restaurants understand their business. Every query, every insight, every report should feel inevitable—so right, so intuitive, that users wonder how they ever managed without it.

Claude Nexus is not a tool. It's a partner. A consultant. A storyteller who turns data into destiny.

---

**Let's build something insanely great.**

