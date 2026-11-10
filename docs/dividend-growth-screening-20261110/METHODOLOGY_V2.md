# Metodoloji V2 — Temettü Sürekliliği, Büyümesi ve Kalitesinin Ayrıştırılmış Değerlendirmesi

**Kesim tarihi:** 2026-11-10, Europe/Istanbul. Kapsam: TUPRS, DOAS, FROTO, TOASO, TTRAK, ISMEN, YGGYO, AKSA, AKMGY, PAGYO. Bu belge, önceki üç turun (`dividend-screening-20261110/`, `dividend-screening-independent-audit-20261110/`, `dividend-portfolio-decision-20261110/`) üzerine kurulan **dördüncü** bir metodoloji revizyonudur. Önceki turların **ham bulguları değiştirilmedi**; burada değişen, bu bulguların nasıl bir A/B/C/D kararına dönüştürüldüğüdür.

## 0. Bu revizyon neden gerekli — üç turun ortak sonucunun kendisi bir bulgudur

Üç tur da, giderek daha derin kanıtla, aynı sonuca ulaştı: **10 şirketin 10'u da B**. İkinci tur (bağımsız denetim) kendi `METHODOLOGY_REVIEW.md`'sinde bunu açıkça savundu: "yöntem aşırı katı değildi; ilk turun kaynak taraması yeterince derin değildi, derinleşince sonuç B'yi doğruladı." Bu görevin talimatı ise tersini öne sürüyor: A kriterleri gereğinden fazla katı, C kriterleri gereğinden fazla dar. **Bu belge bu gerilimi göz ardı etmez, doğrudan ele alır:**

İkinci turun savunması bir noktada doğru: hiçbir şirkette *"10-15 yılın tamamı için bağımsız yeniden türetilmiş, kesintisiz FCF karşılama serisi"* yok, ve bu derin tarama sonrasında da çıkmadı. Ama bu standardın kendisi sorgulanmalı: **BIST'te halka açık her şirket, KGK lisanslı bağımsız denetim şirketleri tarafından yıllık/ara dönem denetimden geçer** — şirketin kendi nakit akış tablosu zaten bir bağımsız denetim görüşü taşır. Bizim araştırma oturumlarımızın her yılın CFO/CAPEX rakamını *kendi başına, ikinci bir kaynaktan çapraz doğrulayarak* yeniden türetememesi, şirketin nakit akışının *denetlenmemiş veya güvenilmez* olduğu anlamına gelmez — bu, **araştırmanın erişim/zaman kısıtının** bir sonucudur, **şirketin finansal kalitesinin** bir bulgusu değildir. Üç turun ortaklaştığı standart, fiilen "hiçbir araştırma oturumunun erişemeyeceği bir kanıt yoğunluğu" talep ediyordu — bu, sıkı bir yatırım standardı değil, **karşılanması yapısal olarak mümkün olmayan bir araştırma standardıydı.**

**Bu belgenin temel düzeltmesi:** Kanıt güvenilirliği (bizim ne kadarını bağımsızca doğrulayabildiğimiz) ile stratejik uygunluk (şirketin gerçekte ne kadar iyi bir temettü-büyümesi adayı olduğu) **iki tamamen ayrı eksen** olarak ele alınır (bölüm 2). A kararı, *"araştırmacı her yılı kendi başına yeniden hesapladı"* değil, *"mevcut, makul ölçüde temsil edici kanıt, yönüyle ve büyüklüğüyle güçlü bir resim gösteriyor ve hiçbir çözülmemiş büyük yapısal risk yok"* standardına dayanır (bölüm 4.1). Bu, standardı gevşetmek değildir — aşılması gereken şeyin ne olduğunu **doğru tanımlamaktır.**

## 1. Üç ayrı değerlendirme ekseni (sentezden önce ayrı ayrı puanlanır)

Önceki turların en büyük zaafı (görevin 3. maddesi), temettü **sürekliliğini** (her yıl ödendi mi) ile temettü **büyümesini** (reel/USD olarak arttı mı) ile **finansal sürdürülebilirlik kalitesini** (nakit akışı/kaldıraç/sektöre uygun metrik) tek bir anlatıda eritmesiydi (örn. "12+ yıl kesintisiz ve her kriz döneminde artan temettü" cümlesi, sürekliliği büyümeyle karıştırıyordu). Bu versiyon bunları **üç ayrı eksen** olarak puanlar:

### Eksen A — Temettü Sürekliliği
Son 10-11 kâr yılında kaç yıl nakit temettü ödendi, kesinti sayısı, kesintiden dönüş hızı/büyüklüğü.
- **Güçlü:** ≤1 kesinti VEYA kesintiler kanıtlı dışsal şoklarla (pandemi, sektörel kriz) açıklanıyor ve dönüş hızlı/büyük.
- **Orta:** 2 kesinti, dönüş kanıtı kısmi veya yakın zamanlı (henüz tam yıl doğrulanmamış).
- **Zayıf:** ≥2 kesinti VEYA en güncel kesintiden dönüş kanıtı yok/olumsuz sinyal var.

