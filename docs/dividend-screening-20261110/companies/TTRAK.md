# TTRAK — Türk Traktör ve Ziraat Makineleri A.Ş. — Temettü Odaklı Eleme Araştırması

**Kesim tarihi:** 2026-11-10, `Europe/Istanbul`. **Bu çalışma bir alım tavsiyesi veya hedef fiyat raporu DEĞİLDİR.** Amaç: TTRAK'ın 10-15 yıllık temettü/temettü büyümesi odaklı bir BIST portföyünde **çekirdek (A)**, **koşullu (B)**, **uygun değil (C)** ya da **veri yetersiz (D)** aday olup olmadığına dair gerekçeli bir eleme kararı.

**Investulator uygulamasındaki mevcut TTRAK verisi** (`investulator-fe/src/data/research/ttrak-*.json`, `outputs/research-ttrak-20261029/`) bu çalışmanın **başlangıç referansıdır, bağımsız doğrulama sayılmaz**. O oturum (2026-10-29) TTRAK'ın 30.09.2026 tarihli birincil mali tablosunu (SPK formatlı PDF), şirketin kendi temettü/sermaye artırım sayfalarını ve KAP'ı fiilen okumuş; bu çalışma o oturumun birincil-kaynak okumalarını (bilanço kalemleri, 9A2026 gelir tablosu, borç dipnotu) **yeniden doğrulamadan** referans almış, ama **2016-2025 temettü geçmişi, 2021-2025 nakit akışı/payout, FY2025 tam yıl sonuçları ve temettü dağıtmama kararı gibi bu eleme çalışmasına özgü alanları bağımsız olarak yeniden araştırmıştır** (aşağıdaki Kaynaklar bölümüne bakınız). Önceki oturumda sayısal adil değer senaryosu üretilmemişti (üçü de BLOCKED); bu çalışma da bir adil değer/hedef fiyat üretmemektedir — kapsam dışıdır.

---

## 1. İş modeli

Türk Traktör, Türkiye'nin pazar lideri traktör/zirai makine üreticisidir; **New Holland** ve **Case IH** markalarıyla Ankara ve Erenler (Sakarya) fabrikalarında 50-95 HP aralığında traktör üretir, yurt içi satış yapar ve ihracat eder (başta İtalya, Fransa, Almanya). Yıllık üretim kapasitesi ~54.000 adet; 2025'te gerçekleşen üretim 25.833 adet (~%48 kapasite kullanımı, son iki yılda ciddi düşüş).

**Ortaklık yapısı — kilit nokta:** Şirket **Koç Holding A.Ş. (%37,5)** ile **CNH Industrial'ın Avusturya kolu, CNH Österreich GmbH (%37,5)** arasında 1998'de kurulmuş bir ortak girişimdir; kalan **%25 halka açık**. İki ana ortak **eşit oy hakkına** sahip — tek bir hakim ortak yok, müşterek kontrol. Bu yapı iki bağımsız kaynakta (WebSearch özet + borsa.doviz.com) tutarlı.

**CNH Industrial ilişkisi iki yönlüdür:** CNH hem **%37,5 ortak** hem de **münhasır lisans vereni**dir — Türk Traktör, New Holland/Case IH markalarını ve know-how'ı bu lisans **sayesinde** kullanabiliyor; lisans olmadan bu markalar altında üretim yapılamaz (WebSearch, çoklu kaynak). Bu, hem güçlü bir **hendek** (global teknolojiye erişim, marka gücü) hem de bir **bağımlılık riski**dir (lisans/royalti ilişkisinin şartları değişirse ya da yenilenmezse — bu oturumda böyle bir riskin gerçekleştiğine dair kanıt YOK, ama ilişkili taraf dipnotunun (Not 23) royalti tutarları bu oturumda da detaylı okunmadı, bkz. Bölüm 9).

**Pazar liderliği:** TTRAK, Türkiye traktör pazarında **19 yıl üst üste** lider; pazar payı yıldan yıla %38-46 aralığında (2024: %46,2; 2025: %38,4 — düşüş, pazar küçülürken rekabetin yoğunlaştığına ya da ürün miksi etkisine işaret edebilir, bu oturumda nedeni ayrıştırılmadı).

**Kredi derecelendirmesi:** JCR Avrasya, 29.09.2026'da TTRAK'ın derecesini **AAA(tr)'den AA(tr)'ye düşürdü** — zayıflayan kârlılık/nakit akışı görünümünün bir yansıması.

---

## 2. 2016-2025 temettü tablosu

Tüm tutarlar **nominal TL**, o tarihteki ödenmiş sermayeye göre pay başına. 06.06.2023'teki %87,5 bedelsiz artırımdan (sermaye 53.369.000 → 100.066.875 TL) ÖNCEKİ ödemeler eski (düşük) pay sayısına göredir; bu rapor **bedelsiz-düzeltmesi yapılmamış (ham, tarihindeki) pay başına tutarları** gösterir, karşılaştırma yaparken bu dikkate alınmalı.

