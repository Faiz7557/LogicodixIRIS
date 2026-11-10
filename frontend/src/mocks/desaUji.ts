/*
 * Empat desa uji berlabel untuk mencoba prototipe tanpa hasil pipeline.
 * Nama, wilayah, deteksi, dan alat semuanya karangan (bukan desa atau data nyata), dan
 * nama desa/kecamatan memakai kata "Uji" supaya tidak terbaca sebagai hasil. Hapus bersama `src/mocks/`.
 *
 * Skor kesiapan dihitung dengan mesin asli `computeReadiness`, bukan diketik tangan.
 *
 *   uji-tanjung  Kalbar, gambut, paparan tinggi, alat rawan
 *   uji-parit    Kalteng (keterangan Pergub), gambut, paparan sedang dan masih aktif, sebagian siap
 *   uji-sei      Kalbar, gambut, tampak aman (terdeteksi 2015 dan 2019 lalu tenang), alat siap
 *   uji-bukit    Kalteng, bukan gambut (tanpa sumur bor), tak pernah terdeteksi, alat belum dicatat
 */
import { computeReadiness } from "@/lib/engine/readiness";
import type { DesaCard, InventoryRow, PaketRow, ReadinessResult } from "@/lib/types";
import { mockCatalog, mockDesaCard, mockPaket, stripDari } from "./demo";

export interface DesaUji {
  kode: string;
  nama: string;
  kecNama: string;
  kabNama: string;
  provNama: "Kalimantan Barat" | "Kalimantan Tengah";
  provKode: "61" | "62";
  peatFrac: number;
  luasHa: number;
  terpapar: number[];
  paparan: Pick<DesaCard["paparan"], "kExt" | "tahunTenang" | "tampakAman" | "tier" | "skor">;
  /** Kosong = alat belum pernah dicatat. */
  alat: InventoryRow[];
}

export const DESA_UJI: DesaUji[] = [
  {
    kode: "uji-tanjung",
    nama: "Desa Uji Tanjung Gambut",
    kecNama: "Uji Hilir",
    kabNama: "Kabupaten Uji Barat",
    provNama: "Kalimantan Barat",
    provKode: "61",
    peatFrac: 0.81,
    luasHa: 6100,
    terpapar: [2014, 2015, 2018, 2019, 2023, 2026],
    paparan: { kExt: 4, tahunTenang: 0, tampakAman: false, tier: "tinggi", skor: 0.88 },
    alat: [
      { itemKode: "dana_operasi", total: 0, berfungsi: 0 },
      { itemKode: "pompa_jinjing", total: 1, berfungsi: 0 },
      { itemKode: "selang_keluar", total: 4, berfungsi: 2 },
      { itemKode: "sumur_bor", total: 3, berfungsi: 1 },
    ],
  },
  {
    kode: "uji-parit",
    nama: "Desa Uji Parit Hilir",
    kecNama: "Uji Tengah",
    kabNama: "Kabupaten Uji Tengah",
    provNama: "Kalimantan Tengah",
    provKode: "62",
    peatFrac: 0.47,
    luasHa: 3800,
    terpapar: [2019, 2023, 2024],
    paparan: { kExt: 2, tahunTenang: 2, tampakAman: false, tier: "sedang", skor: 0.55 },
    alat: [
      { itemKode: "dana_operasi", total: 1, berfungsi: 1 },
      { itemKode: "pompa_jinjing", total: 2, berfungsi: 1 },
      { itemKode: "selang_keluar", total: 8, berfungsi: 6 },
      { itemKode: "sumur_bor", total: 4, berfungsi: 2 },
    ],
  },
  {
    kode: "uji-sei",
    nama: "Desa Uji Sei Kering",
    kecNama: "Uji Hulu",
    kabNama: "Kabupaten Uji Barat",
    provNama: "Kalimantan Barat",
    provKode: "61",
    peatFrac: 0.33,
    luasHa: 5200,
    terpapar: [2015, 2019],
    paparan: { kExt: 2, tahunTenang: 7, tampakAman: true, tier: "sedang", skor: 0.49 },
    alat: [
      { itemKode: "dana_operasi", total: 1, berfungsi: 1 },
      { itemKode: "pompa_jinjing", total: 2, berfungsi: 2 },
      { itemKode: "selang_keluar", total: 12, berfungsi: 11 },
      { itemKode: "sumur_bor", total: 5, berfungsi: 5 },
    ],
  },
  {
    kode: "uji-bukit",
    nama: "Desa Uji Bukit Rendah",
    kecNama: "Uji Darat",
    kabNama: "Kabupaten Uji Tengah",
    provNama: "Kalimantan Tengah",
    provKode: "62",
    peatFrac: 0,
    luasHa: 2900,
    terpapar: [],
    paparan: { kExt: 0, tahunTenang: 15, tampakAman: false, tier: "rendah", skor: 0.06 },
    alat: [],
  },
];

export const cariUji = (kode: string) => DESA_UJI.find((d) => d.kode === kode);

/** Paket minimum per desa: sumur bor hanya untuk desa gambut (PRD v2 §7). */
export function paketUji(d: DesaUji): PaketRow[] {
  return d.peatFrac > 0 ? mockPaket : mockPaket.filter((p) => p.itemKode !== "sumur_bor");
}

export function kartuUji(d: DesaUji): DesaCard {
  return {
    ...mockDesaCard,
    desa: {
      ...mockDesaCard.desa,
      kode: d.kode,
      nama: d.nama,
      kecKode: d.kecNama.toLowerCase().replace(/\s+/g, "-"),
      kecNama: d.kecNama,
      kabNama: d.kabNama,
      provNama: d.provNama,
      provKode: d.provKode,
      luasHa: d.luasHa,
      peatFrac: d.peatFrac,
    },
    strip: stripDari(d.terpapar),
    paparan: {
      ...mockDesaCard.paparan,
      ...d.paparan,
      nExt: mockDesaCard.tahunEkstrem.length,
      kNorm: d.terpapar.filter((t) => !mockDesaCard.tahunEkstrem.includes(t)).length,
    },
  };
}

export function kesiapanUji(d: DesaUji): ReadinessResult {
  return computeReadiness(mockCatalog, paketUji(d), d.alat);
}
