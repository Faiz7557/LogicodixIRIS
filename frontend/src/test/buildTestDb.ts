import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient, type Client, type InStatement } from "@libsql/client";

// Jalur relatif terhadap frontend/ (cwd vitest dan tsx).
const AKAR = path.resolve(process.cwd(), "..");

// ponytail: pembaca CSV minimal untuk enam berkas manual, bukan parser umum.
function bacaCsv(teks: string): Record<string, string>[] {
  const baris: string[][] = [];
  let sel = "";
  let row: string[] = [];
  let kutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; }
      else if (c === '"') kutip = false;
      else sel += c;
    } else if (c === '"') kutip = true;
    else if (c === ",") { row.push(sel); sel = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      row.push(sel); sel = "";
      if (row.some((s) => s !== "")) baris.push(row);
      row = [];
    } else sel += c;
  }
  row.push(sel);
  if (row.some((s) => s !== "")) baris.push(row);
  const [kepala, ...isi] = baris;
  return isi.map((r) => Object.fromEntries(kepala.map((k, j) => [k, r[j] ?? ""])));
}

// Urutan mengikuti kunci asing.
const CSV = ["katalog_item", "paket_minimum", "referensi_pergub", "harga_item", "sumber_data", "dq_issue"];

function muatCsv(tabel: string): InStatement[] {
  const rows = bacaCsv(readFileSync(path.join(AKAR, "data", "manual", `${tabel}.csv`), "utf8"));
  return rows.map((r) => {
    const kolom = Object.keys(r);
    return {
      sql: `INSERT INTO ${tabel} (${kolom.join(",")}) VALUES (${kolom.map(() => "?").join(",")})`,
      args: kolom.map((k) => (r[k] === "" ? null : r[k])),
    };
  });
}

const TAHUN = Array.from({ length: 15 }, (_, i) => 2012 + i); // 2012-2026
const EXT_FROZEN = [2015, 2019, 2023];
const EXT_LIVE = [2015, 2019, 2023, 2026];
const S_DESA = 2;
const QUIET = 3;

interface DesaUji {
  kode: string;
  nama: string;
  peat: number;
  terpapar: number[];
}

// 25 desa: kode tetap dipakai tes lintas task (08_AGENT_PLAN §4).
const DESA: DesaUji[] = [
  { kode: "TINGGI", nama: "Desa Uji Tinggi", peat: 0.8, terpapar: [2014, 2015, 2018, 2019, 2023, 2024, 2026] },
  { kode: "RENDAH", nama: "Desa Uji Rendah", peat: 0.3, terpapar: [2013] },
  { kode: "NONGAMBUT", nama: "Desa Uji Nongambut", peat: 0, terpapar: [2015, 2021] },
  { kode: "KOSONG", nama: "Desa Uji Kosong", peat: 0.2, terpapar: [] },
  { kode: "D", nama: "Desa Uji D", peat: 0.5, terpapar: [2015, 2023, 2026] },
  { kode: "BARU", nama: "Desa Uji Baru", peat: 0.5, terpapar: [2025, 2026] },
  { kode: "DESA_A", nama: "Desa Uji A", peat: 0.7, terpapar: [2015, 2019] },
  { kode: "DESA_B", nama: "Desa Uji B", peat: 0.1, terpapar: [2023, 2024] },
  { kode: "KALIBANDUNG", nama: "Kalibandung", peat: 0.9, terpapar: [2015, 2019, 2023, 2026] },
  { kode: "DESA_KALBAR", nama: "Desa Uji Kalbar", peat: 0.4, terpapar: [2019, 2023] },
  ...Array.from({ length: 14 }, (_, j) => {
    const n = j + 11;
    return {
      kode: `UJI${n}`,
      nama: `Desa Uji ${n}`,
      peat: (n % 4) * 0.25,
      terpapar: TAHUN.filter((t) => (t * 7 + n * 3) % 5 === 0),
    };
  }),
  { kode: "DESA_KALTENG", nama: "Desa Uji Kalteng", peat: 0.6, terpapar: [2015, 2019, 2025] },
];

// 0-8 Kecamatan Uji, 9-16 Kecamatan Uji Dua (Kalbar), 17-24 Kecamatan Uji Tiga (Kalteng).
function wilayah(i: number) {
  if (i < 9) return { kec: "6101010", kecNama: "Kecamatan Uji", kab: "6101", kabNama: "Kabupaten Uji Barat", prov: "61", provNama: "Kalimantan Barat" };
  if (i < 17) return { kec: "6101020", kecNama: "Kecamatan Uji Dua", kab: "6101", kabNama: "Kabupaten Uji Barat", prov: "61", provNama: "Kalimantan Barat" };
  return { kec: "6201010", kecNama: "Kecamatan Uji Tiga", kab: "6201", kabNama: "Kabupaten Uji Tengah", prov: "62", provNama: "Kalimantan Tengah" };
}

function paparanDesa(d: DesaUji, mode: "frozen" | "live") {
  const tahun = mode === "frozen" ? TAHUN.filter((t) => t <= 2025) : TAHUN;
  const ext = mode === "frozen" ? EXT_FROZEN : EXT_LIVE;
  const kena = d.terpapar.filter((t) => tahun.includes(t));
  const kExt = kena.filter((t) => ext.includes(t)).length;
  const kNorm = kena.length - kExt;
  const akhir = tahun[tahun.length - 1];
  const tahunTenang = kena.length ? akhir - Math.max(...kena) : tahun.length;
  const r = kExt / ext.length;
  return {
    kExt, nExt: ext.length, kNorm, nNorm: tahun.length - ext.length, tahunTenang,
    tampakAman: kExt >= 1 && tahunTenang >= QUIET,
    tier: r === 0 ? "rendah" : r < 0.5 ? "sedang" : "tinggi",
    ext,
  };
}

