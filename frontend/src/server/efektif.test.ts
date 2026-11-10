import { describe, expect, it } from "vitest";
import { useTestDb } from "@/test/testDb";
import { getHargaEfektif, getReferensiPergub, getTargetEfektif, setHarga, setTarget } from "./efektif";
import { getKesiapan } from "./kesiapan";
import type { HargaRow, PaketRow } from "@/lib/types";

const paket = (rows: PaketRow[], kode: string) => rows.find((r) => r.itemKode === kode)!;
const harga = (rows: HargaRow[], kode: string, aksi: "beli" | "perbaiki") => rows.find((r) => r.itemKode === kode && r.aksi === aksi)!;

describe("paket dan harga efektif", () => {
  useTestDb();

  it("target sama untuk tingkat paparan berbeda", async () => {
    expect(paket(await getTargetEfektif("TINGGI"), "selang_keluar").target).toBe(10);
    expect(paket(await getTargetEfektif("RENDAH"), "selang_keluar").target).toBe(10);
  });

  it("target desa menimpa dan menyebut alasan", async () => {
    await setTarget("TINGGI", 1, "selang_keluar", 8, "Sumber air dekat");
    expect(paket(await getTargetEfektif("TINGGI"), "selang_keluar")).toMatchObject({ target: 8 });
    expect(paket(await getTargetEfektif("TINGGI"), "selang_keluar").sumber).toContain("Sumber air dekat");
  });

  it("alasan pendek ditolak", async () => {
    await expect(setTarget("TINGGI", 1, "pompa_jinjing", 2, "x")).rejects.toMatchObject({ status: 400 });
  });

  it("sumur keluar pada desa non-gambut", async () => {
    expect((await getTargetEfektif("NONGAMBUT")).some((r) => r.itemKode === "sumur_bor")).toBe(false);
  });

  it("harga desa menimpa acuan", async () => {
    await setHarga("TINGGI", 1, "pompa_jinjing", "beli", 999, "Penawaran toko");
    expect(harga(await getHargaEfektif("TINGGI"), "pompa_jinjing", "beli").hargaRp).toBe(999);
    expect(harga(await getHargaEfektif("TINGGI"), "pompa_jinjing", "beli").sumber).toContain("Penawaran toko");
  });

  it("harga bukan bilangan bulat ditolak", async () => {
    await expect(setHarga("TINGGI", 1, "pompa_jinjing", "beli", 1.5, "Toko")).rejects.toMatchObject({ status: 400 });
  });

  it("referensi Pergub hanya Kalteng", async () => {
    expect((await getReferensiPergub("DESA_KALTENG")).length).toBeGreaterThan(0);
    expect(await getReferensiPergub("DESA_KALBAR")).toEqual([]);
  });

  it("desa kosong tidak error", async () => {
    expect((await getKesiapan("KOSONG")).lengkap).toBe(false);
  });
});
