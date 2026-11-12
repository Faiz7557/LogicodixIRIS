# 09 — Sumber Tekanan Api dan Penerima Usulan: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Revisi 12 November 2026, sore.** Dokumen ini sudah diaudit terhadap kode di `main` (`eeee1a7`). Hasil audit ada di bagian "Audit 12 November". Koreksi sudah dimasukkan ke tiap task dan ditandai **[Koreksi audit]**. Bagian C (Ringkasan AI dengan OpenAI) adalah tambahan baru.

**Goal:** Menjawab dua celah dari sidang dan kurasi 12 Nov: (A) api dari konsesi atau luar desa, (B) penerima usulan belum terbukti, tanpa membuat klaim yang tidak bisa dibuktikan. Ditambah (C): tombol "Ringkasan AI" per halaman dan narasi usulan, ditulis OpenAI dari fakta yang dihitung server, dengan pengaman angka dan template cadangan.

**Architecture:** (A) Pipeline Python menandai tiap deteksi VIIRS per desa sebagai `dalam` batas desa atau `penyangga` 2 km, lalu menandai apakah titik jatuh di konsesi HTI (vektor Trase, ada nama pemasok) atau di sawit industri (raster Descals 10 m, tanpa nama). Ringkasannya masuk tabel `desa_sumber_api` dan tampil sebagai kartu deskriptif di halaman desa. (B) Kanal `csr` yang sudah ada diperkaya menjadi "Pemegang izin / CSR" dengan nama perusahaan dan dasar Pergub yang sudah dibaca. Status tindak lanjut usulan dicatat append-only, dan halaman Data menampilkan agregat jujurnya, mulai dari nol.

(C) Satu pemanggil OpenAI di server (`server/llm.ts`) dipakai oleh ringkasan halaman (`server/ringkasan.ts`) dan narasi usulan (`server/narasi.ts`). Polanya sama dengan `brief` di Sparekit: server menyusun fakta, model hanya menulis kalimat dalam JSON berskema, keluaran divalidasi, dan kegagalan apa pun jatuh ke template yang berlabel.

**Tech Stack:** Python 3.13 + geopandas (+ rasterio hanya bila lapisan sawit dikerjakan), SQLite/libSQL, Next.js App Router, Vitest, pytest. Bagian C memakai `fetch` bawaan ke `https://api.openai.com/v1/chat/completions`, tanpa dependency baru.

**Spec:** [01_PRD.md](01_PRD.md), [02_TRD.md](02_TRD.md) §5, [00_JOBDESK.md](00_JOBDESK.md) §2-3, putusan sidang `.court/20261109-201058/VERDICT.md`, dan analisis kurasi 12 Nov 2026 (bagian "Feasibility" di bawah).

## Feasibility (ringkas)

| Masalah | Bisa dijawab dengan kode? | Yang bisa | Yang tidak bisa |
|---|---|---|---|
| A. Api dari konsesi atau luar desa | **Sebagian, deskriptif** | Porsi deteksi di dalam desa vs penyangga 2 km, porsi di konsesi HTI (dengan nama pemasok), porsi di sawit industri | Titik asal penyulutan, arah rambat, atau "siapa yang membakar". Batas HGU sawit dan konsesi sawit GFW Indonesia **tidak boleh dipakai** (lisensi GFW: "CC BY 4.0 (excluding Indonesia)", data 2012, view-only) |
| B. Penerima usulan belum terbukti | **Tidak bisa dibuktikan oleh kode** | Penerima yang bernama dan berdasar hukum (pemegang izin wajib membentuk dan mendanai MPA), pencatatan status usulan, agregat jujur | Bukti penerimaan sebelum code freeze. Itu hanya bisa datang dari surel atau surat tim ke satu BPBD, Daops, atau perusahaan (tugas manusia M3) |

**Prasyarat keras untuk A:** `data/siapkemarau.db` saat ini 0 byte. Fitur A hanya bermakna setelah pipeline dasar (FIRMS + HDX + ekspor, rencana 06) menghasilkan deteksi nyata. Bila pipeline dasar belum jalan pada **Jum 13 Nov 18.00**, kerjakan hanya Task 5-7 (bagian B) dan potong Task 1-4.

**Keputusan yang dibuka ulang:** Jobdesk §2 mengunci "Rute penanggung biaya: Tidak dibuat". Plan ini tidak membuat rute baru. Plan ini hanya mengisi kanal `csr` yang sudah ada dengan nama dan dasar hukum. Tetap perlu persetujuan kedua anggota tim sebelum Task 5.

**[Koreksi audit] Dua keputusan terkunci lain yang ikut terbuka dan belum disebut:**
- Jobdesk §2 "Bukti: data publik dan sekunder saja, tanpa wawancara". M3 (surel ke BPBD, Daops, atau perusahaan) adalah bukti primer. Ini sah dan menjawab syarat pembebasan nomor 1 dari sidang, tetapi harus disetujui berdua dan Jobdesk §2 diperbarui.
- 07_AUDIT §6.1 menolak "Asisten AI" dari Sparekit. Bagian C hanya mengambil ringkasan sekali tekan, bukan obrolan. Jobdesk §2 dan TRD §7 perlu satu baris baru (lihat Task C5).

## Audit 12 November

Objek: `main` pada `eeee1a7`, dibandingkan dengan `docs/v2/00` sampai `08` dan plan ini.

### Baseline terukur

| Pemeriksaan | Hasil |
|---|---|
| `npx vitest run` | Lulus, 172 tes pada 19 berkas |
| `uv run pytest pipeline/tests` | **Tidak dijalankan.** `uv` tidak ada di PATH sesi audit. Jalankan sendiri sebelum mulai |
| `data/siapkemarau.db` | 0 byte, tidak terlacak git |
| `data/raw/` | Tidak ada. FIRMS, HDX, dan WRI belum diunduh |
| `pipeline/export.py`, `pipeline/run_all.py` | Tidak ada |
| `generateNarrative` | Selalu template. Tidak memanggil model |
| Jalur AI yang hidup | Hanya `inventaris/parse`: Claude, OpenAI, 9router, parser deterministik |
| `data/manual/sumber_data.csv` | 17 sel masih `PERLU_DIISI` |

### Temuan sistem

| No | Tingkat | Temuan | Bukti | Tindakan |
|---|---|---|---|---|
| S1 | Kritis | Jalur data nyata belum ada, dan batas gerbang (Kam 12 Nov siang) sudah lewat | Baris baseline di atas. Jobdesk §5 | T23 dan T34 dari plan 08 tetap prioritas nomor satu. Semua fitur di plan ini kalah prioritas |
| S2 | Kritis | FR-16 (P0, "dipotong paling akhir") belum hidup | `server/narasi.ts:25-30` | Task C4 |
| S3 | Sedang | Tabel baru yang dibaca `getDesaCard` akan mematikan halaman desa pada DB lama | `server/queries.ts:27-36`: `q()` mengubah `no such table` menjadi 503 | Lihat koreksi Task 3 |
| S4 | Sedang | Kode menyimpang dari keputusan tertulis: `three` dan `@types/three` terpasang, beranda memakai 3D | `frontend/package.json`; 07_AUDIT §6.1 menolak three.js; TRD melarang dependency baru | Catat di README dan perbarui 07_AUDIT, atau cabut. Jangan dibiarkan bertentangan diam-diam |
| S5 | Sedang | Lisensi dan URL sumber belum diisi (M10 plan 08) | `sumber_data.csv` | Halaman Data menampilkan `PERLU_DIISI` kepada juri. Isi sebelum deploy |
| S6 | Ringan | State di memori proses tidak bertahan di serverless | Deploy belum dipilih | Bagian C memakai `rate_limit` di DB untuk batas, dan cache memori hanya sebagai penghemat |
| S7 | Ringan | Batas waktu tidak konsisten | Plan 06: submit 14 Nov 20.00 dan berhenti menambah fitur 13 Nov 20.00. Plan ini semula menulis freeze 23.59 | Plan ini sekarang mengikuti plan 06 |

### Temuan pada plan ini (sudah dikoreksi di task)

| No | Temuan | Koreksi |
|---|---|---|
| P1 | Task 4 memasang kartu di `KartuHasilDesa.tsx`. Itu kartu hasil pencarian yang seluruhnya satu `<Link>`; tautan di dalamnya tidak sah | Pasang di `app/desa/[kode]/page.tsx` setelah `<DasborSatelit>` |
| P2 | Review Focus 4 menjanjikan `sumberApi: null` pada DB lama, tetapi `q()` melempar 503 | Query `desa_sumber_api` dibungkus; `HttpError` 503 menjadi `null` |
| P3 | Batas HTI 2023-2024 dipakai untuk deteksi 2015-2026. Konsesi bisa belum ada saat api terdeteksi | Kalimat menyebut tahun data batas. Satu baris `dq_issue` baru |
| P4 | Nama perusahaan tampil di halaman publik di samping data api. Risiko hukum dan reputasi, walau ada catatan | Halaman publik hanya menampilkan porsi. Nama hanya tampil untuk akun desa itu sendiri dan di dokumen usulan |
| P5 | Titik VIIRS berukuran piksel 375 m dan batas desa HDX bukan batas hukum. `dalam` lawan `penyangga` tidak pasti di dekat batas | Satu baris `dq_issue` baru dan satu kalimat di halaman Data |
| P6 | Lapisan sawit menambah `rasterio`, unduhan raster 10 m yang ukurannya belum diketahui, dan arti kelas yang masih dugaan | Lapisan sawit menjadi opsional dan dipotong pertama. Bawaan plan: **A-lite** (dalam, penyangga, HTI) tanpa dependency baru |
| P7 | Task 2 bergantung pada `run_all.py` yang belum ada | Pemanggilan `tulis_sumber_api` masuk daftar kerja T23 |
| P8 | Pasal Pergub di Task 5 tidak ada di `referensi_pergub.csv` (hanya Pasal 8, 18, 19) | Tugas manusia M5: cocokkan kutipan dengan PDF dan catat halaman. Tanpa M5, dokumen tidak menampilkan dasar |
| P9 | Task 6 menolak "tanggal masa depan" memakai jam server (UTC). Pukul 00.00-07.00 WIB tanggal hari ini ditolak | Bandingkan dengan tanggal WIB |
| P10 | Task 7 menghitung usulan akun demo sebagai hasil | Rekap mengecualikan `akun.is_demo = 1` |
| P11 | Titik potong A (Jum 18.00) dan freeze 23.59 bertentangan dengan plan 06 | Jadwal diselaraskan |
| P12 | Tes komponen Task 4 (`KartuSumberApi.test.tsx`) tidak akan pernah jalan: `vitest.config.ts` hanya memuat `src/**/*.test.ts`, dan repo tidak punya jsdom maupun Testing Library | Tanpa dependency baru. Logika dipindah ke fungsi murni bertes `.ts`; komponen dicek di browser |

### Kurasi: apa yang layak dikerjakan

Urutan nilai per jam kerja, dari yang tertinggi:

