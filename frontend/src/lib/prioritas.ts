/*
 * Logika tampilan layar Prioritas (App Flow v2 §3.8). Fungsi murni.
 * Urutan dan skor datang dari mesin backend; di sini hanya pagu, keadaan, kalimat, dan keputusan.
 */
import { hasilDariItems, round1, skorDari } from "./engine/readiness";
import { formatRupiah, formatSkor } from "./format";
import type { Aksi, BarisTerkunci, CatalogItem, Keputusan, PriceRow, PriorityResult, PriorityRow, ReadinessResult } from "./types";

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

export type KeadaanPagu = "tanpaHarga" | "nol" | "terpenuhi" | "kurang" | "ok";

export function keadaanPagu(paguRp: number, hasil: PriorityResult, harga: PriceRow[]): KeadaanPagu {
  if (harga.length === 0) return "tanpaHarga";
  if (paguRp <= 0) return "nol";
  // Tidak ada yang perlu dibeli atau diperbaiki lagi (mis. sudah tercakup surat usulan): bukan "kurang".
  if (hasil.terpilih.length === 0 && hasil.tidakTerdanai.length === 0 && hasil.tanpaHarga.length === 0) return "terpenuhi";
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
    case "terpenuhi":
      return "Semua kebutuhan paket minimum sudah terpenuhi, termasuk yang sudah dibuat surat usulan.";
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

export function totalBiaya(baris: Pick<PriorityRow, "biayaRp">[]): number {
  return baris.reduce((s, r) => s + r.biayaRp, 0);
}

/**
 * Anggaran sementara: anggaran dikurangi belanja yang sudah disetujui. Tunda dan tolak tidak mengurangi.
 * Hanya informasi; urutan saran tetap dihitung dari anggaran penuh supaya saran tidak bergeser tiap kali menyetujui.
 */
export function anggaranSementara(paguRp: number, disetujui: PriorityRow[]): { disetujuiRp: number; sisaRp: number } {
  const disetujuiRp = totalBiaya(disetujui);
  return { disetujuiRp, sisaRp: Math.max(0, paguRp - disetujuiRp) };
}

/** Skor kesiapan bila hanya baris yang disetujui dibeli atau diperbaiki (perbaikan dan pembelian sama-sama menambah alat berfungsi). */
export function skorSetelahDisetujui(readiness: ReadinessResult, catalog: CatalogItem[], disetujui: PriorityRow[]): number {
  const tambah = new Map<string, number>();
  for (const r of disetujui) tambah.set(r.itemKode, (tambah.get(r.itemKode) ?? 0) + r.qty);
  const sesudah = readiness.items.map((i) => ({
    itemKode: i.itemKode,
    coverage: i.target > 0 ? Math.min((i.berfungsi + (tambah.get(i.itemKode) ?? 0)) / i.target, 1) : i.coverage,
  }));
  return round1(skorDari(sesudah, catalog));
}

/**
 * Kesiapan dengan baris terkunci (sudah masuk surat usulan) dianggap sudah dibeli atau diperbaiki.
 * Dipakai untuk skor "asli" di layar Prioritas dan sebagai titik awal saran baru, supaya sistem tidak
 * menyarankan ulang alat yang sudah diusulkan. Kesiapan fisik di layar Kesiapan tidak ikut berubah.
 */
export function tambahTerkunci(readiness: ReadinessResult, terkunci: BarisTerkunci[], catalog: CatalogItem[]): ReadinessResult {
  if (terkunci.length === 0) return readiness;
  const beli = new Map<string, number>();
  const perbaiki = new Map<string, number>();
  for (const t of terkunci) {
    const peta = t.aksi === "perbaiki" ? perbaiki : beli;
    peta.set(t.itemKode, (peta.get(t.itemKode) ?? 0) + t.qty);
  }
  const items = readiness.items.map((i) => {
    const pulih = Math.min(perbaiki.get(i.itemKode) ?? 0, i.rusak);
    const berfungsi = i.berfungsi + (beli.get(i.itemKode) ?? 0) + pulih;
    return { ...i, berfungsi, rusak: i.rusak - pulih, coverage: i.target > 0 ? Math.min(berfungsi / i.target, 1) : i.coverage };
  });
  return { ...hasilDariItems(items, catalog), lengkap: readiness.lengkap };
}

export const ALASAN_MIN = 5;

export type RingkasAnggaran = {
  /** Biaya semua kebutuhan yang punya harga; dasar kurva "skor menurut besar anggaran". */
  kebutuhan: number;
  kekurangan: number;
  disetujuiRp: number;
  jumlahDisetujui: number;
  sisaRp: number;
  skorDisetujui: number;
  cukup: boolean;
  /** Pagu dua kali lipat atau lebih dari seluruh kebutuhan hampir pasti salah ketik (mis. kelebihan nol). */
  berlebih: boolean;
  cakupan: { kode: string; nama: string; satuan: string; target: number; sebelum: number; sesudah: number; persenSebelum: number; persenSesudah: number }[];
};

/**
 * Angka halaman Anggaran (langkah 1): kebutuhan, kekurangan, anggaran terpakai, dan cakupan per item.
 * Dipakai `PaguView` dan fakta ringkasan AI, supaya keduanya menyebut angka yang sama.
 */
export function ringkasAnggaran(
  hasil: PriorityResult,
  readiness: ReadinessResult,
  catalog: CatalogItem[],
  paguRp: number,
  keputusan: KeputusanMap,
): RingkasAnggaran {
  const disetujui = barisDisetujui(hasil.terpilih, keputusan);
  const sementara = anggaranSementara(paguRp, disetujui);
  const kebutuhan = totalBiaya([...hasil.terpilih, ...hasil.tidakTerdanai]);
  const kekurangan = totalBiaya(hasil.tidakTerdanai);
  const nama = (kode: string) => catalog.find((c) => c.kode === kode)?.nama ?? kode;
  const satuan = (kode: string) => catalog.find((c) => c.kode === kode)?.satuan ?? "";
  const persen = (ada: number, target: number) => Math.round(Math.min(ada / target, 1) * 100);
  return {
    kebutuhan,
    kekurangan,
    disetujuiRp: sementara.disetujuiRp,
    jumlahDisetujui: disetujui.length,
    sisaRp: sementara.sisaRp,
    skorDisetujui: skorSetelahDisetujui(readiness, catalog, disetujui),
    cukup: kekurangan === 0,
    berlebih: kebutuhan > 0 && paguRp >= kebutuhan * 2,
    cakupan: readiness.items
      .filter((i) => i.target > 0)
      .map((i) => {
        const sesudah = i.berfungsi + hasil.terpilih.filter((b) => b.itemKode === i.itemKode).reduce((a, b) => a + b.qty, 0);
        return {
          kode: i.itemKode,
          nama: nama(i.itemKode),
          satuan: satuan(i.itemKode),
          target: i.target,
          sebelum: i.berfungsi,
          sesudah,
          persenSebelum: persen(i.berfungsi, i.target),
          persenSesudah: persen(sesudah, i.target),
        };
      }),
  };
}
