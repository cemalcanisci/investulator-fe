import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { researchPath } from '@/app/routePaths';
import { hasResearch } from '@/services/research';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Button } from '@/components/ui/Button';
import { ResearchTransfer } from '@/components/Strategies/ResearchTransfer';
import type {
  StrategyGroup,
  StrategySnapshot,
  WatchAsset,
} from '@/domain/strategy';

interface WatchlistProps {
  readonly assets: readonly WatchAsset[];
  readonly data: StrategySnapshot;
  readonly selectedGroupId: string;
  readonly onRemove: (group: StrategyGroup, asset: WatchAsset) => void;
}

export function Watchlist({
  assets,
  data,
  selectedGroupId,
  onRemove,
}: WatchlistProps): JSX.Element {
  const { t } = useTranslation();
  function groupsFor(asset: WatchAsset): readonly StrategyGroup[] {
    return data.groups.filter((group) =>
      data.memberships.some(
        (entry) => entry.assetId === asset.id && entry.groupId === group.id,
      ),
    );
  }
  function actions(asset: WatchAsset): JSX.Element {
    return (
      <div className="flex flex-wrap gap-1">
        <Button
          size="small"
          disabled
          title={t('strategies.analysisUnavailable')}
        >
          {t('strategies.refreshAsset')}
        </Button>
        <ResearchTransfer
          assetId={asset.id}
          removeItems={groupsFor(asset)
            .filter(
              (group) =>
                selectedGroupId === 'ALL' || group.id === selectedGroupId,
            )
            .map((group) => ({
              key: group.id,
              onClick: (): void => onRemove(group, asset),
              label:
                selectedGroupId === 'ALL'
                  ? t('strategies.removeFrom', { group: group.name })
                  : t('common.remove'),
            }))}
        />
      </div>
    );
  }
  function identity(asset: WatchAsset): JSX.Element {
    return (
      <div>
        <p className="font-semibold">
          <Link
            to={researchPath(asset.id)}
            className="text-primary hover:underline"
          >
            {asset.symbol}
          </Link>{' '}
          {asset.pair && (
            <span className="text-xs font-normal text-fg-2">/ USDT</span>
          )}
        </p>
        <p className="mt-0.5 break-words text-xs text-fg-2">
          {asset.name ?? t('strategies.namePending')}
        </p>
        <p className="mt-1 text-xs text-warn">
          {t(
            hasResearch(asset.id)
              ? 'research.identityConfirmed'
              : asset.assetType === 'CRYPTO'
                ? 'strategies.identityPending'
                : 'strategies.catalogPending',
          )}
        </p>
      </div>
    );
  }
  return (
    <>
      <table
        className="hidden w-full table-fixed border-separate border-spacing-0 text-left text-sm xl:table"
        aria-label={t('strategies.listTitle')}
      >
        <thead>
          <tr>
            {['asset', 'groups', 'status', 'analysis', 'actions'].map((key) => (
              <th
                key={key}
                scope="col"
                className="sticky top-14 z-10 border-y border-line bg-surface-2 px-4 py-3 text-xs font-medium text-fg-2 first:rounded-tl-xl last:rounded-tr-xl"
              >
                {t(`strategies.columns.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="bg-surface">
              <td className="border-b border-line px-4 py-4 align-top">
                {identity(asset)}
              </td>
              <td className="border-b border-line px-4 py-4 align-top">
                <AssetTypeBadge assetType={asset.assetType} />
                <div className="mt-2 flex flex-wrap gap-1">
                  {groupsFor(asset).map((group) => (
                    <span
                      key={group.id}
                      className="min-w-0 max-w-full break-words rounded bg-surface-2 px-2 py-1 text-xs"
                    >
                      {group.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="border-b border-line px-4 py-4 align-top">
                <span className="rounded-full bg-primary-soft px-2 py-1 text-xs text-primary">
                  {t('strategies.watching')}
                </span>
                <p className="mt-2 text-xs text-fg-2">
                  {t('strategies.noPurchase')}
                </p>
              </td>
              <td className="border-b border-line px-4 py-4 align-top">
                <p className="text-fg-2">
                  {t(
                    hasResearch(asset.id)
                      ? 'research.partialReport'
                      : 'strategies.noData',
                  )}
                </p>
                <Link
                  to={researchPath(asset.id)}
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  {t('research.open')}
                </Link>
              </td>
              <td className="border-b border-line px-4 py-4 align-top">
                {actions(asset)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul
        className="grid gap-3 md:grid-cols-2 xl:hidden"
        aria-label={t('strategies.listTitle')}
      >
        {assets.map((asset) => (
          <li
            key={asset.id}
            className="min-w-0 rounded-xl border border-line bg-surface p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              {identity(asset)}
              <AssetTypeBadge assetType={asset.assetType} />
            </div>
            <p className="mt-3 break-words text-xs text-fg-2">
              {groupsFor(asset)
                .map((group) => group.name)
                .join(' · ')}
            </p>
            <div className="my-3 flex flex-wrap gap-2 text-xs">
              <span className="text-primary">{t('strategies.watching')}</span>
              <span className="text-fg-2">
                {t(
                  hasResearch(asset.id)
                    ? 'research.partialReport'
                    : 'strategies.noData',
                )}
              </span>
            </div>
            {actions(asset)}
            <Link
              to={researchPath(asset.id)}
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              {t('research.open')}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
