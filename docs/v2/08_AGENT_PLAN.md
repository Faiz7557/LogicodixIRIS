# SiapKemarau v2: Agent-Driven Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task, with the agent schema in section 1. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah prototipe tampilan di `frontend/` menjadi prototipe v2 yang hidup dengan data nyata, mesin, autentikasi, dan usulan, lalu menyetel tampilannya ke bahasa visual Sparekit (caliber-final), sebelum 14 November 2026 pukul 20.00 WIB.

**Architecture:** Pipeline Python di akar repo menghasilkan `data/siapkemarau.db`. Aplikasi Next.js di `frontend/` membacanya lewat libSQL. Kode server berada di `frontend/src/server/`, fungsi murni tampilan tetap di `frontend/src/lib/`, mesin di `frontend/src/lib/engine/`. Layar yang sudah ada dipertahankan dan hanya sumber datanya diganti.

**Tech Stack:** Python 3.11+, geopandas, pyogrio, pandas, pyarrow, pytest, Next.js 16.4.5 App Router, React 19, TypeScript, Tailwind 4, `@libsql/client`, zod, `@anthropic-ai/sdk`, Vitest.

**Spec:** [00_JOBDESK.md](00_JOBDESK.md), [01_PRD.md](01_PRD.md), [02_TRD.md](02_TRD.md), [03_APP_FLOW.md](03_APP_FLOW.md), [04_DESIGN_BRIEF.md](04_DESIGN_BRIEF.md), [05_BACKEND_SCHEMA.md](05_BACKEND_SCHEMA.md), [06_IMPLEMENTATION_PLAN.md](06_IMPLEMENTATION_PLAN.md), [07_AUDIT.md](07_AUDIT.md).

**Hubungan dengan rencana 06.** Rencana 06 tetap menjadi sumber tes dan antarmuka per task. Dokumen ini menambahkan empat hal: siapa agen yang mengerjakan, urutan paralelnya, koreksi dari audit, dan pekerjaan desain. Bila 06 dan dokumen ini berbeda soal **path atau nama berkas**, dokumen ini menang. Bila berbeda soal **nilai, rumus, atau teks wajib**, docs v2 `00` sampai `05` menang.

## 1. Skema agen

| Peran | Model | Effort | Pemanggilan | Tugas |
|---|---|---|---|---|
| Orkestrator | Fable | high | Sesi utama | Membagi task, menjaga kontrak antarmuka, menjalankan gerbang, meninjau diff, commit. Tidak menulis fitur |
| Eksekutor berat | Opus | medium | `Agent({ subagent_type: "general-purpose", model: "opus", effort: "medium" })` | Task berlogika: mesin, data, autentikasi, API, pipeline, AI, penyambungan layar, komponen desain |
| Eksekutor kecil | Haiku | high | `Agent({ subagent_type: "general-purpose", model: "haiku", effort: "high" })` | Task yang isinya sudah ditentukan dokumen: salin DDL, isi CSV, pindah berkas, setel token, hapus mock, pemeriksaan `grep`, README |

**Aturan memilih model.** Jika keluaran task bisa ditulis seluruhnya dengan menyalin nilai dari dokumen, pakai Haiku. Jika ada cabang, perulangan, kueri, atau lebih dari satu berkas yang harus saling cocok, pakai Opus.

**Aturan kerja agen.**

1. Semua agen bekerja di checkout yang sama, tanpa worktree. Setiap task punya daftar berkas milik sendiri. Agen dilarang mengubah berkas di luar daftar itu. Bila perlu, agen berhenti dan melapor.
2. Agen **tidak** menjalankan `git add`, `git commit`, atau `git push`. Orkestrator yang commit, satu task satu commit atau lebih kecil.
3. Agen hanya menjalankan tes miliknya (`npx vitest run <path>` atau `py -m pytest <path> -v`). Gerbang penuh dijalankan orkestrator, karena agen lain sedang menulis di pohon yang sama.
4. Sebelum memakai API Next.js, agen membaca panduan terkait di `frontend/node_modules/next/dist/docs/` (lihat `frontend/AGENTS.md`).
5. `caliber-final` boleh dibaca sebagai rujukan di `C:\Uner\Lomba\Logicodix\caliber-final`, tetapi tidak ada berkas atau blok kode yang disalin.
6. Laporan akhir agen berisi: berkas yang diubah, perintah tes dan keluarannya, penyimpangan dari task, dan hal yang belum diverifikasi.

**Gerbang per task (orkestrator).**

```bash
cd frontend && npx vitest run <berkas tes task> && npm run typecheck && npm run lint
py -m pytest pipeline/tests/<berkas tes task> -v
git status --short                      # hanya berkas milik task
grep -rniE "hektare terselamatkan|tervalidasi|empirical bayes|berdasarkan permendesa|hotspot" frontend/src pipeline
```

Baris `grep` terakhir hanya boleh mengenai komentar larangan dan tes yang menegaskan larangan. Gerbang per gelombang: `cd frontend && npm test && npm run build`, lalu `py -m pytest pipeline/tests`.

**Eskalasi.** Task Haiku yang gagal gerbang dua kali dialihkan ke Opus medium. Task Opus yang gagal dua kali diambil alih orkestrator. Perubahan kontrak di section 4 hanya boleh dilakukan orkestrator, dan semua task yang memakainya diberi tahu.

**Templat dispatch.**

```text
Kamu mengerjakan Task <ID> dari docs/v2/08_AGENT_PLAN.md di repo C:\Uner\Lomba\Logicodix\LogicodixIRIS.
Baca: section 2, 3, 4 dokumen itu, lalu Task <ID>, lalu bagian docs/v2 yang dirujuk task.
Berkas milikmu: <daftar>. Jangan mengubah berkas lain. Jangan git add, commit, atau push.
Ikuti langkah task berurutan: tulis tes, lihat gagal, implementasi, lihat lulus.
Laporkan: berkas yang diubah, perintah tes dan keluarannya, penyimpangan, hal yang belum diverifikasi.
```

## 2. Global Constraints

Seluruh Global Constraints rencana 06 berlaku. Tambahan dan penegasan:

- Commit hanya dari akun GitHub anggota terdaftar. Dilarang force push, rebase, squash. Tarik perubahan rekan dengan `git pull --no-rebase`.
- Pesan commit berawalan `feat`, `fix`, `docs`, `style`, `refactor`, atau `chore`. Tanpa trailer `Co-Authored-By` (Jobdesk §7, keputusan 2 di audit).
- Push hanya setelah pengguna mengizinkan di awal eksekusi, lalu sekali per gelombang.
- Tidak ada berkas dari proyek lain. Rujukan desain ditulis ulang.
- Dependensi runtime baru hanya tiga: `@libsql/client`, `zod`, `@anthropic-ai/sdk`. Dependensi dev baru hanya `tsx`. Tidak ada pustaka komponen, ikon, animasi, atau grafik.
- Selalu tulis "deteksi satelit". Dilarang "hektare terselamatkan", "tervalidasi", "Empirical Bayes", "berdasarkan Permendesa 16/2025" untuk 2027, dan pasal Permendagri 20/2018.
- Harga tanpa sumber dilarang masuk data. Data contoh dilarang tampil sebagai hasil.
- Semua P0 berjalan tanpa internet dan tanpa `ANTHROPIC_API_KEY`.
- Teks minimum 14 px, target sentuh minimum 44 px, layak pada 360 px tanpa gulir horizontal, kontras AA.
- `data/siapkemarau.db` di bawah 50 MB. Poligon maksimal 4.000 byte per desa.
- Waktu disimpan ISO 8601 UTC. Rupiah bilangan bulat.

## 3. Keputusan yang dikunci plan ini

