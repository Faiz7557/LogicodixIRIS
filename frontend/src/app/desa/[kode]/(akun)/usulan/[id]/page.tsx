import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DokumenLoader } from "@/components/usulan/DokumenLoader";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import { getAkun, getDesaCard, getUsulan } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";
import { HttpError } from "@/server/http";
import type { Usulan } from "@/lib/types";

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
  let usulan: Usulan;
  try {
    usulan = await getUsulan(kode, nomor);
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) notFound();
    throw e;
  }
  return <DokumenLoader kode={kode} usulan={usulan} isDemo={akun.isDemo} />;
}
