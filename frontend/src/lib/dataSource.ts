/*
 * SEMENTARA: satu pintu data untuk layar. Sekarang mengembalikan data contoh.
 * Nama fungsi mengikuti rencana backend (v2 Task 9, 14): getDesaCard, getKesiapan, getReferensiPergub.
 * Saat backend siap, ganti isi file ini (atau impor langsung dari lib backend) dan hapus src/mocks/.
 *
 * Kode desa khusus untuk menguji keadaan UX tanpa backend:
 *   contoh   desa normal (Kalbar, sebagian siap)
 *   kalteng  desa Kalteng, memuat keterangan Pergub
 *   kosong   belum ada inventaris
 *   sebagian ada item yang belum dicatat
 *   lambat   memuat 2 detik (lihat keadaan memuat)
 *   galat    melempar galat (lihat keadaan galat)
 *   tampakaman  terdeteksi di tahun ekstrem lalu tenang 7 tahun (label Tampak aman)
 *   takpernah   tidak pernah terdeteksi (bukan jaminan aman)
 *   gagal-simpan  halaman normal, tetapi tombol Simpan di Catat Alat gagal
 * Kode lain: tidak ditemukan (404).
 */
import { redirect } from "next/navigation";
import { getSesiAkun } from "@/server/auth";
import {
  MOCK_KODE,
  mockCatalog,
  mockDesaCard,
  mockHarga,
  mockPaket,
  mockPergubKalteng,
  mockReadiness,
  stripDari,
} from "@/mocks/demo";
import { cariUji, DESA_UJI, kartuUji, kesiapanUji, paketUji } from "@/mocks/desaUji";
import type { Akun, CatalogItem, HargaRow, DesaCard, InventoryRow, PaketRow, ReadinessResult, ReferensiPergub } from "./types";

const KODE_UJI = new Set([MOCK_KODE, "kalteng", "kosong", "sebagian", "lambat", "galat", "gagal-simpan", "tampakaman", "takpernah", ...DESA_UJI.map((d) => d.kode)]);
const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function gerbang(kode: string): Promise<boolean> {
  if (kode === "lambat") await tunggu(2000);
  if (kode === "galat") throw new Error("Galat contoh untuk menguji tampilan.");
  return KODE_UJI.has(kode);
}

/** Akun dari sesi nyata (cookie `sk_sesi`). Tanpa sesi: null. */
export async function getSesi(): Promise<Akun | null> {
  return getSesiAkun();
}

/** Layar berakun: tanpa sesi menuju `/masuk`. */
export async function getAkun(): Promise<Akun> {
  return (await getSesiAkun()) ?? redirect("/masuk");
}

export async function getCatalog(): Promise<CatalogItem[]> {
  return mockCatalog;
}

export async function getDesaCard(kode: string): Promise<DesaCard | null> {
  if (!(await gerbang(kode))) return null;
  const uji = cariUji(kode);
  if (uji) return kartuUji(uji);
  if (kode === "kalteng") {
    return {
      ...mockDesaCard,
      desa: { ...mockDesaCard.desa, kode, nama: "Contoh Desa Kalteng", provKode: "62", provNama: "Kalimantan Tengah" },
    };
  }
  if (kode === "tampakaman") {
    return {
      ...mockDesaCard,
      desa: { ...mockDesaCard.desa, kode, nama: "Contoh Desa Tampak Aman" },
      strip: stripDari([2015, 2019]),
      paparan: { ...mockDesaCard.paparan, kExt: 2, nExt: 4, tahunTenang: 7, tampakAman: true, tier: "tinggi", skor: 0.5 },
    };
  }
  if (kode === "takpernah") {
    return {
      ...mockDesaCard,
      desa: { ...mockDesaCard.desa, kode, nama: "Contoh Desa Tanpa Deteksi", peatFrac: 0 },
      strip: stripDari([]),
      paparan: { ...mockDesaCard.paparan, kExt: 0, nExt: 4, tahunTenang: 15, tampakAman: false, tier: "rendah", skor: 0.1 },
    };
  }
  return { ...mockDesaCard, desa: { ...mockDesaCard.desa, kode } };
}

export async function getKesiapan(kode: string): Promise<ReadinessResult> {
  await gerbang(kode);
  const uji = cariUji(kode);
  if (uji) return kesiapanUji(uji);
  if (kode === "kosong") {
    return {
      skor: 0,
      status: "rawan",
      rantaiTerlemah: null,
      lengkap: false,
      items: mockReadiness.items.map((i) => ({ ...i, berfungsi: 0, rusak: 0, coverage: 0, belumDiisi: true })),
    };
  }
  if (kode === "sebagian") {
    return {
      ...mockReadiness,
      lengkap: false,
      items: mockReadiness.items.map((i) =>
        i.itemKode === "sumur_bor" ? { ...i, berfungsi: 0, rusak: 0, coverage: 0, belumDiisi: true } : i,
      ),
    };
  }
  return mockReadiness;
}

export async function getReferensiPergub(kode: string): Promise<ReferensiPergub[]> {
  return kode === "kalteng" || cariUji(kode)?.provKode === "62" ? mockPergubKalteng : [];
}

export async function getPaket(kode: string): Promise<PaketRow[]> {
  await gerbang(kode);
  const uji = cariUji(kode);
  return uji ? paketUji(uji) : mockPaket;
}

/** Harga satuan bersumber per item dan aksi (beli/perbaiki). Item tanpa harga tidak ada di daftar. */
export async function getHarga(kode: string): Promise<HargaRow[]> {
  await gerbang(kode);
  return mockHarga;
}

export interface InventarisTersimpan {
  rows: InventoryRow[];
  /** Pengisi dan waktu terakhir (ISO UTC); null bila belum pernah disimpan. */
  terakhir: { oleh: string; waktu: string } | null;
}

export async function getInventaris(kode: string): Promise<InventarisTersimpan> {
  await gerbang(kode);
  const uji = cariUji(kode);
  if (uji) {
    return uji.alat.length
      ? { rows: uji.alat, terakhir: { oleh: "Ketua MPA (uji)", waktu: "2026-11-09T03:15:00Z" } }
      : { rows: [], terakhir: null };
  }
  if (kode === "kosong") return { rows: [], terakhir: null };
  // total = berfungsi + rusak, dari data contoh kesiapan
  const rows: InventoryRow[] = mockReadiness.items.map((i) => ({
    itemKode: i.itemKode,
    total: i.berfungsi + i.rusak,
    berfungsi: i.berfungsi,
  }));
  const dipakai = kode === "sebagian" ? rows.filter((r) => r.itemKode !== "sumur_bor") : rows;
  return { rows: dipakai, terakhir: { oleh: "Ketua MPA (uji)", waktu: "2026-11-09T03:15:00Z" } };
}

/** Keputusan gerbang data (TRD v2 §5). Contoh: pertahankan. Nyata: dari tabel meta/backtest. */
export async function getGerbang(): Promise<"pertahankan" | "lunakkan" | "buang"> {
  return "pertahankan";
}
