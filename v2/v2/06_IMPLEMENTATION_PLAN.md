# SiapKemarau v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun MVP web SiapKemarau oleh dua orang, dari data satelit nyata sampai dokumen usulan desa di bawah pagu, dan mengirimkannya sebelum 14 November 2026 pukul 20.00 WIB.

**Architecture:** Pipeline Python offline menghasilkan satu file SQLite. Next.js membaca file itu lewat libSQL di localhost dan Turso di deployment. Mesin kesiapan dan prioritas adalah fungsi TypeScript murni.

**Tech Stack:** Python 3.11+, geopandas, pyogrio, pandas, pytest, Next.js App Router, TypeScript, Tailwind, `@libsql/client`, zod, `@anthropic-ai/sdk`, Vitest.

**Spec:** [00_JOBDESK.md](00_JOBDESK.md), [01_PRD.md](01_PRD.md), [02_TRD.md](02_TRD.md), [03_APP_FLOW.md](03_APP_FLOW.md), [04_DESIGN_BRIEF.md](04_DESIGN_BRIEF.md), [05_BACKEND_SCHEMA.md](05_BACKEND_SCHEMA.md).

## Global Constraints

- Repositori publik `LogicodixIRIS`, dibuat setelah Hacking Kick-off. Tidak boleh ada kode, repo, atau hasil proyek lain.
- Commit hanya dari akun GitHub anggota terdaftar, berkala, dan mencerminkan perubahan nyata. Dilarang bulk upload di akhir.
- Dilarang force push, rebase, squash, menghapus commit, atau memanipulasi tanggal commit setelah di-push.
- Pesan commit berawalan `feat`, `fix`, `docs`, `style`, `refactor`, atau `chore`. Pesan `update`, `test`, `final` tidak sah.
- Kredensial hanya di `.env`. `.env` masuk `.gitignore`. Sediakan `.env.example` tanpa nilai.
- Atribusi semua kode, template, aset, dataset, dan layanan pihak ketiga di `README.md`. Penggunaan AI dan modelnya wajib disebut.
- Selalu tulis "deteksi satelit". Dilarang menampilkan "hektare terselamatkan" dan "tervalidasi pengguna".
- Harga tanpa sumber dilarang masuk data.
- Tidak ada data simulasi sebagai hasil. Isian demo wajib berlabel data uji.
- Semua P0 berjalan tanpa internet dan tanpa `ANTHROPIC_API_KEY`.
- GADM dilarang. Domain `sipongi.menlhk.go.id` tidak dipakai.
- `data/siapkemarau.db` di bawah 50 MB.
- Tanpa wawancara. Sumber hanya data publik dan sekunder.

## Review Focus

Setiap baris memiliki tes pada task pemiliknya.

1. Pencarian dengan `%` atau `_` tidak boleh mengembalikan semua desa. (Task 9)
2. Desa yang tidak pernah terdeteksi tidak boleh berlabel "tampak aman". (Task 6, Task 17)
3. Berfungsi melebihi total, nilai negatif, atau bukan angka harus ditolak dengan pesan jelas. (Task 13)
4. Pagu 0, pagu di bawah harga termurah, dan item tanpa harga tidak boleh merusak daftar. (Task 11)
5. Akun desa A tidak boleh membaca atau mengubah data desa B lewat API langsung. (Task 12)

## Pembagian dan Urutan

| Tanggal | Orang 1: DATA dan BUKTI | Orang 2: APP dan UI |
|---|---|---|
| Sel 10 Nov | Task 0, 2, 3 | Task 1, 10, 11 |
| Rab 11 Nov | Task 4, 5, 6, 7 | Task 9, 12, 13 |
| Kam 12 Nov | Task 8, 17 | Task 14, 15, 16 |
| Jum 13 Nov | Task 18, 19, 20 | Task 16 lanjutan, 21, Task 22 langkah deploy |
| Sab 14 Nov | Task 22, 23 | Task 22, 23 |

**Aturan potong.** Pukul 20.00 tanggal 13 November, berhenti menambah fitur. Potong: Task 21, Task 20, FR-03, `MiniShape`.

---

## Task 0: Akses data dan klarifikasi — Orang 1

Tidak ada kode.

- [ ] **Step 1:** Buat akun NASA Earthdata dan minta `FIRMS_MAP_KEY`. Simpan di `.env`.
- [ ] **Step 2:** Panggil `/api/data_availability/csv/{KEY}/VIIRS_SNPP_SP` dan `VIIRS_SNPP_NRT`. Catat tanggal awal dan akhir. Expected: rentang keduanya diketahui.
- [ ] **Step 3:** Jika ada celah SP ke NRT sebelum 2 Nov 2026, kirim permintaan arsip FIRMS untuk VIIRS S-NPP, kotak `108,-4.5,116.5,2.5`, 20 Jan 2012 sampai 2 Nov 2026, CSV.
- [ ] **Step 4:** Unduh HDX COD-AB Indonesia dan WRI Global Peatlands ke `data/raw/`.
- [ ] **Step 5:** Kirim pertanyaan tertulis ke Helpdesk: apakah pemutaran data historis nyata dan isian uji berlabel termasuk "simulasi", dan subtema yang tepat.
- [ ] **Step 6:** Baca teks resmi Permendagri 20/2018 tentang batas penetapan APBDes dan perubahan APBDes. Tulis hasilnya pada `dq_issue`. Jika gagal, produk tidak menyebut pasal.

---

## Task 1: Repositori dan kerangka aplikasi — Orang 2

**Files:** Create `package.json`, `.gitignore`, `.env.example`, `vitest.config.ts`, `src/lib/smoke.test.ts`, `docs/v2/*`

**Interfaces:** Produces perintah `npm test`, `npm run build`, alias impor `@/`.

- [ ] **Step 1:** Di klon kosong `LogicodixIRIS`, jalankan:

```bash
npx create-next-app@latest . --ts --tailwind --app --src-dir --eslint --import-alias "@/*"
npm i @libsql/client zod @anthropic-ai/sdk
npm i -D vitest tsx
```

- [ ] **Step 2:** Tambahkan `.env`, `data/raw/`, `.pytest_cache/`, `__pycache__/` ke `.gitignore`. Buat `.env.example` dari TRD bagian 10.
- [ ] **Step 3:** Tulis `expect(1 + 1).toBe(2)` di `src/lib/smoke.test.ts`. Tambah skrip `"test": "vitest run"`.
- [ ] **Step 4:** Run `npm test && npm run build`. Expected: lulus.
- [ ] **Step 5:** Salin hanya `docs/v2/` ke repo.
- [ ] **Step 6:** Commit `chore: initialize next app with test tooling` lalu push.

