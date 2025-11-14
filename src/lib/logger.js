// src/lib/logger.js
/**
 * Advanced Logging System for Nava Ops
 * Provides centralized error tracking, performance monitoring, and analytics
 */

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.sentryEnabled = !!import.meta.env.VITE_SENTRY_DSN;
  }

  log(level, message, data = {}) {
    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Store in memory
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development only
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}]`, message, data);
    }

    // Send to external service (Sentry, LogRocket, etc.)
    if (this.sentryEnabled && level === 'error') {
      this.sendToSentry(logEntry);
    }

    // Store critical errors in localStorage for offline support
    if (level === 'error') {
      this.storeErrorLocally(logEntry);
    }

    return logEntry;
  }

  info(message, data) {
    return this.log('info', message, data);
  }

  warn(message, data) {
    return this.log('warn', message, data);
  }

  error(message, data) {
    return this.log('error', message, data);
  }

  fatal(message, data, error) {
    const logEntry = this.log('error', message, { ...data, fatal: true, error: error?.message, stack: error?.stack });
    // Could trigger additional alerts for fatal errors
    return logEntry;
  }

  debug(message, data) {
    if (import.meta.env.DEV) {
      return this.log('debug', message, data);
    }
  }

  // Performance monitoring
  startTimer(label) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
        return duration;
      }
    };
  }

  // Store errors locally for offline analysis
  storeErrorLocally(logEntry) {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('nava_error_logs') || '[]');
      storedErrors.push(logEntry);

      // Keep only last 50 errors
      if (storedErrors.length > 50) {
        storedErrors.shift();
      }

      localStorage.setItem('nava_error_logs', JSON.stringify(storedErrors));
    } catch (e) {
      // Silent fail - can't log errors in error logger
    }
  }

  // Get all logs
  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('nava_error_logs');
  }

  // Export logs as JSON
  exportLogs() {
    const dataStr = JSON.stringify(this.logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `nava-logs-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Send to Sentry (placeholder - implement when Sentry is configured)
  sendToSentry(logEntry) {
    // TODO: Implement Sentry integration when VITE_SENTRY_DSN is configured
    if (import.meta.env.DEV) {
      console.log('Would send to Sentry:', logEntry);
    }
  }
}

// Error Boundary Logger
export class ErrorBoundaryLogger {
  static logError(error, errorInfo) {
    const errorData = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack,
      },
      location: window.location.href,
      timestamp: new Date().toISOString(),
    };

    logger.error('React Error Boundary Caught Error', errorData);

    // Store in session for error reporting
    try {
      const sessionErrors = JSON.parse(sessionStorage.getItem('react_errors') || '[]');
      sessionErrors.push(errorData);
      sessionStorage.setItem('react_errors', JSON.stringify(sessionErrors.slice(-10))); // Keep last 10
    } catch (e) {
      // Silent fail
    }
  }

  static getSessionErrors() {
    try {
      return JSON.parse(sessionStorage.getItem('react_errors') || '[]');
    } catch {
      return [];
    }
  }

  static clearSessionErrors() {
    sessionStorage.removeItem('react_errors');
  }
}

/**
 * NAVA OPS Performance Logger v2
 *
 * A comprehensive performance monitoring system with:
 * - Precision timing with context support
 * - Threshold-based warnings
 * - Metrics storage and reporting
 * - Web Vitals integration ready
 * - Zero-overhead when not actively measuring
 */
export class PerformanceLogger {
  static timers = new Map();      // Active timers: label → { start, context }
  static metrics = new Map();     // Completed measurements: label → [{ duration, timestamp, context }]
  static config = {
    globalThreshold: 1000,        // Default warning threshold (ms)
    maxMetricsPerLabel: 100,      // Limit stored metrics per label
    logSlowOperations: true,      // Auto-log slow operations
    captureStackTrace: false      // Capture stack traces (expensive)
  };

  /**
   * Start timing an operation
   * @param {string} label - Unique identifier for this measurement
   * @param {Object} context - Optional metadata (component, user, action, etc.)
   */
  static start(label, context = {}) {
    this.timers.set(label, {
      start: performance.now(),
      context: { ...context, startedAt: new Date().toISOString() }
    });
  }

  /**
   * End timing and log results
   * @param {string} label - Timer label to end
   * @param {Object} options - Configuration { threshold, logLevel, context }
   * @returns {number|null} Duration in milliseconds
   */
  static end(label, options = {}) {
    const timer = this.timers.get(label);
    if (!timer) {
      if (import.meta.env.DEV) {
        console.warn(`⚠️ PerformanceLogger: No timer found for "${label}"`);
      }
      return null;
    }

    const duration = performance.now() - timer.start;
    const threshold = options.threshold ?? options ?? this.config.globalThreshold;
    const context = { ...timer.context, ...options.context };
    const logLevel = options.logLevel || 'info';

    // Store metric
    this._storeMetric(label, { duration, timestamp: Date.now(), context });

    // Remove timer
    this.timers.delete(label);

    // Log result
    const isSlowOperation = duration > threshold;
    const emoji = isSlowOperation ? '⚠️' : '✅';
    const contextStr = this._formatContext(context);

    if (isSlowOperation && this.config.logSlowOperations) {
      logger.warn(
        `${emoji} Performance: ${label} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)${contextStr}`,
        { duration, threshold, context, label }
      );
    } else if (logLevel !== 'silent') {
      logger[logLevel](
        `${emoji} Performance: ${label} completed in ${duration.toFixed(2)}ms${contextStr}`,
        { duration, label, context }
      );
    }

    return duration;
  }

