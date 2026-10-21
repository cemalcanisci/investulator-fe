# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-20

### Aktif ekran: Araştırma detayı — tarihsel temettü hesabı değerlendirmede

- Kullanıcı ileriye yönelik varsayım hesaplayıcısını düzeltti: son 10/15/20 yılda yılda 1.000 USD aylık yatırım ve temettünün yeniden yatırılması isteniyor. Yaklaşık tarihsel karşılaştırmayı kabul etti; bütün BIST/yabancı temettü hisselerinde bu kapsam zorunlu.
- `DividendProjection` ve eski varsayım motoru/testleri kaldırıldı. `DividendBacktest`, `lib/dividendBacktest.ts`, `domain/dividendHistory.ts`, `services/dividendHistory.ts` ortak yapı. UI TR/EN, kaynak ve yöntem açıklaması, katkı/değer/kâr/toplam getiri, toplam getiri÷yıl, XIRR ve açılır işlem dökümü içerir.
- TUPRS ayrı araştırma snapshot'ı `data/research/tuprs-dividend-history.json`: 30 Eylül 2026 kesimi, 20 Ekim derlemesi; 2006/2011/2016 Ekim başlangıçları. 5.115 günlük fiyat/kur, kaynaklı temettü takvimi. Tamamlanan aylarda 120/180/240 katkı; brüt temettü, kesirli pay, sıfır vergi/komisyon. Son ödenmemiş temettü alacakta; yeniden yatırılmış sayılmaz.
- Yaklaşık son değerler 10y 38.186,17 USD, 15y 65.135,46 USD, 20y 115.332,70 USD. Basit ortalamalar %28,19/%22,28/%23,83; XIRR %25,61/%17,86/%15,42. Gelecek tahmini veya kişisel net getiri değildir.
- Kaynak incelemesi PARTIAL / NEEDS_REVIEW, aynı ajan. 2023 Eylül sağlayıcı temettü farkı şirket raporuyla düzeltildi; 2008 teklif/nihai kayıt tekilleştirildi. Günlük kurda London gün eşleştirmesi, tatillerde en çok dört gün önceki kur. Ayrıntı `../outputs/research-20261020/INCELEME.md`.
- Katalog kimliğiyle eşleşme; başka hisseye TUPRS verisi verilmez. Eksik kaynak ile kısa borsa geçmişi ayrı; sıfır sonuç uydurulmaz. Portföy/işlem matematiği ve mock/user/research ayrımı korunur. Kriptoda yeni temettü bileşeni gösterilmez.
- Kullanıcının her temettü hissesi için açık talebi üç canonical skill'e eklendi; Codex/Claude kopyaları senkron. V3 uzun vade/fırsat sunumunun diğer kapsamı ayrıca onay bekler.
- Önceki v1/v2/v3 kaynak raporları değişmedi; `/stratejiler` seçim kaldırma ve örnek/kullanıcı ayrımı korunuyor. Backend kalıcılığı/runtime AI yok; Keycloak ertelendi.

### Doğrulama

- TypeScript/üretim derlemesi başarılı; mevcut büyük paket uyarısı sürüyor. Lint yalnız önceki üç mock tipi uyarısıyla tamamlandı.
- Aritmetik yeniden üretim: `node outputs/research-20261020/prepare-history.cjs`; çıktılar `backtest-evidence.json`. Bu Vitest çalıştırması değildir.
- Test kodları eklendi; **Vitest/coverage çalıştırılmadı**, %80 yeni kapsam ölçülmedi. Skill kopya kontrolü başarılı.
- Ayrı 5199 sunucusu ve geçici headless Chrome profiliyle 375/640/768/1024/1440 ölçülerinde yatay taşma kontrolü; mobil, masaüstü, koyu tema ekran görüntüleri `../outputs/research-20261020/` altında. CUA bağlantısı kapalıydı; Chrome protokolüyle doğrulandı. Kullanıcının 5173 sunucusuna dokunulmadı.

### Sırada

1. Kullanıcı tarihsel hesap sunumunu değerlendirecek; başka sayfa/Keycloak'a geçme.
2. Yeni araştırma talimatında yeni tarihli snapshot üret; eski kaynak sürümlerini koru. Bütün temettü hisselerinde aynı kapsamı uygula.
3. Uzun dönem nakit/dağıtım, değerleme ve KAP eklerini tamamla. Backend kalıcılığı sonraki aşamada. Commit/push yapılmadı.

Ayrıntılı yöntem: `../TEMETTU_BIRIKIM_HESABI.md`.

---

## GEÇMİŞ

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
