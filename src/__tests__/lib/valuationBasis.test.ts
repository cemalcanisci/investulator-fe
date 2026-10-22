import { describe, expect, it } from 'vitest';
import type { FinancialFact } from '@/domain/analysis';
import type {
  ValuationScenario,
  ValuationInputRule,
} from '@/lib/valuationBasis';
import { valuationBasisIssues } from '@/lib/valuationBasis';

const rules: ValuationInputRule[] = [
  { id: 'flow', role: 'FLOW' },
  { id: 'stock', role: 'STOCK' },
];
const facts: FinancialFact[] = rules.map((r) => ({
  id: r.id,
  value: '100',
  unit: 'USD',
  period: '2025',
  sourceId: 'synthetic',
  verification: 'VERIFIED',
  checkedAt: '2026-03-01',
  locator: 'Synthetic statement',
  basis: {
    currency: 'USD',
    scale: '1',
    scope: 'CONSOLIDATED',
    attribution: 'GROUP',
    accounting: 'IFRS',
    purchasingPowerDate: null,
    start: r.id === 'flow' ? '2025-01-01' : '2026-01-31',
    end: r.id === 'flow' ? '2025-12-31' : '2026-01-31',
    periodKind: r.id === 'flow' ? 'YEAR' : 'INSTANT',
    shareBasis: null,
  },
  evidence: {
    id: r.id,
    sourceId: 'synthetic',
    originId: 'issuer',
    collectionId: 'run',
    reviewerId: 'researcher',
    ancestorIds: [],
    documentUrl: 'https://example.invalid',
    locator: 'p1',
    excerpt: 'Synthetic',
    checkedAt: '2026-03-01',
    publishedAt: '2026-02-15',
    method: 'DOCUMENT_RECONCILIATION',
    claims: [r.id],
    from: '2025-01-01',
    to: '2026-01-31',
    purchasingPowerDate: null,
  },
}));
const scenario: ValuationScenario = {
  id: 'BASE',
  valuationAt: '2026-03-01',
  knowledgeAt: '2026-03-01',
  flowStart: '2025-01-01',
  flowEnd: '2025-12-31',
  stockAt: '2026-01-31',
  shareBasis: 'unchanged',
  purchasingPowerDate: null,
  assumptions: facts.flatMap((f) =>
    f.evidence
      ? [
          {
            inputId: f.id,
            value: f.value,
            rationale: 'Synthetic documented stock/flow bridge',
            evidence: f.evidence,
          },
        ]
      : [],
  ),
};
describe('economic valuation basis', () => {
  it('allows documented stock and flow with different end dates', () => {
    expect(valuationBasisIssues(facts, rules, scenario)).toEqual([]);
  });
  it('blocks missing assumptions, lookahead, invalid flow and unsupported inflation conversion', () => {
    expect(valuationBasisIssues(facts, rules)).toContain('ASSUMPTIONS');
    expect(
      valuationBasisIssues(facts, rules, {
        ...scenario,
        knowledgeAt: '2026-01-01',
      }),
    ).toContain('LOOKAHEAD');
    expect(
      valuationBasisIssues(facts, rules, {
        ...scenario,
        flowEnd: '2025-06-30',
      }),
    ).toContain('PERIOD');
    expect(
      valuationBasisIssues(
        facts.map((f) => ({
          ...f,
          basis: {
            ...f.basis,
            accounting: 'TAS29',
            purchasingPowerDate: '2025-12-31',
          },
        })),
        rules,
        scenario,
      ),
    ).toContain('RESTATEMENT');
    expect(
      valuationBasisIssues(facts, rules, { ...scenario, assumptions: [] }),
    ).toContain('ASSUMPTIONS');
  });
});
