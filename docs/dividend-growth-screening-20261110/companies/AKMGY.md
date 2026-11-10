# AKMGY — Akmerkez GYO — Temettü Büyümesi Veri Derleme (4. Tur)

**Kesim tarihi:** 2026-11-10. **Kapsam:** Bu rapor **sınıflandırma (A/B/C/D) yapmaz**; önceki üç turun (dividend-screening, independent-audit, dividend-portfolio-decision) AKMGY bulgularını aktarır ve nominal/reel/USD temettü büyüme serisini `_reference/lookup.cjs` çıktısıyla hesaplar. Final karar merkezi sentezde verilecek.

---

## 1. FX/TÜFE kaynağı

Aşağıdaki tüm kur ve TÜFE değerleri `_reference/lookup.cjs AKMGY <20 tarih>` komutunun döndürdüğü `fxDateUsed`, `fxLookbackDays`, `usdTry`, `tufeMonth`, `realDeflationFactor_toBaseMonth` alanlarından alınmıştır; başka hiçbir kur/TÜFE kaynağı kullanılmamıştır. Baz ay **2026-10** (reel TL tutarları bu ayın satın alma gücü cinsindendir).

---

## 2. Pay sayısı bulgusu (bu turun en önemli derleme sonucu)

Önceki tur (dividend-screening-20261110), AKMGY'nin 3.726.400.000 adet pay (1 kuruş nominal) üzerinden hesap yaptığını not etmişti. Bağımsız denetim (independent-audit) bu rakamın piyasa değeri aritmetiğiyle ~70-85 kat çelişkili olduğunu buldu ama MKK ile kesinleştiremedi.

Bu turda, **yeniden web araştırması yapmadan**, denetimin CASHFLOW.md'deki birincil kaynaklı "ödenen nakit temettü" (FY bazlı) rakamları AKMGY.md'nin pay başına nominal toplamlarına bölünerek örtük pay sayısı geriye hesaplandı:

| Yıl | Pay başına nominal toplam | CASHFLOW.md ödenen nakit temettü | Örtük pay sayısı |
|---|---:|---:|---:|
| FY2020 | 1,30 TL | 48.443.200 TRY | **37.264.000** (tam) |
| FY2021 | 2,67 TL | 99.494.880 TRY | 37.264.000 (~%0,02 fark) |
| FY2022 | 2,93 TL | 109.183.520 TRY | **37.264.000** (tam) |

Üç yıl bağımsız olarak **37.264.000 adet** payda birleşiyor — yani ödenmiş sermaye (37.264.000 TL) **1 TL nominal değerli** paylardan oluşuyor, 1 kuruş değil. Ayrıca Rotaborsa'nın bildirdiği 2025-04-11 ödeme toplamı (471.016.960 TRY) / 37.264.000 = tam **12,64 TL/pay** — Midas'ın bildirdiği 12,65 TL/pay ile ~1 kuruşluk farkla örtüşüyor; bu, önceki turun "bu rakam 2025 kâr yılına ait olabilir" şüphesini büyük ölçüde gideriyor (aynı ödeme, ufak yuvarlama farkı).

**Güven:** DERIVED, orta güven (dört bağımsız sayıdan tutarlı aritmetik sonuç) — ama MKK birincil pay defteri bu turda da okunmadı, kesin doğrulama değildir.

**Yan bulgu:** FY2023/2024/2025 için aynı aritmetik TUTARSIZ örtük pay sayıları veriyor (sırasıyla ~54,6M / ~46,8M / ~43,6M adet — 37.264.000 ile uyuşmuyor ve kendi aralarında da uyuşmuyor). Bu, 37.264.000'in yanlış olduğunu değil, **AKMGY.md'nin bu üç yıl için muhtemelen en az bir eksik ödeme/avans satırı içerdiğini** gösteriyor (bkz. bölüm 4).

---

## 3. Nominal / reel / USD temettü serisi (paymentYear bazında)

