import type { AnalysisReport } from '@/domain/analysis';
import type { WatchAsset } from '@/domain/strategy';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import { factTechnicalIssues, validDate } from '@/lib/analysisValidation';
import { ASSET_TYPES } from '@/domain/assetTypes';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export interface ResearchBundle {
  readonly schemaVersion: 1;
  readonly companies: readonly WatchAsset[];
  readonly reports: readonly AnalysisReport[];
  readonly approximate: readonly JsonValue[];
  readonly verified: readonly JsonValue[];
}
export const WORKBOOK_VERSION = 'investulator-research/1';
export const MAX_WORKBOOK_ROWS = 100000;
export const MAX_WORKBOOK_BYTES = 8 * 1024 * 1024;
export const WORKBOOK_SHEETS = [
  'Companies',
  'Financials',
  'MarketData',
  'Dividends',
  'CorporateActions',
  'FXRates',
  'Sources',
  'Peers',
  'Reviews',
  'Reports',
  'VerifiedHistory',
] as const;
export interface WorkbookRow {
  readonly sheet: string;
  readonly row: number;
  readonly assetId: string;
  readonly companyId: string;
  readonly market: string;
  readonly entity: string;
  readonly recordId: string;
  readonly field: string;
  readonly value: string;
  readonly type: string;
}
export interface WorkbookIssue {
  readonly sheet: string;
  readonly row: number;
  readonly column: string;
  readonly code: string;
  readonly field?: string;
}
export interface WorkbookPreview {
  readonly bundle: ResearchBundle;
  readonly issues: readonly WorkbookIssue[];
  readonly added: number;
  readonly updated: number;
  readonly unchanged: number;
  readonly companyIds: readonly string[];
  readonly newCompanyIds: readonly string[];
  readonly sections: readonly string[];
}
export function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function json(value: unknown): JsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(json);
  }
  if (object(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, json(item)]),
    );
  }
  throw new Error('schema');
}
export function canonical(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonical).join(',')}]`;
  }
  if (object(value)) {
    return `{${Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}
function identity(
  bundle: ResearchBundle,
  assetId: string,
): { companyId: string; market: string } {
  const report = bundle.reports.find(
    (item) => item.presentation.assetId === assetId,
  );
  const company = bundle.companies.find((item) => item.id === assetId);
  return {
    companyId: report?.presentation.isin || company?.providerId || assetId,
    market: report?.presentation.market || company?.market || '',
  };
}
function sheetFor(entity: string, path: string): string {
  if (path.startsWith('/peers')) {
    return 'Peers';
  }
  if (entity === 'companies') {
    return 'Companies';
  }
  if (entity === 'verified') {
    return 'VerifiedHistory';
  }
  if (path.includes('sources') || path.toLowerCase().includes('evidence')) {
    return 'Sources';
  }
  if (path.includes('review') || path.includes('coverage')) {
    return 'Reviews';
  }
  if (path.includes('dividends')) {
    return 'Dividends';
  }
  if (path.includes('actions')) {
    return 'CorporateActions';
  }
  if (entity === 'approximate') {
    return path.includes('/fx') ? 'FXRates' : 'MarketData';
  }
  if (path.startsWith('/facts/')) {
    return 'Financials';
  }
  return 'Reports';
}
export function bundleRows(
  bundle: ResearchBundle,
  assetIds?: readonly string[],
): WorkbookRow[] {
  const rows: WorkbookRow[] = [];
  for (const entity of [
    'companies',
    'reports',
    'approximate',
    'verified',
  ] as const) {
    for (const item of bundle[entity]) {
      const data = json(item);
      if (!object(data)) {
        throw new Error('schema');
      }
      const assetId =
        entity === 'companies'
          ? data.id
          : entity === 'reports' && object(data.presentation)
            ? data.presentation.assetId
            : data.assetId;
      const recordId = entity === 'reports' ? data.version : assetId;
      if (typeof assetId !== 'string' || typeof recordId !== 'string') {
        throw new Error('identity');
      }
      const assetKey = assetId,
        recordKey = recordId;
      if (assetIds && !assetIds.includes(assetId)) {
        continue;
      }
      const ids = identity(bundle, assetId);
      function walk(value: JsonValue, path: string): void {
        if (Array.isArray(value) && value.length) {
          value.forEach((child, index) => walk(child, `${path}/${index}`));
          return;
        }
        if (object(value) && Object.keys(value).length) {
          for (const [key, child] of Object.entries(value)) {
            walk(
              json(child),
              `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`,
            );
          }
          return;
        }
        const sheet = sheetFor(entity, path);
        rows.push({
          sheet,
          row: 0,
          assetId: assetKey,
          ...ids,
          entity,
          recordId: recordKey,
          field: path,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          type:
            value === null
              ? 'null'
              : Array.isArray(value)
                ? 'array'
                : typeof value,
        });
      }
      walk(data, '');
    }
  }
  const counts = new Map<string, number>();
  return rows.map((row) => {
    const line = (counts.get(row.sheet) ?? 1) + 1;
    counts.set(row.sheet, line);
    return { ...row, row: line };
  });
}

function key(row: WorkbookRow): string {
  return JSON.stringify([row.entity, row.recordId, row.field]);
}
function assign(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const parts = path
    .split('/')
    .slice(1)
    .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'));
  if (
    !path.startsWith('/') ||
    /~(?![01])/.test(path) ||
    !parts.length ||
    parts.length > 20 ||
    parts.some(
      (part) =>
        ['__proto__', 'prototype', 'constructor'].includes(part) ||
        !part ||
        (/^\d+$/.test(part) && Number(part) > MAX_WORKBOOK_ROWS),
    )
  ) {
    throw new Error('field');
  }
  let current: Record<string, unknown> | unknown[] = target;
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const slot = Array.isArray(current) ? Number(part) : part;
    if (Array.isArray(current)) {
      if (!/^\d+$/.test(part)) {
        throw new Error('field');
      }
      if (index === parts.length - 1) {
        current[Number(slot)] = value;
        return;
      }
      current[Number(slot)] ??= /^\d+$/.test(parts[index + 1]) ? [] : {};
      const next: unknown = current[Number(slot)];
      if (!object(next) && !Array.isArray(next)) {
        throw new Error('field');
      }
      current = next;
    } else {
      if (index === parts.length - 1) {
        current[part] = value;
        return;
      }
      current[part] ??= /^\d+$/.test(parts[index + 1]) ? [] : {};
      const next: unknown = current[part];
      if (!object(next) && !Array.isArray(next)) {
        throw new Error('field');
      }
      current = next;
    }
  }
}
function parseCell(row: WorkbookRow): unknown {
  if (row.type === 'string') {
    return row.value;
  }
  const value: unknown = JSON.parse(row.value);
  if (
    (row.type === 'null' && value === null) ||
    (row.type === 'number' &&
      typeof value === 'number' &&
      Number.isFinite(value)) ||
    (row.type === 'boolean' && typeof value === 'boolean') ||
    (row.type === 'array' && Array.isArray(value) && !value.length) ||
    (row.type === 'object' && object(value) && !Object.keys(value).length)
  ) {
    return value;
  }
  throw new Error('type');
}

