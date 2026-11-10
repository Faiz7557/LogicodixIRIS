import { describe, expect, it } from "vitest";
import { KANAL } from "@/lib/usulan";
import { renderTemplate } from "./templates";
import { susunUsulan } from "./usulanContoh";
import { simpananAwal } from "./store";

const info = { nama: "Contoh Desa", kecNama: "Contoh Kecamatan", kabNama: "Contoh Kabupaten", kExt: 3, nExt: 4, tahunTenang: 0 };
const usulan = susunUsulan({ id: 1, kode: "contoh", kanal: "bpbd", info, sim: simpananAwal(), setujuSemua: true })!;

describe("templat usulan (rencana v2 Task 16)", () => {
  it("setiap kanal memuat desa, total usulan, dan asumsi tim", () => {
    for (const k of KANAL) {
      const t = renderTemplate(usulan.facts, k);
      expect(t).toContain(usulan.facts.desa);
      expect(t).toContain(usulan.facts.total_usulan);
      expect(t).toContain("asumsi tim");
    }
  });
  it("kanal APBDes memakai rumusan netral Tahun Anggaran 2027", () => {
    const t = renderTemplate(usulan.facts, "apbdes_perubahan");
    expect(t).toContain("berlaku pada Tahun Anggaran 2027");
    expect(t).not.toContain("berdasarkan Permendesa");
  });
  it("tidak menjanjikan hektare dan tidak mengklaim validasi pengguna", () => {
    for (const k of KANAL) {
      const t = renderTemplate(usulan.facts, k).toLowerCase();
      expect(t).not.toContain("hektare");
      expect(t).not.toContain("tervalidasi");
    }
  });
});

describe("susunUsulan", () => {
  it("fakta bernilai sesuai mesin: skor 65,3 menjadi 70,7 dengan Rp13.338.000", () => {
    expect(usulan.facts).toMatchObject({ skor: "65,3", skor_sesudah: "70,7", total_usulan: "Rp13.338.000", pagu: "Rp15.000.000" });
    expect(usulan.facts.rantai_terlemah).toBe("Selang keluar");
  });
  it("ditolak (null) bila tidak ada baris disetujui", () => {
    expect(susunUsulan({ id: 1, kode: "contoh", kanal: "csr", info, sim: simpananAwal() })).toBeNull();
  });
  it("baris membawa nama dan sumber harga agar dokumen beku", () => {
    expect(usulan.baris[0]).toMatchObject({ nama: "Selang keluar", satuan: "buah", sumberHarga: "Perbup Sanggau 32/2025 hlm. 174" });
  });
});
