SiapKemarau, web app hackathon LOGICODIX 2026 yang membantu desa rawan karhutla mengetahui paparan tahun kering ekstrem, alat padam yang benar-benar berfungsi, dan apa yang didanai lebih dulu, benar-benar menjawab masalah yang diangkat, dan setiap fiturnya berguna serta punya nilai jual.

# Berkas perkara

## Yang diadili

Pertanyaan pengaju perkara, dengan kata-katanya sendiri: "Pastikan bahwa solusi yang kita canangkan, product yang kita buat benar-benar mampu menjawab dengan baik permasalahan yang kita angkat, setiap fiturnya benar-benar berguna dan memiliki nilai jual."

Karena itu perkara ini punya dua bagian:

1. Apakah produk ini menjawab masalah yang diangkat?
2. Untuk setiap fitur pada daftar di bawah: apakah fitur itu berguna bagi pengguna bernama, dan apakah punya nilai jual (bagi pengguna, pendana, atau juri lomba)? Sebut fitur per ID (FR-xx) jika mempersoalkannya.

## Status saat ini (9 November 2026)

- Tahap: dokumen saja. Brief, PRD, TRD, App Flow, Design Brief, Backend Schema, dan Implementation Plan sudah ditulis. Belum ada kode. Belum ada data yang diunduh.
- Nol wawancara pengguna sudah dilakukan. Wawancara sekdes, ketua MPA, dan Daops/BPBD dijadwalkan 10-11 November.
- Gerbang data belum dijalankan.
- Tim: diasumsikan 3 jalur kerja (DATA, APP, SHIP), jalur bisa dirangkap. Jumlah orang sebenarnya belum dinyatakan di dokumen.

## Konteks lomba

- LOGICODIX 2026, kategori Web. Subtema: Civic Tech & Community Service (cadangan: Green Environment), belum dikonfirmasi ke mentor.
- Code freeze 14 November 2026 pukul 23.59 WIB. Target internal 14 November pukul 20.00 WIB. Submission hanya sekali. Final luring 29 November, aplikasi wajib jalan di localhost.
- Bobot penilaian: Problem-Solution Fit 25%, Technology Innovation 25%, Software Engineering 25%, UI/UX 15%, Etika dan Keamanan 10%.
- Aturan yang tercatat di dokumen tim: repo GitHub baru dan publik setelah kick-off, commit berkala dari anggota terdaftar, video demo dari commit final tanpa slide, mockup, animasi, atau hasil rekayasa. Tidak boleh ada data simulasi sebagai hasil. Penggunaan AI wajib disebut.
- Tim pernah membuat proyek lain bernama caliber-final (produk utama PartPulse, optimasi persediaan suku cadang). Hanya metodenya yang diadaptasi. Kode, repo, dan hasilnya dilarang dipakai.

## Masalah yang diangkat

Desa gambut rawan masuk musim kering tanpa dana operasional dan alat padam yang berfungsi. Keputusan yang gagal terjadi jauh sebelum api muncul, yaitu saat tahun-tahun tenang membuat kesiapan terlihat tidak perlu.

- Pengguna utama: sekretaris desa atau kepala desa, penyusun dan pengusul anggaran.
- Pengguna kedua: ketua MPA (Masyarakat Peduli Api), pemilik data alat.
- Momen kegagalan: saat prioritas dana desa ditetapkan setelah beberapa tahun tanpa kebakaran.
- Tagline: "Enam tahun tanpa api bukan berarti aman."

Kasus jangkar, Kalibandung, Kubu Raya (2026, Mongabay 31 Agustus 2026): enam tahun tanpa api, sekdes menjelaskan dana dialihkan dengan alasan "Kami pikir tidak akan terjadi kebakaran tahun ini". Dana desa turun dari sekitar Rp1 miliar ke sekitar Rp300 juta karena efisiensi. Warga patungan BBM. Selang hanya 100 m. Pemadaman sudah 25 hari saat berita terbit. Api datang dari desa tetangga (Permata Jaya).

Bukti lain yang dimiliki tim:

- Talio Hulu: 8 dari 50 sumur masih berfungsi pada 2021 (Mongabay).
- Luas terbakar resmi di atas 1 juta ha hanya pada 2015, 2019, 2023. Delapan tahun lain pada 2016-2025 berkisar 165.483-529.267 ha.
- 2026 tahun ekstrem: ONI ASO +2,46, sekitar 1,9 juta ha terbakar Januari-September menurut Nusantara Atlas (bukan pembanding langsung seri resmi; seri resmi SiPongi berhenti di Juli).
- MPA tercatat lebih dari 11.000 anggota nasional (2023), 14.040 MPA di 34 provinsi di atas kertas, berulang kali dilaporkan tanpa dana rutin untuk BBM, selang, perahu, dan perawatan sumur.
- Permendes PDT 16/2025 menyebut pencegahan karhutla serta pembangunan dan pemeliharaan sumur bor di gambut sebagai penggunaan Dana Desa 2026.
- Kerugian karhutla 2026 ditaksir Rp167 T (UIII) sampai Rp359-565 T (CELIOS), tidak resmi. Kemenhut punya Rp343,3 miliar dari kebutuhan sekitar Rp813,4 miliar.

## Celah yang diklaim

Peta titik panas (SiPongi+, BMKG, BRIN, GFW, Nusantara Atlas sampai batas desa), indeks bahaya (SPARTAN, GWIS), peringatan WhatsApp/SMS (FireAlert), laporan warga (PetaBencana), dan log patroli Manggala Agni (SIPP Karhutla) sudah ada. Tim mengklaim tidak menemukan di web publik alat yang mengubah riwayat paparan desa + kondisi alat nyata menjadi daftar prioritas pendanaan yang bisa dipertanggungjawabkan. Klaim ini hanya berdasar bukti web publik. Satu pencarian prior-art khusus tidak menemukan alat inventaris aset MPA yang terhubung ke anggaran. Aset desa umum sudah punya Sipades (dilatihkan di Kubu Raya sejak 2019). Tetangga dekat: Songket Sumsel (rute dan laporan publik, status terkini belum terverifikasi), skripsi IPB 2026 (aplikasi MPA dengan prioritas titik panas). Di desa, petahana sebenarnya adalah WhatsApp (satu studi, satu desa).

## Solusi

Alur:

1. Lihat paparan. Pilih desa. Lihat berapa dari tahun kering ekstrem desa ini terpapar, dari deteksi satelit nyata 2012-2026.
2. Catat alat. Ketua MPA mengisi jumlah alat yang ada dan yang masih berfungsi.
3. Lihat kesiapan. Skor kesiapan terhadap target sesuai tingkat paparan, dan mata rantai terlemah.
4. Susun prioritas. Masukkan pagu. Sistem mengurutkan perbaikan dan pembelian, dengan alasan per baris. Manusia memutuskan.
5. Terbitkan usulan. Satu daftar kesiapan menjadi dokumen untuk perubahan APBDes, BPBD, Daops/Kemenhut, atau CSR.

Produk utama satu: layar Kesiapan Desa. Model dan backtest adalah bukti di belakangnya.

Sengaja tidak dibuat: peta titik panas live, prediksi api harian atau per desa, klaim "hektare terselamatkan", log patroli, bot WhatsApp, foto aset, upload dokumen, data muka air, peringatan otomatis, pelaporan warga, registrasi izin bakar, aplikasi native, pendaftaran mandiri desa.

## Daftar fitur (FR)

P0 wajib saat submission. P1 setelah semua P0 hidup. P2 roadmap.

Publik tanpa akun:

