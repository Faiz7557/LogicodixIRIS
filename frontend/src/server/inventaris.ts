import { z } from "zod";
import type { CatalogItem, InventoryRow } from "@/lib/types";
import { PESAN, catatanMemuatPribadi, type InventoryInput } from "@/lib/inventaris";
import { writeAudit } from "./audit";
import { db } from "./db";
import { HttpError } from "./http";
import { getCatalog, q } from "./queries";

/* Catat Alat (App Flow §3.6). Normalisasi `punya_rusak = 0` terjadi sebelum validasi. */

const baris = z.object({
  itemKode: z.string().min(1),
  total: z.number({ error: PESAN.angka }).min(0, PESAN.angka),
  berfungsi: z.number({ error: PESAN.angka }).min(0, PESAN.angka),
  catatan: z.string().max(500).optional(),
});

export const inventarisSchema = z.array(baris).max(100).superRefine((rows, ctx) => {
  for (const r of rows) {
    if (r.berfungsi > r.total) {
      ctx.addIssue({ code: "custom", message: PESAN.melebihi });
      return;
    }
  }
});

function tolak(pesan: string): never {
  throw new HttpError(400, "input_tidak_sah", pesan);
}

async function katalogUntukDesa(kode: string): Promise<{ catalog: CatalogItem[]; peatFrac: number }> {
  const [d] = await q("SELECT peat_frac FROM desa WHERE kode = ?", [kode]);
  if (!d) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");
  const peatFrac = Number(d.peat_frac);
  const catalog = (await getCatalog()).filter((c) => !(c.hanyaGambut && peatFrac === 0));
  return { catalog, peatFrac };
}

export async function getInventaris(kode: string): Promise<{
  rows: InventoryRow[];
  terakhir: { oleh: string; waktu: string } | null;
}> {
  const rows = await q(
    `SELECT i.item_kode, i.total, i.berfungsi, i.catatan, i.updated_at, a.nama_tampil
     FROM inventaris_item i JOIN akun a ON a.id = i.updated_by
     WHERE i.desa_kode = ? ORDER BY i.item_kode`,
    [kode],
  );
  const semua = rows.map((r) => ({
    itemKode: String(r.item_kode),
    total: Number(r.total),
    berfungsi: Number(r.berfungsi),
    catatan: r.catatan == null ? null : String(r.catatan),
    waktu: String(r.updated_at),
    oleh: String(r.nama_tampil),
  }));
  const akhir = semua.reduce<(typeof semua)[number] | null>((a, b) => (!a || b.waktu > a.waktu ? b : a), null);
  return {
    rows: semua.map(({ itemKode, total, berfungsi, catatan }) => ({ itemKode, total, berfungsi, catatan })),
    terakhir: akhir ? { oleh: akhir.oleh, waktu: akhir.waktu } : null,
  };
}

export async function saveInventaris(kode: string, akunId: number, rows: InventoryInput[]): Promise<void> {
  const { catalog } = await katalogUntukDesa(kode);
  const byKode = new Map(catalog.map((c) => [c.kode, c]));

  // Item tanpa kondisi rusak hanya punya satu angka: berfungsi. Total selalu sama.
  const normal = rows.map((r) => {
    const item = byKode.get(r.itemKode);
    if (!item) tolak("Item tidak dikenal.");
    return item.punyaRusak ? r : { ...r, total: r.berfungsi };
  });

  const parsed = inventarisSchema.safeParse(normal);
  if (!parsed.success) tolak(parsed.error.issues[0]?.message ?? "Isian tidak sah.");
  for (const r of parsed.data) {
    if (r.catatan && catatanMemuatPribadi(r.catatan)) tolak(PESAN.catatanPribadi);
  }

  const waktu = new Date().toISOString();
  await db().batch(
    parsed.data.map((r) => ({
      sql: `INSERT INTO inventaris_item (desa_kode, item_kode, total, berfungsi, catatan, updated_by, updated_at)
            VALUES (?,?,?,?,?,?,?)
            ON CONFLICT (desa_kode, item_kode) DO UPDATE SET
              total = excluded.total, berfungsi = excluded.berfungsi,
              catatan = excluded.catatan, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      args: [kode, r.itemKode, r.total, r.berfungsi, r.catatan ?? null, akunId, waktu],
    })),
    "write",
  );
  await writeAudit(akunId, kode, "simpan_inventaris", { jumlah: parsed.data.length });
}
