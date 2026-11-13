"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Satu tahun di dasbor: angka tahunan dari backend, sebaran per bulan dari `desa_bulan`. */
export type TahunDasbor = {
  tahun: number;
  hari: number;
  titik: number;
  terpapar: boolean;
  ekstrem: boolean;
  bulan: number[];
};

export type Metrik = "hari" | "titik";
export type Rentang = "semua" | "lima" | "ekstrem";

export const METRIK: { nilai: Metrik; label: string; satuan: string }[] = [
  { nilai: "hari", label: "Hari deteksi", satuan: "hari" },
  { nilai: "titik", label: "Titik api", satuan: "titik" },
];

export const RENTANG: { nilai: Rentang; label: string }[] = [
  { nilai: "semua", label: "15 tahun" },
  { nilai: "lima", label: "5 tahun terakhir" },
  { nilai: "ekstrem", label: "Tahun ekstrem" },
];

export const nilaiDari = (d: TahunDasbor, m: Metrik) => (m === "hari" ? d.hari : d.titik);

/** Batas atas sumbu yang bulat: 1, 2, 5 × 10^k. */
export function batasRapi(maks: number): number {
  if (maks <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(maks));
  return ([1, 2, 5, 10].find((f) => f * p >= maks) ?? 10) * p;
}

export function gerakDikurangi(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Angka yang berhitung dari nilai lama ke nilai baru saat filter berubah (bukan saat halaman dibuka,
 * supaya angka awal dari server langsung benar). Mulai dari angka yang sedang tampil, jadi perubahan
 * beruntun tidak meloncat.
 */
export function useAngkaNaik(target: number, durasi = 600): number {
  const [tampil, setTampil] = useState(target);
  const sekarang = useRef(target);

  useEffect(() => {
    const dari = sekarang.current;
    if (dari === target) return;
    if (gerakDikurangi()) {
      const id = requestAnimationFrame(() => {
        sekarang.current = target;
        setTampil(target);
      });
      return () => cancelAnimationFrame(id);
    }
    const mulai = performance.now();
    let id = 0;
    const langkah = (t: number) => {
      const p = Math.min((t - mulai) / durasi, 1);
      const e = 1 - (1 - p) ** 4;
      const v = dari + (target - dari) * e;
      sekarang.current = v;
      setTampil(v);
      if (p < 1) id = requestAnimationFrame(langkah);
    };
    id = requestAnimationFrame(langkah);
    return () => cancelAnimationFrame(id);
  }, [target, durasi]);

  return tampil;
}

/**
 * Pemilih segmen dengan penanda yang bergeser (pola segmented control). Tombol asli dengan aria-pressed;
 * penanda hanya hiasan.
 */
export function Segmen<T extends string>({
  label,
  pilihan,
  nilai,
  onPilih,
}: {
  label: string;
  pilihan: { nilai: T; label: string }[];
  nilai: T;
  onPilih: (v: T) => void;
}) {
  const i = Math.max(
    0,
    pilihan.findIndex((p) => p.nilai === nilai),
  );
  return (
    <div role="group" aria-label={label} className="relative grid w-full rounded-full border border-line bg-surface-2 p-1 sm:inline-grid sm:w-auto" style={{ gridTemplateColumns: `repeat(${pilihan.length}, minmax(0, 1fr))` }}>
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-full bg-ink shadow-card transition-transform duration-500 [transition-timing-function:var(--pegas)]"
        style={{ width: `calc((100% - 0.5rem) / ${pilihan.length})`, transform: `translateX(${i * 100}%)` }}
      />
      {pilihan.map((p) => {
        const on = p.nilai === nilai;
        return (
          <button
            key={p.nilai}
            type="button"
            aria-pressed={on}
            onClick={() => onPilih(p.nilai)}
            className={`tekan relative z-10 min-h-9 whitespace-nowrap rounded-full px-2 text-xs font-semibold sm:px-3.5 sm:text-sm transition-colors duration-300 ${on ? "text-white" : "text-muted hover:text-ink"}`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

/** Kepala kartu dasbor: judul, keterangan opsional, dan slot kanan (lencana atau tombol). */
export function KepalaKartu({ id, judul, keterangan, kanan }: { id: string; judul: string; keterangan?: ReactNode; kanan?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 id={id} className="font-semibold">
          {judul}
        </h2>
        {keterangan ? <p className="mt-0.5 text-sm text-muted">{keterangan}</p> : null}
      </div>
      {kanan}
    </div>
  );
}

export const kelasKartu = "masuk rounded-panel border border-line bg-surface p-5 shadow-card";
