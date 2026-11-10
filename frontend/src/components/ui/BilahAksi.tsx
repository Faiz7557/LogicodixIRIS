import type { ReactNode } from "react";

/**
 * Bilah aksi menempel di bawah layar (di atas navigasi bawah pada HP).
 * Selalu memuat satu kalimat status dan satu aksi utama, supaya pengguna tahu keadaan tanpa menggulir.
 */
export function BilahAksi({
  teks,
  ragam = "normal",
  children,
}: {
  teks: string;
  ragam?: "normal" | "galat" | "ok";
  children: ReactNode;
}) {
  const warna = ragam === "galat" ? "text-danger font-semibold" : ragam === "ok" ? "text-ok font-semibold" : "text-muted";
  return (
    <div className="no-print fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-surface md:sticky md:bottom-0">
      <div className="mx-auto flex max-w-[720px] items-center gap-3 px-4 py-2">
        <p aria-live="polite" className={`flex-1 text-sm leading-snug ${warna}`}>
          {teks}
        </p>
        {children}
      </div>
    </div>
  );
}

export const kelasAksiUtama =
  "flex min-h-11 shrink-0 items-center justify-center rounded-card bg-ember px-5 font-semibold text-white";
