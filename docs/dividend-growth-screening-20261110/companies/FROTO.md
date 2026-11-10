# FROTO — Ford Otomotiv Sanayi A.Ş. (Ford Otosan) — Temettü Büyüme Serisi (4. Tur)

**Kesim tarihi:** 2026-11-10, Europe/Istanbul
**Kapsam:** Bu rapor **sınıflandırma (A/B/C/D) YAPMAZ** — yalnızca önceki üç turun verisini derler, nominal/reel/USD temettü büyüme serisini hesaplar. Final karar merkezi sentezde verilecek.

**Okunan önceki turlar:**
1. `dividend-screening-20261110/companies/FROTO.json` + `.md` — 1. tur eleme araştırması (21 satırlık `dividendHistory`, kategori B).
2. `dividend-screening-independent-audit-20261110/` (AUDIT.md, CASHFLOW.md, RISK_REVIEW.md, DATA_GAPS.md, FINAL_SHORTLIST.md) — 2. tur bağımsız denetim. **Kritik düzeltme:** 24.03.2021 ödemesi "~13 TL, teyit edilemedi" değil, Ford Otosan IR sayfasından doğrulanan **6,42 TL/pay** (toplam 2.252.842.200 TL). **Kritik tespit:** FROTO, 10 şirketlik eleme turunun CFO/CAPEX'i hiçbir yılda birincil kaynaktan doğrulanamayan TEK şirketi (Ford Otosan'ın finansal sonuç PDF'leri şifreli/sıkıştırılmış akış içeriyor).
3. `dividend-portfolio-decision-20261110/` (COMPANY_DECISIONS.md, UNRESOLVED_ISSUES.md) — 3. tur portföy kararı. FROTO'yu "Koşullu (B) ile Karar Ertelendi (D) arasındaki en ince çizgi" olarak tanımlıyor; ana neden çok-yıllı FCF karşılamasının hiç test edilememesi.
4. `dividend-growth-screening-20261110/_reference/MACRO_REFERENCE.md` + `lookup.cjs` — ortak TÜFE/USD-TRY referansı (bu turda ayrıca kur/TÜFE aranmadı).

CFO/CAPEX **yeniden doğrulanmaya çalışılmadı** (görev talimatı) — üç turda da aynı sonuç: bulunamadı. Bu, aşağıdaki hesaplamanın sınırlarını belirler: büyüme serisi **temettü ödemeleri** üzerinden hesaplanabiliyor, ama bu ödemelerin nakit akışıyla **karşılanabilirliği** hâlâ bilinmiyor.

---

## 1. Veri temizleme ve gruplama

FROTO'nun 21 satırlık `dividendHistory`'si **kâr yılına (profitYear)** göre gruplandı, ödeme yılına göre DEĞİL. 20 satır `paid: true` (2015-2025 kâr yılları), 1 satır (`profitYear: 2026`, 2026-11-30 ödeme, `paid: false`) **tamamen hariç** tutuldu — henüz gerçekleşmemiş, backtest'e dahil edilmez.

**Özel durum (talimatta işaretli):** 2021 kâr yılına ait İKİ taksit var ama farklı mantıkla: 19.11.2021'de ödenen 3,77 TL/pay, 2021'in **kendi** kârından (henüz kapanmamış yıl içinde) ara/avans temettü; 24.03.2022'de ödenen 12,99 TL/pay ise 2021'in **final** taksidi. İkisi de `profitYear 2021` altında toplandı. Bunun karıştırılmaması gereken bir komşu durum: `profitYear 2020` (24.03.2021 ödemeli, pandemi nedeniyle tek/azalmış taksit) KENDİ başına kaldı, 2021'in taksitleriyle birleştirilmedi.

**Pay sayısı / bölünme düzeltmesi (kritik):** FROTO.md'nin (1. tur) kendi notuna göre Mayıs 2025'te 1:10 bedelsiz sermaye artırımı oldu: nominal sermaye 350.910.000 TL → 3.509.100.000 TL. BIST standardı (1 TL nominal/pay) varsayımıyla bu, ESKİ pay sayısının 350.910.000, YENİ pay sayısının 3.509.100.000 olduğu anlamına geliyor. Bu varsayım **4 ayrı noktada** JSON'da VERİLEN `totalCashTRY` değerleriyle tam örtüşerek doğrulandı:

