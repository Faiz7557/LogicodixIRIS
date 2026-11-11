"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Teks yang diketik huruf demi huruf saat masuk layar, lalu dihapus dan diketik ulang bergantian
 * (contoh pencarian di kartu Paparan). Hiasan: `aria-hidden` di pemanggil. Gerak dikurangi: teks pertama diam.
 */
export function KetikSendiri({ daftar, awalan = "" }: { daftar: string[]; awalan?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const [teks, setTeks] = useState(daftar[0]);

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setTimeout>;
    let hidup = true;
    const jalan = (i: number, n: number, hapus: boolean) => {
      if (!hidup) return;
      const kata = daftar[i % daftar.length];
      setTeks(kata.slice(0, n));
      if (!hapus && n < kata.length) t = setTimeout(() => jalan(i, n + 1, false), 70 + Math.random() * 60);
      else if (!hapus) t = setTimeout(() => jalan(i, n, true), 1600);
      else if (n > 0) t = setTimeout(() => jalan(i, n - 1, true), 35);
      else t = setTimeout(() => jalan(i + 1, 0, false), 300);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      jalan(0, 0, false);
    });
    io.observe(node);
    return () => {
      hidup = false;
      clearTimeout(t);
      io.disconnect();
    };
  }, [daftar]);

  return (
    <span ref={el}>
      {awalan}
      <span className="text-ink">{teks}</span>
      <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.15em] animate-pulse bg-ink" />
    </span>
  );
}
