import type { InArgs, Row } from "@libsql/client";
import { formatRupiah, formatSkor, formatTanggal } from "@/lib/format";
import { PAGU_MAKS, keyBaris, skorSetelahDisetujui, tambahTerkunci, totalBiaya } from "@/lib/prioritas";
import { terbilangRupiah } from "@/lib/terbilang";
import type { Aksi, CatalogItem, DesaCard, HargaRow, Kanal, PrioritasPayload, PriorityRow, ReadinessResult, Usulan } from "@/lib/types";
import { namaDesaSaja } from "@/lib/usulan";
import { auditStatement } from "./audit";
import { db } from "./db";
import { getHargaEfektif } from "./efektif";
import { HttpError } from "./http";
import { getKesiapan } from "./kesiapan";
import { generateNarrative, renderPermohonanAnggaran } from "./narasi";
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
  const [card, kesiapan, prioritas, catalog, harga] = await Promise.all([
    getDesaCard(kode),
    getKesiapan(kode),
    getPrioritas(kode),
    getCatalog(),
    getHargaEfektif(kode),
  ]);
  if (!card) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");
  // Skor surat memperhitungkan alat dari surat sebelumnya (sama dengan skor di layar Prioritas).
  const readiness = tambahTerkunci(kesiapan, prioritas.terkunci, catalog);

  const setuju = new Set(prioritas.keputusan.filter((k) => k.keputusan === "setuju").map((k) => `${k.itemKode}|${k.aksi}`));
  const disetujui = prioritas.terpilih.filter((b) => setuju.has(`${b.itemKode}|${b.aksi}`));

  return { card, readiness, prioritas, catalog, harga, disetujui };
}

/** Fakta untuk isi surat. `dimuat` = baris yang dipilih masuk surat; skor sesudah hanya dari baris itu. */
function susunFakta({ card, readiness, prioritas, catalog }: Konteks, dimuat: PriorityRow[]): FaktaUsulan {
  const nama = new Map(catalog.map((c) => [c.kode, c.nama]));
  return {
    desa: `Desa ${namaDesaSaja(card.desa.nama)}`,
    kecamatan: card.desa.kecNama,
    kabupaten: card.desa.kabNama,
    skor: formatSkor(readiness.skor),
    status: STATUS_TEKS[readiness.status],
    rantai_terlemah: readiness.rantaiTerlemah ? (nama.get(readiness.rantaiTerlemah) ?? readiness.rantaiTerlemah) : "belum ada",
    paparan: `${card.paparan.kExt} dari ${card.paparan.nExt} tahun kering ekstrem`,
    tahun_tenang: String(card.paparan.tahunTenang),
    pagu: formatRupiah(prioritas.paguRp),
    total_usulan: formatRupiah(totalBiaya(dimuat)),
    skor_sesudah: formatSkor(skorSetelahDisetujui(readiness, catalog, dimuat)),
    tanggal: formatTanggal(new Date().toISOString()),
  };
}

export async function buildFacts(kode: string): Promise<FaktaUsulan> {
  const k = await konteks(kode);
  return susunFakta(k, k.disetujui);
}

function bekukanBaris(k: Konteks, dimuat: PriorityRow[]): (PriorityRow & { nama?: string; satuan?: string; sumberHarga?: string })[] {
  const item = new Map(k.catalog.map((c) => [c.kode, c]));
  return dimuat.map((b) => ({
    ...b,
    nama: item.get(b.itemKode)?.nama,
    satuan: item.get(b.itemKode)?.satuan,
    sumberHarga: k.harga.find((h) => h.itemKode === b.itemKode && h.aksi === b.aksi)?.sumber,
  }));
}

/** Nomor surat dari desa: boleh kosong (diisi tangan saat dicetak). */
function bersihkanNomor(nomor?: string): string {
  const n = (nomor ?? "").trim();
  if (n.length > 60) throw new HttpError(422, "input_tidak_sah", "Nomor surat maksimal 60 karakter.");
  return n;
}

