/*
 * Logika tampilan layar Prioritas (App Flow v2 §3.8). Fungsi murni.
 * Urutan dan skor datang dari mesin backend; di sini hanya pagu, keadaan, kalimat, dan keputusan.
 */
import { formatRupiah, formatSkor } from "./format";
import type { Aksi, CatalogItem, Keputusan, PriceRow, PriorityResult, PriorityRow } from "./types";

export const PAGU_DEFAULT = 15_000_000;
export const PAGU_MAKS = 1_000_000_000;

export type KeputusanMap = Record<string, { keputusan: Keputusan; catatan?: string }>;

export const keyBaris = (r: Pick<PriorityRow, "itemKode" | "aksi">) => `${r.itemKode}:${r.aksi}`;

/** "Rp15.000.000", "15.000.000", "15000000" -> 15000000. Bukan angka -> 0. Dibatasi 0..Rp1 miliar. */
export function parsePagu(mentah: string): number {
  const angka = mentah.replace(/\D/g, "");
  if (angka === "") return 0;
  return Math.min(Number(angka), PAGU_MAKS);
}

export function namaAksi(aksi: Aksi): string {
  return aksi === "beli" ? "Beli" : "Perbaiki";
}

export function itemTermurah(harga: PriceRow[], catalog: CatalogItem[]): { nama: string; hargaRp: number; aksi: Aksi } | null {
  if (harga.length === 0) return null;
  const termurah = harga.reduce((a, b) => (b.hargaRp < a.hargaRp ? b : a));
  const nama = catalog.find((c) => c.kode === termurah.itemKode)?.nama ?? termurah.itemKode;
  return { nama, hargaRp: termurah.hargaRp, aksi: termurah.aksi };
}

export type KeadaanPagu = "tanpaHarga" | "nol" | "kurang" | "ok";

export function keadaanPagu(paguRp: number, hasil: PriorityResult, harga: PriceRow[]): KeadaanPagu {
  if (harga.length === 0) return "tanpaHarga";
  if (paguRp <= 0) return "nol";
  if (hasil.terpilih.length === 0) return "kurang";
  return "ok";
}

/** Satu kalimat kesimpulan layar. Teks keadaan persis dari App Flow v2 §3.8. */
export function kalimatPrioritas(paguRp: number, skorSekarang: number, hasil: PriorityResult, harga: PriceRow[], catalog: CatalogItem[]): string {
  switch (keadaanPagu(paguRp, hasil, harga)) {
    case "tanpaHarga":
      return "Belum ada harga. Isi harga dari penawaran setempat.";
    case "nol":
      return "Isi anggaran untuk melihat urutan belanja.";
    case "kurang": {
      const t = itemTermurah(harga, catalog);
      return t
        ? `Anggaran belum cukup untuk satu alat pun. Yang termurah: ${t.nama}, ${formatRupiah(t.hargaRp)}.`
        : "Anggaran belum cukup untuk satu alat pun.";
    }
    default:
      return `Dengan anggaran ${formatRupiah(paguRp)}, skor kesiapan naik dari ${formatSkor(skorSekarang)} menjadi ${formatSkor(hasil.skorSesudah)}.`;
  }
}

/** Keputusan hanya berlaku pada baris yang masih terpilih (App Flow §3.8). */
export function barisDisetujui(terpilih: PriorityRow[], keputusan: KeputusanMap): PriorityRow[] {
  return terpilih.filter((r) => keputusan[keyBaris(r)]?.keputusan === "setuju");
}

export function ringkasKeputusan(terpilih: PriorityRow[], keputusan: KeputusanMap) {
  let setuju = 0;
  let tolak = 0;
  let tunda = 0;
  for (const r of terpilih) {
    const k = keputusan[keyBaris(r)]?.keputusan;
    if (k === "setuju") setuju += 1;
    else if (k === "tolak") tolak += 1;
    else if (k === "tunda") tunda += 1;
  }
  return { setuju, tolak, tunda, belum: terpilih.length - setuju - tolak - tunda };
}

export function totalBiaya(baris: PriorityRow[]): number {
  return baris.reduce((s, r) => s + r.biayaRp, 0);
}

export const ALASAN_MIN = 5;