1. **Pipeline dasar** (T23, T34). Tanpa ini tidak ada angka nyata, dan aturan lomba melarang data uji sebagai hasil.
2. **Bagian C, Task C1 sampai C4.** Kira-kira setengah hari, tidak bergantung pada pipeline, dan menutup FR-16 yang P0. Rubrik menilai AI.
3. **Bagian B, Task 5 dan 6.** Menjawab dakwaan nomor 2 sejauh kode bisa menjawabnya. M3 lebih bernilai daripada seluruh kode bagian B.
4. **Bagian A-lite, Task 1 sampai 4 tanpa sawit.** Hanya bila pipeline dasar hidup.
5. Task 7 dan lapisan sawit. Dipotong pertama.

## Global Constraints

- **[Koreksi audit]** Berhenti menambah fitur: **Jum 13 November 20.00 WIB**. Submit: **Sab 14 November 20.00 WIB** (plan 06). Potong dari bawah: lapisan sawit, Task 7, Task C3 untuk halaman `timemachine`, Task 4, Task 3, Task 1-2, Task 6. Task C4 dipotong paling akhir.
- Tidak ada dependency JS baru. Dependency Python baru hanya `rasterio`, dan hanya bila lapisan sawit dikerjakan.
- Tidak ada berkas dari `caliber-final` yang disalin (07_AUDIT §6.3). Bagian C ditulis baru dari spesifikasi di sini. README menyebut rujukannya.
- AI adalah penulis, bukan penghitung. Setiap angka di keluaran AI harus ada di fakta yang dikirim server. Pelanggaran jatuh ke template tanpa pesan galat.
- Yang tidak pernah dikirim ke OpenAI: nama dan kode desa, kecamatan, kabupaten, nama akun, catatan bebas pengguna, nama perusahaan. Model menulis "desa ini".
- Semua P0 tetap berjalan tanpa internet dan tanpa `OPENAI_API_KEY`.
- Data uji tidak boleh tampil sebagai hasil. Baris uji `desa_sumber_api` di `buildTestDb` harus ikut banner data uji yang sudah ada.
- Kata terlarang di UI, narasi, dan README: "penyebab", "pelaku", "dibakar oleh", "asal api", "perusahaan membakar". Kata wajib: "deteksi satelit", "di dalam batas konsesi", "di penyangga 2 km".
- Kalimat dasar hukum hanya dari teks yang sudah dibaca: Pergub Kalteng 35/2025 Pasal 4 ayat (1) huruf a, Pasal 17 ayat (1), Pasal 26 ayat (1); Pergub Kalbar 56/2025 Pasal 24 ayat (1) huruf f dan g. Tidak menyebut pasal Permendesa atau Permendagri.
- Data desa tidak publik (NFR-05). Agregat status usulan publik hanya per kanal, tanpa kode atau nama desa.
- Semua sumber baru masuk `data/manual/sumber_data.csv` dengan URL dan lisensi terisi, bukan `PERLU_DIISI`.

## Review Focus

1. Desa dengan 0 deteksi di tahun ekstrem: porsi harus `null`, bukan `NaN` atau pembagian nol, dan kartu menampilkan "Tidak ada deteksi satelit di tahun ekstrem". Test: `test_ringkas_tanpa_deteksi` (Task 1).
2. Titik di dua konsesi HTI yang tumpang tindih: titik dihitung sekali, nama pemasok diambil yang pertama secara alfabetis. Test: `test_hti_tumpang_tindih_dihitung_sekali` (Task 1).
3. Titik di luar cakupan raster atau di piksel nodata: `sawit_industri = False`, bukan galat. Test: `test_sawit_nodata_false` (Task 1).
4. `desa_sumber_api` kosong (DB lama atau pipeline belum jalan): `getDesaCard` mengembalikan `sumberApi: null` dan halaman desa tetap tampil tanpa kartu. Test: `getDesaCard tanpa sumber api` (Task 3).
5. Status usulan dikirim untuk usulan desa lain: 404, tidak bocor. Test: `status usulan desa lain ditolak` (Task 6).
6. AI menulis angka yang tidak ada di fakta ("butuh 7 pompa"): keluaran ditolak, template dipakai, `sumber = "template"`. Test: `menolak angka di luar fakta` (Task C2).
7. OpenAI lambat, galat 500, atau membalas bukan JSON: pengguna tetap mendapat ringkasan template dalam 15 detik, tanpa galat di layar. Test: `jatuh ke template saat fetch gagal` (Task C2).
8. Nama desa tidak ikut ke OpenAI. Test: `fakta tidak memuat nama wilayah` (Task C2).
9. Ringkasan `prioritas` diminta akun `mpa` atau akun desa lain: 403 atau 404 sesuai `requireDesaAccess`, tanpa memanggil OpenAI. Test: `ringkasan prioritas menolak peran mpa` (Task C3).

---

## Tugas manusia (paralel, mulai sekarang)

| ID | Tugas | Pemilik | Batas |
|---|---|---|---|
| M1 | Unduh Trase "Indonesia – Wood Pulp Concessions (2023-2024)". Catat format berkas, nama kolom geometri, dan teks lisensi (CC BY 4.0, penggunaan komersial perlu kontak). Simpan di `data/raw/trase_hti/` (diabaikan git) | Orang 1 | Kam 12 Nov malam |
| M2 | Buka `doi.org/10.5281/zenodo.4473715` (Descals 2021). Pastikan lisensi di halaman Zenodo dan arti nilai kelas raster (dugaan: 1 industri, 2 petani kecil). Unduh hanya tile yang menutup Kalbar dan Kalteng ke `data/raw/descals/` | Orang 1 | Kam 12 Nov malam |
| M3 | Kirim satu surel atau pesan resmi ke satu BPBD kabupaten, satu Daops, atau satu perusahaan HTI di Kalbar/Kalteng. Lampirkan contoh dokumen usulan cetak dan tanyakan: "Apakah usulan dengan format ini akan dibaca dan dinilai?" Simpan jawaban apa adanya | Kedua | Kirim Jum 13 Nov pagi |
| M4 | Persetujuan kedua anggota untuk membuka ulang kanal `csr`, bukti primer M3, dan ringkasan AI (lihat "Keputusan yang dibuka ulang") | Kedua | Sebelum Task 5 dan C1 |
| M5 | Buka kedua PDF Pergub di `sumber_data.csv`. Cocokkan kata demi kata kutipan di Task 5 (Kalteng Pasal 4 ayat (1) huruf a, Pasal 17 ayat (1), Pasal 26 ayat (1); Kalbar Pasal 24 ayat (1) huruf f dan g). Catat nomor halaman di `referensi_pergub.csv` | Orang 1 | Sebelum Task 5 |
| M6 | Isi `OPENAI_API_KEY` di `frontend/.env` dan di platform deploy. Pasang batas belanja bulanan di dasbor OpenAI | Orang 2 | Sebelum Task C1 Step 4 |
| M7 | Isi 17 sel `PERLU_DIISI` di `sumber_data.csv` (M10 plan 08) | Orang 1 | Sebelum deploy |

Jika M1 atau M2 gagal sampai Jum 13 Nov 12.00, Task 1 tetap jalan tanpa lapisan yang gagal: kolom terkait diisi `null` dan kartu menampilkan "Data konsesi belum tersedia".

---

### Task 1: Klasifikasi lokasi deteksi per desa

**Files:**
- Create: `pipeline/sumber_api.py`
- Test: `pipeline/tests/test_sumber_api.py`
- Modify: `pyproject.toml` (tambah `rasterio>=1.4`), `uv.lock` (lewat `uv add rasterio`)

**Interfaces:**
- Consumes: `load_detections(paths) -> DataFrame[lat, lon, tanggal, tahun, satellite, sumber]` dari `pipeline/firms.py`; GeoDataFrame desa dari `pipeline/wilayah.load_desa` (kolom `kode`, geometri EPSG:4326); `PARAMS["buffer_km"]`, `PARAMS["ext_years"]` dari `pipeline/params.py`.
- Produces:
  - `lokasi_deteksi(det: DataFrame, desa: GeoDataFrame, buffer_km: float) -> GeoDataFrame` dengan kolom `kode, tanggal, tahun, lokasi` (`"dalam"` | `"penyangga"`) dan geometri titik EPSG:4326.
  - `tandai_hti(pts: GeoDataFrame, hti: GeoDataFrame | None) -> pandas.Series[str | None]` berisi nama pemasok (`wood_supplier`) atau `None`.
  - `tandai_sawit_industri(pts: GeoDataFrame, raster_paths: list[str], kelas_industri: int = 1) -> pandas.Series[bool]`.
  - `ringkas_sumber(tagged: DataFrame, kode_list: list[str], ext_years: list[int], min_det: int = 10) -> DataFrame` dengan kolom `kode, n_det_ext, porsi_dalam, porsi_penyangga, porsi_hti, porsi_sawit_industri, hti_nama_json, cukup_data`.

**[Koreksi audit] A-lite adalah bawaan.** Kerjakan `lokasi_deteksi`, `tandai_hti`, dan `ringkas_sumber` lebih dulu, tanpa `rasterio`. `tandai_sawit_industri`, dua tes sawit, dan `uv add rasterio` hanya dikerjakan bila M2 selesai dan ketiga fungsi pertama sudah lulus sebelum Jum 13 Nov 12.00. Tanpa lapisan sawit, `porsi_sawit_industri` selalu `None` dan kartu tidak menampilkan barisnya.

- [ ] **Step 1: Tulis tes yang gagal**

