import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card/Card';
import { PnlValue } from '@/components/Pnl/PnlValue';
import { ASSET_TYPE_COLOR } from '@/domain/assetTypes';
import { useMoney } from '@/hooks/useMoney';
import { getSign, toDisplayNumber } from '@/lib/decimal';
import type { AssetTypePerformance } from '@/lib/analysisView';

export function TypePerformance({
  groups,
}: {
  readonly groups: readonly AssetTypePerformance[];
}): JSX.Element {
  const { t } = useTranslation();
  const money = useMoney();
  const max = Math.max(
    1,
    ...groups.map((item) => Math.abs(toDisplayNumber(item.pnl))),
  );
  return (
    <Card className="p-5">
      <h2 className="font-semibold">{t('analysis.byType')}</h2>
      <p className="mt-1 text-sm text-fg-2">{t('analysis.byTypeNote')}</p>
      <ul className="mt-5 flex flex-col gap-5">
        {groups.map((item) => (
          <li key={item.assetType}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="inline-flex items-center gap-2 font-medium">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: ASSET_TYPE_COLOR[item.assetType] }}
                  aria-hidden="true"
                />
                {t(`assetTypes.${item.assetType}`)}
              </span>
              <PnlValue amount={item.pnl} percent={item.pnlPercent} />
            </div>
            <div
              className="my-2 h-2 overflow-hidden rounded-full bg-surface-2"
              aria-hidden="true"
            >
              <div
                className={`h-full rounded-full ${getSign(item.pnl) === 'negative' ? 'bg-neg' : 'bg-pos'}`}
                style={{
                  width: `${(Math.abs(toDisplayNumber(item.pnl)) / max) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-fg-2">
              {t('analysis.typeAmounts', {
                value: money.format(item.value),
                cost: money.format(item.cost),
              })}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
