import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UsulanView } from "@/components/usulan/UsulanView";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import { getAkun, getDesaCard } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";

export const metadata: Metadata = { title: "Usulan" };

export default function UsulanPage({ params }: PageProps<"/desa/[kode]/usulan">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat usulan" lines={5} />
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
  if (!bisaSusunPrioritas(akun.peran)) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Usulan</h1>
        <EmptyState title="Halaman ini untuk akun desa." action={{ href: `/desa/${kode}/kesiapan`, label: "Kembali ke Kesiapan" }}>
          Sekdes atau kades yang menerbitkan usulan.
        </EmptyState>
      </div>
    );
  }
  const info = {
    nama: card.desa.nama,
    kecNama: card.desa.kecNama,
    kabNama: card.desa.kabNama,
    kExt: card.paparan.kExt,
    nExt: card.paparan.nExt,
    tahunTenang: card.paparan.tahunTenang,
  };
  return <UsulanView kode={kode} namaDesa={card.desa.nama} info={info} />;
}
