# Literature Review & Curated Papers Registry — SiapKemarau

Dokumen ini adalah **Single Source of Truth (SSOT)** korpus rujukan untuk agen AI dan tim.
Agen **DILARANG membaca PDF mentah** untuk mencari fakta: baca tabel di sini, atau transkrip
`papers/*/*.md` bila butuh kutipan verbatim.

- Korpus: **24 paper** (22 bertranskrip, 2 metadata saja) + **6 dokumen regulasi/harga**.
- Transkrip mengikuti konvensi korpus referensi: header SHA-256 + pemisah `## Page N`.
- Regenerasi: `uv run python scripts/fetch_papers.py` (idempoten; `--force` untuk unduh ulang).
- Setiap klaim di dokumen produk harus menunjuk satu baris di tabel ini.

---

## 1. Statistik Korpus

| Kategori | Jumlah | Isi | Folder |
|---|---:|---|---|
| Konteks & paparan | 8 | Rezim api gambut, biaya kebakaran, prediktabilitas musiman, tata kelola | `papers/konteks_paparan/` |
| Deteksi satelit | 2 | Batas deteksi api gambut membara, interkomparasi sensor | `papers/deteksi_satelit/` |
| Kesiapan komunitas | 4 | MPA/CBFiM, evaluasi kinerja, respons kebijakan | `papers/kesiapan_komunitas/` |
| Alokasi anggaran | 3 | Optimasi alokasi sumber daya di bawah anggaran terbatas | `papers/alokasi_anggaran/` |
| Perilaku & aksi | 4 | Persepsi risiko, memori bencana, aksi antisipatif | `papers/perilaku_dan_aksi/` |
| Konteks desa | 1 | Manajemen risiko Dana Desa | `papers/konteks_desa/` |
| Metode | 2 | Empirical Bayes, PR vs ROC pada data timpang | `papers/metode/` |
| Regulasi & harga | 6 | Permendesa 16/2025, PMK 7/2026, Pergub Kalteng 35/2025, Pergub Kalbar 56/2025, SSH Kediri, SSH Sanggau | `papers/regulasi/` |

Tanpa transkrip (berbayar, hanya metadata): `Paparan_02` (Nature Geoscience), `Kesiapan_04` (IOP, diblokir Cloudflare).

---

## 2. Konteks & Paparan (`papers/konteks_paparan/`)

