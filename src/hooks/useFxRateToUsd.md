# useFxRateToUsd

Bir para biriminin belirli bir günkü USD kurunu getirir (1 birim = X USD). İşlem formu, işlem gününün kurunu **otomatik** doldurmak için kullanır; kullanıcı isterse elle düzeltir (`MANUAL`).

## API

```ts
const rate = useFxRateToUsd('TRY', '2026-09-19'); // UseQueryResult<string>
rate.data; // "0.02424"
```

- `USD` için istek atılmaz (kur her zaman 1).
- Tarih geçerli bir takvim tarihi (`yyyy-aa-gg`) olana kadar istek atılmaz; 30 Şubat gibi tarihler de reddedilir.
- Bedelsiz ve bölünme için işlem formu kur sorgulamaz.
- Sorgu anahtarı `['fx', 'to-usd', para birimi, tarih]`; fiyat güncelleme düğmesi `['fx']` altındaki her şeyi yeniler.

İşlem, kaydedilirken günün kurunu **üzerinde saklar**; sonradan kur tablosu değişse bile o işlemin USD karşılığı değişmez. Hafta sonu/tatil için gerçek servis bir önceki iş gününün kurunu kullanacak; sahte servis tarihe göre düzgün değişen uydurma bir kur döner.

## Örnek

```tsx
const rate = useFxRateToUsd(values.currency, values.date);
const autoRate = rate.data ?? null;
```