async function simpanUsulan(
  kode: string,
  akunId: number,
  kanal: Kanal,
  facts: FaktaUsulan,
  baris: unknown[],
  narasi: { teks: string; sumber: "ai" | "template"; model: string | null },
  /** Baris yang masuk surat: keputusannya dihapus karena kini terkunci sebagai riwayat. */
  dikunci: PriorityRow[] = [],
): Promise<number> {
  const waktu = new Date().toISOString();
  const tx = await db().transaction("write");
  try {
    const hasil = await tx.execute({
      sql: `INSERT INTO usulan (desa_kode, kanal, facts_json, baris_json, teks, sumber_teks, model, created_by, created_at)
            VALUES (?,?,?,?,?,?,?,?,?)`,
      args: [kode, kanal, JSON.stringify(facts), JSON.stringify(baris), narasi.teks, narasi.sumber, narasi.model, akunId, waktu],
    });
    const id = Number(hasil.lastInsertRowid);
    // Saran berikutnya untuk item yang sama mulai dari "Perlu diputuskan", bukan mewarisi keputusan lama.
    for (const b of dikunci) {
      await tx.execute({ sql: "DELETE FROM keputusan WHERE desa_kode = ? AND item_kode = ? AND aksi = ?", args: [kode, b.itemKode, b.aksi] });
    }
    await tx.execute(auditStatement(akunId, kode, "terbitkan_usulan", { id, kanal, jenis: facts.jenis }));
    await tx.commit();
    return id;
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export type BarisDipilih = { itemKode: string; aksi: Aksi };

/**
 * Surat pengadaan alat. Hanya baris yang dipilih desa yang masuk surat; semua harus termasuk yang disetujui.
 * Tanpa `pilih` (pemanggil lama) semua baris yang disetujui dimuat.
 */
export async function terbitkanUsulan(
  kode: string,
  akunId: number,
  kanal: Kanal,
  opsi: { pilih?: BarisDipilih[]; nomor?: string } = {},
): Promise<number> {
  if (!KANAL.includes(kanal)) throw new HttpError(422, "input_tidak_sah", "Kanal tidak dikenal.");
  const nomor = bersihkanNomor(opsi.nomor);
  const k = await konteks(kode);
  if (k.disetujui.length === 0) throw new HttpError(409, "belum_ada_keputusan", "Belum ada baris yang disetujui.");

  let dimuat = k.disetujui;
  if (opsi.pilih) {
    const boleh = new Set(k.disetujui.map(keyBaris));
    const kunci = new Set(opsi.pilih.map(keyBaris));
    for (const x of kunci) {
      if (!boleh.has(x)) throw new HttpError(422, "input_tidak_sah", "Ada baris yang belum disetujui atau tidak lagi disarankan.");
    }
    dimuat = k.disetujui.filter((b) => kunci.has(keyBaris(b)));
    if (dimuat.length === 0) throw new HttpError(422, "input_tidak_sah", "Pilih minimal satu alat untuk dimuat di surat.");
  }

  const fakta = susunFakta(k, dimuat);
  // Narasi hanya melihat nama placeholder fakta isi; data surat (jenis, nomor) ditambahkan sesudahnya.
  const narasi = await generateNarrative(fakta, kanal);
  return simpanUsulan(kode, akunId, kanal, { ...fakta, jenis: "alat", nomor }, bekukanBaris(k, dimuat), narasi, dimuat);
}

/** Proposal permohonan bantuan anggaran: sejumlah uang, bukan daftar alat. Isi selalu dari template. */
export async function terbitkanPermohonanAnggaran(
  kode: string,
  akunId: number,
  kanal: Kanal,
  opsi: { jumlahRp: number; tahun: number; nomor?: string },
): Promise<number> {
  if (!KANAL.includes(kanal)) throw new HttpError(422, "input_tidak_sah", "Kanal tidak dikenal.");
  if (!Number.isInteger(opsi.jumlahRp) || opsi.jumlahRp < 1 || opsi.jumlahRp > PAGU_MAKS) {
    throw new HttpError(422, "input_tidak_sah", `Jumlah anggaran harus bilangan bulat Rp1 sampai ${formatRupiah(PAGU_MAKS)}.`);
  }
  if (!Number.isInteger(opsi.tahun) || opsi.tahun < 2025 || opsi.tahun > 2035) {
    throw new HttpError(422, "input_tidak_sah", "Tahun anggaran harus antara 2025 dan 2035.");
  }
  const nomor = bersihkanNomor(opsi.nomor);
  const k = await konteks(kode);
  const fakta: FaktaUsulan = {
    ...susunFakta(k, []),
    jenis: "anggaran",
    nomor,
    jumlah: formatRupiah(opsi.jumlahRp),
    terbilang: terbilangRupiah(opsi.jumlahRp),
    tahun_anggaran: String(opsi.tahun),
  };
  // Daftar riwayat menampilkan total_usulan: untuk permohonan anggaran itu jumlah yang dimohon.
  fakta.total_usulan = fakta.jumlah;
  delete fakta.skor_sesudah;
  const teks = renderPermohonanAnggaran(fakta, kanal);
  return simpanUsulan(kode, akunId, kanal, fakta, [], { teks, sumber: "template", model: null });
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

export interface HalamanUsulan {
  hasil: Usulan[];
  meta: { limit: number; nextCursor: number | null };
}

/** Cursor berbasis id: halaman berikutnya berisi id yang lebih kecil. */
export async function listUsulanPage(kode: string, limit = 20, cursor?: number): Promise<HalamanUsulan> {
  const args: InArgs = [kode];
  let sql = "SELECT * FROM usulan WHERE desa_kode = ?";
  if (cursor !== undefined) {
    sql += " AND id < ?";
    args.push(cursor);
  }
  sql += " ORDER BY id DESC LIMIT ?";
  args.push(limit + 1);

  const rows = await q(sql, args);
  const hasil = rows.slice(0, limit).map(toUsulan);
  return {
    hasil,
    meta: { limit, nextCursor: rows.length > limit ? hasil[hasil.length - 1].id : null },
  };
}