| Kode | Judul & Penulis | Tahun & Venue (h-index) | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Paparan_01_Kiely_2021` | *Assessing costs of Indonesian fires and the benefits of restoring peatland* (L. Kiely et al.) | 2021, **Nature Communications** (h=756), DOI `10.1038/s41467-021-27353-x` | Empiris, OA | Api gambut berulang & mahal; restorasi menurunkan luas terbakar | Kebakaran 2015 = kerugian **US$28 miliar**; enam kejadian terbesar 2004–2015 total **US$93,9 miliar**; drainase membuat gambut mudah terbakar | abstrak + teks |
| `Paparan_02_Turetsky_2015` | *Global vulnerability of peatlands to fire and carbon loss* (M.R. Turetsky et al.) | 2015, **Nature Geoscience** (h=351), DOI `10.1038/ngeo2325` | Review, berbayar | Gambut terkuras menyimpan risiko kebakaran global; emisi karbon besar | **Tidak ada transkrip** — hanya metadata; jangan mengutip angka dari paper ini | metadata |
| `Paparan_03_Spessa_2015` | *Seasonal forecasting of fire over Kalimantan, Indonesia* (A.C. Spessa et al.) | 2015, **NHESS** (h=170), DOI `10.5194/nhess-15-429-2015` | Empiris, OA | Skill prakiraan musiman **tidak seragam** di Kalimantan | ECMWF System 4 menjelaskan **≥70% varians** luas terbakar di **Kalimantan selatan**; korelasi **lemah** di Kalimantan tengah. **Kalbar tidak diuji terpisah di paper ini** | abstrak + hasil |
| `Paparan_04_Nikonovas_2022` | *ProbFire: a probabilistic fire early warning system for Indonesia* (P. Nikonovas et al.) | 2022, **NHESS** (h=170), DOI `10.5194/nhess-22-303-2022` | Empiris, OA | Peringatan dini sudah ada dan makin terampil, **tetapi sedikit bukti dipakai pengambil keputusan** | Penulis menyatakan "little evidence that such information is widely used yet by decision makers" — inti argumen jalur aksi | abstrak |
| `Paparan_05_Rossita_2023` | *Peatland fire regime across Riau peat hydrological unit, Indonesia* (M. Rossita et al.) | 2023, **Forest and Society** (h=31 → konteks saja), DOI `10.24259/fs.v7i1.21996` | Empiris, OA | Rezim api gambut berbeda menurut tipe pengelolaan lahan, bukan hanya iklim | Analisis di KHG Gaung–Batang Tuaka: penggunaan & manajemen lahan ikut menentukan pola bakar | abstrak |
| `Paparan_06_Carmenta_2017` | *Perceptions across scales of governance and the Indonesian peatland fires* (R. Carmenta et al.) | 2017, **Global Environmental Change** (h=313), DOI `10.1016/j.gloenvcha.2017.08.001` | Empiris kualitatif, OA | Persepsi antar tingkat pemerintahan berbeda → koordinasi & kepatuhan gagal | Persepsi pemangku kepentingan membentuk perilaku dan hasil lingkungan lintas skala | abstrak |
| `Paparan_07_Kieft_2026` | *Quantifying the Impact of the Use of a Seasonal Fire Risk Prediction System...* (R. Kieft et al.) | 2026, **F1000Research** (h=166), DOI `10.12688/f1000research.176742.1` | Empiris, OA, bukan bukti kausal | **Bukti berlawanan:** layanan iklim antisipatif + restorasi dikaitkan penurunan hotspot | Regresi menjelaskan **31–58%** varians hotspot di 8 distrik. Hotspot 2015 → 2023: Riau **3.221 → 102**, Kalteng **4.112 → 198** (>90%). **Tetapi 2019 — juga El Niño — masih 3.291 dan 3.987**, jadi penurunan tidak mengikuti aktivasi FRS secara linier. Penulis sendiri menulis di Kalteng "restoration measures rather than predictive systems alone appear to drive fire reduction" | abstrak + hasil + tabel |

| `Paparan_08_Santika_2020` | *Interannual climate variation, land type and village livelihood effects on fires in Kalimantan, Indonesia* (T. Santika et al.) | 2020, **Global Environmental Change** (h=313), DOI `10.1016/j.gloenvcha.2020.102129` | Empiris, OA (manuscript) | **Bukti terkuat untuk klaim "tampak aman"**: di gambut terdegradasi, angka kejadian api **tinggi tanpa memandang mata pencaharian desa** | Desa yang berimpit dengan konsesi sawit: kepadatan api **2× lipat** vs desa di luar konsesi (hutan utuh), semua tahun. Di gambut terdegradasi yang paling intens saat El Niño, kejadian api tinggi **terlepas dari livelihood**. Rekomendasi penulis: gambut terdegradasi = area prioritas, perkebunan industri = sektor prioritas | abstrak |

---

## 3. Deteksi Satelit (`papers/deteksi_satelit/`)

| Kode | Judul & Penulis | Tahun & Venue (h-index) | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Deteksi_01_Atwood_2016` | *Detection and Characterization of Low Temperature Peat Fires during the 2015 Fire Catastrophe in Indonesia* (E. Atwood et al.) | 2016, **PLoS ONE** (h=614), DOI `10.1371/journal.pone.0159410` | Empiris, OA | Sensor resolusi kasar **melewatkan** api gambut membara | Sensor TET-1/FireBird **160 m** mendeteksi api gambut membara **terus-menerus ±3 minggu** di Sebangau, Kalteng, yang tidak tertangkap baik oleh MODIS; disebut "improved detection over MODIS in monitoring low-intensity peatland fires" | abstrak + metode |
| `Deteksi_02_Vadrevu_2018` | *Intercomparison of MODIS AQUA and VIIRS I-Band Fires and Emissions in an Agricultural Landscape* (K.P. Vadrevu et al.) | 2018, **Remote Sensing (MDPI)**, DOI `10.3390/rs10070978` | Empiris, OA | Jumlah & sebaran deteksi **berbeda antar sensor** → hitungan "terpapar" bergantung sensor | Perbandingan VIIRS 375 m (VNP14IMG) vs MODIS 1 km (MCD14ML) menghasilkan perbedaan jumlah api dan estimasi emisi | abstrak |

