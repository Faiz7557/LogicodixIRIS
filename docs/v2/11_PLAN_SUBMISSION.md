# 11 — Menuju Submission: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menutup lima temuan kritis audit 13 November (deploy, kisah jangkar, angka bulanan buatan, README, penyajian Time Machine) dan mengirim submission yang sah sebelum Sab 14 November 20.00 WIB.

**Architecture:** Tidak ada arsitektur baru. Pipeline menambah satu tabel (`desa_bulan`) dari tanggal deteksi yang sudah dimilikinya, dan aplikasi membaca tabel itu sebagai ganti angka buatan. Sisanya perbaikan kecil di lapisan server, perubahan kalimat, dan deploy ke Vercel dengan DB Turso sesuai TRD §2.

**Tech Stack:** Next.js 16 App Router, `@libsql/client`, Vitest, Python 3.13 + geopandas, pytest, Turso, Vercel. Tanpa dependency baru.

**Spec:** [10_AUDIT_13NOV.md](10_AUDIT_13NOV.md) (sumber temuan), [00_JOBDESK.md](00_JOBDESK.md) §2-3 dan §7, [01_PRD.md](01_PRD.md), [02_TRD.md](02_TRD.md) §5 dan §9, Guidebook LOGICODIX 2026 hal. 13-21.

Plan ini menggantikan urutan kerja di plan 08 dan 09. Yang sudah selesai di sana tidak diulang. Yang dipotong ada di bagian terakhir.

## Global Constraints

- Henti menambah fitur: **Jum 13 Nov 20.00 WIB**. Target kirim: **Sab 14 Nov 20.00 WIB**. Code freeze resmi: Sab 14 Nov 23.59 WIB.
- Urutan potong dari bawah: T10, lalu T6 bagian tampilan, lalu T5 bagian animasi, lalu T4. T1, T2, T3, T7, T8, T9, dan T11 tidak boleh dipotong.
- Tanpa dependency baru, JS maupun Python.
- `pipeline/params.py` tidak diubah. Ambang gerbang, penyangga, dan `min_det_days` tetap seperti sebelum data dibuka.
- Angka yang tampil sebagai hasil harus berasal dari DB. Tidak ada angka yang dibangkitkan di klien.
- Dilarang force push, rebase, squash, dan menghapus commit. PR di-merge dengan merge commit.
- Commit hanya dari akun GitHub anggota terdaftar, satu task satu commit, pesan berawalan `feat`, `fix`, `docs`, `chore`, `style`, atau `test`. Tanpa trailer `Co-Authored-By` (Jobdesk §7).
- Kata wajib: "deteksi satelit". Kata terlarang di UI, narasi, README: "kebakaran" sebagai hasil ukur satelit, "penyebab", "pelaku", "tervalidasi pengguna", "hektare terselamatkan", "aman" untuk desa tanpa deteksi.
- Teks baru di UI minimal 14 px (`text-sm` ke atas).
- Semua P0 tetap berjalan tanpa internet dan tanpa kunci API.
- Sesudah `make pipeline-run`, DB dibuat ulang dari nol. Akun, inventaris, dan usulan harus diisi ulang. Pipeline tidak dijalankan lagi sesudah T9 Step 7.

## Review Focus

1. Desa menyetujui sebagian baris prioritas: dokumen usulan harus menulis skor sesudah dari baris yang disetujui saja. Test: `skor sesudah hanya dari baris disetujui` (T3).
2. DB lama tanpa tabel `desa_bulan`: halaman desa tetap tampil, tampilan bulanan disembunyikan, tanpa 503. Test: `kartu tetap ada tanpa tabel desa_bulan` (T4).
3. Desa-tahun tanpa deteksi: 12 angka nol, bukan galat dan bukan baris hilang. Test: `strip memuat 12 angka bulan` (T4).
4. Fold tanpa baris `acak` atau prevalensi 0: batas atas `null` dan kalimat tidak memuat `NaN` atau `Infinity`. Test: `batas atas null tanpa prevalensi` (T6).
5. Desa jangkar tidak ada di DB (DB uji): beranda tetap tampil tanpa bagian kisah. Test: `riwayat jangkar null di DB uji` (T5).
6. `DATABASE_AUTH_TOKEN` kosong di lokal: URL `file:` tetap jalan tanpa kunci `authToken`. Test: `token kosong tidak dikirim` (T1).

---

## Tugas manusia

