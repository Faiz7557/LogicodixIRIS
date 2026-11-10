import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatSkor } from "@/lib/format";
import type { Status } from "@/lib/types";

const R = 80;
const LEN = Math.PI * R; // panjang busur setengah lingkaran
const WARNA: Record<Status, string> = {
  siap: "var(--ok)",
  sebagian: "var(--warn)",
  rawan: "var(--danger)",
};

/**
 * Gauge skor kesiapan (Design Brief §7): busur SVG, angka di tengah, status di bawah.
 * Animasi isi 400 ms lewat CSS; mati otomatis pada prefers-reduced-motion (globals.css).
 * Status tampil sebagai ikon + kata, bukan hanya warna.
 */
export function ReadinessGauge({ skor, status }: { skor: number; status: Status }) {
  const pct = Math.min(Math.max(skor, 0), 100);
  const offset = LEN * (1 - pct / 100);

  return (
    <div className="mx-auto flex w-full max-w-[260px] flex-col items-center">
      <div className="relative w-full">
        <svg viewBox="0 0 200 108" className="block w-full" aria-hidden="true" focusable="false">
          <path
            d={`M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R} 100`}
            fill="none"
            stroke="var(--line)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            className="gauge-fill"
            d={`M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R} 100`}
            fill="none"
            stroke={WARNA[status]}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={LEN}
            strokeDashoffset={offset}
            style={{ ["--gauge-len" as string]: LEN }}
          />
        </svg>
        <p className="tabular absolute inset-x-0 bottom-0 text-center text-5xl font-bold leading-none">
          {formatSkor(skor)}
          <span className="sr-only"> dari 100</span>
        </p>
      </div>
      <div className="mt-3">
        <StatusBadge status={status} size="lg" />
      </div>
    </div>
  );
}
