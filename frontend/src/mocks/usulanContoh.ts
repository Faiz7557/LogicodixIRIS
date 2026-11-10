/*
 * Penyusun usulan tiruan. Menggantikan buildFacts + terbitkanUsulan (v2 Task 16, backend).
 * Fakta dibekukan saat terbit: semua nilai disalin ke objek Usulan, tidak dihitung ulang saat dibuka.
 */
import { formatRupiah, formatSkor, formatTanggal } from "@/lib/format";
import { barisDisetujui, totalBiaya, type KeputusanMap } from "@/lib/prioritas";
import type { Kanal, Usulan } from "@/lib/types";
import { mockCatalog } from "./demo";
import { rantaiTerlemahDari, skorDari, statusDari } from "./engine";
import { bangunKonteks, hitungContoh } from "./prioritasContoh";
import type { Simpanan } from "./store";
import { renderTemplate } from "./templates";

export interface InfoDesa {
  nama: string;
  kecNama: string;
  kabNama: string;
  kExt: number;
  nExt: number;
  tahunTenang: number;
}

const STATUS_TEKS = { siap: "siap", sebagian: "sebagian siap", rawan: "rawan" } as const;

/** Mengembalikan null bila tidak ada baris disetujui (UI menampilkan: Belum ada baris yang disetujui). */
export function susunUsulan(args: {
  id: number;
  kode: string;
  kanal: Kanal;
  info: InfoDesa;
  sim: Pick<Simpanan, "pagu" | "harga" | "paket" | "keputusan">;
  /** Hanya untuk contoh dokumen bila belum ada keputusan tersimpan. */
  setujuSemua?: boolean;
}): Usulan | null {
  const { id, kode, kanal, info, sim, setujuSemua } = args;
  const k = bangunKonteks(sim);
  const hasil = hitungContoh(sim.pagu, k);
  const keputusan: KeputusanMap = setujuSemua
    ? Object.fromEntries(hasil.terpilih.map((b) => [`${b.itemKode}:${b.aksi}`, { keputusan: "setuju" as const }]))
    : sim.keputusan;
  const baris = barisDisetujui(hasil.terpilih, keputusan);
  if (baris.length === 0) return null;

  const nama = (c: string) => mockCatalog.find((x) => x.kode === c)?.nama ?? c;
  const berfungsiBaru: Record<string, number> = {};
  for (const i of k.items) berfungsiBaru[i.itemKode] = i.berfungsi;
  for (const b of baris) berfungsiBaru[b.itemKode] += b.qty;

  const rantai = rantaiTerlemahDari(k.items, mockCatalog);
  const now = new Date().toISOString();
  const facts = {
    desa: info.nama,
    kecamatan: info.kecNama,
    kabupaten: info.kabNama,
    skor: formatSkor(k.skorSekarang),
    status: STATUS_TEKS[statusDari(k.items, mockCatalog, k.skorSekarang)],
    rantai_terlemah: rantai ? nama(rantai) : "belum ada",
    paparan: `${info.kExt} dari ${info.nExt} tahun kering ekstrem`,
    tahun_tenang: String(info.tahunTenang),
    pagu: formatRupiah(sim.pagu),
    total_usulan: formatRupiah(totalBiaya(baris)),
    skor_sesudah: formatSkor(skorDari(k.items, mockCatalog, berfungsiBaru)),
    tanggal: formatTanggal(now),
  };

  return {
    id,
    desaKode: kode,
    kanal,
    facts,
    baris: baris.map((b) => ({
      ...b,
      nama: nama(b.itemKode),
      satuan: mockCatalog.find((x) => x.kode === b.itemKode)?.satuan,
      sumberHarga: k.harga.find((h) => h.itemKode === b.itemKode && h.aksi === b.aksi)?.sumber,
    })),
    teks: renderTemplate(facts, kanal),
    sumberTeks: "template",
    model: null,
    createdAt: now,
  };
}
