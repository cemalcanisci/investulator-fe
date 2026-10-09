type SuppressedLevel = 'log' | 'info' | 'warn' | 'debug';

function createSuppressedLog(level: SuppressedLevel) {
  return (...args: unknown[]): void => {
    if (import.meta.env.PROD) {
      return;
    }
    console[level](...args);
  };
}

function error(...args: unknown[]): void {
  // Errors are never silenced, even in production — they're the one signal
  // worth keeping (and the future integration point for an error tracker).
  console.error(...args);
}

export const logger = {
  log: createSuppressedLog('log'),
  info: createSuppressedLog('info'),
  warn: createSuppressedLog('warn'),
  debug: createSuppressedLog('debug'),
  error,
};
