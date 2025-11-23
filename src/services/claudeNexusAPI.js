/**
 * Claude Nexus API Service
 * Proof of Concept - Restaurant Intelligence Core
 *
 * This service integrates Claude AI with restaurant business data
 * to provide conversational analytics and intelligent insights.
 */

import { supabase } from '@/lib/supabase';
import logger from '@/lib/logger';

class ClaudeNexusService {
  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-5-sonnet-20241022';

    // Conversation memory (in-memory for POC, could use localStorage)
    this.conversationHistory = new Map(); // userId -> messages[]

    // Business context cache (5 minute TTL)
    this.contextCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000;
  }

  /**
   * Main chat interface - Ask Claude about your restaurant business
   *
   * @param {string} userId - Current user ID
   * @param {string} message - User's question
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} AI response with insights
   */
  async chat(userId, message, options = {}) {
    try {
      if (!this.apiKey || this.apiKey === 'your-anthropic-api-key') {
        throw new Error('Please set VITE_ANTHROPIC_API_KEY in your .env.local file');
      }

      logger.info('Claude Nexus: Processing chat request', { userId, message });

      // Build comprehensive business context
      const context = await this.getBusinessContext(userId, options.branchIds);

      // Get conversation history
      const history = this.conversationHistory.get(userId) || [];

      // Build system prompt with business intelligence
      const systemPrompt = this.buildSystemPrompt(context);

      // Prepare messages for Claude
      const messages = [
        ...history.slice(-10), // Keep last 10 for context
        {
          role: 'user',
          content: message
        }
      ];

      // Call Claude API
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4096,
          temperature: 0.7,
          system: systemPrompt,
          messages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Claude API Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const assistantMessage = data.content[0].text;

      // Update conversation history
      history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      );
      this.conversationHistory.set(userId, history);

      // Parse response into structured format
      const structured = this.parseResponse(assistantMessage, context);

      logger.info('Claude Nexus: Response generated', {
        userId,
        tokens: data.usage,
        insights: structured.insights.length
      });

      return {
        success: true,
        ...structured,
        usage: data.usage
      };

    } catch (error) {
      logger.error('Claude Nexus: Chat error', error);
      return {
        success: false,
        error: error.message,
        narrative: "I apologize, but I encountered an error processing your request. Please try again or check your API configuration."
      };
    }
  }

  /**
   * Get or build business context from cache
   */
  async getBusinessContext(userId, branchIds) {
    const cacheKey = `${userId}-${branchIds?.join(',') || 'all'}`;

    // Check cache
    const cached = this.contextCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      logger.info('Claude Nexus: Using cached context');
      return cached.context;
    }

    // Build fresh context
    logger.info('Claude Nexus: Building fresh business context');
    const context = await this.buildBusinessContext(branchIds);

    // Cache it
    this.contextCache.set(cacheKey, {
      context,
      timestamp: Date.now()
    });

    return context;
  }

  /**
   * Gather comprehensive business data for AI context
   */
  async buildBusinessContext(branchIds) {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
      // Fetch data in parallel for speed
      const [branches, weekOrders, monthOrders, insights] = await Promise.all([
        this.getBranches(branchIds),
        this.getOrders(branchIds, lastWeek, now),
        this.getOrders(branchIds, lastMonth, now),
        this.getInsights(branchIds)
      ]);

      // Calculate metrics
      const weekMetrics = this.calculateMetrics(weekOrders);
      const monthMetrics = this.calculateMetrics(monthOrders);
      const trends = this.calculateTrends(weekMetrics, monthMetrics);

      return {
        currentDate: now.toISOString(),
        timeframe: {
          lastWeek: { start: lastWeek.toISOString(), end: now.toISOString() },
          lastMonth: { start: lastMonth.toISOString(), end: now.toISOString() }
        },
        branches: branches || [],
        performance: {
          lastWeek: weekMetrics,
          lastMonth: monthMetrics,
          trends
        },
        insights: (insights || []).slice(0, 5).map(i => ({
          type: i.type,
          message: i.message,
          severity: i.severity,
          confidence: i.confidence
        })),
        ordersCount: {
          week: weekOrders?.length || 0,
          month: monthOrders?.length || 0
        }
      };
    } catch (error) {
      logger.error('Claude Nexus: Error building context', error);
      // Return minimal context on error
      return {
        currentDate: now.toISOString(),
        branches: [],
        performance: { lastWeek: {}, lastMonth: {}, trends: {} },
        insights: [],
        error: 'Limited context due to data fetch error'
      };
    }
  }

  /**
   * Build system prompt with business intelligence context
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
- Professional yet conversational and warm
- Data-driven but humanistic
- Proactive with actionable insights
- Optimistic but realistic
- Clear and concise communicator

**Current Business Context:**
${JSON.stringify(context, null, 2)}

**Guidelines:**
1. Always ground insights in the actual data provided above
2. Use specific numbers, percentages, and dates
3. Compare current performance to historical baselines
4. Provide actionable recommendations, not just observations
5. Explain "why" things are happening, not just "what"
6. Consider multiple branches when analyzing
7. Think about both immediate and strategic impacts
8. Be honest about data limitations and uncertainty
9. End responses with 2-3 relevant follow-up questions

**Response Format:**
Structure your responses as:
1. **Direct Answer** - Clearly answer the question
2. **Key Insights** - Most important findings (2-3 bullet points)
3. **Analysis** - Explain the underlying patterns
4. **Recommendations** - Specific actions to take
5. **Follow-up Questions** - Deepen the conversation

**Example Response Style:**
"Last week generated $52,400 in revenue across 3 branches, up 12% from the previous week.

**Key Insights:**
• Branch A is your star performer at $28,800 (+15%)
• Branch C is struggling at $18,200 (-15%)
• Weekend performance is exceptionally strong (+22%)

Branch C's decline correlates with kitchen staff turnover and increased ticket times. Customer reviews mention 'slow service' 23 times this week.

**Recommended Actions:**
1. Deploy experienced staff from Branch A to support Branch C
2. Simplify Branch C menu temporarily to reduce kitchen complexity
3. Implement expeditor role during peak hours

Based on similar interventions in Q1, you can expect 60-75% recovery within 2 weeks.

What would you like to explore?
• Analyze Branch C's staffing patterns in detail?
• Review Branch A's success factors to replicate?
• Examine weekend performance drivers?"

Remember: Be insightful, actionable, and conversational. You're a trusted advisor.`;
  }

  /**
   * Parse Claude's response into structured components
   */
  parseResponse(text, context) {
    return {
      narrative: text,
      insights: this.extractInsights(text),
      actions: this.extractActionItems(text),
      followUps: this.extractFollowUpQuestions(text),
      visualizations: this.suggestVisualizations(text, context)
    };
  }

  /**
   * Extract key insights from response
   */
  extractInsights(text) {
    const insights = [];

    // Look for bullet points or numbered insights
    const bulletPattern = /^[•\-\*]\s*(.+)$/gm;
    const matches = text.matchAll(bulletPattern);

    for (const match of matches) {
      const insight = match[1].trim();
      if (insight.length > 10 && insight.length < 200) {
        insights.push(insight);
      }
    }

    return insights.slice(0, 5);
  }

  /**
   * Extract actionable recommendations
   */
  extractActionItems(text) {
    const actions = [];

    // Look for numbered actions or recommendations
    const numberedPattern = /^\d+\.\s+(.+)$/gm;
    const matches = text.matchAll(numberedPattern);

    for (const match of matches) {
      const action = match[1].trim();
      if (action.length > 10) {
        actions.push({
          text: action,
          priority: 'medium'
        });
      }
    }

    return actions.slice(0, 5);
  }

  /**
   * Extract follow-up questions
   */
  extractFollowUpQuestions(text) {
    const questions = [];

    // Look for questions at the end
    const questionPattern = /[•\-\*]\s*([^?]+\?)/g;
    const matches = text.matchAll(questionPattern);

    for (const match of matches) {
      questions.push(match[1].trim());
    }

    return questions.slice(0, 3);
  }

  /**
   * Suggest relevant visualizations based on conversation
   */
  suggestVisualizations(text, context) {
    const visualizations = [];

    // Revenue trend
    if (/revenue.*trend|trend.*revenue|revenue.*week|revenue.*month/i.test(text)) {
      visualizations.push({
        type: 'line',
        title: 'Revenue Trend',
        metric: 'revenue',
        timeRange: 'last30days'
      });
    }

    // Branch comparison
    if (/branch.*compar|compar.*branch|branch.*performance/i.test(text) &&
        context.branches?.length > 1) {
      visualizations.push({
        type: 'bar',
        title: 'Branch Performance Comparison',
        metric: 'revenue',
        groupBy: 'branch'
      });
    }

    // Orders
    if (/order.*trend|order.*volume/i.test(text)) {
      visualizations.push({
        type: 'line',
        title: 'Order Volume',
        metric: 'orders',
        timeRange: 'last7days'
      });
    }

    return visualizations;
  }

  // ============================================================================
  // Data Access Methods
  // ============================================================================

  async getBranches(branchIds) {
    try {
      let query = supabase.from('branches').select('*');

      if (branchIds && branchIds.length > 0) {
        query = query.in('id', branchIds);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching branches', error);
      return [];
    }
  }

  async getOrders(branchIds, startDate, endDate) {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (branchIds && branchIds.length > 0) {
        query = query.in('branch_id', branchIds);
      }

      const { data, error } = await query.limit(1000);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching orders', error);
      return [];
    }
  }

  async getInsights(branchIds) {
    try {
      let query = supabase
        .from('insights')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (branchIds && branchIds.length > 0) {
        query = query.in('branch_id', branchIds);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching insights', error);
      return [];
    }
  }

  // ============================================================================
  // Metric Calculations
  // ============================================================================

  calculateMetrics(orders) {
    if (!orders || orders.length === 0) {
      return {
        revenue: 0,
        orders: 0,
        customers: 0,
        aov: 0
      };
    }

    const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const orderCount = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.customer_id).filter(Boolean)).size;

    return {
      revenue: Math.round(revenue * 100) / 100,
      orders: orderCount,
      customers: uniqueCustomers || orderCount, // Fallback if no customer IDs
      aov: orderCount > 0 ? Math.round((revenue / orderCount) * 100) / 100 : 0
    };
  }

  calculateTrends(recent, older) {
    const calculate = (recentVal, olderVal) => {
      if (!olderVal || olderVal === 0) return 0;
      return Math.round(((recentVal - olderVal) / olderVal) * 10000) / 100;
    };

    return {
      revenue: calculate(recent.revenue, older.revenue),
      orders: calculate(recent.orders, older.orders),
      aov: calculate(recent.aov, older.aov),
      customers: calculate(recent.customers, older.customers)
    };
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Clear conversation history for a user
   */
  clearHistory(userId) {
    this.conversationHistory.delete(userId);
    logger.info('Claude Nexus: Conversation history cleared', { userId });
  }

  /**
   * Check if API is configured
   */
  isConfigured() {
    return !!(this.apiKey && this.apiKey !== 'your-anthropic-api-key');
  }
}

// Export singleton instance
export const claudeNexus = new ClaudeNexusService();
export default claudeNexus;
