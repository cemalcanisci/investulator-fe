# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-21

### Aktif çalışma: A–C finansal analiz uygulaması — kullanıcı değerlendirmesi

- Kullanıcı A–C paketlerini onayladı; generic altyapı ve zorunlu veri bütünlüğü öncelikli. Backend/Keycloak/runtime AI, başka hisse, commit/push kapsam dışı.
- Yeni domain/analysis.ts FinancialFact/FactBasis/CalculationResult/AnalysisReport; lib/analysisSchema.ts yerel JSON şema kapısı; analysisValidation.ts kaynak/dönem/para/ölçek/kapsam/muhasebe kontrolü. Mevcut researchCalculations decimal formülleri korunuyor; UI metricResult kapısından geçiyor.
- analysisProfiles iş modeli kayıtları; valuation genel yöntem arayüzü ve normalize EV/FAVÖK hesap stratejisi. Diğer yöntemler girdi sözleşmesi/METHOD_PENDING; gerçek veri yoksa hedef fiyat yok. financialPeriods dört uyumlu çeyrek TTM yardımcı modülü.
- analysis-reports.json bağımsız TUPRS v4; eski TS v1/v2/v3 arşiv. services/analysis + AnalysisRepository yerel adapter, kopyalanmış snapshot ve başarısız yenilemede koruma; compareReports değer/kanıt farkını ayırır.
- historyIntegrity ayrı seans/temettü/aksiyon manifesti ve ham-düzeltilmiş baz kontrolü. dividendBacktest kur kaynak/tarihi ve temettü olay izini deftere ekler; eksik kapsam COMPLETE olmaz. Eski TUPRS JSON'unda manifest olmadığından 10/15/20 yıl MISSING_DATA/COVERAGE. Yaklaşık eski kanıt dosyası korunur.
- ResearchMetric kontrollü engel, AnalysisQuality kaynak/baz paneli, ProfileValuation yöntem/eksik girdiler; ResearchPage profile göre ana metrikler ve nakit kapsamı. Eski finansal/borç/teknik/KAP/eğitim anlatımı arşiv uyarısıyla korunur; doğrulanmamış borç alt toplamı yeniden hesaplanmaz. TR/EN güncellendi.

### Doğrulama

- TypeScript/üretim build başarılı, mevcut bundle boyutu uyarısı sürüyor. Lint başarılı, önceki transfer testlerinde üç mock tipi uyarısı.
- Yeni analysis.test.ts, financialPeriods.test.ts; güncellenen dividendBacktest, araştırma servis/sayfa ve DividendBacktest UI testleri. Kullanıcı politikasına göre Vitest/coverage çalıştırılmadı; %80 iddiası yok.
- Salt okunur son rapor tekrarı ../outputs/analysis-audit-20261021/final-review.cjs → final-evidence.json: 7 PASS, 9 BLOCKED. Borç 68.200.679.000 ve nakit proxy 120.508.319.000 TL korunur. Aynı motorun tekrarı bağımsız denetim değildir.
- 5199 ayrı sunucu; CUA Chrome FrameTree/navigasyon zaman aşımı, IAB yok. Gerçek tarayıcı/beş boyut/tema kabulü tamamlanamadı. 5173 kullanıcı sunucusuna dokunulmadı.

### Açık kalanlar / sırada

- Kullanıcı değerlendirmesini bekle. Tam 15 bulgu durumu ../FINANSAL_ANALIZ_UYGULAMA_SONUCU.md; yöntem sınırları ../FINANSAL_ANALIZ_TEKNIK.md. Kök CLAUDE kalıcı kuralları iki araç için tek kaynak.
- Tam tarihsel manifest ve kurumsal işlem/fiyat teyidi, 5 yıllık seri/akran, TUPRS gerçek TTM, normalize FCF/değerleme, geniş teknik göstergeler, tam KAP ek taraması açık. Bunları tamamlanmış sayma; yeni onay olmadan başka hisse/feature'a geçme.
- Önceki şirket/özet anlatımı onayları ve portföy/strateji ayrımı korunuyor. Otomatik commit/push yapılmadı.

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
