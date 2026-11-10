import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RincianItem } from "@/components/kesiapan/RincianItem";
import { LoadingState } from "@/components/ui/PageState";
import { getAkun, getCatalog, getDesaCard, getHarga, getInventaris, getKesiapan } from "@/lib/dataSource";

export const metadata: Metadata = { title: "Rincian Item Kesiapan" };

/** Rincian satu item paket minimum: /desa/[kode]/kesiapan/[item], item = kode katalog (mis. selang_keluar). */
export default function RincianItemPage({ params }: PageProps<"/desa/[kode]/kesiapan/[item]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1120px] px-4 py-6 md:px-8 md:py-8">
          <LoadingState label="Memuat rincian item" lines={6} />
        </div>
      }
    >
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ kode: string; item: string }> }) {
  const { kode, item: kodeItem } = await params;
  const [card, catalog, hasil, harga, inv, akun] = await Promise.all([
    getDesaCard(kode),
    getCatalog(),
    getKesiapan(kode),
    getHarga(kode),
    getInventaris(kode),
    getAkun(),
  ]);
  if (!card) notFound();

  const item = catalog.find((c) => c.kode === kodeItem);
  const baris = hasil.items.find((i) => i.itemKode === kodeItem);
  // Item di luar katalog, atau sumur bor di desa tanpa gambut (target 0, tidak dihitung): tidak ada.
  if (!item || !baris || (item.hanyaGambut && card.desa.peatFrac === 0)) notFound();

  return (
    <RincianItem
      kode={kode}
      item={item}
      hasil={baris}
      desa={hasil}
      catalog={catalog}
      harga={harga}
      tersimpan={inv.rows}
      terakhir={inv.terakhir}
      namaPengisi={akun.namaTampil}
      peran={akun.peran}
    />
  );
}
