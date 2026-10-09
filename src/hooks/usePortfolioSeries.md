# usePortfolioSeries

Portföy değeri ve maliyetinin zaman serisini seçilen aralık için yükler (Dashboard'daki çizgi grafiği).

## API

```ts
const series = usePortfolioSeries(range); // UseQueryResult<PortfolioPoint[]>
```

| Parametre | Tip                                     | Açıklama                           |
| --------- | --------------------------------------- | ---------------------------------- |
| `range`   | `'1W' \| '1M' \| '3M' \| '1Y' \| 'ALL'` | Zaman aralığı (`PORTFOLIO_RANGES`) |

Her nokta `{ date, value, cost }`: tarih (`YYYY-MM-DD`) ve USD cinsinden değer/maliyet (**string**). Sorgu anahtarı `['dashboard', 'series', range]`; aralık değişince yeni bir sorgu çalışır, önceki aralıklar önbellekte kalır.

## Ne yapar?

`src/services/dashboard.ts`'teki `fetchPortfolioSeries(range)`'i çağırır. Şu an **sahte, deterministik** veri üretir (bugünkü toplamlarda biter); gerçek geçmiş veriler backend'de günlük portföy snapshot'ından gelecek (yol haritası Faz 4).

Grafik çizimi için sayıya çevirme yalnızca `toChartPoints()` (`src/lib/chartData.ts`) içinde yapılır; para hesabı için kullanma.

## Örnek

```tsx
const [range, setRange] = useState<PortfolioRange>('1M');
const series = usePortfolioSeries(range);
const points = series.data ? toChartPoints(series.data) : [];
```
