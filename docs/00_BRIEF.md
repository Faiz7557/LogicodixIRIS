# 00 — Brief Proyek: SiapKemarau

> Nama kerja, boleh diganti. Dokumen ini adalah sumber keputusan untuk semua dokumen lain. Jika ada pertentangan, Brief menang.
> Status: 9 November 2026. Riset lengkap: [`reports/Celah solusi karhutla Indonesia.md`](../reports/Celah%20solusi%20karhutla%20Indonesia.md).

## 1. Satu kalimat

**SiapKemarau membantu desa rawan karhutla mengetahui seberapa terpapar mereka di tahun kering ekstrem, alat padam apa yang benar-benar berfungsi, dan apa yang harus didanai lebih dulu, sebelum musim kering tiba.**

Tagline: ***"Enam tahun tanpa api bukan berarti aman."***

## 2. Masalah

Desa gambut rawan masuk musim kering tanpa dana operasional dan alat padam yang berfungsi. Keputusan yang gagal terjadi jauh sebelum api muncul, yaitu saat tahun-tahun tenang membuat kesiapan terlihat tidak perlu.

| Elemen | Isi |
|---|---|
| Pengguna utama | Sekretaris desa atau kepala desa, sebagai penyusun dan pengusul anggaran |
| Pengguna kedua | Ketua MPA (Masyarakat Peduli Api), sebagai pemilik data alat |
| Momen kegagalan | Saat prioritas dana desa ditetapkan setelah beberapa tahun tanpa kebakaran |
| Akibat | Kebakaran datang, desa tidak punya BBM, selang, atau sumur yang berfungsi |

