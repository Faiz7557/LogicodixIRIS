import type { Metadata } from "next";
import { Suspense } from "react";
import { PaguView } from "@/components/prioritas/PaguView";
import { LoadingState } from "@/components/ui/PageState";
import { MuatPrioritas } from "../muatPrioritas";

export const metadata: Metadata = { title: "Anggaran" };

export default function PaguPage({ params }: PageProps<"/desa/[kode]/prioritas/pagu">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat anggaran" lines={6} />
        </div>
      }
    >
      <MuatPrioritas params={params} tampil={(data) => <PaguView {...data} />} />
    </Suspense>
  );
}
