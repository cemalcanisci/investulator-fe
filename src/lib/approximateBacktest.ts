import type {
  ApproximateHistory,
  MonthlyObservation,
} from '@/domain/approximateHistory';
import {
  addDecimals as add,
  subtractDecimals as sub,
  multiplyDecimals as mul,
  divideDecimals as div,
  compareDecimals as cmp,
  roundDecimal,
} from '@/lib/decimal';

export interface ApproximateEntry {
  readonly date: string;
  readonly kind: 'CONTRIBUTION' | 'ENTITLEMENT' | 'REINVESTMENT';
  readonly local: string;
  readonly usd: string;
  readonly shares: string;
  readonly eventId?: string;
  readonly price?: string;
  readonly fx?: string;
  readonly priceSourceId?: string;
  readonly fxSourceId?: string;
  readonly fxDate?: string;
}
export interface ApproximatePerformance {
  readonly invested: string;
  readonly equity: string;
  readonly cash: string;
  readonly receivable: string;
  readonly balance: string;
  readonly profit: string;
  readonly gain: string;
  readonly xirr: string | null;
}
export interface ApproximateScenario {
  readonly local: ApproximatePerformance;
  readonly usd: ApproximatePerformance;
  readonly entries: readonly ApproximateEntry[];
}
export interface ApproximateResult {
  readonly years: number;
  readonly from: string;
  readonly to: string;
  readonly status:
    'APPROXIMATE' | 'PRICE_ONLY' | 'MISSING_DATA' | 'INSUFFICIENT_HISTORY';
  readonly issues: readonly string[];
  readonly priceOnly?: ApproximateScenario;
  readonly cash?: ApproximateScenario;
  readonly reinvest?: ApproximateScenario;
}
export interface ApproximateOptions {
  readonly mode: 'MONTHLY' | 'LUMP_SUM';
  readonly amountUsd: string;
}
const validDate = (s: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  Number.isFinite(Date.parse(s)) &&
  new Date(s).toISOString().slice(0, 10) === s;
const positive = (s: string): boolean =>
  /^\d+(\.\d+)?$/.test(s) && cmp(s, '0') > 0;
const days = (a: string, b: string): number =>
  (Date.parse(a) - Date.parse(b)) / 86400000;
const rounded = (s: string): string => roundDecimal(s, 2);

/** Dimensionless terminal-value XIRR; all monetary accumulation uses decimal strings. */
function xirr(
  entries: readonly ApproximateEntry[],
  end: string,
  balance: string,
  invested: string,
  unit: 'usd' | 'local',
): string | null {
  const flows = entries.filter((e) => e.kind === 'CONTRIBUTION');
  if (
    !flows.length ||
    days(end, flows[0].date) <= 0 ||
    cmp(balance, '0') <= 0
  ) {
    return null;
  }
  const target = Number(div(balance, invested, 18));
  const weights = flows.map((e) => ({
    t: days(end, e.date) / 365,
    w: Number(div(e[unit], invested, 18)),
  }));
  const residual = (r: number): number =>
    weights.reduce((sum, f) => sum + f.w * (1 + r) ** f.t, 0) - target;
  let low = -0.999999999,
    high = 1;
  while (residual(high) < 0 && high < 1e6) {
    high *= 2;
  }
  if (residual(low) > 0 || residual(high) < 0) {
    return null;
  }
  for (let i = 0; i < 160; i++) {
    const mid = (low + high) / 2;
    if (residual(mid) > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (((low + high) / 2) * 100).toFixed(2);
}

function simulate(
  history: ApproximateHistory,
  quotes: readonly MonthlyObservation[],
  options: ApproximateOptions,
  policy: 'PRICE' | 'CASH' | 'REINVEST',
): ApproximateScenario {
  let shares = '0',
    cash = '0';
  const entries: ApproximateEntry[] = [];
  const pending = new Map<string, { amount: string; payDate: string }>();
  const events =
    policy === 'PRICE'
      ? []
      : history.dividends
          .filter((d) => d.exDate >= quotes[0].date && d.exDate <= history.asOf)
          .sort((a, b) => a.exDate.localeCompare(b.exDate));
  let cursor = 0;
  const captureEntitlements = (date: string, fx: string): void => {
    while (cursor < events.length && events[cursor].exDate <= date) {
      const event = events[cursor++];
      const factor = history.actions
        .filter(
          (a) => a.date >= event.exDate && a.date <= history.shareBasisDate,
        )
        .reduce((n, a) => mul(n, a.factor), '1');
      const amount = mul(shares, div(event.rawGrossPerShare, factor, 18));
      pending.set(event.id, { amount, payDate: event.payDate });
      entries.push({
        date: event.exDate,
        kind: 'ENTITLEMENT',
        local: amount,
        usd: div(amount, fx, 18),
        shares,
        eventId: event.id,
      });
    }
  };
  for (const [index, q] of quotes.entries()) {
    captureEntitlements(q.date, q.fx);
    for (const [id, payment] of pending) {
      if (payment.payDate <= q.date) {
        if (policy === 'REINVEST') {
          const units = div(payment.amount, q.close, 18);
          shares = add([shares, units]);
          entries.push({
            date: q.date,
            kind: 'REINVESTMENT',
            local: payment.amount,
            usd: div(payment.amount, q.fx, 18),
            shares: units,
            eventId: id,
            price: q.close,
            fx: q.fx,
            priceSourceId: q.priceSourceId,
            fxSourceId: q.fxSourceId,
            fxDate: q.fxDate,
          });
        } else {
          cash = add([cash, payment.amount]);
        }
        pending.delete(id);
      }
    }
    if (options.mode === 'MONTHLY' || index === 0) {
      const local = mul(options.amountUsd, q.fx),
        units = div(local, q.close, 18);
      shares = add([shares, units]);
      entries.push({
        date: q.date,
        kind: 'CONTRIBUTION',
        local,
        usd: options.amountUsd,
        shares: units,
        price: q.close,
        fx: q.fx,
        priceSourceId: q.priceSourceId,
        fxSourceId: q.fxSourceId,
        fxDate: q.fxDate,
      });
    }
  }
  const last = quotes[quotes.length - 1];
  captureEntitlements(history.asOf, last.fx);
  // A payment after the final observed close stays in cash until another purchase window.
  for (const [id, payment] of pending) {
    if (payment.payDate <= history.asOf) {
      cash = add([cash, payment.amount]);
      pending.delete(id);
    }
  }
  const equity = mul(shares, last.close),
    receivable = add([...pending.values()].map((p) => p.amount));
  const performance = (unit: 'usd' | 'local'): ApproximatePerformance => {
    const convert = (value: string): string =>
      unit === 'usd' ? div(value, last.fx, 18) : value;
    const invested = add(
      entries.filter((e) => e.kind === 'CONTRIBUTION').map((e) => e[unit]),
    );
    const balance = convert(add([equity, cash, receivable])),
      profit = sub(balance, invested);
    return {
      invested: rounded(invested),
      equity: rounded(convert(equity)),
      cash: rounded(convert(cash)),
      receivable: rounded(convert(receivable)),
      balance: rounded(balance),
      profit: rounded(profit),
      gain: rounded(div(mul(profit, '100'), invested, 18)),
      xirr: xirr(entries, history.asOf, balance, invested, unit),
    };
  };
  return { local: performance('local'), usd: performance('usd'), entries };
}

/** Monthly approximation has its own admission criteria; it never grants VERIFIED/COMPLETE. */
export function approximateBacktest(
  history: ApproximateHistory,
  years: number,
  options: ApproximateOptions,
): ApproximateResult {
  const base: { years: number; from: string; to: string; issues: string[] } = {
    years,
    from: '',
    to: history.asOf,
    issues: [],
  };
  const fail = (
    issues: string[],
    status: ApproximateResult['status'] = 'MISSING_DATA',
  ): ApproximateResult => ({ ...base, status, issues });
  if (
    ![10, 15, 20].includes(years) ||
    !positive(options.amountUsd) ||
    !['MONTHLY', 'LUMP_SUM'].includes(options.mode) ||
    !validDate(history.asOf)
  ) {
    return fail(['INPUT']);
  }
  const end = new Date(`${history.asOf}T00:00:00Z`);
  if (new Date(end.getTime() + 86400000).getUTCDate() !== 1) {
    return fail(['PERIOD']);
  }
  base.from = new Date(
    Date.UTC(end.getUTCFullYear() - years, end.getUTCMonth() + 1, 1),
  )
    .toISOString()
    .slice(0, 10);
  if (history.listedFrom && history.listedFrom > base.from) {
    return fail(['LISTING'], 'INSUFFICIENT_HISTORY');
  }
  const sourceIds = history.sources.map((s) => s.id);
  if (
    new Set(sourceIds).size !== sourceIds.length ||
    history.sources.some(
      (s) => !s.origin || !s.retrievedAt || !s.url.startsWith('https://'),
    )
  ) {
    return fail(['SOURCES']);
  }
  const covered = (key: keyof ApproximateHistory['coverage']): boolean => {
    const c = history.coverage[key];
    return (
      c.state === 'REVIEWED' &&
      validDate(c.from) &&
      validDate(c.to) &&
      c.from <= base.from &&
      c.to >= history.asOf &&
      !!c.method &&
      c.sourceIds.length > 0 &&
      c.sourceIds.every((id) => sourceIds.includes(id))
    );
  };
  if (!covered('prices') || !covered('fx') || !covered('actions')) {
    return fail(['COVERAGE']);
  }
  if (
    history.priceBasis !== 'SPLIT_ONLY' ||
    !validDate(history.shareBasisDate) ||
    history.shareBasisDate < history.asOf ||
    history.coverage.actions.to < history.shareBasisDate
  ) {
    return fail(['BASIS']);
  }
  const idsMatch = (
    actual: readonly string[],
    expected: readonly string[],
  ): boolean =>
    new Set(actual).size === actual.length &&
    new Set(expected).size === expected.length &&
    actual.length === expected.length &&
    actual.every((id) => expected.includes(id));
  if (
    !idsMatch(
      history.actions.map((a) => a.id),
      history.expectedActionIds,
    ) ||
    history.actions.some(
      (a) =>
        !validDate(a.date) ||
        !positive(a.factor) ||
        a.type === 'UNSUPPORTED' ||
        !sourceIds.includes(a.sourceId),
    )
  ) {
    return fail(['ACTIONS']);
  }
  const quotes = history.monthly.filter(
    (q) => q.date >= base.from && q.date <= history.asOf,
  );
  if (
    quotes.length !== years * 12 ||
    quotes.some((q, i) => {
      const month = new Date(
        Date.UTC(end.getUTCFullYear() - years, end.getUTCMonth() + 1 + i, 1),
      );
      const next = new Date(
        Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1),
      )
        .toISOString()
        .slice(0, 10);
      return (
        !validDate(q.date) ||
        q.date.slice(0, 7) !== month.toISOString().slice(0, 7) ||
        days(next, q.date) > 8 ||
        !positive(q.close) ||
        !positive(q.fx) ||
        !validDate(q.fxDate) ||
        days(q.date, q.fxDate) < 0 ||
        days(q.date, q.fxDate) > 4 ||
        !sourceIds.includes(q.priceSourceId) ||
        !sourceIds.includes(q.fxSourceId) ||
        (history.currency === 'USD' && cmp(q.fx, '1') !== 0)
      );
    })
  ) {
    return fail(['MONTHLY_DATA']);
  }
  const dividendValid =
    covered('dividends') &&
    idsMatch(
      history.dividends.map((d) => d.id),
      history.expectedDividendIds,
    ) &&
    history.dividends.every(
      (d) =>
        validDate(d.exDate) &&
        validDate(d.payDate) &&
        d.payDate >= d.exDate &&
        positive(d.rawGrossPerShare) &&
        sourceIds.includes(d.sourceId) &&
        !history.actions.some((a) => a.date === d.exDate),
    );
  const priceOnly = simulate(history, quotes, options, 'PRICE');
  if (!dividendValid) {
    return { ...base, status: 'PRICE_ONLY', issues: ['DIVIDENDS'], priceOnly };
  }
  return {
    ...base,
    status: 'APPROXIMATE',
    priceOnly,
    cash: simulate(history, quotes, options, 'CASH'),
    reinvest: simulate(history, quotes, options, 'REINVEST'),
  };
}
