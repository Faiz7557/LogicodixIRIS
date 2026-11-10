/*
 * DATA CONTOH SINTETIS, hanya untuk membangun tampilan sebelum API backend siap.
 * Bukan data satelit, bukan survei lapangan, dan tidak boleh tampil di demo atau video.
 * Hapus folder `src/mocks/` sebelum code freeze (lihat docs/FRONTEND.md).
 */
import type { Akun, DesaCard, ReadinessResult } from "@/lib/types";

export const MOCK_KODE = "contoh";

export const mockAkun: Record<"mpa" | "desa", Akun> = {
  mpa: { id: 1, username: "demo-mpa", peran: "mpa", desaKode: MOCK_KODE, namaTampil: "Ketua MPA (uji)", isDemo: true },
  desa: { id: 2, username: "demo-sekdes", peran: "desa", desaKode: MOCK_KODE, namaTampil: "Sekdes (uji)", isDemo: true },
};

const tahun = Array.from({ length: 15 }, (_, i) => 2012 + i);
const terpapar = new Set([2015, 2019, 2026]);

export const mockDesaCard: DesaCard = {
  desa: {
    kode: MOCK_KODE,
    nama: "Contoh Desa",
    kecKode: "contoh-kec",
    kecNama: "Contoh Kecamatan",
    kabNama: "Contoh Kabupaten",
    provNama: "Kalimantan Barat",
    lat: -0.1,
    lon: 109.4,
    luasHa: 4200,
    peatFrac: 0.62,
    geomJson: JSON.stringify({
      type: "Polygon",
      coordinates: [[[109.38, -0.12], [109.43, -0.12], [109.43, -0.08], [109.38, -0.08], [109.38, -0.12]]],
    }),
  },
  tahunEkstrem: [2015, 2019, 2023, 2026],
  strip: tahun.map((t) => ({
    tahun: t,
    nDet: terpapar.has(t) ? 6 : 0,
    detDays: terpapar.has(t) ? 3 : 0,
    terpapar: terpapar.has(t),
  })),
  paparan: {
    mode: "live",
    kExt: 3,
    nExt: 4,
    kNorm: 0,
    nNorm: 11,
    tahunTenang: 0,
    tampakAman: false,
    tier: "tinggi",
    skor: 0.71,
  },
  kecamatan: { nDesa: 18, k: 30, n: 72, pMean: 0.43, p05: 0.33, p95: 0.53 },
};

export const mockReadiness: ReadinessResult = {
  skor: 41.7,
  status: "sebagian",
  rantaiTerlemah: "selang_keluar",
  lengkap: true,
  items: [
    { itemKode: "selang_keluar", target: 6, berfungsi: 2, rusak: 0, coverage: 2 / 6, kritis: true, belumDiisi: false },
    { itemKode: "pompa_jinjing", target: 2, berfungsi: 1, rusak: 1, coverage: 0.5, kritis: true, belumDiisi: false },
  ],
};
