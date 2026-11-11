import type { Metadata } from "next";
import { Suspense } from "react";
import { SimulasiPaguView } from "@/components/prioritas/SimulasiPaguView";
import { LoadingState } from "@/components/ui/PageState";
import { MuatPrioritas } from "../muatPrioritas";

export const metadata: Metadata = { title: "Simulasi pagu" };

export default function SimulasiPaguPage({ params }: PageProps<"/desa/[kode]/prioritas/simulasi">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat simulasi pagu" lines={6} />
        </div>
      }
    >
      <MuatPrioritas params={params} tampil={(data) => <SimulasiPaguView {...data} />} />
    </Suspense>
  );
}
