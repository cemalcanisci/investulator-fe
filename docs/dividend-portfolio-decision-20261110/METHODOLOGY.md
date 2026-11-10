# Metodoloji — Portföy Ön Eleme Kararı

**Kesim tarihi:** 2026-11-10. Bu belge, `DECISION_MATRIX.md`, `COMPANY_DECISIONS.md`, `UNRESOLVED_ISSUES.md` ve `FINAL_RECOMMENDATION.md` için kullanılan karar kriterlerini açıklar. **Bu çalışma yeni bir genel araştırma değildir** — iki mevcut araştırmayı (`docs/dividend-screening-20261110/` ve `docs/dividend-screening-independent-audit-20261110/`) denetleyip birleştiren üçüncü bir sentez turudur.

## 1. Girdi kaynakları ve güvenilirlik sırası

1. **İkinci tur (bağımsız denetim)** — `dividend-screening-independent-audit-20261110/` — ilk turdan **tamamen ayrı bir oturumda** çalışan 5 paralel ajanın, önce zaten indirilmiş birincil kaynakları yeniden madenleyip sonra web'i yeniden taradığı tur. İlk tur ile ikinci tur çeliştiğinde **ikinci tur esas alınmıştır** — ama bu otomatik/sorgusuz bir tercih değildir: her çelişkide ikinci turun **somut bir kök neden** (hesaplama hatası, okunmamış ama zaten var olan belge, teyit edilmiş yeni KAP bildirimi) göstermesi şart tutulmuş, yalnızca "daha sonra yazıldı" gerekçesiyle tercih yapılmamıştır. Bu belgede her önemli çelişki için hangi turun neden tercih edildiği ayrıca açıklanır (bkz. `COMPANY_DECISIONS.md`).
2. **İlk tur** — `dividend-screening-20261110/` — 10 şirket için ayrı ajan oturumlarıyla yapılan ilk kaynak taraması. İkinci tur tarafından düzeltilmeyen tüm bulgular bu turdan olduğu gibi alınmıştır.
3. **Investulator'ın uygulama-içi mevcut araştırması** (`investulator-fe/src/data/research/*.json`, önceki `outputs/research-*` oturumları) — her iki tur tarafından da **başlangıç referansı** olarak kullanılmış, bağımsız doğrulama sayılmamıştır. Bu çalışma da aynı kuralı korur: uygulamanın BLOCKED/NEEDS_REVIEW adil değer kararları **değiştirilmemiştir**.

İki turun **hiçbiri** bu çalışmada yeniden üretilmemiştir — kaynak PDF'leri, KAP bildirimleri veya web sayfaları bu oturumda tekrar açılmamıştır. Bu belge, var olan bulguları okuyup karşılaştıran bir **üçüncü okuma**dır; kendisi de birinci/ikinci tur ajanlarından bağımsız bir oturumda yazılmıştır, ama kaynak erişimi yapmadığı için "bağımsız yeniden doğrulama" değil "sentez/denetim" niteliğindedir.

## 2. Üç bilgi türünün ayrımı

Her şirket için üç bilgi türü ayrı tutulmuştur (görev talimatının bölüm 2 kuralı):

- **Doğrulanmış finansal gerçek:** Birincil kaynaktan (KAP, şirketin kendi finansal tablosu/faaliyet raporu) okunmuş ve en az bir iç tutarlılık kontrolünden (toplam ÷ pay sayısı, segment toplamı = konsolide toplam, rollforward açılış/kapanış) geçmiş rakam.
- **Analitik yorum:** Bu gerçeklerden çıkarılan değerlendirme (örn. "kaldıraç yörüngesi hızla kötüleşiyor", "disiplinli dönem" gibi nitelik atıfları). Yorumlar her zaman hangi gerçeğe dayandığı belirtilerek sunulur.
- **Doğrulanamayan varsayım/eksik veri:** Açıkça MISSING_DATA, CONFLICT veya NEEDS_REVIEW olarak işaretli kalemler. Bu çalışma bu kalemleri **doldurmaz**; `UNRESOLVED_ISSUES.md`'de olduğu gibi listeler.

## 3. İki bağımsız değerlendirme ekseni

### A. Uzun Vadeli Temettü Yatırımına Uygunluk

Dört sonuç kategorisi kullanılmıştır (zorla dağılım yaratılmamıştır):

- **Çekirdek portföy adayı** — çok yıllı, bağımsız doğrulanmış FCF/CFO karşılama **ve** 10-15 yıllık pencerede kesintisiz/öngörülebilir süreklilik **ikisi birlikte** kanıtlanmış.
- **Koşullu portföy adayı** — temettü geçmişi ve iş modeli kalitesi gerçek ve olumlu, ama yukarıdaki iki koşuldan en az biri (çoğunlukla çok yıllı FCF karşılamasının tam/güvenilir olmaması) karşılanmıyor; yapısal bir çöküş veya diskalifiye edici risk de yok.
- **Stratejiye uygun değil** — iş modelinin kendisinin, somut ve kalıcı bir kanıtla (örn. kalıcı zarar, borç yükü nedeniyle temettü kapasitesi kalıcı olarak ortadan kalkmış, telafisi olmayan bir yapısal çöküş) stratejinin temel koşullarını karşılamadığı gösterilmiş.
- **Karar ertelendi — kritik kanıt eksik** — kararın kendisi (A/B/C ayrımı) belirli, isimlendirilmiş bir kanıt boşluğu kapatılmadan **sorumlu biçimde verilemiyor**.

