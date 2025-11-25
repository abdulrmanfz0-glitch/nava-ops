/**
 * USER INTENT MODEL
 * Learns and predicts user intentions from behavioral patterns
 */

export class UserIntentModel {
  constructor() {
    this.intentHistory = [];
    this.intentSignatures = new Map();
    this.currentSession = {
      startTime: Date.now(),
      primaryIntent: null,
      confidenceLevel: 0,
    };
  }

  /**
   * Initialize intent model
   */
  initialize() {
    console.log('🎯 USER INTENT MODEL: Initializing behavioral intent learning...');
    this.loadIntentSignatures();
    return this;
  }

  /**
   * Load predefined intent signatures
   */
  loadIntentSignatures() {
    this.intentSignatures.set('data-analysis', {
      indicators: ['scroll', 'hover-chart', 'click-filter', 'hover-data'],
      minConfidence: 0.6,
      typicalDuration: 30000,
    });

    this.intentSignatures.set('quick-lookup', {
      indicators: ['direct-navigation', 'quick-scroll', 'fast-click'],
      minConfidence: 0.7,
      typicalDuration: 5000,
    });

    this.intentSignatures.set('form-completion', {
      indicators: ['focus-input', 'keypress', 'tab-navigation', 'click-submit'],
      minConfidence: 0.8,
      typicalDuration: 20000,
    });

    this.intentSignatures.set('exploration', {
      indicators: ['hover', 'slow-scroll', 'multiple-page-views'],
      minConfidence: 0.5,
      typicalDuration: 60000,
    });

    this.intentSignatures.set('task-completion', {
      indicators: ['sequential-clicks', 'form-interaction', 'navigation'],
      minConfidence: 0.75,
      typicalDuration: 40000,
    });

    this.intentSignatures.set('comparison', {
      indicators: ['tab-switching', 'scroll-comparison', 'hover-multiple'],
      minConfidence: 0.65,
      typicalDuration: 25000,
    });
  }

  /**
   * Infer intent from observations
   */
  inferIntent(observations) {
    if (observations.length < 3) return null;

    const recentObs = observations.slice(-20);
    const indicators = this.extractIndicators(recentObs);

    // Match against known signatures
    const matches = [];

    this.intentSignatures.forEach((signature, intentName) => {
      const matchScore = this.calculateMatchScore(indicators, signature.indicators);

      if (matchScore >= signature.minConfidence) {
        matches.push({
          intent: intentName,
          confidence: matchScore,
          signature,
        });
      }
    });

    if (matches.length === 0) return null;

    // Return highest confidence match
    const bestMatch = matches.sort((a, b) => b.confidence - a.confidence)[0];

    this.updateCurrentSession(bestMatch);

    return {
      intent: bestMatch.intent,
      confidence: bestMatch.confidence,
      expectedDuration: bestMatch.signature.typicalDuration,
      timestamp: Date.now(),
    };
  }

  /**
   * Extract behavioral indicators
   */
  extractIndicators(observations) {
    const indicators = new Set();

    observations.forEach((obs) => {
      // Basic type indicators
      indicators.add(obs.type);

      // Interaction speed indicators
      const timeSinceStart = obs.timestamp - this.currentSession.startTime;
      if (timeSinceStart < 3000 && obs.type === 'click') {
        indicators.add('fast-click');
      }

      // Pattern indicators
      if (obs.type === 'hover' && obs.target?.role === 'chart') {
        indicators.add('hover-chart');
      }

      if (obs.type === 'hover' && obs.target?.role === 'data') {
        indicators.add('hover-data');
      }

      if (obs.type === 'focus' && obs.target?.tag === 'input') {
        indicators.add('focus-input');
      }
    });

    // Sequence indicators
    const types = observations.map((o) => o.type);

    if (this.hasSequence(types, ['click', 'click', 'click'])) {
      indicators.add('sequential-clicks');
    }

    if (this.hasSequence(types, ['focus', 'keypress'])) {
      indicators.add('form-interaction');
    }

    // Scroll speed indicators
    const scrollEvents = observations.filter((o) => o.type === 'scroll');
    if (scrollEvents.length > 5) {
      const avgInterval =
        (scrollEvents[scrollEvents.length - 1].timestamp - scrollEvents[0].timestamp) /
        scrollEvents.length;

      if (avgInterval < 200) {
        indicators.add('quick-scroll');
      } else if (avgInterval > 1000) {
        indicators.add('slow-scroll');
      }
    }

    return Array.from(indicators);
  }

