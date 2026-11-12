# 01 — Product Requirements Document: SiapKemarau v2

> Turunan dari [00_JOBDESK.md](00_JOBDESK.md). **P0** wajib saat submission. **P1** dikerjakan setelah semua P0 hidup. **P2** hanya roadmap.

## 1. Masalah

Desa gambut rawan masuk musim kering tanpa dana operasi dan alat padam yang berfungsi. Pos kesiapan mudah hilang setelah beberapa tahun tenang, dan dana yang tersedia kecil.

| Bukti | Sumber | Batas |
|---|---|---|
| Kalibandung: enam tahun tanpa api, selang 100 m, warga patungan BBM | Mongabay, 31 Agu 2026 | Satu kasus, dan efisiensi dana desa ikut berperan |
| Talio Hulu: 8 dari 50 sumur berfungsi pada 2021 | Mongabay, 6 Okt 2021 | Satu kasus |
| Kendala paling umum MPA adalah dana operasi dan pemeliharaan | Nurhidayah dkk. 2023, 6 desa | Riau dan Kalteng, data 2019 |
| Anggaran MPA tiga desa sekitar Rp15-30 juta per tahun | Nurhidayah dkk. 2023, hlm. 9 | Ilustrasi skala, Riau |
| Sekitar 58,03% pagu Dana Desa 2026 dialokasikan ke Koperasi Merah Putih | Pemberitaan atas PMK 7/2026 | Sekunder. Abstrak PMK tidak memuatnya |

## 2. Tujuan

| Tujuan | Ukuran | Target saat submission |
|---|---|---|
| Desa melihat paparan dari data nyata | Desa Kalbar dan Kalteng yang punya kartu paparan | 100% desa dalam batas HDX |
| Klaim diuji di data | Gerbang dan Time Machine 2019, 2023, 2026 | Dihitung dan ditampilkan apa adanya |
| Satu desa selesai sampai usulan | Waktu orang luar tim menyelesaikan alur | 10 menit atau kurang |
| Narasi AI tidak mengarang | Keluaran AI yang lolos pengaman, atau jatuh ke template | 100% |
| Klaim tetap jujur | Kemunculan "hektare terselamatkan" dan "tervalidasi pengguna" | 0 |

## 3. Pengguna

Peran berasal dari sumber sekunder. Produk belum diuji dengan pengguna.

| Peran | Tugas | Kebutuhan | Batasan |
|---|---|---|---|
| Sekdes atau kades | Menyusun usulan belanja | Bukti paparan, urutan belanja, dokumen | Bukan orang teknis, waktu sedikit |
| Ketua MPA | Mengetahui kondisi alat | Formulir cepat di HP | Sinyal tidak stabil |
| Publik dan juri | Memeriksa data dan metode | Akses tanpa akun | Hanya baca |

**Momen pakai yang dituju:** penyusunan Perubahan APBDes 2027 dan RKP Desa 2028. APBDes 2027 murni tidak dijanjikan, karena RKP Desa menjadi pedoman APBDes (Permendesa PDT 16/2025 Pasal 8 ayat 5).

## 4. User story

- **US-1.** Sebagai sekdes, saya ingin melihat berapa tahun kering ekstrem desa saya terdeteksi satelit, agar bisa menjelaskan mengapa kesiapan tetap perlu.
- **US-2.** Sebagai ketua MPA, saya ingin mencatat alat yang ada dan berfungsi lewat HP.
- **US-3.** Sebagai sekdes, saya ingin melihat skor terhadap paket minimum dan mata rantai terlemah.
- **US-4.** Sebagai sekdes, saya ingin memasukkan pagu dan melihat urutan belanja beserta alasannya.
- **US-5.** Sebagai kades, saya ingin menyetujui, menolak, atau menunda tiap baris.
- **US-6.** Sebagai sekdes, saya ingin menerbitkan dokumen usulan yang bisa dicetak.
- **US-7.** Sebagai juri, saya ingin melihat bukti metode, asumsi, dan keterbatasan data.

## 5. Kebutuhan fungsional

### Publik

