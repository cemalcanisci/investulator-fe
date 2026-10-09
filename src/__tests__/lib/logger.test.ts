import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from '@/lib/logger';

const SUPPRESSED_LEVELS = ['log', 'info', 'warn', 'debug'] as const;

describe('logger', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it.each(SUPPRESSED_LEVELS)(
    '%s writes to the console in development',
    (level) => {
      vi.stubEnv('PROD', false);
      const spy = vi.spyOn(console, level).mockImplementation(() => undefined);

      logger[level]('message', 1);

      expect(spy).toHaveBeenCalledWith('message', 1);
    },
  );

  it.each(SUPPRESSED_LEVELS)('%s is silent in production', (level) => {
    vi.stubEnv('PROD', true);
    const spy = vi.spyOn(console, level).mockImplementation(() => undefined);

    logger[level]('message');

    expect(spy).not.toHaveBeenCalled();
  });

  it('never suppresses errors, even in production', () => {
    vi.stubEnv('PROD', true);
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    logger.error('boom');

    expect(spy).toHaveBeenCalledWith('boom');
  });
});
