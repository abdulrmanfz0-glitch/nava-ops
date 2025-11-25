/**
 * TESSERACT - 4D Hypercube Navigation
 * Allows UI elements to exist in a 4-dimensional tesseract structure
 */

export class Tesseract {
  constructor() {
    this.vertices = this.generateTesseractVertices();
    this.edges = this.generateTesseractEdges();
    this.currentRotation = { xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 };
    this.rotationSpeed = 0.01;
    this.isRotating = false;
  }

  /**
   * Generate 4D tesseract vertices
   */
  generateTesseractVertices() {
    const vertices = [];
    for (let i = 0; i < 16; i++) {
      vertices.push({
        x: (i & 1) ? 1 : -1,
        y: (i & 2) ? 1 : -1,
        z: (i & 4) ? 1 : -1,
        w: (i & 8) ? 1 : -1,
      });
    }
    return vertices;
  }

  /**
   * Generate tesseract edges
   */
  generateTesseractEdges() {
    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const diff = i ^ j;
        // Connect vertices that differ by exactly one coordinate
        if (diff && !(diff & (diff - 1))) {
          edges.push([i, j]);
        }
      }
    }
    return edges;
  }

  /**
   * Project 4D point to 3D
   */
  project4Dto3D(point, distance = 4) {
    const w = 1 / (distance - point.w);
    return {
      x: point.x * w,
      y: point.y * w,
      z: point.z * w,
    };
  }

  /**
   * Project 3D point to 2D
   */
  project3Dto2D(point, distance = 4) {
    const scale = distance / (distance + point.z);
    return {
      x: point.x * scale,
      y: point.y * scale,
      scale,
    };
  }

  /**
   * Rotate 4D point
   */
  rotate4D(point, angles) {
    let p = { ...point };

    // Rotate in XY plane
    if (angles.xy) {
      const cos = Math.cos(angles.xy);
      const sin = Math.sin(angles.xy);
      const nx = p.x * cos - p.y * sin;
      const ny = p.x * sin + p.y * cos;
      p.x = nx;
      p.y = ny;
    }

    // Rotate in XZ plane
    if (angles.xz) {
      const cos = Math.cos(angles.xz);
      const sin = Math.sin(angles.xz);
      const nx = p.x * cos - p.z * sin;
      const nz = p.x * sin + p.z * cos;
      p.x = nx;
      p.z = nz;
    }

    // Rotate in XW plane (4D rotation)
    if (angles.xw) {
      const cos = Math.cos(angles.xw);
      const sin = Math.sin(angles.xw);
      const nx = p.x * cos - p.w * sin;
      const nw = p.x * sin + p.w * cos;
      p.x = nx;
      p.w = nw;
    }

    // Rotate in YZ plane
    if (angles.yz) {
      const cos = Math.cos(angles.yz);
      const sin = Math.sin(angles.yz);
      const ny = p.y * cos - p.z * sin;
      const nz = p.y * sin + p.z * cos;
      p.y = ny;
      p.z = nz;
    }

    // Rotate in YW plane (4D rotation)
    if (angles.yw) {
      const cos = Math.cos(angles.yw);
      const sin = Math.sin(angles.yw);
      const ny = p.y * cos - p.w * sin;
      const nw = p.y * sin + p.w * cos;
      p.y = ny;
      p.w = nw;
    }

    // Rotate in ZW plane (4D rotation)
    if (angles.zw) {
      const cos = Math.cos(angles.zw);
      const sin = Math.sin(angles.zw);
      const nz = p.z * cos - p.w * sin;
      const nw = p.z * sin + p.w * cos;
      p.z = nz;
      p.w = nw;
    }

    return p;
  }

  /**
   * Start continuous rotation
   */
  startRotation() {
    this.isRotating = true;
    this.rotationLoop();
  }

  /**
   * Rotation animation loop
   */
  rotationLoop() {
    if (!this.isRotating) return;

    // Update rotation angles
    this.currentRotation.xw += this.rotationSpeed;
    this.currentRotation.yw += this.rotationSpeed * 0.7;
    this.currentRotation.zw += this.rotationSpeed * 0.5;

    // Project tesseract to 2D
    const projected = this.getProjectedVertices();

    // Emit rotation event
    this.emitTesseractEvent(projected);

    requestAnimationFrame(() => this.rotationLoop());
  }

  /**
   * Get projected vertices
   */
  getProjectedVertices() {
    return this.vertices.map((vertex) => {
      const rotated = this.rotate4D(vertex, this.currentRotation);
      const projected3D = this.project4Dto3D(rotated);
      const projected2D = this.project3Dto2D(projected3D);
      return projected2D;
    });
  }

  /**
   * Emit tesseract visualization event
   */
  emitTesseractEvent(projected) {
    const event = new CustomEvent('tesseract-update', {
      detail: {
        vertices: projected,
        edges: this.edges,
        rotation: this.currentRotation,
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Stop rotation
   */
  stopRotation() {
    this.isRotating = false;
  }

  /**
   * Set rotation speed
   */
  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
  }

  /**
   * Map UI element to tesseract vertex
   */
  mapElementToVertex(element, vertexIndex) {
    const projected = this.getProjectedVertices();
    const vertex = projected[vertexIndex];

    if (vertex) {
      element.style.transform = `
        translate(${vertex.x * 100}px, ${vertex.y * 100}px)
        scale(${vertex.scale})
      `;
    }
  }
}

export const tesseract = new Tesseract();
