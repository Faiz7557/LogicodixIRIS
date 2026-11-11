"use client";

import { useRef, type ReactNode } from "react";

/**
 * Kartu peran dengan sorotan cahaya yang mengikuti kursor (gradien radial) dan tepi yang ikut menyala
 * di dekat kursor. Masuk dari arah yang berbeda per kartu (`arah`), lewat atribut `data-muncul`.
 */
export function KartuSorot({ children, arah, tunda = 0 }: { children: ReactNode; arah: "kiri" | "bawah" | "kanan"; tunda?: number }) {
  const el = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={el}
      data-muncul={arah === "bawah" ? "" : arah}
      style={{ ["--tunda" as string]: `${tunda}ms` }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !el.current) return;
        const b = el.current.getBoundingClientRect();
        el.current.style.setProperty("--sx", `${e.clientX - b.left}px`);
        el.current.style.setProperty("--sy", `${e.clientY - b.top}px`);
      }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-shadow duration-300 hover:shadow-card"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--sx,50%) var(--sy,50%), rgba(180,67,26,0.10), transparent 65%)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: 1,
          background: "radial-gradient(180px circle at var(--sx,50%) var(--sy,50%), rgba(180,67,26,0.55), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative">{children}</div>
    </li>
  );
}