```python
# fixture: desa A = box(0,0,0.1,0.1) EPSG:4326, kode "A"; buffer 2 km
def test_lokasi_dalam_dan_penyangga():
    det = df(lat=[0.05, 0.105], lon=[0.05, 0.05], tahun=[2019, 2019])
    out = lokasi_deteksi(det, desa_a, buffer_km=2)
    assert list(out["lokasi"]) == ["dalam", "penyangga"]

def test_titik_di_luar_penyangga_dibuang():
    det = df(lat=[0.5], lon=[0.5], tahun=[2019])
    assert lokasi_deteksi(det, desa_a, 2).empty

def test_hti_tumpang_tindih_dihitung_sekali():
    hti = gdf(wood_supplier=["PT B", "PT A"], geometry=[box(0,0,0.1,0.1)]*2)
    s = tandai_hti(pts_satu_titik_di(0.05, 0.05), hti)
    assert list(s) == ["PT A"]

def test_hti_none_jika_data_tidak_ada():
    assert tandai_hti(pts_satu_titik_di(0.05, 0.05), None).isna().all()

def test_sawit_nodata_false(tmp_path):
    # raster 3x3 dengan nodata=255; titik jatuh di piksel 255 dan satu di luar extent
    assert list(tandai_sawit_industri(pts, [str(raster)])) == [False, False]

def test_sawit_kelas_industri_true(tmp_path):
    # piksel bernilai 1 di bawah titik
    assert list(tandai_sawit_industri(pts, [str(raster)])) == [True]

def test_ringkas_porsi():
    # 4 deteksi tahun 2019 di desa A: 1 dalam, 3 penyangga, 2 di HTI "PT A", 1 sawit
    r = ringkas_sumber(tagged, ["A"], [2015, 2019, 2023, 2026], min_det=1).iloc[0]
    assert (r.n_det_ext, r.porsi_dalam, r.porsi_penyangga, r.porsi_hti, r.porsi_sawit_industri) == (4, 0.25, 0.75, 0.5, 0.25)
    assert json.loads(r.hti_nama_json) == ["PT A"]

def test_ringkas_tanpa_deteksi():
    r = ringkas_sumber(tagged_kosong, ["A"], [2015, 2019, 2023, 2026]).iloc[0]
    assert r.n_det_ext == 0 and r.porsi_dalam is None and r.cukup_data == 0

def test_ringkas_abaikan_tahun_non_ekstrem():
    # deteksi 2018 tidak ikut dihitung
    assert ringkas_sumber(tagged_2018, ["A"], [2015, 2019, 2023, 2026]).iloc[0].n_det_ext == 0
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `uv run pytest pipeline/tests/test_sumber_api.py -q`
Expected: FAIL, `ModuleNotFoundError: pipeline.sumber_api`

- [ ] **Step 3: `uv add rasterio`, lalu implementasikan keempat fungsi di `pipeline/sumber_api.py`**

`lokasi_deteksi`: dua `sjoin` di EPSG:3857 seperti `assign_to_desa` (salin komentar `ponytail:` soal galat proyeksi). Titik di dalam poligon desa diberi `dalam`. Titik di penyangga tetapi tidak di poligon diberi `penyangga`. Satu titik boleh muncul untuk beberapa desa.
`tandai_hti`: `sjoin` titik ke `hti.make_valid()`, ambil `wood_supplier` terkecil per indeks titik.
`tandai_sawit_industri`: `rasterio.open(...).sample(...)` per berkas; `True` hanya jika nilai == `kelas_industri` dan bukan nodata. Titik di luar extent semua raster diberi `False`.
`ringkas_sumber`: filter `tahun ∈ ext_years`, groupby `kode`, porsi dibulatkan 3 desimal, `hti_nama_json` berisi maksimal 3 nama terbanyak. `cukup_data = n_det_ext >= min_det`. Porsi `None` jika `n_det_ext == 0`. Kode tanpa deteksi tetap punya baris.

- [ ] **Step 4: Jalankan, pastikan lulus**

Run: `uv run pytest pipeline/tests -q`
Expected: semua PASS, termasuk tes lama.

- [ ] **Step 5: Commit**

```bash
git add pipeline/sumber_api.py pipeline/tests/test_sumber_api.py pyproject.toml uv.lock
git commit -m "feat(pipeline): classify detections by village, buffer, HTI and industrial oil palm"
```

### Task 2: Tabel `desa_sumber_api` dan penulisnya

**Files:**
- Modify: `db/schema.sql` (tabel baru setelah `kecamatan_paparan`), `data/manual/sumber_data.csv`, `data/manual/dq_issue.csv`, `pipeline/params.py`
- Modify: `pipeline/sumber_api.py` (tambah penulis)
- Modify: `frontend/src/test/buildTestDb.ts` (baris uji)
- Test: `pipeline/tests/test_schema.py`, `pipeline/tests/test_sumber_api.py`

**Interfaces:**
- Consumes: keluaran `ringkas_sumber` (Task 1).
- Produces: tabel `desa_sumber_api` dan `tulis_sumber_api(conn: sqlite3.Connection, ringkas: DataFrame) -> int` (jumlah baris). Ekspor pipeline (`run_all.py`, rencana 06) memanggil ini setelah `desa` terisi.

```sql
CREATE TABLE desa_sumber_api (
  kode TEXT PRIMARY KEY REFERENCES desa(kode),
  n_det_ext INTEGER NOT NULL CHECK (n_det_ext >= 0),
  porsi_dalam REAL CHECK (porsi_dalam BETWEEN 0 AND 1),
  porsi_penyangga REAL CHECK (porsi_penyangga BETWEEN 0 AND 1),
  porsi_hti REAL CHECK (porsi_hti BETWEEN 0 AND 1),
  porsi_sawit_industri REAL CHECK (porsi_sawit_industri BETWEEN 0 AND 1),
  hti_nama_json TEXT NOT NULL DEFAULT '[]',
  cukup_data INTEGER NOT NULL CHECK (cukup_data IN (0,1))
);
```

- [ ] **Step 1: Tulis tes yang gagal**

```python
def test_schema_punya_desa_sumber_api(conn):
    cols = {r[1] for r in conn.execute("PRAGMA table_info(desa_sumber_api)")}
    assert {"kode", "n_det_ext", "porsi_hti", "hti_nama_json", "cukup_data"} <= cols

def test_tulis_sumber_api_menolak_porsi_di_luar_0_1(conn):
    with pytest.raises(sqlite3.IntegrityError):
        tulis_sumber_api(conn, ringkas_dengan(porsi_hti=1.2))

def test_tulis_sumber_api_menyimpan_null(conn):
    tulis_sumber_api(conn, ringkas_tanpa_deteksi)
    assert conn.execute("SELECT porsi_dalam FROM desa_sumber_api").fetchone()[0] is None

def test_sumber_data_lengkap():
    df = read_csv("sumber_data")
    baru = df[df.kode.isin(["trase_hti_2023", "descals_sawit_2019"])]
    assert len(baru) == 2 and not baru.isin(["PERLU_DIISI"]).any().any()
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `uv run pytest pipeline/tests -q`
Expected: FAIL pada keempat tes baru.

- [ ] **Step 3: Implementasikan**

Tambah DDL di atas ke `db/schema.sql`. Tambah `tulis_sumber_api` (`INSERT OR REPLACE`, `NaN` → `None`). Tambah parameter `"sumber_api_min_det": ("10", "parameter")` ke `PARAMS`. Tambah dua baris `sumber_data.csv` dari hasil M1 dan M2. Tambah lima baris `dq_issue.csv`: konsesi sawit Indonesia tidak dipakai karena lisensi; raster sawit tahun 2019 dibandingkan dengan deteksi 2015-2026; "titik di konsesi bukan bukti asal penyulutan"; **[Koreksi audit]** batas konsesi HTI adalah keadaan 2023-2024 sedangkan deteksi mencakup 2015-2026, sehingga konsesi bisa belum ada saat titik terdeteksi; dan piksel VIIRS berukuran 375 m serta batas desa HDX bukan batas hukum, sehingga pembagian `dalam` dan `penyangga` tidak pasti di dekat batas. **[Koreksi audit]** `pipeline/export.py` dan `run_all.py` belum ada: tambahkan pemanggilan `tulis_sumber_api` ke daftar kerja T23 plan 08, bukan ke berkas yang belum dibuat. Di `buildTestDb.ts` isi `desa_sumber_api` untuk 3 desa uji dengan nama pemasok `"PT Contoh Uji"` dan satu desa `n_det_ext = 0`.

- [ ] **Step 4: Jalankan, pastikan lulus**

Run: `uv run pytest pipeline/tests -q` lalu `cd frontend && npm test`
Expected: semua PASS.

- [ ] **Step 5: Commit**

```bash
git add db/schema.sql data/manual pipeline frontend/src/test/buildTestDb.ts
git commit -m "feat(db): add desa_sumber_api table, writer and data sources"
```

### Task 3: Server dan kalimat sumber tekanan api

**Files:**
- Modify: `frontend/src/lib/types.ts` (tipe `SumberApi`, field `DesaCard.sumberApi`)
- Modify: `frontend/src/server/queries.ts:83` (`getDesaCard`)
- Modify: `frontend/src/lib/kalimat.ts` (fungsi kalimat baru)
- Test: `frontend/src/server/queries.test.ts`, `frontend/src/lib/kalimat.test.ts`

**Interfaces:**
- Consumes: tabel `desa_sumber_api` (Task 2).
- Produces:
  - `interface SumberApi { nDetExt: number; porsiDalam: number | null; porsiPenyangga: number | null; porsiHti: number | null; porsiSawitIndustri: number | null; htiNama: string[]; cukupData: boolean }`
  - `DesaCard.sumberApi: SumberApi | null`
  - `kalimatSumberApi(s: SumberApi): { utama: string; catatan: string }`

- [ ] **Step 1: Tulis tes yang gagal**

```ts
it("getDesaCard tanpa sumber api", async () => {
  // DB uji tanpa baris desa_sumber_api untuk desa ini
  expect((await getDesaCard(KODE_TANPA))!.sumberApi).toBeNull();
});
it("getDesaCard membaca nama HTI", async () => {
  expect((await getDesaCard(KODE_HTI))!.sumberApi!.htiNama).toEqual(["PT Contoh Uji"]);
});
it("kalimat dengan porsi penyangga dan HTI", () => {
  const k = kalimatSumberApi({ nDetExt: 40, porsiDalam: 0.3, porsiPenyangga: 0.7, porsiHti: 0.45, porsiSawitIndustri: 0.1, htiNama: ["PT A"], cukupData: true });
  expect(k.utama).toBe("Di tahun kering ekstrem, 7 dari 10 deteksi satelit di sekitar desa ini berada di penyangga 2 km di luar batas desa, dan 45% berada di dalam batas konsesi HTI.");
});
it("kalimat tanpa deteksi", () => {
  expect(kalimatSumberApi({ ...kosong, nDetExt: 0 }).utama).toBe("Tidak ada deteksi satelit di sekitar desa ini pada tahun kering ekstrem.");
});
it("kalimat data sedikit", () => {
  expect(kalimatSumberApi({ ...contoh, nDetExt: 4, cukupData: false }).utama).toMatch(/^Hanya 4 deteksi satelit/);
});
it("catatan selalu memuat batas klaim dan tanpa kata terlarang", () => {
  const { utama, catatan } = kalimatSumberApi(contoh);
  expect(catatan).toBe("Titik di dalam konsesi tidak menunjukkan asal atau pelaku penyulutan.");
  for (const kata of ["penyebab", "dibakar oleh", "asal api", "perusahaan membakar"]) expect(utama.toLowerCase()).not.toContain(kata);
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/queries.test.ts src/lib/kalimat.test.ts`
Expected: FAIL, `sumberApi` undefined dan `kalimatSumberApi` tidak ada.

- [ ] **Step 3: Implementasikan**

`getDesaCard` menambah satu query berparameter `SELECT * FROM desa_sumber_api WHERE kode = ?` di `Promise.all` yang sudah ada, lalu memetakan snake_case ke camelCase dan `hti_nama_json` ke array.

**[Koreksi audit]** `q()` mengubah `no such table` menjadi `HttpError` 503, sehingga DB lama akan mematikan seluruh halaman desa. Bungkus hanya query ini:

```ts
const sumberApiRows = (kode: string) =>
  q("SELECT * FROM desa_sumber_api WHERE kode = ?", [kode]).catch((e) => {
    if (e instanceof HttpError && e.status === 503) return []; // DB sebelum plan 09
    throw e;
  });
```

Tambah tes `getDesaCard pada DB tanpa tabel desa_sumber_api`: `DROP TABLE desa_sumber_api` pada DB uji, lalu `sumberApi` harus `null` dan kartu tetap terbaca.

