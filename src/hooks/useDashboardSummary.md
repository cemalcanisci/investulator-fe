# useDashboardSummary

Dashboard'un özet verisini yükler: KPI'lar, varlık dağılımı, en çok kazandıran/kaybettirenler, son işlemler ve fiyatların son güncellenme zamanı.

## API

```ts
const summary = useDashboardSummary(); // UseQueryResult<DashboardSummary>
```

`@tanstack/react-query` v5 sonucunu döner: `isPending`, `isError`, `data`, `refetch` vb. Sorgu anahtarı `['dashboard', 'summary']`; `DASHBOARD_QUERY_KEY` (`['dashboard']`) ile başlayan tüm sorgular tek seferde yenilenebilir (bkz. `PriceStatus`).

## Ne yapar?

`src/services/dashboard.ts`'teki `fetchDashboardSummary()`'yi çağırır. Bu servis şu an **sahte veri** döner (para/adet alanları JSON string, gerçek API sözleşmesiyle aynı); gerçek uç nokta geldiğinde yalnızca o dosya değişir, hook ve bileşenler aynı kalır.

## Örnek

```tsx
function Total(): JSX.Element {
  const summary = useDashboardSummary();
  const money = useMoney(); // amounts are in USD; this shows them in the chosen currency

  if (summary.isPending) {
    return <DashboardSkeleton />;
  }
  if (summary.isError) {
    return <ErrorState onRetry={() => void summary.refetch()} />;
  }
  return <span>{money.format(summary.data.kpis.totalValue)}</span>;
}
```
