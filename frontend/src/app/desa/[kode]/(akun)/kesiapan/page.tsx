import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { KesiapanView } from "@/components/kesiapan/KesiapanView";
import { LoadingState } from "@/components/ui/PageState";
import { getAkun, getCatalog, getDesaCard, getKesiapan, getReferensiPergub } from "@/lib/dataSource";

export const metadata: Metadata = { title: "Kesiapan Desa" };

// `params` adalah data runtime (cacheComponents), jadi dibaca di dalam Suspense.
export default function KesiapanPage({ params }: PageProps<"/desa/[kode]/kesiapan">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat kesiapan desa" lines={5} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [card, hasil, catalog, pergub, akun] = await Promise.all([
    getDesaCard(kode),
    getKesiapan(kode),
    getCatalog(),
    getReferensiPergub(kode),
    getAkun(),
  ]);
  if (!card) notFound();
  return <KesiapanView kode={kode} card={card} hasil={hasil} catalog={catalog} pergub={pergub} peran={akun.peran} />;
}
