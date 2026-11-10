/*
 * SEMENTARA: pintu simpan inventaris untuk Client Component.
 * Sekarang meniru server (jeda, gagal-jaringan, gagal-simpan) supaya semua keadaan UX bisa diuji.
 * Saat API PUT /api/desa/[kode]/inventaris siap (v2 Task 13), ganti isi `simpanInventaris`
 * dengan pemanggilan di bagian KODE NYATA dan hapus bagian contoh.
 */
import { ApiError } from "./api-client";
import type { InventoryInput } from "./inventaris";

export interface HasilSimpan {
  /** ISO UTC dari server. */
  disimpanPada: string;
}

export async function simpanInventaris(kode: string, baris: InventoryInput[]): Promise<HasilSimpan> {
  // ---- KODE NYATA (aktifkan saat API siap) ----
  // await api<void>(`/api/desa/${kode}/inventaris`, { method: "PUT", json: baris });
  // return { disimpanPada: new Date().toISOString() };

  // ---- CONTOH SEMENTARA ----
  void baris;
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new ApiError(0, "jaringan", "Tidak ada sinyal. Isian masih ada di layar. Coba lagi saat sinyal kembali.");
  }
  await new Promise((r) => setTimeout(r, 700));
  if (kode === "gagal-simpan") {
    throw new ApiError(500, "galat", "Penyimpanan gagal. Isian masih ada di layar. Coba lagi.");
  }
  return { disimpanPada: new Date().toISOString() };
}
