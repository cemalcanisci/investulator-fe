# YGGYO — Yeni Gimat GYO — Temettü Büyümesi Veri Derlemesi (4. Tur)

**Kesim tarihi:** 2026-11-10. **Kapsam:** Bu rapor **sınıflandırma (A/B/C/D) üretmez** — önceki 3 turda derlenmiş `dividendHistory`'nin nominal/reel/USD büyüme hesabını ve sürdürülebilirlik sentezini içerir. Final A/B/C/D kararı merkezi sentezde verilmiştir: **B — Koşullu Aday**, 3 tur boyunca değişmedi (bkz. `dividend-screening-independent-audit-20261110/FINAL_SHORTLIST.md`, `dividend-portfolio-decision-20261110/COMPANY_DECISIONS.md`).

Bu tur hiçbir yeni birincil kaynak araştırması yapmamıştır; önceki 3 turun bulgularını (FY2024 zarar büyüklüğünün 3 kaynakta 3 farklı rakam olduğu, CFO'nun yarısının faiz gelirine bağımlı olduğu, PROEN'in üretimde olduğu) **olduğu gibi aktarmış**, yalnızca merkezi TÜFE/USD-TRY referansıyla (`../_reference/MACRO_REFERENCE.md`, `lookup.cjs`) nominal TL/pay ve toplam nakit tutarlarını reel TL (2026-10 bazlı) ve USD'ye çevirip CAGR hesaplamıştır.

---

## 1. Girdi verisi — kaynak ve 2024'teki iki ayrı kalem

`dividendHistory` (1. turdan, `docs/dividend-screening-20261110/companies/YGGYO.json`) 12 satır içeriyor. 2024 ödeme yılında **iki farklı ve birbirine KARIŞTIRILMAMASI gereken** kalem var:

1. **`profitYear: 2023, paid: false`** — FY2023 kâr yılı için yıllık kâr payı dağıtımı yapılmamasına karar verildi (12.05.2024 KAP bildirimi, haber derlemesi üzerinden). Bu, 11 kâr yılından (2015-2025) **1'inin resmen sıfır** olduğu anlamına gelir — gerçek bir kesintidir, veri eksiği değildir.
2. **`profitYear: null, paid: true, grossPerShareTRY: 3.11, paymentDate: 2024-07-09`** — aynı takvim yılında (2024) ayrı bir **olağanüstü/ara dönem** nakit ödemesi. Hangi yıl kârına veya hangi yedek hesabına ait olduğu **3 araştırma turunda da** birincil KAP metniyle doğrulanamadı.

Bu rapor bu iki kalemi **ayrı tutmuştur**: büyüme serisinde FY2023 satırı sıfır değerle (gerçek kesinti) yer alır, olağanüstü 3,11 TL ödemesi ayrı bir `EXTRAORDINARY` satırı olarak kayıtlıdır ve **hiçbir CAGR hesabına dahil edilmemiştir**. "2024 toplamı" diye birleştirilmiş tek bir büyüme noktası üretilmemiştir.

2016 satırının (`profitYear: 2015`) ödeme tarihi kaynaklarda bulunamadı; YGGYO.md "yaklaşık 2016 baharı" diyor, bu rapor **2016-04-01'i YAKLAŞIK olarak** kullanmış ve `dataQuality`/`paymentDateQuality` alanlarında işaretlemiştir.

---

## 2. FX/TÜFE girdisi

Tüm kur ve TÜFE değerleri `lookup.cjs` çıktısından alınmıştır (başka hiçbir kaynak kullanılmamıştır):

| profitYear | Ödeme tarihi | USD/TRY | TÜFE ayı | Reel çevirme çarpanı (→2026-10) |
|---|---|---|---|---|
| 2015 | 2016-04-01 (yaklaşık) | 2,8169 | 2016-04 | 16,2110 |
| 2016 | 2017-04-11 | 3,6949 | 2017-04 | 14,4909 |
| 2017 | 2018-04-12 | 4,1140 | 2018-04 | 13,0726 |
| 2018 | 2019-04-19 | 5,8199 | 2019-04 | 10,9392 |
| 2019 | 2020-04-07 | 6,7577 | 2020-04 | 9,8608 |
| 2020 | 2021-03-30 | 8,3247 | 2021-03 | 8,5593 |
| 2021 | 2022-04-11 | 14,6646 | 2022-04 | 4,9526 |
| 2022 | 2023-04-11 | 19,2910 | 2023-04 | 3,4468 |
| 2023 | — (dağıtım yok) | — | — | — |
| olağanüstü | 2024-07-09 | 32,9038 | 2024-07 | 1,8717 |
| 2024 | 2025-04-15 | 38,1706 | 2025-04 | 1,4725 |
| 2025 | 2026-04-09 | 44,6381 | 2026-04 | 1,1124 |

