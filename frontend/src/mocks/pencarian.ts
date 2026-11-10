/*
 * Pencarian desa tiruan (menggantikan GET /api/desa?q=). `%` dan `_` diperlakukan literal (rencana v2 Task 9).
 * Kata "galat" memicu keadaan gagal jaringan. Hapus bersama `src/mocks/`.
 */
import type { DesaHit } from "@/lib/types";

const DAFTAR: DesaHit[] = [
  { kode: "contoh", nama: "Contoh Desa", kecNama: "Contoh Kecamatan", kabNama: "Contoh Kabupaten", provNama: "Kalimantan Barat" },
  { kode: "tampakaman", nama: "Contoh Desa Tampak Aman", kecNama: "Contoh Kecamatan", kabNama: "Contoh Kabupaten", provNama: "Kalimantan Barat" },
  { kode: "takpernah", nama: "Contoh Desa Tanpa Deteksi", kecNama: "Kecamatan Lain", kabNama: "Contoh Kabupaten", provNama: "Kalimantan Barat" },
  { kode: "kalteng", nama: "Contoh Desa Kalteng", kecNama: "Kecamatan Tengah", kabNama: "Kabupaten Tengah", provNama: "Kalimantan Tengah" },
];

export async function cariDesaContoh(q: string): Promise<DesaHit[]> {
  await new Promise((r) => setTimeout(r, 350));
  const kata = q.trim().toLowerCase();
  if (kata === "galat") throw new Error("jaringan");
  if (/[%_\\]/.test(kata)) return []; // literal: tidak ada nama desa memuat karakter ini
  return DAFTAR.filter((d) => `${d.nama} ${d.kecNama} ${d.kabNama}`.toLowerCase().includes(kata)).slice(0, 20);
}
