# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Claude — **Tarih:** 2026-10-25

XLSX import artık iki kaynaklı: Dosya Yükle ve URL'den Yükle, aynı önizleme/onay/kalıcı yazma akışıyla. TUPRS araştırması kısmi; başka hisseye geçme.

- `ResearchTransfer.tsx`: Import modalında `Segmented<'FILE'|'URL'>` kaynak seçici eklendi. Ortak `importBuffer()` (session→readResearchWorkbook→preview isteği→setPreview) her iki kaynaktan da çağrılır; ikinci bir parser/import sistemi yazılmadı.
- `src/lib/researchUrlImport.ts` (yeni): `sanitizeResearchUrl` yalnızca aynı origin `/research/...xlsx` yollarına izin verir (regex: alfasayısal/`_`/`.`/`-` segmentler, zorunlu `.xlsx` sonu); `https://`, `//`, `..`, sorgu parametresi, yanlış uzantı reddedilir — ağ isteği **önce** doğrulanır, sonra atılır. `fetchResearchWorkbookFromUrl` indirir; `response.ok`, `text/html` (SPA fallback) ve `content-length`/gerçek `byteLength` ile `MAX_WORKBOOK_BYTES` (8 MiB) kontrolü yapar.
- `public/research/` eklendi (Vite public, statik servis); kullanım notu `public/research/README.md`'de. Yeni kök `investulator-fe/README.md`: ayrı `INVESTULATOR_RESEARCH_WRITE=1` PowerShell komutu ve URL kısıtları.
- i18n: `researchTransfer.sourceFile/sourceUrl/urlLabel/urlHint/urlLoad` ve `errors.url/errors.fetch` (tr+en) eklendi.
- Testler (yeni): `src/__tests__/lib/researchUrlImport.test.ts` (16 test, URL doğrulama + fetch sınırları) ve `src/__tests__/components/ResearchTransferUrlImport.test.tsx` (6 test: dosya/URL aynı önizleme sonucu — gerçek `previewWorkbook` motoruyla mock fetch üzerinden —, yeni şirket ekleme, yasak URL/404/boyut/format hataları). Ağır (33k alanlı gerçek TUPRS bundle) testlerde tam suite altında CPU yüküyle `findByText` varsayılan 1000ms'yi aşabildiği görüldü; `{timeout:30000}` ile düzeltildi.
- Tüm Vitest suite (coverage'sız) çalıştırıldı: **525 testten 520 geçti**, kalan 5 başarısız (`AnalysisPage.test.tsx` 4 test, `services/research.test.ts` 1 test) **bu işten önce de var olan, ilgisiz** bir regresyon — `src/data/research/analysis-reports.json` içeriği zaten `tuprs-2026-10-25-v7` iken ilgili test dosyaları hâlâ eski `v6` sabit değerini bekliyor (önceki oturumdaki veri güncellemesi test fikstürlerine yansımamış). Bu PR kapsamında dokunulmadı; ayrı düzeltme gerekir.
- `npx tsc -b`: hatasız. `npm run lint`: hatasız (3 önceden var olan `vitest(require-mock-type-parameters)` uyarısı korunur, yeni hata/uyarı yok). `npm run build`: başarılı (mevcut ana paket boyutu uyarısı sürüyor). `npm run format`/`format:check`: temiz.
- Önceki ŞU AN (dönem/F-K/bütüncül değerlendirme teslimi) değişmedi; ayrıntı hâlâ [XLSX_DONEM_VE_SIRKET_ANALIZI_20261025.md](../XLSX_DONEM_VE_SIRKET_ANALIZI_20261025.md). Backend/Keycloak/runtime AI/portföy işlemleri değişmedi; commit/push yok.

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

- **2026-10-25 — Codex:** Son geçerli dönem, ayrı finansal/fiyat görünümü ve kontrollü kalıcı XLSX aktarımı eklendi. 90/90 ilgili test geçti; 0 başarısız. Tam suite/coverage çalıştırılmadı. Üretim API ve finansal kaynak eksikleri teslim belgesinde açıklandı.

- **2026-10-25 — Claude:** XLSX Import'a **URL'den Yükle** seçeneği eklendi (`/research/...xlsx`, aynı origin, mevcut önizleme/onay/kalıcı yazma akışı korunur); `sanitizeResearchUrl`/`fetchResearchWorkbookFromUrl` (`src/lib/researchUrlImport.ts`), i18n, `public/research/` ve kök `README.md` (PowerShell başlatma komutu) eklendi. Tüm suite çalıştırıldı: 520/525 geçti; kalan 5 başarısız test bu işten bağımsız, önceki oturumun v6→v7 veri güncellemesinden kalan stale fikstür (`AnalysisPage.test.tsx`, `services/research.test.ts`) — düzeltilmedi, ayrıca not edildi. tsc/lint/build/format temiz. Commit/push yapılmadı.
