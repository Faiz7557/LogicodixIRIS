"use client";

import { useRef, type ReactNode } from "react";

/**
 * Kartu yang miring mengikuti kursor (perspektif 3D) dengan kilau lembut di bawah kursor.
 * Hanya untuk penunjuk mouse; sentuhan dan gerak dikurangi tidak memiringkan apa pun.
 * Kembali datar dengan transisi pegas saat kursor keluar.
 */
export function KartuMiring({ children, className = "", tunda = 0 }: { children: ReactNode; className?: string; tunda?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const boleh = () => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div data-muncul="besar" style={{ ["--tunda" as string]: `${tunda}ms` }} className="[perspective:900px]">
      <div
        ref={el}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !boleh() || !el.current) return;
          const b = el.current.getBoundingClientRect();
          const x = (e.clientX - b.left) / b.width;
          const y = (e.clientY - b.top) / b.height;
          el.current.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
          el.current.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
          el.current.style.setProperty("--gx", `${x * 100}%`);
          el.current.style.setProperty("--gy", `${y * 100}%`);
          el.current.style.setProperty("--kilau", "1");
        }}
        onPointerLeave={() => {
          el.current?.style.setProperty("--rx", "0deg");
          el.current?.style.setProperty("--ry", "0deg");
          el.current?.style.setProperty("--kilau", "0");
        }}
        className={`relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-[transform,box-shadow] duration-500 [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transition-timing-function:var(--pegas)] hover:shadow-card ${className}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--kilau,0)] transition-opacity duration-500"
          style={{ background: "radial-gradient(260px circle at var(--gx,50%) var(--gy,50%), rgba(180,67,26,0.09), transparent 70%)" }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
