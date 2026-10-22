export interface SourceEvidence {
  readonly independenceReview?: {
    readonly comparedEvidenceId: string;
    readonly reviewerId: string;
    readonly reviewedAt: string;
    readonly artifactUrl: string;
    readonly locator: string;
    readonly originAssessment: string;
    readonly procedure: string;
  };
  readonly id: string;
  readonly sourceId: string;
  readonly originId: string;
  readonly collectionId: string;
  readonly reviewerId: string;
  readonly ancestorIds: readonly string[];
  readonly documentUrl: string;
  readonly locator: string;
  readonly excerpt: string;
  readonly checkedAt: string;
  readonly publishedAt: string;
  /** OBSERVED_BY is a conservative availability bound, not an exact publication date. */
  readonly publishedAtBasis?: 'EXACT' | 'OBSERVED_BY';
  readonly method: 'DOCUMENT_RECONCILIATION' | 'INDEPENDENT_RECONCILIATION';
  readonly claims: readonly string[];
  readonly from: string;
  readonly to: string;
  readonly purchasingPowerDate: string | null;
}

export interface EvidenceClaim {
  readonly claim: string;
  readonly evidenceIds: readonly string[];
}
