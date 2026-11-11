"use client";

import { useEffect, useRef, useState } from "react";

type Langkah = { judul: string; isi: string };

/**
 * Lima langkah dengan rel kemajuan yang terisi mengikuti scroll: tiap langkah menyala saat rel
 * mencapainya (nomor berubah ember, kartu sedikit terangkat). Di layar lebar rel mendatar di atas kartu,
 * di HP rel tegak di kiri. Tanpa JS atau gerak dikurangi: semua langkah tampil menyala.
 */
export function LangkahGulir({ langkah }: { langkah: readonly Langkah[] }) {
  const el = useRef<HTMLOListElement>(null);
  const [aktif, setAktif] = useState(langkah.length);
  const [gerak, setGerak] = useState(false);

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    let lama = -1;
    const hitung = () => {
      id = 0;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // Mulai saat daftar di 85% layar, penuh saat ujung bawahnya di 45% layar
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0), 1);
      node.style.setProperty("--p", p.toFixed(4));
      const n = Math.min(Math.floor(p * (langkah.length + 0.6)), langkah.length);
      if (n !== lama) {
        lama = n;
        setAktif(n);
      }
    };
    const minta = () => {
      if (!id) id = requestAnimationFrame(hitung);
    };
    setGerak(true);
    hitung();
    window.addEventListener("scroll", minta, { passive: true });
    window.addEventListener("resize", minta);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", minta);
      window.removeEventListener("resize", minta);
    };
  }, [langkah.length]);

  return (
    <ol ref={el} className="relative mt-8 grid gap-3 pl-6 md:grid-cols-5 md:pl-0 md:pt-6">
      {/* Rel: tegak di HP, mendatar di layar lebar */}
      <span aria-hidden="true" className="absolute bottom-6 left-[9px] top-6 w-[3px] rounded-full bg-line md:inset-x-6 md:bottom-auto md:left-6 md:top-0 md:h-[3px] md:w-auto">
        <span className={`block size-full origin-top rounded-full bg-ember md:origin-left ${gerak ? "rel-isi" : ""}`} />
      </span>
      {langkah.map((l, i) => {
        const nyala = i < aktif;
        return (
          <li
            key={l.judul}
            className={`relative rounded-2xl border bg-paper p-4 transition-[transform,border-color,box-shadow] duration-500 [transition-timing-function:var(--pegas)] ${
              nyala ? "-translate-y-1 border-ember/30 shadow-card" : "border-line"
            }`}
          >
            <span
              aria-hidden="true"
              className={`tabular flex size-9 items-center justify-center rounded-full text-sm font-bold text-white transition-[background-color,transform] duration-500 [transition-timing-function:var(--pegas)] ${
                nyala ? "scale-110 bg-ember" : "bg-ink"
              }`}
            >
              {i + 1}
            </span>
            <h3 className="mt-3 font-bold">{l.judul}</h3>
            <p className="mt-1 text-sm text-muted">{l.isi}</p>
          </li>
        );
      })}
    </ol>
  );
}