Konsekuensi untuk produk: S-NPP tunggal dipilih agar konsisten 2012–2026, dan semua label wajib berbunyi "terdeteksi satelit", bukan "kebakaran".

---

## 4. Kesiapan Komunitas (`papers/kesiapan_komunitas/`)

| Kode | Judul & Penulis | Tahun & Venue (h-index) | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Kesiapan_01_Nurhidayah_2023` | *Community-Based Fire Management and Peatland Restoration in Indonesia* (L. Nurhidayah et al.) | 2023, Springer *Environment & Policy* (book chapter, OA), DOI `10.1007/978-3-031-15904-6_8` | Studi kasus kualitatif | MPA adalah aktor terdepan, **tetapi kekurangan dana operasional rutin** | 6 desa di Riau (Rimbo Panjang, Temusai, Lukun) & Kalteng (Tumbang Nusa dst.), 2019. Temuan: kendala paling umum = **tidak ada dukungan finansial untuk operasi & pemeliharaan rutin infrastruktur pembasahan gambut**; tidak ada teknologi tanpa-bakar terjangkau; tidak ada reward/punishment | abstrak + temuan |
| `Kesiapan_02_Dewi_2023` | *Evaluasi Kinerja Masyarakat Peduli Api dalam Pengendalian Karhutla di Desa Bontomanurung, Maros* (Dewi et al.) | 2023, **Gorontalo Journal of Forestry Research** (jurnal nasional), DOI `10.32662/gjfr.v6i1.2510` | Kualitatif deskriptif | Penghambat MPA bersifat administratif dan material, bukan kurangnya kesadaran | Faktor penghambat: **sarana-prasarana dalkarhutla tidak tersedia**, tidak ada pembinaan/pelatihan, dan **data anggota kelompok tidak terintegrasi** | abstrak + hasil |
| `Kesiapan_03_Jefferson_2019` | *Characterising policy responses to complex socio-ecological problems: 60 fire management interventions in Indonesian peatlands* (U. Jefferson, R. Carmenta, W. Daeli, J. Phelps) | 2019, **Global Environmental Change** (h=313), DOI `10.1016/j.gloenvcha.2019.102027` | Review sistematis 60 intervensi | Intervensi karhutla sangat beragam tetapi **desainnya sarat celah** | 60 intervensi dipetakan ke 4 tipe strategi (regulasi & penegakan, insentif, informasi, kapasitas); penulis menyoroti celah desain, termasuk soal kondisionalitas insentif | abstrak + temuan |
| `Kesiapan_04_Hidayati_2021` | *Institutional fragmentation of peat fire management in Indonesia: a knowledge management perspective* | 2021, **IOP Conf. Ser. EES**, DOI `10.1088/1755-1315/917/1/012028` | Studi kasus (Sumsel & Kalteng) | Fragmen kelembagaan → pengetahuan tidak mengalir antar instansi | **Tidak ada transkrip** (PDF diblokir Cloudflare, 3 URL dicoba). Hanya metadata; kutip lewat abstrak OpenAlex bila perlu | metadata |

---

## 5. Alokasi Anggaran (`papers/alokasi_anggaran/`)

Analog metode, bukan bukti karhutla Indonesia.

| Kode | Judul & Penulis | Tahun & Venue (h-index) | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Alokasi_01_Doan_2018` | *Resource allocation when planning for simultaneous disasters* (X.V. Doan & D. Shaw) | 2019, **European Journal of Operational Research** (h=420), DOI `10.1016/j.ejor.2018.10.015` | Optimasi stokastik | Alokasi sumber daya langka di bawah anggaran: tiga model (risiko gagal target, kebutuhan untuk capai target, implikasi **pagu berbeda**) + analisis sensitivitas bobot | 8 kota, 3 bencana simultan; model ketiga khusus menganalisis implikasi **budget** berbeda dan sensitivitas terhadap **bobot lokasi** — dasar untuk label "stabil / peka asumsi" | abstrak |
| `Alokasi_02_Rodriguez_Espindola_2017` | *Disaster preparedness in humanitarian logistics: A collaborative approach for resource management in floods* (O. Rodríguez-Espíndola et al.) | 2017, **EJOR** (h=420), DOI `10.1016/j.ejor.2017.01.021` | Optimasi multiobjektif + GIS | Penentuan lokasi fasilitas, **stok pra-posisi**, alokasi, dan jumlah aktor | Studi kasus banjir Acapulco 2013: tidak ada satu organisasi pun yang mampu menangani sendiri; jumlah organisasi pemerintah berlebih → biaya tinggi tanpa tingkat layanan terbaik | abstrak |
| `Alokasi_03_Yang_2017` | *Emergency logistics for wildfire suppression based on forecasted disaster evolution* (L. Yang et al.) | 2017, **Annals of Operations Research** (h=193), DOI `10.1007/s10479-017-2598-9` | Optimasi dua lapis | Prioritas lokasi api + alokasi sumber daya + rute, meminimalkan kerugian | Prioritas titik api dihitung dari **perkiraan penyebaran**, lalu alokasi & VRP diselesaikan untuk meminimalkan total kerugian hutan | abstrak |

