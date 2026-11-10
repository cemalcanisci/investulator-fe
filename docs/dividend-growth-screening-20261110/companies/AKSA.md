# AKSA (Aksa Akrilik Kimya Sanayii A.Ş.) — Temettü Büyümesi Hesabı (4. Tur)

Kesim tarihi: **2026-11-10, Europe/Istanbul**. Bu dosya `dividend-growth-screening-20261110` turunun çıktısıdır.

**Bu turun görevi sınıflandırma (A/B/C/D) DEĞİLDİR.** `category`/`rationale`/`dividendHistory`/`supportingEvidence`/`counterEvidence`/`structuralRisks`/`growthOutlook` alanları önceki üç turdan (`dividend-screening-20261110`, `dividend-screening-independent-audit-20261110`, `dividend-portfolio-decision-20261110`) **değiştirilmeden taşınmıştır**; bu tur onları yeniden araştırmamıştır. Tek görev: AKSA'nın 11 satırlık (2015-2025 kâr yılı) `totalCashTRY` serisini bu turun **ortak referans verisiyle** (`_reference/tufe_linked_index.json`, `_reference/usdtry_daily.json`, `_reference/lookup.cjs`) nominal/reel/USD bazda sıfırdan hesaplamak, önceki turun yalnızca sonuç-cümlesi olarak var olan ("nominal +%1.333, reel/USD net büyüme YOK") iddiasını **adım adım bir tabloyla yeniden üretmek** ve karşılaştırmak. Nihai A/B/C/D kararı merkezi sentezde verilecektir.

## 1. Neden AKSA özel

AKSA, önceki tur (`dividend-screening-20261110`) içinde nominal/reel/USD temettü büyümesi **anlatı olarak** hesaplanan TEK şirketti; `AUDIT.md`'ye göre bu 9 diğer şirkette "zaman kısıtı" nedeniyle sistematik olarak üretilmedi. Ama o hesabın adım adım sayısal tablosu hiçbir dosyada saklı değildi — yalnızca şu sonuç cümlesi vardı: *"2025 reel/USD değeri 2021 ve 2023 zirvelerinin altında, 2015-2017 seviyesine yakın."* Bu tur o boşluğu dolduruyor: aynı sonucu, **farklı bir TÜFE kaynağıyla** (önceki tur alomaliye.com'un yıllık oranlarını, bu tur TÜİK'in resmi aylık endeksini kullanıyor) ve aynı veriden türetilmiş bir **bölünme-düzeltilmiş pay başına seri** ile yeniden üretiyor.

## 2. Veri ve kaynak

11 satır (`dividendHistory`, profitYear 2015-2025), tamamı `paid:true`, `totalCashTRY` hepsinde mevcut — bu, AKSA'nın en temiz serisi (AUDIT.md: "grup içinde en güvenilir temettü verisi, Yahoo Finance ile satır satır örtüşüyor"). FX/TÜFE girdileri `_reference/lookup.cjs` çağrısıyla alındı, hiçbir rakam elle uydurulmadı:

```bash
node lookup.cjs AKSA 2016-04-08 2017-04-07 2018-04-06 2019-04-11 2020-04-09 2021-04-15 2022-04-25 2023-04-13 2024-04-05 2025-05-23 2026-04-07
```

**Yöntem farkı (önceki turdan):**
- **TÜFE kaynağı:** Önceki tur `alomaliye.com`'un **yıllık** TÜFE oranlarını kullanmıştı (bileşik, yıl bazında); bu tur TÜİK'in resmi **aylık** endeksini (`hakedis.org` ikincil derlemesi üzerinden, bkz. `_reference/MACRO_REFERENCE.md`) ödeme ayına özel değerle kullanıyor — daha hassas, çünkü ödeme ayı yılın tamamının ortalaması değildir (AKSA genelde Nisan'da, 2025 istisnası Mayıs'ta ödüyor).
- **Baz ay:** Önceki tur 2025 yıl-sonunu baz almıştı; bu tur **2026-10**'u (TÜFE'nin en güncel yayımlanmış ayı) baz alıyor.
- **USD/TRY kaynağı:** Yahoo Finance (`TRY=X`) günlük kapanış — **İKİ TURDA DA AYNI**, fark yok.

