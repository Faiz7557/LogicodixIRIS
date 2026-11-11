/*
 * DEMO: sebaran hari deteksi satelit per bulan, diperkirakan dari total hari per tahun (desa_tahun.det_days).
 * Backend belum menyimpan ringkasan per bulan; FIRMS sebenarnya mencatat tanggal tiap titik api, jadi tabel
 * `desa_bulan` bisa dibuat pipeline. Setelah tabel itu ada, fungsi ini diganti data asli.
 *
 * Pola musim memakai bobot umum Kalimantan: kemarau dan puncak titik api Agustus sampai Oktober.
 * Hasil deterministik (benih dari kode desa dan tahun), total per tahun tetap sama, tiap bulan dibatasi jumlah harinya.
 */

const BOBOT_MUSIM = [1, 1, 2, 2, 2, 3, 6, 13, 18, 12, 4, 1]; // Jan..Des
const HARI_BULAN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function benih(teks: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < teks.length; i++) h = Math.imul(h ^ teks.charCodeAt(i), 16777619);
  let x = h >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

/** Bagi `hari` deteksi setahun ke 12 bulan. Tahun kering ekstrem lebih terpusat di puncak kemarau. */
export function sebarBulanan(kode: string, tahun: number, hari: number, ekstrem: boolean): number[] {
  if (hari <= 0) return Array(12).fill(0);
  const acak = benih(`${kode}:${tahun}`);
  const geser = Math.floor(acak() * 3) - 1; // puncak bisa maju atau mundur sebulan
  const bobot = BOBOT_MUSIM.map((_, i) => {
    const b = BOBOT_MUSIM[(i - geser + 12) % 12];
    return Math.pow(b, ekstrem ? 1.5 : 1) * (0.7 + acak() * 0.6);
  });
  const jumlah = bobot.reduce((a, b) => a + b, 0);
  const mentah = bobot.map((b) => (b / jumlah) * hari);
  const hasil = mentah.map((m, i) => Math.min(Math.floor(m), HARI_BULAN[i]));
  // Sisa dibagi ke bulan dengan pecahan terbesar (yang masih punya ruang hari).
  let sisa = hari - hasil.reduce((a, b) => a + b, 0);
  const urut = mentah.map((m, i) => ({ i, f: m - Math.floor(m) })).sort((a, b) => b.f - a.f || bobot[b.i] - bobot[a.i]);
  while (sisa > 0) {
    let dibagi = false;
    for (const { i } of urut) {
      if (sisa === 0) break;
      if (hasil[i] < HARI_BULAN[i]) {
        hasil[i]++;
        sisa--;
        dibagi = true;
      }
    }
    if (!dibagi) break;
  }
  return hasil;
}

export const NAMA_BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] as const;
export const NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"] as const;
