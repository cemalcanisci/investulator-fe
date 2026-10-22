import type { SourceEvidence, EvidenceClaim } from '@/domain/evidence';

export interface HistoricalQuote {
  readonly date: string;
  readonly close: string;
  /** Quote currency per USD; 1 for USD assets. */
  readonly fx: string;
  readonly priceSourceId?: string;
  readonly fxSourceId?: string;
  readonly fxDate?: string;
  readonly rawClose?: string;
  readonly shareBasisId?: string;
}

export interface HistoricalDividend {
  readonly id: string;
  readonly exDate: string;
  readonly payDate: string;
  readonly grossPerShare: string;
  readonly sourceId: string;
  readonly rawGrossPerShare?: string;
  readonly shareBasisId?: string;
}

export interface DividendHistory {
  readonly integrity?: HistoryIntegrity;
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

export interface HistoryIntegrity {
  readonly evidence?: readonly SourceEvidence[];
  readonly evidenceClaims?: readonly EvidenceClaim[];
  readonly status: 'VERIFIED' | 'PARTIAL' | 'CONFLICT';
  readonly from: string;
  readonly to: string;
  readonly sourceIds: readonly string[];
  readonly shareBasisId: string;
  readonly shareBasisDate: string;
  readonly calendarSourceId: string;
  readonly listingSourceId: string;
  readonly dividendsSourceId: string;
  readonly actionsSourceId: string;
  /** Independently reviewed exchange sessions, not dates inferred from available prices. */
  readonly sessions: readonly string[];
  /** Independently reconciled events including explicit zero-event coverage. */
  readonly expectedDividends: readonly HistoricalDividend[];
  readonly actions: readonly {
    readonly date: string;
    readonly type: 'SPLIT' | 'BONUS' | 'UNSUPPORTED';
    readonly factor: string;
    readonly sourceId: string;
  }[];
  readonly fxCarryDays: number;
}
