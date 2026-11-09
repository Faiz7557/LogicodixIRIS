# `papers/` — README untuk Agent

Folder ini adalah **sumber bukti eksternal** untuk mengisi celah data dan menopang klaim produk.
Isinya **bukan** dokumen produk (itu di `docs/`, `reports/`, `research_notes/` — jangan diubah dari sini).

Kalau kamu agent yang baru masuk: baca file ini dulu, lalu `literature_review.md`. **Jangan** mulai dari PDF.

---

## 1. Urutan baca

| # | Berkas | Kapan dipakai |
|---|---|---|
| 1 | `README.md` (ini) | Selalu, pertama |
| 2 | `literature_review.md` | Mencari paper/fakta ilmiah. **SSOT** — 24 paper + 6 regulasi, tiap baris memuat klaim yang didukung dan batasnya |
| 3 | `00_CELAH_DATA.md` | Harga, Permendesa 2026, jumlah MPA, alokasi desa (contoh OKI) |
| 4 | `01_DATA_RONDE2.md` | Kelayakan pipeline (sensor, batas desa), standar MPA, SIPADES/SONGKET/IPB, ENSO 2027 |
| 5 | `02_DATA_RONDE3.md` | Gambut/mineral resmi 2020–2024, desa rawan, SLA 72 jam, **keputusan satuan selang** |
| 6 | `<kategori>/<Kode>_*.md` | Butuh kutipan verbatim. Halaman dipisah `## Page N` |
| 7 | `<kategori>/<Kode>_*.pdf` | **Hanya** kalau angkanya tidak ada di transkrip |

---

## 2. Aturan yang mengikat

1. **Jangan membaca PDF mentah untuk mencari fakta.** Pakai tabel di `literature_review.md` atau transkrip `.md`. Tujuannya menjaga konteks dan mencegah salah kutip.
2. **Jangan mengutip tanpa DOI + tahun.** Semua DOI di registry berasal dari respons OpenAlex, bukan ingatan.
3. **Setiap klaim di dokumen produk → satu baris registry.** Kalau tidak ada barisnya, klaim itu belum punya bukti.
4. **Baca abstrak sebelum mengutip** (minimal), dan tandai status baca di registry (`abstrak`, `abstrak + hasil`, `metadata`).
5. **Hormati kelas bukti** yang dipakai di dokumen celah data:
   - `[P]` primer — PDF resmi terunduh atau API resmi dipanggil.
   - `[S]` sekunder — situs resmi/berita, halaman tidak diarsipkan.
   - `[T]` tidak ditemukan — **tulis apa adanya, jangan ditebak**.
6. **Jangan mengubah** `docs/`, `reports/`, `research_notes/`. Kalau data baru membantah isi dokumen itu, tulis temuannya di sini dan serahkan ke pemilik repo.
7. **Angka yang beda definisi tidak dijumlahkan.** SiPongi (kumulatif, Landsat), BNPB (snapshot operasional), dan MapBiomas (paruh bakar) adalah tiga hal berbeda.

---

## 3. Cari apa di mana

| Pertanyaan | Berkas / bagian |
|---|---|
| Harga pompa, selang, APD, solar | `00_CELAH_DATA.md` §2 + `regulasi/Harga_02_*` (SSH Sanggau TA 2026, hlm. 174–175, 22–23) |
| Dasar hukum karhutla di Dana Desa | `00_CELAH_DATA.md` §3 + `regulasi/Regulasi_01_*` hlm. 13 |
| Dasar hukum TA 2027 | **Belum ada.** Pakai rumusan netral, lihat `00_CELAH_DATA.md` §3 |
| Target sarana MPA per regu | `01_DATA_RONDE2.md` §4 + `regulasi/Regulasi_03_*` (Pasal 8, 17–20, 26) |
| Satuan selang (buah vs meter) | `02_DATA_RONDE3.md` §10 — **kanonik: `buah`** |
| Gambut vs mineral per provinsi 2020–2024 | `data/karhutla_gambut_mineral_2020_2024.csv` |
| Status sensor VIIRS pasca S-NPP | `01_DATA_RONDE2.md` §1 |
| Batas desa & vintage | `01_DATA_RONDE2.md` §2 |
| Kalender APBDes | `01_DATA_RONDE2.md` §3 |
| Prior art (SIPADES, SONGKET, IPB) | `01_DATA_RONDE2.md` §5 |
| Bukti "tahun tenang menipu" | `literature_review.md` → `Paparan_08` (Santika 2020) |
| Kenapa kesiapan, bukan prediksi | `Paparan_03`, `Paparan_04`, `Aksi_02` |
| Metode prioritas di bawah pagu | `Alokasi_01`–`Alokasi_03` |
| Metrik backtest | `Metode_02` (PR vs ROC) |