---

## Task 2: Skema, parameter, dan data manual — Orang 1

**Files:** Create `db/schema.sql`, `pipeline/params.py`, `data/manual/{katalog_item,paket_minimum,referensi_pergub,harga_item,sumber_data,dq_issue}.csv`, `pipeline/requirements.txt`. Test `pipeline/tests/test_schema.py`.

**Interfaces:** Produces DDL pada Backend Schema bagian 3 dan `PARAMS: dict[str, tuple[str, str]]` berisi nilai dan label dari TRD bagian 5.

- [ ] **Step 1: Tulis tes**

```python
def test_rejects_berfungsi_above_total(conn):
    with pytest.raises(sqlite3.IntegrityError):
        insert_inventaris(conn, total=2, berfungsi=3)

def test_price_requires_source(conn):
    with pytest.raises(sqlite3.IntegrityError):
        insert_harga(conn, sumber="")

def test_manual_price_rows_have_source():
    assert read_csv("harga_item.csv")["sumber"].str.len().min() > 0

def test_package_values():
    assert dict(read_csv("paket_minimum.csv")[["item_kode", "target"]].values) == {
        "dana_operasi": 1, "pompa_jinjing": 1, "selang_keluar": 10, "sumur_bor": 5}
```

- [ ] **Step 2:** Run `pytest pipeline/tests/test_schema.py -v`. Expected: FAIL, berkas belum ada.
- [ ] **Step 3:** Salin DDL. Isi CSV persis dari Backend Schema bagian 6 dan PRD bagian 7-8. Tulis `params.py`.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add schema, gate thresholds and sourced reference data`. Commit ini wajib ada sebelum data 2026 dianalisis.

---

## Task 3: Pengambilan FIRMS — Orang 1

**Files:** Create `pipeline/fetch_firms.py`. Test `pipeline/tests/test_fetch_firms.py`.

**Interfaces:**
- `date_windows(start: date, end: date, step: int = 5) -> list[tuple[date, int]]`
- `parse_availability(text: str, source: str) -> tuple[date, date]`
- `fetch_window(key: str, source: str, start: date, days: int, out_dir: Path, opener=urlopen) -> Path`, berkas `{source}_{start}.csv`

- [ ] **Step 1: Tulis tes**

```python
def test_windows_cover_range():
    assert date_windows(date(2012,1,20), date(2012,1,31)) == [
        (date(2012,1,20),5), (date(2012,1,25),5), (date(2012,1,30),2)]

def test_parse_availability():
    t = "data_id,min_date,max_date\nVIIRS_SNPP_SP,2012-01-20,2026-06-30\n"
    assert parse_availability(t, "VIIRS_SNPP_SP") == (date(2012,1,20), date(2026,6,30))

def test_error_body_raises(tmp_path):
    with pytest.raises(ValueError, match="respons FIRMS"):
        fetch_window("k", "VIIRS_SNPP_SP", date(2012,1,20), 5, tmp_path, opener=fake(b"Invalid MAP_KEY"))

def test_existing_file_is_skipped(tmp_path):
    (tmp_path / "VIIRS_SNPP_SP_2012-01-20.csv").write_text("latitude\n")
    fetch_window("k", "VIIRS_SNPP_SP", date(2012,1,20), 5, tmp_path, opener=must_not_call)
```

- [ ] **Step 2:** Run `pytest pipeline/tests/test_fetch_firms.py -v`. Expected: FAIL.
- [ ] **Step 3:** Implementasi dengan URL TRD bagian 4. Respons valid diawali `latitude`. Tulis ke `.tmp` lalu rename. `main` mengambil SP lalu NRT sampai 2 Nov 2026, dengan jeda 0,2 detik.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Run `python pipeline/fetch_firms.py`. Expected: sekitar 1.080 berkas di `data/raw/firms/`. Catat celah tanggal.
- [ ] **Step 6:** Commit `feat: fetch viirs archive through firms area api`.

---

## Task 4: Wilayah dan gambut — Orang 1

**Files:** Create `pipeline/wilayah.py`. Test `pipeline/tests/test_wilayah.py`.

**Interfaces:**
- `clean_name(name: str) -> str`
- `load_desa(path: str, prov_codes: list[str]) -> GeoDataFrame` berkolom `kode, nama, kec_kode, kec_nama, kab_kode, kab_nama, prov_kode, prov_nama, luas_ha, geometry`, dengan `prov_kode` dua digit seperti `61`
- `peat_fraction(desa, peat) -> pd.Series`
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

- [ ] **Step 2:** Run tes. Expected: FAIL.
- [ ] **Step 3:** Implementasi. Luas memakai EPSG:6933. Kolom HDX diperiksa pada file nyata.
- [ ] **Step 4:** Run tes, lalu jalankan pada Kalbar `61` dan Kalteng `62`. Expected: PASS dan jumlah desa tercetak.
- [ ] **Step 5:** Commit `feat: build village table with peat fraction and area`.

---

## Task 5: Deteksi per desa-tahun — Orang 1

**Files:** Create `pipeline/firms.py`. Test `pipeline/tests/test_firms.py`.

**Interfaces:**
- `load_detections(paths: list[str]) -> pd.DataFrame` berkolom `lat, lon, tanggal, tahun, satellite, sumber`
- `assign_to_desa(det, desa, buffer_km: float) -> pd.DataFrame` berkolom `kode, tanggal, tahun`
- `desa_year(assigned, kode_list, years, min_det_days: int) -> pd.DataFrame` berkolom `kode, tahun, n_det, det_days, terpapar`
- `sensor_summary(det) -> pd.DataFrame` berkolom `tahun, satellite, sumber, n_det`

- [ ] **Step 1: Tulis tes**

```python
def test_low_confidence_dropped(csv_with_l_n_h):
    assert len(load_detections([csv_with_l_n_h])) == 2

def test_word_confidence_is_normalised(csv_with_nominal_high_low):
    assert len(load_detections([csv_with_nominal_high_low])) == 2

def test_source_comes_from_filename(sp_csv):
    assert load_detections([sp_csv]).sumber.unique().tolist() == ["SP"]

