# public/research/

Stratejiler sayfasındaki Import penceresinin **URL'den Yükle** seçeneği, bu klasöre konan `.xlsx` dosyalarını `/research/<dosya-adı>.xlsx` yolundan okur (Vite bu klasörü olduğu gibi statik sunar).

Yalnızca aynı origin ve bu klasörün altındaki `.xlsx` dosyalarına izin verilir; `https://` ile başlayan dış bağlantılar, `..` içeren yollar ve sorgu parametreleri reddedilir. Dosyanın buradan okunması tek başına kalıcı bir kayıt oluşturmaz; mevcut ön izleme/onay akışı (bkz. [`../../README.md`](../../README.md)) değişmeden sürer.

cd "C:\Users\Can ISCI\Desktop\Projects\investulator\investulator-fe"

$env:INVESTULATOR_RESEARCH_WRITE="1"

npm run dev -- --host 127.0.0.1 --port 5199