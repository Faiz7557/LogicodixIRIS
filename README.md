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
