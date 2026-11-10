# TUPRS (Tüpraş) — Temettü Büyüme Hesabı (4. Tur)

**Kesim tarihi:** 2026-11-10. **Kapsam:** Bu, önceki üç turun (screening, bağımsız denetim, portföy kararı) **devamıdır**. Bu çalışma A/B/C/D sınıflandırması YAPMAZ — yalnızca temettü geçmişini temizler ve nominal/reel/USD büyüme serisini hesaplar. Final kategori kararı bu belgenin dışında, merkezi bir sentez oturumunda verilecektir. Alım/satım önerisi veya hedef fiyat içermez.

**Kaynaklar:** `docs/dividend-screening-20261110/companies/TUPRS.{json,md}`, `docs/dividend-screening-independent-audit-20261110/{AUDIT,CASHFLOW,RISK_REVIEW,DATA_GAPS,METHODOLOGY_REVIEW}.md` (TUPRS bölümleri), `docs/dividend-portfolio-decision-20261110/{COMPANY_DECISIONS,UNRESOLVED_ISSUES}.md` (TUPRS bölümü), `_reference/MACRO_REFERENCE.md` + `_reference/lookup.cjs` (ortak TÜFE/USD-TRY referansı).

---

## 1. Temettü geçmişi (temizlenmiş, taksit bazında)

Kaynak JSON'daki birleşik satırlar (örn. `"45.41 (tahmini) + 7.5254479"`) `TUPRS.md`'nin (1. tur) ayrıntılı tablosu okunarak kendi ödeme tarihleriyle ayrı taksitlere çözüldü.

**Önemli pay-birimi uyarısı:** Nisan 2023'te %600 bedelsiz sermaye artırımı (1 eski paya 7 yeni pay, MKK #1132302) oldu. 2023 öncesi tutarlar ESKİ pay biriminde, 2023 ve sonrası YENİ pay biriminde basılmıştır. Bu çalışma, tüm yılları karşılaştırılabilir kılmak için 2023-öncesi tutarları **÷7 ile YENİ pay birimine çevirmiştir** (aşağıdaki tablo bu çevrilmiş — "split-ayarlı" — değerleri gösterir). 2022 kâr yılı özel bir durumdur: aynı yıl içindeki iki taksitten biri eski, biri yeni pay biriminde ödendi.

| Kâr yılı | Ödendi mi | Taksit(ler) | Ham brüt (TL, kendi dönemin pay birimi) | Split-ayarlı brüt (TL/yeni-pay-eşd.) | Not |
|---|---|---|---|---:|---|
| 2015 | Evet | 2016-04-06 | 6,50 (eski) | 0,928571 | Brüt ikincil kaynaktan çapraz kontrollü, net primary |
| 2016 | Evet | 2017-04-04 | 6,22 (eski) | 0,888571 | Aynı |
| 2017 | Evet | 2018-03-29 | 13,60 (eski) | 1,942857 | Aynı |
| 2018 | Evet | 2019-03-28 | 15,15 (eski) | 2,164286 | Aynı |
| 2019 | **Hayır** | — | 0 | 0 | Gerçek sıfır (kesinti), veri eksikliği DEĞİL |
| 2020 | **Hayır** | — | 0 | 0 | Gerçek sıfır (kesinti) |
| 2021 | **Hayır** | — | 0 | 0 | Gerçek sıfır (kesinti); aynı yıl CFO negatif, net kâr pozitif |
| 2022 | Evet | 2023-03-10 (1.) | 45,41 (eski, **TAHMİNİ, KESİN DEĞİL**) | 6,487143 | %10 stopaj varsayımıyla net'ten geri türetildi, birincil doğrulanmadı |
| 2022 | Evet | 2023-09-29 (2.) | 7,5254479 (yeni) | 7,525448 | KAP kaynaklı, güvenilir |
| 2022 | — | **Toplam** | — | **14,012591** | Kısmen tahmine dayalı (1. taksit) |
| 2023 | Evet | 2024-04-03 (1.) | 10,379928 (yeni) | 10,379928 | Şirket net-% + KAP brüt tutarlı |
| 2023 | Evet | 2024-09-27 (2.) | 11,9369175 (yeni) | 11,936918 | Aynı |
| 2023 | — | **Toplam** | — | **22,316846** | Güvenilir |
| 2024 | Evet | 2025-03-28 (1.) | 7,7849461 (yeni) | 7,784946 | Net/brüt ~%85, stopaj değişikliği gözlemi, mevzuat doğrulanmadı |
| 2024 | Evet | 2025-09-30 (2.) | 7,4216486 (yeni) | 7,421649 | Aynı |
| 2024 | — | **Toplam** | — | **15,206595** | Güvenilir |
| 2025 | Evet | 2026-03-16 (1.) | 10,3799282 (yeni) | 10,379928 | KAP kaynaklı |
| 2025 | Evet | 2026-10-02 (2.) | 6,7469533 (yeni) | 6,746953 | **MKK #1671443 ile gerçekleşen ödeme olarak birincil teyitli** |
| 2025 | — | **Toplam** | — | **17,126882** | Güvenilir |

