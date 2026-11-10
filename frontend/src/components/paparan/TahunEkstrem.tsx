import type { DesaTahun } from "@/lib/types";

/**
 * Ringkasan inti Kartu Paparan: satu kartu per tahun kering ekstrem, terdeteksi atau tidak.
 * Status selalu ikon + kata, warna hanya penguat (Design Brief §3).
 */
export function TahunEkstrem({ strip, tahunEkstrem }: { strip: DesaTahun[]; tahunEkstrem: number[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {tahunEkstrem.map((t) => {
        const kena = strip.find((s) => s.tahun === t)?.terpapar ?? false;
        return (
          <li
            key={t}
            className={`flex flex-col gap-2 rounded-xl border px-3 py-3 ${kena ? "border-ember/50 bg-ember-soft" : "border-line bg-paper"}`}
          >
            <span className="tabular text-2xl font-semibold tracking-[-0.03em]">{t}</span>
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${kena ? "text-ember" : "text-muted"}`}>
              {kena ? (
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              ) : (
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              )}
              {kena ? "Terdeteksi" : "Tidak terdeteksi"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
