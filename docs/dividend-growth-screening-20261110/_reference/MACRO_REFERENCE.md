# Ortak Makro Referans — TÜFE ve USD/TRY (2015-2026)

Bu klasördeki dosyalar, `dividend-growth-screening-20261110` çalışmasındaki **10 şirketin tamamı için aynı, tek bir** reel TL ve USD temettü hesaplama tabanını sağlar. Her şirket ajanı kendi TÜFE/kur verisini ayrı ayrı çekmez — tutarsızlık riskini önlemek için bu merkezi dosyalar kullanılır (görev talimatının "kur veya TÜFE verisi eksikse tahmini değer uydurma" ve ilk turun "9 şirkette bu seri zaman kısıtıyla eksik kaldı" bulgusunun giderilmesi).

## 1. TÜFE endeks serisi (`tufe_linked_index.json`)

- **Kaynak:** TÜİK Tüketici Fiyat Endeksi, iki resmi baz üzerinden derlenmiş (ikincil derleme sitesi `hakedis.org` üzerinden okunmuştur; birincil TÜİK veri portalından bu oturumda doğrudan doğrulanmadı — bu bir **sınırlama** olarak not edilir, bkz. DATA_GAPS.md).
  - 2015-01 — 2025-12: TÜİK (2003=100) baz, TÜİK'in 1 Ocak 2026'da kullanımdan kaldırdığı seri.
  - 2025-01 — 2026-10: TÜİK (2025=100) baz, yeni resmi seri.
- **Linkleme:** İki serinin 2025 yılının 12 ayı çakışıyor. Çakışan 12 ayın oranı (`index_2003base / index_2025base`) **sıfır sapmayla** (12 ayın hepsinde 31,832292) sabit çıktı — bu, TÜİK'in rebaseinin saf bir ölçek değişimi olduğunu ve linklemenin hatasız yapılabildiğini doğrular. 2026 ayları bu sabit çarpanla 2003=100 eşdeğerine çevrilmiştir.
- **Doğrulama:** Linklenmiş serinin 2026-01 ve 2026-10 için ürettiği yıllık (YoY) değişim oranları (%30,65 ve %29,77), TÜİK'in kendi yayımladığı resmi YoY oranlarıyla **birebir** eşleşti (iki ondalık basamağa kadar).
- **Kapsam:** 2015-01 — 2026-10 (142 ay). **2026-11 ve sonrası yok** (araştırma kesim tarihinde TÜİK henüz yayımlamadı) — bu ayda/sonrasında ödeme olan hiçbir temettü satırı için reel TL değeri **üretilmedi**, `null` bırakıldı.
- **Formül:** Bir X ayında ödenen nominal TRY tutarının baz aya (2026-10) göre reel karşılığı:

  ```
  reel_TRY = nominal_TRY × (tufe_index[BAZ_AY] / tufe_index[X])
  ```

  Baz ay **2026-10** (en güncel yayımlanmış TÜFE ayı); yani tüm reel TL tutarları "2026 Ekim satın alma gücü" cinsindendir. Bu, görev talimatının "baz tarihini açıkça belirt" kuralına uyar.

## 2. USD/TRY günlük seri (`usdtry_daily.json`)

- **Kaynak:** Yahoo Finance `TRY=X` günlük kapanış serisi (`query1.finance.yahoo.com/v8/finance/chart/TRY=X`), 2015-01-01 — 2026-11-10, **ham JSON doğrudan indirilip** (WebFetch özetlemesi olmadan) ayrıştırıldı. Bu, AKSA ilk turunda kullanılan kaynakla aynıdır (tutarlılık için bilerek korunmuştur) ama TCMB resmi alış/satış/efektif kuruyla bu oturumda da **çapraz doğrulanmadı** — ikincil kaynak, `independent: true` ama `sourceType: secondary`.
- **Kapsam:** 3086 işlem günü (hafta sonları ve piyasa tatillerinde veri yok).
- **Eksik gün kuralı:** Bir ödeme tarihinde doğrudan veri yoksa (hafta sonu/resmî tatil), Investulator'ın ana `CLAUDE.md`'sindeki "hafta sonu/tatil için bir önceki iş gününün kuru kullanılır" kuralı burada da uygulanır: en fazla 10 gün geriye bakılır, bulunan ilk önceki iş günü kuru kullanılır ve kaç gün geriye bakıldığı (`fxLookbackDays`) her hesapta kayıt altına alınır. 10 gün içinde bulunamazsa `null` (uydurulmaz).
- **Formül:** `usd_temettu = nominal_TRY / usdTry_oranı(ödeme_tarihi veya bir önceki iş günü)`.

## 3. Sorgulama aracı (`lookup.mjs`)

```bash
node lookup.mjs <ETIKET> <YYYY-MM-DD> [<YYYY-MM-DD> ...]
```

Her tarih için JSON satırı döner: `fxDateUsed`, `fxLookbackDays`, `usdTry`, `tufeMonth`, `tufeIndex`, `realDeflationFactor_toBaseMonth`. **Her şirket ajanı, kendi ödeme tarihlerinin tam listesini bu script'e vererek** FX/TÜFE girdilerini alır; hiçbir ajan kendi TÜFE/kur verisi aramaz veya uydurmaz. Script ESM (`.mjs`, `import`) kullanır — bu repodaki `"type": "module"` davranışıyla ve Oxlint'in `no-require-imports` kuralıyla uyumlu (bkz. `investulator-fe/CLAUDE.md`); üretilen JSON çıktısı `console.log` ile yazdırıldığı için dosya başında `no-console` kuralı bilerek devre dışı bırakılmıştır (bu bir CLI aracıdır, uygulama kodu değildir).

## 4. Bilinen sınırlamalar

- TÜFE kaynağı ikincil bir derleme sitesinden okundu; TÜİK'in resmi `data.tuik.gov.tr` portalından birincil doğrulama bu oturumda yapılamadı (portal etkileşimli form gerektiriyor, doğrudan WebFetch ile çekilemedi). Linkleme tutarlılığı (sıfır sapma) ve YoY çapraz doğrulaması güven artırıcı ama birincil kaynak doğrulaması değildir.
- USD/TRY kaynağı (Yahoo Finance) TCMB resmi kuruyla çapraz kontrol edilmedi; günlük kapanış, gün içi farklı saatlerde gerçekleşen temettü ödemeleriyle küçük bir zamanlama farkı taşıyabilir.
- Reel TL hesabı **ulusal TÜFE sepeti** bazındadır; yatırımcının kişisel tüketim sepeti farklı olabilir (metodolojik bir basitleştirme, her raporda not edilir).
- 2026-11 ve sonrası için TÜFE verisi yok; bu aydaki/sonrasındaki ödemelerin reel TL karşılığı üretilemez.