---

## 6. Konteks Desa & Metode

| Kode | Judul & Penulis | Tahun & Venue | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Desa_01_Ginting_2023` | *Village Government's Risk Management and Village Fund Administration in Indonesia* (Ginting et al.) | 2023, **Sustainability (MDPI)**, DOI `10.3390/su152416706` | Kualitatif (observasi partisipatif) | Manajemen risiko belum menjadi praktik baku dalam pengelolaan Dana Desa | Manajemen risiko penting untuk pengelolaan dana desa; praktik menghindari kesalahan lebih dominan daripada mengantisipasi ancaman | abstrak |
| `Metode_01_Molina_2010` | *Small area estimation of poverty indicators* (I. Molina & N. Salvati) | 2010, **Canadian Journal of Statistics** (h=85), DOI `10.1002/cjs.10051` | Metodologis | Empirical Bayes (best) untuk parameter nonlinear pada area kecil → dasar penyusutan Beta-Binomial | Model nested error + parametric bootstrap untuk MSE; penurunan MSE besar dibanding estimator langsung. Menopang klaim "estimasi kecamatan lebih stabil daripada desa" | abstrak |

## 6b. Perilaku & Aksi (`papers/perilaku_dan_aksi/`)

Justifikasi mengapa produk menyentuh *keputusan*, bukan *informasi*.

| Kode | Judul & Penulis | Tahun & Venue (h-index) | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Perilaku_01_Monteil_2020` | *Remembering, Forgetting, and Absencing Disasters in the Post-disaster Recovery Process* (C. Monteil et al.) | 2020, **Int. J. of Disaster Risk Science** (h=81), DOI `10.1007/s13753-020-00277-8` | Etnografi (Montserrat, 2015–2017) | Memori bencana dibangun lewat **mengingat, melupakan, dan mengabsenkan** — dan itu menentukan keputusan pemulihan | Memori kolektif adalah alat **dan** penghalang pemulihan berkelanjutan; apa yang dilupakan tidak masuk perencanaan | abstrak |
| `Perilaku_02_Lechowska_2018` | *What determines flood risk perception? A review of factors of flood risk perception...* (E. Lechowska) | 2018, **Natural Hazards** (h=193), DOI `10.1007/s11069-018-3480-z` | Review | Persepsi risiko menjelaskan **under-estimasi risiko** oleh masyarakat, dan persepsi tidak sama dengan pengukuran objektif | Faktor penentu persepsi risiko dipetakan; persepsi risiko subjektif dianggap krusial dalam manajemen risiko banjir | abstrak |
| `Aksi_01_Chaves_Gonzalez_2022` | *Anticipatory action: Lessons for the future* (H. Chaves-González et al.) | 2022, **Frontiers in Climate** (h=65), DOI `10.3389/fclim.2022.932336` | Review kebijakan | Tindakan **sebelum** puncak dampak mengurangi kebutuhan kemanusiaan; kerangka OCHA sejak 2019, menjangkau ≈2,2 juta orang | Aksi kemanusiaan umumnya masih responsif (datang setelah krisis); AA menggeser ke sebelum dampak | abstrak |
| `Aksi_02_Perez_2016` | *Action-based flood forecasting for triggering humanitarian action* (E.C. de Pérez et al.) | 2016, **HESS** (h=241), DOI `10.5194/hess-20-3549-2016` | Metode | **Kutipan kunci**: peringatan dini yang kredibel sering tidak menghasilkan tindakan; anggaran condong ke respons | Pendekatan *action-based forecasting* memilih prakiraan berdasarkan **aksi yang dipicu**, bukan akurasi semata — analog langsung untuk "peringatan tanpa jalur aksi" | abstrak |