| Ödeme tarihi | Kâr yılı | Brüt TL/pay | Net TL/pay | Net/Brüt (örtük stopaj) | Toplam nakit (TL) | Not |
|---|---|---|---|---|---|---|
| 01.04.2016 | 2015 | 5,62 | 4,78 | %85 | ~300.000.000 | |
| 03.04.2017 | 2016 | 4,68 | 3,98 (bkz. not) | %85 | 250.000.000 | Bir ikincil kaynak net 4,22 veriyor (%90) — **çelişki, çözülmedi**, 85%'lik oran diğer tüm yıllarla tutarlı olduğu için tercih edildi |
| 21.03.2018 | 2017 | 5,62 | 4,78 | %85 | 300.000.011 | |
| — | 2018 | **0** | **0** | — | **0** | **2019'da temettü ÖDENMEDİ** — 2018 TL kur krizi (Ağustos 2018) sonrası kârlılık/nakit temkinliliği ile ilişkilendiriliyor (doğrudan şirket gerekçesi bu oturumda bulunamadı, bağlamsal çıkarım) |
| 20.03.2020 | 2019 | 1,87 | 1,59 | %85 | 100.000.000 | **Seri içindeki en düşük tutar** — Mayıs 2019'da Ziraat Bankası'nın traktör kredisi taban faizini %12'den %18'e çıkarması sonucu zayıflayan talep/kârlılıkla (net marj %2,9) ilişkilendiriliyor |
| 25.03.2021 | 2020 | 15,93 | 14,34 | %90 | 850.000.000 | Stopaj oranı bu dönemde %10'a düşmüş görünüyor |
| 28.03.2022 | 2021 | 22,49 | 20,24 | %90 | 1.200.000.000 | FY2021 net kârı 1,322 milyar TL → **payout ≈%90,8** |
| 10.03.2023 | 2022 | 39,36 | 35,42 | %90 | 2.100.000.000 | FY2022 net kârı 2,971 milyar TL → **payout ≈%70,7** |
| 01.04.2024 (1. taksit) | 2023 | 62,94 | 56,64 | %90 | 6.300.000.000 | FY2023 net kârı 9,342 milyar TL (orijinal, kendi dönem satın alma gücü bazı) |
| 08.11.2024 (2. taksit, Olağanüstü GK) | 2023 (çıkarım) | 26,98 | 24,28 | %90 | 2.700.000.000 | **Profit-year ataması kesin doğrulanamadı** — iki ödeme toplamı (9,0 milyar TL) FY2023 kârının **%96,3**'üne denk geliyor, bu da "aynı yılın kârının iki taksitte dağıtılması" (DOAS'a benzer bir uygulama) olduğunu güçlü şekilde işaret ediyor, ama bunu teyit eden açık bir KAP/AGM metni bu oturumda bulunamadı — **Veri eksikleri**'nde not edildi |
| 02.04.2025 | 2024 | 48,47 | 41,20 | %85 | 4.850.000.000 | Stopaj %10→%15 (21-22.12.2024 tarihli 9286 sayılı Cumhurbaşkanı Kararı, **şirkete özgü değil, ülke çapında vergi değişikliği**). FY2024 net kârı 5,74 milyar TL (orijinal, Dec-2024 satın alma gücü) / 7,514 milyar TL (FY2025 raporundaki Dec-2025 PP'ye yeniden ifade edilmiş karşılaştırmalı rakam) → **payout ≈%84,5 (orijinal bazda) / %64,5 (yeniden ifade bazda)** — iki rakam birbirini **yalanlamıyor**, TMS29 yeniden ifade farkı (bkz. Bölüm 4) |
| — | 2025 | **0** | **0** | — | **0** | **FY2025 kârından (statüsel dağıtılabilir kâr 454.804.634 TL) temettü dağıtılmaması 2026 GK'da kararlaştırıldı**, tamamı olağanüstü yedeklere aktarıldı — **bu bir tahmin değil, doğrulanmış bir şirket kararı** (Forbes Türkiye + çoklu haber kaynağı, şirketin kendi 2025 Faaliyet Raporu'na atıfla) |

**Büyüme okuması (nominal, dikkatli yorumlanmalı):** 2016-2018 döneminde pay başına net temettü ~4,78-4,78 TL bandında sabit; 2019'da sıfıra düşüp 2020'de 1,59 TL'ye (seri dibi) inmiş; 2021-2024 arasında **14,34 → 41,20 TL'ye** (nominal ~%187 büyüme, 3 yılda) hızla artmış; 2025'te yeniden **sıfıra** düşmüş. Bu, klasik bir **döngüsel temettü profili**dir — sürekli/düzenli büyüyen bir "temettü aristokrat" örüntüsü DEĞİL, güçlü yıllarda yüksek payout + zayıf yıllarda tam kesinti örüntüsü. Nominal TL büyüme rakamları Türkiye'nin yüksek enflasyonu nedeniyle **reel büyümeyi doğrudan yansıtmaz**; bu oturumda nominal tutarlar TÜFE ile reel TL'ye veya USD'ye (kur tarihi belirtilerek) sistematik olarak çevrilmemiştir — bu bir **veri eksiğidir** (Bölüm 9).