| ID | Kebutuhan | Prio | Kriteria terima |
|---|---|---|---|
| FR-01 | Cari desa | P0 | Nama desa, kecamatan, atau kabupaten. Maksimal 20 hasil. Tidak peka huruf besar. `%` dan `_` diperlakukan literal |
| FR-02 | Kartu Paparan | P0 | Strip 2012-2026, `k_ext` dari `n_ext`, tahun tenang, porsi gambut, luas desa, tingkat paparan, label "Tampak aman" sesuai definisi. Memakai kata "deteksi satelit" |
| FR-03 | Paparan kecamatan | P1 | Rata-rata laju terpapar dan rentang laju terendah sampai tertinggi antar tahun ekstrem. Tidak ditampilkan per desa |
| FR-04 | Time Machine | P0 | Uji 2019, 2023, 2026. Lawan persistensi, total riwayat, gambut, acak. Capture 10/20/30%, ROC-AUC, PR-AUC. Hasil tampil apa adanya |
| FR-05 | Data dan Asumsi | P0 | Sumber, lisensi, periode, masalah data, parameter, paket minimum, harga, hasil gerbang, status "belum diuji pengguna" |

### Desa, perlu akun

| ID | Kebutuhan | Prio | Kriteria terima |
|---|---|---|---|
| FR-06 | Masuk dan peran | P0 | Peran `mpa` dan `desa`. Akun hanya mengubah data desanya |
| FR-07 | Catat Alat | P0 | Jumlah total dan berfungsi per item. Berfungsi tidak melebihi total. Tersimpan dengan pengisi dan waktu |
| FR-08 | Draf lokal | P2 | Roadmap |
| FR-09 | Paket minimum | P0 | Satu paket untuk semua desa. Desa boleh mengubah dengan alasan wajib. Sumber dan label asumsi tampil. Keterangan Pergub hanya untuk Kalteng |
| FR-10 | Skor Kesiapan | P0 | Skor 0-100, status, mata rantai terlemah, kesenjangan per item, "belum lengkap" bila ada item kosong |
| FR-11 | Harga | P0 | Harga acuan dengan sumber. Desa boleh mengisi sendiri. Item tanpa harga dikeluarkan dan ditandai |
| FR-12 | Prioritas di bawah pagu | P0 | Default Rp15.000.000. Mengubah pagu memperbarui daftar. Perbaikan dipertimbangkan. Tiap baris punya alasan. Skor sesudah pendanaan tampil |
| FR-13 | Keputusan | P0 | `setuju`, `tolak`, `tunda` dengan catatan. Usulan hanya memuat baris disetujui |
| FR-14 | Label kestabilan | P1 | `stabil` atau `peka asumsi` terhadap variasi harga dan bobot |
| FR-15 | Usulan | P0 | Kanal perubahan APBDes, BPBD, Daops/Kemenhut, CSR. Fakta dibekukan saat terbit. Bisa dicetak. Memuat pernyataan asumsi |
| FR-16 | Narasi AI | P0 | AI hanya menyusun kalimat. Angka dan nama diisi sistem. Gagal atau tanpa kunci jatuh ke template |
| FR-17 | Hitung mundur musim | P2 | Roadmap |
| FR-18 | Rekap kecamatan | P2 | Roadmap |
| FR-19 | Tempel pesan jadi isian alat | P1 | Teks pesan menjadi isian formulir. Pengguna wajib meninjau sebelum menyimpan. Tidak pernah menyimpan otomatis |

## 6. Definisi inti

Nilai disimpan di tabel `meta` dan tidak boleh diubah diam-diam.

| Istilah | Definisi | Nilai |
|---|---|---|
| Deteksi | Titik VIIRS S-NPP, confidence `n` atau `h` | |
| Area desa | Batas HDX ditambah penyangga | `buffer_km = 2` |
| Terpapar | Hari berdeteksi dalam area desa minimal ambang, per tahun | `min_det_days = 2` |
| Tahun ekstrem | Luas terbakar resmi di atas 1 juta ha, ditambah 2026 pada mode live | 2015, 2019, 2023, 2026 |
| Tahun tenang | Tahun berturut-turut tanpa paparan, dihitung mundur dari tahun terakhir | |
| Tampak aman | `k_ext >= 1` dan tahun tenang minimal ambang | `quiet_window = 3` |
| Tingkat paparan | `tinggi` jika `k_ext/n_ext >= 0,5`, `sedang` jika `k_ext >= 1`, `rendah` jika `k_ext = 0` | Hanya label |

Tingkat paparan tidak mengubah jumlah target. Luas desa ditampilkan karena desa luas lebih mudah terdeteksi.

## 7. Paket minimum satu musim

Semua jumlah dan bobot adalah **asumsi tim**, bukan standar yang mengikat desa.