---

## 3. Nominal/reel/USD temettü serisi (profitYear bazında)

| profitYear | TL/pay (nominal) | Reel TL/pay (2026-10 bazı) | USD/pay | Toplam nakit (TL) | Toplam nakit (reel TL) | Toplam nakit (USD) |
|---|---|---|---|---|---|---|
| 2015 | 0,837054 | 13,569 | 0,29715 | 90.000.000 | 1.459,0M | 31.950.016 |
| 2016 | 0,91 | 13,187 | 0,24629 | 97.843.200 | 1.417,8M | 26.480.608 |
| 2017 | 1,07 *(teyitsiz)* | 13,988 | 0,26009 | — | — | — |
| 2018 | 0,931 | 10,184 | 0,15997 | 150.151.680 | 1.642,5M | 25.799.701 |
| 2019 | 1,030 | 10,157 | 0,15242 | 166.118.400 | 1.638,1M | 24.582.128 |
| 2020 | 1,030 | 8,816 | 0,12373 | 166.118.400 | 1.421,9M | 19.954.880 |
| 2021 | 1,500 | 7,429 | 0,10229 | 241.920.000 | 1.198,1M | 16.496.870 |
| 2022 | 1,750 | 6,032 | 0,09072 | 423.360.000 | 1.459,3M | 21.945.939 |
| **2023** | **0 (dağıtım yok — gerçek kesinti)** | 0 | 0 | 0 | 0 | 0 |
| *olağanüstü (2024-07-09)* | *3,11 (ayrı kalem, seriye dahil değil)* | *5,821* | *0,09452* | *— (açıklanmadı)* | *—* | *—* |
| 2024 | 7,00 | 10,307 | 0,18339 | 1.693.440.000 | 2.493,5M | 44.365.034 |
| 2025 | 10,55 | 11,735 | 0,23635 | 2.552.256.000 | 2.839,0M | 57.176.628 |

**Not:** 2017 satırı yalnızca ikincil kaynaklı (Midas), 3 turda da birincil KAP/şirket belgesiyle teyit edilemedi; CAGR hesaplarında uç nokta olarak **kullanılmamıştır** (2015, 2020, 2025 doğrulanmış uç noktalar seçilmiştir).

---

## 4. CAGR — pay başına (nominal, reel, USD)

| Dönem | Nominal TL | Reel TL (2026-10 bazı) | USD |
|---|---|---|---|
| 10 yıl (2015→2025) | **+28,84%/yıl** | **-1,44%/yıl** | **-2,26%/yıl** |
| 5 yıl (2020→2025) | **+59,25%/yıl** | **+5,89%/yıl** | **+13,82%/yıl** |
| Sıfır kesintiyi atlayan köprü (2022→2024, 2 yıl) | +100,00%/yıl | +30,72%/yıl | +42,18%/yıl |

**Yorum:** 10 yıllık ufukta pay başına temettü **reel olarak büyümedi** (hafif reel erime, yıllık -%1,44) ve **USD bazında da hafif negatif** (yıllık -%2,26) — 2025'teki 0,236 USD/pay, 2015'teki 0,297 USD/pay seviyesinin hâlâ altında. Nominal TL'deki güçlü 10 yıllık büyüme (+%28,84/yıl) büyük ölçüde TL'nin değer kaybını telafi etmekle sınırlı kaldı. Büyümenin tamamı son 5 yıla (2020-2025), özellikle 2024-2025'teki keskin sıçramaya (7,00 → 10,55 TL) yoğunlaşıyor; bu dönemde reel (+%5,89/yıl) ve USD (+%13,82/yıl) bazda da gerçek büyüme var, ama 2015-2020 arası reel/USD bazda zaten düşüş eğilimindeydi.

## 5. CAGR — toplam nakit (nominal, reel, USD)

| Dönem | Nominal TL | Reel TL | USD |
|---|---|---|---|
| 10 yıl (2015→2025) | +39,72%/yıl | +6,88%/yıl | +5,99%/yıl |
| 5 yıl (2020→2025) | +72,70%/yıl | +14,83%/yıl | +23,43%/yıl |

**Uyarı:** Toplam nakit büyümesi pay başına büyümeden **farklıdır** çünkü dönem içinde bedelsiz sermaye artırımlarıyla (2019 öncesi ve 2022 içindeki 3:2 bedelsiz artırımlar) pay sayısı arttı. Toplam nakit CAGR'ı hem temettü büyümesini hem pay sayısı artışını birlikte yansıtır; tek başına "mevcut bir yatırımcının getiri büyümesi" göstergesi **değildir** — bu amaç için pay başına seri (Bölüm 4) kullanılmalıdır.