export function parseResearchBundle(value: unknown): ResearchBundle {
  if (
    !object(value) ||
    value.schemaVersion !== 1 ||
    !Array.isArray(value.companies) ||
    !Array.isArray(value.approximate) ||
    !Array.isArray(value.verified)
  ) {
    throw new Error('schema');
  }
  const companies = value.companies.map((item): WatchAsset => {
    if (
      !object(item) ||
      typeof item.id !== 'string' ||
      !item.id ||
      typeof item.symbol !== 'string' ||
      !item.symbol ||
      !ASSET_TYPES.some((type) => type === item.assetType) ||
      item.identityStatus !== 'UNVERIFIED'
    ) {
      throw new Error('identity');
    }
    const assetType = ASSET_TYPES.find((type) => type === item.assetType);
    if (!assetType) {
      throw new Error('identity');
    }
    function nullable(field: string): string | null {
      const result = item[field];
      if (result === null || typeof result === 'string') {
        return result;
      }
      throw new Error('identity');
    }
    return {
      id: item.id,
      symbol: item.symbol,
      name: nullable('name'),
      market: nullable('market'),
      pair: nullable('pair'),
      providerId: nullable('providerId'),
      identityStatus: 'UNVERIFIED',
      assetType,
    };
  });
  if (new Set(companies.map((item) => item.id)).size !== companies.length) {
    throw new Error('duplicate');
  }
  return {
    schemaVersion: 1,
    companies,
    reports: parseAnalysisReports(value.reports),
    approximate: value.approximate.map(json),
    verified: value.verified.map(json),
  };
}

