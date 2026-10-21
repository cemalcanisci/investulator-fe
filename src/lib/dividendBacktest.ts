import type {
  DividendHistory,
  HistoricalQuote,
} from '@/domain/dividendHistory';
import {
  addDecimals,
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  roundDecimal,
  subtractDecimals,
} from '@/lib/decimal';

export interface BacktestEntry {
  readonly date: string;
  readonly kind: 'CONTRIBUTION' | 'DIVIDEND';
  readonly usd: string;
  readonly price: string;
  readonly fx: string;
  readonly shares: string;
}

export interface BacktestResult {
  readonly years: number;
  readonly from: string;
  readonly to: string;
  readonly invested: string;
  readonly status:
    'COMPLETE' | 'INSUFFICIENT_HISTORY' | 'MISSING_DATA' | 'SOURCE_CONFLICT';
  readonly balance?: string;
  readonly profit?: string;
  readonly gain?: string;
  readonly simpleAnnual?: string;
  readonly xirr?: string | null;
  readonly dividends?: string;
  readonly receivable?: string;
  readonly entries: readonly BacktestEntry[];
}

/** A dimensionless root solver; monetary cash flows are normalized with decimal arithmetic. */
function annualReturn(
  entries: readonly BacktestEntry[],
  end: string,
  balance: string,
  invested: string,
): string | null {
  const start = Date.parse(entries[0]?.date ?? end);
  const days = (date: string): number =>
    (Date.parse(date) - start) / 86400000 / 365;
  const flows = entries
    .filter((e) => e.kind === 'CONTRIBUTION')
    .map((e) => ({
      t: days(e.date),
      weight: Number(divideDecimals(e.usd, invested, 16)),
    }));
  const terminal = Number(divideDecimals(balance, invested, 16));
  const duration = days(end);
  if (terminal <= 0 || duration <= 0) {
    return null;
  }
  // Terminal-value form is monotonic for contributions followed by one liquidation.
  const residual = (rate: number): number =>
    flows.reduce(
      (sum, flow) => sum + flow.weight * (1 + rate) ** (duration - flow.t),
      0,
    ) - terminal;
  let low = -0.999999;
  let high = 1;
  while (residual(high) < 0 && high < 1e6) {
    high *= 2;
  }
  if (residual(low) > 0 || residual(high) < 0) {
    return null;
  }
  for (let i = 0; i < 160; i += 1) {
    const mid = (low + high) / 2;
    if (residual(mid) > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (((low + high) / 2) * 100).toFixed(2);
}

function positive(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value) && compareDecimals(value, '0') > 0;
}

/** Complete calendar months, USD 1,000/year, fractional shares, gross dividends, no fees. */
export function backtestDividends(
  history: DividendHistory,
  years: number,
): BacktestResult {
  if (![10, 15, 20].includes(years)) {
    throw new Error('Unsupported horizon');
  }
  const end = new Date(`${history.asOf}T00:00:00Z`);
  if (
    !Number.isFinite(end.getTime()) ||
    end.toISOString().slice(0, 10) !== history.asOf ||
    new Date(end.getTime() + 86400000).getUTCDate() !== 1
  ) {
    throw new Error('Backtest requires a calendar month-end');
  }
  const from = new Date(
    Date.UTC(end.getUTCFullYear() - years, end.getUTCMonth() + 1, 1),
  )
    .toISOString()
    .slice(0, 10);
  const base = {
    years,
    from,
    to: history.asOf,
    invested: String(years * 1000),
    entries: [],
  };
  if (history.listedFrom && history.listedFrom > from) {
    return { ...base, status: 'INSUFFICIENT_HISTORY' };
  }
  if (history.verifiedFrom > from) {
    return { ...base, status: history.unavailableReason };
  }
  const quotes = history.quotes.filter(
    (q) => q.date >= from && q.date <= history.asOf,
  );
  if (
    quotes.length === 0 ||
    quotes.some(
      (q, i) =>
        !positive(q.close) ||
        !positive(q.fx) ||
        (i > 0 && q.date <= quotes[i - 1].date),
    )
  ) {
    return { ...base, status: 'MISSING_DATA' };
  }
  const monthEnds = new Map<string, HistoricalQuote>();
  for (const quote of quotes) {
    monthEnds.set(quote.date.slice(0, 7), quote);
  }
  if (
    monthEnds.size !== years * 12 ||
    [...monthEnds.values()].some((q) => {
      const next = new Date(`${q.date.slice(0, 7)}-01T00:00:00Z`);
      next.setUTCMonth(next.getUTCMonth() + 1);
      return (next.getTime() - Date.parse(q.date)) / 86400000 > 8;
    })
  ) {
    return { ...base, status: 'MISSING_DATA' };
  }
  const events = history.dividends.filter(
    (d) => d.exDate >= from && d.exDate <= history.asOf,
  );
  if (
    new Set(events.map((d) => d.id)).size !== events.length ||
    events.some(
      (d) =>
        !positive(d.grossPerShare) ||
        d.payDate < d.exDate ||
        !quotes.some((q) => q.date === d.exDate) ||
        (d.payDate <= history.asOf &&
          !quotes.some(
            (q) =>
              q.date >= d.payDate &&
              (Date.parse(q.date) - Date.parse(d.payDate)) / 86400000 <= 7,
          )),
    )
  ) {
    return { ...base, status: 'MISSING_DATA' };
  }
  let shares = '0';
  let reinvested = '0';
  let contributionCount = 0;
  const pending = new Map<string, { amount: string; date: string }>();
  const entries: BacktestEntry[] = [];
  for (const quote of quotes) {
    // Entitlement is fixed before purchases on the ex-dividend date.
    for (const dividend of events.filter((d) => d.exDate === quote.date)) {
      pending.set(dividend.id, {
        amount: multiplyDecimals(shares, dividend.grossPerShare),
        date: dividend.payDate,
      });
    }
    for (const [id, payment] of pending) {
      if (payment.date <= quote.date) {
        const units = divideDecimals(payment.amount, quote.close, 18);
        const usd = divideDecimals(payment.amount, quote.fx, 18);
        shares = addDecimals([shares, units]);
        reinvested = addDecimals([reinvested, usd]);
        entries.push({
          date: quote.date,
          kind: 'DIVIDEND',
          usd,
          price: quote.close,
          fx: quote.fx,
          shares: units,
        });
        pending.delete(id);
      }
    }
    if (monthEnds.get(quote.date.slice(0, 7))?.date === quote.date) {
      contributionCount += 1;
      const usd = contributionCount % 12 === 0 ? '83.37' : '83.33';
      const units = divideDecimals(
        multiplyDecimals(usd, quote.fx),
        quote.close,
        18,
      );
      shares = addDecimals([shares, units]);
      entries.push({
        date: quote.date,
        kind: 'CONTRIBUTION',
        usd,
        price: quote.close,
        fx: quote.fx,
        shares: units,
      });
    }
  }
  const last = quotes[quotes.length - 1];
  const receivable = divideDecimals(
    addDecimals([...pending.values()].map((p) => p.amount)),
    last.fx,
    18,
  );
  const balance = addDecimals([
    divideDecimals(multiplyDecimals(shares, last.close), last.fx, 18),
    receivable,
  ]);
  const profit = subtractDecimals(balance, base.invested);
  const gain = divideDecimals(
    multiplyDecimals(profit, '100'),
    base.invested,
    12,
  );
  return {
    ...base,
    status: 'COMPLETE',
    entries,
    balance: roundDecimal(balance, 2),
    profit: roundDecimal(profit, 2),
    gain: roundDecimal(gain, 2),
    simpleAnnual: divideDecimals(gain, String(years), 2),
    xirr: annualReturn(entries, history.asOf, balance, base.invested),
    dividends: roundDecimal(reinvested, 2),
    receivable: roundDecimal(receivable, 2),
  };
}
