# PAGYO (Panora GYO) — Temettü Büyümesi Veri Derlemesi (4. Tur)

**Kesim tarihi:** 2026-11-10. **Kapsam:** Bu rapor **sınıflandırma yapmaz** (A/B/C/D kararı merkezi sentezde verilecek). Yalnızca üç önceki turun (temettü eleme, bağımsız denetim, portföy kararı) PAGYO bulgularını özetler, eksik ödeme tarihi/toplam nakit alanlarını PAGYO.md'den bulunabilen gerçek veri veya pay-sayısı türetmesiyle tamamlar ve nominal/reel/USD temettü büyüme serisini hesaplar.

## 1. Önceki üç turun özeti (yeniden doğrulanmadı, aktarılıyor)

- **1. tur (temettü eleme):** 2016-2025 arası her takvim yılında en az bir nakit temettü (pandemi dahil, kesinti yok); pratikte sıfır finansal borç/net nakit; kategori **B — Koşullu Aday** (tek-varlık/tek-şehir yoğunlaşması ve doluluk eğilimi A'yı engelliyor).
- **2. tur (bağımsız denetim):** Kategori değişmedi (B). Doluluk oranı çelişkisi **doğrulandı AMA büyüdü**: ekspertizin DCF tablosu 2025 için %91, FY2025 Not 6 duyarlılık notu %97-98, FY2024'ün KENDİ Not 6'sı 2024 için %95-96 — **üç belge birbirini tutmuyor**. Ayrıca **yeni** bir pay sayısı tutarsızlığı bulundu: KAP'ın beyan ettiği 87,0M pay ile denetimin başka bir hesaptan çıkardığı ~89,4M pay arasında ~%2,7 fark, çözülemedi. Süreklilik kanıtı 2014'e kadar genişletildi (ama o dönemin TL/pay rakamı bulunamadı). Bu iki şirket (YGGYO/PAGYO) denetimi zaman kısıtı nedeniyle **web taraması yapmadı**, 9A2026 net kâr çelişkisi (675,7M vs 681,9M TL) web doğrulaması bekliyor.
- **3. tur (portföy kararı):** Kategori değişmedi (B, "Orta" güven). Tek-varlık yoğunlaşması ve üçe büyüyen doluluk çelişkisi "ayrı ama birbirini güçlendiren iki risk ekseni" olarak değerlendirildi; her ikisi de tek başına C gerektirmiyor.

## 2. Bu turda yapılan: eksik alanların tamamlanması

`PAGYO.json`'daki (1. tur) `paymentDate` alanı yalnızca 2026 satırında doluydu. **PAGYO.md Bölüm 2'deki "taksit tarihleri" tablosu taranarak** 2016-2025 için gerçek (tahmini değil, ikincil kaynaklı ama somut) ilk taksit tarihleri bulundu — "1 Mayıs yaklaşık tarih" varsayımına **gerek kalmadı**. Çok taksitli yıllarda (örn. 2021: 6 taksit, Ocak-Ekim; 2019: 4 taksit, Mart-Haziran) FX/TÜFE eşleştirmesi için **ilk taksit tarihi** kullanıldı — bu, gerçek ağırlıklı ortalama ödeme tarihinden sapabilen bir yaklaşıklıktır ve açıkça işaretlenmiştir.

`totalCashTRY` 2016-2024 için `grossPerShareTRY × 87.000.000` ile **türetildi** (PAGYO.md: "Çıkarılmış sermaye 87.000.000 TL, 87.000.000 pay... 31.12.2025-30.06.2026 arasında değişiklik olmadı"; bu dönemde bedelsiz/bölünme kaydı bulunamadı). **Ancak** 2. tur denetiminin bulduğu ~%2,7'lik çözülmemiş pay sayısı tutarsızlığı (87,0M beyan vs ~89,4M çıkarım) nedeniyle bu türetilmiş toplamlar ek bir belirsizlik taşır — pay sayısının 2016-2024 için sabit kaldığı sadece "bulunamayan kurumsal aksiyon" gözlemine dayanır, bağımsız teyit değildir. 2025 ve 2026 satırlarındaki orijinal rakamlar (biri "yaklaşık", 2026'da ayrıca "fiilen ödenen" ikinci bir rakam) **değiştirilmeden, ikisi de korunarak** taşındı.

## 3. Nominal/Reel/USD büyüme serisi

Kaynak: `_reference/lookup.cjs` (ortak TÜFE/USD-TRY referansı, baz ay **2026-10**). Hiçbir kur/TÜFE değeri bu script dışında kullanılmadı.

