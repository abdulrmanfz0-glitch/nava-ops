/**
 * COGNITIVE SENSE
 * Detects user cognitive state and attention patterns
 */

export class CognitiveSense {
  constructor() {
    this.cognitiveState = {
      attention: 'focused',
      engagement: 0.5,
      confusion: 0,
      fatigue: 0,
      flow: 0,
    };
    this.sessionStart = Date.now();
    this.interactionHistory = [];
    this.idleTime = 0;
    this.lastActivity = Date.now();
  }

  /**
   * Initialize cognitive sensing
   */
  initialize() {
    console.log('🧠 COGNITIVE SENSE: Initializing cognitive state detection...');
    this.setupMonitoring();
    this.startAnalysis();
    return this;
  }

  /**
   * Setup monitoring
   */
  setupMonitoring() {
    // Track all interactions
    ['click', 'keypress', 'scroll', 'mousemove'].forEach((eventType) => {
      document.addEventListener(eventType, () => this.recordActivity(eventType));
    });

    // Monitor idle time
    setInterval(() => {
      this.updateIdleTime();
    }, 1000);

    // Listen to motion patterns
    window.addEventListener('motion-detected', (e) => {
      this.analyzeMotionCognition(e.detail);
    });

    // Listen to user intent
    window.addEventListener('governor-intent', (e) => {
      this.analyzeIntentCognition(e.detail);
    });
  }

  /**
   * Record activity
   */
  recordActivity(type) {
    this.lastActivity = Date.now();
    this.idleTime = 0;

    this.interactionHistory.push({
      type,
      timestamp: Date.now(),
    });

    // Keep only last 100 interactions
    if (this.interactionHistory.length > 100) {
      this.interactionHistory.shift();
    }
  }

  /**
   * Update idle time
   */
  updateIdleTime() {
    const timeSinceActivity = Date.now() - this.lastActivity;
    this.idleTime = timeSinceActivity;

    // Update attention based on idle time
    if (this.idleTime > 30000) {
      this.cognitiveState.attention = 'distracted';
      this.cognitiveState.engagement = Math.max(0, this.cognitiveState.engagement - 0.05);
    } else if (this.idleTime > 10000) {
      this.cognitiveState.attention = 'wandering';
    } else if (this.idleTime < 1000) {
      this.cognitiveState.attention = 'focused';
      this.cognitiveState.engagement = Math.min(1, this.cognitiveState.engagement + 0.05);
    }
  }

  /**
   * Start cognitive analysis
   */
  startAnalysis() {
    setInterval(() => {
      this.analyzeEngagement();
      this.analyzeConfusion();
      this.analyzeFatigue();
      this.analyzeFlow();
      this.emitCognitiveState();
    }, 5000);
  }

  /**
   * Analyze engagement level
   */
  analyzeEngagement() {
    const recentInteractions = this.interactionHistory.filter(
      (i) => Date.now() - i.timestamp < 30000
    );

    // High interaction rate = high engagement
    const interactionRate = recentInteractions.length / 30;

    if (interactionRate > 3) {
      this.cognitiveState.engagement = Math.min(1, this.cognitiveState.engagement + 0.1);
    } else if (interactionRate < 1) {
      this.cognitiveState.engagement = Math.max(0, this.cognitiveState.engagement - 0.1);
    }
  }

  /**
   * Analyze confusion indicators
   */
  analyzeConfusion() {
    const recentActivity = this.interactionHistory.filter(
      (i) => Date.now() - i.timestamp < 10000
    );

    // Indicators of confusion:
    // 1. Rapid back-and-forth scrolling
    const scrollEvents = recentActivity.filter((i) => i.type === 'scroll');
    if (scrollEvents.length > 15) {
      this.cognitiveState.confusion = Math.min(1, this.cognitiveState.confusion + 0.15);
    }

    // 2. Excessive hovering without clicking
    const hoverTime = recentActivity.filter((i) => i.type === 'mousemove').length;
    const clickTime = recentActivity.filter((i) => i.type === 'click').length;

    if (hoverTime > 20 && clickTime < 2) {
      this.cognitiveState.confusion = Math.min(1, this.cognitiveState.confusion + 0.1);
    }

    // Decay confusion over time
    this.cognitiveState.confusion = Math.max(0, this.cognitiveState.confusion - 0.05);

    // Emit help suggestion if confused
    if (this.cognitiveState.confusion > 0.6) {
      this.emitHelpSuggestion();
    }
  }

