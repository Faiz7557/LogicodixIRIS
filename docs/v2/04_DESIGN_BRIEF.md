# 04 — Design Brief: SiapKemarau v2

> Turunan dari [03_APP_FLOW.md](03_APP_FLOW.md). Bobot UI/UX 15%. Pemilik implementasi: Orang 2 untuk alur desa, Orang 1 untuk halaman publik. Token dan komponen dipakai bersama.

## 1. Arah

**Buku kas desa yang jujur.** Tampil seperti catatan kerja rapi yang bisa dibawa ke musyawarah.

| Terasa seperti | Tidak terasa seperti |
|---|---|
| Buku catatan, formulir ramah, papan pengumuman balai desa | Dashboard gelap, ruang kendali |
| Tenang, jelas, bisa dipercaya | Alarmis, api di mana-mana |
| Angka besar dengan kalimat manusia | Tabel padat tanpa kesimpulan |

Prinsip: **setiap layar punya satu kesimpulan dalam satu kalimat, lalu buktinya.**

## 2. Konteks pengguna

Asumsi dari sumber sekunder, belum diuji pengguna.

| Kondisi | Keputusan desain |
|---|---|
| HP Android kelas bawah, 360 px | Mobile-first, satu kolom, tanpa hover |
| Dipakai di luar ruangan | Tema terang, kontras tinggi |
| Sinyal lemah | Halaman ringan, status simpan selalu terlihat |
| Bukan orang teknis | Bahasa sehari-hari |
| Dibawa ke rapat | Dokumen cetak rapi di A4 |

## 3. Bahasa

| Hindari | Pakai |
|---|---|
| Hotspot | Deteksi satelit |
| Risk score | Tingkat paparan |
| Readiness | Kesiapan |
| Inventory | Alat |
| Budget | Pagu |
| Generate | Susun atau terbitkan |
| Model memprediksi | Riwayat menunjukkan |
| Target standar | Paket minimum |
| Rol | Buah |
| Tervalidasi | Belum diuji pengguna |

Nada langsung dan menghormati desa. Tulis "Belum ada pos untuk selang", bukan "Desa lalai".

| Nilai | Teks | Ikon |
|---|---|---|
| `siap` | Siap | Centang |
| `sebagian` | Sebagian siap | Setengah lingkaran |
| `rawan` | Rawan | Segitiga peringatan |

## 4. Token

Definisikan sebagai CSS variable di `src/app/globals.css`, lalu petakan ke Tailwind.

```css
:root {
  --paper: #f5f4f1;
  --surface: #ffffff;
  --surface-2: #faf9f7;
  --line: rgb(30 26 20 / 0.1);
  --line-2: rgb(30 26 20 / 0.22);
  --ink: #16171a;
  --muted: #47474a;
  --faint: #6f6f73;
  --ember: #b4431a;
  --ember-soft: #fde8da;
  --water: #2650a8;
  --water-soft: #e9effc;
  --ok: #177340;
  --ok-soft: #e4f4ea;
  --warn: #855a00;
  --warn-soft: #fdf3da;
  --danger: #a52c1b;
  --danger-soft: #fcebe7;
  --radius: 10px;
  --r-panel: 20px;
}
```

Periksa kontras AA pada setiap kombinasi yang dipakai. `--ember` tidak dipakai sebagai latar luas. Status selalu berupa ikon dan teks.

## 5. Tipografi

| Peran | Font | Ukuran di HP |
|---|---|---|
| Antarmuka | Geist, `next/font/google` | 16 px dasar |
| Judul layar | Geist 700 | 24 px |
| Kalimat kesimpulan | Geist 600 | 20 px |
| Angka besar | Geist 700, `tabular-nums` | 48 px |
| Dokumen cetak | Source Serif 4 | 11 pt |

Teks minimum 14 px. Baris maksimum sekitar 65 karakter.

## 6. Tata letak

- Lebar konten maksimum 720 px, kecuali Time Machine 1040 px.
- Skala jarak 4, 8, 12, 16, 24, 32, 48 px.
- Tepi 16 px di HP. Target sentuh minimum 44 px.
- Navigasi bawah di HP sesudah masuk, navigasi atas di laptop.
- Tidak ada kartu di dalam kartu.

## 7. Komponen

Tanpa pustaka komponen.

| Komponen | Spesifikasi | Pemilik |
|---|---|---|
| `YearStrip` | Satu baris sel 2012-2026, sel terpapar `--ember` dengan titik, tahun ekstrem bergaris bawah, `aria-label` berisi ringkasan | Orang 1 |
| `MiniShape` (P1) | SVG satu poligon dari `geom_json` | Orang 1 |
| `MetricTable` | Tabel metrik per tahun uji, pemenang bertanda teks | Orang 1 |
| `ReadinessGauge` | Busur SVG, angka di tengah, status di bawah, animasi maksimal 400 ms | Orang 2 |
| `CoverageBar` | Batang dengan teks `3 dari 10 buah` | Orang 2 |
| `Stepper` | Minus, input angka, plus | Orang 2 |
| `PaguControl` | Penggeser dan kotak Rupiah, jeda 300 ms | Orang 2 |
| `PriorityRow` | Urutan, aksi, item, biaya, sumber, alasan, tombol keputusan | Orang 2 |
| `StatusBadge` | Ikon dan teks | Orang 2 |
| `AssumptionNote` | Teks kecil "Asumsi tim" dengan tautan ke `/data` | Orang 2 |
| `DemoBanner` | Pita atas akun demo | Orang 2 |

