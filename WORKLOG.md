# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-24

Analiz detayının oranlar ve bütüncül değerlendirme geliştirmesi tamamlandı; kullanıcı incelemesi bekleniyor. TUPRS analizi veri açısından kısmi; sonraki hisseye geçme.

- Yeni lib/ratioPresentation: VERIFIED/INDICATIVE/SCENARIO/MISSING_DATA sunumu; mevcut strict hesap/source kapıları değişmedi. PD/DD 1,63 ve altı aylık katsayı 14,93 gösterge; H1 × 2 F/K 7,46 senaryo; piyasa değeri 744,22 milyar TL gösterge. Standart TTM ayrı ve eksik.
- Yeni lib/companyAssessment, CompanyAssessment ve RatioContext: sektöre uygun oranlar, kâr/nakit/borç/temettü ilişkileri, tekilleştirilmiş girdi izi ve kaynak belgeli kıyas/kalite kapıları. TUPRS fiyat sınıfı Belirsiz; emsal/tarihsel aralık ve normalleştirme eksik. Strateji sonucu değiştirmez.
- ResearchMetric/MetricEducation/metricEducation/TR/EN ortak açıklamalar: kaynak, tarih, formül, baz, teknik kontrol ve birincil kaynak ayrımı. ResearchOverview finansal tekrarları yeni özete birleştirildi; faaliyet/risk açıklamaları korundu.
- ResearchPage'de yalnız ApproximateBacktest görünür; altındaki strict anchor kaldırıldı. DividendBacktest bileşeni/motoru/servisi/verisi/testleri ve historyIntegrity korundu. Yaklaşık motor/JSON değişmedi; bütün seçenekler korunur.
- Resmî 2026 H1 ve 2025 yıllık raporlar yeniden incelendi. Farklı TMS29 bazları doğrudan toplanmadı; dört çeyrek TTM bu tur modele eklenmedi. dividendTotal yıl sonu tarihli plan olduğundan geçmiş ödenmiş verim diye kullanılmadı; kart nedeni açıklıyor.
- Yeni ratioPresentation ve RatioContext testleri; ResearchPage ve ApproximateBacktest testleri güncellendi. Bu görevde Vitest/coverage ÇALIŞTIRILMADI; önceki 31 test sonucu yeni kod için geçiş değildir. Build başarılı; lint sıfır hata, üç eski transfer mock uyarısı. Paket boyutu uyarısı sürüyor.
- Ayrı 5199/başsız Chrome ile beş genişlik × iki görünüm, TR/EN ve koyu tema: taşma/runtime hata yok; tek yaklaşık bölüm, strict bölüm/bozuk anchor yok. Kanıtlar ../outputs/ratios-20261024/. Sonraki iş: kullanıcı UI onayı, izin verilirse dar regresyonlar, eksik kıyas ve TTM kaynak mutabakatı.
- Rapor/teknik tasarım: [oranlar ve değerlendirme](../ORANLAR_VE_BUTUNCUL_DEGERLENDIRME_20261024.md). Backend/Keycloak/runtime AI/portföy değişmedi; commit/push yok.

---

## GEÇMİŞ

- **2026-10-21 — Codex:** 15 bulgu için kod/kaynak denetimi ve ortak analiz mimarisi planlandı; üç doğrulama açığı salt okunur tekrar ile belgelendi. Üretim uygulaması kullanıcı onayı bekliyor; ayrıntı kök denetim belgesinde.

_Yeni satırlar en alta eklenir; var olan satırlar değiştirilmez._

