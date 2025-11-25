/**
 * ADAPTIVE WEAVING
 * Learns from user behavior and optimizes UI layout automatically
 */

export class AdaptiveWeaving {
  constructor() {
    this.layoutPatterns = new Map();
    this.userPreferences = {
      compactness: 0.5,
      visualDensity: 0.5,
      animationSpeed: 0.5,
      colorIntensity: 0.5,
    };
    this.learningRate = 0.1;
  }

  /**
   * Analyze user preferences from behavior
   */
  analyzePreferences(interactions) {
    // Analyze scroll patterns
    const scrollInteractions = interactions.filter((i) => i.type === 'scroll');
    if (scrollInteractions.length > 20) {
      // User scrolls frequently - prefer compact layout
      this.adjustPreference('compactness', 0.1);
    }

    // Analyze click patterns
    const clickInteractions = interactions.filter((i) => i.type === 'click');
    const averageClickSpeed = this.calculateClickSpeed(clickInteractions);

    if (averageClickSpeed < 2000) {
      // Fast clicks - user is efficient, prefer compact mode
      this.adjustPreference('compactness', 0.05);
      this.adjustPreference('animationSpeed', -0.05);
    } else {
      // Slower clicks - user prefers space
      this.adjustPreference('compactness', -0.05);
    }

    // Analyze hover patterns
    const hoverInteractions = interactions.filter((i) => i.type === 'hover');
    const hoverDuration = this.calculateAverageHoverTime(hoverInteractions);

    if (hoverDuration > 1000) {
      // Long hovers - user needs more visual feedback
      this.adjustPreference('visualDensity', 0.05);
    }
  }

  /**
   * Adjust preference value
   */
  adjustPreference(key, delta) {
    const current = this.userPreferences[key];
    const adjusted = Math.max(0, Math.min(1, current + delta * this.learningRate));
    this.userPreferences[key] = adjusted;
  }

  /**
   * Calculate click speed
   */
  calculateClickSpeed(clicks) {
    if (clicks.length < 2) return 5000;

    const intervals = [];
    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }

  /**
   * Calculate average hover time
   */
  calculateAverageHoverTime(hovers) {
    if (hovers.length < 2) return 500;

    const durations = [];
    for (let i = 1; i < hovers.length; i++) {
      if (hovers[i].data && hovers[i - 1].data) {
        const distance = Math.sqrt(
          Math.pow(hovers[i].data.x - hovers[i - 1].data.x, 2) +
          Math.pow(hovers[i].data.y - hovers[i - 1].data.y, 2)
        );

        // If cursor moved less than 50px, consider it a hover
        if (distance < 50) {
          durations.push(hovers[i].timestamp - hovers[i - 1].timestamp);
        }
      }
    }

    if (durations.length === 0) return 500;
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  /**
   * Generate layout recommendations
   */
  generateLayoutRecommendations() {
    const recommendations = [];

    if (this.userPreferences.compactness > 0.7) {
      recommendations.push({
        type: 'COMPACT_MODE',
        reason: 'User prefers compact layouts',
        confidence: this.userPreferences.compactness,
      });
    } else if (this.userPreferences.compactness < 0.3) {
      recommendations.push({
        type: 'EXPAND_MODE',
        reason: 'User prefers spacious layouts',
        confidence: 1 - this.userPreferences.compactness,
      });
    }

    if (this.userPreferences.animationSpeed < 0.3) {
      recommendations.push({
        type: 'FAST_ANIMATIONS',
        reason: 'User prefers quick interactions',
        confidence: 1 - this.userPreferences.animationSpeed,
      });
    }

    return recommendations;
  }

  /**
   * Apply adaptive layout
   */
  applyAdaptiveLayout() {
    const root = document.documentElement;

    // Apply compactness
    const spacingScale = 0.8 + this.userPreferences.compactness * 0.4;
    root.style.setProperty('--adaptive-spacing', `${spacingScale}rem`);

    // Apply visual density
    const densityScale = 0.9 + this.userPreferences.visualDensity * 0.2;
    root.style.setProperty('--adaptive-density', densityScale.toString());

    // Apply animation speed
    const animSpeed = 200 + (1 - this.userPreferences.animationSpeed) * 600;
    root.style.setProperty('--adaptive-animation-speed', `${animSpeed}ms`);

    // Apply color intensity
    const colorIntensity = 0.8 + this.userPreferences.colorIntensity * 0.4;
    root.style.setProperty('--adaptive-color-intensity', colorIntensity.toString());
  }

  /**
   * Get weaving statistics
   */
  getStats() {
    return {
      preferences: { ...this.userPreferences },
      patterns: this.layoutPatterns.size,
      learningRate: this.learningRate,
    };
  }
}

export const adaptiveWeaving = new AdaptiveWeaving();