**[Koreksi audit]** Kalimat utama menyebut tahun data batas: "...berada di dalam batas konsesi HTI (batas 2023-2024)." Perbarui teks harapan di tes `kalimat dengan porsi penyangga dan HTI`. `kalimatSumberApi` membulatkan porsi penyangga ke "N dari 10" dan porsi HTI ke persen bulat. Klausa HTI hanya ditulis bila `porsiHti != null && porsiHti >= 0.1`. Teks catatan dan kalimat "tanpa deteksi" persis seperti di tes.

- [ ] **Step 4: Jalankan, pastikan lulus**

Run: `cd frontend && npm test && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib frontend/src/server
git commit -m "feat(paparan): read fire-pressure sources and phrase them without blame"
```

### Task 4: Kartu "Dari mana tekanan api?" dan halaman Data

**Files:**
- Create: `frontend/src/components/paparan/KartuSumberApi.tsx`
- Modify: `frontend/src/app/desa/[kode]/page.tsx` (pasang kartu setelah `<DasborSatelit>`, di dalam pembungkus `max-w-[1200px]`). **[Koreksi audit]** Bukan `KartuHasilDesa.tsx`: itu kartu hasil pencarian yang seluruhnya satu `<Link>`.
- Modify: `frontend/src/components/data/DataView.tsx` (bagian metode, sumber, dan batas)
- Test: `frontend/src/components/paparan/KartuSumberApi.test.tsx`

**Interfaces:**
- Consumes: `DesaCard.sumberApi`, `kalimatSumberApi` (Task 3).
- Produces: `<KartuSumberApi sumber={SumberApi | null} tampilNama={boolean} />` yang tidak merender apa pun saat `null`.

**[Koreksi audit] Nama perusahaan tidak tampil di halaman publik.** `tampilNama` bernilai `sesi?.desaKode === kode` (variabel `berakun` yang sudah ada di halaman). Saat `false`, kartu menampilkan porsi dan kalimat "Nama pemegang konsesi tampil setelah masuk sebagai akun desa ini.", tanpa daftar nama dan tanpa tautan ke usulan. Tambah tes `tidak menampilkan nama HTI tanpa tampilNama`.

**[Koreksi audit]** Tiga tes di bawah memakai `render` dan `screen`, yang tidak tersedia di repo ini (temuan P12). Jangan menambah jsdom atau Testing Library. Ganti dengan fungsi murni `barisSumberApi(s: SumberApi, tampilNama: boolean): { label: string; nilai: string }[]` di `lib/kalimat.ts`, diuji di `lib/kalimat.test.ts` dengan harapan yang sama: `"Di dalam desa: 30%"`, `"Penyangga 2 km: 70%"`, nama HTI hanya saat `tampilNama`. Komponen hanya memetakan larik itu ke elemen, lalu dicek di browser pada Step 4. Tes di bawah dibiarkan sebagai daftar perilaku yang harus terlihat.

- [ ] **Step 1: Tulis tes yang gagal**

```ts
it("tidak merender saat null", () => { const { container } = render(<KartuSumberApi sumber={null} />); expect(container).toBeEmptyDOMElement(); });
it("menampilkan nama HTI dan catatan batas", () => {
  render(<KartuSumberApi sumber={contoh} />);
  expect(screen.getByText("PT A")).toBeInTheDocument();
  expect(screen.getByText(/tidak menunjukkan asal atau pelaku/)).toBeInTheDocument();
});
it("batang porsi punya teks, bukan hanya warna", () => {
  render(<KartuSumberApi sumber={contoh} />);
  expect(screen.getByText("Di dalam desa: 30%")).toBeInTheDocument();
  expect(screen.getByText("Penyangga 2 km: 70%")).toBeInTheDocument();
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/components/paparan/KartuSumberApi.test.tsx`
Expected: FAIL, modul tidak ada.

- [ ] **Step 3: Implementasikan**

Judul berupa pertanyaan: "Dari mana tekanan api?" (prinsip Design Brief §1). Isinya: kalimat utama, satu batang bertumpuk dalam/penyangga berlabel teks, baris "Di konsesi HTI" dan "Di sawit industri" berupa angka persen, daftar nama HTI, dan catatan. Ikuti token dan ukuran teks minimal 14 px yang sudah ada, tanpa pustaka chart. Tambahkan juga "Bawa ke usulan: kanal Pemegang izin / CSR" yang menaut ke halaman usulan desa bila `htiNama.length > 0`. Di `DataView` tambahkan bagian "Sumber tekanan api": definisi `dalam`/`penyangga`, kedua sumber dan lisensinya, alasan konsesi sawit Indonesia tidak dipakai, dan kalimat catatan dari Task 3.

- [ ] **Step 4: Jalankan, pastikan lulus, lalu cek manual di 360 px**

