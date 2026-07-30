type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (level === 'error') {
      console.error(formatted, meta || '');
    } else if (level === 'warn') {
      console.warn(formatted, meta || '');
    } else if (level === 'info') {
      console.info(formatted, meta || '');
    } else {
      console.log(formatted, meta || '');
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      this.log('debug', message, meta);
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();
