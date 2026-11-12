"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Satu angka cakupan: berhitung dari 0 saat masuk layar, dengan bilah mini satu ruas per satuan
 * yang menyala bergantian (15 tahun = 15 ruas). Angka akhir sudah ada di HTML sejak awal, jadi tanpa JS
 * atau saat gerak dikurangi yang tampil langsung angka sebenarnya.
 */
export function AngkaGulir({ angka, label, keterangan, urutan }: { angka: number; label: string; keterangan: string; urutan: number }) {
  const el = useRef<HTMLDivElement>(null);
  const [tampil, setTampil] = useState(angka);
  const [nyala, setNyala] = useState(angka);

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const mulai = performance.now() + urutan * 140;
        const durasi = 900 + angka * 40;
        const langkah = (t: number) => {
          const p = Math.min(Math.max((t - mulai) / durasi, 0), 1);
          const e2 = 1 - (1 - p) ** 3;
          setTampil(Math.round(angka * e2));
          setNyala(angka * e2);
          if (p < 1) id = requestAnimationFrame(langkah);
        };
        setTampil(0);
        setNyala(0);
        id = requestAnimationFrame(langkah);
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(id);
    };
  }, [angka, urutan]);

  return (
    <div ref={el} className="group">
      <dt className="sr-only">{keterangan}</dt>
      <dd>
        <span className="tabular text-4xl font-semibold tracking-tight" aria-hidden="true">
          {tampil}
        </span>
        <span className="sr-only">{angka}</span>
        <span className="ml-1.5 text-sm font-semibold uppercase tracking-wide text-muted">{label}</span>
        <span aria-hidden="true" className="mt-2 flex h-1.5 gap-[3px]">
          {Array.from({ length: angka }, (_, i) => (
            <span
              key={i}
              className={`h-full flex-1 rounded-full transition-[background-color,transform] duration-300 group-hover:scale-y-150 ${
                i < Math.round(nyala) ? "bg-ember" : "bg-line"
              }`}
              style={{ transitionDelay: `${i * 12}ms`, maxWidth: angka > 6 ? undefined : "2.25rem" }}
            />
          ))}
        </span>
        <span className="mt-2 block text-sm leading-snug text-muted" aria-hidden="true">
          {keterangan}
        </span>
      </dd>
    </div>
  );
}
