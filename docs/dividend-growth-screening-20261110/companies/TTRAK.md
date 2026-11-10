# TTRAK — Türk Traktör ve Ziraat Makineleri A.Ş. — Temettü Büyümesi Veri Derlemesi (4. Tur)

**Kesim tarihi:** 2026-11-10, Europe/Istanbul. **Bu belge A/B/C/D sınıflandırması YAPMAZ** — yalnızca temettü sürekliliği, nominal/reel/USD büyümesi ve sürdürülebilirlik verisini derler, hesaplar ve önceki üç turun ilgili bulgularını aktarır. Final strateji kararı merkezi sentezde (bu turun kendi karşılaştırma/kısa liste dosyalarında, bu oturumda henüz yazılmadı) verilecektir. Tam veri: [`TTRAK.json`](./TTRAK.json).

**Bu turun yeri:** `dividend-screening-20261110` (1. tur) → `dividend-screening-independent-audit-20261110` (2. tur, bağımsız oturum) → `dividend-portfolio-decision-20261110` (3. tur) → **`dividend-growth-screening-20261110`** (bu tur, 4.). Önceki turların ham bulguları değiştirilmedi; bu tur onları METHODOLOGY_V2.md'nin üç-eksenli (süreklilik / büyüme / sürdürülebilirlik kalitesi) çerçevesine göre yeniden düzenler ve nominal büyümeyi reel/USD'ye çevirir.

---

## 1. Temettü serisi (profitYear bazında, nominal toplam nakit)

| Kâr yılı | Ödeme tarihi | Toplam nakit (nominal TL) | USD (ödeme günü kuruyla) | Reel TL (2026-10 satın alma gücü) | Not |
|---|---|---:|---:|---:|---|
| 2015 | 01.04.2016 | 300.000.000 | 106.500.053 | 4.863.285.975 | |
| 2016 | 03.04.2017 | 250.000.000 | 68.602.161 | 3.622.733.643 | Net pay başı tutarda çözülmemiş küçük bir ikincil-kaynak çelişkisi var (3,98 vs 4,22 TL) |
| 2017 | 21.03.2018 | 300.000.011 | 76.294.144 | 3.995.213.857 | |
| 2018 | — | 0 | 0 | 0 | **Ödeme yapılmadı** (kesinti 1) |
| 2019 | 20.03.2020 | 100.000.000 | 15.287.435 | 994.503.018 | Seri dibi |
| 2020 | 25.03.2021 | 850.000.000 | 107.439.899 | 7.275.374.750 | |
| 2021 | 28.03.2022 | 1.200.000.000 | 80.964.013 | 6.373.853.821 | Temettü o yılın FCF'sini **%213,1** ile aştı |
| 2022 | 10.03.2023 | 2.100.000.000 | 110.806.829 | 7.411.038.839 | FCF'yi aşmadı (%95,3) — istisna |
| 2023 | 01.04.2024 + 12.11.2024 (2 taksit) | 9.000.000.000 | 273.929.950 | 17.341.605.412 | 06.06.2023 bedelsiz artırım **sonrası** pay sayısı bazında; temettü FCF'yi **%110,4** ile aştı |
| 2024 | 02.04.2025 | 4.850.000.000 | 127.817.863 | 7.141.426.620 | Temettü FCF'yi **%314,3** ile aştı — seride en şiddetli aşım |
| 2025 | — | 0 | 0 | 0 | **Ödeme yapılmadı** (kesinti 2) |

**FX/TÜFE kaynağı:** `_reference/lookup.cjs` → `_reference/usdtry_daily.json` (Yahoo Finance TRY=X günlük kapanış) ve `_reference/tufe_linked_index.json` (TÜİK 2003=100 ekivalanı, linkleme sıfır sapmayla doğrulanmış, baz ay 2026-10). Hiçbir FX/TÜFE değeri bu oturumda ayrıca aranmadı veya uydurulmadı. Tam satır bazlı FX/TÜFE girdileri `TTRAK.json → dividendSeries[].fx / .tufe` alanlarındadır.

