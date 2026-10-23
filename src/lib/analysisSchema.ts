import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import { isSourceEvidence } from '@/lib/sourceEvidence';

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}
function stringFields(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  return keys.every((k) => typeof value[k] === 'string');
}
function oneOf(value: unknown, choices: readonly string[]): boolean {
  return typeof value === 'string' && choices.includes(value);
}

function isFact(value: unknown): value is FinancialFact {
  if (!record(value) || !record(value.basis)) {
    return false;
  }
  const b = value.basis;
  return (
    (value.metricKey === undefined || typeof value.metricKey === 'string') &&
    (value.comparisonKey === undefined ||
      typeof value.comparisonKey === 'string') &&
    (value.evidence === undefined || isSourceEvidence(value.evidence)) &&
    stringFields(value, [
      'id',
      'value',
      'period',
      'sourceId',
      'checkedAt',
      'locator',
    ]) &&
    oneOf(value.unit, [
      'TRY',
      'TRY_SHARE',
      'USD',
      'USD_SHARE',
      'SHARES',
      'USD_BARREL',
      'PERCENT',
      'MULTIPLE',
    ]) &&
    oneOf(value.verification, ['VERIFIED', 'UNVERIFIED', 'CONFLICT']) &&
    stringFields(b, ['currency', 'scale', 'start', 'end']) &&
    oneOf(b.scope, ['CONSOLIDATED', 'SOLO', 'MARKET']) &&
    oneOf(b.attribution, ['GROUP', 'PARENT', 'SHARE']) &&
    oneOf(b.accounting, ['TAS29', 'NOMINAL', 'IFRS']) &&
    oneOf(b.periodKind, ['INSTANT', 'H1', 'QUARTER', 'YEAR', 'TTM']) &&
    (b.purchasingPowerDate === null ||
      typeof b.purchasingPowerDate === 'string') &&
    (b.shareBasis === null || typeof b.shareBasis === 'string')
  );
}

function isReport(value: unknown): value is AnalysisReport {
  if (
    !record(value) ||
    value.schemaVersion !== 2 ||
    value.profileVersion !== '1' ||
    typeof value.version !== 'string' ||
    !record(value.context) ||
    !record(value.presentation)
  ) {
    return false;
  }
  const p = value.presentation;
  return (
    (value.revision === undefined ||
      (typeof value.revision === 'number' &&
        Number.isSafeInteger(value.revision) &&
        value.revision > 0)) &&
    (value.financialHistory === undefined ||
      (Array.isArray(value.financialHistory) &&
        value.financialHistory.every(
          (row) =>
            record(row) &&
            typeof row.year === 'string' &&
            strings(row.factIds) &&
            strings(row.calculationIds),
        ))) &&
    (value.sections === undefined ||
      (Array.isArray(value.sections) &&
        value.sections.every(
          (s) =>
            record(s) &&
            stringFields(s, ['id', 'contentKey']) &&
            oneOf(s.status, ['PARTIAL', 'MISSING', 'COMPLETE']) &&
            strings(s.sourceIds),
        ))) &&
    oneOf(value.context.assetType, ['EQUITY', 'CRYPTO', 'FUND']) &&
    typeof value.context.businessModel === 'string' &&
    strings(value.context.strategies) &&
    value.context.strategies.every((s) =>
      ['DIVIDEND', 'GROWTH', 'VALUE', 'LONG_TERM'].includes(s),
    ) &&
    Array.isArray(value.facts) &&
    value.facts.every(isFact) &&
    Array.isArray(value.contracts) &&
    value.contracts.every(
      (c) =>
        record(c) &&
        typeof c.id === 'string' &&
        (c.metricKey === undefined || typeof c.metricKey === 'string') &&
        strings(c.units) &&
        oneOf(c.periodPolicy, ['SAME', 'COMPARABLE', 'DATED_MARKET']) &&
        oneOf(c.earningsBasis, [
          'REPORTED',
          'ANNUALIZED_ESTIMATE',
          'NORMALIZED',
          'TTM',
        ]),
    ) &&
    Array.isArray(value.calculations) &&
    value.calculations.every(
      (c) =>
        record(c) &&
        typeof c.id === 'string' &&
        strings(c.inputs) &&
        (c.metricKey === undefined || typeof c.metricKey === 'string') &&
        oneOf(c.operation, [
          'RATIO',
          'PERCENT',
          'GROWTH',
          'SUBTRACT',
          'MULTIPLY',
          'SUM',
          'MEAN',
          'PRODUCT_OVER_SUM',
        ]) &&
        oneOf(c.unit, [
          'TRY',
          'TRY_SHARE',
          'USD',
          'USD_SHARE',
          'PERCENT',
          'MULTIPLE',
        ]) &&
        typeof c.precision === 'number' &&
        Number.isInteger(c.precision) &&
        c.precision >= 0 &&
        c.precision <= 18,
    ) &&
    p.schemaVersion === 1 &&
    stringFields(p, [
      'id',
      'assetId',
      'symbol',
      'isin',
      'market',
      'sector',
      'contentKey',
      'asOf',
      'retrievedAt',
      'timezone',
      'financialPeriod',
      'priceAt',
    ]) &&
    oneOf(p.status, ['PARTIAL', 'COMPLETE']) &&
    p.valuationStatus === 'NOT_ASSESSED' &&
    record(p.review) &&
    oneOf(p.review.status, ['NEEDS_REVIEW', 'PASS']) &&
    typeof p.review.independent === 'boolean' &&
    typeof p.review.key === 'string' &&
    Array.isArray(p.sources) &&
    p.sources.every(
      (s) =>
        record(s) &&
        stringFields(s, ['id', 'title', 'url', 'period', 'locator']) &&
        (s.publishedAt === null || typeof s.publishedAt === 'string'),
    ) &&
    Array.isArray(p.facts) &&
    Array.isArray(p.calculations) &&
    Array.isArray(p.debtLines) &&
    Array.isArray(p.coverage) &&
    Array.isArray(p.disclosures) &&
    record(p.disclosureScan)
  );
}

export function parseAnalysisReports(
  value: unknown,
): readonly AnalysisReport[] {
  if (!Array.isArray(value) || !value.every(isReport)) {
    throw new Error('Invalid analysis schema');
  }
  if (new Set(value.map((r) => r.version)).size !== value.length) {
    throw new Error('Duplicate analysis version');
  }
  return structuredClone(value);
}
