# ISMEN (İş Yatırım Menkul Değerler A.Ş.) — Temettü Büyüme Hesabı (4. Tur)

**Kesim tarihi:** 2026-11-10. **Kapsam:** Bu, önceki üç turun (screening, bağımsız denetim, portföy kararı) **devamıdır**. Bu çalışma A/B/C/D sınıflandırması YAPMAZ — yalnızca temettü geçmişini derler ve nominal/reel/USD büyüme serisini hesaplar. Final kategori kararı bu belgenin dışında, merkezi bir sentez oturumunda verilecektir. Alım/satım önerisi veya hedef fiyat içermez.

**Kaynaklar:** `docs/dividend-screening-20261110/companies/ISMEN.{json,md}`, `docs/dividend-screening-independent-audit-20261110/{AUDIT,CASHFLOW,RISK_REVIEW,DATA_GAPS,FINAL_SHORTLIST}.md` (ISMEN bölümleri), `docs/dividend-portfolio-decision-20261110/{COMPANY_DECISIONS,UNRESOLVED_ISSUES}.md` (ISMEN bölümü), `_reference/MACRO_REFERENCE.md` + `_reference/lookup.cjs` (ortak TÜFE/USD-TRY referansı).

**Sektöre özgü uyarı (3 turda da korunan karar, bu turda yeniden sorgulanmadı):** ISMEN bir aracı kurumdur; klasik CFO/CAPEX/FCF modeli bu iş koluna uygun değildir (faaliyetlerden nakit akışı müşteri varlıkları/kendi menkul kıymet pozisyonundaki değişimden masif etkilenir). Bunun yerine payout oranı + özkaynak/asgari sermaye eşiği tamponu + ROE kullanılır. Gerçek düzenleyici sermaye yeterliliği oranı (SPK Seri V No:34) **2 bağımsız turda da aranıp bulunamadı** — bu dosya bunu yeniden doğrulamaya ÇALIŞMADI, aktarıyor.

---

## 1. Ödeme tarihi yaklaşıklığı — yöntemsel not

