# Veri Eksikleri — 10 BIST Şirketi Temettü Eleme Araştırması

**Araştırma kesim tarihi:** 2026-11-10. Bu dosya, her şirketin kendi raporundaki "Veri eksikleri ve çelişkiler" bölümünün (ve `missingData` JSON alanının) konsolide özetidir. Hiçbir eksik veri uydurulmadı; eksik kalemler `null` veya açık "doğrulanamadı" notuyla işaretlendi. Hiçbir eksik, A/B/C/D sınıflandırmasını **otomatik olarak** C'ye düşürmedi — görev talimatının "eksik veri otomatik olumsuz değildir" kuralı uygulandı; ama birçok durumda eksik, şirketin **A (çekirdek)** eşiğine çıkamamasının doğrudan nedenidir (aşağıda "Kararı engelliyor mu?" sütununda belirtilmiştir).

## Ortak (birden çok şirkette tekrarlayan) eksik türleri

### 1. Çok yıllı CFO/CAPEX/FCF serisi eksikliği
En sık tekrarlayan eksik. Aşağıdaki şirketlerde 2021-2025 arasının **tamamı** için birincil kaynaktan CAPEX ve/veya CFO bulunamadı, yalnızca 1 yıl (genelde en güncel) için hesaplanabildi:

| Şirket | Hangi yıllar eksik | Etki |
|---|---|---|
| TUPRS | 2021-2024 CAPEX/FCF | Çok yıllı payout/FCF karşılama hesaplanamadı, yalnızca 2025 var |
| FROTO | 2021-2025 tüm CFO serisi, 2021 CAPEX | FCF/temettü karşılama hiç hesaplanamadı |
| TOASO | 2021-2023 CFO/CAPEX, 9A2026 CAPEX | Payout/FCF karşılamasının tutarlı (aynı TMS 29 bazında) serisi kurulamadı |
| TTRAK | FY2025 tam yıl CFO/CAPEX/FCF | Sürdürülebilirlik tablosu yalnızca 9 aylık veriyle dolduruldu |
| AKMGY | 2021-2025 tüm CFO/CAPEX, gelir tablosu | Payout-to-CFO oranı hiç hesaplanamadı |

**Nasıl kapatılabilir:** İlgili şirketlerin yıllık faaliyet raporlarının nakit akış tablosu dipnotlarının KAP/IR sayfasından tek tek indirilip okunması (bu çalışmada zaman/erişim kısıtı nedeniyle tamamlanamadı — bazı belgeler 403 ile erişilemedi: DOAS IR sayfası).

### 2. Net borç/FAVÖK rakamlarında kaynaklar arası çözülemeyen çelişki
| Şirket | Çelişki | Kararı engelliyor mu? |
|---|---|---|
| FROTO | 2025 net borç/FAVÖK: 1,49x vs 1,85x (kendi hesap ~1,90x) | Hayır — yön (artan kaldıraç) her iki rakamda da aynı |
| TOASO | 9A2026 net borç/FAVÖK hesaplanamadı (yalnızca mutlak TL net borç 51,4 mr TL bulundu) | Hayır |
| TTRAK | FY2022-2024 FAVÖK: FY2023 için 13,193 mr TL vs 18,89 mr TL | Hayır — tek yıllık (FY2025) orana güvenildi |
| AKSA | Şirketin kendi ifadesi ~2,8x vs bağımsız hesap ~3,70x | Hayır — yön (yüksek kaldıraç artışı) tutarlı |
| DOAS | FY2024 net kâr (9,94 vs 7,5 mr TL) ve FAVÖK (16,7 vs 24,15 mr TL) — muhtemelen TMS 29 yeniden ifade farkı | Hayır |

**Nasıl kapatılabilir:** Her şirketin kendi FY ilgili finansal sonuç bültenini (KAP'ın birincil PDF'i) doğrudan açıp FAVÖK'ün hangi kalemleri içerdiğini (amortisman, tek seferlik kalemler, TMS 29 bazı) satır satır karşılaştırmak.

### 3. Reel (TÜFE bazlı) ve USD bazlı temettü büyüme serisi
TUPRS, DOAS, TTRAK, ISMEN, AKMGY, PAGYO raporlarının **hiçbiri** bu seriyi tam üretemedi (AKSA kısmen üretti — bkz. aşağı). Görev talimatı bunu zorunlu kılıyor ("Temettü büyümesini mümkünse nominal TL, reel TL ve USD bazında ayrı göster") ama bu, zaman kısıtı nedeniyle sistematik olarak eksik kaldı.

