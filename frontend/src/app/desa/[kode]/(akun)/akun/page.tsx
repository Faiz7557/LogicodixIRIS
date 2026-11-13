import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GantiSandiForm } from "@/components/masuk/GantiSandiForm";
import { LoadingState } from "@/components/ui/PageState";
import { PERAN_META } from "@/lib/akun";
import { getAkun, getDesaCard } from "@/lib/dataSource";

export const metadata: Metadata = { title: "Akun" };

export default function AkunPage({ params }: PageProps<"/desa/[kode]/akun">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat akun" lines={4} />
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
  return (
    <div className="mx-auto max-w-[720px] px-4 py-6 md:py-8">
      <p className="text-sm font-semibold text-ember">Akun · {card.desa.nama}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Akun saya</h1>

      <dl className="masuk mt-6 grid gap-3 rounded-panel border border-line bg-surface p-5 shadow-card sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-sm text-muted">Nama pengguna</dt>
          <dd className="truncate font-semibold">{akun.username}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-muted">Peran</dt>
          <dd className="truncate font-semibold">{PERAN_META[akun.peran].label}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-muted">Desa</dt>
          <dd className="truncate font-semibold">{card.desa.nama}</dd>
        </div>
      </dl>

      <GantiSandiForm />
    </div>
  );
}