---

## 6. Süreklilik ile büyüme — ayrı raporlama

**Süreklilik:** 2015-2025 arası 11 kâr yılından **10'unda** yıllık nakit temettü ödendi, **1'inde (FY2023) resmen ödenmedi** — bu, "her yıl kesintisiz" tezini bozan tek ama somut bir olaydır. Aynı takvim yılında (2024) yapılan ayrı olağanüstü ödeme (3,11 TL), FY2023'ün resmi sıfırını **değiştirmez**; farklı nitelikte, farklı bir mekanizmadır (bkz. Bölüm 1).

**Büyüme:** Kesintiden önceki dönem (2015-2022) nominal olarak sürekli arttı ama reel/USD bazda zaman zaman geriledi (reel TL/pay: 13,57 → 6,03; USD/pay: 0,297 → 0,091, yani 2015-2022 arası reel ve USD bazda net **düşüş**). Kesintiden sonraki dönem (2024-2025) nominal, reel VE USD bazda güçlü büyüme gösterdi — ama bu toparlanma, dağıtılabilir kârın IFRS net kârdan bağımsız davrandığı ve zarar büyüklüğünün kendisinin 3 kaynakta 3 farklı rakam olduğu bir dönemde gerçekleşti (bkz. Bölüm 7).

---

## 7. Sürdürülebilirlik sentezi (GYO'ya özgü yaklaşım)

FY2024 (2024/12 kâr yılı) için IFRS/TMS net kâr **ZARAR** olarak raporlanmasına rağmen Nisan 2025'te 7,00 TL/pay (1,69 milyar TL) nakit temettü ödendi. Bu mekanizma — GYO'larda dağıtılabilir kârın SPK/yasal kayıt bazında belirlenip IFRS net kârdan (TMS 29 net parasal kazanç/kayıp dahil) farklı olması — genel SPK/GYO pratiği olarak **makuldür**, ama YGGYO'ya özel sayısal kanıt (şirketin kendi dağıtılabilir kâr hesap tablosu) **3 turda da birincil kaynaktan doğrulanamadı**.

Zararın **büyüklüğünün kendisi** 3 kaynakta 3 farklı rakam veriyor:
- **−364 milyon TL** — şirketin kendi FY2025 faaliyet raporu, **metin** kısmı
- **−249,45 milyon TL** — aynı FY2025 faaliyet raporu, **tablo** kısmı (şirketin KENDİ belgesi kendi içinde çelişkili)
- **−523 milyon TL** — dış ikincil kaynak (KAP Bildirimi #1693463 referanslı)

Bu çelişki 2. turda (bağımsız denetim) bulunmuş, 3. turda da çözülememiştir; bu rapor yeniden doğrulama yapmamış, olduğu gibi aktarmıştır.

Ayrıca H1 2026 CFO'nun (1.741.774.649 TL) **%47,8'inin (832.423.344 TL) banka mevduat faiz geliri** olduğu birincil tablodan doğrulanmıştır — güçlü nakit üretiminin önemli bir kısmı çekirdek kira işinden değil, şirketin elindeki net nakit pozisyonunun getirdiği faiz gelirinden kaynaklanıyor. Bu, "CFO net kârın 3,8 katı" bulgusunun kalite/süreklilik açısından ilk turda ima edildiğinden daha karma olduğunu gösterir; faiz geliri, net nakit pozisyonu küçülürse veya faiz oranları düşerse azalabilecek bir kalemdir.

**Buna karşılık olumlu faktörler:**
- **%0 stopaj** (GYO statüsü, 2009/14594 BKK ile teyitli) — gerçek kişi yatırımcı için net getiri avantajı.
- **ANKAmall %99,9 doluluk** — talep gören, yerleşik bir varlık.
- **Net nakit pozisyonu**, pratikte borçsuz: H1 2026 +2.475.041.830 TL (31.12.2025: +3.195.851.929 TL); SPK borçlanma sınırı oranı %0,11.
- **2025'ten itibaren yürürlükte olan yasal asgari %50 GYO kâr dağıtım zorunluluğu** (23 Seri No'lu KV Genel Tebliği, RG 28.09.2024) — temettü sürekliliğini kısmen mevzuata bağlıyor; FY2025 payout oranı (%75,01) bu asgarinin belirgin üzerinde.

