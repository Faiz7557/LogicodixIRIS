# Panduan UI/UX: SiapKemarau v2

> Pemilik: Orang 2 (peran dikerjakan sebagai **UI/UX**). Sumber spesifikasi: `docs/v2/` (Jobdesk, PRD, TRD, App Flow, Design Brief, Schema, Rencana). Jika ada pertentangan, Jobdesk menang.

## 1. Batas ranah

Jobdesk memberi Orang 2 peran APP dan UI. Pada tim ini, **yang dikerjakan di dokumen ini hanya UI/UX**. Sisanya tetap tugas Orang 2 di atas kertas, tetapi dikerjakan orang lain atau belum diputuskan (lihat §2).

| Dikerjakan di sini (UI/UX) | Bukan di sini |
|---|---|
| Halaman dan alur layar di `src/app/**/page.tsx`, layout, navigasi | Route handler `src/app/api/**` |
| Komponen: `ReadinessGauge`, `CoverageBar`, `Stepper`, `PaguControl`, `PriorityRow`, `StatusBadge`, `AssumptionNote`, `DemoBanner`, `NavAkun` | Mesin `src/lib/engine/` (kesiapan, prioritas, kestabilan) |
| Token, tipografi, tata letak, gerak, aksesibilitas, mode cetak A4 | Autentikasi, sesi, otorisasi, DB, skema, seed akun |
| Keadaan memuat, kosong, galat; teks antarmuka; validasi sisi klien | Validasi zod dan aturan di server |
| Tampilan dokumen usulan dan tombol cetak | `narasi.ts`, `usulan.ts` (isi teks dan fakta) |
| Kerangka pemanggil API sisi klien (`api-client.ts`) | Deploy, video, README, pipeline Python |

Aturan kerja: frontend **hanya mengonsumsi tipe di `src/lib/types.ts`**. Selama API belum ada, pakai data contoh di `src/mocks/`.

## 2. Hal yang perlu disepakati dengan tim

1. **Siapa mengerjakan mesin, login, dan API** (Task 9–12, 14–16 bagian server). Layar saya bergantung pada hasilnya.
2. **Struktur repo.** TRD §11 menaruh `src/` dan `package.json` di akar repo `LogicodixIRIS`. Saat ini kode ada di `frontend/`. Konsekuensi: alamat DB `file:data/siapkemarau.db`, perintah `npm ci && npm run build && npm start`, dan tempat `app/api`.
3. **Pemilik halaman publik** (Beranda, Kartu Paparan, Time Machine, Data) adalah Orang 1. Token dan komponen dipakai bersama, jadi koordinasikan `YearStrip`, `MetricTable`, `MiniShape`.
4. **Usulan kontrak** (ditandai di `types.ts`): `DesaCard.gerbang` agar label "Tampak aman" dan tagline bisa disembunyikan sesuai keputusan gerbang.
5. **Isi repo.** Jobdesk §7: hanya `docs/v2/` yang masuk repo. `papers/`, `reports/`, `research_notes/`, dan `docs/` lama harus dikeluarkan sebelum push pertama.
6. **Trailer commit.** Jobdesk menyarankan commit tanpa `Co-Authored-By`.

## 3. Status layar

Semua layar sudah dibangun dengan data contoh (`src/mocks/`). Ranah: UI/UX saya (Orang 2) untuk alur desa; halaman publik adalah milik Orang 1, dibuat di sini agar gambaran utuh dan bisa diserahkan.

| Path | Layar | FR | Pemilik | Status |
|---|---|---|---|---|
| `/` | Beranda / pengantar (hero, kartu pencarian, angka, alasan, cara kerja, peran) | FR-01 | Orang 1 | dibangun, mengacu referensi landing page; angka dari definisi produk, bukan hasil ukur |
| `/desa/[kode]` | Kartu Paparan | FR-02, FR-03 | Orang 1 | dibangun (YearStrip, MiniShape) |
| `/time-machine` | Time Machine | FR-04 | Orang 1 | dibangun (**angka contoh**) |
| `/data` | Data dan Asumsi | FR-05 | Orang 1 | dibangun (isi dari dokumen v2) |
| `/masuk` | Masuk | FR-06 | Orang 2 | dibangun (akun tiruan) |
| `/desa/[kode]/kesiapan` | Kesiapan Desa (hero) | FR-10 | Orang 2 | dibangun |
| `/desa/[kode]/inventaris` | Catat Alat | FR-07 | Orang 2 | dibangun (tempel pesan FR-19 belum) |
| `/desa/[kode]/prioritas` | Prioritas dan keputusan | FR-09, FR-11–FR-13 | Orang 2 | dibangun (mesin tiruan; label kestabilan FR-14 belum) |
| `/desa/[kode]/usulan` | Daftar dan terbitkan | FR-15 | Orang 2 | dibangun |
| `/desa/[kode]/usulan/[id]` | Dokumen dan cetak A4 | FR-15, FR-16 | Orang 2 | dibangun (templat tiruan, badge AI) |

