# SiapKemarau Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun MVP web SiapKemarau, dari data satelit nyata sampai dokumen usulan desa, dan mengirimkannya sebelum 14 November 2026 pukul 23.59 WIB.

**Architecture:** Pipeline Python offline menghasilkan satu file SQLite berisi paparan desa dan bukti backtest. Aplikasi Next.js membaca file itu lewat libSQL di localhost, dan Turso di deployment. Mesin kesiapan dan prioritas adalah fungsi TypeScript murni.

**Tech Stack:** Python 3.11+, geopandas, pyogrio, pandas, scipy, pytest, Next.js App Router, TypeScript, Tailwind, `@libsql/client`, zod, maplibre-gl, `@anthropic-ai/sdk`, Vitest.

**Spec:** [00_BRIEF.md](00_BRIEF.md), [01_PRD.md](01_PRD.md), [02_TRD.md](02_TRD.md), [03_APP_FLOW.md](03_APP_FLOW.md), [04_DESIGN_BRIEF.md](04_DESIGN_BRIEF.md), [05_BACKEND_SCHEMA.md](05_BACKEND_SCHEMA.md).

## Global Constraints

Dari Guidebook LOGICODIX 2026 dan dokumen spesifikasi. Berlaku untuk setiap task.

- Repositori GitHub baru dan publik, dibuat setelah Hacking Kick-off. **Tidak boleh ada kode, repo, atau hasil caliber-final.**
- Commit hanya dari akun GitHub anggota terdaftar, berkala, dan mencerminkan perubahan nyata. Dilarang bulk upload di akhir.
- Dilarang force push, rebase, squash, menghapus commit, atau memanipulasi tanggal commit setelah di-push.
- Pesan commit wajib berawalan `feat`, `fix`, `docs`, `style`, `refactor`, atau `chore`. Pesan seperti `update`, `test`, `final` tidak sah.
- Kredensial hanya di `.env`. `.env` masuk `.gitignore`. Sediakan `.env.example` tanpa nilai.
- Atribusi semua kode, template, aset, dataset, dan layanan pihak ketiga di `README.md`. Penggunaan AI dan modelnya wajib disebut.
- Selalu tulis "deteksi satelit". Dilarang menampilkan "hektare terselamatkan".
- Harga tanpa sumber dilarang masuk data.
- Tidak ada data simulasi sebagai hasil. Isian demo wajib berlabel data uji.
- Semua P0 berjalan tanpa internet dan tanpa `ANTHROPIC_API_KEY`, kecuali latar peta.
- GADM dilarang. Domain `sipongi.menlhk.go.id` tidak dipakai.
- `data/siapkemarau.db` di bawah 50 MB.

## Review Focus

Masukan yang paling mungkin merusak pengalaman pengguna. Setiap baris memiliki tes pada task pemiliknya.

1. Pencarian dengan `%` atau `_` tidak boleh mengembalikan semua desa, dan nama HDX bertanda garis miring tampil bersih. (Task 3, Task 8)
2. Desa yang tidak pernah terdeteksi tidak boleh berlabel "tampak aman" atau dianggap aman. (Task 5, Task 9)
3. Berfungsi melebihi total, nilai negatif, atau bukan angka harus ditolak dengan pesan jelas. (Task 15)
4. Pagu 0, pagu di bawah harga termurah, dan item tanpa harga tidak boleh merusak daftar. (Task 12)
5. Akun desa A tidak boleh membaca atau mengubah data desa B lewat API langsung. (Task 14)

---

## Jadwal

Jalur: **DATA** (pipeline dan bukti), **APP** (web dan mesin), **SHIP** (riset lapangan, QA, dokumen, video). Dua orang: gabungkan SHIP ke APP. Satu orang: kerjakan urut nomor task dan potong semua P1.

| Tanggal | DATA | APP | SHIP |
|---|---|---|---|
| Sen 9 Nov | Task 0 | Task 0, 1 | Task 0 |
| Sel 10 Nov | Task 2, 3, 4 | Task 8, 11 | Wawancara, kumpulkan harga |
| Rab 11 Nov | Task 5, 6, 7 **Gerbang** | Task 12, 14 | Wawancara, isi CSV |
| Kam 12 Nov | Task 9, 10 | Task 15, 16, 17 | QA alur |
| Jum 13 Nov | Task 13, 20 | Task 18, 19, 21 | Task 22 |
| Sab 14 Nov | Bantu | Perbaikan bug | Task 23. **Submit 20.00 WIB** |

**Aturan potong.** Pukul 20.00 tanggal 13 Nov: berhenti menambah fitur. Yang belum selesai dipotong dari bawah: Task 21, Task 13, Task 20. Task lain adalah P0.

---

## Task 0: Persiapan manusia

Tidak ada kode. Hanya bisa dikerjakan anggota tim.

- [ ] **Step 1:** Pastikan tim sudah terdaftar di LOGICODIX 2026 dan sudah mengikuti Integrated Mentoring. Jika belum, hubungi panitia hari ini.
- [ ] **Step 2:** Buat akun NASA Earthdata. Kirim permintaan arsip FIRMS: VIIRS S-NPP, kotak Kalimantan, 20 Jan 2012 sampai 2 Nov 2026, CSV. Hasil: surel konfirmasi antrean.
- [ ] **Step 3:** Minta FIRMS MAP_KEY. Uji satu permintaan `VIIRS_SNPP_SP` untuk tanggal lama. Hasil: tercatat apakah API melayani riwayat. Ini jalur cadangan.
- [ ] **Step 4:** Unduh HDX COD-AB Indonesia (SHP atau GDB) dan WRI Global Peatlands ke `data/raw/`.
- [ ] **Step 5:** Buat akun Turso dan Vercel. Siapkan kunci Anthropic.
- [ ] **Step 6:** Hubungi sekdes, ketua MPA, dan Daops/BPBD sesuai laporan riset bagian 7. Tanyakan ke mentor: arti "simulasi", subtema, peringkat berbasis asumsi. Catat di `docs/VALIDASI.md`, tanpa data pribadi narasumber kecuali diizinkan.
- [ ] **Step 7:** Kumpulkan harga: pompa jinjing, servis pompa, selang keluar, selang hisap, pompa punggung, APD, HT, BBM, sumur bor total, perbaikan sumur. Sumber: e-katalog LKPP, SSH kabupaten, atau penawaran distributor.

---

## Task 1: Repositori dan kerangka aplikasi

**Files:**
- Create: `package.json`, `.gitignore`, `.env.example`, `vitest.config.ts`, `src/lib/smoke.test.ts`, `docs/*`

