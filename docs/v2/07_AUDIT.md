# 07 — Audit dan Kurasi: SiapKemarau v2

> Tanggal: 10 November 2026. Objek: repo `Faiz7557/LogicodixIRIS` pada commit `aeb07d8`, dibandingkan dengan `v2/v2/00` sampai `06`. Rujukan desain: proyek lokal `caliber-final` (Sparekit, CALIBER 2026). Rencana tindak lanjut ada di [08_AGENT_PLAN.md](08_AGENT_PLAN.md).

## 1. Ringkasan

1. **Yang ada baru lapisan tampilan.** Sepuluh layar sudah dibangun dan rapi, tetapi semuanya membaca data contoh dari `frontend/src/mocks/`. Belum ada basis data, pipeline, mesin di server, autentikasi, atau satu pun route handler.
2. **Tampilan itu patuh pada docs v2.** Istilah, teks wajib, nilai paket minimum, harga, jeda, dan lebar konten cocok dengan PRD, App Flow, dan Design Brief. Tidak ada kata terlarang.
3. **Risiko terbesar bukan kode, tetapi data.** FIRMS, HDX, dan WRI belum diambil. Gerbang data jatuh tempo Kamis 12 November siang. Tanpa itu FR-02, FR-04, dan FR-05 tidak punya isi yang sah.
4. **Desain caliber-final cocok sebagai bahasa visual, tidak cocok sebagai tata letak.** Prinsipnya sama dengan Design Brief v2 (judul sebagai pertanyaan, jawaban satu kalimat, status berupa ikon dan teks). Kepadatan, 3D, dan pustaka komponennya bertentangan dengan v2 dan tidak diadopsi.
5. **Aturan orisinalitas membatasi cara adopsi.** Docs v2 melarang kode proyek lain masuk repo. Yang boleh dibawa hanya keputusan desain yang ditulis ulang, bukan berkas.

## 2. Baseline terukur

Dijalankan pada klon bersih, Node 22.19, Python 3.13.7 dengan geopandas 1.1.1.

| Pemeriksaan | Hasil |
|---|---|
| `npm ci` | Lulus, 405 paket |
| `npm test` | Lulus, 77 tes pada 7 berkas |
| `npm run lint` | Lulus |
| `npm run build` | Lulus, 13 rute |
| `npm run typecheck` sebelum build | **Gagal**, 8 galat `PageProps` dan `LayoutProps` tidak dikenal |
| `npm run typecheck` sesudah build | Lulus |
| Kata terlarang di `frontend/src` | Tidak ada sebagai klaim produk |
| `dangerouslySetInnerHTML` | Tidak ada |
| Route handler `app/api/**` | 0 berkas |
| Berkas di luar `mocks/` yang mengimpor `@/mocks` | 10 berkas |

## 3. Kesesuaian per kebutuhan

| FR | Layar | Data dan server | Catatan |
|---|---|---|---|
| FR-01 Cari desa | Ada. 2 karakter, jeda 250 ms | Belum. `mocks/pencarian.ts` | Uji `%` dan `_` belum bisa dibuat tanpa DB |
| FR-02 Kartu Paparan | Ada. `YearStrip`, kalimat utama, catatan | Belum. `mockDesaCard` | `DesaCard.gerbang` adalah usulan kontrak di luar TRD §8 |
| FR-03 Paparan kecamatan (P1) | Ada, `kalimatKecamatan` | Belum | |
| FR-04 Time Machine | Ada. Tombol "Buka 2026", tabel metrik | Belum. **Angka contoh** di `mocks/backtest.ts` | Tidak boleh tampil di demo |
| FR-05 Data dan Asumsi | Ada, isi dari dokumen | Belum membaca `meta`, `dq_issue`, `sumber_data` | |
| FR-06 Masuk dan peran | Ada | **Tiruan**: cookie `mock-peran`, tanpa cookie dianggap sekdes | Tidak ada kontrol akses |
| FR-07 Catat Alat | Ada, validasi klien lengkap | Belum. Simpan tiruan | |
| FR-09 Paket minimum | Ada, satu paket, alasan wajib | Belum. `localStorage` | |
| FR-10 Skor Kesiapan | Ada. Gauge, rantai terlemah, keterangan provinsi | Belum. Angka tetap dari mock | |
| FR-11 Harga | Ada, sumber wajib | Belum | Nilai mock sama dengan PRD §8 |
| FR-12 Prioritas | Ada. Default Rp15 juta, penggeser sampai Rp100 juta, jeda 300 ms | Mesin tiruan berjalan di klien | TRD dan rencana 06 meminta hitung ulang di server |
| FR-13 Keputusan | Ada | Belum. `localStorage` | |
| FR-14 Kestabilan (P1) | Belum | Belum | |
| FR-15 Usulan | Ada. Empat kanal, cetak A4, pernyataan asumsi | Belum. Fakta tidak dibekukan di server | |
| FR-16 Narasi AI | Badge ada | Belum. Hanya template tiruan | |
| FR-19 Tempel pesan (P1) | Belum | Belum | |
| NFR-04 Keamanan | | Belum sama sekali | |
| NFR-08 Log audit | | Belum | |