Run: `cd frontend && npm test && npm run lint`
Expected: PASS. Buka `/desa/<kode uji HTI>` pada lebar 360 px: kartu tidak melebar dan tidak ada scroll horizontal.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components
git commit -m "feat(paparan): show where fire pressure sits around the village"
```

### Task 5: Kanal "Pemegang izin / CSR" dengan nama dan dasar Pergub

**Files:**
- Modify: `frontend/src/lib/usulan.ts:25-29` (`KANAL_META.csr`)
- Modify: `frontend/src/server/usulan.ts:64` (`buildFacts`)
- Modify: `frontend/src/server/narasi.ts:10` (`renderTemplate` cabang `csr`)
- Modify: `frontend/src/components/usulan/DokumenUsulan.tsx:31,95` (sapaan dan dasar)
- Test: `frontend/src/server/usulan.test.ts`, `frontend/src/server/narasi.test.ts`

**Interfaces:**
- Consumes: `DesaCard.sumberApi.htiNama`, `DesaCard.desa.provKode` (Task 3).
- Produces: fakta beku baru di `facts`: `penerima_nama` (nama HTI pertama, atau `"Perusahaan pemegang izin di sekitar desa"`), `dasar_pemegang_izin` (teks per provinsi di bawah). Tipe `Kanal` **tidak berubah**, jadi skema `usulan` tidak berubah.

**[Koreksi audit]** Teks dasar di bawah hanya boleh masuk kode setelah M5 selesai. `referensi_pergub.csv` saat ini hanya memuat Pasal 8, 18, dan 19. Bila M5 belum selesai, `dasar_pemegang_izin` diisi string kosong dan `DokumenUsulan` tidak menampilkan baris "Dasar" untuk kanal `csr`. Tambah tes `dokumen csr tanpa dasar tidak menampilkan baris Dasar`.

Teks dasar yang dibekukan:
- Kalteng (`62`): `"Pergub Kalimantan Tengah 35/2025 Pasal 4 ayat (1) huruf a dan Pasal 17 ayat (1): pemegang izin di bidang kehutanan wajib membentuk MPA pada wilayah perizinannya; Pasal 26 ayat (1): pendanaannya dibebankan kepada pemegang izin."`
- Kalbar (`61`): `"Pergub Kalimantan Barat 56/2025 Pasal 24 ayat (1) huruf f dan g: pelaku usaha wajib memiliki sarana dan prasarana pencegahan, menyediakan dana yang memadai, serta membentuk kelompok masyarakat di sekitar perusahaan."`

- [ ] **Step 1: Tulis tes yang gagal**

```ts
it("buildFacts csr Kalteng membekukan nama dan dasar", async () => {
  const f = await buildFacts(KODE_HTI_KALTENG);
  expect(f.penerima_nama).toBe("PT Contoh Uji");
  expect(f.dasar_pemegang_izin).toMatch(/^Pergub Kalimantan Tengah 35\/2025 Pasal 4/);
});
it("buildFacts tanpa HTI memakai sapaan umum", async () => {
  expect((await buildFacts(KODE_TANPA)).penerima_nama).toBe("Perusahaan pemegang izin di sekitar desa");
});
it("template csr menyebut nama dan tidak menuduh", () => {
  const t = renderTemplate(faktaCsr, "csr");
  expect(t).toContain("PT Contoh Uji");
  expect(t.toLowerCase()).not.toMatch(/penyebab|dibakar oleh|pelaku/);
});
it("usulan lama tanpa penerima_nama tetap terbaca", async () => {
  // baris usulan lama di DB uji dengan facts tanpa kunci baru
  await expect(getUsulan(KODE_LAMA, ID_LAMA)).resolves.toBeTruthy();
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/usulan.test.ts src/server/narasi.test.ts`
Expected: FAIL, kunci fakta baru belum ada.

- [ ] **Step 3: Implementasikan**

`KANAL_META.csr` menjadi `{ label: "Pemegang izin / CSR perusahaan sekitar", sapaan: "Pimpinan perusahaan pemegang izin", penekanan: "Kewajiban membentuk dan mendanai MPA, daftar barang" }`. `DokumenUsulan` memakai `facts.penerima_nama` bila ada, selain itu `KANAL_META.sapaan`, dan menampilkan `facts.dasar_pemegang_izin` untuk kanal `csr`. Ini meniru pola `TEKS_DASAR_APBDES` yang sudah ada.

- [ ] **Step 4: Jalankan, pastikan lulus**

Run: `cd frontend && npm test && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src
git commit -m "feat(usulan): address permit holders by name with the read Pergub basis"
```

### Task 6: Status tindak lanjut usulan

**Files:**
- Modify: `db/schema.sql` (tabel `usulan_status`)
- Modify: `frontend/src/server/usulan.ts` (fungsi status), `frontend/src/lib/types.ts`
- Create: `frontend/src/app/api/desa/[kode]/usulan/[id]/status/route.ts`
- Modify: `frontend/src/components/usulan/UsulanView.tsx` (status per usulan di daftar)
- Test: `frontend/src/server/usulan.test.ts`, `pipeline/tests/test_schema.py`

**Interfaces:**
- Consumes: `usulan`, `akun`, `auditStatement`, `HttpError`, dan pola otorisasi desa route handler yang sudah ada.
- Produces:
  - `type StatusUsulan = "terkirim" | "ditanggapi" | "didanai_sebagian" | "didanai" | "ditolak"`
  - `catatStatusUsulan(kode: string, usulanId: number, akunId: number, input: { status: StatusUsulan; tanggal: string; catatan: string }): Promise<void>`
  - `Usulan.statusTerakhir: { status: StatusUsulan; tanggal: string } | null`
  - `POST /api/desa/[kode]/usulan/[id]/status` → 201, hanya peran `desa`.

```sql
CREATE TABLE usulan_status (
  id INTEGER PRIMARY KEY,
  usulan_id INTEGER NOT NULL REFERENCES usulan(id),
  status TEXT NOT NULL CHECK (status IN ('terkirim','ditanggapi','didanai_sebagian','didanai','ditolak')),
  tanggal TEXT NOT NULL,
  catatan TEXT NOT NULL CHECK (length(catatan) <= 500),
  created_by INTEGER NOT NULL REFERENCES akun(id),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_usulan_status ON usulan_status(usulan_id, created_at);
```

- [ ] **Step 1: Tulis tes yang gagal**

```ts
it("status usulan dicatat dan masuk audit", async () => {
  await catatStatusUsulan(KODE, ID, AKUN_DESA, { status: "terkirim", tanggal: "2026-11-13", catatan: "Surel ke BPBD" });
  expect((await getUsulan(KODE, ID)).statusTerakhir).toEqual({ status: "terkirim", tanggal: "2026-11-13" });
  expect(await hitungAudit("status_usulan")).toBe(1);
});
it("status usulan desa lain ditolak", async () => {
  await expect(catatStatusUsulan(KODE_LAIN, ID, AKUN_DESA, ok)).rejects.toMatchObject({ status: 404 });
});
it("status tidak dikenal ditolak", async () => {
  await expect(catatStatusUsulan(KODE, ID, AKUN_DESA, { ...ok, status: "lunas" as never })).rejects.toMatchObject({ status: 422 });
});
it("tanggal di masa depan ditolak", async () => {
  await expect(catatStatusUsulan(KODE, ID, AKUN_DESA, { ...ok, tanggal: "2099-01-01" })).rejects.toMatchObject({ status: 422 });
});
```

```python
def test_schema_usulan_status_menolak_status_asing(conn):
    with pytest.raises(sqlite3.IntegrityError):
        conn.execute("INSERT INTO usulan_status (usulan_id,status,tanggal,catatan,created_by,created_at) VALUES (1,'lunas','2026-11-13','',1,'x')")
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/usulan.test.ts` dan `uv run pytest pipeline/tests/test_schema.py -q`
Expected: FAIL.

- [ ] **Step 3: Implementasikan**

Validasi dengan `zod` yang sudah dipakai route lain. `catatStatusUsulan` memastikan `usulan.desa_kode = kode`; bila tidak cocok, kembalikan 404, bukan 403. Insert status dan `auditStatement(akunId, kode, "status_usulan", {...})` dalam satu transaksi. Status hanya ditambah (append-only), tanpa update atau delete. **[Koreksi audit]** "Tanggal di masa depan" dibandingkan dengan tanggal WIB, bukan UTC: `const hariIniWib = new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10)`. Tanpa ini, isian pukul 00.00 sampai 07.00 WIB ditolak. Tambah tes dengan `vi.setSystemTime("2026-11-13T18:30:00Z")` dan tanggal `"2026-11-14"` yang harus diterima. `UsulanView` menampilkan status terakhir dan formulir kecil (pilihan status, tanggal, catatan) di tiap baris daftar.

- [ ] **Step 4: Jalankan, pastikan lulus**

Run: `cd frontend && npm test && npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add db/schema.sql frontend/src pipeline/tests/test_schema.py
git commit -m "feat(usulan): record follow-up status of each proposal, append-only"
```

### Task 7: Agregat jujur di halaman Data dan README

**Files:**
- Modify: `frontend/src/server/queries.ts` (agregat), `frontend/src/components/data/DataView.tsx`, `frontend/src/app/data/page.tsx`
- Modify: `README.md` (bagian "Batas klaim" dan atribusi), `docs/v2/00_JOBDESK.md` §3 (kata terlarang baru)
- Test: `frontend/src/server/queries.test.ts`

**Interfaces:**
- Consumes: `usulan`, `usulan_status` (Task 6).
- Produces: `getRekapUsulan(): Promise<{ kanal: Kanal; terbit: number; ditanggapi: number; didanai: number }[]>`, dengan "ditanggapi" dan "didanai" dihitung dari status terakhir tiap usulan. `didanai` mencakup `didanai_sebagian`. **[Koreksi audit]** Kueri mengecualikan usulan buatan akun demo (`JOIN akun a ON a.id = u.created_by WHERE a.is_demo = 0`), karena data uji tidak boleh tampil sebagai hasil. Tambah tes `rekap tidak menghitung usulan akun demo`.

- [ ] **Step 1: Tulis tes yang gagal**

```ts
it("rekap usulan kosong tetap mengembalikan empat kanal bernilai nol", async () => {
  expect(await getRekapUsulan()).toEqual([
    { kanal: "apbdes_perubahan", terbit: 0, ditanggapi: 0, didanai: 0 },
    { kanal: "bpbd", terbit: 0, ditanggapi: 0, didanai: 0 },
    { kanal: "daops", terbit: 0, ditanggapi: 0, didanai: 0 },
    { kanal: "csr", terbit: 0, ditanggapi: 0, didanai: 0 },
  ]);
});
it("rekap memakai status terakhir dan tidak membawa kode desa", async () => {
  const r = await getRekapUsulan();
  expect(JSON.stringify(r)).not.toMatch(/desa|kode/);
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/queries.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementasikan**

`DataView` menambah bagian "Apakah usulan diterima?". Isinya tabel rekap per kanal, ditambah kalimat tetap: `"Belum ada usulan yang tercatat didanai. Angka ini diisi oleh desa sendiri dan tidak diverifikasi tim."` saat semua `didanai = 0`. Jika M3 mendapat jawaban tertulis, tambahkan kutipan pendek dan tanggalnya di bagian yang sama, dengan nama instansi hanya bila instansi mengizinkan. README memuat atribusi Trase (CC BY 4.0) dan Descals (lisensi dari M2), alasan konsesi sawit GFW Indonesia tidak dipakai, dan batas klaim fitur A dan B.

- [ ] **Step 4: Gerbang akhir**

Run: `make gate` (atau padanannya: `cd frontend && npm test && npm run typecheck && npm run lint && npm run build`, lalu `uv run pytest pipeline/tests -q`)
Expected: semuanya PASS. `grep -rniE "penyebab|dibakar oleh|asal api|perusahaan membakar" frontend/src README.md` tidak menemukan klaim produk.

- [ ] **Step 5: Commit**

```bash
git add frontend/src README.md docs/v2/00_JOBDESK.md
git commit -m "feat(data): honest proposal outcome tally and claim limits"
```

---

## Bagian C: Ringkasan AI dan narasi usulan dengan OpenAI

### Apa yang diambil dari Sparekit, dan apa yang tidak

Rujukan: `caliber-final/app/lib/ai.ts`, `lib/assistant.ts` (fungsi `brief`), `components/ai-brief.tsx`, `app/api/ai/brief/route.ts`. Tidak ada berkas yang disalin.

| Pola Sparekit | Di SiapKemarau |
|---|---|
| "OpenAI is the writer, never the calculator": fakta disusun server, permintaan hanya menyebut halaman | **Diambil.** Klien hanya mengirim `{ halaman, kode }` |
| `response_format: json_schema` dengan `strict: true`, keluaran `{ headline, points }` | **Diambil**, dengan nama `{ judul, butir }` |
| Tanpa kunci atau saat galat: template, dan labelnya berkata jujur | **Diambil.** Memakai `AiBadge` yang sudah ada |
| Timeout dengan `AbortSignal.timeout`, `max_completion_tokens: 2000` | **Diambil**, timeout 15 detik sesuai TRD §7 |
| Kepercayaan pada prompt ("copy the numbers exactly") | **Diperketat.** PRD menuntut 100% keluaran lolos pengaman, jadi ada validator angka |
| Batas per jam dan cache di memori proses | **Diganti.** Batas memakai tabel `rate_limit` (`hitRateLimit`). Cache memori tetap ada, hanya sebagai penghemat |
| Popover Radix, ikon lucide | **Ditolak** (TRD: tanpa pustaka komponen). Pakai `<details>` bawaan |
| Obrolan dengan tool calls, "Ask a follow-up", draf surel, memo | **Ditolak.** Di luar cakupan PRD §10 |
| Teks 11,5 sampai 13 px | **Ditolak.** Minimum 14 px |

### Alur

```text
klien: POST /api/ringkasan { halaman, kode? }
  -> otorisasi per halaman, lalu hitRateLimit
  -> faktaRingkasan(halaman, kode)        angka sudah diformat, tanpa nama wilayah
  -> cache memori (kunci: halaman + JSON fakta)
  -> tulisJson(system, "FAKTA\n" + JSON)  OpenAI, json_schema strict, 15 detik
  -> validasiRingkasan(keluaran, fakta)   bentuk, angka, kata terlarang
       gagal atau null -> templateRingkasan(halaman, fakta), sumber "template"
       lolos           -> sumber "ai", model = nama model
```

### Lingkungan baru

```text
OPENAI_API_KEY=            # sudah ada; kosong: ringkasan dan narasi memakai template
OPENAI_MODEL_RINGKASAN=    # kosong: memakai OPENAI_MODEL_CLASSIFIER, lalu gpt-6-luna
```

### Fakta per halaman

Semua nilai berupa string yang sudah diformat dengan `formatAngka`, `formatSkor`, `formatRupiah`, atau `formatPersen`, supaya angka yang disalin model sama persis dengan yang tampil di layar. Nama field sumber diambil dari `lib/types.ts`; jangan menebak.

| Halaman | Akses | Sumber | Kunci fakta |
|---|---|---|---|
| `paparan` | Publik | `getDesaCard(kode)` | `k_ext`, `n_ext`, `tahun_ekstrem`, `tahun_terdeteksi`, `tahun_tenang`, `tingkat`, `porsi_gambut`, `tampak_aman` (sudah melewati `labelTampakAman`), `kecamatan_rata_rata`; bila ada `sumberApi`: `porsi_penyangga`, `porsi_hti` |
| `kesiapan` | `mpa`, `desa` | `getKesiapan(kode)`, `getCatalog()` | `skor`, `status`, `rantai_terlemah`, `lengkap`, `item` (larik "Nama: berfungsi dari target satuan") |
| `prioritas` | `desa` | `getPrioritas(kode)`, `getCatalog()` | `pagu`, `total_terpilih`, `skor`, `skor_sesudah`, `terpilih` (larik "Aksi Nama qty satuan, biaya"), `jumlah_tidak_terpilih` |
| `timemachine` | Publik | `getBacktest()` | `keputusan_gerbang`, `kesimpulan_2026` (dari `kesimpulanBacktest`), `data_akhir_2026`, metrik `capture_20` untuk `paparan` dan `acak` pada 2026 |

Setiap set fakta juga memuat `catatan_wajib`, kalimat batas klaim halaman itu. Contoh untuk `paparan`: "Tanpa deteksi satelit bukan berarti aman. Ini deteksi satelit, bukan luas terbakar."

---

### Task C1: Pemanggil OpenAI bersama

**Files:**
- Create: `frontend/src/server/llm.ts`
- Modify: `frontend/src/server/parseInventaris.ts:60` (ekspor `teksDariJawaban`)
- Modify: `frontend/.env.example`
- Test: `frontend/src/server/llm.test.ts`

**Interfaces:**
- Consumes: `teksDariJawaban(data: unknown, label: string): string` dari `parseInventaris.ts`.
- Produces:
  - `modelPenulis(): string`
  - `tulisJson(system: string, user: string, skema: { name: string; schema: object }): Promise<string | null>`. Tidak pernah melempar. `null` berarti tanpa kunci, HTTP bukan 2xx, waktu habis, atau jawaban kosong.

- [ ] **Step 1: Tulis tes yang gagal**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { modelPenulis, tulisJson } from "./llm";

const SKEMA = { name: "uji", schema: { type: "object" } };
const jawab = (content: string, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status }));

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("tulisJson", () => {
  it("null tanpa kunci, tanpa memanggil fetch", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const f = jawab("{}"); vi.stubGlobal("fetch", f);
    expect(await tulisJson("s", "u", SKEMA)).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
  it("mengembalikan isi pesan", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", jawab('{"a":1}'));
    expect(await tulisJson("s", "u", SKEMA)).toBe('{"a":1}');
  });
  it("mengirim json_schema strict dan model dari env", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubEnv("OPENAI_MODEL_RINGKASAN", "model-uji");
    const f = jawab("{}"); vi.stubGlobal("fetch", f);
    await tulisJson("s", "u", SKEMA);
    const body = JSON.parse(String((f.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(body.model).toBe("model-uji");
    expect(body.response_format.json_schema).toMatchObject({ name: "uji", strict: true });
  });
  it("null saat HTTP 500", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", jawab("x", 500));
    expect(await tulisJson("s", "u", SKEMA)).toBeNull();
  });
  it("null saat fetch melempar", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("putus"); }));
    expect(await tulisJson("s", "u", SKEMA)).toBeNull();
  });
  it("model jatuh ke classifier lalu bawaan", () => {
    vi.stubEnv("OPENAI_MODEL_RINGKASAN", ""); vi.stubEnv("OPENAI_MODEL_CLASSIFIER", "");
    expect(modelPenulis()).toBe("gpt-6-luna");
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/llm.test.ts`
Expected: FAIL, modul `./llm` tidak ada.

- [ ] **Step 3: Implementasikan**

```ts
// frontend/src/server/llm.ts
import { teksDariJawaban } from "./parseInventaris";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const modelPenulis = () =>
  process.env.OPENAI_MODEL_RINGKASAN || process.env.OPENAI_MODEL_CLASSIFIER || "gpt-6-luna";

/** OpenAI hanya menulis. `null` berarti pemanggil harus memakai template. Tidak pernah melempar. */
export async function tulisJson(
  system: string,
  user: string,
  skema: { name: string; schema: object },
): Promise<string | null> {
  const kunci = process.env.OPENAI_API_KEY;
  if (!kunci) return null;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${kunci}` },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model: modelPenulis(),
        max_completion_tokens: 2000,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        response_format: { type: "json_schema", json_schema: { name: skema.name, strict: true, schema: skema.schema } },
      }),
    });
    if (!res.ok) {
      console.error("[llm] OpenAI", res.status); // badan respons tidak dicatat: bisa memuat potongan prompt
      return null;
    }
    return teksDariJawaban(await res.json(), "OpenAI").trim() || null;
  } catch (e) {
    console.error("[llm] OpenAI gagal:", e instanceof Error ? e.message : e);
    return null;
  }
}
```

Tambahkan `export` pada `function teksDariJawaban` di `parseInventaris.ts`. Tambahkan ke `frontend/.env.example`:

```text
OPENAI_MODEL_RINGKASAN=                # kosong: memakai OPENAI_MODEL_CLASSIFIER, lalu gpt-6-luna
```

- [ ] **Step 4: Jalankan, pastikan lulus, lalu satu panggilan nyata (butuh M6)**

Run: `cd frontend && npx vitest run src/server/llm.test.ts src/server/parseInventaris.test.ts`
Expected: PASS. Lalu satu panggilan nyata dari `npx tsx` dengan skema `{ judul: string }` untuk memastikan model di `.env` menerima `json_schema`. Bila API membalas 400, catat pesannya dan ganti model di `.env`, bukan di kode.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/server/llm.ts frontend/src/server/llm.test.ts frontend/src/server/parseInventaris.ts frontend/.env.example
git commit -m "feat(ai): add shared OpenAI JSON writer with silent fallback"
```

### Task C2: Fakta, pengaman, dan template ringkasan

**Files:**
- Create: `frontend/src/server/ringkasan.ts`
- Modify: `frontend/src/lib/types.ts` (tipe `HalamanRingkasan`, `Ringkasan`)
- Test: `frontend/src/server/ringkasan.test.ts`

**Interfaces:**
- Consumes: `tulisJson`, `modelPenulis` (C1); `getDesaCard`, `getBacktest`, `getCatalog` dari `queries.ts`; `getKesiapan`; `getPrioritas`; `headlinePaparan`, `labelTampakAman`, `LABEL_TIER` dari `lib/kalimat.ts`; `kesimpulanBacktest` dari `lib/backtest.ts`; pemformat dari `lib/format.ts`.
- Produces:
  - `type HalamanRingkasan = "paparan" | "kesiapan" | "prioritas" | "timemachine"`
  - `interface Ringkasan { judul: string; butir: string[]; sumber: SumberTeks; model: string | null }`
  - `type Fakta = Record<string, string | string[]>`
  - `KATA_TERLARANG: string[]`
  - `faktaRingkasan(halaman: HalamanRingkasan, kode?: string): Promise<Fakta>`. Melempar `HttpError` 404 bila desa tidak ada, 400 bila `kode` kosong untuk halaman berdesa.
  - `validasiRingkasan(keluaran: unknown, fakta: Fakta): { ok: boolean; pelanggaran: string[] }`
  - `templateRingkasan(halaman: HalamanRingkasan, fakta: Fakta): { judul: string; butir: string[] }`
  - `getRingkasan(halaman: HalamanRingkasan, kode?: string): Promise<Ringkasan>`

- [ ] **Step 1: Tulis tes yang gagal**

```ts
const FAKTA = {
  k_ext: "3", n_ext: "4", tahun_ekstrem: ["2015", "2019", "2023", "2026"],
  tahun_terdeteksi: ["2015", "2019", "2023"], tahun_tenang: "3", tingkat: "Paparan tinggi",
  porsi_gambut: "37%", catatan_wajib: "Tanpa deteksi satelit bukan berarti aman.",
};
const baik = { judul: "Desa ini terdeteksi satelit pada 3 dari 4 tahun kering ekstrem.", butir: ["Tahun 2015, 2019, dan 2023 terdeteksi.", "3 tahun terakhir tenang, tetapi itu bukan jaminan aman.", "Periksa kesiapan alat sebelum musim kering."] };

describe("validasiRingkasan", () => {
  it("menerima keluaran yang hanya memakai angka fakta", () => {
    expect(validasiRingkasan(baik, FAKTA)).toEqual({ ok: true, pelanggaran: [] });
  });
  it("menolak angka di luar fakta", () => {
    const r = validasiRingkasan({ ...baik, butir: [baik.butir[0], baik.butir[1], "Desa butuh 7 pompa."] }, FAKTA);
    expect(r.ok).toBe(false);
    expect(r.pelanggaran).toContain("angka:7");
  });
  it("menolak pecahan angka fakta", () => {
    // "37%" ada di fakta, "3,7" tidak
    expect(validasiRingkasan({ ...baik, judul: "Porsi gambut 3,7 persen." }, FAKTA).ok).toBe(false);
  });
  it("menolak kata terlarang", () => {
    expect(validasiRingkasan({ ...baik, judul: "Penyebab api di desa ini jelas." }, FAKTA).ok).toBe(false);
  });
  it("menolak jumlah butir selain tiga", () => {
    expect(validasiRingkasan({ ...baik, butir: baik.butir.slice(0, 2) }, FAKTA).ok).toBe(false);
  });
  it("menolak markdown, placeholder, dan teks kepanjangan", () => {
    expect(validasiRingkasan({ ...baik, judul: "**Tebal**" }, FAKTA).ok).toBe(false);
    expect(validasiRingkasan({ ...baik, judul: "{{desa}} siap." }, FAKTA).ok).toBe(false);
    expect(validasiRingkasan({ ...baik, judul: "a".repeat(161) }, FAKTA).ok).toBe(false);
  });
  it("menolak bentuk asing", () => {
    expect(validasiRingkasan("teks", FAKTA).ok).toBe(false);
    expect(validasiRingkasan({ judul: 1, butir: [] }, FAKTA).ok).toBe(false);
  });
});

describe("templateRingkasan", () => {
  it("paparan memakai headlinePaparan dan lolos pengamannya sendiri", () => {
    const t = templateRingkasan("paparan", FAKTA);
    expect(t.judul).toBe("Terdeteksi satelit pada 3 dari 4 tahun kering ekstrem. 3 tahun terakhir tenang.");
    expect(t.butir).toHaveLength(3);
    expect(validasiRingkasan(t, FAKTA).ok).toBe(true);
  });
  it.each(["kesiapan", "prioritas", "timemachine"] as const)("template %s lolos pengaman", async (h) => {
    const f = await faktaRingkasan(h, h === "timemachine" ? undefined : KODE_UJI);
    expect(validasiRingkasan(templateRingkasan(h, f), f).ok).toBe(true);
  });
});

describe("faktaRingkasan", () => {
  it("fakta tidak memuat nama wilayah", async () => {
    const card = (await getDesaCard(KODE_UJI))!;
    for (const h of ["paparan", "kesiapan", "prioritas"] as const) {
      const s = JSON.stringify(await faktaRingkasan(h, KODE_UJI));
      for (const nama of [card.desa.nama, card.desa.kecNama, card.desa.kabNama, KODE_UJI]) expect(s).not.toContain(nama);
    }
  });
  it("desa tak dikenal 404", async () => {
    await expect(faktaRingkasan("paparan", "TIDAK_ADA")).rejects.toMatchObject({ status: 404 });
  });
});

describe("getRingkasan", () => {
  it("template tanpa kunci", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    expect(await getRingkasan("paparan", KODE_UJI)).toMatchObject({ sumber: "template", model: null });
  });
  it("ai saat keluaran lolos, dan panggilan kedua memakai cache", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    const f = await faktaRingkasan("paparan", KODE_UJI);
    const fetchUji = jawab(JSON.stringify(templateRingkasan("paparan", f))); // teks yang pasti lolos
    vi.stubGlobal("fetch", fetchUji);
    expect((await getRingkasan("paparan", KODE_UJI)).sumber).toBe("ai");
    await getRingkasan("paparan", KODE_UJI);
    expect(fetchUji).toHaveBeenCalledTimes(1);
  });
  it("jatuh ke template saat AI melanggar, dan pelanggaran tidak di-cache", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    const fetchUji = jawab(JSON.stringify({ judul: "Butuh 7 pompa.", butir: ["a", "b", "c"] }));
    vi.stubGlobal("fetch", fetchUji);
    expect((await getRingkasan("kesiapan", KODE_UJI)).sumber).toBe("template");
    await getRingkasan("kesiapan", KODE_UJI);
    expect(fetchUji).toHaveBeenCalledTimes(2);
  });
  it("jatuh ke template saat fetch gagal", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("putus"); }));
    expect((await getRingkasan("timemachine")).sumber).toBe("template");
  });
});
```

`KODE_UJI` dan penyiapan DB mengikuti `queries.test.ts` (`src/test/testDb.ts`). `jawab` sama dengan di `llm.test.ts`.

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/ringkasan.test.ts`
Expected: FAIL, modul `./ringkasan` tidak ada.