**Interfaces:**
- Produces: perintah `npm test`, `npm run build`, alias impor `@/`.

- [ ] **Step 1: Buat repo baru dan kerangka**

```bash
npx create-next-app@latest siapkemarau --ts --tailwind --app --src-dir --eslint --import-alias "@/*"
cd siapkemarau
npm i @libsql/client zod maplibre-gl @anthropic-ai/sdk
npm i -D vitest tsx
```

- [ ] **Step 2: Tambahkan ke `.gitignore`:** `.env`, `data/raw/`, `.pytest_cache/`, `__pycache__/`. Buat `.env.example` dengan isi TRD bagian 10 tanpa nilai rahasia.
- [ ] **Step 3: Tulis tes smoke** `src/lib/smoke.test.ts` dengan `expect(1 + 1).toBe(2)`. Tambahkan skrip `"test": "vitest run"`.
- [ ] **Step 4: Jalankan** `npm test && npm run build`. Expected: lulus.
- [ ] **Step 5: Salin dokumen** `docs/` dan `reports/` ke repo. Buat repo publik di GitHub.
- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize next app with test tooling"
git push -u origin main
```

---

## Task 2: Skema dan data manual

**Files:**
- Create: `db/schema.sql`, `data/manual/katalog_item.csv`, `data/manual/target_standar.csv`, `data/manual/harga_item.csv`, `data/manual/sumber_data.csv`, `data/manual/dq_issue.csv`
- Test: `pipeline/tests/test_schema.py`

**Interfaces:**
- Produces: DDL pada 05_BACKEND_SCHEMA bagian 3, dipakai `export.py` dan tes aplikasi.

- [ ] **Step 1: Tulis tes**

```python
def test_schema_loads_and_enforces_berfungsi(conn):
    conn.executescript(SCHEMA)
    seed_minimal(conn)  # satu desa, satu item, satu akun
    with pytest.raises(sqlite3.IntegrityError):
        conn.execute(INSERT_INVENTARIS, ("D1", "selang_keluar", 2, 3, 1, "2026-11-10T00:00:00Z"))
```

- [ ] **Step 2:** Jalankan `pytest pipeline/tests/test_schema.py -v`. Expected: gagal karena `db/schema.sql` belum ada.
- [ ] **Step 3:** Salin DDL ke `db/schema.sql`. Isi `katalog_item.csv` dan `target_standar.csv` persis dari PRD bagian 6. `sumber` target bernilai `Standar regu DLHK Banten` atau `Asumsi tim`. `sumur_bor` memiliki `hanya_gambut = 1`. `anggota` memiliki `bisa_dibeli = 0`.
- [ ] **Step 4:** Isi `dq_issue.csv` minimal: `snpp_stop`, `sipongi_juli`, `awan_asap`, `gambut_membara`, `titik_bukan_api`. Isi `sumber_data.csv` untuk semua sumber TRD bagian 4.
- [ ] **Step 5:** Jalankan tes. Expected: lulus.
- [ ] **Step 6: Commit** `feat: add database schema and reference data`.

---

## Task 3: Wilayah dan porsi gambut

**Files:**
- Create: `pipeline/wilayah.py`, `pipeline/requirements.txt`
- Test: `pipeline/tests/test_wilayah.py`

**Interfaces:**
- Produces:
  - `clean_name(name: str) -> str`
  - `load_desa(path: str, prov_codes: list[str]) -> GeoDataFrame` berkolom `kode, nama, kec_kode, kec_nama, kab_kode, kab_nama, prov_kode, prov_nama, geometry`
  - `peat_fraction(desa: GeoDataFrame, peat: GeoDataFrame) -> pd.Series`
  - `simplify_geom(geom, max_bytes: int = 4000) -> str`

- [ ] **Step 1: Tulis tes**

```python
def test_clean_name_takes_first_alternate():
    assert clean_name("Sungai Raya/ Sei Raya") == "Sungai Raya"

def test_peat_fraction_half_covered():
    assert peat_fraction(square_desa, left_half_peat).iloc[0] == pytest.approx(0.5, abs=0.01)

def test_peat_fraction_no_overlap_is_zero():
    assert peat_fraction(square_desa, far_peat).iloc[0] == 0

def test_simplify_geom_respects_limit():
    assert len(simplify_geom(jagged_polygon, max_bytes=4000)) <= 4000
```

- [ ] **Step 2:** Jalankan tes. Expected: gagal, modul belum ada.
- [ ] **Step 3:** Implementasi. Gunakan CRS setara luas EPSG:6933 untuk luas. `simplify_geom` menaikkan toleransi bertahap sampai GeoJSON muat. Nama kolom HDX diperiksa pada file nyata dan dipetakan di `load_desa`.
- [ ] **Step 4:** Jalankan tes. Expected: lulus.
- [ ] **Step 5:** Jalankan pada data nyata untuk Kalbar dan Kalteng. Expected: tercetak jumlah desa per provinsi.
- [ ] **Step 6: Commit** `feat: build village table with peat fraction`.

---

## Task 4: Deteksi FIRMS per desa-tahun

**Files:**
- Create: `pipeline/firms.py`
- Test: `pipeline/tests/test_firms.py`

**Interfaces:**
- Consumes: `load_desa`.
- Produces:
  - `load_detections(paths: list[str]) -> pd.DataFrame` berkolom `lat, lon, tanggal, tahun`
  - `assign_to_desa(det, desa, buffer_km: float) -> pd.DataFrame` berkolom `kode, tanggal, tahun`
  - `desa_year(assigned, kode_list, years, min_det_days: int) -> pd.DataFrame` berkolom `kode, tahun, n_det, det_days, terpapar`
  - `kecamatan_bulan(assigned, desa) -> pd.DataFrame` berkolom `kec_kode, bulan, n_det`

- [ ] **Step 1: Tulis tes**

```python
def test_low_confidence_dropped(csv_with_l_n_h):
    assert len(load_detections([csv_with_l_n_h])) == 2

def test_buffer_includes_point_1_5km_outside():
    assert len(assign_to_desa(point_1_5km_out, desa, buffer_km=2)) == 1
    assert len(assign_to_desa(point_1_5km_out, desa, buffer_km=1)) == 0

def test_same_day_counts_once():
    r = desa_year(three_same_day, ["A"], [2019], min_det_days=2).iloc[0]
    assert (r.n_det, r.det_days, r.terpapar) == (3, 1, 0)