| Ödeme yılı | Kâr yılı | Brüt TL/pay (nominal) | Reel TL/pay (2026-10 bazı) | USD/pay |
| --- | --- | ---: | ---: | ---: |
| 2016 | 2015 | 0,4478 | 7,3162 | 0,15640 |
| 2017 | 2016 | 0,4388 | 6,4417 | 0,11720 |
| 2018 | 2017 | 0,4871 | 6,4869 | 0,12241 |
| 2019 | 2018 | 0,5727 | 6,3710 | 0,10473 |
| 2020 | 2019 | 0,4430 | 4,4056 | 0,06767 |
| 2021 | 2020 | 0,4580 | 3,9983 | 0,06203 |
| 2022 | 2021 | 0,4100 | 2,0306 | 0,02779 |
| 2023 | 2022 | 1,0548 | 3,6357 | 0,05441 |
| 2024 | 2023 | 2,8639 | 5,3604 | 0,08710 |
| 2025 | 2024 | 5,0622 | 7,4539 | 0,13148 |
| 2026 | 2025 | 5,7545 | 6,2932 | 0,12667 |

**Toplam nakit (87.000.000 pay varsayımıyla, bkz. §2 belirsizlik notu):** 2016: 38,96M → 2026: ~500,6M (yaklaşık) / 514,25M (fiilen ödenen) TL nominal; reel bazda 2016: ~636,5M → 2026: ~547,5M / 562,4M TL (2026-10 satın alma gücü); USD bazda 2016: ~$13,6M → 2026: ~$11,0M / $11,3M.

### CAGR (profitYear bazında)

| Dönem | Nominal TL/pay | Reel TL/pay (2026-10) | USD/pay |
| --- | ---: | ---: | ---: |
| **10 yıl** (profitYear 2015→2025) | **+29,09%/yıl** | **-1,49%/yıl** | **-2,09%/yıl** |
| **Son 5 yıl** (profitYear 2020→2025) | **+65,89%/yıl** | **+9,50%/yıl** | **+15,35%/yıl** |

**Kritik bulgu:** 10 yıllık nominal CAGR (%29) tamamen enflasyon/kur telafisidir — reel ve USD bazda 10 yılın net sonucu HAFİF KÜÇÜLME, büyüme değil. Ama bu düz görünüm bir **V-şekli** gizliyor: reel/USD temettü 2016'dan 2022'ye kadar 6 yıl sürekli eridi (reel TL/pay 7,32 → 2,03; USD/pay 0,1564 → 0,0278), sonra 2023-2025'te hızla toparlandı (reel 2,03 → 7,45, 2016 seviyesinin üzerine çıktı), 2026'da hafif geri çekildi (6,29). **Son 5 yılın CAGR'ı bu nedenle gerçek bir reel/USD büyüme hikâyesidir, ama 10 yıllık CAGR bunu "düz" gösterip yanıltıcı olabilir** — ikisi birlikte okunmalı.

### 2022→2023 ve 2024→2025 sıçramaları: gerçek büyüme mi, telafi mi?

| Geçiş | Nominal çarpan | Reel çarpan | USD çarpan | Yorum |
| --- | ---: | ---: | ---: | --- |
| 2022→2023 (0,41→1,0548) | 2,573x | **1,790x** | **1,958x** | SADECE telafi değil — reel bazda da %79, USD bazda da %96 gerçek artış var. Ama bu dönemin (2022-2023 kâr yılı) kârının büyük kısmı **nakit olmayan yeniden değerleme kazancı** (2023'te 2,64 mr TL net kârın yalnızca ~268M TL'si nakit/değerleme-dışı) — artışın kaynağı düşük kalitede. |
| 2024→2025 (2,8639→5,0622) | 1,768x | **1,391x** | **1,510x** | Reel bazda %39, USD bazda %51 gerçek artış — daha sağlam bir nakit temelde (2025 kâr yılı FCF'si ~628,5M TL, ödenen ~500,6M TL temettüyü rahatça karşılıyor; 7524 sayılı Kanun'un 2025 asgari dağıtım zorunluluğu öncesine denk geliyor). |

**Sonuç:** İkisi de kısmen gerçek reel/USD büyümedir, sadece enflasyon/kur telafisi değildir — ama ilk sıçramanın (2022→2023) altındaki kâr kalitesi (nakit olmayan değerleme kazancı) ikinci sıçramadan (2024→2025, CFO/FCF ile daha sağlam desteklenmiş) daha zayıftır.

## 4. Sürdürülebilirlik sentezi (GYO'ya özgü yaklaşım)

