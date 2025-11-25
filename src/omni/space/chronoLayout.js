/**
 * CHRONO LAYOUT
 * Time-based UI transitions and temporal navigation
 */

export class ChronoLayout {
  constructor() {
    this.timelineStates = new Map();
    this.currentTimeIndex = 0;
    this.isTimeWarping = false;
    this.temporalSnapshots = [];
  }

  /**
   * Initialize chrono layout system
   */
  initialize() {
    console.log('⏰ CHRONO LAYOUT: Initializing temporal navigation...');
    this.captureInitialState();
    this.setupTimeWatchers();
    return this;
  }

  /**
   * Capture initial UI state
   */
  captureInitialState() {
    this.captureSnapshot('initial');
  }

  /**
   * Capture UI snapshot
   */
  captureSnapshot(label = null) {
    const snapshot = {
      id: `snapshot-${Date.now()}`,
      label: label || `t${this.currentTimeIndex}`,
      timestamp: Date.now(),
      scrollPosition: window.scrollY,
      activeElements: this.getActiveElements(),
      layoutState: this.captureLayoutState(),
    };

    this.temporalSnapshots.push(snapshot);
    this.currentTimeIndex++;

    // Keep only last 20 snapshots
    if (this.temporalSnapshots.length > 20) {
      this.temporalSnapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get currently active/visible elements
   */
  getActiveElements() {
    const active = [];
    const elements = document.querySelectorAll('[data-temporal]');

    elements.forEach((el) => {
      if (this.isElementVisible(el)) {
        active.push({
          id: el.id || el.dataset.temporal,
          rect: el.getBoundingClientRect(),
        });
      }
    });

    return active;
  }

  /**
   * Check if element is visible
   */
  isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  /**
   * Capture layout state
   */
  captureLayoutState() {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      route: window.location.pathname,
    };
  }

  /**
   * Time warp to snapshot
   */
  async timeWarpTo(snapshotId, duration = 800) {
    const snapshot = this.temporalSnapshots.find((s) => s.id === snapshotId);
    if (!snapshot) return;

    this.isTimeWarping = true;

    // Emit time warp start event
    this.emitTimeWarpEvent('start', snapshot);

    // Animate time warp
    await this.animateTimeWarp(snapshot, duration);

    // Restore snapshot state
    this.restoreSnapshot(snapshot);

    this.isTimeWarping = false;

    // Emit time warp complete event
    this.emitTimeWarpEvent('complete', snapshot);
  }

  /**
   * Animate time warp effect
   */
  animateTimeWarp(snapshot, duration) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, transparent 0%, rgba(0, 100, 255, 0.3) 100%);
        pointer-events: none;
        z-index: 999999;
        opacity: 0;
        transition: opacity ${duration / 2}ms ease-in-out;
      `;

      document.body.appendChild(overlay);

      // Fade in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });

      // Fade out
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, duration / 2);
      }, duration / 2);
    });
  }

  /**
   * Restore snapshot state
   */
  restoreSnapshot(snapshot) {
    // Restore scroll position
    window.scrollTo({
      top: snapshot.scrollPosition,
      behavior: 'smooth',
    });

    // Emit state restoration event
    const event = new CustomEvent('temporal-restore', {
      detail: snapshot,
    });
    window.dispatchEvent(event);
  }

  /**
   * Setup time watchers
   */
  setupTimeWatchers() {
    // Watch for significant UI changes
    let lastCaptureTime = Date.now();

    window.addEventListener('scroll', () => {
      if (Date.now() - lastCaptureTime > 5000) {
        this.captureSnapshot();
        lastCaptureTime = Date.now();
      }
    });

    // Watch for route changes
    window.addEventListener('popstate', () => {
      this.captureSnapshot('navigation');
    });
  }

  /**
   * Create temporal echo effect
   */
  createTemporalEcho(element, duration = 1000) {
    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.5';
    clone.style.filter = 'blur(2px)';
    clone.style.transition = `all ${duration}ms ease-out`;

    element.parentElement.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.opacity = '0';
      clone.style.transform = 'translateZ(-100px) scale(0.9)';
    });

    setTimeout(() => {
      clone.remove();
    }, duration);
  }

  /**
   * Emit time warp event
   */
  emitTimeWarpEvent(phase, snapshot) {
    const event = new CustomEvent('time-warp', {
      detail: { phase, snapshot },
    });
    window.dispatchEvent(event);
  }

  /**
   * Get temporal statistics
   */
  getStats() {
    return {
      snapshots: this.temporalSnapshots.length,
      currentIndex: this.currentTimeIndex,
      isWarping: this.isTimeWarping,
    };
  }

  /**
   * Clear temporal history
   */
  clearHistory() {
    this.temporalSnapshots = [];
    this.currentTimeIndex = 0;
  }
}

export const chronoLayout = new ChronoLayout();
