/**
 * WARP GATE
 * Creates wormhole-like transitions between pages
 */

export class WarpGate {
  constructor() {
    this.activeWarps = new Map();
    this.warpSpeed = 1;
  }

  /**
   * Initialize warp gate system
   */
  initialize() {
    console.log('🌀 WARP GATE: Initializing wormhole transitions...');
    return this;
  }

  /**
   * Create warp gate transition
   */
  async warp(fromPage, toPage, options = {}) {
    const warpId = `warp-${Date.now()}`;
    const duration = (options.duration || 1200) / this.warpSpeed;

    const warp = {
      id: warpId,
      from: fromPage,
      to: toPage,
      duration,
      type: options.type || 'spiral',
      startTime: Date.now(),
    };

    this.activeWarps.set(warpId, warp);

    // Execute warp
    switch (warp.type) {
      case 'spiral':
        await this.spiralWarp(warp);
        break;
      case 'tunnel':
        await this.tunnelWarp(warp);
        break;
      case 'quantum':
        await this.quantumWarp(warp);
        break;
      default:
        await this.spiralWarp(warp);
    }

    this.activeWarps.delete(warpId);
    return warpId;
  }

  /**
   * Spiral warp transition
   */
  async spiralWarp(warp) {
    const { from, to, duration } = warp;
    const overlay = this.createWarpOverlay('spiral');

    return new Promise((resolve) => {
      // Spin out from page
      from.style.transition = `all ${duration / 2}ms ease-in`;
      from.style.transform = 'rotate(360deg) scale(0)';
      from.style.opacity = '0';

      setTimeout(() => {
        // Spin in to page
        to.style.transform = 'rotate(-360deg) scale(0)';
        to.style.opacity = '0';

        setTimeout(() => {
          to.style.transition = `all ${duration / 2}ms ease-out`;
          to.style.transform = 'rotate(0deg) scale(1)';
          to.style.opacity = '1';

          setTimeout(() => {
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
   * Tunnel warp transition
   */
  async tunnelWarp(warp) {
    const { from, to, duration } = warp;
    const overlay = this.createWarpOverlay('tunnel');

    // Create tunnel effect
    const tunnel = this.createTunnelEffect();

    return new Promise((resolve) => {
      // Zoom into tunnel
      from.style.transition = `all ${duration / 2}ms ease-in`;
      from.style.transform = 'perspective(1000px) translateZ(-1000px) scale(2)';
      from.style.opacity = '0';

      // Expand tunnel
      tunnel.style.transform = 'scale(2)';

      setTimeout(() => {
        // Zoom out from tunnel
        to.style.transform = 'perspective(1000px) translateZ(-1000px) scale(2)';
        to.style.opacity = '0';

        setTimeout(() => {
          to.style.transition = `all ${duration / 2}ms ease-out`;
          to.style.transform = 'perspective(1000px) translateZ(0) scale(1)';
          to.style.opacity = '1';

          // Collapse tunnel
          tunnel.style.transform = 'scale(1)';

          setTimeout(() => {
            from.style.transform = '';
            from.style.transition = '';
            to.style.transform = '';
            to.style.transition = '';
            tunnel.remove();
            overlay.remove();
            resolve();
          }, duration / 2);
        }, 50);
      }, duration / 2);
    });
  }

  /**
   * Quantum warp transition
   */
  async quantumWarp(warp) {
    const { from, to, duration } = warp;
    const overlay = this.createWarpOverlay('quantum');

    return new Promise((resolve) => {
      // Quantum disintegration
      const particles = this.createQuantumParticles(from);

      from.style.transition = `opacity ${duration / 3}ms ease-in`;
      from.style.opacity = '0';

      // Activate particles
      particles.forEach((particle, i) => {
        setTimeout(() => {
          particle.style.transition = `all ${duration / 2}ms ease-out`;
          particle.style.transform = `
            translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px)
            rotate(${Math.random() * 720}deg)
            scale(0)
          `;
          particle.style.opacity = '0';
        }, i * 10);
      });

      setTimeout(() => {
        // Quantum reconstruction
        const newParticles = this.createQuantumParticles(to);

        newParticles.forEach((particle) => {
          particle.style.transform = `
            translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px)
            rotate(${Math.random() * 720}deg)
            scale(0)
          `;
          particle.style.opacity = '0';
        });

        setTimeout(() => {
          newParticles.forEach((particle, i) => {
            setTimeout(() => {
              particle.style.transition = `all ${duration / 2}ms ease-out`;
              particle.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
              particle.style.opacity = '1';
            }, i * 10);
          });

          to.style.opacity = '0';
          setTimeout(() => {
            to.style.transition = `opacity ${duration / 3}ms ease-out`;
            to.style.opacity = '1';

            setTimeout(() => {
              particles.forEach((p) => p.remove());
              newParticles.forEach((p) => p.remove());
              from.style.transform = '';
              from.style.transition = '';
              to.style.transform = '';
              to.style.transition = '';
              overlay.remove();
              resolve();
            }, duration / 3);
          }, duration / 6);
        }, 50);
      }, duration / 2);
    });
  }

  /**
   * Create warp overlay
   */
  createWarpOverlay(type) {
    const overlay = document.createElement('div');

    let background;
    switch (type) {
      case 'spiral':
        background = 'radial-gradient(circle, transparent 0%, rgba(96, 165, 250, 0.3) 100%)';
        break;
      case 'tunnel':
        background = 'radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(96, 165, 250, 0.4) 100%)';
        break;
      case 'quantum':
        background = 'linear-gradient(45deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2))';
        break;
      default:
        background = 'rgba(0, 0, 0, 0.5)';
    }

    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${background};
      z-index: 999997;
      pointer-events: none;
      animation: warp-shimmer 1s ease-in-out;
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Create tunnel effect
   */
  createTunnelEffect() {
    const tunnel = document.createElement('div');
    tunnel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100vw;
      height: 100vw;
      border-radius: 50%;
      background: radial-gradient(circle,
        transparent 30%,
        rgba(96, 165, 250, 0.1) 40%,
        rgba(96, 165, 250, 0.2) 50%,
        rgba(96, 165, 250, 0.3) 60%,
        transparent 70%
      );
      z-index: 999998;
      pointer-events: none;
      transition: transform 600ms ease-in-out;
    `;

    document.body.appendChild(tunnel);
    return tunnel;
  }

  /**
   * Create quantum particles for element
   */
  createQuantumParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top + Math.random() * rect.height}px;
        width: 4px;
        height: 4px;
        background: rgba(96, 165, 250, 0.8);
        border-radius: 50%;
        z-index: 999999;
        pointer-events: none;
        box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
      `;

      document.body.appendChild(particle);
      particles.push(particle);
    }

    return particles;
  }

  /**
   * Set warp speed
   */
  setWarpSpeed(speed) {
    this.warpSpeed = Math.max(0.5, Math.min(3, speed));
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      activeWarps: this.activeWarps.size,
      warpSpeed: this.warpSpeed,
    };
  }
}

export const warpGate = new WarpGate();
