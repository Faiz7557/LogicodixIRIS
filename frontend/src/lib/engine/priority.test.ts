import { describe, expect, it } from "vitest";
import type { CatalogItem, PriceRow } from "@/lib/types";
import { computeReadiness } from "./readiness";
import { rankPriorities } from "./priority";

// Katalog dan harga: Backend Schema §6, PRD §8.
const cat: CatalogItem[] = [
  { kode: "pompa_jinjing", nama: "Pompa jinjing", satuan: "unit", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false },
  { kode: "selang_keluar", nama: "Selang keluar", satuan: "buah", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false },
];
const targets = [
  { itemKode: "pompa_jinjing", target: 1 },
  { itemKode: "selang_keluar", target: 10 },
];
const prices: PriceRow[] = [
  { itemKode: "pompa_jinjing", aksi: "beli", hargaRp: 28028610 },
  { itemKode: "pompa_jinjing", aksi: "perbaiki", hargaRp: 510000 },
  { itemKode: "selang_keluar", aksi: "beli", hargaRp: 6669000 },
];
const readiness = computeReadiness(cat, targets, [
  { itemKode: "pompa_jinjing", total: 1, berfungsi: 0 },
  { itemKode: "selang_keluar", total: 3, berfungsi: 3 },
]);
const readinessPompaRusak3 = computeReadiness(cat, targets, [
  { itemKode: "pompa_jinjing", total: 3, berfungsi: 0 },
  { itemKode: "selang_keluar", total: 3, berfungsi: 3 },
]);

describe("rankPriorities", () => {
  it("mendahulukan perbaikan lalu membeli sampai pagu", () => {
    const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 15e6 });
    expect(r.terpilih.map(x => [x.itemKode, x.aksi, x.qty, x.biayaRp])).toEqual([
      ["pompa_jinjing","perbaiki",1,510000],
      ["selang_keluar","beli",2,13338000],
    ]);
    expect([r.terpakaiRp, r.skorSesudah]).toEqual([13848000, 75]);
  });
  it("menggabungkan baris item yang sama", () => {
    const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 30e6 });
    expect(r.terpilih.find(x => x.itemKode === "selang_keluar")).toMatchObject({ qty: 4, biayaRp: 26676000 });
  });
  it("perbaikan dibatasi sisa kesenjangan", () => {
    const r = rankPriorities({ catalog: cat, readiness: readinessPompaRusak3, prices, paguRp: 15e6 });
    expect(r.terpilih.filter(x => x.itemKode === "pompa_jinjing")).toEqual([expect.objectContaining({ aksi: "perbaiki", qty: 1 })]);
  });
  it("pagu nol tidak memilih apa pun", () => {
    const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 0 });
    expect(r.terpilih).toEqual([]);
    expect(r.tidakTerdanai.length).toBeGreaterThan(0);
  });
  it("pagu di bawah harga termurah aman", () => {
    expect(rankPriorities({ catalog: cat, readiness, prices, paguRp: 1000 }).terpilih).toEqual([]);
  });
  it("item tanpa harga dipisahkan", () => {
    const r = rankPriorities({ catalog: cat, readiness, prices: prices.filter(p => p.itemKode !== "selang_keluar"), paguRp: 15e6 });
    expect(r.tanpaHarga).toContain("selang_keluar");
  });
  it("setiap baris punya alasan", () => {
    rankPriorities({ catalog: cat, readiness, prices, paguRp: 15e6 }).terpilih.forEach(x => expect(x.alasan.length).toBeGreaterThan(10));
  });
  it("alasan mengikuti template TRD", () => {
    const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 15e6 });
    expect(r.terpilih.find(x => x.itemKode === "selang_keluar")!.alasan).toBe("Selang keluar 3 dari 10 buah. Menaikkan cakupan ke 50%.");
  });
});
