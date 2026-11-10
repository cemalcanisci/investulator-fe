# DOAS (Doğuş Otomotiv) — Temettü Büyüme Hesabı (4. Tur)

**Kesim tarihi:** 2026-11-10. **Kapsam:** Bu, önceki üç turun (screening, bağımsız denetim, portföy kararı) **devamıdır**. Bu çalışma A/B/C/D sınıflandırması YAPMAZ — yalnızca temettü geçmişini temizler ve nominal/reel/USD büyüme serisini hesaplar. Final kategori kararı bu belgenin dışında, merkezi bir sentez oturumunda verilecektir. Alım/satım önerisi veya hedef fiyat içermez.

**Kaynaklar:** `docs/dividend-screening-20261110/companies/DOAS.{json,md}`, `docs/dividend-screening-independent-audit-20261110/{AUDIT,CASHFLOW,RISK_REVIEW,DATA_GAPS,FINAL_SHORTLIST}.md` (DOAS bölümleri), `docs/dividend-portfolio-decision-20261110/{COMPANY_DECISIONS,UNRESOLVED_ISSUES}.md` (DOAS bölümü), `_reference/MACRO_REFERENCE.md` + `_reference/lookup.cjs` (ortak TÜFE/USD-TRY referansı).

---

## 1. Temettü geçmişi (temizlenmiş, taksit bazında)

Kaynak JSON'daki "/" ile ayrılmış çok taksitli satırlar (2021, 2022, 2023, 2024, 2026) `DOAS.md`'nin (1. tur, Bölüm 2) ayrıntılı tablosu okunarak kendi ödeme tarihi ve kendi tutarıyla ayrı taksitlere çözüldü. 2017 ve 2020 ödeme yapılmadı (gerçek kesinti, veri eksikliği değil), seride sıfır olarak tutuldu.

**Pay birimi notu:** Pay sayısı 2010'dan beri sabit (220.000.000 adet); 2016-2026 döneminde bölünme/bedelsiz sermaye artırımı yok (DOAS.md Bölüm 2'de doğrulandı) — TUPRS'taki gibi bir split-normalizasyonu gerekmedi, tüm yıllar doğrudan karşılaştırılabilir.

**Yıl etiketi notu (önemli):** Seri `profitYear` değil **`paymentYear`** (ödeme yılı) bazında tutuldu, çünkü bazı ödeme yılları birden fazla kâr yılına ait taksit içeriyor ve kaynak bu ayrıştırmayı kesinleştirememiş (NEEDS_REVIEW): 2022 (profitYear 2021 + muhtemelen FY2022 avansı), 2023 (profitYear 2022 final + muhtemelen FY2023 avansları), 2024 (FY2023 final + açıkça FY2024 avansı — bu ikisi KESİN karışık), 2025 (FY2024 final, 2024'teki avans mahsup edilerek). profitYear bazında toplamlaştırma çift sayıma yol açacağından bu çalışma yapılmadı; kendi profitYear tahminimiz de üretilmedi (2019 ödemesinin profitYear'ı kaynakta `null`, burada da `null` bırakıldı).