**06.06.2023 bedelsiz artırımı (kritik karşılaştırılabilirlik notu):** Sermaye 53.369.000 → 100.066.875 TL'ye (pay sayısı da buna paralel, ~1,874x) çıktı. Bu nedenle **pay başına nominal seri** (`grossPerShareTRY_asReported`/`netPerShareTRY_asReported`) 2022→2023 sınırını aşan dönemlerde doğrudan karşılaştırılamaz — eski ve yeni pay sayısı farklıdır. Bu raporda **toplam nakit (`totalCashTRY`)** ana karşılaştırma metriği olarak kullanıldı çünkü bedelsiz artırımdan etkilenmez; bonus-güvenli bir pay-başı karşılaştırma için `cashPerShareCurrentBasisTRY` (toplam nakit ÷ güncel 100.066.875 pay) türetildi.

---

## 2. Büyüme metrikleri (Eksen B — nominal TEK BAŞINA anlamlı değil)

### 10 yıl (gerçekte 9 yıl: 2025 sıfır olduğu için en yakın pozitif-pozitif uç noktalar: profitYear 2015→2024)

| Ölçü | CAGR |
|---|---:|
| Nominal toplam nakit | **+%36,2/yıl** |
| Reel TL (2026-10 bazında) | **+%4,4/yıl** |
| USD | **+%2,0/yıl** |

**Okuma:** Nominal büyüme Türkiye'nin yüksek enflasyon ortamında neredeyse otomatik ve yanıltıcıdır. Gerçek (reel ve USD) büyüme pozitif ama zayıf/mütevazı.

### 5 yıl (gerçekte 2019→2024, çünkü 2025 sıfır — pencere bir yıl geriye kaydırıldı)

**KRİTİK UYARI:** profitYear 2019 serinin **dip noktasıdır** (2018-2019 krizi sonrası en düşük ödeme). Bu tabanla CAGR yapay şekilde şişer:

| Ölçü | CAGR (2019→2024, dip tabanlı) |
|---|---:|
| Nominal toplam nakit | +%117,3/yıl |
| Reel TL | +%48,3/yıl |
| USD | +%52,9/yıl |

**Tamamlayıcı, normalize pencereler (dip etkisini gidermek için):**

| Pencere | Nominal CAGR | Reel TL CAGR | USD CAGR |
|---|---:|---:|---:|
| 2021→2024 (3 yıl, kriz-sonrası toparlanmış taban) | +%59,3/yıl | **+%3,9/yıl** | +%16,4/yıl |
| 2020→2024 (4 yıl) | +%54,6/yıl | **-%0,5/yıl** | +%4,4/yıl |

**Okuma:** Dip-tabanlı 5 yıllık rakam tek başına kullanılırsa reel/USD büyüme yanlış biçimde çok güçlü görünür. Normalize bir taban kullanıldığında reel büyüme ~%4/yıl'a düşer, 2020→2024 penceresinde ise reel büyüme **hafif negatife** döner. 2021-2024 nominal patlamanın büyük ölçüde enflasyon ve agresif (FCF'yi aşan) bir dağıtım politikasının yansıması olduğu, kalıcı bir reel büyüme trendine dair güçlü kanıt OLMADIĞI sonucuna işaret eder.

---

## 3. Süreklilik (Eksen A) — büyüme/kaliteyle KARIŞTIRILMAMALI

11 ödeme yılı (2016-2026) içinde **2 kesinti**:
- **paymentYear 2019 (profitYear 2018):** Doğrudan şirket gerekçesi yok; 2018 TL kur krizi sonrası temkinlilikle bağlamsal olarak ilişkilendiriliyor (çıkarım).
- **paymentYear 2026 (profitYear 2025):** Doğrulanmış, açık şirket kararı — dağıtılabilir kârın (454,8M TL) tamamı olağanüstü yedeklere aktarıldı.

İlk kesintiden dönüş **hızlı ve büyük** oldu (1 yılda kısmi, 2 yılda güçlü, 3 yılda tam toparlanma — profitYear 2019→2020→2021). İkinci kesintiden dönüş kanıtı **henüz yok**: 9A2026 ara dönem net zararla devam ediyor, FY2026 tam yıl sonucu bu kesim tarihinde mevcut değil.

