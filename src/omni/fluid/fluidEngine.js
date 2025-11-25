/**
 * FLUID ENGINE
 * Real-time fluid simulation overlay for organic UI interactions
 */

export class FluidEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.grid = [];
    this.gridSize = 20;
    this.viscosity = 0.98;
    this.damping = 0.95;
    this.isRunning = false;
  }

  /**
   * Initialize fluid engine
   */
  initialize() {
    console.log('💠 FLUID ENGINE: Initializing real-time fluid simulation...');
    this.setupCanvas();
    this.initializeGrid();
    this.setupInteractions();
    this.start();
    return this;
  }

  /**
   * Setup fluid canvas
   */
  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fluid-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999997;
      mix-blend-mode: screen;
      opacity: 0.15;
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
    this.initializeGrid();
  }

  /**
   * Initialize fluid grid
   */
  initializeGrid() {
    this.grid = [];
    const cols = Math.ceil(this.canvas.width / this.gridSize);
    const rows = Math.ceil(this.canvas.height / this.gridSize);

    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        this.grid[y][x] = {
          vx: 0,
          vy: 0,
          pressure: 0,
        };
      }
    }
  }

  /**
   * Setup interaction handlers
   */
  setupInteractions() {
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);

      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;

      this.addForce(e.clientX, e.clientY, vx * 5, vy * 5);

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    });

    document.addEventListener('click', (e) => {
      this.createRipple(e.clientX, e.clientY, 50);
    });

    document.addEventListener('scroll', () => {
      this.createWave(window.scrollY % this.canvas.height, 30);
    });
  }

  /**
   * Add force to fluid at position
   */
  addForce(x, y, forceX, forceY) {
    const gridX = Math.floor(x / this.gridSize);
    const gridY = Math.floor(y / this.gridSize);

    if (this.grid[gridY] && this.grid[gridY][gridX]) {
      this.grid[gridY][gridX].vx += forceX;
      this.grid[gridY][gridX].vy += forceY;
      this.grid[gridY][gridX].pressure += Math.abs(forceX) + Math.abs(forceY);
    }
  }

  /**
   * Create ripple effect
   */
  createRipple(x, y, radius) {
    const gridX = Math.floor(x / this.gridSize);
    const gridY = Math.floor(y / this.gridSize);
    const gridRadius = Math.ceil(radius / this.gridSize);

    for (let dy = -gridRadius; dy <= gridRadius; dy++) {
      for (let dx = -gridRadius; dx <= gridRadius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= gridRadius) {
          const gx = gridX + dx;
          const gy = gridY + dy;

          if (this.grid[gy] && this.grid[gy][gx]) {
            const force = (1 - distance / gridRadius) * 10;
            const angle = Math.atan2(dy, dx);

            this.grid[gy][gx].vx += Math.cos(angle) * force;
            this.grid[gy][gx].vy += Math.sin(angle) * force;
            this.grid[gy][gx].pressure += force;
          }
        }
      }
    }
  }

  /**
   * Create wave effect
   */
  createWave(y, amplitude) {
    const gridY = Math.floor(y / this.gridSize);

    if (!this.grid[gridY]) return;

    for (let x = 0; x < this.grid[gridY].length; x++) {
      const phase = (x / this.grid[gridY].length) * Math.PI * 2;
      const force = Math.sin(phase + Date.now() * 0.005) * amplitude;

      this.grid[gridY][x].vy += force;
      this.grid[gridY][x].pressure += Math.abs(force);
    }
  }

  /**
   * Start fluid simulation
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

    this.updateFluid();
    this.renderFluid();

    requestAnimationFrame(() => this.animate());
  }

  /**
   * Update fluid physics
   */
  updateFluid() {
    // Apply pressure diffusion
    for (let y = 1; y < this.grid.length - 1; y++) {
      for (let x = 1; x < this.grid[y].length - 1; x++) {
        const cell = this.grid[y][x];

        // Velocity diffusion
        const avgVx =
          (this.grid[y - 1][x].vx +
            this.grid[y + 1][x].vx +
            this.grid[y][x - 1].vx +
            this.grid[y][x + 1].vx) /
          4;

        const avgVy =
          (this.grid[y - 1][x].vy +
            this.grid[y + 1][x].vy +
            this.grid[y][x - 1].vy +
            this.grid[y][x + 1].vy) /
          4;

        cell.vx = cell.vx * (1 - this.viscosity) + avgVx * this.viscosity;
        cell.vy = cell.vy * (1 - this.viscosity) + avgVy * this.viscosity;

        // Apply damping
        cell.vx *= this.damping;
        cell.vy *= this.damping;
        cell.pressure *= this.damping;
      }
    }
  }

  /**
   * Render fluid
   */
  renderFluid() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const cell = this.grid[y][x];

        if (Math.abs(cell.vx) > 0.1 || Math.abs(cell.vy) > 0.1 || cell.pressure > 0.1) {
          const intensity = Math.min(
            Math.sqrt(cell.vx * cell.vx + cell.vy * cell.vy + cell.pressure) / 10,
            1
          );

          // Draw velocity field
          this.ctx.save();
          this.ctx.globalAlpha = intensity * 0.5;

          // Color based on velocity direction
          const hue = (Math.atan2(cell.vy, cell.vx) * 180) / Math.PI + 180;
          this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

          this.ctx.fillRect(
            x * this.gridSize,
            y * this.gridSize,
            this.gridSize,
            this.gridSize
          );

          this.ctx.restore();
        }
      }
    }
  }

  /**
   * Stop fluid simulation
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Get statistics
   */
  getStats() {
    let activeGridcells = 0;

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        if (Math.abs(cell.vx) > 0.1 || Math.abs(cell.vy) > 0.1) {
          activeCells++;
        }
      });
    });

    return {
      gridSize: `${this.grid[0]?.length || 0}x${this.grid.length}`,
      activeCells,
      isRunning: this.isRunning,
    };
  }
}

export const fluidEngine = new FluidEngine();
