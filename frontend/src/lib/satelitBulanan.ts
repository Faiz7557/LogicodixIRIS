/* Nama bulan dan angka ringkas untuk tampilan data satelit per bulan (tabel `desa_bulan`). */
import type { DesaTahun } from "./types";

export const NAMA_BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] as const;
export const NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"] as const;

export type StatistikSatelit = {
  terdeteksi: number;
  totalTahun: number;
  /** Bulan yang paling sering punya titik api, beserta jumlah tahun dan total harinya. */
  rawan: { i: number; tahunAda: number; hari: number };
  /** Tahun dengan hari deteksi terbanyak. */
  terpadat: { tahun: number; detDays: number };
  /** Indeks bulan yang masuk musim: tahunAda minimal separuh bulan rawan. */
  musim: number[];
  /** Jumlah titik api seluruh tahun (tabel matriks "Titik api" di Informasi detail). */
  titikTotal: number;
  /** Jumlah hari deteksi seluruh tahun (tabel matriks "Hari deteksi"). */
  hariTotal: number;
  /** Tahun dengan titik api terbanyak. */
  tahunTitikTerbanyak: number;
};

/**
 * Angka ringkas kalender satelit (tahun terdeteksi, bulan paling rawan, hari terbanyak).
 * Dipakai halaman kesiapan, Informasi detail, dan ringkasan AI, supaya semuanya tidak bisa berbeda.
 */
export function statistikSatelit(strip: DesaTahun[]): StatistikSatelit {
  const bulanKe = (s: DesaTahun, i: number) => (s.bulan ?? [])[i] ?? 0;
  const kosong: StatistikSatelit = {
    terdeteksi: 0,
    totalTahun: 0,
    rawan: { i: 0, tahunAda: 0, hari: 0 },
    terpadat: { tahun: 0, detDays: 0 },
    musim: [],
    titikTotal: 0,
    hariTotal: 0,
    tahunTitikTerbanyak: 0,
  };
  if (strip.length === 0) return kosong;
  const terpadat = strip.reduce((a, b) => (b.detDays > a.detDays ? b : a), strip[0]);
  const titikTerbanyak = strip.reduce((a, b) => (b.nDet > a.nDet ? b : a), strip[0]);
  const perBulan = NAMA_BULAN.map((_, i) => ({
    i,
    tahunAda: strip.filter((s) => bulanKe(s, i) > 0).length,
    hari: strip.reduce((a, s) => a + bulanKe(s, i), 0),
  }));
  const rawan = [...perBulan].sort((a, b) => b.tahunAda - a.tahunAda || b.hari - a.hari)[0];
  return {
    terdeteksi: strip.filter((s) => s.terpapar).length,
    totalTahun: strip.length,
    rawan,
    terpadat: { tahun: terpadat.tahun, detDays: rawan.hari === 0 ? 0 : terpadat.detDays },
    musim: rawan.hari === 0 ? [] : perBulan.filter((b) => b.tahunAda >= Math.max(1, rawan.tahunAda / 2)).map((b) => b.i),
    titikTotal: strip.reduce((a, s) => a + s.nDet, 0),
    hariTotal: strip.reduce((a, s) => a + s.detDays, 0),
    tahunTitikTerbanyak: titikTerbanyak.tahun,
  };
}
