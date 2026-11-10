import Link from "next/link";
import { Kontur } from "@/components/beranda/Kontur";
import { Sorotan } from "@/components/beranda/Sorotan";
import { SearchBox } from "@/components/paparan/SearchBox";
import { TEKS_BELUM_DIUJI } from "@/components/ui/PernyataanAsumsi";
import { LANGKAH, PERAN, STATISTIK } from "@/content/beranda";
import { getGerbang } from "@/lib/dataSource";
import { countTampakAman } from "@/server/queries";
import { bolehTagline } from "@/lib/kalimat";

/*
 * Beranda / pengantar (App Flow v2 §3.1), bergaya hero dengan kartu pencarian mengambang.
 * Tagline hanya tampil bila gerbang data memutuskan `pertahankan`; angka "tampak aman" disembunyikan bila `buang`.
 * Teks wajib: "Berbasis data publik, belum diuji pengguna." (Design Brief v2 §12).
 */
export default async function BerandaPage() {
  const gerbang = await getGerbang();
  const tampakAman = gerbang === "buang" ? null : await countTampakAman();
  const kelasJudul = "text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl";

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section aria-labelledby="judul" className="relative isolate overflow-hidden border-b border-line">
        <Kontur />
        <div className="mx-auto max-w-[1040px] px-4 pb-14 pt-10 text-center sm:pt-14">
          <p className="mx-auto inline-flex max-w-full items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-1.5 text-left text-sm font-semibold shadow-sm sm:rounded-full">
            <span aria-hidden="true" className="size-2 rounded-full bg-warn" />
            {TEKS_BELUM_DIUJI}
          </p>

          <h1
            id="judul"
            className="mx-auto mt-5 max-w-[20ch] text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:max-w-[28ch] md:text-6xl"
          >
            Susun belanja kesiapan desa{" "}
            <span
              aria-hidden="true"
              className="mx-1 inline-flex h-[0.8em] w-[1.45em] translate-y-[0.06em] items-center justify-center rounded-full bg-ember align-baseline"
            >
              <svg className="h-[0.5em] w-[0.5em]" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2.500c3.200 4 6 7.100 6 10.700a6 6 0 0 1-12 0C6 9.600 8.800 6.500 12 2.500z" />
              </svg>
            </span>{" "}
            sebelum musim kering tiba.
          </h1>

          {bolehTagline(gerbang) ? (
            <p className="mt-3 text-lg font-semibold italic text-ember">Enam tahun tanpa api bukan berarti aman.</p>
          ) : null}

          <p className="mx-auto mt-4 max-w-[56ch] text-muted">
            SiapKemarau membantu desa rawan karhutla melihat riwayat paparan dari deteksi satelit, mencatat alat yang benar-benar berfungsi, dan
            mengurutkan belanja kesiapan di bawah pagu kecil.
          </p>

          <div id="cari" className="mx-auto mt-8 max-w-[640px] scroll-mt-4 text-left">
            <SearchBox />
          </div>
        </div>
      </section>

      {/* ---------- Angka ---------- */}
      <section aria-label="Cakupan dalam angka" className="border-b border-line">
        <dl className="mx-auto grid max-w-[1040px] grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 md:grid-cols-4">
          {STATISTIK.map((s) => (
            <div key={s.keterangan}>
              <dt className="sr-only">{s.keterangan}</dt>
              <dd>
                <span className="tabular text-4xl font-semibold tracking-tight">{s.angka}</span>
                <span className="ml-1.5 text-sm font-semibold uppercase tracking-wide text-muted">{s.label}</span>
                <span className="mt-1 block text-sm leading-snug text-muted" aria-hidden="true">
                  {s.keterangan}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Kenapa ---------- */}
      <section aria-labelledby="kenapa" className="mx-auto max-w-[1040px] px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-sm font-bold text-ember">‹ Kenapa kesiapan perlu dihitung</p>
            <h2 id="kenapa" className={`${kelasJudul} mt-3`}>
              Keputusan yang gagal dibuat saat tidak ada asap.
            </h2>
            <p className="mt-4 text-muted">
              Di Desa Kalibandung, Kubu Raya, enam tahun tanpa api membuat pos karhutla tidak dianggarkan. Saat api datang pada 2026, selang hanya 100 m
              dan warga patungan membeli BBM (Mongabay, 31 Agu 2026). Dana desa juga turun karena efisiensi. Ini satu kasus, bukan gambaran semua desa.
            </p>
            <p className="mt-3 text-muted">
              SiapKemarau tidak memadamkan api. Alat ini membantu desa menyusun prioritas belanja dari data publik, dengan asumsi yang ditulis terbuka.
            </p>
            <a
              href="#cari"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white"
            >
              Periksa desa Anda
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <Sorotan />
        </div>
      </section>

      {/* ---------- Cara kerja ---------- */}
      <section aria-labelledby="cara" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[1040px] px-4 py-14">
          <p className="text-sm font-bold text-ember">‹ Cara kerja</p>
          <h2 id="cara" className={`${kelasJudul} mt-3`}>
            Lima langkah, satu dokumen.
          </h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-5">
            {LANGKAH.map((l, i) => (
              <li key={l.judul} className="rounded-2xl border border-line bg-paper p-4">
                <span aria-hidden="true" className="tabular flex size-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-bold">{l.judul}</h3>
                <p className="mt-1 text-sm text-muted">{l.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Siapa memakai apa ---------- */}
      <section aria-labelledby="peran" className="mx-auto max-w-[1040px] px-4 py-14">
        <p className="text-sm font-bold text-ember">‹ Untuk siapa</p>
        <h2 id="peran" className={`${kelasJudul} mt-3`}>
          Keputusan tetap di tangan desa.
        </h2>
        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {PERAN.map((p) => (
            <li key={p.peran} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-bold">{p.peran}</h3>
              <p className="mt-1 text-sm text-muted">{p.bisa}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Ajakan akhir ---------- */}
      <section aria-labelledby="mulai" className="border-t border-line bg-ink text-white">
        <div className="mx-auto max-w-[1040px] px-4 py-12 text-center">
          <h2 id="mulai" className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Mulai dari desa Anda.
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-white/80">
            Paparan, Time Machine, serta sumber dan batasan data bisa dilihat tanpa akun. Akun dipakai untuk mencatat alat dan menyusun usulan.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#cari" className="inline-flex min-h-12 items-center rounded-full bg-white px-6 font-semibold text-ink">
              Cari desa
            </a>
            <Link href="/masuk" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 font-semibold">
              Masuk
            </Link>
            <Link href="/time-machine" className="inline-flex min-h-12 items-center px-3 font-semibold underline underline-offset-4">
              Lihat Time Machine
            </Link>
          </div>
          {gerbang !== "buang" ? (
            <p className="mx-auto mt-6 max-w-[52ch] text-sm text-white/70">
              Desa yang tampak aman di wilayah cakupan: <span className="tabular font-bold text-white">{tampakAman ?? "–"}</span> desa.
              Tampak aman bukan berarti aman.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
