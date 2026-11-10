import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MiniShape } from "@/components/paparan/MiniShape";
import { YearStrip } from "@/components/paparan/YearStrip";
import { LoadingState } from "@/components/ui/PageState";
import { getDesaCard, getGerbang, getSesi } from "@/lib/dataSource";
import { formatAngka, formatPersen } from "@/lib/format";
import { LABEL_TIER, headlinePaparan, kalimatKecamatan, labelTampakAman } from "@/lib/kalimat";

export const metadata: Metadata = { title: "Kartu Paparan" };

export default function KartuPaparanPage({ params }: PageProps<"/desa/[kode]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat kartu paparan" lines={6} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [card, gerbang, sesi] = await Promise.all([getDesaCard(kode), getGerbang(), getSesi()]);
  if (!card) notFound();

  const { desa, paparan, kecamatan } = card;
  const tampakAman = labelTampakAman({ tampakAman: paparan.tampakAman, keputusan: gerbang });
  const tujuan = sesi && sesi.desaKode === kode ? `/desa/${kode}/kesiapan` : "/masuk";

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold">{desa.nama}</h1>
        <p className="text-sm text-muted">
          {desa.kecNama}, {desa.kabNama}, {desa.provNama} · luas {formatAngka(desa.luasHa)} ha
        </p>
        <p className="mt-3 text-xl font-semibold leading-snug">{headlinePaparan(paparan)}</p>
      </header>

      {tampakAman ? (
        <section aria-labelledby="aman" className="mt-4 rounded-card border-2 border-warn bg-[#fff4dc] px-4 py-4">
          <h2 id="aman" className="flex items-center gap-2 text-2xl font-bold text-warn">
            <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      <p className="mt-4">
        <span className="inline-flex items-center rounded-full border border-ink px-3 py-1 text-sm font-bold">{LABEL_TIER[paparan.tier]}</span>
        {paparan.kExt === 0 ? <span className="ml-2 text-sm text-muted">Tingkat paparan hanya label.</span> : null}
      </p>

      <section aria-labelledby="strip" className="mt-6">
        <h2 id="strip" className="text-lg font-bold">Riwayat deteksi satelit, 2012–2026</h2>
        <div className="mt-2">
          <YearStrip strip={card.strip} tahunEkstrem={card.tahunEkstrem} />
        </div>
      </section>

      <section aria-labelledby="fakta" className="mt-6">
        <h2 id="fakta" className="sr-only">Fakta desa</h2>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-card border border-line bg-surface px-4 py-3">
            <dt className="text-sm text-muted">Porsi gambut</dt>
            <dd className="tabular text-2xl font-bold">{formatPersen(desa.peatFrac)}</dd>
          </div>
          <div className="rounded-card border border-line bg-surface px-4 py-3">
            <dt className="text-sm text-muted">Luas desa</dt>
            <dd className="tabular text-2xl font-bold">{formatAngka(desa.luasHa)} ha</dd>
          </div>
        </dl>
        <p className="mt-3 text-muted">{kalimatKecamatan(kecamatan, desa.kecNama)}</p>
      </section>

      <section aria-label="Bentuk desa" className="mt-6">
        <MiniShape geomJson={desa.geomJson} nama={desa.nama} />
      </section>

      <div className="mt-8">
        <Link href={tujuan} className="flex min-h-12 items-center justify-center rounded-card bg-ember px-4 text-base font-semibold text-white">
          Periksa kesiapan desa ini
        </Link>
        {tujuan === "/masuk" ? <p className="mt-2 text-sm text-muted">Perlu masuk dengan akun desa ini. Paparan di atas bisa dilihat siapa saja.</p> : null}
      </div>

      <p className="mt-6 text-sm text-muted">
        Deteksi satelit bukan hitungan kebakaran. Awan dan asap bisa menutupi api. Desa luas lebih mudah terdeteksi.{" "}
        <Link href="/data#batasan" className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
          Lihat batasan data
        </Link>
      </p>
    </div>
  );
}
