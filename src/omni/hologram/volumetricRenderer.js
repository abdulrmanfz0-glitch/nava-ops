/**
 * VOLUMETRIC RENDERER
 * Creates volumetric 3D projection effects for UI elements
 */

export class VolumetricRenderer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.volumes = new Map();
    this.isRendering = false;
  }

  /**
   * Initialize volumetric renderer
   */
  initialize() {
    console.log('🔮 VOLUMETRIC RENDERER: Initializing 3D projections...');
    this.setupCanvas();
    this.start();
    return this;
  }

  /**
   * Setup rendering canvas
   */
  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'volumetric-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999996;
      mix-blend-mode: screen;
      opacity: 0.6;
    `;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  /**
   * Resize canvas
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Create volumetric projection
   */
  createVolume(x, y, size, options = {}) {
    const volume = {
      id: `vol-${Date.now()}-${Math.random()}`,
      x,
      y,
      z: options.z || 0,
      size,
      depth: options.depth || 100,
      color: options.color || '#60a5fa',
      intensity: options.intensity || 1,
      rotation: options.rotation || { x: 0, y: 0, z: 0 },
      animating: true,
      timestamp: Date.now(),
    };

    this.volumes.set(volume.id, volume);

    // Auto-remove after duration
    if (options.duration) {
      setTimeout(() => {
        this.volumes.delete(volume.id);
      }, options.duration);
    }

    return volume.id;
  }

  /**
   * Create holographic grid
   */
  createHoloGrid(element, options = {}) {
    const rect = element.getBoundingClientRect();
    const gridSize = options.gridSize || 20;

    const volumeId = this.createVolume(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      Math.max(rect.width, rect.height),
      {
        depth: 50,
        color: options.color || '#60a5fa',
        intensity: options.intensity || 0.6,
        type: 'grid',
        gridSize,
      }
    );

    return volumeId;
  }

  /**
   * Create volumetric beam
   */
  createBeam(fromX, fromY, toX, toY, options = {}) {
    const volume = {
      id: `beam-${Date.now()}`,
      type: 'beam',
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      width: options.width || 2,
      color: options.color || '#60a5fa',
      intensity: options.intensity || 1,
      pulse: options.pulse !== false,
      timestamp: Date.now(),
    };

    this.volumes.set(volume.id, volume);

    if (options.duration) {
      setTimeout(() => {
        this.volumes.delete(volume.id);
      }, options.duration);
    }

    return volume.id;
  }

  /**
   * Start rendering
   */
  start() {
    this.isRendering = true;
    this.render();
  }

  /**
   * Render loop
   */
  render() {
    if (!this.isRendering) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.volumes.forEach((volume) => {
      if (volume.type === 'beam') {
        this.renderBeam(volume);
      } else if (volume.type === 'grid') {
        this.renderGrid(volume);
      } else {
        this.renderVolume(volume);
      }
    });

    requestAnimationFrame(() => this.render());
  }

  /**
   * Render standard volume
   */
  renderVolume(volume) {
    const { x, y, size, depth, color, intensity, rotation } = volume;

    this.ctx.save();

    // Calculate 3D projection
    const layers = 5;
    const layerDepth = depth / layers;

    for (let i = 0; i < layers; i++) {
      const layerZ = i * layerDepth;
      const scale = 1 - layerZ / depth;
      const layerSize = size * scale;
      const layerOpacity = (intensity / layers) * (1 - i / layers);

      this.ctx.globalAlpha = layerOpacity;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;

      // Rotate based on rotation values
      this.ctx.translate(x, y);
      this.ctx.rotate((rotation.z * Math.PI) / 180);

      // Draw volumetric layer
      this.ctx.beginPath();
      this.ctx.arc(0, 0, layerSize / 2, 0, Math.PI * 2);
      this.ctx.stroke();

      // Reset transform
      this.ctx.rotate((-rotation.z * Math.PI) / 180);
      this.ctx.translate(-x, -y);
    }

    this.ctx.restore();

    // Update rotation for animation
    if (volume.animating) {
      volume.rotation.z += 0.5;
    }
  }

  /**
   * Render holographic grid
   */
  renderGrid(volume) {
    const { x, y, size, gridSize, color, intensity } = volume;

    this.ctx.save();
    this.ctx.globalAlpha = intensity * 0.4;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;

    const halfSize = size / 2;
    const lines = Math.floor(size / gridSize);

    // Draw grid
    for (let i = -lines / 2; i <= lines / 2; i++) {
      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(x - halfSize, y + i * gridSize);
      this.ctx.lineTo(x + halfSize, y + i * gridSize);
      this.ctx.stroke();

      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(x + i * gridSize, y - halfSize);
      this.ctx.lineTo(x + i * gridSize, y + halfSize);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Render volumetric beam
   */
  renderBeam(beam) {
    const { from, to, width, color, intensity, pulse } = beam;

    this.ctx.save();

    // Calculate pulse effect
    let opacity = intensity;
    if (pulse) {
      const time = Date.now() - beam.timestamp;
      opacity *= 0.5 + 0.5 * Math.sin(time * 0.005);
    }

    this.ctx.globalAlpha = opacity;

    // Draw beam with gradient
    const gradient = this.ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, this.adjustColorOpacity(color, 0.8));
    gradient.addColorStop(1, this.adjustColorOpacity(color, 0.3));

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();

    // Draw glow
    this.ctx.globalAlpha = opacity * 0.3;
    this.ctx.lineWidth = width * 3;
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Adjust color opacity
   */
  adjustColorOpacity(color, opacity) {
    // Simple implementation - assumes hex color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * Remove volume
   */
  removeVolume(volumeId) {
    this.volumes.delete(volumeId);
  }

  /**
   * Clear all volumes
   */
  clearAll() {
    this.volumes.clear();
  }

  /**
   * Stop rendering
   */
  stop() {
    this.isRendering = false;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      volumes: this.volumes.size,
      isRendering: this.isRendering,
    };
  }
}

export const volumetricRenderer = new VolumetricRenderer();
