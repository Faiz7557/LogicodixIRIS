/*
 * Aturan akun yang dipakai bersama oleh klien, server, dan skrip seed.
 * Satu desa punya paling banyak satu akun per peran: ketua MPA dan sekdes.
 */
import type { Peran } from "./types";

export const SANDI_MIN = 8;
export const SANDI_MAKS = 128;

export const PERAN_DAFTAR: Peran[] = ["desa", "mpa"];

export const PERAN_META: Record<Peran, { label: string; awalan: string; keterangan: string; namaTampil: (desa: string) => string }> = {
  desa: {
    label: "Sekretaris desa",
    awalan: "sekdes",
    keterangan: "Mencatat alat, menyusun anggaran dan keputusan belanja, lalu menerbitkan surat usulan.",
    namaTampil: (desa) => `Sekdes ${desa}`,
  },
  mpa: {
    label: "Ketua MPA",
    awalan: "mpa",
    keterangan: "Mencatat dan memeriksa kesiapan alat pemadam desa.",
    namaTampil: (desa) => `Ketua MPA ${desa}`,
  },
};

/** "Desa Kali Bandung" -> "kalibandung": huruf kecil tanpa spasi atau tanda baca. */
export const slugDesa = (nama: string) =>
  nama
    .replace(/^desa\s+/i, "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** Nama pengguna bawaan: mpa-kalibandung, sekdes-kalibandung. */
export const usernameBawaan = (peran: Peran, namaDesa: string) => `${PERAN_META[peran].awalan}-${slugDesa(namaDesa)}`;

/** Pesan galat password baru, atau null bila sah. */
export function cekSandi(sandi: string): string | null {
  if (sandi.length < SANDI_MIN) return `Password minimal ${SANDI_MIN} karakter.`;
  if (sandi.length > SANDI_MAKS) return `Password maksimal ${SANDI_MAKS} karakter.`;
  return null;
}
