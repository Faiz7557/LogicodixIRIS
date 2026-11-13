import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { KartuTerkunci } from "@/components/kesiapan/ItemTerkunci";
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
  if (!item) notFound();

  // Sumur bor di desa tanpa gambut: tidak dihitung, tetapi halamannya ada dan menjelaskan kenapa terkunci.
  if (item.hanyaGambut && card.desa.peatFrac === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6 md:py-8">
        <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight">{item.nama}</h1>
        <p className="mt-1 text-sm text-muted">{card.desa.nama}</p>
        <div className="mt-5">
          <KartuTerkunci item={item} as="section" />
        </div>
        <Link
          href={`/desa/${kode}/kesiapan`}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-semibold text-white"
        >
          Kembali ke kesiapan
        </Link>
      </div>
    );
  }

  const baris = hasil.items.find((i) => i.itemKode === kodeItem);
  if (!baris) notFound();

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