**Önemli:** Süreklilik bir *ödeme olgusudur*; aşağıdaki sürdürülebilirlik bulgusu bir *yönetim politikası* bulgusudur. İkisi TTRAK'ta ikisi de olumsuza yakın çıkabilir ama nedenleri tamamen ayrıdır (METHODOLOGY_V2.md'nin "önemli kural"ı).

---

## 4. Sürdürülebilirlik sentezi (Eksen C)

### Düzeltilmiş CFO/CAPEX/FCF (birincil kaynak: şirketin kendi Annual Report'ları, bağımsız denetim turunda bulundu)

| Kâr yılı | Net kâr (M TL) | CFO (M TL) | CAPEX (M TL) | FCF (M TL) | Ertesi yıl ödenen temettü (M TL) | Temettü/FCF | FCF aşıldı mı? |
|---|---:|---:|---:|---:|---:|---:|:---:|
| 2021 | 1.322,2 | 886,0 | 322,9 | 563,2 | 1.200,0 | **%213,1** | EVET |
| 2022 | 2.971,0 | 2.884,2 | 680,8 | 2.203,4 | 2.100,0 | %95,3 | hayır |
| 2023 | 9.342,0 | 9.885,6 | 1.736,0 | 8.149,6 | 9.000,0 | **%110,4** | EVET |
| 2024 | 5.740,5 | 5.370,9 | 3.827,9 | 1.543,0 | 4.850,0 | **%314,3** | EVET (en şiddetli) |
| 2025 | 455,0 | ~6.900 (ikincil, doğrulanmamış) | ~3.800 (ikincil) | ~3.100 (ikincil) | 0 | N/A | — |

**Düzeltme notu:** 1. tur (dividend-screening) 2022/2023 için ikincil (TradingView/Investing.com) CFO rakamları kullanmıştı; bunlar 1,16x-2,4x şişirilmişti. Düzeltilmiş veriyle Temettü/CFO oranı 2022'de %30,8→%72,8'e, 2023'te %63,0→%91,0'a yükseldi — **kanıt güvenilirliğinin yükselmesi sonucu iyileştirmedi, tersine kötüleştirdi.**

**Döngüsel kesinti/şok testi (METHODOLOGY_V2.md):** FY2025-2026 daralmasından önceki 4 yılın **3'ünde** temettü zaten FCF'yi aşıyordu. Bu, FY2025 sıfır temettü kararının salt dışsal bir pazar şokuna verilmiş disiplinli bir tepki olmadığını, aynı zamanda önceki 4 yılın 3'ünde zaten sürdürülemez bir dağıtım politikasının net nakit tamponunu önceden eritmiş olmasının bir sonucu olduğunu gösterir — **iki etken birleşmiştir.**

**Bilanço yörüngesi:** Net nakit (FY2021: -0,43 mr TL; FY2023 zirve: -8,17 mr TL) → net borç (FY2025: +8,7 mr TL; 9A2026: ~+7,98 mr TL) — FY2024→FY2025 arasında tek yılda ~9,6 mr TL kötüleşme. 9A2026'daki küçük iyileşme büyük ölçüde stok eritmesinden (tek seferlik), operasyonel iyileşmeden değil.

**Pazar bağlamı:** 19 yıl üst üste Türkiye traktör pazarı lideri (%38-46 pazar payı) — bu, sürdürülebilirlik sorusuna doğrudan cevap vermez, pazar liderliği temettü kapasitesini garanti etmez.

**Elektrikleşme riski — EN KRİTİK yapısal bilinmeyen:** CNH Industrial'ın somut bir elektrikleşme yol haritası (New Holland T4 Electric Power, 95 kWh batarya, Case IH'a genişleme planı) bağımsız denetim turunda **doğrulandı**. Ama **TTRAK'ın kendisinin** Türkiye'de bu stratejiden ne ölçüde/ne zaman pay alacağına dair **hiçbir kamuya açık bilgi** iki ayrı araştırma turunda da bulunamadı. CNH tarafı belgeli, TTRAK tarafı tamamen belgesiz — 10-15 yıllık ufkun en önemli açık sorusu.

---

## 5. Kanıt güvenilirliği (bölüm bazlı, stratejik uygunluktan AYRI)

