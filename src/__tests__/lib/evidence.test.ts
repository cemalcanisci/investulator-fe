import { describe, expect, it } from 'vitest';
import type { SourceEvidence } from '@/domain/evidence';
import {
  independentEvidence,
  sourceStatus,
  isSourceEvidence,
} from '@/lib/sourceEvidence';
import {
  factIssues,
  factSourceIssues,
  factTechnicalIssues,
} from '@/lib/analysisValidation';
import { analysisQuality } from '@/lib/analysisQuality';
import { analysisPriorities } from '@/lib/analysisPriorities';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import snapshots from '@/data/research/analysis-reports.json';

const proof: SourceEvidence = {
  id: 'one',
  sourceId: 'source',
  originId: 'origin',
  collectionId: 'run',
  reviewerId: 'researcher',
  ancestorIds: [],
  documentUrl: 'https://example.invalid/doc',
  locator: 'p1',
  excerpt: 'Synthetic evidence',
  checkedAt: '2026-01-01',
  publishedAt: '2026-01-01',
  method: 'DOCUMENT_RECONCILIATION',
  claims: ['PRICES'],
  from: '2025-01-01',
  to: '2025-12-31',
  purchasingPowerDate: null,
};
const report = parseAnalysisReports(snapshots)[0];
describe('source provenance gates', () => {
  it('does not mistake mirrors or repeated collection for independent verification', () => {
    expect(
      sourceStatus([proof], ['one'], 'PRICES', '2025-01-01', '2025-12-31'),
    ).toBe('PRIMARY_ONLY');
    expect(
      independentEvidence(proof, {
        ...proof,
        id: 'two',
        documentUrl: 'https://example.invalid/mirror',
        method: 'INDEPENDENT_RECONCILIATION',
      }),
    ).toBe(false);
    const independent: SourceEvidence = {
      ...proof,
      id: 'two',
      documentUrl: 'https://example.invalid/independent',
      originId: 'other',
      collectionId: 'other-run',
      reviewerId: 'reviewer',
      method: 'INDEPENDENT_RECONCILIATION',
      independenceReview: {
        comparedEvidenceId: 'one',
        reviewerId: 'reviewer',
        reviewedAt: '2026-01-01',
        artifactUrl: 'https://example.invalid/review',
        locator: 'Synthetic review appendix',
        originAssessment: 'Fictional separate origin, no common upstream',
        procedure: 'Synthetic document reconciliation; not real evidence',
      },
    };
    expect(
      independentEvidence(proof, {
        ...independent,
        independenceReview: undefined,
      }),
    ).toBe(false);
    if (!independent.independenceReview) {
      throw new Error('Missing review fixture');
    }
    expect(
      independentEvidence(proof, {
        ...independent,
        independenceReview: {
          ...independent.independenceReview,
          comparedEvidenceId: 'unrelated',
        },
      }),
    ).toBe(false);
    expect(independentEvidence(proof, independent)).toBe(true);
    expect(
      independentEvidence(proof, { ...independent, ancestorIds: ['origin'] }),
    ).toBe(false);
    expect(
      sourceStatus(
        [proof, independent],
        ['one', 'two'],
        'PRICES',
        '2024-01-01',
        '2025-12-31',
      ),
    ).toBe('UNVERIFIED');
    expect(
      sourceStatus(
        [proof, independent],
        ['one', 'two'],
        'PRICES',
        '2025-01-01',
        '2025-12-31',
      ),
    ).toBe('INDEPENDENT');
    expect(isSourceEvidence({ ...proof, claims: 42 })).toBe(false);
  });
  it('blocks bare VERIFIED and unsupported purchasing power labels', () => {
    const fact = report.facts.find((f) => f.id === 'revenue');
    if (!fact) {
      throw new Error('Missing fixture');
    }
    expect(factTechnicalIssues(fact)).toEqual([]);
    expect(
      factSourceIssues({ ...fact, evidence: undefined }, ['financials']),
    ).toContain('EVIDENCE');
    expect(
      factIssues({ ...fact, evidence: undefined }, ['financials']),
    ).toContain('EVIDENCE');
    expect(
      factIssues(
        {
          ...fact,
          basis: { ...fact.basis, purchasingPowerDate: '2025-12-31' },
        },
        ['financials'],
      ),
    ).toContain('RESTATEMENT');
  });
  it('separates strategy priorities and metric checks from independent report review', () => {
    expect(
      analysisPriorities({ ...report.context, strategies: ['DIVIDEND'] })[0],
    ).toBe('DIVIDEND');
    expect(
      analysisPriorities({ ...report.context, strategies: ['GROWTH'] })[0],
    ).toBe('GROWTH');
    expect(
      analysisQuality({
        ...report,
        presentation: {
          ...report.presentation,
          status: 'COMPLETE',
          review: {
            ...report.presentation.review,
            status: 'PASS',
            independent: true,
          },
        },
      }),
    ).toMatchObject({
      completeness: 'PARTIAL',
      independentReview: 'NOT_REVIEWED',
    });
  });
});
