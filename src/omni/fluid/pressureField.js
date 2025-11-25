/**
 * PRESSURE FIELD
 * Simulates pressure waves and field dynamics in the UI
 */

export class PressureField {
  constructor() {
    this.pressurePoints = [];
    this.maxPressurePoints = 50;
    this.propagationSpeed = 5;
  }

  /**
   * Initialize pressure field
   */
  initialize() {
    console.log('⚡ PRESSURE FIELD: Initializing pressure dynamics...');
    this.setupEventListeners();
    return this;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    document.addEventListener('mousedown', (e) => {
      this.createPressureWave(e.clientX, e.clientY, 100);
    });

    document.addEventListener('touchstart', (e) => {
      Array.from(e.touches).forEach((touch) => {
        this.createPressureWave(touch.clientX, touch.clientY, 80);
      });
    });
  }

  /**
   * Create pressure wave
   */
  createPressureWave(x, y, maxRadius) {
    const wave = {
      x,
      y,
      radius: 0,
      maxRadius,
      intensity: 1,
      decay: 0.02,
      timestamp: Date.now(),
    };

    this.pressurePoints.push(wave);

    if (this.pressurePoints.length > this.maxPressurePoints) {
      this.pressurePoints.shift();
    }

    this.propagateWave(wave);
  }

  /**
   * Propagate pressure wave
   */
  propagateWave(wave) {
    const propagate = () => {
      if (wave.radius >= wave.maxRadius || wave.intensity <= 0) {
        return;
      }

      wave.radius += this.propagationSpeed;
      wave.intensity -= wave.decay;

      // Emit pressure wave event
      this.emitPressureEvent(wave);

      // Affect nearby elements
      this.affectElements(wave);

      requestAnimationFrame(propagate);
    };

    propagate();
  }

  /**
   * Affect nearby elements with pressure
   */
  affectElements(wave) {
    const elements = document.elementsFromPoint(wave.x, wave.y);

    elements.forEach((element) => {
      if (!element || element === document.body || element === document.documentElement) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(centerX - wave.x, 2) + Math.pow(centerY - wave.y, 2)
      );

      if (distance <= wave.radius && distance >= wave.radius - this.propagationSpeed) {
        this.applyPressureToElement(element, wave, distance);
      }
    });
  }

  /**
   * Apply pressure effect to element
   */
  applyPressureToElement(element, wave, distance) {
    const force = wave.intensity * (1 - distance / wave.maxRadius);

    if (force < 0.1) return;

    // Create visual pressure effect
    element.style.transition = 'transform 200ms ease-out';
    element.style.transform = `scale(${1 + force * 0.05})`;

    setTimeout(() => {
      element.style.transform = '';
    }, 200);
  }

  /**
   * Calculate pressure at point
   */
  getPressureAtPoint(x, y) {
    let totalPressure = 0;

    this.pressurePoints.forEach((wave) => {
      const distance = Math.sqrt(Math.pow(x - wave.x, 2) + Math.pow(y - wave.y, 2));

      if (distance <= wave.radius && distance >= wave.radius - this.propagationSpeed * 2) {
        const pressure = wave.intensity * (1 - distance / wave.maxRadius);
        totalPressure += pressure;
      }
    });

    return totalPressure;
  }

  /**
   * Emit pressure event
   */
  emitPressureEvent(wave) {
    const event = new CustomEvent('pressure-wave', {
      detail: wave,
    });
    window.dispatchEvent(event);
  }

  /**
   * Clear inactive waves
   */
  cleanup() {
    this.pressurePoints = this.pressurePoints.filter(
      (wave) => wave.radius < wave.maxRadius && wave.intensity > 0
    );
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      activeWaves: this.pressurePoints.length,
      propagationSpeed: this.propagationSpeed,
    };
  }
}

export const pressureField = new PressureField();