## 4. Temuan

### Kritis

| No | Temuan | Bukti | Tindakan |
|---|---|---|---|
| K1 | Tidak ada backend. Semua P0 belum hidup dengan data nyata | Tidak ada `db/`, `data/`, `pipeline/`, `src/lib/engine/`, `app/api/`. `package.json` tidak memuat `@libsql/client`, `zod`, `@anthropic-ai/sdk` | Plan gelombang 0 sampai 3 |
| K2 | Akses tanpa autentikasi | `lib/dataSource.ts` `getAkun()` mengembalikan akun sekdes bila cookie tidak ada | Plan T20, dengan tes khusus cookie `mock-peran` |
| K3 | Jalur data nyata belum dimulai, dan itu bergantung pada manusia | TRD §4 kolom status: "Belum diambil". Butuh akun Earthdata dan `FIRMS_MAP_KEY` | Tugas manusia M1 dan M2 hari ini. Plan T34 |
| K4 | Data contoh masih menjadi isi layar publik | `TimeMachineView` memakai `mockMetrik`. Beranda memuat "65,3 → 70,7" | Plan T22, T41a, T42. Aturan lomba melarang data simulasi sebagai hasil |

### Sedang

| No | Temuan | Bukti | Tindakan |
|---|---|---|---|
| S1 | Isi repo tidak sesuai Jobdesk §7 | `papers/` (7,7 MB transkrip, termasuk artikel jurnal), `reports/`, `research_notes/`, dan `docs/00` sampai `06` lama ikut ter-commit. Docs v2 berada di `v2/v2/`, bukan `docs/v2/`. README menaut ke `docs/06` lama | Plan T01. Penghapusan `papers/` butuh keputusan (§7 butir 1). Riwayat tidak bisa dibersihkan karena force push dilarang |
| S2 | Pola commit berisiko terbaca sebagai unggahan borongan | 4 commit, satu penulis, dua pasang berjarak 1 detik. Commit `aeb07d8` memuat sekitar 5.900 baris. Keempatnya memuat trailer `Co-Authored-By`, sedangkan Jobdesk §7 menyarankan tanpa trailer | Mulai sekarang satu task satu commit. Keputusan trailer di §7 butir 2 |
| S3 | Struktur berbeda dari TRD §11 | Kode ada di `frontend/`, TRD menaruh `src/` di akar | Pertahankan `frontend/`. `db/`, `data/`, `pipeline/` di akar. Ubah alamat DB menjadi `file:../data/siapkemarau.db` |
| S4 | `typecheck` gagal pada klon bersih | Tipe `PageProps` dibuat saat build | Skrip menjadi `next typegen && tsc --noEmit` |
| S5 | Nama berkas rencana 06 sudah terpakai | `lib/inventaris.ts`, `lib/kesiapan.ts`, `lib/prioritas.ts`, `lib/usulan.ts` berisi pembantu tampilan | Kode server masuk `src/server/` |
| S6 | Mesin tiruan berbeda bentuk dari TRD §6 | `rankPriorities` menerima `items`, TRD menerima `readiness` | Mesin asli mengikuti TRD dan tes rencana 06 Task 10 dan 11 |
| S7 | `.env.example` belum lengkap | Tidak ada `FIRMS_MAP_KEY`. Hanya ada di `frontend/` | Plan T01 |
| S8 | Penyimpangan kecil dari Design Brief | 13 baris memakai teks 12 px (batas 14 px). Laptop memakai sidebar, brief menulis navigasi atas | Plan T14 dan T41. Sidebar disahkan di brief |

