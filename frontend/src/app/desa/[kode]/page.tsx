import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MiniShape } from "@/components/paparan/MiniShape";
import { RentangKecamatan } from "@/components/paparan/RentangKecamatan";
import { TahunEkstrem } from "@/components/paparan/TahunEkstrem";
import { YearStrip } from "@/components/paparan/YearStrip";
import { LoadingState } from "@/components/ui/PageState";
import { Panel } from "@/components/ui/Panel";
import { getDesaCard, getGerbang, getSesi } from "@/lib/dataSource";
import { formatAngka, formatPersen } from "@/lib/format";
import { LABEL_TIER, headlinePaparan, kalimatKecamatan, labelTampakAman } from "@/lib/kalimat";

export const metadata: Metadata = { title: "Kartu Paparan" };

export default function KartuPaparanPage({ params }: PageProps<"/desa/[kode]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[960px] px-4 py-6 md:px-8 md:py-8">
          <LoadingState label="Memuat kartu paparan" lines={6} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

/*
 * Kartu Paparan (App Flow v2 §3.2). Urutan: pertanyaan dan jawaban, empat tahun kering ekstrem,
 * riwayat 15 tahun, fakta desa, konteks kecamatan dan bentuk wilayah, ajakan memeriksa kesiapan, batasan.
 */
async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [card, gerbang, sesi] = await Promise.all([getDesaCard(kode), getGerbang(), getSesi()]);
  if (!card) notFound();

  const { desa, paparan, kecamatan } = card;
  const tampakAman = labelTampakAman({ tampakAman: paparan.tampakAman, keputusan: gerbang });
  const tujuan = sesi && sesi.desaKode === kode ? `/desa/${kode}/kesiapan` : "/masuk";
  const awal = card.strip[0]?.tahun ?? 2012;
  const akhir = card.strip.at(-1)?.tahun ?? 2026;

  return (
    <div className="mx-auto max-w-[960px] px-4 py-6 md:px-8 md:py-8">
      {/* Judul berupa pertanyaan, jawabannya kalimat utama (pola layar SiapKemarau). */}
      <header>
        <p className="text-sm font-semibold text-ember">Kartu Paparan · deteksi satelit</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Seberapa terpapar {desa.nama}?</h1>
        <p className="mt-1 text-sm text-muted">
          {desa.kecNama}, {desa.kabNama}, {desa.provNama}
        </p>
      </header>

      {/* Jawaban inti: k dari n tahun kering ekstrem, lalu satu kartu per tahun ekstrem. */}
      <Panel className="mt-6 p-5 md:p-6">
        <h2 className="sr-only">Ringkasan paparan</h2>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="tabular text-5xl font-semibold leading-none tracking-[-0.03em]">
              {formatAngka(paparan.kExt)}
              <span className="text-2xl text-muted"> / {formatAngka(paparan.nExt)}</span>
            </span>
            <span className="text-sm text-muted">tahun kering ekstrem terdeteksi satelit</span>
          </p>
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-ink px-3 py-1 text-sm font-bold">
            {LABEL_TIER[paparan.tier]}
          </span>
        </div>
        <p className="mt-3 max-w-[60ch] text-lg font-semibold leading-snug">{headlinePaparan(paparan)}</p>
        {paparan.kExt === 0 ? <p className="mt-1 text-sm text-muted">Tingkat paparan hanya label.</p> : null}
        <div className="mt-5">
          <TahunEkstrem strip={card.strip} tahunEkstrem={card.tahunEkstrem} />
        </div>
      </Panel>

      {tampakAman ? (
        <section aria-labelledby="aman" className="mt-4 rounded-panel border-2 border-warn bg-warn-soft px-5 py-4">
          <h2 id="aman" className="flex items-center gap-2 text-xl font-bold text-warn">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Tampak aman
          </h2>
          <p className="mt-1">
            Desa ini pernah terdeteksi satelit pada tahun kering ekstrem, lalu tenang beberapa tahun terakhir. Tenang bukan berarti aman: tahun kering
            ekstrem berikutnya bisa datang kapan saja.
          </p>
        </section>
      ) : null}

      <Panel className="mt-4 p-5 md:p-6">
        <h2 className="text-lg font-bold">
          Riwayat deteksi satelit, {awal}–{akhir}
        </h2>
        <p className="text-sm text-muted">Satu kolom per tahun. Batang tinggi berarti desa terdeteksi satelit pada tahun itu.</p>
        <div className="mt-4">
          <YearStrip strip={card.strip} tahunEkstrem={card.tahunEkstrem} />
        </div>
      </Panel>

      <section aria-labelledby="fakta" className="mt-4">
        <h2 id="fakta" className="sr-only">
          Fakta desa
        </h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Panel as="div" className="flex flex-col-reverse justify-end gap-1 p-5">
            <dd>
              <span className="tabular block text-3xl font-semibold tracking-[-0.03em]">{formatPersen(desa.peatFrac)}</span>
              <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
                <span className="block h-full rounded-full bg-ink/70" style={{ width: `${Math.round(desa.peatFrac * 100)}%` }} />
              </span>
              <span className="mt-2 block text-sm text-muted">Bagian luas desa yang berupa lahan gambut.</span>
            </dd>
            <dt className="text-sm font-semibold text-muted">Porsi gambut</dt>
          </Panel>
          <Panel as="div" className="flex flex-col-reverse justify-end gap-1 p-5">
            <dd>
              <span className="tabular block text-3xl font-semibold tracking-[-0.03em]">{formatAngka(desa.luasHa)} ha</span>
              <span className="mt-2 block text-sm text-muted">Desa yang luas lebih mudah terdeteksi satelit.</span>
            </dd>
            <dt className="text-sm font-semibold text-muted">Luas desa</dt>
          </Panel>
          <Panel as="div" className="flex flex-col-reverse justify-end gap-1 p-5">
            <dd>
              <span className="tabular block text-3xl font-semibold tracking-[-0.03em]">{formatAngka(paparan.tahunTenang)} tahun</span>
              <span className="mt-2 block text-sm text-muted">Tahun terakhir berturut-turut tanpa deteksi sampai {akhir}.</span>
            </dd>
            <dt className="text-sm font-semibold text-muted">Tahun tenang</dt>
          </Panel>
        </dl>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <Panel className="p-5 md:p-6">
          <h2 className="text-lg font-bold">Dibanding desa lain di kecamatan</h2>
          <p className="text-sm text-muted">Porsi desa di kecamatan ini yang terdeteksi satelit pada tiap tahun kering ekstrem.</p>
          <div className="mt-4">
            <RentangKecamatan pMean={kecamatan.pMean} rateMin={kecamatan.rateMin} rateMax={kecamatan.rateMax} />
          </div>
          <p className="mt-4 text-sm">{kalimatKecamatan(kecamatan, desa.kecNama)}</p>
        </Panel>
        <Panel className="flex items-center justify-center p-5">
          <h2 className="sr-only">Bentuk desa</h2>
          <MiniShape geomJson={desa.geomJson} nama={desa.nama} />
        </Panel>
      </div>

      {/* Ajakan bertindak, pita gelap seperti "Ready to act?" pada referensi. */}
      <section
        aria-labelledby="lanjut"
        className="mt-6 flex flex-col gap-4 rounded-panel bg-ink p-6 text-white md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 id="lanjut" className="text-lg font-semibold">
            Paparan sudah terlihat. Bagaimana kesiapan alatnya?
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {tujuan === "/masuk"
              ? "Perlu masuk dengan akun desa ini. Paparan di atas bisa dilihat siapa saja."
              : "Lihat skor kesiapan dan alat yang perlu ditambah."}
          </p>
        </div>
        <Link href={tujuan} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 font-semibold text-ink">
          Periksa kesiapan desa ini
        </Link>
      </section>

      <p className="mt-6 flex gap-2 text-sm text-muted">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        <span>
          Deteksi satelit bukan hitungan kebakaran. Awan dan asap bisa menutupi api. Desa luas lebih mudah terdeteksi.{" "}
          <Link href="/data#batasan" className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
            Lihat batasan data
          </Link>
        </span>
      </p>
    </div>
  );
}