def test_two_days_exposed():
    r = desa_year(two_days, ["A"], [2019], min_det_days=2).iloc[0]
    assert r.terpapar == 1

def test_village_without_detection_gets_zero_rows():
    assert len(desa_year(empty_det, ["A"], [2018, 2019], 2)) == 2

def test_kecamatan_bulan_counts_by_month():
    r = kecamatan_bulan(two_september_one_march, desa_in_kec_k1)
    assert set(zip(r.bulan, r.n_det)) == {(3, 1), (9, 2)}
```

- [ ] **Step 2:** Jalankan. Expected: gagal.
- [ ] **Step 3:** Implementasi. Filter `confidence in {"n","h"}` dan `type == 0` bila kolom tersedia. Penyangga dihitung di EPSG:3857, cukup akurat dekat khatulistiwa, tandai `ponytail:`. Gunakan `sjoin`. Satu titik boleh masuk beberapa desa karena penyangga.
- [ ] **Step 4:** Jalankan tes. Expected: lulus.
- [ ] **Step 5:** Jalankan pada arsip nyata. Jika arsip belum datang, tarik lewat API sesuai TRD bagian 4. Simpan `data/raw/desa_tahun.parquet`.
- [ ] **Step 6: Commit** `feat: aggregate satellite detections per village year`.

---

## Task 5: Paparan bertingkat

**Files:**
- Create: `pipeline/paparan.py`
- Test: `pipeline/tests/test_paparan.py`

**Interfaces:**
- Consumes: keluaran `desa_year`.
- Produces:
  - `tier(k_ext: int, n_ext: int) -> str`
  - `exposure(dy, ext_years, last_year, quiet_window) -> pd.DataFrame` berkolom `kode, k_ext, n_ext, k_norm, n_norm, tahun_tenang, tampak_aman, tier`
  - `beta_posterior(k, n, prior_mean, s) -> tuple[float, float, float]` (mean, p05, p95)
  - `shrink_desa(k, n, p_kec, s) -> float`
  - `kecamatan_exposure(dy, desa, ext_years, s_kab) -> pd.DataFrame`

- [ ] **Step 1: Tulis tes**

```python
EXT = [2015, 2019, 2023]
def test_blind_spot_case():
    r = exposure(rows("A", exposed=[2015, 2019]), EXT, 2025, 3).iloc[0]
    assert (r.k_ext, r.n_ext, r.tahun_tenang, r.tampak_aman, r.tier) == (2, 3, 6, 1, "tinggi")

def test_never_detected_is_not_blind_spot():
    r = exposure(rows("B", exposed=[]), EXT, 2025, 3).iloc[0]
    assert (r.k_ext, r.tahun_tenang, r.tampak_aman, r.tier) == (0, 14, 0, "rendah")

def test_recent_exposure_not_quiet():
    r = exposure(rows("C", exposed=[2015, 2025]), EXT, 2025, 3).iloc[0]
    assert (r.tahun_tenang, r.tampak_aman) == (0, 0)

def test_frozen_rejects_future_rows():
    with pytest.raises(ValueError, match="kebocoran"):
        exposure(rows("A", exposed=[2026]), EXT, 2025, 3)

def test_tier_boundaries():
    assert [tier(1, 2), tier(1, 3), tier(0, 3)] == ["tinggi", "sedang", "rendah"]

def test_beta_posterior():
    mean, p05, p95 = beta_posterior(3, 4, 0.5, 10)
    assert mean == pytest.approx(8 / 14)
    assert p05 < mean < p95

def test_shrink_desa():
    assert shrink_desa(2, 3, 0.4, 2) == pytest.approx(0.56)
```

- [ ] **Step 2:** Jalankan. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai rumus TRD bagian 5. `exposure` melempar `ValueError("kebocoran data masa depan")` jika ada baris dengan `tahun > last_year`. Baris tahun 2012 dianggap lengkap.
- [ ] **Step 4:** Jalankan. Expected: lulus.
- [ ] **Step 5: Commit** `feat: compute hierarchical village exposure`.

---

## Task 6: Time Machine dan gerbang

**Files:**
- Create: `pipeline/backtest.py`
- Test: `pipeline/tests/test_backtest.py`

**Interfaces:**
- Consumes: keluaran `exposure` mode `frozen`, `desa_year` 2026.
- Produces:
  - `top_k_capture(score, y, k_pct: float) -> float`
  - `auc(score, y) -> float`
  - `blind_spot_groups(frozen, y2026) -> pd.DataFrame` berkolom `grup, n_desa, n_terpapar_2026, rate`
  - `gate(groups, min_lift: float, min_exposed: int) -> bool`

Definisi grup, saling lepas: `tampak_aman` (`k_ext >= 1` dan `tahun_tenang >= quiet_window`), `aktif` (`tahun_tenang < quiet_window`), `tanpa_riwayat_ekstrem` (`k_ext = 0` dan `tahun_tenang >= quiet_window`).

- [ ] **Step 1: Tulis tes**

```python
def test_top_k_capture():
    assert top_k_capture([.9, .8, .1, .1], [1, 0, 1, 0], 50) == 0.5

def test_top_k_ties_do_not_use_label():
    assert top_k_capture([1, 1, 1, 1], [0, 0, 1, 1], 50) == 0.0

def test_auc_perfect():
    assert auc([.9, .8, .1], [1, 1, 0]) == 1.0

def test_gate_passes():
    assert gate(groups(aman=(100, 40), tanpa=(1000, 200)), 1.5, 30)

def test_gate_needs_enough_exposed():
    assert not gate(groups(aman=(50, 20), tanpa=(1000, 100)), 1.5, 30)

def test_gate_zero_baseline_does_not_divide():
    assert gate(groups(aman=(100, 40), tanpa=(1000, 0)), 1.5, 30)
