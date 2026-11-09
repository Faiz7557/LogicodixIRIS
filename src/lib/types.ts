/*
 * Kontrak data frontend <-> backend.
 * Tipe mesin disalin dari docs/02_TRD.md §6, bentuk tabel dari docs/05_BACKEND_SCHEMA.md.
 * Ubah file ini hanya setelah disepakati dengan pemilik API.
 */

// ---------- Mesin (TRD §6) ----------
export type Tier = "rendah" | "sedang" | "tinggi";
export type Status = "siap" | "sebagian" | "rawan";
export type Aksi = "perbaiki" | "beli";
export type Peran = "mpa" | "desa";
export type Mode = "frozen" | "live";
export type Keputusan = "setuju" | "tolak" | "tunda";
export type Kanal = "apbdes_perubahan" | "bpbd" | "daops" | "csr";
export type SumberTeks = "ai" | "template";

export interface CatalogItem {
  kode: string;
  nama: string;
  satuan: string;
  bobot: number;
  kritis: boolean;
  bisaDibeli: boolean;
}
export interface InventoryRow {
  itemKode: string;
  total: number;
  berfungsi: number;
}
export interface TargetRow {
  itemKode: string;
  target: number;
}
export interface PriceRow {
  itemKode: string;
  aksi: Aksi;
  hargaRp: number;
}

export interface ReadinessItem {
  itemKode: string;
  target: number;
  berfungsi: number;
  rusak: number;
  coverage: number;
  kritis: boolean;
  belumDiisi: boolean;
}
export interface ReadinessResult {
  skor: number;
  status: Status;
  rantaiTerlemah: string | null;
  lengkap: boolean;
  items: ReadinessItem[];
}

export interface PriorityRow {
  itemKode: string;
  aksi: Aksi;
  qty: number;
  biayaRp: number;
  alasan: string;
  kestabilan?: "stabil" | "peka";
}
export interface PriorityResult {
  paguRp: number;
  terpakaiRp: number;
  skorSesudah: number;
  terpilih: PriorityRow[];
  tidakTerdanai: PriorityRow[];
  tanpaHarga: string[];
}

// ---------- Wilayah dan paparan (skema §3) ----------
export interface DesaHit {
  kode: string;
  nama: string;
  kecNama: string;
  kabNama: string;
  provNama: string;
}

export interface DesaTahun {
  tahun: number;
  nDet: number;
  detDays: number;
  terpapar: boolean;
}

export interface DesaPaparan {
  mode: Mode;
  kExt: number;
  nExt: number;
  kNorm: number;
  nNorm: number;
  tahunTenang: number;
  tampakAman: boolean;
  tier: Tier;
  skor: number;
}

export interface KecamatanPaparan {
  nDesa: number;
  k: number;
  n: number;
  pMean: number;
  p05: number;
  p95: number;
}

export interface DesaCard {
  desa: DesaHit & {
    kecKode: string;
    lat: number;
    lon: number;
    luasHa: number;
    peatFrac: number;
    geomJson: string; // GeoJSON geometry, maks 4.000 byte
  };
  tahunEkstrem: number[];
  strip: DesaTahun[]; // 2012-2026
  paparan: DesaPaparan; // mode live
  kecamatan: KecamatanPaparan;
}

// ---------- Akun ----------
export interface Akun {
  id: number;
  username: string;
  peran: Peran;
  desaKode: string;
  namaTampil: string;
  isDemo: boolean;
}

// ---------- Galat API (TRD §8) ----------
export interface ApiErrorBody {
  error: { kode: string; pesan: string };
}