def test_buffer_includes_point_1_5km_outside():
    assert len(assign_to_desa(point_1_5km_out, desa, buffer_km=2)) == 1
    assert len(assign_to_desa(point_1_5km_out, desa, buffer_km=1)) == 0

def test_same_day_counts_once():
    r = desa_year(three_same_day, ["A"], [2019], 2).iloc[0]
    assert (r.n_det, r.det_days, r.terpapar) == (3, 1, 0)

def test_two_days_exposed():
    assert desa_year(two_days, ["A"], [2019], 2).iloc[0].terpapar == 1

def test_village_without_detection_gets_zero_rows():
    assert len(desa_year(empty_det, ["A"], [2018, 2019], 2)) == 2

def test_sensor_summary_keeps_sensor_and_source(mixed_det):
    assert set(sensor_summary(mixed_det).columns) == {"tahun", "satellite", "sumber", "n_det"}
```

- [ ] **Step 2:** Run tes. Expected: FAIL.
- [ ] **Step 3:** Implementasi. Normalkan confidence dengan huruf pertama kecil. Ambil `n` dan `h`. Terapkan `type == 0` bila kolomnya ada. Penyangga di EPSG:3857 dengan komentar `ponytail:` soal akurasi dekat khatulistiwa.
- [ ] **Step 4:** Run tes, lalu jalankan pada data nyata. Simpan `data/raw/desa_tahun.parquet`.
- [ ] **Step 5:** Commit `feat: aggregate satellite detections per village year`.

---

## Task 6: Paparan — Orang 1

**Files:** Create `pipeline/paparan.py`. Test `pipeline/tests/test_paparan.py`.

**Interfaces:**
- `tier(k_ext: int, n_ext: int) -> str`
- `exposure(dy, ext_years, last_year, quiet_window) -> pd.DataFrame` berkolom `kode, k_ext, n_ext, k_norm, n_norm, tahun_tenang, tampak_aman, tier`
- `shrink_desa(k, n, p_kec, s) -> float`
- `kecamatan_exposure(dy, desa, ext_years) -> pd.DataFrame` berkolom `kec_kode, n_desa, k, n, p_mean, rate_min, rate_max`

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

def test_future_rows_rejected():
    with pytest.raises(ValueError, match="kebocoran"):
        exposure(rows("A", exposed=[2026]), EXT, 2025, 3)

def test_tier_boundaries():
    assert [tier(1, 2), tier(1, 3), tier(0, 3)] == ["tinggi", "sedang", "rendah"]

def test_shrink_desa():
    assert shrink_desa(2, 3, 0.4, 2) == pytest.approx(0.56)

def test_kecamatan_range():
    r = kecamatan_exposure(two_villages_a_2015_2019_b_2015, desa_same_kec, EXT).iloc[0]
    assert (r.k, r.n, r.p_mean, r.rate_min, r.rate_max) == (3, 6, 0.5, 0, 1)
```

- [ ] **Step 2:** Run tes. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 5.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Commit `feat: compute village exposure and kecamatan range`.

---

## Task 7: Time Machine dan gerbang — Orang 1

**Files:** Create `pipeline/backtest.py`. Test `pipeline/tests/test_backtest.py`.

**Interfaces:**
- `top_k_capture(score, y, k_pct: float) -> float`
- `roc_auc(score, y) -> float`
- `pr_auc(score, y) -> float`
- `backtest_fold(dy, desa, tahun_uji, ext_years, quiet_window, s_desa, kec_min_share) -> pd.DataFrame` berkolom `tahun_uji, unit, strategi, metrik, nilai`
- `blind_spot_groups(frozen, y2026, luas) -> pd.DataFrame` berkolom `grup, strata, n_desa, n_terpapar_2026, rate`
- `gate(groups, min_lift, min_exposed, min_ratio_aktif) -> dict` berkunci `a, b, keputusan`

- [ ] **Step 1: Tulis tes**

```python
def test_top_k_capture():
    assert top_k_capture([.9,.8,.1,.1], [1,0,1,0], 50) == 0.5

def test_top_k_ties_do_not_use_label():
    assert top_k_capture([1,1,1,1], [0,0,1,1], 50) == 0.0

def test_roc_ties():
    assert roc_auc([.5,.5], [1,0]) == 0.5

def test_pr_auc_order():
    assert pr_auc([.9,.8,.1], [1,0,1]) == pytest.approx(5/6)

def test_pr_auc_all_tied_is_base_rate():
    assert pr_auc([.5,.5,.5,.5], [1,0,0,0]) == 0.25

def test_fold_ignores_future_features():
    a = backtest_fold(dy, desa, 2023, EXT, 3, 2, 0.5)
    b = backtest_fold(with_changed_2025_rows(dy), desa, 2023, EXT, 3, 2, 0.5)
    pd.testing.assert_frame_equal(a, b)

def test_fold_metrics_complete():
    r = backtest_fold(dy, desa, 2026, EXT, 3, 2, 0.5)
    assert set(r.metrik) == {"capture_10","capture_20","capture_30","roc_auc","pr_auc"}
    assert set(r.strategi) == {"paparan","persistensi","total_riwayat","gambut","acak"}

def test_gate_keep():
    assert gate(groups(aman=(100,40), tanpa=(1000,200), aktif=(100,50)), 1.5, 30, 0.6)["keputusan"] == "pertahankan"

def test_gate_soften_when_far_below_active():
    assert gate(groups(aman=(100,40), tanpa=(1000,200), aktif=(100,90)), 1.5, 30, 0.6)["keputusan"] == "lunakkan"

def test_gate_needs_enough_exposed():
    assert gate(groups(aman=(50,20), tanpa=(1000,100), aktif=(100,30)), 1.5, 30, 0.6)["keputusan"] == "buang"

def test_gate_needs_three_area_strata():
    assert gate(groups(aman=(100,40), tanpa=(1000,200), aktif=(100,50), strata_lulus=2), 1.5, 30, 0.6)["keputusan"] == "buang"

def test_gate_zero_baseline_does_not_divide():
    assert gate(groups(aman=(100,40), tanpa=(1000,0), aktif=(100,50)), 1.5, 30, 0.6)["a"] is True
```

`groups(...)` membuat baris `semua` dan `q1`-`q4`. `strata_lulus` menentukan jumlah kuartil yang memenuhi rasio.