| Kâr yılı | Gross/pay | Pay sayısı × gross | Verilen totalCashTRY | Eşleşme |
|---|---|---|---|---|
| 2019 | 3,12 | 350.910.000 × 3,12 = 1.094.839.200 | 1.094.839.200 | **TAM** |
| 2020 (audit) | 6,42 | 350.910.000 × 6,42 = 2.252.842.200 | 2.252.842.200 | **TAM** |
| 2022 final | 14,25 | 350.910.000 × 14,25 = 5.000.467.500 | 5.000.467.500 | **TAM** |
| 2025 final | 3,64 (yeni pay) | 3.509.100.000 × 3,64 ≈ 12.773.124.000 | ~12.770.000.000 | **Yakın** (not: "yaklaşık, GK onayına sunulan") |

Bu doğrulanmış çarpanla, `totalCashTRY` null olan 7 satırda (2021 her iki taksit, 2023 her iki taksit, 2024 her iki taksit, 2025 ara taksit) toplam nakit = gross/pay × dönemin pay sayısı formülüyle **türetildi**. Bu, talimattaki "pay sayısı/sermaye bilgisi varsa oradan türetmeyi dene" kuralına uygun — uydurma değil, kaynaklı bir sabitle (pay sayısı) çarpma.

2025 öncesi tüm pay başı tutarlar ESKİ pay bazında; 2025 ara taksit (6,05 TL, Aralık 2025) ve sonrası YENİ pay bazında (FROTO.md'nin kendi notuyla tutarlı). Karşılaştırılabilirlik için ESKİ-baz tutarlar ÷10 ile YENİ-pay-eşdeğerine çevrildi (`grossPerShareTRY_newShareBasis`).

---

## 2. Her taksit için FX/TÜFE (ortak referans, `lookup.cjs`)

20 ödeme tarihinin tamamı için ortak script çalıştırıldı; hiçbiri hafta sonu/tatile denk gelmedi (`fxLookbackDays: 0` hepsinde). Kullanılan USD/TRY ve TÜFE endeksi (baz ay 2026-10, baz endeks 4481,03) değerleri `FROTO.json` → `dividendSeries[].installments[]` altında satır satır kayıtlı; burada tekrarlanmıyor.

---

## 3. Kâr yılı bazında toplam seri (11 yıl, 2015-2025)

| Kâr Yılı | Taksit | Gross/pay (yeni-pay-eşdeğeri) | Toplam Nakit TRY | Toplam Nakit USD | Reel TRY (2026-10 bazı) |
|---|---|---:|---:|---:|---:|
| 2015 | 2 | 0,189 | 663.219.900 | 217.860.245 | 10.551.066.275 |
| 2016 | 2 | 0,225 | 789.547.500 | 212.893.740 | 11.244.503.507 |
| 2017 | 2 | 0,343 | 1.203.621.300 | 277.139.253 | 15.031.501.636 |
| 2018 | 2 | 0,366 | 1.284.330.600 | 229.986.612 | 13.751.321.522 |
| 2019 | 1 | 0,312 | 1.094.839.200 | 166.967.232 | 10.888.208.884 |
| 2020 | 1 | 0,642 | 2.252.842.200 | 283.747.569 | 19.282.672.069 |
| 2021 | 2 | 1,676 | 5.881.251.600 | 427.301.962 | 34.012.821.070 |
| 2022 | 2 | 1,996 | 7.000.654.500 | 371.025.154 | 25.683.582.946 |
| 2023 | 2 | 7,310 | 25.651.521.000 | 838.138.768 | 57.633.319.195 |
| 2024 | 2 | 3,135 | 11.001.028.500 | 302.422.059 | 17.268.141.370 |
| 2025 | 2 | 9,690 | 34.000.055.000 | 788.342.935 | 41.872.426.805 |

**Hariç tutulan:** `profitYear 2026` (3,07 TL/pay, planlı 30.11.2026 ödemesi) — henüz gerçekleşmemiş, tabloya dahil değil.

**Payout uyarısı (2025):** Toplam nakit (34,00 mr TL) 2025 net dönem kârına (~33,98-33,99 mr TL) çok yakın → **payout ~%100,0**. Bu, 1. turun counterEvidence'ındaki "%90-100 aralığı, KAP birincil tablosuyla teyit edilemedi" şüphesini büyüklük olarak doğruluyor, ama hesap kısmen türetilmiş `totalCashTRY`'ye dayanıyor ve KAP kâr dağıtım tablosu üç turda da açılmadı — **NEEDS_REVIEW**.

---

## 4. Büyüme metrikleri (CAGR)

| Seri | 10 yıl (2015→2025) | 5 yıl (2020→2025) |
|---|---:|---:|
| Nominal TL, pay başı (yeni-pay-eşdeğeri) | **%48,25/yıl** | **%72,09/yıl** |
| Toplam nakit, USD | **%13,72/yıl** | **%22,68/yıl** |
| Toplam nakit, reel TL (2026-10 bazı) | **%14,78/yıl** | **%16,78/yıl** |

**Duyarlılık testi — 2025'in payout-spike'ını hariç tutarsak (2015→2024 / 2020→2024):**

| Seri | 9 yıl (2015→2024) | 4 yıl (2020→2024) |
|---|---:|---:|
| USD | %3,71/yıl | %1,61/yıl |
| Reel TL | %5,63/yıl | **%-2,72/yıl** |

**Yorum:** Headline 10y/5y CAGR rakamlarının büyük kısmı **TEK bir uç yıla** (profitYear 2025, payout'u teyitsiz şekilde ~%100'e sıçrayan) bağımlı. 2025'i çıkarınca: USD büyüme 10 yılda ~%3,7/yıl'a, son 4 yılda ~%1,6/yıl'a düşüyor; reel TL büyüme son 4 yılda **NEGATİF** (-%2,72/yıl) çıkıyor — yani 2025 hariç resmi görünüm satın alma gücü bazında küçülme, büyüme değil.

**Yıldan yıla oynaklık (USD toplam nakit):** -%2,3, +%30,2, -%17,0, -%27,4, +%69,9, +%50,6, -%13,2, +%125,9, **-%63,9**, +%160,7. Düz/istikrarlı bir eğri yok; -%64 ile +%161 arası sıçramalar var — otomotiv kâr döngüselliğiyle (2023 zirve → 2024 çöküş → 2025 kısmi/anomalik toparlanma) uyumlu.

---

## 5. Süreklilik vs Büyüme

FROTO 2015-2025 arası **11 kâr yılının tamamında** nakit temettü ödedi (pandemi yılı 2020'de taksit sayısı 1'e düştü ama sıfıra inmedi) — **süreklilik güçlü**. Ama süreklilik büyüme anlamına GELMİYOR:

1. Nominal TL büyüme (%48,2/10y) büyük ölçüde TL'nin USD karşısındaki değer kaybından (2016'da ~2,81 → 2026'da ~44,22 USD/TRY, ~%93 kayıp) kaynaklanıyor.
2. Reel TL ve USD büyüme serisi düz değil; 10 yıllık CAGR'ların neredeyse tamamı 2025'in teyitsiz payout sıçramasına bağımlı (Bölüm 4).
3. Yıldan yıla oynaklık çok yüksek; "istikrarlı/öngörülebilir temettü büyümesi" beklentisiyle uyuşmuyor.

**Sonuç:** FROTO "kesintisiz ödeyen ama düzenli büyüyen değil, döngüsel ve son yılı istisnai" bir profile sahip.

---

## 6. Sürdürülebilirlik sentezi

- **Politika:** KAP'a bildirilmiş (12.03.2026), net dağıtılabilir kârın en az %50'si şeklinde açık bir politika var; "büyük yatırım/ciddi durgunlukta istisna" kaydı kriz döneminde tekrar kesinti riskini açıkça saklı tutuyor (kaynak: COMPANY_DECISIONS.md, FROTO.json 1. tur).
- **Kârlılık trendi:** Net kâr 2023 zirvesinden (49,1 mr TL) 2025'e (~34,0 mr TL) iki yıl art arda gerilemiş; döngüsel mi yapısal mı ayrıştırılamadı.
- **Kaldıraç:** Net borç 2020'de ~sıfırdan 2024'te ~101,4 mr TL'ye hızla artmış, 2025'te ~99,2 mr TL'ye kısmi gerilemiş; çok-yıllı düşüş trendi henüz kanıtlanmadı. 2025 net borç/FAVÖK için kaynaklar arası çelişki (1,49x vs 1,85x) iki turda da çözülmedi.
- **Payout:** Bu turun hesabı, profitYear 2025 için payout'un ~%100'e (politikanın belirgin üzerinde) işaret ettiğini sayısal olarak doğruladı — ama türetilmiş veriye dayanıyor, KAP birincil tablosu teyit etmedi.
- **En kritik eksik:** 2021-2025 CFO/CAPEX/FCF serisinin **tamamı** iki önceki bağımsız turda da doğrulanamadı — Ford Otosan'ın finansal sonuç PDF'leri şifreli/sıkıştırılmış akış içeriyor. Bu turda talimat gereği yeniden denenmedi. **Temettü/FCF karşılama oranı hâlâ hesaplanamıyor.**

Sonuç: "olgu bazında süreklilik güçlü, nakit akışı kapsamı bilinmiyor, payout oranı muhtemelen yüksek ve teyitsiz" — UNRESOLVED_ISSUES.md'nin FROTO'yu "Koşullu (B) ile Karar Ertelendi (D) arasındaki en ince çizgide" tuttuğu tespitini sayısal olarak destekliyor.

---

## 7. Kanıt güvenilirliği (bölüm bazlı)

| Bölüm | Değerlendirme |
|---|---|
| **dividendHistoryConfidence** | **Orta** — ödeme olgusu ve büyüklük mertebeleri çok kaynaklı doğrulandı, 2021 tutarı 2. turda düzeltildi; ama totalCashTRY'nin 7/11 yılda türetilmiş olması ve 2020 net pay başı tutarının hiç bulunamaması "Yüksek"e çıkmasını engelliyor. |
| **cashFlowConfidence** | **Düşük** — CFO/CAPEX/FCF serisinin tamamı iki turda da doğrulanamadı; bu şirket 10 şirketlik eleme turunun kanıt tabanı en zayıf kalanı. |
| **riskAssessmentConfidence** | **Orta** — nitel yapısal riskler (Ford bağımlılığı, AB EV takvimi, Koç Finansman) çok kaynaklı tutarlı; nicel kaldıraç göstergeleri (net borç/FAVÖK çelişkisi, döviz borcu yüzdesi) hâlâ net değil. |

---

## 8. Yapısal riskler (taşınan)

- EV geçiş hızının belirsizliği (2025'te EV payı hâlâ ~%9,8).
- İhracat/Avrupa ağırlıklı gelir (%70-86) → Avrupa otomotiv döngüselliğine yüksek maruziyet.
- Ford Motor Company'nin global strateji değişikliği riski (Avrupa'dan çekilme, üretim üssü değişimi).
- Bağımsız Ar-Ge/marka gücünün sınırlı olması, Ford'a sözleşmesel bağımlılık.
- Koç Finansman (Ford Finans, 2026) entegrasyon riski, konsolide net borç okumasına etkisi henüz belirsiz.
- TL değer kaybı + TMS 29 muhasebesi, nominal büyümenin reel anlamını karmaşıklaştırıyor — bu turun hesabı bunu SAYISAL gösterdi (nominal %48,2/10y vs reel %14,8/10y; 2025 hariç reel 4y CAGR negatif).
- Dağıtım politikasının "istisna" maddesi, kriz döneminde (2020'de görülen) yeniden kesinti riskini açık tutuyor.

---

## 9. Eksik veri

| # | Eksik | Karara etkisi |
|---|---|---|
| 1 | 2021-2025 CFO tam serisi, birincil kaynaktan | Temettü/FCF karşılama hesaplanamıyor (3 turda da aynı sonuç) |
| 2 | 2021 gerçekleşen CAPEX | FCF hesaplaması tamamen engelleniyor |
| 3 | profitYear 2025 KAP kâr dağıtım tablosu | ~%100 payout tahmini kesinleştirilemiyor |
| 4 | profitYear 2020 net pay başı tutar | Net seri tek boşluk; gross audit ile düzeltildi, net değil |
| 5 | 2016-2022 taksitlerin KAP birincil teyidi | Erken dönem güvenilirliği "Orta"da kalıyor |
| 6 | totalCashTRY'nin 7/11 yılda türetilmiş olması | Payout/ölçek hesapları resmi olmayan bir varsayıma dayanıyor (4 noktada doğrulanmış olsa da) |
| 7 | Koç Finansman'ın konsolide kaldıraç etkisi | Gelecek dönem karşılaştırması belirsiz |

---

## 10. Özet

11 kâr yılı (2015-2025) için hesap yapılabildi; 2026 (planlı, ödenmemiş) hariç tutuldu. En kritik eksik: CFO/CAPEX/FCF'nin hiçbir yılda birincil kaynaktan doğrulanamaması (üç turda da aynı sonuç) — temettü/nakit akışı karşılama oranı bilinmiyor. Reel TL ve USD büyüme, 2025'in teyitsiz payout sıçramasını (hesaplanan ~%100 payout) dışarıda tutarsak son 4 yılda sırasıyla negatif (-%2,7/yıl) ve çok düşük (+%1,6/yıl) çıkıyor — headline 10y/5y CAGR'lar (reel %14,8, USD %13,7) büyük ölçüde bu tek yıla bağımlı. Süreklilik vs büyüme: FROTO kesintisiz ödeyen ama DÜZENLİ BÜYÜYEN değil, döngüsel ve son yılı istisnai bir temettü profiline sahip; "20 yıllık kesintisiz geçmiş = büyüme kanıtı" varsayımı bu veriyle doğrulanmadı.