**Toplam nakit temettü (TL):** 11 kâr yılının 10'unda bulunamadı (`null`). Yalnızca 2025 kâr yılı için ~29,3 milyar TL (1. taksit ~15,0 mr + 2. taksit ~14,3 mr) rakamı var — bu **ikincil kaynaklıdır** (Forbes Türkiye, Investing.com Türkiye; ikisi aynı KAP/GK açıklamasının kopyası, bağımsız sayılmaz) ve KAP'ın birincil genel kurul kâr dağıtım tutanağıyla bire bir doğrulanmamıştır. Diğer yıllar için pay sayısı/sermaye yapısı KAP/MKK ile teyit edilmediğinden toplam tutar güvenilir türetilemedi, uydurulmadı.

## 2. Reel TL ve USD bazında büyüme (bu turun asıl katkısı)

Önceki üç turda hiçbir zaman hesaplanmamıştı ("Reel TL ve USD bazında büyüme bu raporda hesaplanmadı" — TUPRS.md, 1. tur, böl. 2). Bu tur, `_reference/lookup.cjs` çıktısını (TÜİK TÜFE, baz ay **2026-10**; Yahoo Finance USD/TRY) kullanarak her taksiti ayrı ayrı deflate/çevirip kâr yılı bazında topladı.

| Kâr yılı | Nominal (TL/pay, split-ayarlı) | Reel (TL/pay, 2026-10 satın alma gücü) | USD/pay |
|---|---:|---:|---:|
| 2015 | 0,928571 | 15,053028 | 0,327070 |
| 2016 | 0,888571 | 12,876230 | 0,241617 |
| 2017 | 1,942857 | 25,873765 | 0,492498 |
| 2018 | 2,164286 | 24,076445 | 0,401187 |
| 2019-2021 | 0 (gerçek sıfır) | 0 | 0 |
| 2022 | 14,012591 | 42,834995 | 0,616357 |
| 2023 | 22,316846 | 42,244659 | 0,674212 |
| 2024 | 15,206595 | 21,683102 | 0,383328 |
| 2025 | 17,126882 | 18,776117 | 0,372355 |

**CAGR (10 yıl, profitYear 2015→2025, ikisi de pozitif, standart hesap):**
- Nominal: **%33,84/yıl**
- Reel (2026-10 bazlı): **%2,23/yıl**
- USD: **%1,31/yıl**

**Önemli bulgu — enflasyon yanılsaması:** Nominal TL'de pay başı temettü 10 yılda ~18,4 kat büyümüş görünüyor (%33,8/yıl bileşik). Ama aynı dönemde reel satın alma gücü yalnızca %2,2/yıl, USD değeri yalnızca %1,3/yıl büyümüş — ikisi de pozitif ama sıfıra yakın. Yani görünen "büyük büyüme" büyük ölçüde TL'nin enflasyon/değer kaybıdır, gerçek (reel/USD) büyüme neredeyse yatay.

**Son 5 yıl (standart 2021→2025 ÜRETİLEMEZ, çünkü 2021 kâr yılı sıfır):** Görev talimatına göre en yakın pozitif-pozitif karşılaştırılabilir çiftler kullanıldı:
- **2022→2025 (3 yıl, iyileşme-sonrası dönem):** Nominal %6,92/yıl; Reel **%-24,04/yıl**; USD **%-15,46/yıl**.
- Alternatif, gap-aşan çift **2018→2025 (7 yıl):** Nominal %34,38/yıl; Reel **%-3,49/yıl**; USD **%-1,06/yıl**.

