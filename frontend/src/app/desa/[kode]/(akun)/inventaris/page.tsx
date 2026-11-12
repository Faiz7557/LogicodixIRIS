import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormInventaris } from "@/components/inventaris/FormInventaris";
import { LoadingState } from "@/components/ui/PageState";
import { getAkun, getCatalog, getDesaCard, getInventaris, getPaket } from "@/lib/dataSource";
import { itemTerkunci } from "@/lib/kesiapan";

export const metadata: Metadata = { title: "Catat Alat" };

export default function InventarisPage({ params }: PageProps<"/desa/[kode]/inventaris">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <LoadingState label="Memuat formulir alat" lines={6} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const [card, katalog, paket, inv, akun] = await Promise.all([
    getDesaCard(kode),
    getCatalog(),
    getPaket(kode),
    getInventaris(kode),
    getAkun(),
  ]);
  if (!card) notFound();

  // Sumur bor hanya diisi oleh desa bergambut; di desa tanpa gambut tampil sebagai kartu terkunci.
  const terkunci = itemTerkunci(katalog, card.desa.peatFrac);
  const catalog = katalog.filter((c) => !terkunci.includes(c));
  const target = Object.fromEntries(paket.map((p) => [p.itemKode, p.target]));

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">Catat Alat</h1>
        <p className="text-sm text-muted">{card.desa.nama}</p>
        <p className="mt-3 text-xl font-semibold leading-snug">Isi jumlah alat yang ada dan yang masih berfungsi.</p>
        <p className="mt-2 text-muted">
          Boleh disimpan sebagian; item yang kosong dihitung 0. Mengisi tidak butuh sinyal, menyimpan butuh sinyal.
        </p>
      </header>
      <FormInventaris
        kode={kode}
        catalog={catalog}
        target={target}
        tersimpan={inv.rows}
        terakhir={inv.terakhir}
        namaPengisi={akun.namaTampil}
        terkunci={terkunci}
      />
    </div>
  );
}
