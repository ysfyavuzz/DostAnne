/**
 * Centralized logging service for DostAnne
 * Provides controlled logging based on environment (development vs production)
 * In production, logs can be sent to external services like Sentry
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static readonly PREFIX = '[DostAnne]';
  private static readonly isDevelopment = __DEV__;

  /**
   * Log general information (development only)
   */
  static log(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(`${this.PREFIX} ${message}`, ...args);
    }
  }

  /**
   * Log informational messages (development only)
   */
  static info(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.info(`${this.PREFIX} [INFO] ${message}`, ...args);
    }
  }

  /**
   * Log warning messages (both development and production)
   */
  static warn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(`${this.PREFIX} [WARN] ${message}`, ...args);
    } else {
      // In production, you could send warnings to monitoring service
      // Example: Sentry.captureMessage(message, 'warning');
    }
  }

  /**
   * Log error messages (both development and production)
   */
  static error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.isDevelopment) {
      console.error(`${this.PREFIX} [ERROR] ${message}`, error, ...args);
    } else {
      // In production, send errors to monitoring service
      // Example: Sentry.captureException(error);
    }
  }

  /**
   * Log debug messages (development only)
   */
  static debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(`${this.PREFIX} [DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log performance metrics (development only)
   */
  static performance(label: string, duration: number): void {
    if (this.isDevelopment) {
      console.log(`${this.PREFIX} [PERF] ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Start a performance timer
   */
  static startTimer(label: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.performance(label, duration);
    };
  }
}

export default Logger;
