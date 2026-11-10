# Reel TL ve USD Bazlı Temettü Büyümesi — 10 BIST Şirketi

**Kesim tarihi:** 2026-11-10. Bu, görevin en açık eksiklik maddesiydi: ilk turda bu seri yalnızca AKSA için (anlatı olarak, tablosuz) hesaplanmıştı, 9 şirkette **hiç yoktu**. Bu dosya 10 şirketin tamamı için, **tek ve ortak** bir TÜFE/USD-TRY referansıyla (`_reference/MACRO_REFERENCE.md`) hesaplanmış sonuçları konsolide eder. Her şirketin tam yıl-yıl tablosu `companies/<SEMBOL>.json`'un `growthMetrics`/`dividendGrowthSeries` alanında.

## Yöntem (özet — ayrıntı `_reference/MACRO_REFERENCE.md`)

- **Reel TL:** TÜİK TÜFE'nin iki resmi bazının (2003=100 ve 2025=100) 12 örtüşen ayda **sıfır sapmayla** linklenmesiyle kurulan aylık endeks (2015-01 — 2026-10), baz ay **2026 Ekim**. `reel = nominal × (TÜFE_2026-10 / TÜFE_ödeme_ayı)`.
- **USD:** Yahoo Finance `TRY=X` günlük kapanış (2015-01-01 — 2026-11-10), ödeme tarihinde veri yoksa en fazla 10 gün geriye bakılarak en yakın önceki iş günü (CLAUDE.md'nin hafta sonu/tatil kuralıyla tutarlı).
- **Hiçbir şirket ajanı kendi TÜFE/kur verisi aramadı** — hepsi aynı `_reference/lookup.mjs` çıktısını kullandı; bu, 10 şirket arası karşılaştırmanın tutarlılığını garanti eder.
- CAGR hesaplarında sıfır/eksik başlangıç-bitiş yılı olduğunda standart CAGR üretilmedi; en yakın pozitif-pozitif karşılaştırılabilir dönem çiftleri kullanıldı (her şirketin kendi notunda açık).

## Ana tablo — 10 yıllık (yaklaşık 2015/16→2025/26) CAGR

| Sembol | Nominal TL CAGR | **Reel TL CAGR** | **USD CAGR** | Yorum |
|---|---|---|---|---|
| **ISMEN** | +%62,9/yıl | **+%24,5/yıl** | **+%23,9/yıl** | Tek şirket — gerçek, kârdaki büyümeyle (FY2021→2025 ~7,5x) desteklenmiş, 8 yıllık pencerede de tutarlı (+%23,3/+%18,8) |
| DOAS | +%39,5/yıl (9y) | +%6,68/yıl | +%4,21/yıl | Pozitif ama son 2 ödeme yılında (2025, 2026) reel/USD bazda **üst üste geriliyor** — nominal "artış" yanılsama |
| TOASO | +%36,5/yıl (9y) | +%4,55/yıl | +%2,41/yıl | 10y pozitif küçük ama **son 5y (4y) NEGATİF** (reel -%8,92, USD -%4,74); 2025'te nominal pay başı da -%40 |
| TTRAK | +%36,2/yıl (9y) | +%4,4/yıl | +%2,0/yıl | Normalize pencerelerde karışık: 2021→2024 reel +%3,9, 2020→2024 reel **-%0,5** (hafif negatif) — marjinal/kırılgan |
| TUPRS | +%33,8/yıl | +%2,23/yıl | +%1,31/yıl | Pozitif ama çok mütevazı; **2022 süper-döngü zirvesinden sonra 2 yıl üst üste reel/USD gerileme** (2022→2025: reel -%24,0/yıl) |
| PAGYO | +%29,1/yıl | -%1,49/yıl | -%2,09/yıl | 10y görünüm düz/hafif negatif ama **V-şekli**: 2016-2022 reel erime, 2023-2025 keskin toparlanma (2025 zirvesi 2016'nın üstünde); **son 5y reel +%9,50, USD +%15,35** |
| YGGYO | +%28,8/yıl | -%1,44/yıl | -%2,26/yıl | 10y hafif negatif (2025 USD değeri 2015'in hâlâ altında); **son 5y (2020-2025) reel +%5,89, USD +%13,82** — gerçek yakın-dönem toparlanma |
| AKSA | +%30,5/yıl (kümülatif +%1.333) | -%0,17/yıl | -%0,82/yıl | Fiilen düz/hafif negatif; 2025 değeri 2021 zirvesinin %84,5'i, 2023 zirvesinin %76,3'ü — **net büyüme kanıtı yok** (önceki turun anlatısı bu turda sıfırdan yeniden üretilip doğrulandı) |
| AKMGY | +%24,7/yıl | -%4,49/yıl | -%6,25/yıl | 10y negatif; alternatif 2021-bazlı 4y pencere ~düz (reel ~%0, USD +%5,25) — ama bu turda bulunan pay sayısı/kayıt bütünlüğü sorunu (altta) güvenilirliği sınırlıyor |
| FROTO | +%48,2/yıl (perShare) | +%14,8/yıl (**güvenilmez**) | +%13,7/yıl (**güvenilmez**) | Headline rakamlar **tek, teyitsiz bir uç yıla (2025, ~%100 payout, KAP tablosu hiç açılmamış) bağımlı**; 2025 hariç tutulduğunda: USD 2015-2024 +%3,7/yıl, 2020-2024 +%1,6/yıl; **reel 2020-2024 NEGATİF (-%2,7/yıl)** |

## Okuma notu — nominal rakamları asla tek başına kullanmayın

Her 10 şirkette de nominal TL CAGR, reel/USD CAGR'ın **5 ila 15 katı** büyüklüğünde — bu, Türkiye'nin 2015-2025 enflasyon ortamının (TÜFE endeksi ~13 kat arttı, bkz. `_reference/tufe_linked_index.json`) otomatik bir sonucu, şirket performansının bir göstergesi değil. Görevin uyardığı "geçmiş 10 yıllık CAGR'ı gelecek 10-15 yılın beklenen getirisi olarak kullanma" kuralı burada da geçerli — hiçbir CAGR bir gelecek tahmini olarak sunulmaz.

## Son-5-yıl trend ayrımı — kalıcı mı, tek seferlik mi?

10 yıllık CAGR tek başına yanıltıcı olabilir (bir V-şekli veya tek bir zirve-çöküşü maskeleyebilir). Son 5 yıl (ya da normalize edilebilen en yakın pencere) ayrıca incelendi:

| Sembol | 10y reel yön | Son-5y reel yön | Okuma |
|---|---|---|---|
| TUPRS | Pozitif (küçük) | **Negatif** (-%24,0/yıl, 2022→2025) | **Kötüleşiyor** — süper-döngü zirvesinden geri çekiliyor |
| DOAS | Pozitif | **Negatif** (son 2 yıl üst üste geriliyor) | **Kötüleşiyor** |
| TOASO | Pozitif (küçük) | **Negatif** (-%8,92/yıl) | **Kötüleşiyor** |
| TTRAK | Pozitif (küçük) | Karışık (~düz/hafif negatif) | **Marjinal/kırılgan** |
| ISMEN | Güçlü pozitif | Güçlü pozitif (8y pencerede tutarlı) | **Tutarlı güçlü** |
| AKMGY | Negatif | ~Düz/hafif pozitif | **Hafif düzelme sinyali** (ama veri bütünlüğü şüpheli) |
| PAGYO | Düz/hafif negatif | **Güçlü pozitif** (+%9,50/yıl) | **İyileşiyor** |
| YGGYO | Hafif negatif | **Pozitif** (+%5,89/yıl) | **İyileşiyor** |
| AKSA | Düz/hafif negatif | Negatif (zirveden düşüş) | **Kötüleşiyor/durağan** |
| FROTO | Güvenilmez (tek yıla bağımlı) | **Negatif** (-%2,7/yıl, 2025 hariç) | **Kanıt headline'ı desteklemiyor** |

**Bu tablo, `COMPANY_COMPARISON.md`/`FINAL_SHORTLIST.md`'deki nihai sınıflandırmanın Eksen B girdisidir** — süreklilikten (`DIVIDEND_HISTORY.md`) ve finansal sürdürülebilirlikten (`DIVIDEND_SUSTAINABILITY.md`) bağımsız olarak okunmalıdır.
