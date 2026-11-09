# Panduan Frontend: SiapKemarau

> Turunan dari [03_APP_FLOW.md](03_APP_FLOW.md) dan [04_DESIGN_BRIEF.md](04_DESIGN_BRIEF.md). Prioritas saat ini: **UX dulu, UI kemudian**.

## 1. Stack

Next.js 16 (App Router, `cacheComponents` aktif), React 19, Tailwind CSS 4, TypeScript, Vitest.

Next.js 16 berbeda dari versi lama. Baca dokumentasi yang dibundel di `node_modules/next/dist/docs/` sebelum memakai API yang belum pernah dipakai di repo ini.

## 2. Struktur

```text
src/app/
  page.tsx                          Beranda
  desa/[kode]/page.tsx              Kartu Paparan (publik)
  desa/[kode]/(akun)/layout.tsx     Banner demo + navigasi desa
  desa/[kode]/(akun)/{kesiapan,inventaris,prioritas,usulan}/
  time-machine/  data/  masuk/
src/components/
  layout/   SiteHeader, BottomNav, DemoBanner
  ui/       PageState, StatusBadge, AssumptionNote, AiBadge, Placeholder
src/lib/
  types.ts        kontrak data dengan backend (TRD §6, skema §3)
  format.ts       Rupiah, angka, tanggal WIB
  api-client.ts   fetch untuk Client Component, galat { error: { kode, pesan } }
src/mocks/        data contoh sintetis, DIHAPUS sebelum code freeze
```

`(akun)` adalah route group: tidak muncul di URL, hanya memberi layout bersama.

## 3. Pola halaman

Dengan `cacheComponents`, data runtime (`params`, `cookies`, kueri DB) dibaca di dalam `<Suspense>`. Fallback-nya adalah keadaan memuat yang memang wajib ada.

```tsx
export default function Page({ params }: PageProps<"/desa/[kode]">) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Isi params={params} />
    </Suspense>
  );
}
async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const data = await getDesaCard(kode);   // dari lib backend
  if (!data) notFound();
  return <KartuPaparan data={data} />;
}
```

- Server Component untuk tampilan baca. `"use client"` hanya untuk bagian interaktif: cari, stepper, pagu, keputusan, tombol Buka 2026, cetak.
- Client Component memanggil API lewat `api()` di `lib/api-client.ts`.

## 4. Definisi selesai per layar

- [ ] Satu kalimat kesimpulan di atas, lalu buktinya.
- [ ] Keadaan memuat, kosong (dengan arahan), dan galat (dengan Coba lagi).
- [ ] Layak di lebar 360 px tanpa gulir horizontal, target sentuh minimal 44 px.
- [ ] Bisa dipakai dengan keyboard, fokus terlihat, input berlabel, grafik punya ringkasan teks.
- [ ] Status berupa ikon + teks, bukan warna saja.
- [ ] Istilah sesuai Design Brief §3, tidak ada "hektare terselamatkan".
- [ ] Commit dengan awalan `feat`/`fix`/`style`/`refactor`/`docs`/`chore`.

## 5. Bahasa

| Hindari | Pakai |
|---|---|
| Hotspot, kebakaran (untuk data) | Deteksi satelit |
| Risk score | Tingkat paparan |
| Readiness | Kesiapan |
| Inventory | Alat |
| Budget | Pagu |
| Generate | Susun atau terbitkan |
| Model memprediksi | Riwayat menunjukkan |

## 6. Token

Warna di `src/app/globals.css`, tersedia sebagai kelas Tailwind: `bg-paper`, `bg-surface`, `border-line`, `text-ink`, `text-muted`, `bg-ember`/`text-ember`, `text-water`, `text-ok`, `text-warn`, `text-danger`, `rounded-card`. Font: `font-sans` (Public Sans), `font-serif` (Source Serif 4, untuk cetak). Kelas `.tabular` untuk angka, `.no-print` untuk elemen yang disembunyikan saat cetak.

## 7. 3D (setelah semua P0 hidup)

Rencana: 3D hanya di tempat yang menambah makna, dimuat malas, dengan cadangan 2D.

- Beranda: medan Kalimantan Barat dan Tengah dengan kolom deteksi per tahun.
- Time Machine: momen Buka 2026.

Aturan: tidak memblokir isi halaman, mati otomatis pada `prefers-reduced-motion` dan perangkat lemah, tetap jalan tanpa internet. Design Brief §9 melarang partikel api dan animasi latar.

## 8. Sebelum code freeze

- [ ] Hapus `src/mocks/` dan `components/ui/Placeholder.tsx`; semua halaman membaca data nyata.
- [ ] Ganti akun demo di `(akun)/layout.tsx` dengan akun dari sesi.
- [ ] Daftar periksa Design Brief §12.
