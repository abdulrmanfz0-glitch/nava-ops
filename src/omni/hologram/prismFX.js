/**
 * PRISM FX
 * Light refraction and chromatic effects for holographic UI
 */

export class PrismFX {
  constructor() {
    this.prisms = [];
    this.lightSources = [];
  }

  /**
   * Initialize prism effects
   */
  initialize() {
    console.log('💎 PRISM FX: Initializing light refraction effects...');
    this.setupGlobalLightSource();
    this.setupEventListeners();
    return this;
  }

  /**
   * Setup global light source
   */
  setupGlobalLightSource() {
    this.lightSources.push({
      id: 'global',
      x: window.innerWidth / 2,
      y: 0,
      intensity: 1,
      color: '#ffffff',
    });

    // Update light source position on mouse move
    document.addEventListener('mousemove', (e) => {
      this.lightSources[0].x = e.clientX;
      this.lightSources[0].y = e.clientY;
      this.updatePrismEffects();
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for custom prism events
    window.addEventListener('create-prism', (e) => {
      const { element, options } = e.detail;
      this.createPrism(element, options);
    });
  }

  /**
   * Create prism effect on element
   */
  createPrism(element, options = {}) {
    const prism = {
      id: `prism-${Date.now()}`,
      element,
      refractiveIndex: options.refractiveIndex || 1.5,
      chromaticAberration: options.chromaticAberration || 0.5,
      intensity: options.intensity || 0.8,
      active: true,
    };

    this.prisms.push(prism);
    this.applyPrismEffect(prism);

    return prism.id;
  }

  /**
   * Apply prism effect to element
   */
  applyPrismEffect(prism) {
    const { element, intensity, chromaticAberration } = prism;

    // Calculate light angle
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const lightSource = this.lightSources[0];
    const angle = Math.atan2(lightSource.y - centerY, lightSource.x - centerX);

    // Create chromatic aberration effect
    const rOffset = Math.cos(angle) * chromaticAberration;
    const gOffset = 0;
    const bOffset = Math.cos(angle + Math.PI) * chromaticAberration;

    element.style.filter = `
      drop-shadow(${rOffset}px ${rOffset}px 2px rgba(255, 0, 0, ${intensity * 0.3}))
      drop-shadow(${gOffset}px ${gOffset}px 2px rgba(0, 255, 0, ${intensity * 0.2}))
      drop-shadow(${bOffset}px ${bOffset}px 2px rgba(0, 0, 255, ${intensity * 0.3}))
    `;

    // Add rainbow reflection gradient
    const gradientAngle = (angle * 180) / Math.PI;
    element.style.backgroundImage = `
      linear-gradient(${gradientAngle}deg,
        rgba(255, 0, 0, ${intensity * 0.1}) 0%,
        rgba(255, 127, 0, ${intensity * 0.1}) 16%,
        rgba(255, 255, 0, ${intensity * 0.1}) 33%,
        rgba(0, 255, 0, ${intensity * 0.1}) 50%,
        rgba(0, 0, 255, ${intensity * 0.1}) 66%,
        rgba(75, 0, 130, ${intensity * 0.1}) 83%,
        rgba(148, 0, 211, ${intensity * 0.1}) 100%
      )
    `;
    element.style.backgroundBlendMode = 'overlay';
  }

  /**
   * Update all prism effects
   */
  updatePrismEffects() {
    this.prisms.forEach((prism) => {
      if (prism.active && prism.element) {
        this.applyPrismEffect(prism);
      }
    });
  }

  /**
   * Create light ray
   */
  createLightRay(fromX, fromY, toX, toY, options = {}) {
    const ray = {
      id: `ray-${Date.now()}`,
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      wavelength: options.wavelength || 500, // nm
      intensity: options.intensity || 1,
      dispersion: options.dispersion || false,
    };

    // Emit light ray event for rendering
    this.emitLightRayEvent(ray);

    return ray.id;
  }

  /**
   * Create rainbow dispersion effect
   */
  createRainbowDispersion(x, y, angle, spread = 30) {
    const colors = [
      { wavelength: 650, color: '#FF0000' }, // Red
      { wavelength: 600, color: '#FF7F00' }, // Orange
      { wavelength: 570, color: '#FFFF00' }, // Yellow
      { wavelength: 510, color: '#00FF00' }, // Green
      { wavelength: 475, color: '#0000FF' }, // Blue
      { wavelength: 445, color: '#4B0082' }, // Indigo
      { wavelength: 400, color: '#9400D3' }, // Violet
    ];

    colors.forEach((colorData, index) => {
      const rayAngle = angle + (index - 3) * (spread / 6);
      const length = 100;

      const toX = x + Math.cos(rayAngle) * length;
      const toY = y + Math.sin(rayAngle) * length;

      this.createLightRay(x, y, toX, toY, {
        wavelength: colorData.wavelength,
        intensity: 0.6,
      });
    });
  }

  /**
   * Create lens flare effect
   */
  createLensFlare(x, y, intensity = 1) {
    const flare = {
      id: `flare-${Date.now()}`,
      x,
      y,
      intensity,
      size: 100,
      timestamp: Date.now(),
    };

    this.emitLensFlareEvent(flare);

    return flare.id;
  }

  /**
   * Apply glass-like refraction to element
   */
  applyGlassRefraction(element, thickness = 10) {
    element.style.backdropFilter = `blur(${thickness}px)`;
    element.style.background = 'rgba(255, 255, 255, 0.1)';
    element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    element.style.boxShadow = `
      inset 0 0 20px rgba(255, 255, 255, 0.1),
      0 8px 32px rgba(0, 0, 0, 0.2)
    `;
  }

  /**
   * Emit light ray event
   */
  emitLightRayEvent(ray) {
    const event = new CustomEvent('light-ray', {
      detail: ray,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit lens flare event
   */
  emitLensFlareEvent(flare) {
    const event = new CustomEvent('lens-flare', {
      detail: flare,
    });
    window.dispatchEvent(event);
  }

  /**
   * Remove prism effect
   */
  removePrism(prismId) {
    const index = this.prisms.findIndex((p) => p.id === prismId);
    if (index !== -1) {
      const prism = this.prisms[index];
      if (prism.element) {
        prism.element.style.filter = '';
        prism.element.style.backgroundImage = '';
        prism.element.style.backgroundBlendMode = '';
      }
      this.prisms.splice(index, 1);
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      activePrisms: this.prisms.filter((p) => p.active).length,
      lightSources: this.lightSources.length,
    };
  }
}

export const prismFX = new PrismFX();
