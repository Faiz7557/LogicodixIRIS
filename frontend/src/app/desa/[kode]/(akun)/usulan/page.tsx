import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UsulanView } from "@/components/usulan/UsulanView";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import { getAkun, getDesaCard, getPrioritas, listUsulanPage } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";
import { barisDisetujui, keyBaris, type KeputusanMap } from "@/lib/prioritas";

export const metadata: Metadata = { title: "Usulan" };

export default function UsulanPage({ params }: PageProps<"/desa/[kode]/usulan">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat usulan" lines={5} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [card, akun, prioritas, riwayat] = await Promise.all([getDesaCard(kode), getAkun(), getPrioritas(kode), listUsulanPage(kode, 20)]);
  if (!card) notFound();
  if (!bisaSusunPrioritas(akun.peran)) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Usulan</h1>
        <EmptyState title="Halaman ini untuk akun desa." action={{ href: `/desa/${kode}/kesiapan`, label: "Kembali ke Kesiapan" }}>
          Sekdes atau kades yang menerbitkan usulan.
        </EmptyState>
      </div>
    );
  }
  // Baris yang boleh dimuat usulan: terpilih di Prioritas dan sudah disetujui desa.
  const keputusan: KeputusanMap = Object.fromEntries(
    prioritas.keputusan.map((k) => [keyBaris(k), { keputusan: k.keputusan, catatan: k.catatan ?? undefined }]),
  );
  return (
    <UsulanView
      kode={kode}
      namaDesa={card.desa.nama}
      paguRp={prioritas.paguRp}
      disetujui={barisDisetujui(prioritas.terpilih, keputusan)}
      riwayat={riwayat.hasil}
      nextCursor={riwayat.meta.nextCursor}
    />
  );
}
