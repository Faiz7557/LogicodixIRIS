import { describe, expect, it } from "vitest";
import { sebarBulanan } from "./satelitBulanan";

describe("sebarBulanan (demo)", () => {
  it("total per tahun tetap sama", () => {
    for (const hari of [1, 2, 5, 12, 34, 120]) {
      expect(sebarBulanan("TINGGI", 2015, hari, true).reduce((a, b) => a + b, 0)).toBe(hari);
    }
  });

  it("tidak melebihi jumlah hari dalam bulan", () => {
    const b = sebarBulanan("TINGGI", 2015, 300, true);
    expect(b[1]).toBeLessThanOrEqual(28);
    expect(Math.max(...b)).toBeLessThanOrEqual(31);
  });

  it("nol hari menghasilkan dua belas nol", () => {
    expect(sebarBulanan("X", 2012, 0, false)).toEqual(Array(12).fill(0));
  });

  it("deterministik dan terpusat di kemarau", () => {
    const a = sebarBulanan("TINGGI", 2019, 21, true);
    expect(sebarBulanan("TINGGI", 2019, 21, true)).toEqual(a);
    const kemarau = a[6] + a[7] + a[8] + a[9] + a[10];
    expect(kemarau).toBeGreaterThan(21 / 2);
  });
});
