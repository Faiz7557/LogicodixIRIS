# Hasil Gerbang Data dan Riwayat Desa Jangkar

Sumber: [`pipeline/run_output.txt`](../../pipeline/run_output.txt), keluaran jalan pertama pipeline dengan data nyata. Dokumen ini tidak memuat angka baru; semua angka disalin dari berkas itu. Ambang gerbang ada di `pipeline/params.py` dan tidak diubah sesudah data dibuka.

## Data

| Hal | Nilai |
|---|---|
| Sumber deteksi | VIIRS S-NPP, NASA FIRMS |
| Arsip standar (SP) | sampai 2026-07-31 |
| Near real time (NRT) | 2026-08-01 sampai 2026-11-02 |
| Data akhir 2026 | 2026-11-02 |

## Uji A: desa "tampak aman" tetap terdeteksi pada 2026

Desa "tampak aman" adalah desa yang pernah terdeteksi pada tahun kering ekstrem, tetapi tenang beberapa tahun terakhir.

- Laju terdeteksi 2026 pada desa tampak aman: **0,638** (190 dari 298 desa).
- Pembanding, desa tanpa riwayat ekstrem: **0,114**.
- Uji ini lulus di **4 dari 4** kuartil luas desa.

## Uji B: desa tampak aman dibanding desa aktif

- Laju desa tampak aman **0,638** dibanding ambang **0,6 × 0,940** (0,940 adalah laju desa aktif).
- Lulus.

## Keputusan

`{"a": true, "b": true, "keputusan": "pertahankan"}`

Tagline "Enam tahun tanpa api bukan berarti aman" boleh dipakai, dan label "Tampak aman" tetap tampil.

## Riwayat desa jangkar: Kali Bandung

Kali Bandung, Kecamatan Sungai Raya, Kabupaten Kubu Raya (HDX `6112070019`). Di beranda desa ini ditulis "Kalibandung", mengikuti Mongabay. `n_det` adalah jumlah deteksi satelit di desa dan penyangga 2 km; `det_days` adalah jumlah hari yang memuat deteksi.

| Tahun | n_det | det_days | Terpapar |
|---|---:|---:|---|
| 2012 | 48 | 19 | ya |
| 2013 | 46 | 25 | ya |
| 2014 | 141 | 39 | ya |
| 2015 | 214 | 31 | ya |
| 2016 | 17 | 9 | ya |
| 2017 | 7 | 5 | ya |
| 2018 | 61 | 15 | ya |
| 2019 | 61 | 13 | ya |
| 2020 | 2 | 2 | ya |
| 2021 | 15 | 4 | ya |
| 2022 | 0 | 0 | tidak |
| 2023 | 0 | 0 | tidak |
| 2024 | 7 | 4 | ya |
| 2025 | 7 | 6 | ya |
| 2026 | 365 | 42 | ya |

## Kesaksian warga dan deteksi satelit

Menurut warga (Mongabay, 31 Agu 2026), Kali Bandung melewati enam tahun tanpa kebakaran sebelum 2026. Satelit mencatat deteksi kecil di empat dari enam tahun itu: paling banyak 15 deteksi setahun, dan hanya 2022 serta 2023 yang benar-benar tanpa deteksi. Keduanya tidak sama, karena titik satelit tidak selalu berarti api yang dirasakan warga, dan deteksi satelit bukan luas terbakar. Kami tidak memilih salah satu. Beranda menampilkan kesaksian warga dan batang deteksi satelit berdampingan, dan 2026 (365 deteksi) terlihat jelas di keduanya.
