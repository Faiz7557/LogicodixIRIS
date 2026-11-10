import { rankPriorities } from "@/lib/engine/priority";
import { PAGU_DEFAULT, PAGU_MAKS, barisDisetujui, keyBaris, type KeputusanMap } from "@/lib/prioritas";
import type { Aksi, CatalogItem, Keputusan, PrioritasPayload, PriorityRow } from "@/lib/types";
import { writeAudit } from "./audit";
import { db } from "./db";
import { getHargaEfektif, getTargetEfektif } from "./efektif";
import { HttpError } from "./http";
import { getKesiapan } from "./kesiapan";
import { getCatalog, q } from "./queries";

/* Prioritas dan Keputusan (App Flow §3.8). Hitung ulang selalu di server. */

const KEPUTUSAN: Keputusan[] = ["setuju", "tolak", "tunda"];
const AKSI: Aksi[] = ["perbaiki", "beli"];

async function katalogEfektif(kode: string): Promise<CatalogItem[]> {
  const [catalog, targets] = await Promise.all([getCatalog(), getTargetEfektif(kode)]);
  const boleh = new Set(targets.map((t) => t.itemKode));
  return catalog.filter((c) => boleh.has(c.kode));
}

export async function getPagu(kode: string): Promise<number> {
  const [r] = await q("SELECT pagu_rp FROM rencana WHERE desa_kode = ?", [kode]);
  return r ? Number(r.pagu_rp) : PAGU_DEFAULT;
}

export async function getPrioritas(kode: string): Promise<PrioritasPayload> {
  const [readiness, prices, catalog, paguRp, keputusan] = await Promise.all([
    getKesiapan(kode),
    getHargaEfektif(kode),
    katalogEfektif(kode),
    getPagu(kode),
    q("SELECT item_kode, aksi, keputusan, catatan FROM keputusan WHERE desa_kode = ? ORDER BY item_kode, aksi", [kode]),
  ]);
  const hasil = rankPriorities({ catalog, readiness, prices, paguRp });
  return {
    ...hasil,
    keputusan: keputusan.map((r) => ({
      itemKode: String(r.item_kode),
      aksi: String(r.aksi) as Aksi,
      keputusan: String(r.keputusan) as Keputusan,
      catatan: r.catatan == null ? null : String(r.catatan),
    })),
  };
}

/** Hanya baris terpilih yang masih berhak atas keputusan (App Flow §3.8). */
export async function getBarisDisetujui(kode: string): Promise<PriorityRow[]> {
  const hasil = await getPrioritas(kode);
  const map: KeputusanMap = Object.fromEntries(
    hasil.keputusan.map((k) => [keyBaris(k), { keputusan: k.keputusan, catatan: k.catatan ?? undefined }]),
  );
  return barisDisetujui(hasil.terpilih, map);
}

export async function setPagu(kode: string, akunId: number, paguRp: number): Promise<void> {
  if (!Number.isInteger(paguRp) || paguRp < 0 || paguRp > PAGU_MAKS) {
    throw new HttpError(400, "input_tidak_sah", `Pagu harus bilangan bulat 0 sampai ${PAGU_MAKS}.`);
  }
  const [d] = await q("SELECT kode FROM desa WHERE kode = ?", [kode]);
  if (!d) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");

  const waktu = new Date().toISOString();
  await db().execute({
    sql: `INSERT INTO rencana (desa_kode, pagu_rp, updated_by, updated_at) VALUES (?,?,?,?)
          ON CONFLICT (desa_kode) DO UPDATE SET
            pagu_rp = excluded.pagu_rp, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    args: [kode, paguRp, akunId, waktu],
  });
  await writeAudit(akunId, kode, "ubah_pagu", { paguRp });
}

export async function setKeputusan(
  kode: string,
  akunId: number,
  itemKode: string,
  aksi: Aksi,
  keputusan: Keputusan,
  catatan?: string,
): Promise<void> {
  const [item] = await q("SELECT kode FROM katalog_item WHERE kode = ?", [itemKode]);
  if (!item) throw new HttpError(400, "input_tidak_sah", "Item tidak dikenal.");
  if (!AKSI.includes(aksi)) throw new HttpError(400, "input_tidak_sah", "Aksi tidak dikenal.");
  if (!KEPUTUSAN.includes(keputusan)) throw new HttpError(400, "input_tidak_sah", "Keputusan tidak dikenal.");
  const catatanBersih = catatan?.trim() || null;
  if (catatanBersih && catatanBersih.length > 500) throw new HttpError(400, "input_tidak_sah", "Catatan maksimal 500 karakter.");

  const waktu = new Date().toISOString();
  await db().execute({
    sql: `INSERT INTO keputusan (desa_kode, item_kode, aksi, keputusan, catatan, updated_by, updated_at) VALUES (?,?,?,?,?,?,?)
          ON CONFLICT (desa_kode, item_kode, aksi) DO UPDATE SET
            keputusan = excluded.keputusan, catatan = excluded.catatan,
            updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    args: [kode, itemKode, aksi, keputusan, catatanBersih, akunId, waktu],
  });
  await writeAudit(akunId, kode, "putuskan_baris", { itemKode, aksi, keputusan });
}
