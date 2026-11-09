# Celah Data — Ronde 3 (9 November 2026)

Menutup sembilan butir "Yang masih benar-benar kosong". Hasilnya: **lima tertutup sebagian atau penuh**,
**empat tetap kosong** — dan salah satunya ternyata kosong karena datanya salah label, bukan karena tidak ada.

Kelas bukti: **[P]** primer terunduh/di-API, **[S]** sekunder, **[T]** tidak ditemukan.

---

## 1. Luas terbakar resmi pasca-Juli 2026 — tetap tidak ada, tapi ada angka operasional

| Sumber | Angka | Cakupan | Kelas |
|---|---|---|---|
| SiPongi | **202.004,30 ha** | Jan–Jul 2026; input terakhir Juli | [S] |
| **BNPB per 8 Nov 2026** | **5.335 ha** terbakar · 1.925 ha belum padam · 2.529 hotspot · 976 titik api | snapshot pemantauan, **bukan kumulatif** | [S] |
| BNPB per 24 Okt 2026 | 25.409 ha terbakar · 17.942 ha belum padam | snapshot operasional | [S] |
| Kemenhut s.d. 30 Agu 2026 | 38.829,46 ha **"ditangani"** | istilah "ditangani" ≠ "luas indikasi" SiPongi | [S] |

**Aturan pakai.** Keempat angka ini **tidak boleh dijumlahkan atau dibandingkan** — beda definisi. Yang boleh
ditulis di halaman Data: *"Kumulatif resmi berhenti pada Juli 2026 (202.004,30 ha). Setelah itu hanya ada
snapshot operasional BNPB yang tidak kumulatif."* Itu justru memperkuat panel transparansi, bukan melemahkannya.

---

## 2. Pembagian gambut/mineral — **ada, resmi, 2020–2024**

Sumber resmi ditemukan: **Portal Statistik Kementerian Kehutanan** (`statistik.kehutanan.go.id`), tiga dataset
terpisah (gambut, mineral, total) per provinsi, 2020–2024, dari *Buku Statistik Kehutanan 2024*.
Data ditarik lewat API publik dan disimpan di [`data/karhutla_gambut_mineral_2020_2024.csv`](data/karhutla_gambut_mineral_2020_2024.csv).

Endpoint (untuk regenerasi):
`https://statistik.kehutanan.go.id/api/v1/statistic/getStatisticExport?slug=<slug>&year=<tahun>`
dengan slug `…-berdasarkan-tanah-gambut`, `…-berdasarkan-tanah-mineral`, `…-karhutla`. **[P]**

### Nasional (ha)

| Tahun | Gambut | Mineral | Total | Porsi gambut |
|---|---:|---:|---:|---:|
| 2020 | 20.000 | 276.943 | 296.943 | 6,7% |
| 2021 | 25.909 | 332.957 | 358.866 | 7,2% |
| 2022 | 19.776 | 183.910 | 203.686 | 9,7% |
| **2023** | **178.279** | **973.914** | **1.152.193** | **15,5%** |
| 2024 | 31.449 | 345.356 | 376.806 | 8,3% |

### Kalimantan Barat dan Kalimantan Tengah (ha, gambut / mineral)

| Tahun | Kalbar | Kalteng |
|---|---|---|
| 2020 | 1.413 / 6.234 | 1.546 / 6.135 |
| 2021 | **13.447 / 7.143** | 692 / 2.960 |
| 2022 | 9.241 / 12.595 | 138 / 1.417 |
| 2023 | 31.867 / 79.981 | **60.774 / 96.122** |
| 2024 | 5.649 / 18.506 | 4.621 / 6.839 |

### Tiga temuan yang bisa dipakai

1. **Gambut melonjak jauh lebih tajam daripada mineral pada tahun ekstrem.** 2020 → 2023: gambut **×8,9**
   (20.000 → 178.279), mineral **×3,5** (276.943 → 973.914). Ini bukti kuantitatif untuk tesis
   "tahun ekstrem adalah tahun gambut".
2. **Kalbar 2021 adalah tahun gambut, bukan mineral** — 13.447 ha gambut vs 7.143 ha mineral, satu-satunya
   tahun dalam seri di mana gambut mendominasi provinsi ini. Desa yang hanya melihat 2021 akan menyimpulkan
   hal yang sangat berbeda dari desa yang melihat 2020–2024.
