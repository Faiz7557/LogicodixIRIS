# 05 — Backend Schema Document: SiapKemarau v2

> Dibutuhkan karena aplikasi menyimpan inventaris, keputusan, dan usulan per desa. `db/schema.sql` adalah salinan persis DDL di bawah. Dialek: SQLite/libSQL. Pemilik: Orang 1.

## 1. Kepemilikan tabel

| Kelompok | Tabel | Ditulis oleh | Akses aplikasi |
|---|---|---|---|
| Referensi | `meta`, `sumber_data`, `dq_issue`, `katalog_item`, `paket_minimum`, `referensi_pergub`, `harga_item`, `deteksi_ringkas` | Pipeline | Baca |
| Wilayah dan paparan | `desa`, `desa_tahun`, `desa_paparan`, `kecamatan_paparan` | Pipeline | Baca |
| Bukti | `backtest_metric`, `backtest_grup` | Pipeline | Baca |
| Akun | `akun`, `sesi`, `rate_limit` | Aplikasi dan seed | Tulis |
| Desa | `inventaris_item`, `target_desa`, `harga_desa`, `rencana`, `keputusan`, `usulan` | Aplikasi | Tulis |
| Jejak | `audit_log` | Aplikasi | Tulis |

Menjalankan ulang pipeline membuat DB baru. Seed akun dijalankan sesudah pipeline.

## 2. Perubahan dari skema lama

| Lama | Baru | Alasan |
|---|---|---|
| `target_standar` per tier | `paket_minimum` satu baris per item | Tier target dihapus |
| Tanpa pembanding Pergub | `referensi_pergub` | Keterangan khusus Kalteng |
| `kecamatan_bulan` | Dihapus | FR-17 menjadi P2 |
| `p05`, `p95` | `rate_min`, `rate_max` | Interval Beta dihapus |
| `backtest_metric` satu tahun | Tambah `tahun_uji` dan strategi `total_riwayat` | Tiga fold |
| `backtest_grup` tanpa strata | Tambah `strata` | Kontrol bias luas |
| Tanpa jejak sensor | `deteksi_ringkas` | Audit sensor pada halaman Data |

## 3. DDL

