import { describe, expect, it } from "vitest";
import {
  bisaSusunPrioritas,
  kalimatRantaiTerlemah,
  keadaanKesiapan,
  keteranganProvinsi,
  ringkasanPaparan,
  urutkanKesenjangan,
} from "./kesiapan";
import { mockCatalog, mockPergubKalteng, mockReadiness } from "@/test/fixtures";
import type { ReadinessResult } from "./types";

const items = urutkanKesenjangan(mockReadiness.items, mockCatalog);

describe("urutkanKesenjangan", () => {
  it("mendahulukan cakupan terendah", () => {
    // dana_operasi dan pompa sama-sama 100%; pompa (bobot 20) mendahului dana operasi (bobot 15)
    expect(items.map((i) => i.itemKode)).toEqual(["selang_keluar", "sumur_bor", "pompa_jinjing", "dana_operasi"]);
  });

  it("seri cakupan: bobot lebih besar dulu, lalu kode", () => {
    const seri = urutkanKesenjangan(
      [
        { itemKode: "dana_operasi", target: 1, berfungsi: 0, rusak: 0, coverage: 0, kritis: true, belumDiisi: false },
        { itemKode: "sumur_bor", target: 5, berfungsi: 0, rusak: 0, coverage: 0, kritis: true, belumDiisi: false },
        { itemKode: "pompa_jinjing", target: 1, berfungsi: 0, rusak: 0, coverage: 0, kritis: true, belumDiisi: false },
      ],
      mockCatalog,
    );
    // bobot 20 (pompa, sumur) di depan bobot 15 (dana operasi); pompa < sumur menurut kode
    expect(seri.map((i) => i.itemKode)).toEqual(["pompa_jinjing", "sumur_bor", "dana_operasi"]);
  });

  it("label memakai satuan buah, bukan rol", () => {
    const selang = items.find((i) => i.itemKode === "selang_keluar")!;
    expect(selang.label).toBe("3 / 10 buah");
    expect(selang.labelPanjang).toBe("3 dari 10 buah");
    expect(selang.persen).toBe(30);
  });
});

describe("kalimatRantaiTerlemah", () => {
  it("menyebut item dan jumlahnya", () => {
    expect(kalimatRantaiTerlemah(mockReadiness, items)).toBe("Selang keluar paling genting: 3 dari 10 buah.");
  });

  it("tanpa rantai terlemah", () => {
    expect(kalimatRantaiTerlemah({ ...mockReadiness, rantaiTerlemah: null }, items)).toBe("Belum ada alat yang tercatat.");
  });

  it("nada tidak menyalahkan desa", () => {
    expect(kalimatRantaiTerlemah(mockReadiness, items).toLowerCase()).not.toMatch(/lalai|gagal|salah/);
  });
});

describe("ringkasanPaparan", () => {
  it("memakai deteksi satelit", () => {
    expect(ringkasanPaparan({ kExt: 3, nExt: 4 })).toBe("Terdeteksi satelit pada 3 dari 4 tahun kering ekstrem.");
  });
  it("tanpa deteksi bukan jaminan aman", () => {
    expect(ringkasanPaparan({ kExt: 0, nExt: 4 })).toContain("bukan jaminan aman");
  });
});

describe("keadaanKesiapan", () => {
  const dasar: ReadinessResult = { ...mockReadiness };
  it("lengkap", () => expect(keadaanKesiapan(dasar)).toBe("lengkap"));
  it("sebagian bila ada yang belum diisi", () => {
    expect(keadaanKesiapan({ ...dasar, lengkap: false })).toBe("sebagian");
  });
  it("kosong bila semua belum diisi atau tanpa item", () => {
    expect(keadaanKesiapan({ ...dasar, lengkap: false, items: dasar.items.map((i) => ({ ...i, belumDiisi: true })) })).toBe("kosong");
    expect(keadaanKesiapan({ ...dasar, items: [] })).toBe("kosong");
  });
});

describe("akses dan keterangan provinsi", () => {
  it("hanya akun desa yang boleh menyusun prioritas", () => {
    expect(bisaSusunPrioritas("desa")).toBe(true);
    expect(bisaSusunPrioritas("mpa")).toBe(false);
  });

  it("Kalteng: pembanding Pergub, bukan target", () => {
    const t = keteranganProvinsi("62", mockPergubKalteng);
    expect(t).toContain("Pembanding, bukan target desa");
    expect(t).toContain("pompa jinjing 3 unit (Pasal 19)");
    expect(t).toContain("selang 50 buah (Pasal 19)");
  });

  it("Kalbar: kalimat ketiadaan angka, tidak memuat angka Pergub Kalteng", () => {
    const t = keteranganProvinsi("61", mockPergubKalteng);
    expect(t).toBe("Kalimantan Barat belum memiliki angka alat per regu pada Pergub 56/2025.");
    expect(t).not.toContain("50 buah");
  });
});