### Eksen B — Temettü Büyümesi (nominal/reel/USD, bu turun asıl yeni katkısı)
Nominal TL büyüme TEK BAŞINA anlamlı değildir (Türkiye'nin enflasyon ortamında nominal büyüme neredeyse otomatiktir) — asıl ölçü **reel TL ve USD CAGR**'dır (bkz. `REAL_DIVIDEND_GROWTH.md`, hesap yöntemi `_reference/MACRO_REFERENCE.md`).
- **Güçlü:** Reel VE USD CAGR (10 yıl) pozitif VE 2025/2026 seviyesi geçmiş zirvelerin altında değil (yani büyüme kalıcı, tek seferlik zirve-çöküş değil).
- **Orta:** Biri pozitif diğeri negatif/düz, VEYA ikisi de pozitif ama güncel seviye geçmiş bir zirvenin altında (büyüme var ama *net* kazanç tartışmalı).
- **Zayıf:** Reel VE USD'de net büyüme yok veya belirgin negatif (güncel seviye başlangıç seviyesine yakın veya altında).

**Önemli kural:** Eksen A "Güçlü" olup Eksen B "Zayıf" olabilir (örn. AKSA — hiç kesinti yok ama reel/USD büyüme yok) — bu, "süreklilik = kalite" varsayımının **yanlış** olduğunu gösteren tam da aradığımız örnek ve bu versiyon bunu açıkça ayrı ayrı raporlar.

### Eksen C — Finansal Sürdürülebilirlik ve Kalite (sektöre uygun metrikle)
Nakit akışı karşılama (sanayi: FCF/temettü; aracı kurum: payout + özkaynak tamponu, CFO modeli UYGULANMAZ; GYO: gerçek kira nakdi + SPK asgari %50 dağıtım kuralı, gerçekleşmemiş değerleme kazancı hariç), kaldıraç trendi (yön VE büyüklük), döngüsel şoktan dönüşün **disiplin testi** (aşağıda).

**Döngüsel kesinti/şok testi (bağımsız denetimin METHODOLOGY_REVIEW.md bölüm 3 önerisi, bu versiyonda benimsendi):** Bir kesinti veya sert kârlılık düşüşü sadece "dışsal şok" diye otomatik mazur görülmez — **kesinti/şoktan ÖNCEKİ 3-4 yılda temettü/FCF oranı gerçekten ≤1,0x mıydı** sorusu da sorulur. Eğer kesinti öncesi dönemde temettü zaten tekrarlayan biçimde FCF'yi aşıyorsa, kesinti "disiplinli bir yönetim kararı" değil, **önceki disiplinsizliğin kaçınılmaz sonucu** olarak okunur — bu, Eksen C'yi doğrudan düşürür (TTRAK ve DOAS'ta ikinci turun bulduğu kanıt tam olarak bu örüntüyü gösteriyor, bkz. `DIVIDEND_SUSTAINABILITY.md`).
- **Güçlü:** Mevcut (sınırlı da olsa) kanıt, nakit akışının temettüyü yönüyle ve büyüklükle rahat karşıladığını gösteriyor; kaldıraç yönetilebilir/azalıyor; şok öncesi disiplin testi geçiliyor.
- **Orta:** Kanıt kısmi veya karışık (bazı yıllar karşılıyor, bazı yıllar aşıyor) ama tekrarlayan/kronik değil.
- **Zayıf:** Temettü, **birden çok (≥2-3, ardışık veya çoğunluk) yılda** mevcut kanıtla FCF'yi/nakit üretimini aşıyor VE bu borçlanmayla/sermaye erimesiyle finanse ediliyor.

## 2. Dördüncü, bağımsız eksen: Kanıt Güvenilirliği (stratejik uygunluğa karıştırılmaz)

Önceki denetimin kendi `METHODOLOGY_REVIEW.md` bölüm 6 önerisi burada **doğrudan benimsenmiştir**: tek bir blanket `verificationStatus` yerine **bölüm bazlı** güven notu:

| Alt alan | Ne ölçer |
|---|---|
| `dividendHistoryConfidence` | Temettü tarihleri/tutarları birincil kaynaktan mı, ikincil/türetilmiş mi, tahmini mi |
| `cashFlowConfidence` | CFO/CAPEX/FCF rakamlarının kaynağı ve kaç yıl için birincil doğrulandığı |
| `riskAssessmentConfidence` | Yapısal/hukuki/sektörel risklerin kaynağının sağlamlığı |

Her biri **Yüksek/Orta/Düşük**. **Kural (görevin 5. bölümünden, harfiyen):** Kanıt güvenilirliğinin düşük olması şirketin finansal kalitesinin düşük olduğu anlamına GELMEZ; tersine çok veri bulunması şirketi otomatik güçlü aday YAPMAZ. Bu belge ve ona bağlı tüm sentez dosyalarında (`COMPANY_COMPARISON.md`, `FINAL_SHORTLIST.md`) bu iki eksen **her zaman ayrı sütun/ayrı cümlede** raporlanır — hiçbir yerde "kanıt zayıf, o yüzden B" ya da "kanıt güçlü, o yüzden A" gibi doğrudan bir çıkarım yapılmaz. Kanıt güvenilirliği düşük olduğunda sonuç, kategoriyi otomatik düşürmek değil, **D (Karar Ertelendi)** olasılığını gündeme getirmektir (bölüm 4.4) — ama sadece kanıt yokluğu *gerçekten kararı engelliyorsa*.

## 3. Veri eksikliği türlerinin ayrıştırılması (denetimin METHODOLOGY_REVIEW.md bölüm 4 önerisi, benimsendi)

`missingData`/`DATA_GAPS.md` maddeleri artık üç alt türe ayrılır:
1. **Araştırma eksikliği** (veri muhtemelen mevcut, bu oturumlarda taranmadı/okunmadı) — düzeltilebilir, şirket aleyhine delil SAYILMAZ.
2. **Erişim engeli** (403, OCR gerektiren tarama, şifreli PDF — veri muhtemelen var ama bu araçlarla çıkarılamıyor) — düzeltilebilir ama bu oturumun kapsamı dışında, şirket aleyhine delil SAYILMAZ.
3. **Gerçek veri boşluğu** (kamuya hiç açıklanmamış, örn. ISMEN'in düzenleyici sermaye yeterliliği oranı) — bu bir **şeffaflık riski** olarak değerlendirilir (Eksen C veya risk değerlendirmesine girebilir), ama "şirket kötü" anlamına gelmez, "bu konuda izlenebilirlik kalıcı olarak sınırlı" anlamına gelir.

## 4. A/B/C/D sentezi

**Hiçbir şirket zorla bir kategoriye yerleştirilmez.** Üç eksen (A/B/C) + kanıt güvenilirliği ayrı rapor edildikten sonra, aşağıdaki testler **sırayla** uygulanır; bir şirket birden çok testi geçebilir, en belirleyici olan gerekçe olarak yazılır.

### 4.1 A — Çekirdek Portföy Adayı (yeniden kalibre edildi)

**Eski standart (üç turun fiilen uyguladığı):** Eksen C'nin *"10-15 yılın tamamı için bağımsız yeniden türetilmiş, kesintisiz FCF karşılama"* ile kanıtlanması — bu, bölüm 0'da açıklanan nedenle **karşılanması yapısal olarak neredeyse mümkün olmayan** bir araştırma standardıydı.

**Yeni standart:** Aşağıdaki DÖRDÜ birlikte:
1. Eksen A (süreklilik) **Güçlü** veya güçlü kanıtlı toparlanmayla **Orta**.
2. Eksen B (büyüme) **Güçlü** veya en azından **Orta** (net kayıp yok).
3. Eksen C (kalite), **mevcut kanıtın kapsadığı yıllarla sınırlı olsa dahi**, yönüyle ve büyüklüğüyle **Güçlü** — tüm 10-15 yılın ayrı ayrı doğrulanmış olması **zorunlu değildir**; son 2-3 yılın tutarlı, makul kaynaklı (gerekirse ikincil ama çok kaynaklı mutabık) kanıtı yeterlidir, şok-öncesi disiplin testi geçilir.
4. **Çözülmemiş, büyük, adlandırılmış bir yapısal risk YOK** (örn. özkaynağın >%10'u büyüklüğünde sonuçlanmamış dava, tek-varlık/tek-bölge yoğunlaşması, kritik ürün/pazarın yapısal çökmesi).

Kanıt güvenilirliği Düşük/Orta olsa dahi, eğer mevcut kanıt yönüyle güçlü ve kırmızı bayrak yoksa **A verilebilir** — ama `"evidenceCaveat": "sınırlı kanıtla A"` notuyla şeffaf şekilde işaretlenir.

**Bu turun 10 şirkete bu standardı uyguladığında ne çıktığı** `COMPANY_COMPARISON.md`/`FINAL_SHORTLIST.md`'de şirket bazında gerekçelendirilir — bu dosyada önceden bir sonuç taahhüt edilmez.

### 4.2 B — Koşullu Portföy Adayı

Üç eksenden en az biri Orta/Zayıf VEYA çözülebilir, **adlandırılmış ve zaman sınırlı** bir risk/soru var. **Her B kararı somut bir koşulla birlikte verilir**: "X netleşirse/olursa A'ya, Y gerçekleşirse C'ye kayar" biçiminde — belirsiz "riskli ama tutalım" gibi bir B kabul edilmez.

### 4.3 C — Stratejiye Uygun Değil (genişletildi)

**Eski standart (fiilen uygulanan):** Yapısal çöküş/iflas kanıtı — bu hiçbir BIST şirketinde makul şekilde beklenemeyecek kadar yüksek bir bar, pratikte C'yi ulaşılamaz kılıyordu.

**Yeni standart (görev talimatının 4. bölümünden, harfiyen benimsendi):** Aşağıdakilerden **en az biri**, yeterli (birden fazla bağımsız veya çok kaynaklı mutabık) kanıtla gösterilirse C uygulanabilir — iflas veya kalıcı çöküş kanıtı GEREKMEZ:
- **Tekrarlayan ve sürdürülemez temettü politikası:** Eksen C testinde tanımlanan "≥2-3 ardışık/çoğunluk yılda FCF'yi aşan, borçla finanse edilen temettü" örüntüsü.
- Uzun dönem boyunca zayıf nakit üretimi (yapısal, tek yıllık değil).
- İş modelinin stratejiyle belirgin uyumsuzluğu (bu 10 şirkette gözlenmedi — hepsi nakit temettü ödeyen, kârlı şirketler).
- Finansal risklerin (kesinleşmiş/büyük şarta bağlı yükümlülük) temettü kapasitesini ciddi şekilde sınırlaması.

**Kesin olarak C NEDENİ SAYILMAYANLAR (görev talimatı + önceki turlarla tutarlı):** Tek yıllık zarar, tek bir temettü kesintisi, tek başına negatif reel CAGR, yüksek borcun kendisi (taşınabilirlik kanıtlanabiliyorsa), düşük kanıt güvenilirliği.

### 4.4 D — Karar Ertelendi / Kritik Kanıt Eksik

Sadece **kararı fiilen engelleyen** bir gerçek veri boşluğu (bölüm 3'ün 3. türü) varsa ve bu boşluk, yukarıdaki A/B/C testlerinin hiçbirini güvenle uygulamayı mümkün kılmıyorsa. D, "kanıt güvenilirliği Düşük" ile eş tutulmaz — FROTO örneğinde (hiçbir CFO/CAPEX rakamı hiçbir kaynaktan bulunamadı) bile, temettü sürekliliği ve büyüme eksenleri bağımsızca değerlendirilebildiği için D'nin gerekip gerekmediği şirket bazında tartışılır, otomatik uygulanmaz.

## 5. Sektörel uyarlamalar (önceki turlardan değişmeden taşındı)

- **Sanayi/otomotiv/rafineri (TUPRS, DOAS, FROTO, TOASO, TTRAK, AKSA):** CFO − CAPEX = FCF; FCF/temettü karşılama.
- **Aracı kurum (ISMEN):** Klasik CFO modeli UYGULANMAZ (müşteri varlıkları/kendi pozisyonu nakit akışını domine eder); payout oranı + özkaynak/asgari sermaye tamponu + ROE kullanılır.
- **GYO (YGGYO, AKMGY, PAGYO):** Gerçekleşmemiş değerleme kazançları nakit kârdan ayrılır; SPK'nın 2025+ asgari %50 dağıtım zorunluluğu (7524 sayılı Kanun) Eksen A/C'yi güçlendirici bir yapısal faktör olarak değerlendirilir; tek-varlık/tek-bölge yoğunlaşması her zaman ayrı bir yapısal risk olarak not edilir (kanıt güvenilirliğinden bağımsız, kalıcı bir özellik).

## 6. Kesin sınırlar (üç turdan değişmeden taşındı)

- Bu çalışma **bugünkü fiyattan alım önerisi veya hedef fiyat üretme çalışması değildir.** Şirket kalitesi ile alım fiyatının cazibesi ayrı tutulur; hiçbir F/K, PD/DD veya hedef fiyat A/B/C/D kararının gerekçesi olarak kullanılmaz.
- Investulator'ın uygulama içi BLOCKED/NEEDS_REVIEW adil değer kararları bu çalışmada **değiştirilmez.**
- Hiçbir eksik veri uydurulmaz; TÜFE/USD-TRY hesaplarının kaynağı ve formülü `_reference/MACRO_REFERENCE.md`'de sabittir, her şirket ajanı aynı kaynağı kullanır (tutarlılık).
- Bu dördüncü tur da **bağımsız bir ikinci oturum tarafından denetlenmedi** — CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralı burada da geçerlidir ve `DATA_GAPS.md`'de açıkça not edilir.