**Bu çalışmanın sonucu, iki bağımsız turun ikisinde de aynı çıkmıştır: 10 şirketin 10'u da Koşullu Portföy Adayı kategorisinde kalmıştır.** Bu, önceki sonucun sorgulanmadan kopyalanması değildir — bu belge her şirket için ayrıca "neden Çekirdek değil" ve "neden Uygun Değil/Ertelendi değil" sorusunu bağımsızca değerlendirmiş (bkz. `COMPANY_DECISIONS.md`) ve her birinde aynı sonuca ulaşmıştır. Tek bir şirket için bu sonucun sınırında olduğu not edilmiştir: **FROTO**, çok yıllı CFO/CAPEX/FCF verisinin **hiçbirinin** birincil kaynaktan hiçbir turda elde edilememiş olması nedeniyle "Koşullu" ile "Karar Ertelendi" arasında en ince çizgide durmaktadır (gerekçe: `COMPANY_DECISIONS.md`).

**Şirketleri yalnızca temettü verimine göre sıralamak bu çalışmada hiçbir yerde yapılmamıştır.** Güncel/geçmiş temettü verimi tek başına hiçbir kategorinin gerekçesi değildir (ör. ISMEN'in 2025 ödemesinde ~%12 verim, tek başına kategoriyi yükseltmemiştir).

### B. Araştırma Güvenilirliği

Üç seviye: **Yüksek / Orta / Düşük**. Bu eksen, şirketin kalitesiyle **karıştırılmamıştır** — bir şirketin kanıt güvenilirliği düşük olması şirketin kötü olduğu anlamına gelmez (ISMEN'in sermaye yeterliliği oranı gibi kalıcı şeffaflık eksiklikleri buna örnektir); tersine bol miktarda veri bulunması da şirketin iyi olduğu anlamına gelmez (AKMGY'de CFO/CAPEX serisinin artık tam olması, hukuki riski azaltmamıştır).

Güvenilirlik seviyesi, ikinci turun bulgularıyla **5 şirkette yükselmiştir** (TOASO, TTRAK, AKSA, ISMEN, AKMGY — Düşük/PARTIAL'dan Orta'ya) çünkü zaten indirilmiş birincil kaynaklar derinlemesine okunduğunda gerçek çok yıllı veri bulunmuştur. **Bu yükselişin sonucu çoğunlukla olumsuz yönde olmuştur** (TOASO, TTRAK'ta "disiplinli geçmiş" yorumu zayıflamıştır) — veri kalitesinin artması otomatik olarak şirket kalitesinin arttığı anlamına gelmez; bu ayrım bu çalışmada özellikle korunmuştur.

## 4. "Zaten indirilmiş ama kullanılmamış veri" bulgusunun bu sentez için anlamı

İkinci turun en önemli metodolojik bulgusu: ilk turun "eksik veri" etiketlerinin **5/10 şirkette (TUPRS kısmen, TOASO, TTRAK, AKMGY, DOAS kısmen) araştırma derinliği eksikliğinden**, yalnızca **1 şirkette (FROTO) gerçek veri yokluğundan** kaynaklandığı gösterilmiştir. Bu çalışma bu ayrımı korur ve `UNRESOLVED_ISSUES.md`'de her kalemi üç kategoriye ayırır: (a) *araştırma eksikliği — düzeltilebilir*, (b) *erişim engeli — teknik/araç sorunu*, (c) *gerçekten mevcut değil — yapısal boşluk*. Bu ayrım, gelecekteki bir üçüncü araştırma turunun nereye odaklanması gerektiğini netleştirir.

## 5. Nakit akışı ve TMS 29 kuralları

- Reel/USD temettü büyümesi yalnızca **AKSA**'da tam hesaplanmıştır (TÜİK TÜFE + Yahoo Finance USD/TRY, iki bağımsız yöntemle teyitli: nominal +%1.333 büyüme reel/USD'de **büyüme göstermiyor**). Diğer 9 şirkette bu seri sistematik olarak **üretilmemiştir** — bu, nominal büyüme rakamlarının "gerçek büyüme" ile karıştırılmaması için her şirket raporunda açıkça işaretlenmiştir.
- TMS 29 bazları şirketten şirkete karışmamıştır: her tabloda hangi yılın hangi satın alma gücü bazında olduğu not edilmiş, farklı bazlı yıllar doğrudan bölünerek büyüme hesaplanmamıştır (ör. TOASO 2021-2023 nominal vs 2024-2025 TMS29; AKSA'da aynı yılın CFO'sunun farklı raporlarda işaret değiştirmesi — Bölüm 4, AKSA raporu).
- Kâr yılı / ödeme yılı ayrımı her tabloda korunmuştur; kesin teyit yoksa (DOAS, TTRAK'ın bazı taksitleri) "çıkarım, kesin teyit değil" notuyla işaretlenmiştir.

## 6. Sektöre uygun metrik seçimi

- **Sanayi/otomotiv/rafineri** (TUPRS, DOAS, FROTO, TOASO, TTRAK, AKSA): CFO − CAPEX = FCF, temettü/FCF karşılama.
- **Aracı kurum** (ISMEN): Klasik CFO/FCF modeli **uygulanmamıştır** (faaliyetlerden nakit akışı müşteri varlıkları/kendi pozisyonundan masif etkilenir); payout oranı + özkaynak/asgari sermaye tamponu önceliklendirilmiştir.
- **GYO** (AKMGY, YGGYO, PAGYO): Gerçekleşmemiş değer artış kazançları gerçek nakit kârdan ayrılmıştır (PAGYO 2023 örneği: net kârın büyük kısmı nakit-dışı). 2025'ten itibaren yürürlükteki SPK/7524 sayılı Kanun asgari %50 nakit dağıtım zorunluluğu üçünde de ayrıca değerlendirilmiştir — bu, üç GYO'nun da "göreli güçlü B" alt grubuna girmesinde payı olan yapısal bir pozitif faktördür.

## 7. Sınıflandırmada kullanılmayan kriterler

Görev talimatının yasakladığı yaklaşımlar bu çalışmada da kullanılmamıştır:

- Yüksek temettü verimi **tek başına** hiçbir kategori kararının gerekçesi değildir.
- Tek yıllık zarar/kesinti **otomatik olarak** "Stratejiye uygun değil" sonucu üretmemiştir (TTRAK'ın FY2025 sıfır temettüsü, DOAS'ın 2017/2020 kesintileri bu kuralla değerlendirilmiş, ama ikinci turun bulduğu "kesintiden ÖNCEKİ disiplin gerçek mi" sorusu da eklenmiştir — bkz. madde 8).
- Eksik veri **otomatik olarak** olumsuz puan sayılmamıştır (AKMGY'nin NAD çelişkisi, ISMEN'in sermaye yeterliliği eksikliği gibi).
- Bugünkü fiyat, F/K, PD/DD veya hedef fiyat hiçbir kategori kararının gerekçesi **değildir**; şirket kalitesi ile alım fiyatının cazibesi `FINAL_RECOMMENDATION.md`'de bilerek ayrı tutulmuştur.
- Keyfî ağırlıklı puanlama veya "1-10 sıra" üretilmemiştir; `DECISION_MATRIX.md`'deki gruplamalar nitel ve gerekçelidir.

## 8. İkinci turun eklediği bir kriter — "kesinti öncesi disiplin" testi

`METHODOLOGY_REVIEW.md`'nin (ikinci tur) önerdiği ve bu sentezin de benimsediği bir iyileştirme: döngüsel bir kesintinin "kabul edilebilir" sayılması için yalnızca "kesinti sonrası güçlü dönüş var mı" sorusu değil, **"kesinti öncesi 3-4 yılın temettü/FCF oranı gerçekten ≤1,0x mi"** sorusu da sorulmalıdır. TTRAK örneği bu kriterin önemini gösterir: FY2025 kesintisi ilk turda "disiplinli bir yönetim kararı" olarak okunmuştu, ama düzeltilmiş veri 2021-2024'ün üçünde temettünün zaten FCF'yi aştığını gösterdi — kesinti disiplinin kanıtı değil, önceki disiplinsizliğin kaçınılmaz sonucu olabilir. Bu kriter `DECISION_MATRIX.md` ve `COMPANY_DECISIONS.md`'de DOAS, TTRAK, TOASO için uygulanmıştır.

## 9. Bu sentezin kendi sınırlılığı

Bu belge, iki araştırma turunun bulgularını okuyup karşılaştıran üçüncü bir oturumdur; kendisi birincil kaynaklara **yeniden erişmemiştir**. Dolayısıyla ikinci turun çözemediği hiçbir çelişki (DOAS'ın FY2024 net kâr/FAVÖK çelişkisi, YGGYO'nun FY2024 zarar rakamı, PAGYO'nun doluluk oranı vb.) bu belgede de çözülmemiştir — bunlar `UNRESOLVED_ISSUES.md`'de aynen korunmuştur. Bu sentez de CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralına tabidir: iki araştırma turunu birleştirmesi onu bir DÖRDÜNCÜ bağımsız doğrulama turu yapmaz, yalnızca mevcut iki turun **tutarlılık ve karar-hazırlığı** denetimidir.
