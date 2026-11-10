# TOASO — Tofaş Türk Otomobil Fabrikası A.Ş. — Temettü Büyümesi Veri Derlemesi

**Kesim tarihi:** 2026-11-10, Europe/Istanbul
**Kapsam:** Bu rapor bir A/B/C/D sınıflandırma kararı DEĞİLDİR. Görev, dördüncü (bu) turda yalnızca temettü büyümesi verisinin derlenmesi ve nominal/reel/USD hesaplamasıdır. TOASO'nun stratejik uygunluk kategorisi (B — Koşullu Aday, ve ikinci/üçüncü turlarda B içinde "orta/zayıf B"ye kaydırılması) önceki üç turda belirlenmiştir ve burada **değiştirilmemiştir**; final karar merkezi sentezde verilecektir.

**Bu turun yöntemi:** `TOASO.json`'daki 11 ödeme yılının tamamı (2016-2026), `dividend-growth-screening-20261110/_reference/lookup.cjs` merkezi FX/TÜFE aracına verilerek tek, tutarlı bir USD/TRY ve TÜFE tabanından nominal/reel/USD pay-başına ve toplam nakit rakamları üretildi. Sürdürülebilirlik/risk bulguları (FY2024 CFO/FCF negatifliği, 5,88 mr TL şarta bağlı yükümlülük, kaldıraç yörüngesi) önceki üç turdan **aktarılmış**, bu oturumda yeniden doğrulanmamıştır.

---

## 1. Girdi verisi — pay sayısı ve ödeme tarihleri

Nominal sermaye 500.000.000 TL, pay sayısı **500.000.000**, son 10 yılda sabit (bedelli/bedelsiz sermaye artırımı yok; son bedelsiz artırım 17.08.2005). Bu, pay-başına ve toplam-nakit rakamlarının doğrudan, bölünme/bedelsiz düzeltmesi gerektirmeden karşılaştırılabilir olmasını sağlıyor — TOASO'nun seri 11 şirket arasında en temiz olanlardan biri (bkz. `dividend-screening-20261110/companies/TOASO.json`, `verificationStatus: NEEDS_REVIEW` ama `dividendHistoryConfidence: Yüksek`).

11 ödeme tarihi `lookup.cjs`'e verildi; **hepsinde `fxLookbackDays=0`** (tam gün eşleşmesi, hafta sonu/tatil düzeltmesi hiçbirinde gerekmedi):

| Ödeme Tarihi | USD/TRY | TÜFE Ayı | TÜFE Endeksi | Reel Deflasyon Çarpanı (→2026-10) |
|---|---:|---|---:|---:|
| 2016-04-07 | 2,8638 | 2016-04 | 276,42 | 16,210953 |
| 2017-04-03 | 3,6442 | 2017-04 | 309,23 | 14,490935 |
| 2018-03-21 | 3,9321 | 2018-03 | 336,48 | 13,317379 |
| 2019-03-19 | 5,4681 | 2019-03 | 402,81 | 11,124430 |
| 2020-03-25 | 6,4363 | 2020-03 | 450,58 | 9,945030 |
| 2021-03-23 | 7,8254 | 2021-03 | 523,53 | 8,559264 |
| 2022-03-22 | 14,8217 | 2022-03 | 843,64 | 5,311545 |
| 2023-03-21 | 19,0088 | 2023-03 | 1.269,75 | 3,529066 |
| 2024-04-08 | 32,1565 | 2024-04 | 2.207,50 | 2,029912 |
| 2025-04-07 | 38,0048 | 2025-04 | 3.043,23 | 1,472459 |
| 2026-03-25 | 44,3393 | 2026-03 | 3.866,67 | 1,158887 |

Baz ay **2026-10** (en güncel yayımlanmış TÜFE ayı); tüm "reel TRY" rakamları "2026 Ekim satın alma gücü" cinsindendir.

---

## 2. Nominal / Reel / USD Temettü Serisi (profitYear bazında)

