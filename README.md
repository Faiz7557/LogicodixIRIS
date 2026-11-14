# Sigap Desa

> *Enam tahun tanpa api bukan berarti aman.*

**Sigap Desa** adalah aplikasi web yang membantu desa rawan kebakaran hutan dan lahan (karhutla) di Kalimantan Barat dan Kalimantan Tengah menjawab satu pertanyaan sebelum musim kering tiba: **alat padam mana yang harus dibeli atau diperbaiki lebih dulu?**

Desa bisa melihat seberapa sering satelit mendeteksi api di wilayahnya, mencatat alat yang benar-benar berfungsi, mengukur kesiapan terhadap paket minimum satu musim, lalu mengurutkan belanja di bawah pagu anggaran. Hasil akhirnya surat usulan resmi yang diputuskan lewat musyawarah. Semua angka berasal dari data terbuka dan sumbernya ditulis di aplikasi.

Kategori **Web** · LOGICODIX 2026 · Berbasis data publik, belum diuji pengguna.

## Daftar isi

1. [Masalah dan pendekatan](#masalah-dan-pendekatan)
2. [Fitur dan halaman](#fitur-dan-halaman)
3. [Instalasi dan menjalankan di localhost](#instalasi-dan-menjalankan-di-localhost)
4. [Konfigurasi lingkungan](#konfigurasi-lingkungan)
5. [Arsitektur](#arsitektur)
6. [Mesin kesiapan dan prioritas](#mesin-kesiapan-dan-prioritas)
7. [Penggunaan AI di aplikasi](#penggunaan-ai-di-aplikasi)
8. [Keamanan](#keamanan)
9. [Referensi API](#referensi-api)
10. [Pipeline data](#pipeline-data)
11. [Basis data](#basis-data)
12. [Pengujian dan gerbang kualitas](#pengujian-dan-gerbang-kualitas)
13. [Struktur repositori](#struktur-repositori)
14. [Sumber data dan batasan](#sumber-data-dan-batasan)
15. [Penggunaan AI dalam pengembangan](#penggunaan-ai-dalam-pengembangan)

## Masalah dan pendekatan

Saat api datang, yang pertama berdiri di depan adalah warga desa sendiri, biasanya Masyarakat Peduli Api (MPA). Alatnya sering seadanya: pompa rusak, selang kurang panjang, sumur bor mati. Dana desa terbatas, dan desa yang beberapa tahun tidak terbakar cenderung merasa aman. Pada kemarau 2026, dari 298 desa di Kalimantan Barat dan Tengah yang tiga tahun tanpa deteksi, 190 terdeteksi api lagi.

Sigap Desa tidak memadamkan api dan tidak meramal kebakaran. Aplikasi ini menyusun prioritas belanja kesiapan dari tiga hal yang bisa diperiksa:

| Pertanyaan | Jawaban di aplikasi | Sumber |
|---|---|---|
| Seberapa terpapar desa ini? | Riwayat deteksi satelit 2012 sampai 2026, per tahun dan per bulan, dan berapa dari 4 tahun kering ekstrem (2015, 2019, 2023, 2026) yang terdeteksi | NASA FIRMS VIIRS S-NPP |
| Alat apa yang benar-benar berfungsi? | Inventaris yang dicatat ketua MPA, dibandingkan dengan paket minimum satu musim | Isian desa |
| Apa yang didanai lebih dulu? | Urutan belanja yang paling menaikkan skor kesiapan untuk setiap rupiah, di bawah pagu | Harga dari peraturan daerah, dapat disesuaikan desa |

## Fitur dan halaman

| Halaman | Path | Akses | Isi |
|---|---|---|---|
| Beranda | `/` | Publik | Hero 3D "lahan di bawah satelit" (Three.js), pencarian desa, angka cakupan |
| Informasi detail | `/desa/[kode]` | Publik | Grafik riwayat deteksi per tahun, kartu paparan (berapa dari 4 tahun kering ekstrem), ringkasan AI |
| Sumber dan Batasan Data | `/data` | Publik | Sumber dan lisensi, catatan batasan data, paket minimum, harga acuan beserta sumbernya |
| Masuk / Daftar | `/masuk`, `/daftar` | Publik | Masuk dengan akun desa, atau daftar sebagai ketua MPA atau sekdes untuk desa yang dipilih |
| Kesiapan Desa | `/desa/[kode]/kesiapan` | `mpa`, `desa` | Peta 3D gudang alat, skor kesiapan 0 sampai 100, kartu tiap alat, kalender satelit per bulan (tampilan kotak atau balok 3D), ringkasan AI |
| Rincian Item | `/desa/[kode]/kesiapan/[item]` | `mpa`, `desa` | Model 3D alat (pompa jinjing dapat diurai, selang digelar 30 m, penampang sumur bor), cakupan, harga |
| Catat Alat | `/desa/[kode]/inventaris` | `mpa`, `desa` | Isi jumlah alat dan yang berfungsi, atau tempel pesan WhatsApp lalu "Baca dengan AI". Hasil selalu diperiksa pengguna sebelum disimpan |
| Keputusan belanja | `/desa/[kode]/prioritas` | `desa` | Papan saran sistem, disetujui, ditolak; setiap baris punya alasan |
| Anggaran | `/desa/[kode]/prioritas/pagu` | `desa` | Pagu kesiapan (0 sampai Rp100.000.000), langkah yang terdanai dan belum, skor sesudah belanja |
| Usulan | `/desa/[kode]/usulan` | `desa` | Surat usulan dari keputusan yang disetujui, ke APBDes Perubahan, BPBD, Daops Manggala Agni, atau CSR |
| Dokumen Usulan | `/desa/[kode]/usulan/[id]` | `desa` | Surat siap cetak dengan fakta yang dibekukan saat dibuat (terkunci sebagai riwayat) |
| Akun | `/desa/[kode]/akun` | Akun | Ganti password; sesi lain akun itu diakhiri |

Peran akun:

- `mpa` (ketua MPA): mencatat inventaris dan melihat kesiapan.
- `desa` (sekdes): semua yang bisa dilakukan `mpa`, ditambah paket minimum, harga, pagu, keputusan, dan usulan.

## Instalasi dan menjalankan di localhost

### Prasyarat

| Alat | Versi | Cara pasang |
|---|---|---|
| Git | terbaru | <https://git-scm.com/downloads> |
| Node.js dan npm | Node.js 22.12 atau lebih baru | <https://nodejs.org/en/download>. npm ikut terpasang. Vitest 5 mensyaratkan Node `^22.12` |
| uv | terbaru | <https://docs.astral.sh/uv/getting-started/installation/>. Hanya perlu untuk pipeline Python dan `pytest` |
| make | opsional | Ada di Linux dan macOS. Di Windows pakai WSL, atau ikuti langkah PowerShell di bawah |

Repo ini tidak memakai `requirements.txt`. Dependency Python ada di `pyproject.toml` dan `uv.lock` (Python 3.13); `uv sync` membuat `.venv/` dan memasang semuanya.

### Cara cepat (Linux, macOS, WSL)

```bash
git clone https://github.com/Faiz7557/LogicodixIRIS.git
cd LogicodixIRIS
make setup          # npm ci, uv sync, salin .env, buat data/dev.db berisi 25 desa uji
```

Isi `DEMO_PASSWORD` di `frontend/.env`, lalu:

```bash
make seed           # buat akun demo-mpa dan demo-sekdes
make dev            # http://localhost:3000
```

### Windows (PowerShell, tanpa make)

```powershell
git clone https://github.com/Faiz7557/LogicodixIRIS.git
cd LogicodixIRIS
cd frontend; npm ci; cd ..
uv sync                                   # opsional, untuk pipeline dan pytest
if (-not (Test-Path frontend/.env)) { Copy-Item frontend/.env.example frontend/.env }
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
cd frontend
npx tsx scripts/dev-db.ts                 # buat data/dev.db (25 desa uji)
```

Isi `DEMO_PASSWORD` di `frontend/.env`, lalu dari folder `frontend/`:

```powershell
npx tsx scripts/seed-accounts.ts          # akun demo-mpa dan demo-sekdes
npm run dev                               # http://localhost:3000
```

### Masuk

Buka <http://localhost:3000>, pilih **Masuk**, dan gunakan `demo-mpa` (ketua MPA) atau `demo-sekdes` (sekdes) dengan `DEMO_PASSWORD` yang tadi diisi. Akun baru juga bisa dibuat lewat **Daftar**.

`make seed DESA=<kode>` (atau `npx tsx scripts/seed-accounts.ts --desa <kode>`) membuat akun demo untuk desa lain. Tanpa `DESA`, seed memakai desa akun demo yang sudah ada, atau desa pertama di DB.

### Memakai data desa nyata

`data/dev.db` hanya berisi data uji dan tidak boleh tampil sebagai hasil. Angka desa nyata ada di **`data/siapkemarau.db`**, yaitu DB hasil pipeline (13 November 2026, ±18 MB) yang **ikut git**, jadi sudah tersedia begitu repo di-clone tanpa perlu menjalankan pipeline.

DB ini tidak berisi akun, sesi, catatan rate limit, maupun isian desa (`inventaris_item`, `target_desa`, `harga_desa`, `rencana`, `keputusan`, `usulan`, `audit_log`). Untuk memakainya:

1. Ubah `DATABASE_URL` di `frontend/.env` menjadi `file:../data/siapkemarau.db`.
2. Jalankan ulang `npm run dev`.
3. Buat akun lewat halaman **Daftar** untuk desa yang terdaftar. Bisa juga, opsional, menjalankan seed untuk membuat akun demo dengan `DEMO_PASSWORD` milikmu.

Akun dan isian yang dibuat saat mencoba aplikasi ikut tersimpan di berkas ini, sehingga `git status` akan menandai `data/siapkemarau.db` berubah. **Jangan commit perubahan itu.** Kembalikan ke versi repo dengan `git restore data/siapkemarau.db` (hentikan `npm run dev` dulu, karena di Windows berkas yang sedang dibuka server tidak bisa ditimpa).

Untuk membuat banyak akun desa sekaligus (bukan akun demo), dari `frontend/`:

```bash
AKUN_PASSWORD=... npx tsx scripts/seed-akun-desa.ts --jumlah 10      # atau --desa kode1,kode2
```

Nama penggunanya `mpa-<namadesa>` dan `sekdes-<namadesa>`, misalnya `sekdes-kalibandung`. Password tidak pernah dicetak.

### Masalah umum

| Gejala | Penyebab dan solusi |
|---|---|
| `DEMO_PASSWORD kosong` saat seed | Isi `DEMO_PASSWORD` di `frontend/.env` |
| Halaman menampilkan galat 503 | Tabel pipeline belum ada di DB yang ditunjuk `DATABASE_URL`. Buat `data/dev.db` atau pakai `data/siapkemarau.db` yang ikut repo |
| `git pull` atau `git restore` gagal dengan "unable to unlink" pada `data/siapkemarau.db` | Server dev masih membuka berkas DB. Hentikan `npm run dev`, lalu ulangi |
| Grafik per bulan dan kalender satelit tidak tampil | DB lama belum punya tabel `desa_bulan`. Jalankan `uv run python pipeline/tambah_desa_bulan.py` (tidak menghapus akun dan isian desa) |
| Tampilan 3D kosong | Peramban tidak mendukung WebGL. Bagian lain tetap berjalan |
| "Baca dengan AI" memakai parser biasa | Tidak ada kunci AI di `frontend/.env`. Ini perilaku yang disengaja; lihat [Penggunaan AI di aplikasi](#penggunaan-ai-di-aplikasi) |
| `npm test` gagal di Node lama | Gunakan Node.js 22.12 atau lebih baru |

## Konfigurasi lingkungan

Ada dua berkas env, keduanya diabaikan git: `frontend/.env` untuk aplikasi dan `.env` di akar untuk pipeline. `make env` menyalin keduanya dari `.env.example` tanpa menimpa yang sudah ada. Jangan commit `.env`.

| Variabel | Berkas | Wajib | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | `frontend/.env` | Tidak | Contoh: `file:../data/dev.db` (data uji), `file:../data/siapkemarau.db` (data nyata), `libsql://...` (deploy). Tanpa nilai: `file:../data/siapkemarau.db` |
| `DATABASE_AUTH_TOKEN` | `frontend/.env` | Deploy | Kosong di lokal, diisi untuk libSQL jarak jauh |
| `DEMO_PASSWORD` | `frontend/.env` | Seed | Password akun `demo-mpa` dan `demo-sekdes` |
| `ANTHROPIC_API_KEY` | `frontend/.env` | Tidak | Jalur pertama "Baca dengan AI" |
| `ANTHROPIC_MODEL` | `frontend/.env` | Tidak | Bawaan `claude-opus-5-5` |
| `OPENAI_API_KEY` | `frontend/.env` | Tidak | Jalur kedua parse inventaris; juga penulis ringkasan halaman dan narasi surat usulan |
| `OPENAI_MODEL_CLASSIFIER` | `frontend/.env` | Tidak | Model parse inventaris, bawaan `gpt-6-luna` |
| `OPENAI_MODEL_RINGKASAN` | `frontend/.env` | Tidak | Model ringkasan dan narasi usulan. Kosong: memakai `OPENAI_MODEL_CLASSIFIER`, lalu `gpt-6-luna` |
| `NINE_ROUTER_BASE_URL` | `frontend/.env` | Tidak | Endpoint OpenAI-compatible untuk jalur ketiga parse |
| `NINE_ROUTER_API_KEY` | `frontend/.env` | Tidak | Tanpa kunci ini, Anthropic, dan OpenAI, parse memakai parser deterministik |
| `NINE_ROUTER_MODEL` | `frontend/.env` | Tidak | Bawaan `ag/gemini-3.8-flash-low` |
| `NINE_ROUTER_PATH` | `frontend/.env` | Tidak | Bawaan `/v1/chat/completions` |
| `TRUST_PROXY` | `frontend/.env` | Tidak | `1` hanya bila platform benar-benar mengisi `x-forwarded-for` |
| `FIRMS_MAP_KEY` | `.env` akar | Pipeline | Kunci NASA FIRMS, hanya dibaca `pipeline/fetch_firms.py` |

Aplikasi tetap berjalan penuh tanpa internet dan tanpa satu pun kunci API.

## Arsitektur

```text
               ┌──────────────────────── LAPIS 1 · OFFLINE ────────────────────────┐
 NASA FIRMS ──▶│ pipeline/*.py (Python 3.13, uv)                                   │
 HDX COD-AB ──▶│ fetch_firms · fetch_inputs · wilayah · firms · paparan · backtest │
 WRI/GFW    ──▶│ gambut_kalimantan · export · run_all                              │
               └──────────────────────────────┬────────────────────────────────────┘
                                              ▼
               ┌──────────────── LAPIS 2 · BASIS DATA ─────────────────┐
               │ SQLite / libSQL, skema di db/schema.sql               │
               │ tabel pipeline (dibaca saja) + tabel desa (ditulis)   │
               └──────────────────────────────┬────────────────────────┘
                                              ▼
               ┌──────────────────────── LAPIS 3 · WEB ────────────────────────────┐
               │ Next.js 16 App Router, React 19, Tailwind CSS 4, Three.js         │
               │ app/api/**   route handler tipis: zod, auth, panggil server/*     │
               │ server/*     auth, audit, query berparameter, logika bisnis, LLM  │
               │ lib/engine/* computeReadiness, rankPriorities (fungsi murni)      │
               └───────────────────────────────────────────────────────────────────┘
```

- **Lapis 1, pipeline offline.** Mengunduh dan mengolah 1.361.723 deteksi VIIRS (sesudah filter), batas 3.706 desa, dan poligon gambut. Hasilnya ditulis sekali ke `data/siapkemarau.db`. Aplikasi tidak pernah memanggil FIRMS saat berjalan.
- **Lapis 2, basis data.** Satu berkas SQLite. Aplikasi membaca lewat `@libsql/client`: `file:` di lokal, `libsql://` di deploy. Tabel hasil pipeline hanya dibaca. Tabel milik desa (akun, inventaris, keputusan, usulan) ditulis aplikasi dan setiap perubahan dicatat di `audit_log`.
- **Lapis 3, aplikasi.** Tidak ada server backend terpisah: route handler memanggil `frontend/src/server/*` langsung. Halaman server membaca data yang sama tanpa lewat HTTP.
- **Mesin murni.** `lib/engine/readiness.ts` dan `lib/engine/priority.ts` tidak melakukan I/O: input yang sama selalu menghasilkan keluaran yang sama, dan keduanya diuji dengan vitest.
- **3D.** Tampilan 3D dibangun prosedural dengan Three.js (tanpa berkas model), dimuat malas hanya di halaman yang membutuhkannya, dan berhenti merender saat tidak terlihat. Bila WebGL tidak ada, halaman tetap tampil dengan tampilan 2D.

| Tampilan 3D | Komponen | Halaman |
|---|---|---|
| Lahan di bawah satelit | `components/beranda/LahanSatelit.tsx` | Beranda |
| Kalender satelit balok per bulan | `components/kesiapan/Balok3DSatelit.tsx` | Kesiapan |
| Peta gudang alat | `components/kesiapan/model3d/PetaGudang.tsx`, `bangunGudang.ts` | Kesiapan |
| Model alat | `components/kesiapan/model3d/PenampilModel.tsx`, `bangunPompaJinjing.ts`, `bangunSelangKeluar.ts`, `bangunSumurBor.ts` | Rincian item |

## Mesin kesiapan dan prioritas

### Skor kesiapan (`computeReadiness`)

Setiap alat di katalog punya target dari paket minimum satu musim. Bawaannya: 1 pompa jinjing, 10 selang keluar, dan 5 sumur bor (sumur bor hanya untuk desa bergambut). Desa boleh mengubah target dan harga untuk desanya sendiri.

```text
cakupan(item) = min(berfungsi / target, 1)
skor          = 100 × Σ(bobot × cakupan) / Σ(bobot)          bobot tiap item = 20 (data/manual/katalog_item.csv)
status        = siap / sebagian siap / rawan, plus "rantai terlemah" = item dengan cakupan terendah
```

Item dengan target 0 tidak dihitung. Item terkunci (sumur bor di desa tidak bergambut) tidak masuk skor.

### Prioritas belanja (`rankPriorities`)

Algoritma greedy per unit:

1. Untuk setiap item yang kurang, kandidat aksinya adalah **perbaiki** (untuk unit rusak, bila ada harga perbaikan) dan **beli** (untuk sisa kekurangan).
2. Di setiap langkah dipilih satu unit dengan kenaikan skor terbesar per rupiah. Kenaikan item kritis yang cakupannya masih di bawah 25% dikali 1,5. Karena harga perbaikan biasanya jauh lebih murah, rasionya lebih tinggi sehingga perbaikan terpilih lebih dulu; bila rasionya sama persis, perbaikan juga didahulukan.
3. Langkah berhenti saat tidak ada lagi unit yang muat di sisa pagu. Sisanya ditampilkan sebagai "belum terdanai".
4. Setiap baris membawa alasan yang bisa dibacakan di musyawarah, misalnya "Selang keluar 1 dari 10 buah. Menaikkan cakupan ke 80%."

Urutan seri ditentukan oleh kode item, jadi hasilnya deterministik. Contoh: dengan pompa 1/1, selang 1/10, sumur bor 1/5, dan pagu Rp62.000.000, mesin memilih 4 sumur bor (Rp12.000.000) dan 7 roll selang (Rp46.683.000). Skor naik dari 43,3 ke 93,3.

Saran mesin tidak pernah langsung menjadi keputusan. Sekdes menyetujui atau menolak setiap baris, dan hanya baris yang disetujui yang masuk ke surat usulan.

## Penggunaan AI di aplikasi

AI dipakai di tiga tempat, selalu dengan pengaman, dan tidak pernah menjadi sumber angka.

| Tempat | Alur | Pengaman |
|---|---|---|
| **Baca pesan inventaris** (`server/parseInventaris.ts`) | Claude (`ANTHROPIC_MODEL`), lalu OpenAI (`OPENAI_MODEL_CLASSIFIER`), lalu 9router, lalu parser deterministik tanpa internet | Keluaran divalidasi zod: kode harus ada di katalog, angka bulat ≥ 0, berfungsi ≤ total. Hasil hanya pratinjau dan tidak pernah disimpan otomatis. Dibatasi 10 kali per jam per akun |
| **Ringkasan halaman** (`server/ringkasan.ts`) | Server menyusun fakta yang sudah diformat persis seperti di layar, lalu OpenAI hanya menulis kalimat | Setiap angka di keluaran harus sama persis dengan fakta, panjang dibatasi, dan ada daftar kata terlarang (misalnya "penyebab", "dijamin aman"). Bila gagal: template berlabel. Nama desa, nama akun, dan catatan pengguna tidak pernah dikirim ke model |
| **Narasi surat usulan** (`server/narasi.ts`) | Model hanya menerima placeholder dan kanal tujuan, lalu menulis paragraf formal | Model tidak melihat angka maupun nama; server mengisi `{{placeholder}}` sesudah memeriksa keluarannya. Skor, status, dan riwayat satelit tidak dimuat di surat. Bila gagal: template |

Ringkasan tersedia untuk halaman paparan, kesiapan, prioritas, anggaran, dan usulan, dengan batas 20 permintaan per jam per pemilik dan 300 per jam secara global. Tanpa kunci API apa pun, semua fitur tetap jalan dengan parser deterministik dan template.

## Keamanan

- **Password** di-hash dengan `scrypt` dan salt acak 16 byte per akun, lalu dibandingkan dengan `timingSafeEqual`.
- **Sesi** disimpan di tabel `sesi`. Cookie-nya `HttpOnly`, `SameSite=Lax`, berumur 7 hari, dan `Secure` di produksi. Ganti password mengakhiri sesi lain akun itu.
- **CSRF:** setiap metode tulis wajib lolos `assertOrigin` (Origin harus sama dengan Host).
- **Otorisasi per desa:** `requireDesaAccess` menolak akun desa lain atau peran yang tidak cocok.
- **SQL** selalu berparameter. Setiap mutasi menyimpan `updated_by` dan `updated_at` dan dicatat ke `audit_log`.
- **Rate limit** tersimpan di DB:

  | Aksi | Batas |
  |---|---|
  | Pencarian desa | 30 per menit per IP |
  | Masuk | 10 per 15 menit per username dan IP |
  | Daftar | 5 per 15 menit per IP |
  | Ganti password | 5 per 15 menit per akun |
  | Parse | 10 per jam per akun |
  | Ringkasan | 20 per jam per pemilik dan 300 per jam global |

  Saat batas terlewati, respons memakai status `429` dengan header `Retry-After`.

## Referensi API

Semua respons berupa JSON. Galat memakai `{ "error": { "kode": "...", "pesan": "..." } }`. Status yang dipakai: `200`, `201` (dengan `Location`), `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429` (dengan `Retry-After`), dan `503` saat tabel pipeline belum ada.

| Metode | Path | Akses | Sukses |
|---|---|---|---|
| GET | `/api/desa?q=` | Publik, 30/menit per IP | 200 `{ hasil }`, maks. 20, minimal 2 karakter |
| GET | `/api/desa/[kode]` | Publik | 200 `DesaCard` (paparan, riwayat per tahun dan per bulan) |
| GET | `/api/data` | Publik | 200 sumber, catatan data, meta, paket, harga |
| GET | `/api/gambut` | Publik | 200 `{ hasil }`, 1.220 desa bergambut. Bawaan membawa `geomJson` (±2,4 MB); `?geom=0` hanya atribut (±300 KB) |
| POST | `/api/ringkasan` | Publik untuk `paparan`; akun untuk halaman lain | 200 `Ringkasan` (AI atau template berlabel) |
| GET | `/api/auth/daftar?kode=` | Publik, 60/menit per IP | 200 peran yang masih bisa didaftarkan di desa itu |
| POST | `/api/auth/daftar` | Publik, 5/15 menit per IP | 201 `{ akun }` + cookie sesi |
| POST | `/api/auth/masuk` | Publik, 10/15 menit per username+IP | 200 `{ akun }` + cookie sesi |
| POST | `/api/auth/keluar` | Publik | 204, cookie dihapus |
| GET | `/api/auth/saya` | Akun | 200 `{ akun }` |
| POST | `/api/auth/sandi` | Akun, 5/15 menit | 200 `{ ok }`, sesi lain diakhiri |
| GET, PUT | `/api/desa/[kode]/inventaris` | `mpa`, `desa` | 200 `{ rows, terakhir }`, 200 `{ disimpanPada }` |
| POST | `/api/desa/[kode]/inventaris/parse` | `mpa`, `desa`, 10/jam per akun | 200 `{ hasil, sumber }` |
| GET, PUT | `/api/desa/[kode]/paket` | GET `mpa`/`desa`, PUT `desa` | 200 `{ hasil }`, 204 |
| GET, PUT | `/api/desa/[kode]/harga` | GET `mpa`/`desa`, PUT `desa` | 200 `{ hasil }`, 204 |
| GET | `/api/desa/[kode]/kesiapan` | `mpa`, `desa` | 200 `ReadinessResult` |
| GET | `/api/desa/[kode]/prioritas` | `desa` | 200 `PriorityResult` + keputusan |
| PUT | `/api/desa/[kode]/rencana` | `desa` | 204, pagu 0 sampai Rp100.000.000 |
| PUT | `/api/desa/[kode]/keputusan` | `desa` | 204, satu baris prioritas disetujui atau ditolak |
| GET, POST | `/api/desa/[kode]/usulan` | `desa` | 200 `{ hasil, meta }` (`?limit=1..50&cursor=`), 201 `{ id }` + `Location` |
| GET | `/api/desa/[kode]/usulan/[id]` | `desa` | 200 `Usulan` dengan fakta beku |

Pada `/api/ringkasan`, body berisi `{ "halaman": "paparan" | "kesiapan" | "prioritas" | "anggaran" | "usulan", "kode": "<kode desa>" }`. Fakta selalu disusun server; klien hanya menyebut halaman dan kode.

## Pipeline data

Pipeline dijalankan sekali secara offline, lalu hasilnya dibaca aplikasi.

```bash
uv sync
uv run python pipeline/fetch_inputs.py   # batas desa HDX COD-AB ADM4 + gambut WRI/GFW, tanpa kunci
uv run python pipeline/fetch_firms.py    # FIRMS VIIRS S-NPP (SP + NRT), butuh FIRMS_MAP_KEY di .env akar
uv run python pipeline/run_all.py        # tulis data/siapkemarau.db + pipeline/run_output.txt
uv run pytest pipeline/tests -q
```

Padanannya dengan Make: `make pipeline-inputs`, `make pipeline-fetch`, `make pipeline-run`, `make pipeline-test`.

| Berkas | Isi |
|---|---|
| `pipeline/params.py` | Parameter, tahun kering ekstrem, dan label |
| `pipeline/fetch_firms.py` | Unduh CSV VIIRS S-NPP arsip standar (SP) dan near-real-time (NRT) |
| `pipeline/fetch_inputs.py` | Unduh batas desa HDX dan poligon gambut WRI/GFW |
| `pipeline/wilayah.py` | Tabel desa, luas, fraksi gambut |
| `pipeline/firms.py` | Filter deteksi, tetapkan ke desa, agregasi per tahun dan per bulan |
| `pipeline/paparan.py` | Paparan per desa dan kecamatan |
| `pipeline/backtest.py` | Uji mundur tiga fold dan gerbang, dipakai untuk memutuskan klaim yang boleh tampil |
| `pipeline/gambut_kalimantan.py` | Desa bergambut seluruh Kalimantan (CSV + GeoJSON, 1.220 desa) |
| `pipeline/export.py` | Tulis semua tabel ke SQLite sesuai `db/schema.sql` |
| `pipeline/run_all.py` | Jalankan seluruh pipeline dan tulis angka kontrol |
| `pipeline/tambah_desa_bulan.py` | Tambahkan tabel `desa_bulan` ke DB yang sudah ada tanpa membangun ulang |

`data/raw/` diabaikan git, jadi unduh ulang bila ingin menjalankan pipeline sendiri. DB hasilnya, `data/siapkemarau.db`, sudah ikut repo. **`run_all.py` menghapus dan membuat ulang DB**, sehingga akun, inventaris, dan usulan ikut hilang. Untuk DB yang sudah dipakai, gunakan `tambah_desa_bulan.py`.

### Menerima data dari anggota tim

Clone baru sudah membawa `data/siapkemarau.db`, jadi langkah ini hanya perlu bila anggota tim mengirim DB yang lebih baru di luar git. Aplikasi hanya membaca `DATABASE_URL`, jadi hasil akhirnya harus berada di **`data/siapkemarau.db`**. Simpan zip di luar repo, lalu ambil DB-nya saja:

```bash
unzip -j ../siapkemarau.db-nyata-*.zip siapkemarau.db -d data/   # zip dari anggota tim, isinya datar
unzip ../siapkemarau-data.zip -d .                              # zip dari make bundle, sudah berawalan data/
ls -lh data/siapkemarau.db                                      # ±18 MB, ada tabel desa_bulan
```

Jangan menjalankan `make pipeline-run` sesudahnya, karena perintah itu menimpa DB beserta akun dan isian desa. Bila DB baru itu memang mau dibagikan lewat git, pastikan dulu tidak ada akun maupun isian desa di dalamnya sebelum di-commit.

### Membagikan data pipeline

DB hasil pipeline dibagikan lewat git. Data mentah `data/raw/` tetap diabaikan git karena besar; untuk membagikannya tanpa mengunduh ulang:

```bash
make bundle        # tulis ../siapkemarau-data.zip (data/siapkemarau.db + data/raw + data/dev.db bila ada, ±220 MB)
```

Berkas `.env`, `.venv/`, `node_modules/`, dan `.next/` tidak ikut. Penerima mengekstrak zip di akar clone, mengatur `DATABASE_URL`, lalu (opsional) menjalankan seed untuk membuat akun demo dengan `DEMO_PASSWORD` sendiri.

Yang ikut dan tidak ikut git di folder `data/`:

| Berkas | Git |
|---|---|
| `data/siapkemarau.db` (DB nyata hasil pipeline, tanpa akun dan isian desa) | ikut |
| `data/manual/*.csv` | ikut |
| `data/dev.db` (data uji) | diabaikan |
| `data/siapkemarau.db-*`, `-journal`, cadangan, dan sejenisnya | diabaikan |
| `data/raw/`, `data/*.zip`, `data/siapkemarau-data/` | diabaikan |

## Basis data

Skema lengkap ada di `db/schema.sql`, yang menjadi acuan untuk pipeline (`export.py`) dan data uji (`scripts/dev-db.ts`).

| Kelompok | Tabel | Ditulis oleh |
|---|---|---|
| Acuan | `meta`, `sumber_data`, `dq_issue`, `katalog_item`, `paket_minimum`, `referensi_pergub`, `harga_item` | Pipeline, dari `data/manual/*.csv` |
| Wilayah dan satelit | `desa`, `desa_gambut`, `deteksi_ringkas`, `desa_tahun`, `desa_bulan`, `desa_paparan`, `kecamatan_paparan` | Pipeline |
| Uji mundur | `backtest_metric`, `backtest_grup` | Pipeline |
| Akun | `akun`, `sesi`, `rate_limit` | Aplikasi (kosong di DB yang ikut repo) |
| Isian desa | `inventaris_item`, `target_desa`, `harga_desa`, `rencana`, `keputusan`, `usulan` | Aplikasi (kosong di DB yang ikut repo) |
| Jejak | `audit_log` | Aplikasi |

`data/manual/*.csv` ikut git dan berisi katalog alat, paket minimum, harga acuan beserta sumbernya, daftar sumber data, dan catatan kualitas data.

## Pengujian dan gerbang kualitas

| Kebutuhan | Dengan Make | Perintah asli |
|---|---|---|
| Tes unit (vitest + pytest) | `make test` | `cd frontend && npm test` lalu `uv run pytest pipeline/tests -q` |
| Typecheck | `make typecheck` | `cd frontend && npm run typecheck` |
| Lint | `make lint` | `cd frontend && npm run lint` |
| Build produksi | `make build` | `cd frontend && npm run build` |
| Jalankan hasil build | `make start` | `cd frontend && npm run build && npm start` |
| Gerbang sebelum commit | `make gate` | tes, typecheck, lint, dan build |
| Buat ulang DB uji | `make db` | `cd frontend && npx tsx scripts/dev-db.ts` |
| Bersihkan build | `make clean` | `rm -rf frontend/.next` |

Tes frontend meliputi mesin kesiapan dan prioritas, format angka dan terbilang, parser inventaris, auth dan akun, query, ringkasan, narasi, dan usulan. Tes pipeline meliputi unduhan FIRMS, agregasi, paparan, uji mundur, ekspor, dan kecocokan skema. `make setup` dan `make db` membuat ulang `data/dev.db`, jadi data uji di dalamnya ikut hilang. `make help` menampilkan semua target.

Bila menambah dependency, jalankan `npm install <paket>` dari `frontend/`, lalu commit `package.json` dan `package-lock.json`. Instalasi memakai `npm ci` supaya hasilnya deterministik.

## Struktur repositori

| Path | Isi |
|---|---|
| `frontend/src/app/` | Halaman App Router dan route handler `api/**` |
| `frontend/src/server/` | Auth, DB, query, inventaris, kesiapan, prioritas, usulan, ringkasan, narasi, parse, LLM |
| `frontend/src/lib/` | Tipe, format, kalimat, pemanggil API, fungsi murni |
| `frontend/src/lib/engine/` | `readiness.ts` dan `priority.ts` |
| `frontend/src/components/` | Komponen UI, termasuk `beranda/` (hero 3D) dan `kesiapan/model3d/` (peta gudang dan model alat) |
| `frontend/src/content/` | Teks halaman Data |
| `frontend/scripts/` | `dev-db.ts`, `seed-accounts.ts`, `seed-akun-desa.ts` |
| `db/schema.sql` | DDL lengkap |
| `pipeline/` | Komputasi offline dan tes pytest |
| `data/manual/` | CSV acuan yang ikut repo |
| `data/siapkemarau.db` | DB nyata hasil pipeline, ikut git (tanpa akun dan isian desa) |
| `data/` (lainnya) | `dev.db`, `raw/`, cadangan DB, dan zip; semuanya diabaikan git |
| `docs/v2/` | PRD, TRD, App Flow, Design Brief, skema, rencana implementasi, audit |
| `docs/FRONTEND.md` | Panduan UI/UX dan keadaan layar |
| `reports/`, `research_notes/`, `papers/` | Riset pemilihan masalah, literatur, dan regulasi |
| `Makefile` | Perintah singkat untuk semua langkah di atas |

## Sumber data dan batasan

| Data | Sumber | Lisensi |
|---|---|---|
| Deteksi titik panas 2012 sampai 2 Nov 2026 | NASA FIRMS VIIRS S-NPP (SP + NRT) | Kebijakan data NASA Earthdata |
| Batas desa (ADM4) | HDX COD-AB Indonesia | CC BY-IGO |
| Lahan gambut | GFW Indonesia Peat Lands (WRI) | Ketentuan WRI Data Platforms |
| Pedoman sarana MPA | Pergub Kalteng 35/2025 | Bukan objek hak cipta (UU 28/2014) |
| Harga alat | Perbup Sanggau 32/2025, Perwal Kediri 3/2025, dan sumber lain di `data/manual/harga_item.csv` | Dokumen publik |

Batasan yang juga ditampilkan di halaman `/data`:

- Satu titik deteksi bukan satu kebakaran, dan bukan luas terbakar.
- Awan dan asap dapat menutupi api dari satelit.
- Api gambut bersuhu rendah bisa terlewat satelit. Tidak ada titik api di peta bukan berarti tidak ada api.
- Paket minimum adalah asumsi tim yang berdasar pada Pergub Kalteng dan temuan lapangan. Desa dapat mengubahnya.
- Produk ini belum diuji pengguna.

## Penggunaan AI dalam pengembangan

Kode ditulis dengan bantuan AI coding assistant (Claude Code, model Claude Opus 5.5). Model yang dapat dipakai aplikasi saat berjalan diatur lewat env: `ANTHROPIC_MODEL` (bawaan `claude-opus-5-5`), `OPENAI_MODEL_CLASSIFIER` dan `OPENAI_MODEL_RINGKASAN` (bawaan `gpt-6-luna`), serta `NINE_ROUTER_MODEL` sebagai jalur terakhir parse. Rencana dan keputusan desain ada di [docs/v2/](docs/v2/).
