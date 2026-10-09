import { RiErrorWarningLine, RiTimeLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { PriceStatus } from '@/domain/holding';
import { useLanguage } from '@/hooks/useLanguage';
import { formatTime } from '@/lib/formatDate';

export interface PriceBadgeProps {
  readonly status: PriceStatus;
  readonly updatedAt: string | null;
}

/** Warns that a price is old or missing; a current price shows nothing. Icon plus text, never color alone. */
export function PriceBadge({
  status,
  updatedAt,
}: PriceBadgeProps): JSX.Element | null {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (status === 'FRESH') {
    return null;
  }
  const Icon = status === 'STALE' ? RiTimeLine : RiErrorWarningLine;
  const hint =
    status === 'STALE' && updatedAt !== null
      ? t('holdings.price.staleHint', { time: formatTime(updatedAt, language) })
      : t('holdings.price.unavailableHint');

  return (
    <span
      title={hint}
      className="inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-full bg-warn-soft px-2 text-xs font-medium text-warn"
    >
      <Icon className="size-3" aria-hidden="true" />
      {t(`holdings.price.${status}`)}
    </span>
  );
}
