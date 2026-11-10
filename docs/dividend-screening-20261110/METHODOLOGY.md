# Metodoloji — 10-15 Yıllık Temettü Portföyü İçin BIST Şirket Eleme Araştırması

**Araştırma kesim tarihi:** 2026-11-10, Europe/Istanbul. Kapsam: TUPRS, DOAS, FROTO, TOASO, TTRAK, ISMEN, YGGYO, AKSA, AKMGY, PAGYO.

## 1. Amaç ve sınır

Bu çalışma, önümüzdeki 3-4 ay içinde başlanacak ve en az 10-15 yıl sürdürülecek bir temettü/temettü büyümesi odaklı BIST portföyü için 10 şirketin çekirdek/koşullu/uygun-değil/veri-yetersiz adaylığını değerlendirir. **Bugünkü fiyattan alım önerisi veya hedef fiyat üretme çalışması değildir** — şirket kalitesi ile gelecekteki alım fiyatının cazibesi kasıtlı olarak ayrı tutulmuştur. Investulator'ın uygulama içindeki mevcut adil değer senaryoları (BEAR/BASE/BULL) ve BLOCKED/NEEDS_REVIEW kararları **değiştirilmedi**; bu çalışma onlardan tamamen ayrı, paralel bir elim kararı üretir.

## 2. Çalışma süreci

1. **Ön hazırlık:** Investulator'ın mevcut araştırma verisi (`investulator-fe/src/data/research/*.json`), kök `WORKLOG.md`, 7-9 Kasım 2026 bağımsız denetim raporları (`investulator-fe/docs/research-audit-20261107/DENETIM.md`, `comparison-screen-audit-20261109/DENETIM.md`) ve ilgili skill'ler (`skills/investulator-asset-research`, `skills/investulator-watchlist-refresh`) incelendi. Her şirketin mevcut NEEDS_REVIEW/BLOCKED durumu ve bilinen CONFLICT/MISSING_DATA alanları çıkarıldı.
2. **Şirket bazlı bağımsız araştırma:** Her şirket için **ayrı, bağımsız bir ajan oturumu** başlatıldı. Her ajana: (a) şirkete özel iş modeli/sektör notları, (b) Investulator'ın mevcut bulguları (başlangıç referansı olarak, "bağımsız doğrulama sayılmaz" uyarısıyla), (c) görev talimatının tam metodoloji kuralları (bölüm 2-6) verildi. Ajanlar WebSearch/WebFetch ile KAP, şirket yatırımcı ilişkileri sayfaları, faaliyet raporları, bağımsız denetim raporları, MKK ve üçüncü taraf veri sağlayıcılarını taradı.
3. **Doğrulama:** Her şirketin iki çıktı dosyası (`.md` + `.json`) tamamlandıktan sonra merkezi oturumda: dosya varlığı, JSON geçerliliği (`JSON.parse`), markdown'ın 12 zorunlu başlığın tamamını içerdiği ve raporların kesilmeden (truncation olmadan) bittiği doğrulandı. İki ajan (TOASO, YGGYO) oturum hız sınırına çarpıp "failed" durumuna düştü ama dosyalarını tamamlamış çıktı — bu ayrıca kontrol edildi. Bir ajan (AKSA) dosya yazmadan durdu ve yeniden başlatılarak tamamlandı.
4. **Konsolidasyon:** 10 şirketin JSON çıktıları programatik olarak (elle yeniden yazılmadan) `dividend-screening.json`'a birleştirildi; `COMPARISON.md` ve `DATA_GAPS.md` bu JSON'lardan ve markdown raporların ilgili bölümlerinden türetildi.

## 3. Bağımsızlık ve kaynak güvenilirliği kuralı

