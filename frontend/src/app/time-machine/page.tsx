import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { KerangkaAkun } from "@/components/layout/KerangkaAkun";
import { TimeMachineView } from "@/components/timemachine/TimeMachineView";
import { ErrorState } from "@/components/ui/PageState";
import { getSesiAkun } from "@/server/auth";
import { getBacktest } from "@/server/queries";

export const metadata: Metadata = { title: "Time Machine" };

/*
 * Publik: halaman biasa. Sudah masuk: tampil di kerangka dasbor desa, sama seperti Informasi detail.
 * Sesi dan hasil backtest dibaca di dalam Suspense; cadangannya keadaan kosong supaya pengunjung tidak menunggu.
 */
export default function TimeMachinePage() {
  return (
    <Suspense fallback={<Memuat />}>
      <Isi />
    </Suspense>
  );
}

function Memuat() {
  return <p className="mx-auto max-w-[1040px] px-4 py-6 text-muted">Memuat hasil uji…</p>;
}

async function Isi() {
  await connection();
  const hasil = await Promise.all([getSesiAkun(), getBacktest()]).catch(() => null);
  if (!hasil) return <ErrorState message="Data belum tersedia. Jalankan pipeline lebih dulu." />;
  const [akun, data] = hasil;
  if (!akun) return <TimeMachineView data={data} />;
  return (
    <KerangkaAkun kode={Promise.resolve(akun.desaKode)}>
      <TimeMachineView data={data} />
    </KerangkaAkun>
  );
}