## 3. Yıl-yıl hesap tablosu

| Kâr yılı | Ödeme tarihi | USD/TRY (fx tarihi) | TÜFE ayı/endeksi | Reel faktör→2026-10 | Nominal toplam (TL) | **Reel toplam (2026-10, TL)** | **USD toplam** | Pay sayısı (çıkarılan) | Nominal TL/pay | **Bölünme-düzeltilmiş TL/pay** |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2015 | 08.04.2016 | 2,8638 (07.04.2016) | 2016-04 / 276,42 | 16,210953 | 157.250.000 | **2.549.172.399** | **$54.909.560** | 185.000.000 | 0,85 | 0,040476 |
| 2016 | 07.04.2017 | 3,7052 (06.04.2017) | 2017-04 / 309,23 | 14,490935 | 185.000.000 | **2.680.822.896** | **$49.929.289** | 185.000.000 | 1,00 | 0,047619 |
| 2017 | 06.04.2018 | 4,0394 (05.04.2018) | 2018-04 / 342,78 | 13,072617 | 207.200.000 | **2.708.646.268** | **$51.294.618** | 185.000.000 | 1,12 | 0,053333 |
| 2018 | 11.04.2019 | 5,7321 (11.04.2019) | 2019-04 / 409,63 | 10,939218 | 204.702.500 | **2.239.285.187** | **$35.711.669** | 185.000.000 | 1,1065 | 0,052690 |
| 2019 | 09.04.2020 | 6,6861 (09.04.2020) | 2020-04 / 454,43 | 9,860774 | 239.575.000 | **2.362.395.020** | **$35.831.800** | 323.750.000¹ | 0,74 | 0,061667 |
| 2020 | 15.04.2021 | 8,0288 (15.04.2021) | 2021-04 / 532,32 | 8,417928 | 281.662.500 | **2.371.014.785** | **$35.081.519** | 323.750.000 | 0,87 | 0,072500 |
| 2021 | 25.04.2022 | 14,7719 (25.04.2022) | 2022-04 / 904,79 | 4,952565 | 598.937.500 | **2.966.277.172** | **$40.545.732** | 323.750.000 | 1,85 | 0,154167 |
| 2022 | 13.04.2023 | 19,3351 (13.04.2023) | 2023-04 / 1.300,04 | 3,446841 | 780.237.500 | **2.689.354.919** | **$40.353.424** | 323.750.000 | 2,41 | 0,200833 |
| 2023 | 05.04.2024 | 31,9450 (04.04.2024) | 2024-04 / 2.207,50 | 2,029912 | 1.618.750.000 | **3.285.920.752** | **$50.673.047** | 323.750.000 | 5,00 | 0,416667 |
| 2024 | 23.05.2025 | 39,0333 (22.05.2025) | 2025-05 / 3.089,74 | 1,450294 | 1.864.800.000 | **2.704.508.441** | **$47.774.556** | 3.885.000.000² | 0,48 | 0,480000 |
| 2025 | 07.04.2026 | 44,5679 (07.04.2026) | 2026-04 / 4.028,38 | 1,112367 | 2.253.300.000 | **2.506.495.780** | **$50.558.808** | 3.885.000.000 | 0,58 | 0,580000 |

¹ 2020-02-12 ×1,75 bedelsiz sermaye artışı sonrası pay sayısı. ² 2024-07-24 ×12 bedelsiz sermaye artışı sonrası pay sayısı.

**Pay sayısı çapraz doğrulaması:** Her satırda `totalCashTRY ÷ nominalPerShareTRY` ile çıkarılan pay sayısı, notlardaki sermaye tabanlarıyla (185.000.000 → 1 TL nominal × 185M; 323.750.000; 3.885.000.000) **birebir** eşleşti — bu, hem `totalCashTRY` hem `grossPerShareTRY` alanlarının iç tutarlı olduğunu doğrular.