**Basis:** `paymentYear` (profitYear çoğu satırda kaynakta teyit edilemedi — AKMGY.md'nin kendi anlatısı Nisan/Mayıs ödemelerini "önceki yılın nihai dağıtımı", Ağustos/Ekim/Kasım ödemelerini "cari yılın ara dönem avansı" olarak genel bir kural ile açıklıyor ama bunu satır satır genel kurul tutanağıyla teyit etmiyor; bu yüzden 20 satırın yalnızca 6'sında profitYear dolduruldu, kalan 14'ü `null`). Her takvim yılının TÜM ödemeleri (brüt TL/pay) toplanarak hesaplandı.

| Yıl | Nominal TL/pay | Reel TL/pay (2026-10 bazlı) | USD/pay | Ödeme sayısı |
|---|---:|---:|---:|---:|
| 2016 | 2,06 | 33,14 | 0,6995 | 2 |
| 2017 | 0,90 | 12,98 | 0,2551 | 1 |
| 2018 | 2,68 | 33,46 | 0,5899 | 3 |
| 2019 | 2,43 | 25,88 | 0,4180 | 3 |
| 2020 | 1,30 | 12,82 | 0,1878 | 1 |
| 2021 | 2,67 | 22,02 | 0,3189 | 4 |
| 2022 | 2,93 | 14,16 | 0,1913 | 2 |
| 2023 | 4,16 | 14,34 | 0,2142 | 1 |
| 2024 | 7,77 | 15,77 | 0,2386 | 1 |
| 2025 | 15,05 | 21,92 | 0,3912 | 2 |

### CAGR

- **10 yıl (2016→2025, n=9):** Nominal **+%24,73**, Reel **−%4,49**, USD **−%6,25**. Nominal belirgin pozitif ama reel ve USD NEGATİF — TL'nin değer kaybı ve TÜFE'nin nominal temettü artışını geride bıraktığını gösteriyor (AKSA'nın bu turdaki bulgusuyla aynı doğrultuda bir uyarı örneği: nominal büyüme tek başına büyüme kanıtı değildir).
- **Son 5 yıl, standart pencere (2020→2025, n=5):** Nominal **+%63,20**, Reel **+%11,33**, USD **+%15,81**. **DİKKAT:** 2020, pandemi nedeniyle tek bir ve göreli en düşük ödemenin yapıldığı bir yıl; bu düşük taban 5 yıllık büyüme oranını yapay olarak şişiriyor.
- **Alternatif 4 yıl (2021→2025, n=4):** Nominal **+%54,08**, Reel **−%0,11**, USD **+%5,25**. 2020'nin düşük-taban etkisi giderilince reel büyüme pratikte sıfıra yakın, USD büyüme mütevazı — 10 yıllık tablodaki reel/USD düşüşün aksine son dönemde en azından bir "duraklama" sinyali var ama güçlü bir reel büyüme kanıtı değil.

### Eksiklik uyarısı

2023, 2024 ve 2025 yıl toplamları, CASHFLOW.md'nin bağımsız kaynaklı FY nakit temettü rakamlarıyla çapraz kontrol edilince **sistematik olarak düşük** çıkıyor:

| Yıl | Bu turda hesaplanan toplam (37.264.000 pay x nominal) | CASHFLOW.md FY ödenen nakit temettü | Fark (≈TL/pay) |
|---|---:|---:|---:|
| 2023 | 155.018.240 TRY | 227.003.595 TRY | ~1,93 TL/pay (~%32 eksik) |
| 2024 | 289.541.280 TRY | 363.308.690 TRY | ~1,98 TL/pay (~%20 eksik) |
| 2025 | 560.823.200 TRY | 656.505.044 TRY | ~2,57 TL/pay (~%15 eksik) |

Bu, AKMGY.md'nin 20 satırlık dizisinin bu üç yıl için muhtemelen **en az bir eksik avans ödemesi** içerdiğini gösteriyor (2023 ve 2024'te yalnızca tek "Nihai" ödeme var, oysa 2019/2021/2022 gibi yıllarda birden fazla ödeme kaydedilmiş — desen kırılması). **Eksik ödemenin tarihi/tutarı bu turda uydurulmadı.** Bulunursa yukarıdaki CAGR rakamları, özellikle 10y ve 4y hesapları, değişebilir — muhtemelen biraz daha yüksek nominal/reel/USD büyüme çıkar, ama yön (10y'de reel/USD negatif) değişmeyebilir çünkü eksik tutarlar küçük (yıllık toplamın %15-32'si).

---

## 4. Süreklilik (büyümeden ayrı)

2016-2025 arası **HER takvim yılında** en az bir ödeme kaydı var — tek yıllık tam kesinti yok (2020 pandemi yılı dahil, tek taksit ve göreli düşük tutarla ödeme sürdü). **Bu, büyümeden ayrı bir bulgudur:** 10 yıllık dönemde süreklilik TAM (kesinti yok) ama reel/USD büyüme NEGATİF (CAGR −%4,49 / −%6,25) — "hiç kesmedi" ile "reel olarak büyüdü" aynı şey değildir.

---

## 5. Sürdürülebilirlik sentezi (CFO/CAPEX/payout)

Kaynak: independent-audit turunun CASHFLOW.md'si (bu turda birincil kaynaktan üretilmiş 6 dönemlik seri; **aktarıldı, bu çalışmada yeniden doğrulanmadı**).

| FY | Basis | CFO (TL) | CAPEX (TL) | FCF (TL) | Ödenen nakit temettü (TL) | Payout/CFO |
|---|---|---:|---:|---:|---:|---:|
| 2020 | Nominal | 62.435.127 | 1.473.692 | 60.961.435 | 48.443.200 | %77,6 |
| 2021 | Nominal | 81.495.864 | 2.832.230 | 78.663.634 | 99.494.880 | **%122,1** ⚠ |
| 2022 | Nominal | 158.090.978 | 4.564.458 | 153.526.520 | 109.183.520 | %69,1 |
| 2023 | @Dec2023 PP | 260.195.206 | 24.584.406 | 235.610.800 | 227.003.595 | %87,2 |
| 2024 | @Dec2024 PP | 473.011.521 | 38.861.463 | 434.150.058 | 363.308.690 | %76,8 |
| 2025 | @Dec2025 PP | 552.923.054 | 37.950.169 | 514.972.885 | **656.505.044** | **%118,7** ⚠ |

**FY2021 ve FY2025'te ödenen nakit temettü, o yılın CFO'sunu aşıyor** (fark, dönem başı/sonu nakit stokundan karşılanmış; şirketin dönem sonu nakit stoku 633,8M TRY ile hâlâ yüksek). Bu, önceki turun "payout-to-CFO hiç hesaplanamadı" tespitini **çürüttü** — ama sonuç **tek yönlü olumlu değil**: kanıt kalitesinin Yüksek'e yükselmesi (artık birincil, 6 dönemlik, çakışmayan bir seri var) ile sonucun olumlu çıkması **ayrı şeylerdir** — burada kanıt kalitesi arttı VE sonuç iki yılda CFO'yu aşan bir ödeme paterni ortaya çıkardı.

**GYO'ya özgü metodolojik not:** CFO bazlı payout oranı, net kâr bazlı payout oranından (önceki turun %70-90 bandı) daha güvenilirdir — CFO tanımı itibariyle gerçekleşmemiş gayrimenkul yeniden değerleme (gerçeğe uygun değer) kazancını zaten dışarıda bırakır; net kâr bazlı oran (2023'ün %99,53 net kâr marjı gibi muhtemelen büyük oranda değerleme kazancı içeren yıllarda) yanıltıcı olabilirdi. Gelir tablosu kira geliri/FAVÖK/gerçeğe uygun değer kazancı ayrıştırması iki turda da yapılamadı.