export function previewWorkbook(
  rows: readonly WorkbookRow[],
  baseline: ResearchBundle,
  scope?: string,
): WorkbookPreview {
  const issues: WorkbookIssue[] = [];
  const initial = bundleRows(baseline);
  const merged = new Map(initial.map((row) => [key(row), row]));
  const originalRows = new Map(initial.map((row) => [key(row), row]));
  const seen = new Set<string>();
  let added = 0,
    updated = 0,
    unchanged = 0;
  const companyIds = [...new Set(rows.map((row) => row.assetId))];
  function issue(row: WorkbookRow, column: string, code: string): void {
    issues.push({
      sheet: row.sheet,
      row: row.row,
      column,
      code,
      field: row.field,
    });
  }
  if (rows.length > MAX_WORKBOOK_ROWS) {
    issues.push({
      sheet: 'Instructions',
      row: 1,
      column: 'rows',
      code: 'limit',
    });
  }
  for (const row of rows) {
    if (
      !WORKBOOK_SHEETS.some((sheet) => sheet === row.sheet) ||
      !['companies', 'reports', 'approximate', 'verified'].includes(row.entity)
    ) {
      issue(row, 'entity', 'schema');
      continue;
    }
    if (scope && row.assetId !== scope) {
      issue(row, 'assetId', 'scope');
      continue;
    }
    const company = baseline.companies.find((item) => item.id === row.assetId);
    const expected = identity(baseline, row.assetId);
    if (
      company &&
      (row.companyId !== expected.companyId || row.market !== expected.market)
    ) {
      issue(row, 'companyId', 'identity');
      continue;
    }
    if (seen.has(key(row))) {
      issue(row, 'field', 'duplicate');
      continue;
    }
    seen.add(key(row));
    const old = merged.get(key(row));
    // An empty presentation projection requests derivation, not deletion of financial facts.
    if (
      row.entity === 'reports' &&
      row.field === '/presentation/facts' &&
      row.type === 'array' &&
      row.value === '[]' &&
      initial.some(
        (entry) =>
          entry.entity === row.entity &&
          entry.recordId === row.recordId &&
          entry.field.startsWith('/presentation/facts/'),
      )
    ) {
      continue;
    }
    if (
      (row.type === 'array' || row.type === 'object') &&
      initial.some(
        (entry) =>
          entry.entity === row.entity &&
          entry.recordId === row.recordId &&
          entry.field.startsWith(`${row.field}/`),
      )
    ) {
      issue(row, 'field', 'deletionUnsupported');
      continue;
    }
    if (old && row.field.endsWith('/id') && old.value !== row.value) {
      issue(row, 'field', 'recordIdentity');
      continue;
    }
    if (
      row.entity === 'reports' &&
      /^\/(contracts|calculations|presentation\/calculations)(\/|$)/.test(
        row.field,
      ) &&
      (!old || old.value !== row.value || old.type !== row.type) &&
      !(
        !old &&
        row.type === 'array' &&
        row.value === '[]' &&
        ['/contracts', '/calculations', '/presentation/calculations'].includes(
          row.field,
        )
      )
    ) {
      issue(row, 'field', 'calculationReadOnly');
      continue;
    }
    if (old && old.assetId !== row.assetId) {
      issue(row, 'assetId', 'identity');
      continue;
    }
    // Empty spreadsheet cells never erase prior values. Explicit deletion is unsupported in v1.
    if (row.value === '' && old) {
      unchanged++;
      continue;
    }
    try {
      parseCell(row);
    } catch {
      issue(row, 'value', 'type');
      continue;
    }
    if (!old) {
      added++;
    } else if (old.value === row.value && old.type === row.type) {
      unchanged++;
    } else {
      updated++;
    }
    merged.set(key(row), row);
  }
  const entities = new Map<
    string,
    { entity: string; data: Record<string, unknown>; row: WorkbookRow }
  >();
  for (const row of merged.values()) {
    const id = JSON.stringify([row.entity, row.recordId]);
    const entry = entities.get(id) ?? { entity: row.entity, data: {}, row };
    try {
      assign(entry.data, row.field, parseCell(row));
      entities.set(id, entry);
    } catch {
      issue(row, 'field', 'field');
    }
  }
  let bundle = baseline;
  for (const entry of entities.values()) {
    const incoming = rows.filter(
      (row) =>
        row.entity === entry.entity && row.recordId === entry.row.recordId,
    );
    if (!incoming.length) {
      continue;
    }
    try {
      if (entry.entity === 'reports') {
        parseAnalysisReports([entry.data]);
      }
      if (entry.entity === 'companies') {
        parseResearchBundle({
          schemaVersion: 1,
          companies: [entry.data],
          reports: [],
          approximate: [],
          verified: [],
        });
      }
    } catch {
      issue(
        incoming[0],
        'field',
        entry.entity === 'companies' ? 'companyRequired' : 'reportSchema',
      );
    }
  }
  try {
    const take = (entity: string): unknown[] =>
      [...entities.values()]
        .filter((entry) => entry.entity === entity)
        .map((entry) => entry.data);
    if (issues.length) {
      return {
        bundle: baseline,
        issues,
        added,
        updated,
        unchanged,
        companyIds,
        newCompanyIds: [],
        sections: [],
      };
    }
    const parsed = parseResearchBundle({
      schemaVersion: 1,
      companies: take('companies'),
      reports: take('reports'),
      approximate: take('approximate'),
      verified: take('verified'),
    });
    const reports = parsed.reports.map((report): AnalysisReport => {
      const previous = baseline.reports.find(
        (item) => item.version === report.version,
      );
      const company = parsed.companies.find(
        (item) => item.id === report.presentation.assetId,
      );
      if (
        !company ||
        company.symbol !== report.presentation.symbol ||
        company.market !== report.presentation.market
      ) {
        throw new Error('identity');
      }
      if (
        new Set(report.facts.map((fact) => fact.id)).size !==
          report.facts.length ||
        new Set(report.presentation.sources.map((source) => source.id)).size !==
          report.presentation.sources.length
      ) {
        throw new Error('duplicate');
      }
      if (
        previous &&
        (previous.presentation.assetId !== report.presentation.assetId ||
          previous.presentation.isin !== report.presentation.isin)
      ) {
        throw new Error('identity');
      }
      for (const source of report.presentation.sources) {
        if (
          canonical(source) ===
          canonical(
            previous?.presentation.sources.find(
              (item) => item.id === source.id,
            ),
          )
        ) {
          continue;
        }
        if (
          !source.url.startsWith('https://') ||
          (source.publishedAt !== null && !validDate(source.publishedAt)) ||
          (source.observedAt !== undefined && !validDate(source.observedAt))
        ) {
          throw new Error('source');
        }
      }
      const facts = report.facts.map((fact) => {
        const old = previous?.facts.find((item) => item.id === fact.id);
        const unchangedSource =
          canonical(
            previous?.presentation.sources.find(
              (source) => source.id === fact.sourceId,
            ),
          ) ===
          canonical(
            report.presentation.sources.find(
              (source) => source.id === fact.sourceId,
            ),
          );
        if (canonical(old) === canonical(fact) && unchangedSource) {
          return fact;
        }
        if (
          [
            'marketCap',
            'priceBook',
            'peTtm',
            'peRunRate',
            'peHalfYear',
            'roe',
            'evEbitda',
            'netDebtEbitda',
            'dividendYield',
            'cashProxy',
            'operatingMargin',
            'profitGrowth',
            'revenueGrowth',
            'currentRatio',
          ].includes(fact.id)
        ) {
          throw new Error('calculationReadOnly');
        }
        if (
          old &&
          (old.basis.start !== fact.basis.start ||
            old.basis.end !== fact.basis.end ||
            old.basis.periodKind !== fact.basis.periodKind)
        ) {
          throw new Error('appendNewPeriod');
        }
        const row = rows.find(
          (entry) =>
            entry.recordId === report.version &&
            entry.field === `/facts/${report.facts.indexOf(fact)}/value`,
        );
        const errors = factTechnicalIssues(fact);
        if (
          !report.presentation.sources.some(
            (source) =>
              source.id === fact.sourceId && source.url.startsWith('https://'),
          ) ||
          !fact.locator
        ) {
          errors.push('SOURCE');
        }
        if (errors.length) {
          issues.push({
            sheet: row?.sheet ?? 'Financials',
            row: row?.row ?? 0,
            column: 'value',
            code: errors.join(','),
          });
        }
        return {
          ...fact,
          verification: 'UNVERIFIED' as const,
          unreviewedEvidence: fact.evidence ?? fact.unreviewedEvidence,
          evidence: undefined,
        };
      });
      if (canonical(previous) === canonical(report)) {
        return report;
      }
      for (const peer of report.peers ?? []) {
        const candidate = parsed.reports.find(
          (item) =>
            item.version === peer.reportVersion &&
            item.presentation.assetId === peer.assetId,
        );
        if (
          !candidate ||
          !candidate.facts.some((fact) => fact.id === peer.factId) ||
          !report.facts.some((fact) => fact.id === peer.subjectFactId)
        ) {
          throw new Error('peerReference');
        }
      }
      const history = [...(report.financialHistory ?? [])].map((entry) => ({
        ...entry,
        factIds: [...entry.factIds],
      }));
      for (const fact of facts.filter(
        (entry) =>
          entry.basis.periodKind === 'YEAR' &&
          !previous?.facts.some((old) => old.id === entry.id),
      )) {
        const year = fact.basis.end.slice(0, 4);
        const entry = history.find((item) => item.year === year);
        if (entry) {
          if (!entry.factIds.includes(fact.id)) {
            entry.factIds.push(fact.id);
          }
        } else {
          history.push({ year, factIds: [fact.id], calculationIds: [] });
        }
      }
      return {
        ...report,
        facts,
        sections: report.sections?.map((section) => ({
          ...section,
          status: section.status === 'COMPLETE' ? 'PARTIAL' : section.status,
        })),
        ...(report.financialHistory || history.length
          ? { financialHistory: history }
          : {}),
        presentation: {
          ...report.presentation,
          narrativeStale: true,
          facts: facts.map(
            ({
              id,
              value,
              unit,
              period,
              sourceId,
              metricKey,
              comparisonKey,
            }) => ({
              id,
              value,
              unit,
              period,
              sourceId,
              ...(metricKey ? { metricKey } : {}),
              ...(comparisonKey ? { comparisonKey } : {}),
            }),
          ),
          status: 'PARTIAL',
          review: {
            ...report.presentation.review,
            status: 'NEEDS_REVIEW',
            independent: false,
          },
        },
      };
    });
    for (const row of rows) {
      const actual = identity(parsed, row.assetId);
      const recordMatches =
        row.entity === 'reports'
          ? parsed.reports.some(
              (report) =>
                report.version === row.recordId &&
                report.presentation.assetId === row.assetId,
            )
          : row.recordId === row.assetId;
      if (
        !recordMatches ||
        !parsed.companies.some((company) => company.id === row.assetId) ||
        actual.companyId !== row.companyId ||
        actual.market !== row.market
      ) {
        issue(row, 'companyId', 'identity');
      }
    }
    // Historical data are never promoted by importing them. Validate changed histories separately.
    for (const entity of ['approximate', 'verified'] as const) {
      for (const history of parsed[entity]) {
        if (!object(history) || typeof history.assetId !== 'string') {
          throw new Error('history');
        }
        const old = baseline[entity].find(
          (item) => object(item) && item.assetId === history.assetId,
        );
        if (canonical(old) === canonical(history)) {
          continue;
        }
        if (entity === 'verified') {
          throw new Error('verifiedHistoryRequiresReview');
        }
        validateApproximate(history);
      }
    }
    bundle = { ...parsed, reports };
  } catch (error) {
    issues.push({
      sheet: 'Reports',
      row: 0,
      column: 'value',
      code: error instanceof Error ? error.message : 'schema',
    });
  }
  if (!issues.length) {
    const effective = bundleRows(bundle, companyIds);
    const after = new Map(effective.map((row) => [key(row), row]));
    added = 0;
    updated = 0;
    unchanged = 0;
    for (const row of effective) {
      const prior = originalRows.get(key(row));
      if (!prior) {
        added++;
      } else if (prior.value !== row.value || prior.type !== row.type) {
        updated++;
      } else {
        unchanged++;
      }
    }
    for (const row of initial.filter((item) =>
      companyIds.includes(item.assetId),
    )) {
      if (!after.has(key(row))) {
        updated++;
      }
    }
  }
  return {
    bundle: issues.length ? baseline : bundle,
    issues,
    added,
    updated,
    unchanged,
    companyIds,
    newCompanyIds: companyIds.filter(
      (id) => !baseline.companies.some((company) => company.id === id),
    ),
    sections: [
      ...new Set(
        rows
          .filter((row) => originalRows.get(key(row))?.value !== row.value)
          .map((row) => row.sheet),
      ),
    ],
  };
}

