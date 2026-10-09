import { RiRefreshLine } from '@remixicon/react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { DASHBOARD_QUERY_KEY } from '@/hooks/useDashboardSummary';
import { HOLDINGS_QUERY_KEY } from '@/hooks/useHoldings';
import { useLanguage } from '@/hooks/useLanguage';
import { FX_QUERY_KEY } from '@/hooks/useUsdTryRate';
import { formatTime } from '@/lib/formatDate';

export interface PriceStatusProps {
  readonly updatedAt: string;
}

/** Every query whose numbers depend on prices; the refresh button reloads them all. */
const PRICE_QUERY_KEYS = [
  DASHBOARD_QUERY_KEY,
  HOLDINGS_QUERY_KEY,
  FX_QUERY_KEY,
] as const;

export function PriceStatus({ updatedAt }: PriceStatusProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const dashboardFetching = useIsFetching({ queryKey: DASHBOARD_QUERY_KEY });
  const holdingsFetching = useIsFetching({ queryKey: HOLDINGS_QUERY_KEY });

  function refresh(): void {
    for (const queryKey of PRICE_QUERY_KEYS) {
      void queryClient.invalidateQueries({ queryKey });
    }
  }

  return (
    <div className="flex items-center gap-1 text-sm text-fg-2">
      <span>
        {t('dashboard.pricesUpdated', {
          time: formatTime(updatedAt, language),
        })}
      </span>
      <Button
        type="text"
        size="small"
        loading={dashboardFetching + holdingsFetching > 0}
        icon={<RiRefreshLine className="size-4" aria-hidden="true" />}
        aria-label={t('dashboard.refresh')}
        onClick={refresh}
      />
    </div>
  );
}