| ID | Fitur | Prio | Rincian |
|---|---|---|---|
| FR-01 | Cari desa | P0 | Nama desa, kecamatan, kabupaten; maksimal 20 hasil |
| FR-02 | Kartu Paparan Desa | P0 | Strip per tahun 2012-2026, k_ext dari n_ext tahun ekstrem, jumlah tahun tenang terakhir, porsi gambut, tingkat paparan, label "tampak aman" |
| FR-03 | Paparan kecamatan | P0 | Peluang terpapar di tahun ekstrem dengan rentang 5-95% (Beta-Binomial bertingkat). Peluang tidak ditampilkan per desa |
| FR-04 | Time Machine | P0 | Peringkat dibekukan 31 Des 2025 dibandingkan deteksi nyata 2026, lawan persistensi, gambut saja, dan acak. Hasil tampil apa adanya, termasuk jika kalah |
| FR-05 | Data dan Asumsi | P0 | Sumber, lisensi, periode, masalah data, asumsi |

Desa dengan akun:

| ID | Fitur | Prio | Rincian |
|---|---|---|---|
| FR-06 | Masuk dan peran | P0 | Peran mpa dan desa, otorisasi per desa. Akun disediakan, tanpa pendaftaran mandiri |
| FR-07 | Inventaris alat | P0 | Per item: jumlah total dan berfungsi; tersimpan dengan pengisi dan waktu |
| FR-08 | Draf lokal | P1 | Tersimpan di perangkat, kirim saat sinyal kembali |
| FR-09 | Target kebutuhan | P0 | Target awal sesuai tingkat paparan, desa boleh ubah dengan alasan wajib |
| FR-10 | Skor Kesiapan | P0 | 0-100, status siap/sebagian/rawan, mata rantai terlemah, kesenjangan per item |
| FR-11 | Harga | P0 | Harga acuan dengan sumber, desa boleh isi sendiri, item tanpa harga dikeluarkan dan ditandai |
| FR-12 | Prioritas di bawah pagu | P0 | Mengubah pagu memperbarui daftar, perbaikan alat rusak termasuk aksi, alasan tiap baris, skor sesudah pendanaan |
| FR-13 | Keputusan | P0 | Setuju/tolak/tunda per baris dengan catatan |
| FR-14 | Label kestabilan | P1 | Stabil atau peka asumsi berdasarkan variasi harga dan bobot |
| FR-15 | Usulan multi-kanal | P0 | Kanal perubahan APBDes, BPBD, Daops/Kemenhut, CSR; cetak atau PDF |
| FR-16 | Narasi AI | P1 | AI hanya menyusun kalimat, angka dan nama diisi sistem, gagal jatuh ke template |
| FR-17 | Hitung mundur musim | P1 | Bulan puncak deteksi kecamatan dan hitung mundur |
| FR-18 | Rekap kecamatan untuk BPBD | P2 | Roadmap |

Definisi inti: deteksi = titik VIIRS S-NPP confidence n atau h. Area desa = batas HDX + penyangga 2 km. Terpapar = minimal 2 hari berdeteksi dalam setahun. Tahun ekstrem = 2015, 2019, 2023, ditambah 2026 pada mode live. Tampak aman = k_ext minimal 1 dan minimal 3 tahun tenang berturut-turut. Tingkat paparan: tinggi jika k_ext/n_ext minimal 0,5; sedang jika k_ext minimal 1; rendah jika k_ext 0.

Target kebutuhan: 9 item (pompa jinjing, selang keluar, sumur bor, BBM, anggota, selang hisap, pompa punggung, APD, radio) dengan bobot 20/20/20/15/10/5/5/3/2. Sumber: standar regu Permen LHK P.32/2016 dan Permentan 5/2018 yang ditujukan bagi pemegang izin dan perusahaan, bukan kewajiban desa. Tidak ditemukan standar khusus MPA. Kolom target tingkat rendah, target sumur bor, target BBM, dan seluruh bobot adalah asumsi tim.

Harga: tidak ditemukan harga resmi terbuka. Tim harus mengisi CSV dari e-katalog LKPP, SSH kabupaten, atau penawaran distributor. Harga tanpa sumber dilarang masuk. Satu angka yang ditemukan: sekitar Rp10 juta per titik bor sebagai upah tim bor saja.

Teknologi: pipeline Python offline ke SQLite (di bawah 50 MB), Next.js membaca lewat libSQL di localhost dan Turso di deployment. Mesin kesiapan dan prioritas fungsi TypeScript murni. Cakupan data Kalimantan Barat dan Kalimantan Tengah. Akun demo berlabel data uji, inventaris diisi langsung saat demo, paparan tetap data nyata.