Akun contoh: halaman Masuk mengisi cookie `mock-peran`. Masuk sebagai `demo-mpa` untuk melihat tampilan ketua MPA, `demo-sekdes` untuk sekdes. Tanpa cookie, layar berakun memakai akun sekdes.

Alur lengkap yang bisa dicoba: Beranda (cari) → Kartu Paparan → Masuk → Kesiapan → Catat Alat → Prioritas (ubah pagu, setujui) → Usulan (pilih tujuan, terbitkan) → Dokumen (cetak).

### Menguji keadaan tanpa backend

`src/lib/dataSource.ts` adalah satu-satunya pintu data sementara. Kode desa khusus membuka tiap keadaan UX:

| URL | Keadaan |
|---|---|
| `/desa/contoh/kesiapan` | Normal (Kalbar, sebagian siap) |
| `/desa/kalteng/kesiapan` | Memuat keterangan Pergub (pembanding) |
| `/desa/kosong/kesiapan` | Belum ada inventaris (Catat alat dulu) |
| `/desa/sebagian/kesiapan` | Sebagian terisi (label Belum lengkap) |
| `/desa/lambat/kesiapan` | Keadaan memuat (2 detik) |
| `/desa/galat/kesiapan` | Keadaan galat (Coba lagi) |
| `/desa/tampakaman` | Kartu dengan label Tampak aman |
| `/desa/takpernah` | Kartu tanpa deteksi (bukan jaminan aman) |
| `/desa/gagal-simpan/inventaris` | Halaman normal, tombol Simpan gagal (isian tetap ada, tombol Coba lagi) |
| `/desa/kosong/inventaris` | Formulir kosong, belum pernah disimpan |
| `/desa/apa-saja/kesiapan` | 404 |

Saat backend siap, ganti isi `dataSource.ts` dan hapus `src/mocks/`. Penyimpanan inventaris lewat `src/lib/inventarisApi.ts`: ganti bagian "CONTOH SEMENTARA" dengan pemanggilan `PUT /api/desa/[kode]/inventaris` yang sudah tersedia dalam komentar.

Catatan pengujian: panel pratinjau tidak memberi fokus papan ketik, sehingga `blur` tidak terpicu. Galat per isian yang muncul saat meninggalkan kolom perlu dicoba sekali di browser biasa.

Catatan Next.js 16: berkas `error.tsx` menerima fungsi pemulih bernama `retry` (bukan `reset`).

## 4. Perubahan v2 yang wajib tercermin di UI

- **Satu paket minimum**, bukan tier: dana operasi 1 minggu, pompa jinjing 1, selang 10 buah, sumur bor 5 titik (hanya desa bergambut). Label "Asumsi tim", bukan "target standar".
- **Dana operasi** hanya satu stepper (`punyaRusak = false`). Item lain: stepper total dan berfungsi.
- **Selang** tampil `3 / 10 buah` dengan keterangan `≈60 m pada asumsi 20 m per buah` (`keteranganMeter` di `format.ts`). Meter selalu turunan, tidak pernah target. Istilah "rol" tidak dipakai.
- **Pagu** default Rp15.000.000, penggeser 0 sampai Rp100.000.000. Perubahan skor sekarang menuju skor sesudah adalah momen utama alur desa.
- **Keterangan provinsi** di Kesiapan: Kalteng memuat angka Pergub 35/2025 (pompa jinjing 3, selang 50 buah, pompa punggung 10 per regu); Kalbar menampilkan "Kalimantan Barat belum memiliki angka alat per regu pada Pergub 56/2025".
- **Teks wajib** (konstanta di `components/ui/PernyataanAsumsi.tsx`): "belum diuji pengguna" di Beranda dan Data; pernyataan asumsi di dokumen usulan; dasar APBDes ditulis sebagai ketentuan yang berlaku pada Tahun Anggaran 2027.
- **Dihapus dari cakupan:** draf offline (P2), hitung mundur musim (P2), peta MapLibre (diganti SVG dari `geom_json`).

## 5. Kata yang dilarang

Dilarang di UI, dokumen cetak, dan kode di `src/`: "hektare terselamatkan", "tervalidasi", "Empirical Bayes", "berdasarkan Permendesa 16/2025" untuk 2027, dan pasal Permendagri 20/2018 (belum dibaca dari teks resmi). Task 22 akan memeriksa `src/`.

Bahasa antarmuka mengikuti Design Brief v2 §3: Deteksi satelit (bukan hotspot), Tingkat paparan, Kesiapan, Alat, Pagu, Susun/terbitkan, Riwayat menunjukkan, Paket minimum, Buah, Belum diuji pengguna. Nada menghormati desa: "Belum ada pos untuk dana operasi", bukan "Desa lalai".

## 6. Struktur kode

Semua path relatif terhadap `frontend/`.