- [ ] **Step 3: Implementasikan**

Inti pengaman dan orkestrasi, ditulis persis:

```ts
const ANGKA = /\d+(?:[.,]\d+)*/g;
const MAKS_JUDUL = 160;
const MAKS_BUTIR = 240;

export const KATA_TERLARANG = [
  "penyebab", "pelaku", "dibakar oleh", "asal api", "perusahaan membakar",
  "hektare terselamatkan", "tervalidasi", "dijamin aman", "pasti aman", "bebas api",
];

const SKEMA = {
  name: "ringkasan",
  schema: {
    type: "object", additionalProperties: false, required: ["judul", "butir"],
    properties: { judul: { type: "string" }, butir: { type: "array", items: { type: "string" } } },
  },
};

export function validasiRingkasan(keluaran: unknown, fakta: Fakta): { ok: boolean; pelanggaran: string[] } {
  const o = keluaran as { judul?: unknown; butir?: unknown } | null;
  if (!o || typeof o.judul !== "string" || !Array.isArray(o.butir) || o.butir.some((b) => typeof b !== "string")) {
    return { ok: false, pelanggaran: ["bentuk"] };
  }
  const butir = o.butir as string[];
  const p: string[] = [];
  if (butir.length !== 3) p.push("jumlah_butir");
  if (!o.judul.trim() || o.judul.length > MAKS_JUDUL) p.push("panjang_judul");
  if (butir.some((b) => !b.trim() || b.length > MAKS_BUTIR)) p.push("panjang_butir");
  const teks = [o.judul, ...butir].join("\n");
  if (/[*#`]|\{\{/.test(teks)) p.push("format");
  const boleh = new Set(JSON.stringify(Object.values(fakta)).match(ANGKA) ?? []);
  for (const a of new Set(teks.match(ANGKA) ?? [])) if (!boleh.has(a)) p.push(`angka:${a}`);
  const kecil = teks.toLowerCase();
  for (const k of KATA_TERLARANG) if (kecil.includes(k)) p.push(`kata:${k}`);
  return { ok: p.length === 0, pelanggaran: p };
}

