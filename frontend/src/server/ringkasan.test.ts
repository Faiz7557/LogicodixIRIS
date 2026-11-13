import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { jawabOpenAI as jawab } from "@/test/openaiUji";
import { useTestDb } from "@/test/testDb";
import { db } from "./db";
import { getDesaCard } from "./queries";
import { faktaRingkasan, getRingkasan, kosongkanCacheRingkasan, templateRingkasan, validasiRingkasan } from "./ringkasan";

const KODE_UJI = "TINGGI";

const FAKTA = {
  k_ext: "3",
  n_ext: "4",
  tahun_ekstrem: ["2015", "2019", "2023", "2026"],
  tahun_terdeteksi: ["2015", "2019", "2023"],
  tahun_tenang: "3",
  tingkat: "Paparan tinggi",
  porsi_gambut: "37%",
  catatan_wajib: "Tanpa deteksi satelit bukan berarti aman.",
};
const baik = {
  judul: "Desa ini terdeteksi satelit pada 3 dari 4 tahun kering ekstrem.",
  butir: ["Tahun 2015, 2019, dan 2023 terdeteksi.", "3 tahun terakhir tenang, tetapi itu bukan jaminan aman.", "Periksa kesiapan alat sebelum musim kering."],
};

beforeEach(() => {
  kosongkanCacheRingkasan();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("validasiRingkasan", () => {
  it("menerima keluaran yang hanya memakai angka fakta", () => {
    expect(validasiRingkasan(baik, FAKTA)).toEqual({ ok: true, pelanggaran: [] });
  });
  it("menolak angka di luar fakta", () => {
    const r = validasiRingkasan({ ...baik, butir: [baik.butir[0], baik.butir[1], "Desa butuh 7 pompa."] }, FAKTA);
    expect(r.ok).toBe(false);
    expect(r.pelanggaran).toContain("angka:7");
  });
  it("menolak pecahan angka fakta", () => {
    // "37%" ada di fakta, "3,7" tidak
    expect(validasiRingkasan({ ...baik, judul: "Porsi gambut 3,7 persen." }, FAKTA).ok).toBe(false);
  });
  it("menolak kata terlarang", () => {
    expect(validasiRingkasan({ ...baik, judul: "Penyebab api di desa ini jelas." }, FAKTA).ok).toBe(false);
  });
  it("menolak jumlah butir selain tiga", () => {
    expect(validasiRingkasan({ ...baik, butir: baik.butir.slice(0, 2) }, FAKTA).ok).toBe(false);
  });
  it("menolak markdown, placeholder, dan teks kepanjangan", () => {
    expect(validasiRingkasan({ ...baik, judul: "**Tebal**" }, FAKTA).ok).toBe(false);
    expect(validasiRingkasan({ ...baik, judul: "{{desa}} siap." }, FAKTA).ok).toBe(false);
    expect(validasiRingkasan({ ...baik, judul: "a".repeat(161) }, FAKTA).ok).toBe(false);
  });
  it("menolak bentuk asing", () => {
    expect(validasiRingkasan("teks", FAKTA).ok).toBe(false);
    expect(validasiRingkasan(null, FAKTA).ok).toBe(false);
    expect(validasiRingkasan({ judul: 1, butir: [] }, FAKTA).ok).toBe(false);
  });
});

describe("templateRingkasan", () => {
  useTestDb();

  it("paparan memakai headlinePaparan dan lolos pengamannya sendiri", () => {
    const t = templateRingkasan("paparan", FAKTA);
    expect(t.judul).toBe("Terdeteksi satelit pada 3 dari 4 tahun kering ekstrem. 3 tahun terakhir tenang.");
    expect(t.butir).toHaveLength(3);
    expect(validasiRingkasan(t, FAKTA).ok).toBe(true);
  });
  it.each(["paparan", "kesiapan", "prioritas", "timemachine"] as const)("template %s dari DB uji lolos pengaman", async (h) => {
    const f = await faktaRingkasan(h, h === "timemachine" ? undefined : KODE_UJI);
    expect(validasiRingkasan(templateRingkasan(h, f), f)).toEqual({ ok: true, pelanggaran: [] });
  });
  it.each(["KOSONG", "NONGAMBUT", "D"])("template paparan desa %s lolos pengaman", async (kode) => {
    const f = await faktaRingkasan("paparan", kode);
    expect(validasiRingkasan(templateRingkasan("paparan", f), f).ok).toBe(true);
  });
});

describe("faktaRingkasan", () => {
  useTestDb();

  it("fakta tidak memuat nama wilayah", async () => {
    const card = (await getDesaCard(KODE_UJI))!;
    for (const h of ["paparan", "kesiapan", "prioritas"] as const) {
      const s = JSON.stringify(await faktaRingkasan(h, KODE_UJI));
      for (const nama of [card.desa.nama, card.desa.kecNama, card.desa.kabNama, KODE_UJI]) expect(s).not.toContain(nama);
    }
  });
  it("desa tak dikenal 404", async () => {
    await expect(faktaRingkasan("paparan", "TIDAK_ADA")).rejects.toMatchObject({ status: 404 });
  });
  it("kode kosong untuk halaman berdesa 400", async () => {
    await expect(faktaRingkasan("kesiapan")).rejects.toMatchObject({ status: 400 });
  });
});

describe("ringkasan kesiapan menyebut dua sisi", () => {
  useTestDb();

  // Peta gudang menghitung angka "kurang"; fakta dan template harus memuat angka yang sama.
  const isiInventaris = () =>
    db().batch([
      { sql: "INSERT INTO inventaris_item (desa_kode, item_kode, total, berfungsi, updated_by, updated_at) VALUES (?,?,?,?,?,?)", args: [KODE_UJI, "pompa_jinjing", 1, 1, 1, "2026-11-13T00:00:00.000Z"] },
      { sql: "INSERT INTO inventaris_item (desa_kode, item_kode, total, berfungsi, updated_by, updated_at) VALUES (?,?,?,?,?,?)", args: [KODE_UJI, "selang_keluar", 10, 3, 1, "2026-11-13T00:00:00.000Z"] },
      { sql: "INSERT INTO inventaris_item (desa_kode, item_kode, total, berfungsi, updated_by, updated_at) VALUES (?,?,?,?,?,?)", args: [KODE_UJI, "sumur_bor", 5, 2, 1, "2026-11-13T00:00:00.000Z"] },
    ]);

  it("fakta memuat angka kurang di samping angka berfungsi", async () => {
    await isiInventaris();
    const f = await faktaRingkasan("kesiapan", KODE_UJI);
    expect(f.item).toEqual([
      "Pompa jinjing: 1 dari 1 unit berfungsi, paket minimum terpenuhi",
      "Selang keluar: 3 dari 10 buah berfungsi, kurang 7",
      "Sumur bor: 2 dari 5 titik berfungsi, kurang 3",
    ]);
  });

  it("pengaman menerima angka kurang dari fakta dan menolak angka lain", async () => {
    await isiInventaris();
    const f = await faktaRingkasan("kesiapan", KODE_UJI);
    const judul = "Selang keluar paling genting.";
    const lain = ["Skor kesiapan sebagian siap.", "Periksa sumur bor."];
    expect(validasiRingkasan({ judul, butir: ["Selang keluar kurang 7.", ...lain] }, f).ok).toBe(true);
    expect(validasiRingkasan({ judul, butir: ["Selang keluar kurang 8.", ...lain] }, f).pelanggaran).toEqual(["angka:8"]);
  });

  it("fakta memuat baris tindakan yang sama dengan tabel Tangani ini lebih dulu", async () => {
    await isiInventaris();
    const f = await faktaRingkasan("kesiapan", KODE_UJI);
    expect(f.tindakan).toEqual(["Selang keluar: Beli 7 buah, Rp46.683.000", "Sumur bor: Beli 3 titik, Rp9.000.000"]);
    expect(templateRingkasan("kesiapan", f).butir[0]).toContain("Langkah pertama: Selang keluar: Beli 7 buah, Rp46.683.000");
  });

  it("template kesiapan menyalin angka kurang dari fakta", async () => {
    await isiInventaris();
    const f = await faktaRingkasan("kesiapan", KODE_UJI);
    const t = templateRingkasan("kesiapan", f);
    expect(t.butir[1]).toContain("kurang 7; Sumur bor: 2 dari 5 titik berfungsi, kurang 3");
    expect(validasiRingkasan(t, f)).toEqual({ ok: true, pelanggaran: [] });
  });
});

describe("ringkasan paparan memakai angka kalender satelit", () => {
  useTestDb();

  it("fakta memuat bulan rawan, hari terbanyak, dan jumlah tahun terdeteksi", async () => {
    const f = await faktaRingkasan("paparan", KODE_UJI);
    expect(f.bulan_ravan).toBe("September");
    expect(f.hari_terbanyak).toBe("3");
    expect(f.jumlah_tahun_terdeteksi).toBe("7 dari 15");
    const t = templateRingkasan("paparan", f);
    expect(t.butir[1]).toContain("Titik api paling sering muncul September sampai September");
    expect(validasiRingkasan(t, f)).toEqual({ ok: true, pelanggaran: [] });
  });
});

describe("getRingkasan", () => {
  useTestDb();

  it("template tanpa kunci", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    expect(await getRingkasan("paparan", KODE_UJI)).toMatchObject({ sumber: "template", model: null });
  });
  it("ai saat keluaran lolos, dan panggilan kedua memakai cache", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubEnv("OPENAI_MODEL_RINGKASAN", "model-uji");
    const f = await faktaRingkasan("paparan", KODE_UJI);
    const fetchUji = jawab(JSON.stringify(templateRingkasan("paparan", f))); // teks yang pasti lolos
    vi.stubGlobal("fetch", fetchUji);
    expect(await getRingkasan("paparan", KODE_UJI)).toMatchObject({ sumber: "ai", model: "model-uji" });
    await getRingkasan("paparan", KODE_UJI);
    expect(fetchUji).toHaveBeenCalledTimes(1);
  });
  it("jatuh ke template saat AI melanggar, dan pelanggaran tidak di-cache", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    const fetchUji = jawab(JSON.stringify({ judul: "Butuh 7 pompa.", butir: ["a", "b", "c"] }));
    vi.stubGlobal("fetch", fetchUji);
    expect((await getRingkasan("kesiapan", KODE_UJI)).sumber).toBe("template");
    await getRingkasan("kesiapan", KODE_UJI);
    expect(fetchUji).toHaveBeenCalledTimes(2);
  });
  it("jatuh ke template saat jawaban bukan JSON", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", jawab("bukan json"));
    expect((await getRingkasan("timemachine")).sumber).toBe("template");
  });
  it("jatuh ke template saat fetch gagal", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("putus"); }));
    expect((await getRingkasan("timemachine")).sumber).toBe("template");
  });
});
