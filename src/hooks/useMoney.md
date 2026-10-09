# useMoney

Dolar cinsinden gelen tutarları seçili para birimine çevirip dile göre biçimlendirir. Ekranda para gösteren her bileşen `formatMoney` yerine bunu kullanır; böylece para birimi değişince her yer birlikte değişir.

## API

```ts
const money = useMoney();

money.format('124580.42'); // "$124.580,42" ya da "₺5.138.942,33"
money.format('-189.00', { signed: true }); // "-$189,00"
money.formatUnit('8.27'); // birim fiyat, 2 hane; kur için formatUnit(x, 4)
money.currency; // 'USD' | 'TRY'
```

| Fonksiyon                        | Girdi                           | Ne için                                                                                                 |
| -------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `format(amount, options?)`       | USD tutar (string ya da number) | Kartlar, tablolar, listeler                                                                             |
| `formatUnit(price, decimals?)`   | USD birim fiyat                 | Ortalama maliyet, güncel fiyat                                                                          |
| `convert(amount)`                | USD tutar (number)              | **Grafik verisi**: eksen, çevrilmiş veriden yuvarlak adımlar seçsin diye grafiğe çevrilmiş sayı verilir |
| `formatConverted(amount, opts?)` | Zaten çevrilmiş number          | Grafik etiketi ve tooltip'i (yeniden çevirmez)                                                          |
| `formatWhole(amount)`            | Zaten çevrilmiş number          | Grafik ekseni (ondalıksız; kısaltma yok, "B" Türkçede bin)                                              |

## Ayrıntılar

- String tutarlar **tam** (BigInt) çarpılır (`lib/decimal.ts` `multiplyDecimals`); number'lar (grafikler) kayan noktayla çevrilir, yalnızca gösterim içindir.
- TL, `narrowSymbol` ile her dilde "₺" yazılır (İngilizce "TRY" yazmasın).
- Çevirme mantığı saf fonksiyonlarda: `lib/formatMoney.ts` (`convertFromUsd`, `formatMoney`, `formatUnitMoney`, `formatWholeMoney`).
- Yüzdeler para birimine bağlı değildir: `formatPercent` (`lib/formatNumber.ts`).

## Örnek: grafik

```tsx
const money = useMoney();
const data = points.map((p) => ({ ...p, value: money.convert(p.value) }));

<YAxis tickFormatter={(v: number) => money.formatWhole(v)} />
<Tooltip formatter={(v) => money.formatConverted(Number(v))} />
```
