export interface HistoricalQuote {
  readonly date: string;
  readonly close: string;
  /** Quote currency per USD; 1 for USD assets. */
  readonly fx: string;
}

export interface HistoricalDividend {
  readonly id: string;
  readonly exDate: string;
  readonly payDate: string;
  readonly grossPerShare: string;
  readonly sourceId: string;
}

export interface DividendHistory {
  readonly assetId: string;
  readonly asOf: string;
  readonly retrievedAt: string;
  readonly currency: string;
  readonly listedFrom: string | null;
  readonly verifiedFrom: string;
  readonly priceBasis: 'SPLIT_ADJUSTED';
  readonly review: 'PARTIAL' | 'REVIEWED';
  readonly sources: readonly {
    readonly id: string;
    readonly title: string;
    readonly url: string;
  }[];
  /** Quotes and dividends use the same split-adjusted share basis. No total-return prices. */
  readonly quotes: readonly HistoricalQuote[];
  readonly dividends: readonly HistoricalDividend[];
  readonly unavailableReason: 'SOURCE_CONFLICT' | 'MISSING_DATA';
}