### Ringan

| No | Temuan | Tindakan |
|---|---|---|
| R1 | README masih kerangka dan menyebut satu model AI saja | Plan T52 mencatat semua model yang dipakai |
| R2 | Komentar kode merujuk `docs/04_DESIGN_BRIEF.md` lama | Plan T01 |
| R3 | Surel git lokal `...@ftmm.unair.ac.id` belum dipastikan tertaut ke akun GitHub terdaftar | Tugas manusia M8 |
| R4 | `eslint@9.39.5` ditandai usang oleh npm | Abaikan sampai submission |

### Yang sudah benar dan dipertahankan

- Semua layar punya keadaan memuat, kosong, dan galat, dan dapat diuji lewat kode desa khusus.
- `lib/kalimat.ts`, `lib/backtest.ts`, `lib/kesiapan.ts`, `lib/prioritas.ts`, `lib/inventaris.ts`, dan `lib/format.ts` adalah fungsi murni bertes. Ini dipakai ulang, tidak ditulis ulang.
- Nilai paket minimum (1, 1, 10, 5), bobot (15, 20, 20, 20), dan empat harga acuan sama dengan PRD §7 dan §8.
- Lebar konten 720 px dan 1040 px, target sentuh 44 px, cetak A4, `prefers-reduced-motion`.

## 5. Analisis fundamental

Sidang `/court` 9 November memutus 12 banding 0 bahwa **klaimnya** gagal, bukan proyeknya. Tiga syarat pembebasan dan tanggapan v2:

| Syarat sidang | Tanggapan docs v2 | Status |
|---|---|---|
| Pernyataan tercatat dari satu BPBD, Daops, atau CSR | Tidak dikejar. Jobdesk §2: bukti hanya data publik dan sekunder | Diganti dengan mempersempit klaim |
| Wawancara sekdes dan ketua MPA | Tidak dikejar. Jobdesk §2: tanpa wawancara | Diganti dengan label "belum diuji pengguna" di Beranda, Data, README |
| Minta data FIRMS, siapkan cadangan, jalankan gerbang | Masuk Task 0 dan Task 8 | **Belum dikerjakan. Ini satu-satunya syarat yang masih bisa dipenuhi** |

Konsekuensi:

1. Nilai produk di depan juri sekarang bertumpu pada tiga hal yang bisa dibuktikan tanpa pengguna: data satelit nyata, gerbang yang hasilnya ditampilkan apa adanya, dan AI yang tidak bisa mengarang angka. Ketiganya ada di jalur data dan server, bukan di tampilan.
2. Cadangan FIRMS di TRD §4 hanya menutup celah SP ke NRT. Belum ada cadangan bila kunci API tidak keluar tepat waktu. Kandidat yang perlu dicek hari ini: unduhan arsip tahunan per negara di situs FIRMS, yang tidak memakai `MAP_KEY`.
3. Bobot UI/UX 15% (Design Brief). Adopsi desain harus murah dan dipotong lebih dulu daripada fitur P0 mana pun.
4. Keberatan juri sidang soal dasar hukum FR-15 dijawab v2 dengan rumusan netral Tahun Anggaran 2027 dan larangan menyebut pasal. Tes untuk itu sudah ada di rencana 06 Task 16 dan wajib ikut.

## 6. Analisis desain caliber-final

### 6.1 Teknis

