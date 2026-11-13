import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { DasborSatelit } from "@/components/paparan/dasbor/DasborSatelit";
import { KerangkaAkun } from "@/components/layout/KerangkaAkun";
import { ErrorState, LoadingState } from "@/components/ui/PageState";
import { RingkasanAi } from "@/components/ui/RingkasanAi";
import { getDesaCard, getGerbang, getSesi } from "@/lib/dataSource";
import { labelTampakAman } from "@/lib/kalimat";

export const metadata: Metadata = { title: "Bukti satelit" };

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
 * Bukti satelit (App Flow v2 §3.2) sebagai dasbor interaktif: riwayat, paparan, musim, matriks hari dan titik,
 * wawasan, perbandingan kecamatan (lihat DasborSatelit), lalu ajakan memeriksa kesiapan dan batasan data.
 */
async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  await connection();
  const { kode } = await params;
  const hasil = await Promise.all([getDesaCard(kode), getGerbang(), getSesi()]).catch(() => null);
  if (!hasil) return <ErrorState message="Data belum tersedia. Jalankan pipeline lebih dulu." />;
  const [card, gerbang, sesi] = hasil;
  if (!card) notFound();

  const { desa, paparan, kecamatan } = card;
  const tampakAman = labelTampakAman({ tampakAman: paparan.tampakAman, keputusan: gerbang });
  // Akun desa ini sendiri: tampil di kerangka dasbor. Desa lain atau tanpa sesi: halaman publik.
  const berakun = sesi?.desaKode === kode;
  const tujuan = berakun ? `/desa/${kode}/kesiapan` : "/masuk";

  const isi = (
    <>
      <div className="mx-auto max-w-[1200px] px-4 pt-6 md:px-8">
        <RingkasanAi halaman="paparan" kode={kode} />
      </div>
      <DasborSatelit
        kode={kode}
        namaDesa={desa.nama}
        lokasi={`${desa.kecNama}, ${desa.kabNama}, ${desa.provNama}`}
        strip={card.strip}
        tahunEkstrem={card.tahunEkstrem}
        paparan={paparan}
        kecamatan={kecamatan}
        kecNama={desa.kecNama}
        tampakAman={tampakAman}
      />
      <div className="mx-auto max-w-[1200px] px-4 pb-8 md:px-8">
      {/* Ajakan bertindak, pita gelap seperti "Ready to act?" pada referensi. */}
      <section
        aria-labelledby="lanjut"
        className="flex flex-col gap-4 rounded-panel bg-ink p-6 text-white md:flex-row md:items-center md:justify-between"
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
    </>
  );

  return berakun ? <KerangkaAkun kode={Promise.resolve(kode)}>{isi}</KerangkaAkun> : isi;
}