**Kasus jangkar: Kalibandung, Kubu Raya (2026).** Enam tahun tanpa api, desa tidak punya anggaran khusus karhutla tahun ini, dana desa turun dari sekitar Rp1 miliar ke sekitar Rp300 juta karena efisiensi, selang hanya 100 m, warga sudah memadamkan api selama 25 hari, dan api datang dari desa tetangga ([Mongabay, 31 Agu 2026](https://mongabay.co.id/2026/08/31/kebakaran-gambut-kalbar-tak-kunjung-padam/)).

**Bukti pendukung**

- Di Talio Hulu, hanya 8 dari 50 sumur yang masih berfungsi pada 2021 ([Mongabay](https://mongabay.co.id/2021/10/06/melihat-kesiapan-desa-di-wilayah-gambut-kalimantan-tengah-hadapi-karhutla/)).
- Luas terbakar resmi di atas 1 juta ha hanya terjadi pada 2015, 2019, dan 2023. Delapan tahun lain pada 2016-2025 berkisar 165.483-529.267 ha. Tahun tenang memang menipu (seri SiPongi via GoodStats, lihat laporan riset bagian 2).
- 2026 adalah tahun ekstrem: ONI ASO +2,46 ([CPC NOAA](https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt)) dan sekitar 1,9 juta ha terbakar pada Januari-September menurut [Nusantara Atlas via Mongabay](https://news.mongabay.com/2026/11/experts-warn-of-long-term-health-risks-as-indonesias-wildfire-haze-takes-a-growing-toll/). Angka ini bukan pembanding langsung seri resmi.
- MPA tercatat lebih dari 11.000 anggota nasional (2023), tetapi berulang kali dilaporkan tanpa dana rutin untuk BBM, selang, perahu, dan perawatan sumur (laporan riset, catatan 05).

## 3. Celah yang dimasuki

Peta titik panas, indeks bahaya, peringatan WhatsApp, dan log patroli Manggala Agni sudah ada. Yang tidak ditemukan di web publik adalah alat yang mengubah **riwayat paparan desa + kondisi alat nyata** menjadi **daftar prioritas pendanaan yang bisa dipertanggungjawabkan**.

Klaim "belum ada" ini hanya berdasar bukti web publik dan harus dikonfirmasi lewat wawancara.

## 4. Solusi dalam satu alur

1. **Lihat paparan.** Pilih desa. Lihat berapa dari tahun kering ekstrem desa ini terpapar, dari deteksi satelit nyata 2012-2026.
2. **Catat alat.** Ketua MPA mengisi jumlah alat yang ada dan yang masih berfungsi.
3. **Lihat kesiapan.** Skor kesiapan terhadap target sesuai tingkat paparan, dan mata rantai terlemah.
4. **Susun prioritas.** Masukkan pagu. Sistem mengurutkan perbaikan dan pembelian, dengan alasan per baris. Manusia memutuskan.
5. **Terbitkan usulan.** Satu daftar kesiapan menjadi dokumen untuk perubahan APBDes, BPBD, Daops/Kemenhut, atau CSR.

**Produk utama hanya satu: layar Kesiapan Desa.** Model dan backtest adalah bukti di belakangnya, bukan fitur yang dijual terpisah.

## 5. Yang sengaja tidak dibuat

| Tidak dibuat | Alasan |
|---|---|
| Peta titik panas live | Sudah jenuh: SiPongi+, BMKG, BRIN, GFW, Nusantara Atlas |
| Prediksi api harian atau per desa | Skill sedang, resolusi data lebih kasar dari desa, dan tidak ada jalur aksi |
| Klaim "hektare terselamatkan" | Itu kontrafaktual simulasi, berbenturan dengan aturan demo |
| Log patroli Manggala Agni | SIPP Karhutla sudah ada |
| Bot WhatsApp, foto aset, upload dokumen | Di luar 5 hari |
| Muka air (TMAT) | SIPALAGA tidak bisa diakses secara praktis |

## 6. Adaptasi metode caliber-final

Hanya metodenya. **Tidak ada kode, repo, atau hasil caliber-final yang boleh dipakai** (Guidebook hal. 12-13).

| Metode | Bentuk di SiapKemarau |
|---|---|
| Satu produk utama, model sebagai bukti | Layar Kesiapan Desa |
| Shutdown Readiness | Kesiapan Musim Kering, dengan selang dan sumur sebagai "suku cadang" |
| Empirical Bayes untuk data jarang | Beta-Binomial bertingkat kecamatan dan desa |
| Time Machine | Bekukan pengetahuan pada 31 Des 2025, lalu lihat deteksi nyata 2026 |
| Optimizer biaya-risiko dengan alasan | Pemilihan berurutan di bawah pagu, musyawarah sebagai persetujuan |
| Panel data trust | Halaman Data dan Asumsi |
| Pipeline offline ke SQLite | Python ke SQLite, dibaca aplikasi web |

## 7. Keputusan yang dikunci

| Keputusan | Pilihan | Status |
|---|---|---|
| Kategori lomba | **Web** | Dikunci |
| Subtema | **Civic Tech & Community Service** (cadangan: Green Environment) | Konfirmasi ke mentor |
| Cakupan data | Kalimantan Barat dan Kalimantan Tengah | Dikunci |
| Tahun ekstrem | 2015, 2019, 2023 (resmi di atas 1 juta ha), 2026 (uji) | Dikunci |
| Sensor | VIIRS S-NPP 2012 sampai 2 Nov 2026 | Dikunci |
| Pemanfaatan AI | Narasi usulan, dengan pengaman deterministik | Dikunci |
| Tim | Asumsi 3 jalur kerja: DATA, APP, SHIP. Jalur bisa dirangkap | Sesuaikan |

## 8. Yang bisa membatalkan arah ini

| Uji | Batas waktu | Jika gagal |
|---|---|---|
| **Gerbang data:** desa "tampak aman" terpapar 2026 setidaknya 1,5 kali desa tanpa riwayat tahun ekstrem | 11 Nov | Buang klaim "tampak aman", pertahankan fakta paparan |
| Riwayat FIRMS Kalibandung cocok dengan cerita | 11 Nov | Ganti kasus jangkar dengan desa dari data |
| Wawancara sekdes: masih ada kanal dana yang terbuka | 10-11 Nov | Tekankan kanal CSR dan BPBD |
| Wawancara ketua MPA: daftar alat belum ada atau tidak terpakai | 10-11 Nov | Sempitkan ke penyusunan usulan |
| Mentor: pemutaran data historis nyata bukan "simulasi" | Secepatnya | Ubah bentuk demo |

## 9. Penilaian lomba

| Kriteria | Bobot | Jawaban produk |
|---|---|---|
| Problem-Solution Fit | 25% | Satu pengguna, satu momen gagal, kasus nyata, wawancara |
| Technology Innovation | 25% | Paparan bertingkat dari data satelit nyata, Time Machine, AI dengan pengaman |
| Software Engineering | 25% | MVP utuh, mesin teruji, arsitektur sederhana, dokumentasi lengkap |
| UI/UX | 15% | Mobile-first, bahasa desa, alur 5 langkah |
| Etika dan Keamanan | 10% | Panel Data dan Asumsi, data alat privat, transparansi AI, atribusi |

## 10. Batas waktu

Code freeze **14 November 2026, 23.59 WIB**. Target internal submission **14 November, 20.00 WIB**. Submission hanya sekali. Final luring 29 November, dan aplikasi wajib jalan di localhost.