| Kâr Yılı | Ödeme Yılı | Brüt TL/pay (nominal) | USD/pay | Reel TL/pay (2026-10 bazı) | Toplam Nakit (nominal TL) | Toplam Nakit (USD) | Toplam Nakit (reel TL) |
|---|---|---:|---:|---:|---:|---:|---:|
| 2015 | 2016 | 0,73 | 0,254906 | 11,8340 | 365.000.000 | 127.453.032 | 5.916.997.937 |
| 2016 | 2017 | 0,70 | 0,192086 | 10,1437 | 350.000.000 | 96.043.025 | 5.071.827.100 |
| 2017 | 2018 | 1,60 | 0,406902 | 21,3078 | 800.000.000 | 203.451.044 | 10.653.903.228 |
| 2018 | 2019 | 1,76 | 0,321867 | 19,5790 | 880.000.000 | 160.933.412 | 9.789.498.508 |
| 2019 | 2020 | 2,40 | 0,372885 | 23,8681 | 1.200.000.000 | 186.442.527 | 11.934.036.214 |
| 2020 | 2021 | 3,00 | 0,383367 | 25,6778 | 1.500.000.000 | 191.683.495 | 12.838.896.618 |
| 2021 | 2022 | 6,40 | 0,431798 | 33,9939 | 3.200.000.000 | 215.899.076 | 16.996.943.522 |
| 2022 | 2023 | 6,00 | 0,315643 | 21,1744 | 3.000.000.000 | 157.821.557 | 10.587.198.341 |
| 2023 | 2024 | 20,00 | 0,621958 | 40,5982 | 10.000.000.000 | 310.979.101 | 20.299.124.339 |
| 2024 | 2025 | 12,00 | 0,315750 | 17,6695 | 6.000.000.000 | 157.874.799 | 8.834.754.582 |
| 2025 | 2026* | 20,00 | 0,451067 | 23,1777 | 10.000.000.000 | 225.533.565 | 11.588.869.680 |

*2026 ödemesi 10 yıllık (2016-2025) ve 5 yıllık (2021-2025) CAGR pencerelerinin **dışındadır**; kesim tarihinden (2026-11-10) önce gerçekleşmiş en güncel ödeme olduğu için seriye eklenmiş, süreklilik/oynaklık tartışmasında kullanılmıştır.

---

## 3. CAGR — Nominal vs Reel vs USD (iki ayrı pencere)

### 10 yıllık pencere: paymentYear 2016 → 2025 (9 yıl)

| Metrik | Başlangıç (2016) | Son (2025) | CAGR |
|---|---:|---:|---:|
| Nominal TL/pay | 0,73 | 12,00 | **+%36,49/yıl** |
| USD/pay | 0,254906 | 0,315750 | **+%2,41/yıl** |
| Reel TL/pay (2026-10 bazı) | 11,8340 | 17,6695 | **+%4,55/yıl** |

### Son 5 yıllık pencere: paymentYear 2021 → 2025 (4 yıl)

| Metrik | Başlangıç (2021) | Son (2025) | CAGR |
|---|---:|---:|---:|
| Nominal TL/pay | 3,00 | 12,00 | **+%41,42/yıl** |
| USD/pay | 0,383367 | 0,315750 | **-%4,74/yıl** |
| Reel TL/pay (2026-10 bazı) | 25,6778 | 17,6695 | **-%8,92/yıl** |

**En kritik bulgu:** 10 yıllık pencerede nominal CAGR (+%36,5) ile reel/USD CAGR (+%4,55 / +%2,41) arasındaki fark zaten büyük, ama **son 5 yılda reel ve USD CAGR'ın İKİSİ DE NEGATİFE DÖNMÜŞTÜR**. Yatırımcı 2021-2025 arasında nominal temettüsü 4 katına çıkarken, gerçek satın alma gücü ve dolar karşılığı bazında temettüsü **küçülmüştür**.

---

## 4. Yıl-yıl oynaklık ve satın alma gücü kaybı yılları

