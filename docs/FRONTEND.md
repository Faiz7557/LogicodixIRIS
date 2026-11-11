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

Aturan kerja: frontend **hanya mengonsumsi tipe di `src/lib/types.ts`**. Server Component membaca data nyata lewat `src/lib/dataSource.ts`, yang meneruskan ke `src/server/*`. Client Component memakai `src/lib/api-client.ts`. Tidak ada data contoh di `src/mocks/`; folder itu sudah dihapus.

## 2. Hal yang perlu disepakati dengan tim

1. **Mesin, login, dan API** sudah dikerjakan di `src/server/` dan `src/app/api/`. Layar desa memakai hasilnya; perubahan kontrak harus lewat `types.ts` dan TRD §8.
2. **Struktur repo.** Kode web ada di `frontend/`, bukan di akar. Konsekuensi: alamat DB lokal `file:../data/dev.db` (data uji) atau `file:../data/siapkemarau.db` (keluaran pipeline), perintah dijalankan dari `frontend/`, dan route handler ada di `frontend/src/app/api/`.
3. **Pemilik halaman publik** (Beranda, Kartu Paparan, Time Machine, Data) adalah Orang 1. Token dan komponen dipakai bersama, jadi koordinasikan `YearStrip`, `MetricTable`, `MiniShape`.
4. **Usulan kontrak** (ditandai di `types.ts`): `DesaCard.gerbang` agar label "Tampak aman" dan tagline bisa disembunyikan sesuai keputusan gerbang.
5. **Isi repo.** Jobdesk §7 meminta hanya `docs/v2/` yang masuk repo, sedangkan `papers/`, `reports/`, `research_notes/`, dan `docs/v1/` masih ada. Penghapusan belum diputuskan; lihat `docs/v2/07_AUDIT.md` §7 butir 1.
6. **Trailer commit.** Jobdesk menyarankan commit tanpa `Co-Authored-By`.

## 3. Status layar

Semua layar membaca DB nyata lewat `src/lib/dataSource.ts` dan `src/server/*`. Data uji berasal dari `data/dev.db` yang dibuat `scripts/dev-db.ts`; bukan dari `src/mocks/`, karena folder itu sudah dihapus.

| Path | Layar | FR | Pemilik | Status |
|---|---|---|---|---|
| `/` | Beranda / pengantar (hero, kartu pencarian, angka, alasan, cara kerja, peran) | FR-01 | Orang 1 | dibangun; pencarian memanggil `/api/desa`, angka dari definisi produk |
| `/desa/[kode]` | Kartu Paparan | FR-02, FR-03 | Orang 1 | dibangun dari `getDesaCard`; 404 bila kode tidak ada |
| `/time-machine` | Time Machine | FR-04 | Orang 1 | dibangun dari `getBacktest` di server; kosong bila pipeline belum mengisi tabel backtest |
| `/data` | Data dan Asumsi | FR-05 | Orang 1 | dibangun dari `getDataPage` di server |
| `/masuk` | Masuk | FR-06 | Orang 2 | dibangun dengan sesi nyata (`POST /api/auth/masuk`) |
| `/desa/[kode]/kesiapan` | Kesiapan Desa (hero) | FR-10 | Orang 2 | dibangun dari `computeReadiness` di server |
| `/desa/[kode]/inventaris` | Catat Alat | FR-07 | Orang 2 | dibangun; simpan lewat `PUT /api/desa/[kode]/inventaris`. Tempel pesan FR-19 belum disambungkan ke UI |
| `/desa/[kode]/prioritas` | Prioritas dan keputusan | FR-09, FR-11–FR-13 | Orang 2 | dibangun; `rankPriorities` dihitung server, pagu dan keputusan tersimpan |
| `/desa/[kode]/usulan` | Daftar dan terbitkan | FR-15 | Orang 2 | dibangun; daftar memakai cursor `?limit=&cursor=` |
| `/desa/[kode]/usulan/[id]` | Dokumen dan cetak A4 | FR-15, FR-16 | Orang 2 | dibangun; fakta dibekukan saat terbit, narasi masih template |

Akun demo dibuat di DB dengan `scripts/seed-accounts.ts`: `demo-mpa` (peran `mpa`) dan `demo-sekdes` (peran `desa`). Password diambil dari `DEMO_PASSWORD` di `frontend/.env`. Login menulis cookie `sk_sesi`; tanpa sesi halaman berakun diarahkan ke `/masuk`.

Alur lengkap yang bisa dicoba: Beranda (cari) → Kartu Paparan → Masuk → Kesiapan → Catat Alat → Prioritas (ubah pagu, setujui) → Usulan (pilih tujuan, terbitkan) → Dokumen (cetak).

### Data uji lokal

