"use client";

import Link from "next/link";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import type { Usulan } from "@/lib/types";
import { DokumenUsulan } from "./DokumenUsulan";

/**
 * Pembungkus dokumen usulan: tautan kembali dan tombol cetak. Isi dokumen sudah dibaca server
 * (GET /api/desa/[kode]/usulan/[id]); di sini tidak ada pengambilan data maupun keadaan.
 */
export function DokumenLoader({ kode, usulan }: { kode: string; usulan: Usulan }) {
  return (
    <div className="pb-32 md:pb-6 print:pb-0">
      <div className="no-print mx-auto max-w-[720px] px-4 pt-4">
        <Link href={`/desa/${kode}/usulan`} className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
          Kembali ke Usulan
        </Link>
      </div>
      <DokumenUsulan usulan={usulan} />
      <BilahAksi teks="Tinjau surat, lalu cetak atau simpan sebagai PDF.">
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