| Alan | Seviye | Not |
|---|---|---|
| **dividendHistoryConfidence** | Orta-Yüksek | Ödeme tarihleri/tutarları çoklu bağımsız ikincil kaynakla iyi çaprazlandı. 08.11.2024 taksitinin FY2023'e ait olduğu bu turda KAP bildirim başlığıyla (bağımsız denetim turu bulgusu, bu rapor aktarıyor) kesin teyitli hale geldi. |
| **cashFlowConfidence** | **Orta** (bu turda yükseltildi) | 2021-2024 artık birincil kaynaklı. **Ama sonuç olumsuza döndü** — kanıt güvenilirliği ile stratejik uygunluk ayrı eksenlerdir; biri iyileşirken diğeri kötüleşebilir. FY2025 hâlâ ikincil/Düşük. |
| **riskAssessmentConfidence** | Düşük | Elektrikleşme riski CNH tarafında belgeli, TTRAK tarafında belgesiz; diğer riskler (ilişkili taraf tutarları, FAVÖK çelişkisi) de doğrulanmamış. |

---

## 6. Yapısal riskler (taşınan)

1. Tarımsal sübvansiyon/kredi politikası ve faiz oranı duyarlılığı — iki kez gerçekleşmiş, tekrarlayıcı.
2. CNH Industrial'a münhasır lisans bağımlılığı — 27+ yıllık ilişki, teorik risk.
3. **Elektrikli/otonom tarım makinelerine geçiş riski** — CNH belgeli, TTRAK belgesiz, en kritik bilinmeyen.
4. Kısa vadeli TL borcun yüksek faiz maliyeti (~%33,79).
5. İlişkili taraf (CNH royalti, Koç grubu içi) işlemlerinin kantitatif büyüklüğü doğrulanamadı.
6. **YENİ:** 2021-2024 agresif dağıtım politikası net nakit tamponunu önceden eritmişti.
7. FY2022-2024 FAVÖK ikincil kaynak çelişkisi (13,193 vs 18,89 mr TL) çözülemedi.

---

## 7. Eksik veri

- FY2025 tam yıl CFO/CAPEX birincil kaynaktan teyidi (erişim engeli — TurkTraktorFR25.pdf OCR/binary).
- FY2022-2024 FAVÖK ikincil kaynak çelişkisi (araştırma eksikliği).
- **TTRAK'ın kendi elektrikleşme stratejisi** (belirsiz tür — gerçek veri boşluğu mu araştırma eksikliği mi ayrıştırılamadı).
- CNH royalti/ilişkili taraf (Not 23) tutarları (araştırma eksikliği).
- TÜFE kaynağı ikincil derleme sitesi (ortak sınırlama, 10 şirketin tamamını etkiler).
- USD/TRY kaynağı (Yahoo Finance) TCMB ile çapraz kontrol edilmedi (ortak sınırlama).

---

## 8. Ajan notları

Bu rapor dördüncü turun (dividend-growth-screening-20261110) parçasıdır ve **sınıflandırma yapmaz**. Önceki turların ham bulguları (bağımsız denetimin CFO/CAPEX düzeltmesi, KAP-teyitli kâr yılı atfı, elektrikleşme riski asimetrisi) olduğu gibi, kaynağı belirtilerek aktarıldı; bu oturum kendi başına ek bir doğrulama yapmadı. Tüm FX/TÜFE girdileri yalnızca `_reference/lookup.cjs` üzerinden alındı. 06.06.2023 bedelsiz artırımı nedeniyle pay-başına seri 2022→2023 sınırını aşan karşılaştırmalarda geçersizdir; toplam nakit ana metrik olarak kullanıldı. 5 yıllık CAGR'ın doğal tabanı (2019) dip noktası olduğu için ayrıca iki normalize pencere sağlandı. İkinci taksitin (08.11.2024) kâr yılı atfındaki orijinal belirsizlik, bağımsız denetim turunun KAP-teyitli bulgusuyla birlikte `dividendSeries` içindeki ilgili satırın `notes` alanında korunmuştur — kendi başına bir teyit uydurulmamıştır.

*Tam yapılandırılmış veri için: [`TTRAK.json`](./TTRAK.json).*