| Ödeme Yılı | Ödendi mi | Taksit(ler) | Brüt TL/pay | Toplam Nakit (TL) | Not |
|---|---|---|---:|---:|---|
| 2016 | Evet | 2016-04-11 | 1,3636 | 300.000.008 | profitYear 2015; ikincil kaynak, NEEDS_REVIEW |
| 2017 | **Hayır** | — | 0 | 0 | profitYear 2016; gerçek kesinti, çok kaynaklı doğrulandı |
| 2018 | Evet | 2018-05-29 | 0,65 | 143.000.000 | profitYear 2017; dağıtım oranı ~%78, ikincil kaynak |
| 2019 | Evet | 2019-12-04 | 0,6136 | 134.999.964 | profitYear **null** — FY2018 nihai mi FY2019 mı belirsiz, çözülemedi |
| 2020 | **Hayır** | — | 0 | 0 | profitYear 2019; gerçek kesinti (pandemi), çok kaynaklı doğrulandı |
| 2021 | Evet | 2021-04-29 (1.) | 1,3636 | 300.000.000 | profitYear 2020 |
| 2021 | Evet | 2021-07-14 (2.) | 1,3636 | 300.000.000 | profitYear 2020 |
| 2021 | — | **Toplam** | **2,7272** | **600.000.000** | CFO bu yıl temettüyü 4,78x karşılıyor (final, bkz. Böl. 4) |
| 2022 | Evet | 2022-04-12 (1.) | 5,6818 | 1.250.000.000 | profitYear 2021 |
| 2022 | Evet | 2022-11-16 (2.) | 4,0909 | 899.999.980 | profitYear 2021 (2. taksit kısmen FY2022 avansı OLABİLİR, kesinleşmedi) |
| 2022 | — | **Toplam** | **9,7727** | **2.149.999.980** | **ÇÖZÜLMEMİŞ ÇELİŞKİ: bağımsız denetim bu yılın birincil nakit akış tablosunda fiilen ödenen temettüyü 1.935.000.000 TL olarak bulmuş** (bkz. Böl. 4) |
| 2023 | Evet | 2023-04-10 (1.) | 9,0909 | 1.999.999.980 | profitYear 2022 final (muhtemelen) |
| 2023 | Evet | 2023-08-28 (2.) | 11,3636 | 2.499.999.986 | FY2022 veya FY2023 avansı, kesinleşmedi |
| 2023 | Evet | 2023-11-28 (3.) | 5,6818 | 1.249.999.996 | FY2022 veya FY2023 avansı, kesinleşmedi |
| 2023 | — | **Toplam** | **26,1363** | **5.749.999.962** | 3 taksitli yıl; FCF bu yılın temettüsünün yalnızca ~%11'ini karşılıyor (final, bkz. Böl. 4) |
| 2024 | Evet | 2024-04-24 (1.) | 40,9091 | ~9.000.000.000 | **FY2023 FİNAL dağıtımı** (kesin) |
| 2024 | Evet | 2024-09-04 (2.) | 10,00 | ~2.200.000.000 | **FY2024 AVANSI** (kesin, yıl kapanmadan ödendi) |
| 2024 | — | **Toplam** | **50,9091** | **~11.200.000.000** | Taksit tutarları DOAS.md'de yaklaşık (~); iki farklı kâr yılı karışık |
| 2025 | Evet | 2025-05-22 | 27,2727 | 6.000.000.000 | FY2024 final (toplam karar 8,2 mlyr − 2,2 mlyr avans mahsubu = net 6,0 mlyr); FY2024'ün GERÇEK toplamı 37,2727 TL/pay'dır (10,00+27,2727), çift saymaktan kaçınmak için bu satır FY2024 toplamına EKLENMEDİ |
| 2026 | Evet | 2026-04-15 (1.) | 15,00 | 3.300.000.000 | profitYear 2025 |
| 2026 | Evet | 2026-08-17 (2.) | 15,00 | 3.300.000.000 | profitYear 2025 |
| 2026 | — | **Toplam** | **30,00** | **6.600.000.000** | FY2025 net kârının (3,14 mlyr) ~2,1 katı; yönetim "geçmiş yıl kârlarından ilave" yaptığını açıkça duyurdu |

## 2. Reel TL ve USD bazında büyüme (bu turun asıl katkısı)

Önceki üç turda hiçbir zaman hesaplanmamıştı (1. tur, screening Bölüm 9: "Reel TL ve USD bazlı temettü büyüme serisi bu çalışmada üretilmedi... MISSING_DATA, kasıtlı olarak uydurulmadı"). Bu tur, `_reference/lookup.cjs` çıktısını (TÜİK TÜFE, baz ay **2026-10**; Yahoo Finance USD/TRY) kullanarak her taksiti ayrı ayrı deflate/çevirip ödeme yılı bazında topladı.

| Ödeme Yılı | Nominal (TL/pay) | Reel (TL/pay, 2026-10 satın alma gücü) | USD/pay |
|---|---:|---:|---:|
| 2016 | 1,3636 | 22,1053 | 0,482119 |
| 2017 | 0 (gerçek sıfır) | 0 | 0 |
| 2018 | 0,65 | 8,3616 | 0,142539 |
| 2019 | 0,6136 | 6,2419 | 0,106852 |
| 2020 | 0 (gerçek sıfır) | 0 | 0 |
| 2021 | 2,7272 | 22,4418 | 0,325451 |
| 2022 | 9,7727 | 44,5764 | 0,609521 |
| 2023 | 26,1363 | 76,9719 | 1,100419 |
| 2024 | 50,9091 | 100,7804 | 1,549939 |
| 2025 | 27,2727 | 39,5535 | 0,698472 |
| 2026 | 30,00 | 32,3556 | 0,648506 |

