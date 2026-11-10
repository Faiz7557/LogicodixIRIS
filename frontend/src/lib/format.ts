/*
 * Format angka dan tanggal gaya Indonesia.
 * Ditulis manual (bukan Intl) agar hasilnya sama di server, browser, dan tes,
 * termasuk tanpa data locale.
 */

function groupThousands(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 1234.5 -> "1.234,5". `digits` = jumlah desimal tetap. */
export function formatAngka(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "–";
  const neg = n < 0;
  const [i, d] = Math.abs(n).toFixed(digits).split(".");
  return `${neg ? "-" : ""}${groupThousands(i)}${d ? `,${d}` : ""}`;
}

/** 7000000 -> "Rp7.000.000". Rupiah selalu bilangan bulat (skema §4). */
export function formatRupiah(n: number): string {
  if (!Number.isFinite(n)) return "–";
  const neg = n < 0;
  return `${neg ? "-" : ""}Rp${groupThousands(String(Math.round(Math.abs(n))))}`;
}

/** Skor kesiapan 0-100 dengan satu desimal: 41.7 -> "41,7". */
export function formatSkor(n: number): string {
  return formatAngka(n, 1);
}

/** Peluang 0-1 -> persen bulat: 0.425 -> "43%". */
export function formatPersen(p: number): string {
  return `${formatAngka(p * 100, 0)}%`;
}

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** ISO UTC -> "12 November 2026" dalam WIB (UTC+7). */
export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "–";
  const wib = new Date(d.getTime() + 7 * 3600_000);
  return `${wib.getUTCDate()} ${BULAN[wib.getUTCMonth()]} ${wib.getUTCFullYear()}`;
}

/** ISO UTC -> "12 November 2026, 10.15 WIB". */
export function formatWaktu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "–";
  const wib = new Date(d.getTime() + 7 * 3600_000);
  const hh = String(wib.getUTCHours()).padStart(2, "0");
  const mm = String(wib.getUTCMinutes()).padStart(2, "0");
  return `${formatTanggal(iso)}, ${hh}.${mm} WIB`;
}

export function namaBulan(bulan: number): string {
  return BULAN[bulan - 1] ?? "–";
}

/** Nama HDX bisa memuat alternatif bergaris miring: "Sungai Raya/ Sei Raya" -> "Sungai Raya". */
export function namaBersih(nama: string): string {
  return nama.split("/")[0].trim();
}
