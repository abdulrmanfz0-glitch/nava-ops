/**
 * Intent Detection and Entity Extraction for AI Q&A System
 * Analyzes natural language queries to determine user intent and extract key entities
 */

// Intent types
export const INTENTS = {
  ITEM_QUERY: 'item_query',
  FINANCIAL_QUERY: 'financial_query',
  BRANCH_QUERY: 'branch_query',
  CATEGORY_QUERY: 'category_query',
  TREND_QUERY: 'trend_query',
  COMPARISON_QUERY: 'comparison_query',
  RECOMMENDATION_QUERY: 'recommendation_query',
  GENERAL_QUERY: 'general_query'
};

// Entity types
export const ENTITY_TYPES = {
  METRIC: 'metric',
  CATEGORY: 'category',
  TIME_PERIOD: 'time_period',
  COMPARISON: 'comparison',
  BRANCH: 'branch',
  ITEM: 'item',
  AGGREGATION: 'aggregation'
};

// Keyword patterns for intent detection
const INTENT_PATTERNS = {
  [INTENTS.ITEM_QUERY]: [
    'item', 'dish', 'food', 'menu', 'product', 'selling', 'popular', 'rated',
    'best seller', 'top item', 'worst', 'pizza', 'burger', 'salad'
  ],
  [INTENTS.FINANCIAL_QUERY]: [
    'revenue', 'profit', 'money', 'income', 'cost', 'expense', 'margin',
    'earnings', 'sales', 'ebitda', 'financial', 'price', 'total'
  ],
  [INTENTS.BRANCH_QUERY]: [
    'branch', 'location', 'store', 'outlet', 'riyadh', 'jeddah', 'dammam',
    'region', 'area', 'site'
  ],
  [INTENTS.CATEGORY_QUERY]: [
    'category', 'appetizer', 'dessert', 'beverage', 'main course', 'side',
    'drinks', 'starters', 'entree', 'sweets'
  ],
  [INTENTS.TREND_QUERY]: [
    'trend', 'trending', 'declining', 'rising', 'growing', 'increasing',
    'decreasing', 'change', 'difference', 'growth', 'pattern'
  ],
  [INTENTS.COMPARISON_QUERY]: [
    'compare', 'vs', 'versus', 'difference between', 'better than',
    'higher than', 'lower than', 'against', 'comparison'
  ],
  [INTENTS.RECOMMENDATION_QUERY]: [
    'recommend', 'suggest', 'should', 'advice', 'what to', 'promote',
    'improve', 'optimize', 'strategy', 'best practice'
  ]
};

// Entity patterns
const ENTITY_PATTERNS = {
  [ENTITY_TYPES.METRIC]: {
    revenue: ['revenue', 'income', 'sales', 'earnings'],
    profit: ['profit', 'margin', 'earnings', 'net income'],
    sold: ['sold', 'units', 'quantity', 'count', 'number sold'],
    rating: ['rating', 'score', 'review', 'satisfaction', 'stars'],
    cost: ['cost', 'expense', 'spending', 'cogs'],
    price: ['price', 'priced', 'pricing'],
    margin: ['margin', 'profit margin', 'markup']
  },
  [ENTITY_TYPES.TIME_PERIOD]: {
    today: ['today', 'now', 'current', 'right now'],
    yesterday: ['yesterday'],
    this_week: ['this week', 'current week', 'week'],
    last_week: ['last week', 'previous week'],
    this_month: ['this month', 'current month', 'month'],
    last_month: ['last month', 'previous month'],
    this_year: ['this year', 'current year', 'year'],
    last_year: ['last year', 'previous year']
  },
  [ENTITY_TYPES.COMPARISON]: {
    highest: ['highest', 'best', 'top', 'maximum', 'most', 'greatest'],
    lowest: ['lowest', 'worst', 'bottom', 'minimum', 'least', 'smallest'],
    top: ['top', 'leading', 'first'],
    bottom: ['bottom', 'trailing', 'last']
  },
  [ENTITY_TYPES.AGGREGATION]: {
    average: ['average', 'avg', 'mean'],
    total: ['total', 'sum', 'all', 'combined'],
    count: ['count', 'number of', 'how many'],
    max: ['maximum', 'max', 'highest'],
    min: ['minimum', 'min', 'lowest']
  }
};

// Common menu categories
const MENU_CATEGORIES = [
  'main course', 'appetizers', 'desserts', 'beverages', 'sides', 'specials',
  'starters', 'entrees', 'mains', 'drinks', 'sweets', 'snacks'
];

/**
 * Detect the primary intent of a query
 * @param {string} query - User's natural language query
 * @returns {string} - Detected intent type
 */
export function detectIntent(query) {
  const normalizedQuery = query.toLowerCase().trim();

  const scores = {};

  // Calculate scores for each intent
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    scores[intent] = 0;

    for (const pattern of patterns) {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        scores[intent]++;
      }
    }
  }

  // Find intent with highest score
  let maxScore = 0;
  let detectedIntent = INTENTS.GENERAL_QUERY;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent;
    }
  }

  return detectedIntent;
}

