import Link from "next/link";
import type { ReactNode } from "react";

// Setiap asumsi punya tautan ke /data (Design Brief v2 §7, §12). Label: "Asumsi tim".
export function AssumptionNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-muted">
      <span className="font-medium text-ink">Asumsi tim:</span> {children}{" "}
      <Link href="/data" className="inline-flex min-h-11 items-center text-water underline underline-offset-2 hover:text-ink">
        Lihat Data dan Asumsi
      </Link>
    </p>
  );
}
