import { metricDefinition } from '@/domain/metricEducation';

interface LabeledReport {
  readonly facts: readonly {
    readonly id: string;
    readonly metricKey?: string;
  }[];
}

/** Shared across every research/comparison view so the same metric id always reads the same way. */
export function metricLabel(
  id: string,
  report: LabeledReport,
  t: (key: string, options?: { readonly defaultValue?: string }) => string,
): string {
  const fact = report.facts.find((entry) => entry.id === id);
  const definition = metricDefinition(id, fact?.metricKey);
  return t(`research.metrics.${id}`, {
    defaultValue: definition ? t(`metricEducation.${definition.key}.name`) : id,
  });
}
