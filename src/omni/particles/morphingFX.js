/**
 * MORPHING FX
 * Advanced particle morphing effects for UI transformations
 */

export class MorphingFX {
  constructor() {
    this.activeMorphs = new Map();
    this.morphId = 0;
  }

  /**
   * Initialize morphing effects
   */
  initialize() {
    console.log('🔄 MORPHING FX: Initializing particle morphing system...');
    this.setupEventListeners();
    return this;
  }

  /**
   * Setup event listeners for automatic morphing
   */
  setupEventListeners() {
    // Listen for custom morph events
    window.addEventListener('trigger-morph', (e) => {
      const { from, to, type } = e.detail;
      this.morph(from, to, type);
    });
  }

  /**
   * Create morphing effect
   */
  morph(fromElement, toElement, type = 'default') {
    const morphId = `morph-${this.morphId++}`;

    const morph = {
      id: morphId,
      from: fromElement,
      to: toElement,
      type,
      startTime: Date.now(),
      particles: [],
    };

    // Generate morph particles based on type
    switch (type) {
      case 'explode':
        this.createExplodeMorph(morph);
        break;
      case 'wave':
        this.createWaveMorph(morph);
        break;
      case 'spiral':
        this.createSpiralMorph(morph);
        break;
      case 'quantum':
        this.createQuantumMorph(morph);
        break;
      default:
        this.createDefaultMorph(morph);
    }

    this.activeMorphs.set(morphId, morph);

    return morphId;
  }

  /**
   * Create default morph effect
   */
  createDefaultMorph(morph) {
    const fromRect = morph.from.getBoundingClientRect();
    const toRect = morph.to.getBoundingClientRect();

    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount;

      morph.particles.push({
        startX: fromRect.left + fromRect.width * progress,
        startY: fromRect.top + fromRect.height / 2,
        endX: toRect.left + toRect.width * progress,
        endY: toRect.top + toRect.height / 2,
        delay: progress * 200,
        duration: 800,
      });
    }

    this.animateMorph(morph);
  }

  /**
   * Create explode morph effect
   */
  createExplodeMorph(morph) {
    const fromRect = morph.from.getBoundingClientRect();
    const toRect = morph.to.getBoundingClientRect();

    const centerX = fromRect.left + fromRect.width / 2;
    const centerY = fromRect.top + fromRect.height / 2;

    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const explosionRadius = 150;

      const midX = centerX + Math.cos(angle) * explosionRadius;
      const midY = centerY + Math.sin(angle) * explosionRadius;

      morph.particles.push({
        startX: centerX,
        startY: centerY,
        midX,
        midY,
        endX: toRect.left + Math.random() * toRect.width,
        endY: toRect.top + Math.random() * toRect.height,
        delay: 0,
        duration: 1200,
      });
    }

    this.animateExplodeMorph(morph);
  }

  /**
   * Create wave morph effect
   */
  createWaveMorph(morph) {
    const fromRect = morph.from.getBoundingClientRect();
    const toRect = morph.to.getBoundingClientRect();

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount;

      morph.particles.push({
        startX: fromRect.left + fromRect.width * progress,
        startY: fromRect.top + fromRect.height / 2,
        endX: toRect.left + toRect.width * progress,
        endY: toRect.top + toRect.height / 2,
        wave: {
          amplitude: 50,
          frequency: 3,
        },
        delay: progress * 300,
        duration: 1000,
      });
    }

    this.animateWaveMorph(morph);
  }

  /**
   * Create spiral morph effect
   */
  createSpiralMorph(morph) {
    const fromRect = morph.from.getBoundingClientRect();
    const toRect = morph.to.getBoundingClientRect();

    const centerX = (fromRect.left + toRect.left) / 2 + (fromRect.width + toRect.width) / 4;
    const centerY = (fromRect.top + toRect.top) / 2 + (fromRect.height + toRect.height) / 4;

    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount;
      const angle = progress * Math.PI * 4;
      const radius = progress * 200;

      morph.particles.push({
        startX: fromRect.left + fromRect.width / 2,
        startY: fromRect.top + fromRect.height / 2,
        spiralX: centerX + Math.cos(angle) * radius,
        spiralY: centerY + Math.sin(angle) * radius,
        endX: toRect.left + toRect.width / 2,
        endY: toRect.top + toRect.height / 2,
        delay: progress * 100,
        duration: 1500,
      });
    }

    this.animateSpiralMorph(morph);
  }

  /**
   * Create quantum morph effect
   */
  createQuantumMorph(morph) {
    const fromRect = morph.from.getBoundingClientRect();
    const toRect = morph.to.getBoundingClientRect();

    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      morph.particles.push({
        startX: fromRect.left + Math.random() * fromRect.width,
        startY: fromRect.top + Math.random() * fromRect.height,
        endX: toRect.left + Math.random() * toRect.width,
        endY: toRect.top + Math.random() * toRect.height,
        quantum: {
          phaseShift: Math.random() * Math.PI * 2,
          uncertainty: 30,
        },
        delay: Math.random() * 200,
        duration: 1000 + Math.random() * 500,
      });
    }

    this.animateQuantumMorph(morph);
  }

  /**
   * Animate standard morph
   */
  animateMorph(morph) {
    // Emit event for particle system to handle rendering
    const event = new CustomEvent('morph-particles', {
      detail: morph,
    });
    window.dispatchEvent(event);
  }

  /**
   * Animate explode morph
   */
  animateExplodeMorph(morph) {
    const event = new CustomEvent('morph-explode', {
      detail: morph,
    });
    window.dispatchEvent(event);
  }

  /**
   * Animate wave morph
   */
  animateWaveMorph(morph) {
    const event = new CustomEvent('morph-wave', {
      detail: morph,
    });
    window.dispatchEvent(event);
  }

  /**
   * Animate spiral morph
   */
  animateSpiralMorph(morph) {
    const event = new CustomEvent('morph-spiral', {
      detail: morph,
    });
    window.dispatchEvent(event);
  }

  /**
   * Animate quantum morph
   */
  animateQuantumMorph(morph) {
    const event = new CustomEvent('morph-quantum', {
      detail: morph,
    });
    window.dispatchEvent(event);
  }

  /**
   * Button click morph
   */
  morphButtonClick(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const event = new CustomEvent('particle-burst', {
      detail: {
        x: centerX,
        y: centerY,
        count: 30,
        color: '#60a5fa',
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Card replacement morph
   */
  morphCardReplacement(oldCard, newCard) {
    return this.morph(oldCard, newCard, 'quantum');
  }

  /**
   * Page transition morph
   */
  morphPageTransition(fromPage, toPage) {
    return this.morph(fromPage, toPage, 'wave');
  }

  /**
   * Get active morphs
   */
  getActiveMorphs() {
    return Array.from(this.activeMorphs.values());
  }

  /**
   * Clear morph
   */
  clearMorph(morphId) {
    this.activeMorphs.delete(morphId);
  }

  /**
   * Clear all morphs
   */
  clearAll() {
    this.activeMorphs.clear();
  }
}

export const morphingFX = new MorphingFX();
