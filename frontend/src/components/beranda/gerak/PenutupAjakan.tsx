"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Penutup beranda: panel gelap yang melebar dari bentuk kartu menjadi selebar layar saat masuk
 * (clip-path dari `--p`, lihat PenggerakGulir), bara halus yang melayang naik dan menghindar dari kursor
 * (kanvas 2D ringan), dan tombol `[data-magnet]` yang tertarik sedikit ke arah kursor lalu kembali
 * dengan pegas. Kanvas berhenti saat tidak terlihat; gerak dikurangi: tanpa bara dan tanpa magnet.
 */
export function PenutupAjakan({ children }: { children: ReactNode }) {
  const wadah = useRef<HTMLDivElement>(null);
  const kanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wadah.current;
    const cv = kanvas.current;
    if (!el || !cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    const ukur = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ukur();
    const ro = new ResizeObserver(ukur);
    ro.observe(el);

    const n = w < 640 ? 26 : 54;
    const bara = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: 8 + Math.random() * 18,
      r: 0.8 + Math.random() * 2.2,
      f: Math.random() * Math.PI * 2,
      dx: 0,
    }));
    const kursor = { x: -999, y: -999 };

    // Magnet: tombol mendekat ke kursor dalam radius tertentu
    const magnet = Array.from(el.querySelectorAll<HTMLElement>("[data-magnet]"));
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      kursor.x = e.clientX - b.left;
      kursor.y = e.clientY - b.top;
      if (e.pointerType !== "mouse") return;
      for (const m of magnet) {
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        const k = d < 120 ? (1 - d / 120) * 0.35 : 0;
        m.style.transform = `translate3d(${dx * k}px, ${dy * k}px, 0)`;
      }
    };
    const onLeave = () => {
      kursor.x = kursor.y = -999;
      for (const m of magnet) m.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    let terlihat = false;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting));
    io.observe(el);

    let id = 0;
    let lalu = performance.now();
    const jalan = (t: number) => {
      id = requestAnimationFrame(jalan);
      const dt = Math.min((t - lalu) / 1000, 0.05);
      lalu = t;
      if (!terlihat) return;
      ctx.clearRect(0, 0, w, h);
      for (const b of bara) {
        b.y -= b.v * dt;
        b.f += dt;
        // Menghindar dari kursor: dorongan mendatar yang meluruh
        const dk = Math.hypot(b.x - kursor.x, b.y - kursor.y);
        if (dk < 110) b.dx += ((b.x - kursor.x) / (dk || 1)) * (110 - dk) * 0.9 * dt;
        b.dx *= 0.94;
        b.x += Math.sin(b.f) * 6 * dt + b.dx;
        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }
        const a = Math.min(1, b.y / h) * 0.7;
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 138, 60, ${a})`;
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    id = requestAnimationFrame(jalan);

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div data-gulir="masuk" className="bg-paper">
      <div ref={wadah} className="tirai relative overflow-hidden bg-ink text-white">
        <canvas ref={kanvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#b4431a]/25 to-transparent" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