const ATURAN =
  "Kamu menulis ringkasan satu halaman aplikasi kesiapan karhutla desa untuk perangkat desa. " +
  "Pakai hanya angka yang ada di FAKTA dan salin persis seperti tertulis. Jangan menghitung, membulatkan, atau menambah angka, tahun, nama, maupun sebab. " +
  "Sebut desa sebagai \"desa ini\". Tulis \"deteksi satelit\", bukan \"kebakaran\". Jangan menyatakan desa aman. Jangan menyebut siapa yang membakar atau dari mana api berasal. " +
  "Bahasa Indonesia baku yang sederhana, tanpa markdown. " +
  "judul: satu hal terpenting, paling banyak 20 kata. butir: tepat tiga kalimat pendek; kalimat ketiga adalah langkah pertama yang bisa dilakukan. " +
  "Isi catatan_wajib harus tetap benar dalam tulisanmu.";

// ponytail: cache di memori proses, hilang saat cold start serverless. Batas biaya dijaga
// rate_limit di DB (Task C3). Pindah ke tabel bila tagihan OpenAI jadi masalah.
const cache = new Map<string, Ringkasan>();

export async function getRingkasan(halaman: HalamanRingkasan, kode?: string): Promise<Ringkasan> {
  const fakta = await faktaRingkasan(halaman, kode);
  const kunci = `${halaman}:${JSON.stringify(fakta)}`;
  const ada = cache.get(kunci);
  if (ada) return ada;
  const mentah = await tulisJson(`${ATURAN} Halaman: ${halaman}.`, `FAKTA\n${JSON.stringify(fakta)}`, SKEMA);
  if (mentah) {
    try {
      const j = JSON.parse(mentah) as { judul: string; butir: string[] };
      const v = validasiRingkasan(j, fakta);
      if (v.ok) {
        const hasil: Ringkasan = { judul: j.judul.trim(), butir: j.butir.map((b) => b.trim()), sumber: "ai", model: modelPenulis() };
        cache.set(kunci, hasil);
        return hasil;
      }
      console.warn("[ringkasan] ditolak:", halaman, v.pelanggaran.join(","));
    } catch {
      console.warn("[ringkasan] bukan JSON:", halaman);
    }
  }
  return { ...templateRingkasan(halaman, fakta), sumber: "template", model: null };
}
```

`faktaRingkasan` mengikuti tabel "Fakta per halaman". Ketentuan:
- `paparan`: `tahun_terdeteksi` dari `card.strip.filter((s) => s.terpapar && card.tahunEkstrem.includes(s.tahun))`. `tampak_aman` berisi `"ya"` atau `"tidak"` dari `labelTampakAman`. `porsi_gambut` dari `formatPersen(card.desa.peatFrac)`.
- `kesiapan` dan `prioritas`: nama item dari katalog. Kolom `catatan` inventaris dan keputusan tidak dibaca sama sekali.
- `kode` kosong untuk halaman selain `timemachine`: `HttpError(400, "input_tidak_sah", "Kode desa wajib diisi.")`. `getDesaCard` mengembalikan `null`: `HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.")`.

`templateRingkasan`: judul `paparan` memanggil `headlinePaparan({ kExt, nExt, tahunTenang })` dari angka fakta. Judul `kesiapan`: `` `Skor kesiapan ${skor} (${status}).` ``. Judul `prioritas`: `` `Belanja terpilih ${total_terpilih} dari pagu ${pagu} menaikkan skor dari ${skor} menjadi ${skor_sesudah}.` ``. Judul `timemachine`: isi `kesimpulan_2026`. Butir pertama dan kedua dari fakta halaman itu, butir ketiga selalu `catatan_wajib`. Setiap template harus lolos `validasiRingkasan` terhadap faktanya sendiri; tes di Step 1 menjaganya.

- [ ] **Step 4: Jalankan, pastikan lulus**

Run: `cd frontend && npx vitest run src/server/ringkasan.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/server/ringkasan.ts frontend/src/server/ringkasan.test.ts frontend/src/lib/types.ts
git commit -m "feat(ai): page summaries from server facts with a number guard"
```

### Task C3: Route dan tombol "Ringkasan AI"

**Files:**
- Create: `frontend/src/app/api/ringkasan/route.ts`
- Create: `frontend/src/components/ui/RingkasanAi.tsx`
- Modify: `frontend/src/app/desa/[kode]/page.tsx`, `frontend/src/components/kesiapan/KesiapanView.tsx`, `frontend/src/components/prioritas/KepalaPrioritas.tsx`, `frontend/src/components/timemachine/TimeMachineView.tsx` (satu baris `<RingkasanAi>` masing-masing, di samping `PageHead`)
- Test: `frontend/src/app/api/ringkasan/route.test.ts`

**Interfaces:**
- Consumes: `getRingkasan` (C2); `assertOrigin`, `requireDesaAccess`, `hitRateLimit`, `ipDari` dari `server/auth.ts`; `handle`, `HttpError`; `AiBadge`.
- Produces:
  - `POST /api/ringkasan`, badan `{ halaman: HalamanRingkasan, kode?: string }`, balasan 200 `Ringkasan`.
  - `<RingkasanAi halaman={HalamanRingkasan} kode={string | undefined} />`.

Aturan akses dan batas:

| Halaman | Akses | Kunci batas | Batas |
|---|---|---|---|
| `paparan`, `timemachine` | Publik | `ringkas:${ipDari(req)}` | 20 per 60 menit |
| `kesiapan` | `requireDesaAccess(req, kode, ["mpa", "desa"])` | `ringkas:${akun.id}` | 20 per 60 menit |
| `prioritas` | `requireDesaAccess(req, kode, ["desa"])` | `ringkas:${akun.id}` | 20 per 60 menit |
| Semua | | `ringkas:global` | 300 per 60 menit |

- [ ] **Step 1: Tulis tes yang gagal**

```ts
// route.test.ts: pola dan pembantu sesi mengikuti tes route yang sudah ada (auth.test.ts)
it("paparan publik 200 dengan sumber template tanpa kunci", async () => {
  const res = await POST(req({ halaman: "paparan", kode: KODE_UJI }), {} as never);
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ sumber: "template", butir: expect.any(Array) });
});
it("halaman tak dikenal 400", async () => {
  expect((await POST(req({ halaman: "rahasia" }), {} as never)).status).toBe(400);
});
it("kesiapan tanpa sesi 401", async () => {
  expect((await POST(req({ halaman: "kesiapan", kode: KODE_UJI }), {} as never)).status).toBe(401);
});
it("ringkasan prioritas menolak peran mpa", async () => {
  expect((await POST(req({ halaman: "prioritas", kode: KODE_UJI }, SESI_MPA), {} as never)).status).toBe(403);
});
it("ringkasan desa lain ditolak tanpa memanggil OpenAI", async () => {
  const f = vi.fn(); vi.stubGlobal("fetch", f);
  const res = await POST(req({ halaman: "kesiapan", kode: KODE_LAIN }, SESI_DESA), {} as never);
  expect(res.status).toBe(403);
  expect(f).not.toHaveBeenCalled();
});
it("permintaan ke-21 dari IP yang sama 429 dengan Retry-After", async () => {
  for (let i = 0; i < 20; i++) await POST(req({ halaman: "timemachine" }), {} as never);
  const res = await POST(req({ halaman: "timemachine" }), {} as never);
  expect(res.status).toBe(429);
  expect(res.headers.get("Retry-After")).toBe("3600");
});
it("Origin asing ditolak", async () => {
  expect((await POST(req({ halaman: "timemachine" }, undefined, "https://jahat.example"), {} as never)).status).toBe(403);
});
```

`RingkasanAi.tsx` tidak punya tes otomatis: repo tidak punya jsdom maupun Testing Library (temuan P12) dan komponennya hanya memetakan balasan route ke elemen. Empat perilaku berikut dicek di browser pada Step 4:

1. Tidak ada permintaan ke `/api/ringkasan` sebelum tombol dibuka (lihat tab Network).
2. Balasan `sumber: "ai"`: judul, tiga butir, dan "Disusun AI dari data terhitung (model)".
3. Balasan `sumber: "template"`: "Disusun dari template."
4. Balasan 429 atau jaringan putus: "Ringkasan belum bisa dibuat. Coba lagi nanti." dan tombol "Coba lagi".

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/app/api/ringkasan`
Expected: FAIL, modul route tidak ada.

- [ ] **Step 3: Implementasikan**

```ts
// frontend/src/app/api/ringkasan/route.ts
import { z } from "zod";
import { assertOrigin, hitRateLimit, ipDari, requireDesaAccess } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import { getRingkasan } from "@/server/ringkasan";

// POST /api/ringkasan: ringkasan satu halaman. Klien hanya menyebut halaman; fakta disusun server.
const body = z.object({
  halaman: z.enum(["paparan", "kesiapan", "prioritas", "timemachine"], { error: "Halaman tidak dikenal." }),
  kode: z.string().min(1).max(20).optional(),
});

const lewat = () => new HttpError(429, "terlalu_banyak", "Terlalu banyak permintaan ringkasan. Coba lagi dalam 1 jam.", { "Retry-After": "3600" });

