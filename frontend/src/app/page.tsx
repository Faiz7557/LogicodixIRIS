import Link from "next/link";
import { connection } from "next/server";
import { KotakLahan } from "@/components/beranda/KotakLahan";
import { AngkaGulir } from "@/components/beranda/gerak/AngkaGulir";
import { EnamTahun } from "@/components/beranda/gerak/EnamTahun";
import { IntroLogo } from "@/components/beranda/gerak/IntroLogo";
import { GarisKontur } from "@/components/beranda/gerak/GarisKontur";
import { KartuSorot } from "@/components/beranda/gerak/KartuSorot";
import { LangkahGulir } from "@/components/beranda/gerak/LangkahGulir";
import { PenggerakGulir } from "@/components/beranda/gerak/PenggerakGulir";
import { PenutupAjakan } from "@/components/beranda/gerak/PenutupAjakan";
import { Kontur } from "@/components/beranda/Kontur";
import { Sorotan } from "@/components/beranda/Sorotan";
import { SearchBox } from "@/components/paparan/SearchBox";
import { LANGKAH, PERAN, STATISTIK } from "@/content/beranda";
import { getGerbang } from "@/lib/dataSource";
import { countTampakAman, getRiwayatJangkar } from "@/server/queries";
import { bolehTagline } from "@/lib/kalimat";

/*
 * Beranda / pengantar (App Flow v2 §3.1), bergaya hero dengan kartu pencarian mengambang.
 * Tagline hanya tampil bila gerbang data memutuskan `pertahankan`; angka "tampak aman" disembunyikan bila `buang`.
 */
export const instant = false;

