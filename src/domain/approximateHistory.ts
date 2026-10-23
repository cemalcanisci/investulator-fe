export interface ApproximateSource {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly origin: string;
  readonly retrievedAt: string;
}
export interface ApproximateCoverage {
  readonly from: string;
  readonly to: string;
  readonly state: 'REVIEWED' | 'MISSING' | 'CONFLICT';
  readonly sourceIds: readonly string[];
  readonly method: string;
}
export interface MonthlyObservation {
  readonly date: string;
  readonly close: string;
  readonly fx: string;
  readonly fxDate: string;
  readonly priceSourceId: string;
  readonly fxSourceId: string;
}
export interface ApproximateHistory {
  readonly assetId: string;
  readonly asOf: string;
  readonly currency: 'TRY' | 'USD';
  readonly listedFrom: string | null;
  readonly priceBasis: 'SPLIT_ONLY' | 'TOTAL_RETURN' | 'UNKNOWN';
  readonly shareBasisDate: string;
  readonly sources: readonly ApproximateSource[];
  readonly coverage: Readonly<
    Record<'prices' | 'fx' | 'actions' | 'dividends', ApproximateCoverage>
  >;
  readonly monthly: readonly MonthlyObservation[];
  readonly actions: readonly {
    readonly id: string;
    readonly date: string;
    readonly factor: string;
    readonly type: 'SPLIT' | 'BONUS' | 'UNSUPPORTED';
    readonly sourceId: string;
  }[];
  readonly dividends: readonly {
    readonly id: string;
    readonly exDate: string;
    readonly payDate: string;
    /** Gross amount on the share basis immediately before the ex date. */
    readonly rawGrossPerShare: string;
    readonly sourceId: string;
  }[];
  readonly expectedDividendIds: readonly string[];
  readonly expectedActionIds: readonly string[];
}
