/**
 * SELF-MUTATE ENGINE
 * Continuously rewrites UI components based on quantum fabric signals
 */

export class SelfMutateEngine {
  constructor() {
    this.activeMutations = new Map();
    this.mutationRules = this.initializeMutationRules();
  }

  /**
   * Initialize mutation rules
   */
  initializeMutationRules() {
    return {
      SIMPLIFY_LAYOUT: {
        cssVars: {
          '--spacing-unit': '1.2rem',
          '--component-gap': '1.5rem',
        },
        duration: 800,
      },
      INCREASE_SPACING: {
        cssVars: {
          '--spacing-unit': '1.5rem',
          '--component-gap': '2rem',
        },
        duration: 600,
      },
      SOFTEN_COLORS: {
        cssVars: {
          '--color-intensity': '0.85',
          '--contrast-level': '0.9',
        },
        duration: 1000,
      },
      COMPACT_MODE: {
        cssVars: {
          '--spacing-unit': '0.8rem',
          '--component-gap': '1rem',
          '--font-scale': '0.95',
        },
        duration: 500,
      },
      EXPAND_MODE: {
        cssVars: {
          '--spacing-unit': '1.8rem',
          '--component-gap': '2.5rem',
          '--font-scale': '1.05',
        },
        duration: 700,
      },
    };
  }

  /**
   * Apply mutation to DOM
   */
  applyMutation(mutation) {
    const rule = this.mutationRules[mutation.type];
    if (!rule) return;

    const root = document.documentElement;
    const duration = rule.duration;

    // Apply CSS variables with smooth transitions
    Object.entries(rule.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Track active mutation
    this.activeMutations.set(mutation.type, {
      appliedAt: Date.now(),
      duration,
    });

    // Emit mutation event
    this.emitMutationEvent(mutation.type, 'applied');
  }

  /**
   * Revert mutation
   */
  revertMutation(mutationType) {
    const mutation = this.activeMutations.get(mutationType);
    if (!mutation) return;

    const rule = this.mutationRules[mutationType];
    const root = document.documentElement;

    // Reset CSS variables
    Object.keys(rule.cssVars).forEach((key) => {
      root.style.removeProperty(key);
    });

    this.activeMutations.delete(mutationType);
    this.emitMutationEvent(mutationType, 'reverted');
  }

  /**
   * Emit mutation event
   */
  emitMutationEvent(type, status) {
    const event = new CustomEvent('self-mutation', {
      detail: { type, status, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
  }

  /**
   * Get active mutations
   */
  getActiveMutations() {
    return Array.from(this.activeMutations.entries());
  }

  /**
   * Clear all mutations
   */
  clearAllMutations() {
    this.activeMutations.forEach((_, type) => {
      this.revertMutation(type);
    });
  }
}

export const selfMutateEngine = new SelfMutateEngine();
