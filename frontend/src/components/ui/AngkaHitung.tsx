"use client";

import { useEffect, useRef, useState } from "react";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";

type Jenis = "angka" | "skor" | "persen" | "rupiah";

const FORMAT: Record<Jenis, (n: number) => string> = {
  angka: (n) => formatAngka(Math.round(n)),
  skor: (n) => formatSkor(Math.round(n * 10) / 10),
  persen: (n) => `${Math.round(n)}%`,
  rupiah: (n) => formatRupiah(Math.round(n / 1000) * 1000),
};

/**
 * Angka yang menghitung naik dari 0 saat pertama terlihat di layar.
 * HTML awal sudah berisi angka akhir (tanpa JS tetap benar), dan pembaca layar selalu membaca angka akhir.
 * Saat gerak dikurangi, angka langsung tampil tanpa hitungan.
 */
export function AngkaHitung({ nilai, jenis = "angka", durasi = 1100, tunda = 0 }: { nilai: number; jenis?: Jenis; durasi?: number; tunda?: number }) {
  const [tampil, setTampil] = useState(nilai);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || nilai === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = requestAnimationFrame(() => setTampil(0));
    let jeda: ReturnType<typeof setTimeout> | undefined;
    let pengaman: ReturnType<typeof setTimeout> | undefined;
    const mulaiHitung = () => {
      // Tab di latar menunda requestAnimationFrame: angka akhir tetap dipasang setelah durasinya lewat.
      pengaman = setTimeout(() => {
        cancelAnimationFrame(id);
        setTampil(nilai);
      }, durasi + 80);
      const mulai = performance.now();
      const langkah = (t: number) => {
        const p = Math.min((t - mulai) / durasi, 1);
        setTampil(nilai * (1 - (1 - p) ** 4));
        if (p < 1) id = requestAnimationFrame(langkah);
      };
      id = requestAnimationFrame(langkah);
    };
    const io = new IntersectionObserver(
      (masuk) => {
        if (!masuk.some((e) => e.isIntersecting)) return;
        io.disconnect();
        jeda = setTimeout(mulaiHitung, tunda);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(id);
      clearTimeout(jeda);
      clearTimeout(pengaman);
    };
  }, [nilai, durasi, tunda]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{FORMAT[jenis](tampil)}</span>
      <span className="sr-only">{FORMAT[jenis](nilai)}</span>
    </span>
  );
}