---

## 4. Status kelengkapan

- **24 paper**: 22 bertranskrip, 2 metadata saja (`Paparan_02` Nature Geoscience berbayar, `Kesiapan_04` IOP diblokir Cloudflare).
- **6 dokumen** regulasi/harga di `regulasi/`, semuanya bertranskrip.
- **1 dataset** CSV hasil API resmi.
- **`incoming_paper_manifest.json`** — 30 entri, memuat DOI, SHA-256, lisensi, jalur transkrip.

### Masih kosong (jangan ditebak)

| Celah | Cara menutup |
|---|---|
| Luas resmi 2026 pasca-Juli | tunggu SiPongi; sementara pakai snapshot BNPB dengan label |
| Pembagian gambut/mineral 2025–2026 | hanya MapBiomas; resmi berhenti 2024 |
| Waktu respons aktual | tidak ada publikasi; yang ada SLA normatif 72 jam |
| Evaluasi dampak MPA | tidak ada; hanya capaian pembentukan kelompok |
| Porsi APBDes nasional karhutla | PPID Kemendesa / SIPEMANDU |
| PDF Perdirjen PPKL P-4/2021 | semua jalur resmi gagal per 9 Nov 2026 |
| ID produk e-katalog LKPP | butuh sesi pembeli; `katalog.inaproc.id` API 404, portal data 0 dataset |
| Nama desa rawan karhutla | tidak publik; pakai paparan satelit + 24 desa patroli Kalbar sebagai validasi |
| Prakiraan kemarau 2027 | BMKG belum terbit |

---

## 5. Konvensi berkas

```
papers/
├── README.md                     # ini
├── literature_review.md          # registry SSOT
├── 00_CELAH_DATA.md              # ronde 1
├── 01_DATA_RONDE2.md             # ronde 2
├── 02_DATA_RONDE3.md             # ronde 3
├── incoming_paper_manifest.json
├── data/karhutla_gambut_mineral_2020_2024.csv
├── konteks_paparan/   deteksi_satelit/   kesiapan_komunitas/
├── alokasi_anggaran/  perilaku_dan_aksi/ konteks_desa/  metode/
└── regulasi/                     # regulasi + standar harga
```

- Nama berkas: `<Kode>_<Author>_<Tahun>_<Judul ringkas>.pdf` dan pasangannya `.md`.
- Setiap transkrip diawali header: `Source PDF`, `Original upload filename`, `Source PDF SHA-256`, `Extraction method`, `Pages`.
- Isi transkrip: teks asli PDF, dipisah `## Page N`, dalam blok ` ```text `.

## 6. Regenerasi

```bash
uv run python scripts/fetch_papers.py           # idempoten, melewati berkas yang sudah ada
uv run python scripts/fetch_papers.py --force   # unduh ulang semua
```

Skrip butuh `pdftotext`, `pdftoppm`, `tesseract` (fallback OCR bila lapisan teks PDF kosong).
Sumber: OpenAlex → Unpaywall → URL alternatif per DOI. Yang gagal ditandai `metadata_only` di manifest,
bukan dipalsukan.

## 7. Jebakan yang sudah tercatat (jangan diulang)

| Jebakan | Bukti |
|---|---|
| `peraturan.bpk.go.id/Download/<id>` menyajikan **dokumen salah** meski HTTP 200 + `%PDF` | 3/3 percobaan (Permendesa → Pergub NTT; Perda Kalbar → Perwali Balikpapan; Pergub Kalbar → Perbup Mappi) |
| Dataset Kalbar berjudul "desa rawan karhutla" ternyata berkolom **"rawan banjir"** | XLSX `data.kalbarprov.go.id`, 355 desa/kelurahan |
| "Rol 20 m" bukan satuan standar, hanya satuan jual | Pergub Kalteng Pasal 19 menulis "selang 50 buah" |
| S-NPP berhenti 2 Nov 2026, arsip tidak digantikan | NOAA/FIRMS |
| Jangan gabung seri sensor tanpa penanda | kolom `satellite` = `N` / `N20` / `N21` |

## 8. Ukuran

Total ±67 MB; lima PDF >5 MB (Atwood 10 MB, ProbFire 7,5 MB, Vadrevu 7,3 MB, Santika 7,3 MB, SSH Sanggau 6,9 MB).
Kalau repo ingin diringankan, hapus PDF dan pertahankan `.md` — transkrip memuat seluruh teks.
