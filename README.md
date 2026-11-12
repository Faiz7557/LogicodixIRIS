# SiapKemarau

> *Enam tahun tanpa api bukan berarti aman.*

SiapKemarau membantu desa rawan karhutla mengetahui seberapa terpapar mereka di tahun kering ekstrem, alat padam apa yang benar-benar berfungsi, dan apa yang harus didanai lebih dulu, sebelum musim kering tiba.

Berbasis data publik dan belum diuji pengguna.

Kategori: **Web** · LOGICODIX 2026

Bagian submission (tim, video, surat orisinalitas, atribusi lengkap) dilengkapi pada Task 23 di [docs/v2/06_IMPLEMENTATION_PLAN.md](docs/v2/06_IMPLEMENTATION_PLAN.md).

## Status per 11 November 2026

| Bagian | Status |
|---|---|
| API dan lapisan server Next.js | Hidup: auth sesi, otorisasi per desa, inventaris, paket, harga, kesiapan, prioritas, keputusan, usulan, parse pesan |
| Basis data aplikasi | `db/schema.sql` lengkap. Lokal memakai `data/dev.db` berisi data uji |
| Pipeline Python | Lengkap: unduh FIRMS, batas desa, gambut, hitung, ekspor `data/siapkemarau.db` |
| Narasi usulan | Masih template. Jalur AI yang hidup hanya parse pesan inventaris |
| Deploy | Belum dikerjakan |

Data uji tidak boleh tampil sebagai hasil. Angka desa nyata baru ada setelah pipeline menulis `data/siapkemarau.db`.

## Arsitektur

```text
pipeline/*.py          komputasi offline: FIRMS, wilayah, paparan, backtest
db/schema.sql          otoritas skema SQLite/libSQL
data/manual/*.csv      katalog, paket minimum, harga acuan, sumber, catatan data
data/dev.db            data uji lokal (dibuat scripts/dev-db.ts, diabaikan git)
data/siapkemarau.db    target keluaran pipeline (belum dihasilkan)

frontend/src/app/**    halaman Next.js App Router dan route handler tipis
frontend/src/server/   logika bisnis, auth, audit, query berparameter
frontend/src/lib/      tipe, format, pemanggil API, fungsi murni
frontend/src/lib/engine/  mesin kesiapan dan prioritas tanpa I/O
```

Aplikasi membaca DB lewat `@libsql/client`: `file:` di lokal, `libsql://` di deploy. Tidak ada server terpisah; route handler memanggil `frontend/src/server/*` langsung.

## Menjalankan dari clone baru

Prasyarat:

| Alat | Versi | Cara pasang |
|---|---|---|
| Git | terbaru | <https://git-scm.com/downloads> |
| Node.js dan npm | Node.js 22.12 atau lebih baru | <https://nodejs.org/en/download>. `npm` ikut terpasang bersama Node.js; dokumentasi npm ada di <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm>. Vitest 5 mensyaratkan Node `^22.12` untuk `make test` |
| uv | terbaru | <https://docs.astral.sh/uv/getting-started/installation/> |
| make | opsional | Biasanya sudah ada di Linux/macOS. Di Windows jalankan lewat WSL |

Repo ini tidak memakai `requirements.txt`. Dependency Python ada di `pyproject.toml` dan `uv.lock`; `uv sync` yang membuat `.venv/` dan memasang semuanya, termasuk `pytest`. Jangan menjalankan `pip install -r requirements.txt`, filenya tidak ada.

```bash
git clone https://github.com/Faiz7557/LogicodixIRIS.git
cd LogicodixIRIS
make setup
```

`make setup` menjalankan `npm ci`, `uv sync`, menyalin `frontend/.env.example` menjadi `frontend/.env` dan `.env.example` akar menjadi `.env` bila belum ada, lalu membuat `data/dev.db` berisi 25 desa uji. Setelah itu isi `DEMO_PASSWORD` di `frontend/.env`, lalu:

```bash
make seed
make dev
```

