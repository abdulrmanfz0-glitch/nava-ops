/**
 * PREDICTION MATRIX
 * Advanced prediction algorithms for UI behavior forecasting
 */

export class PredictionMatrix {
  constructor() {
    this.behaviorModel = {
      sequences: [],
      patterns: new Map(),
      correlations: new Map(),
    };
    this.predictionAccuracy = [];
  }

  /**
   * Initialize prediction matrix
   */
  initialize() {
    console.log('📊 PREDICTION MATRIX: Initializing behavior forecasting...');
    return this;
  }

  /**
   * Train model from observation sequence
   */
  train(observations) {
    this.extractSequences(observations);
    this.identifyPatterns(observations);
    this.calculateCorrelations(observations);
  }

  /**
   * Extract common sequences
   */
  extractSequences(observations) {
    const sequenceLength = 3;

    for (let i = 0; i <= observations.length - sequenceLength; i++) {
      const sequence = observations.slice(i, i + sequenceLength).map((o) => o.type);
      const sequenceKey = sequence.join('->');

      if (!this.behaviorModel.sequences.find((s) => s.key === sequenceKey)) {
        this.behaviorModel.sequences.push({
          key: sequenceKey,
          sequence,
          frequency: 1,
          outcomes: [],
        });
      } else {
        const existing = this.behaviorModel.sequences.find((s) => s.key === sequenceKey);
        existing.frequency++;
      }
    }
  }

  /**
   * Identify behavior patterns
   */
  identifyPatterns(observations) {
    // Group observations by type
    const typeGroups = new Map();

    observations.forEach((obs) => {
      if (!typeGroups.has(obs.type)) {
        typeGroups.set(obs.type, []);
      }
      typeGroups.get(obs.type).push(obs);
    });

    // Analyze timing patterns
    typeGroups.forEach((group, type) => {
      if (group.length < 2) return;

      const intervals = [];
      for (let i = 1; i < group.length; i++) {
        intervals.push(group[i].timestamp - group[i - 1].timestamp);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

      this.behaviorModel.patterns.set(type, {
        avgInterval,
        frequency: group.length,
        regularity: this.calculateRegularity(intervals),
      });
    });
  }

  /**
   * Calculate regularity score
   */
  calculateRegularity(intervals) {
    if (intervals.length < 2) return 0;

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher regularity
    return Math.max(0, 1 - stdDev / avg);
  }

  /**
   * Calculate correlations between observation types
   */
  calculateCorrelations(observations) {
    const types = ['click', 'hover', 'scroll', 'keypress', 'focus'];

    types.forEach((typeA) => {
      types.forEach((typeB) => {
        if (typeA === typeB) return;

        const correlation = this.computeCorrelation(observations, typeA, typeB);
        this.behaviorModel.correlations.set(`${typeA}->${typeB}`, correlation);
      });
    });
  }

  /**
   * Compute correlation between two event types
   */
  computeCorrelation(observations, typeA, typeB) {
    let coOccurrences = 0;
    const timeWindow = 2000; // 2 seconds

    const eventsA = observations.filter((o) => o.type === typeA);
    const eventsB = observations.filter((o) => o.type === typeB);

    eventsA.forEach((eventA) => {
      const nearbyB = eventsB.filter(
        (eventB) =>
          eventB.timestamp > eventA.timestamp &&
          eventB.timestamp - eventA.timestamp < timeWindow
      );

      if (nearbyB.length > 0) {
        coOccurrences++;
      }
    });

    return eventsA.length > 0 ? coOccurrences / eventsA.length : 0;
  }

  /**
   * Predict next action based on recent sequence
   */
  predictNext(recentObservations) {
    if (recentObservations.length < 2) return null;

    const recentSequence = recentObservations.slice(-2).map((o) => o.type);

    // Find matching sequences
    const matches = this.behaviorModel.sequences.filter((seq) => {
      return (
        seq.sequence[0] === recentSequence[0] && seq.sequence[1] === recentSequence[1]
      );
    });

    if (matches.length === 0) return null;

    // Return most frequent outcome
    const sorted = matches.sort((a, b) => b.frequency - a.frequency);
    const prediction = {
      action: sorted[0].sequence[2],
      confidence: Math.min(sorted[0].frequency / 10, 1),
      alternatives: sorted.slice(1, 3).map((s) => s.sequence[2]),
    };

    return prediction;
  }

  /**
   * Predict action timing
   */
  predictTiming(actionType) {
    const pattern = this.behaviorModel.patterns.get(actionType);

    if (!pattern) return null;

    return {
      expectedInterval: pattern.avgInterval,
      regularity: pattern.regularity,
      confidence: pattern.regularity,
    };
  }

  /**
   * Predict likely follow-up actions
   */
  predictFollowUps(currentAction) {
    const followUps = [];

    this.behaviorModel.correlations.forEach((correlation, key) => {
      const [from, to] = key.split('->');

      if (from === currentAction && correlation > 0.5) {
        followUps.push({
          action: to,
          probability: correlation,
        });
      }
    });

    return followUps.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Validate prediction
   */
  validatePrediction(prediction, actualOutcome) {
    const isCorrect = prediction.action === actualOutcome;

    this.predictionAccuracy.push({
      predicted: prediction.action,
      actual: actualOutcome,
      correct: isCorrect,
      confidence: prediction.confidence,
      timestamp: Date.now(),
    });

    // Keep only last 100 validations
    if (this.predictionAccuracy.length > 100) {
      this.predictionAccuracy.shift();
    }

    return isCorrect;
  }

  /**
   * Get model accuracy
   */
  getAccuracy() {
    if (this.predictionAccuracy.length === 0) return 0;

    const correct = this.predictionAccuracy.filter((p) => p.correct).length;
    return correct / this.predictionAccuracy.length;
  }

  /**
   * Get model statistics
   */
  getStats() {
    return {
      sequences: this.behaviorModel.sequences.length,
      patterns: this.behaviorModel.patterns.size,
      correlations: this.behaviorModel.correlations.size,
      accuracy: this.getAccuracy(),
      predictions: this.predictionAccuracy.length,
    };
  }

  /**
   * Reset model
   */
  reset() {
    this.behaviorModel = {
      sequences: [],
      patterns: new Map(),
      correlations: new Map(),
    };
    this.predictionAccuracy = [];
  }
}

export const predictionMatrix = new PredictionMatrix();