- **2026-09-21 — Claude:** Vite iskeleti, tema altyapısı (3 tema, token'lar), i18n (tr+en), `logger`, `AppProviders` kuruldu.
- **2026-09-21 — Claude:** Uygulama kabuğu (`AppShell`: sidebar/drawer/bottom tabs) ve Sayfa 1 (Dashboard: KPI kartları, portföy grafiği, dağılım halkası, en çok kazandıran/kaybettiren, son işlemler, fiyat durumu) yapıldı, onaylandı.
- **2026-09-21 — Claude:** Sayfa 2 (Yatırımlarım) yapıldı: özet kartları, arama/filtre/sıralama, tablo + kart listesi, fiyat durumu rozeti, boş/hata/yükleniyor/sonuç-yok durumları. Renk token kaynağı `design/`'den `src/theme/tokens.ts`'e taşındı, `design/` arşive alındı.
- **2026-09-21 — Claude:** Kullanıcı geri bildirimiyle Sayfa 2'ye eklenenler: çip/select imleci, fiyat+rozet alt alta hizalama, **USD↔TRY gösterim para birimi anahtarı** (`useMoney`, `useCurrency`, `CurrencyProvider`, `services/fx.ts`), **sticky tablo başlığı ve toplam satırı**, **sütun başlığından sıralama** (`SortButton`, `aria-sort`, ikinci tıklama yön çevirir).
- **2026-09-21/22 — Claude:** Sayfa 3 (İşlemler) taslağı sunuldu ve onaylandı; kod yazıldı (liste, filtreler, yeni/düzenle modalı, iptal/iptali kaldır diyaloğu, bellek içi mock servisler — ayrıntı yukarıdaki "ŞU AN"da). Test, tarayıcı doğrulaması ve dokümantasyon **tamamlanmadı**.

- **2026-09-22 — Codex:** İşlemler onaylandı ve testleri tamamlandı; Varlık Detayı yapılıp onaylandı. Analiz ilk sürümü, ortak pointer kuralı ve grafik para birimi erişilebilirliği eklendi; 283 test geçti, Analiz onayı bekleniyor.
- **2026-09-23 — Claude:** Sayfa 7 (Ayarlar) kullanıcı tarafından gereksiz bulunup tamamen kaldırıldı (kod, testler, i18n, worklog/CLAUDE.md güncellendi). Sayfa sayfa tasarım turu bitti; Faz 1 (Keycloak kurulumu) başlıyor.

- **2026-10-02 — Codex:** Genel inceleme yapıldı; işlem saati/sırası, satış öncesi adet, nakitsiz işlem kur bağımlılığı, tür değiştirme, küçük tutar hassasiyeti, tarih ve servis doğrulaması, ondalık sıralama ve aktarım uyumluluğu düzeltildi. 330 test ve beş genişlikte 35 tarayıcı kontrolü geçti; ayrıntılı rapor outputs/review-20261002/INCELEME.md.

- **2026-10-09 — Codex:** dev branch ve GitHub origin kuruldu; ilk aktarım hazırlandı. Kullanıcı public repo kullanımını şimdilik onayladı.

- **2026-10-09 — Codex:** Kullanıcı kararıyla otomatik test çalıştırma ertelendi; Husky test adımı kaldırıldı, lint korundu.

- **2026-10-11 — Codex:** Stratejiler/Takip Listesi ilk ekranı, ayrı seed/oturum verisi, grup/üyelik yönetimi, TR/EN ve yeni test kodları eklendi; otomatik test çalıştırılmadı, kullanıcı onayı bekleniyor.

- **2026-10-11 — Codex:** Grup filtresi toggle düzeltildi; kaynaklı TUPRS frontend araştırma ekranı, KAP/borç/FX açıklamaları ve test kodları eklendi. Otomatik test çalıştırılmadı; görsel kontrol araç bağlantısına takıldı.

- **2026-10-11 — Codex:** Kullanıcı geri bildirimiyle açıklamalı oranlar, ucuzluk değerlendirmesi, şirket/ortaklık/siyasi risk özeti v2 olarak eklendi. Skill kalıcılaştırması kullanıcı onayından sonraya bırakıldı.

- **2026-10-11 — Codex:** V3 uzun vadeli temettü, SAF/elektrik/hidrojen fırsatları ve izleme koşulları eklendi. V2 onaylı standart skill’lere aktarıldı; build/lint tamamlandı, otomatik test çalıştırılmadı.

- **2026-10-20 — Codex:** Aylık USD katkı ve temettü yeniden yatırım hesaplayıcısı eklendi; basit kâr/yıl ile yıllık bileşik model getirisi ayrıldı. Testler yazıldı; otomatik çalıştırılmadı.

- **2026-10-20 — Codex:** Kullanıcı düzeltmesiyle gelecek projeksiyonu kaldırıldı; TUPRS 10/15/20 yıllık kaynaklı yaklaşık tarihsel birikim, ödeme günü yeniden yatırım, XIRR, eksik geçmiş durumları ve TR/EN ortak bileşen eklendi. Tüm temettü hisseleri kapsamı üç skill’e aktarıldı; testler yazıldı, otomatik çalıştırılmadı.

- **2026-10-21 — Codex:** A–C: ortak analiz sözleşmesi/doğrulama/profiller, TUPRS v4 yerel JSON, backtest bütünlük kapısı ve TR/EN detay ekranı uygulandı. Test kodları yazıldı, otomatik çalıştırılmadı; 15 bulgu yeniden denetimi ve açık riskler belgelendi.

- **2026-10-22 — Codex:** Yedi takip maddesi mevcut kodla karşılaştırıldı; manifest bağımsızlık kanıtı, ekonomik dönem/varsayım ilişkileri, strateji öncelikleri ve TMS29 izlenebilirliği için sınırlı düzeltme ve ayrı TUPRS tamamlama planı sunuldu. Üretim kodu değişmedi; onay bekleniyor.

- **2026-10-22 — Codex:** Onaylanan kanıt/bağımsızlık, ekonomik dönem/TMS29 ve strateji önceliği düzeltmeleri; TUPRS v5 birincil belge mutabakatı ve açık bölüm planı eklendi. Analiz kısmi, otomatik testler çalıştırılmadı.

- **2026-10-23 — Codex:** Analiz UX: ortak metrik eğitimi, EASY/DETAILED, genel bakış, uyumlu tarihsel/akran karşılaştırması ve simülasyon korunma regresyonları eklendi. Build/lint/tarayıcı kontrolleri yapıldı; Vitest/coverage çalıştırılmadı.

- **2026-10-23 — Codex:** Ortak yaklaşık simülasyon, gerçek TUPRS aylık snapshot, iki seviyeli sunum ve regresyonlar eklendi. Üç vade yaklaşık hesaplanıyor; strict kapılar korunuyor.

- **2026-10-24 — Codex:** Yaklaşık simülasyonda 18 senaryo bağımsız algoritmayla eşleşti; 31 ilgili Vitest testi izinle geçti. 67 aylık fiyat farkı ve kaynak eksikleri belgelendi; uygulama değiştirilmedi.

- **2026-10-24 — Codex:** Oran durumları, ortak bütüncül değerlendirme ve tek simülasyon arayüzü tamamlandı; kaynak eksikleri açık, yeni regresyonlar yazıldı fakat çalıştırılmadı.