**CAGR (10 yıl, paymentYear 2016→2025, ikisi de pozitif, standart hesap):**
- Nominal: **%39,51/yıl** (1,3636 → 27,2727 TL)
- Reel (2026-10 bazlı): **%6,68/yıl** (22,1053 → 39,5535 TL)
- USD: **%4,21/yıl** (0,482119 → 0,698472 USD)

**Önemli bulgu — enflasyon yanılsaması (AKSA ve TUPRS turlarıyla aynı örüntü):** Nominal TL'de pay başı temettü 9 yılda ~20 kat büyümüş görünüyor (%39,5/yıl bileşik). Ama aynı dönemde reel satın alma gücü yalnızca %6,7/yıl, USD değeri yalnızca %4,2/yıl büyümüş. İkisi de pozitif ama nominal rakamın altıda-dokuzda biri kadar — görünen "büyük büyüme"nin büyük kısmı TL'nin enflasyon/değer kaybıdır.

**Son 5 yıl (standart 2021→2025, ikisi de pozitif):**
- Nominal: **%77,83/yıl** (2,7272 → 27,2727 TL) — büyük ölçüde 2022-2023 döngüsel kârlılık boom'unu yansıtıyor.
- Reel: **%15,22/yıl** (22,4418 → 39,5535 TL)
- USD: **%21,04/yıl** (0,325451 → 0,698472 USD) — 2022-2023 boom'un USD bazında da gerçek olduğunu destekliyor.

