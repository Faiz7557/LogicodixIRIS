import { describe, expect, it } from "vitest";
import { mockCatalog } from "@/test/fixtures";
import type { ItemView } from "@/lib/kesiapan";
import type { HargaRow } from "@/lib/types";
import { barisTindakan } from "./RingkasanGudang";

const item = (itemKode: string, target: number, berfungsi: number, rusak: number): ItemView => ({
  itemKode,
  target,
  berfungsi,
  rusak,
  coverage: Math.min(berfungsi / target, 1),
  kritis: true,
  belumDiisi: false,
  nama: itemKode,
  satuan: "unit",
  label: "",
  labelPanjang: "",
  persen: 0,
});

const harga = (itemKode: string, beli: number | null, perbaiki: number | null): HargaRow[] =>
  [
    beli === null ? null : { itemKode, aksi: "beli" as const, hargaRp: beli, sumber: "uji" },
    perbaiki === null ? null : { itemKode, aksi: "perbaiki" as const, hargaRp: perbaiki, sumber: "uji" },
  ].filter((h) => h !== null);

describe("barisTindakan", () => {
  it("memperbaiki unit rusak dulu dan tidak membeli bila perbaikan sudah menutup kekurangan", () => {
    const b = barisTindakan([item("pompa_jinjing", 67, 59, 8)], mockCatalog, harga("pompa_jinjing", 28_028_610, 510_000));
    expect(b.map((x) => [x.kunci, x.aksi, x.biaya])).toEqual([["pompa_jinjing:perbaiki", "Perbaiki 8 unit", 4_080_000]]);
  });

  it("membeli sisa kekurangan setelah semua unit rusak diperbaiki", () => {
    const b = barisTindakan([item("pompa_jinjing", 10, 4, 2)], mockCatalog, harga("pompa_jinjing", 1_000, 100));
    expect(b.map((x) => [x.aksi, x.biaya])).toEqual([
      ["Perbaiki 2 unit", 200],
      ["Beli 4 unit", 4_000],
    ]);
  });

  it("hanya memperbaiki sebanyak kekurangan walau unit rusak lebih banyak", () => {
    const b = barisTindakan([item("selang_keluar", 10, 9, 3)], mockCatalog, harga("selang_keluar", 120_000, 120_000));
    expect(b.map((x) => x.aksi)).toEqual(["Perbaiki 1 unit"]);
  });

  it("membeli pengganti unit rusak bila harga perbaikan belum ada", () => {
    const b = barisTindakan([item("pompa_jinjing", 10, 7, 3)], mockCatalog, harga("pompa_jinjing", 1_000, null));
    expect(b.map((x) => [x.aksi, x.biaya])).toEqual([["Beli 3 unit", 3_000]]);
  });

  it("tidak memuat item yang paket minimumnya sudah terpenuhi, walau ada yang rusak", () => {
    expect(barisTindakan([item("pompa_jinjing", 5, 6, 2)], mockCatalog, harga("pompa_jinjing", 1_000, 100))).toEqual([]);
  });
});
