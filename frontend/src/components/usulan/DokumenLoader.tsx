"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState, LoadingState } from "@/components/ui/PageState";
import type { Usulan } from "@/lib/types";
import { bacaSimpanan, simpananAwal } from "@/mocks/store";
import { susunUsulan, type InfoDesa } from "@/mocks/usulanContoh";
import { DokumenUsulan } from "./DokumenUsulan";

/**
 * SEMENTARA: mengambil usulan dari penyimpanan contoh di browser. Dokumen nyata dibaca server
 * (GET /api/desa/[kode]/usulan/[id]) dan langsung memakai <DokumenUsulan usulan={...} />.
 * Id "1" tanpa usulan tersimpan menampilkan contoh dokumen agar tata letak cetak bisa dilihat.
 */
export function DokumenLoader({ kode, id, info, isDemo }: { kode: string; id: number; info: InfoDesa; isDemo: boolean }) {
  const [usulan, setUsulan] = useState<Usulan | null | undefined>(undefined);

  useEffect(() => {
    const s = bacaSimpanan(kode);
    let u: Usulan | null = s.usulan.find((x) => x.id === id) ?? null;
    if (!u && id === 1 && s.usulan.length === 0) {
      u = susunUsulan({ id: 1, kode, kanal: "apbdes_perubahan", info, sim: simpananAwal(), setujuSemua: true });
    }
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setUsulan(u);
  }, [kode, id, info]);

  if (usulan === undefined) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6">
        <LoadingState label="Memuat dokumen" lines={6} />
      </div>
    );
  }
  if (usulan === null) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-6">
        <EmptyState title="Usulan tidak ditemukan." action={{ href: `/desa/${kode}/usulan`, label: "Ke daftar usulan" }}>
          Usulan ini belum diterbitkan atau sudah tidak ada.
        </EmptyState>
      </div>
    );
  }
  return (
    <div className="pb-32 md:pb-6">
      <div className="no-print mx-auto max-w-[720px] px-4 pt-4">
        <Link href={`/desa/${kode}/usulan`} className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
          Kembali ke daftar usulan
        </Link>
      </div>
      <DokumenUsulan usulan={usulan} isDemo={isDemo} />
      <BilahAksi teks="Tinjau dokumen, lalu cetak atau simpan sebagai PDF." >
        <TombolCetak />
      </BilahAksi>
    </div>
  );
}

function TombolCetak() {
  return (
    <button type="button" onClick={() => window.print()} className={kelasAksiUtama}>
      Cetak
    </button>
  );
}