Tujuan terukur saat submission: 100% desa Kalbar dan Kalteng dalam batas HDX punya kartu paparan; orang luar tim menyelesaikan alur dalam 10 menit atau kurang; 100% keluaran AI lolos pengaman atau jatuh ke template; 0 kemunculan "hektare terselamatkan". Sesudah lomba: persentase desa pilot yang punya inventaris sebelum musim kering, jumlah item usulan terdanai.

## Temuan riset tim sendiri yang relevan

Dicatat tim dalam laporan risetnya:

- Dalam perbandingan empat opsi, opsi ini menang tipis atas "loop titik panas ke verifikasi ke hasil". Opsi kedua dikalahkan karena tidak ada data hasil lapangan publik untuk didemokan dan butuh mitra instansi. Laporan menyatakan rekomendasi berbalik ke opsi itu jika sekdes menyatakan prioritas APBDes 2027 sudah terkunci atau ruang fiskal nihil, atau jika satu BPBD/Daops bersedia menjadi pemilik.
- Laporan menilai inovasi opsi ini terlemah di antara empat opsi, sedang jika peringkat biaya-risiko diuji out-of-time.
- Verifikasi 9 November: materi turunan menyebut RKP Desa tuntas paling lambat akhir September dan APBDes ditetapkan paling lambat Desember. Teks resmi Permendagri belum dibuka, jadwal bisa berbeda per kabupaten. Tidak ditemukan Permendes fokus Dana Desa 2027 dalam satu pencarian.
- Sekdes Kalibandung juga menyebut penurunan dana desa karena efisiensi sebagai latar ketiadaan anggaran.
- RCT di 75 desa perlakuan di Kalbar tidak menemukan efek kausal terhadap api dari pembayaran bersyarat Rp10 juta dan Rp150 juta (Devpolicy, September 2026). Itu insentif, bukan belanja kesiapan.
- Efek MPA dan Desa Mandiri Peduli Api terhadap api tidak terukur di sumber yang dibaca.
- Porsi titik panas di area konsesi berkisar sekitar 30% (Pantau Gambut) sampai sekitar 50% (Walhi), basis hitung berbeda.
- Keluhan lapangan yang ditabulasi berpusat pada dana operasional, akses air, selang, sumur, dan jalan; kesaksian lapangan nyaris tidak meminta "informasi lebih banyak". Kesaksian sangat bergantung pada satu media (Mongabay).
- ProbFire menunjukkan skill prakiraan musiman nihil di Kalbar. Skill model harian sekitar ROC-AUC 0,80-0,83 lawan persistensi 0,71. Peringkat berbasis riwayat bisa gagal pada desa enam tahun tenang.
- Dokumen tim mencatat risiko: "Dokumen tidak memadamkan api", dana desa tidak ada ruang, api dari luar desa, terlihat seperti generator formulir, isian demo dianggap rekayasa, kata "simulasi".

## Yang bisa membatalkan arah, menurut tim sendiri

| Uji | Batas waktu | Jika gagal |
|---|---|---|
| Gerbang data: desa "tampak aman" terpapar 2026 setidaknya 1,5 kali desa tanpa riwayat tahun ekstrem | 11 Nov | Buang klaim "tampak aman", pertahankan fakta paparan |
| Riwayat FIRMS Kalibandung cocok dengan cerita | 11 Nov | Ganti kasus jangkar dengan desa dari data |
| Wawancara sekdes: masih ada kanal dana terbuka | 10-11 Nov | Tekankan kanal CSR dan BPBD |
| Wawancara ketua MPA: daftar alat belum ada atau tidak terpakai | 10-11 Nov | Sempitkan ke penyusunan usulan |
| Mentor: pemutaran data historis nyata bukan "simulasi" | Secepatnya | Ubah bentuk demo |

Antrean arsip FIRMS memakai surel dengan durasi tidak diketahui. Data FIRMS belum diminta per dokumen ini.
