# 00 — Keputusan dan Jobdesk: SiapKemarau v2

> Status: 10 November 2026. Set `docs/v2/` menggantikan seluruh `docs/00` sampai `docs/06`. Jika ada pertentangan, dokumen ini menang.

## 1. Satu kalimat

**SiapKemarau membantu desa rawan karhutla melihat riwayat paparan dari deteksi satelit, mencatat alat yang benar-benar berfungsi, dan mengurutkan belanja kesiapan di bawah pagu kecil, sebelum musim kering tiba.**

Tagline kerja: *"Enam tahun tanpa api bukan berarti aman."* Tagline hanya boleh dipakai jika gerbang data pada TRD bagian 5 memberi keputusan `pertahankan`.

## 2. Keputusan terkunci

| Keputusan | Pilihan |
|---|---|
| Fokus produk | Prioritas belanja di bawah pagu |
| Rute penanggung biaya | Tidak dibuat. FR-15 tetap memakai empat kanal |
| Target skor | Satu paket minimum satu musim, berlabel asumsi tim. Tier target dihapus |
| Target Pergub Kalteng 35/2025 | Keterangan pembanding, hanya untuk desa Kalteng |
| Bukti | Data publik dan sekunder saja. Tanpa wawancara |
| Klaim produk | "Alat bantu menyusun prioritas dari data publik, belum diuji pengguna" |
| Cakupan data | Kalimantan Barat dan Kalimantan Tengah |
| Sensor | VIIRS S-NPP sampai 2 Nov 2026, dengan penanda sumber SP atau NRT |
| Kategori lomba | Web. Subtema: Civic Tech & Community Service, cadangan Green Environment |
| Tim | 2 orang |

## 3. Yang tidak boleh diklaim

- "Hektare terselamatkan" atau efek belanja kesiapan terhadap luas terbakar.
- "Tervalidasi pengguna", "dipakai desa", atau "setiap fitur berguna".
- Target paket minimum sebagai standar yang mengikat desa.
- "Berdasarkan Permendesa 16/2025" untuk tahun anggaran 2027.
- Pasal Permendagri 20/2018 sebelum teks resminya dibaca.
- Kesimpulan bahwa desa tanpa deteksi berarti aman.

## 4. Pembagian peran

| | Orang 1: DATA dan BUKTI | Orang 2: APP dan UI |
|---|---|---|
| Tanggung jawab | Akses data, pipeline Python, gerbang, Time Machine, halaman publik, narasi AI, README | Repo, mesin TypeScript, autentikasi, alur desa, dokumen usulan, deploy, video |
| Fitur | FR-01 sampai FR-05, FR-14, FR-16 | FR-06 sampai FR-13, FR-15, FR-19 |
| Task wajib | 0, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19 | 1, 9, 10, 11, 12, 13, 14, 15, 16 |
| Task P1 | 20 | 21 |
| Task bersama | 22 dan 23 | 22 dan 23 |

Rincian tiap task ada di [06_IMPLEMENTATION_PLAN.md](06_IMPLEMENTATION_PLAN.md).

## 5. Titik serah-terima

| Kapan | Dari | Ke | Yang diserahkan |
|---|---|---|---|
| Sel 10 Nov malam | Orang 1 | Orang 2 | `db/schema.sql` dan `data/manual/*.csv` di branch `main` |
| Kam 12 Nov siang | Orang 1 | Orang 2 | `data/siapkemarau.db` hasil pipeline nyata dan keputusan gerbang |
| Kam 12 Nov malam | Orang 2 | Orang 1 | Login demo dan `getKesiapan` untuk diuji |
| Jum 13 Nov malam | Orang 1 | Orang 2 | `generateNarrative` siap dipanggil dari usulan |
| Sab 14 Nov 12.00 | Keduanya | | Commit final dan deployment untuk video |

## 6. Jadwal

| Tanggal | Orang 1 | Orang 2 |
|---|---|---|
| Sel 10 Nov | Task 0, 2, 3 | Task 1, 10, 11 |
| Rab 11 Nov | Task 4, 5, 6, 7 | Task 9, 12, 13 |
| Kam 12 Nov | Task 8 (**gerbang, paling lambat siang**), 17 | Task 14, 15, 16 |
| Jum 13 Nov | Task 18, 19, 20 | Task 16 lanjutan, 21, Task 22 langkah deploy |
| Sab 14 Nov | Task 22, 23 | Task 22, 23. **Submit target 20.00 WIB** |

**Aturan potong.** Pukul 20.00 tanggal 13 November, berhenti menambah fitur. Potong dari bawah: Task 21, lalu Task 20, lalu FR-03, lalu `MiniMap`. Task 19 (narasi AI) dipotong paling akhir karena rubrik menilai AI sebagai nilai tambah.

## 7. Aturan kerja berdua

- Commit kecil dan berkala dari akun GitHub masing-masing.
- Dilarang force push, rebase, squash, dan bulk upload di akhir.
- Saran: commit tanpa trailer `Co-Authored-By`, karena semua commit wajib berasal dari akun anggota terdaftar. Penggunaan AI diungkap di README.
- Hanya `docs/v2/` yang disalin ke repo. PDF di `papers/`, `reports/`, `research_notes/`, dan arsip lain tetap di luar repo.
- Pertanyaan aturan lomba dikirim tertulis ke Helpdesk, karena klarifikasi hanya sah lewat kanal resmi.