| No | Keputusan | Alasan |
|---|---|---|
| D1 | Aplikasi tetap di `frontend/`. `db/`, `data/`, `pipeline/` di akar repo. Skrip TypeScript di `frontend/scripts/` | Memindah 100 berkas di tengah minggu berisiko dan tidak menambah nilai |
| D2 | `DATABASE_URL` bawaan `file:../data/siapkemarau.db`, relatif terhadap `frontend/` | Akibat D1. Perintah final: `cd frontend && npm ci && npm run build && npm start` |
| D3 | Kode server di `frontend/src/server/`. `frontend/src/lib/` hanya berisi fungsi murni dan kode klien | Nama `lib/inventaris.ts`, `lib/kesiapan.ts`, `lib/prioritas.ts`, `lib/usulan.ts` sudah terpakai |
| D4 | Tidak ada `engine/types.ts`. Mesin mengimpor tipe dari `@/lib/types` | Satu kontrak, bukan dua |
| D5 | Docs v2 dipindah ke `docs/v2/`. `docs/00` sampai `06` lama dihapus | Jobdesk §3 dan §7 |
| D6 | Nama token Tailwind tidak berubah (`paper`, `surface`, `line`, `ink`, `muted`, `ember`, `water`, `ok`, `warn`, `danger`). Nilainya disetel, lalu ditambah pasangan `-soft` | Seluruh layar ikut berubah tanpa menyentuh komponen |
| D7 | Font antarmuka Geist lewat `next/font/google`. Dokumen cetak tetap Source Serif 4 | Rujukan Sparekit |
| D8 | Tombol utama memakai tinta (`bg-ink`, teks putih). `--ember` hanya untuk penanda paparan dan sorotan | Sparekit: tinta untuk setiap kontrol. Brief §4: ember bukan latar luas |
| D9 | Sebelum gerbang data dijalankan, keputusan gerbang dianggap `buang` | Bawaan paling hati-hati: tagline dan label "Tampak aman" tersembunyi |

Butuh persetujuan pengguna sebelum dieksekusi: langkah hapus `papers/`, `reports/`, `research_notes/` di T01, dan koordinasi dengan Rafan sebelum T24 dan T41.

## 4. Kontrak antarmuka lintas task

Path server relatif terhadap `frontend/src/`.

```ts
// server/db.ts
export function db(): Client;                       // memakai process.env.DATABASE_URL ?? "file:../data/siapkemarau.db"
export function setDb(client: Client | null): void; // hanya untuk tes

// server/http.ts
export class HttpError extends Error { constructor(public status: number, public kode: string, public pesan: string) }
export function jsonError(status: number, kode: string, pesan: string): Response; // { error: { kode, pesan } }
export function handle(fn: (req: Request, ctx: any) => Promise<Response>): (req: Request, ctx: any) => Promise<Response>;
// handle: HttpError -> jsonError; ZodError -> 400 "input_tidak_sah" dengan pesan issue pertama; lainnya -> 500 "galat_server"

// server/queries.ts
export function searchDesa(q: string): Promise<DesaHit[]>;
export function getDesaCard(kode: string): Promise<DesaCard | null>;   // termasuk gerbang
export function getGerbang(): Promise<KeputusanGerbang>;               // meta gate_hasil; tidak ada -> "buang"
export function getCatalog(): Promise<CatalogItem[]>;
export function getBacktest(): Promise<Backtest>;
export function getDataPage(): Promise<DataPage>;
export function countTampakAman(): Promise<number>;                    // desa_paparan mode live

// server/auth.ts
export function hashPassword(p: string): string;
export function verifyPassword(p: string, h: string): boolean;
export function createSession(akunId: number): Promise<string>;
export function getAkun(req: Request): Promise<Akun | null>;
export function requireDesaAccess(req: Request, kode: string, peran: Peran[]): Promise<Akun>; // HttpError 401/403
export function assertOrigin(req: Request): void;
export function hitRateLimit(kunci: string, batas: number, menit: number): Promise<boolean>;
export function getSesiAkun(): Promise<Akun | null>;                                   // Server Component, membaca cookies()
export function requireHalamanDesa(kode: string, peran: Peran[]): Promise<Akun>;       // redirect("/masuk") atau notFound()
export const COOKIE_SESI = "sk_sesi";

// server/audit.ts
export function writeAudit(akunId: number, desaKode: string, aksi: string, detail: unknown): Promise<void>;

// lib/engine
export function computeReadiness(catalog: CatalogItem[], targets: TargetRow[], inventory: InventoryRow[]): ReadinessResult;
export function rankPriorities(input: PriorityInput): PriorityResult;
export function addStability(input: PriorityInput, result: PriorityResult): PriorityResult; // P1
```

Tipe baru di `server/queries.ts`:

```ts
export interface Backtest {
  metrik: MetricRow[];                                   // tipe dari @/lib/backtest
  grup: { grup: string; strata: string; nDesa: number; nTerpapar2026: number; rate: number }[];
  gerbang: { a: boolean; b: boolean; keputusan: KeputusanGerbang };
  teratas: { kode: string; nama: string; kecNama: string; skor: number; terpapar2026: boolean }[]; // 20 teratas frozen
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
```

Kunci `meta` yang menjadi kontrak pipeline dan aplikasi, selain parameter di TRD §5:

| Kunci | Label | Isi | Penulis |
|---|---|---|---|
| `ext_years` | parameter | `2015,2019,2023,2026` | `params.py` |
| `gate_hasil` | hasil | JSON `{"a":true,"b":false,"keputusan":"lunakkan"}` | `run_all.py` |
| `data_akhir_2026` | hasil | Tanggal ISO akhir data kontinu 2026 | `run_all.py` |
| `sensitivitas` | hasil | JSON | `run_all.py` |
| `desa_jangkar` | hasil | Kode desa jangkar | `run_all.py` |

Kode desa pada DB uji (`src/test/testDb.ts`), dipakai tes di banyak task: `TINGGI`, `RENDAH`, `NONGAMBUT`, `DESA_KALTENG` (prov 62), `DESA_KALBAR` (prov 61), `KOSONG`, `D`, `BARU`, `DESA_A`, `DESA_B`, satu desa bernama `Kalibandung`, dan sisanya bernama `Desa Uji NN` sampai total 25 desa.

## 5. Review Focus

Lima kondisi yang tidak dijamin tes rencana 06 dan paling mungkin menggigit. Review Focus rencana 06 tetap berlaku.

1. Klon bersih tanpa hasil pipeline: DB kosong tanpa tabel. Halaman data harus menampilkan keadaan galat dengan tombol coba lagi, bukan halaman 500. (T11)
2. Cookie `mock-peran` peninggalan mock tidak boleh memberi akses apa pun. (T20)
3. `PUT inventaris` dengan `itemKode` di luar katalog, atau `sumur_bor` pada desa non-gambut, harus ditolak 400 dengan pesan jelas. (T30)
4. `PUT rencana` dengan pagu pecahan, negatif, atau di atas Rp1.000.000.000 harus ditolak 400, dan nilai tersimpan tidak berubah. (T32)
5. Penyetelan token tidak boleh menurunkan kontras teks di bawah 4,5. (T14)

## 6. Struktur berkas

```text
LogicodixIRIS/
  .env.example                         baru: FIRMS_MAP_KEY
  db/schema.sql                        T03
  data/manual/*.csv                    T03
  data/siapkemarau.db                  T34
  pipeline/{params,fetch_firms,wilayah,firms,paparan,backtest,export,run_all}.py
  pipeline/tests/  pipeline/requirements.txt  pipeline/run_output.txt
  docs/v2/00..08                       T01 (pindah dari v2/v2)
  frontend/
    scripts/{dev-db,seed-accounts,push-remote}.ts
    src/server/{db,http,queries,auth,audit,inventaris,efektif,kesiapan,prioritas,usulan,narasi,parseInventaris}.ts
    src/lib/engine/{readiness,priority,stability}.ts
    src/test/{testDb,fixtures}.ts
    src/app/api/...                    route handler tipis: validasi, otorisasi, panggil server/*
    src/components/ui/{Panel,PageHead}.tsx   T24
    src/mocks/                         dihapus di T42
    src/lib/dataSource.ts              dihapus di T42
```

Aturan route handler: tidak ada logika bisnis di `route.ts`. Isinya `handle(async (req, ctx) => { requireDesaAccess; parse zod; panggil server/*; Response.json })`.

## 7. Peta gelombang