| Ödeme → Ödeme | Nominal Δ | USD Δ | Reel Δ | Yön |
|---|---:|---:|---:|---|
| 2016→2017 | -%4,11 | -%24,64 | -%14,28 | **KAYIP** |
| 2017→2018 | +%128,57 | +%111,83 | +%110,06 | KAZANÇ (2018 kur şoku yılı — nominal artış telafi etti) |
| 2018→2019 | +%10,00 | -%20,90 | -%8,11 | **KAYIP** (nominal artışa RAĞMEN) |
| 2019→2020 | +%36,36 | +%15,85 | +%21,91 | KAZANÇ |
| 2020→2021 | +%25,00 | +%2,81 | +%7,58 | KAZANÇ (COVID-19 kâr yılı ödemesi) |
| 2021→2022 | +%113,33 | +%12,63 | +%32,39 | KAZANÇ |
| 2022→2023 | -%6,25 | -%26,90 | -%37,71 | **KAYIP** (nominal, USD, reel üçünde de) |
| 2023→2024 | +%233,33 | +%97,04 | +%91,73 | KAZANÇ (büyük sıçrama) |
| 2024→2025 | -%40,00 | -%49,23 | -%56,48 | **KAYIP** (serinin en derin düşüşü — nominal, USD, reel üçünde de) |
| 2025→2026 | +%66,67 | +%42,86 | +%31,17 | KAZANÇ |

**Satın alma gücü kaybedilen yıllar (reel bazda negatif):** paymentYear 2017, 2019, 2023, 2025 — **10 geçişin 4'ü**, yani incelenen dönemin **%40'ında** gerçek temettü değeri gerilemiştir.

**Pay-başına NOMİNAL TL düzeyinde de düşüş olan yıllar:** paymentYear 2017 (0,73→0,70), paymentYear 2023 (6,40→6,00), paymentYear 2025 (20,00→12,00, **-%40**). Bu, önceki turların "hiçbir yıl kesinti yok, aksine hep artmış" anlatısının — ki bu anlatı doğrudur, çünkü ödeme hiçbir yıl **sıfıra** düşmemiştir — pay-başına **nominal büyüme** düzeyinde de üç istisnası olduğunu gösteriyor. En çarpıcısı paymentYear2025'teki **-%40 nominal** düşüş, önceki raporlarda (Bölüm 3, TOASO.md) yalnızca dolaylı biçimde (tablo içinde) görünüyordu, anlatı metninde ayrıca vurgulanmamıştı.

---

## 5. Süreklilik vs Büyüme — ayrım

- **Süreklilik: GÜÇLÜ, değişmedi.** En az 2014'ten (muhtemelen daha öncesinden) 2026'ya kadar 12+ yıl, her yıl **sıfırdan farklı** bir nakit temettü ödenmiş; 2018 kur şoku, 2020 pandemi, 2021 Stellantis birleşim geçişinin hiçbirinde ödeme durmamış/iptal edilmemiştir. Bu iddia bu turda da doğrulanmıştır (ödeme hiç durmadı anlamında).
- **Büyüme: ZAYIF/OYNAK, süreklilikten AYRI değerlendirilmelidir.** (a) Pay başına nominal TL temettü bile 3 yılda gerilemiş (en çarpıcısı -%40, 2025); (b) Reel/USD bazda büyüme 10 yıllık pencerede mütevazı (+%4,55 / +%2,41 yıllık), 5 yıllık pencerede NEGATİF (-%8,92 / -%4,74 yıllık); (c) 10 geçişin 4'ünde satın alma gücü kaybedilmiş.
- **Neden ayrı tutulmalı:** CLAUDE.md'nin "oranlar ... TAS29 satın alma gücü bazı sessizce eşitlenmez" ilkesi burada tam örnekleniyor — "kriz dönemlerinde dahi artan temettü" anlatısı iki seçilmiş kriz yılına (2018, 2020) dayanıyor; aynı 10 yılın içinde başka 4 yılda reel/USD temettü gerilemiştir. İki iddia (süreklilik ve büyüme) birbirinin kanıtı değildir.

---

## 6. Sürdürülebilirlik sentezi (önceki turlardan aktarılmış, bu oturumda yeniden doğrulanmadı)

