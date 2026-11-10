import { Suspense } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { NavAkun } from "@/components/layout/NavAkun";
import { getAkun, getDesaCard, getKesiapan } from "@/lib/dataSource";
import type { Peran } from "@/lib/types";

/*
 * Layout halaman berakun: sidebar bergrup pertanyaan (laptop) atau menu bawah (HP), banner demo, lalu isi.
 * Pola tata letak diadaptasi dari referensi Sparekit. `params` adalah data runtime,
 * jadi dibaca di dalam Suspense (cacheComponents aktif).
 */
const PERAN_LABEL: Record<Peran, string> = { desa: "Sekretaris desa", mpa: "Ketua MPA" };

export default function AkunLayout({ children, params }: LayoutProps<"/desa/[kode]">) {
  return (
    <div className="md:grid md:grid-cols-[16.5rem_minmax(0,1fr)]">
      <Suspense fallback={<div className="hidden border-r border-line md:block" />}>
        <Navigasi params={params} />
      </Suspense>
      <div className="min-w-0">
        <Suspense fallback={<div className="h-11 border-b border-line" />}>
          <Banner />
        </Suspense>
        {/* ruang untuk navigasi bawah di HP */}
        <div className="pb-24 md:pb-0">{children}</div>
      </div>
    </div>
  );
}

async function Banner() {
  // TODO: ganti dengan akun dari sesi (v2 Task 12) saat backend siap.
  const akun = await getAkun();
  return akun.isDemo ? <DemoBanner /> : null;
}

async function Navigasi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [akun, card, hasil] = await Promise.all([getAkun(), getDesaCard(kode), getKesiapan(kode)]);
  return (
    <NavAkun
      r={{
        kode,
        peran: akun.peran,
        namaTampil: akun.namaTampil,
        peranLabel: PERAN_LABEL[akun.peran],
        desaNama: card?.desa.nama ?? "desa",
        skor: hasil.lengkap || hasil.skor > 0 ? hasil.skor : null,
        status: hasil.status,
      }}
    />
  );
}
