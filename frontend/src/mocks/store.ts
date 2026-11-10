/*
 * PENYIMPANAN SEMENTARA di browser (sessionStorage) agar alur Prioritas -> Usulan -> Dokumen bisa dicoba
 * tanpa backend. Menggantikan tabel rencana, keputusan, harga_desa, target_desa, dan usulan.
 * Hapus bersama `src/mocks/`.
 */
import type { Keputusan, Usulan } from "@/lib/types";
import { PAGU_DEFAULT } from "@/lib/prioritas";

export interface Simpanan {
  pagu: number;
  keputusan: Record<string, { keputusan: Keputusan; catatan?: string }>;
  /** Harga yang diisi desa: menimpa acuan untuk (item, aksi). sumber wajib. */
  harga: { itemKode: string; aksi: "beli" | "perbaiki"; hargaRp: number; sumber: string }[];
  /** Target yang diubah desa. alasan wajib. */
  paket: { itemKode: string; target: number; alasan: string }[];
  usulan: Usulan[];
}

export const simpananAwal = (): Simpanan => ({ pagu: PAGU_DEFAULT, keputusan: {}, harga: [], paket: [], usulan: [] });

const kunci = (kode: string) => `siapkemarau-contoh:${kode}`;

export function bacaSimpanan(kode: string): Simpanan {
  try {
    const mentah = sessionStorage.getItem(kunci(kode));
    if (!mentah) return simpananAwal();
    return { ...simpananAwal(), ...(JSON.parse(mentah) as Partial<Simpanan>) };
  } catch {
    return simpananAwal();
  }
}

export function tulisSimpanan(kode: string, s: Simpanan): void {
  try {
    sessionStorage.setItem(kunci(kode), JSON.stringify(s));
  } catch {
    /* penyimpanan tidak tersedia: tampilan tetap jalan tanpa menyimpan */
  }
}