- **FY2024'ten beri süren FCF-negatif dönem (bağımsız denetim turunun ana düzeltmesi):** FY2024 CFO **-9.629.971 bin TL**, FCF (CFO-CAPEX) **-18.603.321 bin TL**; FY2025 CFO pozitife dönmüş (2.655.374 bin TL) ama CAPEX (8.723.589 bin TL) düşülünce FCF yine negatif (**-6.068.215 bin TL**). H1 2026 (-7.202.222 bin TL CFO) ve 9A2026 (CFO 27,21 mr'den 4,61 mr TL'ye **-%83**, stok+yoldaki mallar ~66,7 mr TL) bu bozulmanın devam ettiğini gösteriyor. İlk turun "son 2-3 çeyrek" çerçevesi **yanıltıcıydı** — sorun en az FY2024'ten (3+ yıl) beri sürüyor (`dividend-screening-independent-audit-20261110/CASHFLOW.md`).
- **Kaldıraç yörüngesi:** Net borç/FAVÖK, FY2022-23'teki net nakit pozisyonundan (~-0,66x, ikincil kaynak) FY2025 sonunda **+3,37x**'e (birincil kaynak) yükselmiş; 9A2026'da net borç mutlak TL bazında **51,4 mr TL**'ye çıkmaya devam ediyor (FAVÖK bazlı oran hesaplanamadı, ikincil kaynak).
- **YENİ bulgu — 5,88 mr TL'lik şarta bağlı yükümlülük:** Stellantis Otomotiv Pazarlama devralmasının toplam bedeli aslında 26,06 mr TL (20,18 mr nakit + **5,88 mr TL şarta bağlı**); bu şarta bağlı kısım, devralmayı takip eden **ilk 8 mali yılın her birinde (2033'e kadar)**, Stellantis Türkiye faaliyetlerinin FCF'si bir referans değeri aşarsa aşan kısmın **%77,5'i** oranında ek ödeme yükümlülüğü getiriyor. Bu, ilk turda hiç yer almayan, nicel etkisi henüz modellenmemiş bir risktir (`RISK_REVIEW.md`).
- **Stellantis Otomotiv Pazarlama ölçek kırılması:** Nisan 2025'te kapanan devralma net satışları ~2,65 kat büyütmüş (120,27→319,41 mr TL) ama FAVÖK yalnızca ~%7,7 büyümüş (9,28→10,0 mr TL) — ciddi marj seyrelmesi, 2025 rakamlarını 2016-2024 ile doğrudan trend karşılaştırmasına uygunsuz kılıyor.
- **Kapasite kullanımı:** %58'den (2022) %33'e (2025) gerilemiş; Egea model döngüsünün sonuna yaklaşılmasına bağlı; 2026-2027'de toparlanma bekleniyor ama henüz gerçekleşmedi.
- **Zamansal örtüşme:** Yüksek nakit temettü (2024-2025) + Stellantis Otomotiv Pazarlama devralımı (Nisan 2025, 400M€) + stok/işletme sermayesi birikimi (H1/9A2026) + kaldıraç artışı aynı döneme denk geliyor. Bu turun **yeni eklediği gözlem:** aynı dönemde (paymentYear2025) pay başına **nominal** temettü de -%40 gerilemiş — yani şirket aynı anda hem (nominal) temettüyü azaltmış hem kaldıraç/nakit akışı bozulmuş; salt "borçla finanse edilen sabit/artan temettü" senaryosundan daha nüanslı bir tablo.

---

## 7. Kanıt güvenilirliği (bölüm bazlı)