3. **Kontrol kualitas internal lolos**: total 2024 = 376.806 ha, sedangkan seri GoodStats yang dipakai
   laporan riset menyebut 376.805 ha (selisih 1 ha). Total 2023 = 1.152.193 vs 1.161.193 di GoodStats
   (selisih 9.000 ha) — perlu dicatat sebagai perbedaan pembulatan/versi, bukan diabaikan.

### Pembanding 2026 (bukan resmi)

MapBiomas Indonesia, Jan–Agu 2026: total **637.011 ha**, gambut **126.431 ha (19,85%)**, mineral **510.580 ha (80,15%)**.
Kemenhut memberi contoh provinsi Jan–Jun 2026: Kalsel 383,07 ha (29,44 gambut) dan Riau 15.477,9 ha (14.277,3 gambut — 92% gambut).
**[S]**

### Catatan kelembagaan

BRGM berakhir **31 Desember 2024**; fungsi restorasi gambut dialihkan ke Kementerian Kehutanan dan KLH/BPLH.
Per 30 September 2026, Kemenhut menyampaikan rencana pembentukan **BPGMN** (masih dalam penyusunan Perpres).
Jadi kalimat "butuh pemilik berdana sejak BRGM berakhir" sekarang punya tanggal dan penerus yang jelas. **[S]**

---

## 3. Daftar desa rawan — tidak ada daftar terbuka, dan satu dataset salah label

| Temuan | Angka | Kelas |
|---|---|---|
| Desa rawan yang **dijangkau patroli** Kemenhut | **1.777 desa** (s.d. 19 Okt 2026) | [S] |
| Desa sasaran pengembangan MPA berikutnya | **320 desa** | [S] |
| **Kalbar**: desa sasaran Patroli Terpadu (20 Jul–6 Agu 2026) | **24 desa**: Sambas 6, Ketapang 6, Mempawah 3, Kubu Raya 3, Sintang 3, Sekadau 3 | [S] |
| Sumatera: desa rawan dijangkau patroli (Jan–awal Mar 2026) | 80 desa | [S] |
| Enam provinsi prioritas nasional | Riau, Jambi, Sumsel, **Kalbar**, **Kalteng**, Kalsel | [S] |
| Nama desa per desa | **tidak dipublikasikan** | [T] |

**Jebakan yang ditemukan.** Dataset terbuka `data.kalbarprov.go.id` berjudul *"Jumlah Kecamatan dan Desa Rawan
Karhutla 2025"* (produsen BPBD Kalbar, diperbarui 20 Jan 2026) — setelah XLSX-nya diunduh dan dibaca,
**judul kolomnya berbunyi "RAWAN BANJIR"**, bukan karhutla. Isinya 355 desa/kelurahan dan 133 kecamatan rawan
banjir. **[P]** untuk isi berkas, **[T]** untuk daftar desa rawan karhutla.

**Konsekuensi produk.** Tidak ada daftar resmi desa rawan karhutla yang bisa dipakai sebagai daftar awal.
Ini **membenarkan** keputusan teknis: desa dipilih berdasarkan paparan satelit yang dihitung sendiri, bukan
berdasarkan daftar. Kalau juri menanyakan "kenapa tidak pakai daftar Kemenhut", jawabannya ada di sini:
daftar itu tidak publik, dan satu-satunya dataset terbuka provinsi yang berjudul karhutla ternyata banjir.

Angka 24 desa Kalbar bisa dipakai sebagai **sampel validasi**: kalau produk menandai desa-desa itu sebagai
terpapar tinggi, modelnya masuk akal.

---

## 4. Evaluasi program MPA — tidak ada evaluasi dampak, ada laporan capaian

| Indikator 2026 | Angka | Kelas |
|---|---|---|
| Target kelompok MPA Berkelanjutan | 500 kelompok | [S] |
| Terbentuk | **119 kelompok (23,8%)** | [S] |
| Dalam proses | 61 kelompok | [S] |
| Anggota pada 119 kelompok | 3.570 orang (±30/kelompok) | [S] |
| Proyeksi bila target tercapai | ±15.000 orang | [S] |
| Desa sasaran berikutnya | 320 desa | [S] |
| Desa yang mengalami bencana kebakaran setahun (Renstra Kemendesa) | **1.254 desa** | [S] |

**Yang tidak ada:** evaluasi apakah MPA menurunkan kejadian api. Tetap **[T]**. Yang ada hanya capaian
pembentukan kelembagaan — dan itu cukup untuk satu kalimat di halaman Data:
*"Program MPA mengukur pembentukan kelompok, bukan efeknya terhadap kebakaran."*

