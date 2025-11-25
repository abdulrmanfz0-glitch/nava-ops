/**
 * DUST SIMULATION
 * Ambient particle dust that reacts to UI interactions
 */

export class DustSimulation {
  constructor() {
    this.dustParticles = [];
    this.maxDust = 200;
    this.canvas = null;
    this.ctx = null;
    this.isActive = false;
    this.mousePosition = { x: 0, y: 0 };
  }

  /**
   * Initialize dust simulation
   */
  initialize() {
    console.log('✨ DUST SIMULATION: Initializing ambient particles...');
    this.setupCanvas();
    this.generateDust();
    this.setupInteractions();
    this.start();
    return this;
  }

  /**
   * Setup dust canvas
   */
  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dust-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.4;
      mix-blend-mode: screen;
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
   * Generate initial dust particles
   */
  generateDust() {
    for (let i = 0; i < this.maxDust; i++) {
      this.dustParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        baseOpacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  /**
   * Setup interaction handlers
   */
  setupInteractions() {
    document.addEventListener('mousemove', (e) => {
      this.mousePosition = { x: e.clientX, y: e.clientY };
      this.repelDust(e.clientX, e.clientY, 100);
    });

    document.addEventListener('click', (e) => {
      this.burstDust(e.clientX, e.clientY);
    });
  }

  /**
   * Start simulation
   */
  start() {
    this.isActive = true;
    this.animate();
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.dustParticles.forEach((dust) => {
      // Update position
      dust.x += dust.vx;
      dust.y += dust.vy;

      // Add slight float
      dust.x += Math.sin(Date.now() * 0.001 + dust.y * 0.01) * 0.1;
      dust.y += Math.cos(Date.now() * 0.001 + dust.x * 0.01) * 0.1;

      // Wrap around screen
      if (dust.x < 0) dust.x = this.canvas.width;
      if (dust.x > this.canvas.width) dust.x = 0;
      if (dust.y < 0) dust.y = this.canvas.height;
      if (dust.y > this.canvas.height) dust.y = 0;

      // Fade back to base opacity
      dust.opacity += (dust.baseOpacity - dust.opacity) * 0.05;

      // Draw particle
      this.ctx.save();
      this.ctx.globalAlpha = dust.opacity;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    requestAnimationFrame(() => this.animate());
  }

  /**
   * Repel dust from point
   */
  repelDust(x, y, radius) {
    this.dustParticles.forEach((dust) => {
      const dx = dust.x - x;
      const dy = dust.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const force = (1 - distance / radius) * 2;
        dust.vx += (dx / distance) * force;
        dust.vy += (dy / distance) * force;
        dust.opacity = Math.min(dust.opacity + force * 0.3, 1);
      }
    });
  }

  /**
   * Burst dust outward
   */
  burstDust(x, y) {
    this.dustParticles.forEach((dust) => {
      const dx = dust.x - x;
      const dy = dust.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (1 - distance / 150) * 5;
        dust.vx += (dx / distance) * force;
        dust.vy += (dy / distance) * force;
        dust.opacity = 1;
      }
    });
  }

  /**
   * Attract dust to point
   */
  attractDust(x, y, radius = 200) {
    this.dustParticles.forEach((dust) => {
      const dx = x - dust.x;
      const dy = y - dust.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 10) {
        const force = (1 - distance / radius) * 0.5;
        dust.vx += (dx / distance) * force;
        dust.vy += (dy / distance) * force;
      }
    });
  }

  /**
   * Stop simulation
   */
  stop() {
    this.isActive = false;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      dustCount: this.dustParticles.length,
      isActive: this.isActive,
    };
  }
}

export const dustSimulation = new DustSimulation();