| Gelombang | Kapan | Task | Agen | Bergantung pada | Rujukan 06 |
|---|---|---|---|---|---|
| 0, serial | Sel 10 Nov | T01 Rapikan repo dan dependensi | Haiku | | Task 1 |
| | | T03 Skema, parameter, data manual | Haiku | T01 | Task 2 |
| 1, paralel | Sel 10, Rab 11 | T10 Mesin kesiapan dan prioritas | Opus | T01 | Task 10, 11 |
| | | T11 Lapisan data dan DB uji | Opus | T03 | Task 9 |
| | | T12 Pipeline A: ambil, wilayah, deteksi | Opus | T03 | Task 3, 4, 5 |
| | | T13 Pipeline B: paparan, backtest, gerbang | Opus | T03 | Task 6, 7 |
| | | T14 Token desain | Haiku | T01 | |
| 2, paralel | Rab 11 | T20 Autentikasi dan audit | Opus | T11 | Task 12 |
| | | T21 Beranda dan Kartu Paparan nyata | Opus | T11 | Task 17 |
| | | T22 Time Machine dan Data nyata | Opus | T11 | Task 18 |
| | | T23 Pipeline C: ekspor dan `run_all` | Opus | T12, T13 | Task 8 |
| | | T24 Primitif dan cangkang desain | Opus | T14 | |
| 3, rantai | Rab 11, Kam 12 | T30 Catat Alat | Opus | T20 | Task 13 |
| | | T31 Paket efektif dan Kesiapan | Opus | T30, T10 | Task 14 |
| | | T32 Prioritas dan Keputusan | Opus | T31 | Task 15 |
| | | T33 Usulan dan cetak | Opus | T32 | Task 16 |
| | Kam 12 siang | T34 Jalankan nyata dan gerbang | Opus | T23, M1, M2 | Task 8 |
| 4 | Kam 12, Jum 13 | T40 Narasi AI berpengaman | Opus | T33 | Task 19 |
| | | T41a Sapuan desain halaman publik | Opus | T21, T22, T24, T34 | |
| | | T41b Sapuan desain alur desa | Opus | T33, T24 | |
| | | T42 Hapus mock | Haiku | T33, T22, T41a | |
| | | T43 Kestabilan, P1 | Opus | T32, T41b | Task 20 |
| | | T44 Tempel pesan, P1 | Opus | T30, T40, T41b | Task 21 |
| 5 | Jum 13, Sab 14 | T50 QA klaim dan daftar periksa | Haiku | T42 | Task 22 |
| | | T51 Uji keamanan, klon bersih, skrip unggah | Opus | T42 | Task 22 |
| | | T52 README | Haiku | T51 | Task 23 |

Paralel maksimum lima agen. Dua task hanya boleh berjalan bersamaan bila daftar berkasnya tidak beririsan. Pada gelombang 4, T40, T41a, dan T41b boleh paralel; T43 dan T44 menunggu T41b karena menyentuh komponen yang sama. `frontend/src/lib/types.ts` hanya boleh diubah T10 pada gelombang 1 dan orkestrator sesudahnya.

**Aturan potong.** Jumat 13 November pukul 20.00 berhenti menambah fitur. Potong dari bawah: T44, T43, T41b, T41a, FR-03, `MiniShape`. T14 selalu ikut karena murah. T40 dipotong paling akhir.

## 8. Tugas manusia

Agen tidak bisa mengerjakan ini. M1 dan M2 menentukan jalur kritis.

| No | Tugas | Batas | Rujukan 06 |
|---|---|---|---|
| M1 | Buat akun NASA Earthdata, minta `FIRMS_MAP_KEY`, isi `.env` di akar repo. Cek juga unduhan arsip tahunan per negara di situs FIRMS sebagai cadangan tanpa kunci | Sel 10 Nov | Task 0 langkah 1 sampai 3 |
| M2 | Unduh HDX COD-AB Indonesia dan WRI Global Peatlands ke `data/raw/` | Sel 10 Nov | Task 0 langkah 4 |
| M3 | Kirim pertanyaan tertulis ke Helpdesk: status "simulasi" untuk pemutaran data historis, subtema, dan pemakaian ulang bahasa visual proyek sendiri | Sel 10 Nov | Task 0 langkah 5 |
| M4 | Baca teks resmi Permendagri 20/2018, atau putuskan produk tidak menyebut pasal | Rab 11 Nov | Task 0 langkah 6 |
| M5 | Akun Turso dan Vercel, isi env, deploy | Jum 13 Nov | Task 22 langkah 5 |
| M6 | Satu orang luar tim menyelesaikan alur, catat waktu | Jum 13 Nov | Task 22 langkah 7 |
| M7 | Video, surat orisinalitas, submission | Sab 14 Nov 20.00 | Task 23 langkah 3 sampai 8 |
| M8 | Pastikan surel git lokal tertaut ke akun GitHub anggota terdaftar | Sebelum commit pertama | |
| M9 | Koreksi registry lokal `papers/papers/literature_review.md` | Sebelum mengutip di README | Task 18 langkah 1 |

---

## Gelombang 0

### Task T01: Rapikan repo dan dependensi — Haiku high

**Files:**
- Move: `v2/v2/*` ke `docs/v2/`
- Delete: `docs/00_BRIEF.md`, `docs/01_PRD.md`, `docs/02_TRD.md`, `docs/03_APP_FLOW.md`, `docs/04_DESIGN_BRIEF.md`, `docs/05_BACKEND_SCHEMA.md`, `docs/06_IMPLEMENTATION_PLAN.md`
- Create: `.env.example` (akar)
- Modify: `README.md`, `docs/FRONTEND.md`, `.gitignore`, `frontend/.env.example`, `frontend/package.json`, `frontend/package-lock.json`, komentar di `frontend/src/**` yang merujuk `v2/v2/` atau `docs/0N_`

**Interfaces:** Produces `npm run typecheck` yang lulus pada klon bersih, dan dependensi untuk semua task berikutnya.

- [ ] **Step 1:** `git mv v2/v2 docs/v2`, lalu `git rm` tujuh berkas `docs/0*.md` lama.
- [ ] **Step 2:** Ganti semua rujukan `v2/v2/` menjadi `docs/v2/` dan `docs/0N_*.md` menjadi `docs/v2/0N_*.md` pada berkas terlacak. Run `git grep -n "v2/v2"`. Expected: tidak ada hasil.
- [ ] **Step 3:** Di `frontend/package.json` ubah skrip menjadi `"typecheck": "next typegen && tsc --noEmit"`. Pastikan dulu perintah `typegen` ada di `frontend/node_modules/next/dist/docs/`.
- [ ] **Step 4:** Hapus `frontend/.next` dan `frontend/next-env.d.ts`, lalu run `npm run typecheck`. Expected: exit 0.
- [ ] **Step 5:** Buat `.env.example` di akar berisi satu baris `FIRMS_MAP_KEY=` dengan komentar "hanya dipakai pipeline". Di `frontend/.env.example` ubah `DATABASE_URL=file:../data/siapkemarau.db`. Tambah `/data/dev.db*` ke `.gitignore` akar.
- [ ] **Step 6:** Serahkan ke orkestrator untuk commit `chore: move v2 docs under docs and fix clean-clone typecheck`.
- [ ] **Step 7:** Di `frontend/`: `npm i @libsql/client zod @anthropic-ai/sdk` dan `npm i -D tsx`. Run `npm test && npm run build`. Expected: 77 tes lulus, build lulus.
- [ ] **Step 8:** Commit `chore: add database, validation and ai dependencies`.
- [ ] **Step 9, hanya bila pengguna sudah setuju:** `git mv papers/papers/data/karhutla_gambut_mineral_2020_2024.csv data/manual/`, lalu `git rm -r papers reports research_notes`, perbarui tabel struktur di `README.md`. Commit `chore: keep only v2 docs and sourced reference data in repo`.

### Task T03: Skema, parameter, dan data manual — Haiku high

**Files:** Create `db/schema.sql`, `pipeline/params.py`, `pipeline/requirements.txt`, `pipeline/tests/conftest.py`, `pipeline/tests/test_schema.py`, `data/manual/{katalog_item,paket_minimum,referensi_pergub,harga_item,sumber_data,dq_issue}.csv`.

**Interfaces:** Produces DDL Backend Schema §3 dan `PARAMS: dict[str, tuple[str, str]]` (nilai, label) berisi seluruh baris TRD §5 ditambah `ext_years` dari section 4.

