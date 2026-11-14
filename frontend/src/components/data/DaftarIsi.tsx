"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Daftar isi halaman Sumber dan batasan yang menempel di atas. Bagian yang sedang dibaca ditandai
 * (pil gelap) dan pilnya digeser ke tengah bila daftar terpotong di HP. Tanpa JS tetap jadi tautan biasa.
 */
export function DaftarIsi({ isi }: { isi: readonly (readonly [string, string])[] }) {
  const [aktif, setAktif] = useState<string | null>(null);
  const daftar = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const terlihat = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (masuk) => {
        for (const e of masuk) terlihat.set(e.target.id, e.isIntersecting);
        // Bagian pertama (urut halaman) yang sedang melewati pita tengah layar.
        const pertama = isi.find(([id]) => terlihat.get(id));
        if (pertama) setAktif(pertama[0]);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const [id] of isi) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [isi]);

  useEffect(() => {
    if (!aktif) return;
    const pil = daftar.current?.querySelector<HTMLElement>(`a[href="#${aktif}"]`);
    pil?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [aktif]);

  return (
    <nav aria-label="Daftar isi" className="sticky top-0 z-10 -mx-4 mt-4 overflow-x-auto [scrollbar-width:none] bg-paper/95 px-4 py-2 backdrop-blur md:mx-0 md:px-0">
      <ul ref={daftar} className="flex gap-2 md:flex-wrap">
        {isi.map(([id, label], i) => {
          const on = aktif === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? "location" : undefined}
                className={`flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors duration-300 ${
                  on ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink"
                }`}
              >
                <span aria-hidden="true" className={`tabular text-xs ${on ? "text-white/70" : "text-muted"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
