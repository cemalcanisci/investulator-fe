import type { JSX } from 'react';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Card } from '@/components/Card/Card';
import { PnlValue } from '@/components/Pnl/PnlValue';
import type { Mover } from '@/services/dashboard';

export interface MoversCardProps {
  readonly title: string;
  readonly movers: readonly Mover[];
}

export function MoversCard({ title, movers }: MoversCardProps): JSX.Element {
  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      <ul className="mt-2 divide-y divide-line">
        {movers.map((mover) => (
          <li
            key={mover.symbol}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{mover.assetName}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-fg-2">
                {mover.symbol}
                <AssetTypeBadge assetType={mover.assetType} />
              </p>
            </div>
            <div className="flex flex-col items-end">
              <PnlValue amount={mover.pnl} />
              <span className="text-xs">
                <PnlValue percent={mover.pnlPercent} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
