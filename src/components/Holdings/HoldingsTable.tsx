import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { assetDetailPath } from '@/app/routePaths';
import { useTranslation } from 'react-i18next';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Card } from '@/components/Card/Card';
import { PriceBadge } from '@/components/Holdings/PriceBadge';
import { PnlValue } from '@/components/Pnl/PnlValue';
import { Quantity } from '@/components/Quantity/Quantity';
import { SortButton } from '@/components/SortButton/SortButton';
import { ASSET_TYPE_COLOR } from '@/domain/assetTypes';
import type { Holding } from '@/domain/holding';
import { useLanguage } from '@/hooks/useLanguage';
import { useMoney, type Money } from '@/hooks/useMoney';
import { percentageOf, toDisplayNumber } from '@/lib/decimal';
import {
  ariaSortOf,
  type HoldingsOrder,
  type HoldingsSort,
  type HoldingsTotals,
} from '@/lib/holdingsView';

export interface HoldingsTableProps {
  readonly holdings: readonly Holding[];
  /** Totals of the rows shown (so they follow the filter). */
  readonly totals: HoldingsTotals;
  /** Value of the whole portfolio, the base of the weight column. */
  readonly portfolioValue: string;
  readonly order: HoldingsOrder;
  readonly onSort: (sort: HoldingsSort) => void;
}

const NO_VALUE = '—';

// The table uses separate borders (not collapsed) so its cells can carry the rounded corners: the
// wrapper cannot clip with `overflow-hidden`, which would stop the header from sticking to the
// viewport. `top-14` is the height of the sticky top bar.
const HEAD_CELL =
  'sticky top-14 z-10 border-b border-line bg-surface-2 px-3 py-2.5 text-xs font-medium text-fg-2 lg:px-4';
const BODY_CELL = 'border-b border-line px-3 py-3 lg:px-4';
// The total row sticks to the bottom of the viewport while the table runs past it.
const FOOT_CELL =
  'sticky bottom-0 z-10 border-t border-line bg-surface-2 px-3 py-3 font-medium lg:px-4';

function priceDecimals(holding: Holding): number {
  return holding.assetType === 'FX' ? 4 : 2;
}

interface PriceInfoProps {
  readonly holding: Holding;
  readonly align: 'start' | 'end';
}

/** The price with its freshness badge underneath, so the price itself always lines up. */
function PriceInfo({ holding, align }: PriceInfoProps): JSX.Element {
  const money = useMoney();
  const price =
    holding.currentPricePerUnit === null
      ? NO_VALUE
      : money.formatUnit(holding.currentPricePerUnit, priceDecimals(holding));

  return (
    <span
      className={`inline-flex flex-col gap-1 ${align === 'end' ? 'items-end' : 'items-start'}`}
    >
      <span className="tabular-nums">{price}</span>
      <PriceBadge
        status={holding.priceStatus}
        updatedAt={holding.priceUpdatedAt}
      />
    </span>
  );
}

