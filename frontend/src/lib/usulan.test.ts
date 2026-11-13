import { describe, expect, it } from "vitest";
import { jenisUsulan, namaDesaSaja, nomorKosong, penerimaSurat } from "./usulan";

describe("surat usulan", () => {
  it("usulan lama tanpa jenis dianggap pengadaan alat", () => {
    expect(jenisUsulan({})).toBe("alat");
    expect(jenisUsulan({ jenis: "anggaran" })).toBe("anggaran");
  });

  it("nama desa tanpa kata Desa", () => {
    expect(namaDesaSaja("Desa Uji D")).toBe("Uji D");
    expect(namaDesaSaja("Kali Bandung")).toBe("Kali Bandung");
  });

  it("penerima menurut kanal", () => {
    const f = { desa: "Kali Bandung", kabupaten: "Kubu Raya" };
    expect(penerimaSurat("bpbd", f)).toBe("Kepala BPBD Kabupaten Kubu Raya");
    expect(penerimaSurat("apbdes_perubahan", f)).toBe("Pimpinan Musyawarah Desa Kali Bandung");
    expect(penerimaSurat("csr", f)).toBe("Pimpinan Perusahaan di Sekitar Desa Kali Bandung");
  });

  it("nomor kosong memakai bulan Romawi dan tahun", () => {
    expect(nomorKosong("2026-11-13T03:00:00.000Z")).toBe("........./........./XI/2026");
  });
});
