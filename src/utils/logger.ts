class Logger {
  private isProduction = import.meta.env.PROD;

  log(...args: unknown[]): void {
    if (!this.isProduction) {
      console.log(...args);
    }
  }

  debug(...args: unknown[]): void {
    if (!this.isProduction) {
      console.debug(...args);
    }
  }

  // Always log errors/warnings even in production
  error(...args: unknown[]): void {
    console.error(...args);
  }

  warn(...args: unknown[]): void {
    console.warn(...args);
  }
}

export const logger = new Logger();