---

## 6c. Metode tambahan

| Kode | Judul & Penulis | Tahun & Venue | Jenis | Klaim yang didukung | Temuan kunci | Baca |
|---|---|---|---|---|---|---|
| `Metode_02_Saito_2015` | *The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets* (T. Saito & M. Rehmsmeier) | 2015, **PLoS ONE** (h=614), DOI `10.1371/journal.pone.0118432` | Metodologis, sitasi >6.000 | Time Machine wajib melaporkan **PR-AUC** bersama ROC-AUC karena kejadian api langka | Pada data timpang, kurva PR lebih informatif daripada ROC; ROC bisa terlihat bagus meski presisi rendah | abstrak |

---

## 6d. Prior art (bukan paper)

Perbandingan produk/sistem yang sudah ada — dipakai menjawab "bedanya apa?" — ada di
[`01_DATA_RONDE2.md`](01_DATA_RONDE2.md) §5: **SIPADES 3.0** (21,4% desa melapor), **SONGKET Sumsel** (aktif, punya rute ke sumber air),
**skripsi IPB 2026** (prioritas titik panas + laporan MPA).

---

## 7. Regulasi & Harga (`papers/regulasi/`)

| Kode | Dokumen | Sumber | Dipakai untuk | Catatan |
|---|---|---|---|---|
| `Regulasi_01` | **Permendesa PDT No. 16/2025** — Petunjuk Operasional Fokus Penggunaan Dana Desa TA 2026 (22 hlm) | `peraturan.go.id/filespengundangan/permendespdt-no-16-tahun-2025.pdf` | Dasar hukum pos karhutla & sumur bor gambut | Teks berlaku. Klausul gambut di **hlm. 13**: "pencegahan dan penanggulangan kebakaran hutan, lahan, rob, dan naiknya permukaan air laut seperti pembangunan/pemeliharaan sumur bor/sumur pompa, saluran air di lokasi lahan gambut". **Belum ada Permendesa untuk TA 2027** |
| `Regulasi_02` | **PMK No. 7/2026** — Pengelolaan Dana Desa TA 2026 (**abstrak peraturan**, 1 hlm) | `jdih.kemenkeu.go.id` | Pagu Dana Desa TA 2026 | Pagu **Rp60.570.000.000.000** (Rp60,57 T). Dokumen penuh 2.003 hlm tidak diunduh |
| `Regulasi_03` | **Pergub Kalteng No. 35/2025** — Pedoman Pembentukan dan Pembinaan MPA (13 hlm, 7 Jul 2025) | `jdih.kalteng.go.id` | **Standar sarana MPA per regu** — sumber angka target PRD §6 | Pasal 8(4): regu = **15 orang**. Pasal 17: desa wajib ≥1 regu, >50.000 ha ≥2, risiko tinggi ≥2. Pasal 18: pompa punggung **10**, sekop 6, gepyok 8, garu tajam 6, garu pacul 3, kapak 4, golok 10, obor 1, kikir 2. Pasal 19: pompa induk 1, **pompa jinjing 3**, pompa apung 2, nozzle 5, tangki lipat 5, **selang 50 buah**, chain-saw 1. Pasal 16(3): sarana = tanggung jawab kepala desa. Pasal 26: pendanaan APBD/pemegang izin |
| `Regulasi_04` | **Pergub Kalbar No. 56/2025** — Pelaksanaan Perda Kalbar 2/2022 tentang Pengendalian Kebakaran Hutan dan/atau Lahan (23 hlm, 31 Des 2025) | `jdih.kalbarprov.go.id` | Dasar hukum Kalbar; **tidak** menetapkan jumlah peralatan | Bersifat prosedural: pelaku usaha wajib penyuluhan & membentuk kelompok masyarakat; pembinaan via sosialisasi/fasilitasi/pelatihan. Perda induk (No. 2/2022) tidak diunduh (9,3 MB, teks dapat diakses di JDIH Kalbar) |
| `Harga_01` | **Perwal Kota Kediri No. 3/2025** — Standar Harga Satuan (328 hlm) | `jdih.kedirikota.go.id/produk-hukum/download/1439` | Harga selang & APD pembanding | Item **4948**, hlm. 90: Selang Pemadam Kebakaran polyester 1,5" × 20 m = **Rp3.490.500/buah**; item 4949, 2,5" × 20 m = Rp6.957.000; belanja tahan panas (set) Rp14.443.200 |
| `Harga_02` | **Perbup Sanggau No. 32/2025** — Standar Satuan Harga Barang **TA 2026** (252 hlm) | `jdih.sanggau.go.id` | **Harga acuan utama** (Kalimantan Barat, provinsi studi) | Hlm. 174: selang pemadam 2,5" Rp6.669.000/roll; polyester 1,5" Rp6.669.000/roll; selang rubber 2,5 × 30 m + coupling Machino Rp8.731.260/roll; Y-connection 2 handle Rp7.022.400; hlm. 175: **Mesin Pompa Portable Rp28.028.610/unit**, Pompa Portable Fire Pump Rp74.574.831, Pompa Air Apung Pemadam Rp44.902.719 & Rp75.924.000, Pompa Pemadam Kebakaran Rp62.700.000, sekop baja Rp311.220, cangkul Rp228.000, senter kepala LED Rp399.000; hlm. 22–23: solar non-subsidi Rp10.000/liter |

