# 04 — Design Brief: SiapKemarau

> Turunan dari [03_APP_FLOW.md](03_APP_FLOW.md). Bobot UI/UX 15%: kualitas antarmuka, kemudahan, dan alur.

## 1. Arah

**Buku kas desa yang jujur.** Tampil seperti catatan kerja yang rapi dan bisa dibawa ke musyawarah. Bukan command center gelap dengan peta menyala, karena produk ini tentang persiapan saat tidak ada asap.

| Terasa seperti | Tidak terasa seperti |
|---|---|
| Buku catatan, formulir yang ramah, papan pengumuman balai desa | Dashboard gelap, ruang kendali militer |
| Tenang, jelas, bisa dipercaya | Alarmis, api di mana-mana |
| Angka besar dengan kalimat manusia | Tabel padat tanpa kesimpulan |

Prinsip: **setiap layar punya satu kesimpulan dalam satu kalimat, lalu buktinya.**

## 2. Konteks pengguna

| Kondisi | Keputusan desain |
|---|---|
| HP Android kelas bawah, layar 360 px | Mobile-first, satu kolom, tanpa hover |
| Dipakai di luar ruangan | Tema terang saja, kontras tinggi |
| Sinyal lemah | Halaman ringan, status simpan selalu terlihat |
| Bukan orang teknis | Bahasa sehari-hari, tanpa singkatan yang tidak dijelaskan |
| Dibawa ke rapat | Dokumen cetak harus rapi di A4 |

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

Nada: langsung dan menghormati desa. Jangan menyalahkan: tulis "Belum ada pos untuk BBM", bukan "Desa lalai".

Label status:

| Nilai | Teks | Ikon |
|---|---|---|
| `siap` | Siap | Centang |
| `sebagian` | Sebagian siap | Setengah lingkaran |
| `rawan` | Rawan | Segitiga peringatan |

## 4. Token

Definisikan sebagai CSS variable di `src/app/globals.css`, lalu petakan ke Tailwind.

```css
:root {
  --paper: #FBF7F0;
  --surface: #FFFFFF;
  --line: #E4DACB;
  --ink: #2A211A;
  --muted: #6B5D50;
  --ember: #B4431A;   /* aksi utama dan penanda paparan */
  --water: #1F5F7A;   /* tautan dan informasi */
  --ok: #2F6B45;
  --warn: #8A5A00;
  --danger: #A32020;
  --radius: 8px;
}
```

Rasio kontras terhadap `--paper`, dihitung saat penulisan dokumen: `--ember` 5,2, `--water` 6,6, `--ok` 5,9, `--warn` 5,5, `--danger` 7,0, `--muted` 5,9. Semua lolos AA untuk teks normal. Periksa ulang pada kombinasi selain `--paper`.

Aturan warna: `--ember` tidak dipakai sebagai latar luas. Status selalu berupa ikon dan teks, bukan warna saja.

## 5. Tipografi

| Peran | Font | Ukuran di HP |
|---|---|---|
| Antarmuka | Public Sans (`next/font/google`) | 16 px dasar |
| Judul layar | Public Sans 700 | 24 px |
| Kalimat kesimpulan | Public Sans 600 | 20 px |
| Angka besar | Public Sans 700, `tabular-nums` | 48 px |
| Dokumen cetak | Source Serif 4 | 11 pt |

Teks minimum 14 px. Baris maksimum sekitar 65 karakter.

## 6. Tata letak

- Lebar konten maksimum 720 px, kecuali Time Machine 1040 px.
- Skala jarak 4, 8, 12, 16, 24, 32, 48 px.
- Tepi 16 px di HP.
- Target sentuh minimum 44 px.
- Navigasi bawah di HP sesudah masuk. Di laptop menjadi navigasi atas.
- Tidak ada kartu di dalam kartu.

## 7. Komponen

Tanpa pustaka komponen. Hanya ini yang dibuat:

| Komponen | Spesifikasi |
|---|---|
| `YearStrip` | Satu baris sel 2012-2026. Sel terpapar berwarna `--ember` dengan tanda titik. Tahun ekstrem memiliki garis bawah dan label. Punya `aria-label` berisi ringkasan teks |
| `ReadinessGauge` | Busur setengah lingkaran SVG, angka di tengah, status di bawah. Animasi masuk maksimal 400 ms, nonaktif pada `prefers-reduced-motion` |
| `CoverageBar` | Batang horizontal dengan teks `2 dari 6 rol` |
| `Stepper` | Tombol minus, input angka, tombol plus |
| `PriorityRow` | Urutan, aksi, item, biaya, alasan, tombol keputusan |
| `StatusBadge` | Ikon dan teks |
| `AssumptionNote` | Teks kecil "Asumsi" dengan tautan ke `/data` |
| `DemoBanner` | Pita atas untuk akun demo |
| `MiniMap` | MapLibre, satu poligon. Jika latar peta gagal, poligon tetap tampil di latar polos |

## 8. Layar kunci

**Kesiapan Desa (hero), HP**

```text
┌──────────────────────────────┐
│ [Akun demonstrasi: data uji] │
│ Desa ...                     │
│                              │
│        ╭───────────╮         │
│        │    42     │         │
│        ╰───────────╯         │
│        ◐ Sebagian siap       │
│                              │
│ Selang keluar paling genting:│
│ 2 dari 6 rol.                │
│                              │
│ Terdeteksi 3 dari 4 tahun    │
│ kering ekstrem. Lihat bukti >│
│ ──────────────────────────── │
│ Selang keluar  ██░░░░  2/6   │
│ Pompa jinjing  ███░░░  1/2   │
│ Sumur bor      █░░░░░  2/10  │
│ ...                          │
│ [   Susun prioritas   ]      │
├──────────────────────────────┤
│ Kesiapan  Alat Prioritas Usulan│
└──────────────────────────────┘
```

Angka pada sketsa hanya contoh tata letak.

**Kartu Paparan**: kalimat utama di atas, `YearStrip` sebagai bukti. Label "Tampak aman" harus menjadi momen visual terkuat di halaman publik.

**Time Machine**: tombol "Buka 2026" adalah satu-satunya momen dramatis di produk. Transisi titik muncul bertahap, maksimal 800 ms.

**Dokumen cetak**: tanpa navigasi, tanpa warna latar, kop sederhana, tabel berbingkai tipis, kolom tanda tangan, footer sumber data. Satu halaman jika memungkinkan.

## 9. Gerak

Secukupnya: transisi nilai gauge dan batang saat pagu berubah, 200-400 ms, `ease-out`. Tidak ada partikel api, parallax, atau animasi latar. Semua menghormati `prefers-reduced-motion`.

## 10. Keadaan wajib

Setiap layar data punya keadaan memuat (skeleton sederhana), kosong dengan arahan berikutnya, dan galat dengan tombol coba lagi. Teks persisnya ada di App Flow bagian 3.

## 11. Aksesibilitas

| Hal | Ketentuan |
|---|---|
| Kontras | Minimal AA |
| Keyboard | Semua kontrol bisa dijangkau, fokus terlihat |
| Label | Semua input memiliki `label` |
| Grafik | SVG punya ringkasan teks |
| Pesan galat | Dekat isian, memakai `aria-live` |
| Status | Tidak hanya warna |

## 12. Daftar periksa desain

- [ ] 360 px tanpa gulir horizontal.
- [ ] Setiap layar punya satu kalimat kesimpulan.
- [ ] Istilah bahasa Inggris pada bagian 3 tidak muncul.
- [ ] Setiap asumsi punya tautan ke `/data`.
- [ ] Banner demo muncul pada akun demo.
- [ ] Dokumen cetak rapi pada A4.
- [ ] Teks AI memiliki badge.
- [ ] Tidak ada "hektare terselamatkan".
