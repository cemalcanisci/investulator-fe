# useCurrency

Tutarların hangi para biriminde gösterildiğini (`USD` ya da `TRY`) okur ve değiştirir. Üst çubuktaki `CurrencySwitcher` bunu kullanır.

## API

```ts
const { currency, setCurrency, usdTryRate } = useCurrency();
```

| Alan          | Anlamı                                                                        |
| ------------- | ----------------------------------------------------------------------------- |
| `currency`    | Şu an gösterilen para birimi (`'USD' \| 'TRY'`)                               |
| `setCurrency` | Seçimi değiştirir ve `localStorage`'a (`inv-currency`) yazar                  |
| `usdTryRate`  | `{ rate, asOf }` (1 USD = `rate` TL) ya da kur yüklenene/alınana kadar `null` |

## Bilinmesi gerekenler

- **Hesaplar dolar bazında kalır.** Para birimi yalnızca gösterimi değiştirir: TL değeri, dolar değerinin **güncel kurla** çevrilmiş halidir. Gerçekte TL ile ödenen tutar (işlem günü kuruyla) değildir; o, backend geldiğinde işlemlerde saklanan orijinal tutarlardan gelecek. `CurrencyNote` kullanıcıya bunu söyler.
- **Kur yoksa TL gösterilemez.** `usdTryRate` `null` iken `currency` seçim ne olursa olsun `'USD'` döner (anahtar "TL" deyip dolar göstermesin diye) ve anahtarda TL seçeneği devre dışı kalır.
- Sağlayıcı (`CurrencyProvider`) yoksa bağlam varsayılanı kullanılır: `USD`, kur yok. Yaprak bileşen testleri bu yüzden sarmalayıcı istemez.
- Depolama okunamıyorsa (özel pencere vb.) sessizce varsayılan (`USD`) kullanılır.

Tutarları biçimlendirmek için bunu değil [`useMoney`](./useMoney.md)'yi kullan.

## Örnek

```tsx
const { currency, setCurrency, usdTryRate } = useCurrency();

<button disabled={usdTryRate === null} onClick={() => setCurrency('TRY')}>
  TL ({currency})
</button>;
```
