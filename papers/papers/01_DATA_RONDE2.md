# Celah Data — Ronde 2 (9 November 2026)

Lanjutan [`00_CELAH_DATA.md`](00_CELAH_DATA.md). Fokus ronde ini: **kelayakan teknis pipeline**,
**dasar hukum kesiapan**, **prior art yang akan ditanyakan juri**, dan **justifikasi perilaku**.
Kelas bukti sama: **[P]** primer terunduh, **[S]** sekunder, **[T]** tidak ditemukan.

---

## 1. Sensor: S-NPP mati, seri tidak bisa diperpanjang

| Fakta | Isi | Kelas |
|---|---|---|
| S-NPP berhenti | Pengiriman data berakhir **2 Nov 2026, 15:40 UTC**; deorbit mulai 1 Des 2026 | [S] NOAA NESDIS |
| Pengganti | **NOAA-20** (1 Jan 2020–) dan **NOAA-21** (17 Jan 2024–) tetap aktif di FIRMS | [S] FIRMS |
| Arsip S-NPP | Tetap tersedia historis; **tidak digantikan** oleh N20/N21 | [S] |
| Atribut wajib | Kolom `satellite` berisi `N`, `N20`, `N21` — jangan digabung tanpa penanda | [S] |

**Konsekuensi teknis (penting, belum ada di dokumen mana pun).**
- Seri tunggal S-NPP yang dijanjikan 2012–2 Nov 2026 **memang konsisten**, tetapi **berakhir 7 hari sebelum submission**. Mode "live 2026" tidak bisa menambah data S-NPP setelah 2 Nov.
- Dua pilihan yang jujur: (a) bekukan paparan 2026 pada **2 Nov 2026** dan tulis tanggalnya di UI; atau (b) tambahkan ekor N20/N21 sebagai lapisan terpisah berlabel sensor berbeda. **Jangan** mencampur tanpa penanda — itu melanggar prinsip "satu sensor agar konsisten" yang sudah dikunci di TRD.
- Kolom `satellite` wajib disimpan di tabel deteksi, karena audit trail sensor adalah bagian rubrik Etika (10%).

---

## 2. Batas desa: HDX bukan geometri 2025

| Sumber | Isi | Kelas |
|---|---|---|
| HDX `cod-ab-idn` | COD-AB **version 01**, geometri asal **April 2020**, ditinjau 30 Okt 2025; ADM4 = **81.912** desa/kelurahan | [S] |
| Resmi terbaru | **Peta Batas Administrasi Desa/Desa Adat Juli 2025** (Kemendagri, `data.go.id`) — SHP/GeoJSON/GML | [S] |
| Kode wilayah | **Kepmendagri 300.2.2-2138/2025** (25 Apr 2025), diubah **300.2.2-2430/2025** (23 Jun 2025) | [S] |

**Konsekuensi.** PRD menyebut "batas HDX" tanpa vintage. Dua hal yang harus ditulis atau diubah:
1. Metadata sumber wajib menyebut **"geometri 2020, tinjauan Okt 2025"**, bukan "data 2025".
2. Kode desa harus direkonsiliasi ke Kepmendagri 2025, karena kode bisa berubah dan produk memakai kode desa sebagai kunci URL.

Kalau SHP Kemendagri 2025 berhasil diunduh dan formatnya terbaca `geopandas`, itu pilihan yang lebih kuat untuk dipertahankan di depan juri.

---

## 3. Kalender anggaran: jendela APBDes 2027 masih terbuka 52 hari

| Tahap | Batas | Dasar |
|---|---|---|
| RKP Desa 2027 ditetapkan | paling lambat **30 Sep 2026** | Permendagri 114/2014 (diubah 20/2018) |
| Rancangan APBDes disepakati Kades + BPD | paling lambat **Oktober 2026** | **Pasal 32 ayat (3) Permendagri 20/2018** |
| **APBDes 2027 ditetapkan** | paling lambat **31 Des 2026** | **Pasal 38 ayat (2) Permendagri 20/2018** |
| APBDes perubahan | sepanjang tahun anggaran | praktik baku |

**Konsekuensi.** Catatan verifikasi di laporan riset ("kalender kemungkinan sudah melewati titik masuk") **hanya benar untuk RKPDes**. APBDes 2027 masih bisa ditetapkan sampai 31 Desember 2026 — demo 14 November berada **di dalam** jendela itu, dan APBDes perubahan selalu tersedia. Ini argumen waktu terkuat yang dimiliki produk, dan sekarang punya pasal, bukan "materi turunan".

---

## 4. Standar sarana MPA: akhirnya ada angka resmi

**Pergub Kalimantan Tengah No. 35/2025** (7 Juli 2025, 13 hlm) — transkrip: `papers/regulasi/Regulasi_03_…md`.

| Ketentuan | Isi | Pasal |
|---|---|---|
| Regu | **15 orang per regu** | Pasal 8 ayat (4) |
| Kewajiban desa | setiap desa/kelurahan **wajib ≥1 regu**; desa >50.000 ha **≥2 regu**; desa risiko tinggi **≥2 regu** | Pasal 17 |
| Tanggung jawab sarana | **kepala desa/lurah**, termasuk penyimpanan & pemeliharaan | Pasal 16 ayat (3) |
| Pendanaan | pemegang izin; selain itu **APBD dan sumber dana lain yang tidak mengikat** | Pasal 26 |