```sql
PRAGMA foreign_keys = ON;

-- Referensi
CREATE TABLE meta (
  kunci TEXT PRIMARY KEY,
  nilai TEXT NOT NULL,
  label TEXT NOT NULL CHECK (label IN ('parameter','asumsi_tim','hasil'))
);

CREATE TABLE sumber_data (
  kode TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  url TEXT NOT NULL,
  lisensi TEXT NOT NULL,
  periode TEXT NOT NULL,
  diakses TEXT NOT NULL
);

CREATE TABLE dq_issue (
  kode TEXT PRIMARY KEY,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  tingkat TEXT NOT NULL CHECK (tingkat IN ('info','peringatan','batasan')),
  sumber_url TEXT
);

CREATE TABLE katalog_item (
  kode TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  satuan TEXT NOT NULL,
  bobot REAL NOT NULL CHECK (bobot > 0),
  kritis INTEGER NOT NULL CHECK (kritis IN (0,1)),
  bisa_dibeli INTEGER NOT NULL CHECK (bisa_dibeli IN (0,1)),
  punya_rusak INTEGER NOT NULL DEFAULT 1 CHECK (punya_rusak IN (0,1)),
  hanya_gambut INTEGER NOT NULL DEFAULT 0 CHECK (hanya_gambut IN (0,1)),
  urutan INTEGER NOT NULL
);

CREATE TABLE paket_minimum (
  item_kode TEXT PRIMARY KEY REFERENCES katalog_item(kode),
  target REAL NOT NULL CHECK (target >= 0),
  sumber TEXT NOT NULL,
  label TEXT NOT NULL CHECK (label IN ('asumsi_tim','bersumber'))
);

CREATE TABLE referensi_pergub (
  nama_alat TEXT PRIMARY KEY,
  jumlah_per_regu REAL NOT NULL,
  satuan TEXT NOT NULL,
  pasal TEXT NOT NULL,
  item_kode TEXT REFERENCES katalog_item(kode)
);

CREATE TABLE harga_item (
  item_kode TEXT NOT NULL REFERENCES katalog_item(kode),
  aksi TEXT NOT NULL CHECK (aksi IN ('perbaiki','beli')),
  harga_rp INTEGER NOT NULL CHECK (harga_rp > 0),
  sumber TEXT NOT NULL CHECK (length(sumber) > 0),
  tanggal TEXT NOT NULL,
  catatan TEXT,
  PRIMARY KEY (item_kode, aksi)
);

CREATE TABLE deteksi_ringkas (
  tahun INTEGER NOT NULL,
  satellite TEXT NOT NULL,
  sumber TEXT NOT NULL CHECK (sumber IN ('SP','NRT')),
  n_det INTEGER NOT NULL,
  PRIMARY KEY (tahun, satellite, sumber)
);

-- Wilayah dan paparan
CREATE TABLE desa (
  kode TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  kec_kode TEXT NOT NULL,
  kec_nama TEXT NOT NULL,
  kab_kode TEXT NOT NULL,
  kab_nama TEXT NOT NULL,
  prov_kode TEXT NOT NULL,
  prov_nama TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  luas_ha REAL NOT NULL,
  peat_frac REAL NOT NULL CHECK (peat_frac BETWEEN 0 AND 1),
  geom_json TEXT NOT NULL
);
CREATE INDEX idx_desa_nama ON desa(nama COLLATE NOCASE);
CREATE INDEX idx_desa_kec ON desa(kec_kode);

CREATE TABLE desa_tahun (
  kode TEXT NOT NULL REFERENCES desa(kode),
  tahun INTEGER NOT NULL,
  n_det INTEGER NOT NULL,
  det_days INTEGER NOT NULL,
  terpapar INTEGER NOT NULL CHECK (terpapar IN (0,1)),
  PRIMARY KEY (kode, tahun)
);

CREATE TABLE desa_paparan (
  kode TEXT NOT NULL REFERENCES desa(kode),
  mode TEXT NOT NULL CHECK (mode IN ('frozen','live')),
  k_ext INTEGER NOT NULL,
  n_ext INTEGER NOT NULL,
  k_norm INTEGER NOT NULL,
  n_norm INTEGER NOT NULL,
  tahun_tenang INTEGER NOT NULL,
  tampak_aman INTEGER NOT NULL CHECK (tampak_aman IN (0,1)),
  tier TEXT NOT NULL CHECK (tier IN ('rendah','sedang','tinggi')),
  skor REAL NOT NULL,
  PRIMARY KEY (kode, mode)
);

CREATE TABLE kecamatan_paparan (
  kec_kode TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('frozen','live')),
  n_desa INTEGER NOT NULL,
  k INTEGER NOT NULL,
  n INTEGER NOT NULL,
  p_mean REAL NOT NULL,
  rate_min REAL NOT NULL,
  rate_max REAL NOT NULL,
  PRIMARY KEY (kec_kode, mode)
);

-- Bukti
CREATE TABLE backtest_metric (
  tahun_uji INTEGER NOT NULL CHECK (tahun_uji IN (2019,2023,2026)),
  unit TEXT NOT NULL CHECK (unit IN ('desa','kecamatan')),
  strategi TEXT NOT NULL CHECK (strategi IN ('paparan','persistensi','total_riwayat','gambut','acak')),
  metrik TEXT NOT NULL CHECK (metrik IN ('capture_10','capture_20','capture_30','roc_auc','pr_auc')),
  nilai REAL NOT NULL,
  PRIMARY KEY (tahun_uji, unit, strategi, metrik)
);

CREATE TABLE backtest_grup (
  grup TEXT NOT NULL CHECK (grup IN ('tampak_aman','aktif','tanpa_riwayat_ekstrem')),
  strata TEXT NOT NULL CHECK (strata IN ('semua','q1','q2','q3','q4')),
  n_desa INTEGER NOT NULL,
  n_terpapar_2026 INTEGER NOT NULL,
  rate REAL NOT NULL,
  PRIMARY KEY (grup, strata)
);

-- Akun
CREATE TABLE akun (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  pass_hash TEXT NOT NULL,
  peran TEXT NOT NULL CHECK (peran IN ('mpa','desa')),
  desa_kode TEXT NOT NULL REFERENCES desa(kode),
  nama_tampil TEXT NOT NULL,
  is_demo INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0,1))
);

CREATE TABLE sesi (
  token_hash TEXT PRIMARY KEY,
  akun_id INTEGER NOT NULL REFERENCES akun(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE rate_limit (
  kunci TEXT NOT NULL,
  jendela TEXT NOT NULL,
  jumlah INTEGER NOT NULL,
  PRIMARY KEY (kunci, jendela)
);

-- Desa
CREATE TABLE inventaris_item (
  desa_kode TEXT NOT NULL REFERENCES desa(kode),
  item_kode TEXT NOT NULL REFERENCES katalog_item(kode),
  total REAL NOT NULL CHECK (total >= 0),
  berfungsi REAL NOT NULL CHECK (berfungsi >= 0 AND berfungsi <= total),
  catatan TEXT,
  updated_by INTEGER NOT NULL REFERENCES akun(id),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (desa_kode, item_kode)
);

CREATE TABLE target_desa (
  desa_kode TEXT NOT NULL REFERENCES desa(kode),
  item_kode TEXT NOT NULL REFERENCES katalog_item(kode),
  target REAL NOT NULL CHECK (target >= 0),
  alasan TEXT NOT NULL CHECK (length(alasan) >= 5),
  updated_by INTEGER NOT NULL REFERENCES akun(id),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (desa_kode, item_kode)
);

CREATE TABLE harga_desa (
  desa_kode TEXT NOT NULL REFERENCES desa(kode),
  item_kode TEXT NOT NULL REFERENCES katalog_item(kode),
  aksi TEXT NOT NULL CHECK (aksi IN ('perbaiki','beli')),
  harga_rp INTEGER NOT NULL CHECK (harga_rp > 0),
  sumber TEXT NOT NULL CHECK (length(sumber) > 0),
  updated_by INTEGER NOT NULL REFERENCES akun(id),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (desa_kode, item_kode, aksi)
);

CREATE TABLE rencana (
  desa_kode TEXT PRIMARY KEY REFERENCES desa(kode),
  pagu_rp INTEGER NOT NULL CHECK (pagu_rp >= 0),
  updated_by INTEGER NOT NULL REFERENCES akun(id),
  updated_at TEXT NOT NULL
);

CREATE TABLE keputusan (
  desa_kode TEXT NOT NULL REFERENCES desa(kode),
  item_kode TEXT NOT NULL REFERENCES katalog_item(kode),
  aksi TEXT NOT NULL CHECK (aksi IN ('perbaiki','beli')),
  keputusan TEXT NOT NULL CHECK (keputusan IN ('setuju','tolak','tunda')),
  catatan TEXT,
  updated_by INTEGER NOT NULL REFERENCES akun(id),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (desa_kode, item_kode, aksi)
);

CREATE TABLE usulan (
  id INTEGER PRIMARY KEY,
  desa_kode TEXT NOT NULL REFERENCES desa(kode),
  kanal TEXT NOT NULL CHECK (kanal IN ('apbdes_perubahan','bpbd','daops','csr')),
  facts_json TEXT NOT NULL,
  baris_json TEXT NOT NULL,
  teks TEXT NOT NULL,
  sumber_teks TEXT NOT NULL CHECK (sumber_teks IN ('ai','template')),
  model TEXT,
  created_by INTEGER NOT NULL REFERENCES akun(id),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_usulan_desa ON usulan(desa_kode, created_at);

-- Jejak
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY,
  akun_id INTEGER NOT NULL REFERENCES akun(id),
  desa_kode TEXT NOT NULL,
  aksi TEXT NOT NULL,
  detail_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

## 4. Aturan data

| Aturan | Penegakan |
|---|---|
| Berfungsi tidak melebihi total | `CHECK` dan zod |
| `punya_rusak = 0` | API menyimpan `total = berfungsi` |
| Waktu | ISO 8601 UTC. Tampilan WIB |
| Rupiah | Bilangan bulat |
| Harga wajib bersumber | `CHECK`, zod, dan `build_db` |
| Pipeline tidak menyentuh tabel desa | Tabel desa dibuat kosong |
| `usulan` tidak berubah | Tidak ada endpoint ubah |
| Tidak ada data pribadi | `catatan` diberi petunjuk UI agar tidak memuat nama, NIK, atau nomor HP |

## 5. Kueri efektif

**Target efektif:**

```sql
SELECT k.kode AS item_kode,
       COALESCE(td.target, pm.target) AS target,
       CASE WHEN td.target IS NULL THEN pm.sumber ELSE 'Diubah desa: ' || td.alasan END AS sumber