| ID | Tugas | Pemilik | Batas |
|---|---|---|---|
| M1 | Pastikan akun `Primarizki21` dan `gbsamuel` terdaftar sebagai anggota tim di LOGICODIX. Bila tidak, tanyakan Helpdesk secara tertulis hari ini. Perbarui Jobdesk §2 baris "Tim" | Faiz (ketua) | Jum 09.00 |
| M2 | Isi 10 sel `PERLU_DIISI` di `data/manual/sumber_data.csv`: 9 lisensi (FIRMS, WRI, dua Pergub, Permendesa, Perbup, Perwal, dua Mongabay) dan periode WRI. Baca halaman lisensi tiap sumber; jangan menebak | Faiz | Jum 12.00 |
| M3 | Bagikan `siapkemarau-data.zip` (`make bundle`) ke semua anggota. Faiz dan Rafan mengekstraknya dan menjalankan aplikasi dengan DB nyata | Primarizki | Jum 08.00 |
| M4 | Buat akun Turso dan proyek Vercel. Isi `OPENAI_API_KEY` dan pasang batas belanja bulanan di dasbor OpenAI. Tentukan `DEMO_PASSWORD` | Primarizki | Jum 14.00 |
| M5 | Putuskan `papers/`, `reports/`, `research_notes/` (lihat Keputusan D4) | Semua anggota | Jum 20.00 |
| M6 | Kirim satu surel ke satu BPBD kabupaten atau Daops di Kalbar/Kalteng dengan contoh dokumen usulan cetak. Simpan jawaban apa adanya. Tidak menghalangi submission | Faiz | Jum 12.00 |
| M7 | Surat Pernyataan Orisinalitas: format resmi panitia, meterai Rp10.000 atau e-meterai, tanda tangan ketua, PDF | Faiz | Sab 12.00 |

---

## Task 1: Klien DB membaca token dan route publik tidak dibekukan saat build

**Files:**
- Modify: `frontend/src/server/db.ts`
- Create: `frontend/src/server/db.test.ts`
- Modify: `frontend/src/app/api/backtest/route.ts`, `frontend/src/app/api/data/route.ts`

**Interfaces:**
- Produces: `opsiDb(env: Record<string, string | undefined>): { url: string; authToken?: string }`. `db()` memanggil `createClient(opsiDb(process.env))`.

- [ ] **Step 1: Tulis tes yang gagal** di `db.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { opsiDb } from "./db";

describe("opsiDb", () => {
  it("bawaan berkas lokal", () => {
    expect(opsiDb({})).toEqual({ url: "file:../data/siapkemarau.db" });
  });
  it("meneruskan token Turso", () => {
    expect(opsiDb({ DATABASE_URL: "libsql://x.turso.io", DATABASE_AUTH_TOKEN: "t" }))
      .toEqual({ url: "libsql://x.turso.io", authToken: "t" });
  });
  it("token kosong tidak dikirim", () => {
    expect(opsiDb({ DATABASE_URL: "file:../data/dev.db", DATABASE_AUTH_TOKEN: "" }))
      .toEqual({ url: "file:../data/dev.db" });
  });
});
```

- [ ] **Step 2:** Jalankan `cd frontend && npx vitest run src/server/db.test.ts`. Harapan: gagal, `opsiDb` belum ada.
- [ ] **Step 3:** Tambah `opsiDb` di `db.ts` dan pakai di `db()`.
- [ ] **Step 4:** Di kedua route, panggil `await connection()` (dari `next/server`) sebagai baris pertama handler, sama seperti `app/page.tsx:30`.
- [ ] **Step 5:** Jalankan `npx vitest run` dan `npm run build`. Harapan: tes lulus; keluaran build menulis `ƒ /api/backtest` dan `ƒ /api/data`, bukan `○`.
- [ ] **Step 6:** Commit `fix(db): pass turso auth token and render public api on demand`.

## Task 2: Gabungkan PR #8 lalu PR #7

Uji gabungan lokal sudah lulus (228 tes, `tsc`, `eslint`). Task ini milik manusia karena merge adalah tindakan ke luar.