/**
 * Extract entities from a query
 * @param {string} query - User's natural language query
 * @returns {Object} - Extracted entities
 */
export function extractEntities(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const entities = {};

  // Extract metrics
  for (const [metric, patterns] of Object.entries(ENTITY_PATTERNS[ENTITY_TYPES.METRIC])) {
    for (const pattern of patterns) {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        entities.metric = metric;
        break;
      }
    }
    if (entities.metric) break;
  }

  // Extract time period
  for (const [period, patterns] of Object.entries(ENTITY_PATTERNS[ENTITY_TYPES.TIME_PERIOD])) {
    for (const pattern of patterns) {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        entities.timePeriod = period;
        break;
      }
    }
    if (entities.timePeriod) break;
  }

  // Extract comparison type
  for (const [comparison, patterns] of Object.entries(ENTITY_PATTERNS[ENTITY_TYPES.COMPARISON])) {
    for (const pattern of patterns) {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        entities.comparison = comparison;
        break;
      }
    }
    if (entities.comparison) break;
  }

  // Extract aggregation
  for (const [aggregation, patterns] of Object.entries(ENTITY_PATTERNS[ENTITY_TYPES.AGGREGATION])) {
    for (const pattern of patterns) {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        entities.aggregation = aggregation;
        break;
      }
    }
    if (entities.aggregation) break;
  }

  // Extract category
  for (const category of MENU_CATEGORIES) {
    if (normalizedQuery.includes(category.toLowerCase())) {
      entities.category = category;
      break;
    }
  }

  // Extract limit (top N, bottom N)
  const topMatch = normalizedQuery.match(/top\s+(\d+)/);
  const bottomMatch = normalizedQuery.match(/bottom\s+(\d+)/);

  if (topMatch) {
    entities.limit = parseInt(topMatch[1]);
    entities.comparison = 'highest';
  } else if (bottomMatch) {
    entities.limit = parseInt(bottomMatch[1]);
    entities.comparison = 'lowest';
  }

  return entities;
}

/**
 * Process a query and return structured data
 * @param {string} query - User's natural language query
 * @returns {Object} - Processed query data
 */
export function processQuery(query) {
  const intent = detectIntent(query);
  const entities = extractEntities(query);

  return {
    query,
    intent,
    entities,
    timestamp: Date.now()
  };
}

/**
 * Get sample queries for quick suggestions
 * @returns {Array} - Array of sample queries grouped by category
 */
export function getSampleQueries() {
  return [
    {
      category: 'Performance Metrics',
      queries: [
        "What's our best-selling item today?",
        "Show me top 5 revenue generators this week",
        "Which category has the highest profit margin?",
        "What's the average rating for our menu items?"
      ]
    },
    {
      category: 'Branch Intelligence',
      queries: [
        "Which branch is performing best this month?",
        "Compare all branch revenues",
        "Show me underperforming locations",
        "What's the total transaction volume by branch?"
      ]
    },
    {
      category: 'Financial Analysis',
      queries: [
        "What's our total profit today?",
        "Calculate average order value this week",
        "Show operating cost breakdown",
        "What's our revenue trend this month?"
      ]
    },
    {
      category: 'Item Intelligence',
      queries: [
        "Which items have low ratings?",
        "Show items with declining sales",
        "Find hidden gem menu items",
        "What are the least profitable items?"
      ]
    },
    {
      category: 'Recommendations',
      queries: [
        "Which items should I promote?",
        "What can I do to increase revenue?",
        "Suggest menu optimization strategies",
        "How can I improve profit margins?"
      ]
    }
  ];
}

/**
 * Validate if a query can be answered with available data
 * @param {Object} processedQuery - Processed query object
 * @param {Object} availableData - Available data sources
 * @returns {Object} - Validation result
 */
export function validateQuery(processedQuery, availableData = {}) {
  const { intent, entities } = processedQuery;

  const validation = {
    isValid: true,
    missingData: [],
    suggestions: []
  };

  // Check if required data sources are available
  switch (intent) {
    case INTENTS.ITEM_QUERY:
      if (!availableData.menuItems || availableData.menuItems.length === 0) {
        validation.isValid = false;
        validation.missingData.push('menu items');
      }
      break;

    case INTENTS.BRANCH_QUERY:
      if (!availableData.branches || availableData.branches.length === 0) {
        validation.isValid = false;
        validation.missingData.push('branch data');
      }
      break;

    case INTENTS.FINANCIAL_QUERY:
      if (!availableData.menuItems && !availableData.branches) {
        validation.isValid = false;
        validation.missingData.push('financial data');
      }
      break;
  }

  // Suggest alternatives if data is missing
  if (!validation.isValid) {
    validation.suggestions.push(
      `I don't have ${validation.missingData.join(', ')} available yet. Try asking about other metrics!`
    );
  }

  return validation;
}

export default {
  INTENTS,
  ENTITY_TYPES,
  detectIntent,
  extractEntities,
  processQuery,
  getSampleQueries,
  validateQuery
};
