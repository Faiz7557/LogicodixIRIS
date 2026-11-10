# 01 — Product Requirements Document: SiapKemarau

> Turunan dari [00_BRIEF.md](00_BRIEF.md). Prioritas: **P0** wajib ada saat submission, **P1** dikerjakan setelah semua P0 hidup, **P2** hanya disebut sebagai roadmap.

## 1. Tujuan

| Tujuan | Ukuran | Target saat submission |
|---|---|---|
| Desa melihat paparannya dari data nyata | Desa Kalbar dan Kalteng yang punya kartu paparan | 100% desa dalam batas HDX |
| Klaim produk terbukti di data | Gerbang "tampak aman" dan capture top-K di Time Machine | Dihitung dan ditampilkan apa adanya |
| Satu desa selesai dari inventaris sampai usulan | Waktu orang luar tim menyelesaikan alur | 10 menit atau kurang |
| Narasi AI tidak mengarang fakta | Keluaran AI yang lolos pengaman tanpa angka atau nama di luar data | 100% (yang gagal jatuh ke template) |
| Tidak ada klaim yang tidak bisa dibuktikan | Kemunculan "hektare terselamatkan" di produk dan video | 0 |

Sesudah lomba, ukuran pilot adalah persentase desa pilot yang punya inventaris sebelum musim kering dan jumlah item usulan yang terdanai.

## 2. Pengguna

Peran di bawah berasal dari sumber riset. Tidak ada persona rekaan.

| Peran | Tugas | Kebutuhan | Batasan |
|---|---|---|---|
| Sekdes atau kades | Menyusun dan mengusulkan anggaran | Bukti paparan, daftar prioritas, dokumen siap kirim | Bukan orang teknis, waktu sedikit |
| Ketua MPA | Mengetahui kondisi alat | Formulir cepat di HP | Sinyal tidak stabil |
| Publik, juri, BPBD, LSM | Melihat paparan dan metode | Akses tanpa akun | Hanya baca |

## 3. User story

- **US-1.** Sebagai sekdes, saya ingin melihat berapa dari tahun kering ekstrem desa saya terpapar api, agar bisa menjelaskan mengapa kesiapan tetap perlu setelah tahun-tahun tenang.
- **US-2.** Sebagai ketua MPA, saya ingin mencatat alat yang ada dan yang berfungsi lewat HP, agar kondisi nyatanya tercatat.
- **US-3.** Sebagai sekdes, saya ingin melihat skor kesiapan dan mata rantai terlemah, agar tahu titik paling gentingnya.
- **US-4.** Sebagai sekdes, saya ingin memasukkan pagu dan melihat urutan perbaikan dan pembelian beserta alasannya, agar usulan bisa dipertanggungjawabkan di musyawarah.
- **US-5.** Sebagai kades, saya ingin menyetujui atau menolak tiap baris, agar keputusan tetap di tangan desa.
- **US-6.** Sebagai sekdes, saya ingin menerbitkan dokumen usulan untuk kanal yang masih terbuka, agar tidak bergantung pada satu sumber dana.
- **US-7.** Sebagai juri atau pihak BPBD, saya ingin melihat bukti metode dan keterbatasan data, agar bisa menilai seberapa bisa dipercaya.

## 4. Kebutuhan fungsional

### Publik (tanpa akun)

| ID | Kebutuhan | Prio | Kriteria terima |
|---|---|---|---|
| FR-01 | Cari desa | P0 | Pencarian nama desa, kecamatan, atau kabupaten mengembalikan maksimal 20 hasil dan tidak peka huruf besar |
| FR-02 | Kartu Paparan Desa | P0 | Menampilkan strip per tahun 2012-2026, `k_ext` dari `n_ext` tahun ekstrem, jumlah tahun tenang terakhir, porsi gambut, tingkat paparan, dan label "tampak aman" jika memenuhi definisi. Selalu memakai kata "deteksi satelit", bukan "kebakaran" |
| FR-03 | Paparan kecamatan | P0 | Peluang terpapar di tahun ekstrem dengan rentang 5-95%. Peluang tidak ditampilkan per desa |
| FR-04 | Time Machine | P0 | Membandingkan peringkat beku 31 Des 2025 dengan deteksi nyata 2026, lawan persistensi, gambut saja, dan acak. Menampilkan hasil apa adanya, termasuk jika kalah |
| FR-05 | Data dan Asumsi | P0 | Daftar sumber, lisensi, periode, masalah data, dan seluruh asumsi. Mencantumkan berhentinya S-NPP pada 2 Nov 2026, seri SiPongi yang berhenti di Juli, tutupan awan, dan api gambut membara |

