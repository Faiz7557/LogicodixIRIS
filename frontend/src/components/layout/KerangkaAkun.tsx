import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { NavAkun } from "@/components/layout/NavAkun";
import { getCatalog, getDesaCard, getKesiapan } from "@/lib/dataSource";
import type { Akun, Peran } from "@/lib/types";
import { getSesiAkun } from "@/server/auth";

/*
 * Kerangka halaman berakun: sidebar bergrup pertanyaan (laptop) atau menu bawah (HP), banner, lalu isi.
 * Dipakai layout (akun) dan Kartu Paparan saat pengguna sudah masuk, supaya keduanya terasa satu dasbor.
 * Pola tata letak diadaptasi dari referensi Sparekit.
 */
const PERAN_LABEL: Record<Peran, string> = { desa: "Sekretaris desa", mpa: "Ketua MPA" };

/**
 * Akses halaman berakun untuk desa `kode`: tanpa sesi menuju /masuk, desa lain 404.
 * Tiap desa punya MPA dan sekdes sendiri, jadi akun hanya membuka desanya sendiri (termasuk akun demo).
 */
export async function aksesDesa(kode: string): Promise<Akun> {
  const akun = await getSesiAkun();
  if (!akun) redirect("/masuk");
  if (akun.desaKode !== kode) notFound();
  return akun;
}

export function KerangkaAkun({ kode, children }: { kode: Promise<string>; children: React.ReactNode }) {
  return (
    <div className="md:grid md:grid-cols-[16.5rem_minmax(0,1fr)]">
      <Suspense fallback={<div className="hidden border-r border-line md:block" />}>
        <Navigasi kode={kode} />
      </Suspense>
      <div className="min-w-0">
        <Suspense fallback={<div className="h-11 border-b border-line" />}>
          <Banner kode={kode} />
        </Suspense>
        {/* ruang untuk navigasi bawah di HP */}
        <div className="pb-24 md:pb-0">{children}</div>
      </div>
    </div>
  );
}

async function Banner({ kode: kodeP }: { kode: Promise<string> }) {
  const akun = await aksesDesa(await kodeP);
  return akun.isDemo ? <DemoBanner /> : null;
}

async function Navigasi({ kode: kodeP }: { kode: Promise<string> }) {
  const kode = await kodeP;
  const akun = await aksesDesa(kode);
  const [card, hasil, catalog] = await Promise.all([getDesaCard(kode), getKesiapan(kode), getCatalog()]);
  if (!card) notFound();
  // Urutan katalog tetap (bukan urutan kesenjangan) supaya menu tidak berpindah-pindah.
  // Item tanpa kondisi rusak (dana operasi) bukan alat, jadi menu menampilkannya terpisah.
  const items = catalog.flatMap((c) => {
    const it = hasil.items.find((i) => i.itemKode === c.kode);
    return it ? [{ kode: c.kode, nama: c.nama, kurang: Math.max(it.target - it.berfungsi, 0), belumDiisi: it.belumDiisi, alat: c.punyaRusak }] : [];
  });
  return (
    <NavAkun
      r={{
        kode,
        peran: akun.peran,
        namaTampil: akun.namaTampil,
        peranLabel: PERAN_LABEL[akun.peran],
        desaNama: card.desa.nama,
        skor: hasil.lengkap || hasil.skor > 0 ? hasil.skor : null,
        status: hasil.status,
        items,
      }}
    />
  );
}
