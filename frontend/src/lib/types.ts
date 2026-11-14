/*
 * Kontrak data frontend <-> backend (TetesPas v2).
 * Sumber: docs/v2/02_TRD.md §6 dan §8, docs/v2/05_BACKEND_SCHEMA.md §3.
 * Frontend hanya MENGONSUMSI tipe ini. Ubah hanya setelah disepakati dengan pemilik mesin/API.
 * Bagian bertanda USULAN KONTRAK belum ada di dokumen dan harus dikonfirmasi.
 */

// ---------- Mesin (TRD §6) ----------
export type Tier = "rendah" | "sedang" | "tinggi"; // hanya label tingkat paparan, tidak memengaruhi target
export type Status = "siap" | "sebagian" | "rawan";
export type Aksi = "perbaiki" | "beli";
export type Peran = "mpa" | "desa";
export type Mode = "frozen" | "live";
export type Keputusan = "setuju" | "tolak" | "tunda";
export type Kanal = "apbdes_perubahan" | "bpbd" | "daops" | "csr";
export type SumberTeks = "ai" | "template";

/** Halaman yang punya tombol "Ringkasan AI" (plan 09 Bagian C). */
export type HalamanRingkasan = "paparan" | "kesiapan" | "prioritas" | "anggaran" | "usulan";
/** Balasan `POST /api/ringkasan`: satu kalimat inti dan tepat tiga butir. */
export interface Ringkasan {
  judul: string;
  butir: string[];
  sumber: SumberTeks;
  model: string | null;
}

/** Keputusan gerbang data (TRD §5). Mengatur tagline dan label "Tampak aman". */
export type KeputusanGerbang = "pertahankan" | "lunakkan" | "buang";

export interface CatalogItem {
  kode: string;
  nama: string;
  satuan: string;
  bobot: number;
  kritis: boolean;
  bisaDibeli: boolean;
  /** false: item tanpa keadaan rusak, hanya satu stepper, total = berfungsi (Schema §4). */
  punyaRusak: boolean;
  hanyaGambut: boolean;
}
export interface InventoryRow {
  itemKode: string;
  total: number;
  berfungsi: number;
  catatan?: string | null;
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
export interface PriorityInput {
  catalog: CatalogItem[];
  readiness: ReadinessResult;
  prices: PriceRow[];
  paguRp: number;
}
export interface PriorityResult {
  paguRp: number;
  terpakaiRp: number;
  skorSesudah: number;
  terpilih: PriorityRow[];
  tidakTerdanai: PriorityRow[];
  tanpaHarga: string[];
}

// ---------- Paket minimum, harga, Pergub (PRD §7-8, Schema §3) ----------
/** Hasil `getTargetEfektif`: sumber berbunyi asumsi tim, atau "Diubah desa: {alasan}". */
export interface PaketRow extends TargetRow {
  sumber: string;
  label: "asumsi_tim" | "bersumber";
}
/** Hasil `getHargaEfektif`. Item tanpa harga tidak ada di daftar ini. */
export interface HargaRow extends PriceRow {
  sumber: string;
  tanggal?: string;
}
/** Keterangan pembanding, hanya untuk desa Kalteng (prov_kode 62). Kalbar: daftar kosong. */
export interface ReferensiPergub {
  namaAlat: string;
  jumlahPerRegu: number;
  satuan: string;
  pasal: string;
  itemKode: string | null;
}

/** Keputusan satu baris, tersimpan per (item, aksi). */
export interface KeputusanRow {
  itemKode: string;
  aksi: Aksi;
  keputusan: Keputusan;
  catatan?: string | null;
}
/**
 * Baris belanja yang sudah masuk surat usulan (dibekukan saat surat dibuat). Terkunci: tidak bisa dipindah,
 * dianggap data riwayat. Mengurangi anggaran dan dihitung sebagai alat yang sudah ada saat menyusun saran baru.
 */
export interface BarisTerkunci {
  itemKode: string;
  aksi: Aksi;
  qty: number;
  biayaRp: number;
  usulanId: number;
  tanggal: string;
  /** Sumber harga saat surat dibuat (dibekukan). */
  sumberHarga?: string;
}

export type PrioritasPayload = PriorityResult & {
  keputusan: KeputusanRow[];
  /** Baris dari surat usulan yang sudah dibuat. */
  terkunci: BarisTerkunci[];
  /** Total biaya baris terkunci; anggaran untuk saran baru = paguRp - terkunciRp. */
  terkunciRp: number;
};

// ---------- Wilayah dan paparan (Schema §3) ----------
export interface DesaHit {
  kode: string;
  nama: string;
  kecNama: string;
  kabNama: string;
  provNama: string;
}

// Desa bergambut seluruh Kalimantan (GET /api/gambut); terpisah dari DesaCard yang hanya 61/62.
export interface DesaGambut {
  kode: string;
  nama: string;
  kecKode: string;
  kecNama: string;
  kabKode: string;
  kabNama: string;
  provKode: string;
  provNama: string;
  lat: number;
  lon: number;
  luasHa: number;
  peatHa: number;
  peatFrac: number;
  geomJson?: string; // ada kecuali GET /api/gambut?geom=0
}

export interface DesaTahun {
  tahun: number;
  nDet: number;
  detDays: number;
  terpapar: boolean;
  /**
   * Hari deteksi per bulan, Januari sampai Desember (tabel `desa_bulan`, dari tanggal deteksi FIRMS). Jumlahnya = detDays.
   * `null` bila DB belum punya tabel `desa_bulan` (DB lama): tampilan per bulan disembunyikan, tidak diisi angka buatan.
   */
  bulan: number[] | null;
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

/** v2: laju rata-rata dan rentang antar tahun ekstrem, bukan interval Beta. */
export interface KecamatanPaparan {
  nDesa: number;
  k: number;
  n: number;
  pMean: number;
  rateMin: number;
  rateMax: number;
}

export interface DesaCard {
  desa: DesaHit & {
    kecKode: string;
    provKode: string; // "61" Kalbar, "62" Kalteng
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
  /** USULAN KONTRAK: keputusan gerbang ikut dikirim agar label bisa disembunyikan (labelTampakAman). */
  gerbang: KeputusanGerbang;
}

// ---------- Usulan (Schema §3, §8) ----------
export interface Usulan {
  id: number;
  desaKode: string;
  kanal: Kanal;
  /** Peta string, mengisi placeholder. Bentuk contoh: Schema §8. */
  facts: Record<string, string>;
  /** nama, satuan, dan sumberHarga disalin saat terbit agar dokumen tidak berubah (fakta beku). */
  baris: (PriorityRow & { nama?: string; satuan?: string; sumberHarga?: string })[];
  teks: string;
  sumberTeks: SumberTeks;
  model: string | null;
  createdAt: string; // ISO UTC
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
