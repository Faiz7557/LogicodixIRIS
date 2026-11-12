import Link from "next/link";

const LANGKAH = [
  { judul: "Pagu", pendek: "Pagu", href: (k: string) => `/desa/${k}/prioritas/pagu` },
  { judul: "Putuskan saran", pendek: "Keputusan", href: (k: string) => `/desa/${k}/prioritas` },
  { judul: "Terbitkan usulan", pendek: "Usulan", href: (k: string) => `/desa/${k}/usulan` },
] as const;

/**
 * Kepala layar Pagu dan Keputusan: penunjuk tiga langkah (pola Sparekit), judul,
 * kalimat ringkas yang ikut berubah, dan galat. Tiap langkah memuat satu kalimat keadaan terkini.
 */
export function KepalaPrioritas({
  kode,
  namaDesa,
  aktif,
  ringkas,
  judul,
  kalimat,
  menghitung,
  galat,
}: {
  kode: string;
  namaDesa: string;
  aktif: 1 | 2 | 3;
  /** Satu kalimat keadaan untuk tiap langkah, urut 1 sampai 3. */
  ringkas: [string, string, string];
  judul: string;
  kalimat: string;
  menghitung: boolean;
  galat: string | null;
}) {
  return (
    <>
      <nav aria-label="Langkah prioritas belanja">
        <ol className="grid grid-cols-3 gap-2 md:gap-3">
          {LANGKAH.map((l, i) => {
            const n = i + 1;
            const on = n === aktif;
            return (
              <li key={l.judul} className="min-w-0">
                <Link
                  href={l.href(kode)}
                  aria-current={on ? "step" : undefined}
                  className={`group flex h-full flex-col items-start gap-1.5 rounded-xl md:flex-row md:items-center border bg-surface px-2.5 py-2.5 md:gap-3 md:px-4 md:py-3 ${
                    on ? "border-ink shadow-card" : "border-line hover:border-line-2"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`tabular flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold md:size-7 md:text-sm ${
                      on ? "bg-ink text-white" : "bg-paper text-ink"
                    }`}
                  >
                    {n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold md:text-sm">
                      <span className="sr-only">Langkah {n}: </span>
                      <span className="md:hidden">{l.pendek}</span>
                      <span className="hidden md:inline">{l.judul}</span>
                    </span>
                    <span className="hidden truncate text-xs text-muted md:block">{ringkas[i]}</span>
                  </span>
                  {!on ? (
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="hidden shrink-0 text-muted transition-transform group-hover:translate-x-0.5 md:block">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-semibold text-ember">Prioritas belanja · {namaDesa}</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{judul}</h1>
        <p aria-live="polite" className="mt-2 max-w-[70ch] text-lg font-semibold leading-snug">
          {kalimat}
        </p>
        <p aria-live="polite" className="mt-1 min-h-5 text-sm font-semibold text-muted">
          {menghitung ? "Menghitung…" : ""}
        </p>
      </header>

      {galat ? (
        <p role="alert" className="mt-2 rounded-card border border-danger/40 bg-surface px-4 py-3 text-sm font-semibold text-danger">
          {galat}
        </p>
      ) : null}
    </>
  );
}
