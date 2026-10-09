import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ASSET_TYPE_COLOR, type AssetType } from '@/domain/assetTypes';

export interface AssetTypeBadgeProps {
  readonly assetType: AssetType;
}

export function AssetTypeBadge({
  assetType,
}: AssetTypeBadgeProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <span className="inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-full bg-surface-2 px-2 text-xs font-medium text-fg-2">
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: ASSET_TYPE_COLOR[assetType] }}
        aria-hidden="true"
      />
      {t(`assetTypes.${assetType}`)}
    </span>
  );
}