function validateApproximate(history: Record<string, unknown>): void {
  if (!isApproximateHistory(history)) {
    throw new Error('history');
  }
  if (
    !['TRY', 'USD'].includes(String(history.currency)) ||
    !['SPLIT_ONLY', 'TOTAL_RETURN', 'UNKNOWN'].includes(
      String(history.priceBasis),
    ) ||
    !validDate(String(history.asOf)) ||
    !validDate(String(history.shareBasisDate))
  ) {
    throw new Error('history');
  }
  if (
    !Array.isArray(history.sources) ||
    !history.sources.every(
      (source) =>
        object(source) &&
        typeof source.id === 'string' &&
        typeof source.url === 'string' &&
        source.url.startsWith('https://') &&
        typeof source.origin === 'string',
    )
  ) {
    throw new Error('source');
  }
  const sources = history.sources.map((source) =>
    object(source) ? source.id : undefined,
  );
  for (const field of ['monthly', 'dividends', 'actions']) {
    const entries = history[field];
    if (!Array.isArray(entries)) {
      throw new Error('history');
    }
    const ids = new Set<string>();
    for (const entry of entries) {
      if (!object(entry)) {
        throw new Error('history');
      }
      const id = String(entry.id ?? entry.date);
      if (ids.has(id)) {
        throw new Error('duplicate');
      }
      ids.add(id);
      for (const [key, value] of Object.entries(entry)) {
        if (
          (key === 'date' || key.endsWith('Date')) &&
          !validDate(String(value))
        ) {
          throw new Error('date');
        }
        if (
          ['close', 'fx', 'factor', 'rawGrossPerShare'].includes(key) &&
          (typeof value !== 'string' ||
            !/^\d+(\.\d+)?$/.test(value) ||
            !/[1-9]/.test(value))
        ) {
          throw new Error('number');
        }
        if (key.endsWith('SourceId') || key === 'sourceId') {
          if (!sources.includes(value)) {
            throw new Error('source');
          }
        }
      }
    }
  }
  // Existing engine remains responsible for monthly coverage, corporate-action basis and timing gates.
}