- [ ] **Step 2:** Run tes. Expected: FAIL.
- [ ] **Step 3:** Implementasi. ROC dengan rank rata-rata pandas. PR-AUC dihitung per ambang skor unik: `Σ(R_n - R_{n-1}) * P_n`. Unit kecamatan memakai rata-rata skor desa, positif jika minimal `kec_min_share` desa terpapar. Fold hanya memakai `tahun < tahun_uji`.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add three fold evaluation and stratified gate`.

---

## Task 8: Ekspor dan gerbang nyata — Orang 1

**Files:** Create `pipeline/export.py`, `pipeline/run_all.py`, `pipeline/run_output.txt`, `data/siapkemarau.db`. Test `pipeline/tests/test_export.py`.

**Interfaces:** Produces `build_db(path, tables: dict[str, pd.DataFrame]) -> None`.

- [ ] **Step 1: Tulis tes**

```python
def test_build_db_leaves_app_tables_empty(tmp_path):
    build_db(tmp_path/"x.db", tiny_tables())
    c = sqlite3.connect(tmp_path/"x.db")
    assert c.execute("select count(*) from desa").fetchone()[0] == 1
    assert c.execute("select count(*) from akun").fetchone()[0] == 0

def test_build_db_rejects_price_without_source(tmp_path):
    with pytest.raises(ValueError, match="sumber"):
        build_db(tmp_path/"x.db", tiny_tables(harga_sumber=""))
