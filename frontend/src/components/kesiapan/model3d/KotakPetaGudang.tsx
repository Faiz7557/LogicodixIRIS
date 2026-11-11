"use client";

import dynamic from "next/dynamic";

/* Pemuat malas peta gudang: Three.js hanya diunduh di halaman Kesiapan dan tidak dirender di server (butuh WebGL). */
export const KotakPetaGudang = dynamic(() => import("./PetaGudang"), {
  ssr: false,
  loading: () => (
    <div role="status" className="flex h-[440px] items-center justify-center rounded-panel border border-line bg-[#dde7c6] text-sm text-muted md:h-[540px]">
      Memuat peta gudang…
    </div>
  ),
});
