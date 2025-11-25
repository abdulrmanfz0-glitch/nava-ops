/**
 * FOLD SPACE
 * Space-folding transitions between UI states
 */

export class FoldSpace {
  constructor() {
    this.activeFolds = new Map();
    this.foldDuration = 1000;
  }

  /**
   * Initialize fold space system
   */
  initialize() {
    console.log('🔥 FOLD SPACE: Initializing space-folding transitions...');
    return this;
  }

  /**
   * Fold space between two elements
   */
  async fold(fromElement, toElement, options = {}) {
    const foldId = `fold-${Date.now()}`;
    const duration = options.duration || this.foldDuration;

    const fold = {
      id: foldId,
      from: fromElement,
      to: toElement,
      duration,
      startTime: Date.now(),
      type: options.type || 'standard',
    };

    this.activeFolds.set(foldId, fold);

    // Execute fold based on type
    switch (fold.type) {
      case 'origami':
        await this.origamiFold(fold);
        break;
      case 'portal':
        await this.portalFold(fold);
        break;
      case 'collapse':
        await this.collapseFold(fold);
        break;
      default:
        await this.standardFold(fold);
    }

    this.activeFolds.delete(foldId);
    return foldId;
  }

  /**
   * Standard space fold
   */
  async standardFold(fold) {
    const { from, to, duration } = fold;

    // Create fold overlay
    const overlay = this.createFoldOverlay();

    // Get positions
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    // Calculate midpoint
    const midX = (fromRect.left + toRect.left) / 2 + (fromRect.width + toRect.width) / 4;
    const midY = (fromRect.top + toRect.top) / 2 + (fromRect.height + toRect.height) / 4;

    // Animate fold
    return new Promise((resolve) => {
      // Phase 1: Fold from element
      from.style.transition = `all ${duration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      from.style.transform = `
        translate3d(${midX - fromRect.left}px, ${midY - fromRect.top}px, -200px)
        scale(0.1)
        rotateY(90deg)
      `;
      from.style.opacity = '0';

      setTimeout(() => {
        // Phase 2: Unfold to element
        to.style.transform = `
          translate3d(${midX - toRect.left}px, ${midY - toRect.top}px, -200px)
          scale(0.1)
          rotateY(-90deg)
        `;
        to.style.opacity = '0';

        setTimeout(() => {
          to.style.transition = `all ${duration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          to.style.transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
          to.style.opacity = '1';

          setTimeout(() => {
            // Cleanup
            from.style.transform = '';
            from.style.transition = '';
            to.style.transform = '';
            to.style.transition = '';
            overlay.remove();
            resolve();
          }, duration / 2);
        }, 50);
      }, duration / 2);
    });
  }

  /**
   * Origami-style fold
   */
  async origamiFold(fold) {
    const { from, to, duration } = fold;

    return new Promise((resolve) => {
      // Create multiple fold lines
      const foldCount = 8;

      from.style.transition = `all ${duration}ms ease-in-out`;

      for (let i = 0; i < foldCount; i++) {
        const delay = (i / foldCount) * duration;

        setTimeout(() => {
          const progress = i / foldCount;
          from.style.transform = `
            perspective(1000px)
            rotateY(${progress * 180}deg)
            translateZ(${-progress * 100}px)
          `;
          from.style.opacity = 1 - progress;
        }, delay);
      }

      setTimeout(() => {
        to.style.transform = 'perspective(1000px) rotateY(-180deg) translateZ(-100px)';
        to.style.opacity = '0';

        setTimeout(() => {
          to.style.transition = `all ${duration}ms ease-in-out`;
          to.style.transform = 'perspective(1000px) rotateY(0deg) translateZ(0px)';
          to.style.opacity = '1';

          setTimeout(() => {
            from.style.transform = '';
            from.style.transition = '';
            to.style.transform = '';
            to.style.transition = '';
            resolve();
          }, duration);
        }, 50);
      }, duration);
    });
  }

  /**
   * Portal-style fold
   */
  async portalFold(fold) {
    const { from, to, duration } = fold;
    const overlay = this.createFoldOverlay();

    // Create portal effect
    const portal = document.createElement('div');
    portal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(96, 165, 250, 0.8), transparent 70%);
      border: 2px solid rgba(96, 165, 250, 1);
      z-index: 999998;
      transition: all ${duration / 2}ms ease-out;
    `;

    document.body.appendChild(portal);

    return new Promise((resolve) => {
      // Expand portal
      setTimeout(() => {
        portal.style.width = '200vw';
        portal.style.height = '200vw';
      }, 50);

      // Shrink from element into portal
      from.style.transition = `all ${duration / 2}ms ease-in`;
      from.style.transform = 'scale(0)';
      from.style.opacity = '0';

      setTimeout(() => {
        // Expand to element from portal
        to.style.transform = 'scale(0)';
        to.style.opacity = '0';

        setTimeout(() => {
          to.style.transition = `all ${duration / 2}ms ease-out`;
          to.style.transform = 'scale(1)';
          to.style.opacity = '1';

          // Collapse portal
          portal.style.width = '0';
          portal.style.height = '0';

          setTimeout(() => {
            from.style.transform = '';
            from.style.transition = '';
            to.style.transform = '';
            to.style.transition = '';
            portal.remove();
            overlay.remove();
            resolve();
          }, duration / 2);
        }, 50);
      }, duration / 2);
    });
  }

  /**
   * Collapse-style fold
   */
  async collapseFold(fold) {
    const { from, to, duration } = fold;

    return new Promise((resolve) => {
      from.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 1, 1)`;
      from.style.transformOrigin = 'top center';
      from.style.transform = 'scaleY(0) translateY(-100%)';
      from.style.opacity = '0';

      setTimeout(() => {
        to.style.transformOrigin = 'top center';
        to.style.transform = 'scaleY(0) translateY(-100%)';
        to.style.opacity = '0';

        setTimeout(() => {
          to.style.transition = `all ${duration}ms cubic-bezier(0, 0, 0.2, 1)`;
          to.style.transform = 'scaleY(1) translateY(0)';
          to.style.opacity = '1';

          setTimeout(() => {
            from.style.transform = '';
            from.style.transition = '';
            from.style.transformOrigin = '';
            to.style.transform = '';
            to.style.transition = '';
            to.style.transformOrigin = '';
            resolve();
          }, duration);
        }, 50);
      }, duration);
    });
  }

  /**
   * Create fold overlay
   */
  createFoldOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999997;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      activeFolds: this.activeFolds.size,
    };
  }
}

export const foldSpace = new FoldSpace();