**Bölünme-düzeltilmiş pay başına seri — yöntem:** `splitAdjustedPerShareTRY = nominalPerShareTRY × (o_yılın_pay_sayısı ÷ 3.885.000.000_güncel_pay_sayısı)`. 2015-2018 satırları ×1/21 (1,75×12), 2019-2023 satırları ×1/12 (sadece ×12, çünkü bunlar zaten 2020'deki ×1,75'in sonrasında), 2024-2025 satırları ×1 (zaten güncel bazda) ile düzeltildi. **Bağımsız çapraz kontrol:** her satırda `totalCashTRY ÷ 3.885.000.000` doğrudan bölmesi, yukarıdaki multiplier yöntemiyle **sıfır sapmayla** aynı sonucu verdi — bu da matematiksel olarak beklenen bir sonuç: pay sayısı tüm yıllar için SABİT bir paydaya (güncel pay sayısı) indirgendiğinden, bölünme-düzeltilmiş pay başına büyüme oranı toplam nakit büyüme oranıyla **birebir aynıdır**. Bu nedenle ayrı bir "pay başına CAGR" tablosu gerekmiyor — toplam nakit CAGR'ları aşağıda zaten bu seriyi de temsil ediyor.

## 4. CAGR özeti

| Pencere | Nominal toplam TL | Reel toplam TL (2026-10 bazı) | USD toplam | Bölünme-düzeltilmiş TL/pay (nominal) |
|---|---:|---:|---:|---:|
| **10 yıl (2015→2025)** | **+30,50%/yıl** (kümülatif +1.333%) | **-0,17%/yıl** (fiilen düz) | **-0,82%/yıl** (fiilen düz/hafif negatif) | +30,50%/yıl (toplam nakitle matematiksel olarak aynı) |
| **5 yıl (2020→2025)** | +51,57%/yıl | +1,12%/yıl | +7,58%/yıl | +51,57%/yıl |

**Önemli uyarı — pencere seçimi sonucu değiştiriyor:** 5 yıllık pencere (2020 bazlı) reel/USD'de hafif pozitif görünüyor, çünkü 2020 pandemi çukuruna denk geliyor (seri en düşük noktalarından biri). 10 yıllık pencere (2015 bazlı, veya aşağıdaki zirve karşılaştırmaları) bu pozitifliği ortadan kaldırıyor. Bu, "hangi yılı baz alırsan öyle sonuç çıkar" riskinin somut bir örneği — tek bir CAGR penceresi yeterli değil, bu yüzden hem 10y hem 5y hem de zirve-karşılaştırması birlikte raporlanıyor.

## 5. Önceki turla karşılaştırma

**Önceki iddia** (`dividend-screening-20261110/companies/AKSA.json`, `counterEvidence`): *"Toplam nakit temettü, TÜİK TÜFE ile 2025 TL'sine deflate edildiğinde ve ödeme günü USD/TRY kuruyla dolarize edildiğinde son 10 yılda net bir büyüme trendi göstermiyor; 2025 reel/USD değeri 2021 ve 2023 zirvelerinin altında, 2015-2017 seviyesine yakın."*

**Sonuç: YÖN OLARAK DOĞRULANDI.**

