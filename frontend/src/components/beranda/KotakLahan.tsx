"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

/*
 * Pemuat malas hero 3D: Three.js hanya diunduh di beranda, tidak dirender di server.
 * Selama memuat (atau bila WebGL tak ada) latar kontur SVG tetap tampil; setelah gambar 3D pertama
 * siap, latar SVG memudar dan kanvas muncul.
 */
const LahanSatelit = dynamic(() => import("./LahanSatelit"), { ssr: false });

export function KotakLahan() {
  const wadah = useRef<HTMLDivElement>(null);
  const [siap, setSiap] = useState(false);
  const onSiap = useCallback(() => {
    setSiap(true);
    wadah.current?.closest("section")?.setAttribute("data-lahan", "aktif");
  }, []);
  return (
    <div ref={wadah} className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${siap ? "opacity-100" : "opacity-0"}`}>
      <LahanSatelit onSiap={onSiap} />
    </div>
  );
}