**İkinci önemli bulgu — 2022 süper-döngüsünden sonra gerileme:** Hangi çift kullanılırsa kullanılsın, 2022 süper-döngü zirvesinden bu yana reel ve USD bazda pay başı temettü **negatif** büyümüş (gerilemiş). Taksit bazında bakıldığında, ödenen kâr yıllarının zincirinde (2015→2016→2017→2018→[kesinti]→2022→2023→2024→2025):
- **Reel satın alma gücü arttı:** 2017, 2022 (yıllar, önceki ödenen yıla göre).
- **Reel satın alma gücü düştü:** 2016, 2018, 2023, 2024, 2025 — yani 2023'ten itibaren **üç yılın üçünde de** reel düşüş var, son iki yıl (2024, 2025) üst üste.
- **USD değeri düştü:** 2016, 2018, 2024, 2025 (üst üste iki yıl).

## 3. Süreklilik ile büyüme — ayrı sorular, ayrı cevaplar

**Süreklilik:** 2015-2025 arası 11 kâr yılının **8'inde ödeme yapıldı, 3'ünde yapılmadı** (2019, 2020, 2021 kâr yılları — art arda). Kesintiden sonra dönüş **güçlü ve hızlıydı**: split-ayarlı nominal pay başı temettü, son ödenen yıl 2018'deki 2,164286 TL'den 2022'de 14,012591 TL'ye (~6,5 kat) sıçradı ve 2023'e kadar büyümeyi sürdürdü. Aynı zamanda yıllık tek taksitten iki taksite geçildi.

**Büyüme (ödenen yıllar arasında, süreklilikten AYRI):** Nominal büyüme çarpıcı ama büyük ölçüde enflasyon yanılsaması (yukarıya bak). Reel/USD büyüme pozitif ama çok küçük (10 yıllık ortalamada %1-2/yıl) VE **2022 süper-döngü zirvesinden sonra iki ödeme yılı üst üste (2024, 2025) negatife dönmüştür**.

**Bu iki bulgu BİRLEŞTİRİLİP tek bir sonuca İNDİRİLMEMİŞTİR:** "Kesintiden güçlü dönüş" olgusu doğru ve olumlu bir sinyaldir; "dönüş sonrası sürekli/güvenilir büyüme" ayrı bir sorudur ve bu veri setinde henüz doğrulanmamıştır — tam tersine, son iki yılda reel/USD gerileme gözlenmiştir.

## 4. Sürdürülebilirlik sentezi (önceki 3 turdan, yeniden araştırma YAPILMADI)

*Kaynak: `TUPRS.md`/`TUPRS.json` (1. tur, böl. 4-5), `CASHFLOW.md`/`RISK_REVIEW.md`/`DATA_GAPS.md` (2. tur, bağımsız denetim), `COMPANY_DECISIONS.md` (3. tur, portföy kararı).*

