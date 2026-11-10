import type { Aksi, HargaRow, PaketRow, ReferensiPergub } from "@/lib/types";
import { ALASAN_MIN } from "@/lib/prioritas";
import { writeAudit } from "./audit";
import { db } from "./db";
import { HttpError } from "./http";
import { q } from "./queries";

/* Target dan harga efektif (Backend Schema §5): nilai desa menimpa acuan, lalu diaudit. */

const AKSI: Aksi[] = ["perbaiki", "beli"];

async function desaInfo(kode: string): Promise<{ peatFrac: number; provKode: string }> {
  const [d] = await q("SELECT prov_kode, peat_frac FROM desa WHERE kode = ?", [kode]);
  if (!d) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");
  return { peatFrac: Number(d.peat_frac), provKode: String(d.prov_kode) };
}

async function itemInfo(itemKode: string): Promise<{ hanyaGambut: boolean }> {
  const [k] = await q("SELECT hanya_gambut FROM katalog_item WHERE kode = ?", [itemKode]);
  if (!k) throw new HttpError(400, "input_tidak_sah", "Item tidak dikenal.");
  return { hanyaGambut: Number(k.hanya_gambut) === 1 };
}

export async function getTargetEfektif(kode: string): Promise<PaketRow[]> {
  const { peatFrac } = await desaInfo(kode);
  const rows = await q(
    `SELECT k.kode AS item_kode,
            COALESCE(td.target, pm.target) AS target,
            CASE WHEN td.target IS NULL THEN pm.sumber ELSE 'Diubah desa: ' || td.alasan END AS sumber,
            CASE WHEN td.target IS NULL THEN pm.label ELSE 'bersumber' END AS label
     FROM katalog_item k
     JOIN paket_minimum pm ON pm.item_kode = k.kode
     LEFT JOIN target_desa td ON td.item_kode = k.kode AND td.desa_kode = ?
     WHERE k.hanya_gambut = 0 OR ? > 0
     ORDER BY k.urutan`,
    [kode, peatFrac],
  );
  return rows.map((r) => ({
    itemKode: String(r.item_kode),
    target: Number(r.target),
    sumber: String(r.sumber),
    label: String(r.label) as PaketRow["label"],
  }));
}

export async function getHargaEfektif(kode: string): Promise<HargaRow[]> {
  await desaInfo(kode);
  const rows = await q(
    `SELECT h.item_kode, h.aksi,
            COALESCE(hd.harga_rp, h.harga_rp) AS harga_rp,
            CASE WHEN hd.harga_rp IS NULL THEN h.sumber ELSE 'Diisi desa: ' || hd.sumber END AS sumber,
            COALESCE(hd.updated_at, h.tanggal) AS tanggal
     FROM harga_item h
     JOIN katalog_item k ON k.kode = h.item_kode
     LEFT JOIN harga_desa hd ON hd.item_kode = h.item_kode AND hd.aksi = h.aksi AND hd.desa_kode = ?
     ORDER BY k.urutan, h.aksi`,
    [kode],
  );
  return rows.map((r) => ({
    itemKode: String(r.item_kode),
    aksi: String(r.aksi) as Aksi,
    hargaRp: Number(r.harga_rp),
    sumber: String(r.sumber),
    tanggal: String(r.tanggal),
  }));
}

/** Pembanding Pergub hanya untuk desa Kalimantan Tengah (prov_kode 62). */
export async function getReferensiPergub(kode: string): Promise<ReferensiPergub[]> {
  const { provKode } = await desaInfo(kode);
  if (provKode !== "62") return [];
  const rows = await q("SELECT nama_alat, jumlah_per_regu, satuan, pasal, item_kode FROM referensi_pergub ORDER BY nama_alat");
  return rows.map((r) => ({
    namaAlat: String(r.nama_alat),
    jumlahPerRegu: Number(r.jumlah_per_regu),
    satuan: String(r.satuan),
    pasal: String(r.pasal),
    itemKode: r.item_kode == null ? null : String(r.item_kode),
  }));
}

export async function setTarget(kode: string, akunId: number, itemKode: string, target: number, alasan: string): Promise<void> {
  const { peatFrac } = await desaInfo(kode);
  const item = await itemInfo(itemKode);
  if (!Number.isFinite(target) || target < 0) throw new HttpError(400, "input_tidak_sah", "Target harus angka 0 atau lebih.");
  if (alasan.trim().length < ALASAN_MIN) throw new HttpError(400, "input_tidak_sah", `Alasan minimal ${ALASAN_MIN} karakter.`);
  if (item.hanyaGambut && peatFrac === 0) throw new HttpError(400, "input_tidak_sah", "Item ini hanya untuk desa bergambut.");

  const waktu = new Date().toISOString();
  await db().execute({
    sql: `INSERT INTO target_desa (desa_kode, item_kode, target, alasan, updated_by, updated_at) VALUES (?,?,?,?,?,?)
          ON CONFLICT (desa_kode, item_kode) DO UPDATE SET
            target = excluded.target, alasan = excluded.alasan,
            updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    args: [kode, itemKode, target, alasan.trim(), akunId, waktu],
  });
  await writeAudit(akunId, kode, "ubah_paket", { itemKode, target, alasan: alasan.trim() });
}

export async function setHarga(kode: string, akunId: number, itemKode: string, aksi: Aksi, hargaRp: number, sumber: string): Promise<void> {
  await desaInfo(kode);
  await itemInfo(itemKode);
  if (!AKSI.includes(aksi)) throw new HttpError(400, "input_tidak_sah", "Aksi tidak dikenal.");
  if (!Number.isInteger(hargaRp) || hargaRp <= 0) throw new HttpError(400, "input_tidak_sah", "Harga harus bilangan bulat rupiah di atas nol.");
  if (sumber.trim().length === 0) throw new HttpError(400, "input_tidak_sah", "Sumber harga wajib diisi.");

  const waktu = new Date().toISOString();
  await db().execute({
    sql: `INSERT INTO harga_desa (desa_kode, item_kode, aksi, harga_rp, sumber, updated_by, updated_at) VALUES (?,?,?,?,?,?,?)
          ON CONFLICT (desa_kode, item_kode, aksi) DO UPDATE SET
            harga_rp = excluded.harga_rp, sumber = excluded.sumber,
            updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    args: [kode, itemKode, aksi, hargaRp, sumber.trim(), akunId, waktu],
  });
  await writeAudit(akunId, kode, "ubah_harga", { itemKode, aksi, hargaRp, sumber: sumber.trim() });
}
