import type { SourceEvidence } from '@/domain/evidence';

function date(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

export function isSourceEvidence(value: unknown): value is SourceEvidence {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = Object.fromEntries(Object.entries(value));
  const review = v.independenceReview;
  if (
    review !== undefined &&
    (typeof review !== 'object' ||
      review === null ||
      ![
        'comparedEvidenceId',
        'reviewerId',
        'reviewedAt',
        'artifactUrl',
        'locator',
        'originAssessment',
        'procedure',
      ].every(
        (key) =>
          typeof Object.fromEntries(Object.entries(review))[key] === 'string',
      ))
  ) {
    return false;
  }
  return (
    (v.publishedAtBasis === undefined ||
      ['EXACT', 'OBSERVED_BY'].includes(String(v.publishedAtBasis))) &&
    [
      'id',
      'sourceId',
      'originId',
      'collectionId',
      'reviewerId',
      'documentUrl',
      'locator',
      'excerpt',
      'checkedAt',
      'publishedAt',
      'from',
      'to',
    ].every((k) => typeof v[k] === 'string') &&
    Array.isArray(v.ancestorIds) &&
    v.ancestorIds.every((x) => typeof x === 'string') &&
    Array.isArray(v.claims) &&
    v.claims.every((x) => typeof x === 'string') &&
    (v.purchasingPowerDate === null ||
      typeof v.purchasingPowerDate === 'string') &&
    ['DOCUMENT_RECONCILIATION', 'INDEPENDENT_RECONCILIATION'].includes(
      String(v.method),
    )
  );
}

export function validEvidence(e: SourceEvidence): boolean {
  return (
    [
      e.id,
      e.sourceId,
      e.originId,
      e.collectionId,
      e.reviewerId,
      e.locator,
      e.excerpt,
    ].every((s) => s.trim().length > 0) &&
    e.documentUrl.startsWith('https://') &&
    date(e.checkedAt) &&
    date(e.publishedAt) &&
    date(e.from) &&
    date(e.to) &&
    e.from <= e.to &&
    e.publishedAt <= e.checkedAt &&
    !e.ancestorIds.includes(e.id)
  );
}

export function independentEvidence(
  a: SourceEvidence,
  b: SourceEvidence,
): boolean {
  const roots = [a.id, a.originId, ...a.ancestorIds];
  const review = b.independenceReview;
  return (
    !!review &&
    review.comparedEvidenceId === a.id &&
    review.reviewerId === b.reviewerId &&
    date(review.reviewedAt) &&
    review.reviewedAt >= a.publishedAt &&
    review.reviewedAt >= b.publishedAt &&
    review.reviewedAt <= b.checkedAt &&
    review.artifactUrl.startsWith('https://') &&
    !!review.locator.trim() &&
    !!review.originAssessment.trim() &&
    !!review.procedure.trim() &&
    validEvidence(a) &&
    validEvidence(b) &&
    a.originId !== b.originId &&
    a.documentUrl !== b.documentUrl &&
    a.collectionId !== b.collectionId &&
    a.reviewerId !== b.reviewerId &&
    [b.id, b.originId, ...b.ancestorIds].every((id) => !roots.includes(id)) &&
    b.method === 'INDEPENDENT_RECONCILIATION'
  );
}

export function sourceStatus(
  evidence: readonly SourceEvidence[],
  ids: readonly string[],
  claim: string,
  from: string,
  to: string,
): 'UNVERIFIED' | 'PRIMARY_ONLY' | 'INDEPENDENT' {
  if (
    new Set(evidence.map((e) => e.id)).size !== evidence.length ||
    new Set(ids).size !== ids.length
  ) {
    return 'UNVERIFIED';
  }
  const selected = ids.flatMap((id) => evidence.filter((e) => e.id === id));
  if (
    !selected.length ||
    selected.length !== ids.length ||
    selected.some(
      (e) =>
        !validEvidence(e) ||
        !e.claims.includes(claim) ||
        e.from > from ||
        e.to < to,
    )
  ) {
    return 'UNVERIFIED';
  }
  return selected.some((a) => selected.some((b) => independentEvidence(a, b)))
    ? 'INDEPENDENT'
    : 'PRIMARY_ONLY';
}
