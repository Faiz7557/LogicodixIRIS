import { describe, expect, it } from "vitest";
import { mockCatalog } from "@/test/fixtures";
import { parseInventoryTextDenganAi } from "@/server/parseInventaris";
import { PESAN } from "./inventaris";
import { MAKS_TEKS, parseInventoryText, parsedInventorySchema, stripPhones } from "./parseInventaris";

describe("parseInventaris", () => {
  it("menghapus nomor telepon", () => {
    expect(stripPhones("hub 081234567890 pompa jinjing 2")).not.toMatch(/\d{9,}/);
  });

  it("membaca item, total, dan berfungsi", async () => {
    expect(await parseInventoryText("Pompa jinjing 2, 1 berfungsi\nSelang keluar 10", mockCatalog)).toEqual([
      { itemKode: "pompa_jinjing", total: 2, berfungsi: 1 },
      { itemKode: "selang_keluar", total: 10, berfungsi: 10 },
    ]);
  });

  it("mengabaikan item di luar katalog", async () => {
    expect(await parseInventoryText("Tank air 2", mockCatalog)).toEqual([]);
  });

  it("menolak berfungsi melebihi total", async () => {
    await expect(parseInventoryText("Pompa jinjing 1 2", mockCatalog)).rejects.toThrow(PESAN.melebihi);
  });

  it("menolak teks terlalu panjang", async () => {
    await expect(parseInventoryText("x".repeat(MAKS_TEKS + 1), mockCatalog)).rejects.toThrow();
  });

  it("skema menolak berfungsi melebihi total", () => {
    expect(parsedInventorySchema.safeParse([{ itemKode: "pompa_jinjing", total: 1, berfungsi: 2 }]).success).toBe(false);
  });

  it("jatuh ke parser deterministik tanpa kunci AI", async () => {
    const kunci = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const r = await parseInventoryTextDenganAi("Pompa jinjing 2", mockCatalog);
      expect(r.sumber).toBe("deterministik");
      expect(r.hasil).toEqual([{ itemKode: "pompa_jinjing", total: 2, berfungsi: 2 }]);
    } finally {
      if (kunci) process.env.ANTHROPIC_API_KEY = kunci;
    }
  });
});
