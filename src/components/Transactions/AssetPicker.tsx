import { useId, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/Transactions/Field';
import { Select } from '@/components/ui/Select';
import type { CatalogAsset } from '@/domain/asset';
import { useLanguage } from '@/hooks/useLanguage';

export interface AssetPickerProps {
  readonly assets: readonly CatalogAsset[];
  readonly value: string;
  readonly error?: string;
  readonly onChange: (asset: CatalogAsset) => void;
}

/** Search-as-you-type over the catalog; gold shows up as one entry per product. */
export function AssetPicker({
  assets,
  value,
  error,
  onChange,
}: AssetPickerProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const id = useId();

  return (
    <Field id={id} label={t('transactions.form.asset')} error={error}>
      <Select<string>
        id={id}
        showSearch
        value={value === '' ? undefined : value}
        status={error === undefined ? undefined : 'error'}
        placeholder={t('transactions.form.assetPlaceholder')}
        notFoundContent={t('transactions.form.assetEmpty')}
        options={assets.map((asset) => ({
          value: asset.id,
          label: `${asset.name} (${asset.symbol})`,
        }))}
        filterOption={(input, option) =>
          String(option?.label ?? '')
            .toLocaleLowerCase(language)
            .includes(input.trim().toLocaleLowerCase(language))
        }
        onChange={(assetId) => {
          const chosen = assets.find((asset) => asset.id === assetId);
          if (chosen !== undefined) {
            onChange(chosen);
          }
        }}
      />
    </Field>
  );
}
