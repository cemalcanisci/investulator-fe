import {
  RiAddLine,
  RiRefreshLine,
  RiSearchLine,
  RiStackLine,
} from '@remixicon/react';
import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { KpiCard } from '@/components/KpiCard/KpiCard';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { AddWatchAsset } from '@/components/Strategies/AddWatchAsset';
import { GroupCards } from '@/components/Strategies/GroupCards';
import { GroupForm } from '@/components/Strategies/GroupForm';
import { Watchlist } from '@/components/Strategies/Watchlist';
import { ResearchTransfer } from '@/components/Strategies/ResearchTransfer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ASSET_TYPES } from '@/domain/assetTypes';
import type { StrategyCommand, StrategyGroup } from '@/domain/strategy';
import { useStrategies } from '@/hooks/useStrategies';

type Dialog =
  | { readonly type: 'GROUP'; readonly group: StrategyGroup | null }
  | { readonly type: 'ADD' }
  | {
      readonly type: 'CONFIRM';
      readonly message: string;
      readonly command: StrategyCommand;
    };

export function StrategiesPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const { query, action } = useStrategies();
  const [selected, setSelected] = useState('ALL');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [notice, setNotice] = useState(false);
  const data = query.data;
  const group = data?.groups.find((entry) => entry.id === selected);

  function openDialog(next: Dialog): void {
    action.reset();
    setDialog(next);
    setNotice(false);
  }
  function closeDialog(): void {
    if (!action.isPending) {
      setDialog(null);
      action.reset();
    }
  }
  function save(command: StrategyCommand, keepOpen = false): void {
    action.mutate(command, {
      onSuccess: () => {
        if (!keepOpen) {
          setDialog(null);
        }
        if (command.type === 'DELETE_GROUP') {
          setSelected('ALL');
        }
        setNotice(true);
      },
    });
  }

  function body(): JSX.Element {
    if (query.isPending) {
      return (
        <p
          role="status"
          className="animate-pulse rounded-xl bg-surface p-8 text-fg-2"
        >
          {t('common.loading')}
        </p>
      );
    }
    if (query.isError || !data) {
      return <ErrorState onRetry={() => void query.refetch()} />;
    }
    const trackedIds = new Set(data.memberships.map((entry) => entry.assetId));
    const groupIds = new Set(
      data.memberships
        .filter((entry) => selected === 'ALL' || entry.groupId === selected)
        .map((entry) => entry.assetId),
    );
    const normalized = search.trim().toLocaleLowerCase(i18n.language);
    const visible = data.assets.filter(
      (asset) =>
        groupIds.has(asset.id) &&
        (type === 'ALL' || asset.assetType === type) &&
        `${asset.symbol} ${asset.name ?? ''} ${asset.pair ?? ''}`
          .toLocaleLowerCase(i18n.language)
          .includes(normalized),
    );
    return (
      <>
        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard
            label={t('strategies.summary.assets')}
            value={String(trackedIds.size)}
            footer={
              <span className="text-xs text-fg-2">
                {t('strategies.summary.unique')}
              </span>
            }
          />
          <KpiCard
            label={t('strategies.summary.groups')}
            value={String(data.groups.length)}
            footer={
              <span className="text-xs text-fg-2">
                {t('strategies.summary.custom')}
              </span>
            }
          />
          <KpiCard
            label={t('strategies.summary.analysis')}
            value={t('strategies.notConnected')}
            footer={
              <span className="text-xs text-fg-2">
                {t('strategies.summary.waiting')}
              </span>
            }
          />
        </div>
        <section
          className="flex flex-col gap-3"
          aria-labelledby="strategy-groups-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="strategy-groups-title" className="text-lg font-semibold">
              {t('strategies.groupsTitle')}
            </h2>
            <Button
              icon={<RiAddLine className="size-4" aria-hidden="true" />}
              onClick={() => openDialog({ type: 'GROUP', group: null })}
            >
              {t('strategies.newGroup')}
            </Button>
          </div>
          <GroupCards
            data={data}
            selected={selected}
            onSelect={(id) =>
              setSelected((current) => (current === id ? 'ALL' : id))
            }
          />
          {data.groups.length === 0 && (
            <EmptyState
              icon={RiStackLine}
              title={t('strategies.emptyGroups')}
              description={t('strategies.emptyGroupsHint')}
            />
          )}
        </section>
        <section
          className="flex min-w-0 flex-col gap-4"
          aria-labelledby="watchlist-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2
                id="watchlist-title"
                className="break-words text-lg font-semibold"
              >
                {group?.name ?? t('strategies.listTitle')}
              </h2>
              <p className="text-xs text-fg-2">
                {t('strategies.resultCount', { count: visible.length })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {group && (
                <>
                  <Button onClick={() => openDialog({ type: 'GROUP', group })}>
                    {t('strategies.editGroup')}
                  </Button>
                  <Button
                    onClick={() =>
                      openDialog({
                        type: 'CONFIRM',
                        message: t('strategies.deleteGroupHint', {
                          name: group.name,
                        }),
                        command: { type: 'DELETE_GROUP', id: group.id },
                      })
                    }
                  >
                    {t('strategies.deleteGroup')}
                  </Button>
                  <Button disabled title={t('strategies.analysisUnavailable')}>
                    {t('strategies.refreshGroup')}
                  </Button>
                </>
              )}
              <Button
                type="primary"
                disabled={data.groups.length === 0}
                icon={<RiAddLine className="size-4" aria-hidden="true" />}
                onClick={() => openDialog({ type: 'ADD' })}
              >
                {t('strategies.addAsset')}
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_200px_160px]">
            <Input
              allowClear
              prefix={
                <RiSearchLine className="size-4 text-fg-2" aria-hidden="true" />
              }
              aria-label={t('strategies.search')}
              placeholder={t('strategies.searchPlaceholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <NativeSelect
              label={t('strategies.chooseGroup')}
              value={selected}
              onChange={setSelected}
              options={[
                { value: 'ALL', label: t('strategies.allGroups') },
                ...data.groups.map((entry) => ({
                  value: entry.id,
                  label: entry.name,
                })),
              ]}
              className="min-w-0"
            />
            <NativeSelect
              label={t('strategies.chooseType')}
              value={type}
              onChange={setType}
              options={[
                { value: 'ALL', label: t('strategies.allTypes') },
                ...ASSET_TYPES.map((assetType) => ({
                  value: assetType,
                  label: t(`assetTypes.${assetType}`),
                })),
              ]}
              className="min-w-0"
            />
          </div>
          {visible.length ? (
            <Watchlist
              assets={visible}
              data={data}
              selectedGroupId={selected}
              onRemove={(entry, asset) =>
                openDialog({
                  type: 'CONFIRM',
                  message: t('strategies.removeHint', {
                    symbol: asset.symbol,
                    group: entry.name,
                  }),
                  command: {
                    type: 'REMOVE_ASSET',
                    groupId: entry.id,
                    assetId: asset.id,
                  },
                })
              }
            />
          ) : (
            <EmptyState
              icon={RiSearchLine}
              title={t(
                groupIds.size === 0
                  ? 'strategies.emptyList'
                  : 'strategies.noResults',
              )}
              description={t('strategies.emptyListHint')}
              actions={
                <Button
                  onClick={() => {
                    setSearch('');
                    setType('ALL');
                    setSelected('ALL');
                  }}
                >
                  {t('strategies.clearFilters')}
                </Button>
              }
            />
          )}
        </section>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('strategies.title')}
          </h1>
          <p className="mt-1 text-sm text-fg-2">{t('strategies.subtitle')}</p>
        </div>
        <Button
          disabled
          icon={<RiRefreshLine className="size-4" aria-hidden="true" />}
          title={t('strategies.analysisUnavailable')}
        >
          {t('strategies.refreshAll')}
        </Button>
      </div>
      <ResearchTransfer />
      <div className="rounded-xl border border-line bg-info-soft p-4 text-sm">
        <p className="font-medium text-info">{t('strategies.demoTitle')}</p>
        <p className="mt-1 text-fg-2">{t('strategies.demoHint')}</p>
        <p className="mt-2 text-xs text-fg-2">
          {t('strategies.analysisUnavailable')}{' '}
          {t('strategies.detailUnavailable')}
        </p>
      </div>
      {notice && (
        <p role="status" className="text-sm text-primary">
          {t('strategies.saved')}
        </p>
      )}
      {body()}
      <Modal
        open={dialog !== null}
        onCancel={closeDialog}
        footer={null}
        destroyOnHidden
        width="100%"
        className="w-full max-w-none sm:max-w-[640px] max-sm:top-0 max-sm:m-0 max-sm:pb-0"
        classNames={{ container: 'max-sm:min-h-dvh max-sm:rounded-none' }}
        title={
          dialog?.type === 'GROUP'
            ? t(dialog.group ? 'strategies.editGroup' : 'strategies.newGroup')
            : t(
                dialog?.type === 'ADD'
                  ? 'strategies.addAsset'
                  : 'common.confirm',
              )
        }
      >
        {dialog?.type === 'GROUP' && (
          <GroupForm
            group={dialog.group}
            busy={action.isPending}
            error={action.error?.message ?? null}
            onClose={closeDialog}
            onSave={(input) =>
              save(
                dialog.group
                  ? { type: 'UPDATE_GROUP', id: dialog.group.id, input }
                  : { type: 'CREATE_GROUP', input },
              )
            }
          />
        )}
        {dialog?.type === 'ADD' && data && (
          <AddWatchAsset
            data={data}
            initialGroupId={group?.id ?? data.groups[0]?.id ?? ''}
            busy={action.isPending}
            error={action.error?.message ?? null}
            onAdd={(groupId, assetId) =>
              save({ type: 'ADD_ASSET', groupId, assetId }, true)
            }
          />
        )}
        {dialog?.type === 'CONFIRM' && (
          <div className="flex flex-col gap-4 pt-3">
            <p className="break-words text-sm text-fg-2">{dialog.message}</p>
            {action.isError && (
              <p role="alert" className="text-neg">
                {t('strategies.errors.generic')}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button onClick={closeDialog} disabled={action.isPending}>
                {t('common.cancel')}
              </Button>
              <Button
                danger
                loading={action.isPending}
                onClick={() => save(dialog.command)}
              >
                {t('common.remove')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