- [ ] **Step 1:** Tulis empat tes rencana 06 Task 2 Step 1 di `test_schema.py`. Fixture `conn` di `conftest.py` membuka SQLite memori dan menjalankan `db/schema.sql`. Tambah satu tes: `assert PARAMS["ext_years"] == ("2015,2019,2023,2026", "parameter")`.
- [ ] **Step 2:** Run `py -m pytest pipeline/tests/test_schema.py -v`. Expected: FAIL, berkas belum ada.
- [ ] **Step 3:** Salin DDL persis dari `docs/v2/05_BACKEND_SCHEMA.md` §3. Isi CSV persis dari Backend Schema §6 dan PRD §7 dan §8. Nilai yang memuat koma diapit tanda kutip ganda. `requirements.txt`: `geopandas`, `pyogrio`, `pandas`, `pyarrow`, `pytest`.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Orkestrator membandingkan blok SQL di dokumen dengan `db/schema.sql`. Expected: tidak ada beda selain spasi akhir.
- [ ] **Step 6:** Commit `feat: add schema, gate thresholds and sourced reference data`. Commit ini wajib ada sebelum data 2026 dibuka.

---

## Gelombang 1

### Task T10: Mesin kesiapan dan prioritas — Opus medium

**Files:** Create `frontend/src/lib/engine/readiness.ts`, `priority.ts`, `readiness.test.ts`, `priority.test.ts`. Modify `frontend/src/lib/types.ts` (tambah `PriorityInput`). Jangan sentuh `src/mocks/`.

**Interfaces:** Produces `computeReadiness` dan `rankPriorities` di section 4. `PriorityInput = { catalog: CatalogItem[]; readiness: ReadinessResult; prices: PriceRow[]; paguRp: number }`.

- [ ] **Step 1:** Tulis tes rencana 06 Task 10 Step 1 dan Task 11 Step 1 tanpa mengubah nilai harapannya. Fixture `CatalogItem` wajib memuat `punyaRusak` dan `hanyaGambut`.
- [ ] **Step 2:** Run `npx vitest run src/lib/engine`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD §6. Urutan `terpilih` mengikuti urutan pemilihan pertama tiap pasangan `(item, aksi)`. Sertakan komentar `// ponytail: greedy per unit, bukan knapsack optimal. Dipilih agar bisa dijelaskan di musyawarah.`
- [ ] **Step 4:** Run tes. Expected: PASS, termasuk `[12179000, 78.2]` dan `{ qty: 3, biayaRp: 20007000 }`.
- [ ] **Step 5:** Commit `feat: add readiness engine`, lalu `feat: add budget constrained priority engine`.

### Task T11: Lapisan data dan DB uji — Opus medium

**Files:** Create `frontend/src/server/{db,http,queries}.ts`, `frontend/src/server/queries.test.ts`, `frontend/src/test/testDb.ts`, `frontend/scripts/dev-db.ts`.

**Interfaces:**
- Produces semua fungsi `server/db.ts`, `server/http.ts`, `server/queries.ts` di section 4.
- Produces `buildTestDb(url: string): Promise<Client>` (menjalankan `../db/schema.sql`, memuat `../data/manual/*.csv`, mengisi 25 desa uji di section 4) dan `useTestDb(): void` (memasang `beforeEach` yang membuat DB baru dan memanggil `setDb`).
- `scripts/dev-db.ts` memanggil `buildTestDb("file:../data/dev.db")`. Semua nama desa di dalamnya memuat kata "Uji", kecuali `Kalibandung` yang dipakai tes pencarian dan diberi kecamatan `Kecamatan Uji`.

- [ ] **Step 1:** Tulis empat tes rencana 06 Task 9 Step 1, ditambah:

```ts
it("gerbang bawaan buang sebelum pipeline jalan", async () => { expect(await getGerbang()).toBe("buang"); });
it("DB tanpa tabel melempar galat berkode", async () => {
  setDb(createClient({ url: ":memory:" }));
  await expect(searchDesa("ka")).rejects.toMatchObject({ status: 503, kode: "data_belum_ada" });
});
it("kartu memuat strip 2012-2026", async () => { expect((await getDesaCard("TINGGI"))!.strip).toHaveLength(15); });
```

- [ ] **Step 2:** Run `npx vitest run src/server/queries.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi. Semua kueri berparameter. Pencarian memakai `LIKE ? ESCAPE '\'` pada nama desa, kecamatan, dan kabupaten, `LIMIT 20`. Galat SQLite "no such table" diubah menjadi `HttpError(503, "data_belum_ada", "Data belum tersedia. Jalankan pipeline lebih dulu.")`. Pembaca CSV di `testDb.ts` cukup mendukung nilai berkutip ganda, dengan komentar `// ponytail: pembaca CSV minimal untuk enam berkas manual, bukan parser umum.`
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Run `npx tsx scripts/dev-db.ts`. Expected: `data/dev.db` terbentuk dan tidak muncul di `git status`.
- [ ] **Step 6:** Commit `feat: add data access layer and test database`.

### Task T12: Pipeline A, ambil, wilayah, deteksi — Opus medium

**Files:** Create `pipeline/fetch_firms.py`, `pipeline/wilayah.py`, `pipeline/firms.py`, `pipeline/tests/test_fetch_firms.py`, `test_wilayah.py`, `test_firms.py`. Jangan ubah `conftest.py`. Pembantu tes ditaruh di berkas tes masing-masing.

**Interfaces:** Persis blok Interfaces rencana 06 Task 3, 4, dan 5.

- [ ] **Step 1:** Tulis tes rencana 06 Task 3 Step 1, Task 4 Step 1, Task 5 Step 1. Semua geometri dan CSV sintetis dibuat di dalam tes. Tidak ada akses jaringan.
- [ ] **Step 2:** Run `py -m pytest pipeline/tests/test_fetch_firms.py pipeline/tests/test_wilayah.py pipeline/tests/test_firms.py -v`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai Step 3 ketiga task itu dan TRD §4 dan §5. Kotak area `108,-4.5,116.5,2.5`. `fetch_window` menulis ke `.tmp` lalu rename. Luas memakai EPSG:6933. Penyangga di EPSG:3857 dengan komentar `ponytail:` soal akurasi dekat khatulistiwa.
- [ ] **Step 4:** Run tes. Expected: PASS. Langkah yang memakai data nyata (06 Task 3 Step 5, Task 4 Step 4, Task 5 Step 4) dikerjakan di T34.
- [ ] **Step 5:** Tiga commit: `feat: fetch viirs archive through firms area api`, `feat: build village table with peat fraction and area`, `feat: aggregate satellite detections per village year`.

### Task T13: Pipeline B, paparan, backtest, gerbang — Opus medium

**Files:** Create `pipeline/paparan.py`, `pipeline/backtest.py`, `pipeline/tests/test_paparan.py`, `test_backtest.py`.

**Interfaces:** Persis blok Interfaces rencana 06 Task 6 dan 7.

- [ ] **Step 1:** Tulis tes rencana 06 Task 6 Step 1 dan Task 7 Step 1.
- [ ] **Step 2:** Run `py -m pytest pipeline/tests/test_paparan.py pipeline/tests/test_backtest.py -v`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD §5. Jangan memakai istilah "Empirical Bayes" di kode atau komentar. `gate` tidak membagi dengan nol saat laju pembanding nol.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Dua commit: `feat: compute village exposure and kecamatan range`, `feat: add three fold evaluation and stratified gate`.

### Task T14: Token desain — Haiku high

**Files:** Modify `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx`, `docs/v2/04_DESIGN_BRIEF.md`. Create `frontend/src/lib/kontras.test.ts`.

**Interfaces:** Produces kelas Tailwind baru `bg-surface-2`, `border-line-2`, `text-faint`, `bg-{ember,water,ok,warn,danger}-soft`, `rounded-panel`, `shadow-card`, `shadow-float`, dan kelas `.btn`, `.btn-utama`, `.btn-kedua`. Kelas lama tetap ada.

- [ ] **Step 1:** Tulis `kontras.test.ts`. Tes membaca `globals.css`, mengambil nilai heksa di `:root`, menghitung rasio kontras WCAG, dan menegaskan setiap pasangan berikut minimal 4,5: `ink/paper`, `muted/paper`, `faint/paper`, `faint/surface`, `ember/surface`, `ember/ember-soft`, `water/surface`, `water/water-soft`, `ok/ok-soft`, `warn/warn-soft`, `danger/danger-soft`, `surface/ink`.
- [ ] **Step 2:** Run `npx vitest run src/lib/kontras.test.ts`. Expected: FAIL, token `faint` belum ada.
- [ ] **Step 3:** Ganti blok `:root` dengan nilai ini dan petakan semuanya di `@theme inline`:

```css
:root {
  --paper: #f5f4f1;
  --surface: #ffffff;
  --surface-2: #faf9f7;
  --line: rgb(30 26 20 / 0.1);
  --line-2: rgb(30 26 20 / 0.22);
  --ink: #16171a;
  --muted: #47474a;
  --faint: #6f6f73;
  --ember: #b4431a;
  --ember-soft: #fde8da;
  --water: #2650a8;
  --water-soft: #e9effc;
  --ok: #177340;
  --ok-soft: #e4f4ea;
  --warn: #855a00;
  --warn-soft: #fdf3da;
  --danger: #a52c1b;
  --danger-soft: #fcebe7;
  --radius: 10px;
  --r-panel: 20px;
}
```

Tambahan `@theme inline`: `--radius-panel: var(--r-panel)`, `--shadow-card: 0 1px 2px rgb(30 26 20 / 0.04)`, `--shadow-float: 0 12px 32px -12px rgb(30 26 20 / 0.28)`, `--font-sans: var(--font-ui)`.

- [ ] **Step 4:** Fokus menjadi `outline: 3px solid var(--ink)`. Tambah `font-feature-settings: "tnum" 1` dan `-webkit-font-smoothing: antialiased` pada `body`. Tambah kelas komponen: `.btn` (tinggi minimum 44 px, radius `--radius`, teks 16 px, tebal 600, transisi warna 150 ms), `.btn-utama` (latar `--ink`, teks putih), `.btn-kedua` (latar `--surface`, garis `--line-2`, teks `--ink`).
- [ ] **Step 5:** Di `layout.tsx` ganti Public Sans dengan `Geist` dari `next/font/google`, bobot 400, 500, 600, 700, variabel `--font-ui`. Source Serif 4 tidak diubah.
- [ ] **Step 6:** Run `npx vitest run src/lib/kontras.test.ts && npm run build`. Expected: PASS.
- [ ] **Step 7:** Di `docs/v2/04_DESIGN_BRIEF.md` perbarui blok token §4 dan baris font §5, lalu tambah §13 "Adopsi bahasa visual Sparekit" berisi keputusan D6, D7, D8, daftar yang ditolak dari `07_AUDIT.md` §6.1, dan kalimat "Tidak ada berkas yang disalin dari proyek lain."
- [ ] **Step 8:** Commit `style: adopt warm neutral tokens and ink controls`.

---

## Gelombang 2

### Task T20: Autentikasi dan audit — Opus medium

**Files:** Create `frontend/src/server/auth.ts`, `server/audit.ts`, `server/auth.test.ts`, `frontend/src/app/api/auth/{masuk,keluar,saya}/route.ts`, `frontend/scripts/seed-accounts.ts`. Modify `frontend/src/components/masuk/MasukForm.tsx`, `frontend/src/app/desa/[kode]/(akun)/layout.tsx`. Jangan sentuh `components/layout/NavAkun.tsx` (milik T24).

**Interfaces:** Produces `server/auth.ts` dan `server/audit.ts` di section 4. `POST /api/auth/masuk` menerima `{ username, password }`, membalas `{ akun: Akun }`. `POST /api/auth/keluar` membalas 204. `GET /api/auth/saya` membalas `{ akun: Akun }` atau 401.

- [ ] **Step 1:** Tulis delapan tes rencana 06 Task 12 Step 1 memakai `useTestDb()`, ditambah:

```ts
it("cookie mock-peran tidak memberi akses", async () => {
  const req = new Request("http://localhost/x", { headers: { cookie: "mock-peran=desa" } });
  await expect(requireDesaAccess(req, "DESA_A", ["desa"])).rejects.toMatchObject({ status: 401 });
});
it("audit tersimpan", async () => {
  await writeAudit(1, "DESA_A", "uji", { a: 1 });
  const r = await db().execute("select count(*) as n from audit_log where desa_kode = 'DESA_A'");
  expect(Number(r.rows[0].n)).toBe(1);
});
```

- [ ] **Step 2:** Run `npx vitest run src/server/auth.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD §9: `scrypt` dengan salt acak per akun, `timingSafeEqual`, token 32 byte acak disimpan SHA-256, cookie `sk_sesi` `httpOnly`, `SameSite=Lax`, `Secure` hanya di produksi, kedaluwarsa 7 hari, batas 10 percobaan per 15 menit per username dan IP. Pesan gagal: "Username atau password salah." dan "Coba lagi dalam 15 menit."
- [ ] **Step 4:** `MasukForm` memanggil `POST /api/auth/masuk` lewat `api()` lalu menuju `/desa/{akun.desaKode}/kesiapan`. Hapus cookie tiruan dan impor `@/mocks`. `(akun)/layout.tsx` memakai `requireHalamanDesa(kode, ["mpa", "desa"])`.
- [ ] **Step 5:** `seed-accounts.ts`: argumen `--desa <kode>`, password dari `DEMO_PASSWORD` (keluar dengan kode 1 bila kosong), membuat `demo-mpa` dan `demo-sekdes` dengan `is_demo = 1`, idempoten.
- [ ] **Step 6:** Run tes. Lalu dengan `DATABASE_URL=file:../data/dev.db`: seed, `npm run dev`, masuk sebagai `demo-mpa`. Expected: tes PASS, sampai di halaman Kesiapan, banner demo tampil.
- [ ] **Step 7:** Commit `feat: add session auth and per village authorization`.

### Task T21: Beranda dan Kartu Paparan nyata — Opus medium

**Files:** Create `frontend/src/app/api/desa/route.ts`, `frontend/src/app/api/desa/[kode]/route.ts`. Modify `frontend/src/app/page.tsx`, `frontend/src/app/desa/[kode]/page.tsx`, `frontend/src/components/paparan/SearchBox.tsx`, `frontend/src/lib/publik.test.ts`.

**Interfaces:** Consumes `searchDesa`, `getDesaCard`, `getGerbang`, `countTampakAman`. `GET /api/desa?q=` membalas `{ hasil: DesaHit[] }`. `GET /api/desa/[kode]` membalas `DesaCard` atau 404 `desa_tidak_ada`.

- [ ] **Step 1:** Pastikan tiga tes rencana 06 Task 17 Step 1 ada di `publik.test.ts`. Tambahkan yang belum ada.
- [ ] **Step 2:** Route `GET /api/desa`: `q` dipangkas, di bawah 2 karakter membalas `{ hasil: [] }`, di atas 80 karakter ditolak 400.
- [ ] **Step 3:** `SearchBox` mengambil dari `/api/desa?q=`. Halaman memanggil `server/queries` langsung, tidak lewat `lib/dataSource`. Beranda: tagline hanya bila `bolehTagline(gerbang)`, angka desa tampak aman dari `countTampakAman()` dan disembunyikan bila gerbang `buang`.
- [ ] **Step 4:** Run `npx vitest run src/lib/publik.test.ts`, lalu buka `/` dan `/desa/TINGGI` pada 360 px dengan DB dev. Expected: PASS, kalimat utama dan strip tampil, tanpa gulir horizontal.
- [ ] **Step 5:** Commit `feat: add village search and exposure card`.

### Task T22: Time Machine dan Data nyata — Opus medium

**Files:** Create `frontend/src/app/api/backtest/route.ts`, `frontend/src/app/api/data/route.ts`, `frontend/src/lib/backtest.test.ts`. Modify `frontend/src/app/time-machine/page.tsx`, `frontend/src/components/timemachine/TimeMachineView.tsx`, `frontend/src/app/data/page.tsx`, `frontend/src/content/dataPage.ts`. Jangan sentuh `publik.test.ts` (milik T21).

**Interfaces:** Consumes `getBacktest`, `getDataPage`. `kesimpulanBacktest` sudah ada di `lib/backtest.ts`.

- [ ] **Step 1:** Tulis dua tes rencana 06 Task 18 Step 2 di `backtest.test.ts`.
- [ ] **Step 2:** Run `npx vitest run src/lib/backtest.test.ts`. Expected: PASS bila `kesimpulanBacktest` sudah memenuhi; bila FAIL, perbaiki fungsi itu.
- [ ] **Step 3:** Halaman Time Machine membaca `getBacktest()` di server dan meneruskannya sebagai props. Hapus impor `@/mocks/backtest`. Bila `metrik` kosong, tampilkan keadaan kosong: "Gerbang data belum dijalankan."
- [ ] **Step 4:** Halaman Data menampilkan seluruh bagian App Flow §3.4 dari `getDataPage()`. `content/dataPage.ts` hanya menyimpan prosa yang tidak ada di DB. Tanggal akhir data 2026 dari `dataAkhir2026`.
- [ ] **Step 5:** Buka kedua halaman dengan DB dev. Expected: tidak ada angka dari `src/mocks`.
- [ ] **Step 6:** Commit `feat: add time machine and data transparency pages`.

### Task T23: Pipeline C, ekspor dan `run_all` — Opus medium

**Files:** Create `pipeline/export.py`, `pipeline/run_all.py`, `pipeline/tests/test_export.py`.

**Interfaces:** Consumes semua fungsi T12 dan T13 dan `PARAMS`. Produces `build_db(path, tables: dict[str, pd.DataFrame]) -> None` dan kunci `meta` di section 4.

- [ ] **Step 1:** Tulis dua tes rencana 06 Task 8 Step 1, ditambah:

```python
def test_gate_result_is_json_in_meta(tmp_path):
    build_db(tmp_path/"x.db", tiny_tables(gate={"a": True, "b": False, "keputusan": "lunakkan"}))
    nilai = sqlite3.connect(tmp_path/"x.db").execute("select nilai from meta where kunci='gate_hasil'").fetchone()[0]
    assert json.loads(nilai)["keputusan"] == "lunakkan"
