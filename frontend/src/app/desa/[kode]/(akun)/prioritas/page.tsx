import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrioritasView } from "@/components/prioritas/PrioritasView";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import { getAkun, getDesaCard } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";
import { getHargaEfektif, getTargetEfektif } from "@/server/efektif";
import { getKesiapan } from "@/server/kesiapan";
import { getPrioritas } from "@/server/prioritas";
import { getCatalog } from "@/server/queries";

export const metadata: Metadata = { title: "Prioritas" };

export default function PrioritasPage({ params }: PageProps<"/desa/[kode]/prioritas">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat prioritas" lines={6} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [card, akun] = await Promise.all([getDesaCard(kode), getAkun()]);
  if (!card) notFound();

  // Akun mpa tidak boleh mengakses (403 di API). Di layar: penjelasan dan jalan keluar, bukan halaman kosong.
  if (!bisaSusunPrioritas(akun.peran)) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Prioritas</h1>
        <EmptyState title="Halaman ini untuk akun desa." action={{ href: `/desa/${kode}/kesiapan`, label: "Kembali ke Kesiapan" }}>
          Akun ketua MPA mencatat alat dan melihat kesiapan. Sekdes atau kades yang menyusun prioritas dan usulan.
        </EmptyState>
      </div>
    );
  }

  // Urutan, skor, pagu, dan keputusan dihitung server. Halaman hanya menyusun tampilan.
  const [awal, kesiapan, paket, harga, catalog] = await Promise.all([
    getPrioritas(kode),
    getKesiapan(kode),
    getTargetEfektif(kode),
    getHargaEfektif(kode),
    getCatalog(),
  ]);

  return (
    <PrioritasView
      kode={kode}
      namaDesa={card.desa.nama}
      catalog={catalog}
      awal={awal}
      skorSekarang={kesiapan.skor}
      paket={paket}
      harga={harga}
    />
  );
}
