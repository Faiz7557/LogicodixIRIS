"use client";

import { useRef, useState } from "react";
import { kelasKartu } from "@/components/paparan/dasbor/dasar";

const AWAL = 2012;
const AKHIR = 2026;
const N = AKHIR - AWAL + 1;

/** Posisi garis beku (0..1) untuk tahun uji: tepat sebelum kolom tahun itu. */
const posisi = (tahunUji: number) => (tahunUji - AWAL) / N;

/** Proyeksi momentum ala Apple (Designing Fluid Interfaces): ke mana seretan akan berhenti. */
const proyeksi = (v: number, d = 0.99) => ((v / 1000) * d) / (1 - d);

/** Hambatan karet di luar batas: makin jauh, makin berat. */
const karet = (lewat: number, ukuran: number, c = 0.55) => (lewat * ukuran * c) / (ukuran + c * Math.abs(lewat));

/**
 * Garis waktu beku: unsur khas Time Machine. Tahun sebelum garis = pengetahuan yang dipakai,
 * tahun uji = yang ditebak, sesudahnya disembunyikan (berembun). Garis bisa diseret: mengikuti jari 1:1,
 * lalu mendarat di tahun uji terdekat dari titik proyeksi momentum. Juga slider untuk keyboard
 * (panah kiri/kanan), dan chip tahun uji bisa diklik.
 */
export function GarisWaktuBeku({ tahunUji, pilihan, onPilih }: { tahunUji: number; pilihan: number[]; onPilih: (t: number) => void }) {
  const jalur = useRef<HTMLDivElement>(null);
  const riwayat = useRef<{ x: number; t: number }[]>([]);
  const [seret, setSeret] = useState<number | null>(null);
  const beku = tahunUji - 1;
  const f = seret ?? posisi(tahunUji);
  const iPilih = pilihan.indexOf(tahunUji);

  function keFraksi(clientX: number) {
    const b = jalur.current!.getBoundingClientRect();
    const mentah = (clientX - b.left) / b.width;
    const min = posisi(pilihan[0]);
    const max = posisi(pilihan[pilihan.length - 1]);
    if (mentah < min) return min - karet(min - mentah, 1);
    if (mentah > max) return max + karet(mentah - max, 1);
    return mentah;
  }

  function lepas(e: React.PointerEvent) {
    if (seret === null) return;
    const h = riwayat.current;
    const a = h[0];
    const z = h[h.length - 1];
    const v = a && z && z.t > a.t ? ((z.x - a.x) / (z.t - a.t)) * 1000 : 0; // px/s
    const lebar = jalur.current!.getBoundingClientRect().width;
    const tuju = seret + proyeksi(v) / lebar;
    const terdekat = pilihan.reduce((p, t) => (Math.abs(posisi(t) - tuju) < Math.abs(posisi(p) - tuju) ? t : p), pilihan[0]);
    setSeret(null);
    onPilih(terdekat);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  return (
    <section aria-labelledby="garis-beku" className={kelasKartu}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="garis-beku" className="font-semibold">
            Garis waktu beku
          </h2>
          <p className="mt-0.5 text-sm text-muted">Seret garis beku atau pilih tahun uji. Data sesudah garis disembunyikan saat peringkat disusun.</p>
        </div>
        <div role="group" aria-label="Tahun uji" className="flex flex-wrap gap-1.5">
          {pilihan.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === tahunUji}
              onClick={() => onPilih(t)}
              className={`tekan min-h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors duration-300 ${
                t === tahunUji ? "border-ink bg-ink text-white" : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              Uji {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-8 select-none">
        {/* Jalur tahun */}
        <div ref={jalur} className="relative flex gap-1">
          {Array.from({ length: N }, (_, i) => {
            const th = AWAL + i;
            const masaLalu = th <= (seret === null ? beku : AWAL + Math.floor(f * N) - 1);
            const diuji = seret === null && th === tahunUji;
            return (
              <div
                key={th}
                className={`relative flex h-14 min-w-0 flex-1 flex-col items-center justify-end rounded-lg pb-1.5 transition-[background-color,opacity,filter] duration-500 ${
                  diuji
                    ? "bg-ember-soft ring-2 ring-ember"
                    : masaLalu
                      ? "bg-surface-2"
                      : "arsir-abu opacity-60 blur-[0.5px]"
                }`}
              >
                {diuji ? <span className="absolute -top-2.5 rounded-full bg-ember px-1.5 text-[10px] font-semibold text-white">diuji</span> : null}
                <span className={`tabular text-[11px] ${diuji ? "font-semibold text-ember" : masaLalu ? "text-ink" : "text-muted"}`}>
                  <span className="md:hidden">&apos;{String(th).slice(2)}</span>
                  <span className="hidden md:inline">{th}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Garis beku yang bisa diseret */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Garis beku"
          aria-valuemin={pilihan[0]}
          aria-valuemax={pilihan[pilihan.length - 1]}
          aria-valuenow={tahunUji}
          aria-valuetext={`Data dibekukan 31 Desember ${beku}, menguji ${tahunUji}`}
          onKeyDown={(e) => {
            const arah = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
            if (!arah) return;
            e.preventDefault();
            onPilih(pilihan[Math.min(Math.max(iPilih + arah, 0), pilihan.length - 1)]);
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            riwayat.current = [{ x: e.clientX, t: e.timeStamp }];
            setSeret(keFraksi(e.clientX));
          }}
          onPointerMove={(e) => {
            if (seret === null) return;
            riwayat.current = [...riwayat.current, { x: e.clientX, t: e.timeStamp }].slice(-5);
            setSeret(keFraksi(e.clientX));
          }}
          onPointerUp={lepas}
          onPointerCancel={lepas}
          className={`group absolute -bottom-2 -top-7 z-10 flex w-11 -translate-x-1/2 cursor-grab touch-none flex-col items-center outline-none active:cursor-grabbing ${
            seret === null ? "transition-[left] duration-700 [transition-timing-function:var(--pegas)]" : ""
          }`}
          style={{ left: `calc(${f * 100}% - 2px)` }}
        >
          <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white shadow-card transition-transform group-active:scale-95 group-focus-visible:ring-2 group-focus-visible:ring-ember">
            <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 2v20M4.9 6l14.2 12M19.1 6 4.9 18M9 3.5 12 6l3-2.5M9 20.5 12 18l3 2.5" />
            </svg>
            Beku
          </span>
          <span className="mt-0.5 w-0.5 flex-1 rounded-full bg-ink" />
        </div>
      </div>

      <p aria-live="polite" className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3 rounded-sm bg-surface-2 ring-1 ring-line" /> Dipakai: {AWAL}–{beku}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3 rounded-sm bg-ember-soft ring-1 ring-ember" /> Ditebak: {tahunUji}
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted">
          <span aria-hidden="true" className="arsir-abu size-3 rounded-sm" /> Disembunyikan
        </span>
        <span className="font-semibold">Pengetahuan dibekukan 31 Desember {beku}.</span>
      </p>
    </section>
  );
}