```

- [ ] **Step 2:** Run `py -m pytest pipeline/tests/test_export.py -v`. Expected: FAIL.
- [ ] **Step 3:** Implementasi. `run_all.py` menghitung `frozen`, `live`, tiga fold, gerbang, sensitivitas, dan menulis angka kontrol Backend Schema §7 ke `pipeline/run_output.txt`. Berhenti dengan pesan jelas bila `data/raw/` kosong.
- [ ] **Step 4:** Run tes. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add database export and pipeline runner`.

### Task T24: Primitif dan cangkang desain — Opus medium

Koordinasi dengan Rafan sebelum mulai.

**Files:** Create `frontend/src/components/ui/Panel.tsx`, `frontend/src/components/ui/PageHead.tsx`. Modify `frontend/src/components/ui/{StatusBadge,AssumptionNote,AiBadge,PageState}.tsx`, `frontend/src/components/layout/{SiteHeader,NavAkun,DemoBanner}.tsx`.

**Interfaces:**
- `Panel({ children, className?, as? })`: `rounded-panel border border-line bg-surface shadow-card`. Tidak pernah bersarang.
- `PageHead({ judul, jawaban?, aksi? })`: `h1` 28 px di laptop dan 24 px di HP, tebal 600, `tracking-[-0.02em]`. `jawaban` adalah kalimat kesimpulan, 16 px, `text-muted`.
- `StatusBadge` tetap menerima props lama. Tampilan: ikon dan kata di atas warna `-soft` dengan teks warna pekatnya, tinggi 28 px, teks 14 px.

- [ ] **Step 1:** Tulis `Panel` dan `PageHead` baru dari spesifikasi di atas.
- [ ] **Step 2:** Setel ulang `StatusBadge`, `AiBadge`, `AssumptionNote`, `PageState` ke token baru. `siap` memakai `ok`, `sebagian` memakai `warn`, `rawan` memakai `danger`. Ikon tetap SVG sebaris.
- [ ] **Step 3:** `NavAkun`: lebar sidebar 248 px, judul grup berupa pertanyaan, baris aktif `bg-ember-soft font-medium text-ink`, tinggi baris 44 px, teks 14 px ke atas. Navigasi bawah HP tidak berubah strukturnya. Tambah tombol "Keluar" yang memanggil `POST /api/auth/keluar` lewat `api()` lalu `location.assign("/")`.
- [ ] **Step 4:** `SiteHeader` dan `DemoBanner` memakai garis `--line` dan latar `--surface`. Banner demo memakai `bg-warn-soft text-warn`.
- [ ] **Step 5:** Run `npm test && npm run typecheck && npm run lint`, lalu periksa satu layar berakun pada 360 px dan 1280 px. Expected: lulus, tidak ada teks di bawah 14 px pada berkas yang disentuh, tidak ada gulir horizontal.
- [ ] **Step 6:** Commit `style: add panel and page head primitives and restyle shell`.

---

## Gelombang 3

Rantai serial. Setiap task: lib server, route, lalu mengganti sumber data layarnya. Semua tes memakai `useTestDb()`. Setiap fungsi tulis memanggil `writeAudit`.

### Task T30: Catat Alat — Opus medium

**Files:** Create `frontend/src/server/inventaris.ts`, `server/inventaris.test.ts`, `frontend/src/app/api/desa/[kode]/inventaris/route.ts`. Modify `frontend/src/app/desa/[kode]/(akun)/inventaris/page.tsx`, `frontend/src/lib/inventarisApi.ts`.

**Interfaces:** Produces `inventarisSchema` (zod, pesan diambil dari `PESAN` di `@/lib/inventaris`), `saveInventaris(kode: string, akunId: number, rows: InventoryInput[]): Promise<void>`, `getInventaris(kode: string): Promise<{ rows: InventoryRow[]; terakhir: { oleh: string; waktu: string } | null }>`.

- [ ] **Step 1:** Tulis lima tes rencana 06 Task 13 Step 1 (harapan `getInventaris` disesuaikan menjadi `.rows`), ditambah:

```ts
it("menolak kode di luar katalog", async () => {
  await expect(saveInventaris("D", 1, [{ itemKode: "tank", total: 1, berfungsi: 1 }])).rejects.toMatchObject({ status: 400 });
});
it("menolak sumur bor pada desa non-gambut", async () => {
  await expect(saveInventaris("NONGAMBUT", 1, [{ itemKode: "sumur_bor", total: 1, berfungsi: 1 }])).rejects.toMatchObject({ status: 400 });
});
```

- [ ] **Step 2:** Run `npx vitest run src/server/inventaris.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi. Normalisasi `punya_rusak = 0` (`total = berfungsi`) terjadi sebelum validasi. Route: GET dan PUT untuk `mpa` dan `desa`, `assertOrigin` pada PUT.
- [ ] **Step 4:** Halaman membaca `getInventaris` dan `getCatalog` dari server. `inventarisApi.ts` memanggil `PUT /api/desa/[kode]/inventaris`.
- [ ] **Step 5:** Run tes, masuk `demo-mpa`, isi, simpan, muat ulang. Expected: PASS, nilai tetap, pengisi dan waktu tampil.
- [ ] **Step 6:** Commit `feat: add equipment inventory form`.

### Task T31: Paket efektif dan Kesiapan — Opus medium

**Files:** Create `frontend/src/server/efektif.ts`, `server/kesiapan.ts`, `server/efektif.test.ts`, `frontend/src/app/api/desa/[kode]/{paket,harga,kesiapan}/route.ts`. Modify `frontend/src/app/desa/[kode]/(akun)/kesiapan/page.tsx`, `frontend/src/app/desa/[kode]/(akun)/layout.tsx`.

**Interfaces:** Produces `getTargetEfektif(kode): Promise<PaketRow[]>`, `getHargaEfektif(kode): Promise<HargaRow[]>`, `getReferensiPergub(kode): Promise<ReferensiPergub[]>`, `setTarget(kode, akunId, itemKode, target, alasan)`, `setHarga(kode, akunId, itemKode, aksi, hargaRp, sumber)`, `getKesiapan(kode): Promise<ReadinessResult>`.

- [ ] **Step 1:** Tulis tujuh tes rencana 06 Task 14 Step 1.
- [ ] **Step 2:** Run `npx vitest run src/server/efektif.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi dengan kueri Backend Schema §5. `getKesiapan` memanggil `computeReadiness(katalog tersaring, target efektif, inventaris)`. `referensi_pergub` hanya dibaca bila `prov_kode = '62'`. PUT `paket` dan `harga` hanya untuk peran `desa`.
- [ ] **Step 4:** Halaman Kesiapan dan `Navigasi` di layout membaca dari `server/*`.
- [ ] **Step 5:** Run tes, buka layar pada 360 px. Expected: PASS, banner, gauge, rantai terlemah, keterangan provinsi tampil.
- [ ] **Step 6:** Commit `feat: add minimum package and readiness screen`.