**%97,67 doluluk ve Klepierre S.A. (%44,85) ortaklığı:** Yüksek doluluk ve deneyimli uluslararası bir AVM operatörünün en büyük ortak olması olumlu yapısal nitelikler olarak aktarılıyor (ikincil kaynak, birincil faaliyet raporu teyidi yok). **NAD çelişkisi** (bilanço vekili NAD ile bağımsız ekspertiz bazlı düzeltilmiş NAD arasında köprü eksik) üç turda da çözülemedi.

---

## 6. Hukuki risk (aktarıldı, yeniden doğrulanmadı)

3 Aralık 2025 Beşiktaş Belediyesi Encümen Kararı: AVM'deki bazı bağımsız bölümlerin 1994/2015 onaylı mimari projelere aykırı birleştirildiği tespit edilerek **75,8 milyon TL** peşin + **3,4 milyar TL'ye kadar şarta bağlı** idari para cezası kesildi; 31 Aralık 2025'te ayrıca **yıkım kararı** alındı. Şirketin açtığı iptal/yürütmeyi durdurma davaları İstanbul 3. İdare Mahkemesi'nde 16 Ekim 2026'da **ilk derecede reddedildi**; şirket istinaf başvurusunda bulundu, **2026-11-10 itibarıyla sonuç belirsiz**.

