import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { selectFinancialFlow } from '@/lib/financialPeriodSelection';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { companyAssessment, financialOutlook } from '@/lib/companyAssessment';
import type { FinancialFact } from '@/domain/analysis';
import {
  latestMetricFact,
  currentCalculation,
} from '@/lib/financialInputSelection';
import { peerCandidates, researchComparison } from '@/lib/researchComparison';

const report = researchBundle.reports[0];
function fact(
  id: string,
  value: string,
  start: string,
  end: string,
  kind: FinancialFact['basis']['periodKind'],
): FinancialFact {
  const template = report.facts.find((item) => item.id === 'profit');
  if (!template?.evidence) {
    throw new Error('fixture');
  }
  return {
    ...template,
    id,
    metricKey: 'profit',
    value,
    basis: {
      ...template.basis,
      start,
      end,
      periodKind: kind,
      accounting: 'IFRS',
      purchasingPowerDate: null,
    },
    evidence: {
      ...template.evidence,
      id,
      claims: [id],
      from: start,
      to: end,
      purchasingPowerDate: null,
      publishedAt: '2026-08-01',
      checkedAt: '2026-10-25',
    },
  };
}
describe('published compatible financial periods', () => {
  it('selects newly published semantic inputs and blocks unmatched prior periods', () => {
    const latest = fact('new-profit', '70', '2026-01-01', '2026-09-30', 'YTD');
    const changed = { ...report, facts: [...report.facts, latest] };
    expect(latestMetricFact(changed, 'profit')?.id).toBe('new-profit');
    const growth = report.calculations.find(
      (entry) => entry.id === 'profitGrowth',
    );
    if (!growth) {
      throw new Error('fixture');
    }
    expect(currentCalculation(changed, growth).inputs).toContain(
      'missing:profitPrevious',
    );
    expect(ratioPresentation(changed, 'profitGrowth').value).toBeUndefined();
    expect(
      latestMetricFact(
        {
          ...changed,
          presentation: { ...report.presentation, asOf: '2026-07-01' },
        },
        'profit',
      )?.id,
    ).not.toBe('new-profit');
  });
  it('preserves explicit peer identities and rejects unverified comparisons', () => {
    const peer = {
      ...report,
      version: 'fictional-peer',
      facts: report.facts.map((entry) => ({
        ...entry,
        verification: 'UNVERIFIED' as const,
      })),
      presentation: {
        ...report.presentation,
        assetId: 'fictional',
        symbol: 'TEST',
      },
    };
    const subject = {
      ...report,
      peers: [
        {
          assetId: 'fictional',
          reportVersion: peer.version,
          factId: 'profit',
          subjectFactId: 'profit',
        },
      ],
    };
    const candidates = peerCandidates(subject, [peer]);
    expect(candidates).toHaveLength(2);
    expect(researchComparison(candidates, 'PEERS').rejected).toBeGreaterThan(0);
    expect(peerCandidates(subject, [])).toEqual([]);
  });
  it('does not bypass malformed existing calculation contracts', () => {
    for (const id of ['marketCap', 'priceBook']) {
      const changed = {
        ...report,
        contracts: report.contracts.map((contract) =>
          contract.id === id ? { ...contract, units: [] } : contract,
        ),
      };
      expect(ratioPresentation(changed, id).value).toBeUndefined();
    }
  });
  it('supports a non-calendar fiscal year and rejects mixed inflation bases', () => {
    const annual = fact('fiscal', '100', '2024-04-01', '2025-03-31', 'YEAR');
    const fiscal = {
      ...annual,
      basis: { ...annual.basis, fiscalYearStart: '2024-04-01' },
    };
    expect(
      selectFinancialFlow(
        { ...report, facts: [fiscal] },
        'profit',
        '2026-10-09',
        'PARENT',
      ),
    ).toMatchObject({ kind: 'ANNUAL', value: '100' });
    const invalid = {
      ...fiscal,
      basis: {
        ...fiscal.basis,
        accounting: 'TAS29' as const,
        purchasingPowerDate: null,
      },
    };
    expect(
      selectFinancialFlow(
        { ...report, facts: [invalid] },
        'profit',
        '2026-10-09',
        'PARENT',
      ).kind,
    ).toBe('MISSING_DATA');
  });
  it('shows an interim indicator only when no annual or TTM inputs exist', () => {
    const interim = fact('half', '50', '2026-01-01', '2026-06-30', 'H1');
    expect(
      selectFinancialFlow(
        { ...report, facts: [interim] },
        'profit',
        '2026-10-09',
        'PARENT',
      ),
    ).toMatchObject({ kind: 'INTERIM', value: '50' });
  });
  it('uses actual annual earnings with an explicit fallback instead of annualizing H1', () => {
    expect(
      selectFinancialFlow(report, 'profit', '2026-10-09', 'PARENT'),
    ).toMatchObject({ kind: 'ANNUAL', value: '29523183000' });
    expect(ratioPresentation(report, 'peTtm')).toMatchObject({
      periodBasis: 'ANNUAL',
      status: 'INDICATIVE',
      value: '25.21',
    });
  });
  it('forms cumulative TTM only on a common basis', () => {
    const facts = [
      fact('annual', '100', '2025-01-01', '2025-12-31', 'YEAR'),
      fact('current', '70', '2026-01-01', '2026-06-30', 'H1'),
      fact('previous', '40', '2025-01-01', '2025-06-30', 'H1'),
    ];
    expect(
      selectFinancialFlow(
        { ...report, facts },
        'profit',
        '2026-10-09',
        'PARENT',
      ),
    ).toMatchObject({ kind: 'TTM', value: '130' });
    const incompatible = facts.map((item) =>
      item.id === 'previous'
        ? { ...item, basis: { ...item.basis, scope: 'SOLO' as const } }
        : item,
    );
    expect(
      selectFinancialFlow(
        { ...report, facts: incompatible },
        'profit',
        '2026-10-09',
        'PARENT',
      ).kind,
    ).toBe('ANNUAL');
  });
  it('does not use unpublished financials and does not hide a latest loss by choosing an older profit', () => {
    const facts = [fact('annual', '-10', '2025-01-01', '2025-12-31', 'YEAR')];
    expect(
      selectFinancialFlow(
        { ...report, facts },
        'profit',
        '2026-07-31',
        'PARENT',
      ).kind,
    ).toBe('MISSING_DATA');
    expect(
      selectFinancialFlow(
        { ...report, facts },
        'profit',
        '2026-08-01',
        'PARENT',
      ).value,
    ).toBe('-10');
    expect(
      ratioPresentation(
        {
          ...report,
          facts: [
            ...report.facts.filter((item) => item.basis.scope === 'MARKET'),
            ...facts,
          ],
        },
        'peTtm',
      ).value,
    ).toBeUndefined();
  });
  it('keeps financial support separate from unavailable price comparisons', () => {
    expect(companyAssessment(report)).toMatchObject({
      financialOutlook: 'POSITIVE_SIGNALS',
      priceOutlook: 'COMPARISON_MISSING',
      classification: 'UNCERTAIN',
    });
    const findings = ['growth.positive', 'profitWithoutCash'].map((key) => ({
      key,
      metricIds: [],
      inputIds: ['shared'],
      tone: 'OBSERVATION' as const,
    }));
    expect(financialOutlook(findings)).toBe('MIXED');
    expect(financialOutlook([...findings, ...findings])).toBe('MIXED');
  });
});