```bash
cd frontend
cp .env.example .env        # isi DEMO_PASSWORD
npx tsx scripts/dev-db.ts   # membuat ../data/dev.db
npx tsx scripts/seed-accounts.ts --desa TINGGI
npm run dev
```

`scripts/dev-db.ts` membaca `db/schema.sql` dan `data/manual/*.csv`, lalu membuat 25 desa uji. Nama desa memuat "Uji" dan bisa dicari dengan kata "uji", mis. `TINGGI`, `KOSONG`, `NONGAMBUT`, dan `KALIBANDUNG`. Skor dan riwayatnya sintetis, bukan desa nyata.

DB ini diabaikan git. Setiap anggota tim membuatnya sendiri, dan akun demo hanya ada di komputer masing-masing.

Catatan: route `POST /api/desa/[kode]/inventaris/parse` sudah hidup (Claude, lalu 9router, lalu parser deterministik), tetapi formulir Catat Alat belum memanggilnya. `generateNarrative` juga belum memanggil model; dokumen usulan memakai template.

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
  api/                                route handler tipis: zod, auth, server/*, Response.json
  layout.tsx, globals.css             token dan font (Public Sans, Source Serif 4 untuk cetak)
  page.tsx, time-machine/, data/      publik (Orang 1)
  desa/[kode]/page.tsx                Kartu Paparan (Orang 1)
  desa/[kode]/(akun)/                 layout bersama: sidebar NavAkun (laptop) / menu bawah (HP) + DemoBanner
    kesiapan/ inventaris/ prioritas/ usulan/ usulan/[id]/
  masuk/
src/components/
  layout/   SiteHeader, NavAkun, DemoBanner
  ui/       PageState, StatusBadge, AssumptionNote, AiBadge, PernyataanAsumsi
src/server/
  auth.ts db.ts http.ts queries.ts    sesi, klien libSQL, error, query berparameter
  inventaris.ts efektif.ts kesiapan.ts prioritas.ts usulan.ts
  narasi.ts parseInventaris.ts audit.ts
src/lib/
  types.ts        kontrak data (TRD v2 §6, §8; Schema v2 §3)
  format.ts       Rupiah, angka, tanggal WIB, keteranganMeter
  api-client.ts   fetch untuk Client Component, galat { error: { kode, pesan } }
  dataSource.ts   jembatan Server Component ke server/*
  engine/         readiness.ts, priority.ts (fungsi murni)
src/test/         testDb.ts, buildTestDb.ts, fixtures.ts
scripts/          dev-db.ts, seed-accounts.ts
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
4. Masuk dengan sesi nyata dan sambungkan API sudah selesai; `mocks/` dan `Placeholder` sudah dihapus.
5. Poles: keadaan galat, aksesibilitas, daftar periksa Design Brief §12.
6. P1 bila waktu ada: tempel pesan (FR-19), label kestabilan di `PriorityRow`.

Urutan potong bila waktu habis: tempel pesan, label kestabilan, FR-03, `MiniShape`.

## 10. 3D

Ditunda. TRD v2 menetapkan "tanpa dependensi tambahan" dan peta SVG tanpa pustaka; Design Brief melarang animasi latar, parallax, dan partikel; video demo dan penilaian menekankan layar nyata. 3D baru dipertimbangkan setelah semua P0 hidup, dan hanya untuk momen Buka 2026 di Time Machine (milik Orang 1) dengan cadangan 2D. Pastikan dulu dengan teman satu tim.

## 11. Sebelum code freeze

- [x] Hapus `src/mocks/` dan `components/ui/Placeholder.tsx`; semua layar membaca data nyata lewat `server/*`.
- [x] Akun demo di `(akun)/layout.tsx` memakai sesi nyata dari `getSesiAkun`.
- [ ] Daftar periksa Design Brief v2 §12.

## 12. Beranda (pengantar)

Mengacu pada gambar referensi landing page: hero dengan pil status, judul besar dengan chip bulat, kartu pencarian mengambang, latar bergaya topografi, kartu pratinjau, baris angka, kartu bento "alasan", lalu cara kerja.

- Kode: `src/app/page.tsx`, `src/components/beranda/` (`Kontur`, `KartuContoh`, `Sorotan`), isi di `src/content/beranda.ts`.
- Latar kontur murni SVG dan diam (Design Brief melarang animasi latar). Titik hiasan hanya tampil di layar lebar.
- Kartu pratinjau dan angka "65,3 → 70,7" diberi label "Contoh tampilan" / "Contoh data uji", karena bukan data desa nyata.
- Empat angka (15 tahun, 4 tahun ekstrem, 2 provinsi, 4 item) berasal dari definisi produk di PRD v2, bukan hasil pengukuran. Jangan menambah angka dampak atau jumlah pengguna tanpa sumber.
- Tagline hanya tampil bila gerbang data `pertahankan`; teks "Berbasis data publik, belum diuji pengguna." selalu tampil.
