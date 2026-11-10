/*
 * Aturan formulir Catat Alat (App Flow v2 §3.6, PRD FR-07). Fungsi murni, tanpa React.
 * Validasi di sini hanya untuk umpan balik cepat; backend tetap memvalidasi ulang (zod, CHECK).
 */
import type { CatalogItem, InventoryRow } from "./types";

export const PESAN = {
  angka: "Isi dengan angka 0 atau lebih.",
  melebihi: "Jumlah berfungsi tidak boleh melebihi jumlah total.",
  totalKosong: "Isi jumlah total.",
  berfungsiKosong: "Isi jumlah berfungsi, boleh 0.",
  catatanPribadi: "Catatan tidak boleh memuat nomor telepon atau NIK.",
} as const;

export interface InventoryInput {
  itemKode: string;
  total: number;
  berfungsi: number;
  catatan?: string;
}

/** Nilai mentah isian (string) agar angka tidak valid tetap bisa ditampilkan dan diberi pesan. */
export interface NilaiForm {
  total: string;
  berfungsi: string;
  catatan: string;
}
export type FormState = Record<string, NilaiForm>;
export interface GalatBaris {
  total?: string;
  berfungsi?: string;
  catatan?: string;
}

export type Angka = { jenis: "kosong" } | { jenis: "ok"; nilai: number } | { jenis: "salah" };

/** Terima angka 0 atau lebih; koma atau titik desimal. Negatif dan huruf = salah. Kosong = kosong. */
export function bacaAngka(mentah: string): Angka {
  const s = mentah.trim();
  if (s === "") return { jenis: "kosong" };
  if (!/^\d+([.,]\d+)?$/.test(s)) return { jenis: "salah" };
  return { jenis: "ok", nilai: Number(s.replace(",", ".")) };
}

/** 2 + 1 -> "3", tanpa derau desimal. */
export function geser(mentah: string, delta: number): string {
  const a = bacaAngka(mentah);
  const dasar = a.jenis === "ok" ? a.nilai : 0;
  const hasil = Math.max(0, Math.round((dasar + delta) * 100) / 100);
  return String(hasil);
}

/**
 * Jaga "berfungsi <= total" saat mengisi (item yang punya kondisi rusak).
 * Berfungsi yang diketik atau ditambah melewati total dipotong ke total. Total yang diturunkan di bawah
 * berfungsi ikut menurunkan berfungsi. Total boleh lebih besar dari berfungsi: selisihnya alat rusak.
 * Isian kosong atau bukan angka dibiarkan apa adanya supaya validasi tetap bisa memberi pesan.
 */
export function selaraskan(item: CatalogItem, n: NilaiForm, kolom: "total" | "berfungsi" | "catatan"): NilaiForm {
  if (!item.punyaRusak || kolom === "catatan") return n;
  const t = bacaAngka(n.total);
  const b = bacaAngka(n.berfungsi);
  if (t.jenis !== "ok" || b.jenis !== "ok" || b.nilai <= t.nilai) return n;
  return { ...n, berfungsi: n.total.trim() };
}

/**
 * "Ikut total": bila sebelum diubah total sama dengan berfungsi (semua alat berfungsi), perubahan total
 * ikut mengubah berfungsi, naik maupun turun. Bila sebelumnya berbeda (ada alat rusak), berfungsi tidak disentuh;
 * batas atasnya tetap dijaga `selaraskan`. `awal` = isian sebelum perubahan total dimulai.
 */
export function ikutTotal(item: CatalogItem, awal: NilaiForm, baru: NilaiForm): NilaiForm {
  if (!item.punyaRusak) return baru;
  const ta = bacaAngka(awal.total);
  const ba = bacaAngka(awal.berfungsi);
  const tb = bacaAngka(baru.total);
  if (ta.jenis !== "ok" || ba.jenis !== "ok" || ta.nilai !== ba.nilai || tb.jenis !== "ok") return baru;
  return { ...baru, berfungsi: baru.total.trim() };
}

