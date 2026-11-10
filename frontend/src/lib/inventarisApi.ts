/*
 * Pintu simpan inventaris untuk Client Component: PUT /api/desa/[kode]/inventaris.
 * Keadaan jaringan dan galat server ditangani `api()` lewat `ApiError`.
 */
import { api } from "./api-client";
import type { InventoryInput } from "./inventaris";

export interface HasilSimpan {
  /** ISO UTC dari server. */
  disimpanPada: string;
}

export async function simpanInventaris(kode: string, baris: InventoryInput[]): Promise<HasilSimpan> {
  return api<HasilSimpan>(`/api/desa/${kode}/inventaris`, { method: "PUT", json: baris });
}
