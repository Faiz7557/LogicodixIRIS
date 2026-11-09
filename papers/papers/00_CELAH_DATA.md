# Celah Data — Status Setelah Pencarian 9 November 2026

Dokumen ini menutup daftar "Yang tidak ditemukan" di
[`reports/Celah solusi karhutla Indonesia.md`](../reports/Celah%20solusi%20karhutla%20Indonesia.md) §7.
Isinya hanya angka yang **berhasil ditemukan**, sumbernya, dan batas pemakaiannya.
Angka yang tetap tidak ditemukan dicatat di §6 dan **tidak boleh ditebak**.

> Lanjutan: [`01_DATA_RONDE2.md`](01_DATA_RONDE2.md) (kelayakan pipeline, standar MPA, prior art) dan
> [`02_DATA_RONDE3.md`](02_DATA_RONDE3.md) (gambut/mineral resmi 2020–2024, desa rawan, keputusan satuan selang).

Kelas bukti: **[P]** primer (dokumen resmi diunduh, transkrip ada di `papers/regulasi/`),
**[S]** sekunder (situs resmi/berita, halaman tidak diarsipkan), **[T]** tidak ditemukan.

---

## 1. Luas terbakar resmi 2026 — masih berhenti di Juli

| Ukuran | Angka | Sumber | Kelas |
|---|---|---|---|
| Luas terbakar Jan–Juli 2026 (narasi SiPongi) | **202.004,30 ha** | `sipongi.gakkum.kehutanan.go.id/indikasi-luas-kebakaran`, akses 9 Nov 2026; laman menyatakan input terakhir Juli 2026 | [S] |
| Jumlah kolom provinsi pada tabel yang sama | 202.010,96 ha (selisih **6,66 ha** dari narasi) | sama | [S] |
| Kalimantan Barat | **38.310,86 ha** | sama | [S] |
| Kalimantan Tengah | **7.634,46 ha** | sama | [S] |
| Riau / Maluku / Jatim / Kalsel | 15.738,92 / 14.677,00 / 10.835,28 / 8.019,63 ha | sama | [S] |

**Konsekuensi produk.** Tidak ada angka resmi pasca-Juli. Karena itu:
- Halaman Data **wajib** menyebut "seri resmi berhenti Juli 2026" dengan tanggal akses.
- Pembanding 2026 memakai estimasi independen yang sudah ada di laporan riset (Nusantara Atlas ±1,9 juta ha Jan–Sep) dan **tidak boleh** disebut sebagai pengganti seri resmi.
- Kalbar adalah provinsi dengan luas terbakar resmi terbesar (38,3 ribu ha) → memperkuat pilihan cakupan Kalbar+Kalteng, dan layak ditampilkan sebagai satu kalimat di Beranda.

---

## 2. Harga satuan — sekarang bersumber, dari Kalimantan Barat

Celah "harga satuan belum bersumber" **tertutup sebagian**. Sumber terbaik: **Perbup Sanggau No. 32/2025, Standar Satuan Harga Barang TA 2026** — kabupaten di Kalimantan Barat, tahun anggaran yang dituju.

