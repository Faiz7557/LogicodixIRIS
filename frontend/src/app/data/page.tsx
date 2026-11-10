import type { Metadata } from "next";
import { Suspense } from "react";
import { DataView } from "@/components/data/DataView";
import { KerangkaAkun } from "@/components/layout/KerangkaAkun";
import { getSesiAkun } from "@/server/auth";

export const metadata: Metadata = { title: "Data dan Asumsi" };

/*
 * Isi sama untuk semua desa. Publik: halaman biasa. Sudah masuk: tampil di kerangka dasbor desa akun,
 * sama seperti Time Machine. Cadangan Suspense adalah tampilan publik supaya pengunjung tidak menunggu.
 */
export default function DataPage() {
  return (
    <Suspense fallback={<DataView />}>
      <Isi />
    </Suspense>
  );
}

async function Isi() {
  const akun = await getSesiAkun();
  if (!akun) return <DataView />;
  return (
    <KerangkaAkun kode={Promise.resolve(akun.desaKode)}>
      <DataView />
    </KerangkaAkun>
  );
}
