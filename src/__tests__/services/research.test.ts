import { describe, expect, it } from 'vitest';
import { fetchResearch, hasResearch } from '@/services/research';
import { tuprsReport } from '@/data/research/tuprs-2026-10-11';
import { tuprsReportV2 } from '@/data/research/tuprs-2026-10-11-v2';
import { tuprsReportV3 } from '@/data/research/tuprs-2026-10-11-v3';
import { i18n } from '@/i18n';

describe('file research service', () => {
  it('matches catalog IDs, never symbols or unrelated assets', async () => {
    expect(hasResearch('watch-bist-tuprs')).toBe(true);
    expect(hasResearch('TUPRS')).toBe(false);
    expect(await fetchResearch('TUPRS')).toEqual([]);
    expect(await fetchResearch('watch-crypto-candidate-ai')).toEqual([]);
    const reports = await fetchResearch('watch-bist-tuprs');
    expect(reports[0].id).toBe('tuprs-2026-10-22-v6');
    expect(reports[1].id).toBe('tuprs-2026-10-21-v4');
    expect(reports.slice(2)).toEqual([
      tuprsReportV3,
      tuprsReportV2,
      tuprsReport,
    ]);
    expect(reports[0]).not.toBe(tuprsReport);
    expect(reports[0]?.facts).not.toBe(tuprsReport.facts);
  });

  it('keeps facts, formula inputs and disclosure sources traceable', () => {
    const sources = new Set(tuprsReport.sources.map((source) => source.id));
    const facts = new Set(tuprsReport.facts.map((fact) => fact.id));
    expect(facts.size).toBe(tuprsReport.facts.length);
    expect(sources.size).toBe(tuprsReport.sources.length);
    for (const fact of tuprsReport.facts) {
      expect(fact.value).toMatch(/^-?\d+(\.\d+)?$/);
      expect(sources.has(fact.sourceId)).toBe(true);
    }
    for (const calculation of tuprsReport.calculations) {
      expect(calculation.inputs.every((id) => facts.has(id))).toBe(true);
    }
    for (const disclosure of tuprsReport.disclosures) {
      expect(sources.has(disclosure.sourceId)).toBe(true);
    }
    for (const disclosure of tuprsReport.disclosures.filter(
      (item) => !item.contextOnly,
    )) {
      expect(
        disclosure.publishedAt.slice(0, 10) >= tuprsReport.disclosureScan.from,
      ).toBe(true);
      expect(
        disclosure.publishedAt.slice(0, 10) <= tuprsReport.disclosureScan.to,
      ).toBe(true);
    }
    expect(tuprsReport.status).toBe('PARTIAL');
    expect(tuprsReport.review.independent).toBe(false);
    expect(tuprsReport.disclosureScan.status).toBe('PARTIAL');
  });

  it.each(['tr', 'en'])(
    'has %s labels for every displayed metric and disclosure',
    (lng) => {
      for (const id of [
        ...tuprsReport.facts.map((fact) => fact.id),
        ...tuprsReport.calculations.map((entry) => entry.id),
      ]) {
        expect(i18n.exists(`research.metrics.${id}`, { lng })).toBe(true);
      }
      for (const calculation of tuprsReport.calculations) {
        expect(
          i18n.exists(`research.formulas.${calculation.id}`, { lng }),
        ).toBe(true);
        expect(
          i18n.exists(`researchTuprs.education.${calculation.id}`, { lng }),
        ).toBe(true);
      }
      for (const disclosure of tuprsReport.disclosures) {
        expect(
          i18n.exists(`researchTuprs.news.${disclosure.key}.fact`, { lng }),
        ).toBe(true);
        expect(
          i18n.exists(`researchTuprs.news.${disclosure.key}.effect`, { lng }),
        ).toBe(true);
      }
    },
  );
});