function isiUji(): InStatement[] {
  const s: InStatement[] = [];
  const meta: [string, string, string][] = [
    ["buffer_km", "2", "parameter"],
    ["min_det_days", "2", "parameter"],
    ["quiet_window", "3", "parameter"],
    ["s_desa", "2", "parameter"],
    ["freeze_date", "2025-12-31", "parameter"],
    ["gate_min_lift", "1.5", "parameter"],
    ["gate_min_exposed", "30", "parameter"],
    ["gate_min_ratio_aktif", "0.6", "parameter"],
    ["kec_min_share", "0.5", "parameter"],
    ["panjang_per_buah_m", "30", "asumsi_tim"],
    ["ext_years", "2015,2019,2023,2026", "parameter"],
  ];
  for (const m of meta) s.push({ sql: "INSERT INTO meta (kunci, nilai, label) VALUES (?,?,?)", args: m });

  const kec = new Map<string, { idx: number[] }>();
  DESA.forEach((d, i) => {
    const w = wilayah(i);
    const lat = -1 - i * 0.05;
    const lon = 110 + i * 0.05;
    const e = 0.01;
    const geom = JSON.stringify({
      type: "Polygon",
      coordinates: [[[lon - e, lat - e], [lon + e, lat - e], [lon + e, lat + e], [lon - e, lat + e], [lon - e, lat - e]]],
    });
    s.push({
      sql: `INSERT INTO desa (kode, nama, kec_kode, kec_nama, kab_kode, kab_nama, prov_kode, prov_nama, lat, lon, luas_ha, peat_frac, geom_json)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [d.kode, d.nama, w.kec, w.kecNama, w.kab, w.kabNama, w.prov, w.provNama, lat, lon, 1000 + i * 100, d.peat, geom],
    });
    for (const t of TAHUN) {
      const kena = d.terpapar.includes(t);
      s.push({
        sql: "INSERT INTO desa_tahun (kode, tahun, n_det, det_days, terpapar) VALUES (?,?,?,?,?)",
        args: [d.kode, t, kena ? 6 : 0, kena ? 3 : 0, kena ? 1 : 0],
      });
      // Data uji: semua hari deteksi tahun terpapar jatuh di September.
      if (kena) s.push({ sql: "INSERT INTO desa_bulan (kode, tahun, bulan, n_det, det_days) VALUES (?,?,9,6,3)", args: [d.kode, t] });
    }
    if (!kec.has(w.kec)) kec.set(w.kec, { idx: [] });
    kec.get(w.kec)!.idx.push(i);
  });

  for (const mode of ["frozen", "live"] as const) {
    for (const [kecKode, { idx }] of kec) {
      const anggota = idx.map((i) => DESA[i]);
      const pap = anggota.map((d) => paparanDesa(d, mode));
      const k = pap.reduce((a, p) => a + p.kExt, 0);
      const n = pap.reduce((a, p) => a + p.nExt, 0);
      const pMean = k / n;
      const rates = pap[0].ext.map((t) => anggota.filter((d) => d.terpapar.includes(t)).length / anggota.length);
      s.push({
        sql: "INSERT INTO kecamatan_paparan (kec_kode, mode, n_desa, k, n, p_mean, rate_min, rate_max) VALUES (?,?,?,?,?,?,?,?)",
        args: [kecKode, mode, anggota.length, k, n, pMean, Math.min(...rates), Math.max(...rates)],
      });
      anggota.forEach((d, j) => {
        const p = pap[j];
        s.push({
          sql: `INSERT INTO desa_paparan (kode, mode, k_ext, n_ext, k_norm, n_norm, tahun_tenang, tampak_aman, tier, skor)
                VALUES (?,?,?,?,?,?,?,?,?,?)`,
          args: [d.kode, mode, p.kExt, p.nExt, p.kNorm, p.nNorm, p.tahunTenang, p.tampakAman ? 1 : 0, p.tier,
            (p.kExt + S_DESA * pMean) / (p.nExt + S_DESA)],
        });
      });
    }
  }

  const akun: [number, string, string, string, string][] = [
    [1, "uji-desa-d", "desa", "D", "Sekdes Uji D"],
    [2, "uji-desa-a", "desa", "DESA_A", "Sekdes Uji A"],
    [3, "uji-mpa-a", "mpa", "DESA_A", "MPA Uji A"],
    [4, "uji-desa-b", "desa", "DESA_B", "Sekdes Uji B"],
  ];
  for (const [id, username, peran, desa, nama] of akun) {
    s.push({
      sql: "INSERT INTO akun (id, username, pass_hash, peran, desa_kode, nama_tampil, is_demo) VALUES (?,?,?,?,?,?,0)",
      args: [id, username, "bukan-hash-tidak-bisa-masuk", peran, desa, nama],
    });
  }
  return s;
}

export async function buildTestDb(url: string): Promise<Client> {
  const c = createClient({ url });
  await c.executeMultiple(readFileSync(path.join(AKAR, "db", "schema.sql"), "utf8"));
  await c.batch([...CSV.flatMap(muatCsv), ...isiUji()], "write");
  return c;
}
