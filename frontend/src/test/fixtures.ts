/*
 * Fixture uji: data contoh sintetis untuk tes fungsi murni. Bukan data satelit dan tidak dipakai runtime.
 *
 * Angka dihitung dengan rumus TRD v2 §6 agar konsisten:
 *   skor = 100 * Σ(bobot * coverage) / Σ(bobot), bobot 20/20/20.
 *   pompa 1/1, selang 3/10, sumur 2/5  ->  (20+6+8)/60 = 56,7  ->  sebagian.
 *   pagu Rp15 juta: 2 selang x Rp6.669.000 = Rp13.338.000; selang 5/10 -> (20+10+8)/60 = 63,3.
 */
import type {
  Akun,
  CatalogItem,
  DesaCard,
  HargaRow,
  PaketRow,
  PrioritasPayload,
  ReadinessResult,
  ReferensiPergub,
} from "@/lib/types";

export const MOCK_KODE = "contoh";

export const mockAkun: Record<"mpa" | "desa", Akun> = {
  mpa: { id: 1, username: "demo-mpa", peran: "mpa", desaKode: MOCK_KODE, namaTampil: "Ketua MPA (uji)", isDemo: true },
  desa: { id: 2, username: "demo-sekdes", peran: "desa", desaKode: MOCK_KODE, namaTampil: "Sekdes (uji)", isDemo: true },
};

// ---------- Katalog (Schema §6: katalog_item.csv) ----------
export const mockCatalog: CatalogItem[] = [
  { kode: "pompa_jinjing", nama: "Pompa jinjing", satuan: "unit", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false },
  { kode: "selang_keluar", nama: "Selang keluar", satuan: "buah", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false },
  { kode: "sumur_bor", nama: "Sumur bor", satuan: "titik", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: true },
];

// ---------- Paket minimum (PRD §7) ----------
export const mockPaket: PaketRow[] = [
  { itemKode: "pompa_jinjing", target: 1, sumber: "Asumsi tim", label: "asumsi_tim" },
  { itemKode: "selang_keluar", target: 10, sumber: "Asumsi tim", label: "asumsi_tim" },
  { itemKode: "sumur_bor", target: 5, sumber: "Asumsi tim", label: "asumsi_tim" },
];

// ---------- Harga acuan (PRD §8). sumur_bor sengaja tanpa harga. ----------
export const mockHarga: HargaRow[] = [
  { itemKode: "pompa_jinjing", aksi: "beli", hargaRp: 28_028_610, sumber: "Perbup Sanggau 32/2025 hlm. 175", tanggal: "2026-11-09" },
  { itemKode: "pompa_jinjing", aksi: "perbaiki", hargaRp: 510_000, sumber: "Perwal Kediri 3/2025 hlm. 269, item 4594", tanggal: "2026-11-09" },
  { itemKode: "selang_keluar", aksi: "beli", hargaRp: 6_669_000, sumber: "Perbup Sanggau 32/2025 hlm. 174", tanggal: "2026-11-09" },
];

/** Hanya tampil untuk desa Kalteng (prov_kode 62). Kalbar: tampilkan kalimat ketiadaan angka. */
export const mockPergubKalteng: ReferensiPergub[] = [
  { namaAlat: "Pompa jinjing", jumlahPerRegu: 3, satuan: "unit", pasal: "Pasal 19", itemKode: "pompa_jinjing" },
  { namaAlat: "Selang", jumlahPerRegu: 50, satuan: "buah", pasal: "Pasal 19", itemKode: "selang_keluar" },
  { namaAlat: "Pompa punggung", jumlahPerRegu: 10, satuan: "unit", pasal: "Pasal 18", itemKode: null },
];

// ---------- Kartu paparan ----------
const tahun = Array.from({ length: 15 }, (_, i) => 2012 + i);
const terpapar = new Set([2015, 2019, 2026]);

/** Sebaran uji: semua hari deteksi di September. */
const bulanUji = (hari: number) => Array.from({ length: 12 }, (_, i) => (i === 8 ? hari : 0));

/** Strip 2012-2026 dengan tahun terpapar yang ditentukan. */
export const stripDari = (terpaparSet: number[]) =>
  tahun.map((t) => ({
    tahun: t,
    nDet: terpaparSet.includes(t) ? 6 : 0,
    detDays: terpaparSet.includes(t) ? 3 : 0,
    terpapar: terpaparSet.includes(t),
    bulan: bulanUji(terpaparSet.includes(t) ? 3 : 0),
  }));

export const mockDesaCard: DesaCard = {
  desa: {
    kode: MOCK_KODE,
    nama: "Contoh Desa",
    kecKode: "contoh-kec",
    kecNama: "Contoh Kecamatan",
    kabNama: "Contoh Kabupaten",
    provNama: "Kalimantan Barat",
    provKode: "61",
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
    bulan: bulanUji(terpapar.has(t) ? 3 : 0),
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
  kecamatan: { nDesa: 18, k: 30, n: 72, pMean: 0.42, rateMin: 0.25, rateMax: 0.61 },
  gerbang: "pertahankan",
};

// ---------- Kesiapan ----------
export const mockReadiness: ReadinessResult = {
  skor: 56.7,
  status: "sebagian",
  rantaiTerlemah: "selang_keluar",
  lengkap: true,
  items: [
    { itemKode: "pompa_jinjing", target: 1, berfungsi: 1, rusak: 1, coverage: 1, kritis: true, belumDiisi: false },
    { itemKode: "selang_keluar", target: 10, berfungsi: 3, rusak: 0, coverage: 0.3, kritis: true, belumDiisi: false },
    { itemKode: "sumur_bor", target: 5, berfungsi: 2, rusak: 1, coverage: 0.4, kritis: true, belumDiisi: false },
  ],
};

// ---------- Prioritas, pagu default Rp15.000.000 ----------
export const mockPrioritas: PrioritasPayload = {
  paguRp: 15_000_000,
  terkunci: [],
  terkunciRp: 0,
  terpakaiRp: 13_338_000,
  skorSesudah: 63.3,
  terpilih: [
    {
      itemKode: "selang_keluar",
      aksi: "beli",
      qty: 2,
      biayaRp: 13_338_000,
      alasan: "Selang keluar 3 dari 10 buah. Menaikkan cakupan ke 50%.",
    },
  ],
  tidakTerdanai: [
    {
      itemKode: "selang_keluar",
      aksi: "beli",
      qty: 5,
      biayaRp: 33_345_000,
      alasan: "Selang keluar 5 dari 10 buah. Menaikkan cakupan ke 100%.",
    },
  ],
  tanpaHarga: ["sumur_bor"],
  keputusan: [],
};
