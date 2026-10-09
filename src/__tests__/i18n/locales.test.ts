import { describe, expect, it } from 'vitest';
import en from '@/i18n/locales/en.json';
import tr from '@/i18n/locales/tr.json';

function flattenKeys(node: unknown, prefix = ''): string[] {
  if (typeof node !== 'object' || node === null) {
    return [prefix];
  }
  return Object.entries(node).flatMap(([key, value]) =>
    flattenKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe('locales', () => {
  it('define exactly the same keys in Turkish and English', () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(tr).sort());
  });

  it('have no empty translations', () => {
    for (const locale of [tr, en]) {
      const values = JSON.stringify(locale).match(/:"([^"]*)"/g) ?? [];
      expect(values.filter((entry) => entry === ':""')).toEqual([]);
    }
  });
});
