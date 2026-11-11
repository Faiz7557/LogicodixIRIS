import { describe, expect, it } from "vitest";
import { useTestDb } from "@/test/testDb";
import { db } from "./db";
import { getInventaris, inventarisSchema, saveInventaris } from "./inventaris";

const pesan = (hasil: { success: boolean; error?: { issues: { message: string }[] } }) => hasil.error!.issues[0].message;
const countAudit = async (kode: string) =>
  Number((await db().execute({ sql: "SELECT COUNT(*) AS n FROM audit_log WHERE desa_kode = ?", args: [kode] })).rows[0].n);

describe("inventaris", () => {
  useTestDb();

  it("menolak berfungsi melebihi total", () => {
    const r = inventarisSchema.safeParse([{ itemKode: "pompa_jinjing", total: 1, berfungsi: 2 }]);
    expect(r.success).toBe(false);
    expect(pesan(r)).toBe("Jumlah berfungsi tidak boleh melebihi jumlah total.");
  });

  it("menolak negatif", () => {
    expect(inventarisSchema.safeParse([{ itemKode: "pompa_jinjing", total: -1, berfungsi: 0 }]).success).toBe(false);
  });

  it("menolak bukan angka", () => {
    expect(inventarisSchema.safeParse([{ itemKode: "pompa_jinjing", total: "a", berfungsi: 0 }]).success).toBe(false);
  });

  it("dana operasi menyamakan total", async () => {
    await saveInventaris("D", 1, [{ itemKode: "dana_operasi", total: 0, berfungsi: 2 }]);
    expect((await getInventaris("D")).rows).toEqual([expect.objectContaining({ total: 2, berfungsi: 2 })]);
  });

  it("upsert dan audit", async () => {
    await saveInventaris("D", 1, [{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1 }]);
    await saveInventaris("D", 1, [{ itemKode: "pompa_jinjing", total: 3, berfungsi: 2 }]);
    expect((await getInventaris("D")).rows[0]).toMatchObject({ total: 3, berfungsi: 2 });
    expect(await countAudit("D")).toBe(2);
  });

  it("menolak kode di luar katalog", async () => {
    await expect(saveInventaris("D", 1, [{ itemKode: "tank", total: 1, berfungsi: 1 }])).rejects.toMatchObject({ status: 422 });
  });

  it("menolak sumur bor pada desa non-gambut", async () => {
    await expect(saveInventaris("NONGAMBUT", 1, [{ itemKode: "sumur_bor", total: 1, berfungsi: 1 }])).rejects.toMatchObject({ status: 422 });
  });

  it("menolak catatan berisi nomor pribadi", async () => {
    await expect(
      saveInventaris("D", 1, [{ itemKode: "pompa_jinjing", total: 1, berfungsi: 1, catatan: "081234567890" }]),
    ).rejects.toMatchObject({ status: 422 });
  });
});
