/*
 * Pencarian desa tiruan (menggantikan GET /api/desa?q=). `%` dan `_` diperlakukan literal (rencana v2 Task 9).
 * Kata "galat" memicu keadaan gagal jaringan. Hapus bersama `src/mocks/`.
 *
 * Tiap hasil membawa `pratinjau` (strip deteksi dan ringkasan paparan) untuk kartu hasil. API nyata saat ini
 * hanya membalas DesaHit; kartu tetap tampil tanpa strip bila `pratinjau` tidak ada.
 */
import type { HasilCari, PratinjauPaparan } from "@/components/paparan/KartuHasilDesa";
import type { Tier } from "@/lib/types";
import { DESA_UJI } from "./desaUji";
import { stripDari } from "./demo";

function pratinjau(terpapar: number[], kExt: number, tahunTenang: number, tier: Tier): PratinjauPaparan {
  return { strip: stripDari(terpapar).map(({ tahun, terpapar }) => ({ tahun, terpapar })), kExt, nExt: 4, tahunTenang, tier };
}

const DAFTAR: HasilCari[] = [
  {
    kode: "contoh",
    nama: "Contoh Desa",
    kecNama: "Contoh Kecamatan",
    kabNama: "Contoh Kabupaten",
    provNama: "Kalimantan Barat",
    pratinjau: pratinjau([2015, 2019, 2026], 3, 0, "tinggi"),
  },
  {
    kode: "tampakaman",
    nama: "Contoh Desa Tampak Aman",
    kecNama: "Contoh Kecamatan",
    kabNama: "Contoh Kabupaten",
    provNama: "Kalimantan Barat",
    pratinjau: pratinjau([2015, 2019], 2, 7, "tinggi"),
  },
  {
    kode: "takpernah",
    nama: "Contoh Desa Tanpa Deteksi",
    kecNama: "Kecamatan Lain",
    kabNama: "Contoh Kabupaten",
    provNama: "Kalimantan Barat",
    pratinjau: pratinjau([], 0, 15, "rendah"),
  },
  {
    kode: "kalteng",
    nama: "Contoh Desa Kalteng",
    kecNama: "Kecamatan Tengah",
    kabNama: "Kabupaten Tengah",
    provNama: "Kalimantan Tengah",
    pratinjau: pratinjau([2015, 2019, 2026], 3, 0, "tinggi"),
  },
  ...DESA_UJI.map((d) => ({
    kode: d.kode,
    nama: d.nama,
    kecNama: d.kecNama,
    kabNama: d.kabNama,
    provNama: d.provNama,
    pratinjau: pratinjau(d.terpapar, d.paparan.kExt, d.paparan.tahunTenang, d.paparan.tier),
  })),
];

export async function cariDesaContoh(q: string): Promise<HasilCari[]> {
  await new Promise((r) => setTimeout(r, 350));
  const kata = q.trim().toLowerCase();
  if (kata === "galat") throw new Error("jaringan");
  if (/[%_\\]/.test(kata)) return []; // literal: tidak ada nama desa memuat karakter ini
  return DAFTAR.filter((d) => `${d.nama} ${d.kecNama} ${d.kabNama}`.toLowerCase().includes(kata)).slice(0, 20);
}
