"use client";

import { useEffect, useRef, useState } from "react";

const AWAL = 56.7;
const AKHIR = 63.3;
const fmt = (n: number) => n.toFixed(1).replace(".", ",");

/**
 * Skor contoh data uji yang berhitung dari 56,7 ke 63,3 saat masuk layar, dengan bilah tipis
 * yang memanjang. Nilai akhir sudah ada di HTML; gerak dikurangi: langsung nilai akhir.
 */
export function SkorContoh() {
  const el = useRef<HTMLDivElement>(null);
  const [nilai, setNilai] = useState(AKHIR);

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const mulai = performance.now() + 500;
        const langkah = (t: number) => {
          const p = Math.min(Math.max((t - mulai) / 1400, 0), 1);
          setNilai(AWAL + (AKHIR - AWAL) * (1 - (1 - p) ** 3));
          if (p < 1) id = requestAnimationFrame(langkah);
        };
        setNilai(AWAL);
        id = requestAnimationFrame(langkah);
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(id);
    };
  }, []);

  const naik = (nilai - AWAL) / (AKHIR - AWAL);
  return (
    <div ref={el} className="rounded-xl bg-paper px-4 py-3 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">Contoh data uji</p>
      <p className="tabular text-3xl font-bold" aria-label={`Skor dari ${fmt(AWAL)} menjadi ${fmt(AKHIR)}`}>
        <span className="text-muted">{fmt(AWAL)}</span> <span aria-hidden="true">→</span> <span aria-hidden="true">{fmt(nilai)}</span>
      </p>
      <span aria-hidden="true" className="mx-auto mt-1 block h-1 w-full max-w-[11rem] overflow-hidden rounded-full bg-line">
        <span className="block h-full rounded-full bg-ember" style={{ width: `${AWAL + naik * (AKHIR - AWAL)}%` }} />
      </span>
      <p className="mt-1 text-xs text-muted">pagu Rp15.000.000, 2 selang</p>
    </div>
  );
}