function WeightBar({
  holding,
  portfolioValue,
}: {
  readonly holding: Holding;
  readonly portfolioValue: string;
}): JSX.Element {
  const { language } = useLanguage();
  if (holding.value === null) {
    return <span>{NO_VALUE}</span>;
  }
  const percent = percentageOf(holding.value, portfolioValue);

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2"
        aria-hidden="true"
      >
        <span
          className="block h-full rounded-full"
          style={{
            width: `${Math.min(100, toDisplayNumber(percent))}%`,
            backgroundColor: ASSET_TYPE_COLOR[holding.assetType],
          }}
        />
      </span>
      <span className="w-12 text-end tabular-nums">
        {new Intl.NumberFormat(language, {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(toDisplayNumber(percent) / 100)}
      </span>
    </span>
  );
}

function valueOf(holding: Holding, money: Money): string {
  return holding.value === null ? NO_VALUE : money.format(holding.value);
}

export function HoldingsTable({
  holdings,
  totals,
  portfolioValue,
  order,
  onSort,
}: HoldingsTableProps): JSX.Element {
  const { t } = useTranslation();
  const money = useMoney();

  return (
    <>
      <div className="hidden rounded-xl border border-line bg-surface shadow-card md:block">
        <table className="w-full border-separate border-spacing-0">
          <caption className="sr-only">{t('holdings.table.caption')}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                aria-sort={ariaSortOf(order, ['NAME'])}
                className={`${HEAD_CELL} rounded-tl-xl text-start`}
              >
                <SortButton
                  label={t('holdings.table.asset')}
                  sort="NAME"
                  order={order}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className={`${HEAD_CELL} text-end`}>
                {t('holdings.table.quantity')}
              </th>
              <th
                scope="col"
                className={`${HEAD_CELL} hidden text-end lg:table-cell`}
              >
                {t('holdings.table.avgCost')}
              </th>
              <th scope="col" className={`${HEAD_CELL} text-end`}>
                {t('holdings.table.price')}
              </th>
              <th
                scope="col"
                aria-sort={ariaSortOf(order, ['VALUE'])}
                className={`${HEAD_CELL} text-end`}
              >
                <SortButton
                  label={t('holdings.table.value')}
                  sort="VALUE"
                  order={order}
                  onSort={onSort}
                />
              </th>
              <th
                scope="col"
                aria-sort={ariaSortOf(order, ['PNL', 'PNL_PERCENT'])}
                className={`${HEAD_CELL} rounded-tr-xl text-end xl:rounded-tr-none`}
              >
                <span className="inline-flex items-center gap-3">
                  <SortButton
                    label={t('holdings.table.pnl')}
                    sort="PNL"
                    order={order}
                    onSort={onSort}
                  />
                  <SortButton
                    label="%"
                    ariaLabel={t('holdings.table.pnlPercentSort')}
                    sort="PNL_PERCENT"
                    order={order}
                    onSort={onSort}
                  />
                </span>
              </th>
              <th
                scope="col"
                className={`${HEAD_CELL} hidden text-start xl:table-cell xl:rounded-tr-xl`}
              >
                {t('holdings.table.weight')}
              </th>
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {holdings.map((holding) => (
              <tr key={holding.id} className="hover:bg-surface-2">
                <td className={BODY_CELL}>
                  <Link
                    to={assetDetailPath(holding.id)}
                    className="font-medium text-primary hover:underline"
                  >
                    {holding.assetName}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 text-xs text-fg-2">
                    {holding.symbol}
                    <AssetTypeBadge assetType={holding.assetType} />
                  </p>
                </td>
                <td className={`${BODY_CELL} text-end tabular-nums`}>
                  <Quantity quantity={holding.quantity} unit={holding.unit} />
                </td>
                <td
                  className={`${BODY_CELL} hidden text-end tabular-nums lg:table-cell`}
                >
                  {money.formatUnit(
                    holding.avgCostPerUnit,
                    priceDecimals(holding),
                  )}
                </td>
                <td className={`${BODY_CELL} text-end`}>
                  <PriceInfo holding={holding} align="end" />
                </td>
                <td
                  className={`${BODY_CELL} text-end font-medium tabular-nums`}
                >
                  {valueOf(holding, money)}
                </td>
                <td className={`${BODY_CELL} text-end`}>
                  {holding.pnl === null ? (
                    NO_VALUE
                  ) : (
                    <PnlValue
                      amount={holding.pnl}
                      percent={holding.pnlPercent ?? undefined}
                    />
                  )}
                </td>
                <td className={`${BODY_CELL} hidden text-fg-2 xl:table-cell`}>
                  <WeightBar
                    holding={holding}
                    portfolioValue={portfolioValue}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className={`${FOOT_CELL} rounded-bl-xl text-start`}
              >
                {t('holdings.table.total')}
              </th>
              <td className={`${FOOT_CELL} hidden lg:table-cell`} />
              <td className={`${FOOT_CELL} text-end tabular-nums`}>
                {money.format(totals.value)}
              </td>
              <td
                className={`${FOOT_CELL} rounded-br-xl text-end xl:rounded-br-none`}
              >
                <PnlValue amount={totals.pnl} percent={totals.pnlPercent} />
              </td>
              <td
                className={`${FOOT_CELL} hidden xl:table-cell xl:rounded-br-xl`}
              />
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {holdings.map((holding) => (
          <li key={holding.id}>
            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={assetDetailPath(holding.id)}
                    className="block truncate font-medium text-primary hover:underline"
                  >
                    {holding.assetName}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 text-xs text-fg-2">
                    {holding.symbol}
                    <AssetTypeBadge assetType={holding.assetType} />
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-semibold tabular-nums">
                    {valueOf(holding, money)}
                  </span>
                  {holding.pnl !== null && (
                    <PnlValue
                      amount={holding.pnl}
                      percent={holding.pnlPercent ?? undefined}
                    />
                  )}
                </div>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <dt className="text-fg-2">{t('holdings.table.quantity')}</dt>
                  <dd className="mt-0.5 tabular-nums">
                    <Quantity quantity={holding.quantity} unit={holding.unit} />
                  </dd>
                </div>
                <div>
                  <dt className="text-fg-2">{t('holdings.table.avgCost')}</dt>
                  <dd className="mt-0.5 tabular-nums">
                    {money.formatUnit(
                      holding.avgCostPerUnit,
                      priceDecimals(holding),
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-fg-2">{t('holdings.table.price')}</dt>
                  <dd className="mt-0.5">
                    <PriceInfo holding={holding} align="start" />
                  </dd>
                </div>
              </dl>
            </Card>
          </li>
        ))}
        <li>
          <Card className="flex items-center justify-between gap-3 bg-surface-2 p-4 font-medium">
            <span>{t('holdings.table.total')}</span>
            <span className="flex flex-col items-end gap-0.5">
              <span className="tabular-nums">{money.format(totals.value)}</span>
              <PnlValue amount={totals.pnl} percent={totals.pnlPercent} />
            </span>
          </Card>
        </li>
      </ul>
    </>
  );
}