### Desa (perlu akun)

| ID | Kebutuhan | Prio | Kriteria terima |
|---|---|---|---|
| FR-06 | Masuk dan peran | P0 | Peran `mpa` dan `desa`. Akun hanya bisa mengubah data desanya sendiri |
| FR-07 | Inventaris alat | P0 | Untuk tiap item: jumlah total dan jumlah berfungsi. Berfungsi tidak boleh melebihi total. Tersimpan dengan pengisi dan waktu |
| FR-08 | Draf lokal | P1 | Isian tersimpan otomatis di perangkat dan bisa dikirim saat sinyal kembali |
| FR-09 | Target kebutuhan | P0 | Target awal sesuai tingkat paparan. Desa boleh mengubah dengan alasan wajib. Sumber target ditampilkan |
| FR-10 | Skor Kesiapan | P0 | Skor 0-100, status (`siap`, `sebagian`, `rawan`), mata rantai terlemah, kesenjangan per item. Tampil "belum lengkap" jika ada item belum diisi |
| FR-11 | Harga | P0 | Harga acuan ditampilkan dengan sumbernya. Desa boleh mengisi harga sendiri. Item tanpa harga dikeluarkan dari urutan dan ditandai |
| FR-12 | Prioritas di bawah pagu | P0 | Mengubah pagu memperbarui daftar. Perbaikan alat rusak dipertimbangkan sebagai aksi. Tiap baris punya alasan. Menampilkan skor sesudah pendanaan |
| FR-13 | Keputusan | P0 | Tiap baris bisa `setuju`, `tolak`, atau `tunda` dengan catatan. Usulan hanya memuat baris yang disetujui |
| FR-14 | Label kestabilan | P1 | Tiap baris berlabel `stabil` atau `peka asumsi` berdasarkan variasi harga dan bobot |
| FR-15 | Usulan multi-kanal | P0 | Kanal: perubahan APBDes, BPBD, Daops/Kemenhut, CSR. Isi fakta disalin saat diterbitkan dan tidak berubah. Bisa dicetak atau disimpan PDF |
| FR-16 | Narasi AI | P1 | AI hanya menyusun kalimat. Semua angka dan nama diisi sistem. Gagal atau tanpa kunci API jatuh ke template. Sumber teks ditampilkan |
| FR-17 | Hitung mundur musim | P1 | Bulan puncak deteksi kecamatan dari data nyata dan hitung mundur ke bulan itu |
| FR-18 | Rekap kecamatan untuk BPBD | P2 | Roadmap |

## 5. Definisi inti

Definisi ini mengikat dan tidak boleh diubah diam-diam. Semua nilai ada di tabel `meta`.

| Istilah | Definisi | Nilai awal |
|---|---|---|
| Deteksi | Titik VIIRS S-NPP dengan confidence `n` atau `h` | |
| Area desa | Batas HDX ditambah penyangga | `buffer_km = 2` |
| Terpapar (desa-tahun) | Jumlah hari berdeteksi dalam area desa minimal ambang | `min_det_days = 2` |
| Tahun ekstrem | Tahun dengan luas terbakar resmi di atas 1 juta ha, ditambah 2026 pada mode live | Beku: 2015, 2019, 2023. Live: ditambah 2026 |
| `k_ext`, `n_ext` | Tahun ekstrem terpapar, jumlah tahun ekstrem | |
| Tahun tenang | Jumlah tahun berturut-turut tanpa paparan, dihitung mundur dari tahun terakhir | |
| Tampak aman | `k_ext >= 1` dan tahun tenang minimal ambang | `quiet_window = 3` |
| Tingkat paparan | `tinggi`: `k_ext/n_ext >= 0,5`. `sedang`: `k_ext >= 1`. `rendah`: `k_ext = 0` | |

Semua klaim memakai bentuk "terdeteksi satelit". Satu titik panas bukan satu kebakaran, dan zona awan bukan bukti tidak ada api.

## 6. Target kebutuhan awal

