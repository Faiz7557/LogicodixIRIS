import { describe, expect, it } from "vitest";
import {
  PESAN,
  awalForm,
  bacaAngka,
  berubah,
  catatanMemuatPribadi,
  geser,
  ikutTotal,
  selaraskan,
  susunPayload,
  validasiBaris,
  type FormState,
} from "./inventaris";
import { mockCatalog } from "@/test/fixtures";

const pompa = mockCatalog.find((c) => c.kode === "pompa_jinjing")!;
const dana = mockCatalog.find((c) => c.kode === "dana_operasi")!;
const kosong = { total: "", berfungsi: "", catatan: "" };

describe("bacaAngka", () => {
  it("menerima nol dan bilangan positif, koma atau titik", () => {
    expect(bacaAngka("0")).toEqual({ jenis: "ok", nilai: 0 });
    expect(bacaAngka(" 12 ")).toEqual({ jenis: "ok", nilai: 12 });
    expect(bacaAngka("1,5")).toEqual({ jenis: "ok", nilai: 1.5 });
  });
  it("menolak negatif, huruf, dan simbol", () => {
    for (const x of ["-1", "a", "1a", "1,", "1e3", "--"]) expect(bacaAngka(x)).toEqual({ jenis: "salah" });
  });
  it("kosong bukan salah", () => {
    expect(bacaAngka("  ")).toEqual({ jenis: "kosong" });
  });
});

describe("geser (tombol plus dan minus)", () => {
  it("menambah dari kosong dan tidak turun di bawah nol", () => {
    expect(geser("", 1)).toBe("1");
    expect(geser("0", -1)).toBe("0");
    expect(geser("3", -1)).toBe("2");
  });
  it("tanpa derau desimal", () => {
    expect(geser("0,1", 1)).toBe("1.1");
    expect(geser("abc", 1)).toBe("1");
  });
});

describe("validasiBaris", () => {
  it("berfungsi melebihi total: pesan persis dari App Flow", () => {
    const g = validasiBaris(pompa, { ...kosong, total: "1", berfungsi: "2" });
    expect(g.berfungsi).toBe("Jumlah berfungsi tidak boleh melebihi jumlah total.");
  });
  it("negatif atau bukan angka: pesan persis", () => {
    expect(validasiBaris(pompa, { ...kosong, total: "-1", berfungsi: "0" }).total).toBe("Isi dengan angka 0 atau lebih.");
    expect(validasiBaris(pompa, { ...kosong, total: "a", berfungsi: "0" }).total).toBe(PESAN.angka);
  });
  it("berfungsi sama dengan total boleh", () => {
    expect(validasiBaris(pompa, { ...kosong, total: "2", berfungsi: "2" })).toEqual({});
  });
  it("salah satu kolom kosong diberi petunjuk", () => {
    expect(validasiBaris(pompa, { ...kosong, total: "2" }).berfungsi).toBe(PESAN.berfungsiKosong);
    expect(validasiBaris(pompa, { ...kosong, berfungsi: "1" }).total).toBe(PESAN.totalKosong);
  });
  it("dana operasi hanya memeriksa satu kolom", () => {
    expect(validasiBaris(dana, { ...kosong, berfungsi: "2" })).toEqual({});
    expect(validasiBaris(dana, { ...kosong, berfungsi: "x" }).berfungsi).toBe(PESAN.angka);
  });
  it("catatan tidak boleh memuat nomor telepon atau NIK", () => {
    expect(catatanMemuatPribadi("hubungi 0812-3456-7890")).toBe(true);
    expect(catatanMemuatPribadi("3201 0101 0101 0001")).toBe(true);
    expect(catatanMemuatPribadi("pompa dipinjam 2 minggu")).toBe(false);
    expect(validasiBaris(pompa, { total: "1", berfungsi: "1", catatan: "081234567890" }).catatan).toBe(PESAN.catatanPribadi);
  });
});

