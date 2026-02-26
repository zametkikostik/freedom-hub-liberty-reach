// ─────────────────────────────────────────────────────────────────────────────
// Centralized Logger for Freedom Hub
// ─────────────────────────────────────────────────────────────────────────────
// 
// Usage:
//   logger.error('Message', error)
//   logger.warn('Message')
//   logger.info('Message')
//   logger.debug('Message')
// ─────────────────────────────────────────────────────────────────────────────

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: unknown;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private sentryEnabled = import.meta.env.VITE_SENTRY_DSN;

  private formatEntry(entry: LogEntry): string {
    const timestamp = new Date().toISOString();
    const context = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    return `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${context}`;
  }

  private sendToSentry(entry: LogEntry): void {
    if (!this.sentryEnabled || entry.level === 'debug') return;

    // Отправка в Sentry только для production
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      const { Sentry } = window as any;
      
      if (entry.level === 'error' && entry.error) {
        Sentry.captureException(entry.error, {
          tags: { level: entry.level },
          extra: entry.context,
        });
      } else {
        Sentry.captureMessage(entry.message, {
          level: entry.level as any,
          extra: entry.context,
        });
      }
    }
  }

  private log(entry: LogEntry): void {
    // В development выводим в консоль
    if (this.isDevelopment) {
      const formatted = this.formatEntry(entry);
      
      switch (entry.level) {
        case 'error':
          console.error(formatted, entry.error || '');
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'debug':
          console.debug(formatted);
          break;
      }
    }

    // В production отправляем в Sentry только ошибки и предупреждения
    if (!this.isDevelopment && (entry.level === 'error' || entry.level === 'warn')) {
      this.sendToSentry(entry);
    }
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error,
      context,
    });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
    });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    });
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context,
    });
  }

  // Специальный метод для логирования ответов API
  apiResponse(endpoint: string, status: number, duration?: number): void {
    this.debug(`API Response: ${endpoint}`, {
      status,
      duration: duration ? `${duration}ms` : undefined,
      success: status >= 200 && status < 300,
    });
  }

  // Специальный метод для логирования действий пользователя
  userAction(action: string, userId?: string, metadata?: Record<string, unknown>): void {
    this.info(`User Action: ${action}`, {
      userId: userId || 'anonymous',
      ...metadata,
    });
  }
}

// Экспортируем singleton
export const logger = new Logger();
export default logger;
