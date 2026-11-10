import type { Row } from "@libsql/client";
import { formatRupiah, formatSkor, formatTanggal } from "@/lib/format";
import { totalBiaya } from "@/lib/prioritas";
import type { CatalogItem, DesaCard, HargaRow, Kanal, PrioritasPayload, PriorityRow, ReadinessResult, Usulan } from "@/lib/types";
import { auditStatement } from "./audit";
import { db } from "./db";
import { getHargaEfektif } from "./efektif";
import { HttpError } from "./http";
import { getKesiapan } from "./kesiapan";
import { generateNarrative } from "./narasi";
import { getPrioritas } from "./prioritas";
import { getCatalog, getDesaCard, q } from "./queries";

/* Usulan dan dokumen cetak (App Flow §3.9-3.10, Backend Schema §8). Fakta dibekukan saat terbit. */

export type FaktaUsulan = Record<string, string>;

const KANAL: Kanal[] = ["apbdes_perubahan", "bpbd", "daops", "csr"];
const STATUS_TEKS = { siap: "siap", sebagian: "sebagian siap", rawan: "rawan" } as const;

interface Konteks {
  card: DesaCard;
  readiness: ReadinessResult;
  prioritas: PrioritasPayload;
  catalog: CatalogItem[];
  harga: HargaRow[];
  disetujui: PriorityRow[];
}

async function konteks(kode: string): Promise<Konteks> {
  const [card, readiness, prioritas, catalog, harga] = await Promise.all([
    getDesaCard(kode),
    getKesiapan(kode),
    getPrioritas(kode),
    getCatalog(),
    getHargaEfektif(kode),
  ]);
  if (!card) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");

  const setuju = new Set(prioritas.keputusan.filter((k) => k.keputusan === "setuju").map((k) => `${k.itemKode}|${k.aksi}`));
  const disetujui = prioritas.terpilih.filter((b) => setuju.has(`${b.itemKode}|${b.aksi}`));

  return { card, readiness, prioritas, catalog, harga, disetujui };
}

function susunFakta({ card, readiness, prioritas, catalog, disetujui }: Konteks): FaktaUsulan {
  const nama = new Map(catalog.map((c) => [c.kode, c.nama]));
  return {
    desa: card.desa.nama,
    kecamatan: card.desa.kecNama,
    kabupaten: card.desa.kabNama,
    skor: formatSkor(readiness.skor),
    status: STATUS_TEKS[readiness.status],
    rantai_terlemah: readiness.rantaiTerlemah ? (nama.get(readiness.rantaiTerlemah) ?? readiness.rantaiTerlemah) : "belum ada",
    paparan: `${card.paparan.kExt} dari ${card.paparan.nExt} tahun kering ekstrem`,
    tahun_tenang: String(card.paparan.tahunTenang),
    pagu: formatRupiah(prioritas.paguRp),
    total_usulan: formatRupiah(totalBiaya(disetujui)),
    skor_sesudah: formatSkor(prioritas.skorSesudah),
    tanggal: formatTanggal(new Date().toISOString()),
  };
}

export async function buildFacts(kode: string): Promise<FaktaUsulan> {
  return susunFakta(await konteks(kode));
}

function bekukanBaris(k: Konteks): (PriorityRow & { nama?: string; satuan?: string; sumberHarga?: string })[] {
  const item = new Map(k.catalog.map((c) => [c.kode, c]));
  return k.disetujui.map((b) => ({
    ...b,
    nama: item.get(b.itemKode)?.nama,
    satuan: item.get(b.itemKode)?.satuan,
    sumberHarga: k.harga.find((h) => h.itemKode === b.itemKode && h.aksi === b.aksi)?.sumber,
  }));
}

export async function terbitkanUsulan(kode: string, akunId: number, kanal: Kanal): Promise<number> {
  if (!KANAL.includes(kanal)) throw new HttpError(422, "input_tidak_sah", "Kanal tidak dikenal.");
  const k = await konteks(kode);
  if (k.disetujui.length === 0) throw new HttpError(409, "belum_ada_keputusan", "Belum ada baris yang disetujui.");

  const facts = susunFakta(k);
  const baris = bekukanBaris(k);
  const narasi = await generateNarrative(facts, kanal);
  const waktu = new Date().toISOString();

  const tx = await db().transaction("write");
  try {
    const hasil = await tx.execute({
      sql: `INSERT INTO usulan (desa_kode, kanal, facts_json, baris_json, teks, sumber_teks, model, created_by, created_at)
            VALUES (?,?,?,?,?,?,?,?,?)`,
      args: [kode, kanal, JSON.stringify(facts), JSON.stringify(baris), narasi.teks, narasi.sumber, narasi.model, akunId, waktu],
    });
    const id = Number(hasil.lastInsertRowid);
    await tx.execute(auditStatement(akunId, kode, "terbitkan_usulan", { id, kanal }));
    await tx.commit();
    return id;
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

function toUsulan(r: Row): Usulan {
  return {
    id: Number(r.id),
    desaKode: String(r.desa_kode),
    kanal: String(r.kanal) as Kanal,
    facts: JSON.parse(String(r.facts_json)),
    baris: JSON.parse(String(r.baris_json)),
    teks: String(r.teks),
    sumberTeks: String(r.sumber_teks) as Usulan["sumberTeks"],
    model: r.model == null ? null : String(r.model),
    createdAt: String(r.created_at),
  };
}

export async function getUsulan(kode: string, id: number): Promise<Usulan> {
  const [r] = await q("SELECT * FROM usulan WHERE id = ? AND desa_kode = ?", [id, kode]);
  if (!r) throw new HttpError(404, "usulan_tidak_ada", "Usulan tidak ditemukan.");
  return toUsulan(r);
}

export async function listUsulan(kode: string): Promise<Usulan[]> {
  const rows = await q("SELECT * FROM usulan WHERE desa_kode = ? ORDER BY created_at DESC, id DESC", [kode]);
  return rows.map(toUsulan);
}
