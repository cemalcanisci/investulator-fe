import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { SwatchChip } from '@/components/Foundations/SwatchChip';
import { useTheme } from '@/hooks/useTheme';
import { getThemeTokens, type TokenName } from '@/theme/themes';

interface TokenGroup {
  readonly key: string;
  readonly tokens: readonly TokenName[];
}

const TOKEN_GROUPS: readonly TokenGroup[] = [
  {
    key: 'surface',
    tokens: ['bg', 'surface', 'surface-2', 'border', 'border-strong'],
  },
  { key: 'text', tokens: ['text', 'text-2', 'text-3'] },
  { key: 'nav', tokens: ['nav-bg', 'nav-text', 'nav-active-bg'] },
  {
    key: 'brand',
    tokens: [
      'primary',
      'primary-hover',
      'primary-soft',
      'accent',
      'accent-soft',
    ],
  },
  {
    key: 'semantic',
    tokens: ['pos', 'pos-soft', 'neg', 'neg-soft', 'warn', 'warn-soft', 'info'],
  },
  {
    key: 'chart',
    tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'chart-6'],
  },
];

export function ColorSwatches(): JSX.Element {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const tokens = getThemeTokens(theme);

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">{t('foundations.colors')}</h2>
      {TOKEN_GROUPS.map((group) => (
        <div key={group.key} className="flex flex-col gap-3">
          <h3 className="text-base font-semibold">
            {t(`foundations.colorGroups.${group.key}`)}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {group.tokens.map((token) => (
              <div
                key={token}
                className="overflow-hidden rounded-xl border border-line bg-surface"
              >
                <SwatchChip token={token} value={tokens[token]} />
                <div className="flex flex-col gap-0.5 px-2.5 py-2 text-xs">
                  <code>--{token}</code>
                  <span className="text-fg-2 tabular-nums">
                    {tokens[token]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
