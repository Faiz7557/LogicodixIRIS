import { describe, expect, it } from "vitest";
import {
  barisDisetujui,
  itemTermurah,
  kalimatPrioritas,
  keadaanPagu,
  keyBaris,
  parsePagu,
  ringkasKeputusan,
  totalBiaya,
} from "./prioritas";
import { mockCatalog, mockHarga, mockReadiness } from "@/test/fixtures";
import { rankPriorities } from "./engine/priority";

const hitung = (pagu: number, harga = mockHarga) =>
  rankPriorities({ catalog: mockCatalog, readiness: mockReadiness, prices: harga, paguRp: pagu });

describe("parsePagu", () => {
  it("menerima format Rupiah dan angka polos", () => {
    expect(parsePagu("Rp15.000.000")).toBe(15_000_000);
    expect(parsePagu("15000000")).toBe(15_000_000);
    expect(parsePagu("  30.000.000 ")).toBe(30_000_000);
  });
  it("bukan angka atau kosong jadi 0", () => {
    expect(parsePagu("")).toBe(0);
    expect(parsePagu("abc")).toBe(0);
  });
  it("dibatasi Rp1 miliar", () => {
    expect(parsePagu("99999999999999")).toBe(1_000_000_000);
  });
});

describe("keadaan dan kalimat", () => {
  it("pagu nol: teks persis App Flow", () => {
    expect(kalimatPrioritas(0, 65.3, hitung(0), mockHarga, mockCatalog)).toBe("Isi pagu untuk melihat urutan.");
  });
  it("pagu di bawah harga termurah menyebut item dan harganya", () => {
    expect(keadaanPagu(1000, hitung(1000), mockHarga)).toBe("kurang");
    expect(kalimatPrioritas(1000, 65.3, hitung(1000), mockHarga, mockCatalog)).toBe(
      "Pagu belum cukup untuk satu item. Item termurah: Pompa jinjing, Rp510.000.",
    );
  });
  it("semua harga kosong: teks persis App Flow", () => {
    expect(kalimatPrioritas(15_000_000, 65.3, hitung(15_000_000, []), [], mockCatalog)).toBe(
      "Belum ada harga. Isi harga dari penawaran setempat.",
    );
  });
  it("normal: skor sekarang menuju skor sesudah", () => {
    expect(kalimatPrioritas(15_000_000, 65.3, hitung(15_000_000), mockHarga, mockCatalog)).toBe(
      "Dengan pagu Rp15.000.000, skor kesiapan naik dari 65,3 menjadi 70,7.",
    );
  });
  it("item termurah", () => {
    expect(itemTermurah(mockHarga, mockCatalog)).toMatchObject({ nama: "Pompa jinjing", hargaRp: 510_000, aksi: "perbaiki" });
    expect(itemTermurah([], mockCatalog)).toBeNull();
  });
});

describe("keputusan", () => {
  const hasil = hitung(30_000_000);
  it("hanya baris setuju yang masuk usulan", () => {
    const k = { [keyBaris(hasil.terpilih[0])]: { keputusan: "setuju" as const } };
    expect(barisDisetujui(hasil.terpilih, k)).toHaveLength(1);
    expect(barisDisetujui(hasil.terpilih, { [keyBaris(hasil.terpilih[0])]: { keputusan: "tolak" as const } })).toEqual([]);
  });
  it("keputusan untuk baris yang tidak lagi terpilih diabaikan", () => {
    const lama = { "selang_keluar:beli": { keputusan: "setuju" as const } };
    expect(barisDisetujui(hitung(0).terpilih, lama)).toEqual([]);
  });
  it("ringkasan dan total biaya", () => {
    expect(ringkasKeputusan(hasil.terpilih, {})).toEqual({ setuju: 0, tolak: 0, tunda: 0, belum: hasil.terpilih.length });
    expect(totalBiaya(hasil.terpilih)).toBe(hasil.terpakaiRp);
  });
});