Net nakit pozisyonu güçlü: H1 2026 net finansal borç **-278.274.394 TL** (net nakit); FY2021-2025 bankadan finansal borç pratikte ihmal edilebilir (0-7,6M TL). 2025'ten itibaren **7524 sayılı Kanun** GYO'lar için taşınmaz kazançlarının en az %50'sini nakit kâr payı olarak dağıtma zorunluluğu getirdi (SPK/7524 sayılı Kanun) — ileriye dönük süreklilik güvencesi, ama büyük gerçeğe uygun değer kazancı olan yıllarda ek YİAKV vergi maliyeti riski de taşıyor. Kârın büyük kısmı (özellikle 2022-2023) **nakit olmayan yeniden değerleme kazancı**; bu nedenle IFRS net kâr bazlı payout anlamsızdır, analiz CFO/FCF bazlıdır (gerçekleşmemiş değerleme kazançları nakit kârdan ayrılmıştır — GYO'ya özgü kural). **Doluluk oranı artık üç belgeli bir çelişki**: ekspertiz DCF tablosu (2025: %91) vs FY2025 Not 6 (%97-98) vs FY2024'ün kendi Not 6'sı (2024: %95-96) — üçü birbirini tutmuyor. Ayrıca 2026 9 aylık sonuçlarda ikincil kaynakta iki farklı net kâr rakamı (675,7M vs 681,9M TL) var, birincil kaynaktan teyit edilmedi. Bu veri kalitesi sorunları tek başına C kararı gerektirmez ama portföy değeri/NAD güvenilirliğinin girdi kalitesine ciddi bir ihtiyat notu oluşturur ve yukarıdaki reel/USD büyüme hesaplarının (özellikle 2022-2025 toparlanma döneminin) dayandığı kâr tabanının sağlamlığını sorgulatır.

## 5. Kanıt güvenilirliği

- **dividendHistoryConfidence — Düşük-Orta:** Tarihler/tutarlar iki ikincil agregatörle çapraz kontrollü ama tekil KAP kimlikleriyle doğrulanmamış; 2016-2024 toplam nakit türetilmiş (pay sayısı sabitliği teyitsiz, ~%2,7'lik çözülmemiş tutarsızlık var); çok taksitli yıllarda tek-tarih yaklaşıklığı ek hassasiyet kaybı. Sadece 2026 tam birincil kaynaklı.
- **cashFlowConfidence — Orta-Yüksek:** Net nakit pozisyonu ve CFO/CAPEX/FCF serisi (2021-2026 H1) birincil kaynaktan teyitli, 2. tur denetimde spot-check edildi, çelişki bulunmadı.
- **riskAssessmentConfidence — Orta:** Tek-varlık/tek-şehir yoğunlaşması ve vergi riski sağlam kaynaklı; doluluk çelişkisi 2. turda üç belgeye çözülmeden büyüdü — azaltan değil derinleştiren bir bulgu.

## 6. En kritik eksik

Doluluk oranı (3 belge, 3 farklı rakam) ve pay sayısı (87,0M vs ~89,4M, ~%2,7) tutarsızlıkları hâlâ çözülmedi; bu dosya bunları yeniden araştırmadı, olduğu gibi aktardı. 2026 9 aylık net kâr çelişkisi (675,7M vs 681,9M TL) de web doğrulaması beklemeye devam ediyor.

---

**Özet (200 kelime altı):** PAGYO'da 2022→2023 ve 2024→2025 temettü sıçramaları SADECE enflasyon/kur telafisi değil — her ikisinde de gerçek reel ve USD büyüme var (2022→2023: reel 1,79x/USD 1,96x; 2024→2025: reel 1,39x/USD 1,51x), nominal çarpanların (2,57x ve 1,77x) altında ama sıfırın oldukça üzerinde. Ancak 10 yıllık tam resim (profitYear 2015→2025) düz/hafif negatif bir CAGR'a (reel -%1,49/yıl, USD -%2,09/yıl) karşılık geliyor çünkü seri V-şekilli: 2016-2022 arası reel/USD temettü 6 yıl sürekli eridi (reel 7,32→2,03 TL, USD $0,156→$0,028), sonra 2023-2025'te keskin toparlandı (2025 reel zirve 7,45 TL, 2016'nın üzerinde), 2026'da hafif geri çekildi. Son 5 yılın CAGR'ı (reel +%9,50, USD +%15,35) bu nedenle 10 yıllık rakamdan çok daha olumlu ve muhtemelen daha temsili bir büyüme görünümü sunuyor. En kritik eksik: doluluk oranı artık ÜÇ belgede üç farklı rakam (ekspertiz DCF %91, FY2025 Not 6 %97-98, FY2024 Not 6 %95-96) ve pay sayısında (87,0M vs ~89,4M, ~%2,7) çözülmemiş bir tutarsızlık var; ikisi de bu turda yeniden araştırılmadı, yalnızca önceki turlardan aktarıldı ve 2016-2024 toplam nakit türetmelerine ek belirsizlik taşıyor.
