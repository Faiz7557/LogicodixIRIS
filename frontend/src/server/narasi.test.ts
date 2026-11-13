import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Kanal } from "@/lib/types";
import { badanPanggilan, jawabOpenAI as jawab } from "@/test/openaiUji";
import { generateNarrative, renderNarrative, renderTemplate, validateNarrative } from "./narasi";

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
const allowed = ["desa", "skor", "total_usulan"];
const AI_BAIK = "{{desa}} memiliki skor {{skor}} dan mengusulkan {{total_usulan}}.";

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

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

describe("validateNarrative", () => {
  it("menerima placeholder saja", () => {
    expect(validateNarrative("{{desa}} memiliki skor {{skor}} dan butuh {{total_usulan}}.", allowed).ok).toBe(true);
  });
  it("menolak digit", () => {
    expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} butuh 5 pompa.", allowed).ok).toBe(false);
  });
  it("menolak placeholder asing", () => {
    expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} {{palsu}}", allowed).ok).toBe(false);
  });
  it("menolak nama wilayah karangan", () => {
    expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} di Kecamatan Sukamaju.", allowed).ok).toBe(false);
  });
  it("menolak placeholder wajib hilang", () => {
    expect(validateNarrative("{{desa}} siap.", allowed).ok).toBe(false);
  });
  it("menolak kata terlarang", () => {
    expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}}, penyebab api diketahui.", allowed).ok).toBe(false);
  });
});

describe("renderNarrative", () => {
  it("merender nilai fakta", () => {
    expect(renderNarrative("{{desa}}", { desa: "Contoh" })).toBe("Contoh");
  });
});

describe("generateNarrative", () => {
  it("jatuh ke template tanpa kunci", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    expect((await generateNarrative(FACTS, "bpbd")).sumber).toBe("template");
  });
  it("jatuh ke template saat AI melanggar", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", jawab(JSON.stringify({ teks: "Butuh 7 pompa." })));
    expect(await generateNarrative(FACTS, "bpbd")).toMatchObject({ sumber: "template", model: null });
  });
  it("jatuh ke template saat fetch gagal", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("putus"); }));
    expect((await generateNarrative(FACTS, "daops")).sumber).toBe("template");
  });
  it("prompt tidak memuat nilai fakta", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    const f = jawab(JSON.stringify({ teks: AI_BAIK }));
    vi.stubGlobal("fetch", f);
    await generateNarrative(FACTS, "bpbd");
    const terkirim = badanPanggilan(f);
    for (const nilai of [FACTS.desa, FACTS.kabupaten, FACTS.kecamatan, FACTS.total_usulan, FACTS.skor, FACTS.pagu]) {
      expect(terkirim).not.toContain(nilai);
    }
  });
  it("teks ai dirender dengan nilai fakta dan pernyataan asumsi tetap ada", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubEnv("OPENAI_MODEL_RINGKASAN", "model-uji");
    vi.stubGlobal("fetch", jawab(JSON.stringify({ teks: AI_BAIK })));
    const n = await generateNarrative(FACTS, "bpbd");
    expect(n).toMatchObject({ sumber: "ai", model: "model-uji" });
    expect(n.teks).toContain("Desa Uji D memiliki skor 41,7 dan mengusulkan Rp12.179.000.");
    expect(n.teks).toContain("asumsi tim");
  });
});