**Peralatan tangan per regu (Pasal 18):** kapak dua fungsi 4 · gepyok 8 · garu tajam 6 · garu pacul 3 · sekop 6 · **pompa punggung 10** · obor sulut tetes 1 · kikir 2 · golok/parang 10.

**Peralatan mekanis per regu (Pasal 19):** **pompa induk 1** · **pompa jinjing 3** · dan/atau **pompa apung 2** · nozzle 5 · tangki air lipat 5 · **selang 50 buah** · chain-saw 1.

**Perlengkapan pribadi (Pasal 20):** topi, kacamata, masker + penutup leher, sarung tangan, peples, sepatu pemadam, baju pemadam.

**Konsekuensi.**
1. Kolom target di PRD §6 bisa **berhenti jadi asumsi** untuk Kalteng: `pompa_jinjing` 3, `pompa_punggung` 10, `selang_keluar` 50, regu 15 orang — semuanya bersumber. Target "rendah/sedang/tinggi" cukup diturunkan dari jumlah regu wajib (1 vs 2).
2. **Satuan bentrok**: Pergub menghitung **selang 50 buah**, PRD menghitung **rol 20 m**. Harus dipilih satu dan ditulis eksplisit; jangan diam-diam dikonversi.
3. **Kalimantan Barat tidak punya angka**: Pergub Kalbar 56/2025 bersifat prosedural (kewajiban penyuluhan & pembentukan kelompok), tidak menetapkan jumlah peralatan. Jadi target default per provinsi berbeda, dan selisihnya harus ditampilkan di UI — bukan dirata-ratakan diam-diam.
4. Pergub menyebut pendanaan **APBD**, bukan Dana Desa. Ini justru memperkuat desain multi-kanal: kewajiban alat ada di APBD/pemegang izin, izin belanja ada di Dana Desa, dan celah di antaranya adalah tempat produk ini bekerja.

---

## 5. Prior art yang paling mungkin ditanya juri

### 5.1 SIPADES 3.0 (Kemendagri)

| Fakta | Angka | Kelas |
|---|---|---|
| Desa dalam basis data | **75.266** | [S] LAKIN Ditjen Bina Pemdes 2025 |
| Desa melaporkan inventarisasi | **15.596 (20,7%)** per Apr 2025; **16.182 (21,4%)** per Jan 2026 | [S] |
| Belum melapor | **59.084 desa** | [S] |
| Cakupan modul | aset desa: tanah, bangunan, kendaraan, **peralatan dan mesin**, alat produksi, aset kerja sama; termasuk **kondisi aset**, kode, nilai, lokasi | [S] |
| Yang dihapus di 3.0 | menu **perencanaan** dan **foto aset** | [S] |

**Jawaban satu baris untuk juri:** *"SIPADES mencatat aset, tetapi 79% desa tidak pernah melapor, dan tidak ada satu pun kolom yang menghubungkan alat MPA ke target kesiapan, skor, atau prioritas anggaran."*

### 5.2 SONGKET (Sumatera Selatan)

Portal WebGIS **aktif per 9 Nov 2026**: hotspot SiPongi+/MODIS/VIIRS, data historis, overlay gambut/FEG/kawasan hutan/KPH, **analisis jarak hotspot ke posko dan sumber air**, **rute & estimasi waktu**, peta interaktif, pencarian wilayah, pelaporan warga, koordinat Satgas. Aplikasi Android tersedia, **pembaruan terakhir ± Juli 2021**.

**Jawaban:** SONGKET sudah mengerjakan sisi *respons* (ke mana regu harus pergi). Yang tidak ada: inventaris alat, skor kesiapan, dan penyusunan prioritas di bawah pagu.

### 5.3 Skripsi IPB 2026 (Kautsar dkk.)

Sistem peringatan dini berbasis **Next.js**: visualisasi hotspot, klasifikasi, **titik panas prioritas** (high-risk/cluster/sequence), deteksi hotspot diduga palsu, **pengelolaan laporan MPA**, filter, ekspor PDF; diuji black-box 45 kasus.

**Jawaban:** itu memprioritaskan **titik panas untuk ground check**, bukan **item belanja untuk anggaran desa**. Wilayahnya nasional/akademik, bukan alur APBDes.

---

## 6. Harga sumur bor: ada standar nasional, tapi belum terverifikasi primer

**Perdirjen PPKL No. P.4/PPKL/SET/PKL.0/7/2021** — Standar Biaya Pembangunan Infrastruktur Pembasahan Gambut (mencabut P.11/2020). Mencakup sekat kanal, penimbunan kanal, **sumur bor**, embung.

