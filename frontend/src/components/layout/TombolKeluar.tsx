"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-client";

/** Keluar dari sesi: POST /api/auth/keluar, lalu kembali ke Beranda. */
export function TombolKeluar({ className, ikon }: { className?: string; ikon?: React.ReactNode }) {
  const router = useRouter();
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={sibuk}
        onClick={async () => {
          setSibuk(true);
          setGalat(null);
          try {
            await api<void>("/api/auth/keluar", { method: "POST" });
            router.replace("/");
            router.refresh();
          } catch (e) {
            setGalat(e instanceof Error ? e.message : "Gagal keluar. Coba lagi.");
            setSibuk(false);
          }
        }}
        className={className}
      >
        {ikon}
        {sibuk ? "Keluar…" : "Keluar"}
      </button>
      {galat ? (
        <span role="alert" className="block text-sm text-danger">
          {galat}
        </span>
      ) : null}
    </>
  );
}
