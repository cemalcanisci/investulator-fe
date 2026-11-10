/* oxlint-disable no-console -- CLI aracı, çıktısı stdout'a yazılmak üzere tasarlandı */
/**
 * Ortak TÜFE/USD-TRY referans sorgulayıcı.
 * Kullanım: node lookup.mjs <SEMBOL ya da herhangi bir etiket> <YYYY-MM-DD> [<YYYY-MM-DD> ...]
 * Her tarih için: o günün USD/TRY kapanışı (yoksa CLAUDE.md kuralına göre bir önceki iş günü,
 * en fazla 10 gün geriye bakılır) ve o ayın TÜFE endeksi (2003=100 eşdeğeri, linked) yazdırılır.
 * Hiçbir değer uydurulmaz: 10 gün içinde FX bulunamazsa veya ay endeks tablosunun dışındaysa "null" döner.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const fx = JSON.parse(readFileSync(path.join(dir, 'usdtry_daily.json'), 'utf8'));
const tufe = JSON.parse(readFileSync(path.join(dir, 'tufe_linked_index.json'), 'utf8'));

const BASE_MONTH = '2026-10'; // reel TL hesaplarının baz ayı (en güncel yayımlanmış TÜFE ayı)
const baseIndex = tufe[BASE_MONTH];

function fxOnOrBefore(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  for (let i = 0; i <= 10; i++) {
    const key = d.toISOString().slice(0, 10);
    if (fx[key] != null) {
      return { date: key, rate: fx[key], lookbackDays: i };
    }
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return null;
}

function tufeForMonth(dateStr) {
  const month = dateStr.slice(0, 7);
  return tufe[month] != null ? { month, index: tufe[month] } : null;
}

const args = process.argv.slice(2);
const label = args[0];
const dates = args.slice(1);
console.log(`# ${label} — TÜFE/USD-TRY referans sorgusu (baz ay: ${BASE_MONTH}, baz endeks: ${baseIndex})`);
for (const d of dates) {
  const fxRes = fxOnOrBefore(d);
  const tufeRes = tufeForMonth(d);
  const realFactor = tufeRes ? baseIndex / tufeRes.index : null;
  console.log(JSON.stringify({
    paymentDate: d,
    fxDateUsed: fxRes ? fxRes.date : null,
    fxLookbackDays: fxRes ? fxRes.lookbackDays : null,
    usdTry: fxRes ? fxRes.rate : null,
    tufeMonth: tufeRes ? tufeRes.month : null,
    tufeIndex: tufeRes ? tufeRes.index : null,
    realDeflationFactor_toBaseMonth: realFactor,
  }));
}