Görev talimatı, gerçek ödeme tarihi bulunamazsa "BIST GK takviminin olağan ayını (Mart sonu-Nisan) kullanarak o yılın **1 Nisan**'ını yaklaşık tarih kabul et" demektedir. **Bu dosyada bilinçli bir sapma yapıldı:** `ISMEN.md` (1. tur) her yıl için zaten bir KAP **ex-date** (hak kullanım tarihi) belgeliyor, ve bu tarihler **Mart sonu ile Mayıs sonu arasında** değişiyor — örneğin 2022 ex-date 2022-05-24, 2023 ex-date 2023-05-26, 2024 ex-date 2024-05-29 (üçü de Nisan'dan haftalarca sonra). Genel "1 Nisan" varsayılanını bu yıllara zorlamak, zaten elde olan daha spesifik bilgiyi göz ardı edip FX/TÜFE sorgusunda haftalar/aylar mertebesinde ek hata üretirdi (özellikle 2022-2023 gibi yüksek TL volatilitesi dönemlerinde, ayda tek başına %5-10 kur hareketi olabiliyordu).

Bunun yerine: **her yıl için zaten belgelenmiş gerçek ex-date, FX/TÜFE sorgusunun ankoru olarak kullanıldı**, `dataQuality: "ESTIMATED_DATE"` ile açıkça işaretlendi (gerçek NAKİT ödeme tarihi ex-date'ten muhtemelen 1-3 iş günü sonradır ve hâlâ teyitsizdir). Yalnızca **profitYear 2025** (ödeme 2026-04-03) için gerçek ödeme tarihi KAP'tan kesin teyitlidir (`CONFIRMED`).

## 2. Pay-birimi kırılması — yöntemsel not

ISMEN 2015-06-08'den 2023-07-19'a kadar **355.000.000 pay** ile sabit sermayeliydi. 2023-07-19'da **%322,54 bedelsiz sermaye artırımı** ile sermaye **1.500.000.000 paya** çıktı (SPK onayı 2023-07-13) — bu artırım, 2023 kâr yılının ödemesinden (2023-05-26, hâlâ 355M pay bazında) ~2 ay **SONRA** gerçekleşti. Bu yüzden profitYear 2015-2022 ödemeleri 355M pay bazında, profitYear 2023-2025 ödemeleri 1,5B pay bazındadır.

Karşılaştırılabilirlik için 2015-2022 ham tutarları **÷4,225352** (=1.500.000.000/355.000.000) ile 1,5B-pay-eşdeğerine çevrildi; 2023-2025 zaten bu bazda, çevrim gerekmedi. Toplam nakit tutarları (`totalCashTRY`) bu çevrimden **etkilenmez** (toplam nakit pay sayısından bağımsızdır).

## 3. Temettü geçmişi (temizlenmiş, 1,5B-pay-eşdeğeri bazında)

| Kâr yılı | Ödeme tarihi (kullanılan) | Tarih kalitesi | Brüt TL/pay (1,5B-eşd.) | Net TL/pay (1,5B-eşd.) | Toplam nakit (TL) | Payout oranı |
|---|---|---|---:|---:|---:|---:|
| 2015 | 2016-03-28 | ESTIMATED (ex-date) | 0,023998 | 0,020401 | null | — (profit yok) |
| 2016 | 2017-03-28 | ESTIMATED (ex-date) | 0,030009 | 0,025489 | null | — (profit yok) |
| 2017 | 2018-03-28 | ESTIMATED (ex-date) | 0,073333 | 0,062338 | null | — (profit var, toplam nakit yok) |
| 2018 | 2019-03-27 | ESTIMATED (ex-date) | 0,059995 | 0,051002 | 90.000.000 | %42,70 (dağıtılabilir kâr tabanına göre) |
| 2019 | 2020-03-24 | ESTIMATED (ex-date) | 0,093341 | 0,079331 | 140.000.000 | %38,50 (dağıtılabilir kâr tabanına göre) |
| 2020 | 2021-03-31 | ESTIMATED (ex-date) | 0,236667 | 0,213000 | 355.000.000 (türetilmiş) | ~%37,69 (DÜŞÜK GÜVEN, ikisi de yaklaşık) |
| 2021 | 2022-05-24 | ESTIMATED (ex-date, **Mayıs**) | 0,267433 | 0,239033 | 401.150.000 (türetilmiş) | %34,26 |
| 2022 | 2023-05-26 | ESTIMATED (ex-date, **Mayıs**) | 0,504100 | 0,452033 | 756.150.000 (türetilmiş) | %17,45 |
| 2023 | 2024-05-29 | ESTIMATED (ex-date, **Mayıs**) | 1,070000 | 0,960000 | 1.605.000.000 (türetilmiş) | %28,97 |
| 2024 | 2025-03-28 | ESTIMATED (ex-date) | 5,666667 | 4,816667 | 8.500.000.000 (**2 bağımsız kaynaktan teyitli**) | **%154,37 (ANOMALİ)** |
| 2025 | 2026-04-03 | **CONFIRMED** | 3,166667 | 2,690000 | 4.750.000.000 (**2 bağımsız kaynaktan teyitli**) | %54,18 |

**Süreklilik:** 2015-2025 arası **11/11 kâr yılında kesintisiz** ödeme — 2018 (kur şoku) ve 2020 (pandemi) dahil, bu iki "kriz" yılı aracı kurum için kâr **artışı** dönemleri olmuştur (bkz. bölüm 6). Bu, talimatın belirttiği gibi büyümeden **ayrı, kusursuz** bir eksendir.

**2024 kâr yılı (%154 payout) anomalisi — 2. turun bulduğu kısmi açıklama (bu turda yeniden araştırılmadı, aktarılıyor):** 8,5 milyar TL'nin **%5,1'i (~298,2 milyon TL)** geçmiş yıl kârları havuzundan karşılandığı teyitli; ama **~2,67 milyar TL hâlâ açıklanamıyor** (muhtemelen solo/istatutory kâr dağıtılabilir tabanı, tam KAP genel kurul kâr dağıtım tutanağı bulunamadı).

## 4. Reel TL ve USD bazında büyüme (bu turun asıl katkısı)

Önceki üç turda hiçbir zaman hesaplanmamıştı. Bu tur, `_reference/lookup.cjs` çıktısını (TÜİK TÜFE, baz ay **2026-10**; Yahoo Finance USD/TRY) kullanarak her yılı deflate/çevirdi.

| Kâr yılı | Nominal (TL/pay, 1,5B-eşd.) | Reel (TL/pay, 2026-10 satın alma gücü) | USD/pay |
|---|---:|---:|---:|
| 2015 | 0,023998 | 0,392096 | 0,008367 |
| 2016 | 0,030009 | 0,440556 | 0,008210 |
| 2017 | 0,073333 | 0,976543 | 0,018272 |
| 2018 | 0,059995 | 0,667411 | 0,011183 |
| 2019 | 0,093341 | 0,928364 | 0,014260 |
| 2020 | 0,236667 | 2,025521 | 0,028719 |
| 2021 | 0,267433 | 1,286285 | 0,016613 |
| 2022 | 0,504100 | 1,736997 | 0,025243 |
| 2023 | 1,070000 | 2,101235 | 0,033167 |
| 2024 | 5,666667 | **8,593971** | **0,149136** |
| 2025 | 3,166667 | 3,522163 | 0,071081 |

**CAGR (10 yıl, profitYear 2015→2025, standart hesap, tüm değerler pozitif):**
- Nominal: **%62,94/yıl** — düşük başlangıç bazı (2015'te 0,024 TL) etkisiyle şişirilmiş, dikkatle okunmalı.
- Reel (2026-10 bazlı): **%24,54/yıl** — ÖNEMLİ BULGU: bu, AKSA'nın ("reel büyüme YOK") veya TUPRS'ın ("reel büyüme pozitif ama ~%2/yıl, çok küçük") bulgularından FARKLI — ISMEN'de reel büyüme hem pozitif HEM büyüktür.
- USD: **%23,85/yıl** — reel TL CAGR'ına çok yakın (iki yöntemin birbirini doğrulaması, iç tutarlılık kontrolü).

**Düşük-baz etkisi kontrolü (2015-2023, anomali/düzeltme yıllarını dışarıda tutan 8 yıllık pencere):**
- Nominal: %60,73/yıl; Reel: **%23,34/yıl**; USD: **%18,79/yıl**.
- 8 yıllık ve 10 yıllık pencerelerin reel/USD CAGR'ları birbirine yakın çıkması (24,5 vs 23,3; 23,9 vs 18,8), bu güçlü reel büyüme bulgusunun **2025'in tek yıllık anomalisine bağımlı olmadığını**, altta yatan bir eğilim olduğunu gösteriyor.

**ÇOK ÖNEMLİ UYARI — aşırı volatilite:** CAGR uç noktaya hassastır ve burada YANILTICI OLABİLİR, çünkü yıllık değişim son derece oynaktır:

| Geçiş | Reel YoY | USD YoY |
|---|---:|---:|
| 2015→2016 | +%12,4 | -%1,9 |
| 2016→2017 | +%121,7 | +%122,6 |
| 2017→2018 | -%31,7 | -%38,8 |
| 2018→2019 | +%39,1 | +%27,5 |
| 2019→2020 | +%118,2 | +%101,4 |
| 2020→2021 | -%36,5 | -%42,2 |
| 2021→2022 | +%35,0 | +%52,0 |
| 2022→2023 | +%21,0 | +%31,4 |
| 2023→2024 | **+%309,0** (anomali) | **+%349,7** (anomali) |
| 2024→2025 | **-%59,0** (düzeltme) | **-%52,3** (düzeltme) |

**Medyan yıllık değişim (CAGR'dan daha az uç-değere duyarlı bir "tipik yıl" göstergesi):** Reel **%28,0/yıl**, USD **%29,5/yıl** — her iki CAGR penceresine de yakın, yani medyan ve CAGR aynı yöne (güçlü pozitif) işaret ediyor, ama ARALIK çok geniştir (-%59 ile +%309/+%350 arası). Bu, "istikrarlı büyüyen temettü" tanımına uymuyor — "büyük ama son derece oynak büyüyen temettü" daha doğru bir tanımdır.

**Toplam nakit temettü (TL) büyümesi (2018-2025, 2015-2017 null olduğu için 8 veri noktası, 7 periyot):**
- Nominal: %76,19/yıl (90M → 4.750M TL); Reel: %26,82/yıl (1.001M → 5.284M TL, 2026-10 bazında); USD: %30,23/yıl (16,8M → 106,6M USD).
- Reel/USD büyüklükleri pay başına seriyle (2015-2025, %24,5/%23,9) yakın çıkıyor — iç tutarlılık işareti (pay sayısı sadece bir kez, bilinen bir faktörle değiştiği için beklenen bir sonuç).

## 5. Büyüyen TEMETTÜ ≠ İstikrarlı PAYOUT — görev talimatının özellikle vurguladığı ayrım

Payout oranı 11 yılda **%17,5 ile ~%154 arasında** salınmıştır — hiçbir sabit kurala uymuyor. AMA bu veri seti şunu gösteriyor: **temettü gerçekten ve güçlü biçimde büyümüştür** (reel ~%23-29/yıl, pencereye göre), çünkü:

1. **Altta yatan KÂR büyümüştür** (FY2021 ana ortaklık net kârı 1,17 mr TL → FY2025 8,77 mr TL, ~7,5x nominal, 4 yılda) — temettü büyümesi büyük ölçüde kâr büyümesini takip ediyor, sabit bir payout kuralını değil.
2. **Payout oranının KENDİSİ öngörülemez**: 2023 ödemesi (FY2022 kârına karşı) en düşük payout (%17,5) olduğu yıl, kâr 4,3 kat büyümüştü; 2025 ödemesi (FY2024 kârına karşı) en yüksek payout (%154) olduğu yıl, kâr önceki yıla göre neredeyse SABİT kalmıştı (5.539.762.000 → 5.506.137.000 TL) — payout oranı ile kâr büyümesi arasında TUTARLI bir ilişki YOKTUR, yönetim kurulu/genel kurul kararına bağlı görünüyor.
3. **Sonuç:** Bir yatırımcı "ISMEN'in temettüsü büyüyor" diyebilir (veri bunu doğruluyor, reel/USD dahil) AMA "ISMEN'in payout politikası istikrarlı/öngörülebilir" diyemez (veri bunu DOĞRULAMIYOR, aksine çürütüyor). Bu iki önerme BİRBİRİNE KARIŞTIRILMAMALIDIR.

## 6. Sürdürülebilirlik sentezi (önceki 3 turdan, yeniden araştırma YAPILMADI)

*Kaynak: `ISMEN.md`/`ISMEN.json` (1. tur, böl. 1, 4-5), `CASHFLOW.md`/`RISK_REVIEW.md`/`DATA_GAPS.md`/`FINAL_SHORTLIST.md` (2. tur, bağımsız denetim), `COMPANY_DECISIONS.md`/`UNRESOLVED_ISSUES.md` (3. tur, portföy kararı).*

- **Sektöre özgü yaklaşım (3 turda da korunan karar):** Klasik CFO/CAPEX/FCF modeli bu iş koluna uygun değildir — faaliyetlerden nakit akışı müşteri varlıkları/kendi menkul kıymet pozisyonundaki dönemsel değişimden masif etkilenir. Bunun yerine payout oranı + özkaynak/asgari sermaye eşiği tamponu + ROE kullanılır.
- **ROE:** %20,69 (kötümser, FY2024 dönem-sonu özkaynak bazlı) — %34,68 (iyimser, FY2023 dönem-sonu özkaynak bazlı) aralığında, baz/TTM senaryosu **%21,38** — **2. turda bağımsızca doğrulandı** (şirketin kendi H1 2026 sunumuyla birebir).
- **Özkaynak tamponu:** Özkaynak (35.252.706.000 TL, 2026/6), "Geniş Yetkili" aracı kurum asgari özsermaye eşiğinin (380.000.000 TL, 2026/6) **~93 katı** — bu **DOLAYLI ve TÜRETİLMİŞ** bir tampon oranıdır, gerçek düzenleyici sermaye yeterliliği oranının (SPK Seri V No:34) **KENDİSİ DEĞİLDİR**. Bu oran **2 bağımsız turda da (1. tur + 2. turun bağımsız denetimi) aranmış ve BULUNAMAMIŞTIR**.
- **Volatilite-pozitif iş modeli:** 2018 kur şokunda net kâr +%41 (~221,7 mr TL), 2020 pandemide +%146 (~942 mr TL) ve günlük işlem hacmi ~23x artış — her iki kriz döneminde kâr **artışı**, bankacılık net faiz marjı/kredi riski mantığının TERSİ bir dayanıklılık profili.
- **Komisyon ayrıştırması (2. turun ek bulgusu):** Aracılık %57 + Portföy Yönetimi %41 + Kurumsal Finansman %2 = 5.648.465 bin TL, "Faiz/Alım-Satım/Finansal Yatırım" kaleminden (11.658.915 bin TL) AYRI (H1 2026). Önceki turlarda hiç ayrıştırılamamıştı, bu turda KISMEN çözüldü.
- **Nominal≠gerçek büyüme uyarısına somut kanıt (2. turun bulgusu):** H1 2026'da nominal net kâr +%1 iken TAS29-düzeltmeli gerçek kâr **−%35** düşmüştür — bu dosyanın genel reel/USD bulgusunu (10 yıllık pencerede pozitif) GÜÇLENDİRMEZ ama en güncel çeyreklik veri noktasının NEGATİF olduğunu gösterir, izlenmesi gereken bir sinyal.

## 7. Kanıt güvenilirliği (bölüm bazlı)

Kanıt güvenilirliği düşük olması **şirketin finansal kalitesinin düşük olduğu anlamına GELMEZ** — bu iki eksen ayrıdır ve burada ayrı raporlanır.

- **`dividendHistoryConfidence` — Orta/Düşük (bölünmüş):** Ödeme olgusu (11/11 yıl, kesinti yok) **Yüksek** — 3 turda da teyitli. Gerçek ödeme TARİHLERİ **Düşük** — 10/11 yılda ex-date yaklaşık tarih olarak kullanıldı (ESTIMATED_DATE), yalnızca 2025 teyitli. Tutarlar **Orta** — 2015-2017'de toplam nakit tamamen yok; 2018/2019/2024/2025 iki bağımsız kaynaktan teyitli; 2020-2023 türetilmiş (pay×pay-sayısı), birincil kâr dağıtım tablosuyla ayrıca doğrulanmamış.
- **`cashFlowConfidence` — farklı çerçeve (CFO modeli bu şirkette uygulanamaz):** ROE kanıtı **Yüksek** (TTM %21,38, 2. turda bağımsızca doğrulandı). Özkaynak tamponu (~93x) kanıtı **Orta** — rakamın kendisi (özkaynak, asgari eşik) birincil mali tablodan güvenilir, ama bu TÜRETİLMİŞ bir oran, gerçek düzenleyici CAR'ın yerine geçmez.
- **`riskAssessmentConfidence` — Düşük, özellikle sermaye yeterliliği boyutunda, ve bu DÜŞÜK güven GEÇİCİ DEĞİL:** Gerçek düzenleyici sermaye yeterliliği oranı **2 tamamen bağımsız turda da (1. tur + 2. turun bağımsız denetimi) aranmış ve hiçbir kaynaktan bulunamamıştır** — bu "henüz toplanamadı" değil, "muhtemelen SPK'ya özel raporlanıyor ve kamuya hiç açıklanmıyor" türünden **KALICI** bir şeffaflık riskidir (FINAL_SHORTLIST.md: "sermaye yeterliliği oranı hiçbir zaman görülemeyebilir"). Diğer risk kalemleri (rekabet/sıfır komisyon baskısı, pazar payı) **Orta** — şirketin kendi yatırımcı sunumlarına dayanıyor, bağımsız TSPB/BIST verisiyle hiçbir turda çapraz doğrulanmadı.

## 8. Veri eksikleri

1. **Gerçek nakit ödeme tarihleri** — 10/11 yılda (2015-2024) hiçbir turda KAP'ın birincil ödeme bildirimiyle teyit edilemedi; ex-date yaklaşık tarih olarak kullanıldı (talimatın genel "1 Nisan" varsayılanından daha spesifik ama hâlâ kesin değil). FX/TÜFE sorgusunun tarihi birkaç iş günü hatalı olabilir.
2. **2015-2017 toplam nakit temettü tutarı** — hiçbir turda bulunamadı, null bırakıldı (uydurulmadı). Toplam nakit büyüme serisi 8 veri noktasıyla (2018-2025) sınırlı.
3. **FY2015-2019 (kısmen FY2020) ana ortaklık net kâr serisi** — yalnızca FY2017 (~221,7M) ve FY2020 (~942M) biliniyor, ikisi de "~" yaklaşık. Bu yıllar için payout oranı hesaplanamıyor.
4. **Gerçek düzenleyici sermaye yeterliliği oranı (SPK Seri V No:34)** — 2 bağımsız turda da aranıp bulunamadı. **KALICI eksik**, araştırmayla kapanması beklenmemelidir.
5. **2025 ödemesinin (%154 payout) ~2,67 milyar TL'lik hâlâ açıklanamayan kısmı** — 2. tur yalnızca %5,1'ini (geçmiş yıl kârı) açıklayabildi; tam KAP genel kurul kâr dağıtım tutanağı gerekiyor.
6. **TÜFE (hakedis.org ikincil derleme) ve USD/TRY (Yahoo Finance) kaynaklarının birincil kaynaklarla (TÜİK portalı, TCMB) çapraz doğrulanması** — tüm 10 şirket için ortak, ISMEN'e özel olmayan bir sınırlama.

## 9. Not — bu çalışmanın sınırı

Bu belge **sınıflandırma (A/B/C/D) yapmaz**, alım/satım önerisi veya hedef fiyat üretmez. Sağladığı yeni bilgi, önceki üç turda hesaplanmamış reel TL ve USD bazlı pay başı temettü büyüme serisidir. Üç bulgu özetle: (1) ISMEN'de kusursuz süreklilik (11/11 yıl) İLE gerçek, güçlü reel/USD büyüme (~%23-29/yıl, düşük-baz etkisi kontrol edildi) BİRLİKTE görülüyor — bu, AKSA/TUPRS'tan farklı, nispeten olumlu bir sayısal profil. (2) Ama bu büyüme son derece oynak bir yoldan geçiyor (yıllık -%59 ile +%309/+%350 arası) ve payout oranı (%17,5-%154) öngörülebilir değil — "büyüyen temettü" ile "istikrarlı payout" AYNI ŞEY DEĞİLDİR, bu veri setinde net biçimde ayrışıyor. (3) Gerçek sermaye yeterliliği oranının kalıcı olarak görülememesi, büyüme bulgusunun güvenilirliğini değil ama sürdürülebilirlik değerlendirmesinin TAMLIĞINI sınırlıyor. Final kategori kararı, bu bulguların önceki B değerlendirmesini nasıl etkilediğine merkezi sentez oturumunda karar verilecektir.
