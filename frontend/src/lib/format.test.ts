import { describe, expect, it } from "vitest";
import {
  formatAngka,
  formatPersen,
  formatRupiah,
  formatSkor,
  formatTanggal,
  formatWaktu,
  keteranganMeter,
  namaBersih,
} from "./format";

describe("format", () => {
  it("memakai titik ribuan dan koma desimal", () => {
    expect(formatAngka(1234567)).toBe("1.234.567");
    expect(formatAngka(1234.56, 1)).toBe("1.234,6");
    expect(formatAngka(0)).toBe("0");
  });

  it("rupiah tanpa spasi dan tanpa desimal", () => {
    expect(formatRupiah(7_000_000)).toBe("Rp7.000.000");
    expect(formatRupiah(999)).toBe("Rp999");
    expect(formatRupiah(28_028_610)).toBe("Rp28.028.610");
  });

  it("skor satu desimal", () => {
    expect(formatSkor(41.7)).toBe("41,7");
    expect(formatSkor(100)).toBe("100,0");
  });

  it("persen bulat", () => {
    expect(formatPersen(0.425)).toBe("43%");
  });

  it("nilai tidak valid jadi tanda pisah", () => {
    expect(formatAngka(Number.NaN)).toBe("–");
    expect(formatRupiah(Infinity)).toBe("–");
    expect(formatTanggal("bukan-tanggal")).toBe("–");
  });

  it("tanggal dan waktu dalam WIB", () => {
    expect(formatTanggal("2026-11-12T03:15:00Z")).toBe("12 November 2026");
    expect(formatWaktu("2026-11-12T03:15:00Z")).toBe("12 November 2026, 10.15 WIB");
    // 20.00 UTC sudah berganti hari di WIB
    expect(formatTanggal("2026-11-12T20:00:00Z")).toBe("13 November 2026");
  });

  it("keterangan meter berlabel turunan", () => {
    expect(keteranganMeter(3)).toBe("≈60 m pada asumsi 20 m per buah");
    expect(keteranganMeter(10, 30)).toBe("≈300 m pada asumsi 30 m per buah");
  });

  it("membersihkan nama HDX bergaris miring", () => {
    expect(namaBersih("Sungai Raya/ Sei Raya")).toBe("Sungai Raya");
    expect(namaBersih("Kalibandung")).toBe("Kalibandung");
  });
});