Catatan istilah: **DMPA** yang beredar umumnya *Desa **Makmur** Peduli Api* (program mitra/dunia usaha),
bukan "Desa Mandiri Peduli Api". Jangan menukar keduanya di dokumen.

---

## 5. Waktu respons — ada SLA normatif: 3 hari

**Prosedur Tetap Pengecekan Lapangan Informasi Titik Panas dan/atau Informasi Karhutla (KLHK), Pasal 9 ayat (6)**:
setiap hotspot wajib dicek di lapangan **paling lama 3 hari (±72 jam)** sejak terpantau satelit.

- Kelas kepercayaan hotspot: **tinggi 80–100%**, sedang 30–79%, rendah <30%.
- Prioritas pengecekan: confidence tinggi, **lokasi gambut**, kawasan konservasi, permukiman, perkebunan,
  hotspot mengelompok atau disertai asap.
- Penanggung jawab pengecekan tidak selalu Manggala Agni: bisa UPT KLHK, pemda, pemegang izin. **[S]**

**Batas pemakaian.** Ini **target normatif**, bukan pengukuran waktu aktual. Tidak ditemukan data
deteksi → tiba di lokasi. Jangan menulis "respons rata-rata X jam".

PDF Protap tidak dapat diunduh: `jdih.menlhk.go.id` mengembalikan koneksi gagal (000) pada dua URL
(`/new2/uploads/files/Untitled.pdf`, `/kiosk/files/P.8 (1).pdf`) per 9 Nov 2026. Kutipan berasal dari
ringkasan pencarian atas dokumen tersebut — **verifikasi ulang sebelum dikutip verbatim**.

---

## 6. Porsi APBDes untuk karhutla secara nasional — tetap kosong

Konfirmasi: tidak ada publikasi nasional jumlah desa/nilai anggaran karhutla APBDes 2026. Kemendesa mewajibkan
desa menetapkan fokus penggunaan Dana Desa di RKPDes/APBDes dan melaporkannya secara digital, **tetapi rekapan
publiknya tidak tersedia**. **[T]**

Penyebut yang tersedia bila nanti datanya ada: **75.266 desa** (basis data Kemendesa). Pembilangnya harus
diminta via **PPID Kemendesa / SIPEMANDU**, bukan ditebak. **[S]**

Satu-satunya angka per-desa tetap ilustrasi OKI 2026 (283 desa, Rp1,82 M, rata-rata **Rp6,42 juta/desa**)
dari ronde 1.

---

## 7. ID produk & harga e-katalog LKPP — tetap kosong, dan memang tidak publik

| Uji | Hasil |
|---|---|
| `katalog.inaproc.id/api/produk?keyword=…` | **404** — bukan endpoint publik |
| `katalog.inaproc.id/` | 200, aplikasi Next.js, harga dirender setelah login/pencarian klien |
| `data.lkpp.go.id/katalog-data` | **"0 data ditemukan"** — portal data tidak memuat katalog produk |

**Kesimpulan.** Harga e-katalog tidak dapat diverifikasi tanpa sesi pembeli. **[T]**
Yang dipakai tetap **SSH kabupaten/kota** (Sanggau TA 2026, Kediri 2025) — dan itu justru lebih jujur,
karena SSH adalah **harga satuan tertinggi** yang memang dipakai menyusun RAB desa.

---

## 8. Prakiraan kemarau 2027 — BMKG belum menerbitkan

Status per 9 Nov 2026 tidak berubah dari ronde 2: BMKG baru menerbitkan **prakiraan musim hujan 2026/2027**
dan **sinyal ENSO sampai awal 2027**; prakiraan musim kemarau 2027 belum ada. **[T]**

Yang boleh dikatakan: El Niño berpotensi bertahan sampai awal 2027; awal musim hujan mundur di 61,08% wilayah
dan durasinya lebih pendek di 51,90% wilayah. **Tidak boleh**: "kemarau 2027 akan ekstrem".

---

## 9. PDF resmi Perdirjen PPKL P-4/2021 — masih tidak diperoleh

