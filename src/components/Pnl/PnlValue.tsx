import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useMoney } from '@/hooks/useMoney';
import { getSign } from '@/lib/decimal';
import { formatPercent } from '@/lib/formatNumber';

export interface PnlValueProps {
  /** Signed decimal string, e.g. "-189.00". */
  readonly amount?: string;
  /** Signed percentage in percent units, e.g. "-7.1". */
  readonly percent?: string;
}

const TONE_CLASS = {
  positive: 'text-pos',
  negative: 'text-neg',
  zero: 'text-fg-2',
} as const;

/** Profit or loss. Never color alone: the sign and an arrow carry the meaning too. */
export function PnlValue({ amount, percent }: PnlValueProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const money = useMoney();
  const sign = getSign(amount ?? percent ?? '0');
  const amountText =
    amount === undefined ? null : money.format(amount, { signed: true });
  const percentText =
    percent === undefined
      ? null
      : formatPercent(percent, language, { signed: true });

  return (
    <span
      className={`inline-flex flex-wrap items-center justify-end gap-x-1 font-medium tabular-nums ${TONE_CLASS[sign]}`}
    >
      {sign === 'positive' && (
        <RiArrowUpSFill className="size-4" aria-hidden="true" />
      )}
      {sign === 'negative' && (
        <RiArrowDownSFill className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">{t(`pnl.${sign}`)}</span>
      {/* Never split "+" from the amount; the percentage wraps below when the cell is narrow. */}
      {amountText !== null && (
        <span className="whitespace-nowrap">{amountText}</span>
      )}
      {percentText !== null && (
        <span className={amountText === null ? '' : 'font-normal'}>
          {amountText === null ? percentText : `(${percentText})`}
        </span>
      )}
    </span>
  );
}