describe("susunPayload", () => {
  it("dana operasi: total disamakan dengan berfungsi", () => {
    const state: FormState = { dana_operasi: { ...kosong, berfungsi: "2" } };
    expect(susunPayload(mockCatalog, state).baris).toEqual([{ itemKode: "dana_operasi", total: 2, berfungsi: 2 }]);
  });
  it("baris kosong dilewati sehingga boleh simpan sebagian", () => {
    const state: FormState = { pompa_jinjing: { total: "2", berfungsi: "1", catatan: " satu rusak " } };
    const r = susunPayload(mockCatalog, state);
    expect(r.jumlahGalat).toBe(0);
    expect(r.baris).toEqual([{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1, catatan: "satu rusak" }]);
  });
  it("baris bergalat tidak ikut dan dihitung", () => {
    const state: FormState = {
      pompa_jinjing: { ...kosong, total: "1", berfungsi: "2" },
      selang_keluar: { ...kosong, total: "5", berfungsi: "3" },
    };
    const r = susunPayload(mockCatalog, state);
    expect(r.jumlahGalat).toBe(1);
    expect(r.galat.pompa_jinjing.berfungsi).toBe(PESAN.melebihi);
    expect(r.baris.map((b) => b.itemKode)).toEqual(["selang_keluar"]);
  });
});

describe("awalForm dan berubah", () => {
  it("memuat data tersimpan; dana operasi hanya kolom berfungsi", () => {
    const f = awalForm(mockCatalog, [
      { itemKode: "dana_operasi", total: 1, berfungsi: 1 },
      { itemKode: "selang_keluar", total: 3, berfungsi: 3, catatan: "dua sambungan" },
    ]);
    expect(f.dana_operasi).toEqual({ total: "", berfungsi: "1", catatan: "" });
    expect(f.selang_keluar).toEqual({ total: "3", berfungsi: "3", catatan: "dua sambungan" });
    expect(f.sumur_bor).toEqual(kosong);
  });
  it("mendeteksi perubahan", () => {
    const a = awalForm(mockCatalog, []);
    expect(berubah(a, a)).toBe(false);
    expect(berubah(a, { ...a, sumur_bor: { ...kosong, total: "1" } })).toBe(true);
  });
});

describe("selaraskan (berfungsi tidak melebihi total)", () => {
  it("memotong berfungsi yang melewati total", () => {
    expect(selaraskan(pompa, { total: "4", berfungsi: "5", catatan: "" }, "berfungsi").berfungsi).toBe("4");
  });
  it("menurunkan berfungsi saat total diturunkan", () => {
    expect(selaraskan(pompa, { total: "2", berfungsi: "3", catatan: "" }, "total").berfungsi).toBe("2");
  });
  it("membiarkan total lebih besar dari berfungsi (alat rusak)", () => {
    const n = { total: "6", berfungsi: "2", catatan: "" };
    expect(selaraskan(pompa, n, "total")).toBe(n);
  });
  it("membiarkan isian kosong, bukan angka, dan item tanpa rusak", () => {
    const k = { total: "", berfungsi: "5", catatan: "" };
    expect(selaraskan(pompa, k, "berfungsi")).toBe(k);
    const d = { total: "1", berfungsi: "3", catatan: "" };
    expect(selaraskan(dana, d, "berfungsi")).toBe(d);
  });
});

describe("ikutTotal (berfungsi mengikuti total bila sebelumnya sama)", () => {
  const sama = { total: "3", berfungsi: "3", catatan: "" };
  it("ikut naik dan turun bila total dan berfungsi sama", () => {
    expect(ikutTotal(pompa, sama, { ...sama, total: "4" }).berfungsi).toBe("4");
    expect(ikutTotal(pompa, sama, { ...sama, total: "2" }).berfungsi).toBe("2");
    expect(ikutTotal(pompa, sama, { ...sama, total: "12" }).berfungsi).toBe("12");
  });
  it("tidak menyentuh berfungsi bila sebelumnya ada alat rusak", () => {
    const rusak = { total: "5", berfungsi: "3", catatan: "" };
    expect(ikutTotal(pompa, rusak, { ...rusak, total: "6" }).berfungsi).toBe("3");
  });
  it("membiarkan total kosong dan item tanpa rusak", () => {
    expect(ikutTotal(pompa, sama, { ...sama, total: "" }).berfungsi).toBe("3");
    expect(ikutTotal(dana, sama, { ...sama, total: "5" }).berfungsi).toBe("3");
  });
});
