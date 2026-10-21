import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/Transactions/Field';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { StrategyGroup, StrategyInput } from '@/domain/strategy';

interface GroupFormProps {
  readonly group: StrategyGroup | null;
  readonly busy: boolean;
  readonly error: string | null;
  readonly onSave: (input: StrategyInput) => void;
  readonly onClose: () => void;
}

export function GroupForm({
  group,
  busy,
  error,
  onSave,
  onClose,
}: GroupFormProps): JSX.Element {
  const { t } = useTranslation();
  const [name, setName] = useState(group?.name ?? '');
  const [description, setDescription] = useState(group?.description ?? '');
  const [weight, setWeight] = useState(group?.targetWeight ?? '');
  const [count, setCount] = useState(group?.targetAssetCount?.toString() ?? '');
  return (
    <form
      className="flex flex-col gap-4 pt-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          name,
          description,
          targetWeight: weight.trim() ? weight.trim().replace(',', '.') : null,
          targetAssetCount: count ? Number(count) : null,
        });
      }}
    >
      <Field id="strategy-name" label={t('strategies.form.name')}>
        <Input
          id="strategy-name"
          value={name}
          required
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>
      <p className="text-xs text-fg-2">{t('strategies.form.examples')}</p>
      <Field id="strategy-description" label={t('strategies.form.description')}>
        <Input
          id="strategy-description"
          value={description}
          maxLength={500}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="strategy-weight" label={t('strategies.form.weight')}>
          <Input
            id="strategy-weight"
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder={t('strategies.notSet')}
          />
        </Field>
        <Field id="strategy-count" label={t('strategies.form.count')}>
          <Input
            id="strategy-count"
            type="number"
            min={1}
            max={10000}
            step={1}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            placeholder={t('strategies.notSet')}
          />
        </Field>
      </div>
      <p className="text-xs text-fg-2">{t('strategies.form.targetHint')}</p>
      {error && (
        <p role="alert" className="text-sm text-neg">
          {t(`strategies.errors.${error}`, {
            defaultValue: t('strategies.errors.generic'),
          })}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} disabled={busy}>
          {t('common.cancel')}
        </Button>
        <Button type="primary" htmlType="submit" loading={busy}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