export default async function BerandaPage() {
  await connection();
  const gerbang = await getGerbang().catch(() => "buang" as const);
  const tampakAman = gerbang === "buang" ? null : await countTampakAman().catch(() => null);
  // Riwayat satelit desa jangkar; DB uji atau DB lama: null, dan bagian kisah tidak dirender.
  const riwayatJangkar = await getRiwayatJangkar().catch(() => null);
  const kelasJudul = "text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl";

  return (
    <>
      <IntroLogo />
      <PenggerakGulir />
      {/* ---------- Hero (isi terangkat dan memudar saat digulir keluar) ---------- */}
      <section data-gulir="keluar" aria-labelledby="judul" className="relative isolate z-10 overflow-x-clip border-b border-line">
        <Kontur />
        <KotakLahan />
        <div className="hero-angkat mx-auto max-w-[1040px] px-4 pb-20 pt-10 text-center sm:pt-14">
          <h1
            id="judul"
            className="mx-auto max-w-[20ch] text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:max-w-[28ch] md:text-6xl"
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
            TetesPas membantu desa rawan karhutla di Kalimantan Barat dan Kalimantan Tengah melihat riwayat paparan dari deteksi satelit, mencatat alat yang benar-benar berfungsi, dan
            mengurutkan belanja kesiapan di bawah pagu kecil.
          </p>

          <div id="cari" className="mx-auto mt-8 max-w-[640px] scroll-mt-4 text-left">
            <SearchBox />
          </div>
        </div>
      </section>

      {/* ---------- Angka ---------- */}
      <section aria-label="Cakupan dalam angka" className="border-b border-line">
        <dl className="mx-auto grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 md:grid-cols-4">
          {STATISTIK.map((s, i) => (
            <AngkaGulir key={s.keterangan} angka={Number(s.angka)} label={s.label} keterangan={s.keterangan} urutan={i} />
          ))}
        </dl>
      </section>

      <GarisKontur />

      {/* ---------- Kenapa ---------- */}
      <section aria-labelledby="kenapa" className="mx-auto max-w-[1040px] px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p data-muncul className="text-sm font-bold text-ember">‹ Kenapa kesiapan perlu dihitung</p>
            <h2 data-muncul style={{ ["--tunda" as string]: "80ms" }} id="kenapa" className={`${kelasJudul} mt-3`}>
              Keputusan yang gagal dibuat saat tidak ada asap.
            </h2>
            <p data-muncul style={{ ["--tunda" as string]: "180ms" }} className="mt-4 text-muted">
              Di Desa Kalibandung, Kubu Raya, warga menyebut enam tahun tanpa kebakaran, sehingga pos karhutla tidak dianggarkan. Saat api datang pada
              2026, selang hanya 100 m dan warga patungan membeli BBM (Mongabay, 31 Agu 2026). Dana desa juga turun karena efisiensi. Ini satu kasus,
              bukan gambaran semua desa.
            </p>
            <p data-muncul style={{ ["--tunda" as string]: "260ms" }} className="mt-3 text-muted">
              TetesPas tidak memadamkan api. Alat ini membantu desa menyusun prioritas belanja dari data publik, dengan sumber yang ditulis terbuka.
            </p>
            <a
              data-muncul
              style={{ ["--tunda" as string]: "340ms" }}
              href="#cari"
              className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white"
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

      {/* ---------- Puncak: kisah warga dan deteksi satelit desa jangkar (disematkan, digulir) ---------- */}
      {riwayatJangkar ? <EnamTahun riwayat={riwayatJangkar} /> : null}

      {/* ---------- Cara kerja (panel naik seperti tirai, rel kemajuan mengikuti scroll) ---------- */}
      <div data-gulir="masuk" className="bg-paper">
        <section aria-labelledby="cara" className="tirai border-y border-line bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-14">
            <p data-muncul className="text-sm font-bold text-ember">‹ Cara kerja</p>
            <h2 data-muncul style={{ ["--tunda" as string]: "80ms" }} id="cara" className={`${kelasJudul} mt-3`}>
              Lima langkah, satu dokumen.
            </h2>
            <LangkahGulir langkah={LANGKAH} />
          </div>
        </section>
      </div>

      {/* ---------- Siapa memakai apa (kartu masuk dari tiga arah, sorotan mengikuti kursor) ---------- */}
      <section aria-labelledby="peran" className="mx-auto max-w-[1040px] px-4 py-14">
        <p data-muncul className="text-sm font-bold text-ember">‹ Untuk siapa</p>
        <h2 data-muncul style={{ ["--tunda" as string]: "80ms" }} id="peran" className={`${kelasJudul} mt-3`}>
          Keputusan tetap di tangan desa.
        </h2>
        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {PERAN.map((p, i) => (
            <KartuSorot key={p.peran} arah={(["kiri", "bawah", "kanan"] as const)[i % 3]} tunda={i * 120}>
              <h3 className="font-bold">{p.peran}</h3>
              <p className="mt-1 text-sm text-muted">{p.bisa}</p>
            </KartuSorot>
          ))}
        </ul>
      </section>

      {/* ---------- Ajakan akhir (panel melebar, bara, tombol bermagnet) ---------- */}
      <section aria-labelledby="mulai">
        <PenutupAjakan>
        <div className="mx-auto max-w-[1040px] px-4 py-20 text-center sm:py-24">
          <h2 data-muncul id="mulai" className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Mulai dari desa Anda.
          </h2>
          <p data-muncul style={{ ["--tunda" as string]: "100ms" }} className="mx-auto mt-3 max-w-[52ch] text-white/80">
            Paparan desa serta sumber dan batasan data bisa dilihat tanpa akun. Akun dipakai untuk mencatat alat dan menyusun usulan.
          </p>
          <div data-muncul style={{ ["--tunda" as string]: "200ms" }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a data-magnet href="#cari" className="inline-flex min-h-12 transition-transform duration-300 [transition-timing-function:var(--pegas)] items-center rounded-full bg-white px-6 font-semibold text-ink">
              Cari desa
            </a>
            <Link data-magnet href="/masuk" className="inline-flex min-h-12 transition-transform duration-300 [transition-timing-function:var(--pegas)] items-center rounded-full border border-white/60 px-6 font-semibold">
              Masuk
            </Link>
          </div>
          {gerbang !== "buang" ? (
            <p className="mx-auto mt-6 max-w-[52ch] text-sm text-white/70">
              Desa yang tampak aman di wilayah cakupan: <span className="tabular font-bold text-white">{tampakAman ?? "–"}</span> desa.
              Tampak aman bukan berarti aman.
            </p>
          ) : null}
        </div>
        </PenutupAjakan>
      </section>
    </>
  );
}
