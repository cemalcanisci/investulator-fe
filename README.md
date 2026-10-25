# investulator-fe

React + TypeScript + Vite istemcisi. Ürün ve domain kararları için önce kökteki [`../CLAUDE.md`](../CLAUDE.md)'yi, bu klasöre özel geliştirme kurallarını [`CLAUDE.md`](CLAUDE.md)'yi okuyun.

## Geliştirme sunucusu

```bash
npm install
npm run dev
```

Diğer komutlar (`build`, `lint`, `test`, `test:coverage`…) için [`CLAUDE.md`](CLAUDE.md)'deki "Komutlar" bölümüne bakın.

## Araştırma Excel importu — kalıcı yazma sunucusu

`/stratejiler` sayfasındaki Import penceresi iki kaynaktan okuyabilir:

- **Dosya Yükle** — bilgisayardan seçilen `.xlsx` dosyası.
- **URL'den Yükle** — bu sitenin `public/research/` klasörüne konan bir `.xlsx` dosyasının `/research/...` yolu (örn. `/research/SISE_sifirdan_arastirilmis_finansal_import.xlsx`).

Her iki yol da aynı ön izleme/onay/kalıcı yazma akışını ve aynı doğrulama kurallarını kullanır; dosyanın yalnızca indirilmesi/okunması kayıt oluşturmaz.

`URL'den Yükle` yalnızca aynı origin'deki `/research/` klasörü altındaki `.xlsx` dosyalarına izin verir: `https://` ile başlayan dış bağlantılar, `..` içeren yollar, sorgu parametreleri (`?...`) ve `.xlsx` dışındaki uzantılar reddedilir.

Ön izlemeyi onaylayıp kalıcı olarak kaydetme ve geri alma, yalnızca `INVESTULATOR_RESEARCH_WRITE=1` ortam değişkeniyle başlatılan **ayrı** bir yerel Vite sunucusunda çalışır (üretim API'si değildir). Windows PowerShell'de, `investulator-fe` klasöründe, **ayrı bir terminalde** çalıştırın — mevcut `5173` portundaki `npm run dev` sunucusunu durdurmayın:

```powershell
$env:INVESTULATOR_RESEARCH_WRITE = '1'
npm.cmd run dev -- --host 127.0.0.1 --port 5199 --strictPort
```

Bu ortam değişkeni yalnızca bu sunucu sürecine özeldir; tarayıcıya yazmak yeterli değildir, Vite sunucusunun bu değişkenle yeniden başlatılması gerekir. Servis kapalıyken ön izleme denenirse "Kalıcı import kapalı" uyarısı gösterilir.

Ayrıntılı tasarım, şema ve güven sınırları: [`../XLSX_DONEM_VE_SIRKET_ANALIZI_20261025.md`](../XLSX_DONEM_VE_SIRKET_ANALIZI_20261025.md).