| Kode | Konstruksi | Kedalaman | Kontraktual | Swakelola |
|---|---|---:|---:|---:|
| SBO-20-1 | PVC AW 1½" | 20 m | Rp3.931.000 | Rp3.105.000 |
| SBO-28-1 | PVC AW 1½" | 28 m | Rp4.914.000 | Rp3.713.000 |
| SBO-40-1 | PVC AW 1½" | 40 m | Rp6.389.000 | Rp4.549.000 |
| SBO-28-3 | PVC 3" + 1½" | 28 m | Rp8.093.000 | Rp5.954.000 |
| SBO-40-3 | PVC 3" + 1½" | 40 m | Rp11.032.000 | Rp7.754.000 |

Komponen tambahan: peralatan pengeboran Rp11.442.750 per paket 25 sumur (swakelola); peralatan operasional Rp17.777.100 per paket 10 sumur; SMKK Rp1.175.000 per paket; **mobilisasi maksimal 25%** dari nilai unit.

**Batas yang harus dijaga:** angka di atas dibaca dari salinan pihak ketiga — **PDF resmi belum diperoleh** (jdih.menlhk 000, peraturan.go.id tidak ada). Kelas **[S] lemah**. Jangan masukkan ke `harga_item.csv` sebelum PDF resmi diunduh; kalau terpaksa, tulis "estimasi pedoman 2021, belum diverifikasi".

Konteks tambahan: **Permen LHK 4/2024** menyebut fungsi sumur bor gambut untuk pembasahan & pemadaman awal, dan satu kawasan idealnya memiliki **≥25 titik sumur bor**.

---

## 7. Musim berikutnya: hujan bukan berarti aman

| Sinyal | Isi | Kelas |
|---|---|---|
| Status ENSO | El Niño sangat kuat sedang berlangsung; **berpotensi bertahan sampai awal 2027** | [S] BMKG |
| Musim hujan 2026/2027 | awal musim **mundur** di 61,08% wilayah; durasi **lebih pendek** di 51,90% wilayah | [S] BMKG |
| Puncak hujan | Des 2026 (36,94% wilayah), Jan 2027 (25,68%), Feb 2027 (16,79%) | [S] |
| Kemarau 2027 | **belum ada prakiraan resmi** | [T] |

**Konsekuensi.** Framing "hujan November mengembalikan desa ke kondisi lupa" **bukan retorika** — BMKG memang menyatakan El Niño bertahan sampai awal 2027 dan musim hujan datang lebih lambat. Tapi jangan meramal kemarau 2027; yang boleh dikatakan hanya "sinyal ENSO masih hangat, prakiraan resmi belum terbit".

---

## 8. Jebakan alat: `peraturan.bpk.go.id/Download/<id>` menyajikan dokumen salah

Tiga percobaan berurutan mengembalikan **dokumen yang sama sekali berbeda** (HTTP 200, `%PDF` valid):
- `Download/343678` → Peraturan Gubernur NTT 2023 (bukan Permendesa 16/2025)
- `Download/232118` → Perwali Balikpapan 2019 (bukan Perda Kalbar 2/2022)
- `Download/356256` → Perbup Mappi 2023 (bukan Pergub Kalbar 56/2025)

**Aturan:** endpoint itu hanya boleh dipakai setelah **halaman pertama dibaca dan dicocokkan**. Sumber yang terbukti benar: `jdih.kalteng.go.id`, `jdih.kalbarprov.go.id/media/peraturan/<tahun>/<file>.pdf`, `jdih.kedirikota.go.id`, `jdih.sanggau.go.id`, `peraturan.go.id/filespengundangan/`.

---

## 9. Yang tetap terbuka setelah ronde 2

| Celah | Status |
|---|---|
| Luas terbakar resmi pasca-Juli 2026 | [T] |
| Pembagian gambut/mineral resmi 2025–2026 | [T] |
| Waktu respons nyata deteksi → tiba | [T] |
| Evaluasi program Desa Mandiri Peduli Api | [T] |
| Porsi APBDes karhutla nasional | [T] (hanya ilustrasi OKI) |
| PDF resmi Perdirjen P-4/2021 | [T] — angka sumur bor masih sekunder |
| ID produk e-katalog LKPP 2026 | [T] |
| Daftar resmi desa rawan karhutla per desa | [T] |
| Prakiraan resmi kemarau 2027 | [T] (BMKG belum terbit) |

---

## 10. Lima kalimat yang bisa langsung dipakai di video/presentasi

1. "S-NPP berhenti 2 November 2026; seri kami berhenti di sana dan kami menuliskannya, bukan menyambungnya diam-diam."
2. "APBDes 2027 masih bisa ditetapkan sampai 31 Desember 2026 — demo ini berjalan di dalam jendela itu (Permendagri 20/2018 Pasal 38)."
3. "Setiap regu MPA di Kalimantan Tengah wajib punya 3 pompa jinjing, 10 pompa punggung, dan 50 selang (Pergub Kalteng 35/2025 Pasal 18–19). Target kami bukan karangan."
4. "SIPADES mencatat aset desa, tetapi hanya 21% desa yang melapor, dan tidak ada kolom target, skor, atau prioritas."
5. "BMKG memperkirakan El Niño bertahan sampai awal 2027 — hujan November bukan tanda aman."
