import type { Metadata } from "next";
import { Suspense } from "react";
import { PrioritasView } from "@/components/prioritas/PrioritasView";
import { LoadingState } from "@/components/ui/PageState";
import { MuatPrioritas } from "./muatPrioritas";

export const metadata: Metadata = { title: "Keputusan belanja" };

export default function PrioritasPage({ params }: PageProps<"/desa/[kode]/prioritas">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat prioritas" lines={6} />
        </div>
      }
    >
      <MuatPrioritas params={params} tampil={(data) => <PrioritasView {...data} />} />
    </Suspense>
  );
}
