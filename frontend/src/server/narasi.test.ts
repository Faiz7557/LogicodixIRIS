import { describe, expect, it } from "vitest";
import { renderTemplate } from "./narasi";
import type { Kanal } from "@/lib/types";

const FACTS = {
  desa: "Desa Uji D",
  kecamatan: "Kecamatan Uji",
  kabupaten: "Kabupaten Uji Barat",
  skor: "41,7",
  status: "sebagian siap",
  rantai_terlemah: "Pompa jinjing",
  paparan: "3 dari 4 tahun kering ekstrem",
  tahun_tenang: "0",
  pagu: "Rp15.000.000",
  total_usulan: "Rp12.179.000",
  skor_sesudah: "78,2",
  tanggal: "12 November 2026",
};

const KANAL: Kanal[] = ["apbdes_perubahan", "bpbd", "daops", "csr"];

describe("renderTemplate", () => {
  it("memuat fakta dan asumsi", () => {
    for (const k of KANAL) {
      const t = renderTemplate(FACTS, k);
      expect(t).toContain(FACTS.desa);
      expect(t).toContain(FACTS.total_usulan);
      expect(t).toContain("asumsi tim");
    }
  });

  it("APBDes memakai rumusan netral", () => {
    const t = renderTemplate(FACTS, "apbdes_perubahan");
    expect(t).toContain("berlaku pada Tahun Anggaran 2027");
    expect(t).not.toContain("berdasarkan Permendesa");
  });

  it("tidak menjanjikan hektare", () => {
    expect(renderTemplate(FACTS, "csr").toLowerCase()).not.toContain("hektare terselamatkan");
  });
});