Buka <http://localhost:3000>. Masuk dengan `demo-mpa` (ketua MPA) atau `demo-sekdes` (sekdes) memakai `DEMO_PASSWORD` yang baru diisi. `make seed DESA=<kode>` membuat akun untuk desa lain. Tanpa `DESA`, seed memakai desa akun demo yang sudah ada, atau desa pertama di DB.

`make setup` dan `make db` membuat ulang `data/dev.db`, jadi data inventaris uji di dalamnya ikut hilang. `make env` tidak menimpa `.env` yang sudah ada. `make help` menampilkan semua target.

### Padanan perintah Make dan perintah asli

Semua perintah asli dijalankan dari akar repo.

| Kebutuhan | Dengan Make | Perintah asli |
|---|---|---|
| Pasang dependency | `make install` | `cd frontend && npm ci` lalu `uv sync` |
| Salin env | `make env` | `cp frontend/.env.example frontend/.env` dan `cp .env.example .env` (hanya bila belum ada) |
| Buat DB uji | `make db` | `cd frontend && npx tsx scripts/dev-db.ts` |
| Buat akun demo | `make seed` | `cd frontend && npx tsx scripts/seed-accounts.ts --desa <kode>`; tanpa `--desa` memakai desa akun demo atau desa pertama |
| Jalankan dev | `make dev` | `cd frontend && npm run dev` |
| Tes | `make test` | `cd frontend && npm test` lalu `uv run pytest pipeline/tests -q` |
| Typecheck | `make typecheck` | `cd frontend && npm run typecheck` |
| Lint | `make lint` | `cd frontend && npm run lint` |
| Build | `make build` | `cd frontend && npm run build` |
| Jalankan hasil build | `make start` | `cd frontend && npm run build && npm start` |
| Gate sebelum commit | `make gate` | `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` dari `frontend/`, lalu `uv run pytest pipeline/tests -q` |
| Unduh batas desa dan gambut | `make pipeline-inputs` | `uv run python pipeline/fetch_inputs.py` |
| Unduh FIRMS | `make pipeline-fetch` | `uv run python pipeline/fetch_firms.py` |
| Jalankan pipeline | `make pipeline-run` | `uv run python pipeline/run_all.py` |
| Bersihkan build | `make clean` | `rm -rf frontend/.next` |

`npm ci` dipakai karena `package-lock.json` sudah ada dan hasilnya deterministik. Bila menambah dependency baru, pakai `npm install <paket>` dari `frontend/`, lalu commit `package.json` dan `package-lock.json`.

Pipeline membutuhkan `FIRMS_MAP_KEY` di `.env` akar repo. Isi lewat `make env` lalu edit `.env`, atau langsung tambahkan barisnya.

## Konfigurasi lingkungan

Jalankan `make env` untuk menyalin `frontend/.env.example` ke `frontend/.env` dan `.env.example` akar ke `.env` bila belum ada. Jangan commit `.env`.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Tidak | Bawaan `file:../data/siapkemarau.db`. Lokal memakai `file:../data/dev.db` |
| `DATABASE_AUTH_TOKEN` | Deploy | Kosong di lokal, diisi untuk libSQL jarak jauh |
| `ANTHROPIC_API_KEY` | Tidak | Jalur pertama parse pesan inventaris |
| `ANTHROPIC_MODEL` | Tidak | Bawaan `claude-opus-5-5` |
| `OPENAI_API_KEY` | Tidak | Jalur kedua parse pesan inventaris |
| `OPENAI_MODEL_CLASSIFIER` | Tidak | Bawaan `gpt-6-luna` |
| `NINE_ROUTER_BASE_URL` | Tidak | Endpoint OpenAI-compatible untuk jalur ketiga parse |
| `NINE_ROUTER_API_KEY` | Tidak | Tanpa kunci ini, tanpa Anthropic, dan tanpa OpenAI, parse memakai parser deterministik |
| `NINE_ROUTER_MODEL` | Tidak | Bawaan `ag/gemini-3.8-flash-low` |
| `NINE_ROUTER_PATH` | Tidak | Bawaan `/v1/chat/completions` |
| `TRUST_PROXY` | Tidak | `1` hanya bila platform benar-benar mengisi `x-forwarded-for` |
| `DEMO_PASSWORD` | Seed | Password akun `demo-mpa` dan `demo-sekdes` |
| `FIRMS_MAP_KEY` | Pipeline | Hanya dibaca `pipeline/fetch_firms.py` dari `.env` akar repo |

