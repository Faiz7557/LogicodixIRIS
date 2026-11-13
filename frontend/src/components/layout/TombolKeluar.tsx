"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { api } from "@/lib/api-client";

/** Keluar dari sesi: POST /api/auth/keluar, lalu kembali ke Beranda. */
export function TombolKeluar({ className, ikon }: { className?: string; ikon?: React.ReactNode }) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [galat, setGalat] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        disabled={sibuk}
        onClick={() => {
          setGalat(null);
          mulai(async () => {
            try {
              await api<void>("/api/auth/keluar", { method: "POST" });
              router.refresh();
              router.replace("/");
            } catch (e) {
              setGalat(e instanceof Error ? e.message : "Gagal keluar. Coba lagi.");
            }
          });
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