```text
src/app/
  layout.tsx, globals.css             token dan font (Public Sans, Source Serif 4 untuk cetak)
  page.tsx, time-machine/, data/      publik (Orang 1)
  desa/[kode]/page.tsx                Kartu Paparan (Orang 1)
  desa/[kode]/(akun)/                 layout bersama: sidebar NavAkun (laptop) / menu bawah (HP) + DemoBanner
    kesiapan/ inventaris/ prioritas/ usulan/ usulan/[id]/
  masuk/
src/components/
  layout/   SiteHeader, NavAkun, DemoBanner
  ui/       PageState, StatusBadge, AssumptionNote, AiBadge, PernyataanAsumsi, Placeholder
src/lib/
  types.ts        kontrak data (TRD v2 §6, §8; Schema v2 §3)
  format.ts       Rupiah, angka, tanggal WIB, keteranganMeter
  api-client.ts   fetch untuk Client Component, galat { error: { kode, pesan } }
src/mocks/        data contoh sintetis, DIHAPUS sebelum code freeze
```

`(akun)` adalah route group: tidak muncul di URL, hanya memberi layout bersama.

## 7. Pola halaman (Next.js 16, `cacheComponents` aktif)

Data runtime (`params`, cookie, kueri DB) dibaca di dalam `<Suspense>`; fallback-nya adalah keadaan memuat yang memang wajib ada. `params` berupa Promise.

```tsx
export default function Page({ params }: PageProps<"/desa/[kode]/kesiapan">) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Isi params={params} />
    </Suspense>
  );
}
```

Server Component untuk tampilan baca. `"use client"` hanya untuk bagian interaktif (stepper, pagu, keputusan, cetak). Client Component memanggil API lewat `api()`. Baca `frontend/node_modules/next/dist/docs/` sebelum memakai API Next.js yang belum pernah dipakai.

## 8. Definisi selesai per layar

- [ ] Satu kalimat kesimpulan di atas, lalu buktinya.
- [ ] Keadaan memuat, kosong (dengan arahan), dan galat (dengan Coba lagi), teks sesuai App Flow v2 §3.
- [ ] Layak di 360 px tanpa gulir horizontal, target sentuh minimal 44 px.
- [ ] Keyboard: fokus terlihat, input berlabel, galat dekat isian dengan `aria-live`, grafik punya ringkasan teks.
- [ ] Status berupa ikon dan teks, bukan warna saja.
- [ ] Setiap asumsi punya tautan ke `/data`.
- [ ] Tidak ada kata terlarang (§5).
- [ ] Commit dengan awalan `feat`/`fix`/`style`/`refactor`/`docs`/`chore`.

## 9. Urutan kerja yang disarankan

Mengikuti jadwal Jobdesk (Kam 12 Nov: Task 14–16) dan aturan potong 13 Nov pukul 20.00.

1. Komponen inti dengan data contoh: `ReadinessGauge`, `CoverageBar`, `Stepper`, `PaguControl`, `PriorityRow`.
2. Kesiapan (hero), lalu Catat Alat.
3. Prioritas dengan keputusan, lalu Usulan dan Dokumen cetak A4.
4. Masuk, sambungkan API nyata begitu tersedia, hapus `mocks/` dan `Placeholder`.
5. Poles: keadaan galat, aksesibilitas, daftar periksa Design Brief §12.
6. P1 bila waktu ada: tempel pesan (FR-19), label kestabilan di `PriorityRow`.

Urutan potong bila waktu habis: tempel pesan, label kestabilan, FR-03, `MiniShape`.

## 10. 3D

Ditunda. TRD v2 menetapkan "tanpa dependensi tambahan" dan peta SVG tanpa pustaka; Design Brief melarang animasi latar, parallax, dan partikel; video demo dan penilaian menekankan layar nyata. 3D baru dipertimbangkan setelah semua P0 hidup, dan hanya untuk momen Buka 2026 di Time Machine (milik Orang 1) dengan cadangan 2D. Pastikan dulu dengan teman satu tim.

## 11. Sebelum code freeze

- [ ] Hapus `src/mocks/` dan `components/ui/Placeholder.tsx`; semua layar membaca data nyata.
- [ ] Ganti akun demo di `(akun)/layout.tsx` dengan akun dari sesi.
- [ ] Daftar periksa Design Brief v2 §12.

## 12. Beranda (pengantar)

Mengacu pada gambar referensi landing page: hero dengan pil status, judul besar dengan chip bulat, kartu pencarian mengambang, latar bergaya topografi, kartu pratinjau, baris angka, kartu bento "alasan", lalu cara kerja.

- Kode: `src/app/page.tsx`, `src/components/beranda/` (`Kontur`, `KartuContoh`, `Sorotan`), isi di `src/content/beranda.ts`.
- Latar kontur murni SVG dan diam (Design Brief melarang animasi latar). Titik hiasan hanya tampil di layar lebar.
- Kartu pratinjau dan angka "65,3 → 70,7" diberi label "Contoh tampilan" / "Contoh data uji", karena bukan data desa nyata.
- Empat angka (15 tahun, 4 tahun ekstrem, 2 provinsi, 4 item) berasal dari definisi produk di PRD v2, bukan hasil pengukuran. Jangan menambah angka dampak atau jumlah pengguna tanpa sumber.
- Tagline hanya tampil bila gerbang data `pertahankan`; teks "Berbasis data publik, belum diuji pengguna." selalu tampil.
