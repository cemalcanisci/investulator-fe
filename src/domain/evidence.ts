export interface SourceEvidence {
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
