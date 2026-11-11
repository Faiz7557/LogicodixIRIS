"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { TahunSatelit } from "./skalaSatelit";

/* Balok 3D dimuat malas: Three.js sudah dipakai peta gudang di halaman ini, jadi biasanya tinggal dipakai ulang. */
const Balok3DSatelit = dynamic(() => import("./Balok3DSatelit"), {
  ssr: false,
  loading: () => (
    <div role="status" className="flex h-[380px] items-center justify-center text-sm text-muted md:h-[440px]">
      Memuat tampilan 3D…
    </div>
  ),
});

type Mode = "kotak" | "3d";

/**
 * Kepala kalender satelit dengan pilihan tampilan Kotak atau 3D (pola tombol di Sparekit).
 * `kotak` adalah tampilan kotak yang sudah dirender server; 3D hanya dimuat bila dipilih.
 */
export function PilihTampilanSatelit({
  kepala,
  tautan,
  kotak,
  data,
}: {
  kepala: React.ReactNode;
  tautan: React.ReactNode;
  kotak: React.ReactNode;
  data: TahunSatelit[];
}) {
  const [mode, setMode] = useState<Mode>("kotak");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {kepala}
        <div className="flex items-center gap-2">
          {tautan}
          <div role="group" aria-label="Pilihan tampilan" className="flex rounded-full border border-line bg-paper p-1">
            {(
              [
                { id: "kotak", label: "Tampilan kotak", ikon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
                { id: "3d", label: "Tampilan 3D", ikon: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" /> },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={mode === t.id}
                aria-label={t.label}
                title={t.label}
                onClick={() => setMode(t.id)}
                className={`flex size-9 items-center justify-center rounded-full transition-colors ${mode === t.id ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
              >
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill={t.id === "kotak" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={t.id === "kotak" ? 0 : 2} strokeLinejoin="round">
                  {t.ikon}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5">
        {mode === "kotak" ? (
          kotak
        ) : (
          <>
            <Balok3DSatelit data={data} />
            <p className="mt-1 text-sm text-muted">Kolom = tahun, baris = bulan, tinggi balok = hari ada titik api. Seret untuk memutar, klik dua kali untuk mengembalikan.</p>
          </>
        )}
      </div>
    </>
  );
}
