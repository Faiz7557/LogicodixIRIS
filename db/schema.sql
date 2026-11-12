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

-- Desa bergambut seluruh Kalimantan (keluaran pipeline/gambut_kalimantan.py).
-- Terpisah dari `desa` karena paparan dan backtest hanya dihitung untuk Kalbar dan Kalteng.
CREATE TABLE desa_gambut (
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
  peat_ha REAL NOT NULL,
  peat_frac REAL NOT NULL CHECK (peat_frac BETWEEN 0 AND 1),
  geom_json TEXT NOT NULL
);
CREATE INDEX idx_desa_gambut_prov ON desa_gambut(prov_kode);

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