  /**
   * Measure a synchronous function
   * @param {string} label - Measurement label
   * @param {Function} fn - Function to measure
   * @param {Object} options - Configuration options
   * @returns {*} Function result
   */
  static measure(label, fn, options = {}) {
    this.start(label, options.context);
    try {
      const result = fn();
      this.end(label, options);
      return result;
    } catch (error) {
      this.end(label, { ...options, context: { ...options.context, error: error.message } });
      throw error;
    }
  }

  /**
   * Measure an asynchronous function
   * @param {string} label - Measurement label
   * @param {Function} fn - Async function to measure
   * @param {Object} options - Configuration options
   * @returns {Promise<*>} Function result
   */
  static async measureAsync(label, fn, options = {}) {
    this.start(label, options.context);
    try {
      const result = await fn();
      this.end(label, options);
      return result;
    } catch (error) {
      this.end(label, { ...options, context: { ...options.context, error: error.message } });
      throw error;
    }
  }

  /**
   * Create a performance mark (uses Performance API)
   * @param {string} name - Mark name
   */
  static mark(name) {
    if (performance.mark) {
      performance.mark(name);
    }
  }

  /**
   * Get stored metrics with optional filtering
   * @param {Object} filter - { label, minDuration, maxDuration, sortBy }
   * @returns {Array} Metrics array
   */
  static getMetrics(filter = {}) {
    const allMetrics = [];

    for (const [label, measurements] of this.metrics.entries()) {
      if (filter.label && label !== filter.label) continue;

      measurements.forEach(metric => {
        if (filter.minDuration && metric.duration < filter.minDuration) return;
        if (filter.maxDuration && metric.duration > filter.maxDuration) return;

        allMetrics.push({ label, ...metric });
      });
    }

    // Sort if requested
    if (filter.sortBy === 'duration') {
      allMetrics.sort((a, b) => b.duration - a.duration);
    } else if (filter.sortBy === 'timestamp') {
      allMetrics.sort((a, b) => b.timestamp - a.timestamp);
    }

    return allMetrics;
  }

  /**
   * Get performance report as formatted text
   * @param {string} format - 'text' | 'json' | 'table'
   * @returns {string|Object} Formatted report
   */
  static getReport(format = 'text') {
    const metrics = this.getMetrics({ sortBy: 'duration' });

    if (format === 'json') {
      return metrics;
    }

    if (format === 'table' && console.table) {
      console.table(metrics.map(m => ({
        label: m.label,
        duration: `${m.duration.toFixed(2)}ms`,
        status: m.duration > this.config.globalThreshold ? '⚠️ SLOW' : '✅ OK',
        context: JSON.stringify(m.context)
      })));
      return 'Report printed to console';
    }

    // Text format
    let report = '📊 Performance Report\n';
    report += '═'.repeat(80) + '\n';

    metrics.forEach(m => {
      const status = m.duration > this.config.globalThreshold ? '⚠️' : '✅';
      report += `${status} ${m.label}: ${m.duration.toFixed(2)}ms\n`;
      if (Object.keys(m.context).length > 0) {
        report += `   Context: ${JSON.stringify(m.context)}\n`;
      }
    });

    return report;
  }

  /**
   * Clear metrics (optionally by pattern)
   * @param {string|RegExp} pattern - Label pattern to clear
   */
  static clearMetrics(pattern) {
    if (!pattern) {
      this.metrics.clear();
      return;
    }

    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const label of this.metrics.keys()) {
      if (regex.test(label)) {
        this.metrics.delete(label);
      }
    }
  }

  /**
   * Set global configuration
   * @param {Object} config - Configuration object
   */
  static configure(config) {
    this.config = { ...this.config, ...config };
  }

  // Internal: Store a metric
  static _storeMetric(label, metric) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const measurements = this.metrics.get(label);
    measurements.push(metric);

    // Limit stored metrics
    if (measurements.length > this.config.maxMetricsPerLabel) {
      measurements.shift(); // Remove oldest
    }
  }

  // Internal: Format context for display
  static _formatContext(context) {
    if (!context || Object.keys(context).length === 0) return '';

    const filtered = { ...context };
    delete filtered.startedAt; // Don't display internal fields

    if (Object.keys(filtered).length === 0) return '';

    const parts = Object.entries(filtered)
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, 3); // Limit to 3 context items in logs

    return ` (${parts.join(', ')})`;
  }
}

// Create singleton instance
const logger = new Logger();

// Make available globally in development
if (import.meta.env.DEV) {
  window.logger = logger;
  window.PerformanceLogger = PerformanceLogger;
}

// Export logger as both default and named export for flexibility
export { logger };
export default logger;
