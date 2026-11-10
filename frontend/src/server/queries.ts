import type { InArgs, Row } from "@libsql/client";
import type { MetricRow } from "@/lib/backtest";
import type {
  CatalogItem, DesaCard, DesaHit, HargaRow, KeputusanGerbang, PaketRow, Tier,
} from "@/lib/types";
import { db } from "./db";
import { HttpError } from "./http";

export interface Backtest {
  metrik: MetricRow[];
  grup: { grup: string; strata: string; nDesa: number; nTerpapar2026: number; rate: number }[];
  gerbang: { a: boolean; b: boolean; keputusan: KeputusanGerbang };
  teratas: { kode: string; nama: string; kecNama: string; skor: number; terpapar2026: boolean }[];
  dataAkhir2026: string | null;
}

export interface DataPage {
  sumber: { kode: string; nama: string; url: string; lisensi: string; periode: string; diakses: string }[];
  sensor: { tahun: number; satellite: string; sumber: "SP" | "NRT"; nDet: number }[];
  dq: { kode: string; judul: string; isi: string; tingkat: "info" | "peringatan" | "batasan"; sumberUrl: string | null }[];
  paket: (PaketRow & { nama: string; satuan: string })[];
  harga: (HargaRow & { catatan: string | null })[];
  meta: { kunci: string; nilai: string; label: "parameter" | "asumsi_tim" | "hasil" }[];
}

/** Kueri berparameter bersama. `no such table` -> 503 supaya klien tahu pipeline belum jalan. */
export async function q(sql: string, args: InArgs = []): Promise<Row[]> {
  try {
    return (await db().execute({ sql, args })).rows;
  } catch (e) {
    if (e instanceof Error && /no such table/i.test(e.message)) {
      throw new HttpError(503, "data_belum_ada", "Data belum tersedia. Jalankan pipeline lebih dulu.");
    }
    throw e;
  }
}

const str = (v: unknown) => String(v);
const strOrNull = (v: unknown) => (v == null ? null : String(v));

async function metaNilai(kunci: string): Promise<string | null> {
  const [r] = await q("SELECT nilai FROM meta WHERE kunci = ?", [kunci]);
  return r ? str(r.nilai) : null;
}

const HIT_KOLOM = "kode, nama, kec_nama, kab_nama, prov_nama";
const toHit = (r: Row): DesaHit => ({
  kode: str(r.kode), nama: str(r.nama), kecNama: str(r.kec_nama), kabNama: str(r.kab_nama), provNama: str(r.prov_nama),
});

