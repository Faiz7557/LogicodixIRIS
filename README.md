# SiapKemarau

> *Enam tahun tanpa api bukan berarti aman.*

SiapKemarau membantu desa rawan karhutla mengetahui seberapa terpapar mereka di tahun kering ekstrem, alat padam apa yang benar-benar berfungsi, dan apa yang harus didanai lebih dulu, sebelum musim kering tiba.

Kategori: **Web** · LOGICODIX 2026

> README ini masih kerangka. Isi wajib submission (tim, fitur, arsitektur, akun demo, dokumentasi AI, atribusi) dilengkapi pada Task 23, lihat [docs/v2/06_IMPLEMENTATION_PLAN.md](docs/v2/06_IMPLEMENTATION_PLAN.md).

## Menjalankan di lokal

Aplikasi web ada di folder `frontend/`.

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev        # http://localhost:3000
npm test           # tes Vitest
npm run build && npm start
```

Butuh Node.js 20 atau lebih baru.

## Pipeline data

Pipeline Python ada di `pipeline/`. Dependency dikelola `uv` lewat `pyproject.toml` dan `uv.lock`. Pasang `uv` bila belum ada (`curl -LsSf https://astral.sh/uv/install.sh | sh`), lalu:

```bash
uv sync
uv run python pipeline/fetch_firms.py   # butuh FIRMS_MAP_KEY
uv run python pipeline/run_all.py
uv run pytest pipeline/tests -q
```

`uv sync` membuat `.venv/` dengan Python 3.13. Untuk memakai `python` biasa, aktifkan venv dulu:

```bash
source .venv/bin/activate        # Windows: .venv\Scripts\activate
python pipeline/run_all.py
deactivate
```

## API

Semua respons JSON. Galat memakai `{ "error": { "kode": "...", "pesan": "..." } }`.

| Metode | Path | Akses | Sukses |
|---|---|---|---|
| GET | `/api/desa?q=` | Publik, dibatasi | 200 `{ hasil }`, maks. 20 |
| GET | `/api/desa/[kode]` | Publik | 200 `DesaCard` |
| GET | `/api/backtest` | Publik | 200 metrik dan gerbang |
| GET | `/api/data` | Publik | 200 sumber, batasan, parameter |
| POST | `/api/auth/masuk` | Publik, dibatasi | 200 `{ akun }` + cookie sesi |
| POST | `/api/auth/keluar` | Akun | 204 |
| GET | `/api/auth/saya` | Akun | 200 `{ akun }` |
| GET, PUT | `/api/desa/[kode]/inventaris` | `mpa`, `desa` | 200 `{ rows, terakhir }`, 200 `{ disimpanPada }` |
| POST | `/api/desa/[kode]/inventaris/parse` | `mpa`, `desa` | 200 `{ hasil, sumber }` |
| GET, PUT | `/api/desa/[kode]/paket` | GET keduanya, PUT `desa` | 200 `{ hasil }`, 204 |
| GET, PUT | `/api/desa/[kode]/harga` | GET keduanya, PUT `desa` | 200 `{ hasil }`, 204 |
| GET | `/api/desa/[kode]/kesiapan` | `mpa`, `desa` | 200 `ReadinessResult` |
| GET | `/api/desa/[kode]/prioritas` | `desa` | 200 `PriorityResult` |
| PUT | `/api/desa/[kode]/rencana` | `desa` | 204 |
| PUT | `/api/desa/[kode]/keputusan` | `desa` | 204 |
| GET, POST | `/api/desa/[kode]/usulan` | `desa` | 200 `{ hasil, meta }`, 201 `{ id }` + `Location` |
| GET | `/api/desa/[kode]/usulan/[id]` | `desa` | 200 `Usulan` |

Status galat utama: `400` body tidak sah, `401` tanpa sesi, `403` desa/peran/Origin salah, `404` tidak ada, `409` konflik state, `422` data tidak sah secara domain, `429` rate limit, `503` data pipeline belum ada. Pencarian desa dibatasi 30 permintaan per menit per IP. `inventaris/parse` memakai Claude bila `ANTHROPIC_API_KEY` tersedia, lalu 9router bila `NINE_ROUTER_API_KEY` tersedia, dan jatuh ke parser deterministik bila keduanya tidak ada.

Konfigurasi 9router ada di `frontend/.env.example`: `NINE_ROUTER_BASE_URL`, `NINE_ROUTER_API_KEY`, `NINE_ROUTER_MODEL`, dan `NINE_ROUTER_PATH`. Set `TRUST_PROXY=1` hanya bila platform benar-benar mengisi `x-forwarded-for`; selain itu rate limit memakai satu bucket `lokal`.

## Struktur repositori

| Folder | Isi |
|---|---|
| `frontend/` | Aplikasi web Next.js: halaman, komponen, tipe, dan konfigurasi (`package.json`, `.env.example`) |
| `frontend/src/app/` | Halaman Next.js (App Router) |
| `frontend/src/components/` | Komponen antarmuka |
| `frontend/src/lib/` | Tipe, format, dan pemanggil API |
| `docs/` | Dokumen v2 di docs/v2/: Jobdesk, PRD, TRD, App Flow, Design Brief, skema, rencana implementasi, audit, plan agen |
| `reports/`, `research_notes/` | Riset pemilihan masalah |
| `papers/` | Registry bukti ilmiah dan regulasi (transkrip `.md`; PDF tidak disertakan) |

Panduan frontend: [docs/FRONTEND.md](docs/FRONTEND.md).

## Penggunaan AI

Kode ditulis dengan bantuan AI coding assistant (Claude Code, model Claude Opus 5.5). Rincian lengkap menyusul di Task 23.
