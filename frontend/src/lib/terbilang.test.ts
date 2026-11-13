import { describe, expect, it } from "vitest";
import { terbilang, terbilangRupiah } from "./terbilang";

describe("terbilang", () => {
  it.each([
    [0, "nol"],
    [1, "satu"],
    [11, "sebelas"],
    [15, "lima belas"],
    [20, "dua puluh"],
    [100, "seratus"],
    [110, "seratus sepuluh"],
    [1000, "seribu"],
    [1500, "seribu lima ratus"],
    [21000, "dua puluh satu ribu"],
    [1_000_000, "satu juta"],
    [13_338_000, "tiga belas juta tiga ratus tiga puluh delapan ribu"],
    [528_000_000, "lima ratus dua puluh delapan juta"],
    [1_000_000_000, "satu miliar"],
  ])("%i", (n, teks) => {
    expect(terbilang(n)).toBe(teks);
  });

  it("menolak pecahan dan negatif", () => {
    expect(() => terbilang(1.5)).toThrow(RangeError);
    expect(() => terbilang(-1)).toThrow(RangeError);
  });

  it("rupiah dengan huruf besar tiap kata", () => {
    expect(terbilangRupiah(528_000_000)).toBe("Lima Ratus Dua Puluh Delapan Juta Rupiah");
  });
});