## API

Semua respons JSON. Galat memakai `{ "error": { "kode": "...", "pesan": "..." } }`. Status yang dipakai: `200`, `201` + `Location`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429` + `Retry-After`, `503` saat tabel pipeline belum ada.

| Metode | Path | Akses | Sukses |
|---|---|---|---|
| GET | `/api/desa?q=` | Publik, 30/menit per IP | 200 `{ hasil }`, maks. 20, minimal 2 karakter |
| GET | `/api/desa/[kode]` | Publik | 200 `DesaCard` |
| GET | `/api/backtest` | Publik | 200 metrik, grup, gerbang, 20 teratas |
| GET | `/api/data` | Publik | 200 sumber, sensor, catatan data, meta, paket, harga |
| POST | `/api/auth/masuk` | Publik, 10/15 menit per username+IP | 200 `{ akun }` + cookie sesi |
| POST | `/api/auth/keluar` | Publik | 204, cookie dihapus |
| GET | `/api/auth/saya` | Akun | 200 `{ akun }` |
| GET, PUT | `/api/desa/[kode]/inventaris` | `mpa`, `desa` | 200 `{ rows, terakhir }`, 200 `{ disimpanPada }` |
| POST | `/api/desa/[kode]/inventaris/parse` | `mpa`, `desa`, 10/jam per akun | 200 `{ hasil, sumber }` |
| GET, PUT | `/api/desa/[kode]/paket` | GET `mpa`/`desa`, PUT `desa` | 200 `{ hasil }`, 204 |
| GET, PUT | `/api/desa/[kode]/harga` | GET `mpa`/`desa`, PUT `desa` | 200 `{ hasil }`, 204 |
| GET | `/api/desa/[kode]/kesiapan` | `mpa`, `desa` | 200 `ReadinessResult` |
| GET | `/api/desa/[kode]/prioritas` | `desa` | 200 `PriorityResult` + keputusan |
| PUT | `/api/desa/[kode]/rencana` | `desa` | 204, pagu 0 sampai Rp100.000.000 |
| PUT | `/api/desa/[kode]/keputusan` | `desa` | 204, satu baris prioritas |
| GET, POST | `/api/desa/[kode]/usulan` | `desa` | 200 `{ hasil, meta }` (`?limit=1..50&cursor=`), 201 `{ id }` + `Location` |
| GET | `/api/desa/[kode]/usulan/[id]` | `desa` | 200 `Usulan` dengan fakta beku |

Aturan yang berlaku di semua route ber-`[kode]`:

- Metode tulis wajib lolos `assertOrigin` (Origin harus sama dengan Host).
- `requireDesaAccess` menolak akun desa lain atau peran yang tidak cocok.
- Semua SQL berparameter; nilai desa ditimpa lalu dicatat ke `audit_log`.
- Mutasi menyimpan `updated_by` dan `updated_at`.

`inventaris/parse` mencoba Claude, lalu OpenAI, lalu 9router, lalu parser deterministik. Semua keluaran AI divalidasi zod terhadap kode katalog dan angka tidak negatif. Hasil tidak pernah disimpan otomatis.

## Pipeline data

Dependency Python dikelola `uv` lewat `pyproject.toml` dan `uv.lock` (Python 3.13).

```bash
uv sync
uv run python pipeline/fetch_inputs.py  # HDX COD-AB ADM4 + gambut WRI/GFW, tanpa kunci
uv run python pipeline/fetch_firms.py   # butuh FIRMS_MAP_KEY di .env akar
uv run python pipeline/run_all.py       # tulis data/siapkemarau.db + pipeline/run_output.txt
uv run pytest pipeline/tests -q
```

`fetch_inputs.py` menulis ke `data/raw/hdx/` dan `data/raw/peat/`; `fetch_firms.py` ke
`data/raw/firms/`. Ketiga folder diabaikan git, jadi unduh ulang setelah clone baru.
`run_all.py` menghitung paparan beku dan live, tiga fold backtest, gerbang, dan
sensitivitas, lalu mencetak angka kontrol ke `pipeline/run_output.txt`.

Modul yang ada:

| Berkas | Isi |
|---|---|
| `pipeline/params.py` | Parameter dan label dari TRD |
| `pipeline/fetch_firms.py` | Unduh CSV VIIRS S-NPP SP dan NRT dari FIRMS |
| `pipeline/wilayah.py` | Tabel desa, luas, fraksi gambut |
| `pipeline/firms.py` | Agregasi deteksi per desa dan tahun |
| `pipeline/paparan.py` | Paparan per desa dan kecamatan |
| `pipeline/backtest.py` | Time Machine, tiga fold, gerbang |
| `pipeline/fetch_inputs.py` | Unduh batas desa HDX dan poligon gambut WRI/GFW |
| `pipeline/gambut_kalimantan.py` | Desa bergambut seluruh Kalimantan (CSV + GeoJSON) |
| `pipeline/export.py` | Tulis tabel ke SQLite dari `db/schema.sql` |
| `pipeline/run_all.py` | Jalankan seluruh pipeline dan tulis angka kontrol |

Selama `data/siapkemarau.db` belum dihasilkan, aplikasi lokal memakai `data/dev.db` berisi data uji. `scripts/dev-db.ts` membaca `db/schema.sql` dan `data/manual/*.csv`, bukan menyalin angka dari dokumen.

### Membagikan data pipeline

Seluruh data mentah dan DB hasil pipeline diabaikan git. Untuk membagikannya tanpa
mengunduh ulang:

```bash
make bundle        # menulis ../siapkemarau-data.zip (DB + data/raw, ±220 MB)
```

Penerima menjalankan, dari akar clone baru:

```bash
unzip siapkemarau-data.zip -d .
# frontend/.env: DATABASE_URL=file:../data/siapkemarau.db
cd frontend && npx tsx scripts/seed-accounts.ts   # reset akun demo ke DEMO_PASSWORD sendiri
```

`make bundle` menolak jalan bila `data/siapkemarau.db` belum ada. Paket ini tidak memuat
`data/dev.db` (data uji demo); untuk itu salin terpisah.

Untuk memakai `python` biasa, aktifkan venv dulu:

```bash
source .venv/bin/activate        # Windows: .venv\Scripts\activate
python pipeline/fetch_firms.py
deactivate
```

## Struktur repositori

| Path | Isi |
|---|---|
| `frontend/` | Aplikasi Next.js 16 App Router |
| `frontend/src/app/api/` | Route handler tipis: zod, auth, `server/*`, `Response.json` |
| `frontend/src/server/` | Auth, DB, query, inventaris, paket/harga, kesiapan, prioritas, usulan, narasi, parse |
| `frontend/src/lib/engine/` | Fungsi murni kesiapan dan prioritas |
| `frontend/scripts/` | `dev-db.ts`, `seed-accounts.ts` |
| `db/schema.sql` | DDL lengkap, termasuk tabel sesi, rate limit, audit, usulan |
| `pipeline/` | Komputasi offline dan tes pytest |
| `data/manual/` | CSV acuan yang ikut repo |
| `docs/v2/` | Jobdesk, PRD, TRD, App Flow, Design Brief, skema, rencana, audit, plan agen |
| `docs/FRONTEND.md` | Panduan UI/UX dan keadaan layar |
| `reports/`, `research_notes/`, `papers/` | Riset pemilihan masalah dan transkrip bukti |

## Penggunaan AI

Kode ditulis dengan bantuan AI coding assistant (Claude Code, model Claude Opus 5.5). Model yang dapat dipakai aplikasi untuk parse inventaris: `ANTHROPIC_MODEL` (bawaan `claude-opus-5-5`), `OPENAI_MODEL_CLASSIFIER` (bawaan `gpt-6-luna`), dan `NINE_ROUTER_MODEL` sebagai jalur terakhir. Narasi usulan belum memanggil model; `generateNarrative` masih mengembalikan template.

P0 berjalan tanpa internet dan tanpa kunci API. Tanpa kunci, parse pesan memakai parser deterministik dan narasi memakai template.