FROM katalog_item k
JOIN paket_minimum pm ON pm.item_kode = k.kode
LEFT JOIN target_desa td ON td.item_kode = k.kode AND td.desa_kode = :kode
WHERE k.hanya_gambut = 0 OR :peat_frac > 0
ORDER BY k.urutan;
```

**Harga efektif:** `harga_desa` menimpa `harga_item` untuk pasangan `(item_kode, aksi)` yang sama.

**Keterangan Pergub:** `referensi_pergub` hanya dibaca jika `desa.prov_kode = '62'`.

## 6. Isi data manual

**`katalog_item.csv`**

| kode | nama | satuan | bobot | kritis | bisa_dibeli | punya_rusak | hanya_gambut | urutan |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `pompa_jinjing` | Pompa jinjing | unit | 20 | 1 | 1 | 1 | 0 | 2 |
| `selang_keluar` | Selang keluar | buah | 20 | 1 | 1 | 1 | 0 | 3 |
| `sumur_bor` | Sumur bor | titik | 20 | 1 | 1 | 1 | 1 | 4 |

**`paket_minimum.csv`:** target 1, 1, 10, 5 sesuai PRD bagian 7. Semua `label = asumsi_tim`.

**`referensi_pergub.csv`:** pompa jinjing 3 unit (Pasal 19), selang 50 buah (Pasal 19), pompa punggung 10 unit (Pasal 18), regu 15 orang (Pasal 8).

**`harga_item.csv`:** empat baris pada PRD bagian 8, dengan `tanggal = 2026-11-09`.

**`sumber_data.csv`:** FIRMS, HDX, WRI, Pergub Kalteng 35/2025, Pergub Kalbar 56/2025, Permendesa PDT 16/2025, Perbup Sanggau 32/2025, Perwal Kediri 3/2025, Nurhidayah dkk. 2023, Mongabay Kalibandung, Mongabay Talio Hulu.

**`dq_issue.csv`, minimal:**

| Kode | Isi | Tingkat |
|---|---|---|
| `belum_diuji_pengguna` | Produk belum diuji dengan sekdes atau ketua MPA | batasan |
| `snpp_stop` | S-NPP berhenti 2 Nov 2026. Tuliskan tanggal akhir data nyata | batasan |
| `sipongi_juli` | Seri resmi luas terbakar berhenti Juli 2026 | info |
| `awan_asap` | Awan dan asap bisa menutupi api | batasan |
| `gambut_membara` | Api gambut bersuhu rendah bisa terlewat satelit | batasan |
| `titik_bukan_api` | Satu titik bukan satu kebakaran | info |
| `geometri_2020` | Batas desa HDX: geometri 2020, tinjauan Okt 2025 | peringatan |
| `kelurahan_tercampur` | Data batas memuat kelurahan yang tidak menerima Dana Desa | peringatan |
| `luas_desa_bias` | Desa luas lebih mudah terdeteksi | peringatan |
| `konsesi` | Api di konsesi tidak bisa diselesaikan oleh anggaran desa | batasan |
| `paket_asumsi` | Paket minimum dan bobot adalah asumsi tim | batasan |
| `harga_ssh_tertinggi` | SSH adalah harga satuan tertinggi | info |
| `servis_pendekatan` | Harga servis berasal dari servis pompa air umum di Kediri | peringatan |
| `dana_desa_2027` | Belum ada Permendesa fokus Dana Desa 2027 | peringatan |
| `dana_desa_kdmp` | Sekitar 58,03% pagu Dana Desa 2026 dialokasikan ke Koperasi Merah Putih, sumber pemberitaan | peringatan |
| `alat_di_catchall` | Pembelian pompa dan selang tidak disebut eksplisit pada contoh Permendesa hlm. 13, sehingga perlu keputusan Musyawarah Desa | peringatan |

## 7. Angka kontrol

`run_all.py` wajib mencetak ke `pipeline/run_output.txt`:

- Jumlah desa per provinsi dan desa dengan `peat_frac > 0`.
- Deteksi sebelum dan sesudah filter, per satelit dan sumber.
- Tanggal terakhir SP, NRT, dan celah di antaranya.
- Desa-tahun terpapar per tahun.
- Isi `backtest_grup`, metrik per fold, hasil `gate`.
- Riwayat `desa_tahun` Desa Kalibandung.
- Ukuran DB.

## 8. Bentuk fakta usulan

`usulan.facts_json` adalah peta string. Nilai di bawah sintetis.

```json
{
  "desa": "Contoh Desa",
  "kecamatan": "Contoh Kecamatan",
  "kabupaten": "Contoh Kabupaten",
  "skor": "10,9",
  "status": "rawan",
  "rantai_terlemah": "Selang keluar",
  "paparan": "2 dari 4 tahun kering ekstrem",
  "tahun_tenang": "6",
  "pagu": "Rp15.000.000",
  "total_usulan": "Rp12.179.000",
  "skor_sesudah": "78,2",
  "tanggal": "12 November 2026"
}
```