export const POST = handle(async (req) => {
  assertOrigin(req);
  const { halaman, kode } = body.parse(await req.json().catch(() => null));

  let pemilik = ipDari(req);
  if (halaman === "kesiapan" || halaman === "prioritas") {
    if (!kode) throw new HttpError(400, "input_tidak_sah", "Kode desa wajib diisi.");
    const akun = await requireDesaAccess(req, kode, halaman === "prioritas" ? ["desa"] : ["mpa", "desa"]);
    pemilik = String(akun.id);
  }
  if (!(await hitRateLimit(`ringkas:${pemilik}`, 20, 60))) throw lewat();
  if (!(await hitRateLimit("ringkas:global", 300, 60))) throw lewat();

  return Response.json(await getRingkasan(halaman, kode));
});
```

`RingkasanAi.tsx` adalah komponen klien dengan `<details>` bawaan. `onToggle` memanggil `fetch("/api/ringkasan", { method: "POST", ... })` hanya saat pertama kali dibuka. Tiga keadaan: memuat ("Membaca halaman ini…"), galat (pesan di tes dan tombol "Coba lagi"), berhasil (judul tebal, `<ul>` tiga butir, lalu `<AiBadge sumber model />`). Teks minimal 14 px, target sentuh 44 px, memakai token warna yang ada. Teks dirender sebagai teks biasa, tanpa `dangerouslySetInnerHTML`. Di bawah badge tulis satu baris tetap: "Ringkasan dibuat dari angka di halaman ini. Bukan saran resmi."

Pasang di empat tempat pada daftar Files. Di `app/desa/[kode]/page.tsx` letakkan sebelum `<DasborSatelit>`, di dalam pembungkus lebar yang sama.

- [ ] **Step 4: Jalankan, pastikan lulus, lalu cek di browser**

Run: `cd frontend && npm test && npm run typecheck && npm run lint`
Expected: PASS. Lalu `make dev`, buka `/desa/<kode uji>` pada lebar 360 px: tombol tidak melebar, tanpa kunci muncul "Disusun dari template.", dengan kunci muncul "Disusun AI dari data terhitung (...)". Bandingkan setiap angka di ringkasan dengan angka di layar.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/api/ringkasan frontend/src/components/ui/RingkasanAi.tsx frontend/src/components frontend/src/app/desa
git commit -m "feat(ai): one-tap page summary button on four pages"
```

### Task C4: Narasi usulan lewat pemanggil yang sama (menutup FR-16 dan T40)

**Files:**
- Modify: `frontend/src/server/narasi.ts`, `frontend/src/server/narasi.test.ts`
- Modify: `frontend/src/app/api/desa/[kode]/usulan/route.ts` (batas 10 per jam per akun)

**Interfaces:**
- Consumes: `tulisJson`, `modelPenulis` (C1); `renderTemplate` yang sudah ada.
- Produces (kontrak TRD §7, tidak berubah):
  - `validateNarrative(text: string, allowed: string[]): { ok: boolean; violations: string[] }`
  - `renderNarrative(text: string, facts: Record<string, string>): string`
  - `generateNarrative(facts, kanal)` tetap `Promise<{ teks; sumber: "ai" | "template"; model: string | null }>`

Narasi memakai pendekatan placeholder dari TRD §7, bukan pendekatan salin angka di C2. Alasannya: dokumen usulan ditandatangani perangkat desa, jadi model sama sekali tidak melihat angka. Model hanya menerima nama placeholder, kanal, dan label kualitatif (`status`).

- [ ] **Step 1: Tulis tes yang gagal**

Salin delapan tes plan 06 Task 19 Step 1 ke `narasi.test.ts`, dengan dua perubahan: `delete process.env.ANTHROPIC_API_KEY` menjadi `vi.stubEnv("OPENAI_API_KEY", "")`, dan `mockClaude("Butuh 7 pompa.")` menjadi `vi.stubGlobal("fetch", jawab(JSON.stringify({ teks: "Butuh 7 pompa." })))`. Tambah dua tes:

```ts
it("prompt tidak memuat nilai fakta", async () => {
  vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
  const f = jawab(JSON.stringify({ teks: "{{desa}} memiliki skor {{skor}} dan mengusulkan {{total_usulan}}." }));
  vi.stubGlobal("fetch", f);
  await generateNarrative(FACTS, "bpbd");
  const terkirim = String((f.mock.calls[0] as unknown as [string, RequestInit])[1].body);
  for (const nilai of [FACTS.desa, FACTS.kabupaten, FACTS.total_usulan, FACTS.skor]) expect(terkirim).not.toContain(nilai);
});
it("teks ai dirender dengan nilai fakta dan pernyataan asumsi tetap ada", async () => {
  vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
  vi.stubGlobal("fetch", jawab(JSON.stringify({ teks: "{{desa}} memiliki skor {{skor}} dan mengusulkan {{total_usulan}}." })));
  const n = await generateNarrative(FACTS, "bpbd");
  expect(n.sumber).toBe("ai");
  expect(n.teks).toContain("Desa Uji D memiliki skor 41,7 dan mengusulkan Rp12.179.000.");
  expect(n.teks).toContain("asumsi tim");
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `cd frontend && npx vitest run src/server/narasi.test.ts`
Expected: FAIL pada sepuluh tes baru; tiga tes lama tetap PASS.

- [ ] **Step 3: Implementasikan**

`validateNarrative` menolak sesuai TRD §7: digit di luar `{{...}}`, placeholder di luar `allowed`, pola `/\b(Desa|Kecamatan|Kabupaten|Provinsi)\s+[A-Z]/` di luar placeholder, dan hilangnya `{{desa}}`, `{{skor}}`, atau `{{total_usulan}}`. Tambahkan juga pemeriksaan `KATA_TERLARANG` dari `ringkasan.ts`. `renderNarrative` mengganti `{{kunci}}` dengan `facts[kunci]`. `generateNarrative`: panggil `tulisJson` dengan skema `{ teks: string }`; bila lolos validasi, hasilnya `renderNarrative(teks, facts) + " " + ASUMSI` dengan `sumber: "ai"` dan `model: modelPenulis()`; selain itu `renderTemplate`. Perbarui komentar berkas yang masih menyebut `ANTHROPIC_API_KEY`. Di route `POST usulan`, tambahkan `hitRateLimit(\`narasi:${akun.id}\`, 10, 60)` sebelum `terbitkanUsulan`, dengan 429 dan `Retry-After: 3600`.

- [ ] **Step 4: Jalankan, pastikan lulus, lalu terbitkan dengan dan tanpa kunci**

Run: `cd frontend && npm test && npm run typecheck`
Expected: PASS. Terbitkan satu usulan tanpa kunci dan satu dengan kunci: badge berbeda, semua angka sama.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/server/narasi.ts frontend/src/server/narasi.test.ts "frontend/src/app/api/desa/[kode]/usulan/route.ts"
git commit -m "feat(usulan): guarded AI proposal narrative with placeholder validation"
```

### Task C5: Dokumen dan pengungkapan AI

**Files:**
- Modify: `docs/v2/02_TRD.md` §7, §8, §9, §10; `docs/v2/01_PRD.md` §5 (baris FR-20); `docs/v2/00_JOBDESK.md` §2; `docs/v2/07_AUDIT.md` §6.1 (baris "Asisten AI")
- Modify: `README.md` (bagian API, Lingkungan, Penggunaan AI), `frontend/src/content/dataPage.ts` (bagian AI di halaman Data)

- [ ] **Step 1:** TRD §7: tambah subbagian "Ringkasan halaman (FR-20, P1)" berisi diagram alur di atas, tabel fakta per halaman, dan aturan validator. Ubah baris "Model" narasi menjadi `OPENAI_MODEL_RINGKASAN`, dan diagramnya dari "Claude" menjadi "OpenAI". Ganti kalimat status 11 November.
- [ ] **Step 2:** TRD §8: tambah baris `POST /api/ringkasan`, akses per halaman, dan batasnya. TRD §9 baris "Prompt injection": "Klien tidak mengirim teks ke AI ringkasan dan narasi; hanya nama halaman dan kode desa. Catatan pengguna tidak dibaca." TRD §10: tambah `OPENAI_MODEL_RINGKASAN`.
- [ ] **Step 3:** PRD: `| FR-20 | Ringkasan AI | P1 | Satu tombol per halaman: satu kalimat inti dan tiga butir. Angka hanya dari sistem. Gagal atau tanpa kunci jatuh ke template berlabel |`. Jobdesk §2: baris "AI: OpenAI untuk ringkasan dan narasi; penulis, bukan penghitung".
- [ ] **Step 4:** README "Penggunaan AI": sebut model ringkasan dan narasi, data yang dikirim (angka terhitung, nama item katalog) dan yang tidak dikirim (nama desa, catatan), serta kalimat "Pola ringkasan mengikuti proyek tim sebelumnya (Sparekit, CALIBER 2026); tidak ada berkas yang disalin." Halaman Data mendapat kalimat yang sama tentang data yang dikirim.
- [ ] **Step 5: Gerbang akhir dan commit**

Run: `make gate`
Expected: PASS. `grep -rn "ANTHROPIC" frontend/src/server/narasi.ts` kosong.

```bash
git add docs/v2 README.md frontend/src/content/dataPage.ts
git commit -m "docs: describe AI summaries, data sent to the model, and env"
```

---

## Keputusan yang menunggu Anda

| No | Keputusan | Bawaan yang dipakai plan ini |
|---|---|---|
| K1 | Narasi usulan (FR-16) memakai OpenAI, bukan Claude seperti di TRD §7 | Ya. Satu pemanggil untuk dua fitur. Bila ingin Claude tetap utama, C4 memanggil Anthropic dulu lalu `tulisJson` |
| K2 | Nama perusahaan HTI hanya tampil untuk akun desa itu sendiri | Ya (koreksi P4) |
| K3 | Ringkasan `paparan` dan `timemachine` terbuka untuk publik, biayanya ditanggung kunci tim | Ya, dengan batas 20 per jam per IP dan 300 per jam total. Alternatif: hanya untuk akun |
| K4 | Lapisan sawit Descals | Tidak dikerjakan kecuali M2 selesai sebelum Jum 12.00 |
| K5 | `three.js` di beranda bertentangan dengan 07_AUDIT dan TRD | Pertahankan, lalu catat di README dan 07_AUDIT |

## Jadwal yang disarankan

Aturan potong mengikuti plan 06: Jum 13 Nov 20.00 berhenti menambah fitur, Sab 14 Nov 20.00 submit.

| Waktu | Orang 1 (data) | Orang 2 (app) |
|---|---|---|
| Kam 12 Nov malam | **T23 dan T34 plan 08 (pipeline dasar)**. M1, M5 | M4, M6, lalu Task C1 dan C2 |
| Jum 13 Nov pagi | T34 lanjutan dan gerbang. M3 dikirim | Task C3, lalu C4 |
| Jum 13 Nov siang | Jika pipeline hidup: Task 1 dan 2 (A-lite) | Task 5, Task 6 |
| Jum 13 Nov 14.00 | **Titik potong A**: jika `siapkemarau.db` masih kosong, hentikan Task 1-4 dan bantu deploy | Task 3 dan 4 hanya bila Task 2 selesai |
| Jum 13 Nov 20.00 | **Berhenti menambah fitur** | **Berhenti menambah fitur** |
| Sab 14 Nov pagi | Jalankan ulang ekspor, M7, Task C5 | Task 7 bila sempat, `make gate`, deploy |
| Sab 14 Nov 20.00 | Submit | Submit |
