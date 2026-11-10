/*
 * Logika tampilan layar Kesiapan (App Flow v2 §3.7). Fungsi murni, tanpa React, mudah diuji.
 * Angka skor dan status datang dari mesin backend; di sini hanya urutan, kalimat, dan label.
 */
import { formatAngka } from "./format";
import type { CatalogItem, DesaPaparan, Peran, ReadinessItem, ReadinessResult, ReferensiPergub } from "./types";

export type ItemView = ReadinessItem & {
  nama: string;
  satuan: string;
  /** "3 / 10 buah" */
  label: string;
  /** "3 dari 10 buah" (untuk kalimat dan pembaca layar) */
  labelPanjang: string;
  persen: number;
};

/** Item terurut dari kesenjangan terbesar: cakupan terendah dulu, lalu bobot lebih besar, lalu kode. */
export function urutkanKesenjangan(items: ReadinessItem[], catalog: CatalogItem[]): ItemView[] {
  const byKode = new Map(catalog.map((c) => [c.kode, c]));
  return items
    .map((it): ItemView => {
      const c = byKode.get(it.itemKode);
      const satuan = c?.satuan ?? "";
      const target = formatAngka(it.target);
      const ada = formatAngka(it.berfungsi);
      return {
        ...it,
        nama: c?.nama ?? it.itemKode,
        satuan,
        label: `${ada} / ${target} ${satuan}`.trim(),
        labelPanjang: `${ada} dari ${target} ${satuan}`.trim(),
        persen: Math.round(Math.min(Math.max(it.coverage, 0), 1) * 100),
      };
    })
    .sort((a, b) => {
      if (a.coverage !== b.coverage) return a.coverage - b.coverage;
      const bobotA = byKode.get(a.itemKode)?.bobot ?? 0;
      const bobotB = byKode.get(b.itemKode)?.bobot ?? 0;
      if (bobotA !== bobotB) return bobotB - bobotA;
      return a.itemKode.localeCompare(b.itemKode);
    });
}

/**
 * Kalimat kesimpulan layar Kesiapan. Satu kalimat, nada menghormati desa.
 * Contoh: "Selang keluar paling genting: 3 dari 10 buah."
 */
export function kalimatRantaiTerlemah(hasil: ReadinessResult, items: ItemView[]): string {
  if (!hasil.rantaiTerlemah) return "Belum ada alat yang tercatat.";
  const it = items.find((i) => i.itemKode === hasil.rantaiTerlemah);
  if (!it) return "Belum ada alat yang tercatat.";
  if (it.belumDiisi) return `${it.nama} belum dicatat.`;
  if (it.coverage >= 1) return "Semua item sudah memenuhi paket minimum.";
  return `${it.nama} paling genting: ${it.labelPanjang}.`;
}

/** Ringkasan paparan satu baris. "deteksi satelit", bukan "kebakaran". */
export function ringkasanPaparan(p: Pick<DesaPaparan, "kExt" | "nExt">): string {
  if (p.kExt === 0) {
    return `Belum ada deteksi satelit pada ${formatAngka(p.nExt)} tahun kering ekstrem. Ini bukan jaminan aman.`;
  }
  return `Terdeteksi satelit pada ${formatAngka(p.kExt)} dari ${formatAngka(p.nExt)} tahun kering ekstrem.`;
}

export type KeadaanKesiapan = "kosong" | "sebagian" | "lengkap";

/** Kosong: tidak ada item terisi. Sebagian: ada yang belum diisi. */
export function keadaanKesiapan(hasil: ReadinessResult): KeadaanKesiapan {
  if (hasil.items.length === 0 || hasil.items.every((i) => i.belumDiisi)) return "kosong";
  return hasil.lengkap ? "lengkap" : "sebagian";
}

/** Akun mpa tidak melihat tombol Susun prioritas (App Flow §3.7, §4). */
export function bisaSusunPrioritas(peran: Peran): boolean {
  return peran === "desa";
}

/**
 * Keterangan provinsi. Pergub Kalteng 35/2025 hanya untuk desa Kalteng (prov_kode 62),
 * dan selalu berbunyi pembanding. Kalbar tidak punya angka per regu.
 */
export function keteranganProvinsi(provKode: string, pergub: ReferensiPergub[]): string {
  if (provKode === "62" && pergub.length > 0) {
    const daftar = pergub
      .map((r) => `${r.namaAlat.toLowerCase()} ${formatAngka(r.jumlahPerRegu)} ${r.satuan} (${r.pasal})`)
      .join(", ");
    return `Pembanding, bukan target desa: Pergub Kalimantan Tengah 35/2025 memuat per regu ${daftar}.`;
  }
  if (provKode === "61") {
    return "Kalimantan Barat belum memiliki angka alat per regu pada Pergub 56/2025.";
  }
  return "";
}