- **Nominal:** +%1.333 (önceki turun rakamıyla **tam örtüşüyor**, çünkü ikisi de aynı birincil `totalCashTRY` verisinden geliyor).
- **Reel TL:** 2025 değeri (2.506,5M TL, 2026-10 bazı) **2021 zirvesinin (2.966,3M) %84,5'i** ve **2023 zirvesinin (3.285,9M) %76,3'ü** — her iki zirvenin de altında, önceki turla **aynı sonuç**. 2025 vs 2016/2017 seviyesi %92,5-93,5 — "yakın, hafif altında" ifadesiyle uyumlu.
- **USD:** Seri neredeyse **birebir aynı** çıktı çünkü her iki tur da Yahoo Finance kapanışını kullandı: 2015 $54,91M (önceki tur $54,9M), 2025 $50,56M (önceki tur $50,5M). 10 yıllık USD CAGR -0,82%/yıl — net büyüme yok.
- **Nüans/düzeltme:** USD serisinde "2021 ve 2023 zirveleri" çerçevesi USD için **tam doğru değil**. USD sıralaması (düşükten yükseğe): 2020 ($35,1M) < 2018 ($35,7M) < 2019 ($35,8M) < 2022 ($40,4M) < 2021 ($40,5M) < 2024 ($47,8M) < 2016 ($49,9M) < 2025 ($50,6M) < 2023 ($50,7M) < 2017 ($51,3M) < 2015 ($54,9M). **2021 ve 2022, USD serisinin gerçek ZİRVELERİ değil, 2018-2020 ile birlikte EN DÜŞÜK noktalarıdır.** Gerçek USD zirveleri 2015 ve 2017'dir. 2025 USD değeri 2023'ün (gerçek yakın-zirve) %99,8'i — neredeyse eşit — ama 2021'in **%124,7'si**, yani 2021'in **üstünde**. Doğru ifade: "2025 USD değeri 2015/2017 seviyesinin hafif altında, 2023 ile aynı seviyede, 2021-2022 çukurunun ise belirgin şekilde üstünde." Bu nüans **sonucu değiştirmiyor** (10 yıllık net USD büyümesi yine yok), yalnızca "hangi yıl zirve" çerçevesini USD için düzeltiyor — bu çerçeve reel TL serisi için zaten doğruydu (2021/2023 orada gerçekten zirve).

**Farkın nedeni (mutlak reel TL seviyelerindeki fark için):** Baz ay farkı (2025 yıl-sonu vs 2026-10) tek başına sabit bir ölçek farkı yaratırdı, ama TÜFE kaynağı/granülerlik farkı (yıllık oran vs aylık endeks, ödeme ayına özel) ek olarak yıldan yıla **değişken** bir oran (0,97-1,24 arası) ekliyor — bu yüzden iki turun mutlak reel TL rakamları birbirine sabit bir çarpanla dönüştürülemiyor, ama **yön ve bağıl sıralama** (hangi yıl zirve, hangi yıl çukur) aynı çıkıyor. USD serisi aynı kaynağı kullandığı için bu belirsizlik yok, kuruş mertebesinde örtüşüyor — bu, nihai "net büyüme yok" sonucunun en sağlam kanıtı.

Bu bulgu ayrıca `dividend-screening-independent-audit-20261110/CASHFLOW.md` ve `RISK_REVIEW.md`'de (farklı bir ajan oturumu) *"AKSA'nın reel/USD bazda net temettü büyümesi olmadığı — bağımsız, CPI'ye bağımlı olmayan bir yöntemle ($54,9M→$50,5M doğrudan USD karşılaştırması) teyit edildi"* şeklinde zaten not edilmişti; bu turun USD sonucu ($54,91M→$50,56M) o bulguyla da örtüşüyor — üç farklı oturum, üç farklı yöntem, aynı yönde sonuç.

## 6. Sürdürülebilirlik sentezi (bu turda güncellenen bulgular)

- **Net borç/FAVÖK "çelişkisi" çözüldü:** Şirketin ~2,8x ifadesiyle bağımsız ~3,70x (FY2025) hesabı arasındaki fark, `independent-audit-20261110/RISK_REVIEW.md`'ye göre **zamanlama farkıydı, hata değildi** — 9A2026 verisi oranın **2,84x**'e düştüğünü gösteriyor, iki rakam farklı tarihlere ait ve ikisi de doğru.
- **Ama kaldıraç iyileşirken kârlılık bozuluyor:** FAVÖK +%43,6 YoY büyüyerek 9A2026'da 6.049,4M TL'ye çıktı, AMA aynı dönemde **ana ortaklığa ait net kâr YoY %24,5 düşerek 2.531,9M TL'ye indi** — finansman maliyeti/kur etkisi kârlılığı eritiyor. "Borç azalıyor, her şey düzeliyor" basitleştirmesi bu veriyle çelişiyor.
- **Payout oranı son 5 yılda son derece oynak:** %22,8 (2022) ile %164,1 (2024, dağıtım muhasebe kârını aştı) arasında; 2023 %98,0, 2025 %56,1, 2021 %51,3 — disiplinli bir politikanın kanıtı yok.
- **İleri Malzemeler segmenti tek bir temiz veri noktasına dayanıyor:** FAVÖK marjı FY2025'teki kısmi dönemde %14,4'ten H1 2026'daki ilk TAM dönemde %30,2'ye sıçradı — cesaret verici ama bu turda da 9A2026 segment bazlı kırılımı bulunamadı; kalıcılık sorusu açık.