### Task T32: Prioritas dan Keputusan — Opus medium

**Files:** Create `frontend/src/server/prioritas.ts`, `server/prioritas.test.ts`, `frontend/src/app/api/desa/[kode]/{prioritas,rencana,keputusan}/route.ts`. Modify `frontend/src/app/desa/[kode]/(akun)/prioritas/page.tsx`, `frontend/src/components/prioritas/{PrioritasView,PanelPaketHarga}.tsx`.

**Interfaces:** Produces `getPrioritas(kode): Promise<PrioritasPayload>`, `setPagu(kode, akunId, paguRp)`, `setKeputusan(kode, akunId, itemKode, aksi, keputusan, catatan?)`, `getBarisDisetujui(kode): Promise<PriorityRow[]>` (memakai `barisDisetujui` murni dari `@/lib/prioritas`).

- [ ] **Step 1:** Tulis empat tes rencana 06 Task 15 Step 1 dengan nama `getBarisDisetujui`, ditambah:

```ts
it.each([1.5, -1, 1_000_000_001])("menolak pagu %s", async (p) => {
  await setPagu("D", 1, 7e6);
  await expect(setPagu("D", 1, p)).rejects.toMatchObject({ status: 400 });
  expect((await getPrioritas("D")).paguRp).toBe(7e6);
});
```

- [ ] **Step 2:** Run `npx vitest run src/server/prioritas.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai App Flow §3.8. Default pagu `PAGU_DEFAULT`, batas atas `PAGU_MAKS`, keduanya dari `@/lib/prioritas`. Hitung ulang di server.
- [ ] **Step 4:** `PrioritasView`: perubahan pagu, setelah jeda 300 ms, memanggil `PUT rencana` lalu `GET prioritas`. Keputusan lewat `PUT keputusan`. `PanelPaketHarga` memanggil `PUT paket` dan `PUT harga`. Hapus impor `@/mocks/engine` dan `@/mocks/store`.
- [ ] **Step 5:** Run tes, geser pagu Rp15 juta ke Rp30 juta. Expected: PASS, daftar dan skor sesudah berubah.
- [ ] **Step 6:** Commit `feat: add budget priority list with village decisions`.

### Task T33: Usulan dan cetak — Opus medium

**Files:** Create `frontend/src/server/usulan.ts`, `server/usulan.test.ts`, `frontend/src/app/api/desa/[kode]/usulan/route.ts`, `frontend/src/app/api/desa/[kode]/usulan/[id]/route.ts`. Move `frontend/src/mocks/templates.ts` ke `frontend/src/server/narasi.ts` dan `mocks/templates.test.ts` ke `server/narasi.test.ts`. Modify `frontend/src/app/desa/[kode]/(akun)/usulan/page.tsx`, `usulan/[id]/page.tsx`, `frontend/src/components/usulan/{UsulanView,DokumenLoader}.tsx`.

**Interfaces:** Produces `buildFacts(kode): Promise<Record<string, string>>` (kunci Backend Schema §8), `terbitkanUsulan(kode, akunId, kanal): Promise<number>`, `getUsulan(kode, id): Promise<Usulan>`, `listUsulan(kode): Promise<Usulan[]>`, `renderTemplate(facts, kanal): string`, dan `generateNarrative(facts, kanal): Promise<{ teks: string; sumber: "ai" | "template"; model: string | null }>` yang pada task ini selalu mengembalikan template.

- [ ] **Step 1:** Tulis lima tes rencana 06 Task 16 Step 1.
- [ ] **Step 2:** Run `npx vitest run src/server/usulan.test.ts src/server/narasi.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai App Flow §3.9 dan §3.10. `facts_json` dan `baris_json` dibekukan saat terbit, termasuk `nama`, `satuan`, dan `sumberHarga` tiap baris. Tidak ada endpoint ubah. Tanpa `dangerouslySetInnerHTML`.
- [ ] **Step 4:** `UsulanView` memanggil `POST usulan`. `DokumenLoader` membaca dari server.
- [ ] **Step 5:** Run tes, terbitkan, buka pratinjau cetak A4. Expected: PASS, rapi, tanpa navigasi, pernyataan asumsi tampil.
- [ ] **Step 6:** Commit `feat: publish funding proposals from approved items`.

### Task T34: Jalankan nyata dan gerbang — Opus medium, butuh M1 dan M2

**Files:** Create `data/siapkemarau.db`, `pipeline/run_output.txt`, `docs/v2/HASIL_GERBANG.md`.

- [ ] **Step 1:** Run `py pipeline/fetch_firms.py`. Expected: sekitar 1.080 berkas di `data/raw/firms/`. Catat tanggal akhir SP, NRT, dan celahnya.
- [ ] **Step 2:** Run `py pipeline/run_all.py`. Expected: DB di bawah 50 MB, angka kontrol tercetak.
- [ ] **Step 3:** Orkestrator memeriksa `run_output.txt`: jumlah desa per provinsi masuk akal, deteksi sesudah filter lebih kecil dari sebelum, tidak ada fold yang memakai tahun uji, riwayat Kalibandung tercetak.
- [ ] **Step 4:** Tulis `HASIL_GERBANG.md`: nilai uji A dan B, keputusan, tanggal akhir data 2026. Keputusan dibaca dari `gate_hasil`, tidak dipilih. Jika riwayat Kalibandung tidak cocok dengan kasusnya, desa jangkar diambil dari data dan alasannya ditulis.
- [ ] **Step 5:** Di `frontend/`: `npx tsx scripts/seed-accounts.ts --desa <desa_jangkar>`.
- [ ] **Step 6:** Buka `/time-machine` dan `/data`. Expected: angka sama dengan `run_output.txt`.
- [ ] **Step 7:** Commit `feat: publish exposure database and gate result`. Laporkan keputusan gerbang ke pengguna pada hari yang sama.

Jika M1 belum selesai Kamis pukul 09.00, orkestrator berhenti dan meminta pengguna memilih: jalur cadangan arsip tahunan, atau memperpendek rentang data dan menuliskannya di halaman Data.

---

## Gelombang 4

### Task T40: Narasi AI berpengaman — Opus medium

**Files:** Modify `frontend/src/server/narasi.ts`, `server/narasi.test.ts`, `server/usulan.ts`.

**Interfaces:** Produces `validateNarrative(text, allowed): { ok: boolean; violations: string[] }`, `renderNarrative(text, facts): string`, dan `generateNarrative` yang memanggil Claude.