## 8. Layar kunci

**Kesiapan Desa, HP**

```text
┌──────────────────────────────┐
│ [Akun demonstrasi: data uji] │
│ Desa ...                     │
│        ╭───────────╮         │
│        │    65     │         │
│        ╰───────────╯         │
│        ◐ Sebagian siap       │
│ Selang keluar paling genting:│
│ 3 dari 10 buah.              │
│ Terdeteksi 2 dari 4 tahun    │
│ kering ekstrem. Lihat bukti >│
│ ──────────────────────────── │
│ Selang keluar ██░░░░░  3/10  │
│ Pompa jinjing ███████  1/1   │
│ Asumsi tim: paket minimum  > │
│ [   Susun prioritas   ]      │
├──────────────────────────────┤
│ Kesiapan  Alat Prioritas Usulan│
└──────────────────────────────┘
```

Angka pada sketsa hanya contoh tata letak.

**Prioritas.** Perubahan skor sekarang menuju skor sesudah adalah momen utama alur desa.

**Kartu Paparan.** Kalimat utama di atas, `YearStrip` sebagai bukti.

**Time Machine.** Tombol "Buka 2026" adalah satu-satunya momen dramatis. Transisi maksimal 800 ms.

**Dokumen cetak.** Tanpa navigasi dan warna latar, kop sederhana, tabel tipis, tanda tangan, footer sumber data, dan pernyataan asumsi.

## 9. Gerak

Transisi nilai 200-400 ms, `ease-out`. Tidak ada partikel api, parallax, atau animasi latar. Semua menghormati `prefers-reduced-motion`.

## 10. Keadaan wajib

Setiap layar data punya keadaan memuat, kosong dengan arahan, dan galat dengan tombol coba lagi. Teks persisnya ada di App Flow bagian 3.

## 11. Aksesibilitas

| Hal | Ketentuan |
|---|---|
| Kontras | Minimal AA |
| Keyboard | Semua kontrol bisa dijangkau, fokus terlihat |
| Label | Semua input memiliki `label` |
| Grafik | SVG punya ringkasan teks |
| Pesan galat | Dekat isian, memakai `aria-live` |
| Status | Tidak hanya warna |

## 12. Daftar periksa

- [ ] 360 px tanpa gulir horizontal.
- [ ] Setiap layar punya satu kalimat kesimpulan.
- [ ] Istilah pada bagian 3 konsisten.
- [ ] Setiap asumsi punya tautan ke `/data`.
- [ ] Banner demo muncul pada akun demo.
- [ ] "Belum diuji pengguna" muncul di Beranda dan Data.
- [ ] Dokumen cetak rapi pada A4 dan memuat pernyataan asumsi.
- [ ] Teks AI memiliki badge.
- [ ] Tidak ada "hektare terselamatkan".

## 13. Adopsi bahasa visual Sparekit

Bahasa visual proyek Sparekit (CALIBER 2026) diadopsi sebagai keputusan desain yang ditulis ulang. Tidak ada berkas yang disalin dari proyek lain. Keputusan yang dikunci:

| No | Keputusan | Akibat |
|---|---|---|
| D6 | Nama token Tailwind tidak berubah (`paper`, `surface`, `line`, `ink`, `muted`, `ember`, `water`, `ok`, `warn`, `danger`). Nilainya disetel, lalu ditambah pasangan `-soft` | Seluruh layar ikut berubah tanpa menyentuh komponen |
| D7 | Font antarmuka Geist lewat `next/font/google`. Dokumen cetak tetap Source Serif 4 | Menggantikan Public Sans di §5 |
| D8 | Tombol utama memakai tinta (`bg-ink`, teks putih). `--ember` hanya untuk penanda paparan dan sorotan | Brief §4: ember bukan latar luas |

Unsur Sparekit yang ditolak (dari `docs/v2/07_AUDIT.md` §6.1):

- Aksen `#d9480f`. Kontras 4,30 di atas putih, gagal AA untuk teks. `--ember #b4431a` tetap.
- Teks 11,5 sampai 13,5 px. Brief menetapkan minimum 14 px dan dasar 16 px.
- 3D three.js, latar mesh, dan kartu berpendar. Brief §9 melarang animasi latar.
- Radix, lucide, motion, recharts, dan clsx. Tanpa pustaka komponen; ikon SVG sebaris dan transisi CSS.
- Asisten AI, tur, alih bahasa, dan PWA. Di luar cakupan PRD §10.

Navigasi samping di laptop disahkan untuk halaman berakun.

Tidak ada berkas yang disalin dari proyek lain.
