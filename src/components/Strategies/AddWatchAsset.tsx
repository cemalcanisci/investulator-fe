import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { StrategySnapshot } from '@/domain/strategy';

interface AddWatchAssetProps {
  readonly data: StrategySnapshot;
  readonly initialGroupId: string;
  readonly busy: boolean;
  readonly error: string | null;
  readonly onAdd: (groupId: string, assetId: string) => void;
}

export function AddWatchAsset({
  data,
  initialGroupId,
  busy,
  error,
  onAdd,
}: AddWatchAssetProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const [groupId, setGroupId] = useState(initialGroupId);
  const [search, setSearch] = useState('');
  const assets = data.assets.filter((asset) =>
    `${asset.symbol} ${asset.name ?? ''} ${asset.pair ?? ''}`
      .toLocaleLowerCase(i18n.language)
      .includes(search.trim().toLocaleLowerCase(i18n.language)),
  );
  return (
    <div className="flex flex-col gap-4 pt-3">
      <p className="text-sm text-fg-2">{t('strategies.addHint')}</p>
      <NativeSelect
        label={t('strategies.chooseGroup')}
        value={groupId}
        onChange={setGroupId}
        options={data.groups.map((group) => ({
          value: group.id,
          label: group.name,
        }))}
      />
      <Input
        aria-label={t('strategies.catalogSearch')}
        placeholder={t('strategies.searchPlaceholder')}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && (
        <p role="alert" className="text-sm text-neg">
          {t(`strategies.errors.${error}`, {
            defaultValue: t('strategies.errors.generic'),
          })}
        </p>
      )}
      <ul className="max-h-[45vh] divide-y divide-line overflow-y-auto">
        {assets.map((asset) => {
          const added = data.memberships.some(
            (entry) => entry.groupId === groupId && entry.assetId === asset.id,
          );
          return (
            <li key={asset.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{asset.pair ?? asset.symbol}</p>
                <p className="break-words text-xs text-fg-2">
                  {asset.name ?? t('strategies.identityPending')}
                </p>
                <AssetTypeBadge assetType={asset.assetType} />
              </div>
              <Button
                disabled={busy || added || !groupId}
                onClick={() => onAdd(groupId, asset.id)}
                aria-label={t(
                  added
                    ? 'strategies.alreadyAddedLabel'
                    : 'strategies.addAssetLabel',
                  { symbol: asset.symbol },
                )}
              >
                {t(added ? 'strategies.alreadyAdded' : 'common.add')}
              </Button>
            </li>
          );
        })}
      </ul>
      {assets.length === 0 && (
        <p className="text-sm text-fg-2">{t('strategies.catalogEmpty')}</p>
      )}
    </div>
  );
}
