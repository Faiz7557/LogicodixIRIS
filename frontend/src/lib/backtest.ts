/*
 * Kesimpulan Time Machine (App Flow v2 §3.3; rencana v2 Task 18). Menyebut hasil apa adanya:
 * jika peringkat riwayat kalah dari baseline, kalimatnya mengatakan itu.
 */
export type Strategi = "paparan" | "persistensi" | "total_riwayat" | "gambut" | "acak";
export type Metrik = "capture_10" | "capture_20" | "capture_30" | "roc_auc" | "pr_auc";

export interface MetricRow {
  tahunUji: number;
  unit: "desa" | "kecamatan";
  strategi: Strategi;
  metrik: Metrik;
  nilai: number;
}

export const NAMA_STRATEGI: Record<Strategi, string> = {
  paparan: "Peringkat paparan",
  persistensi: "persistensi",
  total_riwayat: "total riwayat",
  gambut: "porsi gambut",
  acak: "acak",
};

/** Nama untuk pembaca awam (kartu dan papan peringkat). Tabel lengkap dan kesimpulan tetap memakai NAMA_STRATEGI. */
export const NAMA_RAMAH: Record<Strategi, string> = {
  paparan: "Peringkat kami",
  persistensi: "Desa yang terbakar tahun lalu",
  total_riwayat: "Desa dengan titik api terbanyak",
  gambut: "Desa dengan gambut terluas",
  acak: "Tebak asal",
};

export const NAMA_METRIK: Record<Metrik, string> = {
  capture_10: "Tangkap 10%",
  capture_20: "Tangkap 20%",
  capture_30: "Tangkap 30%",
  roc_auc: "ROC-AUC",
  pr_auc: "PR-AUC",
};

/** Strategi terbaik pada satu metrik (unit desa). */
export function pemenang(rows: MetricRow[], tahunUji: number, metrik: Metrik): Strategi | null {
  const r = rows.filter((x) => x.tahunUji === tahunUji && x.unit === "desa" && x.metrik === metrik);
  if (r.length === 0) return null;
  return r.reduce((a, b) => (b.nilai > a.nilai ? b : a)).strategi;
}

export function kesimpulanBacktest(rows: MetricRow[], tahunUji: number): string {
  const ambil = (s: Strategi) =>
    rows.find((x) => x.tahunUji === tahunUji && x.unit === "desa" && x.metrik === "capture_20" && x.strategi === s)?.nilai;
  const paparan = ambil("paparan");
  if (paparan === undefined) return "Hasil untuk tahun uji ini belum tersedia.";

  const baseline = (["persistensi", "total_riwayat", "gambut", "acak"] as Strategi[])
    .map((s) => ({ s, v: ambil(s) }))
    .filter((x): x is { s: Strategi; v: number } => x.v !== undefined);
  if (baseline.length === 0) return "Pembanding belum tersedia.";
  const terbaik = baseline.reduce((a, b) => (b.v > a.v ? b : a));

  const persen = (n: number) => Math.round(n * 100);
  const awal = `Uji ${tahunUji}: dari semua desa yang terdeteksi api, ${persen(paparan)}% sudah ada di 20% teratas daftar kami (menebak asal hanya 20%).`;
  if (paparan > terbaik.v) {
    return `${awal} Unggul ${persen(paparan - terbaik.v)} poin dari ${NAMA_STRATEGI[terbaik.s]}, pembanding terbaik.`;
  }
  return `${awal} Hasilnya kalah dari ${NAMA_STRATEGI[terbaik.s]} (${persen(terbaik.v)}%). Kami menampilkannya apa adanya.`;
}