```

- [ ] **Step 2:** Run tes. Expected: FAIL.
- [ ] **Step 3:** Implementasi. `run_all.py` menghitung `frozen`, `live`, tiga fold, gerbang, sensitivitas, dan angka kontrol pada Backend Schema bagian 7. Simpan keputusan pada `meta` kunci `gate_hasil`, label `hasil`.
- [ ] **Step 4:** Run tes, lalu `python pipeline/run_all.py`. Expected: DB di bawah 50 MB, angka kontrol tercetak.
- [ ] **Step 5:** Catat keputusan di `docs/v2/HASIL_GERBANG.md`: `pertahankan`, `lunakkan`, atau `buang`, sesuai TRD bagian 5. Periksa riwayat Kalibandung. Jika tidak cocok dengan kasus, pilih desa jangkar dari data.
- [ ] **Step 6:** Commit `feat: export exposure database and control numbers`. Beri tahu Orang 2.

---

## Task 9: Lapisan data aplikasi — Orang 2

**Files:** Create `src/lib/db.ts`, `src/lib/queries.ts`, `src/lib/http.ts`, `src/test/testDb.ts`, `scripts/seed-accounts.ts`. Test `src/lib/queries.test.ts`.

**Interfaces:**
- `db(): Client`
- `searchDesa(q: string): Promise<DesaHit[]>`
- `getDesaCard(kode: string): Promise<DesaCard | null>`
- `getBacktest(): Promise<Backtest>`
- `getDataPage(): Promise<DataPage>`
- `jsonError(status: number, kode: string, pesan: string): Response`

- [ ] **Step 1: Tulis tes**

```ts
it("mencari tanpa peka huruf", async () => { expect((await searchDesa("kalibandung"))[0].nama).toBe("Kalibandung"); });
it("wildcard dianggap literal", async () => { expect(await searchDesa("%")).toHaveLength(0); expect(await searchDesa("_")).toHaveLength(0); });
it("membatasi 20 hasil", async () => { expect((await searchDesa("desa")).length).toBeLessThanOrEqual(20); });
it("kode tak dikenal null", async () => { expect(await getDesaCard("ZZ")).toBeNull(); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi. `testDb.ts` memuat `db/schema.sql` dan 25 desa uji. `LIKE ? ESCAPE '\'` dan semua kueri berparameter.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Tulis `seed-accounts.ts`: `demo-mpa` dan `demo-sekdes` pada desa jangkar, `is_demo = 1`, idempoten.
- [ ] **Step 6:** Commit `feat: add data access layer and demo accounts`.

---

## Task 10: Mesin Kesiapan — Orang 2

**Files:** Create `src/lib/engine/types.ts`, `src/lib/engine/readiness.ts`. Test `src/lib/engine/readiness.test.ts`.

**Interfaces:** Produces tipe dan `computeReadiness` pada TRD bagian 6.

- [ ] **Step 1: Tulis tes.** Fixture: `pompa_jinjing` target 1 dan `selang_keluar` target 10, bobot 20, kritis.

```ts
it("menghitung skor", () => {
  const r = computeReadiness(cat, targets, [inv("pompa_jinjing",1,1), inv("selang_keluar",3,3)]);
  expect([r.skor, r.status, r.rantaiTerlemah]).toEqual([65, "sebagian", "selang_keluar"]);
});
it("rawan jika kritis di bawah 25%", () => {
  expect(computeReadiness(cat, targets, [inv("pompa_jinjing",1,0), inv("selang_keluar",10,10)]).status).toBe("rawan");
});
it("membatasi cakupan di 1", () => {
  const r = computeReadiness(cat, targets, [inv("pompa_jinjing",9,9), inv("selang_keluar",12,12)]);
  expect([r.skor, r.status]).toEqual([100, "siap"]);
});
it("item kosong belum lengkap", () => {
  const r = computeReadiness(cat, targets, [inv("pompa_jinjing",1,1)]);
  expect(r.lengkap).toBe(false);
  expect(r.items.find(i => i.itemKode === "selang_keluar")!.belumDiisi).toBe(true);
});
it("mengabaikan target nol", () => {
  expect(computeReadiness(cat, [t("pompa_jinjing",1), t("selang_keluar",0)], [inv("pompa_jinjing",1,1)]).skor).toBe(100);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 6.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add readiness engine`.

---

## Task 11: Mesin Prioritas — Orang 2

**Files:** Create `src/lib/engine/priority.ts`. Test `src/lib/engine/priority.test.ts`.

**Interfaces:** Consumes `computeReadiness`. Produces `rankPriorities` pada TRD bagian 6.

- [ ] **Step 1: Tulis tes.** Fixture: `dana_operasi` bobot 15 target 1 isi (0,0), `pompa_jinjing` bobot 20 target 1 isi (1,0), `selang_keluar` bobot 20 target 10 isi (3,3). Harga dari PRD bagian 8.

```ts
it("mendahulukan perbaikan lalu membeli sampai pagu", () => {
  const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 15e6 });
  expect(r.terpilih.map(x => [x.itemKode, x.aksi, x.qty, x.biayaRp])).toEqual([
    ["pompa_jinjing","perbaiki",1,510000],
    ["dana_operasi","beli",1,5000000],
    ["selang_keluar","beli",1,6669000],
  ]);
  expect([r.terpakaiRp, r.skorSesudah]).toEqual([12179000, 78.2]);
});
it("menggabungkan baris item yang sama", () => {
  const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 30e6 });
  expect(r.terpilih.find(x => x.itemKode === "selang_keluar")).toMatchObject({ qty: 3, biayaRp: 20007000 });
});
it("perbaikan dibatasi sisa kesenjangan", () => {
  const r = rankPriorities({ catalog: cat, readiness: readinessPompaRusak3, prices, paguRp: 15e6 });
  expect(r.terpilih.filter(x => x.itemKode === "pompa_jinjing")).toEqual([expect.objectContaining({ aksi: "perbaiki", qty: 1 })]);
});
it("pagu nol tidak memilih apa pun", () => {
  const r = rankPriorities({ catalog: cat, readiness, prices, paguRp: 0 });
  expect(r.terpilih).toEqual([]);
  expect(r.tidakTerdanai.length).toBeGreaterThan(0);
});
it("pagu di bawah harga termurah aman", () => {
  expect(rankPriorities({ catalog: cat, readiness, prices, paguRp: 1000 }).terpilih).toEqual([]);
});
it("item tanpa harga dipisahkan", () => {
  const r = rankPriorities({ catalog: cat, readiness, prices: prices.filter(p => p.itemKode !== "selang_keluar"), paguRp: 15e6 });
  expect(r.tanpaHarga).toContain("selang_keluar");
});
it("setiap baris punya alasan", () => {
  rankPriorities({ catalog: cat, readiness, prices, paguRp: 15e6 }).terpilih.forEach(x => expect(x.alasan.length).toBeGreaterThan(10));
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 6. Sertakan komentar `ponytail:` yang tertulis di TRD.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add budget constrained priority engine`.

---

## Task 12: Autentikasi dan otorisasi — Orang 2

**Files:** Create `src/lib/auth.ts`, `src/app/api/auth/{masuk,keluar,saya}/route.ts`, `src/app/masuk/page.tsx`. Test `src/lib/auth.test.ts`.

**Interfaces:**
- `hashPassword(p: string): string`, `verifyPassword(p: string, h: string): boolean`
- `createSession(akunId: number): Promise<string>`, `getAkun(req: Request): Promise<Akun | null>`
- `requireDesaAccess(req: Request, kode: string, peran: Peran[]): Promise<Akun>`, melempar `HttpError` 401 atau 403
- `assertOrigin(req: Request): void`
- `hitRateLimit(kunci: string, batas: number, menit: number): Promise<boolean>`

- [ ] **Step 1: Tulis tes**

```ts
it("hash bisa diverifikasi", () => { expect(verifyPassword("x", hashPassword("x"))).toBe(true); });
it("password salah ditolak", () => { expect(verifyPassword("y", hashPassword("x"))).toBe(false); });
it("akun desa lain 403", async () => { await expect(requireDesaAccess(reqDesaA, "DESA_B", ["desa"])).rejects.toMatchObject({ status: 403 }); });
it("peran mpa tidak bisa aksi desa", async () => { await expect(requireDesaAccess(reqMpaA, "DESA_A", ["desa"])).rejects.toMatchObject({ status: 403 }); });
it("tanpa sesi 401", async () => { await expect(requireDesaAccess(reqAnon, "DESA_A", ["desa"])).rejects.toMatchObject({ status: 401 }); });
it("sesi kedaluwarsa ditolak", async () => { expect(await getAkun(reqSesiLama)).toBeNull(); });
it("percobaan ke-11 diblokir", async () => {
  for (let i = 0; i < 10; i++) await hitRateLimit("k", 10, 15);
  expect(await hitRateLimit("k", 10, 15)).toBe(false);
});
it("origin asing ditolak", () => { expect(() => assertOrigin(reqOriginAsing)).toThrow(); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 9.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add session auth and per village authorization`.

---

## Task 13: Catat Alat — Orang 2

**Files:** Create `src/app/api/desa/[kode]/inventaris/route.ts`, `src/app/desa/[kode]/inventaris/page.tsx`, `src/components/Stepper.tsx`, `src/lib/inventaris.ts`, `src/lib/audit.ts`. Test `src/lib/inventaris.test.ts`.

**Interfaces:**
- `inventarisSchema` (zod)
- `saveInventaris(kode: string, akunId: number, rows: InventoryInput[]): Promise<void>`
- `getInventaris(kode: string): Promise<InventoryRow[]>`
- `writeAudit(akunId: number, desaKode: string, aksi: string, detail: unknown): Promise<void>`

- [ ] **Step 1: Tulis tes**

```ts
it("menolak berfungsi melebihi total", () => {
  const r = inventarisSchema.safeParse([{ itemKode: "pompa_jinjing", total: 1, berfungsi: 2 }]);
  expect(r.success).toBe(false);
  expect(r.error!.issues[0].message).toBe("Jumlah berfungsi tidak boleh melebihi jumlah total.");
});
it("menolak negatif", () => { expect(inventarisSchema.safeParse([{ itemKode: "pompa_jinjing", total: -1, berfungsi: 0 }]).success).toBe(false); });
it("menolak bukan angka", () => { expect(inventarisSchema.safeParse([{ itemKode: "pompa_jinjing", total: "a", berfungsi: 0 }]).success).toBe(false); });
it("dana operasi menyamakan total", async () => {
  await saveInventaris("D", 1, [{ itemKode: "dana_operasi", total: 0, berfungsi: 2 }]);
  expect(await getInventaris("D")).toEqual([expect.objectContaining({ total: 2, berfungsi: 2 })]);
});
it("upsert dan audit", async () => {
  await saveInventaris("D", 1, [{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1 }]);
  await saveInventaris("D", 1, [{ itemKode: "pompa_jinjing", total: 3, berfungsi: 2 }]);
  expect(await countAudit("D")).toBe(2);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.6. Normalisasi `punya_rusak = 0` terjadi sebelum validasi.
- [ ] **Step 4:** Run `npm test`, masuk `demo-mpa`, isi, simpan, muat ulang. Expected: nilai tetap.
- [ ] **Step 5:** Commit `feat: add equipment inventory form`.

---

## Task 14: Paket efektif dan layar Kesiapan — Orang 2

**Files:** Create `src/lib/efektif.ts`, `src/lib/kesiapan.ts`, `src/app/api/desa/[kode]/{paket,harga,kesiapan}/route.ts`, `src/app/desa/[kode]/kesiapan/page.tsx`, `src/components/{ReadinessGauge,CoverageBar,StatusBadge,DemoBanner,BottomNav,AssumptionNote}.tsx`. Test `src/lib/efektif.test.ts`.

**Interfaces:**
- `getTargetEfektif(kode: string): Promise<(TargetRow & { sumber: string })[]>`
- `getHargaEfektif(kode: string): Promise<(PriceRow & { sumber: string })[]>`
- `getReferensiPergub(kode: string): Promise<ReferensiPergub[]>`
- `setTarget(kode, akunId, itemKode, target, alasan)`, `setHarga(kode, akunId, itemKode, aksi, hargaRp, sumber)`
- `getKesiapan(kode: string): Promise<ReadinessResult>`

- [ ] **Step 1: Tulis tes**

```ts
it("target sama untuk tingkat paparan berbeda", async () => {
  expect(rowOf(await getTargetEfektif("TINGGI"), "selang_keluar").target).toBe(10);
  expect(rowOf(await getTargetEfektif("RENDAH"), "selang_keluar").target).toBe(10);
});
it("target desa menimpa dan menyebut alasan", async () => {
  await setTarget("TINGGI", 1, "selang_keluar", 8, "Sumber air dekat");
  expect(rowOf(await getTargetEfektif("TINGGI"), "selang_keluar").sumber).toContain("Sumber air dekat");
});
it("alasan pendek ditolak", async () => { await expect(setTarget("TINGGI", 1, "pompa_jinjing", 2, "x")).rejects.toThrow(); });
it("sumur keluar pada desa non-gambut", async () => { expect((await getTargetEfektif("NONGAMBUT")).some(r => r.itemKode === "sumur_bor")).toBe(false); });
it("harga desa menimpa acuan", async () => {
  await setHarga("TINGGI", 1, "pompa_jinjing", "beli", 999, "Penawaran toko");
  expect(rowOf(await getHargaEfektif("TINGGI"), "pompa_jinjing", "beli").hargaRp).toBe(999);
});
it("referensi Pergub hanya Kalteng", async () => {
  expect((await getReferensiPergub("DESA_KALTENG")).length).toBeGreaterThan(0);
  expect(await getReferensiPergub("DESA_KALBAR")).toEqual([]);
});
it("desa kosong tidak error", async () => { expect((await getKesiapan("KOSONG")).lengkap).toBe(false); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi dengan kueri Backend Schema bagian 5, App Flow 3.7, dan Design Brief bagian 7-8. Setiap tulis memanggil `writeAudit`.
- [ ] **Step 4:** Run `npm test`, buka layar pada 360 px. Expected: banner, gauge, rantai terlemah, keterangan provinsi.
- [ ] **Step 5:** Commit `feat: add minimum package and readiness screen`.

---

## Task 15: Prioritas dan Keputusan — Orang 2

**Files:** Create `src/lib/prioritas.ts`, `src/app/api/desa/[kode]/{prioritas,rencana,keputusan}/route.ts`, `src/app/desa/[kode]/prioritas/page.tsx`, `src/components/{PaguControl,PriorityRow}.tsx`. Test `src/lib/prioritas.test.ts`.

**Interfaces:**
- `getPrioritas(kode: string): Promise<PriorityResult & { keputusan: Keputusan[] }>`
- `setPagu(kode, akunId, paguRp)`
- `setKeputusan(kode, akunId, itemKode, aksi, keputusan, catatan?)`
- `barisDisetujui(kode: string): Promise<PriorityRow[]>`

- [ ] **Step 1: Tulis tes**

```ts
it("default pagu Rp15 juta", async () => { expect((await getPrioritas("BARU")).paguRp).toBe(15e6); });
it("memakai pagu tersimpan", async () => { await setPagu("D", 1, 7e6); expect((await getPrioritas("D")).paguRp).toBe(7e6); });
it("hanya baris setuju yang masuk", async () => {
  await setPagu("D", 1, 15e6);
  const [a, b] = (await getPrioritas("D")).terpilih;
  await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
  await setKeputusan("D", 1, b.itemKode, b.aksi, "tolak");
  expect((await barisDisetujui("D")).map(x => x.itemKode)).toEqual([a.itemKode]);
});
it("baris tidak terpilih lagi tidak ikut", async () => {
  await setPagu("D", 1, 15e6);
  const a = (await getPrioritas("D")).terpilih.at(-1)!;
  await setKeputusan("D", 1, a.itemKode, a.aksi, "setuju");
  await setPagu("D", 1, 0);
  expect(await barisDisetujui("D")).toEqual([]);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.8. Hitung ulang di server. Jeda 300 ms pada penggeser. Tampilkan `addStability` hanya jika Task 20 selesai.
- [ ] **Step 4:** Run `npm test`, geser pagu Rp15 juta ke Rp30 juta. Expected: daftar dan skor sesudah berubah.
- [ ] **Step 5:** Commit `feat: add budget priority list with village decisions`.

---

## Task 16: Usulan dan cetak — Orang 2

**Files:** Create `src/lib/usulan.ts`, `src/lib/narasi.ts`, `src/app/api/desa/[kode]/usulan/route.ts`, `src/app/api/desa/[kode]/usulan/[id]/route.ts`, `src/app/desa/[kode]/usulan/page.tsx`, `src/app/desa/[kode]/usulan/[id]/page.tsx`. Test `src/lib/usulan.test.ts`.

**Interfaces:**
- `buildFacts(kode: string): Promise<Record<string, string>>`
- `terbitkanUsulan(kode: string, akunId: number, kanal: Kanal): Promise<number>`
- `getUsulan(kode: string, id: number): Promise<Usulan>`
- `renderTemplate(facts, kanal): string`

- [ ] **Step 1: Tulis tes**

```ts
it("fakta beku", async () => {
  const id = await terbitkanUsulan("D", 1, "bpbd");
  const sebelum = await getUsulan("D", id);
  await setPagu("D", 1, 1);
  expect(await getUsulan("D", id)).toEqual(sebelum);
});
it("ditolak tanpa baris setuju", async () => { await expect(terbitkanUsulan("KOSONG", 1, "csr")).rejects.toThrow("Belum ada baris yang disetujui"); });
it("template memuat fakta dan asumsi", () => {
  for (const k of KANAL) {
    const t = renderTemplate(FACTS, k);
    expect(t).toContain(FACTS.desa);
    expect(t).toContain(FACTS.total_usulan);
    expect(t).toContain("asumsi tim");
  }
});
it("template APBDes memakai rumusan netral", () => {
  const t = renderTemplate(FACTS, "apbdes_perubahan");
  expect(t).toContain("berlaku pada Tahun Anggaran 2027");
  expect(t).not.toContain("berdasarkan Permendesa");
});
it("template tidak menjanjikan hektare", () => { expect(renderTemplate(FACTS, "csr").toLowerCase()).not.toContain("hektare terselamatkan"); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.9-3.10. Tambahkan `@media print`. Render teks tanpa `dangerouslySetInnerHTML`.
- [ ] **Step 4:** Run `npm test`, terbitkan, dan cetak pratinjau A4. Expected: rapi, tanpa navigasi.
- [ ] **Step 5:** Commit `feat: publish funding proposals from approved items`.

---

## Task 17: Beranda dan Kartu Paparan — Orang 1

**Files:** Create `src/app/page.tsx`, `src/app/desa/[kode]/page.tsx`, `src/app/api/desa/route.ts`, `src/app/api/desa/[kode]/route.ts`, `src/components/{YearStrip,SearchBox,MiniShape}.tsx`, `src/lib/kalimat.ts`. Test `src/lib/kalimat.test.ts`.

**Interfaces:** Consumes `searchDesa`, `getDesaCard`. Produces `headlinePaparan(p: {kExt: number; nExt: number; tahunTenang: number}): string` dan `labelTampakAman(p: {tampakAman: boolean; keputusan: string}): boolean`.

- [ ] **Step 1: Tulis tes**

```ts
it("desa tenang dengan riwayat", () => {
  expect(headlinePaparan({ kExt: 2, nExt: 4, tahunTenang: 6 })).toBe("Terdeteksi satelit pada 2 dari 4 tahun kering ekstrem. 6 tahun terakhir tenang.");
});
it("tidak pernah terdeteksi bukan jaminan", () => {
  expect(headlinePaparan({ kExt: 0, nExt: 4, tahunTenang: 15 })).toContain("bukan jaminan aman");
});
it("label hilang jika gerbang buang", () => {
  expect(labelTampakAman({ tampakAman: true, keputusan: "buang" })).toBe(false);
  expect(labelTampakAman({ tampakAman: true, keputusan: "lunakkan" })).toBe(true);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai App Flow 3.1-3.2 dan Design Brief. FR-03 dan `MiniShape` dikerjakan terakhir.
- [ ] **Step 4:** Run `npm test`, buka desa jangkar pada 360 px. Expected: kalimat dan strip tampil, tanpa gulir horizontal.
- [ ] **Step 5:** Commit `feat: add village search and exposure card`.

---

## Task 18: Time Machine dan Data — Orang 1

**Files:** Create `src/app/time-machine/page.tsx`, `src/app/data/page.tsx`, `src/app/api/backtest/route.ts`, `src/app/api/data/route.ts`, `src/components/{TimeMachine,MetricTable}.tsx`, `src/lib/backtest.ts`. Test `src/lib/backtest.test.ts`.

**Interfaces:** Consumes `getBacktest`, `getDataPage`. Produces `kesimpulanBacktest(rows: MetricRow[], tahunUji: number): string`.

- [ ] **Step 1:** Sebelum mengutip, koreksi registry lokal `papers/papers/literature_review.md`: penulis `Metode_01` Molina & Rao, klaim `Paparan_08`, klaim `Desa_01`, kalimat skill `Paparan_04`, status review `Paparan_07`, jumlah halaman `Regulasi_04`, dan catatan 58,03% pada `Regulasi_02`.
- [ ] **Step 2: Tulis tes**

```ts
it("mengakui saat kalah dari baseline terbaik", () => {
  expect(kesimpulanBacktest(rows({ paparan: 0.4, persistensi: 0.5, total_riwayat: 0.45 }), 2026)).toContain("kalah dari persistensi");
});
it("menyatakan selisih saat menang", () => {
  expect(kesimpulanBacktest(rows({ paparan: 0.6, persistensi: 0.5, total_riwayat: 0.45 }), 2026)).toContain("10 poin");
});
```

- [ ] **Step 3:** Run `npm test`. Expected: FAIL.
- [ ] **Step 4:** Implementasi sesuai App Flow 3.3-3.4. Daftar memuat 20 desa teratas `frozen`. Halaman Data memuat seluruh bagian pada App Flow 3.4.
- [ ] **Step 5:** Run `npm test`, buka kedua halaman. Expected: angka sama dengan `run_output.txt`.
- [ ] **Step 6:** Commit `feat: add time machine and data transparency pages`.

---

## Task 19: Narasi AI berpengaman — Orang 1

**Files:** Modify `src/lib/narasi.ts`, `src/lib/usulan.ts`. Test `src/lib/narasi.test.ts`.

**Interfaces:** Consumes `renderTemplate`, `hitRateLimit`. Produces `validateNarrative`, `renderNarrative`, `generateNarrative` pada TRD bagian 7.

- [ ] **Step 1: Tulis tes**

```ts
const allowed = ["desa", "skor", "total_usulan"];
it("menerima placeholder saja", () => { expect(validateNarrative("{{desa}} memiliki skor {{skor}} dan butuh {{total_usulan}}.", allowed).ok).toBe(true); });
it("menolak digit", () => { expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} butuh 5 pompa.", allowed).ok).toBe(false); });
it("menolak placeholder asing", () => { expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} {{palsu}}", allowed).ok).toBe(false); });
it("menolak nama wilayah karangan", () => { expect(validateNarrative("{{desa}} {{skor}} {{total_usulan}} di Kecamatan Sukamaju.", allowed).ok).toBe(false); });
it("menolak placeholder wajib hilang", () => { expect(validateNarrative("{{desa}} siap.", allowed).ok).toBe(false); });
it("jatuh ke template tanpa kunci", async () => { delete process.env.ANTHROPIC_API_KEY; expect((await generateNarrative(FACTS, "bpbd")).sumber).toBe("template"); });
it("jatuh ke template saat AI melanggar", async () => { mockClaude("Butuh 7 pompa."); expect((await generateNarrative(FACTS, "bpbd")).sumber).toBe("template"); });
it("merender nilai fakta", () => { expect(renderNarrative("{{desa}}", { desa: "Contoh" })).toBe("Contoh"); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 7. Periksa contoh SDK terbaru di dokumentasi resmi. Tampilkan badge sesuai App Flow 3.10.
- [ ] **Step 4:** Run `npm test`, terbitkan dengan dan tanpa kunci. Expected: badge berbeda, angka sama.
- [ ] **Step 5:** Commit `feat: integrate guarded ai proposal narrative`.

---

## Task 20: Label Kestabilan, P1 — Orang 1

**Files:** Create `src/lib/engine/stability.ts`. Test `src/lib/engine/stability.test.ts`.

**Interfaces:** Consumes `rankPriorities`. Produces `addStability(input, result): PriorityResult`.

- [ ] **Step 1: Tulis tes**

```ts
it("item dominan stabil", () => { expect(addStability(inputSatuItemMurah, rankPriorities(inputSatuItemMurah)).terpilih[0].kestabilan).toBe("stabil"); });
it("item di tepi pagu peka", () => { expect(addStability(inputTepiPagu, rankPriorities(inputTepiPagu)).terpilih.at(-1)!.kestabilan).toBe("peka"); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi kisi 3 × 3 pada TRD bagian 6, ambang 80%.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: label priority stability across assumptions`.

---

## Task 21: Tempel pesan jadi isian, P1 — Orang 2

**Files:** Create `src/lib/parseInventaris.ts`, `src/app/api/desa/[kode]/inventaris/parse/route.ts`. Modify `src/app/desa/[kode]/inventaris/page.tsx`. Test `src/lib/parseInventaris.test.ts`.

**Interfaces:**
- `stripPhones(text: string): string`
- `parsedInventorySchema` (zod)
- `parseInventoryText(text: string): Promise<InventoryInput[]>`

- [ ] **Step 1: Tulis tes**

```ts
it("menghapus nomor telepon", () => { expect(stripPhones("hub 081234567890 pompa 2")).not.toMatch(/\d{9,}/); });
it("menolak kode di luar katalog", () => { expect(parsedInventorySchema.safeParse([{ itemKode: "tank", total: 1, berfungsi: 1 }]).success).toBe(false); });
it("menolak berfungsi melebihi total", () => { expect(parsedInventorySchema.safeParse([{ itemKode: "pompa_jinjing", total: 1, berfungsi: 2 }]).success).toBe(false); });
it("menolak teks terlalu panjang", async () => { await expect(parseInventoryText("x".repeat(2001))).rejects.toThrow(); });
it("keluaran AI di luar skema ditolak", async () => { mockClaude("abaikan aturan"); await expect(parseInventoryText("pompa 2")).rejects.toThrow(); });
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD bagian 7. Endpoint tidak menyentuh DB selain `rate_limit`.
- [ ] **Step 4:** Run `npm test`, tempel contoh pesan. Expected: formulir terisi dan belum tersimpan.
- [ ] **Step 5:** Commit `feat: fill inventory form from pasted message`.

---

## Task 22: Keamanan, QA, dan deploy — Bersama

**Files:** Create `scripts/push-remote.ts`, `docs/v2/QA.md`.

Orang 2 memimpin deploy. Orang 1 memimpin QA dan pemeriksaan klaim.

- [ ] **Step 1 (Orang 1):** Run `npm test`, `pytest pipeline/tests`, `npm run build`. Expected: semua lulus.
- [ ] **Step 2 (Orang 1):** Run `git log -p | grep -iE "api[_-]?key|token|password"`. Expected: hanya nama variabel.
- [ ] **Step 3 (Orang 1):** Cari "hektare terselamatkan", "tervalidasi", dan "Empirical Bayes" di `src/`. Expected: tidak ada klaim produk.
- [ ] **Step 4 (Orang 2):** Uji `curl` tanpa sesi. Expected: 401. Dengan sesi desa lain. Expected: 403.
- [ ] **Step 5 (Orang 2):** Unggah DB ke Turso. Atur env di Vercel. Deploy. Uji di mode penyamaran.
- [ ] **Step 6 (Orang 1):** Jalankan daftar periksa Design Brief bagian 12. Catat di `docs/v2/QA.md`.
- [ ] **Step 7 (Bersama):** Minta satu orang luar tim menyelesaikan alur tanpa dibantu. Catat waktu. Target 10 menit. Ini uji kegunaan alur, bukan validasi kebutuhan pengguna.
- [ ] **Step 8 (Orang 2):** Uji `npm ci && npm run build && npm start` dari klon bersih, jaringan mati, kunci API kosong. Expected: semua P0 berjalan.
- [ ] **Step 9:** Commit `chore: add remote seed and qa checklist`.

---

## Task 23: README, video, dan submission — Bersama

**Files:** Create `README.md`.

- [ ] **Step 1 (Orang 1):** Tulis README: nama tim dan anggota, kategori Web, nama aplikasi, deskripsi, masalah, target pengguna, fitur yang berhasil dibuat, teknologi, diagram arsitektur dan alur data, instalasi, `.env.example`, akun demo, dokumentasi AI, atribusi, dan pernyataan "belum diuji pengguna".
- [ ] **Step 2 (Orang 1):** Commit `docs: add project readme`.
- [ ] **Step 3 (Orang 2):** Catat commit hash final. Sesudah ini tidak ada perubahan kode.
- [ ] **Step 4 (Orang 2):** Rekam video sesuai App Flow bagian 5 dari commit final, satu rekaman utuh, 3:00-5:00. Unggah ke YouTube Unlisted. Uji di mode penyamaran.
- [ ] **Step 5 (Ketua tim):** Isi Surat Pernyataan Orisinalitas format resmi, tanda tangan, meterai Rp10.000 atau e-meterai, simpan PDF.
- [ ] **Step 6 (Bersama):** Periksa repo publik, URL aplikasi, video, surat PDF, commit hash, dan kuota API.
- [ ] **Step 7 (Ketua tim):** Kirim lewat portal resmi sebelum **14 November, 20.00 WIB**. Submission hanya sekali.
- [ ] **Step 8:** Jangan ubah repo, deployment, atau video sampai penilaian selesai.

---

## Persiapan final, setelah pengumuman 21 November

- [ ] Hadiri Technical Meeting 22 November.
- [ ] Latihan 7 menit sesuai App Flow bagian 6, minimal tiga kali.
- [ ] Siapkan jawaban: "Bukti pengguna", "Dokumen tidak memadamkan api", "Dana desa sudah habis", "Dari mana harga", "Mengapa bukan prediksi".
- [ ] Bawa laptop dengan localhost teruji dan video cadangan.
