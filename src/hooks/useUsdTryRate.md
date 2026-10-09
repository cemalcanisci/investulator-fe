# useUsdTryRate

Güncel USD/TRY kurunu yükler (1 USD kaç TL). `CurrencyProvider` bunu kullanır; sayfalar doğrudan çağırmaz, [`useCurrency`](./useCurrency.md)'den okur.

## API

```ts
const rate = useUsdTryRate(); // UseQueryResult<UsdTryRate>
rate.data?.rate; // "41.2500" (string, ondalık)
rate.data?.asOf; // ISO zaman damgası
```

Sorgu anahtarı `FX_QUERY_KEY` (`['fx']`). Fiyat güncelleme düğmesi (`PriceStatus`) bunu Dashboard ve Yatırımlarım sorgularıyla birlikte yeniler.

## Ne yapar?

`src/services/fx.ts`'teki `fetchUsdTryRate()`'i çağırır. Servis şu an **sahte** (uydurma sabit kur) döner; gerçek uç nokta gelince yalnızca servis dosyası değişir. Gerçek kur backend'den gelecek (TCMB; hangi alanın kullanılacağı kök `CLAUDE.md`'deki açık kararlardan biri).

## Örnek

```tsx
const { data } = useUsdTryRate();
const canShowLira = data !== undefined;
```