- **dividendHistoryConfidence: Yüksek.** 11 ardışık ödeme yılı, her biri totalCashTRY + grossPerShareTRY + netPerShareTRY + tam ödeme tarihiyle; resmi Tofaş IR tablosu + 3 faaliyet raporu + 1 KAP bildirimiyle birincil kaynaktan çapraz doğrulanmış. Pay sayısının sabit kalması karşılaştırmayı basitleştiriyor.
- **cashFlowConfidence: Orta** (bu turda Düşük/PARTIAL'dan yükseldi). FY2021-2022 ve FY2024-2025 artık birincil kaynaklı; yalnızca FY2023 eksik. **Önemli ayrım:** kanıt KALİTESİNİN artması ile SONUCUN olumlu/olumsuz olması ayrı eksenlerdir — bu turda kanıt kalitesi arttı AMA ortaya çıkan sonuç (FY2024 CFO/FCF derin negatif) önceki turdan **daha olumsuz**. Daha iyi veri, daha kötü haber getirmiştir.
- **riskAssessmentConfidence: Orta-Yüksek.** FY2025 net borç/FAVÖK birincil kaynaktan; Stellantis Otomotiv Pazarlama'nın toplam bedeli ve şarta bağlı yükümlülüğü bağımsız denetimde ECB kuru + TMS29 çapraz kontrolüyle doğrulanmış. Zayıf noktalar: 9A2026 oranı hesaplanamadı, Koç Stellantis Finansman borcu ayrıştırılamadı, şarta bağlı yükümlülüğün yıllık nakit etkisi modellenmedi.

---

## 8. Eksik veri (taşınan + bu turda değişmeyen)

1. **FY2023 CFO/CAPEX/nakit akış tablosu** — hâlâ eksik, iki tur da bulamadı; 2021-2022 (pozitif FCF) ile 2024-2025 (negatif FCF) arasındaki geçiş yılının yönü bilinmiyor.
2. **9A2026 net borç/FAVÖK oranı** — yalnızca mutlak TL net borç (51,4 mr TL, ikincil kaynak) var.
3. **Koç Stellantis Finansman A.Ş. borcunun ayrıştırılmış payı** — hiçbir turda bulunamadı.
4. **Şarta bağlı 5,88 mr TL yükümlülüğün yıllık nakit etkisi** — varlığı/koşulları doğrulandı, nicel yıl-yıl modeli yok.
5. **TÜFE kaynağının (hakedis.org) TÜİK resmi portalından birincil doğrulaması** — yapılmadı (tüm 10 şirket için ortak sınırlama, MACRO_REFERENCE.md).
6. **USD/TRY kaynağının (Yahoo Finance) TCMB resmi kuruyla çapraz kontrolü** — yapılmadı (ortak sınırlama).

---

## 9. Özet (200 kelime altı)

TOASO'nun 10 yıllık (paymentYear 2016-2025) nominal temettü CAGR'ı +%36,5/yıl iken, aynı pencerede reel (TÜFE-deflasyonlu) CAGR yalnızca +%4,55/yıl, USD CAGR +%2,41/yıl — nominalin çok altında ama yine de pozitif. Son 5 yılda (2021-2025) tablo tersine döner: nominal CAGR +%41,4 iken reel ve USD CAGR'ın **ikisi de negatif** (-%8,92 / -%4,74) — yatırımcı nominal temettüsü 4 katına çıkarken gerçek satın alma gücü/dolar karşılığı küçülmüştür. 10 ödeme geçişinin 4'ünde (2017, 2019, 2023, 2025) reel değer kaybedilmiş; 3'ünde (2017, 2023, 2025) pay başına nominal TL de gerilemiş, en çarpıcısı 2025'te -%40 — önceki raporların "hiçbir yıl kesinti yok, hep artan" anlatısının nüanssız kaldığı nokta burası. Süreklilik (ödeme hiç sıfırlanmadı, 12+ yıl) güçlü ve ayrı bir eksen; büyüme ekseni zayıf/oynak ve son 5 yılda reel bazda negatiftir. En kritik eksik: FY2023 CFO/CAPEX verisi hâlâ yok, bu yüzden 2021-2025 FCF serisindeki geçiş yılı (pozitif→negatif) tam olarak hangi yılda kırıldığı belirsizliğini sürdürüyor; ayrıca 2033'e kadar uzanan 5,88 mr TL'lik şarta bağlı Stellantis yükümlülüğünün nakit etkisi henüz modellenmemiştir.