- [ ] **Step 1:** Tambahkan delapan tes rencana 06 Task 19 Step 1 ke `narasi.test.ts`.
- [ ] **Step 2:** Run `npx vitest run src/server/narasi.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implementasi sesuai TRD §7. Muat skill `claude-api` untuk sintaks SDK terbaru. Model dari `ANTHROPIC_MODEL`, bawaan `claude-opus-5-5`. Yang dikirim hanya nama placeholder, kanal, dan label kualitatif. Timeout 15 detik. Batas 10 permintaan per akun per jam lewat `hitRateLimit`. Setiap kegagalan jatuh ke template tanpa pesan galat.
- [ ] **Step 4:** Run tes, terbitkan dengan dan tanpa kunci. Expected: PASS, badge berbeda, angka sama.
- [ ] **Step 5:** Commit `feat: integrate guarded ai proposal narrative`.

### Task T41a dan T41b: Sapuan desain — Opus medium

Koordinasi dengan Rafan sebelum mulai. Tidak ada perubahan logika, props, atau teks wajib.

**Files T41a:** `frontend/src/app/page.tsx`, `frontend/src/app/desa/[kode]/page.tsx`, `frontend/src/app/data/page.tsx`, `frontend/src/app/masuk/page.tsx`, `frontend/src/components/{beranda,paparan,timemachine,masuk}/*`.

**Files T41b:** `frontend/src/components/{kesiapan,inventaris,prioritas,usulan}/*`, `frontend/src/components/ui/{Stepper,BilahAksi,RetryButton}.tsx`.

Aturan sapuan, berlaku untuk keduanya:

1. Setiap layar dibuka dengan `PageHead`: judul berupa pertanyaan yang dijawab layar, `jawaban` berupa kalimat kesimpulan yang sudah ada.
2. Kelompok isi memakai `Panel`. Tidak ada `Panel` di dalam `Panel`.
3. Tombol utama memakai `btn btn-utama`, tombol lain `btn btn-kedua`. `bg-ember` hanya tersisa pada sel `YearStrip`, batang kemajuan, dan chip sorotan.
4. Semua `text-xs` dan `text-[1Npx]` di bawah 14 px dinaikkan ke `text-sm`. Pengecualian hanya footer dokumen cetak.
5. Angka besar: tebal 600, `tracking-[-0.03em]`, `tabular-nums`.
6. Dokumen cetak tidak diubah.

Judul `PageHead` per layar:

| Layar | Judul |
|---|---|
| Kartu Paparan | Seberapa terpapar desa ini? |
| Time Machine | Apakah riwayat bisa dipercaya? |
| Data dan Asumsi | Dari mana angkanya? |
| Kesiapan | Seberapa siap desa ini? |
| Catat Alat | Alat apa yang benar-benar berfungsi? |
| Prioritas | Apa yang didanai lebih dulu? |
| Usulan | Ke mana usulan dikirim? |

Tambahan T41a: `KartuContoh` menampilkan Kartu Paparan desa jangkar nyata (`meta.desa_jangkar`). `Sorotan` tidak lagi memuat angka "65,3 → 70,7". Bila `desa_jangkar` belum ada, kedua bagian disembunyikan.

- [ ] **Step 1:** Terapkan aturan pada berkas milik task.
- [ ] **Step 2:** Run `npm test && npm run typecheck && npm run lint`. Expected: lulus, jumlah tes tidak berkurang.
- [ ] **Step 3:** Run `grep -rnE "text-xs|text-\[1[0-3]px\]" src/app src/components`. Expected: hanya footer `DokumenUsulan`.
- [ ] **Step 4:** Periksa tiap layar pada 360 px dan 1280 px. Expected: tanpa gulir horizontal, fokus terlihat, satu kalimat kesimpulan di atas.
- [ ] **Step 5:** Commit `style: apply question led layout to public pages` dan `style: apply question led layout to village flow`.

### Task T42: Hapus mock — Haiku high

**Files:** Delete `frontend/src/mocks/`, `frontend/src/lib/dataSource.ts`, `frontend/src/components/ui/Placeholder.tsx`. Create `frontend/src/test/fixtures.ts`. Modify `frontend/src/lib/{kesiapan,prioritas,inventaris}.test.ts`.

- [ ] **Step 1:** Pindahkan konstanta yang masih dipakai tes (`mockCatalog`, `mockHarga`, `mockReadiness`, `mockPergubKalteng`) dari `mocks/demo.ts` ke `test/fixtures.ts`. Ubah impor di tiga berkas tes. Tes yang memanggil mesin tiruan diarahkan ke `@/lib/engine/priority`.
- [ ] **Step 2:** Hapus `src/mocks/`, `lib/dataSource.ts`, `Placeholder.tsx`.
- [ ] **Step 3:** Run `grep -rn "@/mocks\|dataSource\|mock-peran" src`. Expected: tidak ada hasil selain tes larangan di `server/auth.test.ts`.
- [ ] **Step 4:** Run `npm test && npm run build`. Expected: lulus.
- [ ] **Step 5:** Commit `refactor: remove mock data layer`.

### Task T43: Label Kestabilan, P1 — Opus medium

Persis rencana 06 Task 20, dengan path `frontend/src/lib/engine/stability.ts` dan tes di sebelahnya. Tambahan: `getPrioritas` di `server/prioritas.ts` memanggil `addStability`, dan `components/prioritas/PriorityRow.tsx` menampilkan label `stabil` atau `peka asumsi` sebagai chip. Commit `feat: label priority stability across assumptions`.

### Task T44: Tempel pesan jadi isian, P1 — Opus medium

Persis rencana 06 Task 21, dengan path `frontend/src/server/parseInventaris.ts`, `frontend/src/app/api/desa/[kode]/inventaris/parse/route.ts`, dan perubahan di `frontend/src/components/inventaris/FormInventaris.tsx`. Endpoint tidak menulis ke tabel selain `rate_limit`. Commit `feat: fill inventory form from pasted message`.

---

## Gelombang 5

### Task T50: QA klaim dan daftar periksa — Haiku high

**Files:** Create `docs/v2/QA.md`.

- [ ] **Step 1:** Run `cd frontend && npm test && npm run build` dan `py -m pytest pipeline/tests`. Catat hasilnya.
- [ ] **Step 2:** Run `git log -p | grep -iE "api[_-]?key|token|password"`. Expected: hanya nama variabel.
- [ ] **Step 3:** Run `grep` kata terlarang di section 1 pada `frontend/src` dan `pipeline`. Expected: tidak ada klaim produk.
- [ ] **Step 4:** Jalankan daftar periksa Design Brief §12 butir demi butir pada 360 px. Tulis lulus atau gagal beserta buktinya di `QA.md`. Butir gagal dilaporkan ke orkestrator, tidak diperbaiki sendiri.
- [ ] **Step 5:** Commit `chore: add qa checklist results`.

### Task T51: Uji keamanan, klon bersih, skrip unggah — Opus medium

**Files:** Create `frontend/scripts/push-remote.ts`. Modify `docs/v2/QA.md`.

- [ ] **Step 1:** Dengan server lokal menyala, uji `curl` setiap endpoint berparameter desa di TRD §8: tanpa sesi harus 401, sesi desa lain harus 403, peran `mpa` pada endpoint khusus `desa` harus 403, metode tulis dengan `Origin` asing harus ditolak. Catat tabel hasil di `QA.md`.
- [ ] **Step 2:** Klon bersih ke folder sementara, `cd frontend && npm ci && npm run build && npm start` dengan jaringan mati dan `ANTHROPIC_API_KEY` kosong. Jalankan alur demo App Flow §5. Expected: semua P0 berjalan, badge "Disusun dari template".
- [ ] **Step 3:** `push-remote.ts`: membaca `../data/siapkemarau.db` dan menulisnya ke `DATABASE_URL` jarak jauh dengan `DATABASE_AUTH_TOKEN`. Menolak berjalan bila URL tujuan diawali `file:`.
- [ ] **Step 4:** Commit `chore: add remote seed script and security check results`.

### Task T52: README — Haiku high

**Files:** Modify `README.md`.

- [ ] **Step 1:** Tulis semua bagian rencana 06 Task 23 Step 1. Fitur yang ditulis hanya yang lulus T50 dan T51.
- [ ] **Step 2:** Bagian AI menyebut: model narasi (`ANTHROPIC_MODEL`), dan asisten penulisan kode yang benar-benar dipakai menurut trailer commit lama dan plan ini (Claude Opus 5.5, Claude Sonnet 5.5, Claude Fable 5, Claude Haiku 5.5).
- [ ] **Step 3:** Bagian atribusi menyebut FIRMS, HDX, WRI, regulasi harga, Geist, Source Serif 4, dan kalimat: "Bahasa visual mengacu pada proyek tim sebelumnya (Sparekit, CALIBER 2026). Tidak ada berkas yang disalin."
- [ ] **Step 4:** Pernyataan "Berbasis data publik, belum diuji pengguna." tampil di bagian atas.
- [ ] **Step 5:** Commit `docs: add project readme`.

---

## 9. Cakupan terhadap spec

| Kebutuhan | Task |
|---|---|
| FR-01 | T11, T21 |
| FR-02, FR-03 | T12, T13, T21, T34 |
| FR-04 | T13, T22, T23, T34 |
| FR-05 | T03, T22 |
| FR-06, NFR-04 | T20, T51 |
| FR-07 | T30 |
| FR-09, FR-11 | T03, T31, T32 |
| FR-10 | T10, T31 |
| FR-12, FR-13 | T10, T32 |
| FR-14 (P1) | T43 |
| FR-15 | T33 |
| FR-16, NFR-06 | T40, T52 |
| FR-19 (P1) | T44 |
| NFR-01, NFR-07 | T14, T24, T41, T50 |
| NFR-03 | T51 |
| NFR-05 | T30 (petunjuk catatan sudah ada di `lib/inventaris.ts`) |
| NFR-08 | T20, T30, T31, T32, T33 |
| Adopsi desain caliber-final | T14, T24, T41a, T41b |
| Temuan audit K1 sampai K4, S1 sampai S8 | T01, T03, T10, T11, T20, T22, T41a, T42 |
| FR-08, FR-17, FR-18 | Di luar cakupan (P2) |
