import { describe, expect, it } from 'vitest';
import { formatAxisDate, formatDate, formatTime } from '@/lib/formatDate';

describe('formatDate', () => {
  it('keeps the calendar day regardless of the time zone', () => {
    expect(formatDate('2026-09-19', 'en')).toBe('Sep 19, 2026');
  });
});

describe('formatAxisDate', () => {
  it('shows day and month for short ranges', () => {
    expect(formatAxisDate('2026-09-19', 'en', false)).toBe('Sep 19');
  });

  it('shows month and year for long ranges', () => {
    expect(formatAxisDate('2026-09-19', 'en', true)).toBe('Sep 26');
  });
});

describe('formatTime', () => {
  it('formats only the time of day', () => {
    expect(formatTime('2026-09-21T11:05:00.000Z', 'en')).toMatch(/\d{1,2}:05/);
  });
});
