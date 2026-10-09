import type { JSX } from 'react';
import type { TokenName } from '@/theme/themes';

const TEXT_TOKENS: readonly TokenName[] = [
  'text',
  'text-2',
  'text-3',
  'nav-text',
];

export interface SwatchChipProps {
  readonly token: TokenName;
  readonly value: string;
}

export function SwatchChip({ token, value }: SwatchChipProps): JSX.Element {
  const onNav = token === 'nav-text' || token === 'nav-active-bg';
  const base = onNav ? 'var(--nav-bg)' : 'var(--surface)';

  if (TEXT_TOKENS.includes(token)) {
    return (
      <div
        className="grid h-14 place-items-center border-b border-line font-semibold"
        style={{ backgroundColor: base, color: value }}
      >
        Aa
      </div>
    );
  }

  // Layering over the base keeps translucent tokens (dark theme "soft" fills) visible.
  return (
    <div
      className="h-14 border-b border-line"
      style={{
        backgroundColor: base,
        backgroundImage: `linear-gradient(${value}, ${value})`,
      }}
    />
  );
}
