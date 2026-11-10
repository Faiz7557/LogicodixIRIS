import { describe, expect, it } from "vitest";
import { rankPriorities, skorDari } from "./engine";
import { mockCatalog, mockHarga, mockReadiness } from "./demo";

const dasar = { catalog: mockCatalog, items: mockReadiness.items, prices: mockHarga };

describe("mesin tiruan (TRD v2 §6)", () => {
  it("skor sekarang 65,3 dari data contoh", () => {
    expect(skorDari(mockReadiness.items, mockCatalog)).toBe(65.3);
  });

  it("pagu Rp15 juta: dua selang, skor 70,7", () => {
    const r = rankPriorities({ ...dasar, paguRp: 15_000_000 });
    expect(r.terpilih.map((x) => [x.itemKode, x.aksi, x.qty, x.biayaRp])).toEqual([["selang_keluar", "beli", 2, 13_338_000]]);
    expect(r.terpakaiRp).toBe(13_338_000);
    expect(r.skorSesudah).toBe(70.7);
    expect(r.terpilih[0].alasan).toBe("Selang keluar 3 dari 10 buah. Menaikkan cakupan ke 50%.");
  });

  it("pagu Rp30 juta memilih lebih banyak dan skor naik", () => {
    const a = rankPriorities({ ...dasar, paguRp: 15_000_000 });
    const b = rankPriorities({ ...dasar, paguRp: 30_000_000 });
    expect(b.terpilih[0].qty).toBe(4);
    expect(b.skorSesudah).toBeGreaterThan(a.skorSesudah);
  });

  it("pagu nol tidak memilih apa pun, tetapi ada yang tidak terdanai", () => {
    const r = rankPriorities({ ...dasar, paguRp: 0 });
    expect(r.terpilih).toEqual([]);
    expect(r.tidakTerdanai.length).toBeGreaterThan(0);
  });

  it("pagu di bawah harga termurah tetap aman", () => {
    expect(rankPriorities({ ...dasar, paguRp: 1000 }).terpilih).toEqual([]);
  });

  it("item tanpa harga dipisahkan", () => {
    expect(rankPriorities({ ...dasar, paguRp: 15_000_000 }).tanpaHarga).toEqual(["sumur_bor"]);
  });

  it("perbaikan didahulukan bila murah dan ada unit rusak", () => {
    const items = mockReadiness.items.map((i) => (i.itemKode === "sumur_bor" ? { ...i } : i));
    const prices = [...mockHarga, { itemKode: "sumur_bor", aksi: "perbaiki" as const, hargaRp: 400_000 }];
    const r = rankPriorities({ catalog: mockCatalog, items, prices, paguRp: 1_000_000 });
    expect(r.terpilih[0]).toMatchObject({ itemKode: "sumur_bor", aksi: "perbaiki", qty: 1 });
  });
});