| Jalur | Hasil |
|---|---|
| `jdih.menlhk.go.id` (2 varian path) | koneksi gagal (000) |
| `www.peraturan.go.id/files/perdirjen-ppkl-no-4-tahun-2021.pdf` | mengembalikan HTML, bukan PDF |
| `kemenlh.go.id/publikasi/detail/30` | halaman 200, tanpa tautan PDF (dimuat via JS) |
| Salinan pihak ketiga (Scribd/pdfcoffee) | tersedia, **tidak layak jadi rujukan** |

**Keputusan:** angka sumur bor (SBO-20 … SBO-40, Rp3,9–11,7 juta) tetap **kelas [S] lemah** dan **tidak masuk**
`harga_item.csv`. Alternatif sementara yang lebih kuat: pakai **≥25 titik sumur bor per kawasan** dari
Permen LHK 4/2024 sebagai target, dan biarkan desa mengisi harga sumur sendiri.

---

## 10. Keputusan satuan selang: **pakai `buah`, panjang jadi asumsi bertanda**

Pertanyaan: 50 buah (Pergub) vs rol 20 m (PRD). Rekomendasi: **satuan kanonik = `buah`, jangan meter.**

| Pilihan | Akibat |
|---|---|
| **`buah` (dipilih)** | Sesuai teks regulasi; skor dihitung hitung-ke-hitung, tanpa konversi; tidak ada angka karangan |
| `meter` | Regulasi tidak menyebut panjang → 50 × 20 = 1.000 m akan tampak seperti standar, padahal karangan tim |
| `rol` | "Rol" tidak ada di Pergub; hanya satuan jual di SSH, dan panjangnya bervariasi (20 m vs 30 m) |

**Cara pasang (empat aturan):**

1. Simpan `qty_total` dan `qty_functional` dalam **buah**, persis seperti Pergub.
2. Simpan `panjang_per_buah_m = 20` di tabel `meta` dengan label **`asumsi_tim`** dan sumber
   "rata-rata panjang roll di SSH Sanggau/Kediri (20 m)". Bukan `standar`.
3. Tampilkan `12 / 50 buah`, dan bila perlu keterangan kecil `(≈240 m pada asumsi 20 m/buah)` — angka meter
   **selalu** muncul sebagai turunan berlabel, tidak pernah sebagai target.
4. Harga tetap per **roll 20 m** di `harga_item.csv`, dengan `catatan` = "1 roll = 1 buah (asumsi panjang 20 m)".
   Kalau desa punya selang 30 m, isian `buah` tidak berubah; panjang total hanya indikator.

Alasan lapangan: MPA menghitung **gulung**, bukan mengukur meter. Meminta mereka mengisi meter berarti
meminta angka yang tidak bisa mereka verifikasi sendiri.

---

## 11. Status sembilan celah setelah ronde 3

| # | Celah | Status |
|---|---|---|
| 1 | Luas resmi pasca-Juli 2026 | **Sebagian** — kumulatif [T], snapshot BNPB tersedia |
| 2 | Pembagian gambut/mineral | **Tertutup 2020–2024 [P]**; 2025–2026 hanya MapBiomas [S] |
| 3 | Waktu respons nyata | **Sebagian** — SLA normatif 72 jam; pengukuran aktual [T] |
| 4 | Evaluasi Desa Mandiri Peduli Api | **Sebagian** — capaian pembentukan ada, evaluasi dampak [T] |
| 5 | Porsi APBDes nasional | **[T]** — hanya bisa lewat PPID/SIPEMANDU |
| 6 | PDF resmi Perdirjen P-4/2021 | **[T]** — semua jalur resmi gagal |
| 7 | ID e-katalog LKPP | **[T]** — tidak publik |
| 8 | Daftar resmi desa rawan | **[T]** untuk nama desa; angka agregat + 24 desa Kalbar ada |
| 9 | Prakiraan kemarau 2027 | **[T]** — BMKG belum terbit |

---

## 12. Tiga kalimat baru yang aman dipakai

1. "Pada 2023, luas terbakar gambut naik **8,9 kali** dibanding 2020, sementara lahan mineral hanya 3,5 kali —
   tahun ekstrem adalah tahun gambut (Statistik Kehutanan 2020–2024)."
2. "Tidak ada daftar resmi desa rawan karhutla yang terbuka; satu-satunya dataset provinsi yang berjudul begitu
   ternyata berisi kolom rawan banjir. Karena itu paparan kami hitung sendiri dari satelit."
3. "Target pengecekan hotspot di lapangan adalah 3 hari sejak terpantau satelit — bukan hitungan jam.
   Itulah jendela yang harus ditutup oleh kesiapan alat."