| Unsur Sparekit | Bukti di `caliber-final/app` | Kecocokan dengan v2 | Keputusan |
|---|---|---|---|
| Netral hangat, tinta untuk semua kontrol, satu aksen | `globals.css` `--ground`, `--ink`, `--accent` | Sama keluarga dengan `--paper`, `--ink`, `--ember` | **Adopsi.** Nama token v2 dipertahankan, nilainya disetel |
| Status tiga serangkai: lembut, pekat, tinta | `--act-soft`, `--act`, `--act-ink` dan seterusnya | Memenuhi NFR-07, status tidak hanya warna | **Adopsi** untuk `ok`, `warn`, `danger`, `water`, `ember` |
| Kartu lembut: radius 20 px, garis rambut, bayangan tipis | `ui.tsx` `Panel` | Cocok. Keduanya melarang kartu di dalam kartu | **Adopsi** |
| Judul sebagai pertanyaan, jawaban satu kalimat | `ui.tsx` `PageHead` | Identik dengan prinsip Design Brief §1 | **Adopsi** |
| Chip status: ikon dan kata di atas warna lembut | `ui.tsx` `Chip` | Cocok | **Adopsi** ke `StatusBadge` |
| Sidebar bergrup pertanyaan | `shell.tsx` | Sudah diadaptasi di `NavAkun` | **Pertahankan**, sahkan di brief |
| Fokus tinta, transisi singkat, hormati reduced motion | `globals.css`, `template.tsx` | Cocok | **Adopsi** nilai, tanpa pustaka |
| Font Geist | `layout.tsx` | Brief menulis Public Sans | **Adopsi** untuk antarmuka. Cetak tetap Source Serif 4 |
| Aksen `#d9480f` | `globals.css` | Kontras 4,30 di atas putih, gagal AA untuk teks | **Tolak nilainya.** `--ember #b4431a` tetap (5,59) |
| Teks 11,5 sampai 13,5 px | Hampir semua komponen | Brief: minimum 14 px, dasar 16 px | **Tolak** |
| 3D three.js, latar mesh, kartu berpendar | `components/three/`, `.hall-mesh`, `.glow-card` | Brief §9 melarang animasi latar. TRD melarang dependensi baru | **Tolak** |
| Radix, lucide, motion, recharts, clsx | `package.json` | TRD §1 butir 3 dan Brief §7: tanpa pustaka komponen | **Tolak.** Ikon SVG sebaris, transisi CSS |
| Asisten AI, tur, alih bahasa, PWA | `assistant.tsx`, `tour.tsx`, `lang.tsx`, `pwa.tsx` | Di luar cakupan PRD §10 | **Tolak** |

Kontras token usulan sudah dihitung dan semua pasangan teks lolos AA: `ink/paper` 16,30, `muted/paper` 8,42, `faint/paper` 4,55, `ember/surface` 5,59, `water/surface` 7,51, `ok/ok-soft` 5,17, `warn/warn-soft` 5,49, `danger/danger-soft` 6,11, putih di atas `ink` 17,92.

### 6.2 Fundamental

Sparekit dibuat untuk perencana kilang di depan monitor: padat, banyak angka, sidebar lebar. SiapKemarau dibuat untuk sekdes dengan HP Android 360 px di luar ruangan. Karena itu yang diadopsi adalah **cara Sparekit menjawab** (pertanyaan, satu kalimat, lalu bukti; warna hanya untuk status; tinta untuk tindakan), bukan **kepadatannya**. Arah "buku kas desa yang jujur" tetap berlaku.

### 6.3 Batas orisinalitas

Rencana 06 bagian Global Constraints: "Tidak boleh ada kode, repo, atau hasil proyek lain", dan TRD §1 butir 5: semua kode ditulis selama Hacking Week. Maka:

- Tidak ada berkas dari `caliber-final` yang disalin, termasuk `ui.tsx`, `shell.tsx`, ikon, dan gambar.
- Komponen ditulis baru di repo ini dari spesifikasi di plan.
- README menyebut rujukan desainnya secara terbuka.
- Pertanyaan apakah memakai ulang bahasa visual proyek sendiri diperbolehkan dikirim tertulis ke Helpdesk (M3).

## 7. Keputusan yang menunggu Anda

| No | Keputusan | Bawaan yang dipakai plan |
|---|---|---|
| 1 | Hapus `papers/`, `reports/`, `research_notes/` dari repo sesuai Jobdesk §7 | Ya, sesudah CSV statistik dipindah ke `data/manual/`. Dieksekusi hanya setelah Anda setuju, karena ini pilihan sadar rekan tim |
| 2 | Trailer `Co-Authored-By` pada commit baru | Tanpa trailer, sesuai Jobdesk §7. Penggunaan AI ditulis di README |
| 3 | Pertahankan folder `frontend/` | Ya |
| 4 | Ganti font antarmuka ke Geist | Ya |
| 5 | Pekerjaan desain menyentuh berkas milik Rafan | Koordinasi dulu sebelum T24 dan T41 |
