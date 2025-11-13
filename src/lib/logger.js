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

 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
// Performance Logger


 main
// Performance Logger for tracking app performance
export class PerformanceLogger {
  static timers = new Map();

  static start(label) {
    this.timers.set(label, performance.now());
  }

  static end(label, warnThreshold = 1000) {
    const startTime = this.timers.get(label);
    if (!startTime) {
      if (import.meta.env.DEV) {
        console.warn(`No timer found for label: ${label}`);
      }
      return null;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(label);

    if (duration > warnThreshold) {
      logger.warn(`Performance: ${label} took ${duration.toFixed(2)}ms (exceeded threshold of ${warnThreshold}ms)`, {
        duration,
        threshold: warnThreshold
      });
    } else {
      logger.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    }

    return duration;
  }

  static measure(label, fn) {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  static async measureAsync(label, fn) {
 claude/resolve-merge-conflicts-011CV69Tea4HNJei17hQh6hz
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    logger.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });



 main
    this.start(label);
    const result = await fn();
    this.end(label);
    return result;
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