| Item PRD | Harga acuan | Halaman | Catatan |
|---|---:|---|---|
| `pompa_jinjing` | **Rp28.028.610**/unit ("Mesin Pompa Portable") | 175 | Termurah yang cocok. Varian lain: Pompa Portable Fire Pump Rp74.574.831; Pompa Pemadam Kebakaran Rp62.700.000; Pompa Air Apung Rp44.902.719 & Rp75.924.000 |
| `selang_keluar` (1 rol 20 m) | **Rp6.669.000**/roll (polyester 1,5") | 174 | Varian rubber 2,5" × 30 m + coupling Machino Rp8.731.260 |
| `selang_keluar` pembanding kota | Rp3.490.500/20 m (polyester 1,5") | Kediri hlm. 90, item 4948 | Perwal Kediri 3/2025 |
| Nozzle 1,5" | Rp1.328.670/buah | 175 | — |
| Y-connection 2 handle | Rp7.022.400/buah | 174 | — |
| `apd` (set) | Rp19.836.000/set | 175 | Helm, kacamata, sarung tangan, sepatu |
| Peralatan ringan | sekop baja Rp311.220; cangkul Rp228.000; senter kepala LED Rp399.000 | 175 | — |
| `bbm` | **Rp10.000/liter** (solar non-subsidi) | 22–23 | Harga standar daerah, bukan harga eceran SPBU |

**Yang masih kosong:** sumur bor (tidak ada di SSH mana pun yang ditemukan), `ht`, `pompa_punggung`, `selang_hisap`, dan ID produk e-katalog LKPP 2026.

**Konsekuensi produk.**
- `data/manual/harga_item.csv` bisa diisi sekarang untuk 7 dari 9 item, dengan kolom `sumber` = "Perbup Sanggau 32/2025 hlm. X" + tanggal akses, dan `kota` = Kediri sebagai pembanding.
- Bias yang harus ditulis di UI: harga Sanggau adalah **harga satuan tertinggi** (termasuk pajak, keuntungan, transport), jadi usulan desa cenderung lebih murah dari angka ini.
- Item tanpa harga tetap dikeluarkan dari urutan dan ditandai — perilaku PRD FR-11 sudah benar.
- **Jangan** memakai angka Tanjab Timur (pompa jinjing Rp38,75 juta) sebagai acuan: PDF-nya 404 sejak 9 Nov 2026 dan tidak bisa diverifikasi ulang.

**Temuan sampingan yang layak masuk narasi:** satu roll selang 20 m di SSH Sanggau (Rp6,67 juta) sudah **melebihi rata-rata alokasi karhutla per desa** di contoh OKI (Rp6,42 juta; §5). Artinya masalahnya bukan "desa tidak tahu harus beli apa", tetapi **satu item pun tidak tertutup oleh alokasi biasa**.

---

## 3. Dana Desa 2027 — dasar hukumnya belum ada

| Pertanyaan | Jawaban | Kelas |
|---|---|---|
| Apakah Permendesa untuk Dana Desa TA 2027 sudah terbit? | **Belum ditemukan** sampai 9 Nov 2026. Yang berlaku: **Permendesa PDT No. 16/2025** untuk TA 2026 | [S] |
| Pagu Dana Desa TA 2026 | **Rp60.570.000.000.000** (Rp60,57 T) | [P] PMK 7/2026, abstrak |
| Apakah sumur bor gambut boleh dibiayai? | **Boleh**, sebagai bagian "penguatan Desa berketahanan iklim dan tangguh bencana" | [P] Permendesa 16/2025, hlm. 13 |

Kutipan verbatim (hlm. 13, transkrip `papers/regulasi/Regulasi_01_…md`):

> "pencegahan dan penanggulangan kebakaran hutan, lahan, rob, dan naiknya permukaan air laut seperti pembangunan/pemeliharaan sumur bor/sumur pompa, saluran air di lokasi lahan gambut, talud, tanggul pemecah ombak skala Desa, dan perlindungan terumbu karang"

**Konsekuensi produk.**
- Dokumen usulan **tidak boleh** menulis "berdasarkan Permendesa 16/2025" untuk TA 2027. Rumusan aman di dokumen dan README: *"mengacu pada ketentuan fokus penggunaan Dana Desa yang berlaku pada Tahun Anggaran 2027"*, dengan Permendesa 16/2025 sebagai **preseden**.
- Ini justru menguatkan keputusan multi-kanal (APBDes / BPBD / Daops / CSR): kalau kanal APBDes tertutup, dokumen yang sama tetap terpakai.

---

## 4. Jumlah pengguna — MPA dan Manggala Agni

| Ukuran | Angka | Tanggal & cakupan | Kelas |
|---|---|---|---|
| Personel MPA | **22.036** | per 19 Okt 2026, 37 provinsi (rilis Kemenhut) | [S] |
| Personel MPA (rilis lain) | 14.040 | 34 provinsi — **basis data berbeda, jangan dijumlahkan** | [S] |
| Manggala Agni organik | **1.419** | enam provinsi prioritas | [S] |
| Manggala Agni snapshot operasi gabungan BNPB | 1.376 | per 11 Okt 2026, enam provinsi; bukan total organisasi | [S] |
| Target MPA Berkelanjutan 2026 | 500 kelompok / ±15.000 anggota (asumsi 30/kelompok) | 119 kelompok terbentuk, 61 dalam proses | [S] |

**Konsekuensi produk.** Angka jangkauan yang boleh dipakai: "MPA tercatat **22.036 personel di 37 provinsi** (Kemenhut, 19 Okt 2026)".
Jangan menulis "11.000 anggota" (angkanya 2023 dan sudah usang), dan jangan menyebut "jumlah MPA aktif" — yang tersedia adalah **personel tercatat**, bukan kelompok aktif yang terverifikasi.

---

## 5. Porsi Dana Desa untuk karhutla — tidak ada persentase nasional, tapi ada satu kasus

| Pertanyaan | Jawaban | Kelas |
|---|---|---|
| Persentase wajib Dana Desa untuk karhutla | **Tidak ada** untuk TA 2025 maupun 2026. Batas yang sering tertukar: BLT ≤15%, ketahanan pangan ≥20%, operasional pemdes ≤3% — bukan karhutla | [S] |
| Bukti desa benar-benar mengalokasikan | **OKI 2026: 283 desa, total Rp1.816.516.850** → rata-rata **Rp6.419.847/desa** (≈90,1% dari 314 desa yang disebut) | [S] web.kaboki.go.id, 29 Okt 2026 |
| Data nasional jumlah desa yang mengalokasikan | Tidak ditemukan | [T] |

**Konsekuensi produk.**
- Angka OKI hanya boleh dipakai sebagai **ilustrasi skala**, bukan generalisasi: "di OKI 2026, rata-rata alokasi karhutla per desa sekitar Rp6,4 juta" — Sumatera Selatan, bukan Kalbar.
- Ini angka pembanding paling kuat untuk menjustifikasi halaman Prioritas: pagu default di demo sebaiknya **di sekitar Rp10–20 juta**, bukan miliaran, supaya urutan item terasa nyata.

---

## 6. Yang masih kosong setelah pencarian ini

| Celah | Status | Dampak bila tetap kosong |
|---|---|---|
| Luas terbakar resmi pasca-Juli 2026 | [T] | Halaman Data menyebut tanggal berhenti seri; tidak ada angka 2026 penuh |
| Pembagian resmi gambut/mineral 2025–2026 | [T] | Porsi gambut tetap dari WRI, bukan dari Kemenhut |
| Waktu respons nyata deteksi → tiba di lokasi | [T] | Klaim tetap dibatasi pada kesiapan, bukan kecepatan respons |
| Evaluasi program Desa Mandiri Peduli Api | [T] | Tidak ada klaim efektivitas; pakai `Kesiapan_01`/`Kesiapan_02` yang hanya memetakan hambatan |
| Porsi APBDes untuk karhutla secara nasional | [T] | Hanya ilustrasi OKI |
| Harga sumur bor gambut (biaya total) | [T] | Item `sumur_bor` masuk kategori "tanpa harga" sampai desa mengisi sendiri |
| ID produk & harga e-katalog LKPP 2026 | [T] | Acuan harga memakai SSH kabupaten/kota; ditulis apa adanya |
| SK Penetapan MPA per desa (untuk verifikasi peran) | [T] | Akun demo tetap berlabel data uji |

---

## 7. Ringkasan yang bisa langsung dipakai

1. **Harga**: isi `data/manual/harga_item.csv` dari Perbup Sanggau 32/2025 (hlm. 174–175, 22–23) + Perwal Kediri 3/2025 (hlm. 90) sebagai pembanding.
2. **Regulasi**: kutip Permendesa PDT 16/2025 hlm. 13 untuk TA 2026 saja; TA 2027 pakai rumusan netral.
3. **Skala masalah**: MPA 22.036 personel; rata-rata alokasi karhutla desa di OKI Rp6,42 juta < satu roll selang Rp6,67 juta.
4. **Data paparan**: seri resmi berhenti Juli 2026 (202.004,30 ha); Kalbar terbesar (38.310,86 ha).
5. **Yang tetap tidak ada**: angka resmi 2026 penuh, pembagian gambut/mineral, harga sumur bor, evaluasi efektivitas MPA.
