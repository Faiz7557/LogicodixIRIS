import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { DataView } from "@/components/data/DataView";
import { KerangkaAkun } from "@/components/layout/KerangkaAkun";
import { ErrorState } from "@/components/ui/PageState";
import { getSesiAkun } from "@/server/auth";
import { getDataPage } from "@/server/queries";

export const metadata: Metadata = { title: "Data dan Asumsi" };

/*
 * Isi sama untuk semua desa. Publik: halaman biasa. Sudah masuk: tampil di kerangka dasbor desa akun,
 * sama seperti Time Machine. Data dibaca dari basis data (GET /api/data) lewat `getDataPage`.
 */
export default function DataPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-[1040px] px-4 py-6 text-sm text-muted md:px-8 md:py-8">Memuat data…</p>}>
      <Isi />
    </Suspense>
  );
}

async function Isi() {
  await connection();
  const hasil = await Promise.all([getSesiAkun(), getDataPage()]).catch(() => null);
  if (!hasil) return <ErrorState message="Data belum tersedia. Jalankan pipeline lebih dulu." />;
  const [akun, data] = hasil;
  if (!akun) return <DataView data={data} />;
  return (
    <KerangkaAkun kode={Promise.resolve(akun.desaKode)}>
      <DataView data={data} />
    </KerangkaAkun>
  );
}