- **CFO serisi 2021-2025 artık tam ve birincil kaynaktan doğrulandı** (ilk turun "eksik" etiketi aslında yalnızca CAPEX'e özgüydü): −1,429088 / 43,913911 / 85,276324 / 35,271031 / 49,464734 milyar TL. Döngüsellik artık sayısal kanıtlı: 2023→2024 arası CFO hesap yöntemine göre **%58,6-71,4 düştü**.
- **CAPEX 2021-2024 hâlâ çıkarılamadı** — bu bir araştırma ihmali DEĞİL, bu ortamda `poppler`/`pdftoppm` olmadığı için PDF satır kaymasının görsel doğrulanamaması nedeniyle **teknik bir erişim engeli** (2. turun açık tespiti). 2025 CAPEX ≈19,12 mr TL (düşük-orta güven); H1 2026 CAPEX 11,858 mr TL (KAP XBRL, yüksek güven).
- **FCF/payout karşılama** yalnızca 2025 için hesaplanabildi: CFO karşılama **1,42x**; CAPEX-sonrası serbest nakit karşılama **0,87x** (2025'te temettü, CAPEX sonrası serbest nakit akışını aşıyor).
- **Normalize gözlem:** 2022 süper-döngüsü hariç tutulursa CFO ortalaması ~28 milyar TL/yıl — temettü kapasitesi 2022-2023 zirvesine göre çok daha mütevazı (2. tur bulgusu).
- **H1 2026 net nakit pozisyonu** (−102,232249 milyar TL net borç = net nakit) KAP ile çift mutabakatlı; Fitch (BB-/Pozitif) ve Moody's (Ba2/Durağan) bu yönü ikincil haber kaynaklarından destekliyor (orijinal kredi raporu hiçbir turda indirilmedi, yön tutarlı ama sayısal mutabakat iddia edilmiyor).
- **Borcun döviz/vade kompozisyonu** üç turda da doğrulanamadı.

## 5. Kanıt güvenilirliği (bölüm bazlı — METHODOLOGY_REVIEW.md önerisine göre)

Kanıt güvenilirliği düşük olması **şirketin finansal kalitesinin düşük olduğu anlamına GELMEZ** — bu ikisi ayrı eksenlerdir ve burada ayrı raporlanır.

- **Temettü geçmişi kanıtı:** Ödeme/ödememe olgusu için **Yüksek** (şirketin resmi arşivi + KAP/MKK çift mutabakatlı). Tam taksit tutarları ve toplam TL rakamları için **Orta-Düşük**: 2022'nin ilk taksiti reverse-derive edilmiş bir tahmin; toplam nakit tutarları 10/11 yılda yok, 1 yılda ikincil kaynaklı.
- **Nakit akışı kanıtı:** CFO için **Yüksek** (tam, birincil, 3 turda teyitli). CAPEX için **Düşük** (teknik erişim engeli, araştırma ihmali değil).
- **Risk değerlendirmesi kanıtı:** **Orta**. Döngüsellik riski artık nicel kanıtlı (Yüksek); kredi notu bulguları ikincil haber kopyalarından (Orta, yön güvenilir); borç döviz/vade kompozisyonu hiç doğrulanamadı (Düşük); enerji dönüşümü riskleri şirketin kendi ileriye dönük hedefleri, gerçekleşmiş sonuç değil (Düşük-Orta, nitel).

## 6. Veri eksikleri

1. **2021-2024 CAPEX tam serisi** — teknik erişim engeli (poppler/pdftoppm yok), çok yıllı FCF/payout karşılama oranını (yalnızca 2025: 0,87x) engelliyor.
2. **Her yıl için KAP GK kâr dağıtım tutanağıyla teyitli toplam nakit temettü (TL)** — 10/11 yıl null, 2025 ikincil kaynaklı (~29,3 mr TL), birincil doğrulanmadı.
3. **2022 kâr yılının ilk taksit (2023-03-10) brüt tutarı** — tahmini, birincil doğrulanmadı; profitYear 2022'nin toplam rakamlarını ve buna bağlı CAGR'ları kısmen etkiliyor.
4. **Borcun döviz/vade kompozisyonu, net borç/FAVÖK, faiz karşılama oranı** — üç turda da doğrulanamadı.
5. **Güncel/tarihsel kesin pay sayısı ve sermaye yapısı** — KAP/MKK ile teyit edilmedi; bu nedenle toplam nakit temettü tutarları çoğu yıl için pay başı rakamdan türetilemedi.
6. **2016-2020 hasılat/kâr rakamlarının birincil çift mutabakatı** — yalnızca 2021-2025 birincil mutabakatlı.
7. **TÜFE (hakedis.org ikincil derleme) ve USD/TRY (Yahoo Finance) kaynaklarının birincil kaynaklarla (TÜİK portalı, TCMB) çapraz doğrulanması** — tüm 10 şirket için ortak, TUPRS'a özel olmayan bir sınırlama (MACRO_REFERENCE.md).

## 7. Not — bu çalışmanın sınırı

Bu belge **sınıflandırma (A/B/C/D) yapmaz**, alım/satım önerisi veya hedef fiyat üretmez. Sağladığı yeni bilgi, önceki üç turda hesaplanmamış reel TL ve USD bazlı pay başı temettü büyüme serisidir; bu, "nominal büyüme çarpıcı ama çoğu enflasyon yanılsaması" ve "süper-döngü sonrası son iki yılda reel/USD gerileme" bulgularını sayısal olarak ortaya koyar. Final kategori kararı, bu bulguların önceki B değerlendirmesini nasıl etkilediğine merkezi sentez oturumunda karar verilecektir.
