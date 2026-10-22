import type { DividendHistory } from '@/domain/dividendHistory';
import { validDate } from '@/lib/analysisValidation';
import { sourceStatus } from '@/lib/sourceEvidence';
import {
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  roundDecimal,
} from '@/lib/decimal';

function positive(value: string | undefined): value is string {
  return (
    value !== undefined &&
    /^\d+(\.\d+)?$/.test(value) &&
    compareDecimals(value, '0') > 0
  );
}

export function historyIssues(
  history: DividendHistory,
  from: string,
): string[] {
  const integrity = history.integrity;
  if (!integrity) {
    return ['COVERAGE'];
  }
  const issues: string[] = [];
  for (const claim of [
    'CALENDAR',
    'LISTING',
    'DIVIDENDS',
    'ACTIONS',
    'PRICES',
    'FX',
  ]) {
    const matches =
      integrity.evidenceClaims?.filter((c) => c.claim === claim) ?? [];
    if (
      matches.length !== 1 ||
      sourceStatus(
        integrity.evidence ?? [],
        matches[0]?.evidenceIds ?? [],
        claim,
        from,
        history.asOf,
      ) !== 'INDEPENDENT'
    ) {
      issues.push('INDEPENDENCE');
    }
  }
  const sourceIds = history.sources.map((s) => s.id);
  if (integrity.evidence?.some((e) => !sourceIds.includes(e.sourceId))) {
    issues.push('SOURCE');
  }
  if (integrity.status !== 'VERIFIED' || history.review !== 'REVIEWED') {
    issues.push('UNVERIFIED');
  }
  if (integrity.status === 'CONFLICT') {
    issues.push('CONFLICT');
  }
  if (!history.listedFrom || !validDate(history.listedFrom)) {
    issues.push('LISTING');
  }
  if (
    !validDate(integrity.from) ||
    !validDate(integrity.to) ||
    integrity.from > from ||
    integrity.to < history.asOf
  ) {
    issues.push('COVERAGE');
  }
  if (
    !integrity.shareBasisId ||
    !validDate(integrity.shareBasisDate) ||
    integrity.shareBasisDate < history.asOf ||
    history.priceBasis !== 'SPLIT_ADJUSTED'
  ) {
    issues.push('SHARE_BASIS');
  }
  for (const id of [
    ...integrity.sourceIds,
    integrity.calendarSourceId,
    integrity.listingSourceId,
    integrity.dividendsSourceId,
    integrity.actionsSourceId,
  ]) {
    if (!sourceIds.includes(id)) {
      issues.push('SOURCE');
    }
  }
  if (
    !Number.isInteger(integrity.fxCarryDays) ||
    integrity.fxCarryDays < 0 ||
    integrity.fxCarryDays > 4
  ) {
    issues.push('FX');
  }
  const sessions = integrity.sessions.filter(
    (d) => d >= from && d <= history.asOf,
  );
  const quotes = history.quotes.filter(
    (q) => q.date >= from && q.date <= history.asOf,
  );
  if (
    !sessions.length ||
    sessions.some((d, i) => !validDate(d) || (i > 0 && d <= sessions[i - 1])) ||
    JSON.stringify(sessions) !== JSON.stringify(quotes.map((q) => q.date))
  ) {
    issues.push('SESSIONS');
  }
  const actions = integrity.actions;
  if (
    actions.some(
      (a, i) =>
        !validDate(a.date) ||
        a.date > integrity.shareBasisDate ||
        !positive(a.factor) ||
        a.type === 'UNSUPPORTED' ||
        !sourceIds.includes(a.sourceId) ||
        (i > 0 && a.date <= actions[i - 1].date),
    )
  ) {
    issues.push('ACTIONS');
  }
  if (issues.includes('ACTIONS')) {
    return [...new Set(issues)];
  }
  function factorAt(date: string): string {
    return actions
      .filter((a) => a.date > date)
      .reduce((factor, a) => multiplyDecimals(factor, a.factor), '1');
  }
  for (const q of quotes) {
    if (
      !sourceIds.includes(q.priceSourceId ?? '') ||
      !sourceIds.includes(q.fxSourceId ?? '')
    ) {
      issues.push('SOURCE');
    }
    const lag = (Date.parse(q.date) - Date.parse(q.fxDate ?? '')) / 86400000;
    if (
      !q.fxDate ||
      !validDate(q.fxDate) ||
      !Number.isFinite(lag) ||
      lag < 0 ||
      lag > integrity.fxCarryDays ||
      !positive(q.fx) ||
      (history.currency === 'USD' && q.fx !== '1')
    ) {
      issues.push('FX');
    }
    if (
      !positive(q.rawClose) ||
      !positive(q.close) ||
      q.shareBasisId !== integrity.shareBasisId
    ) {
      issues.push('SHARE_BASIS');
    } else if (
      divideDecimals(q.rawClose, factorAt(q.date), 8) !==
      roundDecimal(q.close, 8)
    ) {
      issues.push('ACTIONS');
    }
  }
  const events = history.dividends.filter(
    (d) => d.exDate >= from && d.exDate <= history.asOf,
  );
  const expected = integrity.expectedDividends.filter(
    (d) => d.exDate >= from && d.exDate <= history.asOf,
  );
  const signature = (items: typeof events): string =>
    JSON.stringify(
      [...items]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((d) => [
          d.id,
          d.exDate,
          d.payDate,
          d.grossPerShare,
          d.sourceId,
          d.rawGrossPerShare,
          d.shareBasisId,
        ]),
    );
  if (
    signature(events) !== signature(expected) ||
    new Set(events.map((d) => d.id)).size !== events.length
  ) {
    issues.push('DIVIDENDS');
  }
  for (const d of events) {
    if (
      !validDate(d.exDate) ||
      !validDate(d.payDate) ||
      d.payDate < d.exDate ||
      !sourceIds.includes(d.sourceId)
    ) {
      issues.push('DIVIDENDS');
    }
    if (
      !positive(d.rawGrossPerShare) ||
      !positive(d.grossPerShare) ||
      d.shareBasisId !== integrity.shareBasisId
    ) {
      issues.push('SHARE_BASIS');
    } else if (
      divideDecimals(d.rawGrossPerShare, factorAt(d.exDate), 8) !==
      roundDecimal(d.grossPerShare, 8)
    ) {
      issues.push('ACTIONS');
    }
  }
  return [...new Set(issues)];
}