  /**
   * Check if sequence exists in types
   */
  hasSequence(types, sequence) {
    for (let i = 0; i <= types.length - sequence.length; i++) {
      let match = true;
      for (let j = 0; j < sequence.length; j++) {
        if (types[i + j] !== sequence[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  }

  /**
   * Calculate match score between indicators and signature
   */
  calculateMatchScore(indicators, signatureIndicators) {
    let matches = 0;

    signatureIndicators.forEach((sigIndicator) => {
      if (indicators.some((ind) => ind.includes(sigIndicator))) {
        matches++;
      }
    });

    return matches / signatureIndicators.length;
  }

  /**
   * Update current session intent
   */
  updateCurrentSession(match) {
    this.currentSession.primaryIntent = match.intent;
    this.currentSession.confidenceLevel = match.confidence;

    this.intentHistory.push({
      intent: match.intent,
      confidence: match.confidence,
      timestamp: Date.now(),
    });

    // Keep only last 50 intents
    if (this.intentHistory.length > 50) {
      this.intentHistory.shift();
    }
  }

  /**
   * Predict UI needs based on intent
   */
  predictNeeds(intent) {
    const needsMap = {
      'data-analysis': {
        suggestedFeatures: ['filters', 'charts', 'export', 'comparison'],
        optimizeFor: 'data-density',
        highlightElements: ['charts', 'tables', 'filters'],
      },
      'quick-lookup': {
        suggestedFeatures: ['search', 'quick-nav', 'shortcuts'],
        optimizeFor: 'speed',
        highlightElements: ['search-bar', 'nav-items'],
      },
      'form-completion': {
        suggestedFeatures: ['autofill', 'validation', 'save-draft'],
        optimizeFor: 'input-efficiency',
        highlightElements: ['inputs', 'submit-button', 'required-fields'],
      },
      'exploration': {
        suggestedFeatures: ['tooltips', 'help', 'guided-tour'],
        optimizeFor: 'discoverability',
        highlightElements: ['help-icons', 'new-features', 'navigation'],
      },
      'task-completion': {
        suggestedFeatures: ['progress-indicator', 'save', 'undo'],
        optimizeFor: 'workflow',
        highlightElements: ['next-steps', 'save-button', 'progress-bar'],
      },
      'comparison': {
        suggestedFeatures: ['side-by-side', 'diff-view', 'highlights'],
        optimizeFor: 'comparison',
        highlightElements: ['comparison-panels', 'differences'],
      },
    };

    return needsMap[intent] || null;
  }

  /**
   * Get dominant intent in session
   */
  getDominantIntent() {
    if (this.intentHistory.length === 0) return null;

    const intentCounts = new Map();

    this.intentHistory.forEach((entry) => {
      const count = intentCounts.get(entry.intent) || 0;
      intentCounts.set(entry.intent, count + entry.confidence);
    });

    let maxScore = 0;
    let dominant = null;

    intentCounts.forEach((score, intent) => {
      if (score > maxScore) {
        maxScore = score;
        dominant = intent;
      }
    });

    return {
      intent: dominant,
      strength: maxScore,
    };
  }

  /**
   * Reset session
   */
  resetSession() {
    this.currentSession = {
      startTime: Date.now(),
      primaryIntent: null,
      confidenceLevel: 0,
    };
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      intentHistory: this.intentHistory.length,
      currentIntent: this.currentSession.primaryIntent,
      confidence: this.currentSession.confidenceLevel,
      dominantIntent: this.getDominantIntent(),
    };
  }
}

export const userIntentModel = new UserIntentModel();
