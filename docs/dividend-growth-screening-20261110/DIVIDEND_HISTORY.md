# Temettü Geçmişi (2015-2026 kâr yılları) — 10 BIST Şirketi

**Kesim tarihi:** 2026-11-10. Her şirketin tam yıl-yıl taksit tablosu (ödeme tarihi, brüt/net pay başına, toplam nakit, kaynak notu) kendi dosyasında: [`companies/<SEMBOL>.md`](companies/) ve `.json`. Bu dosya yalnızca **süreklilik** eksenini (bkz. [METHODOLOGY_V2.md](METHODOLOGY_V2.md) Eksen A) özetler — **büyüme** (nominal/reel/USD) [REAL_DIVIDEND_GROWTH.md](REAL_DIVIDEND_GROWTH.md)'de ayrı ele alınır. İki tabloyu karıştırmayın: bir şirketin süreklilik sütunu "Güçlü" olup büyüme tablosunda "Zayıf" çıkması beklenen ve bu turun temel bulgusudur (örn. AKSA, FROTO).

## Süreklilik özeti

| Sembol | Kâr yılı sayısı (2015-2025/26) | Kesinti yılı (kâr yılı) | Kesinti sayısı | Dönüş kanıtı |
|---|---|---|---|---|
| TUPRS | 11 | 2019, 2020, 2021 | 3 | Güçlü — 2022'den itibaren kesintisiz, iki taksitli düzen kurulu |
| DOAS | 11 (9 ödendi) | 2016 (paymentYear 2017), 2019 (paymentYear 2020) | 2 | Asimetrik — 2020 kesintisinden dönüş hızlı/tam (2 yılda), 2017 kesintisinden dönüş yavaş/yarım seviyede kaldı |
| FROTO | 11 (+2026 planlı, hariç) | Yok | 0 | Gerekmez — ~20 yıllık daha uzun geçmişte de kesinti yok (bu turun kapsadığı 11 yılda kesin) |
| TOASO | 11 | Yok | 0 | Gerekmez |
| TTRAK | 11 (+2026 sıfır) | 2018 (paymentYear 2019), 2025 (paymentYear 2026) | 2 | Asimetrik — 2018 kesintisinden dönüş hızlı/büyük (3 yılda); 2025 kesintisinden (en güncel) dönüş kanıtı **henüz yok**, 9A2026 net zararla sürüyor |
| ISMEN | 11 | Yok | 0 | Gerekmez |
| AKMGY | 10-11 (çoklu ödeme yılları) | Yok (her takvim yılında en az 1 ödeme) | 0 | Gerekmez, ama `profitYear` ataması çoğu satırda teyitsiz (bkz. DATA_GAPS.md) |
| PAGYO | 11 | Yok | 0 | Gerekmez |
| YGGYO | 11 (+1 olağanüstü) | 2023 (yıllık dağıtım resmen sıfır) | 1 (teknik; aynı takvim yılında ayrı bir olağanüstü nakit ödeme oldu) | Belirsiz nitelik — olağanüstü ödemenin kaynağı/niteliği netleşmedi |
| AKSA | 11 | Yok | 0 | Gerekmez |

## Kesinti dışı not — "süreklilik" ile "disiplin" farklı şeyler

İkinci turun (bağımsız denetim) ve bu turun ortak bulgusu: bir kesintinin **öncesindeki** 3-4 yılda temettü/FCF oranının gerçekten ≤1,0x olup olmadığı da sorulmalı (METHODOLOGY_V2 Eksen C, döngüsel şok testi). Bu testte:

- **TTRAK'ın FY2025 sıfır temettüsü** büyük ölçüde **disiplin göstergesi** olarak okunuyor — 2021-2024'ün 4 yılının 3'ünde (2021 %213,1; 2023 %110,4; 2024 %314,3) temettü zaten FCF'yi aşmıştı; FY2025'teki sıfırlama bu birikmiş dengesizliğe geç ama doğru bir tepki.
- **DOAS'ın 2026'da (geçmiş kârın ~2,1 katı) ödemeye devam etmesi** aynı testte **tersi** bir sinyal — 2022'den itibaren zayıf/negatif FCF'ye rağmen büyük ödemeler sürüyor, kendi kendini düzeltme kanıtı yok.

