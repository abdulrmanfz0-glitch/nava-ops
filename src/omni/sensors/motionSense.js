/**
 * MOTION SENSE
 * Cursor motion and interaction pattern detection
 */

export class MotionSense {
  constructor() {
    this.motionData = {
      velocity: 0,
      acceleration: 0,
      direction: 0,
      pattern: 'idle',
      pressure: 0,
      rhythm: 'steady',
    };
    this.history = [];
    this.maxHistory = 50;
    this.isActive = false;
  }

  /**
   * Initialize motion sensing
   */
  initialize() {
    console.log('🎯 MOTION SENSE: Initializing motion detection...');
    this.setupEventListeners();
    this.isActive = true;
    return this;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    let lastPosition = { x: 0, y: 0, time: Date.now() };
    let lastVelocity = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = now - lastPosition.time;

      if (dt === 0) return;

      // Calculate velocity
      const dx = e.clientX - lastPosition.x;
      const dy = e.clientY - lastPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt;

      // Calculate acceleration
      const acceleration = (velocity - lastVelocity) / dt;

      // Calculate direction
      const direction = Math.atan2(dy, dx);

      // Update motion data
      this.motionData.velocity = velocity;
      this.motionData.acceleration = acceleration;
      this.motionData.direction = direction;

      // Record in history
      this.history.push({
        x: e.clientX,
        y: e.clientY,
        velocity,
        acceleration,
        timestamp: now,
      });

      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      // Analyze patterns
      this.analyzePattern();
      this.analyzeRhythm();

      // Emit motion event
      this.emitMotionEvent();

      lastPosition = { x: e.clientX, y: e.clientY, time: now };
      lastVelocity = velocity;
    });

    // Track click pressure simulation
    document.addEventListener('mousedown', () => {
      this.motionData.pressure = 1;
    });

    document.addEventListener('mouseup', () => {
      this.motionData.pressure = 0;
    });

    // Detect drag behavior
    let isDragging = false;
    document.addEventListener('mousedown', () => {
      isDragging = true;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        this.detectDragPattern();
        isDragging = false;
      }
    });
  }

  /**
   * Analyze motion pattern
   */
  analyzePattern() {
    if (this.history.length < 10) return;

    const recent = this.history.slice(-10);
    const avgVelocity = recent.reduce((sum, p) => sum + p.velocity, 0) / recent.length;

    // Classify pattern
    if (avgVelocity < 0.1) {
      this.motionData.pattern = 'idle';
    } else if (avgVelocity < 0.5) {
      this.motionData.pattern = 'precise';
    } else if (avgVelocity < 2) {
      this.motionData.pattern = 'normal';
    } else if (avgVelocity < 5) {
      this.motionData.pattern = 'quick';
    } else {
      this.motionData.pattern = 'rapid';
    }

    // Detect circular motion
    if (this.isCircularMotion(recent)) {
      this.motionData.pattern = 'circular';
    }

    // Detect back-and-forth
    if (this.isBackAndForth(recent)) {
      this.motionData.pattern = 'searching';
    }
  }

  /**
   * Check if motion is circular
   */
  isCircularMotion(points) {
    if (points.length < 8) return false;

    // Calculate center
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Calculate average radius
    const radii = points.map((p) =>
      Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
    );
    const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;

    // Check radius consistency
    const radiusVariance =
      radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) / radii.length;

    return radiusVariance < avgRadius * 0.2;
  }

  /**
   * Check if motion is back-and-forth
   */
  isBackAndForth(points) {
    if (points.length < 6) return false;

    let directionChanges = 0;
    let lastDirection = null;

    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const direction = dx > 0 ? 'right' : 'left';

      if (lastDirection && direction !== lastDirection) {
        directionChanges++;
      }

      lastDirection = direction;
    }

    return directionChanges >= 3;
  }

  /**
   * Analyze interaction rhythm
   */
  analyzeRhythm() {
    if (this.history.length < 20) return;

    const recent = this.history.slice(-20);
    const velocities = recent.map((p) => p.velocity);

    // Calculate variance
    const avg = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const variance = velocities.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / velocities.length;
    const stdDev = Math.sqrt(variance);

    // Classify rhythm
    if (stdDev < avg * 0.2) {
      this.motionData.rhythm = 'steady';
    } else if (stdDev < avg * 0.5) {
      this.motionData.rhythm = 'variable';
    } else {
      this.motionData.rhythm = 'erratic';
    }
  }

  /**
   * Detect drag pattern
   */
  detectDragPattern() {
    if (this.history.length < 5) return;

    const dragPoints = this.history.slice(-5);
    const totalDistance = dragPoints.reduce((sum, point, i) => {
      if (i === 0) return 0;
      const prev = dragPoints[i - 1];
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    const dragData = {
      distance: totalDistance,
      duration: dragPoints[dragPoints.length - 1].timestamp - dragPoints[0].timestamp,
      pattern: this.motionData.pattern,
    };

    this.emitDragEvent(dragData);
  }

  /**
   * Emit motion event
   */
  emitMotionEvent() {
    const event = new CustomEvent('motion-detected', {
      detail: this.motionData,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit drag event
   */
  emitDragEvent(data) {
    const event = new CustomEvent('drag-pattern', {
      detail: data,
    });
    window.dispatchEvent(event);
  }

  /**
   * Get motion statistics
   */
  getStats() {
    return {
      isActive: this.isActive,
      ...this.motionData,
      historySize: this.history.length,
    };
  }

  /**
   * Stop motion sensing
   */
  stop() {
    this.isActive = false;
  }
}

export const motionSense = new MotionSense();
