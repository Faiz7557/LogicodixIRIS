import type { ReactNode } from "react";

/**
 * Kepala layar: judul, satu kalimat kesimpulan, lalu aksi (Design Brief §1, §12).
 * Aksi di kanan pada layar lebar, di bawah judul pada HP.
 */
export function PageHead({ judul, jawaban, aksi }: { judul: ReactNode; jawaban?: ReactNode; aksi?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[28px]">{judul}</h1>
        {jawaban ? <p className="mt-2 max-w-[65ch] text-base text-muted">{jawaban}</p> : null}
      </div>
      {aksi ? <div className="flex shrink-0 flex-wrap gap-2">{aksi}</div> : null}
    </header>
  );
}