Bu ayrım `DIVIDEND_SUSTAINABILITY.md`'de ve nihai kategorizasyonda (`FINAL_SHORTLIST.md`) merkezi bir rol oynar.

## Kurumsal işlem (bedelsiz/bölünme) düzeltmeleri — pay başına seriler için

Pay başına (per-share) nominal temettü serilerinde, aşağıdaki bedelsiz sermaye artışları **pay başına rakamları doğrudan karşılaştırılamaz** kılar (toplam nakit temettü bundan etkilenmez, çünkü bedelsiz nakit girişi değildir):

| Şirket | Bedelsiz artış | Etki |
|---|---|---|
| TUPRS | Nisan 2023, 1:7 (×600%) | 2023-öncesi pay başına rakamlar ÷7 ile yeni-pay eşdeğerine çevrildi |
| AKSA | Şubat 2020 ×1,75; 2024 ×12 | Split-adjusted (toplamda ×21) seri üretildi; toplam nakit CAGR'ıyla matematiksel olarak örtüştüğü doğrulandı |
| FROTO | Mayıs 2025, 1:10 | Eski-pay tutarları ÷10 ile yeni-pay eşdeğerine çevrildi |
| TTRAK | Haziran 2023, ~1,874x (53.369.000 → 100.066.875 pay) | Ana metrik olarak split-safe `totalCashTRY` kullanıldı; ek olarak güncel-baz pay başına seri türetildi |
| DOAS | Yok (2010'dan beri pay sayısı sabit, 220.000.000) | Normalizasyon gerekmedi |
| TOASO | Yok (10 yılda sabit, 500.000.000) | Normalizasyon gerekmedi |

AKMGY, PAGYO, YGGYO, ISMEN için pay sayısı sabitliği/değişimi **tam teyit edilemedi** — bu, bu şirketlerin toplam nakit temettü türetmelerinin (`DERIVED`) güvenilirliğini sınırlar (bkz. `DATA_GAPS.md`).

## Toplam nakit temettü verisi eksikliği (CLAUDE.md'nin "pay başına ile toplam nakit ayrı değerlendirilir" kuralı)

| Şirket | Toplam nakit TRY mevcut mu | Not |
|---|---|---|
| TUPRS | 11 yılın yalnızca 1'inde (2025, ikincil kaynaklı) | CAGR hesaplanamadı |
| DOAS | 9/9 ödenen yılda mevcut | 2022 rakamı bağımsız denetimin bulduğu alternatif rakamla (1,935 vs 2,150 milyar TL) çözülmemiş şekilde çelişiyor |
| FROTO | 4/11 yılda doğrudan mevcut, 7'si pay sayısı × gross ile türetildi (4 noktada mevcut değerlerle örtüşerek doğrulandı) | Türetme güvenilir görünüyor |
| TOASO | 11/11 | En temiz seri |
| TTRAK | Çoğu yılda mevcut | — |
| ISMEN | 2019-2026 mevcut, 2016-2018 yok | — |
| AKMGY | Hiçbir satırda doğrudan yok; pay sayısı 37.264.000 olarak aritmetik çıkarımla bulundu (CASHFLOW.md'nin FY2020/2022 rakamlarıyla örtüşerek) ve bu, 2023-2025 dividendHistory'sinin muhtemelen **%15-32 eksik kayıtlı** olduğunu ortaya çıkardı | Yeni, önemli bulgu — bkz. DATA_GAPS.md |
| PAGYO | Yalnızca 2025/2026'da (çelişkili iki rakamla); 2016-2024 87.000.000 pay varsayımıyla türetildi | Pay sayısı kendisi ~%2,7 tutarsız (87,0M vs ~89,4M) |
| YGGYO | Çoğu yılda mevcut | 2024 olağanüstü ödeme ayrı tutuldu, yıllık seriye karıştırılmadı |
| AKSA | 11/11 | En temiz seri (TOASO ile birlikte) |