- **Aynı veriyi aktaran iki site bağımsız doğrulama sayılmadı.** Örnek: aynı KAP açıklamasının birden fazla haber portalında (borsagundem, cnbce, rotaborsa vb.) tekrarlanması tek bir kaynak olarak değerlendirildi, her raporun `sources[].independent` alanında bu ayrım yapılmaya çalışıldı.
- **Birincil kaynak önceliği:** KAP açıklamaları/finansal tablolar > şirketin kendi yatırımcı ilişkileri sayfası/faaliyet raporu > bağımsız denetim/ekspertiz raporu > MKK kayıtları > BIST resmî verisi > üçüncü taraf veri sağlayıcıları (yalnızca çapraz kontrol için).
- **Investulator'ın mevcut uygulama-içi araştırması** (örn. `tuprs-analysis-reports.json`, önceki oturumların `outputs/research-*` raporları) her şirkette **başlangıç/karşılaştırma referansı** olarak okundu ama `independent: false` olarak işaretlendi — geçmişte "VERIFIED" etiketlenmiş olması bu çalışma için bağımsız doğrulama sayılmadı. Birkaç raporda (TOASO, AKSA) bu referans verisinde gerçek hatalar bulunup düzeltildi (örn. TOASO'nun 2026 ödeme tarihi, AKSA'nın 2022 stopaj oranı varsayımı).
- **Erişilemeyen kaynaklar** (403 engelleri, OCR gerektiren taranmış PDF'ler) açıkça NEEDS_REVIEW/PARTIAL olarak işaretlendi, veri uydurulmadı.

## 4. Finansal dönem ve kâr/ödeme yılı ayrımı

Her temettü kaydında `paymentYear` (ödeme yılı) ve `profitYear` (temettünün ait olduğu kâr yılı) **ayrı alanlar** olarak tutuldu (CLAUDE.md'nin "ödeme yılı ile temettünün ait olduğu kâr yılını ayrı tut" kuralı). Bazı şirketlerde (DOAS, TTRAK) bir ödemenin hangi kâr yılına ait olduğu birincil kaynaktan kesin teyit edilemedi; bu durumda alan `null` bırakıldı veya "çıkarım, kesin teyit değil" notuyla işaretlendi — asla varsayılan bir yıl atanmadı.

## 5. TMS 29 ve dönem uyumu

Görev talimatının "TMS 29 satın alma gücü bazları, konsolidasyon kapsamı, kâr yılı ve ödeme yılı farklı olan verileri doğrudan bölerek hatalı payout veya FCF coverage hesaplama" kuralı uygulandı:

- **TOASO:** 2021-2023 (TMS29-öncesi nominal, ikincil kaynaklı) ile 2024-2025 (TMS29 ile yeniden ifade edilmiş, birincil kaynaklı) rakamları **karıştırılmadı**; 2021-2023 rakamları yalnızca yön/büyüklük mertebesi için kullanıldığı açıkça not edildi.
- **TTRAK:** FY2021-2022 (TMS29-öncesi nominal) ile FY2023'ten itibaren (TMS29 ile yeniden ifade edilmiş) rakamlar arasında aynı ayrım yapıldı; doğrudan büyüme yüzdesi hesaplanmadı.
- **AKSA:** FY2022'nin kendi raporundaki pozitif CFO'sunun (nominal), FY2023 raporunun TMS29 karşılaştırmalı sütununda negatife dönüşmesi — bu, TMS 29 bazının nakit akışı *yönünü* bile değiştirebildiğinin somut bir kanıtı olarak rapora not edildi, görmezden gelinmedi.
- **TUPRS/DOAS/FROTO:** Yıllar arası doğrudan bölme ile büyüme hesaplanmadı; her yılın kendi yıl sonu TMS 29 bazında olduğu belirtildi.

Uyumlu karşılaştırma kurulamadığında (çoğu şirkette 2016-2020 dönemi için) metrik **üretilmedi**, neden ve gereken veri `missingData` alanında açıklandı.

## 6. Reel ve USD bazlı temettü büyümesi

Görev talimatı nominal TL, reel TL ve USD bazında ayrı gösterim istiyor; farklı ölçümler tek bir büyüme oranında **birleştirilmedi**. Bu hesaplama şirketten şirkete farklı derecede tamamlanabildi:

- **AKSA:** En kapsamlı yapıldı — TÜİK TÜFE yıllık oranları (alomaliye.com derlemesi) ve Yahoo Finance USD/TRY serisiyle, nominal +%1.333 görünen 10 yıllık temettü büyümesinin reel/USD bazda **net bir büyüme göstermediği** bulundu (2025 değeri 2021/2023 zirvelerinin altında, 2015-2017 seviyesine yakın). Kullanılan TÜFE serisi ve USD/TRY kuru kaynağı raporun kendi kaynaklar bölümünde (ikincil derleme olarak) belirtildi.
- **Diğer 9 şirket:** Zaman/kapsam kısıtı nedeniyle bu seri tam üretilemedi (bkz. `DATA_GAPS.md` bölüm 3); nominal seri verildi ve bunun reel/USD büyümeyle karıştırılmaması gerektiği her raporda açıkça not edildi.

## 7. Sürdürülebilirlik analizi — sektöre uygun metrik seçimi

Görev talimatının "GYO, aracı kurum ve sanayi şirketlerinde sektörün ekonomik özelliklerine uygun nakit/temettü analizi uygula" kuralı şu şekilde uygulandı:

- **Sanayi/otomotiv/rafineri (TUPRS, DOAS, FROTO, TOASO, TTRAK, AKSA):** Klasik CFO − CAPEX = FCF modeli; FCF/temettü karşılama oranı hesaplanmaya çalışıldı (çoğu şirkette veri eksikliği nedeniyle yalnızca 1-2 yıl için başarılı).
- **Aracı kurum (ISMEN):** Klasik CFO/FCF modelinin **uygun olmadığı** açıkça belirtildi (faaliyetlerden nakit akışı müşteri varlıkları/kendi menkul kıymet pozisyonundaki dönemsel değişimden masif etkileniyor); bunun yerine payout oranı + özkaynak/asgari sermaye eşiği tamponu önceliklendirildi. Bankacılık net faiz marjı/kredi riski mantığı **uygulanmadı**.
- **GYO (YGGYO, AKMGY, PAGYO):** Gerçekleşmemiş değer artış kazançları GERÇEK nakit kârdan ayrıldı (ör. PAGYO'da 2023 net kârının 2,64 milyar TL'sinin yalnızca ~268M TL'si nakit/değerleme-dışı; YGGYO'da FY2024 IFRS zararına rağmen nakit temettü ödenmesi, dağıtılabilir kârın IFRS net kârdan farklı tanımlandığının kanıtı olarak not edildi, "çelişki" diye görmezden gelinmedi). SPK'nın GYO'lara yönelik (2025'ten itibaren yürürlükte olan 7524 sayılı Kanun / 23 Seri No'lu KV Genel Tebliği) asgari %50 dağıtım zorunluluğu üç GYO'da da ayrıca değerlendirildi.

## 8. Finansal dayanıklılık

Net borç/net nakit, net borç/FAVÖK (uygun olan iş modellerinde), döviz borç dağılımı, likidite ve kriz dönemi davranışı her şirkette araştırıldı. Banka/aracı kurum/GYO metrikleri sanayi şirketleriyle **körü körüne karşılaştırılmadı** (ör. ISMEN'de net borç/FAVÖK yerine sermaye yeterliliği/özkaynak tamponu kullanıldı; GYO'larda net borç/net nakit pozisyonu ve SPK portföy borçlanma sınırı oranı kullanıldı).

Yüksek borç tek başına eleme nedeni **yapılmadı** — örnek: AKSA'nın borcu bir yılda ~3 katına çıktı ama bu, net faaliyet kârlılığıyla taşınabilirliği (covenant feragatnamesiyle aşılan tek bir ihlal riski, sonrasında ihlal bildirilmemesi) birlikte değerlendirildi, otomatik C'ye düşürülmedi.

## 9. A/B/C/D sınıflandırma yöntemi

Görev talimatının kuralları harfiyen uygulandı:

- **Yüksek temettü verimi tek başına A için yeterli sayılmadı.** Hiçbir raporda güncel/geçmiş temettü verimi A kararının gerekçesi olarak kullanılmadı.
- **Tek yıllık zarar veya temettü kesintisi otomatik C sayılmadı.** TTRAK'ın FY2025 sıfır temettüsü, DOAS'ın 2017/2020 kesintileri, TUPRS'ın 2020-2022 kesintileri — hepsi "otomatik C" olarak değerlendirilmedi, bunun yerine şirketin **geçmişte benzer bir şoktan temettüye güçlü dönüş gösterip göstermediği** (TTRAK ve TUPRS'ta evet, ayrıntılı kanıtla) ayrıca incelendi.
- **Eksik veri otomatik olumsuz puan sayılmadı.** AKMGY'nin NAD CONFLICT'i, ISMEN'in sermaye yeterliliği oranı eksikliği gibi durumlar şirketin kendisi için olumsuz bir kanıt olarak değil, "güven aralığını sınırlayan" bir unsur olarak ele alındı (B kategorisinin gerekçesine dahil edildi ama otomatik C üretmedi).
- **Bugünkü fiyat veya hedef fiyat sınıflandırmanın belirleyicisi yapılmadı.** Hiçbir raporda güncel F/K, PD/DD veya fiyat/NAD oranı A/B/C/D kararının ana gerekçesi olarak kullanılmadı — bunlar (varsa) yalnızca "yapısal risk" bölümünde dolaylı bağlamsal not olarak geçti.
- **Şirket kalitesi ile fiyat cazibesi ayrı tutuldu.** Hiçbir raporun "sonuç" bölümü bir alım/satım önerisi içermiyor.
- **Keyfi ağırlıklı puanlama veya sahte kesinlik üretilmedi.** `COMPARISON.md`'deki "göreli sıralama" bölümü sayısal bir puan/skor değil, nitel gerekçeli bir gruplamadır.
- **Mevcut Investulator BLOCKED/NEEDS_REVIEW kararları değiştirilmedi** — her rapor bunu açıkça kontrol edip korudu.

## 10. Bağımsız inceleme durumu (önemli sınırlama)

**Her şirketin raporu kendi ajanı tarafından üretildi ve bağımsız bir ikinci ajan/oturum tarafından denetlenmedi.** CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralına göre bu açıkça belirtilir: bu 10 rapor **birinci tur, tek-ajan** araştırmalardır. Her raporun `verificationStatus` alanı (PARTIAL / NEEDS_REVIEW) bu sınırlamayı yansıtır. İkinci, bağımsız bir inceleme turu önerilir — özellikle `DATA_GAPS.md`'de "kararı engelliyor mu: Evet" olarak işaretlenmiş kalemler için.

## 11. Makine okunabilir veri sözleşmesi

`dividend-screening.json`, her şirket için en az şu alanları içerir: `symbol`, `category`, `rationale`, `supportingEvidence`, `counterEvidence`, `dividendHistory`, `sustainability`, `financialResilience`, `growthOutlook`, `structuralRisks`, `missingData`, `sources`, `researchAsOf`, `verificationStatus`. Eksik değerler `null`; sıfır hiçbir yerde uydurulmadı. Her şirketin JSON'u, aynı ajan tarafından yazılan markdown raporuyla **çelişmeyecek şekilde** üretildi (ajanlara açık talimat olarak verildi ve bu çalışmada JSON/markdown tutarlılığı örnekleme ile kontrol edildi — satır sayısı, başlık sayısı ve `JSON.parse` doğrulaması yapıldı; madde madde çapraz okuma yapılmadı, bu bir açık takip maddesidir).