Bağımsız denetim, önceki turun yalnızca 3 dava (2025/2596, 2025/2597, 2025/2503) saydığını, gerçekte **en az 4 (muhtemelen 5)** dava olduğunu buldu — 2026/334 ve 2026/335 çifti önceki raporda hiç yoktu. Hukuki riskin kapsamı önceki turda sanılandan **daha geniş**.

Finansal tablolarda bu risk için karşılık/şarta bağlı yükümlülük notu ayrılıp ayrılmadığı iki turda da doğrulanamadı. dividend-portfolio-decision turu bu maddeyi **"Kritik öncelik #1"** olarak işaretledi: istinaf sonucu netleşene kadar pozisyon büyüklüğü küçük/tamamlayıcı tutulmalı.

---

## 7. Kanıt güvenilirliği (bölüm bazlı)

- **dividendHistoryConfidence: Orta/Düşük** — Ödeme tarihleri/tutarları iki ikincil kaynaktan (Midas, Investing.com) geliyor ve CASHFLOW.md'nin yıl toplamlarıyla 2020-2022 için tam/yakın örtüşüyor (yükseltici kanıt). Ama profitYear atamaları 20 satırın yalnızca 6'sında teyitli ve 2023-2025 için en az bir eksik ödeme satırı tespit edildi — bu iki zayıflık genel güveni Orta'nın altına çekiyor.
- **cashFlowConfidence: Yüksek (bu turda yükseldi)** — CFO/CAPEX/FCF/payout 6 dönemlik birincil kaynaklı seri artık mevcut. **Kanıt kalitesinin yükselmesi ile sonucun olumlu çıkması ayrı şeylerdir:** bu yüksek kaliteli kanıt, FY2021 ve FY2025'te ödenen temettünün CFO'yu aştığını gösterdi.
- **riskAssessmentConfidence: Düşük/Orta** — Sürecin varlığı/büyüklüğü/ilk derece reddi iyi belgelenmiş ama nihai sonuç istinafta belirsiz, dava sayısı turlar arasında değişti (3→4+), finansal tablo karşılık notu doğrulanamadı.

---

## 8. Kaynaklar

- `dividend-screening-20261110/companies/AKMGY.json` + `AKMGY.md` (1. tur — temettü tablosu, ortaklık yapısı, yapısal riskler)
- `dividend-screening-independent-audit-20261110/AUDIT.md, CASHFLOW.md, RISK_REVIEW.md, DATA_GAPS.md, FINAL_SHORTLIST.md` (2. tur — bağımsız denetim)
- `dividend-portfolio-decision-20261110/COMPANY_DECISIONS.md, UNRESOLVED_ISSUES.md` (3. tur — portföy kararı bağlamı)
- `_reference/lookup.cjs`, `tufe_linked_index.json`, `usdtry_daily.json`, `MACRO_REFERENCE.md` (bu turun ortak FX/TÜFE referansı)
- Rotaborsa (2025 temettü kararı haberi) — bu turda yalnızca pay sayısı aritmetik çapraz kontrolünde kullanıldı, yeniden web araştırması yapılmadı

**Araştırmayı yapan:** Claude (Sonnet 5), subagent oturumu, 4. tur (önceki üç turun derlemesi + büyüme hesabı). **Sınıflandırma yapılmadı.**
