import { describe, expect, it } from "vitest";
import { useTestDb } from "@/test/testDb";
import { getUsulan, terbitkanUsulan } from "./usulan";
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

  it("usulan desa lain tidak ditemukan", async () => {
    await setPagu("DESA_A", 1, 15e6);
    const baris = (await getPrioritas("DESA_A")).terpilih[0];
    await setKeputusan("DESA_A", 1, baris.itemKode, baris.aksi, "setuju");
    const id = await terbitkanUsulan("DESA_A", 1, "daops");
    await expect(getUsulan("D", id)).rejects.toMatchObject({ status: 404 });
  });
});