**2017/2020 sıfırlarını köprüleyen (bridging) karşılaştırmalar (standart CAGR başlangıç/bitiş noktası olarak KULLANILMADI, yalnızca bilgi için):**
- **2016→2018 (2017'yi köprüleyen, 2 yıl):** Nominal %-30,97/yıl (1,3636 → 0,65 TL) — kesinti sonrası ilk toparlanma önceki seviyenin yarısında kaldı.
- **2019→2021 (2020'yi köprüleyen, 2 yıl):** Nominal %+110,82/yıl (0,6136 → 2,7272 TL) — kesinti sonrası hızlı ve güçlü toparlanma.

**İkinci önemli bulgu — son iki ödeme yılında reel/USD gerileme, nominal artışa rağmen:** 2024'ten 2025'e ve 2025'ten 2026'ya, nominal tutar yönü farklı (2024→2025: düşüş 50,91→27,27; 2025→2026: artış 27,27→30,00) ama **reel ve USD bazda İKİ ÖDEME YILI ÜST ÜSTE (2025 VE 2026) gerilemiştir**: reel 100,78 → 39,55 → 32,36 TL; USD 1,5499 → 0,6985 → 0,6485. Yani 2026'daki nominal "artış" (+%10) satın alma gücü veya USD değeri olarak gerçek bir artış değil, tam tersine gerilemenin sürdüğünü gizliyor.

## 3. Süreklilik ile büyüme — ayrı sorular, ayrı cevaplar

**Süreklilik:** 2016-2026 arası 11 ödeme yılının **9'unda ödeme yapıldı, 2'sinde yapılmadı** (2017, 2020). Kesintilere verilen tepki SİMETRİK DEĞİL: 2020 kesintisinin ardından 2021'de hızlı ve tam bir dönüş oldu (önceki ödenen yılın ~2 katı, tek yılda); 2017 kesintisinin ardından 2018'deki dönüş yalnızca önceki seviyenin yarısında kaldı (0,65 vs 1,3636 TL) ve tam toparlanma 2021-2022'ye kadar sürmedi.

**Büyüme (ödenen yıllar arasında, süreklilikten AYRI):** Nominal büyüme çarpıcı ama büyük ölçüde enflasyon yanılsaması (yukarıya bak). Reel/USD büyüme 10 yıllık ortalamada pozitif ama mütevazı (%4-7/yıl) VE **son iki ödeme yılı üst üste (2025, 2026) reel/USD bazda gerilemiştir** — tam da nominal tutarın (2026'da) arttığı sırada.

**Üçüncü ayrı soru — büyümenin KALİTESİ (nakit akışı/kârla desteklenip desteklenmediği):** Bağımsız denetim turu (bkz. Bölüm 4), güncel dönemde ödenen temettünün CFO/kârı aştığını ve bunun en az FY2022'den (TMS29-tutarlı bazda) itibaren tekrarlayan bir desen olduğunu bulmuştur — "süreklilik var" ve "nominal büyüme var" bulgularının HİÇBİRİ bu bulguyu değiştirmez; üçü birbirinden bağımsız eksenlerdir ve bu rapor onları tek bir cümlede birleştirmemiştir.

## 4. Sürdürülebilirlik sentezi (önceki 3 turdan, yeniden araştırma YAPILMADI)

*Kaynak: `DOAS.md`/`DOAS.json` (1. tur, Böl. 2-5, 9-10), `CASHFLOW.md`/`RISK_REVIEW.md`/`DATA_GAPS.md`/`FINAL_SHORTLIST.md` (2. tur, bağımsız denetim), `COMPANY_DECISIONS.md`/`UNRESOLVED_ISSUES.md` (3. tur, portföy kararı).*

- **Sistematik CFO hatası düzeltildi:** Bağımsız denetim turu, ilk tarama turunun DOAS için **"ara toplam ile final CFO toplamını karıştırdığını"** bulmuştur — gerçek (final) CFO rakamları çok daha düşük. 2021 gerçekten güçlü (final CFO 3.268.796 bin TL, temettüyü **4,78x** karşılıyor). Ama **2022 (TMS29@Dec2023 bazında, final CFO 1.995.524 bin TL) FCF NEGATİF**; **2023 (final CFO 2.610.116 bin TL) fiilen ödenen temettünün yalnızca ~%10,9'unu** karşılıyor. İlk turun "2021-2023 CFO 1,5x-3x karşılıyor, disiplinli dönem" iddiası **YANLIŞ/ABARTILIYDI** — gerçek bozulma 2022'den itibaren başlamış, 2024-2025 bunun şiddetlenmiş hâli, yeni bir olgu değil.
- **FY2025 CFO negatif iken temettü ödendi:** İşletme faaliyetlerinden nakit akışı **-12.810.000 bin TL (NEGATİF, ikincil kaynaklı)** iken 6,0 milyar TL nakit temettü ödenmiş (Mayıs 2025).
- **2026 ödemesi kârın ~2,1 katı:** 2026'da ödenen toplam temettü (6,6 milyar TL), FY2025 net kârının (3,14 milyar TL) **~%210'u**. Yönetim bunu "dönem karının yanı sıra geçmiş yıllar karlarından da ilave" yaparak açıkça duyurmuştur.
- **Kredi notu indirimi:** JCR Avrasya, 20 Mayıs 2026'da ulusal uzun vadeli notu **A+(tr)'den A(tr)'ye** indirmiştir (görünüm Stabil); üç bağımsız haber kaynağıyla teyitli, zamanlama kârlılık/nakit akışı bozulmasıyla örtüşüyor.
- **TÜVTÜRK satışı:** DOAS, TÜVTÜRK Kuzey/Güney'deki %33,333'lük payının (tarihsel kâr katkısının ~%16'sı) satışı için Ekim 2026'da niyet mektubu imzalamış, bedel henüz netleşmemiş — kalıcı bir kâr/nakit akışı kaynağının elden çıkarılması riski.
- **ÇÖZÜLMEMİŞ çelişkiler (yeniden hesaplama YAPILMADI, olduğu gibi aktarılıyor):** (a) 2022'de fiilen ödenen temettü: 2,15 mlyr TL (per-share×pay sayısı türevi) vs 1,935 mlyr TL (bağımsız denetimin birincil nakit akış tablosunda bulduğu rakam); (b) FY2024 net kâr: 9,94 vs 7,5 mlyr TL; (c) FY2024 FAVÖK: 16,7 vs 24,15 mlyr TL (muhtemelen TMS29 yeniden ifade farkı); (d) FY2023 CFO/CAPEX ve FY2024/2025 tam yıl CAPEX hiçbir turda birincil kaynaktan tam doğrulanamadı — `doas-fr2024-eng.pdf` gerçek bir PDF değil, bir Cloudflare bot-koruma HTML sayfası olduğu bağımsız denetimde ortaya çıktı.

## 5. Kanıt güvenilirliği (bölüm bazlı)

Kanıt güvenilirliği düşük olması **şirketin finansal kalitesinin düşük olduğu anlamına GELMEZ** — bu ikisi ayrı eksenlerdir ve burada ayrı raporlanır. DOAS'ta özel durum: ikisi de olumsuz ama **nedenleri farklı** — güvenilirlik sorunu bir ERİŞİM sorunu (dogusotomotiv.com.tr 3 turda da 403/Cloudflare ile erişilemedi), kalite sorunu ise erişilebilen verinin KENDİSİNİN olumsuz olması (negatif CFO, payout aşımı, kredi notu indirimi — gerçek bulgular, veri eksikliği değil).

- **Temettü geçmişi kanıtı: Orta.** Tarih/tutarlar (2021-2026) birden fazla bağımsız ikincil kaynak + iç aritmetik tutarlılıkla (pay×220M≈toplam) teyitli. Ama 2016-2020 kâr yılı ataması tamamen ikincil, 2019'un kâr yılı belirsiz, 2022 toplam tutarında ÇÖZÜLMEMİŞ bir çelişki var ve birincil KAP hiçbir turda okunamadı.
- **Nakit akışı kanıtı: Düşük.** İlk tur sistematik bir hata yapmıştı (düzeltildi). Düzeltilmiş veriyle bile FY2023 CFO/CAPEX kısmen eksik, FY2024 CFO tamamen erişilemedi, FY2024 net kâr/FAVÖK çözülmemiş çelişki taşıyor, FY2025 tam yıl CAPEX bulunamadı. Bu, bağımsız denetimin DOAS'ı 10 şirket arasında **"en zayıf B"** olarak nitelendirmesinin doğrudan nedenidir.
- **Risk değerlendirmesi kanıtı: Orta.** Kredi notu indirimi ve net borç yörüngesi birden fazla bağımsız haber kaynağıyla teyitli. Döviz borç payı, vade kompozisyonu ve TÜVTÜRK satış bedeli MISSING_DATA.

## 6. Veri eksikleri

1. **2022'de fiilen ödenen temettü tutarı çelişkisi** (2,15 mlyr TL per-share türevi vs 1,935 mlyr TL birincil nakit akış tablosu) — bağımsız denetim turunda YENİ bulundu, ÇÖZÜLEMEDİ.
2. **FY2024 net kâr/FAVÖK çelişkisi** (9,94 vs 7,5 mlyr TL; 16,7 vs 24,15 mlyr TL) — birincil kaynak (`doas-fr2024-eng.pdf`) bir Cloudflare bot-koruma sayfası, gerçek PDF değil.
3. **FY2023 CFO/CAPEX tam serisi ve FY2024/2025 tam yıl CAPEX** — birincil kaynaktan hiçbir turda tam doğrulanamadı.
4. **2021-2022 net kâr/FAVÖK** — büyük ölçüde ikincil/aggregator kaynaklı.
5. **2016-2020 dönemi için kâr yılı ataması** — ikincil kaynaklardan türetildi, resmi KAP "kar payı dağıtım tablosu" hiçbir turda doğrudan okunamadı; 2019 ödemesinin kâr yılı bu çalışmada da `null` bırakıldı.
6. **TÜVTÜRK satış bedeli** — niyet mektubu aşamasında, henüz kamuya açıklanmadı.
7. **Döviz borç payı ve vade kompozisyonu** — birincil dipnot kaynağından hiçbir turda okunmadı.
8. **TÜFE (hakedis.org ikincil derleme) ve USD/TRY (Yahoo Finance) kaynaklarının birincil kaynaklarla (TÜİK portalı, TCMB) çapraz doğrulanması** — tüm 10 şirket için ortak, DOAS'a özel olmayan bir sınırlama (MACRO_REFERENCE.md).

## 7. Not — bu çalışmanın sınırı

Bu belge **sınıflandırma (A/B/C/D) yapmaz**, alım/satım önerisi veya hedef fiyat üretmez. Sağladığı yeni bilgi, önceki üç turda hesaplanmamış reel TL ve USD bazlı pay başı temettü büyüme serisidir; bu, "nominal büyüme çarpıcı ama çoğu enflasyon yanılsaması" ve "son iki ödeme yılında (2025, 2026) reel/USD bazda üst üste gerileme — tam da nominal tutarın (2026'da) arttığı sırada" bulgularını sayısal olarak ortaya koyar. Bu, bağımsız denetimin bulduğu sistematik CFO hatası düzeltmesi ve FY2025 negatif CFO/aşırı payout bulgusuyla birleştiğinde, DOAS'ın "disiplinli geçmiş" anlatısının gerek nakit akışı gerek büyüme kalitesi tarafında zayıfladığını gösteriyor. Final kategori kararı, bu bulguların önceki B ("en zayıf B") değerlendirmesini nasıl etkilediğine merkezi sentez oturumunda karar verilecektir.
