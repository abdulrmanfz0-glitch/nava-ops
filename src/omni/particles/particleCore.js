/**
 * PARTICLE CORE
 * Core particle system for nanotech UI effects
 */

export class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx || (Math.random() - 0.5) * 2;
    this.vy = options.vy || (Math.random() - 0.5) * 2;
    this.life = options.life || 1.0;
    this.decay = options.decay || 0.01;
    this.size = options.size || 2;
    this.color = options.color || '#60a5fa';
    this.opacity = options.opacity || 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.opacity = this.life;

    // Apply physics
    this.vy += 0.05; // Gravity
    this.vx *= 0.98; // Air resistance
    this.vy *= 0.98;

    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleCore {
  constructor() {
    this.particles = [];
    this.maxParticles = 5000;
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.animationId = null;
  }

  /**
   * Initialize particle system
   */
  initialize() {
    console.log('⚛️ PARTICLE CORE: Initializing nanotech visual engine...');
    this.setupCanvas();
    this.start();
    return this;
  }

  /**
   * Setup particle canvas
   */
  setupCanvas() {
    // Create canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999998;
      mix-blend-mode: screen;
    `;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();

    // Handle window resize
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
   * Start particle simulation
   */
  start() {
    this.isRunning = true;
    this.animate();
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles = this.particles.filter((particle) => {
      const alive = particle.update();
      if (alive) {
        particle.draw(this.ctx);
      }
      return alive;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Emit particles from point
   */
  emit(x, y, count = 20, options = {}) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length < this.maxParticles) {
        this.particles.push(new Particle(x, y, options));
      }
    }
  }

  /**
   * Create burst effect
   */
  burst(x, y, count = 50) {
    const colors = ['#60a5fa', '#818cf8', '#a78bfa', '#ec4899'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;

      this.particles.push(
        new Particle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1 + Math.random() * 2,
          life: 1,
          decay: 0.02,
        })
      );
    }
  }

  /**
   * Create trail effect
   */
  trail(x, y, prevX, prevY, intensity = 5) {
    const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
    const steps = Math.ceil(distance / 10);

    for (let i = 0; i < steps * intensity; i++) {
      const t = i / (steps * intensity);
      const px = prevX + (x - prevX) * t;
      const py = prevY + (y - prevY) * t;

      this.particles.push(
        new Particle(px, py, {
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 1 + Math.random(),
          color: '#60a5fa',
          life: 0.8,
          decay: 0.015,
        })
      );
    }
  }

  /**
   * Create disintegration effect
   */
  disintegrate(element, duration = 1000) {
    const rect = element.getBoundingClientRect();
    const particleCount = 100;

    // Hide original element
    element.style.opacity = '0';

    // Generate particles from element
    for (let i = 0; i < particleCount; i++) {
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;

      this.particles.push(
        new Particle(x, y, {
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 2,
          size: 2 + Math.random() * 3,
          color: this.sampleElementColor(element),
          life: 1,
          decay: 0.01,
        })
      );
    }

    // Restore element after duration
    setTimeout(() => {
      element.style.opacity = '1';
    }, duration);
  }

  /**
   * Sample color from element
   */
  sampleElementColor(element) {
    const styles = window.getComputedStyle(element);
    return styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
      ? styles.backgroundColor
      : styles.color;
  }

  /**
   * Create morphing effect
   */
  morph(fromElement, toElement, duration = 1000) {
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      const startX = fromRect.left + Math.random() * fromRect.width;
      const startY = fromRect.top + Math.random() * fromRect.height;

      const endX = toRect.left + Math.random() * toRect.width;
      const endY = toRect.top + Math.random() * toRect.height;

      const vx = (endX - startX) / (duration / 16);
      const vy = (endY - startY) / (duration / 16);

      this.particles.push(
        new Particle(startX, startY, {
          vx,
          vy,
          size: 2,
          color: '#60a5fa',
          life: 1,
          decay: 16 / duration,
        })
      );
    }
  }

  /**
   * Stop particle system
   */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      particleCount: this.particles.length,
      maxParticles: this.maxParticles,
      isRunning: this.isRunning,
    };
  }
}

export const particleCore = new ParticleCore();
