/*
 * ANGKA CONTOH Time Machine. BUKAN hasil pipeline dan tidak boleh dikutip.
 * Dibuat agar semua keadaan tampilan bisa dilihat, termasuk saat peringkat paparan KALAH dari pembanding.
 * Hasil nyata: tabel backtest_metric dan backtest_grup dari pipeline (Orang 1). Hapus bersama `src/mocks/`.
 */
import type { Metrik, MetricRow, Strategi } from "@/lib/backtest";

const NILAI: Record<number, Record<Strategi, Record<Metrik, number>>> = {
  2019: {
    paparan: { capture_10: 0.2, capture_20: 0.38, capture_30: 0.52, roc_auc: 0.66, pr_auc: 0.31 },
    persistensi: { capture_10: 0.18, capture_20: 0.34, capture_30: 0.47, roc_auc: 0.63, pr_auc: 0.28 },
    total_riwayat: { capture_10: 0.19, capture_20: 0.36, capture_30: 0.49, roc_auc: 0.64, pr_auc: 0.29 },
    gambut: { capture_10: 0.14, capture_20: 0.26, capture_30: 0.39, roc_auc: 0.57, pr_auc: 0.22 },
    acak: { capture_10: 0.1, capture_20: 0.2, capture_30: 0.3, roc_auc: 0.5, pr_auc: 0.18 },
  },
  2023: {
    paparan: { capture_10: 0.24, capture_20: 0.44, capture_30: 0.58, roc_auc: 0.7, pr_auc: 0.37 },
    persistensi: { capture_10: 0.17, capture_20: 0.31, capture_30: 0.43, roc_auc: 0.61, pr_auc: 0.26 },
    total_riwayat: { capture_10: 0.22, capture_20: 0.4, capture_30: 0.54, roc_auc: 0.68, pr_auc: 0.34 },
    gambut: { capture_10: 0.15, capture_20: 0.27, capture_30: 0.4, roc_auc: 0.58, pr_auc: 0.23 },
    acak: { capture_10: 0.1, capture_20: 0.2, capture_30: 0.3, roc_auc: 0.5, pr_auc: 0.2 },
  },
  2026: {
    paparan: { capture_10: 0.21, capture_20: 0.41, capture_30: 0.55, roc_auc: 0.68, pr_auc: 0.4 },
    persistensi: { capture_10: 0.24, capture_20: 0.46, capture_30: 0.57, roc_auc: 0.7, pr_auc: 0.42 },
    total_riwayat: { capture_10: 0.23, capture_20: 0.44, capture_30: 0.57, roc_auc: 0.69, pr_auc: 0.41 },
    gambut: { capture_10: 0.15, capture_20: 0.27, capture_30: 0.4, roc_auc: 0.58, pr_auc: 0.3 },
    acak: { capture_10: 0.1, capture_20: 0.2, capture_30: 0.3, roc_auc: 0.5, pr_auc: 0.27 },
  },
};

export const TAHUN_UJI = [2019, 2023, 2026] as const;
export const mockMetrik: MetricRow[] = TAHUN_UJI.flatMap((tahunUji) =>
  (Object.entries(NILAI[tahunUji]) as [Strategi, Record<Metrik, number>][]).flatMap(([strategi, m]) =>
    (Object.entries(m) as [Metrik, number][]).map(([metrik, nilai]) => ({ tahunUji, unit: "desa" as const, strategi, metrik, nilai })),
  ),
);

export const mockGrup = [
  { grup: "tampak_aman", label: "Tampak aman", nDesa: 1240, nTerpapar: 410, rate: 0.33 },
  { grup: "aktif", label: "Aktif (baru terdeteksi)", nDesa: 2210, nTerpapar: 1020, rate: 0.46 },
  { grup: "tanpa_riwayat_ekstrem", label: "Tanpa riwayat ekstrem", nDesa: 5400, nTerpapar: 760, rate: 0.14 },
];

/** 20 desa teratas menurut peringkat beku 31 Des 2025 (nama sintetis). `terpapar2026` hanya terlihat setelah Buka 2026. */
export const mockTeratas = Array.from({ length: 20 }, (_, i) => ({
  peringkat: i + 1,
  nama: `Desa Contoh ${String(i + 1).padStart(2, "0")}`,
  kecamatan: `Kecamatan ${["A", "B", "C", "D"][i % 4]}`,
  kExt: i < 8 ? 3 : 2,
  nExt: 3,
  terpapar2026: i % 5 !== 3 && i % 7 !== 6,
}));
