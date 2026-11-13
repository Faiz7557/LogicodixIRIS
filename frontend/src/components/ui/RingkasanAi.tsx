"use client";

import { useEffect, useRef, useState } from "react";
import type { HalamanRingkasan, Ringkasan } from "@/lib/types";
import { AiBadge } from "./AiBadge";

type Keadaan = { fase: "diam" } | { fase: "memuat" } | { fase: "galat" } | { fase: "ok"; hasil: Ringkasan };

/**
 * Tombol "Ringkasan AI" satu halaman (plan 09 Task C3). `<details>` bawaan, tanpa pustaka komponen.
 * Permintaan baru dikirim saat pertama kali dibuka. Server menyusun fakta; klien hanya menyebut halaman.
 * Teks dirender sebagai teks biasa.
 */
export function RingkasanAi({ halaman, kode, className = "" }: { halaman: HalamanRingkasan; kode?: string; className?: string }) {
  const [k, setK] = useState<Keadaan>({ fase: "diam" });
  const sedang = useRef(false);
  const kotak = useRef<HTMLDetailsElement>(null);

  async function muat() {
    if (sedang.current) return;
    sedang.current = true;
    setK({ fase: "memuat" });
    try {
      const res = await fetch("/api/ringkasan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(kode ? { halaman, kode } : { halaman }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setK({ fase: "ok", hasil: (await res.json()) as Ringkasan });
    } catch {
      setK({ fase: "galat" });
    } finally {
      sedang.current = false;
    }
  }

  // Dibuka sebelum hidrasi selesai (HP lambat): `onToggle` tidak pernah terpanggil, jadi periksa sekali saat terpasang.
  useEffect(() => {
    if (kotak.current?.open) void muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hanya sekali saat terpasang
  }, []);

  return (
    <details
      ref={kotak}
      className={`group w-full max-w-[640px] rounded-panel border border-line bg-surface shadow-card ${className}`}
      onToggle={(e) => {
        if ((e.currentTarget as HTMLDetailsElement).open && k.fase === "diam") void muat();
      }}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-2 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-water">
          <path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z" />
          <path d="M19 15l.8 2 2 .8-2 .7L19 21l-.8-2.5-2-.7 2-.8z" />
        </svg>
        Ringkasan AI
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-muted transition-transform group-open:rotate-180">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div aria-live="polite" className="border-t border-line px-4 pb-4 pt-3">
        {k.fase === "memuat" || k.fase === "diam" ? (
          <p role="status" className="text-sm text-muted">
            Membaca halaman ini…
          </p>
        ) : k.fase === "galat" ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-danger">Ringkasan belum bisa dibuat. Coba lagi nanti.</p>
            <button
              type="button"
              onClick={() => void muat()}
              className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold hover:bg-paper"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            <p className="font-semibold leading-snug">{k.hasil.judul}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
              {k.hasil.butir.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <div className="mt-3">
              <AiBadge sumber={k.hasil.sumber} model={k.hasil.model} />
            </div>
            <p className="mt-2 text-sm text-muted">Ringkasan dibuat dari angka di halaman ini. Bukan saran resmi.</p>
          </>
        )}
      </div>
    </details>
  );
}
