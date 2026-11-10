import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DokumenLoader } from "@/components/usulan/DokumenLoader";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import { getAkun, getDesaCard } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";

export const metadata: Metadata = { title: "Dokumen Usulan" };

export default function DokumenUsulanPage({ params }: PageProps<"/desa/[kode]/usulan/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat dokumen" lines={6} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string; id: string }> }) {
  const { kode, id } = await params;
  const [card, akun] = await Promise.all([getDesaCard(kode), getAkun()]);
  const nomor = Number(id);
  if (!card || !Number.isInteger(nomor) || nomor < 1) notFound();
  if (!bisaSusunPrioritas(akun.peran)) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6">
        <EmptyState title="Halaman ini untuk akun desa." action={{ href: `/desa/${kode}/kesiapan`, label: "Kembali ke Kesiapan" }} />
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
  return <DokumenLoader kode={kode} id={nomor} info={info} isDemo={akun.isDemo} />;
}
