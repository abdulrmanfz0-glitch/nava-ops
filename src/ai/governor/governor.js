/**
 * META-AI GOVERNOR
 * Central AI overseer that monitors, predicts, and optimizes all UI activity
 */

export class Governor {
  constructor() {
    this.isActive = false;
    this.observationHistory = [];
    this.predictions = new Map();
    this.userIntent = null;
    this.confidenceThreshold = 0.7;
    this.maxHistorySize = 500;
  }

  /**
   * Initialize the Governor
   */
  initialize() {
    console.log('🧠 META-AI GOVERNOR: Initializing predictive UI overseer...');
    this.isActive = true;
    this.startMonitoring();
    this.startPredictionLoop();
    return this;
  }

  /**
   * Start monitoring all UI activity
   */
  startMonitoring() {
    // Monitor clicks
    document.addEventListener('click', (e) => this.handleClick(e), true);

    // Monitor mouse movement
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    // Monitor scroll
    document.addEventListener('scroll', () => this.handleScroll(), true);

    // Monitor keyboard
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Monitor focus changes
    document.addEventListener('focusin', (e) => this.handleFocus(e));

    // Monitor page visibility
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  /**
   * Handle click events
   */
  handleClick(e) {
    this.recordObservation({
      type: 'click',
      target: this.getElementSignature(e.target),
      timestamp: Date.now(),
      position: { x: e.clientX, y: e.clientY },
    });

    this.updateIntent('click', e.target);
  }

  /**
   * Handle mouse movement
   */
  handleMouseMove(e) {
    // Throttle mouse move observations
    if (!this.lastMouseMove || Date.now() - this.lastMouseMove > 100) {
      const element = document.elementFromPoint(e.clientX, e.clientY);

      this.recordObservation({
        type: 'hover',
        target: this.getElementSignature(element),
        timestamp: Date.now(),
        position: { x: e.clientX, y: e.clientY },
        velocity: this.calculateMouseVelocity(e),
      });

      this.lastMouseMove = Date.now();
      this.lastMousePosition = { x: e.clientX, y: e.clientY };
    }

    this.predictNextInteraction(e);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    this.recordObservation({
      type: 'scroll',
      position: window.scrollY,
      timestamp: Date.now(),
    });

    this.predictScrollDestination();
  }

  /**
   * Handle key press
   */
  handleKeyPress(e) {
    this.recordObservation({
      type: 'keypress',
      key: e.key,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle focus changes
   */
  handleFocus(e) {
    this.recordObservation({
      type: 'focus',
      target: this.getElementSignature(e.target),
      timestamp: Date.now(),
    });
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    this.recordObservation({
      type: 'visibility',
      hidden: document.hidden,
      timestamp: Date.now(),
    });
  }

  /**
   * Record observation
   */
  recordObservation(observation) {
    this.observationHistory.push(observation);

    // Limit history size
    if (this.observationHistory.length > this.maxHistorySize) {
      this.observationHistory.shift();
    }
  }

  /**
   * Get element signature
   */
  getElementSignature(element) {
    if (!element) return null;

    return {
      tag: element.tagName?.toLowerCase(),
      id: element.id,
      class: element.className,
      role: element.getAttribute('role'),
      text: element.textContent?.slice(0, 50),
    };
  }

  /**
   * Calculate mouse velocity
   */
  calculateMouseVelocity(e) {
    if (!this.lastMousePosition) return 0;

    const dx = e.clientX - this.lastMousePosition.x;
    const dy = e.clientY - this.lastMousePosition.y;
    const dt = Date.now() - this.lastMouseMove;

    return Math.sqrt(dx * dx + dy * dy) / dt;
  }

  /**
   * Update user intent
   */
  updateIntent(action, target) {
    const recentActions = this.observationHistory
      .filter((obs) => Date.now() - obs.timestamp < 3000)
      .slice(-5);

    // Analyze pattern
    const pattern = this.analyzePattern(recentActions);

    this.userIntent = {
      action,
      target: this.getElementSignature(target),
      pattern,
      confidence: this.calculateIntentConfidence(pattern),
      timestamp: Date.now(),
    };

    // Emit intent event if confidence is high
    if (this.userIntent.confidence > this.confidenceThreshold) {
      this.emitIntentEvent(this.userIntent);
    }
  }

  /**
   * Analyze observation pattern
   */
  analyzePattern(observations) {
    if (observations.length < 2) return 'isolated';

    const types = observations.map((o) => o.type);

    // Detect patterns
    if (types.every((t) => t === 'hover')) return 'browsing';
    if (types.includes('click') && types.includes('hover')) return 'targeted-click';
    if (types.every((t) => t === 'scroll')) return 'scanning';
    if (types.includes('keypress')) return 'input';

    return 'mixed';
  }

  /**
   * Calculate intent confidence
   */
  calculateIntentConfidence(pattern) {
    const baseConfidence = {
      'isolated': 0.3,
      'browsing': 0.5,
      'targeted-click': 0.9,
      'scanning': 0.6,
      'input': 0.85,
      'mixed': 0.4,
    };

    return baseConfidence[pattern] || 0.5;
  }

  /**
   * Predict next interaction
   */
  predictNextInteraction(e) {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    // Check if hovering over interactive element
    const isInteractive = this.isInteractiveElement(element);

    if (isInteractive) {
      const prediction = {
        type: 'click',
        target: element,
        confidence: this.calculateClickProbability(element),
        timestamp: Date.now(),
      };

      this.predictions.set('next-click', prediction);

      // Emit prediction if confidence is high
      if (prediction.confidence > this.confidenceThreshold) {
        this.emitPredictionEvent(prediction);
      }
    }
  }

  /**
   * Check if element is interactive
   */
  isInteractiveElement(element) {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const isInteractiveTag = interactiveTags.includes(element.tagName?.toLowerCase());
    const hasClickHandler = element.onclick !== null;
    const isClickable = element.style.cursor === 'pointer';

    return isInteractiveTag || hasClickHandler || isClickable;
  }

  /**
   * Calculate click probability
   */
  calculateClickProbability(element) {
    const factors = {
      hoverDuration: this.getHoverDuration(element),
      mouseVelocity: this.lastMouseMove ? this.calculateMouseVelocity({ clientX: 0, clientY: 0 }) : 0,
      previousClicks: this.countPreviousClicks(element),
    };

    let probability = 0.5;

    // Long hover increases probability
    if (factors.hoverDuration > 500) probability += 0.2;
    if (factors.hoverDuration > 1000) probability += 0.1;

    // Slow mouse increases probability
    if (factors.mouseVelocity < 0.1) probability += 0.15;

    // Previous clicks on similar elements
    probability += Math.min(factors.previousClicks * 0.05, 0.15);

    return Math.min(probability, 1);
  }

  /**
   * Get hover duration on element
   */
  getHoverDuration(element) {
    const signature = this.getElementSignature(element);
    const hoverEvents = this.observationHistory
      .filter((obs) => obs.type === 'hover' && obs.target?.id === signature.id)
      .slice(-5);

    if (hoverEvents.length === 0) return 0;

    return Date.now() - hoverEvents[0].timestamp;
  }

  /**
   * Count previous clicks on similar elements
   */
  countPreviousClicks(element) {
    const signature = this.getElementSignature(element);
    return this.observationHistory.filter(
      (obs) =>
        obs.type === 'click' &&
        obs.target?.tag === signature.tag &&
        obs.target?.class === signature.class
    ).length;
  }

  /**
   * Predict scroll destination
   */
  predictScrollDestination() {
    const scrollEvents = this.observationHistory
      .filter((obs) => obs.type === 'scroll')
      .slice(-10);

    if (scrollEvents.length < 3) return;

    // Calculate scroll velocity
    const velocities = [];
    for (let i = 1; i < scrollEvents.length; i++) {
      const dy = scrollEvents[i].position - scrollEvents[i - 1].position;
      const dt = scrollEvents[i].timestamp - scrollEvents[i - 1].timestamp;
      velocities.push(dy / dt);
    }

    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;

    // Predict destination
    const currentScroll = window.scrollY;
    const predictedScroll = currentScroll + avgVelocity * 500; // 500ms ahead

    this.emitScrollPredictionEvent({
      current: currentScroll,
      predicted: predictedScroll,
      velocity: avgVelocity,
    });
  }

  /**
   * Start prediction loop
   */
  startPredictionLoop() {
    setInterval(() => {
      if (!this.isActive) return;

      // Run periodic predictions
      this.predictNextPage();
      this.predictUserNeeds();
    }, 2000);
  }

  /**
   * Predict next page navigation
   */
  predictNextPage() {
    const recentClicks = this.observationHistory
      .filter((obs) => obs.type === 'click' && Date.now() - obs.timestamp < 30000)
      .slice(-5);

    // Analyze navigation patterns
    const pages = recentClicks.map((click) => this.extractPageFromTarget(click.target));

    // Predict most likely next page
    if (pages.length > 0) {
      const prediction = this.predictNextInSequence(pages);
      if (prediction) {
        this.emitPagePredictionEvent(prediction);
      }
    }
  }

  /**
   * Extract page info from target
   */
  extractPageFromTarget(target) {
    if (!target) return null;
    return {
      text: target.text,
      role: target.role,
    };
  }

  /**
   * Predict next in sequence
   */
  predictNextInSequence(items) {
    // Simple frequency-based prediction
    const frequency = new Map();

    items.forEach((item) => {
      const key = item?.text || 'unknown';
      frequency.set(key, (frequency.get(key) || 0) + 1);
    });

    let maxFreq = 0;
    let predicted = null;

    frequency.forEach((freq, key) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        predicted = key;
      }
    });

    return predicted;
  }

  /**
   * Predict user needs
   */
  predictUserNeeds() {
    const recentActivity = this.observationHistory.filter(
      (obs) => Date.now() - obs.timestamp < 10000
    );

    if (recentActivity.length === 0) return;

    // Analyze activity type
    const activityTypes = recentActivity.map((a) => a.type);
    const dominantType = this.predictNextInSequence(activityTypes.map((t) => ({ text: t })));

    this.emitNeedsPredictionEvent({
      dominantActivity: dominantType,
      activityCount: recentActivity.length,
      prediction: this.inferNeedFromActivity(dominantType),
    });
  }

  /**
   * Infer need from activity type
   */
  inferNeedFromActivity(activityType) {
    const needs = {
      'hover': 'exploration',
      'click': 'action',
      'scroll': 'content-review',
      'keypress': 'data-entry',
      'focus': 'form-completion',
    };

    return needs[activityType] || 'general-browsing';
  }

  /**
   * Emit intent event
   */
  emitIntentEvent(intent) {
    const event = new CustomEvent('governor-intent', {
      detail: intent,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit prediction event
   */
  emitPredictionEvent(prediction) {
    const event = new CustomEvent('governor-prediction', {
      detail: prediction,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit scroll prediction event
   */
  emitScrollPredictionEvent(data) {
    const event = new CustomEvent('governor-scroll-prediction', {
      detail: data,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit page prediction event
   */
  emitPagePredictionEvent(page) {
    const event = new CustomEvent('governor-page-prediction', {
      detail: { page },
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit needs prediction event
   */
  emitNeedsPredictionEvent(needs) {
    const event = new CustomEvent('governor-needs', {
      detail: needs,
    });
    window.dispatchEvent(event);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      observations: this.observationHistory.length,
      predictions: this.predictions.size,
      currentIntent: this.userIntent,
      isActive: this.isActive,
    };
  }

  /**
   * Stop governor
   */
  stop() {
    this.isActive = false;
  }
}

export const governor = new Governor();
