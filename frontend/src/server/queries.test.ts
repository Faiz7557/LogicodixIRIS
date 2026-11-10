import { createClient } from "@libsql/client";
import { describe, expect, it } from "vitest";
import { setDb } from "./db";
import { getDesaCard, getGerbang, searchDesa } from "./queries";
import { useTestDb } from "@/test/testDb";

describe("queries", () => {
  useTestDb();

  it("mencari tanpa peka huruf", async () => { expect((await searchDesa("kalibandung"))[0].nama).toBe("Kalibandung"); });
  it("wildcard dianggap literal", async () => { expect(await searchDesa("%")).toHaveLength(0); expect(await searchDesa("_")).toHaveLength(0); });
  it("membatasi 20 hasil", async () => { expect((await searchDesa("desa")).length).toBeLessThanOrEqual(20); });
  it("kode tak dikenal null", async () => { expect(await getDesaCard("ZZ")).toBeNull(); });

  it("gerbang bawaan buang sebelum pipeline jalan", async () => { expect(await getGerbang()).toBe("buang"); });
  it("DB tanpa tabel melempar galat berkode", async () => {
    setDb(createClient({ url: ":memory:" }));
    await expect(searchDesa("ka")).rejects.toMatchObject({ status: 503, kode: "data_belum_ada" });
  });
  it("kartu memuat strip 2012-2026", async () => { expect((await getDesaCard("TINGGI"))!.strip).toHaveLength(15); });
});