  /**
   * Analyze fatigue
   */
  analyzeFatigue() {
    const sessionDuration = Date.now() - this.sessionStart;
    const minutesActive = sessionDuration / 60000;

    // Fatigue increases with session duration
    if (minutesActive > 30) {
      this.cognitiveState.fatigue = Math.min(1, minutesActive / 60);
    }

    // Recent interaction speed
    const recent = this.interactionHistory.slice(-20);
    if (recent.length >= 2) {
      const intervals = [];
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i].timestamp - recent[i - 1].timestamp);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

      // Slow interactions = fatigue
      if (avgInterval > 3000) {
        this.cognitiveState.fatigue = Math.min(1, this.cognitiveState.fatigue + 0.1);
      }
    }

    // Suggest break if fatigued
    if (this.cognitiveState.fatigue > 0.7) {
      this.emitBreakSuggestion();
    }
  }

  /**
   * Analyze flow state
   */
  analyzeFlow() {
    // Flow = high engagement + low confusion + moderate fatigue + focused attention
    const flowScore =
      this.cognitiveState.engagement * 0.4 +
      (1 - this.cognitiveState.confusion) * 0.3 +
      (1 - this.cognitiveState.fatigue) * 0.2 +
      (this.cognitiveState.attention === 'focused' ? 0.1 : 0);

    this.cognitiveState.flow = flowScore;
  }

  /**
   * Analyze motion for cognitive cues
   */
  analyzeMotionCognition(motionData) {
    // Erratic motion = confusion or stress
    if (motionData.rhythm === 'erratic') {
      this.cognitiveState.confusion = Math.min(1, this.cognitiveState.confusion + 0.05);
    }

    // Searching pattern = looking for something
    if (motionData.pattern === 'searching') {
      this.cognitiveState.confusion = Math.min(1, this.cognitiveState.confusion + 0.08);
    }

    // Steady motion = confident
    if (motionData.rhythm === 'steady' && motionData.pattern === 'normal') {
      this.cognitiveState.engagement = Math.min(1, this.cognitiveState.engagement + 0.05);
    }
  }

  /**
   * Analyze intent for cognitive cues
   */
  analyzeIntentCognition(intentData) {
    // High confidence intent = good flow
    if (intentData.confidence > 0.8) {
      this.cognitiveState.flow = Math.min(1, this.cognitiveState.flow + 0.1);
    }

    // Task completion intent = engaged
    if (intentData.pattern === 'task-completion') {
      this.cognitiveState.engagement = Math.min(1, this.cognitiveState.engagement + 0.1);
    }
  }

  /**
   * Emit cognitive state
   */
  emitCognitiveState() {
    const event = new CustomEvent('cognitive-state', {
      detail: this.cognitiveState,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit help suggestion
   */
  emitHelpSuggestion() {
    const event = new CustomEvent('suggest-help', {
      detail: {
        reason: 'confusion-detected',
        confusionLevel: this.cognitiveState.confusion,
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit break suggestion
   */
  emitBreakSuggestion() {
    const event = new CustomEvent('suggest-break', {
      detail: {
        reason: 'fatigue-detected',
        fatigueLevel: this.cognitiveState.fatigue,
        sessionDuration: Date.now() - this.sessionStart,
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.cognitiveState,
      sessionDuration: Date.now() - this.sessionStart,
      idleTime: this.idleTime,
      interactionCount: this.interactionHistory.length,
    };
  }
}

export const cognitiveSense = new CognitiveSense();