**Kararı engelliyor mu?** Hayır tek başına — ama bu seri olmadan "nominal büyüme = gerçek büyüme" yanılgısına düşülebileceği her raporda not edildi (AKSA'nın bulgusu özellikle uyarıcı: nominal +%1.333 görünen temettü büyümesi reel/USD bazda NET BÜYÜME GÖSTERMİYOR).

**Nasıl kapatılabilir:** TÜİK TÜFE serisi (resmi, birincil) + TCMB günlük USD/TRY kuru (her ödeme tarihi için) ile sistematik bir ek hesaplama turu; yöntem `TEMETTU_BIRIKIM_HESABI.md`'deki yaklaşımla tutarlı olmalı.

### 4. Birincil KAP/şirket kaynağına erişim engelleri (403, OCR gerektiren taranmış PDF)
| Şirket | Erişilemeyen belge | Alternatif |
|---|---|---|
| DOAS | dogusotomotiv.com.tr finansal rapor PDF'leri (403) | İkincil haber/aracı kurum kaynaklarına dayanıldı, NEEDS_REVIEW |
| FROTO | fintables.com (403) | borsacoo/getmidas ile çapraz kontrol |
| YGGYO | 2017 Kar Payı Dağıtım Tablosu PDF'i (taranmış görüntü, OCR yapılmadı); 31.12.2025 faaliyet raporu (sıkıştırılmış/OCR gerektiren) | Midas ikincil rakamı kullanıldı (brüt=net GYO kuralıyla tutarlı kontrol edildi) |
| AKMGY | akmgyo.com dava açıklaması PDF'leri (655, 657 — görüntü/kodlu içerik) | İkincil haber kaynakları (gazeteoksijen, yatirimx, borsatek) |
| ISMEN | fintables.com (403) | getmidas.com ile çapraz kontrol |

**Nasıl kapatılabilir:** Farklı bir ağ/IP'den veya OCR aracıyla (örn. taranmış PDF'ler için) yeniden deneme; ya da KAP'ın doğrudan `kap.org.tr` bildirim arşivinden aynı belgeye ulaşma.

## Şirkete özel, karar açısından en kritik eksikler

### TUPRS
- 2021-2024 CAPEX/FCF serisi — **B kategorisinde kalmanın ana nedenlerinden biri** (yalnızca 2025 için FCF karşılama hesaplanabildi: 0,87x).
- Her yıl için KAP genel kurul kâr dağıtım tutanağıyla teyitli toplam nakit temettü (TL) tutarı.
- Borcun döviz/vade kompozisyonu, net borç/FAVÖK, faiz karşılama oranı (yalnızca net nakit *yönü* biliniyor, büyüklüğü nicelleştirilemedi).

### DOAS
- FY2024 net kâr/FAVÖK çelişkisi (muhtemelen TMS 29 farkı) — birincil PDF'e 403 engeli nedeniyle çözülemedi.
- FY2025 tam yıl CAPEX.
- TÜVTÜRK pay satış bedeli henüz kamuya açıklanmadı (niyet mektubu aşamasında) — gelecekteki kâr tabanını etkileyebilir.

### FROTO
- 2025 kâr yılı için KAP birincil kâr payı dağıtım tablosu — mevcut kaba hesap (%90-100 payout) **doğrulanamadığı için şüpheli**, bu B kategorisinin ana gerekçelerinden biri.
- 2021 gerçekleşen CAPEX (yalnızca önceden açıklanmış beklenti rakamı var).
- Koç Finansman (2026 devralması) sonrası net borç/FAVÖK okumasının nasıl değişeceği henüz test edilmedi.

### TOASO
- 2021-2023 CFO/CAPEX serisi, birincil kaynaktan tek tek doğrulanmadı.
- Koç Stellantis Finansman A.Ş.'nin (tam konsolide) borcunun imalat borcundan ayrıştırılmış payı.
- 9A2026 net borç/FAVÖK oranının kesin değeri (yalnızca mutlak TL tutarı — 51,4 mr TL — bulunabildi).

