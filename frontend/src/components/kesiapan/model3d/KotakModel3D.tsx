"use client";

import dynamic from "next/dynamic";

/*
 * Pemuat malas penampil 3D: Three.js (sekitar 600 kB) hanya diunduh di halaman item yang punya model,
 * dan tidak ikut dirender di server karena butuh WebGL.
 */
const PenampilPompa = dynamic(() => import("./PenampilPompa"), {
  ssr: false,
  loading: () => (
    <div role="status" className="flex min-h-[300px] flex-1 items-center justify-center text-sm text-muted lg:min-h-[400px]">
      Memuat model 3D…
    </div>
  ),
});

export function KotakModel3D({ kode, nama }: { kode: string; nama: string }) {
  if (kode === "pompa_jinjing") return <PenampilPompa nama={nama} />;
  return null;
}
