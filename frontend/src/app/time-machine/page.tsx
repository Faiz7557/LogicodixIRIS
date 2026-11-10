import type { Metadata } from "next";
import { Suspense } from "react";
import { KerangkaAkun } from "@/components/layout/KerangkaAkun";
import { TimeMachineView } from "@/components/timemachine/TimeMachineView";
import { getSesiAkun } from "@/server/auth";

export const metadata: Metadata = { title: "Time Machine" };

/*
 * Publik: halaman biasa. Sudah masuk: tampil di kerangka dasbor desa, sama seperti Bukti satelit.
 * Sesi dibaca di dalam Suspense; cadangannya tampilan publik supaya pengunjung tanpa akun tidak menunggu.
 */
export default function TimeMachinePage() {
  return (
    <Suspense fallback={<TimeMachineView />}>
      <Isi />
    </Suspense>
  );
}

async function Isi() {
  const akun = await getSesiAkun();
  if (!akun) return <TimeMachineView />;
  return (
    <KerangkaAkun kode={Promise.resolve(akun.desaKode)}>
      <TimeMachineView />
    </KerangkaAkun>
  );
}
