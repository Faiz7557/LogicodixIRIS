import { describe, expect, it } from "vitest";
import { useTestDb } from "@/test/testDb";
import { getBarisDisetujui, getPrioritas, setKeputusan, setPagu } from "./prioritas";

describe("prioritas", () => {
  useTestDb();

  it("default pagu Rp15 juta", async () => {
    expect((await getPrioritas("BARU")).paguRp).toBe(15e6);
  });

  it("memakai pagu tersimpan", async () => {
    await setPagu("D", 1, 7e6);
    expect((await getPrioritas("D")).paguRp).toBe(7e6);
  });

  it("hanya baris setuju yang masuk", async () => {
    // Rp40 juta: 1 pompa (Rp28 juta) lalu 1 selang, jadi ada dua baris untuk diputuskan.
    await setPagu("D", 1, 40e6);
    const [a, b] = (await getPrioritas("D")).terpilih;
    await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
    await setKeputusan("D", 1, b.itemKode, b.aksi, "tolak");
    expect((await getBarisDisetujui("D")).map((x) => x.itemKode)).toEqual([a.itemKode]);
  });

  it("baris tidak terpilih lagi tidak ikut", async () => {
    await setPagu("D", 1, 15e6);
    const a = (await getPrioritas("D")).terpilih.at(-1)!;
    await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
    await setPagu("D", 1, 0);
    expect(await getBarisDisetujui("D")).toEqual([]);
  });

  it.each([1.5, -1, 1_000_000_001])("menolak pagu %s", async (p) => {
    await setPagu("D", 1, 7e6);
    await expect(setPagu("D", 1, p)).rejects.toMatchObject({ status: 422 });
    expect((await getPrioritas("D")).paguRp).toBe(7e6);
  });

  it("menolak keputusan tak dikenal", async () => {
    await expect(setKeputusan("D", 1, "pompa_jinjing", "beli", "diterima" as never)).rejects.toMatchObject({ status: 422 });
  });
});
