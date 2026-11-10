import Link from "next/link";
import type { ReactNode } from "react";

// Setiap asumsi punya tautan ke /data (Design Brief §12).
export function AssumptionNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-muted">
      <span className="font-semibold">Asumsi:</span> {children}{" "}
      <Link href="/data" className="text-water underline underline-offset-2">
        Lihat Data dan Asumsi
      </Link>
    </p>
  );
}