Acuan: daftar minimal satu regu inti (15 orang) dan standar regu pada [rangkuman DLHK Banten atas Permen LHK P.32/2016 dan Permentan 5/2018](https://dlhk.bantenprov.go.id/storage/dlhk/upload/article/2020/Standar_Sarpras_pengendalian_Kebakaran_Hutan.pdf). Standar itu ditujukan bagi pemegang izin dan perusahaan, **bukan kewajiban desa**. Tidak ditemukan standar khusus MPA. Karena itu semua target bisa diubah desa.

| Kode | Item | Satuan | Rendah | Sedang | Tinggi | Bobot | Kritis | Sumber |
|---|---|---|---|---|---|---|---|---|
| `pompa_jinjing` | Pompa jinjing | unit | 1 | 2 | 3 | 20 | Ya | Standar regu (tinggi: 1 besar + 2 jinjing) |
| `selang_keluar` | Selang keluar | rol 20 m | 3 | 6 | 11 | 20 | Ya | Standar regu |
| `sumur_bor` | Sumur bor berfungsi | titik | 5 | 10 | 20 | 20 | Ya | Asumsi tim |
| `bbm` | Cadangan BBM | liter | 50 | 100 | 200 | 15 | Ya | Asumsi tim |
| `anggota` | Anggota aktif | orang | 8 | 15 | 15 | 10 | Ya | Standar regu |
| `selang_hisap` | Selang hisap | rol | 1 | 2 | 3 | 5 | Tidak | Standar regu |
| `pompa_punggung` | Pompa punggung | unit | 5 | 10 | 10 | 5 | Tidak | Standar regu |
| `apd` | Set APD | set | 8 | 15 | 15 | 3 | Tidak | Standar regu |
| `ht` | Radio genggam | unit | 2 | 4 | 4 | 2 | Tidak | Standar regu |

Kolom Rendah dan seluruh bobot adalah asumsi tim. `sumur_bor` dikeluarkan jika porsi gambut desa nol. `anggota` tidak bisa dibeli, sehingga tampil sebagai kesenjangan non-biaya.

## 7. Harga

Tidak ditemukan harga resmi yang terbuka. Tim wajib mengisi `data/manual/harga_item.csv` dari e-katalog LKPP, SSH kabupaten, atau penawaran distributor. Setiap baris wajib punya sumber dan tanggal. **Harga tanpa sumber tidak boleh dimasukkan.**

Satu-satunya angka yang ditemukan sejauh ini adalah sekitar Rp10 juta per titik bor sebagai **upah tim bor saja**, disebut dalam rapat terbatas 12 Okt 2026 ([IDX Channel](https://www.idxchannel.com/news/tangani-karhutla-di-tanjung-puting-prabowo-kirim-200-pompa-air-senilai-rp2-miliar)). Angka itu bukan biaya total. Harga marketplace yang ditemukan terlalu tidak konsisten untuk dipakai.

## 8. Kebutuhan non-fungsional

| ID | Kebutuhan | Target |
|---|---|---|
| NFR-01 | Mobile-first | Layak dipakai pada lebar 360 px |
| NFR-02 | Ringan | Halaman desa tanpa memuat seluruh data wilayah |
| NFR-03 | Jalan di localhost | Semua fitur P0 berjalan tanpa internet, kecuali latar peta |
| NFR-04 | Keamanan dasar | Password di-hash, sesi httpOnly, otorisasi per desa, validasi input, batas percobaan |
| NFR-05 | Privasi | Inventaris, keputusan, dan usulan tidak terbuka untuk publik. Tidak menyimpan NIK, nomor HP, atau nama anggota |
| NFR-06 | Transparansi AI | Setiap teks AI berlabel. README menyebut model dan bagian yang memakainya |
| NFR-07 | Aksesibilitas | Kontras WCAG AA, status tidak hanya lewat warna, target sentuh 44 px |
| NFR-08 | Keterlacakan | Perubahan inventaris, target, harga, keputusan, dan usulan tercatat di log audit |

## 9. Di luar cakupan

Prediksi per desa, peta titik panas live, peringatan otomatis, log patroli, pelaporan warga, registrasi izin bakar, bot WhatsApp, aplikasi native, data muka air, rekap BPBD, dan pendaftaran mandiri desa.

## 10. Risiko produk

| Risiko | Dampak | Penanganan |
|---|---|---|
| Dokumen tidak memadamkan api | Juri meragukan dampak | Klaim dibatasi pada kesiapan terukur dan usulan yang bisa didanai |
| Dana desa tidak ada ruang | Usulan tidak terserap | Multi-kanal, dan aksi perbaikan murah diprioritaskan |
| Api dari luar desa | Skor tidak mencegah api datang | Area desa memakai penyangga. Keterbatasan ditulis di halaman Data |
| Terlihat seperti generator formulir | Skor inovasi turun | Hero adalah wawasan "tampak aman" dan Time Machine |
| Isian demo dianggap rekayasa | Pelanggaran aturan | Akun demo berlabel data uji, diisi langsung saat demo, dan paparan tetap nyata |
| Kata "simulasi" | Pelanggaran aturan | Tidak ada simulasi hasil. Time Machine hanya membandingkan peringkat dengan deteksi nyata. Dikonfirmasi ke mentor |