## 7. Kanıt güvenilirliği (bölüm bazlı)

| Bölüm | Güven | Gerekçe |
|---|---|---|
| **Temettü geçmişi** | **Yüksek** | `AUDIT.md`: 11 yıllık tablo Yahoo Finance ile satır satır neredeyse sıfır hatayla örtüşüyor — 10 şirket arasında en güvenilir temettü verisi. Bu turun pay-sayısı çapraz doğrulaması (totalCashTRY/grossPerShareTRY → 185M/323,75M/3.885M) da sıfır sapmayla tutarlı çıktı. |
| **Nakit akışı** | **Orta** (ikinci turda Düşük/PARTIAL'dan yükseldi) | `CASHFLOW.md`: FY2021-2023 CFO zaten birincil kaynaktan doğru kullanılmıştı; CAPEX engeli OCR bozukluğuydu (erişim sorunu değil). FY2025 `annual-cash-replay.json` ile tam teyitli. 2016-2019 hâlâ tamamen kapalı. |
| **Risk değerlendirmesi** | **Orta** | `RISK_REVIEW.md`: Covenant ihlali riski feragatnameyle aşıldı, 9A2026'da yeni ihlal yok — ama bu bir yönetim beklentisi/feragat sonucu, kalıcı çözüm kanıtı değil (31.12.2026 test tarihi izlenmeli). Net borç/FAVÖK çelişkisi çözüldü ama net kâr düşüşü yeni bir risk sinyali ekledi. |

## 8. Kaynaklar

- `dividend-screening-20261110/companies/AKSA.json` + `.md` (1. tur) — `dividendHistory`, `supportingEvidence`, `counterEvidence`, `structuralRisks`, `growthOutlook` buradan değiştirilmeden taşındı.
- `dividend-screening-independent-audit-20261110/{AUDIT.md, CASHFLOW.md, RISK_REVIEW.md, DATA_GAPS.md, FINAL_SHORTLIST.md}` (2. tur, farklı ajan) — net borç/FAVÖK çözümü, 9A2026 net kâr düşüşü, kanıt güvenilirliği güncellemeleri.
- `dividend-portfolio-decision-20261110/{COMPANY_DECISIONS.md, UNRESOLVED_ISSUES.md}` (3. tur) — B kategorisinin korunduğu, açık soruların listesi.
- `_reference/MACRO_REFERENCE.md`, `tufe_linked_index.json`, `usdtry_daily.json`, `lookup.cjs` (bu tur, ortak merkezi referans) — TÜİK aylık TÜFE (hakedis.org ikincil derleme) + Yahoo Finance USD/TRY günlük kapanış.

**Doğrulama notu:** Bu dosya aynı ajan tarafından, tek bir oturumda hazırlanmıştır — bağımsız bir ikinci inceleme değildir. TÜFE kaynağı (hakedis.org ikincil derleme) ve USD/TRY kaynağı (Yahoo Finance) ikisi de TÜİK/TCMB birincil portallarıyla bu oturumda çapraz doğrulanmadı (`MACRO_REFERENCE.md`'nin kendi belirttiği sınırlama). Reel TL hesabı ulusal TÜFE sepeti bazındadır; yatırımcının kişisel tüketim sepeti farklı olabilir.