### TTRAK
- **Elektrikli/otonom tarım makinelerine geçişte TTRAK'ın kendi stratejik konumu — hiçbir kaynakta bulunamadı.** 10-15 yıllık yapısal risk değerlendirmesi için en önemli boşluk.
- FY2022-2024 FAVÖK çelişkisi (yukarıda).
- 08.11.2024 ikinci temettünün hangi kâr/döneme ait olduğunun kesin teyidi (matematiksel çıkarım güçlü ama KAP/GK metniyle doğrulanmadı).
- CNH Industrial royalti/ilişkili taraf tutarları (Not 23).

### ISMEN
- **Gerçek düzenleyici sermaye yeterliliği oranı (SPK Seri V No:34) kamuya açık değil** — yalnızca asgari eşik biliniyor. Bu, B kategorisinde kalmanın ana nedenlerinden biri.
- 2025 ödemesinin (%154 payout görünümü) açıklaması — solo/istatutory kâr mı, geçmiş yıl kârları havuzu mu, netleşmedi.
- "Sadece komisyon" gelirinin ayrıştırılması (CONFLICT, Investulator'ın mevcut verisinde de işaretli).

### YGGYO
- **FY2024 IFRS net zarar (-523M TL) raporlanmasına rağmen 1,69 mr TL nakit temettü ödenmesinin mekanizması** (dağıtılabilir kârın IFRS net kârdan nasıl farklı tanımlandığı) birincil kaynaktan netleştirilemedi.
- 09.07.2024 tarihli 3,11 TL/pay olağanüstü ödemenin tam niteliği ve FY2023 yıllık dağıtılmama kararının gerekçesi.
- NAD/net aktif değer kaynak çelişkisi (Investulator'ın mevcut verisinden devralınan, bu oturumda da çözülemeyen CONFLICT).
- Kira sözleşmelerinin kur/enflasyon endeksleme yapısı.

### AKSA
- İleri Malzemeler (karbon elyaf) segmentinin kalıcı marj profili — **yalnızca bir yarı yıllık (H1 2026) temiz veri noktası var**, FY2025'teki kısmi dönem farklı bir marj (%14,4) gösteriyor.
- Şirketin kendi ~2,8x net borç/FAVÖK ifadesiyle bağımsız hesabın (~3,70x) mutabık kılınamaması.
- 2016-2020 net kâr/nakit akışı birincil kaynaktan doğrulanamadı.
- 9 aylık 2026 finansal tabloları (en güncel covenant durumu için).

### AKMGY
- **Hukuki riskin (3 Aralık 2025 ceza + yıkım kararı, özkaynağın ~%29'una kadar) finansal tablolarda karşılık/şarta bağlı yükümlülük notu olarak yansıtılıp yansıtılmadığı** — B kategorisinin ana koşulu.
- İstinaf başvuru tarihi ve olası karar takvimi (kesim tarihinde sonuç belirsiz).
- 2021-2025 birincil gelir tablosu/nakit akış tablosu/CAPEX (hiçbiri birincil kaynaktan doğrulanamadı).
- NAD CONFLICT (Investulator'ın mevcut verisinden devralınan, bu oturumda da çözülemedi).

### PAGYO
- Doluluk oranı ekspertiz-içi çelişkisi (DCF tablosu %91 vs duyarlılık notu %97-98) — aynı belgenin kendi içinde.
- 2026 9 aylık sonuçların birincil KAP kaynağından teyidi (ikincil kaynakta iki tutarsız net kâr rakamı: 675,7M vs 681,9M TL).
- KAP'ın resmi "Ortaklık Yapısı" sayfasından pay sahipleri yüzdeleri.

## Bu çalışmanın kendi sınırlılığı (metodolojik eksik)

Her şirketin raporu **kendi ajanı tarafından** üretildi ve `skills/investulator-analysis-review/SKILL.md` kapsamında **bağımsız bir ikinci inceleme adımından geçmedi** (görev kapsamı buna izin vermedi). Bu, görev talimatının "alt ajan sonuçlarını bağımsız doğrulama yerine koyma" uyarısıyla tutarlı olarak burada açıkça not edilir: bu 10 rapor **birinci tur, tek-ajan** araştırmalardır; ikinci bir bağımsız inceleme turu (farklı bir oturum/ajanla, mümkünse doğrudan KAP XBRL/birincil belge erişimiyle) önerilir, özellikle yukarıdaki "kararı engelliyor mu: Evet" olarak işaretlenmiş kalemler için.