- [ ] **Step 1 (Faiz atau Primarizki):** Baca diff PR #8, lalu merge dengan **Create a merge commit**. Jangan squash.
- [ ] **Step 2:** Baca diff PR #7, khususnya `server/ringkasan.ts` dan `server/narasi.ts`. Merge dengan merge commit.
- [ ] **Step 3:** `git pull`, lalu `make gate`. Harapan: 228 tes Vitest lulus, 51 tes pytest lulus, build lulus.
- [ ] **Step 4:** Tambah `OPENAI_MODEL_RINGKASAN=` ke `frontend/.env` lokal tiap anggota (sudah ada di `.env.example` PR #7).

## Task 3: Skor sesudah di usulan hanya dari baris yang disetujui

**Files:**
- Modify: `frontend/src/lib/engine/priority.ts`, `frontend/src/server/usulan.ts:59`
- Test: `frontend/src/lib/engine/priority.test.ts`, `frontend/src/server/usulan.test.ts`

**Interfaces:**
- Consumes: `skorDari`, `round1` dari `lib/engine/readiness.ts`.
- Produces: `skorSesudahBaris(catalog: CatalogItem[], readiness: ReadinessResult, baris: Pick<PriorityRow, "itemKode" | "qty">[]): number`. Cakupan tiap item menjadi `min((berfungsi + Σqty) / target, 1)`, lalu `round1(skorDari(...))`.

- [ ] **Step 1: Tulis tes mesin yang gagal** di `priority.test.ts`

```ts
it("skor sesudah hanya menghitung baris yang diberikan", () => {
  const catalog = [
    { kode: "pompa_jinjing", nama: "Pompa jinjing", satuan: "unit", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false },
    { kode: "selang_keluar", nama: "Selang keluar", satuan: "buah", bobot: 20, kritis: true, bisaDibeli: true, punyaRusak: true, hanyaGambut: false },
  ];
  const readiness = computeReadiness(catalog,
    [{ itemKode: "pompa_jinjing", target: 1 }, { itemKode: "selang_keluar", target: 10 }],
    [{ itemKode: "pompa_jinjing", total: 0, berfungsi: 0, catatan: null }, { itemKode: "selang_keluar", total: 3, berfungsi: 3, catatan: null }]);
  expect(skorSesudahBaris(catalog, readiness, [])).toBe(15);
  expect(skorSesudahBaris(catalog, readiness, [{ itemKode: "pompa_jinjing", qty: 1 }])).toBe(65);
});
```

- [ ] **Step 2: Tulis tes server yang gagal** di `usulan.test.ts`. Pakai desa uji dan akun yang dipakai tes `fakta beku` (baris 13). Bila desa itu punya kurang dari dua baris terpilih, atur inventarisnya di dalam tes sampai ada dua.

```ts
it("skor sesudah hanya dari baris disetujui", async () => {
  const p = await getPrioritas(KODE);
  expect(p.terpilih.length).toBeGreaterThan(1);
  await setKeputusan(KODE, AKUN_ID, p.terpilih[0].itemKode, p.terpilih[0].aksi, "setuju");
  const f = await buildFacts(KODE);
  const harap = skorSesudahBaris(await getCatalog(), await getKesiapan(KODE), [p.terpilih[0]]);
  expect(f.skor_sesudah).toBe(formatSkor(harap));
  expect(f.skor_sesudah).not.toBe(formatSkor(p.skorSesudah));
});
```

- [ ] **Step 3:** Jalankan kedua berkas tes. Harapan: gagal.
- [ ] **Step 4:** Implementasi `skorSesudahBaris`, lalu ganti `usulan.ts:59` menjadi `formatSkor(skorSesudahBaris(catalog, readiness, disetujui))`.
- [ ] **Step 5:** `npx vitest run`. Harapan: semua lulus.
- [ ] **Step 6:** Commit `fix(usulan): compute score after spending from approved rows only`.

## Task 4: Hari deteksi per bulan dari data nyata

Menutup K3. Pemilik pipeline: Primarizki (punya `data/raw/`). Pemilik tampilan: Rafan.

**Files:**
- Modify: `db/schema.sql`, `pipeline/firms.py`, `pipeline/export.py:14-18`, `pipeline/run_all.py:176-227`
- Test: `pipeline/tests/test_firms.py`
- Modify: `frontend/src/lib/types.ts:144-149`, `frontend/src/server/queries.ts:85-122`, `frontend/src/test/buildTestDb.ts:145`
- Modify: `frontend/src/components/paparan/dasbor/DasborSatelit.tsx:46`, `frontend/src/components/kesiapan/KalenderSatelit.tsx:33,137,176`, `frontend/src/components/paparan/dasbor/dasar.tsx:5`
- Modify: `frontend/src/lib/satelitBulanan.ts` (hapus `sebarBulanan`, `BOBOT_MUSIM`, `HARI_BULAN`, `benih`; nama bulan tetap). Hapus `frontend/src/lib/satelitBulanan.test.ts`
- Test: `frontend/src/server/queries.test.ts`

**Interfaces:**
- Produces (Python): `desa_month(assigned: pd.DataFrame) -> pd.DataFrame` berkolom `kode, tahun, bulan, det_days`. Hanya baris dengan `det_days > 0`. `bulan` 1 sampai 12 dari `tanggal[5:7]`.
- Produces (SQL):

```sql
CREATE TABLE desa_bulan (
  kode TEXT NOT NULL REFERENCES desa(kode),
  tahun INTEGER NOT NULL,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  det_days INTEGER NOT NULL CHECK (det_days > 0),
  PRIMARY KEY (kode, tahun, bulan)
);
```

- Produces (TS): `DesaTahun.bulan: number[] | null`. Larik 12 angka (Jan sampai Des). `null` pada semua tahun bila tabel `desa_bulan` belum ada.

- [ ] **Step 1: Tulis tes pipeline yang gagal** di `test_firms.py`

```python
def test_desa_month_hitung_hari_unik_per_bulan():
    a = pd.DataFrame({"kode": ["A"] * 4, "tahun": [2026] * 4,
                      "tanggal": ["2026-08-01", "2026-08-01", "2026-08-02", "2026-09-10"]})
    assert desa_month(a).to_dict("records") == [
        {"kode": "A", "tahun": 2026, "bulan": 8, "det_days": 2},
        {"kode": "A", "tahun": 2026, "bulan": 9, "det_days": 1},
    ]

def test_desa_month_kosong():
    assert desa_month(pd.DataFrame(columns=["kode", "tahun", "tanggal"])).empty
```

- [ ] **Step 2:** `python -m pytest pipeline/tests/test_firms.py -q`. Harapan: gagal, `desa_month` belum ada.
- [ ] **Step 3:** Implementasi `desa_month`. Tambah DDL ke `db/schema.sql` sesudah `desa_tahun`. Tambah `"desa_bulan"` ke `TABLE_ORDER` sesudah `"desa_tahun"`. Di `run_all.py`, hitung `bulan = desa_month(assigned)`, masukkan ke `tabel`, dan tambahkan pemeriksaan: jumlah `det_days` per `(kode, tahun)` di `bulan` harus sama dengan `dy.det_days`; bila beda, `raise ValueError`. Cetak `tulis(f"Baris desa_bulan: {len(bulan)}")`.
- [ ] **Step 4:** `python -m pytest pipeline/tests -q`. Harapan: 53 lulus.
- [ ] **Step 5: Tulis tes server yang gagal** di `queries.test.ts`

```ts
it("strip memuat 12 angka bulan", async () => {
  const strip = (await getDesaCard("TINGGI"))!.strip;
  for (const s of strip) {
    expect(s.bulan).toHaveLength(12);
    expect(s.bulan!.reduce((a, b) => a + b, 0)).toBe(s.detDays);
  }
});
it("kartu tetap ada tanpa tabel desa_bulan", async () => {
  await db().execute("DROP TABLE desa_bulan");
  const card = await getDesaCard("TINGGI");
  expect(card).not.toBeNull();
  expect(card!.strip.every((s) => s.bulan === null)).toBe(true);
});
```

- [ ] **Step 6:** Di `buildTestDb.ts`, untuk tiap baris `desa_tahun` uji dengan `det_days > 0`, sisipkan `desa_bulan`: bulan 9 berisi `min(det_days, 30)`, sisanya ke bulan 8.
- [ ] **Step 7:** Di `getDesaCard`, baca `desa_bulan` untuk kode itu. Tangkap `HttpError` berstatus 503 dari `q()` dan jadikan `bulan: null` untuk semua tahun. Tahun tanpa baris menjadi 12 nol.
- [ ] **Step 8:** Ganti pemanggilan `sebarBulanan` di `DasborSatelit.tsx:46` dan `KalenderSatelit.tsx:33` dengan `s.bulan`. Bila `bulan === null`, kartu musim, kalender, dan balok 3D tidak dirender. Hapus chip dan kalimat "Demo" di `KalenderSatelit.tsx:137` dan `:176`. Hapus `sebarBulanan` dan tesnya.
- [ ] **Step 9:** `npx vitest run`, `npm run typecheck`, `npm run lint`. Harapan: lulus. `grep -rn "sebarBulanan\|Demo:" frontend/src` tidak mengembalikan apa pun.
- [ ] **Step 10 (Primarizki):** `make pipeline-run`. Periksa `git diff pipeline/run_output.txt`: hanya baris `Baris desa_bulan` yang bertambah dan ukuran DB yang berubah; angka lain sama. Bila angka lain berubah, berhenti dan laporkan.
- [ ] **Step 11:** Commit terpisah: `feat(pipeline): export detection days per month`, lalu `feat(paparan): read monthly detection days from database`.

**Titik potong:** bila Step 10 belum selesai Jum 16.00, Step 1-9 tetap di-merge. Tampilan bulanan tersembunyi dengan sendirinya karena tabelnya belum ada.

## Task 5: Kisah jangkar mengikuti data

Menutup K2. Menyentuh berkas Rafan; koordinasi dulu.

**Files:**
- Modify: `frontend/src/server/queries.ts`, `frontend/src/lib/kalimat.ts`
- Modify: `frontend/src/app/page.tsx:99-100,122`, `frontend/src/components/beranda/gerak/EnamTahun.tsx`
- Create: `docs/v2/HASIL_GERBANG.md`
- Test: `frontend/src/server/queries.test.ts`, `frontend/src/lib/publik.test.ts`

**Interfaces:**
- Produces: `KODE_JANGKAR = "6112070019"` dan `getRiwayatJangkar(): Promise<DesaTahun[] | null>` di `queries.ts`. Mengembalikan baris `desa_tahun` 2020 sampai 2026, atau `null` bila desa itu tidak ada di DB.
- Produces: `kisahJangkar(r: Pick<DesaTahun, "tahun" | "nDet" | "terpapar">[]): { tenang: number; maksSebelum: number; nDet2026: number }` di `kalimat.ts`. `tenang` = jumlah tahun 2020-2025 dengan `terpapar` salah. `maksSebelum` = `nDet` terbesar 2020-2025.
- `EnamTahun` menerima prop `riwayat: DesaTahun[]`.

- [ ] **Step 1: Tulis tes yang gagal**

```ts
// publik.test.ts
it("kisah jangkar dari angka nyata Kali Bandung", () => {
  const r = ([[2020, 2, true], [2021, 15, true], [2022, 0, false], [2023, 0, false], [2024, 7, true], [2025, 7, true], [2026, 365, true]] as const)
    .map(([tahun, nDet, terpapar]) => ({ tahun, nDet, terpapar }));
  expect(kisahJangkar(r)).toEqual({ tenang: 2, maksSebelum: 15, nDet2026: 365 });
});
// queries.test.ts
it("riwayat jangkar null di DB uji", async () => { expect(await getRiwayatJangkar()).toBeNull(); });
```

- [ ] **Step 2:** Jalankan. Harapan: gagal.
- [ ] **Step 3:** Implementasi kedua fungsi.
- [ ] **Step 4:** Di `page.tsx`, ambil `getRiwayatJangkar().catch(() => null)`. Render `<EnamTahun riwayat={...} />` hanya bila tidak `null`. Ganti kalimat baris 99-100 menjadi persis:

> Di Desa Kalibandung, Kubu Raya, warga menyebut enam tahun tanpa kebakaran, sehingga pos karhutla tidak dianggarkan. Saat api datang pada 2026, selang hanya 100 m dan warga patungan membeli BBM (Mongabay, 31 Agu 2026). Dana desa juga turun karena efisiensi. Ini satu kasus, bukan gambaran semua desa.

- [ ] **Step 5:** Di `EnamTahun.tsx`, ganti larik `TAHUN` tetap dan penghitung "tahun tenang" dengan batang per tahun yang tingginya `nDet` dari `riwayat`. Judul bagian menjadi "Enam tahun menurut warga, tujuh tahun menurut satelit". Kalimat di bawahnya persis:

> Menurut warga, enam tahun tanpa kebakaran (Mongabay, 31 Agu 2026). Satelit mencatat paling banyak {maksSebelum} deteksi setahun di sekitar desa pada 2020–2025, lalu {nDet2026} pada 2026. Deteksi satelit bukan luas terbakar.

Angka diformat dengan `formatAngka`. Gerak gulir yang ada dipertahankan.

- [ ] **Step 6:** Tulis `docs/v2/HASIL_GERBANG.md` dari `pipeline/run_output.txt`, tanpa angka baru: uji A (laju 0,638 lawan 0,114; 190 desa terdeteksi; lulus di 4 dari 4 kuartil luas), uji B (0,638 lawan 0,6 × 0,940), keputusan `pertahankan`, data akhir 2026-11-02, SP sampai 2026-07-31 lalu NRT, tabel riwayat Kali Bandung, dan satu paragraf: kesaksian warga dan deteksi satelit tidak sama, dan kami menampilkan keduanya.
- [ ] **Step 7:** Jalankan dengan DB nyata (M3). Buka `/`, gulir ke bagian kisah, lalu cari "Kalibandung" dan buka kartunya. Harapan: batang beranda dan strip tahun di kartu menunjukkan tahun yang sama.
- [ ] **Step 8:** `npx vitest run`. Commit `fix(beranda): show anchor village history from satellite data` dan `docs(v2): record gate result and anchor village history`.

## Task 6: Time Machine menjelaskan batas atas dan mendahulukan gerbang

Menutup K5 tanpa mengubah metrik atau parameter.

**Files:**
- Modify: `frontend/src/lib/backtest.ts`
- Modify: `frontend/src/components/timemachine/dasbor/KartuHasil.tsx:17-21,56,63-64`, `frontend/src/components/timemachine/dasbor/PapanPeringkat.tsx:31`, `frontend/src/components/timemachine/TimeMachineView.tsx:50-70`
- Test: `frontend/src/lib/publik.test.ts`

**Interfaces:**
- Produces: `prevalensi(rows: MetricRow[], tahunUji: number): number | null`. Nilai baris `unit = "desa"`, `strategi = "acak"`, `metrik = "pr_auc"`.
- Produces: `batasAtasTangkap(prev: number | null, kPersen: number): number | null`. `min(1, kPersen / 100 / prev)`; `null` bila `prev` `null` atau `<= 0`.
- `kesimpulanBacktest` memakai satu desimal (`formatAngka(x * 100, 1)`).

- [ ] **Step 1: Tulis tes yang gagal** di `publik.test.ts`. Tes lama yang mengunci kalimat pembuka diperbarui ke kalimat baru.

```ts
const baris = (strategi: Strategi, metrik: MetricRow["metrik"], nilai: number): MetricRow =>
  ({ tahunUji: 2026, unit: "desa", strategi, metrik, nilai });
const nyata2026 = [
  baris("paparan", "capture_20", 0.224885), baris("persistensi", "capture_20", 0.227035),
  baris("total_riwayat", "capture_20", 0.22765), baris("gambut", "capture_20", 0.209831),
  baris("acak", "capture_20", 0.2), baris("acak", "pr_auc", 0.878305),
];
it("batas atas dari prevalensi", () => {
  expect(prevalensi(nyata2026, 2026)).toBe(0.878305);
  expect(batasAtasTangkap(0.878305, 20)).toBeCloseTo(0.2277, 4);
  expect(batasAtasTangkap(0.1, 20)).toBe(1);
});
it("batas atas null tanpa prevalensi", () => {
  expect(prevalensi([], 2026)).toBeNull();
  expect(batasAtasTangkap(null, 20)).toBeNull();
  expect(batasAtasTangkap(0, 20)).toBeNull();
});
it("kesimpulan menyebut batas atas", () => {
  expect(kesimpulanBacktest(nyata2026, 2026)).toBe(
    "Uji 2026: 87,8% desa terdeteksi satelit, sehingga 20% desa teratas paling banyak memuat 22,8% dari desa yang terdeteksi. " +
    "Peringkat riwayat memuat 22,5%. Hasilnya kalah dari total riwayat (22,8%). Kami menampilkannya apa adanya.");
});
```

- [ ] **Step 2:** Jalankan. Harapan: gagal.
- [ ] **Step 3:** Implementasi. Bila batas atas `null`, kalimat pertama dilewati dan sisanya tetap. Cabang "unggul" memakai satu desimal juga.
- [ ] **Step 4:** Di `KartuHasil.tsx`, ganti baris "Dibanding acak · N× lebih baik" dengan "Batas atas · X%" (dari `batasAtasTangkap`), dan tulis selisih dengan satu desimal. Di `PapanPeringkat.tsx:31`, ukuran bawaan menjadi `"roc_auc"`. Di `TimeMachineView.tsx`, pindahkan `KartuGerbang` dan `KartuKohort` ke atas `KartuHasil`.
- [ ] **Step 5:** `npx vitest run`, `npm run typecheck`. Buka `/time-machine` dengan DB nyata pada lebar 375 px. Harapan: kartu gerbang tampil lebih dulu, tidak ada teks terpotong.
- [ ] **Step 6:** Commit `fix(timemachine): explain capture ceiling and lead with gate result`.

## Task 7: Data manual dan contoh env

**Files:**
- Modify: `data/manual/dq_issue.csv`, `frontend/.env.example`
- Test: `pipeline/tests/test_export.py`

- [ ] **Step 1: Tulis tes yang gagal** di `test_export.py`

```python
def test_manual_tanpa_perlu_diisi():
    for nama, df in load_manual().items():
        assert not df.astype(str).eq("PERLU_DIISI").any().any(), nama
```

- [ ] **Step 2:** Jalankan. Harapan: gagal pada `sumber_data` sampai M2 selesai. Tes ini sengaja menahan gate.
- [ ] **Step 3:** Di `dq_issue.csv`, ganti isi baris `snpp_stop` menjadi: `Data VIIRS S-NPP dipakai sampai 2 Nov 2026. Deteksi 1 Agu sampai 2 Nov 2026 berasal dari produk NRT, belum produk SP`.
- [ ] **Step 4:** Tambah dua baris:

```csv
label_jenuh,Sebagian besar desa berlabel terdeteksi,"Pada tahun uji, 81% sampai 88% desa terdeteksi satelit menurut ambang 2 hari dalam penyangga 2 km. Tangkap 10, 20, dan 30% hampir sama untuk semua strategi, jadi baca ROC-AUC dan hasil gerbang",batasan,
jangkar_kalibandung,Kesaksian warga dan satelit berbeda di Kalibandung,"Warga menyebut enam tahun tanpa kebakaran (Mongabay). Satelit mencatat deteksi di penyangga 2 km pada 2020, 2021, 2024, dan 2025. Deteksi satelit bukan luas terbakar",info,
```

- [ ] **Step 5:** Di `frontend/.env.example`, kosongkan `NINE_ROUTER_BASE_URL=` dan beri komentar `# endpoint OpenAI-compatible milik sendiri; kosong: jalur ini dilewati`.
- [ ] **Step 6 (sesudah M2):** `python -m pytest pipeline/tests -q`. Harapan: lulus.
- [ ] **Step 7:** Commit `docs(data): fill licenses, fix data notes, and blank router url in env example`.

## Task 8: README final

Menutup K4. Dikerjakan sesudah T9 Step 5 supaya URL dan akun demo terisi.

**Files:**
- Modify: `README.md`, `docs/v2/00_JOBDESK.md:24`, `docs/v2/07_AUDIT.md` (satu baris status)

- [ ] **Step 1:** Susun ulang README dengan urutan Guidebook hal. 18. Tiap butir wajib ada:

| Bagian | Isi |
|---|---|
| Tim | Nama tim, daftar anggota dan akun GitHub |
| Produk | Kategori Web, nama aplikasi, deskripsi solusi, masalah, target pengguna (sekdes dan ketua MPA desa rawan karhutla Kalbar dan Kalteng) |
| Tautan | URL aplikasi, URL video |
| Fitur yang berhasil dibuat | Hanya yang hidup di commit final. Sebut yang tidak dibuat |
| Teknologi | Framework, pustaka, DB, API, layanan pihak ketiga. Sebut `three` dan alasan menyimpang dari TRD |
| Arsitektur dan alur data | Satu diagram Mermaid: FIRMS/HDX/WRI → pipeline → SQLite → Turso → Next.js → pengguna; OpenAI hanya menerima placeholder dan fakta tanpa nama wilayah |
| Menjalankan | Bagian yang sudah ada, dirapikan |
| Variabel lingkungan | Tabel yang sudah ada, ditambah `OPENAI_MODEL_RINGKASAN` |
| Akun demo | `demo-mpa`, `demo-sekdes`, password, desa yang dipakai, pernyataan bahwa isian alatnya data uji |
| Penggunaan AI | AI coding assistant dan modelnya; model di aplikasi dan bagian yang memakainya (parse pesan, ringkasan halaman, narasi usulan); apa yang dikirim dan tidak dikirim ke model |
| Atribusi | NASA FIRMS, HDX COD-AB, WRI/GFW, dua Pergub, Perbup Sanggau, Perwal Kediri, Nurhidayah dkk. 2023, Mongabay, font, pustaka |
| Batasan | "Berbasis data publik dan belum diuji pengguna", kejenuhan label, tautan ke `HASIL_GERBANG.md` |

- [ ] **Step 2:** Hapus "Status per 11 November" dan kalimat "belum dihasilkan". Perbaiki dua kalimat `make bundle` yang bertentangan: zip memuat `data/dev.db` bila ada.
- [ ] **Step 3:** Jobdesk §2 baris "Tim" mengikuti hasil M1. Tambah satu baris status di kepala `07_AUDIT.md` yang menaut ke `10_AUDIT_13NOV.md`.
- [ ] **Step 4:** Klon bersih ke folder lain, ikuti README kata demi kata sampai `make dev` jalan. Harapan: tanpa langkah yang tidak tertulis.
- [ ] **Step 5:** Commit `docs: complete readme for submission`.

## Task 9: Deploy

Pemilik: Primarizki. Butuh T1, T2, M3, M4.

- [ ] **Step 1:** Pastikan `data/siapkemarau.db` hasil T4 Step 10 (atau hasil 12 Nov bila T4 dipotong). `sqlite3 data/siapkemarau.db "select count(*) from desa"` harus 3706.
- [ ] **Step 2:** Unggah ke Turso. Periksa dulu `turso db create --help` untuk nama flag yang berlaku, lalu:

```bash
turso db create siapkemarau --from-file data/siapkemarau.db
```

```bash
turso db show siapkemarau --url
```

```bash
turso db tokens create siapkemarau
```

- [ ] **Step 3:** Buat akun demo di DB jarak jauh, dari `frontend/`, dengan `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, dan `DEMO_PASSWORD` diset di shell (bukan di berkas yang ter-commit):

```bash
npx tsx scripts/seed-accounts.ts --desa 6112070019
```

- [ ] **Step 4:** Proyek Vercel: Root Directory `frontend`. Variabel: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `OPENAI_API_KEY`, `OPENAI_MODEL_CLASSIFIER`, `OPENAI_MODEL_RINGKASAN`, `TRUST_PROXY=1`. `ANTHROPIC_API_KEY` dan `NINE_ROUTER_*` dikosongkan kecuali kuotanya dijamin aktif selama penilaian.
- [ ] **Step 5:** Deploy dari `main`. Masuk sebagai `demo-mpa`, isi inventaris uji. Masuk sebagai `demo-sekdes`, atur pagu, setujui sebagian baris, terbitkan satu usulan.
- [ ] **Step 6: Uji asap di URL publik, dari HP Android dan dari laptop**

| Langkah | Harapan |
|---|---|
| Cari "Kalibandung" | Kartu Kali Bandung tampil; strip tahun cocok dengan beranda |
| `/time-machine` | Gerbang `pertahankan`; kalimat batas atas tampil |
| `/data` | Tidak ada `PERLU_DIISI`; catatan `label_jenuh` tampil |
| Login `demo-mpa`, simpan alat | Tersimpan; banner akun demonstrasi tampil |
| Login `demo-sekdes`, buka usulan, cetak | Skor sesudah sama dengan hitungan baris disetujui |
| Tombol Ringkasan AI di empat halaman | Ringkasan tampil; label sumber `ai` atau `template` |
| 31 pencarian dalam semenit dari satu perangkat | Perangkat itu kena 429; perangkat lain tetap bisa mencari |
| Buka `/desa/6112070019` tanpa login | Tampil; tidak ada data inventaris |
| Buka `/desa/6112070019/kesiapan` tanpa login | Dialihkan ke `/masuk` |

- [ ] **Step 7:** Catat URL di README (T8). Sesudah ini pipeline tidak dijalankan lagi dan DB Turso tidak diganti.

**Cadangan:** bila Turso atau Vercel belum hidup Sab 10.00, deploy ke satu VM atau layanan dengan disk persisten, `DATABASE_URL=file:` ke salinan DB, `npm run build && npm start`, dan `TRUST_PROXY=1` hanya bila ada reverse proxy di depannya.

## Task 10: Teks kecil di halaman publik (opsional, dipotong pertama)

**Files:** `frontend/src/components/timemachine/**`, `frontend/src/components/paparan/**`, `frontend/src/components/data/**`

- [ ] **Step 1:** `grep -rnE "text-\[(9|10|11|12|13)(\.[0-9])?px\]|text-xs" frontend/src/components/{timemachine,paparan,data}`. Ganti ke `text-sm`, kecuali label sumbu di dalam `<svg>`.
- [ ] **Step 2:** Periksa tiga halaman publik pada 375 px. Harapan: tidak ada gulir mendatar dan tidak ada teks bertumpuk. Bila satu berkas rusak tata letaknya, kembalikan berkas itu saja.
- [ ] **Step 3:** Commit `style(publik): raise small text to 14px on public pages`.

## Task 11: Submission

- [ ] **Step 1 (Jum 20.00):** Henti fitur. Sesudah ini hanya perbaikan galat, README, dan deploy.
- [ ] **Step 2:** `make gate` pada `main`. Harapan: semua lulus, termasuk `test_manual_tanpa_perlu_diisi`.
- [ ] **Step 3:** Catat hash commit final: `git rev-parse HEAD`. Pastikan Vercel men-deploy hash itu.
- [ ] **Step 4:** Rekam video dari URL publik pada commit final: satu rekaman utuh, 3.00 sampai 5.00, urutan Guidebook hal. 19 (tampilan awal, alur input sampai output, bukti fungsi utama, AI berjalan langsung). Tanpa slide atau mockup. Unggah ke YouTube Unlisted, uji di jendela penyamaran.
- [ ] **Step 5:** Periksa di jendela penyamaran: repo publik, URL aplikasi, video, PDF surat (M7).
- [ ] **Step 6 (ketua, target Sab 20.00):** Kirim lewat portal resmi. Submission hanya sekali.
- [ ] **Step 7:** Jangan mengubah repo, deployment, DB, atau video sampai pengumuman.

---

## Jadwal

| Waktu | Faiz | Rafan | Primarizki |
|---|---|---|---|
| Jum pagi | M1, M6, T1, T3 | Review PR, lalu T5 | M3, T2 (merge), T4 Step 1-4 |
| Jum siang | M2, T7 | T4 Step 5-9, T6 | T4 Step 10, M4 |
| Jum 16.00 | **Titik potong T4** | | Bundle baru dibagikan |
| Jum sore | T8 kerangka | T6 selesai, T10 bila sempat | T9 Step 1-5 |
| Jum 20.00 | **Henti fitur** | **Henti fitur** | **Henti fitur** |
| Sab pagi | M7, T8 selesai | Uji asap di HP, perbaikan galat | T9 Step 6-7 |
| Sab siang | T11 Step 2-3 | T11 Step 4 (video) | Jaga layanan |
| Sab 20.00 | **Kirim** | | |

## Yang dipotong

| Dipotong | Alasan |
|---|---|
| Plan 09 bagian A (sumber tekanan api, Task 1-4) | Butuh unduhan Trase, tabel baru, dan jalankan ulang pipeline kedua. Tidak muat sebelum henti fitur |
| Plan 09 bagian B (kanal CSR bernama, status usulan, Task 5-7) | M5 plan 09 (cocokkan pasal Pergub dengan PDF) belum dikerjakan. Tanpa itu dokumen tidak boleh menyebut dasar |
| FR-14 label kestabilan | P1, tidak ada waktu |
| Layar untuk `/api/gambut` | Tidak ada di PRD. Endpoint dibiarkan dan disebut di README |
| CI | `make gate` manual cukup untuk dua hari |
| Mengubah definisi "terpapar" atau menambah label intensitas | Mengubah metode sesudah melihat hasil. Ditulis sebagai batasan, bukan diperbaiki |

## Keputusan yang menunggu Anda

| No | Keputusan | Bawaan plan ini |
|---|---|---|
| D1 | Tagline "Enam tahun tanpa api bukan berarti aman" tetap dipakai | Ya. Gerbang memutuskan `pertahankan`, dan kisahnya sekarang diberi sumber dan angka satelit di sampingnya |
| D2 | Platform deploy | Vercel + Turso, sesuai TRD |
| D3 | Password akun demo ditulis di README publik | Ya. Akun demo memang untuk juri. Isian alatnya berlabel data uji |
| D4 | `papers/`, `reports/`, `research_notes/` | Hapus dari `HEAD` dengan satu commit `chore: remove research transcripts from repository`, sesuai Jobdesk §7. Riwayat tetap memuatnya. Hanya dieksekusi sesudah semua anggota setuju |
| D5 | Trailer `Co-Authored-By` pada commit baru | Tanpa trailer, sesuai Jobdesk §7. Penggunaan AI ditulis di README |
| D6 | Jalur parse Anthropic dan 9router di deploy | Dimatikan (kunci kosong). Satu penyedia lebih mudah dijaga kuotanya selama penilaian |
