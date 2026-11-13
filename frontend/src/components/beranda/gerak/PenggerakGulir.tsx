"use client";

import { useEffect } from "react";

/*
 * Satu penggerak scroll untuk seluruh beranda (satu loop rAF, tanpa pustaka).
 * - `[data-muncul]`: diberi `data-terlihat` saat masuk layar (IntersectionObserver), CSS yang menganimasikan.
 * - `[data-gulir]`: diberi variabel CSS `--p` 0..1 menurut posisinya di layar:
 *     "lewat"  = dari mulai masuk bawah layar sampai keluar atas,
 *     "masuk"  = dari mulai masuk sampai bagian atasnya di tengah layar,
 *     "keluar" = dari menempel di atas layar sampai seluruhnya keluar.
 * Kelas `gerak-siap` di <html> menandai JS aktif; tanpa itu (atau saat gerak dikurangi) semua isi tampil biasa.
 */
export function PenggerakGulir() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const akar = document.documentElement;
    akar.classList.add("gerak-siap");

    const io = new IntersectionObserver(
      (masuk) => {
        for (const e of masuk) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-terlihat", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-muncul]").forEach((el) => io.observe(el));
    // Isi yang baru dirender belakangan (layar interaktif, mis. papan Keputusan) ikut diamati,
    // supaya tidak tertahan tak terlihat.
    const mo = new MutationObserver((ubah) => {
      for (const u of ubah) {
        u.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-muncul]:not([data-terlihat])")) io.observe(n);
          n.querySelectorAll("[data-muncul]:not([data-terlihat])").forEach((el) => io.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const elemen = Array.from(document.querySelectorAll<HTMLElement>("[data-gulir]"));
    let id = 0;
    const hitung = () => {
      id = 0;
      const vh = window.innerHeight;
      for (const el of elemen) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue; // jauh dari layar: lewati
        const jenis = el.dataset.gulir;
        let p: number;
        if (jenis === "masuk") p = (vh - r.top) / (vh * 0.55);
        else if (jenis === "keluar") p = -r.top / Math.max(r.height, 1);
        else p = (vh - r.top) / (vh + r.height);
        el.style.setProperty("--p", Math.min(Math.max(p, 0), 1).toFixed(4));
      }
    };
    const minta = () => {
      if (!id) id = requestAnimationFrame(hitung);
    };
    hitung();
    window.addEventListener("scroll", minta, { passive: true });
    window.addEventListener("resize", minta);
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", minta);
      window.removeEventListener("resize", minta);
      akar.classList.remove("gerak-siap");
    };
  }, []);
  return null;
}
