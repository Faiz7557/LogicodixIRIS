import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/PageState";
import type { DataPrioritas } from "@/components/prioritas/usePrioritas";
import { getAkun, getDesaCard } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";
import { getHargaEfektif, getTargetEfektif } from "@/server/efektif";
import { getKesiapan } from "@/server/kesiapan";
import { getPrioritas } from "@/server/prioritas";
import { getCatalog } from "@/server/queries";

/**
 * Pemuat bersama dua layar Prioritas (Pagu, Keputusan).
 * Urutan, skor, pagu, dan keputusan dihitung server; layar hanya menyusun tampilan.
 */
export async function MuatPrioritas({ params, tampil }: { params: Promise<{ kode: string }>; tampil: (data: DataPrioritas) => ReactNode }) {
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

  const [awal, kesiapan, paket, harga, catalog] = await Promise.all([
    getPrioritas(kode),
    getKesiapan(kode),
    getTargetEfektif(kode),
    getHargaEfektif(kode),
    getCatalog(),
  ]);

  return tampil({ kode, namaDesa: card.desa.nama, catalog, awal, kesiapan, paket, harga });
}
