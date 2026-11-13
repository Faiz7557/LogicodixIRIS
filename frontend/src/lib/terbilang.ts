/*
 * Terbilang: angka rupiah menjadi kata, untuk surat permohonan anggaran ("Lima Ratus Dua Puluh Delapan Juta Rupiah").
 * Bilangan bulat 0 sampai di bawah 1 kuadriliun.
 */
const SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

function kata(n: number): string {
  if (n < 12) return SATUAN[n];
  if (n < 20) return `${kata(n - 10)} belas`;
  if (n < 100) return `${kata(Math.floor(n / 10))} puluh ${kata(n % 10)}`;
  if (n < 200) return `seratus ${kata(n - 100)}`;
  if (n < 1000) return `${kata(Math.floor(n / 100))} ratus ${kata(n % 100)}`;
  if (n < 2000) return `seribu ${kata(n - 1000)}`;
  if (n < 1e6) return `${kata(Math.floor(n / 1000))} ribu ${kata(n % 1000)}`;
  if (n < 1e9) return `${kata(Math.floor(n / 1e6))} juta ${kata(n % 1e6)}`;
  if (n < 1e12) return `${kata(Math.floor(n / 1e9))} miliar ${kata(n % 1e9)}`;
  return `${kata(Math.floor(n / 1e12))} triliun ${kata(n % 1e12)}`;
}

/** 528000000 -> "lima ratus dua puluh delapan juta". */
export function terbilang(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n >= 1e15) throw new RangeError("Terbilang hanya untuk bilangan bulat 0 sampai di bawah 1 kuadriliun.");
  if (n === 0) return "nol";
  return kata(n).replace(/\s+/g, " ").trim();
}

/** 528000000 -> "Lima Ratus Dua Puluh Delapan Juta Rupiah" (huruf besar tiap kata, seperti di surat). */
export function terbilangRupiah(n: number): string {
  return `${terbilang(n)} rupiah`.replace(/\b\p{L}/gu, (h) => h.toUpperCase());
}
