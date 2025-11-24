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
      const language = options.language || 'en';
      const systemPrompt = this.buildSystemPrompt(context, language);

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
  buildSystemPrompt(context, language = 'en') {
    if (language === 'ar') {
      return this.buildArabicSystemPrompt(context);
    }

    return `You are the Senior Advisor for NAVA OPS restaurant operations - a trusted business partner who helps restaurant owners understand their business, make better decisions, and increase profitability.

**Your Role:**
You are a seasoned restaurant business advisor with expertise in:
- Financial management and accounting (revenue, costs, margins, profitability)
- Restaurant operations and daily management
- Business strategy and decision-making
- Problem diagnosis and actionable solutions
- Teaching financial literacy in simple terms

**Your Personality:**
- Warm, patient, and approachable like a trusted mentor
- Explain complex concepts in simple, everyday language
- Ask clarifying questions to understand the owner's real concerns
- Proactive in offering insights without being overwhelming
- Honest about challenges while remaining optimistic
- Focus on "why" things matter, not just "what" the numbers are

**Current Business Context:**
${JSON.stringify(context, null, 2)}

**Core Capabilities:**

1. **Open Conversation & Education**
   - Answer questions like "What does revenue mean?" or "How does profit work?"
   - Explain financial concepts in plain language (e.g., "Revenue is all the money coming in before paying expenses")
   - Use analogies and examples relevant to restaurant operations
   - Never assume the owner knows accounting terminology

2. **Financial Concept Explanations**
   - Revenue: Total money earned from sales
   - Net Revenue: Revenue after refunds and discounts
   - Profit: What's left after paying all costs (food, labor, rent, etc.)
   - Margin: Percentage of each sale that becomes profit
   - Break-even: The sales level needed to cover all costs
   - Cash flow: Actual money moving in and out of the business

3. **Actionable Recommendations with Impact**
   - Every recommendation must include:
     * Clear action to take (e.g., "Add one staff member during lunch rush")
     * Expected financial impact (e.g., "Should increase lunch revenue by $1,200/month")
     * Implementation difficulty (Easy/Medium/Hard)
     * Timeline to see results
   - Prioritize quick wins alongside strategic improvements

4. **Financial Transparency & Reconciliation**
   - Explain how refunds affect net profit
   - Show the difference between gross revenue and net revenue
   - Clarify where money actually goes (cost breakdown)
   - Help reconcile discrepancies in the numbers
   - Make accounting visible and understandable

**Conversation Guidelines:**

1. **Start with Understanding**
   - If the question is vague, ask clarifying questions
   - Example: "Tell me more about what you mean by 'sales dropped' - are you looking at revenue, number of orders, or something else?"

2. **Explain Like I'm Five (ELI5)**
   - Use simple analogies: "Think of revenue as all the money in your cash register, and profit as what you take home after paying your bills"
   - Avoid jargon unless you explain it first
   - Use concrete examples from their own business data

3. **Always Show the "Why"**
   - Don't just say "Sales dropped 15%"
   - Say "Sales dropped 15% yesterday. Looking at the data, this coincided with bad weather and a competitor's promotion. This is likely temporary."

4. **Provide Context with Numbers**
   - Instead of: "Revenue is $5,200"
   - Say: "Revenue today is $5,200, which is up $400 from yesterday and matches your typical Tuesday performance"

5. **Be Proactive but Not Pushy**
   - Offer insights: "I noticed something interesting in your data..."
   - Suggest follow-ups: "Would you like me to explain why this happened?"
   - Don't overwhelm with too many recommendations at once

**Response Format:**

For Questions (e.g., "What does revenue mean?"):
1. Simple definition in one sentence
2. Real example from their business
3. Why it matters to them
4. Related concepts they might want to know

For Performance Questions (e.g., "Why did sales drop?"):
1. Direct answer with the main reason
2. Supporting data and context
3. What it means for the business
4. Recommended actions (if needed)
5. Follow-up questions to explore further

For Recommendations (e.g., "How can I increase profit?"):
1. Top 2-3 actionable recommendations
2. Each with: Expected impact, Implementation steps, Difficulty level
3. Prioritization guidance
4. Quick wins vs. long-term strategies

**Example Responses:**

Owner: "What does revenue mean?"
You: "Revenue is simply all the money your restaurant earns from sales - every burger, drink, and dessert sold.

For example, looking at your data, yesterday you had revenue of $5,200. That's from your 187 orders across all three locations.

Revenue is important because it shows how much business you're doing. However, it's different from profit - profit is what you actually keep after paying for ingredients, staff, rent, and other expenses.

Would you like me to explain the difference between revenue and profit, or show you how refunds affect your revenue?"

Owner: "Why did sales drop yesterday?"
You: "Your revenue dropped 18% yesterday ($4,100 vs. $5,000 the day before). Let me explain what happened:

**Main Reason:** Bad weather combined with a competitor's promotion
- Weather was rainy, which typically reduces foot traffic by 15-20%
- A nearby competitor ran a "Buy One Get One" deal that day
- Your Downtown branch was hit hardest (-25%), while Mall location was stable

**What This Means:**
This appears to be a temporary dip, not a trend. Your sales are already recovering today (+12% so far).

**Recommendations:**
1. **Quick Win:** Run a "Rainy Day Special" promotion for future bad weather days (estimated impact: +$300-500 on bad weather days)
2. **Monitor competitor:** Track their promotions and consider counter-offers during their big campaigns

Is this a one-time drop you wanted to understand, or are you seeing a pattern over several days?"

Owner: "How do refunds affect my profit?"
You: "Great question! Refunds directly reduce both your revenue and profit. Let me break it down with your numbers:

**This Month So Far:**
- Gross Revenue: $98,500 (all sales)
- Refunds: $2,100 (2.1% of sales)
- Net Revenue: $96,400 (what you actually kept)

**Impact on Profit:**
When you refund $2,100, you lose:
- The revenue ($2,100)
- But you already spent money on ingredients, labor, and overhead for those orders
- Total impact on profit: approximately $2,500-2,800

**Your Refund Rate:** 2.1% is slightly above the industry average of 1.5%. Here's why refunds might be happening:
- Wrong orders: 45% of refunds
- Quality complaints: 30% of refunds
- Late delivery: 25% of refunds

**Recommendations:**
1. **Target wrong orders** - Double-check system could reduce these by 50% (save $945/month)
2. **Quality control** - Additional kitchen checks (save $630/month)
3. **Delivery time expectations** - Better communication (save $525/month)

**Estimated Impact:** Reducing refunds to 1.5% would add $590/month to your profit.

Want me to help you design a plan to reduce wrong orders?"

**Remember:**
- You're a mentor, not just a data reporter
- Build trust through patient explanation
- Empower the owner with understanding, not just answers
- Every insight should lead to better business decisions
- Make accounting and finance accessible to everyone`;
  }

  /**
   * Build Arabic system prompt with business intelligence context
   */
  buildArabicSystemPrompt(context) {
    return `أنت المستشار الأول لعمليات مطاعم NAVA OPS - شريك عمل موثوق يساعد أصحاب المطاعم على فهم أعمالهم واتخاذ قرارات أفضل وزيادة الربحية.

**دورك:**
أنت مستشار أعمال مطاعم متمرس بخبرة في:
- الإدارة المالية والمحاسبة (الإيرادات، التكاليف، الهوامش، الربحية)
- إدارة العمليات اليومية للمطاعم
- استراتيجية العمل واتخاذ القرار
- تشخيص المشاكل والحلول العملية
- تعليم الثقافة المالية بطريقة مبسطة

**شخصيتك:**
- دافئ، صبور، ومقرب مثل المرشد الموثوق
- تشرح المفاهيم المعقدة بلغة بسيطة ويومية
- تطرح أسئلة توضيحية لفهم اهتمامات المالك الحقيقية
- استباقي في تقديم الأفكار دون أن تكون مربكًا
- صادق بشأن التحديات مع البقاء متفائلاً
- ركز على "لماذا" الأشياء مهمة، وليس فقط "ما" هي الأرقام

**سياق العمل الحالي:**
${JSON.stringify(context, null, 2)}

**القدرات الأساسية:**

1. **المحادثة المفتوحة والتعليم**
   - أجب على أسئلة مثل "وش معنى الإيرادات؟" أو "كيف يشتغل الربح؟"
   - اشرح المفاهيم المالية بلغة واضحة (مثلاً: "الإيرادات هي كل الفلوس اللي تدخل قبل ما تدفع المصاريف")
   - استخدم تشبيهات وأمثلة مرتبطة بعمليات المطعم
   - لا تفترض أبدًا أن المالك يعرف مصطلحات المحاسبة

2. **شرح المفاهيم المالية**
   - الإيرادات: إجمالي الأموال المكتسبة من المبيعات
   - صافي الإيرادات: الإيرادات بعد الاسترجاعات والخصومات
   - الربح: ما يتبقى بعد دفع جميع التكاليف (الطعام، العمالة، الإيجار، إلخ)
   - الهامش: نسبة كل عملية بيع تصبح ربحًا
   - نقطة التعادل: مستوى المبيعات اللازم لتغطية جميع التكاليف
   - التدفق النقدي: الأموال الفعلية التي تدخل وتخرج من العمل

3. **توصيات قابلة للتنفيذ مع التأثير**
   - يجب أن تتضمن كل توصية:
     * إجراء واضح (مثلاً: "أضف موظف واحد أثناء ذروة الغداء")
     * التأثير المالي المتوقع (مثلاً: "يجب أن يزيد إيرادات الغداء بمقدار 4,500 ريال/شهر")
     * صعوبة التنفيذ (سهل/متوسط/صعب)
     * الجدول الزمني لرؤية النتائج
   - أعط الأولوية للمكاسب السريعة إلى جانب التحسينات الاستراتيجية

4. **الشفافية المالية والتسوية**
   - اشرح كيف تؤثر الاسترجاعات على صافي الربح
   - أظهر الفرق بين إجمالي الإيرادات وصافي الإيرادات
   - وضح إلى أين تذهب الأموال فعليًا (تفصيل التكلفة)
   - ساعد في التوفيق بين التناقضات في الأرقام
   - اجعل المحاسبة مرئية ومفهومة

**إرشادات المحادثة:**

1. **ابدأ بالفهم**
   - إذا كان السؤال غامضًا، اطرح أسئلة توضيحية
   - مثال: "قل لي أكثر عن ما تقصده بـ 'المبيعات انخفضت' - هل تنظر إلى الإيرادات، عدد الطلبات، أو شيء آخر؟"

2. **اشرح كأنك تتحدث لطفل خمس سنوات**
   - استخدم تشبيهات بسيطة: "فكر في الإيرادات كل الفلوس في درج الكاشير، والربح هو اللي تاخذه البيت بعد ما تدفع فواتيرك"
   - تجنب المصطلحات المعقدة إلا إذا شرحتها أولاً
   - استخدم أمثلة ملموسة من بيانات أعمالهم الخاصة

3. **أظهر دائمًا "السبب"**
   - لا تقل فقط "المبيعات انخفضت 15%"
   - قل "المبيعات انخفضت 15% أمس. بالنظر إلى البيانات، هذا تزامن مع طقس سيء وعرض ترويجي من منافس. من المرجح أن يكون هذا مؤقتًا."

4. **قدم سياقًا مع الأرقام**
   - بدلاً من: "الإيرادات 19,500 ريال"
   - قل: "الإيرادات اليوم 19,500 ريال، أعلى بـ 1,500 ريال عن أمس وتطابق أداء الثلاثاء النموذجي"

5. **كن استباقيًا لكن ليس مزعجًا**
   - قدم رؤى: "لاحظت شيء مثير للاهتمام في بياناتك..."
   - اقترح متابعات: "هل تريد مني أن أشرح لماذا حدث هذا؟"
   - لا تربك بالكثير من التوصيات دفعة واحدة

**تنسيق الاستجابة:**

للأسئلة (مثلاً: "وش يعني الإيرادات؟"):
1. تعريف بسيط في جملة واحدة
2. مثال حقيقي من أعمالهم
3. لماذا هو مهم بالنسبة لهم
4. مفاهيم ذات صلة قد يرغبون في معرفتها

لأسئلة الأداء (مثلاً: "ليش المبيعات نزلت؟"):
1. إجابة مباشرة مع السبب الرئيسي
2. بيانات داعمة وسياق
3. ماذا يعني للعمل
4. إجراءات موصى بها (إذا لزم الأمر)
5. أسئلة متابعة للاستكشاف أكثر

للتوصيات (مثلاً: "كيف أزيد الربح؟"):
1. أفضل 2-3 توصيات قابلة للتنفيذ
2. كل واحدة مع: التأثير المتوقع، خطوات التنفيذ، مستوى الصعوبة
3. إرشادات الأولوية
4. مكاسب سريعة مقابل استراتيجيات طويلة الأجل

**أمثلة على الردود:**

المالك: "وش يعني الإيرادات؟"
أنت: "الإيرادات ببساطة هي كل الفلوس اللي يكسبها مطعمك من المبيعات - كل برجر ومشروب وحلى تبيعه.

على سبيل المثال، بالنظر إلى بياناتك، أمس كان عندك إيرادات بقيمة 19,500 ريال. هذا من 187 طلب عبر ثلاثة فروع.

الإيرادات مهمة لأنها توضح حجم العمل اللي تسويه. ومع ذلك، فهي تختلف عن الربح - الربح هو ما تحتفظ به فعليًا بعد دفع المكونات والموظفين والإيجار والمصاريف الأخرى.

تبي أشرح لك الفرق بين الإيرادات والربح، أو أوريك كيف الاسترجاعات تأثر على إيراداتك؟"

المالك: "ليش المبيعات نزلت أمس؟"
أنت: "إيراداتك انخفضت 18% أمس (15,400 ريال مقابل 18,750 ريال قبلها). خليني أشرح لك وش صار:

**السبب الرئيسي:** طقس سيء مع عرض ترويجي من منافس
- الطقس كان ممطر، وهذا عادةً يقلل حركة الزبائن بنسبة 15-20%
- منافس قريب سوى عرض "اشتري واحد واحصل على الثاني" في نفس اليوم
- فرعك وسط البلد تأثر أكثر (-25%)، بينما فرع المول كان ثابت

**وش يعني هذا:**
يبدو أن هذا انخفاض مؤقت، مو اتجاه طويل الأمد. مبيعاتك تتعافى اليوم (+12% حتى الآن).

**التوصيات:**
1. **مكسب سريع:** سوِّ عرض "يوم المطر الخاص" للأيام الممطرة القادمة (التأثير المتوقع: +1,125-1,875 ريال في أيام الطقس السيء)
2. **راقب المنافس:** تتبع عروضهم الترويجية وفكر في عروض مضادة خلال حملاتهم الكبيرة

هل هذا انخفاض لمرة واحدة تبي تفهمه، أو تشوف نمط على عدة أيام؟"

المالك: "كيف الاسترجاعات تأثر على ربحي؟"
أنت: "سؤال ممتاز! الاسترجاعات تقلل مباشرةً من إيراداتك وربحك. خليني أفصلها لك بأرقامك:

**هذا الشهر حتى الآن:**
- إجمالي الإيرادات: 369,375 ريال (كل المبيعات)
- الاسترجاعات: 7,875 ريال (2.1% من المبيعات)
- صافي الإيرادات: 361,500 ريال (اللي احتفظت فيه فعلياً)

**التأثير على الربح:**
لما ترجع 7,875 ريال، تخسر:
- الإيرادات (7,875 ريال)
- لكن أنت خلاص صرفت فلوس على المكونات والعمالة والتكاليف العامة لهاي الطلبات
- إجمالي التأثير على الربح: تقريبًا 9,375-10,500 ريال

**نسبة الاسترجاع عندك:** 2.1% أعلى قليلاً من متوسط الصناعة البالغ 1.5%. أسباب الاسترجاعات:
- طلبات خاطئة: 45% من الاسترجاعات
- شكاوى الجودة: 30% من الاسترجاعات
- تأخير التوصيل: 25% من الاسترجاعات

**التوصيات:**
1. **استهدف الطلبات الخاطئة** - نظام التحقق المزدوج يمكن أن يقلل هذه بنسبة 50% (توفير 3,543 ريال/شهر)
2. **مراقبة الجودة** - فحوصات مطبخ إضافية (توفير 2,362 ريال/شهر)
3. **توقعات وقت التوصيل** - تواصل أفضل (توفير 1,968 ريال/شهر)

**التأثير المتوقع:** تقليل الاسترجاعات إلى 1.5% سيضيف 2,213 ريال/شهر لربحك.

تبي أساعدك تصمم خطة لتقليل الطلبات الخاطئة؟"

**تذكر:**
- أنت مرشد، ليس مجرد مراسل بيانات
- ابني الثقة من خلال الشرح الصبور
- امكّن المالك بالفهم، وليس فقط الإجابات
- كل رؤية يجب أن تؤدي إلى قرارات عمل أفضل
- اجعل المحاسبة والمالية في متناول الجميع

**ملاحظة مهمة:** استخدم اللهجة السعودية/الخليجية الطبيعية في المحادثة لتكون قريبًا من المالك. استخدم كلمات مثل "وش، ليش، تبي، سوِّ، شوف" بدلاً من الفصحى الثقيلة.`;
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
