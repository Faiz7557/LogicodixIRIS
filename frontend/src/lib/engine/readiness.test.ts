import { describe, expect, it } from "vitest";
import type { CatalogItem, InventoryRow, TargetRow } from "@/lib/types";
import { computeReadiness } from "./readiness";

const item = (kode: string, nama: string, satuan: string): CatalogItem => ({
  kode, nama, satuan, bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false,
});
const cat = [item("pompa_jinjing", "Pompa jinjing", "unit"), item("selang_keluar", "Selang keluar", "buah")];
const t = (itemKode: string, target: number): TargetRow => ({ itemKode, target });
const targets = [t("pompa_jinjing", 1), t("selang_keluar", 10)];
const inv = (itemKode: string, total: number, berfungsi: number): InventoryRow => ({ itemKode, total, berfungsi });

describe("computeReadiness", () => {
  it("menghitung skor", () => {
    const r = computeReadiness(cat, targets, [inv("pompa_jinjing",1,1), inv("selang_keluar",3,3)]);
    expect([r.skor, r.status, r.rantaiTerlemah]).toEqual([65, "sebagian", "selang_keluar"]);
  });
  it("rawan jika kritis di bawah 25%", () => {
    expect(computeReadiness(cat, targets, [inv("pompa_jinjing",1,0), inv("selang_keluar",10,10)]).status).toBe("rawan");
  });
  it("membatasi cakupan di 1", () => {
    const r = computeReadiness(cat, targets, [inv("pompa_jinjing",9,9), inv("selang_keluar",12,12)]);
    expect([r.skor, r.status]).toEqual([100, "siap"]);
  });
  it("item kosong belum lengkap", () => {
    const r = computeReadiness(cat, targets, [inv("pompa_jinjing",1,1)]);
    expect(r.lengkap).toBe(false);
    expect(r.items.find(i => i.itemKode === "selang_keluar")!.belumDiisi).toBe(true);
  });
  it("mengabaikan target nol", () => {
    expect(computeReadiness(cat, [t("pompa_jinjing",1), t("selang_keluar",0)], [inv("pompa_jinjing",1,1)]).skor).toBe(100);
  });
});
