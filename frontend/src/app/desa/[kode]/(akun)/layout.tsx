import { Suspense } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { mockAkun } from "@/mocks/demo";

/*
 * Layout halaman berakun: banner demo + navigasi desa.
 * `params` adalah data runtime, jadi dibaca di dalam Suspense (cacheComponents aktif).
 */
export default function AkunLayout({ children, params }: LayoutProps<"/desa/[kode]">) {
  return (
    <>
      <Suspense fallback={<div className="h-11 border-b border-line" />}>
        <AkunChrome params={params} />
      </Suspense>
      {/* ruang untuk navigasi bawah di HP */}
      <div className="pb-24 md:pb-0">{children}</div>
    </>
  );
}

async function AkunChrome({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  // TODO(Task 14): ganti dengan akun dari sesi. Sementara memakai akun demo sekdes.
  const akun = mockAkun.desa;
  return (
    <>
      {akun.isDemo ? <DemoBanner /> : null}
      <BottomNav kode={kode} peran={akun.peran} />
    </>
  );
}