```

- [ ] **Step 2:** Jalankan. Expected: gagal.
- [ ] **Step 3:** Implementasi. Pengurutan stabil berdasarkan skor menurun, urutan masukan adalah urutan `kode`. Nilai `acak` untuk capture sama dengan `k_pct / 100`.
- [ ] **Step 4:** Jalankan. Expected: lulus.
- [ ] **Step 5: Commit** `feat: add out-of-time evaluation and blind spot gate`.

---

## Task 7: Ekspor basis data dan gerbang nyata

**Files:**
- Create: `pipeline/export.py`, `pipeline/run_all.py`, `pipeline/run_output.txt`, `data/siapkemarau.db`
- Test: `pipeline/tests/test_export.py`

**Interfaces:**
- Consumes: semua modul pipeline, `db/schema.sql`, `data/manual/*.csv`.
- Produces: `build_db(path: str, tables: dict[str, pd.DataFrame]) -> None`, `data/siapkemarau.db`.

- [ ] **Step 1: Tulis tes**

```python
def test_build_db_writes_rows_and_leaves_app_tables_empty(tmp_path):
    build_db(tmp_path / "x.db", tiny_tables())
    c = sqlite3.connect(tmp_path / "x.db")
    assert c.execute("select count(*) from desa").fetchone()[0] == 1
    assert c.execute("select count(*) from akun").fetchone()[0] == 0

def test_build_db_rejects_price_without_source(tmp_path):
    with pytest.raises(ValueError, match="sumber"):
        build_db(tmp_path / "x.db", tiny_tables(harga_sumber=""))
```

- [ ] **Step 2:** Jalankan. Expected: gagal.
- [ ] **Step 3:** Implementasi. `run_all.py` menghitung mode `frozen` dan `live`, menulis sensitivitas ke `meta` kunci `sensitivitas`, lalu mencetak angka kontrol pada 05_BACKEND_SCHEMA bagian 6 ke `pipeline/run_output.txt`.
- [ ] **Step 4:** Jalankan tes. Expected: lulus.
- [ ] **Step 5:** Jalankan `python pipeline/run_all.py`. Expected: DB di bawah 50 MB, angka kontrol tercetak.
- [ ] **Step 6: Periksa gerbang.** Baca `backtest_grup` dan riwayat Kalibandung di `run_output.txt`. Catat keputusan di `docs/VALIDASI.md`:
  - Gerbang lulus: pertahankan klaim "tampak aman".
  - Gerbang gagal: label "tampak aman" tetap sebagai fakta, tetapi buang klaim bahwa kelompok itu lebih berisiko, dan ubah Beranda.
  - Kalibandung tidak cocok: pilih desa jangkar dari data.
- [ ] **Step 7: Commit** `feat: export exposure database and control numbers`.

---

## Task 8: Lapisan data aplikasi

**Files:**
- Create: `src/lib/db.ts`, `src/lib/queries.ts`, `src/lib/http.ts`, `src/test/testDb.ts`, `scripts/seed-accounts.ts`
- Test: `src/lib/queries.test.ts`

**Interfaces:**
- Produces:
  - `db(): Client`
  - `searchDesa(q: string): Promise<DesaHit[]>`
  - `getDesaCard(kode: string): Promise<DesaCard | null>`
  - `getBacktest(): Promise<Backtest>`
  - `getDataPage(): Promise<DataPage>`
  - `jsonError(status: number, kode: string, pesan: string): Response`

- [ ] **Step 1: Tulis tes**

```ts
it("mencari tanpa peka huruf", async () => {
  expect((await searchDesa("kalibandung"))[0].nama).toBe("Kalibandung");
});
it("wildcard dianggap literal", async () => {
  expect(await searchDesa("%")).toHaveLength(0);
});
it("membatasi 20 hasil", async () => {
  expect((await searchDesa("desa")).length).toBeLessThanOrEqual(20);
});
it("mengembalikan null untuk kode tak dikenal", async () => {
  expect(await getDesaCard("ZZ")).toBeNull();
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi. `testDb.ts` memuat `db/schema.sql` ke file sementara dan mengisi 25 desa uji. `searchDesa` memakai `LIKE ? ESCAPE '\'` dan meloloskan `%`, `_`, `\`. Semua kueri berparameter.
- [ ] **Step 4:** `npm test`. Expected: lulus.
- [ ] **Step 5:** Tulis `seed-accounts.ts`: membuat `demo-mpa` dan `demo-sekdes` pada desa jangkar dengan `DEMO_PASSWORD`, `is_demo = 1`, idempoten.
- [ ] **Step 6: Commit** `feat: add data access layer and demo accounts`.

---

## Task 9: Beranda dan Kartu Paparan

**Files:**
- Create: `src/app/page.tsx`, `src/app/desa/[kode]/page.tsx`, `src/app/api/desa/route.ts`, `src/app/api/desa/[kode]/route.ts`, `src/components/YearStrip.tsx`, `src/components/SearchBox.tsx`, `src/components/MiniMap.tsx`, `src/lib/kalimat.ts`
- Test: `src/lib/kalimat.test.ts`

**Interfaces:**
- Consumes: `searchDesa`, `getDesaCard`.
- Produces: `headlinePaparan(p: {kExt: number; nExt: number; tahunTenang: number}): string`.

- [ ] **Step 1: Tulis tes**

```ts
it("desa tenang dengan riwayat", () => {
  expect(headlinePaparan({ kExt: 2, nExt: 4, tahunTenang: 6 }))
    .toBe("Terdeteksi satelit pada 2 dari 4 tahun kering ekstrem. 6 tahun terakhir tenang.");
});
it("tidak pernah terdeteksi bukan jaminan", () => {
  expect(headlinePaparan({ kExt: 0, nExt: 4, tahunTenang: 15 }))
    .toContain("bukan jaminan aman");
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi halaman sesuai App Flow 3.1 dan 3.2, token Design Brief bagian 4, komponen bagian 7.
- [ ] **Step 4:** `npm test` lalu `npm run dev`. Buka `/desa/[kode jangkar]` pada lebar 360 px. Expected: kalimat, strip, peluang kecamatan, peta tampil, dan tidak ada gulir horizontal.
- [ ] **Step 5: Commit** `feat: add village search and exposure card`.

---

## Task 10: Time Machine dan Data

**Files:**
- Create: `src/app/time-machine/page.tsx`, `src/app/data/page.tsx`, `src/app/api/backtest/route.ts`, `src/app/api/data/route.ts`, `src/components/TimeMachine.tsx`
- Test: `src/lib/backtest.test.ts`

**Interfaces:**
- Consumes: `getBacktest`, `getDataPage`.
- Produces: `kesimpulanBacktest(rows: MetricRow[]): string`.

- [ ] **Step 1: Tulis tes**

```ts
it("mengakui saat kalah dari persistensi", () => {
  expect(kesimpulanBacktest(rows({ paparan: 0.4, persistensi: 0.5 }))).toContain("kalah dari persistensi");
});
it("menyatakan selisih saat menang", () => {
  expect(kesimpulanBacktest(rows({ paparan: 0.6, persistensi: 0.5 }))).toContain("10 poin");
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.3 dan 3.4. Peta memuat 300 desa teratas menurut `skor` mode `frozen`, lalu `terpapar` 2026 dari `desa_tahun` setelah tombol ditekan. Halaman Data wajib memuat `dq_issue`, `sumber_data`, parameter, dan sensitivitas.
- [ ] **Step 4:** Jalankan. Buka kedua halaman. Expected: angka sama dengan `run_output.txt`, dan bagian "Apa yang tidak bisa dibuktikan" terlihat.
- [ ] **Step 5: Commit** `feat: add time machine and data transparency pages`.

---

## Task 11: Mesin Kesiapan

**Files:**
- Create: `src/lib/engine/types.ts`, `src/lib/engine/readiness.ts`
- Test: `src/lib/engine/readiness.test.ts`

**Interfaces:**
- Produces: tipe dan `computeReadiness` pada TRD bagian 6.

- [ ] **Step 1: Tulis tes.** Fixture: `pompa_jinjing` dan `selang_keluar`, bobot 20, kritis, target 2 dan 6.

```ts
it("menghitung skor", () => {
  const r = computeReadiness(cat, targets, [inv("pompa_jinjing", 2, 1), inv("selang_keluar", 2, 2)]);
  expect(r.skor).toBe(41.7);
  expect(r.status).toBe("sebagian");
  expect(r.rantaiTerlemah).toBe("selang_keluar");
});
it("rawan jika kritis di bawah 25%", () => {
  expect(computeReadiness(cat, targets, [inv("pompa_jinjing", 2, 0), inv("selang_keluar", 6, 6)]).status).toBe("rawan");
});
it("membatasi cakupan di 1", () => {
  const r = computeReadiness(cat, targets, [inv("pompa_jinjing", 9, 9), inv("selang_keluar", 9, 9)]);
  expect(r.skor).toBe(100);
  expect(r.status).toBe("siap");
});
it("item kosong membuat belum lengkap", () => {
  const r = computeReadiness(cat, targets, [inv("pompa_jinjing", 2, 2)]);
  expect(r.lengkap).toBe(false);
  expect(r.items.find(i => i.itemKode === "selang_keluar")!.belumDiisi).toBe(true);
});
it("mengabaikan target nol", () => {
  expect(computeReadiness(cat, [t("pompa_jinjing", 2), t("selang_keluar", 0)], [inv("pompa_jinjing", 2, 2)]).skor).toBe(100);
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 6.
- [ ] **Step 4:** `npm test`. Expected: lulus.
- [ ] **Step 5: Commit** `feat: add readiness engine`.

---

## Task 12: Mesin Prioritas

**Files:**
- Create: `src/lib/engine/priority.ts`
- Test: `src/lib/engine/priority.test.ts`

**Interfaces:**
- Consumes: `computeReadiness`, tipe.
- Produces: `rankPriorities` pada TRD bagian 6.

Harga di tes adalah fixture, bukan data.

- [ ] **Step 1: Tulis tes**

```ts
const prices = [p("pompa_jinjing","perbaiki",3e6), p("pompa_jinjing","beli",20e6), p("selang_keluar","beli",1.5e6)];
const readiness = computeReadiness(cat, targets, [inv("pompa_jinjing",2,1), inv("selang_keluar",2,2)]);

it("mendahulukan perbaikan lalu membeli sampai pagu", () => {
  const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 7e6 });
  expect(r.terpilih.map(x => [x.itemKode, x.aksi, x.qty, x.biayaRp])).toEqual([
    ["pompa_jinjing", "perbaiki", 1, 3e6],
    ["selang_keluar", "beli", 2, 3e6],
  ]);
  expect(r.terpakaiRp).toBe(6e6);
  expect(r.skorSesudah).toBe(83.3);
});
it("pagu nol tidak memilih apa pun", () => {
  const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 0 });
  expect(r.terpilih).toEqual([]);
  expect(r.tidakTerdanai.length).toBeGreaterThan(0);
});
it("pagu di bawah harga termurah tetap aman", () => {
  expect(rankPriorities({ catalog: cat, readiness, prices, paguRp: 1000 }).terpilih).toEqual([]);
});
it("item tanpa harga dipisahkan", () => {
  expect(rankPriorities({ catalog: cat, readiness, prices: prices.slice(0, 2), paguRp: 7e6 }).tanpaHarga)
    .toContain("selang_keluar");
});
it("item yang tidak bisa dibeli dilewati", () => {
  const r = rankPriorities({ catalog: catDenganAnggota, readiness: readinessAnggota, prices, paguRp: 7e6 });
  expect(r.terpilih.some(x => x.itemKode === "anggota")).toBe(false);
  expect(r.tanpaHarga).not.toContain("anggota");
});
it("setiap baris punya alasan", () => {
  rankPriorities({ catalog: cat, readiness, prices, paguRp: 7e6 }).terpilih
    .forEach(x => expect(x.alasan.length).toBeGreaterThan(10));
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 6. Tandai `// ponytail: greedy per unit, bukan knapsack optimal. Dipilih agar bisa dijelaskan di musyawarah.`
- [ ] **Step 4:** `npm test`. Expected: lulus.
- [ ] **Step 5: Commit** `feat: add budget constrained priority engine`.

---

## Task 13: Label Kestabilan (P1)

**Files:**
- Create: `src/lib/engine/stability.ts`
- Test: `src/lib/engine/stability.test.ts`

**Interfaces:**
- Consumes: `rankPriorities`.
- Produces: `addStability(input, result): PriorityResult`.

- [ ] **Step 1: Tulis tes**

```ts
it("item dominan stabil", () => {
  const r = addStability(inputSatuItemMurah, rankPriorities(inputSatuItemMurah));
  expect(r.terpilih[0].kestabilan).toBe("stabil");
});
it("item di tepi pagu peka", () => {
  const r = addStability(inputTepiPagu, rankPriorities(inputTepiPagu));
  expect(r.terpilih.at(-1)!.kestabilan).toBe("peka");
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi kisi 3 × 3 pada TRD bagian 6. Ambang 80%.
- [ ] **Step 4:** `npm test`. Expected: lulus.
- [ ] **Step 5: Commit** `feat: label priority stability across assumptions`.

---

## Task 14: Autentikasi dan otorisasi

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/masuk/route.ts`, `src/app/api/auth/keluar/route.ts`, `src/app/api/auth/saya/route.ts`, `src/app/masuk/page.tsx`
- Test: `src/lib/auth.test.ts`

**Interfaces:**
- Produces:
  - `hashPassword(p: string): string`, `verifyPassword(p: string, h: string): boolean`
  - `createSession(akunId: number): Promise<string>`, `getAkun(req: Request): Promise<Akun | null>`
  - `requireDesaAccess(req: Request, kode: string, peran: Peran[]): Promise<Akun>`, melempar `HttpError` 401 atau 403
  - `assertOrigin(req: Request): void`
  - `hitRateLimit(kunci: string, batas: number, menit: number): Promise<boolean>`

- [ ] **Step 1: Tulis tes**

```ts
it("hash bisa diverifikasi", () => { expect(verifyPassword("x", hashPassword("x"))).toBe(true); });
it("password salah ditolak", () => { expect(verifyPassword("y", hashPassword("x"))).toBe(false); });
it("akun desa lain mendapat 403", async () => {
  await expect(requireDesaAccess(reqAkunDesaA, "DESA_B", ["desa"])).rejects.toMatchObject({ status: 403 });
});
it("peran mpa tidak bisa aksi desa", async () => {
  await expect(requireDesaAccess(reqAkunMpaA, "DESA_A", ["desa"])).rejects.toMatchObject({ status: 403 });
});
it("tanpa sesi mendapat 401", async () => {
  await expect(requireDesaAccess(reqAnon, "DESA_A", ["desa"])).rejects.toMatchObject({ status: 401 });
});
it("sesi kedaluwarsa ditolak", async () => {
  expect(await getAkun(reqSesiLama)).toBeNull();
});
it("percobaan ke-11 diblokir", async () => {
  for (let i = 0; i < 10; i++) await hitRateLimit("k", 10, 15);
  expect(await hitRateLimit("k", 10, 15)).toBe(false);
});
it("origin asing ditolak", () => {
  expect(() => assertOrigin(reqOriginAsing)).toThrow();
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 9.
- [ ] **Step 4:** `npm test`. Expected: lulus.
- [ ] **Step 5: Commit** `feat: add session auth and per village authorization`.

---

## Task 15: Catat Alat

**Files:**
- Create: `src/app/api/desa/[kode]/inventaris/route.ts`, `src/app/desa/[kode]/inventaris/page.tsx`, `src/components/Stepper.tsx`, `src/lib/inventaris.ts`, `src/lib/audit.ts`
- Test: `src/lib/inventaris.test.ts`

**Interfaces:**
- Consumes: `requireDesaAccess`, `assertOrigin`.
- Produces:
  - `inventarisSchema` (zod)
  - `saveInventaris(kode: string, akunId: number, rows: InventoryInput[]): Promise<void>`
  - `getInventaris(kode: string): Promise<InventoryRow[]>`
  - `writeAudit(akunId: number, desaKode: string, aksi: string, detail: unknown): Promise<void>`

- [ ] **Step 1: Tulis tes**

```ts
it("menolak berfungsi melebihi total", () => {
  const r = inventarisSchema.safeParse([{ itemKode: "ht", total: 1, berfungsi: 2 }]);
  expect(r.success).toBe(false);
  expect(r.error!.issues[0].message).toBe("Jumlah berfungsi tidak boleh melebihi jumlah total.");
});
it("menolak negatif", () => { expect(inventarisSchema.safeParse([{ itemKode: "ht", total: -1, berfungsi: 0 }]).success).toBe(false); });
it("menolak bukan angka", () => { expect(inventarisSchema.safeParse([{ itemKode: "ht", total: "a", berfungsi: 0 }]).success).toBe(false); });
it("menyimpan upsert dan audit", async () => {
  await saveInventaris("D", 1, [{ itemKode: "ht", total: 2, berfungsi: 1 }]);
  await saveInventaris("D", 1, [{ itemKode: "ht", total: 3, berfungsi: 2 }]);
  expect(await getInventaris("D")).toEqual([expect.objectContaining({ total: 3, berfungsi: 2 })]);
  expect(await countAudit("D")).toBe(2);
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi API dan formulir sesuai App Flow 3.6.
- [ ] **Step 4:** `npm test`. Lalu masuk sebagai `demo-mpa`, isi, simpan, muat ulang. Expected: nilai tetap.
- [ ] **Step 5: Commit** `feat: add equipment inventory form`.

---

## Task 16: Target dan harga efektif

**Files:**
- Create: `src/lib/efektif.ts`, `src/app/api/desa/[kode]/target/route.ts`, `src/app/api/desa/[kode]/harga/route.ts`
- Test: `src/lib/efektif.test.ts`

**Interfaces:**
- Produces:
  - `getTargetEfektif(kode: string): Promise<(TargetRow & { sumber: string })[]>`
  - `getHargaEfektif(kode: string): Promise<(PriceRow & { sumber: string })[]>`
  - `setTarget(kode, akunId, itemKode, target, alasan)`, `setHarga(kode, akunId, itemKode, aksi, hargaRp, sumber)`

- [ ] **Step 1: Tulis tes**

```ts
it("target standar mengikuti tier live", async () => {
  expect(rowOf(await getTargetEfektif("TINGGI"), "selang_keluar").target).toBe(11);
});
it("target desa menimpa dan menyebut alasan", async () => {
  await setTarget("TINGGI", 1, "selang_keluar", 8, "Jarak sumber air dekat");
  const r = rowOf(await getTargetEfektif("TINGGI"), "selang_keluar");
  expect(r.target).toBe(8);
  expect(r.sumber).toContain("Jarak sumber air dekat");
});
it("alasan pendek ditolak", async () => {
  await expect(setTarget("TINGGI", 1, "ht", 2, "x")).rejects.toThrow();
});
it("sumur dikeluarkan pada desa non-gambut", async () => {
  expect((await getTargetEfektif("NONGAMBUT")).some(r => r.itemKode === "sumur_bor")).toBe(false);
});
it("harga desa menimpa acuan", async () => {
  await setHarga("TINGGI", 1, "ht", "beli", 999, "Penawaran toko setempat");
  expect(rowOf(await getHargaEfektif("TINGGI"), "ht", "beli").hargaRp).toBe(999);
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi dengan kueri 05_BACKEND_SCHEMA bagian 5. Setiap penulisan memanggil `writeAudit`.
- [ ] **Step 4:** `npm test`. Expected: lulus.
- [ ] **Step 5: Commit** `feat: resolve effective targets and prices per village`.

---

## Task 17: Layar Kesiapan

**Files:**
- Create: `src/app/desa/[kode]/kesiapan/page.tsx`, `src/app/api/desa/[kode]/kesiapan/route.ts`, `src/components/ReadinessGauge.tsx`, `src/components/CoverageBar.tsx`, `src/components/StatusBadge.tsx`, `src/components/DemoBanner.tsx`, `src/components/BottomNav.tsx`, `src/lib/kesiapan.ts`
- Test: `src/lib/kesiapan.test.ts`

**Interfaces:**
- Consumes: `getTargetEfektif`, `getInventaris`, `computeReadiness`.
- Produces: `getKesiapan(kode: string): Promise<ReadinessResult>`.

- [ ] **Step 1: Tulis tes**

```ts
it("menggabungkan katalog, target, inventaris", async () => {
  await seedInventarisLengkap("D");
  const r = await getKesiapan("D");
  expect(r.lengkap).toBe(true);
  expect(r.items.length).toBeGreaterThan(0);
});
it("desa kosong belum lengkap dan tidak error", async () => {
  expect((await getKesiapan("KOSONG")).lengkap).toBe(false);
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.7 dan sketsa Design Brief bagian 8.
- [ ] **Step 4:** `npm test`. Lalu buka pada 360 px dengan akun demo. Expected: banner demo, gauge, kalimat rantai terlemah, daftar item.
- [ ] **Step 5: Commit** `feat: add village readiness screen`.

---

## Task 18: Layar Prioritas dan Keputusan

**Files:**
- Create: `src/app/desa/[kode]/prioritas/page.tsx`, `src/components/PriorityRow.tsx`, `src/app/api/desa/[kode]/prioritas/route.ts`, `src/app/api/desa/[kode]/rencana/route.ts`, `src/app/api/desa/[kode]/keputusan/route.ts`, `src/lib/prioritas.ts`
- Test: `src/lib/prioritas.test.ts`

**Interfaces:**
- Consumes: `getKesiapan`, `getHargaEfektif`, `rankPriorities`, dan `addStability` jika Task 13 selesai. Tanpa Task 13, kolom kestabilan disembunyikan.
- Produces:
  - `getPrioritas(kode: string): Promise<PriorityResult & { keputusan: Keputusan[] }>`
  - `setPagu(kode, akunId, paguRp)`
  - `setKeputusan(kode, akunId, itemKode, aksi, keputusan, catatan?)`
  - `barisDisetujui(kode: string): Promise<PriorityRow[]>`

- [ ] **Step 1: Tulis tes**

```ts
it("memakai pagu tersimpan", async () => {
  await setPagu("D", 1, 7e6);
  expect((await getPrioritas("D")).paguRp).toBe(7e6);
});
it("hanya baris setuju yang masuk", async () => {
  await setPagu("D", 1, 7e6);
  const [a, b] = (await getPrioritas("D")).terpilih;
  await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
  await setKeputusan("D", 1, b.itemKode, b.aksi, "tolak");
  expect((await barisDisetujui("D")).map(x => x.itemKode)).toEqual([a.itemKode]);
});
it("baris yang tidak lagi terpilih tidak ikut", async () => {
  await setPagu("D", 1, 7e6);
  const a = (await getPrioritas("D")).terpilih.at(-1)!;
  await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
  await setPagu("D", 1, 0);
  expect(await barisDisetujui("D")).toEqual([]);
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.8. Hitung ulang di server saat pagu tersimpan. Beri jeda 300 ms pada perubahan penggeser.
- [ ] **Step 4:** `npm test`. Lalu geser pagu. Expected: daftar dan skor sesudah berubah, keadaan pagu nol sesuai App Flow.
- [ ] **Step 5: Commit** `feat: add priority list with village decisions`.

---

## Task 19: Usulan dengan template

**Files:**
- Create: `src/lib/narasi.ts`, `src/lib/usulan.ts`, `src/app/api/desa/[kode]/usulan/route.ts`, `src/app/api/desa/[kode]/usulan/[id]/route.ts`, `src/app/desa/[kode]/usulan/page.tsx`, `src/app/desa/[kode]/usulan/[id]/page.tsx`
- Test: `src/lib/usulan.test.ts`

**Interfaces:**
- Consumes: `barisDisetujui`, `getKesiapan`, `getDesaCard`.
- Produces:
  - `buildFacts(kode: string): Promise<Record<string, string>>`
  - `terbitkanUsulan(kode: string, akunId: number, kanal: Kanal): Promise<number>`
  - `renderTemplate(facts, kanal): string`

- [ ] **Step 1: Tulis tes**

```ts
it("menyalin fakta dan tidak berubah", async () => {
  const id = await terbitkanUsulan("D", 1, "bpbd");
  const sebelum = await getUsulan("D", id);
  await setPagu("D", 1, 1);
  expect(await getUsulan("D", id)).toEqual(sebelum);
});
it("ditolak jika tidak ada baris disetujui", async () => {
  await expect(terbitkanUsulan("KOSONG", 1, "csr")).rejects.toThrow("Belum ada baris yang disetujui");
});
it("template memuat fakta wajib per kanal", () => {
  for (const k of KANAL) {
    const t = renderTemplate(FACTS, k);
    expect(t).toContain(FACTS.desa);
    expect(t).toContain(FACTS.total_usulan);
  }
});
it("template tidak menjanjikan hektare", () => {
  expect(renderTemplate(FACTS, "csr").toLowerCase()).not.toContain("hektare terselamatkan");
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.9 dan 3.10. Tambahkan `@media print` yang menyembunyikan navigasi. Render teks tanpa `dangerouslySetInnerHTML`.
- [ ] **Step 4:** `npm test`. Lalu terbitkan dan cetak pratinjau A4. Expected: rapi, tanpa navigasi.
- [ ] **Step 5: Commit** `feat: publish funding proposals from approved items`.

---

## Task 20: Narasi AI berpengaman (P1)

**Files:**
- Modify: `src/lib/narasi.ts`, `src/lib/usulan.ts`
- Test: `src/lib/narasi.test.ts`

**Interfaces:**
- Consumes: `renderTemplate`, `hitRateLimit`.
- Produces: `validateNarrative`, `renderNarrative`, `generateNarrative` pada TRD bagian 7.

- [ ] **Step 1: Tulis tes**

```ts
const allowed = ["desa", "skor", "total_usulan"];
it("menerima placeholder saja", () => {
  expect(validateNarrative("{{desa}} memiliki skor {{skor}} dan butuh {{total_usulan}}.", allowed).ok).toBe(true);
});
it("menolak digit", () => {
  expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} butuh 5 pompa.", allowed).ok).toBe(false);
});
it("menolak placeholder asing", () => {
  expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} {{palsu}}", allowed).ok).toBe(false);
});
it("menolak nama wilayah karangan", () => {
  expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} di Kecamatan Sukamaju.", allowed).ok).toBe(false);
});
it("menolak jika placeholder wajib hilang", () => {
  expect(validateNarrative("{{desa}} siap.", allowed).ok).toBe(false);
});
it("jatuh ke template tanpa kunci", async () => {
  delete process.env.ANTHROPIC_API_KEY;
  expect((await generateNarrative(FACTS, "bpbd")).sumber).toBe("template");
});
it("jatuh ke template saat AI melanggar", async () => {
  mockClaude("Butuh 7 pompa.");
  expect((await generateNarrative(FACTS, "bpbd")).sumber).toBe("template");
});
it("merender nilai fakta", () => {
  expect(renderNarrative("{{desa}}", { desa: "Contoh" })).toBe("Contoh");
});
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi. Periksa contoh pemakaian SDK terbaru di dokumentasi resmi. Kirim hanya nama placeholder, kanal, dan label kualitatif. Jangan kirim `catatan`. Timeout 15 detik. Batas 10 per akun per jam. Tampilkan badge sesuai App Flow 3.10.
- [ ] **Step 4:** `npm test`. Lalu terbitkan dengan kunci aktif, dan sekali lagi tanpa kunci. Expected: badge berbeda, angka sama.
- [ ] **Step 5: Commit** `feat: integrate guarded AI proposal narrative`.

---

## Task 21: Draf lokal dan hitung mundur (P1)

**Files:**
- Modify: `src/app/desa/[kode]/inventaris/page.tsx`, `src/app/desa/[kode]/kesiapan/page.tsx`
- Create: `src/lib/musim.ts`
- Test: `src/lib/musim.test.ts`

**Interfaces:**
- Produces: `bulanPuncak(rows: {bulan: number; nDet: number}[]): number | null`, `hariMenuju(bulan: number, now: Date): number`.

- [ ] **Step 1: Tulis tes**

```ts
it("memilih bulan terbanyak", () => { expect(bulanPuncak([{bulan:2,nDet:5},{bulan:9,nDet:50}])).toBe(9); });
it("tanpa data menghasilkan null", () => { expect(bulanPuncak([])).toBeNull(); });
it("melompat ke tahun depan", () => { expect(hariMenuju(9, new Date("2026-11-10"))).toBe(295); });
```

- [ ] **Step 2:** `npm test`. Expected: gagal.
- [ ] **Step 3:** Implementasi. Bulan puncak dibaca dari `kecamatan_bulan`. Draf memakai `localStorage` dalam `try/catch`, dengan kunci per desa. Hapus draf setelah tersimpan di server.
- [ ] **Step 4:** Matikan jaringan di DevTools, isi, simpan, nyalakan, kirim. Expected: data sampai, draf terhapus.
- [ ] **Step 5: Commit** `feat: add offline draft and season countdown`.

---

## Task 22: Keamanan, QA, dan deploy

**Files:**
- Create: `scripts/push-remote.ts`, `docs/QA.md`

- [ ] **Step 1:** Jalankan `npm test`, `pytest pipeline/tests`, `npm run build`. Expected: semua lulus.
- [ ] **Step 2:** Cari kredensial di riwayat: `git log -p | grep -iE "api[_-]?key|token|password"`. Expected: hanya nama variabel.
- [ ] **Step 3:** Uji `curl` tanpa sesi ke tiap endpoint berakun. Expected: 401. Dengan sesi desa lain. Expected: 403.
- [ ] **Step 4:** Jalankan daftar periksa Design Brief bagian 12. Catat di `docs/QA.md`.
- [ ] **Step 5:** Minta satu orang di luar tim menyelesaikan alur tanpa dibantu. Catat waktu. Target PRD: 10 menit atau kurang.
- [ ] **Step 6:** Unggah DB ke Turso. Coba alat impor resmi Turso. `push-remote.ts` hanya dipakai jika impor tidak tersedia. Atur env di Vercel. Deploy.
- [ ] **Step 7:** Uji URL deployment di mode penyamaran. Expected: alur demo berhasil.
- [ ] **Step 8:** Uji localhost: `npm ci && npm run build && npm start` dari klon bersih, jaringan dimatikan, kunci API kosong. Expected: semua P0 berjalan, kecuali latar peta.
- [ ] **Step 9: Commit** `chore: add remote seed and qa checklist`.

---

## Task 23: README, video, dan submission

**Files:**
- Create: `README.md`

- [ ] **Step 1:** Tulis `README.md` dengan semua isi wajib: nama tim dan anggota; kategori Web; nama aplikasi; deskripsi; masalah; target pengguna; fitur yang berhasil dibuat; teknologi; diagram arsitektur dan alur data; instalasi dan konfigurasi; `.env.example`; akun demo; dokumentasi AI (model `claude-opus-5-5` atau yang dipakai, bagian produk, batasnya); atribusi FIRMS, HDX, WRI, ONI, DLHK Banten, harga, MapLibre, font, dan AI coding assistant yang dipakai.
- [ ] **Step 2: Commit** `docs: add project readme`.
- [ ] **Step 3: Code freeze internal.** Catat commit hash final. Sesudah ini tidak ada perubahan kode.
- [ ] **Step 4:** Rekam video sesuai App Flow bagian 5 dari commit final, satu rekaman utuh, 3:00-5:00. Tidak ada slide atau mockup. Unggah ke YouTube sebagai Unlisted. Uji di mode penyamaran.
- [ ] **Step 5:** Isi Surat Pernyataan Orisinalitas format resmi panitia. Ketua tim menandatangani dengan meterai Rp10.000 atau e-meterai. Simpan sebagai PDF.
- [ ] **Step 6:** Periksa ulang: repo publik, URL aplikasi, video, surat PDF, commit hash, kuota API aktif sampai penilaian selesai.
- [ ] **Step 7:** Kirim lewat portal resmi sebelum **14 November, 20.00 WIB**. Submission hanya sekali.
- [ ] **Step 8:** Jangan ubah repo, deployment, atau video sampai penilaian selesai.

---

## Persiapan final (setelah pengumuman 21 November)

- [ ] Hadiri Technical Meeting 22 November.
- [ ] Latihan 7 menit sesuai App Flow bagian 6, minimal tiga kali.
- [ ] Siapkan jawaban: "Dokumen tidak memadamkan api", "Bedanya dengan SiPongi", "Bukti pengguna", "Mengapa bukan prediksi", "Dari mana harga".
- [ ] Bawa laptop dengan localhost teruji dan video cadangan.
