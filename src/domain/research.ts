export interface ResearchSource {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly publishedAt: string | null;
  readonly period: string;
  readonly locator: string;
}

export interface ResearchFact {
  readonly metricKey?: string;
  readonly comparisonKey?: string;
  readonly id: string;
  readonly value: string;
  readonly unit:
    | 'TRY'
    | 'TRY_SHARE'
    | 'USD'
    | 'USD_SHARE'
    | 'SHARES'
    | 'USD_BARREL'
    | 'PERCENT'
    | 'MULTIPLE';
  readonly period: string;
  readonly sourceId: string;
}

export interface ResearchCalculation {
  readonly metricKey?: string;
  readonly id: string;
  readonly operation:
    | 'RATIO'
    | 'PERCENT'
    | 'GROWTH'
    | 'SUBTRACT'
    | 'MULTIPLY'
    | 'SUM'
    | 'MEAN'
    | 'PRODUCT_OVER_SUM';
  readonly inputs: readonly string[];
  readonly unit:
    'TRY' | 'TRY_SHARE' | 'USD' | 'USD_SHARE' | 'PERCENT' | 'MULTIPLE';
  readonly precision: number;
}

export interface ResearchDisclosure {
  readonly id: string;
  readonly sourceId: string;
  readonly publishedAt: string;
  readonly eventDate: string;
  readonly key: string;
  readonly impact: 'HIGH' | 'MEDIUM';
  readonly isUpdate: boolean;
  readonly isCorrection: boolean;
  readonly previousDisclosureDate: string | null;
  readonly attachmentReview: 'NONE' | 'PARTIAL';
  readonly contextOnly: boolean;
}

export interface ResearchReport {
  readonly narrativeStale?: boolean;
  readonly longTerm?: {
    readonly horizonYears: readonly [number, number];
    readonly status: 'CONDITIONAL';
    readonly opportunityKeys: readonly string[];
    readonly sourceIds: readonly string[];
  };
  readonly debtLines: readonly {
    readonly currency: string;
    readonly maturity: 'SHORT' | 'CURRENT_LONG' | 'LONG';
    readonly originalAmount: string;
    readonly tryEquivalent: string;
    readonly effectiveRate: string;
  }[];
  readonly schemaVersion: 1;
  readonly id: string;
  readonly assetId: string;
  readonly symbol: string;
  readonly isin: string;
  readonly market: string;
  readonly sector: string;
  readonly contentKey: string;
  readonly asOf: string;
  readonly retrievedAt: string;
  readonly timezone: string;
  readonly financialPeriod: string;
  readonly priceAt: string;
  readonly status: 'PARTIAL' | 'COMPLETE';
  readonly valuationStatus: 'NOT_ASSESSED';
  readonly review: {
    readonly status: 'NEEDS_REVIEW' | 'PASS';
    readonly independent: boolean;
    readonly key: string;
  };
  readonly sources: readonly ResearchSource[];
  readonly facts: readonly ResearchFact[];
  readonly calculations: readonly ResearchCalculation[];
  readonly disclosureScan: {
    readonly from: string;
    readonly to: string;
    readonly status: 'PARTIAL' | 'COMPLETE' | 'UNAVAILABLE';
    readonly sourceId: string;
    readonly pendingDates: readonly string[];
  };
  readonly disclosures: readonly ResearchDisclosure[];
  readonly coverage: readonly {
    readonly section: string;
    readonly status: 'COMPLETE' | 'PARTIAL' | 'MISSING';
  }[];
}
