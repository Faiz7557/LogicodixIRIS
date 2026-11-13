# 10 — Audit Menyeluruh 13 November 2026

> Objek: `main` pada `8aa9be5` (merge PR #6, 12 Nov 18.43), ditambah PR terbuka #7 (`feat/ringkasan-ai`) dan #8 (`feat/sumur-bor-terkunci`). Pembanding: `docs/v2/00` sampai `09`, Guidebook LOGICODIX 2026 hal. 5-22, dan `pipeline/run_output.txt`. Rencana tindak lanjut: [11_PLAN_SUBMISSION.md](11_PLAN_SUBMISSION.md).

## 1. Ringkasan

1. **Kode sehat, produk belum bisa dikumpulkan.** Semua pemeriksaan otomatis lulus, tetapi aplikasi belum di-deploy dan `server/db.ts` tidak bisa tersambung ke Turso. Guidebook mewajibkan aplikasi Web sudah di-deploy.
2. **Data nyata sudah ada, dan data itu membantah cerita utama beranda.** Riwayat Kali Bandung di `run_output.txt` menunjukkan deteksi pada 2020, 2021, 2024, dan 2025. Beranda menganimasikan 2020-2025 sebagai enam tahun tenang, dan kotak cari menyarankan "Kalibandung".
3. **Halaman bukti masih memuat angka buatan.** Sebaran per bulan di "Bukti satelit" dan kalender kesiapan dibangkitkan dari benih acak (`lib/satelitBulanan.ts`). Labelnya "Demo", tetapi aturan tim dan lomba melarang simulasi sebagai hasil.
4. **Time Machine jujur, tetapi metriknya jenuh.** Pada 2026, 87,8% desa berlabel terpapar, sehingga batas atas tangkap 20% hanya 22,8%. Peringkat paparan kalah dari `total_riwayat` di ketiga fold tingkat desa. Bukti yang kuat ada di gerbang, bukan di tangkap 20%.
5. **Sisa waktu.** Henti fitur tim Jum 13 Nov 20.00. Target kirim Sab 14 Nov 20.00. Code freeze resmi Sab 14 Nov 23.59 WIB (Guidebook hal. 16).

## 2. Baseline terukur

Dijalankan di mesin Faiz: Node 22.19, Python 3.13 sistem (geopandas 1.1.1, pytest 9.2.0). `uv` tidak ada di PATH.

| Pemeriksaan | Hasil |
|---|---|
| `npx vitest run` | Lulus, 172 tes pada 19 berkas |
| `npm run typecheck` | Lulus |
| `npm run lint` | Lulus |
| `npm run build` | Lulus |
| `npm audit --omit=dev` | 0 kerentanan |
| `python -m pytest pipeline/tests` | Lulus, 51 tes |
| PR #7 + #8 digabung ke `main` (uji lokal, tanpa commit) | Tanpa konflik. 228 tes pada 23 berkas lulus, `tsc` dan `eslint` lulus |
| Rahasia di riwayat git | Tidak ditemukan. `.env` tidak pernah ter-commit |
| `data/siapkemarau.db` di mesin ini | 0 byte. `data/raw/` tidak ada |
| `pipeline/run_output.txt` | Hasil nyata dari mesin Primarizki: 3.706 desa, 1.361.723 deteksi sesudah filter, gerbang `pertahankan`, DB 14,1 MB |
| Tampilan 375 px (`/`, `/desa/TINGGI`, `/time-machine`, DB uji) | Tampil, tanpa galat konsol |
| Deploy, video, surat orisinalitas | Belum ada |

**Yang tidak bisa saya verifikasi:** tampilan dengan DB nyata. Semua angka nyata di dokumen ini berasal dari `run_output.txt`, bukan dari DB.

## 3. Temuan

### Kritis

| No | Temuan | Bukti | Tindakan |
|---|---|---|---|
| K1 | Deploy belum ada dan kode belum siap untuk Turso | `server/db.ts:6` memanggil `createClient({ url })` tanpa `authToken`; `DATABASE_AUTH_TOKEN` tidak dibaca di mana pun. Berkas SQLite di serverless hanya-baca, padahal pencarian, login, dan ringkasan menulis ke `rate_limit` dan `sesi`. Tidak ada konfigurasi deploy | Plan T1, T9 |
| K2 | Kisah jangkar bertentangan dengan data sendiri | `run_output.txt` baris Kali Bandung (HDX 6112070019): terpapar 2020 (2 hari), 2021 (4), 2024 (4), 2025 (6); tenang hanya 2022 dan 2023. `EnamTahun.tsx:11` dan `:31` menganimasikan 2020-2025 tenang. `page.tsx:99` menulis "enam tahun tanpa api". `SearchBox.tsx:67` menyarankan "Kalibandung". `HASIL_GERBANG.md` yang diminta plan 06 dan 08 tidak ada | Plan T5 |
| K3 | Angka per bulan adalah simulasi di halaman bukti publik | `lib/satelitBulanan.ts:10-53` membagi hari setahun dengan bobot musim dan benih acak. Dipakai `DasborSatelit.tsx:46` (publik) dan `KalenderSatelit.tsx:33`. Kartu "puncak September" diturunkan dari angka itu | Plan T4. Tanggal tiap deteksi sudah ada di pipeline |
| K4 | README belum memuat isi wajib | Guidebook hal. 18: nama tim dan anggota, masalah, target pengguna, daftar fitur, diagram arsitektur dan alur data, akun demo, atribusi. README sekarang: status "per 11 November", `siapkemarau.db` "belum dihasilkan", dan dua kalimat tentang `make bundle` yang saling bertentangan (baris 199 dan 211) | Plan T8 |
| K5 | Tangkap 20% jenuh, dan itu angka utama Time Machine | Prevalensi (baris `acak`, `pr_auc`): 0,852 / 0,814 / 0,878. Batas atas tangkap 20% = 0,235 / 0,246 / 0,228. Paparan: 0,213 / 0,233 / 0,225. `total_riwayat`: 0,234 / 0,240 / 0,228. ROC-AUC desa: paparan 0,733 / 0,807 / 0,881, `total_riwayat` 0,892 / 0,862 / 0,911. `KartuHasil.tsx:20-21` akan menulis "kalah" dan "1,1× lebih baik" di semua tahun | Plan T6. Parameter tidak diubah |

### Sedang

| No | Temuan | Bukti | Tindakan |
|---|---|---|---|
| S1 | Dokumen usulan menulis skor sesudah yang terlalu tinggi | `server/usulan.ts:59` memakai `prioritas.skorSesudah` (semua baris terpilih), sedangkan `total_usulan` dan tabel hanya memuat baris yang disetujui. `DokumenUsulan.tsx:39` | Plan T3 |
| S2 | Semua pengunjung berbagi satu jatah rate limit bila `TRUST_PROXY` kosong | `server/auth.ts:70` mengembalikan `"lokal"`. Pencarian 30 per menit dan ringkasan 20 per jam (PR #7) menjadi jatah bersama. Juri bisa kena 429 | Plan T9: `TRUST_PROXY=1` |
| S3 | Halaman Data masih menampilkan `PERLU_DIISI` | `data/manual/sumber_data.csv`: 9 sel lisensi dan 1 sel periode | Plan M2 |
| S4 | Teks catatan data memuat instruksi internal | `dq_issue.csv` baris `snpp_stop`: "Tuliskan tanggal akhir data nyata" | Plan T7 |
| S5 | FR-16 (P0) belum ada di `main` | `server/narasi.ts:25-30` selalu template. Perbaikannya di PR #7, belum di-merge. Repo tanpa CI | Plan T2 |
| S6 | Menjalankan ulang pipeline menghapus data aplikasi | `pipeline/export.py:49` `path.unlink()`. Akun, inventaris, dan usulan ikut hilang | Plan T9: urutan pipeline, unggah, seed, lalu berhenti |
| S7 | `.env.example` memuat nilai asli | `frontend/.env.example`: `NINE_ROUTER_BASE_URL=https://ret92mb.abc-tunnel.us`. Guidebook hal. 15: nama variabel tanpa nilai asli. Jalur ketiga parse mengirim teks pengguna ke tunnel pribadi yang bisa mati saat penilaian | Plan T7 |
| S8 | Dokumen bertentangan dengan keadaan | Jobdesk §2 "Tim: 2 orang"; riwayat memuat tiga akun (Faiz7557, mahadrafan, Primarizki21) dan repo punya empat kolaborator. `three` terpasang, 07_AUDIT dan TRD menolaknya (K5 plan 09 belum dicatat) | Plan M1, T8 |
| S9 | Teks di bawah 14 px | 87 pemakaian di 33 berkas, termasuk `text-[10px]` di `PapanPeringkat.tsx:51`. Design Brief: minimum 14 px | Plan T10, dipotong pertama |
| S10 | `/api/gambut` tidak dipakai layar mana pun | 2,4 MB, publik, tanpa rate limit dan tanpa cache. 1.220 desa bergambut tidak tampil di UI | Dibiarkan. Catat di README sebagai API data |
| S11 | `papers/` 7,7 MB transkrip artikel jurnal di repo publik | Keputusan 07_AUDIT §7 butir 1 masih menunggu. Riwayat tidak bisa dibersihkan | Plan M5 |

### Ringan

| No | Temuan | Tindakan |
|---|---|---|
| R1 | `/api/backtest` dan `/api/data` di-prerender saat build. Build tanpa DB membekukan respons 503 | Plan T1 |
| R2 | 11 commit lama memuat trailer `Co-Authored-By`, Jobdesk §7 menyarankan tanpa | Tidak diubah. Riwayat dilarang dimanipulasi |
| R3 | Chunk three.js 574 KB. Belum diukur di HP nyata | Cek sekali di Android saat uji deploy |
| R4 | Cache ringkasan di PR #7 berupa `Map` tanpa batas | Abaikan sampai submission |
| R5 | Bagian A dan B plan 09 (sumber api, penerima) belum dikerjakan | Dipotong. Lihat plan §"Yang dipotong" |

### Yang sudah benar dan dipertahankan

- Auth: scrypt bersalt, token sesi disimpan sebagai SHA-256, cookie `HttpOnly` dan `SameSite=Lax`, cek `Origin` di semua metode tulis, `requireDesaAccess` di semua route ber-`[kode]`.
- Semua SQL berparameter. Semua mutasi menulis `audit_log` dalam satu batch.
- Pipeline tidak bocor: `exposure` menolak tahun di atas batas, fold hanya memakai `tahun < tahun_uji`, grup titik buta memakai mode beku.
- Kalimat Time Machine menulis "kalah" bila kalah (`lib/backtest.ts:56`).
- PR #7: model tidak pernah menerima angka atau nama wilayah untuk narasi, keluaran divalidasi, kegagalan jatuh ke template.

## 4. Analisis fundamental

**Label "terpapar" terlalu longgar untuk membedakan desa.** Definisinya: minimal 2 hari deteksi dalam batas desa ditambah penyangga 2 km. Dengan definisi itu 53% sampai 93% desa terpapar setiap tahun (`run_output.txt`, "Desa-tahun terpapar per tahun"). Akibatnya ada tiga:

1. Tangkap 10/20/30% hampir sama untuk semua strategi, termasuk acak. Metrik ini tidak bisa membuktikan apa pun.
2. Kali Bandung dengan 7 deteksi (2025) dan 365 deteksi (2026) mendapat label yang sama. Intensitas hilang.
3. Hampir semua desa kemungkinan besar berlabel "Paparan tinggi". Ini belum saya cek di DB nyata.

**Yang tetap berdiri.** Gerbang yang ditetapkan sebelum data dibuka lulus: dari 298 desa "tampak aman" per akhir 2025, 190 (63,8%) terdeteksi pada 2026. Pembandingnya 11,4% untuk desa tanpa riwayat ekstrem dan 94,0% untuk desa aktif. Uji A lulus di keempat kuartil luas. ROC-AUC paparan 0,88 pada 2026.

**Yang tidak boleh dilakukan.** Mengganti `min_det_days`, penyangga, atau ambang gerbang sesudah melihat hasil. Itu memilih parameter dari jawaban. Plan hanya mengubah cara menyajikan, dan menambah satu catatan data tentang kejenuhan.

**Syarat sidang 9 November.** Tiga syarat pembebasan: pernyataan satu BPBD/Daops/CSR, wawancara pengguna, dan gerbang data. Hanya yang ketiga terpenuhi. Dua lainnya tidak bisa dipenuhi kode. Satu surel ke BPBD atau Daops (M3 plan 09) tetap bernilai lebih dari fitur baru apa pun.

## 5. Kepatuhan lomba

| Aturan (Guidebook) | Status |
|---|---|
| Repo dibuat sesudah kick-off 7 Nov (hal. 14) | Patuh. Dibuat 9 Nov |
| Commit berkala, pesan berawalan `feat`/`fix`/`docs` (hal. 14-15) | Patuh. 86 commit di `main` |
| Tanpa force push, rebase, squash (hal. 14) | Patuh sejauh terlihat. PR di-merge dengan merge commit |
| Commit hanya dari akun anggota terdaftar (hal. 13) | **Perlu dipastikan manusia.** Tiga akun meng-commit |
| Tim maksimal 4 orang (hal. 5) | Empat kolaborator. Pastikan semuanya terdaftar |
| Aplikasi Web di-deploy, akun demo tersedia (hal. 20) | **Belum** |
| README isi wajib (hal. 18) | **Belum** |
| Video 3.00-5.00 dari commit final, rekaman utuh (hal. 18-19) | Belum |
| Surat orisinalitas bermeterai, PDF (hal. 20-21) | Belum |
| Kredensial tidak di repo, `.env.example` tanpa nilai asli (hal. 15) | Patuh, kecuali S7 |
| Simulasi tidak menggantikan demonstrasi (hal. 19) | **Risiko**: K3 |
| Layanan dan kuota API aktif selama penilaian (hal. 20) | Belum diatur. Pasang batas belanja OpenAI |
