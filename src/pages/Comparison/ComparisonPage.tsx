import { useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  listCompanyMatrix,
  valuationComparisonGroups,
} from '@/lib/companyMatrix';
import { researchBundle } from '@/services/researchBundle';
import { CompanyComparisonCard } from '@/components/Comparison/CompanyComparisonCard';
import { ValuationGroupTable } from '@/components/Comparison/ValuationGroupTable';
import { ReliabilitySummary } from '@/components/Comparison/ReliabilitySummary';
import { ResearchViewContext } from '@/components/Research/researchView';
import type { ResearchView } from '@/components/Research/researchView';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { Card } from '@/components/Card/Card';

export function ComparisonPage(): JSX.Element {
  const { t } = useTranslation();
  const [view, setView] = useState<ResearchView>('EASY');
  const entries = listCompanyMatrix(researchBundle.reports);
  const groups = valuationComparisonGroups(entries);

  return (
    <ResearchViewContext.Provider value={view}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('companyComparison.title')}
          </h1>
          <p className="mt-2 text-sm text-fg-2">
            {t('companyComparison.description')}
          </p>
        </div>

        <Card className="space-y-2 p-5 text-sm leading-7">
          <p>{t('companyComparison.intro.sectorCaution')}</p>
          <p>{t('companyComparison.intro.noSingleScore')}</p>
          <p>{t('companyComparison.intro.valuationCaution')}</p>
        </Card>

        <NativeSelect
          label={t('researchUx.view')}
          value={view}
          options={(['EASY', 'DETAILED'] as const).map((value) => ({
            value,
            label: t(`researchUx.views.${value}`),
          }))}
          onChange={(value) => {
            if (value === 'EASY' || value === 'DETAILED') {
              setView(value);
            }
          }}
        />

        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <CompanyComparisonCard key={entry.assetId} entry={entry} />
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {t('companyComparison.valuationGroups.heading')}
          </h2>
          <p className="text-sm leading-7 text-fg-2">
            {t('companyComparison.valuationGroups.intro')}
          </p>
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            {groups.map((group) => (
              <ValuationGroupTable
                key={`${group.businessModel}:${group.ratioId}`}
                group={group}
              />
            ))}
          </div>
        </section>

        <ReliabilitySummary entries={entries} />
      </div>
    </ResearchViewContext.Provider>
  );
}