| Kode | Item | Satuan | Target | Bobot | Jangkar sekunder |
|---|---|---|---:|---:|---|
| `dana_operasi` | Biaya operasi pemadaman | minggu | 1 | 15 | Rp5 juta per minggu untuk 7-10 ha, satu kesaksian (Nurhidayah 2023) |
| `pompa_jinjing` | Pompa jinjing berfungsi | unit | 1 | 20 | Pergub Kalteng memuat 3 per regu |
| `selang_keluar` | Selang keluar | buah | 10 | 20 | Kalibandung gagal dengan 100 m. Pergub Kalteng memuat 50 buah per regu |
| `sumur_bor` | Sumur bor berfungsi | titik | 5 | 20 | Talio Hulu 8 dari 50 berfungsi. Hanya untuk desa bergambut |

Keterangan untuk desa Kalteng: Pergub Kalteng 35/2025 Pasal 18-19 memuat pompa jinjing 3, pompa punggung 10, dan selang 50 buah per regu. Desa Kalbar menampilkan "Kalimantan Barat belum memiliki angka alat per regu pada Pergub 56/2025".

Panjang selang tidak menjadi target. Keterangan meter selalu berbunyi turunan, misalnya `≈200 m pada asumsi 20 m per buah`.

## 8. Harga acuan

| Item | Aksi | Harga | Sumber | Catatan |
|---|---|---:|---|---|
| `pompa_jinjing` | beli | Rp28.028.610 | Perbup Sanggau 32/2025 hlm. 175 | Harga satuan tertinggi |
| `pompa_jinjing` | perbaiki | Rp510.000 | Perwal Kediri 3/2025 hlm. 269, item 4594 | Pendekatan dari servis pompa air umum |
| `selang_keluar` | beli | Rp6.669.000 | Perbup Sanggau 32/2025 hlm. 174 | Panjang tidak tertulis. Pembanding Kediri hlm. 90: Rp3.490.500 per 20 m |
| `dana_operasi` | beli | Rp5.000.000 | Nurhidayah dkk. 2023 hlm. 9 | Satu kesaksian, data 2019 |
| `sumur_bor` | semua | Tanpa harga | | Desa mengisi sendiri |

Harga tanpa sumber dilarang masuk data.

## 9. Kebutuhan non-fungsional

| ID | Kebutuhan | Target |
|---|---|---|
| NFR-01 | Mobile-first | Layak pada lebar 360 px |
| NFR-02 | Ringan | Halaman desa tanpa memuat seluruh wilayah |
| NFR-03 | Jalan di localhost | Semua P0 berjalan tanpa internet dan tanpa kunci API |
| NFR-04 | Keamanan dasar | Password di-hash, sesi httpOnly, otorisasi per desa, validasi input, batas percobaan |
| NFR-05 | Privasi | Data desa tidak publik. Tidak menyimpan NIK, nomor HP, atau nama anggota |
| NFR-06 | Transparansi AI | Teks AI berlabel. README menyebut model dan bagian yang memakainya |
| NFR-07 | Aksesibilitas | Kontras WCAG AA, status tidak hanya warna, target sentuh 44 px |
| NFR-08 | Keterlacakan | Perubahan inventaris, paket, harga, keputusan, dan usulan masuk log audit |

## 10. Di luar cakupan

Rute penanggung biaya, wawancara, prediksi per desa, peta titik panas live, peringatan otomatis, log patroli, pelaporan warga, bot WhatsApp, aplikasi native, data muka air, rekap BPBD, pendaftaran mandiri desa.

## 11. Risiko produk

| Risiko | Dampak | Penanganan |
|---|---|---|
| Tanpa uji pengguna | Problem-Solution Fit rawan saat tanya jawab | Klaim dipersempit, bukti sekunder ditampilkan, status tertulis di README |
| Ruang fiskal desa sempit | Usulan sulit terserap | Pagu default kecil, perbaikan murah didahulukan, empat kanal tetap ada |
| Dokumen tidak memadamkan api | Juri meragukan dampak | Klaim dibatasi pada kesiapan terukur |
| Api dari luar desa atau konsesi | Skor tidak mencegah api datang | Ditulis pada halaman Data |
| Terlihat seperti generator formulir | Skor inovasi turun | Gerbang terbuka, Time Machine, AI berpengaman |
| Isian demo dianggap rekayasa | Pelanggaran aturan | Banner data uji, diisi langsung saat demo |
| Kata "simulasi" | Pelanggaran aturan | Time Machine hanya membandingkan peringkat dengan deteksi nyata. Ditanyakan tertulis ke Helpdesk |