---

## 3. Süreklilik / büyüme değerlendirmesi

**Süreklilik:** 2016-2025 arası 10 takvim yılının **8'inde** nakit temettü ödenmiş, **2'sinde** (2019 ve 2026 — sırasıyla FY2018 ve FY2025 kârlarından) **sıfır** ödeme olmuştur. Bu, "her yıl kesintisiz ödeme" standardına uymayan ama "**ciddi bir makro/sektörel şokta temettüyü kesip, şok geçince güçlü şekilde geri getiren**" bir disiplinli-döngüsel profildir. 2018-2019 kesintisi sonrası şirket 2020-2024 arasında payout'u istikrarlı şekilde yükseltmiş (bkz. Bölüm 4) ve **2024'te aynı takvim yılı içinde iki kez** (toplam ~9,0 milyar TL, FY2023 kârının ~%96'sı) dağıtım yapacak kadar agresif bir "güçlü yılın kârını dağıt" politikası izlemiştir.

**Döngüsellik sektörün doğal özelliği mi, şirkete özgü mi?** Türkiye traktör pazarı, çiftçi finansmanı faiz oranına ve devlet sübvansiyon politikasına yüksek hassasiyet gösteriyor: 2019 daralması (Ziraat Bankası kredi faizi %12→%18) ve 2025-2026 daralması (2025'te pazar **%36** küçüldü, 2026 9 ayında ek **%44** küçüldü) her ikisi de **makro/politika kaynaklı**, TTRAK'a özgü bir operasyonel sorun değil. Bu, **sektörün doğal döngüselliği** olarak okunmalı; görev talimatındaki "tek yıllık zarar otomatik C anlamına gelmez" ilkesi burada geçerli — ama şu anki durum **tek bir zarar yılı değil**, art arda **iki kötü yıl** (FY2025: kâr -%94, FY2026 9A: zarara dönüş) olduğundan, 2018-2019 tekil-şokundan daha **uzun soluklu ve derin** bir daralmadır; bu fark Bölüm 10'daki kategoriye yansıtılmıştır.

---

## 4. 2021-2025 nakit akışı / payout analizi

**Önemli metodolojik not (TMS 29):** Türkiye'de TMS 29 (yüksek enflasyon muhasebesi) IFRS raporlaması için **ilk kez 31.12.2023 kapanışında** zorunlu uygulanmıştır. Bu yüzden **FY2021-FY2022 rakamları nominal (TMS29-öncesi) TL**, **FY2023'ten itibaren rakamlar TMS29 ile yeniden ifade edilmiş**tir — bu iki grup **doğrudan büyüme yüzdesi olarak karşılaştırılamaz** (CLAUDE.md: "TMS 29 satın alma gücü bazı sessizce eşitlenmez"). Ayrıca her yılın kendi faaliyet raporu önceki yılı KENDİ yayım tarihinin satın alma gücüne yeniden ifade ettiği için, "FY2023 kârı" rakamı kaynağa göre **9,342 milyar TL** (FY2023 raporunun kendi, Dec-2023 bazı) veya **13,49 milyar TL** (FY2024 raporundaki karşılaştırmalı, Dec-2024 bazına yeniden ifade edilmiş) olarak görülebilir — ikisi de "doğru", sadece farklı satın alma gücü tarihinde. Bu rapor, her yılın **kendi orijinal (ilk yayım) bazındaki** rakamını esas almıştır.

| Yıl | Net kâr (orijinal bazda, milyar TL) | CFO (milyar TL) | CAPEX (milyar TL) | FCF (milyar TL) | O yıl kârından ödenen temettü (milyar TL, bir sonraki yıl) | Payout | Temettü/CFO |
|---|---|---|---|---|---|---|---|
| 2021 | 1,322 | 0,886 | bulunamadı | bulunamadı | 1,200 | %90,8 | **%135** (temettü CFO'yu AŞTI) |
| 2022 | 2,971 | 6,827 | 2,3 | 4,6 | 2,100 | %70,7 | %30,8 |
| 2023 | 9,342 | 14,272 | 1,6 | 12,7 | 9,000 (2 taksit) | %96,3 | %63,0 |
| 2024 | 5,74 (orij.) / 7,514 (yeniden ifade) | 6,223 | 5,0 | 2,1 | 4,850 | %84,5 / %64,5 | %77,9 |
| 2025 | 0,455 (statüsel) / ~0,565 (IFRS, önceki oturumun özkaynak tablosu çıkarımı) | 9 aylık kısmi veri (1,914, tam yıl bulunamadı) | tam yıl bulunamadı (şirket 2025 capex rehberliğini 75-90M USD'ye revize etti) | 9A2025: **−0,724** (negatif) | **0** | **%0** | N/A |

**Kaynak ve güvenilirlik notu:** CFO/CAPEX/FCF rakamları **ikincil, toplulaştırılmış kaynaklardan** (TradingView, Investing.com üzerinden WebSearch) alınmıştır; bu oturumda şirketin kendi nakit akış tablosundan birincil doğrulama yapılmamıştır ve tam hesap bazı (TMS29 yeniden ifade uygulanmış mı) doğrulanmamıştır — **CONFLICT/belirsizlik** olarak işaretlenmiştir (Bölüm 9).

**Yorum:** 2021'de temettü kendi yılın işletme nakit akışını aşmış (muhtemelen önceki yıl nakit rezervlerinden ya da farklı bir zamanlamadan finanse edilmiş); 2022-2023'te CFO temettüyü bolca karşılamış (güçlü yıllar); 2024'te oran sıkılaşmış (%78); 2025'te CFO'nun (en azından 9 aylık kesiti) zayıflaması ve FCF'nin **negatife** dönmesiyle şirket temettüyü **tamamen durdurmuştur** — bu, nakit akışı sinyaline **duyarlı, disiplinli** bir dağıtım politikası okumasını destekler (aşırı borçlanıp temettü ödemeye devam etme davranışı YOK), ama aynı zamanda **sürdürülebilir temettü kapasitesinin şu an gerçekten zayıf** olduğunu da doğrudan gösterir.

---

## 5. Finansal dayanıklılık

**Net borç yörüngesi (yıl sonu, nominal/kendi-dönem bazında):**

| Dönem | Net borç (TL) | Not |
|---|---|---|
| FY2021 sonu | **−0,43 milyar** (net NAKİT) | Döngünün önceki tepesinde güçlü bilanço |
| FY2023 sonu | **−8,17 milyar** (net NAKİT, zirve) | Rekor kâr yılının (9,34 milyar TL) ardından |
| FY2024 sonu | **+0,91 milyar** (net BORÇ, çok küçük) | Net nakitten net borca geçiş başlıyor |
| FY2025 sonu | **+8,7 milyar** (net BORÇ) | **Tek yılda** net nakit-net borç dengesi ~9,6 milyar TL kötüleşti |
| 30.09.2026 (ara dönem) | **+7,98 milyar** (net BORÇ) | FY2025 sonuna göre hafif iyileşme — ama bu iyileşme **stok eritmesinden** (tek seferlik, sürdürülemez nakit kaynağı) geliyor, operasyonel iyileşmeden değil (önceki Investulator oturumunun 30.09.2026 mali tablo okumasına dayanır) |

Bu, görev talimatındaki "net borç ~8,0 milyar TL" referansını **bağımsız olarak doğrulamaktadır** (Forbes Türkiye'nin FY2025 haberiyle çapraj kontrol edildi: 8,7 milyar TL FY2025 sonu → 7,98 milyar TL 30.09.2026, aynı düşüş yönünde tutarlı).

**Net borç/FAVÖK:** FY2025 sonu için net borç (8,7 milyar) / FAVÖK (5,0 milyar, Forbes) ≈ **1,74x** — sanayi şirketi için tek başına alarm verici değil, ama **FY2023 sonunda net nakit, FY2025 sonunda 1,74x kaldıraç** — yörünge (trend) çok hızlı kötüleşmiş. 30.09.2026 için normalize/TTM FAVÖK bu oturumda **üretilmedi** (önceki oturumun da aynı sınırlamayı taşıdığı, gerçek bir TTM rekonstrüksiyonu yapılmadığı not edilmişti) — zorlama bir yıllıklaştırma yapılmamıştır, bu alan **veri eksiği** olarak işaretlidir.

**FAVÖK kaynak çelişkisi (çözülmedi):** İkincil kaynaklar FY2023 FAVÖK'ü için **13,193 milyar TL** (bir arama sonucu) ile **18,89 milyar TL** (başka bir arama sonucu, FY2024 raporunun karşılaştırmalı/yeniden ifade rakamı olabilir) arasında çelişkili değerler veriyor. Bu **CONFLICT** olarak bırakılmıştır, zorla tek bir sayıya indirilmemiştir.

**Döviz borç dağılımı (30.09.2026, önceki oturumun birincil dipnot okumasına dayanır):** Kısa vadeli banka kredilerinin **tamamı TL** (ağırlıklı ortalama efektif faiz **%33,79**, yüksek); uzun vadeli kredi **19,5 milyon EUR, %5,35 faizle** (ucuz, ama görece küçük); 31.12.2025'teki 2,01 milyar TL'lik uzun vadeli TL kredi 30.09.2026'da tamamen kapatılmış. **Sonuç: döviz kuru riski sınırlı, ama Türkiye'nin yüksek politika faizi ortamı TL fonlama maliyetini doğrudan ve ağır şekilde vuruyor.**

**Likidite:** Nakit ve benzerleri FY2025 sonu 8,34 milyar TL'den 30.09.2026'da 5,15 milyar TL'ye düşmüş — kısmen borç geri ödemesi, kısmen operasyonel zarar finansmanı.

**Geçmiş döngü davranışı (talimatta istenen 2015-2016/2019 emsali):** 2018-2019 TL kur krizi döneminde şirket temettüyü (FY2018 kârından) **tamamen kesmiş**, FY2019 kârından **minimum düzeyde** (seri dibi, 1,59 TL/pay net) ödemiş, sonra **2020-2024 arasında payout'u istikrarlı şekilde yeniden yükseltmiştir**. Bu, şu anki (FY2025-FY2026) kesintinin de **geçmişte benzer bir model izleyerek geri dönebileceğine** dair somut bir **emsal** sunuyor — ama garanti değil; 2025-2026 daralması (pazar −%36, ardından −%44) büyüklük olarak 2019'dan (tek yıl, Ziraat kredi faizi şoku) daha **derin ve çok yıllı**.

---

## 6. Büyüme / rekabet avantajı

- **Pazar liderliği:** 19 yıl üst üste pazar lideri, pay %38-46 aralığında.
- **CNH Industrial lisans/teknoloji erişimi:** New Holland/Case IH markaları ve know-how'a münhasır erişim — küçük/orta ölçekli yerli rakiplerin kolayca kopyalayamayacağı bir marka/teknoloji hendeği. Royalti/lisans bedelinin büyüklüğü bu oturumda **kantitatif olarak doğrulanmadı** (ilişkili taraf dipnotu, Not 23, içerik olarak okunmadı).
- **İhracat çeşitlendirmesi — döngüsellik tamponu:** 2026 9 ayında yurt içi satış **−%51** iken ihracat **+%13** artmış; İtalya, Fransa, Almanya gibi pazarlara satış, iç talep çöküşünün etkisini **kısmen** dengeliyor. Bu, TTRAK'ı tek pazara (Türkiye) bağımlı rakiplerden ayıran somut bir avantaj.
- **Kapasite/operasyonel kaldıraç — çift taraflı kılıç:** 54.000 adet/yıl kapasiteye karşı 2025'te 25.833 adet üretim (~%48 kullanım) — talep toparlanırsa marjlar **hızla** iyileşebilir (sabit maliyetli üretimde operasyonel kaldıraç ters yönde de çalışır), ama bu oturumda toparlanmanın zamanlaması/ölçeği **öngörülemedi**.
- **Yönetişim:** Koç Holding + CNH'nin eşit (%37,5-%37,5) oy hakkı, tek bir hakim ortağın keyfi karar almasını sınırlayan bir "check and balance" yapısı — genel olarak pozitif bir kurumsal yönetim sinyali, ama kriz anında iki ortağın anlaşamaması riski **bu oturumda ne kanıtlandı ne de çürütüldü** (spekülatif, açık soru).

---

## 7. Yapısal riskler (10-15 yıllık ufuk)

1. **Tarımsal sübvansiyon/kredi politikası riski — EN BELİRGİN, iki kez gerçekleşmiş:** Türkiye'nin politika faizi ve çiftçi finansmanı koşulları traktör talebini doğrudan ve güçlü şekilde etkiliyor (2019 ve 2025-2026 daralmaları). Bu risk 10-15 yıl boyunca **tekrar tekrar** ortaya çıkması muhtemel bir yapısal/döngüsel özellik, tek seferlik bir olay değil.
2. **CNH lisans bağımlılığı:** Üretim hakkı münhasır lisansa bağlı; lisans ilişkisinin uzun dönemde (10-15 yıl) yenilenmeme/şartların kötüleşmesi riski teorik olarak var, ama bu oturumda bu riskin gerçekleştiğine veya gerçekleşme ihtimaline dair **hiçbir kanıt bulunamadı** — ortaklık 1998'den beri (27+ yıl) sürüyor, uzun bir sadakat geçmişi var.
3. **Elektrikli/otonom tarım makinelerine geçiş:** Görev talimatında özellikle istenen bu risk için bu oturumda **TTRAK'a özgü hiçbir kamuya açık bilgi/stratejik yanıt bulunamadı** — bu, 10-15 yıllık bir temettü tezinin önemli bir **bilinmeyen**i, yokluk kanıt sayılmadı, araştırılamadı olarak işaretlendi (Bölüm 9).
4. **Faiz/döviz riski:** Kısa vadeli TL borcun yüksek maliyeti (%33,79) finansman giderini doğrudan eritiyor; döviz kuru riski görece sınırlı (küçük EUR kredi).
5. **İlişkili taraf yoğunluğu:** Koç + CNH'nin eşit kontrolü, CNH'den alım/royalti, Koç grubu içi işlemler — bu oturumda detaylı/kantitatif incelenmedi, potansiyel (doğrulanmamış) bir izleme riski.

---

## 8. Olumlu / olumsuz kanıtlar

**Olumlu:**
- 19 yıl üst üste pazar liderliği, %38-46 pazar payı.
- 2016-2025 arasında 8/10 yıl nakit temettü ödenmiş; güçlü yıllarda payout %70-96 aralığında yüksek.
- Geçmişte (2018-2019) benzer bir döngüsel şokta temettü kesilip, sonrasında güçlü şekilde geri getirilmiş — somut bir toparlanma emsali var.
- İhracat artışı (+%13, 2026 9A) iç talep çöküşünü kısmen dengeliyor.
- FY2025 temettü kesintisi **nakit akışına duyarlı, disiplinli** bir yönetim kararı (aşırı borçlanıp temettüyü sürdürmeye çalışmamış) — uzun vadeli sermaye disiplini açısından olumlu bir sinyal.
- Net borç/FAVÖK (FY2025 sonu, ~1,74x) tek başına aşırı değil; EUR borcu ucuz ve küçük, kur riski sınırlı.
- Güçlü, dengeli (Koç + CNH, %37,5-%37,5) kurumsal ortaklık yapısı; tek hakim ortak yok.

**Olumsuz:**
- FY2025 (-%94 kâr, temettü sıfır) ve 9A2026 (zarara dönüş) **art arda iki kötü yıl** — 2018-2019'dan daha derin/uzun soluklu bir daralma.
- Net nakitten (FY2021: −0,43 milyar, FY2023: −8,17 milyar) net borca (FY2025: +8,7 milyar) **tek yıl içinde ~9,6 milyar TL** kötüleşen bilanço — hızlı ve büyük bir yörünge değişimi.
- 30.09.2026'daki net borç iyileşmesi büyük ölçüde **stok eritmesinden**, sürdürülemez/tek seferlik bir nakit kaynağından geliyor.
- JCR kredi derecesi düşürüldü (AAA(tr)→AA(tr)).
- Elektrikli/otonom tarım makinelerine geçiş riskine dair şirketin kendi konumu/stratejisi bu oturumda **tespit edilemedi** — 10-15 yıllık ufuk için önemli bir karanlık nokta.
- FY2022-2024 FAVÖK rakamlarında çözülemeyen ikincil kaynak çelişkisi; TTM/normalize FAVÖK ve net borç/FAVÖK bu oturumda üretilemedi.

---

## 9. Veri eksikleri / çelişkiler

Aşağıdakiler **gerçekten denendi** ve bu oturumda tamamlanamadı/çözülemedi:

1. **FY2022-2024 FAVÖK rakamlarında ikincil kaynak çelişkisi** (FY2023 için 13,193 milyar TL vs 18,89 milyar TL) — hangi rakamın doğru/hangi bazda olduğu çözülemedi.
2. **FY2025 tam yıl CFO/CAPEX rakamları bulunamadı** — yalnızca 9 aylık (1,914 milyar TL CFO, −0,724 milyar TL FCF) ve şirketin 2025 capex rehberliği (75-90 milyon USD, gerçekleşen değil) bulunabildi.
3. **08.11.2024 ikinci temettünün hangi kâr/döneme ait olduğu kesin doğrulanamadı** — matematiksel olarak FY2023 kârının ikinci taksiti olması çok kuvvetle muhtemel (toplam %96,3 payout), ama bunu açıkça teyit eden bir KAP/Genel Kurul metni bu oturumda bulunamadı.
4. **İlişkili taraf (Not 23: CNH royalti/lisans bedeli, Koç grubu içi işlemler) tutarları** — dipnotun varlığı önceki oturumda doğrulandı, içeriği bu oturumda da okunmadı/çıkarılmadı.
5. **Elektrikli/otonom tarım makinelerine geçiş konusunda TTRAK'ın kendi pozisyonu/stratejisi** — hiçbir kaynakta bulunamadı; bu konunun gündemde olmaması mı, yoksa bu oturumun arama kapsamının yetersizliği mi olduğu ayrıştırılamadı.
6. **TTM/normalize (döngü-ortası) FAVÖK ve net borç/FAVÖK serisi** — farklı TMS29 satın alma gücü bazlarındaki yıllık rakamlar güvenilir bir ortak baza çevrilip birleştirilemedi; 30.09.2026 için zorlama bir yıllıklaştırma yapılmadı.
7. **Nominal TL temettü büyüme serisinin reel (TÜFE bazlı) veya USD bazlı (kur tarihi belirtilerek) karşılığı** — bu oturumda sistematik olarak hesaplanmadı, yalnızca nominal tutarlar sunuldu.
8. **KAP bildirim taraması bu oturumda ayrıca yapılmadı** — 2026-07-29/2026-10-29 aralığı önceki oturumda `PARTIAL` kapsamla tarandı (bkz. `outputs/research-ttrak-20261029/TTRAK_ARASTIRMA_RAPORU.md`); bu oturum 2026-10-29 ile 2026-11-10 arasına odaklanmadı, önemli bir ek KAP bildirimine rastlanmadı (Ankara Fabrikası modernizasyon yatırım teşvik belgesi onayı dışında — rutin/olumlu, kriz işareti değil).

Kaynağı olmayan hiçbir sayısal değer bu raporda yer almamaktadır; tahmine dayalı ifadeler açıkça "tahmin/çıkarım" olarak işaretlenmiştir.

---

## 10. A/B/C/D değerlendirmesi ve gerekçe

### Kategori: **B — Koşullu aday**

**Gerekçe:**

TTRAK, **A (çekirdek)** için gereken "minimum belirsizlikle 10-15 yıl güvenle elde tutulabilir" standardını şu an karşılamıyor: (i) FY2025-FY2026 daralması art arda iki yılı kapsıyor ve halen derinleşiyor (9A2026 net zarara döndü), (ii) bilanço net nakitten (~−8 milyar TL, FY2023) net borca (~+8-9 milyar TL, FY2025-2026) **tek yılda** sert bir yörünge değişimi yaşadı, (iii) elektrikli/otonom geçiş riski gibi 10-15 yıllık ufku doğrudan ilgilendiren bir konu bu oturumda **tamamen karanlık** kaldı.

Ama **C (uygun değil)** de haksız olur, çünkü: (i) şirket kalitesi güçlü — 19 yıllık pazar liderliği, münhasır CNH teknoloji erişimi, dengeli/güçlü ortaklık yapısı (Koç+CNH), ihracat çeşitlendirmesi; (ii) 2016-2025 arasında 8/10 yıl temettü ödenmiş ve güçlü yıllarda payout %70-96 gibi yüksek seviyelerde — bu "hiç temettü ödeme kültürü olmayan" bir şirket değil; (iii) şirketin **2018-2019'da aynı tür bir şoku yaşayıp sonra güçlü şekilde temettüye geri döndüğü** somut bir emsal var; (iv) FY2025'teki sıfır temettü kararı **zorunlu/acil durum değil, nakit akışına duyarlı disiplinli bir yönetim kararı** — bu, uzun vadede olumlu bir sermaye yönetimi sinyali; (v) 9A2026'daki tek bir ara dönem zararı görev talimatının kendisinin belirttiği gibi otomatik diskalifiye nedeni değil, sektörün doğal döngüselliğinin bir yansımasıdır.

**D (veri yetersiz)** de uygun değil: temel soruyu cevaplamak için gereken veri (temettü geçmişi, payout disiplinini gösteren nakit akışı deseni, bilanço yörüngesi, döngüsellik emsali) **yeterince** toplanabildi; eksik kalanlar (FAVÖK çelişkisi, ilişkili taraf tutarları, elektrikleşme riski) kararı **değiştirecek** değil, kararı **daha hassas hale getirecek** nitelikte eksikler — Bölüm 11'de bunlar "kararı değiştirebilecek gelişmeler" olarak ayrıca listelenmiştir.

**Sonuç:** TTRAK, temettü/temettü büyümesi odaklı 10-15 yıllık bir portföy için **koşullu (B)** bir adaydır — şirket kalitesi ve geçmiş toparlanma kapasitesi gerçek, ama şu anki döngüsel daralmanın derinliği/süresi ve bilanço yörüngesinin ne zaman tersine döneceği belirsiz olduğu için **çekirdek** pozisyon almadan önce aşağıdaki (Bölüm 11) gelişmelerin izlenmesi öneriliyor. **Al/sat tavsiyesi verilmemiştir; bu bir fiyat/değerleme hükmü değildir.**

---

## 11. Kararı değiştirebilecek gelişmeler

**B → A (çekirdek) yönünde güçlendirecek:**
- Türkiye traktör pazarının (ve/veya TTRAK'ın kendi hasılat/kârlılığının) FY2026 tam yılında ya da FY2027'de somut bir toparlanma göstermesi (2018-2019 sonrası 2020-2024'teki gibi).
- Net borç/FAVÖK'ün yeniden düşüşe geçtiğinin (FY2026 tam yıl verisiyle) doğrulanması.
- FY2026 veya FY2027 kârından yeniden temettü dağıtımı kararı (toparlanmanın kalıcı olduğuna dair en güçlü sinyal).
- CNH ile lisans ilişkisinin uzun dönemli (ör. 10+ yıl) yenilendiğine dair açık bir kamuoyu duyurusu.
- Elektrikli/otonom tarım makinelerine geçişte TTRAK'ın kendi somut bir stratejik yanıtının (yatırım, ürün, ortaklık) kamuya açıklanması.

**B → C (uygun değil) yönünde zayıflatacak:**
- FY2026 tam yılının da zararla kapanması VE FY2027'de de toparlanma belirtisi olmaması (üç yıl üst üste zayıflık, 2018-2019'dan çok daha ciddi bir yapısal kırılma işareti).
- Net borç/FAVÖK'ün 3x-4x üzerine çıkacak şekilde sürekli kötüleşmesi.
- JCR'ın derecelendirmeyi yatırım yapılabilir seviyenin altına düşürmesi.
- CNH ile ortaklık/lisans ilişkisinde bir anlaşmazlık, fesih veya yeniden müzakere sinyali.

---

## 12. Kaynaklar ve doğrulama

| # | Kaynak | Tür | Erişim/yayın tarihi | Kullanım | Bağımsızlık notu |
|---|---|---|---|---|---|
| 1 | Türk Traktör kendi kurumsal/IR içeriği (dolaylı — arama sonuçları üzerinden; doğrudan `temettu-odeme-tarihcesi` sayfası bu oturumda 404 verdi) | Birincil (şirket) | 2026-11-10 erişim denemesi | Temettü tarihleri/tutarları çapraz kontrolü | Şirketin kendi verisi, ama bu oturumda doğrudan sayfa açılamadı |
| 2 | Midas (`getmidas.com`) temettü geçmişi sayfası | İkincil | 2026-11-10 | 2016-2025 brüt/net pay başına temettü tablosu | BIST'in 15 dk gecikmeli verisine dayanıyor, ama KAP duyurularını birebir yansıtıyor; diğer haber kaynaklarıyla örtüşüyor |
| 3 | Çoklu finans/haber kaynağı (Ekonomist, Bigpara/Hürriyet, Dünya Gazetesi, Sözcü, Yenisafak, Capital, Investing.com/tr) | İkincil, çoklu bağımsız yayın | 2026-11-10 | Her bir temettü ödemesinin tarih/tutarının çapraz doğrulanması | Farklı yayın gruplarından (Doğan, Türkiye, Sabah grupları vb.) — ortak bir tek kaynağın kopyası DEĞİL, ama hepsi aynı KAP bildirimine atıfla yazıyor (nihai kaynak tek) |
| 4 | Forbes Türkiye — "Türk Traktör 2025 bilançosunu açıkladı" | İkincil, şirketin resmi FY2025 sonuçlarına/Faaliyet Raporuna dayanıyor | 2026-11-10 erişim | FY2025 tam yıl net kâr (-%94), temettü dağıtmama kararı, hasılat/FAVÖK/net borç | Şirketin kendi açıklamasına dayanıyor, bağımsız bir gazetecilik yorumu değil salt aktarım |
| 5 | PwC Türkiye, KPMG Türkiye, Mondaq (3 ayrı profesyonel hizmet firması) | İkincil, kamu hukuku kaynağına (9286 sayılı Cumhurbaşkanı Kararı) dayanıyor | 2026-11-10 erişim | Temettü stopaj oranının %10'dan %15'e çıkışının (21-22.12.2024) TTRAK'a özgü olmadığının, ülke çapında bir vergi değişikliği olduğunun doğrulanması | Üç farklı, birbirinden bağımsız profesyonel hizmet firması aynı resmi kararı aktarıyor — iyi bir çoklu-kaynak teyidi |
| 6 | TradingView (`tr.tradingview.com`), Investing.com/tr | İkincil, toplulaştırılmış finansal veri | 2026-11-10 | 2021-2025 CFO/CAPEX/FCF rakamları | Hesap bazı (TMS29 uygulanmış mı) bu oturumda doğrulanmadı — **düşük-orta güvenilirlik**, Bölüm 9'da açıkça işaretlendi |
| 7 | WebSearch özet sonuçları (çoklu borsa/analist sitesi: Rotaborsa, Borsatek, Fintables, vb.) | İkincil | 2026-11-10 | FY2021-2024 net kâr serisi, pazar payı/ihracat/kapasite verileri, CNH ilişkisi detayları | Çoğu KAP/Faaliyet Raporu'na atıfla yazılmış; birincil belgenin kendisi bu oturumda yeniden açılıp okunmadı |
| 8 | `outputs/research-ttrak-20261029/TTRAK_ARASTIRMA_RAPORU.md` (Investulator'ın önceki araştırma oturumu) | **Dahili referans — bağımsız doğrulama SAYILMAZ** | 2026-10-29 (o oturumun kendi erişim tarihi) | 30.09.2026 bilanço/gelir tablosu kalemleri, borç dipnotu, ISIN/ilk işlem tarihi, KAP tarama sonuçları | O oturum birincil SPK mali tablo PDF'ini ve şirketin sermaye artırım sayfasını fiilen okumuştu; bu oturum o okumaları **yeniden doğrulamadan** referans aldı — bu bir sınırlamadır |
| 9 | X/Twitter (@finanscibaba) temettü özet gönderisi | **Düşük güvenilirlik, sosyal medya** | 2026-11-10 | Yalnızca kaba çapraz kontrol (sıra/büyüklük mantıklı mı) için kullanıldı, **hiçbir rakam doğrudan bu kaynaktan alınmadı** | Bağımsız teyit kaynağı olarak SAYILMADI |

**Genel doğrulama durumu:** Temettü ödeme tarihleri ve pay başına tutarlar **çoklu bağımsız ikincil kaynakla iyi derecede çapraz doğrulandı**. FY2025 tam yıl sonuçları ve temettü dağıtmama kararı **şirketin kendi açıklamasına dayanan güvenilir ikincil habercilikle** doğrulandı. Stopaj oranı değişikliğinin ülke çapında olduğu **üç bağımsız profesyonel kaynakla** doğrulandı. Bilanço/nakit akışı detaylarının bir kısmı (30.09.2026 birincil okuma) bu oturumda **yeniden doğrulanmadı**, önceki oturuma dayanıyor; CFO/CAPEX/FCF serisi ve FY2022-2024 FAVÖK rakamları **ikincil kaynaklı ve kısmen çelişkili** kalmıştır. Hiçbir sayısal adil değer/hedef fiyat üretilmemiştir — kapsam dışıdır.

---

*Bu rapor bir eleme taslağıdır; Investulator uygulamasının mevcut frontend mock veri hattına entegre edilmemiştir (görev kapsamı bunu istememiştir). Kişisel portföy/maliyet/miktar verisi bu araştırmaya dahil edilmemiş ve harici bir modele gönderilmemiştir.*