/** Catatan tidak boleh memuat deret 9 digit atau lebih (nomor HP, NIK). NFR-05. */
export function catatanMemuatPribadi(catatan: string): boolean {
  return /\d{9,}/.test(catatan.replace(/[\s.\-]/g, ""));
}

/** Apakah baris ini sudah diisi? Untuk item tanpa rusak, hanya kolom berfungsi yang dipakai. */
export function barisTerisi(item: CatalogItem, n: NilaiForm): boolean {
  return item.punyaRusak ? n.total.trim() !== "" || n.berfungsi.trim() !== "" : n.berfungsi.trim() !== "";
}

export function validasiBaris(item: CatalogItem, n: NilaiForm): GalatBaris {
  const g: GalatBaris = {};
  const b = bacaAngka(n.berfungsi);
  if (b.jenis === "salah") g.berfungsi = PESAN.angka;

  if (item.punyaRusak) {
    const t = bacaAngka(n.total);
    if (t.jenis === "salah") g.total = PESAN.angka;
    if (t.jenis === "ok" && b.jenis === "ok" && b.nilai > t.nilai) g.berfungsi = PESAN.melebihi;
    if (t.jenis === "kosong" && b.jenis === "ok") g.total = PESAN.totalKosong;
    if (t.jenis === "ok" && b.jenis === "kosong") g.berfungsi = PESAN.berfungsiKosong;
  }

  if (catatanMemuatPribadi(n.catatan)) g.catatan = PESAN.catatanPribadi;
  return g;
}

export function adaGalat(g: GalatBaris): boolean {
  return Boolean(g.total || g.berfungsi || g.catatan);
}

/** Isian awal dari data tersimpan. Dana operasi: total disamakan dengan berfungsi (Schema §4). */
export function awalForm(catalog: CatalogItem[], tersimpan: InventoryRow[]): FormState {
  const byKode = new Map(tersimpan.map((r) => [r.itemKode, r]));
  const state: FormState = {};
  for (const item of catalog) {
    const r = byKode.get(item.kode);
    state[item.kode] = r
      ? {
          total: item.punyaRusak ? String(r.total) : "",
          berfungsi: String(r.berfungsi),
          catatan: r.catatan ?? "",
        }
      : { total: "", berfungsi: "", catatan: "" };
  }
  return state;
}

export interface HasilSusun {
  baris: InventoryInput[];
  galat: Record<string, GalatBaris>;
  jumlahGalat: number;
}

/**
 * Susun muatan simpan. Baris kosong dilewati (boleh simpan sebagian).
 * Dana operasi: total = berfungsi. Jika ada galat, `baris` tetap berisi baris valid tetapi tidak boleh dikirim.
 */
export function susunPayload(catalog: CatalogItem[], state: FormState): HasilSusun {
  const baris: InventoryInput[] = [];
  const galat: Record<string, GalatBaris> = {};
  let jumlahGalat = 0;

  for (const item of catalog) {
    const n = state[item.kode] ?? { total: "", berfungsi: "", catatan: "" };
    if (!barisTerisi(item, n)) continue;
    const g = validasiBaris(item, n);
    if (adaGalat(g)) {
      galat[item.kode] = g;
      jumlahGalat += 1;
      continue;
    }
    const b = bacaAngka(n.berfungsi);
    const t = bacaAngka(n.total);
    if (b.jenis !== "ok") continue;
    const berfungsi = b.nilai;
    const total = item.punyaRusak && t.jenis === "ok" ? t.nilai : berfungsi;
    const catatan = n.catatan.trim();
    baris.push({ itemKode: item.kode, total, berfungsi, ...(catatan ? { catatan } : {}) });
  }
  return { baris, galat, jumlahGalat };
}

export function berubah(awal: FormState, kini: FormState): boolean {
  return JSON.stringify(awal) !== JSON.stringify(kini);
}
