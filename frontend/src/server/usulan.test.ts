import { describe, expect, it } from "vitest";
import { useTestDb } from "@/test/testDb";
import { getUsulan, listUsulanPage, terbitkanPermohonanAnggaran, terbitkanUsulan } from "./usulan";
import { setPagu, setKeputusan, getPrioritas } from "./prioritas";

describe("usulan", () => {
  useTestDb();

  it("menolak tanpa baris setuju", async () => {
    await expect(terbitkanUsulan("KOSONG", 1, "csr")).rejects.toThrow("Belum ada baris yang disetujui");
  });

  it("fakta beku", async () => {
    await setPagu("D", 1, 15e6);
    const baris = (await getPrioritas("D")).terpilih[0];
    await setKeputusan("D", 1, baris.itemKode, baris.aksi, "setuju");
    const id = await terbitkanUsulan("D", 1, "bpbd");
    const sebelum = await getUsulan("D", id);
    await setPagu("D", 1, 1);
    expect(await getUsulan("D", id)).toEqual(sebelum);
    expect(sebelum.facts).toMatchObject({ desa: "Desa Uji D", total_usulan: expect.stringContaining("Rp") });
    expect(sebelum.baris[0]).toMatchObject({ nama: expect.any(String), sumberHarga: expect.any(String) });
  });

  it("membagi daftar usulan dengan cursor", async () => {
    await setPagu("D", 1, 15e6);
    const baris = (await getPrioritas("D")).terpilih[0];
    await setKeputusan("D", 1, baris.itemKode, baris.aksi, "setuju");
    for (let i = 0; i < 3; i++) await terbitkanUsulan("D", 1, "csr");

    const satu = await listUsulanPage("D", 2);
    expect(satu.hasil).toHaveLength(2);
    expect(satu.meta).toEqual({ limit: 2, nextCursor: satu.hasil[1].id });

    const dua = await listUsulanPage("D", 2, satu.meta.nextCursor!);
    expect(dua.hasil).toHaveLength(1);
    expect(dua.meta.nextCursor).toBeNull();
  });

  it("hanya alat yang dipilih masuk surat, skor sesudah dari pilihan itu", async () => {
    await setPagu("D", 1, 200e6);
    const terpilih = (await getPrioritas("D")).terpilih;
    expect(terpilih.length).toBeGreaterThanOrEqual(2);
    for (const b of terpilih) await setKeputusan("D", 1, b.itemKode, b.aksi, "setuju");
    const [satu] = terpilih;
    const semua = await getUsulan("D", await terbitkanUsulan("D", 1, "bpbd"));
    const pilih = await getUsulan("D", await terbitkanUsulan("D", 1, "bpbd", { pilih: [{ itemKode: satu.itemKode, aksi: satu.aksi }], nomor: " 140/12/XI/2026 " }));
    expect(pilih.baris).toHaveLength(1);
    expect(pilih.baris[0]).toMatchObject({ itemKode: satu.itemKode, aksi: satu.aksi, biayaRp: satu.biayaRp });
    expect(pilih.facts).toMatchObject({ jenis: "alat", nomor: "140/12/XI/2026" });
    expect(semua.baris).toHaveLength(terpilih.length);
    expect(pilih.facts.total_usulan).not.toBe(semua.facts.total_usulan);
  });

  it("menolak alat yang belum disetujui", async () => {
    await setPagu("D", 1, 200e6);
    const [a, b] = (await getPrioritas("D")).terpilih;
    await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
    await expect(terbitkanUsulan("D", 1, "csr", { pilih: [{ itemKode: b.itemKode, aksi: b.aksi }] })).rejects.toMatchObject({ status: 422 });
  });

  it("permohonan anggaran tanpa daftar alat dan tanpa perlu persetujuan", async () => {
    const id = await terbitkanPermohonanAnggaran("D", 1, "bpbd", { jumlahRp: 528_000_000, tahun: 2027 });
    const u = await getUsulan("D", id);
    expect(u.baris).toEqual([]);
    expect(u.sumberTeks).toBe("template");
    expect(u.facts).toMatchObject({
      jenis: "anggaran",
      jumlah: "Rp528.000.000",
      total_usulan: "Rp528.000.000",
      terbilang: "Lima Ratus Dua Puluh Delapan Juta Rupiah",
      tahun_anggaran: "2027",
    });
    expect(u.teks).toContain("Tahun Anggaran 2027 sebesar Rp528.000.000 (Lima Ratus Dua Puluh Delapan Juta Rupiah)");
    expect(u.teks).not.toContain("Kepada Yth");
    expect(u.teks.toLowerCase()).not.toMatch(/skor|satelit|mata rantai/);
  });

  it("permohonan anggaran menolak jumlah dan tahun tidak sah", async () => {
    await expect(terbitkanPermohonanAnggaran("D", 1, "csr", { jumlahRp: 0, tahun: 2027 })).rejects.toMatchObject({ status: 422 });
    await expect(terbitkanPermohonanAnggaran("D", 1, "csr", { jumlahRp: 1e6, tahun: 1999 })).rejects.toMatchObject({ status: 422 });
  });

  it("usulan desa lain tidak ditemukan", async () => {
    await setPagu("DESA_A", 1, 15e6);
    const baris = (await getPrioritas("DESA_A")).terpilih[0];
    await setKeputusan("DESA_A", 1, baris.itemKode, baris.aksi, "setuju");
    const id = await terbitkanUsulan("DESA_A", 1, "daops");
    await expect(getUsulan("D", id)).rejects.toMatchObject({ status: 404 });
  });
});
