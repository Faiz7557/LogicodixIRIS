import { describe, expect, it } from "vitest";
import { bentukDesa } from "./bentukDesa";
import { bolehTagline, headlinePaparan, kalimatKecamatan, kisahJangkar, labelTampakAman } from "./kalimat";

describe("headlinePaparan (rencana v2 Task 17)", () => {
  it("desa tenang dengan riwayat", () => {
    expect(headlinePaparan({ kExt: 2, nExt: 4, tahunTenang: 6 })).toBe(
      "Terdeteksi satelit pada 2 dari 4 tahun kering ekstrem. 6 tahun terakhir tenang.",
    );
  });
  it("tidak pernah terdeteksi bukan jaminan aman", () => {
    expect(headlinePaparan({ kExt: 0, nExt: 4, tahunTenang: 15 })).toContain("bukan jaminan aman");
  });
  it("terdeteksi di tahun terakhir tidak disebut tenang", () => {
    const t = headlinePaparan({ kExt: 3, nExt: 4, tahunTenang: 0 });
    expect(t).not.toContain("tenang");
    expect(t).toContain("Tahun terakhir pun terdeteksi");
  });
  it("selalu memakai kata satelit, bukan kebakaran", () => {
    expect(headlinePaparan({ kExt: 1, nExt: 4, tahunTenang: 2 }).toLowerCase()).not.toContain("kebakaran");
  });
});

describe("keputusan gerbang", () => {
  it("label Tampak aman hilang jika gerbang buang", () => {
    expect(labelTampakAman({ tampakAman: true, keputusan: "buang" })).toBe(false);
    expect(labelTampakAman({ tampakAman: true, keputusan: "lunakkan" })).toBe(true);
    expect(labelTampakAman({ tampakAman: false, keputusan: "pertahankan" })).toBe(false);
  });
  it("tagline hanya bila pertahankan", () => {
    expect(bolehTagline("pertahankan")).toBe(true);
    expect(bolehTagline("lunakkan")).toBe(false);
    expect(bolehTagline("buang")).toBe(false);
  });
});

describe("kalimatKecamatan", () => {
  it("laju dan rentang, bukan per desa", () => {
    expect(kalimatKecamatan({ pMean: 0.42, rateMin: 0.25, rateMax: 0.61 }, "Contoh")).toBe(
      "Di Kecamatan Contoh, rata-rata 42% desa terdeteksi satelit pada tahun kering ekstrem (terendah 25%, tertinggi 61% antar tahun).",
    );
  });
});

describe("bentukDesa", () => {
  const persegi = JSON.stringify({ type: "Polygon", coordinates: [[[109.38, -0.12], [109.43, -0.12], [109.43, -0.08], [109.38, -0.08], [109.38, -0.12]]] });
  it("menghasilkan jalur tertutup di dalam batas", () => {
    const b = bentukDesa(persegi, 280, 160)!;
    expect(b.path.startsWith("M")).toBe(true);
    expect(b.path.endsWith("Z")).toBe(true);
    expect(b.lebar).toBeLessThanOrEqual(280);
    expect(b.tinggi).toBeLessThanOrEqual(160);
  });
  it("geom rusak atau kosong tidak melempar", () => {
    expect(bentukDesa("bukan json")).toBeNull();
    expect(bentukDesa(JSON.stringify({ type: "Point", coordinates: [0, 0] }))).toBeNull();
  });
  it("mendukung MultiPolygon", () => {
    const mp = JSON.stringify({ type: "MultiPolygon", coordinates: [JSON.parse(persegi).coordinates, JSON.parse(persegi).coordinates] });
    expect(bentukDesa(mp)!.path.split("M").length - 1).toBe(2);
  });
});


describe("kisahJangkar (plan 11 Task 5)", () => {
  it("kisah jangkar dari angka nyata Kali Bandung", () => {
    const r = ([[2020, 2, true], [2021, 15, true], [2022, 0, false], [2023, 0, false], [2024, 7, true], [2025, 7, true], [2026, 365, true]] as const)
      .map(([tahun, nDet, terpapar]) => ({ tahun, nDet, terpapar }));
    expect(kisahJangkar(r)).toEqual({ tenang: 2, maksSebelum: 15, nDet2026: 365 });
  });
  it("tahun yang hilang dihitung nol, bukan galat", () => {
    expect(kisahJangkar([])).toEqual({ tenang: 0, maksSebelum: 0, nDet2026: 0 });
  });
});