export async function searchDesa(teks: string): Promise<DesaHit[]> {
  const t = teks.trim();
  if (!t) return [];
  const pola = `%${t.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const rows = await q(
    `SELECT ${HIT_KOLOM} FROM desa
     WHERE nama LIKE ?1 ESCAPE '\\' OR kec_nama LIKE ?1 ESCAPE '\\' OR kab_nama LIKE ?1 ESCAPE '\\'
     ORDER BY nama COLLATE NOCASE, kode LIMIT 20`,
    [pola],
  );
  return rows.map(toHit);
}

const GERBANG: KeputusanGerbang[] = ["pertahankan", "lunakkan", "buang"];
const GERBANG_BAWAAN = { a: false, b: false, keputusan: "buang" as KeputusanGerbang };

async function gerbangPenuh(): Promise<Backtest["gerbang"]> {
  const nilai = await metaNilai("gate_hasil");
  if (!nilai) return GERBANG_BAWAAN;
  try {
    const g = JSON.parse(nilai);
    if (!GERBANG.includes(g?.keputusan)) return GERBANG_BAWAAN;
    return { a: g.a === true, b: g.b === true, keputusan: g.keputusan };
  } catch {
    return GERBANG_BAWAAN;
  }
}

export async function getGerbang(): Promise<KeputusanGerbang> {
  return (await gerbangPenuh()).keputusan;
}

export async function getDesaCard(kode: string): Promise<DesaCard | null> {
  const [d] = await q(
    `SELECT ${HIT_KOLOM}, kec_kode, prov_kode, lat, lon, luas_ha, peat_frac, geom_json FROM desa WHERE kode = ?`,
    [kode],
  );
  if (!d) return null;
  const [strip, [p], [k], ext, gerbang] = await Promise.all([
    q("SELECT tahun, n_det, det_days, terpapar FROM desa_tahun WHERE kode = ? AND tahun BETWEEN 2012 AND 2026 ORDER BY tahun", [kode]),
    q("SELECT * FROM desa_paparan WHERE kode = ? AND mode = 'live'", [kode]),
    q("SELECT * FROM kecamatan_paparan WHERE kec_kode = ? AND mode = 'live'", [d.kec_kode]),
    metaNilai("ext_years"),
    getGerbang(),
  ]);
  if (!p || !k) throw new HttpError(503, "data_belum_ada", "Data paparan desa belum tersedia. Jalankan pipeline lebih dulu.");
  return {
    desa: {
      ...toHit(d),
      kecKode: str(d.kec_kode), provKode: str(d.prov_kode),
      lat: Number(d.lat), lon: Number(d.lon), luasHa: Number(d.luas_ha), peatFrac: Number(d.peat_frac),
      geomJson: str(d.geom_json),
    },
    tahunEkstrem: ext ? ext.split(",").map(Number).filter(Number.isFinite) : [],
    strip: strip.map((r) => ({
      tahun: Number(r.tahun), nDet: Number(r.n_det), detDays: Number(r.det_days), terpapar: Number(r.terpapar) === 1,
    })),
    paparan: {
      mode: "live",
      kExt: Number(p.k_ext), nExt: Number(p.n_ext), kNorm: Number(p.k_norm), nNorm: Number(p.n_norm),
      tahunTenang: Number(p.tahun_tenang), tampakAman: Number(p.tampak_aman) === 1,
      tier: str(p.tier) as Tier, skor: Number(p.skor),
    },
    kecamatan: {
      nDesa: Number(k.n_desa), k: Number(k.k), n: Number(k.n),
      pMean: Number(k.p_mean), rateMin: Number(k.rate_min), rateMax: Number(k.rate_max),
    },
    gerbang,
  };
}

export async function getCatalog(): Promise<CatalogItem[]> {
  const rows = await q("SELECT * FROM katalog_item ORDER BY urutan");
  return rows.map((r) => ({
    kode: str(r.kode), nama: str(r.nama), satuan: str(r.satuan), bobot: Number(r.bobot),
    kritis: Number(r.kritis) === 1, bisaDibeli: Number(r.bisa_dibeli) === 1,
    punyaRusak: Number(r.punya_rusak) === 1, hanyaGambut: Number(r.hanya_gambut) === 1,
  }));
}

export async function getBacktest(): Promise<Backtest> {
  const [metrik, grup, gerbang, teratas, dataAkhir2026] = await Promise.all([
    q("SELECT * FROM backtest_metric ORDER BY tahun_uji, unit, strategi, metrik"),
    q("SELECT * FROM backtest_grup ORDER BY grup, strata"),
    gerbangPenuh(),
    q(`SELECT d.kode, d.nama, d.kec_nama, p.skor, COALESCE(t.terpapar, 0) AS terpapar
       FROM desa_paparan p
       JOIN desa d ON d.kode = p.kode
       LEFT JOIN desa_tahun t ON t.kode = p.kode AND t.tahun = 2026
       WHERE p.mode = 'frozen'
       ORDER BY p.skor DESC, d.kode LIMIT 20`),
    metaNilai("data_akhir_2026"),
  ]);
  return {
    metrik: metrik.map((r) => ({
      tahunUji: Number(r.tahun_uji), unit: str(r.unit), strategi: str(r.strategi), metrik: str(r.metrik), nilai: Number(r.nilai),
    }) as MetricRow),
    grup: grup.map((r) => ({
      grup: str(r.grup), strata: str(r.strata), nDesa: Number(r.n_desa), nTerpapar2026: Number(r.n_terpapar_2026), rate: Number(r.rate),
    })),
    gerbang,
    teratas: teratas.map((r) => ({
      kode: str(r.kode), nama: str(r.nama), kecNama: str(r.kec_nama), skor: Number(r.skor), terpapar2026: Number(r.terpapar) === 1,
    })),
    dataAkhir2026,
  };
}

export async function getDataPage(): Promise<DataPage> {
  const [sumber, sensor, dq, paket, harga, meta] = await Promise.all([
    q("SELECT * FROM sumber_data ORDER BY kode"),
    q("SELECT * FROM deteksi_ringkas ORDER BY tahun, satellite, sumber"),
    q("SELECT * FROM dq_issue ORDER BY kode"),
    q(`SELECT pm.item_kode, pm.target, pm.sumber, pm.label, k.nama, k.satuan
       FROM paket_minimum pm JOIN katalog_item k ON k.kode = pm.item_kode ORDER BY k.urutan`),
    q(`SELECT h.* FROM harga_item h JOIN katalog_item k ON k.kode = h.item_kode ORDER BY k.urutan, h.aksi`),
    q("SELECT * FROM meta ORDER BY kunci"),
  ]);
  return {
    sumber: sumber.map((r) => ({
      kode: str(r.kode), nama: str(r.nama), url: str(r.url), lisensi: str(r.lisensi), periode: str(r.periode), diakses: str(r.diakses),
    })),
    sensor: sensor.map((r) => ({
      tahun: Number(r.tahun), satellite: str(r.satellite), sumber: str(r.sumber) as "SP" | "NRT", nDet: Number(r.n_det),
    })),
    dq: dq.map((r) => ({
      kode: str(r.kode), judul: str(r.judul), isi: str(r.isi),
      tingkat: str(r.tingkat) as DataPage["dq"][number]["tingkat"], sumberUrl: strOrNull(r.sumber_url),
    })),
    paket: paket.map((r) => ({
      itemKode: str(r.item_kode), target: Number(r.target), sumber: str(r.sumber),
      label: str(r.label) as PaketRow["label"], nama: str(r.nama), satuan: str(r.satuan),
    })),
    harga: harga.map((r) => ({
      itemKode: str(r.item_kode), aksi: str(r.aksi) as HargaRow["aksi"], hargaRp: Number(r.harga_rp),
      sumber: str(r.sumber), tanggal: str(r.tanggal), catatan: strOrNull(r.catatan),
    })),
    meta: meta.map((r) => ({
      kunci: str(r.kunci), nilai: str(r.nilai), label: str(r.label) as DataPage["meta"][number]["label"],
    })),
  };
}

export async function countTampakAman(): Promise<number> {
  const [r] = await q("SELECT COUNT(*) AS n FROM desa_paparan WHERE mode = 'live' AND tampak_aman = 1");
  return Number(r.n);
}
