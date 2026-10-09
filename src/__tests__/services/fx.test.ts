import { describe, expect, it } from 'vitest';
import { fetchRateToUsd } from '@/services/fx';

describe('mock historical exchange rates', () => {
  it('uses unity for USD and clamps the invented TRY series at both ends', async () => {
    expect(await fetchRateToUsd('USD', '2026-09-22')).toBe('1');
    expect(await fetchRateToUsd('TRY', '2025-01-01')).toBe('0.02650');
    expect(await fetchRateToUsd('TRY', '2027-01-01')).toBe('0.02424');
    const middle = await fetchRateToUsd('TRY', '2026-01-01');
    expect(middle > '0.02424' && middle < '0.02650').toBe(true);
  });
});
