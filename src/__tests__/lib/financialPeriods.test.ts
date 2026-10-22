import { describe, expect, it } from 'vitest';
import type { FinancialFact } from '@/domain/analysis';
import { trailingTwelveMonths } from '@/lib/financialPeriods';

function quarters(): FinancialFact[] {
  return ['03-31', '06-30', '09-30', '12-31'].map((end, index) => ({
    evidence: {
      id: `e-${index}`,
      sourceId: 'fiction',
      originId: 'synthetic',
      collectionId: 'fixture',
      reviewerId: 'fixture-author',
      ancestorIds: [],
      documentUrl: 'https://example.invalid/statement',
      locator: 'p1',
      excerpt: 'Synthetic quarterly statement',
      checkedAt: '2026-01-01',
      publishedAt: '2026-01-01',
      method: 'DOCUMENT_RECONCILIATION',
      claims: [`quarter-${index}`],
      from: '2025-01-01',
      to: '2025-12-31',
      purchasingPowerDate: null,
    },
    id: `quarter-${index}`,
    value: '25',
    unit: 'USD',
    period: `2025 Q${index + 1}`,
    sourceId: 'fiction',
    verification: 'VERIFIED',
    checkedAt: '2026-01-01',
    locator: 'Synthetic quarterly statement',
    basis: {
      currency: 'USD',
      scale: '1',
      scope: 'CONSOLIDATED',
      attribution: 'PARENT',
      accounting: 'IFRS',
      purchasingPowerDate: null,
      start: `2025-${String(index * 3 + 1).padStart(2, '0')}-01`,
      end: `2025-${end}`,
      periodKind: 'QUARTER',
      shareBasis: null,
    },
  }));
}
describe('actual TTM', () => {
  it('sums four compatible nonoverlapping quarters', () => {
    expect(
      trailingTwelveMonths('profitTtm', quarters(), ['fiction']),
    ).toMatchObject({ status: 'PASS', value: '100' });
  });
  it('rejects missing periods, repeated quarters, H1 and inflation-base changes', () => {
    const q = quarters();
    expect(trailingTwelveMonths('ttm', q.slice(1), ['fiction']).status).toBe(
      'BLOCKED',
    );
    expect(
      trailingTwelveMonths('ttm', [q[0], q[0], q[2], q[3]], ['fiction']).status,
    ).toBe('BLOCKED');
    expect(
      trailingTwelveMonths(
        'ttm',
        q.map((f) => ({ ...f, basis: { ...f.basis, periodKind: 'H1' } })),
        ['fiction'],
      ).status,
    ).toBe('BLOCKED');
    expect(
      trailingTwelveMonths(
        'ttm',
        q.map((f, i) => ({
          ...f,
          basis: {
            ...f.basis,
            accounting: 'TAS29',
            purchasingPowerDate: i === 0 ? '2024-12-31' : '2025-12-31',
          },
        })),
        ['fiction'],
      ).status,
    ).toBe('BLOCKED');
  });
});