---

## 8. Klaim yang TIDAK didukung korpus ini

Jangan menulis klaim berikut, meski terasa masuk akal:

1. **"Hektare terselamatkan" / efek kausal belanja kesiapan terhadap luas terbakar.** Tidak ada studi yang mengukurnya; paper `Paparan_07` pun tidak bisa memisahkan efek FRS dari restorasi dan kekuatan El Niño.
2. **"Peringatan dini tidak dipakai"** sebagai fakta terukur. `Paparan_04` hanya menyatakan "sedikit bukti" (lihat kalimat aslinya di transkrip), bukan pengukuran adopsi.
3. **"Kalbar tidak punya skill prakiraan musiman."** `Paparan_03` menguji Kalimantan selatan vs tengah, **bukan Kalbar**. Klaim spesifik Kalbar harus dikaitkan ke `Paparan_04` atau dihapus.
4. **Standar sarana MPA berlaku nasional.** Standar **per regu** hanya ditemukan di **Pergub Kalteng 35/2025** (Pasal 18–19). Kalimantan Barat **tidak** punya angka serupa (Pergub Kalbar 56/2025 hanya prosedural). Jangan menyebut target sebagai standar nasional, dan jangan merata-ratakan dua provinsi.
5. **Efektivitas MPA terhadap pengurangan api.** `Kesiapan_01`/`Kesiapan_02` hanya memetakan peran dan hambatan, bukan efek.
6. **Harga resmi e-katalog LKPP.** Yang tersedia adalah SSH kabupaten/kota (Kediri, Sanggau). Harga e-katalog 2026 belum berhasil diverifikasi langsung.

## 9. Paper yang ditolak / tidak dipakai

| Kandidat | Alasan |
|---|---|
| Turetsky 2015 (PDF), Hidayati 2021 (PDF) | Berbayar/diblokir; disimpan metadata saja |
| "A methodology for determining operational priorities for prevention and suppression of wildland fires" (IJWF, `10.1071/wf13063`) | PDF 503 dan mirror rusak; sudah terwakili `Alokasi_01`–`03` |
| "Bureaucratic inertia in dealing with annual forest fires in Indonesia" (IJWF, `10.1071/wf20168`) | PDF CSIRO 503; relevan untuk klaim serah-terima — **unduh ulang bila perlu** |
| MPA Maros versi repository Unja | Duplikat lokal dari `Kesiapan_02` (tanpa DOI) |

## 10. Catatan pemeliharaan

- Setiap penambahan paper: taruh PDF di folder kategori, jalankan extractor, lalu tambahkan baris di tabel dengan **klaim spesifik**, bukan "referensi umum".
- Pembaca transkrip: gunakan `## Page N` untuk kutipan verbatim; header memuat SHA-256 untuk verifikasi berkas.
- PDF `Harga_02` berukuran **7,2 MB** (>5 MB). Sesuai `AGENTS.md`, butuh persetujuan pemilik repo sebelum masuk git.