**PROEN/enerji yatırımı:** Şirket, %100 bağlı ortaklığı PROEN Yenilenebilir Enerji A.Ş. üzerinden büyük ölçekli sermaye tahsisi yapıyor (Ağrı/Eleşkirt'te güneş santralleri). 2. turda PROEN'in solar tesislerinin (Ayaş, Ağrı/Eleşkirt) inşa halinde değil **Şubat 2025'ten itibaren üretimde** olduğu teyit edilmiştir — ama iddia edilen 750 milyon TL sermaye büyüklüğü muhtemelen YGGYO'nun kendi tavan sermayesiyle karıştırılmıştır ve doğrulanamamıştır. Bu, GYO'nun "pasif kira geliri" profilinden bir sermaye tahsisi kaymasıdır ve hem çeşitlendirme potansiyeli hem de iş modeli netliğini bulanıklaştıran bir risk olarak kalmaktadır.

**GYO'ya özgü yaklaşım:** Payout oranı IFRS net kâr üzerinden değil, mümkün olduğunca şirketin yasal/SPK bazlı dağıtılabilir kâr rakamı üzerinden okunmalıdır (bu raporda yalnızca FY2025 için bu oran mevcuttur, %75,01). TMS 29 net parasal kazanç/kayıp kalemi nominal TL karşılaştırmalarını farklı yıllarda farklı satın alma gücü bazlarına taşıyabileceği için çok yıllı nominal özkaynak/kâr serisi doğrudan karşılaştırılmamıştır.

---

## 8. Kanıt güvenilirliği (bölüm bazlı)

| Bölüm | Güven | Gerekçe |
|---|---|---|
| `dividendHistoryConfidence` | **Orta** | 2015-2022 ve 2024-2025 profitYear'ları için ödeme tarihi/tutarı sağlam; 09.07.2024 olağanüstü ödemenin tam niteliği 3 turda da doğrulanamadı; FY2017 tutarı (1,07 TL) yalnızca ikincil kaynaklı, teyitsiz. |
| `cashFlowConfidence` | **Orta/Düşük** | CFO'nun %47,8'i faiz geliri (çekirdek iş dışı); FY2024 net zarar büyüklüğü 3 kaynakta 3 farklı rakam, ikisi şirketin kendi raporunun kendi içinde çelişkili — dağıtılabilir kâr mekanizmasının sayısal temeli belirsiz. |
| `riskAssessmentConfidence` | **Orta** | Tek varlık/tek şehir yoğunlaşması değişmedi; otel kapanışının niteliği netleşti (2025'te %50 kapasite, tam kapanma yalnızca Ocak 2026'dan ve mevzuat zorunluluğu nedeniyle) ama kesin açılış tarihi hâlâ yok; PROEN üretimde ama sermaye büyüklüğü doğrulanamadı; NAD çelişkisi çözülmedi. |

---

## 9. En kritik açık maddeler (devralınan, bu turda çözülmedi)

1. FY2024 IFRS net zarar büyüklüğü — 3 kaynakta 3 farklı rakam (−364M / −249,45M / −523M TL).
2. 09.07.2024 olağanüstü 3,11 TL/pay ödemesinin tam niteliği/kaynağı.
3. FY2017 temettü tutarı (1,07 TL iddiası) — OCR gerektiren PDF, teyitsiz.
4. PROEN'in gerçek sermaye büyüklüğü (750M TL iddiası muhtemelen YGGYO'nun kendi tavan sermayesiyle karışmış).
5. NAD/net aktif değer kaynak çelişkisi — çözülmedi.

---

## 10. Kaynaklar

- `docs/dividend-screening-20261110/companies/YGGYO.json` + `YGGYO.md` (1. tur)
- `docs/dividend-screening-independent-audit-20261110/AUDIT.md`, `CASHFLOW.md`, `RISK_REVIEW.md`, `DATA_GAPS.md`, `FINAL_SHORTLIST.md` (2. tur, yalnızca YGGYO bölümleri)
- `docs/dividend-portfolio-decision-20261110/COMPANY_DECISIONS.md`, `UNRESOLVED_ISSUES.md` (3. tur, yalnızca YGGYO bölümü)
- `docs/dividend-growth-screening-20261110/_reference/MACRO_REFERENCE.md` + `lookup.cjs` (bu tur, ortak TÜFE/USD-TRY referansı — bu oturumda ayrıca hiçbir kur/TÜFE verisi aranmamıştır)

**Genel doğrulama durumu:** `PARTIAL` — bu dosya yeni birincil kaynak araştırması yapmamıştır; önceki 3 turun bulgularını aktarıp FX/TÜFE dönüştürmesi ve CAGR hesabı eklemiştir. Sınıflandırma (A/B/C/D) bu raporun kapsamı dışındadır.
