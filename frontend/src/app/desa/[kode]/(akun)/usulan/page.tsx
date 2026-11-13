import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UsulanView } from "@/components/usulan/UsulanView";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import { getAkun, getCatalog, getDesaCard, getPrioritas, listUsulanPage } from "@/lib/dataSource";
import { bisaSusunPrioritas } from "@/lib/kesiapan";
import { formatRupiah } from "@/lib/format";
import { anggaranSementara, barisDisetujui, keyBaris, ringkasKeputusan, totalBiaya, type KeputusanMap } from "@/lib/prioritas";

export const metadata: Metadata = { title: "Usulan" };

export default function UsulanPage({ params }: PageProps<"/desa/[kode]/usulan">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1120px] px-4 py-6 md:px-8 md:py-8">
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
  const [card, akun, prioritas, riwayat, catalog] = await Promise.all([
    getDesaCard(kode),
    getAkun(),
    getPrioritas(kode),
    listUsulanPage(kode, 20),
    getCatalog(),
  ]);
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
  // Tahun berjalan dibaca saat permintaan, bukan saat prerender (cacheComponents menolak new Date() di prerender).
  await connection();
  const tahunSekarang = new Date().getFullYear();
  const disetujui = barisDisetujui(prioritas.terpilih, keputusan);
  const ringkas = ringkasKeputusan(prioritas.terpilih, keputusan);
  const ringkasLangkah: [string, string, string] = [
    disetujui.length > 0
      ? `Anggaran ${formatRupiah(prioritas.paguRp)}, sisa sementara ${formatRupiah(anggaranSementara(prioritas.paguRp, disetujui).sisaRp)}`
      : `Anggaran ${formatRupiah(prioritas.paguRp)}`,
    prioritas.terpilih.length > 0 ? `${prioritas.terpilih.length} saran, ${ringkas.belum} belum diputuskan` : "Belum ada saran untuk anggaran ini",
    disetujui.length > 0 ? `${disetujui.length} disetujui, ${formatRupiah(totalBiaya(disetujui))}` : "Setujui minimal satu saran",
  ];
  return (
    <UsulanView
      ringkasLangkah={ringkasLangkah}
      kode={kode}
      namaDesa={card.desa.nama}
      kabupaten={card.desa.kabNama}
      paguRp={prioritas.paguRp}
      disetujui={disetujui}
      item={Object.fromEntries(catalog.map((c) => [c.kode, { nama: c.nama, satuan: c.satuan }]))}
      kekuranganRp={prioritas.tidakTerdanai.reduce((s, b) => s + b.biayaRp, 0)}
      jumlahBelumTerbeli={prioritas.tidakTerdanai.length}
      tahunSekarang={tahunSekarang}
      riwayat={riwayat.hasil}
      nextCursor={riwayat.meta.nextCursor}
    />
  );
}
