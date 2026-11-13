import { describe, expect, it } from "vitest";
import {
  anggaranSementara,
  barisDisetujui,
  itemTermurah,
  kalimatPrioritas,
  keadaanPagu,
  keyBaris,
  parsePagu,
  ringkasKeputusan,
  skorSetelahDisetujui,
  tambahTerkunci,
  totalBiaya,
} from "./prioritas";
import type { PriorityRow } from "./types";
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
    expect(kalimatPrioritas(0, 56.7, hitung(0), mockHarga, mockCatalog)).toBe("Isi anggaran untuk melihat urutan belanja.");
  });
  it("pagu di bawah harga termurah menyebut item dan harganya", () => {
    expect(keadaanPagu(1000, hitung(1000), mockHarga)).toBe("kurang");
  });
  it("tidak ada kebutuhan tersisa: terpenuhi, bukan kurang", () => {
    const kosong = { paguRp: 300e6, terpakaiRp: 0, skorSesudah: 100, terpilih: [], tidakTerdanai: [], tanpaHarga: [] };
    expect(keadaanPagu(300e6, kosong, mockHarga)).toBe("terpenuhi");
    expect(kalimatPrioritas(300e6, 100, kosong, mockHarga, mockCatalog)).toContain("sudah terpenuhi");
    expect(kalimatPrioritas(1000, 56.7, hitung(1000), mockHarga, mockCatalog)).toBe(
      "Anggaran belum cukup untuk satu alat pun. Yang termurah: Pompa jinjing, Rp510.000.",
    );
  });
  it("semua harga kosong: teks persis App Flow", () => {
    expect(kalimatPrioritas(15_000_000, 56.7, hitung(15_000_000, []), [], mockCatalog)).toBe(
      "Belum ada harga. Isi harga dari penawaran setempat.",
    );
  });
  it("normal: skor sekarang menuju skor sesudah", () => {
    expect(kalimatPrioritas(15_000_000, 56.7, hitung(15_000_000), mockHarga, mockCatalog)).toBe(
      "Dengan anggaran Rp15.000.000, skor kesiapan naik dari 56,7 menjadi 63,3.",
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

describe("anggaran sementara", () => {
  const baris = (itemKode: string, aksi: PriorityRow["aksi"], qty: number, biayaRp: number): PriorityRow => ({ itemKode, aksi, qty, biayaRp, alasan: "" });
  const selang2 = baris("selang_keluar", "beli", 2, 13_338_000);

  it("anggaran berkurang sebesar yang disetujui", () => {
    expect(anggaranSementara(15_000_000, [selang2])).toEqual({ disetujuiRp: 13_338_000, sisaRp: 1_662_000 });
  });
  it("tanpa persetujuan sisa sama dengan anggaran", () => {
    expect(anggaranSementara(15_000_000, [])).toEqual({ disetujuiRp: 0, sisaRp: 15_000_000 });
  });
  it("sisa tidak pernah negatif", () => {
    expect(anggaranSementara(10_000_000, [selang2]).sisaRp).toBe(0);
  });
  it("skor hanya dari yang disetujui", () => {
    // pompa 1/1, selang 3/10, sumur 2/5 -> 56,7. Selang +2 -> (20+10+8)/60 = 63,3.
    expect(skorSetelahDisetujui(mockReadiness, mockCatalog, [])).toBe(56.7);
    expect(skorSetelahDisetujui(mockReadiness, mockCatalog, [selang2])).toBe(63.3);
  });
  it("perbaikan dan pembelian item yang sama dijumlah, cakupan dibatasi 100%", () => {
    expect(skorSetelahDisetujui(mockReadiness, mockCatalog, [selang2, baris("selang_keluar", "perbaiki", 1, 1)])).toBe(66.7);
    expect(skorSetelahDisetujui(mockReadiness, mockCatalog, [baris("selang_keluar", "beli", 20, 1)])).toBe(80);
  });
});

describe("tambahTerkunci", () => {
  const kunci = (itemKode: string, aksi: "beli" | "perbaiki", qty: number) => ({ itemKode, aksi, qty, biayaRp: 1, usulanId: 1, tanggal: "2026-11-13" });
  it("tanpa surat: kesiapan tidak berubah", () => {
    expect(tambahTerkunci(mockReadiness, [], mockCatalog)).toBe(mockReadiness);
  });
  it("beli dari surat dihitung sudah ada", () => {
    const r = tambahTerkunci(mockReadiness, [kunci("selang_keluar", "beli", 2)], mockCatalog);
    expect(r.items.find((i) => i.itemKode === "selang_keluar")).toMatchObject({ berfungsi: 5, coverage: 0.5 });
    expect(r.skor).toBe(63.3);
  });
  it("perbaikan dari surat memulihkan yang rusak, tidak lebih dari jumlah rusak", () => {
    const r = tambahTerkunci(mockReadiness, [kunci("sumur_bor", "perbaiki", 3)], mockCatalog);
    expect(r.items.find((i) => i.itemKode === "sumur_bor")).toMatchObject({ berfungsi: 3, rusak: 0, coverage: 0.6 });
  });
});
