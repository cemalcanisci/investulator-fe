import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { StrategySnapshot } from '@/domain/strategy';

interface GroupCardsProps {
  readonly data: StrategySnapshot;
  readonly selected: string;
  readonly onSelect: (id: string) => void;
}

export function GroupCards({
  data,
  selected,
  onSelect,
}: GroupCardsProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {data.groups.map((group) => (
        <button
          type="button"
          key={group.id}
          onClick={() => onSelect(group.id)}
          aria-pressed={selected === group.id}
          className={`min-w-0 rounded-xl border p-5 text-start transition-colors ${selected === group.id ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-line-strong'}`}
        >
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0 break-words font-semibold">
              {group.name}
            </span>
            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-sm tabular-nums">
              {
                data.memberships.filter((entry) => entry.groupId === group.id)
                  .length
              }
            </span>
          </span>
          {group.description && (
            <span className="mt-2 block break-words text-sm text-fg-2">
              {group.description}
            </span>
          )}
          <span className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-2">
            <span>
              {t('strategies.targetWeight')}:{' '}
              {group.targetWeight === null
                ? t('strategies.notSet')
                : t('strategies.weightValue', { value: group.targetWeight })}
            </span>
            <span>
              {t('strategies.targetCount')}:{' '}
              {group.targetAssetCount ?? t('strategies.notSet')}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
